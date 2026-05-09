"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface WordMeaning {
  word: string;
  meaning: string;
}

export default function AddSong() {
  const [languages, setLanguages] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [concepts, setConcepts] = useState<string[]>([""]);
  const [words, setWords] = useState<WordMeaning[]>([
    { word: "", meaning: "" },
  ]);
  const [lang, setLang] = useState("");
  const [tag, setTag] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/languages")
      .then((res) => res.json())
      .then(setLanguages);
    fetch("/api/tags")
      .then((res) => res.json())
      .then(setTags);
  }, []);

  const addConcept = () => {
    setConcepts((current) => [...current, ""]);
  };

  const updateConcept = (index: number, value: string) => {
    setConcepts((current) =>
      current.map((concept, idx) => (idx === index ? value : concept)),
    );
  };

  const removeConcept = (index: number) => {
    setConcepts((current) => current.filter((_, idx) => idx !== index));
  };

  const addWord = () => {
    setWords((current) => [...current, { word: "", meaning: "" }]);
  };

  const updateWord = (
    index: number,
    field: "word" | "meaning",
    value: string,
  ) => {
    setWords((current) =>
      current.map((wordItem, idx) =>
        idx === index ? { ...wordItem, [field]: value } : wordItem,
      ),
    );
  };

  const removeWord = (index: number) => {
    setWords((current) => current.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    const conceptsArray = concepts
      .map((concept) => concept.trim())
      .filter((concept) => concept);
    const wordsArray = words.filter(
      (wordItem) => wordItem.word.trim() && wordItem.meaning.trim(),
    );

    try {
      const res = await fetch("/api/songs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          author,
          lyrics,
          concepts: conceptsArray,
          words: wordsArray,
          lang,
          tag,
        }),
      });
      if (res.ok) {
        router.push("/");
      } else {
        alert("Failed to add song");
      }
    } catch {
      alert("Error");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 text-slate-900">
      <div className="mx-auto max-w-2xl rounded-[2rem] bg-white p-8 shadow-xl shadow-slate-200 ring-1 ring-slate-200">
        <h1 className="text-3xl font-semibold mb-3">Add Song</h1>
        <p className="text-slate-600 mb-8">
          Add a new song with lyrics, concepts, and word meanings.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Song Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Author
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Lyrics
            </label>
            <textarea
              value={lyrics}
              onChange={(e) => setLyrics(e.target.value)}
              rows={6}
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-slate-700">
                Concepts
              </label>
              <button
                type="button"
                onClick={addConcept}
                className="text-sm text-sky-600 hover:text-sky-700"
              >
                + Add Concept
              </button>
            </div>
            <div className="space-y-3">
              {concepts.map((concept, index) => (
                <div key={index} className="flex gap-3">
                  <textarea
                    value={concept}
                    onChange={(e) => updateConcept(index, e.target.value)}
                    placeholder="Explain a concept from the song..."
                    rows={3}
                    className="flex-1 rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  />
                  {concepts.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeConcept(index)}
                      className="self-start rounded-full bg-red-100 p-2 text-red-600 hover:bg-red-200"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-slate-700">
                Words & Meanings
              </label>
              <button
                type="button"
                onClick={addWord}
                className="text-sm text-sky-600 hover:text-sky-700"
              >
                + Add Word
              </button>
            </div>
            <div className="space-y-3">
              {words.map((wordItem, index) => (
                <div key={index} className="flex gap-3">
                  <input
                    type="text"
                    value={wordItem.word}
                    onChange={(e) => updateWord(index, "word", e.target.value)}
                    placeholder="Word"
                    className="flex-1 rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  />
                  <input
                    type="text"
                    value={wordItem.meaning}
                    onChange={(e) =>
                      updateWord(index, "meaning", e.target.value)
                    }
                    placeholder="Meaning"
                    className="flex-1 rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  />
                  {words.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeWord(index)}
                      className="self-start rounded-full bg-red-100 p-2 text-red-600 hover:bg-red-200"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Language
              </label>
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                required
              >
                <option value="">Select Language</option>
                {languages.map((language) => (
                  <option key={language} value={language}>
                    {language}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Tag
              </label>
              <select
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                required
              >
                <option value="">Select Tag</option>
                {tags.map((tagItem) => (
                  <option key={tagItem} value={tagItem}>
                    {tagItem}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-slate-400/20 transition hover:bg-slate-800 disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add Song"}
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
