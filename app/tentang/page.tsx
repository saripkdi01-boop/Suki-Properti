import type { Metadata } from "next";
import { BRAND } from "@/lib/brand";
import { getStats } from "@/lib/properties";

export const metadata: Metadata = {
  title: "Tentang",
  description:
    "Tentang Sultra Properti — direktori perumahan Sulawesi Tenggara berbasis data publik SiKumbang BP Tapera.",
};

const STEPS = [
  {
    no: "1",
    title: "Cari",
    text: "Telusuri perumahan berdasarkan peta, harga, atau wilayah (kabupaten/kota dan kecamatan).",
  },
  {
    no: "2",
    title: "Bandingkan",
    text: "Lihat tipe unit, harga, dan lokasi beberapa perumahan untuk menemukan yang paling cocok.",
  },
  {
    no: "3",
    title: "Hubungi marketing",
    text: "Setelah menemukan yang sesuai, hubungi kontak marketing pengembang langsung via WhatsApp atau telepon.",
  },
];

export default async function TentangPage() {
  const stats = await getStats();
  const cakupan =
    stats.total > 0
      ? `Saat ini direktori mencakup ${stats.total.toLocaleString("id-ID")} perumahan di Sulawesi Tenggara.`
      : "Saat ini direktori mencakup ratusan perumahan di Sulawesi Tenggara.";

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-bold text-laguna-900">Tentang {BRAND.name}</h1>
      <p className="mt-2 text-laguna-700">{BRAND.tagline}</p>

      <section className="mt-8 space-y-4 text-laguna-800">
        <h2 className="text-xl font-semibold text-laguna-900">
          Apa itu {BRAND.name}?
        </h2>
        <p>
          {BRAND.name} adalah <strong>direktori perumahan</strong>, bukan
          marketplace dan bukan agen properti. Kami mengumpulkan dan menampilkan
          informasi perumahan yang tersedia di Sulawesi Tenggara dalam satu
          tempat yang mudah dicari — nama perumahan, tipe unit, harga, lokasi,
          dan kontak marketing pengembang.
        </p>
        <p>
          Data kami berasal dari direktori publik {BRAND.sourceName} milik BP
          Tapera. Kami tidak memasang listing sendiri, tidak memungut biaya
          dari pencari rumah maupun pengembang, dan tidak terlibat dalam proses
          transaksi jual beli.
        </p>
      </section>

      <section className="mt-8 space-y-4 text-laguna-800">
        <h2 className="text-xl font-semibold text-laguna-900">
          Cakupan saat ini
        </h2>
        <p>{cakupan}</p>
        <p>
          Cakupan data kami saat ini <strong>hanya Sulawesi Tenggara</strong>.
          Kami tidak menampilkan perumahan dari provinsi lain.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-laguna-900">Cara kerja</h2>
        <ol className="mt-4 grid gap-4 sm:grid-cols-3">
          {STEPS.map((s) => (
            <li
              key={s.no}
              className="rounded-2xl border border-laguna-100 bg-white p-5 shadow-sm"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-laguna-700 text-sm font-bold text-white">
                {s.no}
              </span>
              <h3 className="mt-3 font-semibold text-laguna-900">{s.title}</h3>
              <p className="mt-1 text-sm text-laguna-700">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-8 space-y-4 text-laguna-800">
        <h2 className="text-xl font-semibold text-laguna-900">Rencana ke depan</h2>
        <p>
          Ke depan kami berencana memperluas cakupan ke provinsi lain di luar
          Sulawesi Tenggara, serta menambah fitur seperti simpan pencarian dan
          notifikasi harga. Ini adalah rencana, bukan janji — untuk saat ini
          fokus kami tetap pada Sulawesi Tenggara.
        </p>
      </section>

      <section className="mt-8 space-y-2 text-laguna-800">
        <h2 className="text-xl font-semibold text-laguna-900">Kontak</h2>
        <p>
          Ada pertanyaan atau menemukan data yang kurang tepat? Hubungi kami di{" "}
          <a
            href={`mailto:${BRAND.contactEmail}`}
            className="font-medium text-laguna-700 underline underline-offset-2"
          >
            {BRAND.contactEmail}
          </a>
          .
        </p>
      </section>
    </main>
  );
}
