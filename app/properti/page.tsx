import { Suspense } from "react";
import type { Metadata } from "next";
import { BRAND } from "@/lib/brand";
import PropertiExplorer from "@/components/properti/PropertiExplorer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Cari Properti",
  description: `Cari rumah subsidi dan properti komersil di Sulawesi Tenggara berdasarkan peta, harga, dan wilayah — ${BRAND.name}.`,
};

export default function PropertiPage() {
  return (
    <Suspense>
      <PropertiExplorer />
    </Suspense>
  );
}
