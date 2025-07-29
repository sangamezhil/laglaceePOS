
"use client";

import { useState, useMemo, useRef, useEffect, type FC, forwardRef, useImperativeHandle } from "react";
import type { Product } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Search, Barcode } from "lucide-react";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export interface ProductGridHandle {
  focusSearch: () => void;
}

const ProductGrid: FC<ProductGridProps> = forwardRef<ProductGridHandle, ProductGridProps>(({ products, onAddToCart }, ref) => {
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  useImperativeHandle(ref, () => ({
    focusSearch: () => {
      searchInputRef.current?.focus();
    },
  }));

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.barcode.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Products</h1>
        <p className="text-muted-foreground">Select products to add to the cart.</p>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Barcode className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          ref={searchInputRef}
          type="text"
          placeholder="Scan barcode or search by product name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-10 h-12 text-base"
        />
      </div>
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      ) : (
         <div className="text-center py-16 text-muted-foreground">
            <p className="font-semibold">No products found</p>
            <p className="text-sm">Try adjusting your search term.</p>
        </div>
      )}
    </div>
  );
});

ProductGrid.displayName = 'ProductGrid';

export default ProductGrid;
