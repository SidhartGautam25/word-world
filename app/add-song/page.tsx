"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface WordEntry {
  word: string;
  meaning: string;
  example: string;
  level: "none" | "easy" | "medium" | "hard";
}

export default function AddSong() {
  const [languages, setLanguages] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [concepts, setConcepts] = useState<string[]>([""]);
  const [words, setWords] = useState<WordEntry[]>([
    { word: "", meaning: "", example: "", level: "none" },
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
    setWords((current) => [...current, { word: "", meaning: "", example: "", level: "none" }]);
  };

  const updateWord = (
    index: number,
    field: keyof WordEntry,
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
    
    const wordsArray = words
      .filter((w) => w.word.trim())
      .map((w) => ({
        word: w.word.trim(),
        meaning: w.meaning.trim(),
        example: w.example.trim(),
      }));

    // Generate highlights based on level
    const highlights = words
      .filter((w) => w.word.trim() && w.level !== "none")
      .map((w) => ({
        text: w.word.trim(),
        level: w.level as "easy" | "medium" | "hard",
        location: "lyrics" as const,
        index: 0
      }));

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
          highlights,
        }),
      });
      if (res.ok) {
        router.push("/songs");
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
      <div className="mx-auto max-w-4xl rounded-[2.5rem] bg-white p-10 shadow-2xl shadow-slate-200 ring-1 ring-slate-200">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-slate-950 mb-2">Add New Song</h1>
          <p className="text-slate-500">
            Create a rich analysis by adding lyrics, concepts, and vocabulary.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          <section className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-widest text-slate-700 ml-1">
                Song Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                placeholder="Enter song title..."
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-widest text-slate-700 ml-1">
                Author / Artist
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                placeholder="Enter author name..."
                required
              />
            </div>
          </section>

          <section className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-widest text-slate-700 ml-1">
              Lyrics
            </label>
            <textarea
              value={lyrics}
              onChange={(e) => setLyrics(e.target.value)}
              rows={8}
              className="w-full rounded-[2rem] border border-slate-200 bg-slate-50 px-6 py-5 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100 font-serif leading-relaxed"
              placeholder="Paste lyrics here..."
              required
            />
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-bold uppercase tracking-widest text-slate-700 ml-1">
                Vocabulary & Analysis
              </label>
              <button
                type="button"
                onClick={addWord}
                className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-4 py-2 text-xs font-bold text-sky-700 transition hover:bg-sky-200"
              >
                + Add Word
              </button>
            </div>
            
            <div className="space-y-4">
              {words.map((wordItem, index) => (
                <div key={index} className="relative group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="md:col-span-1 space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Word</label>
                      <input
                        type="text"
                        value={wordItem.word}
                        onChange={(e) => updateWord(index, "word", e.target.value)}
                        placeholder="Word..."
                        className="w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm focus:border-sky-400 outline-none"
                      />
                    </div>
                    <div className="md:col-span-1 space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Meaning</label>
                      <input
                        type="text"
                        value={wordItem.meaning}
                        onChange={(e) => updateWord(index, "meaning", e.target.value)}
                        placeholder="Meaning..."
                        className="w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm focus:border-sky-400 outline-none"
                      />
                    </div>
                    <div className="md:col-span-1 space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Example</label>
                      <input
                        type="text"
                        value={wordItem.example}
                        onChange={(e) => updateWord(index, "example", e.target.value)}
                        placeholder="Example usage..."
                        className="w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm focus:border-sky-400 outline-none"
                      />
                    </div>
                    <div className="md:col-span-1 space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Highlight</label>
                      <select
                        value={wordItem.level}
                        onChange={(e) => updateWord(index, "level", e.target.value)}
                        className={`w-full rounded-xl border border-slate-100 px-4 py-3 text-sm outline-none transition-colors ${
                          wordItem.level === 'easy' ? 'bg-green-100 text-green-700' :
                          wordItem.level === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          wordItem.level === 'hard' ? 'bg-red-100 text-red-700' : 'bg-slate-50 text-slate-600'
                        }`}
                      >
                        <option value="none">No Highlight</option>
                        <option value="easy">Easy (Green)</option>
                        <option value="medium">Medium (Yellow)</option>
                        <option value="hard">Hard (Red)</option>
                      </select>
                    </div>
                  </div>
                  {words.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeWord(index)}
                      className="absolute -top-2 -right-2 w-8 h-8 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-200 shadow-sm transition-colors"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-bold uppercase tracking-widest text-slate-700 ml-1">
                Contextual Concepts
              </label>
              <button
                type="button"
                onClick={addConcept}
                className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-xs font-bold text-amber-700 transition hover:bg-amber-200"
              >
                + Add Concept
              </button>
            </div>
            <div className="space-y-4">
              {concepts.map((concept, index) => (
                <div key={index} className="flex gap-4">
                  <textarea
                    value={concept}
                    onChange={(e) => updateConcept(index, e.target.value)}
                    placeholder="Describe a key concept or cultural context from the song..."
                    rows={2}
                    className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm focus:border-amber-400 outline-none"
                  />
                  {concepts.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeConcept(index)}
                      className="self-start mt-2 w-10 h-10 flex items-center justify-center rounded-2xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-widest text-slate-700 ml-1">
                Language
              </label>
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
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

            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-widest text-slate-700 ml-1">
                Tag / Category
              </label>
              <select
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
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
          </section>

          <div className="flex gap-4 pt-6 border-t border-slate-100">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-[2rem] bg-slate-900 px-8 py-5 text-base font-black text-white shadow-xl shadow-slate-900/20 transition hover:bg-slate-800 hover:-translate-y-1 disabled:opacity-50"
            >
              {loading ? "SAVING SONG..." : "SAVE SONG & ANALYSIS"}
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-[2rem] border-2 border-slate-200 bg-white px-8 py-5 text-base font-bold text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
