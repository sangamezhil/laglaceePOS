
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/pos/ShopSwiftLogo';
import { LayoutDashboard, LogOut, Package, User, History, Users, Activity, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const navLinks = [
    { href: "/", label: "POS View", icon: LayoutDashboard, adminOnly: false },
    { href: "/admin/inventory", label: "Inventory", icon: Package, adminOnly: true },
    { href: "/admin/sales-history", label: "Sales History", icon: History, adminOnly: true },
    { href: "/admin/users", label: "User Management", icon: Users, adminOnly: true },
    { href: "/admin/activity-log", label: "Activity Log", icon: Activity, adminOnly: true },
];

const dropdownLinks = [
    { href: "/admin/profile", label: "Profile", icon: User, adminOnly: true, separator: true },
    ...navLinks.map(l => ({ ...l, separator: false })),
    { href: "/login", label: "Log out", icon: LogOut, adminOnly: false, separator: true },
]


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [appName, setAppName] = useState("ShopSwift");
  const [logoUrl, setLogoUrl] = useState("");

  useEffect(() => {
    const storedAppName = localStorage.getItem("companyName");
    if (storedAppName) {
      setAppName(storedAppName);
    }
    const storedLogoUrl = localStorage.getItem("logoUrl");
    if (storedLogoUrl) {
      setLogoUrl(storedLogoUrl);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background font-body">
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-card px-4 md:px-6">
        <nav className="hidden md:flex md:items-center md:gap-6 text-sm font-medium">
          <Link href="/admin/inventory" className="mr-4">
            <Logo appName={appName} logoUrl={logoUrl}/>
          </Link>
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground">
                <link.icon className="h-4 w-4" />
                {link.label}
            </Link>
          ))}
        </nav>
        <div className="md:hidden">
            <Logo appName={appName} logoUrl={logoUrl} />
        </div>
        <div>
           <DropdownMenu>
              <DropdownMenuTrigger asChild>
                 <Button variant="ghost" className="flex items-center gap-2">
                  <span>Admin</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Admin</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      admin
                    </p>
                  </div>
                </DropdownMenuLabel>
                
                {dropdownLinks.map((link, index) => (
                    (link.separator && <DropdownMenuSeparator key={`sep-${index}`} />),
                    <DropdownMenuItem key={link.href} asChild>
                      <Link href={link.href}>
                        <link.icon className="mr-2 h-4 w-4" />
                        <span>{link.label}</span>
                      </Link>
                    </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </header>
      <main className="p-4 sm:p-6">{children}</main>
    </div>
  )
}
