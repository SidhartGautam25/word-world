"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface WordMeaning {
  word: string;
  meaning: string;
  examples?: string[];
}

interface SearchResult {
  songName: string;
  frequency: number;
  meaning?: string;
  examples?: string[];
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

    if (word) fetchResults();
  }, [word]);

  const fallbackInfo = results.find(r => r.meaning || (r.examples && r.examples.length > 0));
  
  const displayMeaning = currentWordInfo?.meaning || fallbackInfo?.meaning;
  const displayExamples = currentWordInfo?.examples || fallbackInfo?.examples || [];
  const isFallback = !currentWordInfo?.meaning && !!fallbackInfo?.meaning;
  const totalFrequency = results.reduce((sum, res) => sum + res.frequency, 0);

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l border-slate-200">
      <div className="h-full flex flex-col">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-sky-600 mb-1">Word Intelligence</p>
            <h2 className="text-3xl font-black text-slate-900 break-all leading-tight">{word}</h2>
          </div>
          <button onClick={onClose} className="rounded-full p-3 hover:bg-slate-200 text-slate-500 transition-all hover:rotate-90">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {(displayMeaning || displayExamples.length > 0) && (
            <div className="p-8 border-b-4 border-slate-100 bg-white space-y-6">
              {isFallback && (
                <div className="rounded-full bg-amber-50 border border-amber-100 px-3 py-1 inline-flex items-center gap-2">
                  <span className="text-[10px] font-bold text-amber-700 uppercase tracking-widest">Global Fallback Result</span>
                </div>
              )}
              
              {displayMeaning && (
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{isFallback ? "Suggested Meaning" : "Contextual Meaning"}</p>
                  <p className="text-lg font-bold text-slate-800 leading-relaxed">{displayMeaning}</p>
                </div>
              )}
              
              {displayExamples.length > 0 && (
                <div className="space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{isFallback ? "Sample Usage" : "Usage Examples"}</p>
                  <div className="space-y-2">
                    {displayExamples.map((ex, i) => (
                      <div key={i} className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 italic text-indigo-900 leading-relaxed text-sm">
                        &quot;{ex}&quot;
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Collection Analysis</h3>
              {!loading && (
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-bold bg-sky-100 px-2 py-1 rounded-full text-sky-700 uppercase tracking-wider mb-1">{totalFrequency} Total Uses</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Across {results.length} Songs</span>
                </div>
              )}
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center h-40 space-y-3">
                <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Scanning World...</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {results.map((result) => (
                  <li key={result.songName}>
                    <Link href={`/songs/${encodeURIComponent(result.songName)}`} className="block p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-sky-300 hover:bg-sky-50 transition-all group">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-slate-900 group-hover:text-sky-700 transition-colors">{result.songName}</span>
                        <span className="bg-sky-100 text-sky-700 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider">{result.frequency}x</span>
                      </div>
                      {(result.meaning || (result.examples && result.examples.length > 0)) && !displayMeaning && (
                        <p className="text-[10px] text-slate-400 line-clamp-1 italic">Has definition available</p>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Cross-Song Intelligence Active</p>
        </div>
      </div>
    </div>
  );
}
