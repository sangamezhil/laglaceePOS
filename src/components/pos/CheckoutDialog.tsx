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
import { useToast } from "@/hooks/use-toast";
import { CheckCircle } from "lucide-react";

interface CheckoutDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  total: number;
  onCheckout: () => void;
}

const CheckoutDialog: FC<CheckoutDialogProps> = ({
  isOpen,
  onOpenChange,
  total,
  onCheckout,
}) => {
  const [cashAmount, setCashAmount] = useState<string>("");
  const [upiAmount, setUpiAmount] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setCashAmount(total.toFixed(2));
      setUpiAmount("");
    }
  }, [isOpen, total]);

  const handleCashChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cash = parseFloat(e.target.value);
    setCashAmount(e.target.value);
    if (!isNaN(cash) && cash >= 0) {
      const remaining = total - cash;
      setUpiAmount(remaining > 0 ? remaining.toFixed(2) : "0.00");
    } else {
        setUpiAmount(total.toFixed(2));
    }
  };

  const handleUpiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const upi = parseFloat(e.target.value);
    setUpiAmount(e.target.value);
    if (!isNaN(upi) && upi >= 0) {
      const remaining = total - upi;
      setCashAmount(remaining > 0 ? remaining.toFixed(2) : "0.00");
    } else {
        setCashAmount(total.toFixed(2));
    }
  };
  
  const amountPaid = (parseFloat(cashAmount) || 0) + (parseFloat(upiAmount) || 0);
  const isPaymentComplete = amountPaid >= total;

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
            Complete the transaction by entering the payment details.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Total Amount Due</p>
            <p className="text-4xl font-bold font-headline text-primary">Rs.{total.toFixed(2)}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cash-amount">Cash Amount</Label>
              <Input id="cash-amount" type="number" placeholder="0.00" value={cashAmount} onChange={handleCashChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="upi-amount">UPI Amount</Label>
              <Input id="upi-amount" type="number" placeholder="0.00" value={upiAmount} onChange={handleUpiChange} />
            </div>
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
