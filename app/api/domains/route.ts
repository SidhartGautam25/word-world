import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const domainsDir = path.join(process.cwd(), "data", "domains");

export async function GET() {
  try {
    const domains = fs.readdirSync(domainsDir).filter((file) => {
      return fs.statSync(path.join(domainsDir, file)).isDirectory();
    });
    return NextResponse.json(domains);
  } catch {
    return NextResponse.json(
      { error: "Failed to list domains" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json();
    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "Domain name is required" },
        { status: 400 },
      );
    }

    const domainPath = path.join(domainsDir, name);
    if (fs.existsSync(domainPath)) {
      return NextResponse.json(
        { error: "Domain already exists" },
        { status: 400 },
      );
    }

    fs.mkdirSync(domainPath);
    const wordsFile = path.join(domainPath, "words.json");
    fs.writeFileSync(wordsFile, JSON.stringify([], null, 2));

    return NextResponse.json({ message: "Domain created" });
  } catch {
    return NextResponse.json(
      { error: "Failed to create domain" },
      { status: 500 },
    );
  }
}
