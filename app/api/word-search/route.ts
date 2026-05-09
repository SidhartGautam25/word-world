import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const songsDir = path.join(process.cwd(), "data", "songs");

interface WordMeaning {
  word: string;
  meaning: string;
  example?: string;
}

interface Song {
  lyrics: string;
  concepts: string[];
  words: WordMeaning[];
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const word = searchParams.get("word");

    if (!word) {
      return NextResponse.json({ error: "Word is required" }, { status: 400 });
    }

    if (!fs.existsSync(songsDir)) {
      return NextResponse.json([]);
    }

    const songFiles = fs
      .readdirSync(songsDir)
      .filter((file) => file.endsWith(".json"));

    const results: Array<{ 
      songName: string; 
      frequency: number; 
      meaning?: string; 
      example?: string 
    }> = [];

    // Escape special characters for regex
    const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(?:^|[^\\p{L}\\p{M}])(${escapedWord})(?:$|[^\\p{L}\\p{M}])`, "gui");

    for (const file of songFiles) {
      const songPath = path.join(songsDir, file);
      const songData: Song = JSON.parse(fs.readFileSync(songPath, "utf-8"));
      const songName = path.basename(file, ".json");

      let count = 0;
      
      // Check lyrics
      const lyricsMatches = songData.lyrics.matchAll(regex);
      for (const _ of lyricsMatches) {
        count++;
      }

      // Check concepts
      for (const concept of songData.concepts) {
        const conceptMatches = concept.matchAll(regex);
        for (const _ of conceptMatches) {
          count++;
        }
      }

      if (count > 0) {
        // Find meaning and example if they exist in this song
        const wordInfo = songData.words?.find(
          (w) => w.word.toLowerCase() === word.toLowerCase()
        );

        results.push({
          songName,
          frequency: count,
          meaning: wordInfo?.meaning,
          example: wordInfo?.example,
        });
      }
    }

    // Sort by frequency descending
    results.sort((a, b) => b.frequency - a.frequency);

    return NextResponse.json(results);
  } catch (error) {
    console.error("Word search error:", error);
    return NextResponse.json({ error: "Failed to search word" }, { status: 500 });
  }
}
