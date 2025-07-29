
"use client";

import { useState, type FC } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShopSwiftLogo } from "@/components/pos/ShopSwiftLogo";
import { useToast } from "@/hooks/use-toast";

const LoginPage: FC = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Please enter both email and password.",
      });
      return;
    }

    const adminCredentials = { email: "admin@shopswift.com", password: "adminpassword" };
    const cashierCredentials = { email: "cashier@shopswift.com", password: "cashierpassword" };

    let loginSuccess = false;
    let redirectPath = "";
    let role = "";

    if (email === adminCredentials.email && password === adminCredentials.password) {
      loginSuccess = true;
      redirectPath = "/admin/inventory";
      role = "admin";
    } else if (email === cashierCredentials.email && password === cashierCredentials.password) {
      loginSuccess = true;
      redirectPath = "/";
      role = "cashier";
    }

    if (loginSuccess) {
      toast({
        title: "Login Successful",
        description: `Logged in as ${role}. Redirecting...`,
      });
      router.push(redirectPath);
    } else {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Invalid email or password.",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <ShopSwiftLogo />
          </div>
          <CardTitle className="font-headline">Welcome Back</CardTitle>
          <CardDescription>Enter your credentials to access your account.</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="user@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit">Login</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;
