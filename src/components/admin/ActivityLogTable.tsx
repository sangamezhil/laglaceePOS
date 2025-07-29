
"use client";

import { useState, type FC, useEffect } from "react";
import type { ActivityLog } from "@/lib/types";
import { getActivityLog } from "@/lib/activityLog";
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
import { Badge } from "@/components/ui/badge";

const ActivityLogTable: FC = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [formattedDates, setFormattedDates] = useState<Record<string, string>>({});

  const updateLogs = () => {
    const currentLogs = getActivityLog();
    setLogs(currentLogs);
    
    // Pre-format dates to avoid doing it in the render loop
    const newFormattedDates: Record<string, string> = {};
    for (const log of currentLogs) {
      newFormattedDates[log.id] = new Date(log.date).toLocaleString();
    }
    setFormattedDates(newFormattedDates);
  };
  
  useEffect(() => {
    updateLogs();

    // Listen for storage changes to update the log in real-time
    const handleStorageChange = () => {
      updateLogs();
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Log</CardTitle>
        <CardDescription>
          A list of recent activities performed by users.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Details</TableHead>
              <TableHead className="text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="font-medium">{log.username}</TableCell>
                <TableCell>
                   <Badge variant={log.role === 'admin' ? 'destructive' : 'secondary'}>{log.role}</Badge>
                </TableCell>
                <TableCell>{log.action}</TableCell>
                <TableCell className="text-muted-foreground">{log.details}</TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {formattedDates[log.id]}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ActivityLogTable;
