"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import LyricsRenderer from "../../components/LyricsRenderer";

interface Highlight {
  text: string;
  level: "easy" | "medium" | "hard";
  location: "lyrics" | "concepts";
  index: number;
}

interface Song {
  name: string;
  lyrics: string;
  concepts: string[];
  words: Array<{ word: string; meaning: string }>;
  lang: string;
  tag: string;
  author: string;
  date: string;
  highlights?: Highlight[];
}

export default function SongDetail({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = use(params);
  const decodedName = decodeURIComponent(name);
  const [song, setSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSong = async () => {
      try {
        const res = await fetch(`/api/songs?lang=&tag=`);
        const songs = await res.json();
        const foundSong = songs.find((s: any) => s.name === decodedName);
        if (foundSong) {
          setSong(foundSong);
        }
      } catch (error) {
        console.error("Failed to fetch song:", error);
      }
      setLoading(false);
    };

    fetchSong();
  }, [decodedName]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium tracking-wide">Loading Song Details...</p>
        </div>
      </div>
    );
  }

  if (!song) {
    return (
      <div className="min-h-screen bg-slate-50 p-8 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">Song not found</h2>
          <Link href="/songs" className="text-sky-600 hover:underline">Return to Song Collection</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <div className="mx-auto max-w-4xl p-8 space-y-8">
        <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between mb-12">
          <div className="space-y-2">
            <Link 
              href="/songs" 
              className="text-sm font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1 group"
            >
              <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Collection
            </Link>
            <h1 className="text-5xl font-bold text-slate-950 tracking-tight">
              {song.name}
            </h1>
            <p className="text-xl text-slate-600">
              by <span className="font-semibold text-slate-900">{song.author}</span>
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="rounded-full bg-sky-100 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-sky-700">
                {song.lang}
              </span>
              <span className="rounded-full bg-emerald-100 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-emerald-700">
                {song.tag}
              </span>
              <span className="rounded-full bg-slate-200 px-4 py-1.5 text-xs font-bold text-slate-600">
                {new Date(song.date).toLocaleDateString()}
              </span>
            </div>
          </div>
          <Link
            href={`/edit-song?name=${encodeURIComponent(song.name)}`}
            className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-700 hover:-translate-y-0.5"
          >
            Edit Song
          </Link>
        </header>

        <div className="grid gap-10 lg:grid-cols-1">
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-slate-900">Lyrics</h3>
              <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">
                Click any word for analysis
              </p>
            </div>
            <div className="rounded-[2.5rem] bg-white p-10 text-xl leading-relaxed text-slate-800 border border-slate-200 shadow-xl shadow-slate-200/50 whitespace-pre-wrap break-words">
              <LyricsRenderer 
                text={song.lyrics} 
                highlights={song.highlights || []} 
                location="lyrics" 
              />
            </div>
          </section>

          {song.concepts.length > 0 && (
            <section className="space-y-6">
              <h3 className="text-2xl font-bold text-slate-900">Key Concepts</h3>
              <div className="grid gap-4">
                {song.concepts.map((concept, j) => (
                  <div
                    key={j}
                    className="rounded-3xl bg-amber-50 p-8 border border-amber-200 text-slate-800 shadow-sm leading-relaxed"
                  >
                    <LyricsRenderer 
                      text={concept} 
                      highlights={song.highlights || []} 
                      location="concepts" 
                      index={j} 
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {song.words.length > 0 && (
            <section className="space-y-6">
              <h3 className="text-2xl font-bold text-slate-900">Vocabulary</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {song.words.map((wordItem, j) => (
                  <div
                    key={j}
                    className="rounded-3xl bg-white p-6 border border-slate-200 shadow-sm transition hover:shadow-md hover:border-sky-200"
                  >
                    <div className="text-xl font-bold text-slate-900 mb-2">
                      {wordItem.word}
                    </div>
                    <div className="text-slate-600 leading-relaxed">
                      {wordItem.meaning}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
