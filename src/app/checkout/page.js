"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PrivateRoute from "@/components/shared/PrivateRoute";
import SectionContainer from "@/components/shared/SectionContainer";
import useAuth from "@/hooks/useAuth";
import useCart from "@/hooks/useCart";
import { postApi } from "@/api/api";
import OrderInfo from "@/components/Checkout/OrderInfo";
import OrderSummary from "@/components/Checkout/OrderSummary";

// Product ID that does NOT require a domain name
const BITSS_VWAR_ID = "68c697cec4b31386c2c2b8ed";

const validateDomain = (value) => {
  if (!value.trim()) return false;

  let cleanDomain = value.trim().toLowerCase();
  cleanDomain = cleanDomain.replace(/^https?:\/\//, "");
  cleanDomain = cleanDomain.replace(/^www\./, "");
  cleanDomain = cleanDomain.replace(/\/.*$/, "");
  cleanDomain = cleanDomain.replace(/:.*$/, "");

  const domainRegex =
    /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/;

  if (!domainRegex.test(cleanDomain)) return false;
  if (cleanDomain.length < 4 || cleanDomain.length > 253) return false;
  if (!cleanDomain.includes(".")) return false;

  const parts = cleanDomain.split(".");
  if (parts[parts.length - 1].length < 2) return false;
  if (parts.length < 2 || parts[0].length === 0) return false;
  if (cleanDomain.includes("..") || cleanDomain.includes("--")) return false;
  if (cleanDomain.startsWith("-") || cleanDomain.endsWith("-")) return false;

  return true;
};

const convertCartItems = (cartItems) => {
  return cartItems.map((item) => ({
    product: item.id,
    period: item.subscriptions[0].duration,
  }));
};

function generateOrderId() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const random4Digit = String(Math.floor(Math.random() * 10000)).padStart(4, "0");
  return `${year}${month}-${random4Digit}`;
}

const Checkout = () => {
  const { authInfo } = useAuth();
  const { cartItems, clearCartItems } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [currency, setCurrency] = useState("EUR");
  const [paymentType, setPaymentType] = useState("bank");
  const [domain, setDomain] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [currencies, setCurrencies] = useState(null);

  // Domain is NOT required when the cart contains only the BITSS_VWAR product
  const isDomainRequired = !(
    cartItems.length === 1 && cartItems[0]?.id === BITSS_VWAR_ID
  );

  useEffect(() => {
    const fetchCurrencies = async () => {
      const res = await fetch("https://api.exchangerate-api.com/v4/latest/EUR");
      const data = await res.json();
      setCurrencies(data?.rates);
    };
    fetchCurrencies();
  }, []);

  const handleSubmit = async () => {
    if (!agreeTerms) {
      return toast.error("Please agree to the terms and conditions");
    }

    // Only validate domain if it's required for the current cart
    if (isDomainRequired) {
      if (!domain) {
        return toast.error("Please enter your domain name");
      }
      if (!validateDomain(domain)) {
        return toast.error("Please enter a valid domain name");
      }
    }

    setLoading(true);

    try {
      const token = authInfo?.access_token;
      const products = convertCartItems(cartItems);
      const order_number = generateOrderId();

      let cleanDomain = domain.trim().toLowerCase();
      cleanDomain = cleanDomain.replace(/^https?:\/\//, "");
      cleanDomain = cleanDomain.replace(/^www\./, "");
      cleanDomain = cleanDomain.replace(/\/.*$/, "");
      cleanDomain = cleanDomain.replace(/:.*$/, "");

      const payload = {
        order_number,
        country: authInfo?.user?.country,
        currency_name: currency,
        currency_rate: currencies[currency],
        currency,
        rate: currencies[currency],
        payment_type: paymentType === "stripe" ? "online" : "bank",
        terms_and_conditions: agreeTerms,
        status: "due",
        // Only include domain in payload if it's required and provided
        ...(isDomainRequired && cleanDomain ? { domain: cleanDomain } : {}),
        products,
        ...(paymentType === "stripe" && { payment_method: "stripe" }),
      };

      const response = await postApi({
        endpoint: "/orders/order/confirm",
        payload,
        token,
      });

      if (paymentType === "stripe" && response?.success) {
        window.location.href = response?.data?.payment_url;
        clearCartItems();
        return;
      }

      if (response?.success) {
        toast.success("Order created successfully!");
        clearCartItems();
        router.push("/my-orders");
      } else {
        toast.error("Failed to create order");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error("Something went wrong while processing your order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PrivateRoute>
      <SectionContainer>
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="mt-2 text-gray-600">Complete your purchase securely</p>
        </div>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column - Order Information */}
          <OrderInfo
            {...{
              domain,
              setDomain,
              currency,
              setCurrency,
              paymentType,
              setPaymentType,
              agreeTerms,
              setAgreeTerms,
              currencies,
              cartItems,
              isDomainRequired, // ← passed down, no need to re-derive it inside OrderInfo
            }}
          />
          {/* Right Column - Order Summary */}
          <OrderSummary
            {...{
              handleSubmit,
              agreeTerms,
              domain,
              currency,
              currencies,
              loading,
              isDomainRequired, // ← passed down so the button can unblock correctly
            }}
          />
        </div>
      </SectionContainer>
    </PrivateRoute>
  );
};

export default Checkout;