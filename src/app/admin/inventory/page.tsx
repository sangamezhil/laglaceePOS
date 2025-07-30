
"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import type { Product } from "@/lib/types";
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
import { addActivityLog } from "@/lib/activityLog";

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>(() => {
    if (typeof window === 'undefined') return [];
    const savedProducts = localStorage.getItem('products');
    return savedProducts ? JSON.parse(savedProducts) : [];
  });
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

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = event.target?.result;
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json: any[] = XLSX.utils.sheet_to_json(worksheet);

        const newProducts: Product[] = json.map((row, index) => ({
          id: Date.now() + index, // Generate a unique ID
          name: row.name || "No Name",
          price: parseFloat(row.price) || 0,
          stock: parseInt(row.stock, 10) || 0,
          category: row.category || "Uncategorized",
          barcode: row.barcode || `BARCODE-${Date.now() + index}`,
        }));

        setProducts((prevProducts) => {
            const updatedProducts = [...prevProducts, ...newProducts];
            localStorage.setItem('products', JSON.stringify(updatedProducts));
            return updatedProducts;
        });

        addActivityLog({
          username: 'admin',
          role: 'admin',
          action: 'Imported Products',
          details: `Imported ${newProducts.length} products from ${importFile.name}`
        });

        toast({
          title: "Import Successful",
          description: `${newProducts.length} products have been imported from ${importFile.name}.`,
        });

      } catch (error) {
        console.error("Error parsing Excel file:", error);
        toast({
          variant: "destructive",
          title: "Import Failed",
          description: "There was an error parsing the Excel file. Please ensure it's in the correct format.",
        });
      } finally {
        setImportFile(null);
        setImportOpen(false);
      }
    };

    reader.onerror = () => {
         toast({
          variant: "destructive",
          title: "File Read Error",
          description: "Could not read the selected file.",
        });
        setImportFile(null);
        setImportOpen(false);
    }
    
    reader.readAsArrayBuffer(importFile);
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
                <Button onClick={handleImport} disabled={!importFile}>Import Products</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>
      <InventoryTable products={products} setProducts={setProducts} />
    </div>
  );
}
