import type { Metadata } from "next";
import { LegalContent } from "@/components/legal/LegalContent";

export const metadata: Metadata = {
  title: "Privacidad y términos",
  description:
    "Política de privacidad y términos de servicio de Blog de la diseñadora.",
};

export default function LegalPage() {
  return <LegalContent />;
}
