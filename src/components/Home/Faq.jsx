"use client";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function Faq({ faqData, title }) {
  const [faqOpen, setFaqOpen] = useState("");

  const toggleFaqOpen = (id) => {
    setFaqOpen((prevId) => (prevId === id ? "" : id));
  };

  return (
    <section className="px-5 py-10 md:container md:mx-auto md:py-20">
      <h2 className="mb-20 text-center text-3xl font-bold md:text-[2.5rem]">
        Frequently asked questions{" "}
        {title && <span className="text-primary">: {title}</span>}
      </h2>

      {/* FAQ Container */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {faqData.map((faq) => (
          <div key={faq.id}>
            <h4
              onClick={() => toggleFaqOpen(faq.id)}
              className="group flex cursor-pointer items-center justify-between gap-4 rounded-md border border-[#C5D6E0] p-4 text-lg font-medium"
            >
              {faq.que}
              <div
                className={`flex min-h-8 min-w-8 items-center justify-center rounded-full border border-[#C5D6E0] transition-all duration-200 ease-linear group-hover:border-dark ${
                  faqOpen === faq.id && "rotate-45 bg-dark text-custom-white"
                }`}
              >
                <Plus className="text-xl transition-all duration-200 ease-linear" />
              </div>
            </h4>

            <div
              className={`grid overflow-hidden px-4 transition-all duration-300 ease-in-out ${
                faqOpen === faq.id
                  ? "grid-rows-[1fr] pt-4 opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <p className="overflow-hidden">{faq.ans}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
