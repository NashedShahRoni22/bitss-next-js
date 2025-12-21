"use client";
import { useEffect, useState } from "react";
import {
  Box,
  CheckCircle,
  Loader2,
  LoaderCircle,
  Package,
  Shield,
} from "lucide-react";
import SectionContainer from "@/components/shared/SectionContainer";
import { postApi } from "@/api/api";
import useAuth from "@/hooks/useAuth";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function BitssRetailPacks() {
  const router = useRouter();
  const { authInfo } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    address: "",
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `https://backend.bitss.one/api/v1/products/product/show/690718729ddffc5f45c8c449`,
        );
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to fetch product");
        }

        if (result.success && result.data) {
          setProduct(result.data);

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
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, []);

  const calculatePrice = () => {
    if (!product || !selectedPeriod) return 0;

    const basePrice = product.price * parseInt(selectedPeriod.duration);
    let discount = 0;

    if (selectedPeriod.discount_type === "percent") {
      discount = (basePrice * selectedPeriod.amount) / 100;
    } else {
      discount = selectedPeriod.amount;
    }

    return (basePrice - discount).toFixed(2);
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Invalid email format";
    }
    if (!formData.phone.trim()) errors.phone = "Phone number is required";
    if (!formData.country.trim()) errors.country = "Country is required";
    if (!formData.address.trim()) errors.address = "Address is required";
    if (!selectedPeriod) errors.period = "Please select a subscription period";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!authInfo?.access_token) {
      return router.push("/login?redirect=/bitss-retail-packs");
    }

    if (!validateForm()) return;

    setSubmitting(true);

    try {
      const payload = {
        full_name: formData.name,
        email: formData.email,
        phone: formData.phone,
        country: formData.country,
        address: formData.address,
        package_name: product.name,
        duration: selectedPeriod.duration,
        package_price: calculatePrice(),
      };

      const response = await postApi({
        endpoint: "/orders/order/retail/package",
        payload,
        token: authInfo?.access_token,
      });

      if (response.success) {
        toast.success("Order placed successfully! We'll contact you soon.");
        setSubmitting(false);
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          country: "",
          address: "",
        });
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Something went wrong while processing your order.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Loading State
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

  // Error State
  if (error) {
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
        </div>
      </div>
    );
  }

  // Main Content
  return (
    <SectionContainer>
      <div className="mx-auto w-full max-w-7xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-600">
            <Box className="h-8 w-8 text-white" />
          </div>
          <h1 className="mb-2 text-4xl font-bold text-gray-900">
            Order {product?.name}
          </h1>
          <p className="text-lg text-gray-600">
            Fill in your details and we&apos;ll deliver to your doorstep
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Product Details Card */}
          <div className="overflow-hidden rounded bg-white shadow">
            <div className="bg-linear-to-r from-red-600 to-indigo-600 p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-white/20">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="mb-2 text-2xl font-bold text-white">
                    {product?.name}
                  </h2>
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1">
                    <span className="text-sm font-medium text-white">
                      {product?.category?.name}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Features */}
              <div className="mb-6">
                <h3 className="mb-3 text-lg font-semibold text-gray-900">
                  Product Features
                </h3>
                <ul className="space-y-2">
                  {product?.product_details?.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Subscription Periods */}
              <div>
                <h3 className="mb-3 text-lg font-semibold text-gray-900">
                  Select Subscription Period
                </h3>
                <div className="space-y-2">
                  {product?.subscription_periods?.map((period) => {
                    const isSelected = selectedPeriod?._id === period._id;
                    const monthlyPrice =
                      product.price * parseInt(period.duration);
                    const discount =
                      period.discount_type === "percent"
                        ? (monthlyPrice * period.amount) / 100
                        : period.amount;
                    const finalPrice = (monthlyPrice - discount).toFixed(2);

                    return (
                      <button
                        key={period._id}
                        onClick={() => {
                          setSelectedPeriod(period);
                          if (formErrors.period) {
                            setFormErrors((prev) => ({ ...prev, period: "" }));
                          }
                        }}
                        className={`w-full rounded-lg border-2 p-4 transition-all ${
                          isSelected
                            ? "border-red-600 bg-red-50 shadow-md"
                            : "border-gray-200 bg-white hover:border-red-300"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="text-left">
                            <p className="font-semibold text-gray-900">
                              {period.duration} Months
                            </p>
                            {period.amount > 0 && (
                              <p className="text-sm font-medium text-green-600">
                                Save {period.amount}
                                {period.discount_type === "percent" ? "%" : "€"}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-red-600">
                              €{finalPrice}
                            </p>
                            {discount > 0 && (
                              <p className="text-sm text-gray-500 line-through">
                                €{monthlyPrice.toFixed(2)}
                              </p>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
                {formErrors.period && (
                  <p className="mt-2 text-sm text-red-500">
                    {formErrors.period}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Order Form Card */}
          <div className="rounded bg-white p-6 shadow lg:p-8">
            <h3 className="mb-6 text-2xl font-bold text-gray-900">
              Delivery Information
            </h3>

            <div className="space-y-5">
              {/* Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-red-500 focus:outline-none ${
                    formErrors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="John Doe"
                />
                {formErrors.name && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-red-500 focus:outline-none ${
                    formErrors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="john.doe@example.com"
                />
                {formErrors.email && (
                  <p className="mt-1 text-sm text-red-500">
                    {formErrors.email}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-red-500 focus:outline-none ${
                    formErrors.phone ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="+1 234 567 8900"
                />
                {formErrors.phone && (
                  <p className="mt-1 text-sm text-red-500">
                    {formErrors.phone}
                  </p>
                )}
              </div>

              {/* Country */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Country <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className={`w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-red-500 focus:outline-none ${
                    formErrors.country ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="United States"
                />
                {formErrors.country && (
                  <p className="mt-1 text-sm text-red-500">
                    {formErrors.country}
                  </p>
                )}
              </div>

              {/* Address */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Full Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="3"
                  className={`w-full resize-none rounded-lg border px-4 py-3 focus:ring-2 focus:ring-red-500 focus:outline-none ${
                    formErrors.address ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Street address, apartment, suite, unit, building, floor, etc."
                />
                {formErrors.address && (
                  <p className="mt-1 text-sm text-red-500">
                    {formErrors.address}
                  </p>
                )}
              </div>

              {/* Order Summary */}
              <div className="rounded-lg border border-red-200 bg-linear-to-r from-red-50 to-indigo-50 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Selected Period:
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {selectedPeriod?.duration || "N/A"} Months
                  </span>
                </div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Discount:
                  </span>
                  <span className="text-sm font-semibold text-green-600">
                    {selectedPeriod?.amount || 0}
                    {selectedPeriod?.discount_type === "percent" ? "%" : "$"}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-red-200 pt-2">
                  <span className="text-base font-bold text-gray-900">
                    Total Price:
                  </span>
                  <span className="text-2xl font-bold text-red-600">
                    €{calculatePrice()}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-linear-to-r from-red-600 to-indigo-600 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:from-red-700 hover:to-indigo-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <LoaderCircle className="animate-spin" />
                    Processing Order...
                  </>
                ) : (
                  <>
                    <Box />
                    Place Order
                  </>
                )}
              </button>

              <p className="mt-4 text-center text-xs text-gray-500">
                By placing this order, you agree to our terms and conditions.
                We&apos;ll contact you within 24-48 hours to confirm your order.
              </p>
            </div>
          </div>
        </div>

        {/* Product Description Here   */}
        <h5 className="mt-16 mb-8 text-center text-3xl font-semibold text-gray-900">
          Learn more about{" "}
          <span className="text-primary">{product?.name}</span>{" "}
        </h5>
        <div dangerouslySetInnerHTML={{ __html: product?.description }} />

        {/* Additional Info */}
        <div className="mt-12 rounded-2xl bg-white p-8 shadow-xl">
          <div className="grid gap-6 text-center md:grid-cols-3">
            <div>
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h4 className="mb-1 font-semibold text-gray-900">
                Secure Payment
              </h4>
              <p className="text-sm text-gray-600">
                Your information is safe with us
              </p>
            </div>
            <div>
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h4 className="mb-1 font-semibold text-gray-900">
                Fast Delivery
              </h4>
              <p className="text-sm text-gray-600">
                Worldwide shipping available
              </p>
            </div>
            <div>
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                <svg
                  className="h-6 w-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h4 className="mb-1 font-semibold text-gray-900">24/7 Support</h4>
              <p className="text-sm text-gray-600">
                We&apos;re here to help anytime
              </p>
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
