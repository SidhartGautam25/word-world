import Link from "next/link";

export default async function Home() {
  const res = await fetch("http://localhost:3000/api/domains", {
    cache: "no-store",
  });
  const domains: string[] = await res.json();

  return (
    <div className="min-h-screen bg-slate-50 p-8 text-slate-900">
      <div className="max-w-5xl mx-auto space-y-8">
        <section className="rounded-3xl bg-white/95 p-10 shadow-xl shadow-slate-200 ring-1 ring-slate-200">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-sky-600 font-semibold">
                Word World
              </p>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950">
                Your domain-based vocabulary builder
              </h1>
              <p className="mt-3 text-slate-600 max-w-2xl">
                Add domains, add words with explanation and examples, then
                browse by domain or view all words in one place.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/add-domain"
                className="inline-flex items-center justify-center rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-sky-500/20 transition hover:bg-sky-700"
              >
                Add Domain
              </Link>
              <Link
                href="/add-language"
                className="inline-flex items-center justify-center rounded-full bg-cyan-600 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-cyan-500/20 transition hover:bg-cyan-700"
              >
                Add Language
              </Link>
              <Link
                href="/add-sub-domain"
                className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-indigo-500/20 transition hover:bg-indigo-700"
              >
                Add Sub-domain
              </Link>
              <Link
                href="/add-word"
                className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-emerald-500/20 transition hover:bg-emerald-700"
              >
                Add Word
              </Link>
              <Link
                href="/words"
                className="inline-flex items-center justify-center rounded-full bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-violet-500/20 transition hover:bg-violet-700"
              >
                View All Words
              </Link>
            </div>
          </div>
        </section>

        <section className="rounded-3xl bg-white p-8 shadow-lg shadow-slate-200 ring-1 ring-slate-200">
          <h2 className="text-2xl font-semibold mb-4 text-slate-900">
            Domains
          </h2>
          {domains.length === 0 ? (
            <p className="text-slate-600">
              No domains yet. Add one to start organizing words.
            </p>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {domains.map((domain) => (
                <li
                  key={domain}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <Link
                    href={`/words?domain=${domain}`}
                    className="text-xl font-semibold text-slate-950 hover:text-sky-600"
                  >
                    {domain}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
