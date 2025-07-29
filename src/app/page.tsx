
"use client";

import { useState, type FC, useEffect, useRef } from "react";
import type { Product, CartItem } from "@/lib/types";
import { initialProducts } from "@/data/products";
import ProductGrid, { type ProductGridHandle } from "@/components/pos/ProductGrid";
import Cart from "@/components/pos/Cart";
import { Logo } from "@/components/pos/ShopSwiftLogo";
import { Button } from "@/components/ui/button";
import { History, LogOut, LayoutDashboard, Package, Users, Activity, User, ChevronDown } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


const POSPage: FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products] = useState<Product[]>(initialProducts);
  const [userRole, setUserRole] = useState('cashier'); // Default to cashier
  const [userInitial, setUserInitial] = useState('C');
  const [appName, setAppName] = useState("ShopSwift");
  const [logoUrl, setLogoUrl] = useState("");
  const productGridRef = useRef<ProductGridHandle>(null);

  useEffect(() => {
    // In a real app, you'd get this from a proper auth context/session.
    const role = localStorage.getItem('userRole') || 'cashier';
    setUserRole(role);
    setUserInitial(role.charAt(0).toUpperCase());

    const storedAppName = localStorage.getItem("companyName");
    if (storedAppName) {
      setAppName(storedAppName);
      document.title = storedAppName;
    }
    const storedLogoUrl = localStorage.getItem("logoUrl");
    if (storedLogoUrl) {
      setLogoUrl(storedLogoUrl);
    }

  }, []);

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const removeFromCart = (productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const handleSuccessfulCheckout = () => {
    clearCart();
    productGridRef.current?.focusSearch();
  };

  const isAdmin = userRole === 'admin';

  return (
    <div className="flex flex-col h-screen bg-background font-body">
      <header className="flex items-center justify-between px-6 py-3 border-b bg-card">
        <Logo appName={appName} logoUrl={logoUrl}/>
        <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <span className="capitalize">{userRole}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none capitalize">{userRole}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {userRole}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                 <DropdownMenuItem asChild>
                    <Link href={isAdmin ? "/admin/profile" : "/"}>
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                 {isAdmin && (
                  <>
                     <DropdownMenuItem asChild>
                      <Link href="/admin/inventory">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                     <DropdownMenuItem asChild>
                      <Link href="/admin/inventory">
                        <Package className="mr-2 h-4 w-4" />
                        <span>Inventory</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/admin/users">
                        <Users className="mr-2 h-4 w-4" />
                        <span>Users</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/admin/activity-log">
                        <Activity className="mr-2 h-4 w-4" />
                        <span>Activity Log</span>
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuItem asChild>
                   <Link href={isAdmin ? "/admin/sales-history" : "/sales-history"}>
                    <History className="mr-2 h-4 w-4" />
                    <span>Sales History</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/login">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </header>
      <main className="flex-1 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3 h-full">
          <div className="lg:col-span-2 h-full overflow-y-auto p-4 sm:p-6">
            <ProductGrid ref={productGridRef} products={products} onAddToCart={addToCart} />
          </div>
          <div className="h-full bg-card border-l flex flex-col">
            <Cart
              cart={cart}
              onUpdateQuantity={updateQuantity}
              onRemoveFromCart={removeFromCart}
              onClearCart={clearCart}
              onSuccessfulCheckout={handleSuccessfulCheckout}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default POSPage;
