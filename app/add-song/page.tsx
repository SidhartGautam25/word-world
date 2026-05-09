"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface WordEntry {
  word: string;
  meaning: string;
  examples: string[];
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
    { word: "", meaning: "", examples: [""], level: "none" },
  ]);
  const [lang, setLang] = useState("");
  const [tag, setTag] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/languages").then(res => res.json()).then(setLanguages);
    fetch("/api/tags").then(res => res.json()).then(setTags);
  }, []);

  const addConcept = () => setConcepts(c => [...c, ""]);
  const updateConcept = (i: number, v: string) => setConcepts(c => c.map((x, j) => j === i ? v : x));
  const removeConcept = (i: number) => setConcepts(c => c.filter((_, j) => j !== i));

  const addWord = () => setWords(w => [...w, { word: "", meaning: "", examples: [""], level: "none" }]);
  const updateWord = (i: number, f: keyof WordEntry, v: any) => setWords(w => w.map((x, j) => j === i ? { ...x, [f]: v } : x));
  const removeWord = (i: number) => setWords(w => w.filter((_, j) => j !== i));

  const addExample = (wordIndex: number) => {
    setWords(words.map((w, i) => i === wordIndex ? { ...w, examples: [...w.examples, ""] } : w));
  };
  const updateExample = (wordIndex: number, exIndex: number, value: string) => {
    setWords(words.map((w, i) => i === wordIndex ? { 
      ...w, 
      examples: w.examples.map((ex, j) => j === exIndex ? value : ex) 
    } : w));
  };
  const removeExample = (wordIndex: number, exIndex: number) => {
    setWords(words.map((w, i) => i === wordIndex ? { 
      ...w, 
      examples: w.examples.filter((_, j) => j !== exIndex) 
    } : w));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const conceptsArray = concepts.map(c => c.trim()).filter(c => c);
    const wordsArray = words.filter(w => w.word.trim()).map(w => ({
      word: w.word.trim(),
      meaning: w.meaning.trim(),
      examples: w.examples.map(ex => ex.trim()).filter(ex => ex),
    }));
    const highlights = words
      .filter(w => w.word.trim() && w.level !== "none")
      .map(w => ({ text: w.word.trim(), level: w.level as any, location: "lyrics" as const, index: 0 }));

    try {
      const res = await fetch("/api/songs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, author, lyrics, concepts: conceptsArray, words: wordsArray, lang, tag, highlights }),
      });
      if (res.ok) router.push("/songs");
      else alert("Failed to add song");
    } catch { alert("Error"); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 text-slate-900">
      <div className="mx-auto max-w-4xl rounded-[2.5rem] bg-white p-10 shadow-2xl shadow-slate-200 ring-1 ring-slate-200">
        <h1 className="text-4xl font-bold text-slate-950 mb-2">Add New Song</h1>
        <p className="text-slate-500 mb-10">Create a rich analysis with dynamic examples for vocabulary.</p>

        <form onSubmit={handleSubmit} className="space-y-10">
          <section className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-widest text-slate-700 ml-1">Song Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-widest text-slate-700 ml-1">Author</label>
              <input type="text" value={author} onChange={e => setAuthor(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100" required />
            </div>
          </section>

          <section className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-widest text-slate-700 ml-1">Lyrics</label>
            <textarea value={lyrics} onChange={e => setLyrics(e.target.value)} rows={8} className="w-full rounded-[2rem] border border-slate-200 bg-slate-50 px-6 py-5 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100 font-serif leading-relaxed" required />
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-bold uppercase tracking-widest text-slate-700 ml-1">Vocabulary & Analysis</label>
              <button type="button" onClick={addWord} className="rounded-full bg-sky-100 px-4 py-2 text-xs font-bold text-sky-700 hover:bg-sky-200">+ Add Word</button>
            </div>
            
            <div className="space-y-6">
              {words.map((wordItem, i) => (
                <div key={i} className="relative rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="grid gap-4 md:grid-cols-2 mb-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Word</label>
                      <input type="text" value={wordItem.word} onChange={e => updateWord(i, "word", e.target.value)} placeholder="Word..." className="w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm focus:border-sky-400 outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Meaning</label>
                      <input type="text" value={wordItem.meaning} onChange={e => updateWord(i, "meaning", e.target.value)} placeholder="Meaning..." className="w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm focus:border-sky-400 outline-none" />
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Examples</label>
                      <button type="button" onClick={() => addExample(i)} className="text-[10px] font-bold text-sky-600 hover:text-sky-700">+ Add Example</button>
                    </div>
                    {wordItem.examples.map((ex, j) => (
                      <div key={j} className="flex gap-2">
                        <input type="text" value={ex} onChange={e => updateExample(i, j, e.target.value)} placeholder="Usage example..." className="flex-1 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-xs focus:border-sky-400 outline-none" />
                        {wordItem.examples.length > 1 && (
                          <button type="button" onClick={() => removeExample(i, j)} className="text-red-400 hover:text-red-600 px-2">×</button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Highlight Level</label>
                    <select value={wordItem.level} onChange={e => updateWord(i, "level", e.target.value)} className={`w-full rounded-xl border border-slate-100 px-4 py-3 text-sm outline-none transition-colors ${wordItem.level === 'easy' ? 'bg-green-100 text-green-700' : wordItem.level === 'medium' ? 'bg-yellow-100 text-yellow-700' : wordItem.level === 'hard' ? 'bg-red-100 text-red-700' : 'bg-slate-50 text-slate-600'}`}>
                      <option value="none">No Highlight</option>
                      <option value="easy">Easy (Green)</option>
                      <option value="medium">Medium (Yellow)</option>
                      <option value="hard">Hard (Red)</option>
                    </select>
                  </div>

                  {words.length > 1 && (
                    <button type="button" onClick={() => removeWord(i)} className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-red-600 shadow-sm">×</button>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-bold uppercase tracking-widest text-slate-700 ml-1">Contextual Concepts</label>
              <button type="button" onClick={addConcept} className="rounded-full bg-amber-100 px-4 py-2 text-xs font-bold text-amber-700">+ Add Concept</button>
            </div>
            <div className="space-y-4">
              {concepts.map((concept, i) => (
                <div key={i} className="flex gap-4">
                  <textarea value={concept} onChange={e => updateConcept(i, e.target.value)} rows={2} className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm focus:border-amber-400 outline-none" />
                  {concepts.length > 1 && <button type="button" onClick={() => removeConcept(i)} className="w-10 h-10 rounded-2xl bg-red-50 text-red-600">×</button>}
                </div>
              ))}
            </div>
          </section>

          <section className="grid gap-6 sm:grid-cols-2">
            <select value={lang} onChange={e => setLang(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100" required>
              <option value="">Select Language</option>
              {languages.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <select value={tag} onChange={e => setTag(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100" required>
              <option value="">Select Tag</option>
              {tags.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </section>

          <div className="flex gap-4 pt-6 border-t border-slate-100">
            <button type="submit" disabled={loading} className="flex-1 rounded-[2rem] bg-slate-900 px-8 py-5 text-base font-black text-white shadow-xl hover:bg-slate-800 disabled:opacity-50">{loading ? "SAVING..." : "SAVE SONG & ANALYSIS"}</button>
            <Link href="/" className="inline-flex items-center justify-center rounded-[2rem] border-2 border-slate-200 bg-white px-8 py-5 text-base font-bold text-slate-600">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
