"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface WordMeaning {
  word: string;
  meaning: string;
  example?: string;
}

interface SearchResult {
  songName: string;
  frequency: number;
}

interface WordAnalysisSidebarProps {
  word: string;
  currentSongWords?: WordMeaning[];
  onClose: () => void;
}

export default function WordAnalysisSidebar({
  word,
  currentSongWords,
  onClose,
}: WordAnalysisSidebarProps) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);

  // Find the word in the current song's vocabulary
  const currentWordInfo = currentSongWords?.find(
    (w) => w.word.toLowerCase() === word.toLowerCase(),
  );

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/word-search?word=${encodeURIComponent(word)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
        }
      } catch (error) {
        console.error("Failed to fetch word analysis:", error);
      }
      setLoading(false);
    };

    if (word) {
      fetchResults();
    }
  }, [word]);

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l border-slate-200">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-sky-600 mb-1">
              Word Intelligence
            </p>
            <h2 className="text-3xl font-black text-slate-900 break-all leading-tight">
              {word}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-3 hover:bg-slate-200 text-slate-500 transition-all hover:rotate-90"
            aria-label="Close"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Current Song Context (Meaning & Example) */}
          {(currentWordInfo?.meaning || currentWordInfo?.example) && (
            <div className="p-8 border-b-4 border-slate-100 bg-white space-y-6">
              {currentWordInfo.meaning && (
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Contextual Meaning</p>
                  <p className="text-lg font-bold text-slate-800 leading-relaxed">
                    {currentWordInfo.meaning}
                  </p>
                </div>
              )}
              {currentWordInfo.example && (
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Usage Example</p>
                  <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 italic text-indigo-900 leading-relaxed">
                    "{currentWordInfo.example}"
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Collection Analysis */}
          <div className="p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Collection Analysis</h3>
              {!loading && (
                <span className="text-[10px] font-bold bg-slate-100 px-2 py-1 rounded-full text-slate-500 uppercase tracking-wider">
                  {results.length} Occurrences
                </span>
              )}
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center h-40 space-y-3">
                <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Scanning World...</p>
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-10 rounded-3xl border-2 border-dashed border-slate-100">
                <p className="text-slate-400 font-medium italic">Unique to this collection.</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {results.map((result) => (
                  <li key={result.songName}>
                    <Link
                      href={`/songs/${encodeURIComponent(result.songName)}`}
                      className="block p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-sky-300 hover:bg-sky-50 hover:-translate-y-0.5 transition-all group"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                          {result.songName}
                        </span>
                        <span className="bg-sky-100 text-sky-700 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider">
                          {result.frequency}x
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-50 border-t border-slate-100">
          <p className="text-[10px] text-slate-400 text-center uppercase tracking-widest font-black">
            Global Knowledge Trace Enabled
          </p>
        </div>
      </div>
    </div>
  );
}
