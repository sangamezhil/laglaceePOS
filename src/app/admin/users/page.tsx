
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Download, Calendar as CalendarIcon, History } from "lucide-react";
import UserTable from "@/components/admin/UserTable";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { User } from "@/lib/types";
import { getActivityLog } from "@/lib/activityLog";
import { initialProducts } from "@/data/products";


interface DownloadHistoryItem {
  id: number;
  range: string;
  downloadedAt: Date;
}

export default function UserManagementPage() {
  const [date, setDate] = useState<DateRange | undefined>();
  const [downloadHistory, setDownloadHistory] = useState<DownloadHistoryItem[]>([]);
  const { toast } = useToast();

  const handleDownload = () => {
    if (!date?.from || !date?.to) {
      toast({
        variant: "destructive",
        title: "Please select a date range",
        description: "You must select a start and end date to download data.",
      });
      return;
    }

    const rangeString = `${format(date.from, "LLL dd, y")} - ${format(date.to, "LLL dd, y")}`;
    
    // 1. Fetch all data from localStorage
    const salesData = JSON.parse(localStorage.getItem('sales') || '[]');
    const activityLogData = getActivityLog();
    const productsData = initialProducts; // This could be enhanced to fetch from a live state if needed

    // Filter data based on the selected date range
    const filteredSales = salesData.filter((sale: any) => {
        const saleDate = new Date(sale.date);
        return saleDate >= date.from! && saleDate <= date.to!;
    });

    const filteredActivity = activityLogData.filter(log => {
        const logDate = new Date(log.date);
        return logDate >= date.from! && logDate <= date.to!;
    });
    
    // Combine all data into a single object
    const systemData = {
      sales: filteredSales,
      activityLog: filteredActivity,
      products: productsData, // Products don't have dates, so we include all
    };

    // 2. Convert to JSON string
    const jsonContent = JSON.stringify(systemData, null, 2);

    // 3. Create a Blob
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    
    // 4. Create a download link and trigger the download
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `system-data-${format(new Date(), "yyyy-MM-dd")}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Update download history
    const newHistoryItem: DownloadHistoryItem = {
      id: Date.now(),
      range: rangeString,
      downloadedAt: new Date(),
    };

    setDownloadHistory([newHistoryItem, ...downloadHistory].slice(0, 5));

    toast({
      title: "Download Started",
      description: `System data for ${rangeString} is being prepared.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline">User Management</h1>
          <p className="text-muted-foreground">Add, edit, and manage users.</p>
        </div>
        <div className="flex flex-wrap gap-2">
           <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className="w-[300px] justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y")} -{" "}
                      {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          <Button onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download Data
          </Button>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>
      
      <UserTable onUsersChange={() => {}} />

      {downloadHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Recent Downloads
            </CardTitle>
            <CardDescription>
              Here are the last 5 data downloads you initiated.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date Range</TableHead>
                  <TableHead className="text-right">Downloaded At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {downloadHistory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Badge variant="outline">{item.range}</Badge>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {format(item.downloadedAt, "PPpp")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
