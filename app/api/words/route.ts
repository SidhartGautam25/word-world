import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const domainsDir = path.join(process.cwd(), "data", "domains");

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get("domain");
    if (!domain) {
      return NextResponse.json(
        { error: "Domain parameter is required" },
        { status: 400 },
      );
    }

    const domainPath = path.join(domainsDir, domain);
    if (!fs.existsSync(domainPath)) {
      return NextResponse.json({ error: "Domain not found" }, { status: 404 });
    }

    const wordsFile = path.join(domainPath, "words.json");
    if (!fs.existsSync(wordsFile)) {
      return NextResponse.json([]);
    }

    const words = JSON.parse(fs.readFileSync(wordsFile, "utf-8"));
    return NextResponse.json(words);
  } catch {
    return NextResponse.json({ error: "Failed to get words" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { domain, word, explanation, examples } = await request.json();
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

    words.push({ word, explanation, examples });
    fs.writeFileSync(wordsFile, JSON.stringify(words, null, 2));

    return NextResponse.json({ message: "Word added" });
  } catch {
    return NextResponse.json({ error: "Failed to add word" }, { status: 500 });
  }
}
