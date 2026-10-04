"use client";

/**
 * Tombol cetak denah — membuka dialog print browser.
 * (v1: cetak halaman; export PDF/JPG full-res ala sdpcore butuh render
 * server terpisah — fase lanjutan bila dibutuhkan.)
 */
export default function SiteplanPrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-1.5 rounded-lg border border-laguna-600 px-4 py-2 text-sm font-semibold text-laguna-700 transition hover:bg-laguna-50"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2m-12-3h12v6H6z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Cetak Denah
    </button>
  );
}
