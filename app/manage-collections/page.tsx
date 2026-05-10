"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface WordWithSong {
  word: string;
  meaning: string;
  examples: string[];
  collections: string[];
  songName: string;
}

export default function ManageCollections() {
  const [collections, setCollections] = useState<string[]>([]);
  const [newCollection, setNewCollection] = useState("");
  const [allWords, setAllWords] = useState<WordWithSong[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [collRes, songsRes] = await Promise.all([
        fetch("/api/collections"),
        fetch("/api/songs"),
      ]);
      const collData = await collRes.json();
      const songsData = await songsRes.json();

      setCollections(collData);

      const words: WordWithSong[] = [];
      songsData.forEach((song: any) => {
        (song.words || []).forEach((w: any) => {
          words.push({
            word: w.word,
            meaning: w.meaning,
            examples: w.examples || [],
            collections: w.collections || [],
            songName: song.name,
          });
        });
      });
      setAllWords(words);
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
    setLoading(false);
  };

  const handleAddCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollection.trim()) return;
    setAdding(true);
    try {
      const res = await fetch("/api/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCollection.trim() }),
      });
      if (res.ok) {
        setNewCollection("");
        await fetchData();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to add collection");
      }
    } catch {
      alert("Error adding collection");
    }
    setAdding(false);
  };

  const filteredWords = selectedCollection === "all"
    ? allWords
    : allWords.filter(w => w.collections.includes(selectedCollection));

  return (
    <div className="min-h-screen bg-slate-50 p-8 text-slate-900 font-sans">
      <div className="w-full  space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-sky-600 mb-2">
              Management
            </p>
            <h1 className="text-4xl font-black text-slate-950 tracking-tight">
              Word Collections
            </h1>
          </div>
          <Link
            href="/"
            className="rounded-2xl border-2 border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-600 hover:border-slate-300 hover:text-slate-950 transition-all"
          >
            ← Back Home
          </Link>
        </header>

        <div className="grid gap-8 lg:grid-cols-4">
          {/* Collection Management */}
          <section className="lg:col-span-1 space-y-6">
            <div className="rounded-[2.5rem] bg-white p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
              <h2 className="text-xl font-bold mb-6">Add Collection</h2>
              <form onSubmit={handleAddCollection} className="space-y-4">
                <input
                  type="text"
                  value={newCollection}
                  onChange={(e) => setNewCollection(e.target.value)}
                  placeholder="Collection Name..."
                  className="w-full rounded-2xl border-2 border-slate-50 bg-slate-50 px-5 py-4 outline-none focus:border-sky-500 focus:bg-white transition-all font-bold"
                />
                <button
                  type="submit"
                  disabled={adding}
                  className="w-full rounded-2xl bg-slate-950 py-4 text-sm font-black text-white hover:bg-sky-600 transition-all uppercase tracking-widest disabled:opacity-50"
                >
                  {adding ? "Adding..." : "Create Collection"}
                </button>
              </form>
            </div>

            <div className="rounded-[2.5rem] bg-white p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
              <h2 className="text-xl font-bold mb-6">Filter by Collection</h2>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setSelectedCollection("all")}
                  className={`w-full text-left px-5 py-3 rounded-xl font-bold transition-all ${selectedCollection === "all"
                    ? "bg-sky-600 text-white"
                    : "hover:bg-slate-50"
                    }`}
                >
                  All Words ({allWords.length})
                </button>
                {collections.map((coll) => (
                  <button
                    key={coll}
                    onClick={() => setSelectedCollection(coll)}
                    className={`w-full text-left px-5 py-3 rounded-xl font-bold transition-all ${selectedCollection === coll
                      ? "bg-sky-600 text-white"
                      : "hover:bg-slate-50"
                      }`}
                  >
                    {coll} (
                    {
                      allWords.filter((w) =>
                        w.collections.includes(coll)
                      ).length
                    }
                    )
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Word List */}
          <section className="lg:col-span-3">
            <div className="rounded-[2.5rem] bg-white p-10 shadow-xl shadow-slate-200/50 border border-slate-100 min-h-[600px]">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-slate-950">
                  {selectedCollection === "all"
                    ? "All Words"
                    : `Words in "${selectedCollection}"`}
                </h2>
                <span className="bg-slate-100 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500">
                  {filteredWords.length} Entries
                </span>
              </div>

              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="w-10 h-10 border-4 border-slate-200 border-t-sky-600 rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-6">
                  {filteredWords.map((w, i) => (
                    <div
                      key={i}
                      className="group p-6 rounded-3xl border-2 border-slate-50 hover:border-sky-100 transition-all flex flex-col"
                      style={{ flex: "1 1 280px" }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-black text-slate-900 group-hover:text-sky-600 transition-colors">
                            {w.word}
                          </h3>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Song: {w.songName}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-1 justify-end max-w-[120px]">
                          {w.collections.map((c) => (
                            <span
                              key={c}
                              className="bg-sky-50 text-sky-600 px-2 py-0.5 rounded-md text-[8px] font-black uppercase"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>

                      <p className="text-sm text-slate-600 mb-4 font-medium leading-relaxed">
                        {w.meaning}
                      </p>

                      {w.examples.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                            Examples
                          </p>
                          {w.examples.map((ex, j) => (
                            <p
                              key={j}
                              className="text-xs italic text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100"
                            >
                              "{ex}"
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  {filteredWords.length === 0 && (
                    <div className="w-full text-center py-20">
                      <p className="text-slate-400 font-bold">
                        No words found in this collection.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
