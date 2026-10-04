/**
 * Parser deskripsi direktori SiKumbang menjadi struktur rapi.
 * Format sumber (contoh):
 *   "SERENIA CAMPUS oleh PT TALLASA SANDY KARSA (REI).\nAlamat: ...\n\nTipe rumah:\n- NAMA 36 (Subsidi): Rp 173.000.000, LB 36 m2 / LT 91 m2, 2 KT / 1 KM, 1 lantai.\n\nKantor pemasaran: Alamat: ...; Telp: +62 ...; Email: ...\n\nSumber data: SiKumbang BP Tapera — https://sikumbang.tapera.go.id/lokasi-perumahan/XXX ..."
 */

export interface HouseType {
  name: string;
  label: string | null; // "Subsidi" | "Komersil" | null
  price: number | null;
  lb: number | null;
  lt: number | null;
  kt: number | null;
  km: number | null;
  floors: number | null;
}

export interface ParsedDescription {
  developer: string | null;
  association: string | null;
  types: HouseType[];
  phones: string[];
  emails: string[];
  marketingAddress: string | null;
  sourceUrl: string | null;
}

function parseRupiah(s: string): number | null {
  const m = s.match(/Rp\s*([\d.]+)/);
  if (!m) return null;
  const n = parseInt(m[1].replace(/\./g, ""), 10);
  return Number.isFinite(n) ? n : null;
}

function num(m: RegExpMatchArray | null): number | null {
  if (!m) return null;
  const n = parseInt(m[1], 10);
  return Number.isFinite(n) ? n : null;
}

function parseTypeLine(line: string): HouseType | null {
  const text = line.replace(/^-\s*/, "").trim();
  if (!text) return null;
  const colon = text.indexOf(":");
  const head = colon >= 0 ? text.slice(0, colon).trim() : text;
  const body = colon >= 0 ? text.slice(colon + 1) : "";
  const labelMatch = head.match(/\((Subsidi|Komersil)\)\s*$/i);
  const name = head.replace(/\s*\((Subsidi|Komersil)\)\s*$/i, "").trim();
  if (!name) return null;
  return {
    name,
    label: labelMatch ? labelMatch[1] : null,
    price: parseRupiah(body),
    lb: num(body.match(/LB\s*(\d+)\s*m2/i)),
    lt: num(body.match(/LT\s*(\d+)\s*m2/i)),
    kt: num(body.match(/(\d+)\s*KT/i)),
    km: num(body.match(/(\d+)\s*KM/i)),
    floors: num(body.match(/(\d+)\s*lantai/i)),
  };
}

/** Normalisasi nomor ke format wa.me: "0852-5500-4343" -> "6285255004343". */
export function toWaNumber(raw: string): string | null {
  const digits = raw.replace(/[^\d]/g, "");
  if (digits.length < 9 || digits.length > 15) return null;
  if (digits.startsWith("62")) return digits;
  if (digits.startsWith("0")) return "62" + digits.slice(1);
  if (digits.startsWith("8")) return "62" + digits;
  return null;
}

export function parseDescription(desc: string | null): ParsedDescription {
  const out: ParsedDescription = {
    developer: null,
    association: null,
    types: [],
    phones: [],
    emails: [],
    marketingAddress: null,
    sourceUrl: null,
  };
  if (!desc) return out;

  // Baris pertama: "NAMA oleh PT X (REI)."
  const firstLine = desc.split("\n")[0] ?? "";
  const devMatch = firstLine.match(/oleh\s+(.+?)(?:\s*\(([^)]+)\))?\.\s*$/);
  if (devMatch) {
    out.developer = devMatch[1].trim() || null;
    out.association = devMatch[2]?.trim() || null;
  }

  // Blok "Tipe rumah:" -> baris-baris "- ..."
  const typeBlock = desc.match(/Tipe rumah:\s*\n((?:- .*(?:\n|$))+)/);
  if (typeBlock) {
    for (const line of typeBlock[1].split("\n")) {
      if (line.trim().startsWith("-")) {
        const t = parseTypeLine(line);
        if (t) out.types.push(t);
      }
    }
  }

  // Blok "Kantor pemasaran:"
  const mkMatch = desc.match(/Kantor pemasaran:\s*([^\n]+)/);
  if (mkMatch) {
    const block = mkMatch[1];
    const addr = block.match(/Alamat:\s*([^;]+)/);
    if (addr) out.marketingAddress = addr[1].trim() || null;
    const phones = new Set<string>();
    for (const m of block.matchAll(/(?:Telp|WA|HP|No\.?\s*HP)\s*:\s*([+\d][\d\s\-().]{7,})/gi)) {
      const wa = toWaNumber(m[1]);
      if (wa) phones.add(wa);
    }
    // Nomor lepas tanpa label (pola umum Indonesia)
    for (const m of block.matchAll(/(?<!\d)(?:\+?62|0)8\d[\d\s\-().]{7,}(?!\d)/g)) {
      const wa = toWaNumber(m[0]);
      if (wa) phones.add(wa);
    }
    out.phones = [...phones].slice(0, 3);
    const emails = new Set<string>();
    for (const m of block.matchAll(/[\w.+-]+@[\w-]+\.[\w.]+/g)) emails.add(m[0]);
    out.emails = [...emails].slice(0, 2);
  }

  // URL sumber SiKumbang
  const src = desc.match(/https:\/\/sikumbang\.tapera\.go\.id\/lokasi-perumahan\/[A-Za-z0-9]+/);
  if (src) out.sourceUrl = src[0];

  return out;
}
