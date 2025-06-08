"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Sparkles, Calendar, MapPin, Clock, Heart, MessageCircle } from "lucide-react"
import { motion } from "framer-motion"
import Cookies from "js-cookie";
import { useEffect } from "react";
import { Select, SelectItem, SelectTrigger, SelectContent, SelectValue } from "@/components/ui/select"
import { interestMap, generateSuggestedDatesByInterests } from "@/app/utils/suggestions";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLanguage } from "@/components/language-provider"
import { AnimatedGradientBorder } from "@/components/ui-effects/animated-gradient-border"
import { VirtualDatePlanner } from "@/components/virtual-date-planner"
import { 
  getMyMatches, 
  createDatingPlan,
  updateDateStatus,
  getMyDatingPlans,
  getProfileByUserId,
  updateDateRating,
  getMyMatchesWithInterests,
} from "@/app/axios"

export default function DatingPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState("upcoming")
  const [showDatePlanner, setShowDatePlanner] = useState(false)
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null)
  const [selectedMatchName, setSelectedMatchName] = useState<string | null>(null)
  const [matched, setMatched] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserName, setSelectedUserName] = useState<string | null>(null);

const [upcomingDates, setUpcomingDates] = useState<any[]>([]);
const [title, setTitle] = useState("");
const [time, setTime] = useState("");
const [location, setLocation] = useState("");
const [pastDates, setPastDates] = useState<any[]>([]);
const [suggestedDates, setSuggestedDates] = useState<any[]>([]); 

const fetchPlannedDates = async () => {
  const userId = Cookies.get("userId");
  if (!userId) return;

  try {
    const data = await getMyDatingPlans(Number(userId)); 
    
    const now = new Date();
    const upcoming: any[] = [];
    const past: any[] = [];

    data.forEach((d: any) => {
    const isSender = d.sender.id === +userId;
    const isReceiver = d.receiver.id === +userId;
    const other = isSender ? d.receiver : d.sender;

      const time = new Date(d.time);

      const formatted = {
        id: d.id,
        match: {
          id: other.id,
          name: other.profile?.name ?? "Không rõ",
          avatar: other.profile?.avt,
        },
        type: d.title,
        location: d.location,
        date: time.toLocaleDateString(),
        time: time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        status: d.status,
        rawTime: time,
        isSender,
        isReceiver,
        rating: isSender ? d.senderRating : d.receiverRating,
      };

      if (time > now) {
        upcoming.push(formatted);
      } else {
        past.push(formatted);
      }
    });

    upcoming.sort((a, b) => a.rawTime - b.rawTime);
    past.sort((a, b) => b.rawTime - a.rawTime);

    setUpcomingDates(upcoming);
    setPastDates(past);
  } catch (err:any) {
     console.error("❌ Lỗi khi lấy lịch hẹn:", err.response?.data || err.message);
  }
};

useEffect(() => {
  fetchPlannedDates();
}, []);

const [matchedUserIds, setMatchedUserIds] = useState<number[]>([]);

