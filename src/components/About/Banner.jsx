import Image from "next/image";
import Link from "next/link";

export default function Banner() {
  return (
    <div className="relative overflow-hidden py-16 md:py-24">
      {/* Background decorative elements */}
      <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-red-100 opacity-20 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-pink-100 opacity-20 blur-3xl"></div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-12">
          {/* Text Container */}
          <div className="w-full max-w-4xl space-y-6 text-center">
            {/* Section Label */}
            <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-sm font-medium text-primary">
              <span className="flex h-2 w-2 rounded-full bg-primary"></span>
              About Bitss
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl font-bold leading-tight text-gray-900 md:text-5xl lg:text-6xl">
              Bitss Cyber Security
            </h1>

            {/* Subheading */}
            <p className="text-xl font-medium text-gray-700 md:text-2xl">
              Leading Innovation in Cybersecurity Research & Protection
            </p>

            {/* Description Paragraphs */}
            <div className="space-y-4 text-base text-gray-600 md:text-lg">
              <p>
                <span className="font-semibold text-gray-800">
                  BITSS.fr by BFIN SASU
                </span>{" "}
                is a French IT research and software engineering company. We are
                a leading entity in cybersecurity, anti-hacking and intrusion
                research.
              </p>
              <p>
                Our Data Centers offer secured hosting, redundancy management
                and bitss cyber security protection as free options.
              </p>
            </div>

            {/* Feature List with Icons */}
            <div className="mx-auto max-w-2xl space-y-3 pt-4">
              {[
                "Safeguarding your digital infrastructure with cutting-edge technology",
                "Protection for networks, servers, websites, laptops or any devices",
                "Services catered to businesses, enterprises, and individuals",
                "Stay ahead of evolving cyber threats through ongoing research",
                "Dedicated engineers combating online hacking, pirating and virus warfare",
              ].map((feature, index) => (
                <div key={index} className="flex items-start gap-3 text-left">
                  <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary">
                    <svg
                      className="h-3 w-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-700 md:text-base">
                    {feature}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="pt-6">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:bg-[#d1132d] hover:shadow-xl hover:shadow-red-200"
              >
                Get Global Support
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </div>
          </div>

          {/* Image Container */}
          <div className="w-full max-w-2xl">
            <div className="relative">
              {/* Decorative background card */}
              <div className="absolute -right-4 -top-4 h-full w-full rounded-2xl bg-linear-to-br from-primary to-pink-600 opacity-10"></div>

              {/* Main image container */}
              <div className="relative rounded-2xl bg-white p-4 shadow-2xl">
                <div className="relative aspect-3/2 w-full overflow-hidden rounded-xl bg-gray-100">
                  <Image
                    src="/images/about/bitss.gif"
                    alt="Bitss Cybersecurity - Protecting Your Digital Assets"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>

                {/* Stats overlay */}
                <div className="absolute -bottom-6 left-1/2 flex -translate-x-1/2 gap-4">
                  <div className="rounded-xl bg-white px-6 py-4 shadow-lg">
                    <p className="text-2xl font-bold text-primary">24/7</p>
                    <p className="text-xs text-gray-600">Protection</p>
                  </div>
                  <div className="rounded-xl bg-white px-6 py-4 shadow-lg">
                    <p className="text-2xl font-bold text-primary">100%</p>
                    <p className="text-xs text-gray-600">Secure</p>
                  </div>
                  <div className="rounded-xl bg-white px-6 py-4 shadow-lg">
                    <p className="text-2xl font-bold text-primary">Global</p>
                    <p className="text-xs text-gray-600">Support</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
