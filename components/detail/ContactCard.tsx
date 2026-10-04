import type { ParsedDescription } from "@/lib/parse";

interface ContactCardProps {
  parsed: ParsedDescription;
  title: string;
  alamat: string;
}

function waHref(phone: string, title: string, alamat: string): string {
  const text = `Halo, saya tertarik dengan info perumahan ${title} di ${alamat}.`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

export default function ContactCard({ parsed, title, alamat }: ContactCardProps) {
  const hasContact = parsed.phones.length > 0 || parsed.emails.length > 0;

  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-5" aria-label="Kontak marketing">
      <h2 className="text-base font-bold text-laguna-900">Kontak Marketing</h2>

      {parsed.developer && (
        <div className="mt-3">
          <p className="text-xs font-medium uppercase tracking-wide text-stone-500">Pengembang</p>
          <p className="mt-0.5 text-sm font-semibold text-stone-800">
            {parsed.developer}
            {parsed.association && <span className="font-normal text-stone-500"> ({parsed.association})</span>}
          </p>
        </div>
      )}

      {parsed.marketingAddress && (
        <div className="mt-3">
          <p className="text-xs font-medium uppercase tracking-wide text-stone-500">Kantor pemasaran</p>
          <p className="mt-0.5 text-sm text-stone-700">{parsed.marketingAddress}</p>
        </div>
      )}

      {!hasContact && (
        <div className="mt-4">
          <p className="text-sm text-stone-600">
            Kontak belum tersedia di data direktori kami.
          </p>
          {parsed.sourceUrl && (
            <a
              href={parsed.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-laguna-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-laguna-700"
            >
              Lihat kontak di SiKumbang
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 17 17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          )}
        </div>
      )}

      {parsed.phones.map((phone) => (
        <div key={phone} className="mt-3 flex gap-2">
          <a
            href={`tel:+${phone}`}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-laguna-600 px-3 py-2.5 text-sm font-semibold text-laguna-700 transition hover:bg-laguna-50"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L8 9.6a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2Z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Telepon
          </a>
          <a
            href={waHref(phone, title, alamat)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-laguna-600 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-laguna-700"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.3 13.9c-.2.7-1.3 1.4-1.9 1.5-.5.1-1.2.2-3.9-.8-3.3-1.3-5.4-4.7-5.6-4.9-.2-.2-1.3-1.8-1.3-3.4s.8-2.4 1.1-2.7c.3-.4.7-.5 1-.5h.7c.2 0 .6-.1.9.7l1.3 3.1c.1.2.1.5 0 .7l-.6.8-.7.7c-.2.2-.4.5-.2.9.2.4.9 1.5 2 2.4 1.4 1.2 2.5 1.6 2.9 1.8.4.2.6.1.8-.1l1-1.2c.2-.3.5-.2.8-.1l2.9 1.4c.3.1.4.2.5.4 0 .1 0 .5-.2 1.4Z" />
            </svg>
            WhatsApp
          </a>
        </div>
      ))}

      {parsed.emails.map((email) => (
        <a
          key={email}
          href={`mailto:${email}`}
          className="mt-3 flex items-center gap-2 break-all rounded-lg border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm text-stone-700 transition hover:border-laguna-400"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="m3 7 9 6 9-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {email}
        </a>
      ))}
    </section>
  );
}
