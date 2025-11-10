"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Calendar,
  CircleAlert,
  Clock,
  CreditCard,
  Eye,
  Filter,
  Package,
  Search,
  Shield,
} from "lucide-react";
import PrivateRoute from "@/components/shared/PrivateRoute";
import SectionContainer from "@/components/shared/SectionContainer";
import OrderProduct from "@/components/MyOrders/OrderProduct";
import useAuth from "@/hooks/useAuth";
import formatDate from "@/utils/formatDate";
import formatCurrency from "@/utils/FormatCurrency";

const MyOrders = () => {
  const { authInfo } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/orders/order/index`,
          {
            headers: {
              Authorization: `Bearer ${authInfo?.access_token}`,
            },
          }
        );
        const data = await res.json();
        if (data.success) {
          setOrders(data.data);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    if (authInfo?.access_token) {
      fetchOrders();
    }
  }, [authInfo]);

  const getStatusInfo = (status, isPaid) => {
    if (status === "active" && isPaid) {
      return {
        label: "Active",
        color: "bg-green-50 text-green-700 border-green-200",
        icon: CircleAlert,
        iconColor: "text-green-600",
      };
    } else if (status === "pending" || !isPaid) {
      return {
        label: "Pending Payment",
        color: "bg-orange-50 text-orange-700 border-orange-200",
        icon: Clock,
        iconColor: "text-orange-600",
      };
    } else {
      return {
        label: "Inactive",
        color: "bg-gray-50 text-gray-700 border-gray-200",
        icon: CircleAlert,
        iconColor: "text-gray-600",
      };
    }
  };

  // Fixed search functionality
  const filteredOrders = orders.filter((order) => {
    const searchTermLower = searchTerm.toLowerCase();

    // Search in order number
    const matchesOrderNumber = order.order_number
      ?.toLowerCase()
      .includes(searchTermLower);

    // Search in product names and categories - Fixed the path
    const matchesProduct = order.products?.some((productOrder) => {
      const productName = productOrder.product?.name?.toLowerCase() || "";
      const categoryName =
        productOrder.product?.category?.name?.toLowerCase() || "";
      return (
        productName.includes(searchTermLower) ||
        categoryName.includes(searchTermLower)
      );
    });

    // Search in domain
    const matchesDomain = order.domain?.toLowerCase().includes(searchTermLower);

    const matchesSearch = matchesOrderNumber || matchesProduct || matchesDomain;

    // Filter by status
    const orderStatus = order.invoices?.[0]?.paid ? "active" : "pending";
    const matchesFilter =
      filterStatus === "all" || orderStatus === filterStatus;

    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <SectionContainer>
        <div className="flex min-h-96 items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
            <p className="text-dark">Loading your orders...</p>
          </div>
        </div>
      </SectionContainer>
    );
  }

  return (
    <PrivateRoute>
      <SectionContainer>
        <div className="min-h-screen bg-custom-white">
          <div className="container mx-auto max-w-6xl px-4 py-8">
            {/* Header */}
            <div className="mb-8">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-xl bg-primary/10 p-3">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-dark">
                    My Security Orders
                  </h1>
                  <p className="mt-1 text-lg text-accent">
                    Manage your cybersecurity subscriptions and licenses
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-accent">
                      Active Licenses
                    </p>
                    <p className="mt-1 text-3xl font-bold text-primary">
                      {
                        orders.filter((order) => order.invoices?.[0]?.paid)
                          .length
                      }
                    </p>
                  </div>
                  <div className="rounded-xl bg-green-50 p-3">
                    <CircleAlert className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-accent">
                      Pending Orders
                    </p>
                    <p className="mt-1 text-3xl font-bold text-primary">
                      {
                        orders.filter((order) => !order.invoices?.[0]?.paid)
                          .length
                      }
                    </p>
                  </div>
                  <div className="rounded-xl bg-orange-50 p-3">
                    <Clock className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-accent">
                      Total Orders
                    </p>
                    <p className="mt-1 text-3xl font-bold text-primary">
                      {orders.length}
                    </p>
                  </div>
                  <div className="rounded-xl bg-primary/10 p-3">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="mb-8 flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 transform text-accent" />
                <input
                  type="text"
                  placeholder="Search by order number, product name, category, or domain..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 py-4 pl-12 pr-4 text-dark focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="flex items-center gap-3">
                <Filter className="h-5 w-5 text-accent" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="min-w-[160px] rounded-xl border border-gray-200 px-6 py-4 text-dark focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="all">All Orders</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>

            {/* Orders List */}
            <div className="space-y-6">
              {filteredOrders.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-50 p-4">
                    <Package className="h-10 w-10 text-accent" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-dark">
                    No orders found
                  </h3>
                  <p className="text-accent">
                    {searchTerm || filterStatus !== "all"
                      ? "Try adjusting your search or filter criteria."
                      : "You haven't made any purchases yet."}
                  </p>
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="mt-4 text-primary hover:underline"
                    >
                      Clear search
                    </button>
                  )}
                </div>
              ) : (
                <>
                  {/* Show search results count */}
                  {searchTerm && (
                    <div className="mb-4 text-sm text-accent">
                      Found {filteredOrders.length} order
                      {filteredOrders.length !== 1 ? "s" : ""}
                      {searchTerm && ` matching "${searchTerm}"`}
                      {filterStatus !== "all" &&
                        ` with status "${filterStatus}"`}
                    </div>
                  )}

                  {filteredOrders.map((order) => {
                    const invoice = order.invoices?.[0];
                    const statusInfo = getStatusInfo(
                      order.status,
                      invoice?.paid
                    );
                    const StatusIcon = statusInfo.icon;

                    return (
                      <div
                        key={order._id}
                        className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md"
                      >
                        {/* Order Header */}
                        <div className="border-b border-gray-100 p-6">
                          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                            <div className="flex items-start gap-4">
                              <div className="rounded-xl bg-primary/10 p-3">
                                <Shield className="h-6 w-6 text-primary" />
                              </div>
                              <div>
                                <h3 className="mb-1 text-lg font-bold text-dark">
                                  {order.order_number}
                                </h3>
                                <div className="flex items-center gap-4 text-sm text-accent">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    <span>{formatDate(order.created_at)}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <CreditCard className="h-4 w-4" />
                                    <span className="capitalize">
                                      {invoice?.payment_method ||
                                        invoice?.payment_type ||
                                        "N/A"}
                                    </span>
                                  </div>
                                  {order.domain && (
                                    <div className="flex items-center gap-1">
                                      <span>Domain: {order.domain}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-4">
                              <div
                                className={`flex items-center gap-2 rounded-xl border px-4 py-2 ${statusInfo.color}`}
                              >
                                <StatusIcon
                                  className={`h-4 w-4 ${statusInfo.iconColor}`}
                                />
                                <span className="text-sm font-medium">
                                  {statusInfo.label}
                                </span>
                              </div>
                              <div className="text-right">
                                <p className="text-2xl font-bold text-primary">
                                  {formatCurrency(
                                    order.totalPrice || 0,
                                    order.currency
                                  )}
                                </p>
                                <p className="text-sm text-accent">
                                  {order.country}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Products */}
                        <div className="p-6">
                          <div className="space-y-4">
                            {order.products?.map((productOrder, index) => (
                              <OrderProduct
                                key={index}
                                productOrder={productOrder}
                                order={order}
                              />
                            )) || (
                              <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                                <p className="text-accent">
                                  No products found for this order
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Action Button */}
                          <div className="mt-6">
                            <Link
                              href={`/my-orders/${order?._id}`}
                              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3 font-semibold text-white transition-all duration-200 hover:bg-primary-hover hover:shadow-lg sm:w-auto"
                            >
                              <Eye className="h-5 w-5" />
                              View Order Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </div>
        </div>
      </SectionContainer>
    </PrivateRoute>
  );
};

export default MyOrders;
