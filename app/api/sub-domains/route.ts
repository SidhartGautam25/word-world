import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const subDomainsFile = path.join(
  process.cwd(),
  "data",
  "utils",
  "sub-domains.json",
);

interface SubDomainEntry {
  domain: string;
  name: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get("domain");
    const subDomains: SubDomainEntry[] = JSON.parse(
      fs.readFileSync(subDomainsFile, "utf-8"),
    );
    if (domain) {
      return NextResponse.json(
        subDomains.filter((item) => item.domain === domain),
      );
    }
    return NextResponse.json(subDomains);
  } catch {
    return NextResponse.json(
      { error: "Failed to load sub-domains" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, domain } = await request.json();
    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "Sub-domain name is required" },
        { status: 400 },
      );
    }
    if (!domain || typeof domain !== "string") {
      return NextResponse.json(
        { error: "Domain is required for sub-domain" },
        { status: 400 },
      );
    }

    const subDomains: SubDomainEntry[] = JSON.parse(
      fs.readFileSync(subDomainsFile, "utf-8"),
    );
    const exists = subDomains.some(
      (item) => item.domain === domain && item.name === name,
    );
    if (exists) {
      return NextResponse.json(
        { error: "Sub-domain already exists for this domain" },
        { status: 400 },
      );
    }

    subDomains.push({ domain, name });
    fs.writeFileSync(subDomainsFile, JSON.stringify(subDomains, null, 2));
    return NextResponse.json({ message: "Sub-domain created" });
  } catch {
    return NextResponse.json(
      { error: "Failed to create sub-domain" },
      { status: 500 },
    );
  }
}
