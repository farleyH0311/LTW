"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PersonalityRadarChart } from "@/components/personality-radar-chart";
import { AnimatedGradientBorder } from "@/components/ui-effects/animated-gradient-border";
import { createPersonalityTest } from "../axios";
import {
  questions,
  answerLabels,
  traitDetails,
  traitComments,
  TraitKey,
} from "./question";
import Link from "next/link";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Github,
  ChromeIcon as Google,
} from "lucide-react";
type PersonalityTraitData = {
  trait: TraitKey;
  value: number;
};

export default function PersonalityTestPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [id: number]: number }>({});
  const [selectedTrait, setSelectedTrait] = useState<TraitKey | null>(null);
  const [saving, setSaving] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const router = useRouter();

  const isCompleted = Object.keys(answers).length === questions.length;

  const handleAnswer = (score: number) => {
    const question = questions[currentIndex];
    setAnswers((prev) => ({ ...prev, [question.id]: score }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      if (isCompleted) {
        setShowResult(true);
      } else {
        alert("Vui lòng trả lời hết các câu hỏi trước khi xem kết quả.");
      }
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  // Tính điểm cuối cho từng trait
  const groupedScores = questions.reduce((acc, question) => {
    const score = answers[question.id];
    if (score === undefined) return acc;
    const trait = question.trait as TraitKey;
    if (!acc[trait]) acc[trait] = [];
    acc[trait].push(score);
    return acc;
  }, {} as Record<TraitKey, number[]>);

  // Tính điểm trung bình từng trait và chuyển sang phần trăm
  const finalScores = Object.entries(groupedScores).reduce(
    (acc, [trait, scores]) => {
      const arr = scores as number[];
      const avgScore = arr.reduce((a, b) => a + b, 0) / arr.length;
      acc[trait as TraitKey] = Math.round(((avgScore - 1) / 4) * 100);
      return acc;
    },
    {} as Record<TraitKey, number>
  );

  const finalScoresArray: PersonalityTraitData[] = Object.entries(
    finalScores
  ).map(([trait, value]) => ({
    trait: trait as TraitKey,
    value,
  }));

  const handleSave = async () => {
    try {
      setSaving(true);
      await createPersonalityTest(finalScores);
      alert("Kết quả đã được lưu!");
    } catch (error) {
      alert("Lưu kết quả thất bại, vui lòng thử lại.");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };
  // Lấy câu hỏi hiện tại và câu trả lời được chọn
  const question = questions[currentIndex];
  const selectedAnswer = answers[question.id];

  if (showResult) {
    // Hiển thị kết quả
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="absolute top-4 left-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/feed">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Feed
            </Link>
          </Button>
        </div>
        <h1 className="text-4xl font-extrabold text-center mb-2 mt-2 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Kết quả bài kiểm tra
        </h1>
        <Card className="mb-6 p-5 rounded-lg">
          <CardContent className="rounded-lg flex justify-center">
            <div className="w-full max-w-md flex justify-center">
              <PersonalityRadarChart data={finalScoresArray} />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {finalScoresArray.map(({ trait, value }) => (
            <Card
              key={trait}
              onClick={() => setSelectedTrait(trait)}
              className={`cursor-pointer rounded-lg p-4 shadow-sm ${
                selectedTrait === trait ? "border-2 border-blue-500" : ""
              }`}
            >
              <CardContent>
                <h3 className="capitalize font-semibold text-center mb-2">
                  {trait}
                </h3>
                <div className="relative">
                  <Progress
                    value={value}
                    max={100}
                    className="rounded-full"
                    style={{ height: "24px" }}
                  />
                  <div
                    className="absolute inset-0 flex items-center justify-center font-semibold text-white select-none pointer-events-none"
                    style={{ userSelect: "none" }}
                  >
                    {value}%
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedTrait && (
          <Card className="mb-10 rounded-lg py-6 px-4 text-center">
            <CardContent className="flex flex-col items-center justify-center space-y-4">
              <h3 className="text-3xl font-extrabold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent capitalize">
                {selectedTrait}
              </h3>

              <p className="max-w-xl text-lg font-medium leading-relaxed text-gray-800">
                {getDetailText(selectedTrait, finalScores[selectedTrait])}
              </p>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-4 justify-center mt-6">
          {["Làm lại", saving ? "Đang lưu..." : "Lưu kết quả"].map(
            (label, idx) => (
              <button
                key={label}
                onClick={() => {
                  if (idx === 0) {
                    setShowResult(false);
                    setCurrentIndex(0);
                    setAnswers({});
                    setSelectedTrait(null);
                  } else {
                    handleSave();
                  }
                }}
                disabled={idx === 1 && saving}
                className={`w-40 px-4 py-2 rounded-full font-semibold text-white transition-all duration-300
        ${
          idx === 0
            ? "bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 hover:from-pink-500 hover:to-red-500"
            : "bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 hover:from-blue-500 hover:to-indigo-600"
        }
        ${
          idx === 1 && saving
            ? "opacity-50 cursor-not-allowed"
            : "hover:shadow-lg"
        }
      `}
              >
                {label}
              </button>
            )
          )}
        </div>
      </div>
    );
  }

  // Hiển thị phần câu hỏi khi chưa xem kết quả
  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="absolute top-4 left-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/feed">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Feed
          </Link>
        </Button>
      </div>
      <h1 className="text-4xl font-extrabold text-center p-3 mb-2 mt-3 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
        BÀI KIỂM TRA TÍNH CÁCH BIG FIVE
      </h1>
      <p className="text-center text-gray-500 mb-6">
        Thấu hiểu bản thân, làm chủ mọi mối quan hệ
      </p>

      <Card className="rounded-lg">
        <CardContent className="rounded-lg p-6">
          <p className="mb-4 font-semibold text-center text-lg">
            {question.text}
          </p>

          <div className="flex flex-col space-y-2 mb-6">
            {answerLabels.map((label: string, index: number) => (
              <label
                key={index}
                className={`cursor-pointer p-2 border rounded-md transition-colors duration-200
        ${
          selectedAnswer === index + 1
            ? "bg-blue-200 border-blue-400"
            : "border-gray-300 hover:bg-gray-100 hover:border-gray-400"
        }`}
              >
                <input
                  type="radio"
                  name={`answer-${question.id}`}
                  value={index + 1}
                  checked={selectedAnswer === index + 1}
                  onChange={() => handleAnswer(index + 1)}
                  className="mr-2"
                />
                {label}
              </label>
            ))}
          </div>

          <div className="mb-4 relative">
            <Progress
              value={((currentIndex + 1) / questions.length) * 100}
              className="rounded-full"
              style={{ height: "24px" }}
            />
            <div
              className="absolute inset-0 flex items-center justify-center text-white font-semibold select-none pointer-events-none"
              style={{ userSelect: "none" }}
            >
              {`${Math.round(((currentIndex + 1) / questions.length) * 100)}%`}
            </div>
          </div>

          <div className="flex justify-between">
            <Button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              variant="outline"
            >
              Trước
            </Button>
            <Button onClick={handleNext} disabled={!selectedAnswer}>
              {currentIndex === questions.length - 1 ? "Xem kết quả" : "Tiếp"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
export const getDetailText = (trait: TraitKey, score: number) => {
  if (score >= 66) return traitComments[trait].high;
  if (score >= 33) return traitComments[trait].medium;
  return traitComments[trait].low;
};
