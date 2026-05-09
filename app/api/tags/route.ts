import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const tagsFile = path.join(process.cwd(), "data", "utils", "tags.json");

export async function GET() {
  try {
    const tags: string[] = JSON.parse(fs.readFileSync(tagsFile, "utf-8"));
    return NextResponse.json(tags);
  } catch {
    return NextResponse.json({ error: "Failed to load tags" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json();
    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "Tag name is required" },
        { status: 400 },
      );
    }

    const tags: string[] = JSON.parse(fs.readFileSync(tagsFile, "utf-8"));
    if (tags.includes(name)) {
      return NextResponse.json(
        { error: "Tag already exists" },
        { status: 400 },
      );
    }

    tags.push(name);
    fs.writeFileSync(tagsFile, JSON.stringify(tags, null, 2));

    return NextResponse.json({ message: "Tag added" });
  } catch {
    return NextResponse.json({ error: "Failed to add tag" }, { status: 500 });
  }
}
