import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Check, ShoppingCart, ArrowRight } from "lucide-react";
import useAuth from "@/hooks/useAuth";
import useCart from "@/hooks/useCart";

export default function ProductCard({ product, categoryId }) {
  const { authInfo } = useAuth();
  const { addToCart } = useCart();
  const router = useRouter();
  const pathname = usePathname();

  const handleAddToCart = () => {
    if (product._id === "690718729ddffc5f45c8c449") {
      return router.push(`/bitss-retail-packs`);
    }

    // Check if user is authenticated
    if (!authInfo?.access_token && product._id !== "690718729ddffc5f45c8c449") {
      return router.push(`/login?redirect=${pathname}`);
    }

    // Prepare cart item with product data
    const cartProduct = {
      id: product._id,
      categoryId: categoryId,
      name: product.name,
      price: product.price,
      status: product.status,
      productDetails: product.product_details,
      subscriptions: product.subscription_periods,
    };

    // Add to cart
    addToCart(cartProduct);
  };

  return (
    <div className="group relative flex h-full flex-col rounded-xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:border-red-300 hover:shadow-xl">
      {/* Status Badge */}
      <div className="mb-4 flex items-center justify-between">
        <span
          className={`inline-flex rounded-full  ${
            product.status === "available"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          } px-3 py-1 text-xs font-medium capitalize `}
        >
          {product.status}
        </span>
      </div>

      {/* Product Name & Price */}
      <div className="mb-6">
        <h3 className="mb-2 text-xl font-bold text-gray-900 transition-colors group-hover:text-red-600">
          {product.name}
        </h3>
        <div className="flex items-baseline gap-2">
          <p className="text-3xl font-bold text-red-600">
            €{(product.price * 12).toFixed(2)}
          </p>
          <span className="text-sm text-gray-500">/year</span>
        </div>
      </div>

      {/* Product Details */}
      <div className="mb-6">
        <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-700">
          Features
        </h4>
        <ul className="space-y-2">
          {product.product_details.map((detail, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2 text-sm text-gray-600"
            >
              <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
              <span>{detail}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Subscription Periods */}
      {product.subscription_periods &&
        product.subscription_periods.length > 0 && (
          <div className="mb-6">
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-700">
              Plans Available
            </h4>
            <div className="flex flex-wrap gap-2">
              {product.subscription_periods.map((period) => (
                <span
                  key={period._id}
                  className="inline-flex items-center rounded-md bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-500/10"
                >
                  {period.duration / 12} year
                  {period.duration / 12 > 1 ? "s" : ""}
                  {period.amount > 0 && (
                    <span className="ml-1 text-red-600">
                      {period.discount_type === "percent"
                        ? `${period.amount}% off`
                        : `€${period.amount} off`}
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>
        )}

      {/* Spacer to push buttons to bottom */}
      <div className="flex-grow"></div>

      {/* Action Buttons - Always at bottom */}
      <div className="space-y-3">
        <button
          onClick={handleAddToCart}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-red-700 hover:shadow-md active:scale-[0.98]"
        >
          <ShoppingCart className="h-4 w-4" />
          {product._id === "690718729ddffc5f45c8c449"
            ? "Order Now"
            : "Add to Cart"}
        </button>
        <Link
          href={
            product._id === "690718729ddffc5f45c8c449"
              ? "/bitss-retail-packs"
              : `/products/${product._id}`
          }
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition-all duration-200 hover:border-gray-400 hover:bg-gray-50 active:scale-[0.98]"
        >
          View Details
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
