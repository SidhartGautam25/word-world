"use client";

import Link from "next/link";

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
  words: Array<{ word: string; meaning: string; example?: string }>;
  lang: string;
  tag: string;
  author: string;
  date: string;
  highlights?: Highlight[];
}

interface SongListProps {
  songs: Song[];
}

export default function SongList({ songs }: SongListProps) {
  if (songs.length === 0) {
    return (
      <section className="rounded-[2rem] bg-white p-8 shadow-xl shadow-slate-200 ring-1 ring-slate-200">
        <p className="text-slate-600">
          No songs found yet. Add a new song to get started.
        </p>
      </section>
    );
  }

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
      {songs.map((song, i) => (
        <article
          key={i}
          className="group rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200 transition-all hover:shadow-xl hover:-translate-y-1"
        >
          <div className="flex flex-col h-full">
            <div className="flex-1 space-y-4">
              <div className="flex justify-between items-start gap-4">
                <Link 
                  href={`/songs/${encodeURIComponent(song.name)}`} 
                  className="flex-1"
                >
                  <h2 className="text-2xl font-bold text-slate-950 group-hover:text-sky-600 transition-colors line-clamp-2">
                    {song.name}
                  </h2>
                </Link>
                <div className="flex gap-1">
                  <Link
                    href={`/edit-song?name=${encodeURIComponent(song.name)}`}
                    className="p-2 rounded-full bg-slate-50 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                    title="Edit Song"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                  </Link>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-slate-500 font-medium">
                  {song.author}
                </p>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest">
                  Added {new Date(song.date).toLocaleDateString()}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <span className="rounded-full bg-sky-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-sky-700">
                  {song.lang}
                </span>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                  {song.tag}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href={`/songs/${encodeURIComponent(song.name)}`}
                className="flex items-center justify-center w-full rounded-2xl bg-slate-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
              >
                Read & Analyze
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
