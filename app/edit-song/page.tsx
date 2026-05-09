"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

interface WordMeaning {
  word: string;
  meaning: string;
}

interface Song {
  lyrics: string;
  concepts: string[];
  words: WordMeaning[];
  lang: string;
  tag: string;
  author: string;
  date: string;
  highlights?: Highlight[];
}

interface Highlight {
  text: string;
  level: "easy" | "medium" | "hard";
  location: "lyrics" | "concepts";
  index: number;
}

export default function EditSong() {
  const searchParams = useSearchParams();
  const songName = searchParams.get("name");
  const router = useRouter();

  const [languages, setLanguages] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [name, setName] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [lyrics, setLyrics] = useState<string>("");
  const [concepts, setConcepts] = useState<string[]>([""]);
  const [words, setWords] = useState<WordMeaning[]>([
    { word: "", meaning: "" },
  ]);
  const [lang, setLang] = useState<string>("");
  const [tag, setTag] = useState<string>("");
  const [highlights, setHighlights] = useState<
    Array<{
      text: string;
      level: "easy" | "medium" | "hard";
      location: "lyrics" | "concepts";
      index: number;
    }>
  >([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch languages and tags
      const [langRes, tagsRes] = await Promise.all([
        fetch("/api/languages"),
        fetch("/api/tags"),
      ]);

      const languages = await langRes.json();
      const tags = await tagsRes.json();

      setLanguages(languages);
      setTags(tags);

      // Fetch song data
      if (songName) {
        const songsRes = await fetch(`/api/songs?lang=&tag=`);
        const songs = await songsRes.json();
        const song = songs.find(
          (s: Song & { name: string }) => s.name === songName,
        );

        if (song) {
          setName(song.name);
          setAuthor(song.author);
          setLyrics(song.lyrics);
          setConcepts(song.concepts);
          setWords(song.words);
          setLang(song.lang);
          setTag(song.tag);
          if (song.highlights) {
            setHighlights(song.highlights);
          }
        }
      }

      setInitialLoading(false);
    };

    fetchData();
  }, [songName]);

  const addConcept = () => {
    setConcepts((current) => [...current, ""]);
  };

  const updateConcept = (index: number, value: string) => {
    setConcepts((current) =>
      current.map((concept, idx) => (idx === index ? value : concept)),
    );
  };

  const removeConcept = (index: number) => {
    setConcepts((current) => current.filter((_, idx) => idx !== index));
  };

  const addHighlight = (
    selectedText: string,
    level: "easy" | "medium" | "hard",
    location: "lyrics" | "concepts",
    conceptIndex: number = 0,
  ) => {
    const newHighlight = {
      text: selectedText,
      level,
      location,
      index: conceptIndex,
    };
    setHighlights((current) => [...current, newHighlight]);
  };

  const removeHighlight = (highlightText: string) => {
    setHighlights((current) => current.filter((h) => h.text !== highlightText));
  };

  const getLevelClasses = (level: "easy" | "medium" | "hard") => {
    const levels: Record<string, string> = {
      easy: "bg-green-200",
      medium: "bg-yellow-200",
      hard: "bg-red-200",
    };
    return levels[level] || "bg-green-200";
  };

  const addWord = () => {
    setWords((current) => [...current, { word: "", meaning: "" }]);
  };

  const updateWord = (
    index: number,
    field: "word" | "meaning",
    value: string,
  ) => {
    setWords((current) =>
      current.map((wordItem, idx) =>
        idx === index ? { ...wordItem, [field]: value } : wordItem,
      ),
    );
  };

  const removeWord = (index: number) => {
    setWords((current) => current.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    const conceptsArray = concepts
      .map((concept) => concept.trim())
      .filter((concept) => concept);
    const wordsArray = words.filter(
      (wordItem) => wordItem.word.trim() && wordItem.meaning.trim(),
    );

    try {
      const res = await fetch("/api/songs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          oldName: songName,
          name,
          author,
          lyrics,
          concepts: conceptsArray,
          words: wordsArray,
          lang,
          tag,
          highlights,
        }),
      });
      if (res.ok) {
        router.push("/songs");
      } else {
        alert("Failed to update song");
      }
    } catch {
      alert("Error");
    }
    setLoading(false);
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-8 text-slate-900 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8 text-slate-900">
      <div className="mx-auto max-w-2xl rounded-[2rem] bg-white p-8 shadow-xl shadow-slate-200 ring-1 ring-slate-200">
        <h1 className="text-3xl font-semibold mb-3">Edit Song</h1>
        <p className="text-slate-600 mb-8">
          Update song details including lyrics, concepts, and word meanings.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Song Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Author
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Lyrics
            </label>
            <div className="mb-3 flex gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => {
                  const selected = window.getSelection()?.toString();
                  if (selected) addHighlight(selected, "easy", "lyrics");
                }}
                className="rounded-lg bg-green-200 px-3 py-1 text-xs font-semibold text-green-900 hover:bg-green-300"
                title="Select text and click to mark as Easy"
              >
                ✓ Easy
              </button>
              <button
                type="button"
                onClick={() => {
                  const selected = window.getSelection()?.toString();
                  if (selected) addHighlight(selected, "medium", "lyrics");
                }}
                className="rounded-lg bg-yellow-200 px-3 py-1 text-xs font-semibold text-yellow-900 hover:bg-yellow-300"
                title="Select text and click to mark as Medium"
              >
                ~ Medium
              </button>
              <button
                type="button"
                onClick={() => {
                  const selected = window.getSelection()?.toString();
                  if (selected) addHighlight(selected, "hard", "lyrics");
                }}
                className="rounded-lg bg-red-200 px-3 py-1 text-xs font-semibold text-red-900 hover:bg-red-300"
                title="Select text and click to mark as Hard"
              >
                ! Hard
              </button>
              <span className="text-xs text-slate-500 self-center ml-auto">
                Select text then click difficulty
              </span>
            </div>
            <textarea
              value={lyrics}
              onChange={(e) => setLyrics(e.target.value)}
              rows={6}
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              required
            />
            {highlights.filter((h) => h.location === "lyrics").length > 0 && (
              <div className="mt-3 rounded-lg bg-slate-100 p-3">
                <p className="text-xs font-semibold text-slate-700 mb-2">
                  Marked words in lyrics:
                </p>
                <div className="flex flex-wrap gap-2">
                  {highlights
                    .filter((h) => h.location === "lyrics")
                    .map((h, idx) => (
                      <span
                        key={idx}
                        className={`${getLevelClasses(h.level)} rounded px-2 py-1 text-xs font-medium cursor-pointer hover:opacity-75`}
                        onClick={() => removeHighlight(h.text)}
                        title="Click to remove mark"
                      >
                        {h.level === "easy" && "✓"}{" "}
                        {h.level === "medium" && "~"}{" "}
                        {h.level === "hard" && "!"} {h.text} ✕
                      </span>
                    ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-slate-700">
                Concepts
              </label>
              <button
                type="button"
                onClick={addConcept}
                className="text-sm text-sky-600 hover:text-sky-700"
              >
                + Add Concept
              </button>
            </div>
            <div className="space-y-4">
              {concepts.map((concept, index) => (
                <div key={index}>
                  <div className="mb-2 flex gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => {
                        const selected = window.getSelection()?.toString();
                        if (selected)
                          addHighlight(selected, "easy", "concepts", index);
                      }}
                      className="rounded-lg bg-green-200 px-2 py-1 text-xs font-semibold text-green-900 hover:bg-green-300"
                      title="Select text and click to mark as Easy"
                    >
                      ✓ Easy
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const selected = window.getSelection()?.toString();
                        if (selected)
                          addHighlight(selected, "medium", "concepts", index);
                      }}
                      className="rounded-lg bg-yellow-200 px-2 py-1 text-xs font-semibold text-yellow-900 hover:bg-yellow-300"
                      title="Select text and click to mark as Medium"
                    >
                      ~ Medium
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const selected = window.getSelection()?.toString();
                        if (selected)
                          addHighlight(selected, "hard", "concepts", index);
                      }}
                      className="rounded-lg bg-red-200 px-2 py-1 text-xs font-semibold text-red-900 hover:bg-red-300"
                      title="Select text and click to mark as Hard"
                    >
                      ! Hard
                    </button>
                  </div>
                  <div className="flex gap-3">
                    <textarea
                      value={concept}
                      onChange={(e) => updateConcept(index, e.target.value)}
                      placeholder="Explain a concept from the song..."
                      rows={3}
                      className="flex-1 rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                    />
                    {concepts.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeConcept(index)}
                        className="self-start rounded-full bg-red-100 p-2 text-red-600 hover:bg-red-200"
                      >
                        ×
                      </button>
                    )}
                  </div>
                  {highlights.filter(
                    (h) => h.location === "concepts" && h.index === index,
                  ).length > 0 && (
                    <div className="mt-2 rounded-lg bg-slate-100 p-2">
                      <div className="flex flex-wrap gap-1">
                        {highlights
                          .filter(
                            (h) =>
                              h.location === "concepts" && h.index === index,
                          )
                          .map((h, idx) => (
                            <span
                              key={idx}
                              className={`${getLevelClasses(h.level)} rounded px-2 py-1 text-xs font-medium cursor-pointer hover:opacity-75`}
                              onClick={() => removeHighlight(h.text)}
                              title="Click to remove highlight"
                            >
                              {h.text} ✕
                            </span>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-slate-700">
                Words & Meanings
              </label>
              <button
                type="button"
                onClick={addWord}
                className="text-sm text-sky-600 hover:text-sky-700"
              >
                + Add Word
              </button>
            </div>
            <div className="space-y-3">
              {words.map((wordItem, index) => (
                <div key={index} className="flex gap-3">
                  <input
                    type="text"
                    value={wordItem.word}
                    onChange={(e) => updateWord(index, "word", e.target.value)}
                    placeholder="Word"
                    className="flex-1 rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  />
                  <input
                    type="text"
                    value={wordItem.meaning}
                    onChange={(e) =>
                      updateWord(index, "meaning", e.target.value)
                    }
                    placeholder="Meaning"
                    className="flex-1 rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  />
                  {words.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeWord(index)}
                      className="self-start rounded-full bg-red-100 p-2 text-red-600 hover:bg-red-200"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Language
              </label>
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                required
              >
                <option value="">Select Language</option>
                {languages.map((language) => (
                  <option key={language} value={language}>
                    {language}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Tag
              </label>
              <select
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                required
              >
                <option value="">Select Tag</option>
                {tags.map((tagItem) => (
                  <option key={tagItem} value={tagItem}>
                    {tagItem}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-slate-400/20 transition hover:bg-slate-800 disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Song"}
            </button>
            <Link
              href="/songs"
              className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
