
import type { Sale } from "@/lib/types";
import { initialProducts } from "./products";

export const initialSales: Sale[] = [
  {
    id: "sale-1",
    date: new Date('2024-07-22T10:30:00').toISOString(),
    items: [
      { product: initialProducts[0], quantity: 2 },
      { product: initialProducts[2], quantity: 1 },
    ],
    total: 1.99 * 2 + 3.99,
    paymentMethod: "Split",
  },
  {
    id: "sale-2",
    date: new Date('2024-07-22T11:45:00').toISOString(),
    items: [{ product: initialProducts[4], quantity: 1 }],
    total: 3.75,
    paymentMethod: "Cash",
  },
  {
    id: "sale-3",
    date: new Date('2024-07-23T09:15:00').toISOString(),
    items: [
      { product: initialProducts[1], quantity: 1 },
      { product: initialProducts[3], quantity: 1 },
      { product: initialProducts[11], quantity: 1 },
    ],
    total: 4.50 + 5.25 + 4.99,
    paymentMethod: "UPI",
  },
   {
    id: "sale-4",
    date: new Date('2024-07-23T14:02:00').toISOString(),
    items: [
      { product: initialProducts[6], quantity: 2 },
    ],
    total: 3.20 * 2,
    paymentMethod: "Cash",
  },
   {
    id: "sale-5",
    date: new Date('2024-07-24T16:20:00').toISOString(),
    items: [
      { product: initialProducts[7], quantity: 1 },
      { product: initialProducts[8], quantity: 2 },
      { product: initialProducts[9], quantity: 4 },
    ],
    total: 2.10 + (2.99*2) + (2.25*4),
    paymentMethod: "Split",
  },
  {
    id: "sale-today",
    date: new Date().toISOString(),
    items: [{ product: initialProducts[0], quantity: 2 }, { product: initialProducts[1], quantity: 1}],
    total: (1.99 * 2) + 4.50,
    paymentMethod: "Split",
  }
];
