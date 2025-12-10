"use client";
import React, { useState, useEffect } from "react";
import {
  Shield,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  CreditCard,
  Package,
  AlertCircle,
  RefreshCw,
  Filter,
  ChevronDown,
} from "lucide-react";
import useAuth from "@/hooks/useAuth";

export default function RenewOrders() {
  const { authInfo } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, pending, paid
  const [sortBy, setSortBy] = useState("newest"); // newest, oldest

  useEffect(() => {
    fetchRenewOrders();
  }, []);

  const fetchRenewOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://backend.bitss.one/api/v1/orders/order/customer/renew/invoice/list",
        {
          headers: {
            Authorization: `Bearer ${authInfo?.access_token}`,
          },
        },
      );

      const result = await response.json();

      if (result.success) {
        setOrders(result.data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const calculateDaysLeft = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return diff;
  };

  // Flatten all invoices for filtering
  const allInvoices = orders.flatMap((order) =>
    order.invoices.map((invoice) => ({
      ...invoice,
      order_number: order.order_number,
    })),
  );

  // Apply filters
  const filteredInvoices = allInvoices.filter((invoice) => {
    if (filter === "paid") return invoice.paid;
    if (filter === "pending") return !invoice.paid;
    return true;
  });

  // Apply sorting
  const sortedInvoices = [...filteredInvoices].sort((a, b) => {
    const dateA = new Date(a.issued_at);
    const dateB = new Date(b.issued_at);
    return sortBy === "newest" ? dateB - dateA : dateA - dateB;
  });

  const stats = {
    total: allInvoices.length,
    pending: allInvoices.filter((inv) => !inv.paid).length,
    active: allInvoices.filter((inv) => inv.paid).length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-3">
            <div className="bg-primary flex h-12 w-12 items-center justify-center rounded-xl">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-dark text-3xl font-bold">
                My Renewal Orders
              </h1>
              <p className="text-gray-600">
                Manage your cybersecurity subscriptions and renewals
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="border-primary rounded-xl border-l-4 bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-1 text-sm text-gray-600">Total Orders</p>
                <p className="text-dark text-3xl font-bold">{stats.total}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-50">
                <Package className="text-primary h-6 w-6" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border-l-4 border-orange-500 bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-1 text-sm text-gray-600">Pending Payment</p>
                <p className="text-3xl font-bold text-orange-600">
                  {stats.pending}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-50">
                <Clock className="h-6 w-6 text-orange-500" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border-l-4 border-green-500 bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-1 text-sm text-gray-600">Active Licenses</p>
                <p className="text-3xl font-bold text-green-600">
                  {stats.active}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-50">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 rounded-xl bg-white p-4">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <Filter className="h-5 w-5 text-gray-500" />
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter("all")}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    filter === "all"
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All Orders
                </button>
                <button
                  onClick={() => setFilter("pending")}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    filter === "pending"
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setFilter("paid")}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    filter === "paid"
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Active
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border-primary focus:border-primary rounded-lg border bg-white px-3 py-2 text-sm focus:outline-none"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {loading ? (
            <div className="rounded-xl bg-white p-12 text-center">
              <RefreshCw className="text-primary mx-auto mb-4 h-12 w-12 animate-spin" />
              <p className="text-gray-600">Loading your renewal orders...</p>
            </div>
          ) : sortedInvoices.length === 0 ? (
            <div className="rounded-xl bg-white p-12 text-center">
              <Package className="mx-auto mb-4 h-16 w-16 text-gray-300" />
              <h3 className="text-dark mb-2 text-xl font-bold">
                No renewal orders found
              </h3>
              <p className="text-gray-600">
                You don&apos;t have any {filter !== "all" ? filter : ""} renewal
                orders yet.
              </p>
            </div>
          ) : (
            sortedInvoices.map((invoice) => {
              const daysLeft = calculateDaysLeft(invoice.end_date);
              const isExpiringSoon = daysLeft <= 30 && daysLeft > 0;
              const isExpired = daysLeft < 0;

              return (
                <div
                  key={invoice._id}
                  className="overflow-hidden rounded-xl bg-white transition-shadow"
                >
                  {/* Badge for issues count */}
                  <div className="bg-accent flex items-center justify-between px-4 py-2">
                    <div className="flex items-center gap-2">
                      <span className="bg-primary rounded px-2 py-1 text-xs font-semibold text-white">
                        1 ISSUE
                      </span>
                      <span className="text-sm font-medium text-white">
                        Order #{invoice.order_number}
                      </span>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        invoice.paid
                          ? "bg-green-500 text-white"
                          : "bg-orange-500 text-white"
                      }`}
                    >
                      {invoice.paid ? "Active" : "Pending"}
                    </span>
                  </div>

                  <div className="p-6">
                    {/* Order Header */}
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-red-50">
                          <Shield className="text-primary h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="text-dark mb-1 text-lg font-bold">
                            {invoice.product.name}
                          </h3>
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{formatDate(invoice.issued_at)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <CreditCard className="h-4 w-4" />
                              <span className="capitalize">
                                {invoice.payment_type}
                              </span>
                            </div>
                            {invoice.order.domain && (
                              <div className="flex items-center gap-1">
                                <span className="text-gray-400">•</span>
                                <span>{invoice.order.domain}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-dark mb-1 text-2xl font-bold">
                          {invoice.totalAmount.toFixed(2)} {invoice.currency}
                        </div>
                        <div className="text-sm text-gray-600">
                          {invoice.order.domain
                            ? invoice.order.domain.split(".")[1]?.toUpperCase()
                            : "N/A"}
                        </div>
                      </div>
                    </div>

                    {/* Dates Section */}
                    <div className="mb-4 rounded-lg bg-gray-50 p-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="mb-1 text-xs tracking-wide text-gray-500 uppercase">
                            Start Date
                          </p>
                          <p className="text-dark text-sm font-semibold">
                            {formatDate(invoice.issued_at)}
                          </p>
                        </div>
                        <div>
                          <p className="mb-1 text-xs tracking-wide text-gray-500 uppercase">
                            End Date
                          </p>
                          <p className="text-dark text-sm font-semibold">
                            {formatDate(invoice.end_date)}
                          </p>
                        </div>
                      </div>

                      {/* Days Left Indicator */}
                      {!invoice.paid && (
                        <div className="mt-4 border-t border-gray-200 pt-4">
                          <div className="flex items-center gap-2">
                            {isExpired ? (
                              <>
                                <XCircle className="h-5 w-5 text-red-500" />
                                <span className="text-sm font-medium text-red-600">
                                  Expired {Math.abs(daysLeft)} days ago
                                </span>
                              </>
                            ) : isExpiringSoon ? (
                              <>
                                <AlertCircle className="h-5 w-5 text-orange-500" />
                                <span className="text-sm font-medium text-orange-600">
                                  Expires in {daysLeft} days
                                </span>
                              </>
                            ) : (
                              <>
                                <Clock className="h-5 w-5 text-blue-500" />
                                <span className="text-sm font-medium text-blue-600">
                                  {daysLeft} days remaining
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Payment Status */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {invoice.paid ? (
                          <>
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <span className="text-sm font-medium text-green-700">
                              ✓ Paid via {invoice.payment_type}
                            </span>
                          </>
                        ) : (
                          <>
                            <Clock className="h-5 w-5 text-orange-500" />
                            <span className="text-sm font-medium text-orange-600">
                              Awaiting payment confirmation
                            </span>
                          </>
                        )}
                      </div>

                      <button
                        onClick={() =>
                          (window.location.href = `/dashboard/renew/invoice/${invoice._id}`)
                        }
                        className="bg-primary hover:bg-primary-hover flex items-center gap-2 rounded-lg px-4 py-2 font-medium text-white transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                        View Order Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Help Section */}
        {sortedInvoices.length > 0 && (
          <div className="mt-8 rounded-xl border border-blue-200 bg-blue-50 p-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="mt-1 h-6 w-6 shrink-0 text-blue-600" />
              <div>
                <h3 className="text-dark mb-2 text-lg font-bold">Need Help?</h3>
                <p className="mb-3 text-gray-700">
                  If you have any questions about your renewal orders or need
                  assistance with payment, please contact our support team.
                </p>
                <button className="text-primary font-medium hover:underline">
                  Contact Support →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
