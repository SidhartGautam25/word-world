"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AddLanguage() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/languages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (res.ok) {
        router.push("/");
      } else {
        alert("Failed to add language");
      }
    } catch {
      alert("Error");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 text-slate-900">
      <div className="mx-auto max-w-lg rounded-[2rem] bg-white p-8 shadow-xl shadow-slate-200 ring-1 ring-slate-200">
        <h1 className="text-3xl font-semibold mb-3">Add Language</h1>
        <p className="text-slate-600 mb-8">
          Add a new language to use when tagging words.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Language Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-sky-500/20 transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Language"}
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
