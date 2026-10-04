import type { Metadata } from "next";
import { BRAND, ATTRIBUTION_TEXT } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Sumber Data & Disclaimer",
  description:
    "Sumber data Sultra Properti dari direktori publik SiKumbang BP Tapera, beserta disclaimer akurasi data.",
};

export default function SumberDataPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-bold text-laguna-900">
        Sumber Data &amp; Disclaimer
      </h1>

      <section className="mt-8 space-y-4 text-laguna-800">
        <h2 className="text-xl font-semibold text-laguna-900">
          Dari mana data berasal?
        </h2>
        <p>
          Seluruh data perumahan di {BRAND.name} berasal dari{" "}
          <strong>{BRAND.sourceName}</strong> — direktori perumahan resmi milik
          BP Tapera yang dipublikasikan untuk umum. Data tersebut meliputi
          perumahan subsidi maupun komersil.
        </p>
        <div className="rounded-2xl border border-gold-300 bg-gold-300/15 p-5">
          <p className="text-sm text-laguna-800">{ATTRIBUTION_TEXT}</p>
          <a
            href={BRAND.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center rounded-full bg-laguna-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-laguna-800"
          >
            Kunjungi SiKumbang
          </a>
        </div>
      </section>

      <section className="mt-8 space-y-4 text-laguna-800">
        <h2 className="text-xl font-semibold text-laguna-900">
          Apa yang kami tampilkan
        </h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>Nama perumahan dan pengembangnya</li>
          <li>Tipe unit dan harga yang tercantum di sumber</li>
          <li>Lokasi (kabupaten/kota dan kecamatan)</li>
          <li>Kontak marketing pengembang (WhatsApp/telepon) bila tersedia</li>
        </ul>
        <p>
          Kami menampilkan data sebagai <strong>agregat direktori</strong>,
          bukan listing yang kami pasang atau kami kelola sendiri.
        </p>
      </section>

      <section className="mt-8 space-y-4 text-laguna-800">
        <h2 className="text-xl font-semibold text-laguna-900">Disclaimer</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            Data dapat berubah atau kurang tepat sewaktu-waktu. Harga, status
            ketersediaan, dan detail unit mengikuti ketentuan pengembang.
          </li>
          <li>
            <strong>
              Selalu verifikasi informasi langsung ke pengembang atau marketing
              yang bersangkutan sebelum melakukan transaksi apa pun.
            </strong>
          </li>
          <li>
            {BRAND.name} bukan penjual, bukan agen properti, dan tidak memungut
            biaya apa pun — dari pencari rumah maupun pengembang.
          </li>
          <li>Cakupan data saat ini hanya Sulawesi Tenggara.</li>
        </ul>
      </section>
    </main>
  );
}
