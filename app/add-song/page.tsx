"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LyricsRenderer from "../components/LyricsRenderer";
import WordAddModal from "../components/WordAddModal";

interface WordEntry {
  word: string;
  meaning: string;
  examples: string[];
  variations: string[];
  collections: string[];
  level: "none" | "easy" | "medium" | "hard";
}

export default function AddSong() {
  const [languages, setLanguages] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [availableCollections, setAvailableCollections] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [concepts, setConcepts] = useState<string[]>([""]);
  const [words, setWords] = useState<WordEntry[]>([
    { word: "", meaning: "", examples: [""], variations: [""], collections: [], level: "none" },
  ]);
  const [lang, setLang] = useState("");
  const [tag, setTag] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeWordForModal, setActiveWordForModal] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/languages").then(res => res.json()).then(setLanguages);
    fetch("/api/tags").then(res => res.json()).then(setTags);
    fetch("/api/collections").then(res => res.json()).then(setAvailableCollections);
  }, []);

  const addConcept = () => setConcepts(c => [...c, ""]);
  const updateConcept = (i: number, v: string) => setConcepts(c => c.map((x, j) => j === i ? v : x));
  const removeConcept = (i: number) => setConcepts(c => c.filter((_, j) => j !== i));

  const addWord = () => setWords(w => [...w, { word: "", meaning: "", examples: [""], variations: [""], collections: [], level: "none" }]);
  const updateWord = (i: number, f: keyof WordEntry, v: any) => setWords(w => w.map((x, j) => j === i ? { ...x, [f]: v } : x));
  const removeWord = (i: number) => setWords(w => w.filter((_, j) => j !== i));

  const addExample = (wordIndex: number) => {
    setWords(words.map((w, i) => i === wordIndex ? { ...w, examples: [...w.examples, ""] } : w));
  };
  const updateExample = (wordIndex: number, exIndex: number, value: string) => {
    setWords(words.map((w, i) => i === wordIndex ? { ...w, examples: w.examples.map((ex, j) => j === exIndex ? value : ex) } : w));
  };
  const removeExample = (wordIndex: number, exIndex: number) => {
    setWords(words.map((w, i) => i === wordIndex ? { ...w, examples: w.examples.filter((_, j) => j !== exIndex) } : w));
  };

  const addVariation = (wordIndex: number) => {
    setWords(words.map((w, i) => i === wordIndex ? { ...w, variations: [...w.variations, ""] } : w));
  };
  const updateVariation = (wordIndex: number, vIndex: number, value: string) => {
    setWords(words.map((w, i) => i === wordIndex ? { ...w, variations: w.variations.map((v, j) => j === vIndex ? value : v) } : w));
  };
  const removeVariation = (wordIndex: number, vIndex: number) => {
    setWords(words.map((w, i) => i === wordIndex ? { ...w, variations: w.variations.filter((_, j) => j !== vIndex) } : w));
  };

  const toggleCollection = (wordIndex: number, collection: string) => {
    setWords(words.map((w, i) => {
      if (i === wordIndex) {
        const collections = w.collections.includes(collection)
          ? w.collections.filter(c => c !== collection)
          : [...w.collections, collection];
        return { ...w, collections };
      }
      return w;
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const conceptsArray = concepts.map(c => c.trim()).filter(c => c);
    const wordsArray = words.filter(w => w.word.trim()).map(w => ({
      word: w.word.trim(),
      meaning: w.meaning.trim(),
      examples: w.examples.map(ex => ex.trim()).filter(ex => ex),
      variations: w.variations.map(v => v.trim()).filter(v => v),
      collections: w.collections,
    }));
    const highlights = words.filter(w => w.word.trim() && w.level !== "none").map(w => ({ text: w.word.trim(), level: w.level as any, location: "lyrics" as const, index: 0 }));

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
    <div className="min-h-screen bg-slate-50 p-8 text-slate-900 font-sans">
      <div className="mx-auto max-w-5xl rounded-[3rem] bg-white p-12 shadow-2xl shadow-slate-200 border border-slate-100">
        <header className="mb-12">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-sky-600 mb-2">New Entry</p>
          <h1 className="text-5xl font-black text-slate-950 tracking-tight">Add Master Song</h1>
        </header>

        <form onSubmit={handleSubmit} className="space-y-12">
          <section className="grid gap-8 sm:grid-cols-2">
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Song Identity</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Enter Song Name" className="w-full rounded-2xl border-2 border-slate-50 bg-slate-50 px-6 py-5 outline-none focus:border-sky-500 focus:bg-white transition-all text-lg font-bold" required />
            </div>
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">The Artist</label>
              <input type="text" value={author} onChange={e => setAuthor(e.target.value)} placeholder="Author / Poet" className="w-full rounded-2xl border-2 border-slate-50 bg-slate-50 px-6 py-5 outline-none focus:border-sky-500 focus:bg-white transition-all text-lg font-bold" required />
            </div>
          </section>

          <section className="space-y-4">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Full Lyrics</label>
            <textarea value={lyrics} onChange={e => setLyrics(e.target.value)} rows={10} placeholder="Paste lyrics here..." className="w-full rounded-[2.5rem] border-2 border-slate-50 bg-slate-50 px-8 py-7 outline-none focus:border-sky-500 focus:bg-white transition-all font-serif text-xl leading-relaxed italic" required />
            {lyrics && (
              <div className="p-8 rounded-[2rem] bg-slate-50/50 border border-slate-100">
                <p className="text-[10px] font-black uppercase tracking-widest text-sky-600 mb-4">Quick Add Mode: Click any word below to define it</p>
                <div className="whitespace-pre-wrap font-serif text-lg leading-relaxed text-slate-700">
                  <LyricsRenderer 
                    text={lyrics} 
                    highlights={words.filter(w => w.level !== "none").map(w => ({ text: w.word, level: w.level as any, location: "lyrics", index: 0 }))} 
                    location="lyrics"
                    onWordClick={(word) => setActiveWordForModal(word)}
                  />
                </div>
              </div>
            )}
          </section>

          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Vocabulary Intelligence</h3>
              <button type="button" onClick={addWord} className="rounded-full bg-slate-950 px-6 py-2.5 text-[10px] font-black text-white hover:bg-sky-600 transition-colors uppercase tracking-widest">+ Define Word</button>
            </div>
            
            <div className="space-y-8">
              {words.map((wordItem, i) => (
                <div key={i} className="relative rounded-[2.5rem] border-2 border-slate-100 bg-white p-10 shadow-lg shadow-slate-100/50 group transition-all hover:border-sky-200">
                  <div className="grid gap-6 md:grid-cols-2 mb-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Root Word</label>
                      <input type="text" value={wordItem.word} onChange={e => updateWord(i, "word", e.target.value)} placeholder="e.g. Kasam" className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 text-sm font-bold focus:border-sky-500 outline-none" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Definition</label>
                      <input type="text" value={wordItem.meaning} onChange={e => updateWord(i, "meaning", e.target.value)} placeholder="Explain the word..." className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 text-sm font-medium focus:border-sky-500 outline-none" />
                    </div>
                  </div>
                  
                  <div className="grid gap-8 md:grid-cols-2">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Variations (Plurals/Inflections)</label>
                        <button type="button" onClick={() => addVariation(i)} className="text-[10px] font-black text-sky-600 hover:underline">+ Add Form</button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {wordItem.variations.map((v, j) => (
                          <div key={j} className="flex items-center">
                            <input type="text" value={v} onChange={e => updateVariation(i, j, e.target.value)} placeholder="Variation" className="w-28 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-[10px] font-bold focus:border-sky-500 outline-none" />
                            {wordItem.variations.length > 1 && (
                              <button type="button" onClick={() => removeVariation(i, j)} className="ml-1 text-slate-300 hover:text-red-500">×</button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Usage Examples</label>
                        <button type="button" onClick={() => addExample(i)} className="text-[10px] font-black text-sky-600 hover:underline">+ Add Example</button>
                      </div>
                      <div className="space-y-2">
                        {wordItem.examples.map((ex, j) => (
                          <div key={j} className="flex gap-2">
                            <input type="text" value={ex} onChange={e => updateExample(i, j, e.target.value)} placeholder="Sentence..." className="flex-1 rounded-xl border border-slate-100 bg-slate-50 px-4 py-2.5 text-[10px] focus:border-sky-500 outline-none italic" />
                            {wordItem.examples.length > 1 && <button type="button" onClick={() => removeExample(i, j)} className="text-slate-300 hover:text-red-500">×</button>}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-50 space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Collections</label>
                    <div className="flex flex-wrap gap-2">
                      {availableCollections.map(coll => (
                        <button
                          key={coll}
                          type="button"
                          onClick={() => toggleCollection(i, coll)}
                          className={`px-4 py-2 rounded-xl text-[10px] font-bold transition-all ${
                            wordItem.collections.includes(coll)
                              ? "bg-sky-600 text-white shadow-lg shadow-sky-200"
                              : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                          }`}
                        >
                          {coll}
                        </button>
                      ))}
                      {availableCollections.length === 0 && (
                        <p className="text-[10px] text-slate-400 italic">No collections available. Add them in the collections page.</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Highlight</label>
                      <div className="flex gap-2">
                        {["none", "easy", "medium", "hard"].map(level => (
                          <button key={level} type="button" onClick={() => updateWord(i, "level", level)} className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${wordItem.level === level ? (level === 'easy' ? 'bg-green-500 text-white' : level === 'medium' ? 'bg-yellow-500 text-white' : level === 'hard' ? 'bg-red-500 text-white' : 'bg-slate-900 text-white') : 'bg-slate-50 text-slate-400'}`}>
                            {level}
                          </button>
                        ))}
                      </div>
                    </div>
                    {words.length > 1 && (
                      <button type="button" onClick={() => removeWord(i)} className="text-[10px] font-black text-red-400 hover:text-red-600 uppercase tracking-widest">Remove Block</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Contextual Concepts</label>
              <button type="button" onClick={addConcept} className="rounded-full bg-slate-50 px-6 py-2.5 text-[10px] font-black text-slate-400 hover:bg-amber-100 hover:text-amber-700 transition-all uppercase tracking-widest">+ Add Concept</button>
            </div>
            <div className="space-y-4">
              {concepts.map((concept, i) => (
                <div key={i} className="group relative">
                  <textarea value={concept} onChange={e => updateConcept(i, e.target.value)} rows={2} placeholder="Explain a concept or phrase..." className="w-full rounded-2xl border-2 border-slate-50 bg-slate-50 px-6 py-5 text-sm font-medium focus:border-amber-400 focus:bg-white transition-all outline-none" />
                  {concepts.length > 1 && <button type="button" onClick={() => removeConcept(i)} className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white shadow-md text-red-400 hover:text-red-600 flex items-center justify-center font-bold">×</button>}
                </div>
              ))}
            </div>
          </section>

          <section className="grid gap-6 sm:grid-cols-2">
            <select value={lang} onChange={e => setLang(e.target.value)} className="w-full rounded-2xl border-2 border-slate-50 bg-slate-50 px-6 py-5 font-bold outline-none focus:border-sky-500 focus:bg-white" required>
              <option value="">Language</option>
              {languages.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <select value={tag} onChange={e => setTag(e.target.value)} className="w-full rounded-2xl border-2 border-slate-50 bg-slate-50 px-6 py-5 font-bold outline-none focus:border-sky-500 focus:bg-white" required>
              <option value="">Collection Tag</option>
              {tags.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </section>

          <div className="flex gap-6 pt-12 border-t border-slate-100">
            <button type="submit" disabled={loading} className="flex-[2] rounded-[2rem] bg-slate-950 px-10 py-6 text-lg font-black text-white shadow-2xl shadow-slate-300 hover:bg-sky-600 hover:-translate-y-1 transition-all disabled:opacity-50 uppercase tracking-widest">{loading ? "Synchronizing..." : "Publish Song"}</button>
            <Link href="/" className="flex-1 inline-flex items-center justify-center rounded-[2rem] border-2 border-slate-100 bg-white px-10 py-6 text-lg font-black text-slate-400 hover:border-slate-300 hover:text-slate-600 transition-all uppercase tracking-widest">Cancel</Link>
          </div>
        </form>
      </div>

      {activeWordForModal && (
        <WordAddModal
          word={activeWordForModal}
          availableCollections={availableCollections}
          existingWords={words}
          onClose={() => setActiveWordForModal(null)}
          onAdd={(newWord) => {
            setWords(prev => [...prev, newWord]);
          }}
        />
      )}
    </div>
  );
}
