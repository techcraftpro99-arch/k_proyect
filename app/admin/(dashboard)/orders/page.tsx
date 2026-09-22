import { OrdersTable } from "@/components/admin/OrdersTable";
import { getOrders } from "@/lib/orders";
import { isSupabaseConfigured } from "@/lib/supabase/admin";

export default async function AdminOrdersPage() {
  const configured = isSupabaseConfigured();
  const orders = configured ? await getOrders() : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h2 className="mb-6 text-2xl font-bold">Orders</h2>
      {!configured ? (
        <div className="glass-card p-8 text-center text-muted-foreground">
          Supabase is not configured. Connect your database to manage orders.
        </div>
      ) : (
        <OrdersTable orders={orders} />
      )}
    </div>
  );
}
