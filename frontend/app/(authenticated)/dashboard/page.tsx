"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Settings, Sparkles, User, Heart, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Cookies from "js-cookie";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLanguage } from "@/components/language-provider";
import { DailyRecommendation } from "@/components/daily-recommendation";
import { VirtualDatePlanner } from "@/components/virtual-date-planner";
import { MoodRing } from "@/components/ui-effects/mood-ring";
import { AnimatedGradientBorder } from "@/components/ui-effects/animated-gradient-border";

import {
  getAllProfiles,
  getProfileByUserId,
  getSuggestedMatches,
  getMyMatches,
  sendLike,
  getUserIdByProfileId,
  getIncomingLikes,
  getSentLikes,
  createDatingPlan,
  sendNotification,
} from "@../../../app/axios";
export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("matches");
  const [showDatePlanner, setShowDatePlanner] = useState(false);
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [selectedMatchName, setSelectedMatchName] = useState<string | null>(
    null
  );
  const { t } = useLanguage();
  const [matchedProfiles, setMatchedProfiles] = useState<MatchProfile[]>([]);
  const [profiles, setProfiles] = useState<MatchProfile[]>([]);
  const [incomingProfiles, setIncomingProfiles] = useState<MatchProfile[]>([]);
  const [completionPercent, setcompletionPercent] = useState(0);
  const [userName, setUserName] = useState("Guest");
  const senderId = Cookies.get("userId");
  const [likedProfiles, setLikedProfiles] = useState<MatchProfile[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const router = useRouter();

  interface MatchProfile {
    userId: number;
    id: number;
    name: string;
    account_name: string;
    age: number;
    gender: string;
    location: string;
    about_me: string;
    occupation: string;
    education: string;
    height: number;
    relationship_goals: string;
    avt: string;
    interests: string[];
    compatibility: number;
    distance?: number;
    is_online: boolean;
    last_online_at: Date;
  }
useEffect(() => {
  const savedCompletion = localStorage.getItem("profileCompletion");
  const comple = savedCompletion ? parseInt(savedCompletion) : 0;
  setcompletionPercent(comple);

  async function fetchData() {
    try {
      const rawUserId = Cookies.get("userId");
      const userId = rawUserId && !isNaN(+rawUserId) ? +rawUserId : null;

      if (!userId) {
        console.error("User ID không hợp lệ hoặc không tồn tại:", rawUserId);
        return;
      }

      const [suggestedData, matchesData, incomingLikes] = await Promise.all([
        getSuggestedMatches(userId),
        getMyMatches(userId),
        getIncomingLikes(userId),
      ]);

      const incoming: MatchProfile[] = incomingLikes
        .filter((item: any) => item.profile)
        .map((item: any) => ({
          ...item.profile,
          compatibility: item.compatibility?.totalScore ?? 0,
        }))
        .sort((a: MatchProfile, b: MatchProfile) => b.compatibility - a.compatibility);

      setIncomingProfiles(incoming);

      setMatchedProfiles(matchesData.map((item: any) => ({
        ...item.profile,
        compatibility: item.compatibility?.totalScore ?? 0,
      })));

      const matched: MatchProfile[] = matchesData
        .map((item: any) => {
          if (!item.profile || !item.profile.id || !item.profile.name) return null;
          return {
            ...item.profile,
            compatibility: item.compatibility?.totalScore ?? 0,
          };
        })
        .filter((item:any) => item !== null) as MatchProfile[];

      const simplifiedProfiles: MatchProfile[] = suggestedData
        .filter((item: any) => item.profile)
        .map((item: any) => ({
          ...item.profile,
          compatibility: item.compatibility?.totalScore ?? 0,
        }));

      const sorted = simplifiedProfiles
        .sort((a, b) => b.compatibility - a.compatibility) 
        .slice(0, 6);
      setProfiles(sorted);

          } catch (error) {
            console.error("Lỗi khi lấy dữ liệu:", error);
          }
        }

        fetchData();
      }, []);


    const handlePlanDate = (id: string, name: string) => {
      setSelectedMatchId(id);
      setSelectedMatchName(name);
      setSelectedUserId(id); 
      setShowDatePlanner(true);
    };

  const handleDatePlanned = async (newDate: any) => {
    const senderId = Cookies.get("userId");
    const receiverId = selectedMatchId;

    if (!senderId || !receiverId || !newDate?.title || !newDate?.time || !newDate?.location) {
      console.error("❌ Thiếu thông tin tạo lịch hẹn");
      return;
    }

    const payload = {
      title: newDate.title.trim(),
      time: new Date(newDate.time).toISOString(),
      location: newDate.location.trim(),
      status: "pending",
      senderId: Number(senderId),
      receiverId: Number(receiverId),
    };

    try {
      await createDatingPlan(payload);
      setShowDatePlanner(false);
      setSelectedMatchId(null);
      setSelectedMatchName(null);
      router.push("/dating");
    } catch (err) {
      console.error("❌ Lỗi khi tạo lịch hẹn:", err);
    }

    await sendNotification({
      userId: receiverId,
      content: `${userName} đã mời bạn đi hẹn hò! 💌`,
      url: `${window.location.origin}/dating`,
      type: "date_invite",
    });
  };


const addToMatchedProfiles = (profile: MatchProfile) => {
  setMatchedProfiles((prev) => {
    if (prev.some((p) => p.id === profile.id)) return prev;
    return [profile, ...prev];
  });
};

const handleLikeBack = async (targetId: number) => {
  if (!senderId) return;

  const res = await sendLike(Number(senderId), targetId);

  if (res.matched) {
    const profile = await getProfileByUserId(targetId); // lấy đủ thông tin
    setMatchedProfiles((prev) => {
      if (prev.some((p) => p.id === profile.id)) return prev;
      return [...prev, profile];
    });
  }
  setIncomingProfiles((prev) => prev.filter((p) => p.id !== targetId));
};

  return (
    <main className="flex-1 py-8">
      <div className="container">
        <div className="flex flex-col gap-8">
          <motion.div
            className="flex items-center justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold tracking-tight">
              {t("dashboard.welcome")}, {userName}
            </h1>
            <AnimatedGradientBorder>
              <Button variant="outline" size="sm" className="gap-2">
                <Settings className="h-4 w-4" />
                {t("nav.settings")}
              </Button>
            </AnimatedGradientBorder>
          </motion.div>

          <motion.div
            className="rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-background p-6 md:p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">
                  {t("dashboard.compatibilityScore")}
                </h2>
                <div className="flex items-center gap-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                    92
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t("dashboard.compatibilityDesc")}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">
                  {t("dashboard.newMatches")}
                </h2>
                <div className="flex items-center gap-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                    5
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t("dashboard.newMatchesDesc")}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">
                  {t("dashboard.profileCompletion")}
                </h2>
                <div className="flex items-center gap-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                    {completionPercent}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t("dashboard.profileCompletionDesc")}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {showDatePlanner ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <VirtualDatePlanner
                matchName={selectedMatchName || ""}
                matchId={selectedMatchId || ""}
                onDatePlanned={handleDatePlanned}
              />
            </motion.div>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <h2 className="text-2xl font-bold mb-4">
                  {t("dashboard.dailyRecommendation")}
                </h2>
                <DailyRecommendation recommendations={profiles} />
              </motion.div>

              <Tabs
                defaultValue="matches"
                className="w-full"
                onValueChange={setActiveTab}
              >
              <TabsList className="grid w-full grid-cols-4 md:w-auto">
                <TabsTrigger value="matches">{t("dashboard.matches")}</TabsTrigger>
                <TabsTrigger value="liked">{t("dashboard.liked")}</TabsTrigger>
                <TabsTrigger value="likes-received">Likes Received</TabsTrigger>
                <TabsTrigger value="messages">{t("dashboard.messages")}</TabsTrigger>
              </TabsList>

                <TabsContent value="matches" className="mt-6">
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {profiles.slice(0, 6).map((profile: MatchProfile) => (
                      <MatchCard
                        key={profile.id}
                        id={profile.id}
                        name={profile.name}
                        age={profile.age}
                        location={profile.location}
                        interests={profile.interests}
                        avt={profile.avt}
                        compatibility={profile.compatibility}
                        is_online={profile.is_online}
                        last_online_at={profile.last_online_at}
                        onPlanDate={() =>
                          handlePlanDate(profile.id.toString(), profile.name)
                        }
                        onLikeSuccess={() =>
                          setProfiles((prev) => prev.filter((p) => p.id !== profile.id))
                        }
                      />
                    ))}
                  </div>
                </TabsContent>
