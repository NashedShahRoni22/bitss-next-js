import { Trash } from "lucide-react";
import useCart from "@/hooks/useCart";

export default function CartItem({ item }) {
  const {
    removeFromCart,
    updateSubscription,
    calculateItemPrice,
    calculateItemTotal,
  } = useCart();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
          <p className="mt-1 text-sm capitalize text-gray-500">
            Version: {item.version}
          </p>
          <div className="mt-2">
            <span className="text-sm text-gray-600">
              Yearly Price: €{(item.price * 12).toFixed(2)}
            </span>
          </div>
          <div className="mt-1">
            <span className="text-xs text-gray-500">
              Duration: {item.subscriptions[0]?.duration / 12} year
              {item.subscriptions[0]?.duration / 12 > 1 ? "s" : ""} × €
              {item.price.toFixed(2)} = €
              {(
                item.price * parseFloat(item.subscriptions[0]?.duration || 1)
              ).toFixed(2)}
            </span>
          </div>
          {item.subscriptions[0]?.amount > 0 && (
            <div className="mt-1">
              <span className="text-xs text-green-600">
                Discount: - €
                {item.subscriptions[0]?.discount_type === "percent"
                  ? (
                      (item.price *
                        parseFloat(item.subscriptions[0]?.duration || 1) *
                        item.subscriptions[0]?.amount) /
                      100
                    ).toFixed(2)
                  : item.subscriptions[0]?.amount.toFixed(2)}{" "}
                (
                {item.subscriptions[0]?.discount_type === "percent"
                  ? `${item.subscriptions[0]?.amount}%`
                  : `€${item.subscriptions[0]?.amount}`}
                )
              </span>
            </div>
          )}
          <div className="mt-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Subscription Duration
            </label>
            <select
              value={item.subscriptions[0]?._id}
              onChange={(e) => updateSubscription(item.id, e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {item.subscriptions.map((subscription) => (
                <option key={subscription._id} value={subscription._id}>
                  {subscription.duration / 12} year
                  {subscription.duration / 12 > 1 ? "s" : ""} -
                  {subscription.discount_type === "percent"
                    ? ` ${subscription.amount}% off`
                    : ` €${subscription.amount} off`}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-3">
            <span className="text-lg font-bold text-gray-900">
              Final Price: €{calculateItemPrice(item).toFixed(2)}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Item Total */}
          <div className="text-right">
            <p className="text-lg font-semibold text-gray-900">
              €{calculateItemTotal(item).toFixed(2)}
            </p>
          </div>

          {/* Remove Button */}
          <button
            onClick={() => removeFromCart(item.id, item.version)}
            className="rounded-md p-2 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
          >
            <Trash className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
