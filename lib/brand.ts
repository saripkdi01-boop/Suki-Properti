// Satu-satunya tempat nama brand didefinisikan — ganti di sini untuk rebrand.
export const BRAND = {
  name: "Sultra Properti",
  tagline: "Direktori Perumahan Sulawesi Tenggara",
  description:
    "Direktori perumahan Sulawesi Tenggara: cari rumah subsidi dan komersil berdasarkan peta, harga, dan wilayah.",
  sourceName: "SiKumbang BP Tapera",
  sourceUrl: "https://sikumbang.tapera.go.id/",
  contactEmail: "halo@sultraproperti.id",
} as const;

export const ATTRIBUTION_TEXT =
  `Sumber data: ${BRAND.sourceName} (${BRAND.sourceUrl.replace("https://", "")}). ` +
  `Data direktori agregat, bukan listing yang dipasang oleh ${BRAND.name}.`;
