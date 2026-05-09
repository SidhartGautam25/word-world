import Link from "next/link";

export default async function Home() {
  const res = await fetch("http://localhost:3000/api/domains", {
    cache: "no-store",
  });
  const domains: string[] = await res.json();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-8 py-24 text-white">
        {/* Abstract background elements */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 blur-3xl opacity-20">
          <div className="w-96 h-96 rounded-full bg-sky-500"></div>
        </div>
        <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 blur-3xl opacity-20">
          <div className="w-96 h-96 rounded-full bg-indigo-500"></div>
        </div>

        <div className="mx-auto max-w-6xl relative z-10">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-center">
            <div className="flex-1 space-y-8">
              <div className="space-y-4">
                <p className="text-sm uppercase tracking-[0.4em] font-bold text-sky-400">
                  Word World Intelligence
                </p>
                <h1 className="text-6xl lg:text-7xl font-black tracking-tight leading-tight italic">
                  MASTER <span className="text-sky-400">CONTEXT.</span><br />
                  BUILD <span className="text-indigo-400">KNOWLEDGE.</span>
                </h1>
                <p className="text-xl text-slate-400 max-w-2xl leading-relaxed">
                  A high-fidelity knowledge management system for organizing vocabulary across domains, 
                  analyzing multi-lingual lyrics, and tracking your linguistic journey.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <Link
                  href="/songs"
                  className="inline-flex items-center justify-center rounded-2xl bg-white px-8 py-4 text-base font-black text-slate-900 shadow-xl transition hover:bg-slate-100 hover:-translate-y-1"
                >
                  Explore Songs
                </Link>
                <Link
                  href="/words"
                  className="inline-flex items-center justify-center rounded-2xl border-2 border-white/20 bg-white/5 backdrop-blur-md px-8 py-4 text-base font-bold text-white transition hover:bg-white/10 hover:border-white/40"
                >
                  Browse Vocabulary
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Primary Navigation & Domains */}
      <div className="mx-auto max-w-6xl space-y-16 px-8 py-16">
        {/* Fast Entry Grid */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Quick Actions</h2>
            <div className="h-px flex-1 bg-slate-200 mx-6"></div>
          </div>
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
            <Link
              href="/add-song"
              className="flex flex-col items-center justify-center rounded-3xl bg-indigo-50 p-6 text-center border border-indigo-100 transition hover:bg-indigo-100 hover:border-indigo-300 group"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">🎵</div>
              <p className="text-sm font-bold text-slate-900">Add Song</p>
            </Link>
            <Link
              href="/add-word"
              className="flex flex-col items-center justify-center rounded-3xl bg-emerald-50 p-6 text-center border border-emerald-100 transition hover:bg-emerald-100 hover:border-emerald-300 group"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">✏️</div>
              <p className="text-sm font-bold text-slate-900">Add Word</p>
            </Link>
            <Link
              href="/add-domain"
              className="flex flex-col items-center justify-center rounded-3xl bg-sky-50 p-6 text-center border border-sky-100 transition hover:bg-sky-100 hover:border-sky-300 group"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">📁</div>
              <p className="text-sm font-bold text-slate-900">Domain</p>
            </Link>
            <Link
              href="/add-language"
              className="flex flex-col items-center justify-center rounded-3xl bg-cyan-50 p-6 text-center border border-cyan-100 transition hover:bg-cyan-100 hover:border-cyan-300 group"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">🌐</div>
              <p className="text-sm font-bold text-slate-900">Language</p>
            </Link>
            <Link
              href="/add-tag"
              className="flex flex-col items-center justify-center rounded-3xl bg-purple-50 p-6 text-center border border-purple-100 transition hover:bg-purple-100 hover:border-purple-300 group"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">🏷️</div>
              <p className="text-sm font-bold text-slate-900">Tag</p>
            </Link>
            <Link
              href="/add-sub-domain"
              className="flex flex-col items-center justify-center rounded-3xl bg-rose-50 p-6 text-center border border-rose-100 transition hover:bg-rose-100 hover:border-rose-300 group"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">🎯</div>
              <p className="text-sm font-bold text-slate-900">Sub-Domain</p>
            </Link>
          </div>
        </section>

        {/* Domains Grid */}
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-3xl font-bold text-slate-950">Linguistic Domains</h2>
              <p className="text-slate-500 font-medium">{domains.length} categories active</p>
            </div>
            {domains.length === 0 && (
              <Link
                href="/add-domain"
                className="rounded-full bg-slate-900 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800"
              >
                + New Domain
              </Link>
            )}
          </div>

          {domains.length === 0 ? (
            <div className="rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-white p-16 text-center">
              <p className="text-slate-500 max-w-sm mx-auto mb-6">
                Your knowledge structure is empty. Start by creating a domain for your vocabulary.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {domains.map((domain) => (
                <Link
                  key={domain}
                  href={`/words?domain=${domain}`}
                  className="group relative overflow-hidden rounded-[2rem] bg-white p-8 border border-slate-200 transition-all hover:border-sky-300 hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold text-slate-950 group-hover:text-sky-600 transition-colors mb-2">
                      {domain}
                    </h3>
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest flex items-center gap-2">
                      View Collection <span className="text-lg transition-transform group-hover:translate-x-1">→</span>
                    </p>
                  </div>
                  <div className="absolute top-0 right-0 -translate-y-8 translate-x-8 text-6xl opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                    📁
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Platform Info Section - More Compact */}
        <section className="rounded-[3rem] bg-slate-900 p-12 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 blur-[100px]"></div>
          <div className="relative z-10 grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="space-y-6">
              <h3 className="text-3xl font-bold">Why Word World?</h3>
              <p className="text-slate-400 leading-relaxed">
                We believe that language is best learned through context. Word World provides a 
                sophisticated platform to analyze songs, categorize vocabulary, and build a 
                structured understanding of how words function in the real world.
              </p>
              <div className="flex gap-4">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-sky-500 border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold">🎯</div>
                  <div className="w-8 h-8 rounded-full bg-indigo-500 border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold">📊</div>
                  <div className="w-8 h-8 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold">🌍</div>
                </div>
                <span className="text-xs text-slate-500 self-center font-bold uppercase tracking-widest">Context Driven Analysis</span>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                <h4 className="font-bold mb-2 text-sky-400">Song Analysis</h4>
                <p className="text-xs text-slate-500">Break down lyrics and concepts with ease.</p>
              </div>
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                <h4 className="font-bold mb-2 text-indigo-400">Multi-Lingual</h4>
                <p className="text-xs text-slate-500">Full support for Hindi, Urdu, and more.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
