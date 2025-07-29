
"use client";

import { useState, type FC } from "react";
import type { Product } from "@/lib/types";
import { initialProducts } from "@/data/products";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, Save } from "lucide-react";
import { addActivityLog } from "@/lib/activityLog";

const InventoryTable: FC = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedProduct, setEditedProduct] = useState<Partial<Product>>({});

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setEditedProduct(product);
  };

  const handleSave = (id: number) => {
    const productToUpdate = products.find(p => p.id === id);
    if (productToUpdate) {
      addActivityLog({
        username: 'admin',
        role: 'admin',
        action: "Updated Product",
        details: `Product: ${productToUpdate.name}`
      });
    }
    setProducts(products.map(p => p.id === id ? { ...p, ...editedProduct } : p));
    setEditingId(null);
    setEditedProduct({});
  };

  const handleDelete = (id: number) => {
    const productToDelete = products.find(p => p.id === id);
    if (productToDelete) {
       addActivityLog({
        username: 'admin',
        role: 'admin',
        action: "Deleted Product",
        details: `Product: ${productToDelete.name}`
      });
    }
    setProducts(products.filter(p => p.id !== id));
  };
  
  const handleInputChange = (field: keyof Product, value: string) => {
    const numericFields = ['price', 'stock'];
    const parsedValue = numericFields.includes(field) ? parseFloat(value) : value;
    setEditedProduct(prev => ({ ...prev, [field]: parsedValue }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Products</CardTitle>
        <CardDescription>A list of all products in your inventory.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Barcode</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="w-[120px]">Price</TableHead>
              <TableHead className="w-[120px]">Stock</TableHead>
              <TableHead className="w-[150px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>
                  {editingId === product.id ? (
                    <Input
                      type="text"
                      value={editedProduct.barcode ?? product.barcode}
                      onChange={(e) => handleInputChange('barcode', e.target.value)}
                      className="h-8"
                    />
                  ) : (
                    product.barcode
                  )}
                </TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>
                  {editingId === product.id ? (
                    <Input 
                      type="number" 
                      value={editedProduct.price ?? product.price} 
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      className="h-8"
                    />
                  ) : (
                    `Rs.${product.price.toFixed(2)}`
                  )}
                </TableCell>
                <TableCell>
                   {editingId === product.id ? (
                    <Input 
                      type="number" 
                      value={editedProduct.stock ?? product.stock} 
                      onChange={(e) => handleInputChange('stock', e.target.value)}
                      className="h-8"
                    />
                  ) : (
                    product.stock
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {editingId === product.id ? (
                    <Button size="sm" onClick={() => handleSave(product.id)}>
                      <Save className="h-4 w-4 mr-2" /> Save
                    </Button>
                  ) : (
                    <div className="flex gap-2 justify-end">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}>
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(product.id)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default InventoryTable;
