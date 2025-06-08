"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, MapPin, Sparkles, Utensils, Film, Coffee, Music, Wine } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Confetti } from "@/components/ui-effects/confetti"
import { useLanguage } from "@/components/language-provider"
import { createDatingPlan } from "../app/axios";
import Cookies from "js-cookie";
import { Toast } from "./ui/toast";

interface VirtualDatePlannerProps {
  matchName: string
  matchId: string
  onDatePlanned?: (dateDetails: any) => void
  initialTitle?: string
}

export function VirtualDatePlanner({ matchName, matchId, onDatePlanned, initialTitle }: VirtualDatePlannerProps) {
  const [activeTab, setActiveTab] = useState("type")
  const [dateType, setDateType] = useState<string>(initialTitle ?? "")
  const [dateTime, setDateTime] = useState<string>("")
  const [dateLocation, setDateLocation] = useState<string>("")
  const [dateMessage, setDateMessage] = useState<string>("")
  const [showConfetti, setShowConfetti] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
  if (initialTitle) {
    setActiveTab("details");
  }
}, [initialTitle]);

  const handleNext = () => {
    const tabs = ["type", "details", "message", "confirm"]
    const currentIndex = tabs.indexOf(activeTab)
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1])
    }
  }

  const handleBack = () => {
    const tabs = ["type", "details", "message", "confirm"]
    const currentIndex = tabs.indexOf(activeTab)
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1])
    }
  }

  const handleSubmit = () => {
    const selectedTime = new Date(dateTime);
    if (selectedTime < new Date()) {
      alert("⛔ Bạn không thể chọn thời gian trong quá khứ!");
      return;
    }
    setShowConfetti(true)
    const dateDetails = {
      title: dateType,
      time: dateTime,
      location: dateLocation,
      status: "pending",
      receiverId: Number(matchId),
    };
    onDatePlanned?.(dateDetails);
    setShowConfetti(true);
  };

  const dateTypes = [
    { id: "coffee", label: t("dateTypes.coffee"), icon: Coffee },
    { id: "dinner", label: t("dateTypes.dinner"), icon: Utensils },
    { id: "movie", label: t("dateTypes.movie"), icon: Film },
    { id: "drinks", label: t("dateTypes.drinks"), icon: Wine },
    { id: "concert", label: t("dateTypes.concert"), icon: Music },
  ]

  return (
    <Card className="w-full max-w-md mx-auto">
      <Confetti trigger={showConfetti} />

<CardHeader>
  <CardTitle className="text-2xl">{t("datePlanner.title")}</CardTitle>
  <CardDescription>
    {initialTitle
      ? `${initialTitle} với ${matchName}`
      : t("datePlanner.description", { name: matchName })}
  </CardDescription>
</CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className={`grid w-full ${initialTitle ? "grid-cols-3" : "grid-cols-4"}`}>
          {!initialTitle && (
            <TabsTrigger value="type">{t("datePlanner.type")}</TabsTrigger>
          )}
          <TabsTrigger value="details">{t("datePlanner.details")}</TabsTrigger>
          <TabsTrigger value="message">{t("datePlanner.message")}</TabsTrigger>
          <TabsTrigger value="confirm">{t("datePlanner.confirm")}</TabsTrigger>
        </TabsList>
          <TabsContent value="type" className="space-y-4 pt-4">
            <div className="space-y-4">
              <h3 className="font-medium text-lg">{t("datePlanner.selectType")}</h3>

<RadioGroup value={dateType} onValueChange={setDateType}>
  {dateTypes.map((type) => {
    const isSelected = dateType === type.id;

    return (
      <div
        key={type.id}
        className={`flex items-center space-x-2 border rounded-lg p-3 cursor-pointer transition 
          ${isSelected ? "bg-primary text-white" : "hover:bg-muted"}`}
      >
        <RadioGroupItem value={type.id} id={type.id} className="sr-only" />
        <Label
          htmlFor={type.id}
          className={`flex items-center gap-3 cursor-pointer flex-1 ${
            isSelected ? "text-white" : ""
          }`}
        >
          <div
            className={`rounded-full p-2 ${
              isSelected ? "bg-white/20" : "bg-primary/10"
            }`}
          >
            <type.icon
              className={`h-5 w-5 ${
                isSelected ? "text-white" : "text-primary"
              }`}
            />
          </div>
          <span>{type.label}</span>
        </Label>
      </div>
    );
  })}
</RadioGroup>

            </div>

            <div className="flex justify-end">
              <Button onClick={handleNext} disabled={!dateType}>
                {t("datePlanner.next")}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="date-time">
                  <Calendar className="h-4 w-4 inline mr-2" />
                  {t("datePlanner.whenField")}
                </Label>
                <Input
                  id="date-time"
                  type="datetime-local"
                  value={dateTime}
                  onChange={(e) => setDateTime(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="location">
                  <MapPin className="h-4 w-4 inline mr-2" />
                  {t("datePlanner.whereField")}
                </Label>
                <Input
                  id="location"
                  placeholder={t("datePlanner.locationPlaceholder")}
                  value={dateLocation}
                  onChange={(e) => setDateLocation(e.target.value)}
                   min={new Date().toISOString().slice(0, 16)} 
                />
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                {t("datePlanner.back")}
              </Button>
              <Button onClick={handleNext} disabled={!dateTime || !dateLocation}>
                {t("datePlanner.next")}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="message" className="space-y-4 pt-4">
            <div className="space-y-4">
              <Label htmlFor="message">{t("datePlanner.messageField")}</Label>
              <Textarea
                id="message"
                placeholder={t("datePlanner.messagePlaceholder")}
                className="min-h-[120px]"
                value={dateMessage}
                onChange={(e) => setDateMessage(e.target.value)}
              />
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                {t("datePlanner.back")}
              </Button>
              <Button onClick={handleNext} disabled={!dateMessage}>
                {t("datePlanner.next")}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="confirm" className="space-y-4 pt-4">
            <div className="space-y-4 border rounded-lg p-4">
              <h3 className="font-medium text-lg">{t("datePlanner.summary")}</h3>

              <div className="space-y-2">
                <div className="flex items-start">
                  <Sparkles className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <div>
                    <p className="font-medium">{t("datePlanner.dateWith", { name: matchName })}</p>
                    <p className="text-muted-foreground">{dateTypes.find((t) => t.id === dateType)?.label}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <div>
                    <p className="font-medium">{t("datePlanner.when")}</p>
                    <p className="text-muted-foreground">{new Date(dateTime).toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <div>
                    <p className="font-medium">{t("datePlanner.where")}</p>
                    <p className="text-muted-foreground">{dateLocation}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="h-5 w-5 mr-2" />
                  <div>
                    <p className="font-medium">{t("datePlanner.message")}</p>
                    <p className="text-muted-foreground">{dateMessage}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                {t("datePlanner.back")}
              </Button>
              <Button onClick={handleSubmit}>{t("datePlanner.send")}</Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

