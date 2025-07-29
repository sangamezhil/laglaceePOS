"use client";

import { useState, type FC } from "react";
import type { Sale } from "@/lib/types";
import { initialSales } from "@/data/sales";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Receipt } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const SalesHistoryTable: FC = () => {
  const [sales] = useState<Sale[]>(initialSales);

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Sales</CardTitle>
        <CardDescription>
          A list of all sales transactions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sale ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell className="font-medium">
                  <Badge variant="outline">#{sale.id.slice(0, 8)}</Badge>
                </TableCell>
                <TableCell>
                  {new Date(sale.date).toLocaleString()}
                </TableCell>
                <TableCell>{sale.items.length}</TableCell>
                <TableCell>
                  <Badge>{sale.paymentMethod}</Badge>
                </TableCell>
                <TableCell className="text-right font-medium">
                  Rs.{sale.total.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                           <Receipt className="h-5 w-5" />
                           Sale Details - #{sale.id.slice(0, 8)}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-muted-foreground">Date</p>
                                <p>{new Date(sale.date).toLocaleString()}</p>
                            </div>
                             <div>
                                <p className="text-muted-foreground">Payment Method</p>
                                <p>{sale.paymentMethod}</p>
                            </div>
                        </div>

                        <Card>
                            <CardContent className="p-4 space-y-4">
                                {sale.items.map(item => (
                                    <div key={item.product.id} className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div>
                                                <p className="font-medium">{item.product.name}</p>
                                                <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <p className="font-medium">Rs.{(item.product.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                        <div className="flex justify-end items-center font-bold text-xl">
                            <span className="mr-4 text-muted-foreground">Total:</span>
                            <span>Rs.{sale.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default SalesHistoryTable;
