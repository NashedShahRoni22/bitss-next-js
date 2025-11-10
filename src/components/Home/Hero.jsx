import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute left-20 top-20 h-72 w-72 animate-pulse rounded-full bg-primary blur-3xl"></div>
        <div className="absolute bottom-20 right-20 h-96 w-96 animate-pulse rounded-full bg-blue-500 blur-3xl delay-1000"></div>
      </div>

      <div className="relative flex w-full flex-col items-center justify-center px-5 py-20 md:container md:mx-auto md:py-32">
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
          <h1 className="mb-6 text-balance text-center text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
            <span className="bg-linear-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
              Dedicated Website Administration,
            </span>
            <br />
            <span className="bg-linear-to-r from-primary via-red-500 to-orange-500 bg-clip-text text-transparent">
              Database Protection, and Windows Device Security
            </span>
          </h1>

          {/* Subtitle with glass morphism effect */}
          <div className="mb-10 rounded-2xl border border-gray-200 bg-gray-50 p-8 shadow-lg">
            <p className="text-center text-lg font-light leading-relaxed text-gray-700 md:text-xl">
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
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-linear-to-r from-primary to-red-600 px-10 py-4 text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/50"
            >
              <span className="relative z-10">Explore Our Products</span>
              <div className="absolute inset-0 bg-linear-to-r from-red-600 to-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            </Link>
          </div>

          <h5 className="text-xl md:text-3xl text-center mt-12 font-bold text-primary">
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
      </div>
    </section>
  );
}
