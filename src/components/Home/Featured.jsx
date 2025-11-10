import Image from "next/image";
import { Check } from "lucide-react";
import { featuresData } from "@/data/featuresData";

export default function Featured() {
  return (
    <>
      {featuresData.map((feat, i) => (
        <section
          key={i}
          className={`flex flex-col justify-between gap-8 px-5 py-10 md:container md:mx-auto md:items-center md:gap-16 md:py-20 ${
            i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
          } ${i % 2 === 0 ? "bg-red-50 rounded" : "bg-none"}`}
        >
          <div className="w-full lg:w-1/2 md:text-left">
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

          <div className="w-full lg:w-1/2 md:text-left">
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
            <h2 className="hidden text-balance text-3xl font-bold leading-[3.15rem] md:block md:text-[2.5rem]">
              {feat.title}
            </h2>
            <p className="mt-4 text-balance text-lg font-light leading-7">
              {feat.overview}
            </p>

            {feat.features && (
              <ul className="space-y-2 font-light mt-4">
                {feat.features.map((li, i) => (
                  <li key={i} className="flex gap-2">
                    <Check className="mt-1.5 min-w-fit text-primary" />
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
