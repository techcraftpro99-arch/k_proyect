import { BrandSettingsPanel } from "@/components/admin/BrandSettingsPanel";
import { getStoreSettings } from "@/lib/store-settings";

export default async function AdminSettingsPage() {
  const settings = await getStoreSettings();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h2 className="mb-6 text-2xl font-semibold">Ajustes de marca</h2>
      <BrandSettingsPanel
        initialPath={settings.brandImagePath}
        initialUrl={settings.brandImageUrl}
      />
    </div>
  );
}
