"use client";

import { useState, useEffect, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

interface WordEntry {
  word: string;
  meaning: string;
  example: string;
  level: "none" | "easy" | "medium" | "hard";
}

interface Song {
  lyrics: string;
  concepts: string[];
  words: { word: string; meaning: string; example?: string }[];
  lang: string;
  tag: string;
  author: string;
  date: string;
  highlights?: { text: string; level: string; location: string; index: number }[];
}

export default function EditSong() {
  const searchParams = useSearchParams();
  const songName = searchParams.get("name");
  const router = useRouter();

  const [languages, setLanguages] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [name, setName] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [lyrics, setLyrics] = useState<string>("");
  const [concepts, setConcepts] = useState<string[]>([""]);
  const [words, setWords] = useState<WordEntry[]>([
    { word: "", meaning: "", example: "", level: "none" },
  ]);
  const [lang, setLang] = useState<string>("");
  const [tag, setTag] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [langRes, tagsRes] = await Promise.all([
        fetch("/api/languages"),
        fetch("/api/tags"),
      ]);

      const languages = await langRes.json();
      const tags = await tagsRes.json();
      setLanguages(languages);
      setTags(tags);

      if (songName) {
        const songsRes = await fetch(`/api/songs?lang=&tag=`);
        const songs = await songsRes.json();
        const song = songs.find((s: any) => s.name === songName);

        if (song) {
          setName(song.name);
          setAuthor(song.author);
          setLyrics(song.lyrics);
          setConcepts(song.concepts);
          setLang(song.lang);
          setTag(song.tag);

          // Merge words and highlights for the UI
          const uiWords = song.words.map((w: any) => {
            const highlight = song.highlights?.find((h: any) => h.text === w.word);
            return {
              word: w.word,
              meaning: w.meaning,
              example: w.example || "",
              level: (highlight?.level as any) || "none"
            };
          });
          
          // Add any highlights that aren't in the words list
          const existingWordTexts = new Set(uiWords.map((w: any) => w.word));
          song.highlights?.forEach((h: any) => {
            if (!existingWordTexts.has(h.text)) {
              uiWords.push({
                word: h.text,
                meaning: "",
                example: "",
                level: h.level as any
              });
            }
          });

          setWords(uiWords.length > 0 ? uiWords : [{ word: "", meaning: "", example: "", level: "none" }]);
        }
      }
      setInitialLoading(false);
    };

    fetchData();
  }, [songName]);

  const addConcept = () => setConcepts((current) => [...current, ""]);
  const updateConcept = (index: number, value: string) => {
    setConcepts((current) => current.map((c, i) => (i === index ? value : c)));
  };
  const removeConcept = (index: number) => {
    setConcepts((current) => current.filter((_, i) => i !== index));
  };

  const addWord = () => setWords((current) => [...current, { word: "", meaning: "", example: "", level: "none" }]);
  const updateWord = (index: number, field: keyof WordEntry, value: string) => {
    setWords((current) => current.map((w, i) => (i === index ? { ...w, [field]: value } : w)));
  };
  const removeWord = (index: number) => {
    setWords((current) => current.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const conceptsArray = concepts.map(c => c.trim()).filter(c => c);
    const wordsArray = words.filter(w => w.word.trim()).map(w => ({
      word: w.word.trim(),
      meaning: w.meaning.trim(),
      example: w.example.trim(),
    }));

    const highlights = words
      .filter(w => w.word.trim() && w.level !== "none")
      .map(w => ({
        text: w.word.trim(),
        level: w.level as any,
        location: "lyrics" as const,
        index: 0
      }));

    try {
      const res = await fetch("/api/songs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          oldName: songName,
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
        alert("Failed to update song");
      }
    } catch {
      alert("Error");
    }
    setLoading(false);
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8 text-slate-900">
      <div className="mx-auto max-w-4xl rounded-[2.5rem] bg-white p-10 shadow-2xl shadow-slate-200 ring-1 ring-slate-200">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-slate-950 mb-2">Edit Song & Analysis</h1>
          <p className="text-slate-500">Refine your vocabulary and song details.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          <section className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-widest text-slate-700 ml-1">Song Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-widest text-slate-700 ml-1">Author / Artist</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                required
              />
            </div>
          </section>

          <section className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-widest text-slate-700 ml-1">Lyrics</label>
            <textarea
              value={lyrics}
              onChange={(e) => setLyrics(e.target.value)}
              rows={8}
              className="w-full rounded-[2rem] border border-slate-200 bg-slate-50 px-6 py-5 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100 font-serif leading-relaxed"
              required
            />
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-bold uppercase tracking-widest text-slate-700 ml-1">Vocabulary & Highlights</label>
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
                <div key={index} className="relative rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Word</label>
                      <input
                        type="text"
                        value={wordItem.word}
                        onChange={(e) => updateWord(index, "word", e.target.value)}
                        className="w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Meaning</label>
                      <input
                        type="text"
                        value={wordItem.meaning}
                        onChange={(e) => updateWord(index, "meaning", e.target.value)}
                        className="w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Example</label>
                      <input
                        type="text"
                        value={wordItem.example}
                        onChange={(e) => updateWord(index, "example", e.target.value)}
                        className="w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Highlight</label>
                      <select
                        value={wordItem.level}
                        onChange={(e) => updateWord(index, "level", e.target.value)}
                        className={`w-full rounded-xl border border-slate-100 px-4 py-3 text-sm outline-none ${
                          wordItem.level === 'easy' ? 'bg-green-100 text-green-700' :
                          wordItem.level === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          wordItem.level === 'hard' ? 'bg-red-100 text-red-700' : 'bg-slate-50'
                        }`}
                      >
                        <option value="none">No Highlight</option>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>
                  </div>
                  {words.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeWord(index)}
                      className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-red-600 shadow-sm"
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
              <label className="text-sm font-bold uppercase tracking-widest text-slate-700 ml-1">Contextual Concepts</label>
              <button
                type="button"
                onClick={addConcept}
                className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-xs font-bold text-amber-700"
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
                    rows={2}
                    className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm"
                  />
                  {concepts.length > 1 && (
                    <button type="button" onClick={() => removeConcept(index)} className="w-10 h-10 rounded-2xl bg-red-50 text-red-600">×</button>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-widest text-slate-700 ml-1">Language</label>
              <select value={lang} onChange={(e) => setLang(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900" required>
                <option value="">Select Language</option>
                {languages.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-widest text-slate-700 ml-1">Tag / Category</label>
              <select value={tag} onChange={(e) => setTag(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900" required>
                <option value="">Select Tag</option>
                {tags.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </section>

          <div className="flex gap-4 pt-6 border-t border-slate-100">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-[2rem] bg-slate-900 px-8 py-5 text-base font-black text-white shadow-xl hover:bg-slate-800 disabled:opacity-50 transition-all hover:-translate-y-1"
            >
              {loading ? "SAVING..." : "UPDATE SONG & ANALYSIS"}
            </button>
            <Link href="/songs" className="inline-flex items-center justify-center rounded-[2rem] border-2 border-slate-200 bg-white px-8 py-5 text-base font-bold text-slate-600">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
