import { useContext } from "react";
import CartContext from "@/context/CartContext";

export default function useCart() {
  const cartItems = useContext(CartContext);
  return cartItems;
}
