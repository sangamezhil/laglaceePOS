import { ShoppingCart } from "lucide-react";

interface LogoProps {
    appName?: string;
}

export const Logo = ({ appName = "ShopSwift" }: LogoProps) => (
  <div className="flex items-center gap-2 text-xl font-bold text-primary">
    <ShoppingCart className="h-6 w-6" />
    <span className="font-headline">{appName}</span>
  </div>
);
