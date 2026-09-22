"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Order } from "@/types/order";
import { formatPrice } from "@/lib/format";

interface OrdersTableProps {
  orders: Order[];
}

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  paid: "bg-green-100 text-green-800",
  cancelled: "bg-slate-100 text-slate-600",
  refunded: "bg-red-100 text-red-800",
};

export function OrdersTable({ orders: initialOrders }: OrdersTableProps) {
  const [orders, setOrders] = useState(initialOrders);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function approveOrder(orderId: string) {
    setLoadingId(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/approve`, {
        method: "POST",
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId
              ? { ...o, status: "paid" as const, paidAt: new Date().toISOString() }
              : o
          )
        );
      }
    } finally {
      setLoadingId(null);
    }
  }

  if (!orders.length) {
    return (
      <div className="glass-card p-8 text-center text-muted-foreground">
        No orders yet.
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/50 text-left text-muted-foreground">
              <th className="p-4 font-medium">Order</th>
              <th className="p-4 font-medium">Email</th>
              <th className="p-4 font-medium">Method</th>
              <th className="p-4 font-medium">Total</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Date</th>
              <th className="p-4 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-white/30">
                <td className="p-4 font-mono text-xs">{order.id.slice(0, 8)}…</td>
                <td className="p-4">{order.email}</td>
                <td className="p-4 capitalize">{order.paymentMethod}</td>
                <td className="p-4 font-medium">{formatPrice(order.total)}</td>
                <td className="p-4">
                  <Badge className={statusColors[order.status] ?? ""}>
                    {order.status}
                  </Badge>
                </td>
                <td className="p-4 text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4">
                  {order.status === "pending" && (
                    <Button
                      size="sm"
                      className="rounded-full"
                      disabled={loadingId === order.id}
                      onClick={() => approveOrder(order.id)}
                    >
                      {loadingId === order.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Mark Paid"
                      )}
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