<TabsContent value="liked" className="mt-6">
  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {matchedProfiles.map((profile: MatchProfile) => (
      <MatchCard
        key={profile.id}
        id={profile.id}
        name={profile.name}
        age={profile.age}
        location={profile.location}
        interests={profile.interests}
        avt={profile.avt}
        compatibility={profile.compatibility}
        is_online={profile.is_online}
        last_online_at={profile.last_online_at}
        isMatched={true}
        onPlanDate={() =>
          handlePlanDate(profile.id.toString(), profile.name)
        }
        onLikeSuccess={() =>
          setMatchedProfiles((prev) =>
            prev.filter((p) => p.id !== profile.id)
          )
        }
      />
    ))}
  </div>
</TabsContent>


                <TabsContent value="likes-received" className="mt-6">
  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {incomingProfiles.map((profile: MatchProfile) => (
      <MatchCard
        key={profile.id}
        id={profile.id}
        name={profile.name}
        age={profile.age}
        location={profile.location}
        interests={profile.interests}
        avt={profile.avt}
        compatibility={profile.compatibility}
        is_online={profile.is_online}
        last_online_at={profile.last_online_at}
        onPlanDate={() =>
          handlePlanDate(profile.id.toString(), profile.name)
        }
        onLikeSuccess={() => {
          setIncomingProfiles((prev) =>
            prev.filter((p) => p.id !== profile.id)
          );

          setLikedProfiles((prev: MatchProfile[]) => [...prev, profile]);

          setMatchedProfiles((prev: MatchProfile[]) => [...prev, profile]);
        }}

      />
    ))}
  </div>
