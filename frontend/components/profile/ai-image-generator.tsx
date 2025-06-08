"use client"

import { useState } from "react"
import Image from "next/image"
import { Wand2, Download, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface AiImageGeneratorProps {
  onImageGenerated: (imageUrl: string) => void
}

export function AiImageGenerator({ onImageGenerated }: AiImageGeneratorProps) {
  const [prompt, setPrompt] = useState("")
  const [style, setStyle] = useState("realistic")
  const [creativity, setCreativity] = useState(70)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<string[]>([])
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  const handleGenerate = () => {
    if (!prompt.trim()) return

    setIsGenerating(true)

    // Simulate AI generation with a delay
    setTimeout(() => {
      const newImages = [
        "/placeholder.svg?height=400&width=400&text=AI+Generated+1",
        "/placeholder.svg?height=400&width=400&text=AI+Generated+2",
        "/placeholder.svg?height=400&width=400&text=AI+Generated+3",
        "/placeholder.svg?height=400&width=400&text=AI+Generated+4",
      ]
      setGeneratedImages(newImages)
      setIsGenerating(false)
    }, 2000)
  }

  const handleSelectImage = (index: number) => {
    setSelectedImage(index)
    onImageGenerated(generatedImages[index])
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="prompt">Describe how you want your profile image to look</Label>
          <Textarea
            id="prompt"
            placeholder="Describe yourself and the style you want (e.g., 'A professional portrait of a person with short brown hair and glasses, smiling, with a blue background')"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="mt-1 min-h-[100px]"
          />
        </div>

        <div>
          <Label>Image Style</Label>
          <RadioGroup value={style} onValueChange={setStyle} className="mt-2">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`relative overflow-hidden rounded-lg border-2 ${style === "realistic" ? "border-primary" : "border-muted"}`}
                >
                  <Image
                    src="/placeholder.svg?height=100&width=100&text=Realistic"
                    alt="Realistic style"
                    width={100}
                    height={100}
                    className="aspect-square object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <RadioGroupItem value="realistic" id="realistic" className="sr-only" />
                    {style === "realistic" && (
                      <div className="rounded-full bg-primary p-1">
                        <Check className="h-4 w-4 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                </div>
                <Label htmlFor="realistic" className="cursor-pointer text-sm">
                  Realistic
                </Label>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div
                  className={`relative overflow-hidden rounded-lg border-2 ${style === "cartoon" ? "border-primary" : "border-muted"}`}
                >
                  <Image
                    src="/placeholder.svg?height=100&width=100&text=Cartoon"
                    alt="Cartoon style"
                    width={100}
                    height={100}
                    className="aspect-square object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <RadioGroupItem value="cartoon" id="cartoon" className="sr-only" />
                    {style === "cartoon" && (
                      <div className="rounded-full bg-primary p-1">
                        <Check className="h-4 w-4 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                </div>
                <Label htmlFor="cartoon" className="cursor-pointer text-sm">
                  Cartoon
                </Label>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div
                  className={`relative overflow-hidden rounded-lg border-2 ${style === "anime" ? "border-primary" : "border-muted"}`}
                >
                  <Image
                    src="/placeholder.svg?height=100&width=100&text=Anime"
                    alt="Anime style"
                    width={100}
                    height={100}
                    className="aspect-square object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <RadioGroupItem value="anime" id="anime" className="sr-only" />
                    {style === "anime" && (
                      <div className="rounded-full bg-primary p-1">
                        <Check className="h-4 w-4 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                </div>
                <Label htmlFor="anime" className="cursor-pointer text-sm">
                  Anime
                </Label>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div
                  className={`relative overflow-hidden rounded-lg border-2 ${style === "artistic" ? "border-primary" : "border-muted"}`}
                >
                  <Image
                    src="/placeholder.svg?height=100&width=100&text=Artistic"
                    alt="Artistic style"
                    width={100}
                    height={100}
                    className="aspect-square object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <RadioGroupItem value="artistic" id="artistic" className="sr-only" />
                    {style === "artistic" && (
                      <div className="rounded-full bg-primary p-1">
                        <Check className="h-4 w-4 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                </div>
                <Label htmlFor="artistic" className="cursor-pointer text-sm">
                  Artistic
                </Label>
              </div>
            </div>
          </RadioGroup>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="creativity">Creativity Level</Label>
            <span className="text-sm text-muted-foreground">{creativity}%</span>
          </div>
          <Slider
            id="creativity"
            min={0}
            max={100}
            step={10}
            value={[creativity]}
            onValueChange={(value) => setCreativity(value[0])}
            className="mt-2"
          />
          <div className="mt-1 flex justify-between text-xs text-muted-foreground">
            <span>Conservative</span>
            <span>Balanced</span>
            <span>Creative</span>
          </div>
        </div>

        <Button onClick={handleGenerate} disabled={!prompt.trim() || isGenerating} className="w-full">
          {isGenerating ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              <span>Generating...</span>
            </div>
          ) : (
            <>
              <Wand2 className="mr-2 h-4 w-4" />
              Generate Images
            </>
          )}
        </Button>
      </div>

      {generatedImages.length > 0 && (
        <div>
          <Label className="mb-2 block">Select your favorite image</Label>
          <div className="grid grid-cols-2 gap-4">
            {generatedImages.map((img, index) => (
              <div
                key={index}
                className={`relative cursor-pointer overflow-hidden rounded-lg border-2 transition-all ${
                  selectedImage === index
                    ? "border-primary ring-2 ring-primary/50"
                    : "border-muted hover:border-primary/50"
                }`}
                onClick={() => handleSelectImage(index)}
              >
                <Image
                  src={img || "/placeholder.svg"}
                  alt={`Generated image ${index + 1}`}
                  width={200}
                  height={200}
                  className="aspect-square object-cover"
                />
                {selectedImage === index && (
                  <div className="absolute bottom-2 right-2 rounded-full bg-primary p-1">
                    <Check className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {selectedImage !== null && (
            <div className="mt-4 flex justify-center">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download Image
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

