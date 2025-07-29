
"use client";

import { useState, type FC, useEffect } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { addActivityLog } from "@/lib/activityLog";
import type { User } from "@/lib/types";


const initialUsers: User[] = [
    { id: 1, username: 'admin', role: 'admin' },
    { id: 2, username: 'cashier', role: 'cashier' },
]

interface UserTableProps {
  onUsersChange: (users: User[]) => void;
}

const UserTable: FC<UserTableProps> = ({ onUsersChange }) => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedUser, setEditedUser] = useState<Partial<User>>({});
  const { toast } = useToast();
  const [isResetDialogOpen, setResetDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    onUsersChange(users);
  }, [users, onUsersChange]);

  const handleEdit = (user: User) => {
    setEditingId(user.id);
    setEditedUser(user);
  };

  const handleSave = (id: number) => {
    const userToUpdate = users.find(u => u.id === id);
     if (userToUpdate) {
        addActivityLog({
            username: 'admin',
            role: 'admin',
            action: 'Updated User',
            details: `Updated details for user: ${userToUpdate.username}`
        });
    }
    setUsers(users.map(u => u.id === id ? { ...u, ...editedUser } as User : u));
    setEditingId(null);
    setEditedUser({});
  };

  const handleDelete = (id: number) => {
    const userToDelete = users.find(u => u.id === id);
    if (userToDelete) {
        addActivityLog({
            username: 'admin',
            role: 'admin',
            action: 'Deleted User',
            details: `Deleted user: ${userToDelete.username}`
        });
    }
    setUsers(users.filter(u => u.id !== id));
  };
  
  const handleInputChange = (field: keyof User, value: string) => {
    setEditedUser(prev => ({ ...prev, [field]: value }));
  };

  const openResetPasswordDialog = (user: User) => {
    setSelectedUser(user);
    setNewPassword("");
    setResetDialogOpen(true);
  }

  const handleConfirmResetPassword = () => {
    if (!newPassword) {
      toast({
        variant: "destructive",
        title: "Password cannot be empty",
        description: "Please enter a new password.",
      });
      return;
    }
    
    if (selectedUser) {
        addActivityLog({
            username: 'admin',
            role: 'admin',
            action: 'Reset Password',
            details: `Reset password for user: ${selectedUser.username}`
        });
    }
    
    console.log(`Password for ${selectedUser?.username} reset to: ${newPassword}`);
    toast({
      title: "Password Reset Successful",
      description: `The password for ${selectedUser?.username} has been updated.`,
    });
    setResetDialogOpen(false);
    setSelectedUser(null);
  }

  return (
    <>
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
                        <Button variant="ghost" size="icon" onClick={() => openResetPasswordDialog(user)}>
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
     <Dialog open={isResetDialogOpen} onOpenChange={setResetDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password for {selectedUser?.username}</DialogTitle>
            <DialogDescription>
              Enter a new password for the user. They will be required to use this password at their next login.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-password" className="text-right">
                New Password
              </Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="col-span-3"
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResetDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleConfirmResetPassword}>Reset Password</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserTable;
