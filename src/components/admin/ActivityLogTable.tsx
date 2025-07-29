
"use client";

import { useState, type FC } from "react";
import type { ActivityLog } from "@/lib/types";
import { initialActivityLog } from "@/data/activityLog";
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
  const [logs] = useState<ActivityLog[]>(initialActivityLog);

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
                <TableCell className="font-medium">{log.user.name}</TableCell>
                <TableCell>
                   <Badge variant={log.user.role === 'admin' ? 'destructive' : 'secondary'}>{log.user.role}</Badge>
                </TableCell>
                <TableCell>{log.action}</TableCell>
                <TableCell className="text-muted-foreground">{log.details}</TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {new Date(log.date).toLocaleString()}
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
