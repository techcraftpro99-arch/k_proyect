import { CheckoutSuccessContent } from "@/components/checkout/CheckoutSuccessContent";

interface SuccessPageProps {
  searchParams: Promise<{ order?: string; manual?: string }>;
}

export default async function CheckoutSuccessPage({
  searchParams,
}: SuccessPageProps) {
  const { order, manual } = await searchParams;

  return (
    <CheckoutSuccessContent order={order} manual={Boolean(manual)} />
  );
}
