import { LoaderCircle, ShoppingCart, X } from "lucide-react";
import useCart from "@/hooks/useCart";

export default function OrderSummary({
  handleSubmit,
  agreeTerms,
  domain,
  currency,
  currencies,
  loading,
}) {
  const { cartItems, calculateItemPrice, calculateTotal, removeFromCart } =
    useCart();

  // Convert price from EUR to selected currency
  const convertPrice = (eurPrice) => {
    if (!currencies || currency === "EUR") return eurPrice;
    const rate = currencies[currency] || 1;
    return eurPrice * rate;
  };

  const formatPrice = (price) => {
    const convertedPrice = convertPrice(price);
    return `${convertedPrice.toFixed(2)} ${currency}`;
  };

  return (
    <div className="lg:col-span-1">
      <div className="sticky top-4 rounded-lg bg-white p-6 shadow-sm">
        <h2 className="mb-6 flex items-center text-xl font-semibold text-gray-900">
          <ShoppingCart className="mr-2 h-5 w-5" />
          Order Summary
        </h2>
        {/* Products */}
        <div className="mb-6 space-y-4">
          {cartItems.map((item, index) => (
            <div key={index} className="border-b pb-4 last:border-b-0">
              <div className="mb-2 flex items-start justify-between">
                <h3 className="text-sm font-medium text-gray-900">
                  {item.name}
                </h3>
                <button
                  onClick={() => removeFromCart(item.id, item.version)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="mb-3 space-y-1 text-xs text-gray-600">
                {/* <p>
                  Version: <span className="font-medium">{item.version}</span>
                </p> */}
                <p>
                  Duration:{" "}
                  <span className="font-medium">
                    {item.subscriptions[0]?.duration / 12 || 1} year
                    {item.subscriptions[0]?.duration / 12 > 1 ? "s" : ""}
                  </span>
                </p>
                <p>Yearly Price: {formatPrice(item.price * 12)}</p>
                {item.subscriptions[0]?.discount_type && (
                  <p className="text-green-600">
                    Discount:{" "}
                    {item.subscriptions[0].discount_type === "percent"
                      ? `${item.subscriptions[0].amount}%`
                      : `${item.subscriptions[0].amount} ${currency}`}
                  </p>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Subtotal:</span>
                <span className="font-semibold text-gray-900">
                  {formatPrice(calculateItemPrice(item))}
                </span>
              </div>
            </div>
          ))}
        </div>
        {/* Total */}
        <div className="border-t pt-4">
          <div className="mb-6 flex items-center justify-between">
            <span className="text-lg font-semibold text-gray-900">Total:</span>
            <span className="text-2xl font-bold text-red-600">
              {formatPrice(calculateTotal())}
            </span>
          </div>
          {/* Checkout Button */}
          <button
            type="button"
            onClick={handleSubmit}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 font-semibold text-white transition-all duration-200 ease-in-out hover:bg-red-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!agreeTerms || !domain || loading}
          >
            Complete Purchase
            {loading && <LoaderCircle className="animate-spin" />}
          </button>
        </div>
      </div>
    </div>
  );
}
