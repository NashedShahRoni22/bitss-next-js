"use client";
import { Home, Mail, Phone } from "lucide-react";
import SectionContainer from "../shared/SectionContainer";
import Image from "next/image";

export default function Banner() {
  return (
    <SectionContainer>
      <div className="flex flex-col gap-8 md:flex-row md:gap-16">
        {/* Contact Info Container */}
        <div className="md:mt-6 md:w-1/2">
          <h1 className="mb-6 text-center text-4xl font-bold md:text-left md:text-5xl">
            Contact Us
          </h1>
          <p className="mb-8 text-center text-lg font-light md:text-left md:text-xl">
            To make requests for further information, contact us via our social
            channels.
          </p>

          <div className="flex items-center gap-4 md:gap-5">
            <div className="rounded-lg bg-primary p-3 md:p-5">
              <Home className="text-custom-white text-2xl" />
            </div>
            <div className="flex flex-col gap-1 md:gap-2">
              <h5 className="text-xl font-semibold">Address</h5>
              <p>8 rue de Dublin, 34200, Sète, France</p>
            </div>
          </div>

          <div className="my-5 flex items-center gap-4 md:gap-5">
            <div className="rounded-lg bg-primary p-3 md:p-5">
              <Phone className="text-custom-white text-2xl" />
            </div>
            <div className="flex flex-col gap-1 md:gap-2">
              <h5 className="text-xl font-semibold">Phone</h5>
              <p>+0033666100010</p>
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-5">
            <div className="rounded-lg bg-primary p-3 md:p-5">
              <Mail className="text-custom-white text-2xl" />
            </div>
            <div className="flex flex-col gap-1 md:gap-2">
              <h5 className="text-xl font-semibold">Email</h5>
              <p>support@bobosohomail.com</p>
              <p>bfin@bobosohomail.com</p>
            </div>
          </div>
        </div>

        {/* Lottie Animation Container */}
        <div className="md:w-1/2 aspect-3/2 relative">
          <Image src="/images/contact.svg" alt="contact image" fill />
        </div>
      </div>
    </SectionContainer>
  );
}
