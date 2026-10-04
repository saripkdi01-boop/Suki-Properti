/** Skeleton loading untuk homepage (dan route lain yang memakai loading generik). */
export default function Loading() {
  return (
    <div className="flex flex-col" aria-label="Memuat halaman…">
      {/* Hero */}
      <section className="bg-gradient-to-br from-laguna-900 via-laguna-800 to-laguna-700">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pb-10 pt-12 sm:px-6 sm:pt-16">
          <div className="sp-skeleton h-10 w-3/4 max-w-xl rounded-xl" />
          <div className="sp-skeleton h-5 w-1/2 max-w-md rounded-lg" />
          <div className="sp-skeleton h-32 w-full rounded-2xl" />
          <div className="sp-skeleton h-4 w-2/3 max-w-lg rounded" />
        </div>
      </section>

      {/* Shortcut */}
      <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <div className="sp-skeleton h-6 w-56 rounded" />
        <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4">
          <div className="sp-skeleton h-20 rounded-2xl" />
          <div className="sp-skeleton h-20 rounded-2xl" />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {["a", "b", "c", "d", "e", "f"].map((k) => (
            <div key={k} className="sp-skeleton h-9 w-28 rounded-full" />
          ))}
        </div>
      </section>

      {/* Grid kartu */}
      <section className="bg-stone-50">
        <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
          <div className="sp-skeleton h-6 w-48 rounded" />
          <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {["a", "b", "c", "d", "e", "f", "g", "h"].map((k) => (
              <div key={k} className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
                <div className="sp-skeleton aspect-[4/3] w-full" />
                <div className="flex flex-col gap-2 p-4">
                  <div className="sp-skeleton h-5 w-2/3 rounded" />
                  <div className="sp-skeleton h-4 w-full rounded" />
                  <div className="sp-skeleton h-3 w-1/2 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Peta */}
      <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <div className="sp-skeleton h-6 w-40 rounded" />
        <div className="sp-skeleton mt-4 h-72 w-full rounded-2xl" />
      </section>
    </div>
  );
}
