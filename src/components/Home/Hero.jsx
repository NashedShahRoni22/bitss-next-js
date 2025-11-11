import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative flex w-full flex-col items-center justify-center px-5 py-20 md:mx-auto md:max-w-7xl md:px-0">
      <div className="w-full max-w-4xl">
        {/* Logo with glow effect */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-xl opacity-50 blur-xl"></div>
            <Image
              src="/images/logo/logo.png"
              alt="bitss logo"
              width={80}
              height={80}
              className="relative rounded-xl shadow-2xl transition-transform duration-300 hover:scale-110"
            />
          </div>
        </div>

        {/* Heading with gradient text */}
        <h1 className="mb-6 text-center text-3xl leading-tight font-bold text-balance md:text-4xl lg:text-5xl">
          <span className="bg-linear-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
            Dedicated Website Administration,
          </span>
          <br />
          <span className="from-primary bg-linear-to-r via-red-500 to-orange-500 bg-clip-text text-transparent">
            Database Protection, and Windows Device Security
          </span>
        </h1>

        {/* Subtitle with glass morphism effect */}
        <div className="mb-10 rounded-2xl border border-gray-200 bg-gray-50 p-8 shadow-lg">
          <p className="text-center text-lg leading-relaxed font-light text-gray-700 md:text-xl">
            VWAR Software provides database security filtering of malware:
            Identifies, neutralises, and removes malware implanted in your
            device database to destroy your business. Efficient for websites,
            servers & laptops.
          </p>
        </div>

        {/* CTA Button with modern styling */}
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/products"
            className="group from-primary hover:shadow-primary/50 relative inline-flex items-center justify-center overflow-hidden rounded-full bg-linear-to-r to-red-600 px-10 py-4 text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <span className="relative z-10">Explore Our Products</span>
            <div className="to-primary absolute inset-0 bg-linear-to-r from-red-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
          </Link>
        </div>

        <h5 className="text-primary mt-12 text-center text-xl font-bold md:text-3xl">
          Bitss <span className="text-black">for</span>{" "}
        </h5>

        {/* Feature badges */}
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <div className="rounded-full border border-gray-200 bg-gray-100 px-6 py-2 text-sm text-gray-700 shadow-sm">
            🗄️ Website Database
          </div>
          <div className="rounded-full border border-gray-200 bg-gray-100 px-6 py-2 text-sm text-gray-700 shadow-sm">
            📦 BITSS Pack
          </div>
          <div className="rounded-full border border-gray-200 bg-gray-100 px-6 py-2 text-sm text-gray-700 shadow-sm">
            🔒 Windows Device Security
          </div>
        </div>
      </div>
    </section>
  );
}
