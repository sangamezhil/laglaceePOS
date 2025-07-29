
"use client";

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
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";

export default function ProfilePage() {
    const { toast } = useToast();

    const handleSaveChanges = () => {
        toast({
            title: "Changes Saved",
            description: "Your company details have been updated.",
        });
    }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Company Profile</h1>
        <p className="text-muted-foreground">
          Manage your company details and settings.
        </p>
      </div>
      
      <Card>
        <CardHeader>
            <CardTitle>Company Details</CardTitle>
            <CardDescription>Update your company's information here.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-2">
                <Label htmlFor="company-name">Company Name</Label>
                <Input id="company-name" placeholder="Your Company Inc." />
            </div>
             <div className="space-y-2">
                <Label htmlFor="contact-email">Contact Email</Label>
                <Input id="contact-email" type="email" placeholder="contact@yourcompany.com" />
            </div>
          </div>
           <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" placeholder="123 Main St, Anytown, USA" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" placeholder="+1 (234) 567-890" />
            </div>
             <div className="space-y-2">
                <Label htmlFor="tax-id">Tax ID / GSTIN</Label>
                <Input id="tax-id" placeholder="Your Tax ID" />
            </div>
          </div>
        </CardContent>
        <CardFooter>
            <Button onClick={handleSaveChanges}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
