
import SalesHistoryTable from "@/components/admin/SalesHistoryTable";
import { redirect } from 'next/navigation';

export default function SalesHistoryPage() {
  // This is a placeholder for a real auth check.
  // In a real app, this would be a server-side check of the user's session.
  const userRole = 'admin'; // Assume admin for this route

  if (userRole !== 'admin') {
    redirect('/login');
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Sales History</h1>
        <p className="text-muted-foreground">
          View and manage all sales transactions.
        </p>
      </div>
      <SalesHistoryTable />
    </div>
  );
}
