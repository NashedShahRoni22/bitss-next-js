"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";
import SectionContainer from "@/components/shared/SectionContainer";
import PrivateRoute from "@/components/shared/PrivateRoute";

export default function OrderDetails() {
  const { orderId } = useParams();
  const { authInfo } = useAuth();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/orders/order/show/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${authInfo?.access_token}`,
            },
          },
        );
        const data = await res.json();

        setOrderData(data);
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, authInfo]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount, currency = "XAF") => {
    return `${amount} ${currency}`;
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "expired":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Fixed price calculation function
  const calculateItemPrice = (item) => {
    // Use the price from the item directly if available
    if (item.price) {
      return parseFloat(item.price) * parseFloat(item.period || 1);
    }

    // Fallback to product price
    const basePrice = parseFloat(item.product?.price || 0);
    const period = parseFloat(item.period || 1);
    return basePrice * period;
  };

  // Calculate discounted price
  const calculateDiscountedPrice = (item) => {
    const originalPrice = calculateItemPrice(item);

    if (!item.subscription || !item.subscription.amount) {
      return originalPrice;
    }

    const discountAmount = parseFloat(item.subscription.amount || 0);

    if (item.subscription.discount_type === "percent") {
      return originalPrice - (originalPrice * discountAmount) / 100;
    } else {
      // Fixed amount discount
      return originalPrice - discountAmount;
    }
  };

  const handleRenewSubscription = (productId) => {
    // Add your renew subscription logic here
    console.log("Renewing subscription for product:", productId);
  };

  if (loading) {
    return (
      <PrivateRoute>
        <SectionContainer>
          <div className="flex min-h-64 items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-red-500"></div>
          </div>
        </SectionContainer>
      </PrivateRoute>
    );
  }

  if (!orderData?.success) {
    return (
      <PrivateRoute>
        <SectionContainer>
          <div className="py-12 text-center">
            <p className="text-gray-500">Order not found</p>
          </div>
        </SectionContainer>
      </PrivateRoute>
    );
  }

  const order = orderData.data;

  return (
    <PrivateRoute>
      <SectionContainer>
        {/* Header */}
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h1 className="mb-2 text-2xl font-bold text-gray-900">
                Order Details
              </h1>
              <p className="text-gray-600">
                Manage your cybersecurity subscriptions and business
              </p>
            </div>
            <div className="text-right">
              <span
                className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${getStatusColor(
                  order.status,
                )}`}
              >
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-lg bg-gray-50 p-4">
              <h3 className="mb-1 text-sm font-medium text-gray-500">
                Order Number
              </h3>
              <p className="text-lg font-semibold text-gray-900">
                {order.order_number}
              </p>
            </div>
            <div className="rounded-lg bg-gray-50 p-4">
              <h3 className="mb-1 text-sm font-medium text-gray-500">
                Order Date
              </h3>
              <p className="text-lg font-semibold text-gray-900">
                {formatDate(order.created_at)}
              </p>
            </div>
            <div className="rounded-lg bg-gray-50 p-4">
              <h3 className="mb-1 text-sm font-medium text-gray-500">
                Total Amount
              </h3>
              <p className="text-lg font-semibold text-red-500">
                {formatCurrency(order.totalPrice, order.currency)}
              </p>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Customer Information
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <h3 className="mb-1 text-sm font-medium text-gray-500">Name</h3>
              <p className="text-gray-900">{order.user.name}</p>
            </div>
            <div>
              <h3 className="mb-1 text-sm font-medium text-gray-500">Email</h3>
              <p className="text-gray-900">{order.user.email}</p>
            </div>
            <div>
              <h3 className="mb-1 text-sm font-medium text-gray-500">
                Country
              </h3>
              <p className="text-gray-900">{order.country}</p>
            </div>
            <div>
              <h3 className="mb-1 text-sm font-medium text-gray-500">Domain</h3>
              <p className="break-all text-gray-900">{order.domain}</p>
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Products ({order.products.length})
          </h2>
          <div className="space-y-6">
            {order.products.map((item) => {
              const discountedPrice = calculateDiscountedPrice(item);
              const originalPrice = calculateItemPrice(item);

              return (
                <div
                  key={item._id}
                  className="rounded-lg border border-gray-200 p-6"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-gray-900 capitalize">
                          {item.product.name}
                        </h3>
                        <span className="text-sm text-gray-500">
                          ({item.product.category.name})
                        </span>
                      </div>
                      <p className="mb-3 text-sm text-gray-600">
                        {item.product.category.sort_description}
                      </p>

                      {/* Subscription Details */}
                      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="rounded bg-gray-50 p-3">
                          <p className="mb-1 text-xs text-gray-500">
                            Subscription Period
                          </p>
                          <p className="font-medium">
                            {item.period / 12} Year
                            {item.period / 12 > 1 ? "s" : ""}{" "}
                          </p>
                        </div>
                        <div className="rounded bg-gray-50 p-3">
                          <p className="mb-1 text-xs text-gray-500">
                            Start Date
                          </p>
                          <p className="font-medium">
                            {formatDate(item.start_date)}
                          </p>
                        </div>
                        <div className="rounded bg-gray-50 p-3">
                          <p className="mb-1 text-xs text-gray-500">End Date</p>
                          <p className="font-medium">
                            {formatDate(item.end_date)}
                          </p>
                        </div>
                      </div>

                      {/* Discount Information */}
                      {item.subscription && item.subscription.amount > 0 && (
                        <div className="mb-4 rounded border border-green-200 bg-green-50 p-3">
                          <p className="text-sm text-green-800">
                            <span className="font-medium">
                              Discount Applied:
                            </span>
                            {item.subscription.discount_type === "percent"
                              ? ` ${item.subscription.amount}% off`
                              : ` ${formatCurrency(
                                  item.subscription.amount,
                                  order.currency,
                                )} off`}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="ml-6 text-right">
                      <p className="text-2xl font-bold text-red-500">
                        {formatCurrency(
                          discountedPrice.toFixed(2),
                          order.currency,
                        )}
                      </p>
                      {originalPrice !== discountedPrice && (
                        <p className="text-sm text-gray-500 line-through">
                          Original:{" "}
                          {formatCurrency(
                            originalPrice.toFixed(2),
                            order.currency,
                          )}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Product Features */}
                  {item.product.product_details &&
                    item.product.product_details.length > 0 && (
                      <div>
                        <h4 className="mb-2 font-medium text-gray-900">
                          Features Included:
                        </h4>
                        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                          {item.product.product_details.map(
                            (detail, detailIndex) => (
                              <div
                                key={detailIndex}
                                className="flex items-center text-sm text-gray-700"
                              >
                                <svg
                                  className="mr-2 h-4 w-4 shrink-0 text-green-500"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                                {detail}
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    )}

                  {/* Conditional Renew Subscription Button */}
                  {item.subscription &&
                    item.subscription.status !== "active" && (
                      <div className="mt-4 border-t pt-4">
                        <button
                          onClick={() =>
                            handleRenewSubscription(item.product._id)
                          }
                          className="rounded-lg bg-red-500 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600"
                        >
                          Renew Subscription
                        </button>
                      </div>
                    )}
                </div>
              );
            })}
          </div>
        </div>
      </SectionContainer>
    </PrivateRoute>
  );
}