</TabsContent>


                <TabsContent value="messages" className="mt-6">
                  <div className="grid gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <MessageCard key={i} id={i} />
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

type MatchCardProps = {
  id: number;
  name: string;
  age: number;
  location: string;
  interests: string[];
  liked?: boolean;
  avt: string;
  compatibility: number;
  is_online: boolean;
  last_online_at: Date;
  onPlanDate?: () => void;
  isMatched?: boolean;
  onLikeSuccess?: () => void;
};

function MatchCard({
  id,
  name,
  age,
  location,
  interests,
  avt,
  compatibility,
  is_online,
  last_online_at,
  liked = false,
  isMatched = false,
  onPlanDate,
  onLikeSuccess,
}: MatchCardProps) {
  const [isLiked, setIsLiked] = useState(liked);
  const router = useRouter();
  const { t } = useLanguage();
  const [showActions, setShowActions] = useState(false);

  const viewProfile = () => {
    router.push(`/profile/${id}`);
  };

  const sendMessage = () => {
    router.push("/messages");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: id * 0.1, duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <AnimatedGradientBorder className="p-0">
        <Card
          className="overflow-hidden"
          onMouseEnter={() => setShowActions(true)}
          onMouseLeave={() => setShowActions(false)}
        >
          <div className="relative aspect-[3/4] w-full">
            <Image
              src={avt}
              alt={`Match ${id}`}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute top-4 right-4">
              <MoodRing
                mood={
                  ["happy", "romantic", "calm", "energetic", "thoughtful"][
                    id % 5
                  ] as any
                }
              />
            </div>
            <div className="absolute bottom-0 left-0 p-4">
              <h3 className="text-xl font-semibold text-white">
                {name}, {age}
              </h3>
              <p className="text-sm text-white/80">{location}</p>
              <div className="mt-2 flex flex-wrap gap-1 max-w-[calc((5*theme(spacing.16))+4*theme(spacing.1))]">
                {interests.map((interest, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-white/20 hover:bg-white/30 text-white"
                  >
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>

            {showActions && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center bg-black/40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="rounded-full"
                    onClick={viewProfile}
                  >
                    <User className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="lg"
                    className="rounded-full"
                    onClick={sendMessage}
                  >
                    <MessageCircle className="h-5 w-5" />
                  </Button>
                  {!isMatched && (
                  <Button
                    variant="secondary"
                    size="lg"
                    className={`rounded-full ${
                      isLiked ? "bg-red-500 text-white hover:bg-red-600" : ""
                    }`}
                    onClick={async () => {
                      const senderId = Cookies.get("userId");
                      if (!senderId) {
                        console.error("Không tìm thấy userId trong cookie.");
                        return;
                      }

                      try {
                        const receiverId = await getUserIdByProfileId(id);
                        await sendLike(+senderId, receiverId);
                        setIsLiked(true);
                        onLikeSuccess?.(); 
                      } catch (error) {
                        console.error("Gửi like thất bại:", error);
                      }
                    }}
                  >
                    <Heart
                      className="h-5 w-5"
                      fill={isLiked ? "currentColor" : "none"}
                    />
                  </Button>
                  )}
                </div>
              </motion.div>
            )}
          </div>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">
                  {" "}
                  {compatibility}% Match
                </span>
              </div>
{isMatched && (
  <Button variant="outline" size="sm" onClick={onPlanDate}>
    Plan a Date
  </Button>
)}

            </div>
          </CardContent>
        </Card>
      </AnimatedGradientBorder>
    </motion.div>
  );
}

function MessageCard({ id }: { id: number }) {
  const router = useRouter();

  const goToMessages = () => {
    router.push("/messages");
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: id * 0.1, duration: 0.5 }}
      whileHover={{ x: 5 }}
    >
      <AnimatedGradientBorder>
        <Card onClick={goToMessages} className="cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={`/placeholder.svg?height=48&width=48&text=User${id}`}
                  alt={`User ${id}`}
                />
                <AvatarFallback>U{id}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Michael, 30</h3>
                  <span className="text-xs text-muted-foreground">2h ago</span>
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  Hey, I noticed we both love hiking! What's your favorite
                  trail?
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </AnimatedGradientBorder>
    </motion.div>
  );
}
