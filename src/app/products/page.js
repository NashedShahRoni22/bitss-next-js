"use client";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import ProductCard from "@/components/Cards/ProductCard";
import useAuth from "@/hooks/useAuth";
import useCart from "@/hooks/useCart";
import Link from "next/link";
import Image from "next/image";
import SectionContainer from "@/components/shared/SectionContainer";

export default function Products() {
  const { authInfo } = useAuth();
  const { addToCart } = useCart();
  const pathname = usePathname();
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const handleAddToCart = () => {
    if (!authInfo?.access_token) {
      return router.push(`/login?redirect=${pathname}`);
    }

    const cartProduct = {
      id: productId,
      name: productInfo.name,
      version: productDetails.name,
      price: productDetails.price,
      subscriptions: productDetails.subscription_periods,
    };

    addToCart(cartProduct);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://backend.bitss.one/api/v1/products/product/category-wise/products",
      );
      const data = await response.json();

      if (data.success) {
        setCategories(data.data);
      } else {
        setError("Failed to load products");
      }
    } catch (err) {
      setError("Error fetching products: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories
    .filter((category) => {
      if (selectedCategory === "all") return true;
      return category._id === selectedCategory;
    })
    .filter((category) => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      const categoryMatch = category.categoryName
        .toLowerCase()
        .includes(searchLower);
      const productMatch = category.products.some((product) =>
        product.name.toLowerCase().includes(searchLower),
      );
      return categoryMatch || productMatch;
    });

  const isProductsPage = pathname === "/products";

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-red-600" />
          <p className="text-lg text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="mx-auto max-w-md p-8 text-center">
          <AlertCircle className="mx-auto mb-4 h-16 w-16 text-red-600" />
          <h2 className="mb-2 text-2xl font-bold text-gray-900">
            Oops! Something went wrong
          </h2>
          <p className="mb-6 text-gray-600">{error}</p>
          <button
            onClick={fetchProducts}
            className="rounded-lg bg-red-600 px-6 py-3 text-white transition-colors hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200">
        {isProductsPage ? (
          <div className="mx-auto w-full max-w-7xl px-5 py-8 md:px-0">
            <h1 className="mb-2 text-4xl font-bold text-gray-900">
              Our Products
            </h1>
            <p className="text-gray-600">
              Advanced cybersecurity solutions to protect your digital assets
            </p>
          </div>
        ) : (
          <div className="mx-auto w-full max-w-7xl px-5 md:px-0">
            <h1 className="mb-2 text-center text-4xl font-bold text-gray-900">
              Bitss For
            </h1>
          </div>
        )}
      </div>

      {/* Main Content */}
      <SectionContainer>
        {isProductsPage ? (
          /* Desktop Products Page Layout - Sidebar on Right */
          <div className="flex flex-col-reverse gap-8 lg:flex-row">
            {/* Left Side - Products */}
            <div className="flex-1">
              {filteredCategories.length === 0 ? (
                <div className="py-16 text-center">
                  <p className="text-lg text-gray-500">No products found</p>
                </div>
              ) : (
                <div className="space-y-12">
                  {filteredCategories.map((category) => (
                    <div key={category._id} className="space-y-6">
                      {/* Category Header */}
                      <div className="flex items-center gap-4">
                        {/* <img
                          src={category.image}
                          alt={category.categoryName}
                          className="size-36 rounded-full object-cover"
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/64?text=No+Image";
                          }}
                        /> */}
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900">
                            {category.categoryName}
                          </h2>
                          <p className="text-gray-600">
                            {category.sort_description}
                          </p>
                        </div>
                      </div>

                      {/* Products Grid */}
                      {category.products.length === 0 ? (
                        <p className="ml-20 text-gray-500">
                          No products available in this category
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                          {category.products.map((product) => (
                            <ProductCard
                              key={product._id}
                              product={product}
                              categoryId={category._id}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Side - Sidebar */}
            <div className="lg:w-80">
              <div className="sticky top-4 space-y-6">
                {/* Categories Filter */}
                <div className="rounded-lg border border-gray-200 p-6">
                  <h3 className="mb-4 text-lg font-bold text-gray-900">
                    Categories
                  </h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedCategory("all")}
                      className={`w-full rounded-lg px-4 py-3 text-left transition-colors ${
                        selectedCategory === "all"
                          ? "bg-red-600 text-white"
                          : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">All Products</span>
                        <span className="text-sm">
                          {categories.reduce(
                            (acc, cat) => acc + cat.products.length,
                            0,
                          )}
                        </span>
                      </div>
                    </button>

                    {categories.map((category) => (
                      <button
                        key={category._id}
                        onClick={() => setSelectedCategory(category._id)}
                        className={`w-full rounded-lg px-4 py-3 text-left transition-colors ${
                          selectedCategory === category._id
                            ? "bg-red-600 text-white"
                            : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">
                            {category.categoryName}
                          </span>
                          <span className="text-sm">
                            {category.products.length}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Need Help Section */}
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
                  <h3 className="mb-2 text-lg font-bold text-gray-900">
                    Need Help?
                  </h3>
                  <p className="mb-4 text-sm text-gray-600">
                    Contact our team for personalized recommendations
                  </p>
                  <Link
                    href="/contact"
                    className="w-full rounded-lg bg-gray-900 px-4 py-2 font-semibold text-white transition-colors hover:bg-gray-800"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Mobile/Home Layout - Top Tab Bar */
          <div className="space-y-8">
            {/* Top Tab Bar for Categories */}
            <div className="-mx-4 overflow-x-auto px-4 pb-2">
              <div className="flex min-w-max justify-center gap-2">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`rounded-full px-6 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === "all"
                      ? "bg-red-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All Products
                  <span className="ml-2 text-xs">
                    (
                    {categories.reduce(
                      (acc, cat) => acc + cat.products.length,
                      0,
                    )}
                    )
                  </span>
                </button>

                {categories.map((category) => (
                  <button
                    key={category._id}
                    onClick={() => setSelectedCategory(category._id)}
                    className={`rounded-full px-6 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === category._id
                        ? "bg-red-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {category.categoryName}
                    <span className="ml-2 text-xs">
                      ({category.products.length})
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Products Display */}
            {filteredCategories.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-lg text-gray-500">No products found</p>
              </div>
            ) : (
              <div className="space-y-12">
                {filteredCategories.map((category) => (
                  <div key={category._id} className="space-y-6">
                    {/* Category Header */}
                    <div className="flex items-center gap-4">
                      <div className="relative size-24 md:size-36">
                        <Image
                          src={category.image}
                          alt={category.categoryName}
                          fill
                          sizes="(max-width: 768px) 96px, 144px"
                          className="rounded-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://via.placeholder.com/144?text=No+Image";
                          }}
                        />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 md:text-2xl">
                          {category.categoryName}
                        </h2>
                        <p className="text-sm text-gray-600 md:text-base">
                          {category.sort_description}
                        </p>
                      </div>
                    </div>

                    {/* Products Grid */}
                    {category.products.length === 0 ? (
                      <p className="text-gray-500">
                        No products available in this category
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {category.products.map((product) => (
                          <ProductCard
                            key={product._id}
                            product={product}
                            categoryId={category._id}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </SectionContainer>
    </div>
  );
}
