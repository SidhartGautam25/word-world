import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const domainsDir = path.join(process.cwd(), "data", "domains");

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get("domain");
    const language = searchParams.get("language");
    const subDomain = searchParams.get("subDomain");

    const domains = fs.readdirSync(domainsDir).filter((file) => {
      return fs.statSync(path.join(domainsDir, file)).isDirectory();
    });

    const allWords: Array<Record<string, unknown>> = [];

    for (const d of domains) {
      const wordsFile = path.join(domainsDir, d, "words.json");
      if (!fs.existsSync(wordsFile)) {
        continue;
      }
      const words = JSON.parse(fs.readFileSync(wordsFile, "utf-8"));
      allWords.push(
        ...words.map((word: Record<string, unknown>) => ({
          ...word,
          domain: d,
        })),
      );
    }

    const filteredWords = allWords.filter((item) => {
      if (domain && item.domain !== domain) {
        return false;
      }
      if (language && item.language !== language) {
        return false;
      }
      if (subDomain && item.subDomain !== subDomain) {
        return false;
      }
      return true;
    });

    return NextResponse.json(filteredWords);
  } catch {
    return NextResponse.json({ error: "Failed to get words" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { domain, word, explanation, examples, language, subDomain } =
      await request.json();

    if (!domain || !word || !explanation || !Array.isArray(examples)) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const domainPath = path.join(domainsDir, domain);
    if (!fs.existsSync(domainPath)) {
      return NextResponse.json({ error: "Domain not found" }, { status: 404 });
    }

    const wordsFile = path.join(domainPath, "words.json");
    let words = [];
    if (fs.existsSync(wordsFile)) {
      words = JSON.parse(fs.readFileSync(wordsFile, "utf-8"));
    }

    const wordEntry: Record<string, unknown> = {
      word,
      explanation,
      examples,
      date: new Date().toISOString(),
    };
    if (language && typeof language === "string") {
      wordEntry.language = language;
    }
    if (subDomain && typeof subDomain === "string") {
      wordEntry.subDomain = subDomain;
    }

    words.push(wordEntry);
    fs.writeFileSync(wordsFile, JSON.stringify(words, null, 2));

    return NextResponse.json({ message: "Word added" });
  } catch {
    return NextResponse.json({ error: "Failed to add word" }, { status: 500 });
  }
}
