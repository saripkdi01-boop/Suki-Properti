"use client";

import { useMemo, useState } from "react";
import { hitungCicilanKPR, formatRupiahFull } from "@/lib/format";

interface KprSimulatorProps {
  price: number | null;
  isSubsidi: boolean;
}

const TENORS = [5, 10, 15, 20, 25];

export default function KprSimulator({ price, isSubsidi }: KprSimulatorProps) {
  const [dpPersen, setDpPersen] = useState(10);
  const [tenorTahun, setTenorTahun] = useState(15);
  const [bungaPersen, setBungaPersen] = useState(7.5);

  const hasil = useMemo(
    () => (price === null ? null : hitungCicilanKPR(price, dpPersen, tenorTahun, bungaPersen)),
    [price, dpPersen, tenorTahun, bungaPersen]
  );

  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-5" aria-label="Simulasi KPR">
      <h2 className="text-base font-bold text-laguna-900">Simulasi KPR</h2>

      {price === null || hasil === null ? (
        <p className="mt-2 text-sm text-stone-600">
          Harga belum tercantum — hubungi marketing untuk simulasi KPR.
        </p>
      ) : (
        <>
          <p className="mt-1 text-xs text-stone-500">
            Harga properti: <span className="font-semibold text-laguna-800">{formatRupiahFull(price)}</span>
          </p>

          <div className="mt-4 space-y-4">
            {/* Uang muka */}
            <div>
              <label htmlFor="kpr-dp" className="flex items-center justify-between text-sm font-medium text-stone-700">
                Uang muka (DP)
                <span className="font-bold text-laguna-800">{dpPersen}%</span>
              </label>
              <input
                id="kpr-dp"
                type="range"
                min={0}
                max={50}
                step={1}
                value={dpPersen}
                onChange={(e) => setDpPersen(Number(e.target.value))}
                className="mt-1 w-full accent-laguna-600"
              />
            </div>

            {/* Tenor */}
            <div>
              <label htmlFor="kpr-tenor" className="text-sm font-medium text-stone-700">
                Tenor
              </label>
              <select
                id="kpr-tenor"
                value={tenorTahun}
                onChange={(e) => setTenorTahun(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800"
              >
                {TENORS.map((t) => (
                  <option key={t} value={t}>
                    {t} tahun
                  </option>
                ))}
              </select>
            </div>

            {/* Bunga */}
            <div>
              <label htmlFor="kpr-bunga" className="flex items-center justify-between text-sm font-medium text-stone-700">
                Bunga per tahun
                <span className="font-bold text-laguna-800">{bungaPersen.toFixed(1)}%</span>
              </label>
              <input
                id="kpr-bunga"
                type="range"
                min={0}
                max={15}
                step={0.25}
                value={bungaPersen}
                onChange={(e) => setBungaPersen(Number(e.target.value))}
                className="mt-1 w-full accent-laguna-600"
              />
              {isSubsidi && (
                <p className="mt-1 text-xs text-stone-500">
                  KPR subsidi umumnya berbunga rendah — sesuaikan dengan bank.
                </p>
              )}
            </div>
          </div>

          {/* Hasil */}
          <div className="mt-5 rounded-xl bg-laguna-50 p-4 text-center">
            <p className="text-xs font-medium uppercase tracking-wide text-laguna-700">Estimasi cicilan / bulan</p>
            <p className="mt-1 text-2xl font-extrabold text-laguna-900">
              {formatRupiahFull(Math.round(hasil.cicilan))}
            </p>
            <dl className="mt-3 grid grid-cols-2 gap-2 text-left">
              <div className="rounded-lg bg-white p-2.5">
                <dt className="text-[11px] text-stone-500">Pokok kredit</dt>
                <dd className="text-sm font-bold text-laguna-900">{formatRupiahFull(Math.round(hasil.pokok))}</dd>
              </div>
              <div className="rounded-lg bg-white p-2.5">
                <dt className="text-[11px] text-stone-500">Total bunga</dt>
                <dd className="text-sm font-bold text-laguna-900">{formatRupiahFull(Math.round(hasil.totalBunga))}</dd>
              </div>
            </dl>
          </div>

          <p className="mt-3 text-[11px] leading-relaxed text-stone-500">
            Simulasi kasar dengan rumus anuitas, bukan penawaran resmi bank.
          </p>
        </>
      )}
    </section>
  );
}
