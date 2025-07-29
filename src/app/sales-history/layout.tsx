
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/pos/ShopSwiftLogo';
import { LayoutDashboard, LogOut, History, Package, Users, Activity, User, ChevronDown } from 'lucide-react';
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
  const [appName, setAppName] = useState("ShopSwift");
  const [logoUrl, setLogoUrl] = useState("");
  
  useEffect(() => {
    const role = localStorage.getItem('userRole') || 'cashier';
    setUserRole(role);

    const storedAppName = localStorage.getItem("companyName");
    if (storedAppName) {
      setAppName(storedAppName);
    }
    const storedLogoUrl = localStorage.getItem("logoUrl");
    if (storedLogoUrl) {
      setLogoUrl(storedLogoUrl);
    }
  }, []);

  const isAdmin = userRole === 'admin';
  const userInitial = isAdmin ? 'A' : 'C';

  return (
    <div className="min-h-screen bg-background font-body">
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-card px-4 md:px-6">
        <nav className="hidden md:flex md:items-center md:gap-6 text-sm font-medium">
          <Link href={isAdmin ? "/admin/inventory" : "/"} className="mr-4">
            <Logo appName={appName} logoUrl={logoUrl}/>
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
               <Link href="/admin/sales-history" className="flex items-center gap-2 font-medium text-foreground">
                <History className="h-4 w-4" />
                Sales History
              </Link>
              <Link href="/admin/users" className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground">
                <Users className="h-4 w-4" />
                User Management
              </Link>
              <Link href="/admin/activity-log" className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground">
                <Activity className="h-4 w-4" />
                Activity Log
              </Link>
            </>
          )}
          {!isAdmin && (
             <Link href="/sales-history" className="flex items-center gap-2 font-medium text-foreground">
                <History className="h-4 w-4" />
                Sales History
            </Link>
          )}
        </nav>
        <div className="md:hidden">
            <Logo appName={appName} logoUrl={logoUrl}/>
        </div>
        <div>
           <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <span className="capitalize">{userRole}</span>
                  <ChevronDown className="h-4 w-4" />
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
                    <Link href={isAdmin ? "/admin/profile" : "/"}>
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                    </Link>
                </DropdownMenuItem>
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
                    <DropdownMenuItem asChild>
                        <Link href="/admin/activity-log">
                        <Activity className="mr-2 h-4 w-4" />
                        <span>Activity Log</span>
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
