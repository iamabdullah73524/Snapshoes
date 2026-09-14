import React from "react";

export default function About() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <div className="mb-10">
        <p className="text-xs font-bold uppercase tracking-[0.32em] text-gray-500">
          Our Story
        </p>
        <h1 className="text-4xl font-black text-brand-dark mt-3">
          About SnapShoes
        </h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-8">
        <section className="space-y-4">
          <h2 className="text-2xl font-black uppercase tracking-tight text-brand-dark">
            Who We Are
          </h2>
          <p className="text-gray-600 leading-8">
            Add your brand introduction here. This section is ready for your final About Us content, including your story, mission, and vision for SnapShoes.
          </p>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-brand-gray border border-gray-200 p-6">
            <h3 className="text-lg font-black uppercase tracking-wide text-brand-dark mb-3">
              Our Mission
            </h3>
            <p className="text-gray-600 leading-7">
              Add your mission statement here. This can highlight what makes SnapShoes unique and what values the brand stands for.
            </p>
          </div>

          <div className="rounded-2xl bg-brand-gray border border-gray-200 p-6">
            <h3 className="text-lg font-black uppercase tracking-wide text-brand-dark mb-3">
              Our Promise
            </h3>
            <p className="text-gray-600 leading-7">
              Add your customer promise here, such as quality, comfort, trust, and a better shopping experience.
            </p>
          </div>
        </section>

        <section className="border-t border-gray-200 pt-6">
          <h2 className="text-xl font-black uppercase tracking-wide text-brand-dark mb-4">
            Why Choose SnapShoes?
          </h2>
          <ul className="space-y-3 text-gray-600 list-disc ml-6 leading-7">
            <li>Replace this list with your preferred brand benefits.</li>
            <li>Add your product quality or service highlights here.</li>
            <li>Include delivery, support, or shopping experience points.</li>
            <li>Customize this section with the final copy you want to publish.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}