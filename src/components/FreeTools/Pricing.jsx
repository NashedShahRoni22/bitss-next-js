import { Check, X } from "lucide-react";
import SectionContainer from "../shared/SectionContainer";
import SectionTitle from "../shared/SectionTitle";
import Link from "next/link";

const antiSpamContactPricing = [
  {
    title: "Free",
    details:
      "Free version is a Classic Contact Page without Cyber Security & Anti-Spam Features",
    features: [
      {
        name: "basic contact form",
        available: true,
      },
      {
        name: "anti-spam security",
        available: false,
      },
      {
        name: "real-time threat monitoring",
        available: false,
      },
      {
        name: "captcha for verified inputs",
        available: false,
      },
      {
        name: "continue support, training & upgrade",
        available: false,
      },
    ],
  },
  {
    title: "premium - €7.50",
    details:
      "Unlock Real-time Threat Monitoring, Anti-spam, Advanced Filtering & More",
    features: [
      {
        name: "anti-spam security",
        available: true,
      },
      {
        name: "real-time threat monitoring",
        available: true,
      },
      {
        name: "captcha for verified inputs",
        available: true,
      },
      {
        name: "enhanced contact management",
        available: true,
      },
      {
        name: "continue support, training & upgrade",
        available: true,
      },
    ],
  },
];

export default function Pricing() {
  return (
    <SectionContainer>
      <SectionTitle>Free vs Premium: Choose the Right Plan</SectionTitle>

      <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-16">
        {antiSpamContactPricing.map((price, i) => (
          <div key={i} className="rounded-md border border-accent/15 p-5">
            <h4 className="text-2xl font-bold capitalize">{price.title}</h4>
            <p className="mt-3 text-[17px] font-light">{price.details}</p>
            <p className="mt-4 font-bold">What&apos;s included:</p>
            <ul className="mt-2.5 space-y-1.5 font-light capitalize">
              {price.features.map((feat, i) => (
                <li key={i} className="flex items-center gap-2">
                  {feat.available ? (
                    <Check className="min-w-fit rounded bg-[#0073e6] text-custom-white" />
                  ) : (
                    <X className="min-w-fit rounded bg-primary text-custom-white" />
                  )}
                  {feat.name}
                </li>
              ))}
            </ul>

            {price.title === "Free" ? (
              <a
                href="/bitss-contact-form.zip"
                className="mt-6 block w-full rounded border border-accent px-3.5 py-1.5 text-center shadow transition-all duration-200 ease-in-out hover:bg-accent hover:text-custom-white hover:shadow-custom-2 md:w-fit"
              >
                Download Free
              </a>
            ) : (
              <Link
                href="/products/c-contact-form/wp"
                className="mt-6 block w-full rounded border border-[#0073e6] bg-[#0073e6] px-3.5 py-1.5 text-center text-custom-white shadow transition-all duration-200 ease-in-out hover:border-[#1461ad] hover:bg-[#1461ad] hover:shadow-custom-2 md:w-fit"
              >
                Buy Now
              </Link>
            )}
          </div>
        ))}
      </div>
    </SectionContainer>
  );
}
