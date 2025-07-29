export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  imageUrl: string;
  category: string;
  sku: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Sale {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  paymentMethod: "Cash" | "UPI" | "Split";
}
