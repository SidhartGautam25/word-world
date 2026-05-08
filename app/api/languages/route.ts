import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const languagesFile = path.join(
  process.cwd(),
  "data",
  "utils",
  "languages.json",
);

export async function GET() {
  try {
    const languages = JSON.parse(fs.readFileSync(languagesFile, "utf-8"));
    return NextResponse.json(languages);
  } catch {
    return NextResponse.json(
      { error: "Failed to load languages" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json();
    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "Language name is required" },
        { status: 400 },
      );
    }

    const languages = JSON.parse(fs.readFileSync(languagesFile, "utf-8"));
    if (languages.includes(name)) {
      return NextResponse.json(
        { error: "Language already exists" },
        { status: 400 },
      );
    }

    languages.push(name);
    fs.writeFileSync(languagesFile, JSON.stringify(languages, null, 2));
    return NextResponse.json({ message: "Language created" });
  } catch {
    return NextResponse.json(
      { error: "Failed to create language" },
      { status: 500 },
    );
  }
}
