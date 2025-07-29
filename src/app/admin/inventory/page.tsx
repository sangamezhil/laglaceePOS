
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileUp, PlusCircle } from "lucide-react";
import InventoryTable from "@/components/admin/InventoryTable";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function InventoryPage() {
  const [isImportOpen, setImportOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setImportFile(event.target.files[0]);
    }
  };

  const handleImport = () => {
    if (!importFile) {
      toast({
        variant: "destructive",
        title: "No file selected",
        description: "Please select an Excel file to import.",
      });
      return;
    }

    // Here you would typically parse the Excel file and update the products state.
    // For now, we'll just show a success message.
    console.log("Importing file:", importFile.name);

    toast({
      title: "Import Successful",
      description: `${importFile.name} has been imported.`,
    });

    setImportFile(null);
    setImportOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline">Inventory Management</h1>
          <p className="text-muted-foreground">View, edit, and manage your product inventory.</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isImportOpen} onOpenChange={setImportOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <FileUp className="mr-2 h-4 w-4" />
                Import
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Import Products</DialogTitle>
                <DialogDescription>
                  Select an Excel file to import new products into your inventory. The file should have columns: name, price, stock, category, barcode.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="import-file" className="text-right">
                    Excel File
                  </Label>
                  <Input
                    id="import-file"
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleFileChange}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setImportOpen(false)}>Cancel</Button>
                <Button onClick={handleImport}>Import Products</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>
      <InventoryTable />
    </div>
  );
}
