"use client";
import axios from "axios";
import Cookies from "js-cookie";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Calendar,
  Camera,
  Edit2,
  MapPin,
  Settings,
  Share2,
  Shield,
  Sparkles,
  Star,
  Trophy,
  User,
  UserCheck,
  BarChart,
  FileText,
  Link,
  Eye,
  EyeOff,
} from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  getProfileByUserId,
  deleteAccount,
  getPersonalityTest,
  changePassword,
  getAllUserImages,
  updateProfile,
} from "../../axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/components/language-provider";
import { AnimatedGradientBorder } from "@/components/ui-effects/animated-gradient-border";
import { formatJoinedDate } from "../../../lib/formatdate";
import { PersonalityRadarChart } from "@/components/personality-radar-chart";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const searchParams = useSearchParams();
  // const userId = searchParams.get("userId");
  const userId = Cookies.get("userId");
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();
  const [hasPersonalityData, setHasPersonalityData] = useState(false);
  const [showChangePwModal, setShowChangePwModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);

  useEffect(() => {
    //console.log("User ID từ cookie:", userId);

    if (userId) {
      const fetchProfile = async () => {
        try {
          const data = (await getProfileByUserId(userId)) || {};
          const per = (await getPersonalityTest(userId)) || {};
          //console.log("per =", per);

          const personalityTraits = [
            { trait: "openness", value: per.openness || 0 },
            { trait: "conscientiousness", value: per.conscientiousness || 0 },
            { trait: "extraversion", value: per.extraversion || 0 },
            { trait: "agreeableness", value: per.agreeableness || 0 },
            { trait: "neuroticism", value: per.neuroticism || 0 },
          ];
          const hasData = personalityTraits.some(({ value }) => value > 0);
          setHasPersonalityData(hasData);

          const combinedProfile = {
            ...data,
            personalityTraits,
          };

          setProfile(combinedProfile);
          //console.log("Profile đã được set sau khi get per:", combinedProfile);
        } catch (error) {
          console.error("Lỗi khi tải profile:", error);
        }
      };

      fetchProfile();
    } else {
      console.error("User ID không tồn tại trong cookie");
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    async function fetchPhotos() {
      try {
        const data = await getAllUserImages(userId);
        setPhotos(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchPhotos();
  }, [userId]);
  const [open, setOpen] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(null);
      }
    }
    if (open !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);
  async function handleAction(
    action: "edit" | "delete" | "change_pw",
    oldPassword?: string,
    newPassword?: string
  ) {
    setOpen(null);

    if (action === "edit") {
      router.push(`/profile/create?userId=${userId}`);
    } else if (action === "delete") {
      const confirmDelete = window.confirm(
        "Bạn có chắc chắn muốn xóa tài khoản không?"
      );
      if (!confirmDelete) {
        return;
      }

      try {
        await deleteAccount(userId);
        alert("Xóa tài khoản thành công!");
        router.push(`/`);
        console.log("Đã xóa tài khoản");
      } catch (error) {
        console.error("Lỗi khi xóa tài khoản", error);
        alert("Xảy ra lỗi khi xóa tài khoản. Vui lòng thử lại.");
      }
    } else if (action === "change_pw") {
      setShowChangePassword(true);
    }
  }
  const userData = profile || {
    id: "",
    name: "",
    account_name: "",
    age: "",
    occupation: "",
    created_at: "",
    verified: true,
    premium: true,
    profileCompletion: 85,
    about_me: "",
    education: "",
    height: "",
    location: "",
    relationship_goals: "",
    interests: [],
    languages: ["English (Fluent)", "Spanish (Intermediate)", "French (Basic)"],
    personalityTraits: [
      { trait: "openness", value: 0 },
      { trait: "conscientiousness", value: 0 },
      { trait: "extraversion", value: 0 },
      { trait: "agreeableness", value: 0 },
      { trait: "neuroticism", value: 0 },
    ],
    avt: "images.png",
    achievements: [
      {
        icon: UserCheck,
        title: "Profile Verified",
        description: "Identity verified through secure channels",
      },
      {
        icon: Star,
        title: "Rising Star",
        description: "Popular among compatible matches",
      },
      {
        icon: Trophy,
        title: "Conversation Master",
        description: "Highly rated for meaningful conversations",
      },
    ],
    matchStats: {
      profileViews: 142,
      matches: 24,
      conversations: 8,
      dateInvites: 3,
    },
  };

  // console.log("hasPersonalityData: ", hasPersonalityData);
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };
  const calculateProfileCompletion = (
    profile: any,
    hasPersonalityData: boolean
  ): number => {
    const fieldsToCheck = [
      "name",
      "account_name",
      "age",
      "gender",
      "location",
      "about_me",
      "occupation",
      "education",
      "height",
      "interests",
      "relationship_goals",
      "avt",
      "test",
    ];

    let completedFields = fieldsToCheck.filter((key) => {
      const value = profile[key];
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return (
        value !== null &&
        value !== undefined &&
        value.toString().trim() !== "" &&
        value !== "unknown"
      );
    }).length;

    if (hasPersonalityData) completedFields++;

    return Math.round((completedFields / fieldsToCheck.length) * 100);
  };

  localStorage.setItem(
    "profileCompletion",
    calculateProfileCompletion(userData, hasPersonalityData).toString()
  );
  const handleEditProfile = () => {
    const userId = Cookies.get("userId");
    router.push(`/profile/create?userId=${userId}`);
  };
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  const showToast = (msg: string) => {
    setMessage(msg);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 3000); // 3s tự ẩn
  };
  async function uploadAvatarToCloudinary(file: File): Promise<string> {
    const cloudName = "doy9hevnl"; // ví dụ: 'duyxyz'
    const uploadPreset = "Harmonia"; // ví dụ: 'unsigned_preset'

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData
      );

      return response.data.secure_url;
    } catch (error) {
      console.error("Lỗi upload avatar lên Cloudinary:", error);
      throw error;
    }
  }
  const [avt, setAvt] = useState<{ avt: string; name: string } | null>(null);
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;

    try {
      const avatarUrl = await uploadAvatarToCloudinary(file);

      const sanitizedData = { avt: avatarUrl };
      console.log("Updating profile with data:", sanitizedData);
      await updateProfile(userId, sanitizedData);

      setAvt((prev) =>
        prev ? { ...prev, avt: avatarUrl } : { avt: avatarUrl, name: "" }
      );
    } catch (error) {
      console.error("Cập nhật avatar thất bại:", error);
    }
  };

  return (
    <div className="container max-w-4xl py-8">
      {/* Profile Header */}
      <motion.div
        className="mb-8 grid gap-6 md:grid-cols-[280px_1fr]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="space-y-4">
          <AnimatedGradientBorder className="p-0">
            <div className="relative aspect-square w-full overflow-hidden rounded-xl">
              <Image
                src={userData.avt ? userData.avt : "./images.png"}
                alt="Profile"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute bottom-3 right-3 flex gap-2">
                <input
                  type="file"
                  id="avatarInput"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-9 w-9 rounded-full bg-background/80 backdrop-blur-sm"
                  onClick={() =>
                    document.getElementById("avatarInput")?.click()
                  }
                >
                  <Camera className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </AnimatedGradientBorder>

          <div className="flex flex-wrap gap-2">
            <AnimatedGradientBorder variant="button">
              <Button
                onClick={handleEditProfile}
                className="bg-transparent text-white hover:bg-white/10"
              >
                <Edit2 className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            </AnimatedGradientBorder>
            <div className="relative">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setOpen((prev) => (prev === 1 ? null : 1))}
              >
                <Settings className="h-4 w-4" />
              </Button>
              {open && (
                <div className="absolute right-0 mt-1 w-48 rounded-md border bg-white shadow-md z-50">
                  <button
                    className="block w-full px-3 py-2 text-left hover:bg-gray-100"
                    onClick={() => {
                      handleAction("edit");
                      setOpen(null);
                    }}
                  >
                    {t("feed.cnupdate")}
                  </button>
                  <button
                    className="block w-full px-3 py-2 text-left hover:bg-gray-100"
                    onClick={() => {
                      handleAction("change_pw");
                      setOpen(null);
                    }}
                  >
                    {t("feed.changpw")}
                  </button>
                  <button
                    className="block w-full px-3 py-2 text-left hover:bg-gray-100 text-red-600"
                    onClick={() => {
                      handleAction("delete");
                      setOpen(null);
                    }}
                  >
                    {t("feed.cndelete")}
                  </button>
                </div>
              )}
            </div>

            {showChangePassword && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                onClick={() => setShowChangePassword(false)}
              >
                <div
                  className="bg-white rounded-lg p-6 max-w-md w-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h2 className="text-xl font-bold mb-4 font-extrabold text-center p-3  bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                    Đổi mật khẩu
                  </h2>
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();

                      if (newPassword !== confirmPassword) {
                        showToast("Mật khẩu mới và xác nhận không khớp!");
                        return;
                      }

                      try {
                        await changePassword(
                          oldPassword,
                          newPassword,
                          confirmPassword
                        );
                        showToast("Đổi mật khẩu thành công!");
                      } catch (error) {
                        showToast("Đổi mật khẩu thất bại!");
                      }
                    }}
                  >
                    <div className="relative mb-3">
                      <input
                        type={showOldPassword ? "text" : "password"}
                        placeholder="Mật khẩu cũ"
                        required
                        className="w-full p-2 border rounded pr-10"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500"
                        onClick={() => setShowOldPassword(!showOldPassword)}
                        aria-label={
                          showOldPassword
                            ? "Ẩn mật khẩu cũ"
                            : "Hiện mật khẩu cũ"
                        }
                      >
                        {showOldPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>

                    <div className="relative mb-3">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Mật khẩu mới"
                        required
                        className="w-full p-2 border rounded pr-10"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        aria-label={
                          showNewPassword
                            ? "Ẩn mật khẩu mới"
                            : "Hiện mật khẩu mới"
                        }
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>

                    <div className="relative mb-3">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Xác nhận mật khẩu mới"
                        required
                        className="w-full p-2 border rounded pr-10"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        aria-label={
                          showConfirmPassword
                            ? "Ẩn mật khẩu xác nhận"
                            : "Hiện mật khẩu xác nhận"
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>

                    <div className="flex justify-end gap-2">
                      <AnimatedGradientBorder variant="button">
                        <Button
                          type="button"
                          onClick={() => setShowChangePassword(false)}
                          className="px-4 py-2 bg-gray-300 rounded"
                        >
                          Hủy
                        </Button>
                      </AnimatedGradientBorder>
                      <AnimatedGradientBorder variant="button">
                        <Button
                          type="submit"
                          className="w-full bg-transparent text-white hover:bg-white/10"
                        >
                          Lưu
                        </Button>
                      </AnimatedGradientBorder>
                    </div>
                  </form>
                </div>
              </div>
            )}
            {showMessage && (
              <div
                className="fixed top-4 right-4 bg-green-500 text-white p-3 rounded shadow-lg cursor-pointer"
                onClick={() => setShowMessage(false)}
              >
                {message}
              </div>
            )}
            <Button variant="outline" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold">
                  {userData.name}, {userData.age}
                </h1>

                <div className="flex items-center gap-1 text-muted-foreground text-xl">
                  <span>@{userData.account_name}</span>
                </div>

                {userData.verified && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <Shield className="h-3 w-3" />
                    Verified
                  </Badge>
                )}
                {userData.premium && (
                  <Badge
                    variant="default"
                    className="flex items-center gap-1 bg-gradient-to-r from-amber-500 to-yellow-300 text-black"
                  >
                    <Sparkles className="h-3 w-3" />
                    Premium
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                <Sparkles className="mr-1 h-4 w-4" />
                Profile{" "}
                {calculateProfileCompletion(userData, hasPersonalityData)}%
                Complete
              </div>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{userData.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />

                <span>
                  Joined{" "}
                  {userData.created_at
                    ? formatJoinedDate(userData.created_at)
                    : "Unknown"}
                </span>
              </div>
            </div>
          </div>

          <Progress value={userData.profileCompletion} className="h-2 w-full" />

          <p className="text-muted-foreground">{userData.about_me}</p>

          <div className="flex flex-wrap gap-2">
            {userData.interests.slice(0, 5).map((interest) => (
              <Badge key={interest} variant="outline">
                {interest}
              </Badge>
            ))}
            {userData.interests.length > 5 && (
              <Badge variant="outline">
                +{userData.interests.length - 5} more
              </Badge>
            )}
          </div>
        </div>
      </motion.div>
      {/* Profile Content */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="photos">Photos</TabsTrigger>
          <TabsTrigger value="personality">Personality</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <motion.div {...fadeInUp}>
            <AnimatedGradientBorder>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <h3 className="text-sm font-medium">Occupation</h3>
                      <p className="text-muted-foreground">
                        {userData.occupation}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Education</h3>
                      <p className="text-muted-foreground">
                        {userData.education}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Height</h3>
                      <p className="text-muted-foreground">{userData.height}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Relationship Goal</h3>
                      <p className="text-muted-foreground">
                        {userData.relationship_goals
                          ? userData.relationship_goals
                              .split(" ")
                              .map((goal, index) => (
                                <span key={index}>{t(`profile1.${goal}`)}</span>
                              ))
                          : "Chưa cập nhật"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedGradientBorder>
          </motion.div>
        </TabsContent>
        <TabsContent value="photos" className="space-y-6">
          <motion.div {...fadeInUp}>
            <AnimatedGradientBorder>
              <Card>
                <CardHeader>
                  <CardTitle>Photos</CardTitle>
                </CardHeader>
                <CardContent>
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
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </AnimatedGradientBorder>
          </motion.div>
        </TabsContent>
        <TabsContent value="personality" className="space-y-6">
          <motion.div {...fadeInUp}>
            <AnimatedGradientBorder>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart className="h-5 w-5" />
                    Personality Compatibility
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {hasPersonalityData ? (
                    <div className="flex flex-col items-center md:flex-row md:items-center md:justify-center gap-2">
                      <PersonalityRadarChart
                        data={userData.personalityTraits.map(
                          ({ trait, value }) => ({
                            trait,
                            value,
                          })
                        )}
                      />
                    </div>
                  ) : (
                    <div className="text-center  py-5">
                      <p className="text-2xl font-semibold text-gray-500">
                        Khám phá bản thân ngay!
                      </p>
                      <span className="inline-block mt-4 max-w-max">
                        <AnimatedGradientBorder
                          variant="button"
                          className="rounded-md px-3 py-1 inline-block w-auto"
                        >
                          <button
                            onClick={() => router.push("/test-personality")}
                            className="bg-transparent text-white text-sm flex items-center gap-1 hover:bg-white/10 whitespace-nowrap rounded-md px-2 py-1"
                            type="button"
                          >
                            <FileText className="h-4 w-4" />
                            Bắt đầu bài kiểm tra
                          </button>
                        </AnimatedGradientBorder>
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </AnimatedGradientBorder>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default ProfilePage;
