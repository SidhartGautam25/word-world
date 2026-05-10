"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface WordMeaning {
  word: string;
  meaning: string;
  examples?: string[];
  variations?: string[];
  collections?: string[];
}

interface SearchResult {
  songName: string;
  frequency: number;
  meaning?: string;
  examples?: string[];
  matchedWords: string[];
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

  const currentWordInfo = currentSongWords?.find((w) => {
    const main = w.word.trim().toLowerCase();
    const vars = w.variations?.map(v => v.trim().toLowerCase()) || [];
    return main === word.trim().toLowerCase() || vars.includes(word.trim().toLowerCase());
  });

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

  const currentMeaning = currentWordInfo?.meaning?.trim();
  const currentExamples = currentWordInfo?.examples?.filter(ex => ex.trim() !== "") || [];

  const globalMeaning = results.find(r => r.meaning && r.meaning.trim() !== "")?.meaning;
  const globalExamples = results.find(r => r.examples && r.examples.some(ex => ex.trim() !== ""))?.examples?.filter(ex => ex.trim() !== "") || [];

  const displayMeaning = (currentMeaning && currentMeaning !== "") ? currentMeaning : (globalMeaning || "");
  const displayExamples = (currentExamples.length > 0) ? currentExamples : globalExamples;
    
  const isFallback = (!currentMeaning || currentMeaning === "") && (!!globalMeaning && globalMeaning !== "");
  const totalFrequency = results.reduce((sum, res) => sum + res.frequency, 0);

  return (
    <div className="fixed inset-y-0 right-0 w-[28rem] bg-white shadow-[0_0_50px_rgba(0,0,0,0.1)] z-50 transform transition-all duration-500 ease-out border-l border-slate-100 flex flex-col font-sans">
      {/* Header */}
      <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/50 backdrop-blur-md">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-sky-600 mb-2">Analysis Hub</p>
          <h2 className="text-4xl font-black text-slate-950 tracking-tight break-words leading-none">{word}</h2>
        </div>
        <button onClick={onClose} className="group rounded-full p-4 hover:bg-white hover:shadow-lg text-slate-400 hover:text-slate-950 transition-all active:scale-95">
          <svg className="w-6 h-6 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-10 py-8 custom-scrollbar">
        {/* Core Intelligence */}
        {(displayMeaning || displayExamples.length > 0) && (
          <div className="mb-12 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {isFallback && (
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-1.5 border border-amber-100/50">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest">Global Intelligence Active</span>
              </div>
            )}
            
            {displayMeaning && (
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Master Definition</p>
                <p className="text-2xl font-bold text-slate-900 leading-[1.4] tracking-tight">{displayMeaning}</p>
              </div>
            )}
            
            {displayExamples.length > 0 && (
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Contextual usage</p>
                <div className="space-y-3">
                  {displayExamples.map((ex, i) => (
                    <div key={i} className="group p-6 rounded-[2rem] bg-slate-50 border border-slate-100/50 hover:bg-white hover:shadow-xl hover:border-sky-100 transition-all duration-300">
                      <p className="text-slate-800 italic leading-relaxed text-sm group-hover:text-sky-950 transition-colors">&quot;{ex}&quot;</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Global Statistics */}
        <div className="space-y-8">
          <div className="flex items-end justify-between border-b border-slate-50 pb-6">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Collection Stats</h3>
            <div className="text-right">
              <span className="block text-4xl font-black text-slate-950 leading-none">{totalFrequency}</span>
              <span className="text-[10px] font-black text-sky-600 uppercase tracking-widest">Total occurrences</span>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="w-12 h-12 border-[6px] border-slate-100 border-t-sky-600 rounded-full animate-spin"></div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] animate-pulse">Syncing World...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-16 rounded-[2.5rem] border-2 border-dashed border-slate-100 bg-slate-50/50">
              <p className="text-slate-400 font-bold italic text-sm">Unique to this entry.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((result) => (
                <Link 
                  key={result.songName} 
                  href={`/songs/${encodeURIComponent(result.songName)}`} 
                  className="block group relative p-6 rounded-[2.5rem] bg-white border border-slate-100 hover:border-sky-300 hover:shadow-2xl hover:shadow-sky-100/50 transition-all duration-300 overflow-hidden"
                >
                  <div className="relative z-10 flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="block font-black text-slate-950 group-hover:text-sky-600 transition-colors text-lg tracking-tight leading-tight">{result.songName}</span>
                      <div className="flex flex-wrap gap-1">
                        {result.matchedWords.map(mw => (
                          <span key={mw} className="text-[9px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md uppercase">{mw}</span>
                        ))}
                      </div>
                    </div>
                    <span className="bg-sky-600 text-white text-[10px] font-black px-4 py-2 rounded-2xl uppercase tracking-widest shadow-lg shadow-sky-200">
                      {result.frequency}×
                    </span>
                  </div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-sky-50 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700 opacity-30"></div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-10 bg-slate-950">
        <div className="flex items-center justify-between opacity-50">
          <p className="text-[10px] text-white uppercase tracking-[0.4em] font-black">Linguistic Engine v2.0</p>
          <div className="flex gap-1">
            <span className="w-1 h-1 rounded-full bg-white"></span>
            <span className="w-1 h-1 rounded-full bg-white"></span>
            <span className="w-1 h-1 rounded-full bg-white"></span>
          </div>
        </div>
      </div>
    </div>
  );
}
