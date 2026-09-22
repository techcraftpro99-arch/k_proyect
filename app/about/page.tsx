import type { Metadata } from "next";
import { AboutContent } from "@/components/about/AboutContent";

export const metadata: Metadata = {
  title: "Sobre mí — Karol",
  description:
    "Hola, soy Karol. Animaciones de MVP, dedicatorias, flyers y batallas oficiales para que tu live destaque.",
};

export default function AboutPage() {
  return <AboutContent />;
}
