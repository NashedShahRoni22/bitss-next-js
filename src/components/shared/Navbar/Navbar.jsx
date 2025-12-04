"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronDown, Dot, Menu, X } from "lucide-react";
import UserProfileDropdown from "./UserProfileDropdown";
import MobileNav from "./MobileNav";
import useAuth from "@/hooks/useAuth";
import { staticNavLinks } from "@/data/navLinks";

export default function Navbar() {
  const { authInfo } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  // manage translate
  const googleTranslateElementInit = () => {
    new window.google.translate.TranslateElement(
      {
        pageLanguage: "en",
        autoDisplay: false,
      },
      "google_translate_element",
    );
  };

  useEffect(() => {
    var addScript = document.createElement("script");
    addScript.setAttribute(
      "src",
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit",
    );
    document.body.appendChild(addScript);
    window.googleTranslateElementInit = googleTranslateElementInit;
  }, []);

  const handleScroll = () => {
    setMenuOpen(false);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav className="sticky top-0 z-50 border-b border-[#C5D6E0] bg-white">
      {/* TODO: uncomment this component */}
      <div
        id="google_translate_element"
        className="mx-auto hidden w-fit lg:block"
      ></div>

      <div className="relative mx-auto flex w-full max-w-7xl items-center justify-between px-5 md:px-0">
        {/* Logo */}
        <div>
          <Link href="/">
            <Image
              src="/images/logo/logo.png"
              alt="bitss logo"
              width={80}
              height={80}
              className="object-cover"
            />
          </Link>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden items-center md:flex">
          {staticNavLinks.map((link, i) => (
            <div key={i} className="group relative p-3">
              {/* Main Nav Link */}
              {link.path ? (
                <Link
                  href={link.path}
                  className={`hover:text-primary text-sm capitalize transition-all duration-200 ease-in-out ${
                    (link.categories || link.children) &&
                    "flex items-center gap-1"
                  }`}
                >
                  {link.name}
                  {(link.categories || link.children) && (
                    <ChevronDown className="transition-transform duration-200 ease-linear group-hover:-rotate-180" />
                  )}
                </Link>
              ) : (
                <button
                  className={`hover:text-primary text-sm capitalize transition-all duration-200 ease-in-out ${
                    (link.categories || link.children) &&
                    "flex items-center gap-1"
                  }`}
                >
                  {link.name}
                  {(link.categories || link.children) && (
                    <ChevronDown className="transition-transform duration-200 ease-linear group-hover:-rotate-180" />
                  )}
                </button>
              )}

              {/* Dropdown for Products */}
              {link.categories && (
                <div className="shadow-custom-1 absolute top-full left-0 z-10 hidden min-w-2xl grid-cols-2 rounded-lg bg-white group-hover:grid">
                  {link.categories.map((category, j) => (
                    <div
                      key={j}
                      className={`${j % 2 === 0 && j < 2 && "border-r"} ${
                        j < 2 && "border-b"
                      } border-accent p-6 ${
                        j > 1 ? "col-span-2" : "col-span-1"
                      }`}
                    >
                      <div className="relative mb-3 flex h-10 w-full gap-1.5">
                        <Image
                          src={category.icon}
                          alt={category.title}
                          fill
                          className="object-cover"
                        />
                        <div>
                          <h3 className="font-bold">{category.title}</h3>
                          <p className="text-xs">({category.subTitle})</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {category.items.map((product, k) => (
                          <Link
                            key={k}
                            href={product.path}
                            className="hover:text-primary flex max-w-fit flex-wrap gap-1 text-sm capitalize transition-all duration-200 ease-in-out"
                          >
                            <Dot className="min-w-fit text-lg" />
                            {product.name}{" "}
                            {product?.isAvailable ? (
                              <span className="text-green-600">
                                (Available)
                              </span>
                            ) : (
                              <span className="text-primary">(Upgrading)</span>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Dropdown for Children */}
              {link.children && (
                <div className="shadow-custom-1 absolute top-full left-0 z-10 hidden min-w-max grid-cols-1 gap-4 rounded-lg bg-white px-6 py-4 group-hover:grid">
                  {link.children.map((subLink, j) => (
                    <Link
                      key={j}
                      href={subLink.link}
                      className="hover:text-primary block text-sm capitalize transition-all duration-200 ease-in-out"
                    >
                      {subLink.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* login button */}
        {authInfo?.access_token ? (
          <UserProfileDropdown />
        ) : (
          <Link
            href="/login"
            className="bg-primary hover:bg-primary-hover hidden rounded p-2 px-4 text-sm font-medium text-white transition-all duration-200 ease-in-out md:block"
          >
            Login
          </Link>
        )}

        {/* Mobile Menu Toggle Button */}
        <button className="md:hidden">
          {menuOpen ? (
            <X onClick={() => setMenuOpen(!menuOpen)} size={20} />
          ) : (
            <Menu onClick={() => setMenuOpen(!menuOpen)} size={20} />
          )}
        </button>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <MobileNav
            setMenuOpen={setMenuOpen}
            updatedMenuItems={staticNavLinks}
          />
        )}
      </div>
    </nav>
  );
}
