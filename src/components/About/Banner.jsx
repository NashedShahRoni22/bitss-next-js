import Image from "next/image";
import Link from "next/link";

export default function Banner() {
  return (
    <div className="relative overflow-hidden py-10 md:py-20">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-linear-to-br from-red-100 to-pink-100 opacity-30 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-linear-to-tr from-pink-100 to-red-100 opacity-30 blur-3xl"></div>

      {/* Animated grid pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "radial-gradient(circle, #ef4444 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      <div className="px-5 md:px-0">
        {/* Top Section - Header & Description */}
        <div className="mb-16 text-center">
          {/* Section Label */}
          <div className="text-primary mb-6 inline-flex items-center gap-2 rounded-full border border-red-200 bg-linear-to-r from-red-50 to-pink-50 px-5 py-2.5 text-sm font-semibold shadow-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="bg-primary absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"></span>
              <span className="bg-primary relative inline-flex h-2.5 w-2.5 rounded-full"></span>
            </span>
            About Bitss
          </div>

          {/* Main Heading with gradient */}
          <h1 className="mb-6 bg-linear-to-r from-gray-900 via-red-900 to-gray-900 bg-clip-text text-5xl leading-tight font-extrabold text-transparent md:text-6xl lg:text-7xl">
            Bitss Cyber Security
          </h1>

          {/* Subheading */}
          <p className="mb-6 text-2xl font-semibold text-gray-700 md:text-3xl">
            Leading Innovation in Cybersecurity Research & Protection
          </p>

          {/* Description */}
          <div className="mx-auto max-w-3xl space-y-4 text-base text-gray-600 md:text-lg">
            <p>
              <span className="font-bold text-gray-900">
                BITSS.fr by BFIN SASU
              </span>{" "}
              is a French IT research and software engineering company. We are a
              leading entity in cybersecurity, anti-hacking and intrusion
              research.
            </p>
            <p>
              Our Data Centers offer secured hosting, redundancy management and
              bitss cyber security protection as free options.
            </p>
          </div>

          {/* CTA Button */}
          <div className="mt-8">
            <Link
              href="/contact"
              className="group from-primary inline-flex items-center gap-3 rounded-full bg-linear-to-r to-red-600 px-10 py-5 text-lg font-bold text-white shadow-xl shadow-red-200 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-300"
            >
              Get Global Support
              <svg
                className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </div>

        {/* Bottom Section - Image Left, Features Right */}
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left - Image Container */}
          <div className="relative">
            {/* Decorative elements */}
            <div className="from-primary absolute -top-4 -left-4 h-full w-full rounded-3xl bg-linear-to-br via-red-500 to-pink-600 opacity-20"></div>
            <div className="from-primary absolute -right-4 -bottom-4 h-full w-full rounded-3xl bg-linear-to-tl via-red-500 to-pink-600 opacity-10"></div>

            {/* Main image container */}
            <div className="relative rounded-3xl bg-white p-3 shadow-2xl">
              <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-gray-100">
                <Image
                  src="/images/about/bitss.gif"
                  alt="Bitss Cybersecurity - Protecting Your Digital Assets"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Floating stats cards */}
              <div className="absolute -bottom-8 left-1/2 flex -translate-x-1/2 gap-3">
                <div className="group rounded-2xl border border-red-100 bg-white px-6 py-4 shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                  <p className="text-primary text-3xl font-black">24/7</p>
                  <p className="text-xs font-medium text-gray-600">
                    Protection
                  </p>
                </div>
                <div className="group rounded-2xl border border-red-100 bg-white px-6 py-4 shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                  <p className="text-primary text-3xl font-black">100%</p>
                  <p className="text-xs font-medium text-gray-600">Secure</p>
                </div>
                <div className="group rounded-2xl border border-red-100 bg-white px-6 py-4 shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                  <p className="text-primary text-3xl font-black">Global</p>
                  <p className="text-xs font-medium text-gray-600">Support</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Feature List */}
          <div className="flex flex-col justify-center space-y-5 pt-8 lg:pt-0">
            {[
              {
                title: "Cutting-Edge Technology",
                description:
                  "Safeguarding your digital infrastructure with advanced solutions",
              },
              {
                title: "Complete Protection",
                description:
                  "Protection for networks, servers, websites, laptops or any devices",
              },
              {
                title: "Flexible Services",
                description:
                  "Services catered to businesses, enterprises, and individuals",
              },
              {
                title: "Continuous Research",
                description:
                  "Stay ahead of evolving cyber threats through ongoing research",
              },
              {
                title: "Expert Team",
                description:
                  "Dedicated engineers combating online hacking, pirating and virus warfare",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-md transition-all duration-300 hover:scale-[1.02] hover:border-red-200 hover:shadow-xl"
              >
                <div className="from-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br to-red-600 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="mb-1 text-lg font-bold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
