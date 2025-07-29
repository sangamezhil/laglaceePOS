import SalesHistoryTable from "@/components/admin/SalesHistoryTable";

export default function SalesHistoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Sales History</h1>
        <p className="text-muted-foreground">
          View and manage your sales history.
        </p>
      </div>
      <SalesHistoryTable />
    </div>
  );
}
