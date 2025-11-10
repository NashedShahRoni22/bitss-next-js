import calculatePriceWithDiscount from "@/utils/calculatePriceWithDiscount";
import formatCurrency from "@/utils/FormatCurrency";
import formatDate from "@/utils/formatDate";

export default function OrderProduct({ productOrder, order }) {
  const price = calculatePriceWithDiscount(productOrder, order.currency_rate);

  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div className="flex-1">
          <h4 className="mb-2 text-lg font-semibold text-dark">
            {productOrder.product?.category?.name || "Category"}
          </h4>
          <div className="mb-3 flex items-center gap-4 text-sm text-accent">
            <span className="rounded-lg bg-white px-2 py-1 font-medium">
              {productOrder.product?.name || "Product Name"}
            </span>
            <span>
              {productOrder.start_date &&
                productOrder.end_date &&
                `${formatDate(productOrder.start_date)} - ${formatDate(
                  productOrder.end_date
                )}`}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {productOrder.product?.product_details
              ?.slice(0, 4)
              .map((feature, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-sm text-accent"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                  <span>{feature}</span>
                </div>
              ))}
            {productOrder.product?.product_details?.length > 4 && (
              <div className="text-sm font-medium text-primary">
                +{productOrder.product.product_details.length - 4} more features
              </div>
            )}
          </div>
        </div>
        <div className="text-right lg:min-w-[120px]">
          <p className="text-lg font-bold text-primary">
            {formatCurrency(price.toFixed(2) || 0, order.currency)}
          </p>
          <p className="text-sm text-accent">
            {productOrder.period / 12} year
            {productOrder.period > 1 ? "s" : ""}
          </p>
        </div>
      </div>
    </div>
  );
}
