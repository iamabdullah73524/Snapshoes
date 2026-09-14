const express = require('express');
const router = express.Router();
const { getModel } = require('../config/db');
const { auth, admin } = require('../middleware/auth');

router.get('/overview', auth, admin, async (req, res) => {
  try {
    const Order = getModel('Order');
    const Product = getModel('Product');
    const User = getModel('User');

    const [orders, products, users] = await Promise.all([
      Order.find(),
      Product.find(),
      User.find({}, '-password')
    ]);

    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.totalPrice || 0), 0);
    const lowStockCount = products.filter((product) => Number(product.inventory || 0) <= 5).length;
    const recentOrders = [...orders]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    res.json({
      totals: {
        revenue: totalRevenue,
        orders: orders.length,
        customers: users.length,
        lowStockCount
      },
      recentOrders,
      products,
      users
    });
  } catch (error) {
    console.error('Admin overview error:', error);
    res.status(500).json({ message: 'Error fetching admin overview' });
  }
});

module.exports = router;
