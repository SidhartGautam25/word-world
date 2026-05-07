import Link from "next/link";

interface Word {
  word: string;
  explanation: string;
  examples: string[];
  domain?: string;
}

export default async function Words({
  searchParams,
}: {
  searchParams: Promise<{ domain?: string }>;
}) {
  const { domain } = await searchParams;

  const domainsRes = await fetch("http://localhost:3000/api/domains", {
    cache: "no-store",
  });
  const domains: string[] = await domainsRes.json();

  let words: Word[] = [];
  let title = "All Words";

  if (domain) {
    const res = await fetch(
      `http://localhost:3000/api/words?domain=${domain}`,
      {
        cache: "no-store",
      },
    );
    if (res.ok) {
      words = await res.json();
    }
    title = `Words in ${domain}`;
  } else {
    for (const d of domains) {
      const res = await fetch(`http://localhost:3000/api/words?domain=${d}`, {
        cache: "no-store",
      });
      if (res.ok) {
        const domainWords: Word[] = await res.json();
        words.push(...domainWords.map((w) => ({ ...w, domain: d })));
      }
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8 text-slate-900">
      <div className="mx-auto max-w-5xl space-y-8">
        <section className="rounded-[2rem] bg-white p-8 shadow-xl shadow-slate-200 ring-1 ring-slate-200">
          <div className="flex flex-col gap-6 sm:gap-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">
                  {domain ? "Domain words" : "All words"}
                </p>
                <h1 className="mt-2 text-4xl font-semibold text-slate-950">
                  {title}
                </h1>
              </div>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-sky-500/20 transition hover:bg-sky-700"
              >
                Back to Home
              </Link>
            </div>
            <form
              method="get"
              className="flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <label className="sr-only" htmlFor="domain-filter">
                Filter domains
              </label>
              <select
                id="domain-filter"
                name="domain"
                defaultValue={domain ?? ""}
                className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              >
                <option value="">All domains</option>
                {domains.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-slate-400/20 transition hover:bg-slate-800"
              >
                Apply Filter
              </button>
            </form>
          </div>
        </section>

        {words.length === 0 ? (
          <section className="rounded-[2rem] bg-white p-8 shadow-xl shadow-slate-200 ring-1 ring-slate-200">
            <p className="text-slate-600">
              No words found yet. Add a new word to get started.
            </p>
          </section>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {words.map((w, i) => (
              <article
                key={i}
                className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-2xl font-semibold text-slate-950">
                    {w.word}
                  </h2>
                  {w.domain && !domain ? (
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                      {w.domain}
                    </span>
                  ) : null}
                </div>
                <p className="mt-4 text-slate-700">{w.explanation}</p>
                {w.examples.length > 0 && (
                  <div className="mt-5 space-y-3">
                    <h3 className="text-sm font-semibold text-slate-900">
                      Examples
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-slate-600">
                      {w.examples.map((ex, j) => (
                        <li key={j}>{ex}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
