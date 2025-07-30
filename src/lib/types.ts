
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
  cashPaid?: number;
  upiPaid?: number;
}

export interface User {
    id: number;
    username: string;
    role: 'admin' | 'cashier';
}

export interface UserCredentials extends User {
    password?: string;
}

export interface ActivityLog {
  id: string;
  username: string;
  role: 'admin' | 'cashier';
  action: string;
  details: string;
  date: string;
}
