"use client";

import Link from "next/link";
import LyricsRenderer from "./LyricsRenderer";

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
    <div className="grid gap-6 lg:grid-cols-1">
      {songs.map((song, i) => (
        <article
          key={i}
          className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm shadow-slate-200 transition hover:shadow-lg"
        >
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex-1">
              <Link href={`/songs/${encodeURIComponent(song.name)}`} className="group">
                <h2 className="text-3xl font-semibold text-slate-950 mb-1 group-hover:text-sky-600 transition-colors">
                  {song.name}
                </h2>
              </Link>
              <p className="text-sm text-slate-600 mb-2">
                by <span className="font-medium">{song.author}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
                  {song.lang}
                </span>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                  {song.tag}
                </span>
                <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-600">
                  {new Date(song.date).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/songs/${encodeURIComponent(song.name)}`}
                className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
              >
                View
              </Link>
              <Link
                href={`/edit-song?name=${encodeURIComponent(song.name)}`}
                className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-indigo-500/20 transition hover:bg-indigo-700"
              >
                Edit
              </Link>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-slate-900">
                  Lyrics
                </h3>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                  Click words to analyze
                </span>
              </div>
              <div className="rounded-xl bg-blue-50 p-4 text-slate-700 border border-blue-200 whitespace-pre-wrap break-words">
                <LyricsRenderer 
                  text={song.lyrics} 
                  highlights={song.highlights || []} 
                  location="lyrics" 
                />
              </div>
            </div>

            {song.concepts.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  Concepts
                </h3>
                <div className="space-y-2">
                  {song.concepts.map((concept, j) => (
                    <div
                      key={j}
                      className="rounded-lg bg-amber-50 p-4 border border-amber-300 text-slate-700 whitespace-pre-wrap break-words"
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
              </div>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
