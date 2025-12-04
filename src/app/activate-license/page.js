'use client'
import Link from "next/link";
import { useState } from "react";
import {
  KeyRound,
  CheckCircle,
  XCircle,
  Loader2,
  Shield,
  ArrowRight,
} from "lucide-react";
import useAuth from "@/hooks/useAuth";
import { postApi } from "@/api/api";
import SectionContainer from "@/components/shared/SectionContainer";
import PrivateRoute from "@/components/shared/PrivateRoute";

export default function ActivateLicense() {
  const { authInfo } = useAuth();
  const token = authInfo?.access_token;

  const [productKey, setProductKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset states
    setError("");
    setResponse(null);

    // Validation
    if (!productKey.trim()) {
      setError("Please enter a product key");
      return;
    }

    setLoading(true);

    try {
      const result = await postApi({
        endpoint: "/orders/order/distributor/confirm",
        payload: { product_key: productKey.trim() },
        token: token,
      });

      if (result) {
        setResponse(result);
        if (result.success || result.status === "success" || result.message) {
          setProductKey(""); // Clear input on success
        }
      } else {
        setError("Failed to activate license. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PrivateRoute>
      <SectionContainer>
        <div className="mx-auto max-w-6xl">
          {/* Header Section */}
          <div className="mb-16 text-center">
            <div className="mb-6 inline-flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-400 to-red-600 opacity-50 blur-xl"></div>
                <div className="relative rounded-2xl bg-gradient-to-br from-red-500 to-red-600 p-6 shadow-2xl">
                  <KeyRound className="h-10 w-10 text-white sm:h-12 sm:w-12" />
                </div>
              </div>
            </div>
            <h1 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
              Activate Your License
            </h1>
            <p className="mx-auto max-w-2xl text-xl text-gray-600">
              Enter your product key below to unlock full access to BITSS
              security features
            </p>
          </div>

          <div className="grid items-start gap-8 lg:grid-cols-2">
            {/* Left Column - Form */}
            <div className="order-1 lg:order-1">
              <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white">
                <div className="p-8 sm:p-10">
                  <div className="mb-8">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="h-2 w-2 animate-pulse rounded-full bg-red-500"></div>
                      <span className="text-sm font-semibold uppercase tracking-wider text-red-600">
                        License Activation
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Enter Product Key
                    </h2>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label
                        htmlFor="productKey"
                        className="mb-3 block text-sm font-semibold text-gray-700"
                      >
                        Product Key
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="productKey"
                          value={productKey}
                          onChange={(e) => setProductKey(e.target.value)}
                          placeholder="F1CX027K7MHN1YK6Y561"
                          className="w-full rounded-xl border-2 border-gray-200 px-5 py-4 font-mono text-base outline-none transition-all duration-200 focus:border-red-500 focus:ring-4 focus:ring-red-100 disabled:cursor-not-allowed disabled:bg-gray-50"
                          disabled={loading}
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                          <KeyRound className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                      <p className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                        <Shield className="h-4 w-4" />
                        Your product key is encrypted and secure
                      </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                      <div className="animate-in fade-in slide-in-from-top-2 flex items-start gap-3 rounded-xl border-2 border-red-200 bg-red-50 p-4 duration-300">
                        <XCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
                        <p className="text-sm font-medium text-red-800">
                          {error}
                        </p>
                      </div>
                    )}

                    {/* Success Message */}
                    {response &&
                      (response.success || response.status === "success") && (
                        <div className="animate-in fade-in slide-in-from-top-2 flex items-start gap-3 rounded-xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-5 duration-300">
                          <CheckCircle className="mt-0.5 h-6 w-6 flex-shrink-0 text-green-600" />
                          <div className="flex-1">
                            <p className="mb-1 text-base font-bold text-green-900">
                              License Activated Successfully!
                            </p>
                            {response.message && (
                              <p className="text-sm text-green-700">
                                {response.message}
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                    {/* Response Message (if not success) */}
                    {response &&
                      !response.success &&
                      response.status !== "success" && (
                        <div className="animate-in fade-in slide-in-from-top-2 flex items-start gap-3 rounded-xl border-2 border-amber-200 bg-amber-50 p-4 duration-300">
                          <XCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
                          <p className="text-sm font-medium text-amber-900">
                            {response.message ||
                              "Unable to activate license. Please check your product key."}
                          </p>
                        </div>
                      )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 font-bold text-white shadow-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-red-200 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-red-700 to-red-800 opacity-0 transition-opacity duration-200 group-hover:opacity-100"></div>
                      <div className="relative flex items-center justify-center gap-3">
                        {loading ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>Activating License...</span>
                          </>
                        ) : (
                          <>
                            <span>Activate License</span>
                            <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                          </>
                        )}
                      </div>
                    </button>
                  </form>
                </div>

                {/* Help Section */}
                <div className="border-t border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 px-8 py-6 sm:px-10">
                  <p className="text-center text-sm text-gray-600">
                    Need assistance?{" "}
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-1 font-semibold text-red-600 transition-colors duration-200 hover:text-red-700"
                    >
                      Contact our support team
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Benefits */}
            <div className="order-2 space-y-6 lg:order-2">
              <div className="rounded-3xl border border-gray-200 bg-white p-8">
                <h3 className="mb-6 text-xl font-bold text-gray-900">
                  What You&apos;ll Get
                </h3>
                <div className="space-y-5">
                  {[
                    {
                      icon: Shield,
                      title: "Complete Security Protection",
                      description:
                        "Full access to all BITSS security features and updates",
                    },
                    {
                      icon: CheckCircle,
                      title: "Instant Activation",
                      description:
                        "Your license activates immediately upon verification",
                    },
                    {
                      icon: KeyRound,
                      title: "Lifetime Support",
                      description:
                        "Access to our dedicated support team whenever you need help",
                    },
                  ].map((benefit, index) => (
                    <div key={index} className="group flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-100 to-pink-100 transition-transform duration-200 group-hover:scale-110">
                          <benefit.icon className="h-6 w-6 text-red-600" />
                        </div>
                      </div>
                      <div>
                        <h4 className="mb-1 font-semibold text-gray-900">
                          {benefit.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security Badge */}
              <div className="rounded-3xl bg-gradient-to-br from-red-600 to-red-700 p-8 text-white shadow-xl">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                      <Shield className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h4 className="mb-2 text-lg font-bold">
                      Secure & Encrypted
                    </h4>
                    <p className="text-sm leading-relaxed text-red-100">
                      Your product key is transmitted using industry-standard
                      encryption. We never store or share your activation data.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionContainer>
    </PrivateRoute>
  );
}
