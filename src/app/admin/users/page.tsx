
"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import UserTable from "@/components/admin/UserTable";


export default function UserManagementPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline">User Management</h1>
          <p className="text-muted-foreground">Add, edit, and manage users.</p>
        </div>
        <div className="flex gap-2">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>
      <UserTable />
    </div>
  );
}
