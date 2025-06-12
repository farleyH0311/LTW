"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
// ✅ Dùng đúng SDK
import { GoogleGenAI } from "@google/genai";

interface Props {
  lastMessage: string;
  senderName: string;
  onSelect: (text: string) => void;
}

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY!;
const ai = new GoogleGenAI({ apiKey });

export function ChatSuggestion({ lastMessage, senderName, onSelect }: Props) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSuggest = async () => {
    if (!lastMessage) return;
    setLoading(true);

    try {
      const result = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [
          {
            parts: [
              {
                text: `Người dùng vừa nhận tin nhắn: "${lastMessage}". Hãy gợi ý 3 phản hồi ngắn gọn, dễ thương hỗ trợ việc tán tỉnh. Chỉ in mỗi câu một dòng.`,
              },
            ],
          },
        ],
      });

      const reply =
        result.candidates?.[0]?.content?.parts?.[0]?.text ?? "(Không có phản hồi)";

      const lines = reply
        .split("\n")
        .map((line) => line.replace(/^[-*\d.]+\s*/, "").trim())
        .filter((line) => line.length > 0);

      setSuggestions(lines.slice(0, 3));
    } catch (err) {
      console.error("❌ Lỗi gọi Gemini:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-2 flex flex-col gap-2 items-end">
  <Button
    onClick={handleSuggest}
    disabled={loading || !lastMessage}
    className="bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md hover:opacity-90"
  >
    {loading ? "Đang gợi ý..." : "✨ Gợi ý phản hồi"}
  </Button>


      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s, i) => (
            <Button
              key={i}
              variant="secondary"
              className="text-sm"
              onClick={() => onSelect(s)}
            >
              {s}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
