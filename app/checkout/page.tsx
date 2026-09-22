import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { CheckoutTitle } from "@/components/checkout/CheckoutTitle";

interface CheckoutPageProps {
  searchParams: Promise<{ buy?: string }>;
}

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const { buy } = await searchParams;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <CheckoutTitle />
      <CheckoutForm buySlug={buy} />
    </div>
  );
}
