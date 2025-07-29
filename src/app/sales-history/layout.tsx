
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShopSwiftLogo } from '@/components/pos/ShopSwiftLogo';
import { LayoutDashboard, LogOut, History, Package, Users } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function SalesHistoryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [userRole, setUserRole] = useState('cashier');
  
  useEffect(() => {
    const role = localStorage.getItem('userRole') || 'cashier';
    setUserRole(role);
  }, []);

  const isAdmin = userRole === 'admin';
  const userInitial = isAdmin ? 'A' : 'C';

  return (
    <div className="min-h-screen bg-background font-body">
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-card px-4 md:px-6">
        <nav className="hidden md:flex md:items-center md:gap-6 text-sm font-medium">
          <Link href={isAdmin ? "/admin/inventory" : "/"} className="mr-4">
            <ShopSwiftLogo />
          </Link>
          <Link href="/" className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground">
            <LayoutDashboard className="h-4 w-4" />
            POS View
          </Link>
          {isAdmin && (
            <>
              <Link href="/admin/inventory" className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground">
                <Package className="h-4 w-4" />
                Inventory
              </Link>
               <Link href="/admin/sales-history" className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground">
                <History className="h-4 w-4" />
                Sales History
              </Link>
              <Link href="/admin/users" className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground">
                <Users className="h-4 w-4" />
                User Management
              </Link>
            </>
          )}
          {!isAdmin && (
             <Link href="/sales-history" className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground">
                <History className="h-4 w-4" />
                Sales History
            </Link>
          )}
        </nav>
        <div className="md:hidden">
            <ShopSwiftLogo />
        </div>
        <div>
           <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="https://placehold.co/100x100" alt="User" />
                    <AvatarFallback>{userInitial}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none capitalize">{userRole}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {userRole}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                 <DropdownMenuItem asChild>
                  <Link href="/">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>POS View</span>
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                    <>
                    <DropdownMenuItem asChild>
                        <Link href="/admin/inventory">
                        <Package className="mr-2 h-4 w-4" />
                        <span>Inventory</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/admin/sales-history">
                        <History className="mr-2 h-4 w-4" />
                        <span>Sales History</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/admin/users">
                        <Users className="mr-2 h-4 w-4" />
                        <span>User Management</span>
                        </Link>
                    </DropdownMenuItem>
                    </>
                )}
                {!isAdmin && (
                    <DropdownMenuItem asChild>
                        <Link href="/sales-history">
                        <History className="mr-2 h-4 w-4" />
                        <span>Sales History</span>
                        </Link>
                    </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/login">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </header>
      <main className="p-4 sm:p-6">{children}</main>
    </div>
  )
}
