import Link from "next/link";
import SongList from "../components/SongList";

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

        <SongList songs={songs} />
      </div>
    </div>
  );
}
