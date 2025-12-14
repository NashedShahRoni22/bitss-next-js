"use client";
import { useState, useEffect } from "react";
import {
  Package,
  Calendar,
  DollarSign,
  User,
  Mail,
  MapPin,
  FileText,
  CheckCircle,
  Clock,
  CreditCard,
  Globe,
  RefreshCw,
  Building2,
  Copy,
  Check,
  AlertCircle,
} from "lucide-react";
import { useParams } from "next/navigation";
import useAuth from "@/hooks/useAuth";

export default function RenewOrderDetails() {
  const { invoiceId } = useParams();
  const { authInfo } = useAuth();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState("stripe");
  const [processingPayment, setProcessingPayment] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const [showRenewSection, setShowRenewSection] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `https://backend.bitss.one/api/v1/orders/order/show/renew/invoice?invoice_id=${invoiceId}`,
          {
            headers: {
              Authorization: `Bearer ${authInfo?.access_token}`,
            },
          },
        );

        const data = await res.json();
        setOrderData(data.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    if (authInfo?.access_token && invoiceId) {
      fetchData();
    }
  }, [invoiceId, authInfo?.access_token]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleRenewOrder = () => {
    setShowRenewSection(true);
    // Scroll to payment section
    setTimeout(() => {
      document.getElementById("payment-section")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const handleStripePayment = async () => {
    setProcessingPayment(true);
    try {
      const response = await fetch(
        "https://backend.bitss.one/api/v1/payment/stripe/renew",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authInfo?.access_token}`,
          },
          body: JSON.stringify({
            invoice_id: invoiceId,
            order_id: orderData.invoice.order.id,
          }),
        },
      );

      const data = await response.json();

      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      }
    } catch (err) {
      console.error("Stripe payment error:", err);
      alert("Failed to process Stripe payment. Please try again.");
    } finally {
      setProcessingPayment(false);
    }
  };

  const bankDetails = {
    bankName: "LCL Bank France",
    iban: "FR62 3000 2030 3700 0007 3125 M63",
    bic: "CRLYFRPP",
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Clock className="text-primary mx-auto mb-4 h-12 w-12 animate-spin" />
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!orderData || !orderData.invoice) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-600">No order data found</p>
      </div>
    );
  }

  const invoice = orderData.invoice;
  const order = invoice.order;
  const orderProduct = invoice.orderProduct;
  const user = invoice.user;
  const product = orderProduct.product;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 rounded-lg bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Renewal Order Details
              </h1>
              <p className="mt-1 text-gray-500">Order #{order.order_number}</p>
            </div>
            {!invoice.paid && !showRenewSection && (
              <button
                onClick={handleRenewOrder}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
              >
                <RefreshCw className="h-5 w-5" />
                Renew Order
              </button>
            )}
          </div>
        </div>

        <div className="mb-8">
          <div className="mb-4 rounded-lg bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Invoice Details
              </h2>
              <div className="flex items-center gap-2">
                {invoice.paid ? (
                  <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Paid
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800">
                    <Clock className="mr-2 h-4 w-4" />
                    Pending
                  </span>
                )}
                <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 capitalize">
                  {order.status}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Method Section - Show when Renew Order is clicked */}
          {showRenewSection && !invoice.paid && (
            <div
              id="payment-section"
              className="mb-6 rounded-lg bg-white p-6 shadow-sm"
            >
              <h2 className="mb-6 text-xl font-semibold text-gray-900">
                Payment Method
              </h2>

              <div className="mb-6 space-y-4">
                {/* Stripe Option */}
                <label
                  className={`flex cursor-pointer items-start gap-4 rounded-lg border-2 p-4 transition-all ${
                    selectedPayment === "stripe"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="stripe"
                    checked={selectedPayment === "stripe"}
                    onChange={(e) => setSelectedPayment(e.target.value)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-blue-600" />
                      <span className="font-semibold text-gray-900">
                        Stripe
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Pay securely with credit/debit card
                    </p>
                  </div>
                </label>

                {/* Bank Transfer Option */}
                <label
                  className={`flex cursor-pointer items-start gap-4 rounded-lg border-2 p-4 transition-all ${
                    selectedPayment === "bank"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="bank"
                    checked={selectedPayment === "bank"}
                    onChange={(e) => setSelectedPayment(e.target.value)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-green-600" />
                      <span className="font-semibold text-gray-900">
                        Bank Transfer
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Direct bank transfer payment
                    </p>
                  </div>
                </label>
              </div>

              {/* Bank Transfer Details */}
              {selectedPayment === "bank" && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-6">
                  <div className="mb-4 flex items-start gap-2">
                    <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
                    <h3 className="font-semibold text-red-900">
                      Bank Transfer Details
                    </h3>
                  </div>

                  <div className="mb-4 space-y-3">
                    <div>
                      <p className="mb-1 text-sm font-medium text-red-900">
                        Bank:
                      </p>
                      <div className="flex items-center justify-between rounded border border-red-200 bg-white p-2">
                        <span className="font-medium text-red-600">
                          {bankDetails.bankName}
                        </span>
                        <button
                          onClick={() =>
                            handleCopy(bankDetails.bankName, "bankName")
                          }
                          className="text-red-600 hover:text-red-700"
                        >
                          {copiedField === "bankName" ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <p className="mb-1 text-sm font-medium text-red-900">
                        IBAN:
                      </p>
                      <div className="flex items-center justify-between rounded border border-red-200 bg-white p-2">
                        <span className="font-mono font-medium text-red-600">
                          {bankDetails.iban}
                        </span>
                        <button
                          onClick={() => handleCopy(bankDetails.iban, "iban")}
                          className="text-red-600 hover:text-red-700"
                        >
                          {copiedField === "iban" ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <p className="mb-1 text-sm font-medium text-red-900">
                        BIC:
                      </p>
                      <div className="flex items-center justify-between rounded border border-red-200 bg-white p-2">
                        <span className="font-mono font-medium text-red-600">
                          {bankDetails.bic}
                        </span>
                        <button
                          onClick={() => handleCopy(bankDetails.bic, "bic")}
                          className="text-red-600 hover:text-red-700"
                        >
                          {copiedField === "bic" ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-red-800">
                    Complete bank details will be provided after order
                    confirmation.
                  </p>
                </div>
              )}

              {/* Action Button */}
              <div className="mt-6">
                {selectedPayment === "stripe" ? (
                  <button
                    onClick={handleStripePayment}
                    disabled={processingPayment}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                  >
                    {processingPayment ? (
                      <>
                        <Clock className="h-5 w-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-5 w-5" />
                        Proceed to Stripe Payment
                      </>
                    )}
                  </button>
                ) : (
                  <div className="py-3 text-center text-gray-600">
                    Please transfer the amount using the bank details above and
                    contact support with your payment receipt.
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <h3 className="mb-4 flex items-center text-xl font-semibold text-gray-900">
                  <Package className="text-primary mr-2 h-5 w-5" />
                  Product Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Product Name</p>
                    <p className="font-medium text-gray-900">{product.name}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Period</p>
                      <p className="text-gray-900">
                        {orderProduct.period} months
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Price</p>
                      <p className="text-gray-900">${orderProduct.price}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Start Date</p>
                      <p className="flex items-center text-gray-900">
                        <Calendar className="mr-1 h-4 w-4 text-gray-400" />
                        {formatDate(orderProduct.start_date)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">End Date</p>
                      <p className="flex items-center text-gray-900">
                        <Calendar className="mr-1 h-4 w-4 text-gray-400" />
                        {formatDate(orderProduct.end_date)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-white p-6 shadow-sm">
                <h3 className="mb-4 flex items-center text-xl font-semibold text-gray-900">
                  <FileText className="text-primary mr-2 h-5 w-5" />
                  Order Details
                </h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Domain</p>
                      <p className="flex items-center text-gray-900">
                        <Globe className="mr-1 h-4 w-4 text-gray-400" />
                        {order.domain}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Country</p>
                      <p className="flex items-center text-gray-900">
                        <MapPin className="mr-1 h-4 w-4 text-gray-400" />
                        {order.country}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Order Type</p>
                      <p className="text-gray-900 capitalize">
                        {order.order_type}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Product Type</p>
                      <p className="text-gray-900 capitalize">
                        {order.product_type}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Created At</p>
                    <p className="text-gray-900">
                      {formatDate(order.created_at)}
                    </p>
                  </div>
                </div>
              </div>

              {orderProduct.product_key &&
                orderProduct.product_key.length > 0 && (
                  <div className="rounded-lg bg-white p-6 shadow-sm">
                    <h3 className="mb-4 text-xl font-semibold text-gray-900">
                      Product Keys
                    </h3>
                    {orderProduct.product_key.map((key, keyIndex) => (
                      <div
                        key={keyIndex}
                        className="mb-3 space-y-2 rounded-lg bg-gray-50 p-4"
                      >
                        <div>
                          <p className="text-sm text-gray-500">Username</p>
                          <p className="font-mono text-gray-900">
                            {key.username}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Security Key</p>
                          <p className="font-mono text-xs break-all text-gray-900">
                            {key.security_key}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
            </div>

            <div className="space-y-6">
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <h3 className="mb-4 flex items-center text-xl font-semibold text-gray-900">
                  <User className="text-primary mr-2 h-5 w-5" />
                  Customer Info
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium text-gray-900">{user.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="flex items-center break-all text-gray-900">
                      <Mail className="mr-1 h-4 w-4 flex-shrink-0 text-gray-400" />
                      {user.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Personal Email</p>
                    <p className="flex items-center break-all text-gray-900">
                      <Mail className="mr-1 h-4 w-4 flex-shrink-0 text-gray-400" />
                      {user.personal_email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="flex items-center text-gray-900">
                      <MapPin className="mr-1 h-4 w-4 flex-shrink-0 text-gray-400" />
                      {user.address}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-white p-6 shadow-sm">
                <h3 className="mb-4 flex items-center text-xl font-semibold text-gray-900">
                  <DollarSign className="text-primary mr-2 h-5 w-5" />
                  Payment Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <p className="text-gray-500">Currency</p>
                    <p className="font-medium text-gray-900">
                      {invoice.currency}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-gray-500">Currency Rate</p>
                    <p className="text-gray-900">{invoice.currency_rate}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-gray-500">Payment Type</p>
                    <p className="flex items-center text-gray-900 capitalize">
                      <CreditCard className="mr-1 h-4 w-4 text-gray-400" />
                      {invoice.payment_type}
                    </p>
                  </div>
                  <div className="mt-3 border-t pt-3">
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-semibold text-gray-900">
                        Total Amount
                      </p>
                      <p className="text-primary text-2xl font-bold">
                        {invoice.currency} {invoice.totalAmount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Issued At</p>
                    <p className="text-gray-900">
                      {formatDate(invoice.issued_at)}
                    </p>
                  </div>
                </div>
              </div>

              {orderProduct.subscription && (
                <div className="rounded-lg bg-white p-6 shadow-sm">
                  <h3 className="mb-4 text-xl font-semibold text-gray-900">
                    Subscription
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <p className="text-gray-500">Duration</p>
                      <p className="text-gray-900">
                        {orderProduct.subscription.duration} months
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-gray-500">Discount</p>
                      <p className="text-gray-900">
                        {orderProduct.subscription.amount} (
                        {orderProduct.subscription.discount_type})
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-gray-500">Status</p>
                      <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 capitalize">
                        {orderProduct.subscription.status}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
