
"use client";

import { useState, type FC } from "react";
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
import { Trash2, Edit, Save, KeyRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface User {
    id: number;
    username: string;
    role: 'admin' | 'cashier';
}

const initialUsers: User[] = [
    { id: 1, username: 'admin', role: 'admin' },
    { id: 2, username: 'cashier', role: 'cashier' },
]

const UserTable: FC = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedUser, setEditedUser] = useState<Partial<User>>({});
  const { toast } = useToast();

  const handleEdit = (user: User) => {
    setEditingId(user.id);
    setEditedUser(user);
  };

  const handleSave = (id: number) => {
    setUsers(users.map(u => u.id === id ? { ...u, ...editedUser } as User : u));
    setEditingId(null);
    setEditedUser({});
  };

  const handleDelete = (id: number) => {
    setUsers(users.filter(u => u.id !== id));
  };
  
  const handleInputChange = (field: keyof User, value: string) => {
    setEditedUser(prev => ({ ...prev, [field]: value }));
  };

  const handleResetPassword = (id: number) => {
    toast({
      title: "Feature not implemented",
      description: "Password reset functionality is not yet available.",
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
        <CardDescription>A list of all users with access to the system.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="w-[150px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  {editingId === user.id ? (
                      <Input
                        type="text"
                        value={editedUser.username ?? user.username}
                        onChange={(e) => handleInputChange('username', e.target.value)}
                        className="h-8"
                      />
                    ) : (
                      user.username
                    )}
                </TableCell>
                <TableCell>
                  <Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'}>{user.role}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  {editingId === user.id ? (
                    <Button size="sm" onClick={() => handleSave(user.id)}>
                      <Save className="h-4 w-4 mr-2" /> Save
                    </Button>
                  ) : (
                    <div className="flex gap-2 justify-end">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(user)}>
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleResetPassword(user.id)}>
                            <KeyRound className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(user.id)}>
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

export default UserTable;
