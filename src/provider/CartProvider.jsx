"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import CartContext from "@/context/CartContext";

export default function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    if (typeof window !== "undefined") {
      const savedCart = sessionStorage.getItem("cartItems");
      return savedCart ? JSON.parse(savedCart) : [];
    }
    return [];
  });

  // Save cart items to session storage whenever cartItems changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  }, [cartItems]);

  // add to cart
  const addToCart = (product) => {
    // Check if product with same ID and version already exists in cart
    const existingItem = cartItems.find(
      (item) => item.id === product.id && item.version === product.version
    );

    if (existingItem) {
      toast.error(`${product.name} is already in your cart!`);
      return false;
    }

    const cartItem = {
      id: product.id,
      name: product.name,
      version: product.version,
      price: product.price,
      subscriptions: product.subscriptions,
      quantity: 1,
    };

    setCartItems((prevItems) => [...prevItems, cartItem]);
    toast.success(`${product.name} added to cart successfully!`);
    return true;
  };

  // Remove from cart
  const removeFromCart = (productId, version) => {
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) => !(item.id === productId && item.version === version)
      )
    );
    toast.success("Product removed from cart");
  };

  // Update subscription duration
  const updateSubscription = (itemId, subscriptionId) => {
    setCartItems((items) =>
      items.map((item) => {
        if (item.id === itemId) {
          const selectedSubscription = item.subscriptions.find(
            (sub) => sub._id === subscriptionId
          );
          const reorderedSubscriptions = [
            selectedSubscription,
            ...item.subscriptions.filter((sub) => sub._id !== subscriptionId),
          ];
          return { ...item, subscriptions: reorderedSubscriptions };
        }
        return item;
      })
    );
  };

  // Calculate item price with discount (price * duration - discount)
  const calculateItemPrice = (item) => {
    const subscription = item.subscriptions[0];
    if (!subscription) return item.price;

    const duration = parseFloat(subscription.duration || 1);
    const basePrice = item.price * duration; // Monthly price * duration

    let discount = 0;
    if (subscription.discount_type === "percent") {
      discount = (basePrice * subscription.amount) / 100;
    } else if (subscription.discount_type === "flat") {
      discount = subscription.amount;
    }

    return Math.max(0, basePrice - discount); // Ensure price doesn't go negative
  };

  // Calculate total price for an item
  const calculateItemTotal = (item) => {
    return calculateItemPrice(item);
  };

  // Calculate cart total
  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + calculateItemTotal(item),
      0
    );
  };

  // Get cart items count
  const getCartItemsCount = () => {
    return cartItems.length;
  };

  // clear cart
  const clearCartItems = () => {
    setCartItems([]);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateSubscription,
    calculateItemPrice,
    calculateItemTotal,
    calculateTotal,
    getCartItemsCount,
    clearCartItems,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
