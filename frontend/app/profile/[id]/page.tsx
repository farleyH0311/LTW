"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Calendar,
  Heart,
  MapPin,
  MessageCircle,
  Share2,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  getProfileByUserId,
  getUserIdByProfileId,
  getCompatibilityResults,
  getAllUserImages,
  sendLike,
  acceptMatch,
  rejectMatch,
  getIncomingLikes,
  getMyMatches,
  unmatchUser,
} from "../../axios";
import Cookies from "js-cookie";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useLanguage } from "@/components/language-provider";
import { CompatibilityChart } from "@/components/compatibility-chart";
import { PersonalityRadarChart } from "@/components/personality-radar-chart";
import { AnimatedGradientBorder } from "@/components/ui-effects/animated-gradient-border";
import { VirtualDatePlanner } from "@/components/virtual-date-planner";
import { Confetti } from "@/components/ui-effects/confetti";
import { formatJoinedDate } from "../../../lib/formatdate";
import { getProfileById } from "../../axios";
import { getDetailText } from "../../test-personality/page";
import { TraitKey } from "../../test-personality/question"

export default function ProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const { t } = useLanguage();

  const [isLiked, setIsLiked] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showDatePlanner, setShowDatePlanner] = useState(false);
  const [profile, setProfile] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [photos, setPhotos] = useState<string[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [isIncomingLike, setIsIncomingLike] = useState(false);
  const [isMatched, setIsMatched] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isRejected, setIsRejected] = useState(false);

  interface PersonalityDetails {
    openness: number;
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    neuroticism: number;
  }

  interface Compatibility {
    goalScore: number;
    interestScore: number;
    oceanScore: number;
    personalityDetails: PersonalityDetails;
    totalScore: number;
  }

  interface ProfileInfo {
    about_me: string;
    account_name: string;
    age: number;
    avt: string;
    created_at: string;
    education: string;
    gender: string;
    height: number;
    id: number;
    interests: string[];
    location: string;
    name: string;
    occupation: string;
    relationship_goals: string;
    updated_at: string;
    userId: number;
  }

  interface ApiResponse {
    compatibility: Compatibility;
    profile: ProfileInfo;
  }

  interface Like {
  senderId: number;
  receiverId: number;
  }

  useEffect(() => {
    const userId = Cookies.get("userId");
    if (id) {
          const fetchProfile = async () => {
            try {
              const otheruserId = await getUserIdByProfileId(id);
              const data = await getCompatibilityResults(userId, otheruserId);
              setProfile(data[0]);

              const [matches, incomingLikes] = await Promise.all([
                getMyMatches(userId),
                getIncomingLikes(userId)
              ]);

              const matchedIds = matches.map((m: any) => m.profile.userId);
              setIsMatched(matchedIds.includes(otheruserId));

              const incomingIds = incomingLikes.map((like: any) => like.profile.userId);
              setIsIncomingLike(incomingIds.includes(otheruserId));
            } catch (error) {
              console.error("Lỗi khi tải profile:", error);
            } finally {
              setLoading(false);
            }
          };

      fetchProfile();
    } else {
      console.error("User ID không tồn tại trong URL");
      setLoading(false);
    }
  }, [id]);
  useEffect(() => {
    async function fetchPhotos() {
      try {
        const userId = await getUserIdByProfileId(id);
        const data = await getAllUserImages(userId);
        setPhotos(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchPhotos();
  }, [id]);

useEffect(() => {
  const checkIncoming = async () => {
    try {
      const currentUserId = Cookies.get("userId");
      if (!currentUserId || !id) return;

      const incomingLikes = await getIncomingLikes(currentUserId);
      const senderIds = incomingLikes.map((like: any) => like.profile.userId);

      const otherUserId = await getUserIdByProfileId(id);

      setIsIncomingLike(senderIds.includes(otherUserId));
    } catch (error) {
      console.error("Lỗi khi kiểm tra incoming like:", error);
    }
  };

  checkIncoming();
}, [id, profile]);

  const userData = profile?.profile || {
    userId: "",
    id: "",
    name: "",
    account_name: "",
    age: "",
    occupation: "",
    created_at: "",
    avt: "",
    about_me: "",
    education: "",
    height: "",
    relationship_goals: "",
    interests: [],
    location: "",
    gender: "",
    updated_at: "",
  };

  const personalityTest = profile?.compatibility?.personalityDetails
    ? [
        {
          trait: "openness",
          value: profile.compatibility.personalityDetails.openness,
        },
        {
          trait: "conscientiousness",
          value: profile.compatibility.personalityDetails.conscientiousness,
        },
        {
          trait: "extraversion",
          value: profile.compatibility.personalityDetails.extraversion,
        },
        {
          trait: "agreeableness",
          value: profile.compatibility.personalityDetails.agreeableness,
        },
        {
          trait: "neuroticism",
          value: profile.compatibility.personalityDetails.neuroticism,
        },
      ]
    : [
        { trait: "openness", value: 0 },
        { trait: "conscientiousness", value: 0 },
        { trait: "extraversion", value: 0 },
        { trait: "agreeableness", value: 0 },
        { trait: "neuroticism", value: 0 },
      ];

  const replaceYouWithName = (text: string, name: string) => {
    return text.replace(/\bBạn\b|\bbạn\b/, name);
  };
  const sendMessage = () => {
    router.push("/messages");
  };

  const handlePlanDate = () => {
    setShowDatePlanner(true);
  };

  const handleDatePlanned = () => {
    setShowDatePlanner(false);
  };

  const handleLike = async () => {
    const senderId = Cookies.get("userId");
    const receiverId = profile?.profile?.userId;
  if (!isLiked) {
        setShowConfetti(true);
      }
      setIsLiked(!isLiked);
    if (!senderId || !receiverId) {
      console.error("Thiếu senderId hoặc receiverId");
      return;
    }

    try {
      await sendLike(+senderId, +receiverId);
      setIsLiked(true);
      setShowConfetti(true);
    } catch (err) {
      console.error("Gửi like thất bại:", err);
    }
  };

  const handleAccept = async () => {
    const senderId = profile?.profile?.userId;
    const receiverId = Cookies.get("userId");

    if (!senderId || !receiverId) return;

    try {
      await sendLike(+receiverId, +senderId); 
      setIsMatched(true);
    } catch (err) {
      console.error("Lỗi khi đồng ý match:", err);
    }
  };

  const handleReject = async () => {
  const senderId = profile?.profile?.userId; 
  const receiverId = Cookies.get("userId");  

  if (!senderId || !receiverId) {
    console.error("Thiếu senderId hoặc receiverId để từ chối match.");
    return;
  }

  try {
    await rejectMatch(+senderId, +receiverId); 
    setIsRejected(true); 
    setIsIncomingLike(false); 
  } catch (error) {
    console.error("Lỗi khi từ chối match:", error);
  }
};


  // Sample compatibility data
  const compatibilityData = [
    {
      category: "goalScore",
      value: profile?.compatibility?.goalScore || 0,
      color: "#4F46E5",
    },
    {
      category: "interestScore",
      value: profile?.compatibility?.interestScore || 0,
      color: "#E11D48",
    },
    {
      category: "oceanScore",
      value: profile?.compatibility?.oceanScore || 0,
      color: "#06B6D4",
    },
  ];

  // Sample personality data

  function getPersonalityTraits(data: ApiResponse | null) {
    if (data?.compatibility?.personalityDetails) {
      const p = data.compatibility.personalityDetails;
      return [
        { trait: "openness", value: p.openness },
        { trait: "conscientiousness", value: p.conscientiousness },
        { trait: "extraversion", value: p.extraversion },
        { trait: "agreeableness", value: p.agreeableness },
        { trait: "neuroticism", value: p.neuroticism },
      ];
    }
    return [
      { trait: "openness", value: 0 },
      { trait: "conscientiousness", value: 0 },
      { trait: "extraversion", value: 0 },
      { trait: "agreeableness", value: 0 },
      { trait: "neuroticism", value: 0 },
    ];
  }

  return (
    <div className="container max-w-4xl py-8">
      <Confetti trigger={showConfetti} />

      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/feed">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("profile.back")}
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LanguageSwitcher />
        </div>
      </div>

      {showDatePlanner && userData.userId ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <VirtualDatePlanner
            matchName={userData.name}
            matchId={String(userData.userId)}
            onDatePlanned={handleDatePlanned}
          />
        </motion.div>
      ) : (
        <div className="grid gap-6 md:grid-cols-[300px_1fr]">
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <AnimatedGradientBorder className="p-0">
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl">
                <Image
                  src={userData.avt ? userData.avt : "images.png"}
                  alt="Profile"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </AnimatedGradientBorder>
            <div className="flex gap-2">
            <Button
              className="min-w-[120px] px-4 py-2 text-sm font-medium flex items-center justify-center gap-2"
              onClick={sendMessage}
            >
              <MessageCircle className="h-4 w-4 shrink-0" />
              <span className="whitespace-nowrap">{t("profile.message")}</span>
            </Button>
              {isMatched && (
                <Button
                  onClick={async () => {
                    const currentUserId = Cookies.get("userId");
                    const otherUserId = profile?.profile?.userId;
                    if (!currentUserId || !otherUserId) return;
                    try {
                      await unmatchUser(currentUserId, otherUserId);
                      setIsMatched(false);
                    } catch (error) {
                      console.error("Lỗi khi huỷ match:", error);
                    }
                  }}
                  className="bg-red-500 text-white hover:bg-red-600"
                >
                  Huỷ Match
                </Button>
              )}

              {!isMatched && isIncomingLike && (
                <>
                  <Button
                    onClick={handleAccept}
                    className="bg-green-500 text-white hover:bg-green-600"
                  >
                    Đồng ý
                  </Button>
                  <Button
                    onClick={handleReject}
                    className="bg-gray-300 hover:bg-gray-400 text-black"
                  >
                    Từ chối
                  </Button>
                </>
              )}

              {!isMatched && !isIncomingLike && (
                <Button
                  variant="secondary"
                  size="lg"
                  className={`rounded-full ${isLiked ? "bg-red-500 text-white hover:bg-red-600" : ""}`}
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
                    } catch (error) {
                      console.error("Gửi like thất bại:", error);
                    }
                  }}
                >
                  <Heart className="h-5 w-5" fill={isLiked ? "currentColor" : "none"} />
                </Button>
              )}

              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
            {isMatched && (
              <Button
                variant="outline"
                className="w-full"
                onClick={handlePlanDate}
              >
                Plan a Date
              </Button>
            )}
          </motion.div>
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">
                  {userData.name}, {userData.age}
                </h1>
                <div className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  <Sparkles className="mr-1 h-4 w-4" />
                  {profile?.compatibility?.totalScore}% Match
                </div>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground text-xl">
                <span>@{userData.account_name}</span>
              </div>
              <div className="mt-2 flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{userData.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatJoinedDate(userData.created_at)}</span>
                </div>
              </div>
            </div>

            <Tabs defaultValue="about">
              <TabsList>
                <TabsTrigger value="about">{t("profile.about")}</TabsTrigger>
                <TabsTrigger value="interests">
                  {t("profile.interests")}
                </TabsTrigger>
                <TabsTrigger value="compatibility">
                  {t("profile.compatibility")}
                </TabsTrigger>
                <TabsTrigger value="personality">
                  {t("profile.personality")}
                </TabsTrigger>
                <TabsTrigger value="photos">{t("profile.photos")}</TabsTrigger>
              </TabsList>
              <TabsContent value="about" className="mt-4 space-y-4">
                <AnimatedGradientBorder>
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="mb-2 font-semibold">
                        {t("profile.aboutMe")}
                      </h3>
                      <p className="text-muted-foreground">
                        {userData.about_me}
                      </p>
                    </CardContent>
                  </Card>
                </AnimatedGradientBorder>
                <AnimatedGradientBorder>
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="mb-2 font-semibold">
                        {t("profile.lookingFor")}
                      </h3>
                      {userData.relationship_goals ? (
                        <p className="text-muted-foreground">
                          {userData.relationship_goals
                            .split(" ")
                            .map((goal, index) => (
                              <span key={index}>{t(`profile.${goal}`)} </span>
                            ))}
                        </p>
                      ) : null}
                    </CardContent>
                  </Card>
                </AnimatedGradientBorder>
                <AnimatedGradientBorder>
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="mb-2 font-semibold">
                        {t("profile.basics")}
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium">
                            {t("profile.height")}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {userData.height}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {t("profile.education")}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {userData.education}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {t("profile.occupation")}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {userData.occupation}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {t("profile.relationshipGoals")}
                          </p>
                          <p className="text-muted-foreground">
                            {userData.relationship_goals?.trim()
                              ? userData.relationship_goals
                                  .split(" ")
                                  .map((goal, index) => (
                                    <span key={index}>
                                      {t(`profile1.${goal}`)}{" "}
                                    </span>
                                  ))
                              : null}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedGradientBorder>
              </TabsContent>

              <TabsContent value="interests" className="mt-4">
                <AnimatedGradientBorder>
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="mb-4 font-semibold">
                        {t("profile.interestsHobbies")}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {userData.interests.map((interest) => (
                          <Badge key={interest} variant="secondary">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedGradientBorder>
              </TabsContent>
              <TabsContent value="compatibility" className="mt-4 space-y-4">
                <AnimatedGradientBorder>
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="mb-4 font-semibold">
                        {t("profile.compatibilityAnalysis")}
                      </h3>
                      <div className="flex flex-col items-center md:flex-row md:items-start gap-6">
                        <CompatibilityChart data={compatibilityData} />
                        <div className="space-y-4 flex-1">
                          <div>
                            <div className="mb-2 flex items-center justify-between">
                              <span className="text-sm font-medium">
                                {t("profile.ocean")}
                              </span>
                              <span className="text-sm font-medium text-primary">
                                {profile?.compatibility?.oceanScore ?? 0}%
                              </span>
                            </div>
                            <div className="h-2 rounded-full bg-muted">
                              <div
                                className="h-2 rounded-full bg-primary"
                                style={{
                                  width: `${
                                    profile?.compatibility?.oceanScore ?? 0
                                  }%`,
                                }}
                              />
                            </div>
                          </div>
                          <div>
                            <div className="mb-2 flex items-center justify-between">
                              <span className="text-sm font-medium">
                                {t("profile.interests")}
                              </span>
                              <span className="text-sm font-medium text-primary">
                                {profile?.compatibility?.interestScore ?? 0}%
                              </span>
                            </div>
                            <div className="h-2 rounded-full bg-muted">
                              <div
                                className="h-2 rounded-full bg-primary"
                                style={{
                                  width: `${
                                    profile?.compatibility?.interestScore ?? 0
                                  }%`,
                                }}
                              />
                            </div>
                          </div>
                          <div>
                            <div className="mb-2 flex items-center justify-between">
                              <span className="text-sm font-medium">
                                {t("profile.relationshipgoal")}
                              </span>
                              <span className="text-sm font-medium text-primary">
                                {profile?.compatibility?.goalScore ?? 0}%
                              </span>
                            </div>
                            <div className="h-2 rounded-full bg-muted">
                              <div
                                className="h-2 rounded-full bg-primary"
                                style={{
                                  width: `${
                                    profile?.compatibility?.goalScore ?? 0
                                  }%`,
                                }}
                              />
                            </div>
                          </div>
                          <div></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedGradientBorder>
                <AnimatedGradientBorder>
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="mb-2 font-semibold">
                        {t("profile.whyMatch")}
                      </h3>
                      <ul className="space-y-2 text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <Sparkles className="mt-0.5 h-4 w-4 text-primary" />
                          <span>
                            You both value honesty and communication in
                            relationships
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Sparkles className="mt-0.5 h-4 w-4 text-primary" />
                          <span>
                            You share a passion for outdoor activities and
                            fitness
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Sparkles className="mt-0.5 h-4 w-4 text-primary" />
                          <span>
                            Your communication styles are highly compatible
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Sparkles className="mt-0.5 h-4 w-4 text-primary" />
                          <span>
                            You both have similar long-term relationship goals
                          </span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </AnimatedGradientBorder>
              </TabsContent>
              <TabsContent value="personality" className="mt-4 space-y-4">
                <AnimatedGradientBorder>
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="mb-4 font-semibold">
                        Personality Profile
                      </h3>
                      <div className="flex justify-center mb-6">
                        <PersonalityRadarChart
                          data={getPersonalityTraits(profile)}
                        />
                      </div>

                      <div className="space-y-4">
                        {getPersonalityTraits(profile)
                          ?.filter(({ value }) => value > 0)
                          .map(({ trait, value }, index) => (
                            <div key={index} className="mb-4">
                              <h4 className="text-sm font-medium">
                                {trait.charAt(0).toUpperCase() + trait.slice(1)}{" "}
                                ({value}%)
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {replaceYouWithName(
                                  getDetailText(trait as TraitKey, value),
                                  userData.name || "Bạn"
                                )}
                              </p>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedGradientBorder>
                <AnimatedGradientBorder>
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="mb-2 font-semibold">
                        Personality Compatibility
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Based on your personality profiles, you and Sarah have a
                        strong foundation for a harmonious relationship. Your
                        personalities complement each other in key areas:
                      </p>
                      <ul className="space-y-2 text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <Sparkles className="mt-0.5 h-4 w-4 text-primary" />
                          <span>
                            Your practical nature balances well with Sarah's
                            creativity and openness
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Sparkles className="mt-0.5 h-4 w-4 text-primary" />
                          <span>
                            You both share high agreeableness, creating a
                            foundation of mutual respect
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Sparkles className="mt-0.5 h-4 w-4 text-primary" />
                          <span>
                            Your emotional stability complements Sarah's
                            moderate extraversion
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Sparkles className="mt-0.5 h-4 w-4 text-primary" />
                          <span>
                            You both approach challenges with resilience and
                            positivity
                          </span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </AnimatedGradientBorder>
              </TabsContent>
              <TabsContent value="photos" className="mt-4">
                <AnimatedGradientBorder>
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="mb-4 font-semibold">
                        {t("profile.photos")}
                      </h3>

                      {loading ? (
                        <p>Loading photos...</p>
                      ) : photos.length === 0 ? (
                        <p>No photos uploaded yet.</p>
                      ) : (
                        <div className="grid grid-cols-3 gap-4">
                          {photos.map((url, index) => (
                            <img
                              key={index}
                              src={url}
                              alt={`User photo ${index + 1}`}
                              className="w-full aspect-square object-cover rounded-md"
                              onClick={() => setSelectedPhoto(url)}
                            />
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </AnimatedGradientBorder>
              </TabsContent>
              {selectedPhoto && (
                <div
                  className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
                  onClick={() => setSelectedPhoto(null)} // Click ngoài để đóng
                >
                  <img
                    src={selectedPhoto}
                    alt="Selected"
                    className="max-w-[90vw] max-h-[90vh] rounded-md shadow-lg"
                    onClick={(e) => e.stopPropagation()} // Ngăn không cho đóng khi click vào ảnh
                  />
                  <button
                    className="absolute top-4 right-4 text-white text-3xl font-bold"
                    onClick={() => setSelectedPhoto(null)}
                  >
                    &times;
                  </button>
                </div>
              )}
            </Tabs>
          </motion.div>
        </div>
      )}
    </div>
  );
}
