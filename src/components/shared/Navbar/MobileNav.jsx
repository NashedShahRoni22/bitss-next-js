import { useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  Dot,
  LogIn,
  LogOut,
  Package,
  ShoppingCart,
  User,
} from "lucide-react";
import useAuth from "@/hooks/useAuth";
import useCart from "@/hooks/useCart";

export default function MobileNav({ setMenuOpen, updatedMenuItems }) {
  const { cartItems } = useCart();
  const { authInfo, handleLogout } = useAuth();
  const [showSubLinks, setShowSubLinks] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);

  const toggleSubLinks = (i) => {
    setShowSubLinks((prevLink) => (prevLink === i ? "" : i));
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  // Extract initials from name
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogoutClick = () => {
    handleLogout();
    setMenuOpen(false);
  };

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  return (
    <div className="z-50 absolute left-0 top-20 min-h-[calc(100dvh-80px)] w-full space-y-4 border bg-white p-5 md:hidden">
      {/* User Authentication Section */}
      {authInfo?.access_token && (
        <div className="space-y-4">
          {/* User Info Header */}
          <button
            onClick={toggleUserMenu}
            className={`flex w-full cursor-pointer items-center justify-between ${
              showUserMenu && "text-primary"
            }`}
          >
            <div className="flex items-center space-x-3">
              {/* User Initials Circle */}
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-medium text-white">
                {getInitials(authInfo.name)}
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">
                  {authInfo.name?.split(" ")[0] || "User"}
                </p>
                <p className="text-xs text-gray-500">My Account</p>
              </div>
            </div>
            <ChevronDown
              className={`text-lg transition-transform duration-200 ease-linear ${
                showUserMenu ? "-rotate-180 text-primary" : "rotate-0"
              }`}
            />
          </button>

          {/* User Menu Items */}
          <div>
            {/* Profile Link */}
            <Link
              href="/profile"
              onClick={handleLinkClick}
              className={`grid overflow-hidden text-sm transition-all duration-300 ease-in-out ${
                showUserMenu
                  ? "grid-rows-[1fr] pt-2 opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <p className="flex items-center gap-3 overflow-hidden">
                <User className="min-w-fit text-lg" />
                Profile
              </p>
            </Link>

            {/* Order Link */}
            <Link
              href="/my-orders"
              onClick={handleLinkClick}
              className={`grid overflow-hidden text-sm transition-all duration-300 ease-in-out ${
                showUserMenu
                  ? "grid-rows-[1fr] pt-4 opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <p className="flex items-center gap-3 overflow-hidden">
                <Package className="min-w-fit text-lg" />
                My Orders
              </p>
            </Link>

            {/* Cart Link */}
            <Link
              href="/cart"
              onClick={handleLinkClick}
              className={`grid overflow-hidden text-sm transition-all duration-300 ease-in-out ${
                showUserMenu
                  ? "grid-rows-[1fr] pt-4 opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <p className="flex items-center gap-3 overflow-hidden">
                <ShoppingCart className="min-w-fit text-lg" />
                Cart
                {cartItems.length > 0 ? (
                  <span className="size-4 ml-2 animate-pulse bg-primary rounded-full text-white text-xs flex justify-center items-center">
                    {cartItems.length}
                  </span>
                ) : (
                  ""
                )}
              </p>
            </Link>

            {/* Logout Button */}
            <button
              onClick={handleLogoutClick}
              className={`grid w-full overflow-hidden text-sm transition-all duration-300 ease-in-out ${
                showUserMenu
                  ? "grid-rows-[1fr] pt-4 opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <p className="flex items-center gap-3 overflow-hidden text-red-600">
                <LogOut className="min-w-fit text-lg" />
                Logout
              </p>
            </button>
          </div>
        </div>
      )}

      {authInfo?.access_token && (
        <div className="my-4 border-t border-gray-200"></div>
      )}

      {/* Navigation Links */}
      {updatedMenuItems.map((link, index) => (
        <div key={index}>
          {!link.children && !link.categories && (
            <Link href={link.path} onClick={() => setMenuOpen(false)}>
              {link.name}
            </Link>
          )}

          {/* Products Dropdown Link */}
          {link.categories && (
            <>
              <button
                onClick={() => toggleSubLinks(index)}
                className={`flex w-full cursor-pointer items-center justify-between ${
                  showSubLinks === index && "text-primary"
                }`}
              >
                {link.name}
                <ChevronDown
                  className={`text-lg transition-transform duration-200 ease-linear ${
                    showSubLinks === index
                      ? "-rotate-180 text-primary"
                      : "rotate-0"
                  }`}
                />
              </button>

              {link.categories.map((category, i) => (
                <div key={i}>
                  {category.items.map((item, i) => (
                    <Link
                      key={i}
                      href={item.path}
                      onClick={() => setMenuOpen(false)}
                      className={`grid overflow-hidden text-sm transition-all duration-300 ease-in-out ${
                        showSubLinks === index
                          ? "grid-rows-[1fr] pt-4 opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <p className="flex items-center gap-0.5 overflow-hidden">
                        <Dot className="min-w-fit text-2xl" />
                        {item.name}
                      </p>
                    </Link>
                  ))}
                </div>
              ))}
            </>
          )}

          {/* Hosting Products & Support Dropdown */}
          {link.children && (
            <>
              <button
                onClick={() => toggleSubLinks(index)}
                className={`flex w-full cursor-pointer items-center justify-between ${
                  showSubLinks === index && "text-primary"
                }`}
              >
                {link.name}{" "}
                <ChevronDown
                  className={`text-lg transition-transform duration-200 ease-linear ${
                    showSubLinks === index
                      ? "-rotate-180 text-primary"
                      : "rotate-0"
                  }`}
                />
              </button>

              {/* Sub Links Container */}
              <div>
                {link.children.map((subLink, i) => (
                  <Link
                    key={i}
                    href={subLink.link}
                    onClick={() => setMenuOpen(false)}
                    className={`grid overflow-hidden text-sm transition-all duration-300 ease-in-out ${
                      showSubLinks === index
                        ? "grid-rows-[1fr] pt-4 opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <p className="flex items-center gap-0.5 overflow-hidden">
                      <Dot className="min-w-fit text-2xl" /> {subLink.name}
                    </p>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      ))}

      {!authInfo?.access_token && (
        <Link
          href="/login"
          onClick={handleLinkClick}
          className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-medium text-white transition-colors duration-200 hover:bg-primary-hover"
        >
          <LogIn className="text-lg" />
          Login
        </Link>
      )}
    </div>
  );
}
