
"use client";

import { useState, type FC, useEffect } from "react";
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
import { Logo } from "@/components/pos/ShopSwiftLogo";
import { useToast } from "@/hooks/use-toast";
import { addActivityLog } from "@/lib/activityLog";
import { Loader2 } from "lucide-react";
import { getUsers, UserCredentials } from "@/lib/users";

const LoginPage: FC = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Please enter both username and password.",
      });
      return;
    }
    setIsLoading(true);

    // Simulate network delay
    setTimeout(() => {
      const users = getUsers();
      const user = users.find(
        (u: UserCredentials) => u.username === username && u.password === password
      );

      if (user) {
        localStorage.setItem('userRole', user.role);

        addActivityLog({
          username: user.username,
          role: user.role,
          action: "Logged In",
          details: "Successfully authenticated."
        });

        toast({
          title: "Login Successful",
          description: `Logged in as ${user.role}. Redirecting...`,
        });
        
        const redirectPath = user.role === 'admin' ? '/admin/inventory' : '/';
        router.push(redirectPath);
      } else {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: "Invalid username or password.",
        });
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <Logo appName={appName} logoUrl={logoUrl}/>
          </div>
          <CardTitle className="font-headline">Welcome Back</CardTitle>
          <CardDescription>Enter your credentials to access your account.</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" type="text" placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value)} required disabled={isLoading} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isLoading} />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;
