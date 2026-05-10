import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const songsDir = path.join(process.cwd(), "data", "songs");

interface WordMeaning {
  word: string;
  meaning: string;
  examples: string[];
  variations?: string[];
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

    if (!fs.existsSync(songsDir)) return NextResponse.json([]);

    const songFiles = fs.readdirSync(songsDir).filter((file) => file.endsWith(".json"));
    
    // 1. Find all related words (variations) across the entire collection
    const relatedWords = new Set<string>([word.trim().toLowerCase()]);
    
    for (const file of songFiles) {
      const songPath = path.join(songsDir, file);
      const songData: Song = JSON.parse(fs.readFileSync(songPath, "utf-8"));
      
      songData.words?.forEach(w => {
        const mainWord = w.word.trim().toLowerCase();
        const variations = w.variations?.map(v => v.trim().toLowerCase()) || [];
        
        if (mainWord === word.trim().toLowerCase() || variations.includes(word.trim().toLowerCase())) {
          relatedWords.add(mainWord);
          variations.forEach(v => relatedWords.add(v));
        }
      });
    }

    const results: Array<{ 
      songName: string; 
      frequency: number; 
      meaning?: string; 
      examples?: string[];
      matchedWords: string[];
    }> = [];

    // 2. Search for all related words in every song
    for (const file of songFiles) {
      const songPath = path.join(songsDir, file);
      const songData: Song = JSON.parse(fs.readFileSync(songPath, "utf-8"));
      const songName = path.basename(file, ".json");

      let totalCount = 0;
      const foundInThisSong = new Set<string>();

      for (const searchWord of Array.from(relatedWords)) {
        const escapedWord = searchWord.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(`(?:^|[^\\p{L}\\p{M}])(${escapedWord})(?:$|[^\\p{L}\\p{M}])`, "gui");
        
        let wordCount = 0;
        const lyricsMatches = songData.lyrics.matchAll(regex);
        for (const _ of lyricsMatches) wordCount++;

        for (const concept of songData.concepts) {
          const conceptMatches = concept.matchAll(regex);
          for (const _ of conceptMatches) wordCount++;
        }

        if (wordCount > 0) {
          totalCount += wordCount;
          foundInThisSong.add(searchWord);
        }
      }

      if (totalCount > 0) {
        // Find the best meaning/examples for the group in this song
        const wordInfo = songData.words?.find(w => {
          const main = w.word.trim().toLowerCase();
          const vars = w.variations?.map(v => v.trim().toLowerCase()) || [];
          return main === word.trim().toLowerCase() || 
                 vars.includes(word.trim().toLowerCase()) ||
                 Array.from(relatedWords).includes(main);
        });

        results.push({
          songName,
          frequency: totalCount,
          meaning: wordInfo?.meaning || "",
          examples: (wordInfo?.examples && wordInfo.examples.length > 0) 
            ? wordInfo.examples 
            : (wordInfo as any)?.example 
              ? [(wordInfo as any).example] 
              : [],
          matchedWords: Array.from(foundInThisSong)
        });
      }
    }

    results.sort((a, b) => b.frequency - a.frequency);
    return NextResponse.json(results);
  } catch (error) {
    console.error("Word search error:", error);
    return NextResponse.json({ error: "Failed to search word" }, { status: 500 });
  }
}
