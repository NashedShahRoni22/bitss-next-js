import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { highlitedSolutions } from "@/data/highlightedSolutions";
const dotShapes = "/images/shapes/dot-grid.svg";

export default function SolutionHighlights() {
  return (
    <section className="w-full overflow-hidden px-5 py-10 md:mx-auto md:max-w-7xl md:rounded-[2.5rem] md:px-0 md:py-20">
      <h2 className="text-3xl leading-[3.15rem] font-bold text-balance md:text-[2.5rem]">
        Comprehensive Security Solutions
      </h2>
      <p className="my-4">
        Explore tailored security solutions for WordPress, JavaScript websites,
        networks <br /> and devices. Protect your digital assets with
        cutting-edge technology <br /> for businesses, individuals, and
        enterprises alike.
      </p>
      <Link
        href="/products"
        className={
          "group border-primary bg-primary text-custom-white mb-10 inline-flex w-fit items-center rounded-xl border-2 px-4 py-2.5 font-medium transition-all duration-200 ease-in-out"
        }
      >
        <span className="flex items-center px-3">
          <span className="transition-transform duration-300 group-hover:-translate-x-2">
            Explore All Products
          </span>
        </span>
        <ArrowRight className="-ml-3 min-w-fit scale-0 opacity-0 transition-opacity duration-300 group-hover:scale-150 group-hover:opacity-100" />
      </Link>

      {/* Solution Cards Container */}
      <div className="relative">
        <Image
          src={dotShapes}
          alt="dot grid shapes"
          width={112}
          height={112}
          className="absolute -top-11 -right-6 size-28 opacity-0 md:opacity-50"
        />
        <div className="relative grid grid-cols-1 gap-4 py-6 md:grid-cols-2 lg:grid-cols-3">
          {highlitedSolutions.map((solution, i) => (
            <div
              key={i}
              className="border-primary/20 bg-custom-white rounded-xl border p-5"
            >
              <Image
                src={solution.icon}
                alt={solution.title}
                width={40}
                height={40}
                sizes="(max-width: 768px) 32px, 40px"
                className="mb-3 h-auto w-8 md:w-10"
              />
              <h4 className="text-[1.375rem] font-medium">{solution.title}</h4>
              <p className="mt-2 mb-12 text-lg font-light">
                {solution.overview}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
