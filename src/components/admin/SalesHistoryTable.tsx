
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
import { Eye, Receipt, Save } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const SalesHistoryTable: FC = () => {
  const [sales, setSales] = useState<Sale[]>(initialSales);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const openSaleDetails = (sale: Sale) => {
    setSelectedSale({ ...sale });
    setDialogOpen(true);
  };

  const handlePaymentMethodChange = (newMethod: Sale['paymentMethod']) => {
    if (selectedSale) {
      setSelectedSale({ ...selectedSale, paymentMethod: newMethod });
    }
  };

  const handleSaveChanges = () => {
    if (selectedSale) {
      setSales(prevSales =>
        prevSales.map(sale =>
          sale.id === selectedSale.id ? selectedSale : sale
        )
      );
      toast({
        title: "Changes Saved",
        description: "The payment method has been updated.",
      });
      setDialogOpen(false);
    }
  };

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
                  <Button variant="ghost" size="icon" onClick={() => openSaleDetails(sale)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {selectedSale && (
          <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  Sale Details - #{selectedSale.id.slice(0, 8)}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Date</p>
                    <p>{new Date(selectedSale.date).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Payment Method</p>
                    <Select
                      value={selectedSale.paymentMethod}
                      onValueChange={(value: Sale['paymentMethod']) => handlePaymentMethodChange(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cash">Cash</SelectItem>
                        <SelectItem value="UPI">UPI</SelectItem>
                        <SelectItem value="Split">Split</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Card>
                  <CardContent className="p-4 space-y-4">
                    {selectedSale.items.map(item => (
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
                  <span>Rs.{selectedSale.total.toFixed(2)}</span>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Close</Button>
                </DialogClose>
                <Button onClick={handleSaveChanges}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
};

export default SalesHistoryTable;
