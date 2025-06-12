// components/InterestBar.tsx
import { Progress } from "@/components/ui/progress"

interface InterestBarProps {
  score: number
}

export default function InterestBar({ score }: InterestBarProps) {
  let label = "Không rõ 🤷"
  if (score >= 80) label = "❤️ Rất quan tâm"
  else if (score >= 60) label = "💗 Quan tâm"
  else if (score >= 40) label = "🤔 Có chút quan tâm"
  else if (score > 0) label = "😐 Ít quan tâm"
  else label = "❌ Chưa có tương tác"

  return (
    <div className="space-y-2 mt-4">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-pink-700">Mức độ quan tâm</span>
        <span className="text-sm text-zinc-600">
          {score}% – {label}
        </span>
      </div>
      <Progress value={score} className="h-3 bg-pink-100" />
    </div>
  )
}
