"use client";

import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import useCart from "@/hooks/useCart";

export default function FloatingCartButton() {
  const { cartItems } = useCart();

  if (cartItems.length === 0) return null;

  return (
    <Link
      href="/cart"
      className="hover:bg-primary-dark bg-primary fixed right-4 bottom-4 z-50 flex size-12 items-center justify-center rounded-full text-2xl text-white shadow-lg transition-colors duration-200 lg:size-16"
    >
      <ShoppingCart />
      <span className="text-primary absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-white text-xs lg:size-6">
        {cartItems.length}
      </span>
    </Link>
  );
}
