"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AddWord() {
  const [domains, setDomains] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [subDomains, setSubDomains] = useState<string[]>([]);
  const [domain, setDomain] = useState("");
  const [language, setLanguage] = useState("");
  const [subDomain, setSubDomain] = useState("");
  const [word, setWord] = useState("");
  const [explanation, setExplanation] = useState("");
  const [examples, setExamples] = useState<string[]>([""]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/domains")
      .then((res) => res.json())
      .then(setDomains);
    fetch("/api/languages")
      .then((res) => res.json())
      .then(setLanguages);
  }, []);

  useEffect(() => {
    if (!domain) {
      return;
    }

    fetch(`/api/sub-domains?domain=${encodeURIComponent(domain)}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setSubDomains(data.map((item: { name: string }) => item.name));
        } else {
          setSubDomains([]);
        }
        setSubDomain("");
      });
  }, [domain]);

  const addExample = () => {
    setExamples((current) => [...current, ""]);
  };

  const updateExample = (index: number, value: string) => {
    setExamples((current) =>
      current.map((example, idx) => (idx === index ? value : example)),
    );
  };

  const removeExample = (index: number) => {
    setExamples((current) => current.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!language) {
      const confirmed = window.confirm(
        "You are adding this word without a language. Continue?",
      );
      if (!confirmed) {
        return;
      }
    }

    setLoading(true);
    const examplesArray = examples
      .map((example) => example.trim())
      .filter((example) => example);
    try {
      const res = await fetch("/api/words", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domain,
          word,
          explanation,
          examples: examplesArray,
          language,
          subDomain,
        }),
      });
      if (res.ok) {
        router.push("/");
      } else {
        alert("Failed to add word");
      }
    } catch {
      alert("Error");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 text-slate-900">
      <div className="mx-auto max-w-xl rounded-[2rem] bg-white p-8 shadow-xl shadow-slate-200 ring-1 ring-slate-200">
        <h1 className="text-3xl font-semibold mb-3">Add Word</h1>
        <p className="text-slate-600 mb-8">
          Add a new word with explanation and optional examples inside a domain.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Domain
            </label>
            <select
              value={domain}
              onChange={(e) => {
                const nextDomain = e.target.value;
                setDomain(nextDomain);
                if (!nextDomain) {
                  setSubDomains([]);
                  setSubDomain("");
                }
              }}
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              required
            >
              <option value="">Select Domain</option>
              {domains.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Word
            </label>
            <input
              type="text"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Explanation
            </label>
            <textarea
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              rows={4}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Language (optional)
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            >
              <option value="">No language</option>
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Sub-domain (optional)
            </label>
            <select
              value={subDomain}
              onChange={(e) => setSubDomain(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            >
              <option value="">No sub-domain</option>
              {subDomains.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Examples (add one by one)
              </label>
              <button
                type="button"
                onClick={addExample}
                className="rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
              >
                Add Example
              </button>
            </div>
            {examples.map((example, index) => (
              <div
                key={index}
                className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-slate-700">
                    Example {index + 1}
                  </p>
                  {examples.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => removeExample(index)}
                      className="text-sm font-semibold text-rose-600 transition hover:text-rose-800"
                    >
                      Remove
                    </button>
                  ) : null}
                </div>
                <textarea
                  value={example}
                  onChange={(e) => updateExample(index, e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  rows={4}
                  placeholder="Enter example text"
                />
              </div>
            ))}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-emerald-500/20 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Word"}
          </button>
        </form>
        <Link
          href="/"
          className="mt-6 inline-flex text-slate-600 hover:text-slate-900"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
