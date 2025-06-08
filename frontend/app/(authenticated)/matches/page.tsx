"use client";

import type React from "react";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Heart,
  X,
  Calendar,
  MapPin,
  Filter,
  Star,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Cookies from "js-cookie";
import { formatJoinedDate } from "../../../lib/formatdate";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Slider } from "@/components/ui/slider";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useLanguage } from "@/components/language-provider";
import { MainNav } from "@/components/main-nav";
import { MobileNav } from "@/components/mobile-nav";
import { AnimatedGradientBorder } from "@/components/ui-effects/animated-gradient-border";
import { Confetti } from "@/components/ui-effects/confetti";
import { 
  getAllProfiles,
  getSuggestedMatches,
  getMyMatches,
  getSentLikes,
  sendLike,
 } from "@../../../app/axios";

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
  compatibility?: number;
  distance?: number;
  user: {
    is_online: boolean;
    last_online_at: Date | null;
  };
}
export default function MatchesPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [direction, setDirection] = useState<"left" | "right" | null>(null);
  const [exitComplete, setExitComplete] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filterStep, setFilterStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [distanceRange, setDistanceRange] = useState([50]);
  const [ageRange, setAgeRange] = useState([18, 40]);
  const [potentialMatches, setPotentialMatches] = useState<MatchProfile[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [location, setLocation] = useState("");
  const [occupation, setOccupation] = useState("");
  const [gender, setGender] = useState("");
  const [relationshipGoal, setRelationshipGoal] = useState("");
  const [allProfiles, setAllProfiles] = useState<MatchProfile[]>([]);
  const [hasFiltered, setHasFiltered] = useState(false);

  useEffect(() => {
  const fetchProfiles = async () => {
    try {
      const userId = Cookies.get("userId");
      if (!userId) {
        console.error("User ID không tồn tại trong cookie");
        setError(true);
        setLoading(false);
        return;
      }

      const [allProfiles, myMatches, sentLikes] = await Promise.all([
        getAllProfiles(),
        getMyMatches(userId),
        getSentLikes(userId),
      ]);

      // Lấy danh sách userId đã match hoặc đã like
      const matchedIds = myMatches.map((item: any) => item.profile.userId);
      const sentLikeIds = sentLikes.map((item: any) => item.profile.userId);

      const excludedIds = new Set([
        ...matchedIds,
        ...sentLikeIds,
        parseInt(userId), // loại bỏ bản thân
      ]);

      const filteredProfiles = allProfiles.filter(
        (profile: MatchProfile) => !excludedIds.has(profile.userId)
      );

      setAllProfiles(filteredProfiles);
      setPotentialMatches(filteredProfiles);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách profile:", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  fetchProfiles();
}, []);

  const handleFilterSubmit = () => {
    let filtered = [...potentialMatches];

    // Lọc theo tuổi
    filtered = filtered.filter(
      (p) => p.age >= ageRange[0] && p.age <= ageRange[1]
    );

    // Lọc theo gender nếu có chọn
    if (gender) {
      filtered = filtered.filter((p) => p.gender === gender);
    }

    // Lọc theo occupation nếu có chọn
    if (occupation) {
      filtered = filtered.filter((p) =>
        p.occupation.toLowerCase().includes(occupation.toLowerCase())
      );
    }

    // Lọc theo relationshipGoal nếu có chọn
    if (relationshipGoal) {
      filtered = filtered.filter(
        (p) =>
          p.relationship_goals.toLowerCase() === relationshipGoal.toLowerCase()
      );
    }

    // Lọc theo location nếu có chọn
    if (location) {
      filtered = filtered.filter((p) =>
        p.location.toLowerCase().includes(location.toLowerCase())
      );
    }
    console.log(
      "Các profile sau khi lọc location (không gồm chính user):",
      filtered
    );

    // Lọc theo interests (nếu có ít nhất 1 interest trùng)
    if (selectedInterests.length > 0) {
      filtered = filtered.filter((p) =>
        selectedInterests.some((interest) => p.interests.includes(interest))
      );
    }

    // Lọc theo khoảng cách nếu có trường distance
    // if (distanceRange.length > 0) {
    //   filtered = filtered.filter(
    //     (p) => p.distance !== undefined && p.distance <= distanceRange[0]
    //   );
    // }

    setPotentialMatches(filtered);

    setHasFiltered(true);
  };

  // if (loading) return <div>Đang tải thông tin...</div>;
  // if (error) return <div>Có lỗi xảy ra khi tải thông tin người dùng.</div>;
  // if (potentialMatches.length === 0)
  //   return <div>Không tìm thấy người phù hợp.</div>;
  const handleReset = () => {
    setAgeRange([18, 40]);
    setLocation("");
    setOccupation("");
    setGender("");
    setLocation("");
    setPotentialMatches(allProfiles);
    console.log("reset:", currentMatch);
    setCurrentIndex(0);
    setDirection(null);
    setExitComplete(false);
    setShowConfetti(false);
  };
  const currentMatch = potentialMatches[currentIndex];

  const handleLike = async () => {
  const senderId = Cookies.get("userId");
  const receiverId = currentMatch?.userId;
  if (!senderId || !receiverId) {
    console.error("Thiếu senderId hoặc receiverId");
    return;
  }

  try {
    await sendLike(+senderId, +receiverId);
    setShowConfetti(true);
  } catch (error) {
    console.error("Gửi like thất bại:", error);
  }
};


  const handleSkip = () => {
    const nextIndex = (currentIndex + 1) % potentialMatches.length;
    setCurrentIndex(nextIndex);
    setShowConfetti(false);
  };

  const handleConfettiComplete = () => {
    const nextIndex = (currentIndex + 1) % potentialMatches.length;
    setCurrentIndex(nextIndex);
    setShowConfetti(false);
  };
  const viewProfile = (id: number) => {
    router.push(`/profile/${id}`);
  };

  return (
    <main className="flex-1 py-8">
      <div className="container">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{t("matches.title")}</h1>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => setHasFiltered(!hasFiltered)}
          >
            <Filter className="h-4 w-4" />
            {t("matches.filters")}
          </Button>
        </div>

        {hasFiltered && (
          <AnimatedGradientBorder className="mb-6">
            <Card>
              <CardContent className="pt-6">
                {filterStep === 1 && (
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <h3 className="font-medium">{t("matches.distance")}</h3>
                      <div className="px-2">
                        <Slider
                          defaultValue={distanceRange}
                          max={100}
                          step={1}
                          onValueChange={setDistanceRange}
                        />
                        <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                          <span>0 miles</span>
                          <span>{distanceRange[0]} miles</span>
                          <span>100+ miles</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-medium">{t("matches.ageRange")}</h3>
                      <div className="px-2">
                        <Slider
                          defaultValue={ageRange}
                          max={60}
                          min={18}
                          step={1}
                          onValueChange={setAgeRange}
                        />
                        <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                          <span>18</span>
                          <span>
                            {ageRange[0]} - {ageRange[1]}
                          </span>
                          <span>60+</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {filterStep === 2 && (
                  <div className="flex gap-6">
                    <div className="flex-1">
                      <h3 className="font-medium">{t("matches.location")}</h3>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Enter location"
                        className="w-full p-2 border rounded"
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-medium">{t("matches.occupation")}</h3>
                      <input
                        type="text"
                        value={occupation}
                        onChange={(e) => setOccupation(e.target.value)}
                        placeholder="Enter occupation"
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  </div>
                )}
                {filterStep === 3 && (
                  <div className="flex gap-6">
                    <div className="flex-1">
                      <h3 className="font-medium">{t("matches.gender")}</h3>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full p-2 border rounded"
                      >
                        <option value="">All</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">
                        {t("matches.relationshipGoal")}
                      </h3>
                      <select
                        value={relationshipGoal}
                        onChange={(e) => setRelationshipGoal(e.target.value)}
                        className="w-full p-2 border rounded"
                      >
                        <option value="">All</option>
                        <option value="long-term">
                          Long-term Relationship
                        </option>
                        <option value="casual">Casual Dating</option>
                        <option value="friendship">Friendship</option>
                        <option value="marriage">Marriage</option>
                      </select>
                    </div>
                  </div>
                )}
                {filterStep === 4 && (
                  <div className="space-y-1">
                    <h2 className="text-2xl font-semibold">Interests</h2>
                    <div className="space-y-1">
                      <div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {[
                            "Travel",
                            "Fitness",
                            "Reading",
                            "Cooking",
                            "Photography",
                            "Art",
                            "Music",
                            "Movies",
                            "Gaming",
                            "Technology",
                            "Fashion",
                            "Sports",
                            "Hiking",
                            "Yoga",
                            "Dancing",
                            "Writing",
                            "Pets",
                            "Food",
                            "Coffee",
                            "Wine",
                            "Theater",
                            "Concerts",
                            "Volunteering",
                            "Meditation",
                            "Languages",
                          ].map((interest) => (
                            <Button
                              key={interest}
                              type="button"
                              variant={
                                selectedInterests.includes(interest)
                                  ? "default"
                                  : "outline"
                              }
                              size="sm"
                              onClick={() => {
                                setSelectedInterests((prev) =>
                                  prev.includes(interest)
                                    ? prev.filter((i) => i !== interest)
                                    : [...prev, interest]
                                );
                              }}
                              className="rounded-full capitalize"
                            >
                              {interest}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Nút chuyển bước */}
                <div className="flex justify-end gap-2 mt-4">
                  {filterStep > 1 && (
                    <Button
                      onClick={() => setFilterStep(filterStep - 1)}
                      className="bg-purple-300 hover:bg-purple-400 border"
                    >
                      Back
                    </Button>
                  )}

                  {filterStep < 4 && (
                    <Button
                      onClick={() => setFilterStep(filterStep + 1)}
                      className="bg-purple-300 hover:bg-purple-400 border"
                    >
                      Next
                    </Button>
                  )}

                  <AnimatedGradientBorder variant="button">
                    <Button
                      onClick={handleFilterSubmit}
                      className="bg-transparent text-white hover:bg-white/10"
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                      Done
                    </Button>
                  </AnimatedGradientBorder>
                  <AnimatedGradientBorder variant="button">
                    <Button
                      onClick={handleReset}
                      className="bg-transparent text-white hover:bg-white/10"
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                      Reset
                    </Button>
                  </AnimatedGradientBorder>
                </div>
              </CardContent>
            </Card>
          </AnimatedGradientBorder>
        )}

        <div className="flex flex-col items-center">
          <Confetti
            trigger={showConfetti}
            onComplete={handleConfettiComplete}
          />
          {potentialMatches[currentIndex] && (
            <div className="w-full max-w-md">
              <AnimatedGradientBorder className="p-0">
                <Card className="overflow-hidden">
                  <div className="relative aspect-[3/4] w-full">
                    <Image
                      src={currentMatch.avt || "images.png"}
                      alt={currentMatch.name || "img"}
                      fill
                      className="object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                    <div className="absolute top-4 right-4">
                      <div className="flex items-center gap-1 rounded-full bg-primary/90 px-3 py-1 text-sm font-medium text-primary-foreground">
                        <Sparkles className="mr-1 h-4 w-4" />
                        {currentMatch.compatibility ?? 80}% {t("match")}
                      </div>
                    </div>

                    <div className="absolute bottom-0 left-0 p-6 w-full">
                      <h3 className="text-2xl font-bold text-white flex items-center">
                        {currentMatch.name}, {currentMatch.age}
                        {currentMatch.compatibility != null &&
                          currentMatch.compatibility > 90 && (
                            <Star className="ml-2 h-5 w-5 text-yellow-400 fill-yellow-400" />
                          )}
                      </h3>

                      <div className="flex items-center gap-4 text-white/90 mt-1 mb-3">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{currentMatch.distance}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {currentMatch.user.is_online ? (
                            <span className="flex items-center gap-1 text-green-600 font-medium">
                              <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span>
                              {t("OnlineNow")}
                            </span>
                          ) : (
                            <span className="text-gray-500">
                              {t("LastSeen")}:{" "}
                              {formatJoinedDate(
                                currentMatch.user.last_online_at
                              )}
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-white/80 line-clamp-3 mb-3">
                        {currentMatch.about_me}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {Array.isArray(currentMatch.interests) &&
                          currentMatch.interests.map((interest) => (
                            <Badge
                              key={interest}
                              variant="secondary"
                              className="bg-white/20 hover:bg-white/30 text-white"
                            >
                              {interest}
                            </Badge>
                          ))}
                      </div>

                      <Button
                        variant="secondary"
                        className="w-full"
                        onClick={() => viewProfile(currentMatch.id)}
                      >
                        {t("viewFullProfile")}
                      </Button>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-14 w-14 rounded-full border-2 border-muted-foreground/20"
                        onClick={handleSkip}
                      >
                        <X className="h-8 w-8 text-muted-foreground" />
                      </Button>

                      <Button
                        variant="outline"
                        size="icon"
                        className="h-14 w-14 rounded-full border-2 border-primary/20"
                        onClick={handleLike}
                      >
                        <Heart className="h-8 w-8 text-primary" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedGradientBorder>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
