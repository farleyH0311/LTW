"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Undo2, Redo2, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";

interface AvatarCreatorProps {
  onAvatarCreated: (imageUrl: string) => void;
}

// Mock avatar parts
const faceParts = {
  faceShapes: Array.from(
    { length: 5 },
    (_, i) => `/placeholder.svg?height=100&width=100&text=Face+${i + 1}`
  ),
  eyes: Array.from(
    { length: 8 },
    (_, i) => `/placeholder.svg?height=50&width=100&text=Eyes+${i + 1}`
  ),
  noses: Array.from(
    { length: 6 },
    (_, i) => `/placeholder.svg?height=50&width=50&text=Nose+${i + 1}`
  ),
  mouths: Array.from(
    { length: 7 },
    (_, i) => `/placeholder.svg?height=30&width=80&text=Mouth+${i + 1}`
  ),
  hairstyles: Array.from(
    { length: 10 },
    (_, i) => `/placeholder.svg?height=120&width=120&text=Hair+${i + 1}`
  ),
  accessories: Array.from(
    { length: 8 },
    (_, i) => `/placeholder.svg?height=60&width=120&text=Accessory+${i + 1}`
  ),
};

const skinTones = [
  "#FFDBAC",
  "#F1C27D",
  "#E0AC69",
  "#C68642",
  "#8D5524",
  "#5C3836",
];

const hairColors = [
  "#090806",
  "#2C222B",
  "#71635A",
  "#B7A69E",
  "#D6C4C2",
  "#CABFB1",
  "#DCD0BA",
  "#FFF5E1",
  "#E6CEA8",
  "#E5C8A8",
  "#DEBC99",
  "#B89778",
  "#A56B46",
  "#B55239",
  "#8D4A43",
  "#91553D",
];

