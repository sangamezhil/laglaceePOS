
import ActivityLogTable from "@/components/admin/ActivityLogTable";

export default function ActivityLogPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">User Activity Log</h1>
        <p className="text-muted-foreground">
          Track user actions across the system.
        </p>
      </div>
      <ActivityLogTable />
    </div>
  );
}
