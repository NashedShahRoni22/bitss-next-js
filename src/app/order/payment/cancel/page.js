"use client";
import { XCircle, Package, Home, ArrowLeft, CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PaymentCancelled() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center">
        {/* Cancelled Icon */}
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-100">
          <XCircle className="h-16 w-16 text-red-600" />
        </div>

        {/* Cancelled Message */}
        <h1 className="mb-3 text-3xl font-bold text-gray-900">
          Payment Cancelled
        </h1>
        <p className="mb-8 text-gray-600">
          Your payment was cancelled and no charges were made to your account.
        </p>

        {/* Info Card */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow-lg">
          <div className="mb-4 flex items-start gap-3 text-left">
            <CreditCard className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-500" />
            <div>
              <p className="font-medium text-gray-900">No Charges Made</p>
              <p className="text-sm text-gray-600">
                Your payment method was not charged.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 text-left">
            <Package className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-500" />
            <div>
              <p className="font-medium text-gray-900">Order Not Processed</p>
              <p className="text-sm text-gray-600">
                Your renewal was not completed. You can try again anytime.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => router.push("/products")}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
          >
            <ArrowLeft className="h-5 w-5" />
            Try Again
          </button>
          <button
            onClick={() => router.push("/")}
            className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            <Home className="h-5 w-5" />
            Go to Homepage
          </button>
        </div>
      </div>
    </div>
  );
}
