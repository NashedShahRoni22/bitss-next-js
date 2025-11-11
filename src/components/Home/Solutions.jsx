"use client";
import Image from "next/image";
import { useState } from "react";
import { Check } from "lucide-react";
import { tabsData } from "@/data/tabsData";

export default function Solutions() {
  const [activeTab, setActiveTab] = useState(0);
  const handleTabClick = (i) => {
    setActiveTab(i);
  };
  return (
    <section className="w-full px-5 py-10 text-center md:mx-auto md:max-w-7xl md:px-0 md:py-20">
      <h2 className="mb-14 text-center text-3xl font-bold md:text-[2.5rem]">
        Why Bitss is the Ultimate Solution for Website Security
      </h2>
      {/* Mobile Tab Titles */}
      <select
        onChange={(e) => handleTabClick(e.target.value)}
        className="mb-12 w-full rounded bg-[#f2f2f2] px-2 py-2 text-xl md:hidden"
      >
        {tabsData.map((tab, i) => (
          <option key={i} value={i}>
            {tab.title}
          </option>
        ))}
      </select>
      {/* Desktop Tab Titles */}
      <div className="mb-12 hidden items-center justify-center gap-3 rounded-full bg-[#f2f2f2] md:inline-flex">
        {tabsData.map((tab, i) => (
          <button
            key={i}
            className={`cursor-pointer rounded-full px-6 py-1.5 text-center text-xl transition-all duration-200 ease-in-out ${
              activeTab === i
                ? "bg-primary text-custom-white"
                : "hover:text-custom-white hover:bg-[#F83A53]"
            }`}
            onClick={() => handleTabClick(i)}
          >
            {tab.title}
          </button>
        ))}
      </div>
      {/* Tab Content */}
      <div className="text-left">
        <div className="flex flex-col justify-between md:flex-row md:items-center">
          <div className="w-full md:w-1/2">
            <h3 className="mb-4 text-center text-2xl font-medium md:text-left">
              {tabsData[activeTab].subTitle}
            </h3>
            <div className="relative mx-auto aspect-square w-64 md:hidden">
              <Image
                src={tabsData[activeTab].image}
                alt={tabsData[activeTab].subTitle}
                fill
                sizes="256px"
                className="object-contain"
              />
            </div>
            <p className="my-6 text-lg font-light">
              {tabsData[activeTab].overview}
            </p>
            <ul className="space-y-4 font-light">
              {tabsData[activeTab].content.map((item, index) => (
                <li key={index} className="flex gap-2">
                  <Check className="text-primary mt-1.5 min-w-fit" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="hidden w-full md:block md:w-1/2">
            <Image
              src={tabsData[activeTab].image}
              alt={tabsData[activeTab].subTitle}
              width={448}
              height={448}
              sizes="(max-width: 768px) 0px, 448px"
              className="ml-auto h-auto w-full max-w-md"
              priority={activeTab === 0}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
