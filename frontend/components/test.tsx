// Tạo một component test đơn giản để kiểm tra
"use client";

import { Button } from "@/components/ui/button";

interface Props {
  lastMessage: string;
  senderName: string;
  onSelect: (text: string) => void;
}

export function ChatSuggestion({ lastMessage, senderName, onSelect }: Props) {
  console.log("🚨 CHAT SUGGESTION RENDER!", { lastMessage, senderName });
  
  return (
    <div className="px-4 py-2 border-4 border-red-500 bg-yellow-200 min-h-[60px]">
      <div className="text-lg font-bold text-red-600">
        ✅ CHAT SUGGESTION WORKS!
      </div>
      <div className="text-sm">
        Last message: "{lastMessage}"
      </div>
      <div className="text-sm">
        Sender: "{senderName}"
      </div>
      <Button 
        onClick={() => onSelect("Test response")}
        className="mt-2"
      >
        Test Button
      </Button>
    </div>
  );
}