'use client'

import { useEffect, useState } from 'react'
import { AppNavigation } from '@/components/navigation/app-navigation'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { MobileNavigation } from '@/components/navigation/mobile-navigation'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import InterestBar from '@/components/InterestBar'

const promptSuggestions = [
  'Mối quan hệ này đang phát triển theo hướng nào?',
  'Tôi có đang thể hiện bản thân đúng cách không?',
  'Có gì cần cải thiện trong cách giao tiếp với người đó?',
  'Người này có vẻ đang quan tâm thật lòng không?',
  'Có nên tiếp tục trò chuyện với người này không?',
]

interface AdviceClientProps {
  userId: number
}

export default function AdviceClient({ userId }: AdviceClientProps) {
  const [customPrompt, setCustomPrompt] = useState('')
  const [selectedSuggestion, setSelectedSuggestion] = useState('')
  const [partnerId, setPartnerId] = useState('')
  const [result, setResult] = useState('')
  const [careScore, setCareScore] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [checkingCare, setCheckingCare] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [friendOptions, setFriendOptions] = useState<{ label: string; value: string }[]>([])

  const router = useRouter()

  useEffect(() => {
    const fetchFriends = async () => {
      const accessToken = localStorage.getItem('accessToken')
      if (!userId || !accessToken) return

      try {
        const res = await fetch(`http://localhost:3333/api/users/${userId}/friends`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        const data = await res.json()

        const formatted = Array.isArray(data)
          ? data.map((u: any) => ({ label: u.name, value: String(u.id) }))
          : []

        setFriendOptions(formatted)
      } catch (err) {
        console.error('Lỗi khi lấy danh sách bạn bè:', err)
      }
    }

    fetchFriends()
  }, [])

  const handleSubmit = async () => {
    const prompt = customPrompt.trim() || selectedSuggestion
    if (!prompt || !userId || !partnerId) return

    setIsLoading(true)
    setHasSubmitted(true)
    setResult('')
    setCareScore(null)

    try {
      const res = await fetch('http://localhost:3333/api/dating-advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          partnerId: parseInt(partnerId),
          question: prompt,
        }),
      })

      const data = await res.json()
      setResult(data.result || 'Không có phản hồi.')
    } catch (err) {
      setResult('Lỗi khi gọi API.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCheckCare = async () => {
    if (!userId || !partnerId) return
    setCheckingCare(true)
    setCareScore(null)

    try {
      const res = await fetch(
        `http://localhost:3333/api/care-score?userId=${userId}&partnerId=${partnerId}`,
      )
      const data = await res.json()
      setCareScore(data.careScore ?? 0)
    } catch (err) {
      console.error('Lỗi khi tính điểm mức độ quan tâm:', err)
    } finally {
      setCheckingCare(false)
    }
  }

 return (
  <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#ff8bb3] via-[#d273ff] to-[#8e2de2] animate-gradient">
    <AppNavigation />

    <main className="flex-1 flex items-center justify-center px-4 relative overflow-hidden">
      <Card className="w-full max-w-2xl p-6 bg-white/70 backdrop-blur-md border border-pink-200 text-zinc-800 rounded-3xl shadow-xl mt-8">
        <CardHeader>
          <h2 className="text-3xl font-bold text-center text-pink-700">AI Tình Yêu</h2>
          <p className="text-sm text-center text-zinc-600">
            Chọn người, câu hỏi hoặc tự viết điều bạn đang băn khoăn 💌
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Đối tượng */}
          <div>
            <Label className="mb-1 block">Đối tượng (người kia)</Label>
            <Select onValueChange={setPartnerId}>
              <SelectTrigger className="bg-white border border-pink-300 text-zinc-700">
                <SelectValue placeholder="Chọn đối tượng" />
              </SelectTrigger>
              <SelectContent className="bg-white text-zinc-700">
                {friendOptions.map((user) => (
                  <SelectItem key={user.value} value={user.value}>
                    {user.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Câu hỏi gợi ý */}
          <div>
            <Label className="mb-1 block">Chọn câu hỏi gợi ý</Label>
            <Select onValueChange={setSelectedSuggestion}>
              <SelectTrigger className="bg-white border border-pink-300 text-zinc-700">
                <SelectValue placeholder="Gợi ý câu hỏi" />
              </SelectTrigger>
              <SelectContent className="bg-white text-zinc-700">
                {promptSuggestions.map((text, idx) => (
                  <SelectItem key={idx} value={text}>
                    {text}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Câu hỏi riêng */}
          <div>
            <Label className="mb-1 block">Hoặc nhập câu hỏi riêng</Label>
            <Textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Viết điều bạn đang thắc mắc 💭"
              className="bg-white text-zinc-700 border border-pink-300 placeholder:text-zinc-500"
            />
          </div>

          {/* Nút & Mức độ quan tâm */}
          <div className="flex flex-col items-center gap-4 mt-2">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
              <Button
                onClick={handleSubmit}
                className="w-[180px] rounded-full bg-gradient-to-r from-orange-400 to-pink-500 hover:brightness-110 text-white font-semibold shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? 'Đang phân tích...' : 'Lấy lời khuyên'}
              </Button>

              <Button
                onClick={handleCheckCare}
                disabled={!partnerId || checkingCare}
                className="w-[180px] rounded-full bg-gradient-to-r from-blue-400 to-purple-500 text-white font-semibold shadow-lg"
              >
                {checkingCare ? 'Đang tính điểm...' : 'Mức độ quan tâm 💙'}
              </Button>
            </div>

            {/* ✅ Hiển thị InterestBar nếu có điểm */}
            {careScore !== null && (
              <div className="w-full max-w-[360px] mt-2">
                <InterestBar score={careScore} />
              </div>
            )}
          </div>

          {/* Lời khuyên */}
          {hasSubmitted && (
            <div className="mt-6 p-5 border border-pink-200 rounded-xl bg-white/70 text-zinc-800 whitespace-pre-line shadow-inner">
              <h3 className="font-semibold mb-2 text-pink-600">💡 Lời khuyên từ AI:</h3>
              <p>{result}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </main>

    <div className="md:hidden fixed bottom-0 w-full z-50">
      <MobileNavigation />
    </div>
  </div>
)
}
