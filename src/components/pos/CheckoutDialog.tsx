
"use client";

import { useState, useEffect, type FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle } from "lucide-react";

interface CheckoutDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  total: number;
  onCheckout: () => void;
}

type PaymentMethod = "Cash" | "UPI" | "Split";

const CheckoutDialog: FC<CheckoutDialogProps> = ({
  isOpen,
  onOpenChange,
  total,
  onCheckout,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Cash");
  const [cashAmount, setCashAmount] = useState<string>("");
  const [upiAmount, setUpiAmount] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setPaymentMethod("Cash");
      setCashAmount(total.toFixed(2));
      setUpiAmount("0.00");
    }
  }, [isOpen, total]);

  useEffect(() => {
    switch (paymentMethod) {
      case "Cash":
        setCashAmount(total.toFixed(2));
        setUpiAmount("0.00");
        break;
      case "UPI":
        setCashAmount("0.00");
        setUpiAmount(total.toFixed(2));
        break;
      case "Split":
        // Keep existing values or reset to a default split
        break;
    }
  }, [paymentMethod, total]);

  const handleCashChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cash = parseFloat(e.target.value);
    setCashAmount(e.target.value);
    if (paymentMethod === 'Split' && !isNaN(cash) && cash >= 0) {
      const remaining = total - cash;
      setUpiAmount(remaining > 0 ? remaining.toFixed(2) : "0.00");
    }
  };

  const handleUpiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const upi = parseFloat(e.target.value);
    setUpiAmount(e.target.value);
    if (paymentMethod === 'Split' && !isNaN(upi) && upi >= 0) {
      const remaining = total - upi;
      setCashAmount(remaining > 0 ? remaining.toFixed(2) : "0.00");
    }
  };

  const amountPaid = (parseFloat(cashAmount) || 0) + (parseFloat(upiAmount) || 0);
  const isPaymentComplete = amountPaid >= total;
  const changeDue = (parseFloat(cashAmount) || 0) - total;

  const handleConfirm = () => {
    onCheckout();
    toast({
      title: "Payment Successful",
      description: `Total amount of Rs.${total.toFixed(2)} has been paid.`,
      action: <CheckCircle className="text-green-500" />,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Checkout</DialogTitle>
          <DialogDescription>
            Complete the transaction by selecting a payment method.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Total Amount Due</p>
            <p className="text-4xl font-bold font-headline text-primary">Rs.{total.toFixed(2)}</p>
          </div>

          <RadioGroup value={paymentMethod} onValueChange={(value: string) => setPaymentMethod(value as PaymentMethod)} className="flex justify-center gap-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Cash" id="r-cash" />
              <Label htmlFor="r-cash">Cash</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="UPI" id="r-upi" />
              <Label htmlFor="r-upi">UPI</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Split" id="r-split" />
              <Label htmlFor="r-split">Split</Label>
            </div>
          </RadioGroup>
          
          <div className="grid grid-cols-2 gap-4 pt-4">
            {paymentMethod !== 'UPI' && (
              <div className="space-y-2">
                <Label htmlFor="cash-amount">Cash Amount</Label>
                <Input
                  id="cash-amount"
                  type="number"
                  placeholder="0.00"
                  value={cashAmount}
                  onChange={handleCashChange}
                  readOnly={paymentMethod === 'Cash'}
                  autoFocus={paymentMethod !== 'Split'}
                />
              </div>
            )}
            
            {paymentMethod !== 'Cash' && (
              <div className="space-y-2">
                <Label htmlFor="upi-amount">UPI Amount</Label>
                <Input
                  id="upi-amount"
                  type="number"
                  placeholder="0.00"
                  value={upiAmount}
                  onChange={handleUpiChange}
                  readOnly={paymentMethod === 'UPI'}
                   autoFocus={paymentMethod === 'UPI'}
                />
              </div>
            )}
            {paymentMethod === 'Cash' && changeDue > 0 && (
                <div className="col-span-2 text-center text-lg font-medium p-2 rounded-md bg-green-100 text-green-800">
                    Change Due: Rs.{changeDue.toFixed(2)}
                </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleConfirm} disabled={!isPaymentComplete}>
            Confirm Payment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutDialog;
