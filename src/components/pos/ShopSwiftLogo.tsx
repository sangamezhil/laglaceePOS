
import { ShoppingCart } from "lucide-react";

interface LogoProps {
    appName?: string;
    logoUrl?: string;
}

export const Logo = ({ appName = "ShopSwift", logoUrl }: LogoProps) => (
  <div className="flex items-center gap-2 text-xl font-bold text-primary">
    {logoUrl ? (
      <img src={logoUrl} alt={appName} className="h-8 w-8 object-contain" />
    ) : (
      <ShoppingCart className="h-6 w-6" />
    )}
    <span className="font-headline">{appName}</span>
  </div>
);
