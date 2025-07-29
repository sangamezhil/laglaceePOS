
"use client";

import { useState, useEffect } from "react";
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
import { addActivityLog } from "@/lib/activityLog";

export default function ProfilePage() {
    const { toast } = useToast();
    const [companyName, setCompanyName] = useState("");
    const [contactEmail, setContactEmail] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [taxId, setTaxId] = useState("");
    const [logoUrl, setLogoUrl] = useState("");

    useEffect(() => {
        setCompanyName(localStorage.getItem("companyName") || "");
        setContactEmail(localStorage.getItem("contactEmail") || "");
        setAddress(localStorage.getItem("address") || "");
        setPhone(localStorage.getItem("phone") || "");
        setTaxId(localStorage.getItem("taxId") || "");
        setLogoUrl(localStorage.getItem("logoUrl") || "");
    }, []);

    const handleSaveChanges = () => {
        localStorage.setItem("companyName", companyName);
        localStorage.setItem("contactEmail", contactEmail);
        localStorage.setItem("address", address);
        localStorage.setItem("phone", phone);
        localStorage.setItem("taxId", taxId);
        localStorage.setItem("logoUrl", logoUrl);

        addActivityLog({
            username: 'admin',
            role: 'admin',
            action: 'Updated Profile',
            details: 'Company profile details were updated.'
        });

        toast({
            title: "Changes Saved",
            description: "Your company details have been updated.",
        });

        window.location.reload();
    }

    const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setLogoUrl(base64String);
            };
            reader.readAsDataURL(file);
        }
    };

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
                <Input id="company-name" placeholder="Your Company Inc." value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
            </div>
             <div className="space-y-2">
                <Label htmlFor="logo-file">Company Logo</Label>
                <Input id="logo-file" type="file" accept="image/*" onChange={handleLogoChange} />
                 {logoUrl && (
                    <div className="mt-4">
                        <img src={logoUrl} alt="Logo Preview" className="h-20 w-auto object-contain rounded-md border p-2" />
                        <p className="text-xs text-muted-foreground mt-1">Logo Preview</p>
                    </div>
                 )}
            </div>
          </div>
           <div className="space-y-2">
            <Label htmlFor="contact-email">Contact Email</Label>
            <Input id="contact-email" type="email" placeholder="contact@yourcompany.com" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
          </div>
           <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" placeholder="123 Main St, Anytown, USA" value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" placeholder="+1 (234) 567-890" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
             <div className="space-y-2">
                <Label htmlFor="tax-id">Tax ID / GSTIN</Label>
                <Input id="tax-id" placeholder="Your Tax ID" value={taxId} onChange={(e) => setTaxId(e.target.value)} />
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
