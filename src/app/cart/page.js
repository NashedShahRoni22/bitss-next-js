"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import CartItem from "@/components/Cart/CartItem";
import PrivateRoute from "@/components/shared/PrivateRoute";
import SectionContainer from "@/components/shared/SectionContainer";
import useCart from "@/hooks/useCart";
import useAuth from "@/hooks/useAuth";

export default function Cart() {
  const router = useRouter();
  const { authInfo } = useAuth();
  const { cartItems, calculateTotal, getCartItemsCount } = useCart();
  const total = calculateTotal();
  const itemCount = getCartItemsCount();

  // handle proceed to checkout
  const handleCheckout = () => {
    if (!authInfo?.access_token) {
      return router.push("/login?return=/checkout");
    }
    router.push("/checkout");
  };

  return (
    <PrivateRoute>
      <SectionContainer>
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center">
            <ShoppingCart className="mr-3 h-8 w-8 text-red-600" />
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          </div>
          {itemCount > 0 && (
            <div className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-800">
              {itemCount} item{itemCount !== 1 ? "s" : ""}
            </div>
          )}
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
          {cartItems.length === 0 ? (
            <div className="py-16 text-center">
              <ShoppingCart className="mx-auto mb-4 h-16 w-16 text-gray-400" />
              <h3 className="mb-2 text-xl font-medium text-gray-900">
                Your cart is empty
              </h3>
              <p className="mb-6 text-gray-500">
                Start shopping to add products to your cart
              </p>
              <Link
                href="/"
                className="rounded-md bg-red-600 px-6 py-3 font-medium text-white transition-colors hover:bg-red-700"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <CartItem key={`${item.id}-${item.version}`} item={item} />
                ))}
              </div>

              {/* Cart Summary */}
              <div className="border-t border-gray-200 bg-gray-50 px-6 py-6">
                <div className="mb-6 flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">
                    Total
                  </span>
                  <span className="text-2xl font-bold text-red-600">
                    €{total.toFixed(2)}
                  </span>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleCheckout}
                    className="w-full rounded-md bg-red-600 px-6 py-4 text-lg font-semibold text-white shadow-sm transition-colors hover:cursor-pointer hover:bg-red-700"
                  >
                    Proceed to Checkout
                  </button>
                  <Link
                    href="/products"
                    className="block w-full rounded-md border border-gray-300 bg-white px-6 py-3 text-center font-medium text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </SectionContainer>
    </PrivateRoute>
  );
}
