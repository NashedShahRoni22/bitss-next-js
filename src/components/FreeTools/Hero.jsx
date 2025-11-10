import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import SectionContainer from "../shared/SectionContainer";
import HeroTitle from "../HeroTitle";
import HeroSubTitle from "../HeroSubTitle";
import SectionTitle from "../shared/SectionTitle";
import SectionSubTitle from "../shared/SectionSubTitle";

export default function Hero() {
  return (
    <SectionContainer>
      <HeroTitle>Bitss Free Tools: Empower Your Security for Free!</HeroTitle>
      <HeroSubTitle>
        Explore our free tools to enhance your website security. Upgrade anytime
        for even more features!
      </HeroSubTitle>
      <div className="mt-20 flex flex-col items-center gap-8 md:flex-row md:gap-16">
        <div className="w-full md:w-1/2">
          <SectionTitle mdTextLeft={true}>
            Free Bitss C Secure Contact Form
          </SectionTitle>
          <SectionSubTitle customStyle={true}>
            The ultimate solution to secure your WordPress website from spam and
            ensure secure communication with your visitors.
          </SectionSubTitle>
          <ul className="space-y-2 font-light">
            <li className="flex items-center gap-2">
              <Check className="min-w-fit rounded bg-[#0073e6] text-custom-white" />
              Basic Contact Form without Anti-Spam Security
            </li>
            <li className="flex items-center gap-2">
              <Check className="min-w-fit rounded bg-[#0073e6] text-custom-white" />
              Easy to integrate into WordPress websites
            </li>
            <li className="flex items-center gap-2">
              <Check className="min-w-fit rounded bg-[#0073e6] text-custom-white" />
              100% Free for Basic Needs
            </li>
          </ul>
          <div className="mt-12 flex flex-col gap-4 sm:flex-row">
            <a
              href="/bitss-contact-form.zip"
              className="w-full rounded-md border border-accent px-6 py-3 text-center shadow transition-all duration-200 ease-in-out hover:bg-accent hover:text-custom-white hover:shadow-custom-2 md:w-fit"
            >
              Download Free Version
            </a>
            <Link
              href="/products/c-contact-form/wp"
              className="w-full rounded-md border border-primary bg-primary px-6 py-3 text-center text-custom-white shadow transition-all duration-200 ease-in-out hover:border-primary-hover hover:bg-primary-hover hover:shadow-custom-red md:w-fit"
            >
              Buy Premium Version
            </Link>
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <Image
            src="/images/bitss-c-free-contact-form.webp"
            alt="bitss-c-free-contact-form"
            width={800}
            height={600}
            className="h-auto w-full rounded-lg border object-cover"
            priority
          />
        </div>
      </div>
    </SectionContainer>
  );
}
