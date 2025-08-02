
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/lib/mock-data';
import { useToast } from './use-toast';

export interface CartItem {
  product: Product;
  rentalPeriod?: {
    from: string; // ISO string
    to: string; // ISO string
  };
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();
  const [lastAction, setLastAction] = useState<{ type: 'add' | 'remove', productName: string } | null>(null);

  useEffect(() => {
    try {
      const items = localStorage.getItem('cartItems');
      if (items) {
        setCartItems(JSON.parse(items));
      }
    } catch (error) {
      console.error("Failed to parse cart items from localStorage", error);
      setCartItems([]);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      if (lastAction) {
        if (lastAction.type === 'add') {
             toast({
                title: "Added to Cart!",
                description: `"${lastAction.productName}" has been added to your cart.`,
            });
        } else if (lastAction.type === 'remove') {
             toast({
                title: "Item Removed",
                description: `"${lastAction.productName}" has been removed from your cart.`,
            });
        }
        setLastAction(null); // Reset after showing toast
      }
    } catch (error) {
      console.error("Failed to save cart items to localStorage", error);
    }
  }, [cartItems, toast, lastAction]);

  const addToCart = (item: CartItem) => {
    const existingItem = cartItems.find(
        (i) => i.product.id === item.product.id
      );

    if (existingItem) {
        toast({
          title: "Already in Cart",
          description: `"${item.product.name}" is already in your cart.`,
        });
    } else {
        setLastAction({ type: 'add', productName: item.product.name });
        setCartItems((prevItems) => [...prevItems, item]);
    }
  };

  const removeFromCart = (productId: string) => {
    const itemToRemove = cartItems.find(item => item.product.id === productId);
    if (itemToRemove) {
      setLastAction({ type: 'remove', productName: itemToRemove.product.name });
      setCartItems((prevItems) => prevItems.filter((item) => item.product.id !== productId));
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        cartCount: cartItems.length,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = React.useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
