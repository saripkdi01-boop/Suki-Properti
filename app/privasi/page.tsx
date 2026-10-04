import type { Metadata } from "next";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Kebijakan Privasi",
  description:
    "Kebijakan privasi Sultra Properti — tanpa akun, tanpa pengumpulan data pribadi.",
};

export default function PrivasiPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-bold text-laguna-900">Kebijakan Privasi</h1>
      <p className="mt-2 text-sm text-laguna-600">
        Terakhir diperbarui: Oktober 2026
      </p>

      <section className="mt-8 space-y-4 text-laguna-800">
        <h2 className="text-xl font-semibold text-laguna-900">
          Kami tidak meminta data pribadi
        </h2>
        <p>
          {BRAND.name} tidak memiliki fitur akun atau login. Kami tidak meminta,
          mengumpulkan, atau menyimpan data pribadi Anda — tidak ada nama,
          nomor telepon, alamat email, atau informasi identitas lainnya yang
          kami simpan.
        </p>
      </section>

      <section className="mt-8 space-y-4 text-laguna-800">
        <h2 className="text-xl font-semibold text-laguna-900">Pencarian</h2>
        <p>
          Filter pencarian yang Anda gunakan (misalnya pilihan harga atau
          wilayah) hanya diproses di perangkat Anda dan tidak disimpan di
          server kami.
        </p>
      </section>

      <section className="mt-8 space-y-4 text-laguna-800">
        <h2 className="text-xl font-semibold text-laguna-900">
          Link eksternal
        </h2>
        <p>
          Tombol WhatsApp dan telepon pada halaman properti menghubungkan Anda
          langsung ke kontak marketing pengembang. Setelah Anda meninggalkan
          situs ini, privasi Anda menjadi tanggung jawab layanan pihak ketiga
          tersebut.
        </p>
      </section>

      <section className="mt-8 space-y-4 text-laguna-800">
        <h2 className="text-xl font-semibold text-laguna-900">
          Perubahan kebijakan
        </h2>
        <p>
          Jika kebijakan ini berubah, versi terbaru akan selalu tersedia di
          halaman ini.
        </p>
        <p>
          Pertanyaan seputar privasi? Hubungi kami di{" "}
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
