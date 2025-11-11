import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Contact() {
  return (
    <section className="relative w-full rounded bg-red-50 bg-cover bg-center bg-no-repeat px-5 py-10 md:mx-auto md:max-w-7xl md:px-0 md:py-20">
      <h2 className="mb-6 text-center text-3xl leading-[3.15rem] font-bold text-balance md:text-[2.5rem]">
        Which Cybersecurity Solution is Best for you?
      </h2>
      <p className="mb-20 w-full text-center text-xl font-light text-balance">
        Still unsure? Let us help you find the perfect solution—reach out to us
        or explore our FAQ!
      </p>

      <div className="text-center">
        <Link
          href="/contact"
          className={
            "text-custom-white group bg-primary inline-flex items-center rounded-full px-4 py-2.5 text-lg font-medium transition-all duration-200 ease-in-out"
          }
        >
          <span className="flex items-center px-3">
            <span className="transition-transform duration-300 group-hover:-translate-x-2">
              Contact Us
            </span>
          </span>
          <ArrowRight
            size={16}
            className="-ml-3 min-w-fit scale-0 opacity-0 transition-opacity duration-300 group-hover:scale-150 group-hover:opacity-100"
          />
        </Link>
      </div>
    </section>
  );
}
