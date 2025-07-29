
import type { ActivityLog } from "@/lib/types";

export const initialActivityLog: ActivityLog[] = [
  {
    id: "log-1",
    username: "admin",
    role: "admin",
    action: "Logged In",
    details: "Successfully authenticated.",
    date: new Date('2024-07-25T09:00:00Z').toISOString(),
  },
  {
    id: "log-2",
    username: "cashier",
    role: "cashier",
    action: "Logged In",
    details: "Successfully authenticated.",
    date: new Date('2024-07-25T09:05:00Z').toISOString(),
  },
  {
    id: "log-3",
    username: "cashier",
    role: "cashier",
    action: "Processed Sale",
    details: "Sale ID: sale-1, Total: Rs.7.97",
    date: new Date('2024-07-25T10:32:00Z').toISOString(),
  },
  {
    id: "log-4",
    username: "admin",
    role: "admin",
    action: "Updated Product",
    details: "Product: Organic Avocados, Stock: 48",
    date: new Date('2024-07-25T11:15:00Z').toISOString(),
  },
  {
    id: "log-5",
    username: "admin",
    role: "admin",
    action: "Reset Password",
    details: "Reset password for user: cashier",
    date: new Date('2024-07-25T11:20:00Z').toISOString(),
  },
    {
    id: "log-6",
    username: "cashier",
    role: "cashier",
    action: "Processed Sale",
    details: "Sale ID: sale-2, Total: Rs.3.75",
    date: new Date('2024-07-25T12:01:00Z').toISOString(),
  },
];
