
"use client";

import { useState, type FC, useEffect, useMemo } from "react";
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
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Receipt, Save } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
  const [sales, setSales] = useState<Sale[]>([]);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  const [userRole, setUserRole] = useState('cashier');

  useEffect(() => {
    const role = localStorage.getItem('userRole') || 'cashier';
    setUserRole(role);

    const storedSales = localStorage.getItem('sales');
    let existingSales = storedSales ? JSON.parse(storedSales) : initialSales;
    
    // Check if a sale for 'today' already exists to avoid duplicates on re-renders
    const hasTodaySale = existingSales.some((sale: Sale) => {
        if(sale.id === 'sale-today') return true;
        const saleDate = new Date(sale.date).toDateString();
        const today = new Date().toDateString();
        return saleDate === today && sale.id.startsWith('sale-'); // Simple check
    });

    if (!hasTodaySale && initialSales.some(s => s.id === 'sale-today')) {
        const todaySale = initialSales.find(s => s.id === 'sale-today');
        if (todaySale) {
            const newSale = { ...todaySale, id: `sale-${Date.now()}`, date: new Date().toISOString() };
            existingSales = [newSale, ...existingSales];
        }
    }
    
    localStorage.setItem('sales', JSON.stringify(existingSales));
    setSales(existingSales);

  }, []);


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
        const updatedSales = sales.map(sale =>
            sale.id === selectedSale.id ? selectedSale : sale
        );
      setSales(updatedSales);
      localStorage.setItem('sales', JSON.stringify(updatedSales));
      toast({
        title: "Changes Saved",
        description: "The payment method has been updated.",
      });
      setDialogOpen(false);
    }
  };

  const isUserAdmin = userRole === 'admin';

  const { todaysTotal, cashTotal, upiTotal } = useMemo(() => {
    const today = new Date().toDateString();
    const todaysSales = sales.filter(
      (sale) => new Date(sale.date).toDateString() === today
    );

    let cash = 0;
    let upi = 0;

    todaysSales.forEach(sale => {
        switch (sale.paymentMethod) {
            case 'Cash':
                cash += sale.total;
                break;
            case 'UPI':
                upi += sale.total;
                break;
            case 'Split':
                cash += sale.total / 2;
                upi += sale.total / 2;
                break;
        }
    });
    
    const todaysTotal = todaysSales.reduce((acc, sale) => acc + sale.total, 0);

    return { todaysTotal, cashTotal: cash, upiTotal: upi };
  }, [sales]);


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
                  <Badge variant="outline">#{sale.id.slice(-6)}</Badge>
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
                  Sale Details - #{selectedSale.id.slice(-6)}
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
                    {isUserAdmin ? (
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
                    ) : (
                       <p className="font-medium">{selectedSale.paymentMethod}</p>
                    )}
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
                {isUserAdmin && (
                   <Button onClick={handleSaveChanges}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
       <CardFooter className="flex justify-between items-start pt-6">
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm text-muted-foreground">
          <div className="font-medium text-foreground">Cash Sales:</div>
          <div className="font-semibold text-foreground text-right">Rs.{cashTotal.toFixed(2)}</div>
          <div className="font-medium text-foreground">UPI Sales:</div>
          <div className="font-semibold text-foreground text-right">Rs.{upiTotal.toFixed(2)}</div>
        </div>
        <div className="text-right">
            <p className="text-muted-foreground">Today's Grand Total</p>
            <p className="text-2xl font-bold">Rs.{todaysTotal.toFixed(2)}</p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SalesHistoryTable;
