import type { FC } from "react";
import Image from "next/image";
import type { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const StockIndicator: FC<{ stock: number }> = ({ stock }) => {
  if (stock <= 0) {
    return <Badge variant="destructive">Out of Stock</Badge>;
  }
  if (stock < 20) {
    return <Badge variant="secondary" className="bg-yellow-400 text-yellow-900">Low Stock</Badge>;
  }
  return <Badge variant="secondary" className="bg-green-200 text-green-900">In Stock</Badge>;
};


const ProductCard: FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const isOutOfStock = product.stock <= 0;

  return (
    <Card className={cn("flex flex-col transition-all hover:shadow-lg", isOutOfStock && "opacity-60")}>
      <CardHeader className="p-0 relative">
        <Image
          src={product.imageUrl}
          alt={product.name}
          width={300}
          height={300}
          className="aspect-square object-cover w-full rounded-t-lg"
          data-ai-hint="product image"
        />
        <div className="absolute top-2 right-2">
           <StockIndicator stock={product.stock} />
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-1">
        <CardTitle className="text-base font-medium leading-tight mb-1">{product.name}</CardTitle>
        <p className="text-lg font-bold text-primary">Rs.{product.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full" 
          onClick={() => onAddToCart(product)} 
          disabled={isOutOfStock}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