useEffect(() => {
  const fetchMatches = async () => {
    const userId = Cookies.get("userId");
    if (!userId) return;
    try {
      const data = await getMyMatchesWithInterests(+userId);
      const matchedIds = data.map((item: any) => item.profile.userId);
      setMatchedUserIds(matchedIds);
      setMatched(data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách match:", error);
    }
  };

  fetchMatches();
}, []);

useEffect(() => {
  const fetchSuggestions = async () => {
    const userId = Cookies.get("userId");
  if (!userId) return;

  try {
    const profile = await getProfileByUserId(userId);
let interests: string[] = [];

if (Array.isArray(profile?.interest)) {
  interests = profile.interest;
} else {
  console.warn("⚠️ interests không phải mảng:", profile?.interest);
}

const suggestions = generateSuggestedDatesByInterests(interests, 4);

    setSuggestedDates(suggestions);
  } catch (err:any) {
    console.error("❌ Lỗi khi tạo suggested dates:", err.message);
  }
  };

  fetchSuggestions();
}, []);

const handleSelectMatch = (userId: string, name: string) => {
  setSelectedUserId(userId);
  setSelectedUserName(name);
  setShowDatePlanner(true);
};

  const handlePlanDate = (id: string, name: string) => {
  if (!matchedUserIds.includes(Number(id))) {
    return;
  }
  setSelectedMatchId(id);
  setSelectedMatchName(name);
  setShowDatePlanner(true);
};

const handleDatePlanned = async (newDate: any) => {
  const senderId = Cookies.get("userId");

  if (!senderId || !selectedUserId) {
    console.error("❌ Thiếu senderId hoặc receiverId");
    return;
  }

  if (!newDate?.title || !newDate?.time || !newDate?.location) {
    console.error("❌ Thiếu thông tin lịch hẹn");
    return;
  }

  const payload = {
    title: newDate.title.trim(),
    time: new Date(newDate.time).toISOString(), 
    location: newDate.location.trim(),
    status: "pending",
    senderId: Number(senderId),
    receiverId: Number(selectedUserId),
  };

  console.log("📦 Gửi dữ liệu tạo lịch hẹn:", payload);

  try {
    await createDatingPlan(payload); 
    console.log("Đã lưu lịch hẹn thành công");

    await fetchPlannedDates(); 
    setShowDatePlanner(false);
    setSelectedUserId(null);
    setSelectedUserName(null);
  } catch (error: any) {
    console.error("❌ Lỗi khi tạo kế hoạch hẹn:", error.response?.data || error.message);
  }
};

const handleUpdateDateStatus = async (dateId: number, status: "confirmed" | "rejected") => {
  const userId = Cookies.get("userId");
  if (!userId) return;

  try {
    await updateDateStatus(dateId, status, Number(userId));
    await fetchPlannedDates();
  } catch (err: any) {
    console.error("❌ Lỗi khi cập nhật trạng thái:", err.response?.data || err.message);
  }
};

const handleRateDate = async (dateId: number, rating: number) => {
  const userId = Cookies.get("userId");
  if (!userId) return;

  try {
    await updateDateRating(dateId, Number(userId), rating);
    setPastDates((prev) =>
      prev.map((date) =>
        date.id === dateId ? { ...date, rating } : date
      )
    );
  } catch (error) {
    console.error("Lỗi khi đánh giá cuộc hẹn:", error);
  }
};

const filteredSuggestions = suggestedDates.filter((date) => {
  const interestKey = Object.entries(interestMap).find(
    ([key, activities]) =>
      activities.find((a) => a.title === date.title)
  )?.[0];

  console.log("🔍 date:", date.title, "| interestKey:", interestKey);

  if (!interestKey) return false;

  const matchingUsers = matched.filter((m) => {
    console.log("👤", m.profile.name, ":", m.profile.interests);
    return m.profile.interests?.some(
      (i: string) => i.toLowerCase() === interestKey.toLowerCase()
    );
  });

  console.log("✅ Matching users:", matchingUsers.map((u) => u.profile.name));

  return matchingUsers.length > 0;
});


  return (
    <div className="container px-4 sm:px-6 py-4 sm:py-8">
      
      {showDatePlanner ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
        <VirtualDatePlanner
          matchName={selectedUserName ?? ""}
          matchId={selectedUserId ?? ""}
          onDatePlanned={handleDatePlanned}
          initialTitle={title}
        />
        </motion.div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold">{t("dating.title")}</h1>
              {matched.length > 0 ? (
                <div className="flex flex-col gap-2">
                  <Select
                    onValueChange={(val) => {
                      const match = matched.find((m) => m.profile.userId.toString() === val);
                      if (match) {
                        setSelectedUserId(val);
                        const name = match.profile.name ?? "Không rõ";
                        setSelectedUserName(name);
                        setShowDatePlanner(true);
                      }
                    }}
                  >
      <SelectTrigger className="w-[120px] bg-violet-600 text-white text-sm hover:bg-violet-700 border-none rounded-md">
        <SelectValue placeholder="Plan a date" />
      </SelectTrigger>
      <SelectContent className="max-h-60 overflow-y-auto">
        {matched.map((m) => {
          const name = m.profile.name ?? "Không rõ";
          return (
            <div
              key={m.profile.userId}
              className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-accent rounded-md"
              onClick={() => {
                setSelectedUserId(m.profile.userId.toString());
                setSelectedUserName(name);
                setShowDatePlanner(true);
              }}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={m.profile.avt || "/placeholder.svg"} alt={name} />
                <AvatarFallback>{name[0]}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-white font-medium">{name}</span>
            </div>
          );
        })}
      </SelectContent>
    </Select>
        {selectedUserName && (
          <p className="gap-1 text-sm bg-violet-600 hover:bg-violet-700 text-white flex-1 sm:flex-none">
            Plan a date with:{" "}
            <span className="text-accent">{selectedUserName}</span>
          </p>
        )}
      </div>
    ) : (
      <p className="text-muted-foreground text-sm text-center">
        You don't have anybody to date.
      </p>
    )}
        </div>
          <Tabs defaultValue="upcoming" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="upcoming" className="text-xs sm:text-sm">{t("dating.upcoming")}</TabsTrigger>
              <TabsTrigger value="past" className="text-xs sm:text-sm">{t("dating.past")}</TabsTrigger>
              <TabsTrigger value="suggested" className="text-xs sm:text-sm">{t("dating.suggested")}</TabsTrigger>
            </TabsList>
            <TabsContent value="upcoming">
              {upcomingDates.length > 0 ? (
                <div className="space-y-4">
                  {upcomingDates.map((date) => (
                    <motion.div
                      key={date.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <AnimatedGradientBorder>
                        <Card>
                          <CardContent className="p-3 sm:p-6">
                            <div className="flex flex-col sm:flex-row gap-4">
                              <Avatar className="h-12 w-12 shrink-0 self-start">
                                <AvatarImage src={date.match.avatar} alt={date.match.name} />
                                <AvatarFallback>{date.match.name[0]}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0">
                                  <div>
                                    <h3 className="font-semibold text-sm sm:text-base truncate">
                                      {date.type} with {date.match.name}
                                    </h3>
                                    <div className="flex flex-wrap gap-2 sm:gap-4 mt-1 text-xs sm:text-sm text-muted-foreground">
                                      <div className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                                        <span>{date.date}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                                        <span>{date.time}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                                        <span className="truncate">{date.location}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <Badge 
                                    variant={date.status === "confirmed" ? "default" : "outline"}
                                    className="self-start text-xs mt-1 sm:mt-0"
                                  >
                                    {date.status === "confirmed" ? t("dating.confirmed") : t("dating.pending")}
                                  </Badge>
                                    {date.status === "pending" && date.isReceiver && (
                                      <div className="flex gap-2 mt-3">
                                        <Button
                                          variant="default"
                                          size="sm"
                                          onClick={() => handleUpdateDateStatus(date.id, "confirmed")}
                                        >
                                          Accept
                                        </Button>
                                        <Button
                                          variant="destructive"
                                          size="sm"
                                          onClick={() => handleUpdateDateStatus(date.id, "rejected")}
                                        >
                                          Reject
                                        </Button>
                                      </div>
                                    )}

                                    {date.status === "confirmed" && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="mt-2"
                                        onClick={() => handleUpdateDateStatus(date.id, "rejected")}
                                      >
                                        Cancel
                                      </Button>
                                    )}
                                </div>
                                <div className="flex gap-2 mt-4 flex-wrap sm:flex-nowrap">
                                  <Button variant="outline" size="sm" className="gap-1 text-sm bg-violet-600 hover:bg-violet-700 text-white flex-1 sm:flex-none" asChild>
                                    <Link href={`/chat/${date.match.id}`}>
                                      <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                                      {t("dating.message")}
                                    </Link>
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-1 text-sm bg-violet-600 hover:bg-violet-700 text-white flex-1 sm:flex-none"
                                    onClick={() => handlePlanDate(date.match.id.toString(), date.match.name)}
                                  >
                                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                                    {t("dating.reschedule")}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </AnimatedGradientBorder>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 sm:py-12">
                  <Calendar className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-base sm:text-lg font-medium mb-2">{t("dating.noUpcoming")}</h3>
                  <p className="text-sm text-muted-foreground mb-6">{t("dating.noUpcomingDesc")}</p>
                  <Button onClick={() => handlePlanDate("new", "New Match")}>{t("dating.planNewDate")}</Button>
                </div>
              )}
            </TabsContent>
            <TabsContent value="past">
              {pastDates.length > 0 ? (
                <div className="space-y-4">
                  {pastDates.map((date) => (
                    <motion.div
                      key={date.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Card>
                        <CardContent className="p-3 sm:p-6">
                          <div className="flex flex-col sm:flex-row gap-4">
                            <Avatar className="h-12 w-12 shrink-0 self-start">
                              <AvatarImage src={date.match.avatar} alt={date.match.name} />
                              <AvatarFallback>{date.match.name[0]}</AvatarFallback>
                            </Avatar>

                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0">
                                <div>
                                  <h3 className="font-semibold text-sm sm:text-base truncate">
                                    {date.type} with {date.match.name}
                                  </h3>
                                  <div className="flex flex-wrap gap-2 sm:gap-4 mt-1 text-xs sm:text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                                      <span>{date.date}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                                      <span>{date.time}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                                      <span className="truncate">{date.location}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex self-start mt-1 sm:mt-0 gap-[2px]">
                                  {Array.from({ length: 5 }).map((_, index) => {
                                    const isFilled = index < (date.rating ?? 0);

                                    return (
                                      <button
                                        key={index}
                                        type="button"
                                        onClick={() => handleRateDate(date.id, index + 1)}
                                        className="p-0.5 rounded-full hover:bg-red-100 transition"
                                      >
                                        <Heart
                                          className={`h-4 w-4 sm:h-5 sm:w-5 transition ${
                                            isFilled ? "text-red-500 fill-red-500" : "text-muted-foreground"
                                          }`}
                                        />
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                              <div className="flex gap-2 mt-4 flex-wrap sm:flex-nowrap">
                                <Button variant="outline" size="sm" className="gap-1 text-sm bg-violet-600 hover:bg-violet-700 text-white flex-1 sm:flex-none" asChild>
                                  <Link href={`/chat/${date.match.id}`}>
                                    <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                                    {t("dating.message")}
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 sm:py-12">
                  <Calendar className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-base sm:text-lg font-medium mb-2">{t("dating.noPast")}</h3>
                  <p className="text-sm text-muted-foreground mb-6">{t("dating.noPastDesc")}</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="suggested">
              {filteredSuggestions.length > 0 ? (
                <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredSuggestions.map((date) => (
                    <motion.div
                      key={date.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: date.id * 0.1 }}
                    >
              <Card className="overflow-hidden h-full flex flex-col">
                <div className="relative h-40 sm:h-48">
                  <Image
                    src={date.image}
                    alt={date.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-primary/90 hover:bg-primary text-xs">
                      {date.compatibility}% {t("dating.match")}
                    </Badge>
                  </div>
                </div>

                <CardContent className="py-3 sm:py-4 flex-1 px-3 sm:px-4">
                  <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2">
                    {date.title}
                  </h3>
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    {date.description}
                  </p>
                </CardContent>

                <CardFooter className="pt-0 px-3 sm:px-4 pb-3 sm:pb-4">
                  {(() => {
                    const interestKey = Object.entries(interestMap).find(
                      ([key, activities]) =>
                        activities.find((a) => a.title === date.title)
                    )?.[0];

                    const matchingUsers = matched.filter((m) =>
                      m.profile.interests?.some(
                        (i: string) => i.toLowerCase() === interestKey?.toLowerCase()
                      )
                    );
                return (
                  <Select
                    onValueChange={(val) => {
                      const selected = matchingUsers.find(
                        (m) => m.profile.userId.toString() === val
                      );
                      if (selected) {
                        setSelectedUserId(val);
                        setSelectedUserName(selected.profile.name ?? "Unknown");
                        setTitle(date.title);
                        setShowDatePlanner(true);
                      }
                    }}
                  >
                    <SelectTrigger className="w-full bg-violet-600 text-white text-sm hover:bg-violet-700 border-none rounded-md">
                      <SelectValue placeholder={`Plan this date with...`} />
                    </SelectTrigger>
                    <SelectContent>
                      {matchingUsers.map((m) => (
                        <SelectItem
                          key={m.profile.userId}
                          value={m.profile.userId.toString()}
                        >
                          {m.profile.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                    );
                  })()}
                </CardFooter>
              </Card>
              </motion.div>
            ))}
            </div>
              ) : (
                <p className="text-muted-foreground text-center mt-4">
                  You don't have any matches to suggest a date with.
                </p>
              )}
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
} 