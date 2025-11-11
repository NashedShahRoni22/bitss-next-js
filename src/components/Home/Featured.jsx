import Image from "next/image";
import { Check } from "lucide-react";
import { featuresData } from "@/data/featuresData";

export default function Featured() {
  return (
    <>
      {featuresData.map((feat, i) => (
        <section
          key={i}
          className={`flex w-full flex-col justify-between gap-8 px-5 py-10 md:mx-auto md:max-w-7xl md:items-center md:gap-16 md:px-0 md:py-20 ${
            i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
          } ${i % 2 === 0 ? "rounded bg-red-50" : "bg-none"}`}
        >
          <div className="w-full md:text-left lg:w-1/2">
            <div className="mb-3 flex flex-col gap-2.5 md:hidden md:justify-center">
              <Image src={feat.icon} alt={feat.name} width={48} height={48} />
              <p className="font-medium">{feat.name}</p>
            </div>
            <h2 className="mb-6 text-3xl font-bold md:hidden md:text-[2.5rem]">
              {feat.title}
            </h2>
            <div className="relative aspect-video w-full max-w-lg">
              <Image
                src={feat.image}
                alt={feat.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 512px"
                className="rounded-lg object-cover"
              />
            </div>
          </div>

          <div className="w-full md:text-left lg:w-1/2">
            <div className="mb-4 hidden gap-2.5 md:flex md:flex-col">
              <Image
                src={feat.icon}
                alt={feat.name}
                width={96}
                height={96}
                className="object-cover"
              />
              <p className="text-lg font-bold">{feat.name}</p>
            </div>
            <h2 className="hidden text-3xl leading-[3.15rem] font-bold text-balance md:block md:text-[2.5rem]">
              {feat.title}
            </h2>
            <p className="mt-4 text-lg leading-7 font-light text-balance">
              {feat.overview}
            </p>

            {feat.features && (
              <ul className="mt-4 space-y-2 font-light">
                {feat.features.map((li, i) => (
                  <li key={i} className="flex gap-2">
                    <Check className="text-primary mt-1.5 min-w-fit" />
                    <span>{li}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      ))}
    </>
  );
}
