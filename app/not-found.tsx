import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
        <p className="text-6xl font-bold text-gold-400">404</p>
        <h1 className="mt-4 text-2xl font-bold text-laguna-900">
          Halaman tidak ditemukan
        </h1>
        <p className="mt-2 max-w-md text-laguna-700">
          Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center rounded-full bg-laguna-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-laguna-800"
          >
            Kembali ke Beranda
          </Link>
          <Link
            href="/properti"
            className="inline-flex items-center rounded-full border border-laguna-200 bg-white px-5 py-2.5 text-sm font-semibold text-laguna-700 transition hover:border-laguna-300 hover:bg-laguna-50"
          >
            Cari Properti
          </Link>
        </div>
      </div>
    </main>
  );
}