export function AvatarCreator({ onAvatarCreated }: AvatarCreatorProps) {
  const [activeTab, setActiveTab] = useState("face");
  const [selectedParts, setSelectedParts] = useState({
    faceShape: faceParts.faceShapes[0],
    eyes: faceParts.eyes[0],
    nose: faceParts.noses[0],
    mouth: faceParts.mouths[0],
    hairstyle: faceParts.hairstyles[0],
    accessory: null as string | null,
  });
  const [skinTone, setSkinTone] = useState(skinTones[0]);
  const [hairColor, setHairColor] = useState(hairColors[0]);
  const [history, setHistory] = useState<any[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Add current state to history when parts change
  useEffect(() => {
    if (
      JSON.stringify(selectedParts) !== JSON.stringify(history[historyIndex])
    ) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push({ ...selectedParts });
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  }, [selectedParts]);

  const selectPart = (category: string, item: string) => {
    setSelectedParts((prev) => ({
      ...prev,
      [category]: item,
    }));
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setSelectedParts(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setSelectedParts(history[historyIndex + 1]);
    }
  };

  const handleSaveAvatar = () => {
    // In a real implementation, this would combine the parts into a single image
    // For now, we'll just use a placeholder
    const avatarUrl =
      "/placeholder.svg?height=400&width=400&text=Custom+Avatar";
    onAvatarCreated(avatarUrl);
  };

  const handleRandomize = () => {
    setSelectedParts({
      faceShape:
        faceParts.faceShapes[
          Math.floor(Math.random() * faceParts.faceShapes.length)
        ],
      eyes: faceParts.eyes[Math.floor(Math.random() * faceParts.eyes.length)],
      nose: faceParts.noses[Math.floor(Math.random() * faceParts.noses.length)],
      mouth:
        faceParts.mouths[Math.floor(Math.random() * faceParts.mouths.length)],
      hairstyle:
        faceParts.hairstyles[
          Math.floor(Math.random() * faceParts.hairstyles.length)
        ],
      accessory:
        Math.random() > 0.5
          ? faceParts.accessories[
              Math.floor(Math.random() * faceParts.accessories.length)
            ]
          : null,
    });
    setSkinTone(skinTones[Math.floor(Math.random() * skinTones.length)]);
    setHairColor(hairColors[Math.floor(Math.random() * hairColors.length)]);
  };

  return (
    <div className="grid gap-6 md:grid-cols-[1fr_300px]">
      {/* Avatar Preview */}
      <div className="flex flex-col items-center justify-center">
        <div className="relative h-64 w-64 overflow-hidden rounded-full bg-muted">
          {/* This would be a layered composition of the selected parts in a real implementation */}
          {/* For now, we'll just show a placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src="/placeholder.svg?height=256&width=256&text=Avatar+Preview"
              alt="Avatar preview"
              width={256}
              height={256}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleUndo}
            disabled={historyIndex <= 0}
          >
            <Undo2 className="mr-1 h-4 w-4" />
            Undo
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
          >
            <Redo2 className="mr-1 h-4 w-4" />
            Redo
          </Button>
          <Button variant="outline" size="sm" onClick={handleRandomize}>
            Randomize
          </Button>
          <Button size="sm" onClick={handleSaveAvatar}>
            <Save className="mr-1 h-4 w-4" />
            Save
          </Button>
        </div>
      </div>

      {/* Customization Controls */}
      <div>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="face">Face</TabsTrigger>
            <TabsTrigger value="hair">Hair</TabsTrigger>
            <TabsTrigger value="extras">Extras</TabsTrigger>
          </TabsList>

          <TabsContent value="face" className="mt-4 space-y-4">
            <div>
              <Label>Skin Tone</Label>
              <div className="mt-2 flex gap-2">
                {skinTones.map((tone, index) => (
                  <button
                    key={index}
                    className={`h-8 w-8 rounded-full ${
                      skinTone === tone
                        ? "ring-2 ring-primary ring-offset-2"
                        : ""
                    }`}
                    style={{ backgroundColor: tone }}
                    onClick={() => setSkinTone(tone)}
                  />
                ))}
              </div>
            </div>

            <div>
              <Label>Face Shape</Label>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {faceParts.faceShapes.map((face, index) => (
                  <button
                    key={index}
                    className={`overflow-hidden rounded-lg border-2 ${
                      selectedParts.faceShape === face
                        ? "border-primary"
                        : "border-muted"
                    }`}
                    onClick={() => selectPart("faceShape", face)}
                  >
                    <Image
                      src={face || "/placeholder.svg"}
                      alt={`Face ${index + 1}`}
                      width={60}
                      height={60}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label>Eyes</Label>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {faceParts.eyes.map((eye, index) => (
                  <button
                    key={index}
                    className={`overflow-hidden rounded-lg border-2 ${
                      selectedParts.eyes === eye
                        ? "border-primary"
                        : "border-muted"
                    }`}
                    onClick={() => selectPart("eyes", eye)}
                  >
                    <Image
                      src={eye || "/placeholder.svg"}
                      alt={`Eyes ${index + 1}`}
                      width={60}
                      height={30}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label>Nose</Label>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {faceParts.noses.map((nose, index) => (
                  <button
                    key={index}
                    className={`overflow-hidden rounded-lg border-2 ${
                      selectedParts.nose === nose
                        ? "border-primary"
                        : "border-muted"
                    }`}
                    onClick={() => selectPart("nose", nose)}
                  >
                    <Image
                      src={nose || "/placeholder.svg"}
                      alt={`Nose ${index + 1}`}
                      width={40}
                      height={40}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label>Mouth</Label>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {faceParts.mouths.map((mouth, index) => (
                  <button
                    key={index}
                    className={`overflow-hidden rounded-lg border-2 ${
                      selectedParts.mouth === mouth
                        ? "border-primary"
                        : "border-muted"
                    }`}
                    onClick={() => selectPart("mouth", mouth)}
                  >
                    <Image
                      src={mouth || "/placeholder.svg"}
                      alt={`Mouth ${index + 1}`}
                      width={60}
                      height={20}
                    />
                  </button>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="hair" className="mt-4 space-y-4">
            <div>
              <Label>Hair Color</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {hairColors.map((color, index) => (
                  <button
                    key={index}
                    className={`h-8 w-8 rounded-full ${
                      hairColor === color
                        ? "ring-2 ring-primary ring-offset-2"
                        : ""
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setHairColor(color)}
                  />
                ))}
              </div>
            </div>

            <div>
              <Label>Hairstyle</Label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {faceParts.hairstyles.map((hair, index) => (
                  <button
                    key={index}
                    className={`overflow-hidden rounded-lg border-2 ${
                      selectedParts.hairstyle === hair
                        ? "border-primary"
                        : "border-muted"
                    }`}
                    onClick={() => selectPart("hairstyle", hair)}
                  >
                    <Image
                      src={hair || "/placeholder.svg"}
                      alt={`Hairstyle ${index + 1}`}
                      width={80}
                      height={80}
                    />
                  </button>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="extras" className="mt-4 space-y-4">
            <div>
              <Label>Accessories</Label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <button
                  className={`overflow-hidden rounded-lg border-2 ${
                    selectedParts.accessory === null
                      ? "border-primary"
                      : "border-muted"
                  }`}
                  onClick={() => selectPart("accessory", null)}
                >
                  <div className="flex h-[60px] items-center justify-center">
                    None
                  </div>
                </button>
                {faceParts.accessories.map((accessory, index) => (
                  <button
                    key={index}
                    className={`overflow-hidden rounded-lg border-2 ${
                      selectedParts.accessory === accessory
                        ? "border-primary"
                        : "border-muted"
                    }`}
                    onClick={() => selectPart("accessory", accessory)}
                  >
                    <Image
                      src={accessory || "/placeholder.svg"}
                      alt={`Accessory ${index + 1}`}
                      width={80}
                      height={40}
                    />
                  </button>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
