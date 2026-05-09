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
  words: Array<{ word: string; meaning: string }>;
  lang: string;
  tag: string;
  author: string;
  date: string;
  highlights?: Highlight[];
}

function renderHighlightedText(
  text: string,
  highlights: Highlight[],
  location: "lyrics" | "concepts",
  index: number = 0,
) {
  if (!highlights || highlights.length === 0) return text;

  const relevantHighlights = highlights.filter(
    (h) => h.location === location && h.index === index,
  );

  if (relevantHighlights.length === 0) return text;

  // Sort highlights by length descending to handle overlapping highlights (though unlikely with current UI)
  const sortedHighlights = [...relevantHighlights].sort(
    (a, b) => b.text.length - a.text.length,
  );

  // Escape special characters for regex
  const escapeRegExp = (string: string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  };

  const pattern = sortedHighlights
    .map((h) => `(${escapeRegExp(h.text)})`)
    .join("|");
  const regex = new RegExp(pattern, "gi");

  const parts = text.split(regex);

  return parts.map((part, i) => {
    if (!part) return null;

    const highlight = sortedHighlights.find(
      (h) => h.text.toLowerCase() === part.toLowerCase(),
    );

    if (highlight) {
      const level = highlight.level || (highlight as any).color || "medium";
      const colorClass =
        level === "easy" || level === "green"
          ? "bg-green-200"
          : level === "medium" || level === "yellow"
            ? "bg-yellow-200"
            : level === "hard" || level === "red" || level === "pink"
              ? "bg-red-200"
              : "bg-blue-200";

      return (
        <span
          key={i}
          className={`${colorClass} px-1 rounded transition-colors duration-200`}
          title={level.charAt(0).toUpperCase() + level.slice(1)}
        >
          {part}
        </span>
      );
    }

    return part;
  });
}

export default async function Songs({
  searchParams,
}: {
  searchParams: Promise<{
    lang?: string;
    tag?: string;
  }>;
}) {
  const { lang, tag } = await searchParams;

  const languagesRes = await fetch("http://localhost:3000/api/languages", {
    cache: "no-store",
  });
  const languages: string[] = await languagesRes.json();
  const tagsRes = await fetch("http://localhost:3000/api/tags", {
    cache: "no-store",
  });
  const tags: string[] = await tagsRes.json();

  const query = new URLSearchParams();
  if (lang) query.set("lang", lang);
  if (tag) query.set("tag", tag);

  let songs: Song[] = [];
  const res = await fetch(
    `http://localhost:3000/api/songs?${query.toString()}`,
    {
      cache: "no-store",
    },
  );
  if (res.ok) {
    songs = await res.json();
  }

  let title = "All Songs";
  if (lang) {
    title = `Songs in ${lang}`;
  } else if (tag) {
    title = `Songs tagged ${tag}`;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8 text-slate-900">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="rounded-[2rem] bg-white p-8 shadow-xl shadow-slate-200 ring-1 ring-slate-200">
          <div className="flex flex-col gap-6 sm:gap-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">
                  Song Collection
                </p>
                <h1 className="mt-2 text-4xl font-semibold text-slate-950">
                  {title}
                </h1>
              </div>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-sky-500/20 transition hover:bg-sky-700"
              >
                Back to Home
              </Link>
            </div>
            <form
              method="get"
              className="grid gap-3 md:grid-cols-[1fr_1fr_0.8fr]"
            >
              <label className="sr-only" htmlFor="lang-filter">
                Filter language
              </label>
              <select
                id="lang-filter"
                name="lang"
                defaultValue={lang ?? ""}
                className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              >
                <option value="">All languages</option>
                {languages.map((language) => (
                  <option key={language} value={language}>
                    {language}
                  </option>
                ))}
              </select>
              <label className="sr-only" htmlFor="tag-filter">
                Filter tag
              </label>
              <select
                id="tag-filter"
                name="tag"
                defaultValue={tag ?? ""}
                className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              >
                <option value="">All tags</option>
                {tags.map((tagItem) => (
                  <option key={tagItem} value={tagItem}>
                    {tagItem}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-slate-400/20 transition hover:bg-slate-800"
              >
                Apply Filter
              </button>
            </form>
          </div>
        </section>

        {songs.length === 0 ? (
          <section className="rounded-[2rem] bg-white p-8 shadow-xl shadow-slate-200 ring-1 ring-slate-200">
            <p className="text-slate-600">
              No songs found yet. Add a new song to get started.
            </p>
          </section>
        ) : (
          <div className="grid gap-6 lg:grid-cols-1">
            {songs.map((song, i) => (
              <article
                key={i}
                className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm shadow-slate-200 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="flex-1">
                    <h2 className="text-3xl font-semibold text-slate-950 mb-1">
                      {song.name}
                    </h2>
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
                  <Link
                    href={`/edit-song?name=${encodeURIComponent(song.name)}`}
                    className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-indigo-500/20 transition hover:bg-indigo-700"
                  >
                    Edit
                  </Link>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">
                      Lyrics
                    </h3>
                    <div className="rounded-xl bg-blue-50 p-4 text-slate-700 border border-blue-200 whitespace-pre-wrap break-words">
                      {renderHighlightedText(
                        song.lyrics,
                        song.highlights || [],
                        "lyrics",
                      )}
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
                            {renderHighlightedText(
                              concept,
                              song.highlights || [],
                              "concepts",
                              j,
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {song.words.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-3">
                        Words & Meanings
                      </h3>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {song.words.map((wordItem, j) => (
                          <div
                            key={j}
                            className="rounded-lg bg-green-50 p-4 border border-green-300"
                          >
                            <div className="font-semibold text-slate-900 mb-1">
                              {wordItem.word}
                            </div>
                            <div className="text-slate-700 whitespace-pre-wrap break-words">
                              {wordItem.meaning}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
