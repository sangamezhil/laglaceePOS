export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
  barcode: string;
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

export interface ActivityLog {
  id: string;
  user: {
    name: string;
    role: 'admin' | 'cashier';
  };
  action: string;
  details: string;
  date: string;
}
