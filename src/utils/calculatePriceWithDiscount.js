export default function calculatePriceWithDiscount(orderItem, rate) {
  const price = orderItem.product.price;
  const duration = orderItem.period;
  const discountAmount = orderItem.subscription.amount;
  const discountType = orderItem.subscription.discount_type;
  // console.log(price, duration, rate);
  

  const basePrice = (price * rate) * duration;

  let discount = 0;
  if (discountType === "percent") {
    discount = (basePrice * discountAmount) / 100;
  } else if (discountType === "flat") {
    discount = discountAmount;
  }

  return Math.max(0, basePrice - discount);
}
