import { Button } from "@/components/ui/button";
import { FileUp, PlusCircle } from "lucide-react";
import InventoryTable from "@/components/admin/InventoryTable";

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline">Inventory Management</h1>
          <p className="text-muted-foreground">View, edit, and manage your product inventory.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileUp className="mr-2 h-4 w-4" />
            Import
          </Button>
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
