"use client";

import { useState, useEffect } from "react";

interface WordEntry {
  word: string;
  meaning: string;
  examples: string[];
  variations: string[];
  collections: string[];
  level: "none" | "easy" | "medium" | "hard";
}

interface WordAddModalProps {
  word: string;
  availableCollections: string[];
  onClose: () => void;
  onAdd: (entry: WordEntry) => void;
  existingWords: WordEntry[];
}

export default function WordAddModal({
  word,
  availableCollections,
  onClose,
  onAdd,
  existingWords,
}: WordAddModalProps) {
  const [meaning, setMeaning] = useState("");
  const [examples, setExamples] = useState<string[]>([""]);
  const [variations, setVariations] = useState<string[]>([word]);
  const [collections, setCollections] = useState<string[]>([]);
  const [level, setLevel] = useState<"none" | "easy" | "medium" | "hard">("none");
  const [error, setError] = useState<string | null>(null);

  const addExample = () => setExamples([...examples, ""]);
  const updateExample = (i: number, v: string) => setExamples(examples.map((x, j) => (j === i ? v : x)));
  const removeExample = (i: number) => setExamples(examples.filter((_, j) => j !== i));

  const addVariation = () => setVariations([...variations, ""]);
  const updateVariation = (i: number, v: string) => setVariations(variations.map((x, j) => (j === i ? v : x)));
  const removeVariation = (i: number) => setVariations(variations.filter((_, j) => j !== i));

  const toggleCollection = (coll: string) => {
    setCollections(prev =>
      prev.includes(coll) ? prev.filter(c => c !== coll) : [...prev, coll]
    );
  };

  const handleAdd = () => {
    if (!meaning.trim()) {
      setError("Please enter a meaning.");
      return;
    }

    const isDuplicate = existingWords.some(
      w => w.word.toLowerCase() === word.toLowerCase() && w.meaning.toLowerCase() === meaning.toLowerCase()
    );

    if (isDuplicate) {
      alert("This word with the same meaning is already in the list!");
      return;
    }

    onAdd({
      word,
      meaning: meaning.trim(),
      examples: examples.map(e => e.trim()).filter(e => e),
      variations: variations.map(v => v.trim()).filter(v => v),
      collections,
      level,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-sky-600 mb-1">New Intelligence</p>
            <h2 className="text-3xl font-black text-slate-950 tracking-tight">Add &quot;{word}&quot;</h2>
          </div>
          <button onClick={onClose} className="rounded-full p-3 hover:bg-white hover:shadow-md text-slate-400 hover:text-slate-950 transition-all">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold border border-red-100">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Meaning</label>
            <input
              type="text"
              autoFocus
              value={meaning}
              onChange={e => { setMeaning(e.target.value); setError(null); }}
              placeholder="What does it mean in this context?"
              className="w-full rounded-2xl border-2 border-slate-50 bg-slate-50 px-6 py-4 text-lg font-medium outline-none focus:border-sky-500 transition-all"
            />
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Variations</label>
                <button type="button" onClick={addVariation} className="text-[10px] font-black text-sky-600">+ Add Form</button>
              </div>
              <div className="space-y-2">
                {variations.map((v, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      type="text"
                      value={v}
                      onChange={e => updateVariation(i, e.target.value)}
                      className="flex-1 rounded-xl border border-slate-100 bg-slate-50 px-4 py-2 text-xs font-bold outline-none"
                    />
                    {variations.length > 1 && (
                      <button onClick={() => removeVariation(i)} className="text-slate-300 hover:text-red-500">×</button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Examples</label>
                <button type="button" onClick={addExample} className="text-[10px] font-black text-sky-600">+ Add Example</button>
              </div>
              <div className="space-y-2">
                {examples.map((ex, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      type="text"
                      value={ex}
                      onChange={e => updateExample(i, e.target.value)}
                      className="flex-1 rounded-xl border border-slate-100 bg-slate-50 px-4 py-2 text-xs italic outline-none"
                    />
                    {examples.length > 1 && (
                      <button onClick={() => removeExample(i)} className="text-slate-300 hover:text-red-500">×</button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Collections</label>
            <div className="flex flex-wrap gap-2">
              {availableCollections.map(coll => (
                <button
                  key={coll}
                  type="button"
                  onClick={() => toggleCollection(coll)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-bold transition-all ${
                    collections.includes(coll)
                      ? "bg-sky-600 text-white shadow-lg shadow-sky-200"
                      : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                  }`}
                >
                  {coll}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Highlight Level</label>
            <div className="flex gap-2">
              {["none", "easy", "medium", "hard"].map(l => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLevel(l as any)}
                  className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                    level === l
                      ? (l === 'easy' ? 'bg-green-500 text-white shadow-lg shadow-green-100' : l === 'medium' ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-100' : l === 'hard' ? 'bg-red-500 text-white shadow-lg shadow-red-100' : 'bg-slate-900 text-white')
                      : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-slate-50 bg-slate-50/30 flex gap-4">
          <button
            onClick={handleAdd}
            className="flex-1 rounded-2xl bg-slate-950 px-8 py-4 text-sm font-black text-white shadow-xl hover:bg-sky-600 transition-all uppercase tracking-widest"
          >
            Add to Vocabulary
          </button>
          <button
            onClick={onClose}
            className="px-8 py-4 text-sm font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
