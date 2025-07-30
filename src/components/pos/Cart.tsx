"use client";

import { useState, type FC } from "react";
import type { CartItem, Sale } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Trash2, Plus, Minus, ShoppingCart } from "lucide-react";
import CheckoutDialog from "./CheckoutDialog";

interface CartProps {
  cart: CartItem[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveFromCart: (productId: number) => void;
  onClearCart: () => void;
  onSuccessfulCheckout: (saleData: Omit<Sale, 'id' | 'date' | 'items'>) => void;
}

const Cart: FC<CartProps> = ({ cart, onUpdateQuantity, onRemoveFromCart, onClearCart, onSuccessfulCheckout }) => {
  const [isCheckoutOpen, setCheckoutOpen] = useState(false);

  const total = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const gstRate = 0.18; // 18% GST
  const subtotal = total / (1 + gstRate);
  const tax = total - subtotal;

  const handleCheckout = (saleData: Omit<Sale, 'id' | 'date' | 'items'>) => {
    onSuccessfulCheckout(saleData);
    setCheckoutOpen(false);
  }

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="p-4 border-b">
          <h2 className="text-2xl font-bold font-headline">Cart</h2>
        </div>
        
        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground p-4">
            <ShoppingCart className="h-16 w-16 mb-4" />
            <h3 className="text-lg font-semibold">Your cart is empty</h3>
            <p className="text-sm">Add products to get started.</p>
          </div>
        ) : (
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-4">
              {cart.map((item) => (
                <div key={item.product.id} className="flex items-start gap-4">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.product.name}</p>
                    <p className="text-sm text-muted-foreground">Rs.{item.product.price.toFixed(2)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}>
                        <Minus className="h-3 w-3" />
                      </Button>
                      <Input type="number" value={item.quantity} onChange={(e) => onUpdateQuantity(item.product.id, parseFloat(e.target.value) || 0)} className="h-6 w-12 text-center px-1" />
                      <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}>
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">Rs.{(item.product.price * item.quantity).toFixed(2)}</p>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => onRemoveFromCart(item.product.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
        
        <div className="p-4 border-t mt-auto bg-card">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>Rs.{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>GST (18%)</span>
              <span>Rs.{tax.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-2xl text-primary py-2">
              <span>Total</span>
              <span>Rs.{total.toFixed(2)}</span>
            </div>
          </div>
          <Button 
            className="w-full mt-4 h-12 text-lg" 
            disabled={cart.length === 0}
            onClick={() => setCheckoutOpen(true)}
          >
            Checkout
          </Button>
        </div>
      </div>
      <CheckoutDialog 
        isOpen={isCheckoutOpen} 
        onOpenChange={setCheckoutOpen} 
        total={total}
        onCheckout={handleCheckout}
      />
    </>
  );
};

export default Cart;
