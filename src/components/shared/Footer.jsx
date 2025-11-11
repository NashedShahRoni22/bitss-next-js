import Image from "next/image";
import Link from "next/link";
import { Copyright, Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { hostingServers } from "@/data/hostingServers";
import { pages } from "@/data/pages";
import { products } from "@/data/products";
const logo = "/images/logo/logo.png";

export default function Footer() {
  return (
    <footer className="border-t border-[#C5D6E0] py-10 md:mt-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid w-full grid-cols-1 gap-8 border-b border-[#C5D6E0] px-5 pb-12 md:mx-auto md:max-w-7xl md:grid-cols-2 md:px-0 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link href="/">
              <Image src={logo} alt="bitss logo" width={128} height={128} />
            </Link>
            <p className="mt-3 text-2xl">By BFINIT Cosmopolitan</p>
            <p className="mt-3">
              Securely connecting you with seamless email and chat for personal
              and business communication.
            </p>
            <div className="my-6">
              <input
                required
                type="email"
                name="email"
                id="email"
                className="rounded-l border-none bg-[#f2f2f2] px-4 py-1.5 outline-none"
              />
              <button className="bg-primary text-custom-white hover:bg-primary-hover rounded-r px-4 py-1.5 transition-all duration-200 ease-in-out">
                Subscribe
              </button>
            </div>
            <a
              className="underline transition-all duration-200 ease-in-out"
              href="mailto:support@bobosohomail.com"
              target="_blanck"
            >
              support@bobosohomail.com
            </a>
          </div>

          {/* hosting products */}
          <div className="lg:col-span-2">
            <h6 className="mb-8 font-bold">Hosting Products</h6>
            <div className="flex flex-col gap-2 space-y-2.5 text-sm">
              {hostingServers.map((product, i) => (
                <Link
                  key={i}
                  href={product.link}
                  target="_blanck"
                  className="flex gap-2.5 transition-all duration-200 ease-in-out hover:underline"
                >
                  {product.name}
                </Link>
              ))}
            </div>
          </div>

          {/* other products */}
          <div className="lg:col-span-2">
            <h6 className="mb-8 font-bold">Other Products</h6>
            <div className="flex flex-col gap-2 space-y-2.5 text-sm">
              {products.map((product, i) => (
                <Link
                  href={product.link}
                  key={i}
                  className="flex gap-2.5 transition-all duration-200 ease-in-out hover:underline"
                >
                  {product.name}
                </Link>
              ))}
            </div>
          </div>

          {/* pages */}
          <div className="lg:col-span-2">
            <h6 className="mb-8 font-bold">Quick Links to BFINIT</h6>
            <div className="flex flex-col gap-2 space-y-2.5 text-sm">
              {pages.map((product, i) => (
                <Link
                  href={product.link}
                  key={i}
                  className="flex gap-2.5 transition-all duration-200 ease-in-out hover:underline"
                >
                  {product.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col justify-between gap-8 px-5 py-6 md:mx-auto md:max-w-7xl md:flex-row md:items-center md:px-0">
          <p className="flex gap-2 md:items-center">
            <Copyright size={24} className="mt-0.5 min-w-fit md:mt-0" />
            2025 BFIN Company All rights Reserved | 8 rue de Dublin, 34200,
            Sète, France.
          </p>
          <div className="flex items-center justify-center gap-7 md:justify-normal">
            <Link
              href="/"
              className="hover:text-primary transition-all duration-200 ease-in-out"
            >
              <Facebook size={24} />
            </Link>
            <Link
              href="/"
              className="hover:text-primary transition-all duration-200 ease-in-out"
            >
              <Instagram size={24} />
            </Link>
            <Link
              href="/"
              className="hover:text-primary transition-all duration-200 ease-in-out"
            >
              <Twitter size={24} />
            </Link>
            <Link
              href="/"
              className="hover:text-primary transition-all duration-200 ease-in-out"
            >
              <Youtube size={24} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
