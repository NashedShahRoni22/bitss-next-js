"use client";
import { CheckCircle, Package, Home, Mail, Box } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PaymentSuccess() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center">
        {/* Success Icon */}
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-16 w-16 text-green-600" />
        </div>

        {/* Success Message */}
        <h1 className="mb-3 text-3xl font-bold text-gray-900">
          Order Renewed Successfully!
        </h1>
        <p className="mb-8 text-gray-600">
          Your renewal has been confirmed and is being processed.
        </p>

        {/* Info Card */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow-lg">
          <div className="mb-4 flex items-start gap-3 text-left">
            <Mail className="text-primary mt-0.5 h-5 w-5 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-900">Confirmation Sent</p>
              <p className="text-sm text-gray-600">
                Check your email for order details and receipt.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 text-left">
            <Package className="text-primary mt-0.5 h-5 w-5 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-900">Order Processing</p>
              <p className="text-sm text-gray-600">
                Your product will be available in your dashboard shortly.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => router.push("/products")}
            className="bg-primary hover:bg-primary-hover flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3 font-medium text-white transition-colors"
          >
            <Box className="h-5 w-5" />
            Explore More Products
          </button>
          <button
            onClick={() => router.push("/my-orders")}
            className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            <Package className="h-5 w-5" />
            View My Orders
          </button>
        </div>
      </div>
    </div>
  );
}
