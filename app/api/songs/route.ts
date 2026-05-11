import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const songsDir = path.join(process.cwd(), "data", "songs");

interface WordMeaning {
  word: string;
  meaning: string;
  examples: string[];
  variations: string[]; // Added variations support
  collections?: string[]; // Added collections support
}

interface Highlight {
  text: string;
  level: "easy" | "medium" | "hard";
  location: "lyrics" | "concepts";
  index: number;
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get("lang");
    const tag = searchParams.get("tag");

    if (!fs.existsSync(songsDir)) return NextResponse.json([]);

    const songFiles = fs.readdirSync(songsDir).filter((file) => file.endsWith(".json"));
    const allSongs: Array<Song & { name: string }> = [];

    for (const file of songFiles) {
      const songPath = path.join(songsDir, file);
      const songData: Song = JSON.parse(fs.readFileSync(songPath, "utf-8"));
      allSongs.push({ ...songData, name: path.basename(file, ".json") });
    }

    const filteredSongs = allSongs.filter((song) => {
      if (lang && song.lang !== lang) return false;
      if (tag && song.tag !== tag) return false;
      return true;
    });

    filteredSongs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return NextResponse.json(filteredSongs);

  } catch {
    return NextResponse.json({ error: "Failed to get songs" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, lyrics, concepts, words, lang, tag, author, highlights } = await request.json();

    if (!name || !lyrics || !Array.isArray(concepts) || !Array.isArray(words) || !lang || !tag || !author) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const songFile = path.join(songsDir, `${name}.json`);
    if (fs.existsSync(songFile)) return NextResponse.json({ error: "Already exists" }, { status: 400 });

    const songData: Song = {
      lyrics,
      concepts: concepts.filter((c: string) => c.trim()),
      words: words.filter((w: WordMeaning) => w.word.trim()).map(w => ({
        ...w,
        variations: w.variations || [],
        collections: w.collections || []
      })),
      lang,
      tag,
      author,
      date: new Date().toISOString(),
      highlights: highlights || [],
    };

    fs.writeFileSync(songFile, JSON.stringify(songData, null, 2));
    return NextResponse.json({ message: "Song added" });
  } catch {
    return NextResponse.json({ error: "Failed to add" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { oldName, name, lyrics, concepts, words, lang, tag, author, highlights } = await request.json();

    if (!oldName || !name || !lyrics || !Array.isArray(concepts) || !Array.isArray(words) || !lang || !tag || !author) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const oldSongFile = path.join(songsDir, `${oldName}.json`);
    if (!fs.existsSync(oldSongFile)) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (oldName !== name) {
      const newSongFile = path.join(songsDir, `${name}.json`);
      if (fs.existsSync(newSongFile)) return NextResponse.json({ error: "Already exists" }, { status: 400 });
      fs.unlinkSync(oldSongFile);
    }

    let creationDate = new Date().toISOString();
    try {
        const existingData = JSON.parse(fs.readFileSync(path.join(songsDir, `${oldName}.json`), "utf-8"));
        creationDate = existingData.date;
    } catch {}

    const songData: Song = {
      lyrics,
      concepts: concepts.filter((c: string) => c.trim()),
      words: words.filter((w: WordMeaning) => w.word.trim()).map(w => ({
        ...w,
        variations: w.variations || [],
        collections: w.collections || []
      })),
      lang,
      tag,
      author,
      date: creationDate,
      highlights: highlights || [],
    };

    fs.writeFileSync(path.join(songsDir, `${name}.json`), JSON.stringify(songData, null, 2));
    return NextResponse.json({ message: "Updated" });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
