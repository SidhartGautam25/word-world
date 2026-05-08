import Link from "next/link";

export default async function Home() {
  const res = await fetch("http://localhost:3000/api/domains", {
    cache: "no-store",
  });
  const domains: string[] = await res.json();

  const features = [
    {
      icon: "📚",
      title: "Organize by Domain",
      description:
        "Create domains to categorize your vocabulary learning journey",
      color: "sky",
    },
    {
      icon: "🌍",
      title: "Multi-Language Support",
      description:
        "Track words across different languages with optional language tagging",
      color: "cyan",
    },
    {
      icon: "🎯",
      title: "Sub-domains",
      description:
        "Break down domains into sub-categories for more granular organization",
      color: "indigo",
    },
    {
      icon: "✏️",
      title: "Rich Word Details",
      description:
        "Add words with explanations, multiple examples, and metadata",
      color: "emerald",
    },
    {
      icon: "📅",
      title: "Automatic Tracking",
      description: "Each word is timestamped automatically when added",
      color: "violet",
    },
    {
      icon: "🔍",
      title: "Advanced Filtering",
      description: "Filter words by domain, language, and sub-domain instantly",
      color: "rose",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-sky-600 to-indigo-600 px-8 py-20 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
            <div className="flex-1 space-y-6">
              <p className="text-sm uppercase tracking-[0.3em] font-semibold text-sky-100">
                Welcome to Word World
              </p>
              <h1 className="text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                Master Vocabulary, Organize Knowledge
              </h1>
              <p className="text-lg text-sky-50 max-w-2xl leading-relaxed">
                Word World is a comprehensive vocabulary management system that
                helps you organize, track, and learn words across multiple
                domains and languages with rich examples and detailed
                explanations.
              </p>
              <div className="flex flex-wrap gap-3 pt-4">
                <Link
                  href="/add-word"
                  className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-base font-semibold text-indigo-600 shadow-lg shadow-indigo-900/30 transition hover:bg-slate-50"
                >
                  Start Adding Words
                </Link>
                <Link
                  href="/words"
                  className="inline-flex items-center justify-center rounded-full border-2 border-white px-6 py-3 text-base font-semibold text-white transition hover:bg-white/10"
                >
                  View All Words
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-6xl space-y-12 px-8 py-16">
        {/* Features Grid */}
        <section>
          <div className="mb-12 text-center">
            <p className="text-sm uppercase tracking-[0.3em] font-semibold text-sky-600">
              Platform Features
            </p>
            <h2 className="mt-2 text-4xl font-bold text-slate-950">
              Everything You Need
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              A complete toolkit for building and managing your vocabulary
              across different domains and languages
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className={`rounded-2xl border border-${feature.color}-200 bg-${feature.color}-50 p-8 transition hover:shadow-lg hover:-translate-y-1`}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-slate-950 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-700">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="rounded-3xl bg-white p-10 shadow-xl shadow-slate-200 ring-1 ring-slate-200">
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.3em] font-semibold text-sky-600">
              Quick Navigation
            </p>
            <h2 className="mt-2 text-3xl font-bold text-slate-950">
              Get Started
            </h2>
            <p className="mt-2 text-slate-600">
              Choose an action to begin organizing your vocabulary
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <Link
              href="/add-domain"
              className="group rounded-2xl border-2 border-sky-200 bg-sky-50 p-6 text-center transition hover:bg-sky-100 hover:border-sky-400"
            >
              <div className="text-3xl mb-2">📁</div>
              <p className="font-semibold text-slate-950 group-hover:text-sky-700">
                Add Domain
              </p>
              <p className="text-sm text-slate-600 mt-1">Create new category</p>
            </Link>

            <Link
              href="/add-language"
              className="group rounded-2xl border-2 border-cyan-200 bg-cyan-50 p-6 text-center transition hover:bg-cyan-100 hover:border-cyan-400"
            >
              <div className="text-3xl mb-2">🌐</div>
              <p className="font-semibold text-slate-950 group-hover:text-cyan-700">
                Add Language
              </p>
              <p className="text-sm text-slate-600 mt-1">Register language</p>
            </Link>

            <Link
              href="/add-sub-domain"
              className="group rounded-2xl border-2 border-indigo-200 bg-indigo-50 p-6 text-center transition hover:bg-indigo-100 hover:border-indigo-400"
            >
              <div className="text-3xl mb-2">🎯</div>
              <p className="font-semibold text-slate-950 group-hover:text-indigo-700">
                Add Sub-domain
              </p>
              <p className="text-sm text-slate-600 mt-1">Create subcategory</p>
            </Link>

            <Link
              href="/add-word"
              className="group rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-6 text-center transition hover:bg-emerald-100 hover:border-emerald-400"
            >
              <div className="text-3xl mb-2">✏️</div>
              <p className="font-semibold text-slate-950 group-hover:text-emerald-700">
                Add Word
              </p>
              <p className="text-sm text-slate-600 mt-1">Add new vocabulary</p>
            </Link>

            <Link
              href="/words"
              className="group rounded-2xl border-2 border-violet-200 bg-violet-50 p-6 text-center transition hover:bg-violet-100 hover:border-violet-400"
            >
              <div className="text-3xl mb-2">📖</div>
              <p className="font-semibold text-slate-950 group-hover:text-violet-700">
                View Words
              </p>
              <p className="text-sm text-slate-600 mt-1">Browse all words</p>
            </Link>
          </div>
        </section>

        {/* Domains List */}
        <section className="rounded-3xl bg-white p-10 shadow-xl shadow-slate-200 ring-1 ring-slate-200">
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.3em] font-semibold text-sky-600">
              Your Collection
            </p>
            <h2 className="mt-2 text-3xl font-bold text-slate-950">Domains</h2>
            <p className="mt-2 text-slate-600">
              {domains.length} {domains.length === 1 ? "domain" : "domains"}{" "}
              created
            </p>
          </div>

          {domains.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-12 text-center">
              <p className="text-slate-600 mb-4">
                No domains created yet. Start by creating your first domain!
              </p>
              <Link
                href="/add-domain"
                className="inline-flex items-center justify-center rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-sky-500/20 transition hover:bg-sky-700"
              >
                Create First Domain
              </Link>
            </div>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {domains.map((domain) => (
                <li
                  key={domain}
                  className="group rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 transition hover:-translate-y-1 hover:shadow-lg hover:border-sky-300"
                >
                  <Link href={`/words?domain=${domain}`} className="block">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-slate-950 group-hover:text-sky-600">
                        {domain}
                      </h3>
                      <span className="text-2xl">→</span>
                    </div>
                    <p className="mt-2 text-sm text-slate-600">
                      Click to view all words in this domain
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Info Section */}
        <section className="rounded-3xl bg-gradient-to-br from-slate-100 to-slate-50 p-10 border border-slate-200">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h3 className="text-2xl font-bold text-slate-950 mb-4">
                How It Works
              </h3>
              <ul className="space-y-3 text-slate-700">
                <li className="flex gap-3">
                  <span className="text-xl">1️⃣</span>
                  <span>
                    Create domains to organize your vocabulary by topic
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-xl">2️⃣</span>
                  <span>Add sub-domains to break down topics further</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-xl">3️⃣</span>
                  <span>Add words with explanations and multiple examples</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-xl">4️⃣</span>
                  <span>Tag words with languages and sub-domains</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-xl">5️⃣</span>
                  <span>Filter and browse your vocabulary collection</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-950 mb-4">
                Why Use Word World?
              </h3>
              <ul className="space-y-3 text-slate-700">
                <li className="flex gap-3">
                  <span>✨</span>
                  <span>Organized vocabulary management in one place</span>
                </li>
                <li className="flex gap-3">
                  <span>⚡</span>
                  <span>
                    Fast and intuitive interface for adding and browsing words
                  </span>
                </li>
                <li className="flex gap-3">
                  <span>🎯</span>
                  <span>Structured learning with domains and sub-domains</span>
                </li>
                <li className="flex gap-3">
                  <span>🌍</span>
                  <span>Support for multiple languages in one system</span>
                </li>
                <li className="flex gap-3">
                  <span>📝</span>
                  <span>Rich context with examples for each word</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
