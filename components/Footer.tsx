import Link from "next/link";
import { BRAND, ATTRIBUTION_TEXT } from "@/lib/brand";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16 bg-laguna-950 text-laguna-100">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <p className="text-lg font-extrabold text-white">{BRAND.name}</p>
          <p className="mt-1 text-sm text-laguna-200">{BRAND.tagline}</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-laguna-300">
            {BRAND.description}
          </p>
        </div>
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-gold-400">Jelajahi</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link className="hover:text-white" href="/properti">Cari properti</Link></li>
            <li><Link className="hover:text-white" href="/properti?category=rumah_subsidi">Rumah subsidi</Link></li>
            <li><Link className="hover:text-white" href="/properti?category=properti_developer">Properti komersil</Link></li>
            <li><Link className="hover:text-white" href="/tentang">Tentang kami</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-gold-400">Informasi</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link className="hover:text-white" href="/sumber-data">Sumber data & disclaimer</Link></li>
            <li><Link className="hover:text-white" href="/privasi">Kebijakan privasi</Link></li>
            <li>
              <a className="hover:text-white" href={`mailto:${BRAND.contactEmail}`}>
                {BRAND.contactEmail}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">
          <p className="text-xs leading-relaxed text-laguna-300">{ATTRIBUTION_TEXT}</p>
          <p className="mt-2 text-xs text-laguna-400">
            © {year} {BRAND.name}. Data direktori dapat berubah sewaktu-waktu.
          </p>
        </div>
      </div>
    </footer>
  );
}
