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

const validateDomain = (value) => {
  if (!value.trim()) {
    return false;
  }

  // Remove protocol if present and clean the input
  let cleanDomain = value.trim().toLowerCase();
  cleanDomain = cleanDomain.replace(/^https?:\/\//, "");
  cleanDomain = cleanDomain.replace(/^www\./, "");
  cleanDomain = cleanDomain.replace(/\/.*$/, "");
  cleanDomain = cleanDomain.replace(/:.*$/, "");

  // Basic domain format validation
  const domainRegex =
    /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/;

  if (!domainRegex.test(cleanDomain)) {
    return false;
  }

  if (cleanDomain.length < 4 || cleanDomain.length > 253) {
    return false;
  }

  if (!cleanDomain.includes(".")) {
    return false;
  }

  const parts = cleanDomain.split(".");
  const tld = parts[parts.length - 1];
  if (tld.length < 2) {
    return false;
  }

  if (parts.length < 2 || parts[0].length === 0) {
    return false;
  }

  if (cleanDomain.includes("..") || cleanDomain.includes("--")) {
    return false;
  }

  if (cleanDomain.startsWith("-") || cleanDomain.endsWith("-")) {
    return false;
  }

  return true;
};

const convertCartItems = (cartItems) => {
  const startDate = new Date(); // Current date as start date

  return cartItems.map((item) => {
    // Get the first subscription (selected duration)
    const selectedSubscription = item.subscriptions[0];
    const duration = parseInt(selectedSubscription.duration);

    // Calculate end date based on duration
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + duration);

    // Calculate final price after discount
    let finalPrice = item.price * duration; // Base price for the duration

    if (selectedSubscription.discount_type === "percent") {
      // Apply percentage discount
      const discountAmount = (finalPrice * selectedSubscription.amount) / 100;
      finalPrice = finalPrice - discountAmount;
    } else if (selectedSubscription.discount_type === "flat") {
      // Apply flat discount
      finalPrice = finalPrice - selectedSubscription.amount;
    }

    return {
      product: item.id,
      period: selectedSubscription.duration,
    };
  });
};

function generateOrderId() {
  const prefix = "BITSS";

  // Get current date
  const date = new Date();
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2); // last 2 digits of year

  const datePart = `${day}${month}${year}`;

  // Generate 6-letter random string (A–Z)
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let randomStr = "";
  for (let i = 0; i < 6; i++) {
    randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return `${prefix}${datePart}${randomStr}`;
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

  // fetch currency name and value data
  useEffect(() => {
    const fetchCurrencies = async () => {
      const res = await fetch("https://api.exchangerate-api.com/v4/latest/EUR");
      const data = await res.json();
      setCurrencies(data?.rates);
    };

    fetchCurrencies();
  }, []);

  // handle checkout form submit
  const handleSubmit = async () => {
    if (!agreeTerms) {
      return toast.error("Please agree to the terms and conditions");
    }
    if (!domain) {
      return toast.error("Please enter your domain name");
    }
    if (!validateDomain(domain)) {
      return toast.error("Please enter a valid domain name");
    }

    setLoading(true);

    try {
      const token = authInfo?.access_token;

      const products = convertCartItems(cartItems);
      const order_number = generateOrderId();

      // Clean the domain before sending to API
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
        domain: cleanDomain, // Use cleaned domain
        products,
        ...(paymentType === "stripe" && { payment_method: "stripe" }),
      };

      // Call the API
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
            }}
          />
        </div>
      </SectionContainer>
    </PrivateRoute>
  );
};

export default Checkout;
