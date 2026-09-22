"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CategorySidebar } from "./CategorySidebar";
import type { Category } from "@/types/product";
import { useI18n } from "@/components/i18n/LocaleProvider";

interface MobileCategorySheetProps {
  categories: Category[];
}

export function MobileCategorySheet({ categories }: MobileCategorySheetProps) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="inline-flex items-center justify-center gap-2 rounded-full border border-input bg-background px-4 py-2 text-sm font-medium lg:hidden">
        <Menu className="h-4 w-4" />
        {t.shop.categories}
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px]">
        <SheetHeader>
          <SheetTitle>{t.shop.categories}</SheetTitle>
        </SheetHeader>
        <div className="mt-4">
          <CategorySidebar
            categories={categories}
            className="border-0 bg-transparent shadow-none"
            onNavigate={() => setOpen(false)}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
