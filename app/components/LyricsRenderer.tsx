"use client";

import { useState } from "react";
import WordAnalysisSidebar from "./WordAnalysisSidebar";

interface Highlight {
  text: string;
  level: "easy" | "medium" | "hard";
  location: "lyrics" | "concepts";
  index: number;
}

interface WordMeaning {
  word: string;
  meaning: string;
  example?: string;
}

interface LyricsRendererProps {
  text: string;
  highlights: Highlight[];
  location: "lyrics" | "concepts";
  index?: number;
  currentSongWords?: WordMeaning[];
  onWordClick?: (word: string) => void;
}

export default function LyricsRenderer({
  text,
  highlights,
  location,
  index = 0,
  currentSongWords,
  onWordClick,
}: LyricsRendererProps) {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  const handleWordClick = (word: string) => {
    const cleanWord = word.replace(/[^\p{L}\p{M}\d'-]/gu, "");
    if (cleanWord) {
      if (onWordClick) {
        onWordClick(cleanWord);
      } else {
        setSelectedWord(cleanWord);
      }
    }
  };

  function renderInteractiveText() {
    if (!text) return null;

    const relevantHighlights = (highlights || []).filter(
      (h) => h.location === location && h.index === index,
    );

    if (relevantHighlights.length > 0) {
      const sortedHighlights = [...relevantHighlights].sort(
        (a, b) => b.text.length - a.text.length,
      );
      const escapeRegExp = (string: string) =>
        string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const pattern = sortedHighlights
        .map((h) => `(${escapeRegExp(h.text)})`)
        .join("|");
      const regex = new RegExp(pattern, "gi");
      const parts = text.split(regex);

      return parts.map((part, i) => {
        if (!part) return null;
        const highlight = sortedHighlights.find(
          (h) => h.text.toLowerCase() === part.toLowerCase(),
        );

        if (highlight) {
          const level = highlight.level || (highlight as any).color || "medium";
          const colorClass =
            level === "easy"
              ? "bg-green-200"
              : level === "medium"
                ? "bg-yellow-200"
                : "bg-red-200";

          return (
            <span
              key={i}
              className={`${colorClass} px-1 rounded cursor-pointer hover:ring-2 hover:ring-sky-400 transition-all`}
              onClick={(e) => {
                e.stopPropagation();
                handleWordClick(part);
              }}
              title={`Frequency analysis for "${part}"`}
            >
              {part}
            </span>
          );
        }

        return renderClickableWords(part, i);
      });
    }

    return renderClickableWords(text, 0);
  }

  function renderClickableWords(rawText: string, keyPrefix: string | number) {
    const wordsAndOthers = rawText.split(/([\s,!?.;:()"[\]{}]+)/gu);

    return wordsAndOthers.map((token, i) => {
      if (!token) return null;

      if (/[\p{L}\p{M}\d'-]/u.test(token)) {
        return (
          <span
            key={`${keyPrefix}-${i}`}
            className="cursor-pointer hover:bg-sky-100 px-0.5 rounded transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              handleWordClick(token);
            }}
          >
            {token}
          </span>
        );
      }

      return <span key={`${keyPrefix}-${i}`}>{token}</span>;
    });
  }

  return (
    <>
      {renderInteractiveText()}
      {selectedWord && (
        <WordAnalysisSidebar
          word={selectedWord}
          currentSongWords={currentSongWords}
          onClose={() => setSelectedWord(null)}
        />
      )}
    </>
  );
}
