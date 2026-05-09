"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface SearchResult {
  songName: string;
  frequency: number;
}

interface WordAnalysisSidebarProps {
  word: string;
  onClose: () => void;
}

export default function WordAnalysisSidebar({
  word,
  onClose,
}: WordAnalysisSidebarProps) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);

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
    <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l border-slate-200">
      <div className="h-full flex flex-col">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600 mb-1">
              Word Analysis
            </p>
            <h2 className="text-xl font-bold text-slate-900 break-all">
              "{word}"
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-slate-200 text-slate-500 transition-colors"
            aria-label="Close"
          >
            <svg
              className="w-5 h-5"
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

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-40 space-y-3">
              <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-slate-500">Analyzing collection...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-slate-500">No other songs found with this word.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-slate-600">
                Found in <span className="font-semibold text-slate-900">{results.length}</span> {results.length === 1 ? 'song' : 'songs'}:
              </p>
              <ul className="space-y-3">
                {results.map((result) => (
                  <li key={result.songName} className="group">
                    <Link
                      href={`/songs/${encodeURIComponent(result.songName)}`}
                      className="block p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-sky-300 hover:bg-sky-50 transition-all"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-semibold text-slate-900 group-hover:text-sky-700">
                          {result.songName}
                        </span>
                        <span className="bg-sky-100 text-sky-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                          {result.frequency}x
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        Click to view details
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100">
          <p className="text-[10px] text-slate-400 text-center uppercase tracking-widest font-medium">
            Word World Intelligence
          </p>
        </div>
      </div>
    </div>
  );
}
