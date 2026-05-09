import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const songsDir = path.join(process.cwd(), "data", "songs");

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
  date: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get("lang");
    const tag = searchParams.get("tag");

    if (!fs.existsSync(songsDir)) {
      return NextResponse.json([]);
    }

    const songFiles = fs
      .readdirSync(songsDir)
      .filter((file) => file.endsWith(".json"));

    const allSongs: Array<Song & { name: string }> = [];

    for (const file of songFiles) {
      const songPath = path.join(songsDir, file);
      const songData: Song = JSON.parse(fs.readFileSync(songPath, "utf-8"));
      const songName = path.basename(file, ".json");

      allSongs.push({
        ...songData,
        name: songName,
      });
    }

    const filteredSongs = allSongs.filter((song) => {
      if (lang && song.lang !== lang) {
        return false;
      }
      if (tag && song.tag !== tag) {
        return false;
      }
      return true;
    });

    return NextResponse.json(filteredSongs);
  } catch {
    return NextResponse.json({ error: "Failed to get songs" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, lyrics, concepts, words, lang, tag } = await request.json();

    if (
      !name ||
      !lyrics ||
      !Array.isArray(concepts) ||
      !Array.isArray(words) ||
      !lang ||
      !tag
    ) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    // Validate words array structure
    for (const wordItem of words) {
      if (!wordItem.word || !wordItem.meaning) {
        return NextResponse.json(
          { error: "Each word must have word and meaning" },
          { status: 400 },
        );
      }
    }

    const songFile = path.join(songsDir, `${name}.json`);
    if (fs.existsSync(songFile)) {
      return NextResponse.json(
        { error: "Song with this name already exists" },
        { status: 400 },
      );
    }

    const songData: Song = {
      lyrics,
      concepts: concepts.filter((c: string) => c.trim()),
      words: words.filter(
        (w: WordMeaning) => w.word.trim() && w.meaning.trim(),
      ),
      lang,
      tag,
      date: new Date().toISOString(),
    };

    fs.writeFileSync(songFile, JSON.stringify(songData, null, 2));

    return NextResponse.json({ message: "Song added" });
  } catch {
    return NextResponse.json({ error: "Failed to add song" }, { status: 500 });
  }
}
