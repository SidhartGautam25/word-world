import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const collectionsFile = path.join(process.cwd(), "data", "utils", "collections.json");

export async function GET() {
  try {
    if (!fs.existsSync(collectionsFile)) {
      fs.writeFileSync(collectionsFile, JSON.stringify([], null, 2));
    }
    const collections: string[] = JSON.parse(fs.readFileSync(collectionsFile, "utf-8"));
    return NextResponse.json(collections);
  } catch {
    return NextResponse.json({ error: "Failed to load collections" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json();
    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "Collection name is required" },
        { status: 400 },
      );
    }

    if (!fs.existsSync(collectionsFile)) {
      fs.writeFileSync(collectionsFile, JSON.stringify([], null, 2));
    }
    const collections: string[] = JSON.parse(fs.readFileSync(collectionsFile, "utf-8"));
    if (collections.includes(name)) {
      return NextResponse.json(
        { error: "Collection already exists" },
        { status: 400 },
      );
    }

    collections.push(name);
    fs.writeFileSync(collectionsFile, JSON.stringify(collections, null, 2));

    return NextResponse.json({ message: "Collection added" });
  } catch {
    return NextResponse.json({ error: "Failed to add collection" }, { status: 500 });
  }
}
