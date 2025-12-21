"use client";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Check,
  ShoppingCart,
  Loader2,
  ArrowLeft,
  Package,
  Tag,
} from "lucide-react";
import useAuth from "@/hooks/useAuth";
import useCart from "@/hooks/useCart";
import SectionContainer from "@/components/shared/SectionContainer";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const { authInfo } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null); // Reset error state

        const response = await fetch(
          `https://backend.bitss.one/api/v1/products/product/show/${id}`,
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to fetch product");
        }

        if (result.success && result.data) {
          setProduct(result.data);

          // Set default selected period if available
          if (
            result.data.subscription_periods &&
            result.data.subscription_periods.length > 0
          ) {
            setSelectedPeriod(result.data.subscription_periods[0]);
          }
        } else {
          throw new Error(result.message || "Product not found");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
        setProduct(null); // Ensure product is null on error
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = () => {
    // Check if user is authenticated
    if (!authInfo?.access_token) {
      return router.push(`/login?redirect=${pathname}`);
    }

    // Prepare cart item with product data
    const cartProduct = {
      id: product._id,
      categoryId: product.category?._id,
      name: product.name,
      price: product.price,
      status: product.status,
      productDetails: product.product_details,
      subscriptions: product.subscription_periods,
      selectedPeriod: selectedPeriod,
    };

    // Add to cart
    addToCart(cartProduct);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-red-600" />
          <p className="mt-4 text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-4 text-xl font-semibold text-gray-900">
            Product Not Found
          </h2>
          <p className="mt-2 text-gray-600">
            {error || "Unable to load product details"}
          </p>
          <button
            onClick={() => router.push(-1)}
            className="mt-6 rounded-lg bg-red-600 px-6 py-2 text-white hover:bg-red-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <SectionContainer>
      {/* Back Button */}
      <button
        onClick={() => router.push(-1)}
        className="mb-6 flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back to Products</span>
      </button>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left Column - Product Info */}
        <div className="rounded-xl bg-white p-8 shadow-md">
          {/* Category Badge */}
          {product.category && (
            <div className="mb-4 flex items-center gap-2">
              <Tag className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {product.category.name}
              </span>
            </div>
          )}

          {/* Status Badge */}
          <span className="inline-flex rounded-full bg-green-50 px-3 py-1.5 text-sm font-medium text-green-700 capitalize ring-1 ring-green-600/20 ring-inset">
            {product.status}
          </span>

          {/* Product Name */}
          <h1 className="mt-4 text-3xl font-bold text-gray-900">
            {product.name}
          </h1>

          {/* Price */}
          <div className="mt-6 flex items-baseline gap-3">
            <p className="text-4xl font-bold text-red-600">
              €{(product.price * 12).toFixed(2)}
            </p>
            <span className="text-lg text-gray-500">/year</span>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            or €{product.price.toFixed(2)}/month
          </p>

          {/* Combo Products if available */}
          {product.combo_products.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900">
                Included in this Combo
              </h2>

              <ul className="mt-4 space-y-2">
                {product.combo_products.map((combo, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <Check className="h-5 w-5 flex-shrink-0 text-green-600" />
                    <span className="text-gray-700">{combo.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Features */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900">Features</h2>
            <ul className="mt-4 space-y-3">
              {product.product_details.map((detail, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <Check className="mt-1 h-5 w-5 flex-shrink-0 text-green-600" />
                  <span className="text-gray-700">{detail}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Category Description */}
          {product.category?.sort_description && (
            <div className="mt-8 rounded-lg bg-blue-50 p-4">
              <p className="text-sm text-blue-900">
                {product.category.sort_description}
              </p>
            </div>
          )}

          {/* Description if available */}
          {product.description && product.description.trim() !== "" && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900">
                Description
              </h2>
              <div dangerouslySetInnerHTML={{ __html: product.description }} />
            </div>
          )}
        </div>

        {/* Right Column - Purchase Options */}
        <div className="space-y-6">
          {/* Subscription Plans */}
          {product.subscription_periods &&
            product.subscription_periods.length > 0 && (
              <div className="rounded-xl bg-white p-8 shadow-md">
                <h2 className="text-xl font-semibold text-gray-900">
                  Choose Your Plan
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  Select a subscription period and save more
                </p>
                <div className="mt-6 space-y-3">
                  {product.subscription_periods.map((period) => {
                    const duration = parseInt(period.duration);
                    const yearCount = duration / 12;
                    const isSelected = selectedPeriod?._id === period._id;
                    const totalPrice = product.price * duration;

                    let discountedPrice = totalPrice;
                    if (period.discount_type === "percent") {
                      discountedPrice =
                        totalPrice - (totalPrice * period.amount) / 100;
                    } else if (period.discount_type === "flat") {
                      discountedPrice = totalPrice - period.amount;
                    }

                    const savings = totalPrice - discountedPrice;

                    return (
                      <button
                        key={period._id}
                        onClick={() => setSelectedPeriod(period)}
                        className={`w-full rounded-lg border-2 p-4 text-left transition-all ${
                          isSelected
                            ? "border-red-600 bg-red-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">
                              {yearCount} Year{yearCount > 1 ? "s" : ""}{" "}
                              Subscription
                            </p>
                            <div className="mt-2 flex items-baseline gap-2">
                              {savings > 0 ? (
                                <>
                                  <span className="text-2xl font-bold text-red-600">
                                    €{discountedPrice.toFixed(2)}
                                  </span>
                                  <span className="text-sm text-gray-500 line-through">
                                    €{totalPrice.toFixed(2)}
                                  </span>
                                </>
                              ) : (
                                <span className="text-2xl font-bold text-gray-900">
                                  €{totalPrice.toFixed(2)}
                                </span>
                              )}
                            </div>
                            {savings > 0 && (
                              <p className="mt-1 text-xs text-green-600">
                                Save €{savings.toFixed(2)}
                              </p>
                            )}
                          </div>
                          {period.amount > 0 && (
                            <span className="ml-2 rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">
                              {period.discount_type === "percent"
                                ? `${period.amount}% OFF`
                                : `€${period.amount} OFF`}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

          {/* Add to Cart Button */}
          <div className="rounded-xl bg-white p-8 shadow-md">
            <button
              onClick={handleAddToCart}
              disabled={!selectedPeriod}
              className="flex w-full items-center justify-center gap-3 rounded-lg bg-red-600 px-6 py-4 text-lg font-semibold text-white transition-all duration-200 hover:bg-red-700 hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ShoppingCart className="h-6 w-6" />
              Add to Cart
            </button>
            {selectedPeriod && (
              <div className="mt-4 rounded-lg bg-gray-50 p-3 text-center">
                <p className="text-sm font-medium text-gray-900">
                  Selected: {parseInt(selectedPeriod.duration) / 12} year plan
                </p>
                <p className="mt-1 text-xs text-gray-600">
                  Total: €
                  {(() => {
                    const duration = parseInt(selectedPeriod.duration);
                    const totalPrice = product.price * duration;
                    let discountedPrice = totalPrice;
                    if (selectedPeriod.discount_type === "percent") {
                      discountedPrice =
                        totalPrice - (totalPrice * selectedPeriod.amount) / 100;
                    } else if (selectedPeriod.discount_type === "flat") {
                      discountedPrice = totalPrice - selectedPeriod.amount;
                    }
                    return discountedPrice.toFixed(2);
                  })()}
                </p>
              </div>
            )}
          </div>

          {/* Additional Info */}
          <div className="rounded-xl bg-blue-50 p-6">
            <h3 className="font-semibold text-blue-900">What You Get</h3>
            <ul className="mt-3 space-y-2 text-sm text-blue-800">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                Instant activation after payment
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                24/7 customer support
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                Regular updates included
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                Secure payment processing
              </li>
            </ul>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
