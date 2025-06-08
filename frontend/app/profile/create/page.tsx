"use client";
import Cookies from "js-cookie";

import type React from "react";
import axios from "axios";
import { addProfile, updateProfile, getProfileByUserId } from "../../axios";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Check,
  Download,
  Sparkles,
  Upload,
  User,
  Wand2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AnimatedGradientBorder } from "@/components/ui-effects/animated-gradient-border";
import { AvatarCreator } from "@/components/profile/avatar-creator";

const steps = [
  { id: "basics", label: "Basic Info" },
  { id: "avatar", label: "Create Avatar" },
  { id: "details", label: "Profile Details" },
  { id: "preferences", label: "Preferences" },
  { id: "review", label: "Review" },
];

export default function ProfileCreationPage() {
  const [profileExisted, setProfileExisted] = useState(false);
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [avatarMethod, setAvatarMethod] = useState<"cartoon" | "ai" | "upload">(
    "cartoon"
  );
  const [avatarImage, setAvatarImage] = useState<string | null>(null);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  useEffect(() => {
    const userId = Cookies.get("userId");
    if (!userId) return;

    const fetchProfile = async () => {
      try {
        const userIdnumber = Number(userId);
        const profile = await getProfileByUserId(userIdnumber);
        setFormData((prev) => ({
          ...prev,
          ...profile,
        }));
        setProfileExisted(true);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          setProfileExisted(false);
          console.log("Profile không tồn tại, chuẩn bị tạo mới.");
        } else {
          console.error("Lỗi khi kiểm tra profile:", error);
        }
      }
    };

    fetchProfile();
  }, []);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    account_name: "",
    age: 25,
    gender: "",
    location: "",
    about_me: "",
    occupation: "",
    education: "",
    height: 175,
    relationship_goals: "",
    avt: "",
    interests: [] as string[],
  });

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit and redirect
      router.push("/feed");
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSliderChange = (name: string, value: number[]) => {
    setFormData({
      ...formData,
      [name]: value[0],
    });
  };

  const handleRadioChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleInterestToggle = (interest: string) => {
    if (formData.interests.includes(interest)) {
      setFormData({
        ...formData,
        interests: formData.interests.filter((i) => i !== interest),
      });
    } else {
      setFormData({
        ...formData,
        interests: [...formData.interests, interest],
      });
    }
  };

  const mockGenerateAiImages = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedImages([
        "/placeholder.svg?height=400&width=400&text=AI+Generated+1",
        "/placeholder.svg?height=400&width=400&text=AI+Generated+2",
        "/placeholder.svg?height=400&width=400&text=AI+Generated+3",
        "/placeholder.svg?height=400&width=400&text=AI+Generated+4",
      ]);
      setIsGenerating(false);
    }, 2000);
  };

  const selectGeneratedImage = (index: number) => {
    setSelectedImage(index);
    setAvatarImage(generatedImages[index]);
  };

  const handleAvatarCreated = (imageUrl: string) => {
    setAvatarImage(imageUrl);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append("file", file);
    formDataUpload.append("upload_preset", "Harmonia");
    formDataUpload.append("cloud_name", "doy9hevnl");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/doy9hevnl/upload",
        {
          method: "POST",
          body: formDataUpload,
        }
      );

      const data = await res.json();
      if (data.secure_url) {
        setAvatarImage(data.secure_url);
        setFormData({
          ...formData,
          avt: data.secure_url,
        });
      } else {
        console.error("Upload thất bại", data);
      }
    } catch (err) {
      console.error("Lỗi khi upload:", err);
    }
  };

  const handleSubmit = async () => {
    const userId = Cookies.get("userId");
    if (!userId) {
      alert("Không tìm thấy userId.");
      return;
    }

    const userIdnumber = Number(userId);

    const {
      id,
      created_at,
      updated_at,
      userId: formUserId,
      ...sanitizedData
    } = formData as any;

    try {
      if (profileExisted) {
        const res = await updateProfile(userIdnumber, sanitizedData);
        console.log("Đã cập nhật profile:", res);
      } else {
        const res = await addProfile(userIdnumber, sanitizedData);
        console.log("Đã tạo profile mới:", res);
      }

      router.push("/feed");
    } catch (error: unknown) {
      console.error("Lỗi khi gửi form:", error);
      if (axios.isAxiosError(error)) {
        alert(
          "Có lỗi xảy ra khi gửi dữ liệu: " +
            (error.response?.data?.message || "Lỗi không xác định")
        );
      } else if (error instanceof Error) {
        alert("Lỗi không phải từ Axios: " + error.message);
      } else {
        alert("Đã xảy ra lỗi không xác định.");
      }
    }
  };

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8 flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/feed">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Feed
          </Link>
        </Button>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create Your Profile</h1>
        <p className="mt-2 text-muted-foreground">
          Let's set up your profile to help you find meaningful connections.
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 
                  ${
                    currentStep >= index
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted bg-background text-muted-foreground"
                  }`}
              >
                {currentStep > index ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span
                className={`mt-2 text-xs ${
                  currentStep >= index
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {step.label}
              </span>
              {index < steps.length - 1 && (
                <div className="absolute left-[calc(50%+2rem)] right-[calc(50%+2rem)] h-[2px] bg-muted" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <AnimatedGradientBorder>
            <Card className="overflow-hidden">
              <CardContent className="p-6">
                {/* Step 1: Basic Info */}
                {currentStep === 0 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold">
                      Basic Information
                    </h2>
                    <p className="text-muted-foreground">
                      Let's start with some basic details about you.
                    </p>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="Your full name"
                          value={formData.name}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div>
                        <Label htmlFor="name">Account Name</Label>
                        <Input
                          id="account_name"
                          name="account_name"
                          placeholder="Your account name"
                          value={formData.account_name}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <Label>Gender</Label>
                        <RadioGroup
                          value={formData.gender}
                          onValueChange={(value) =>
                            handleRadioChange("gender", value)
                          }
                          className="mt-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Male" id="Male-term" />
                            <Label
                              htmlFor="long-Male"
                              className="cursor-pointer"
                            >
                              Male
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Female" id="Female" />
                            <Label htmlFor="Female" className="cursor-pointer">
                              Female
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div>
                        <Label htmlFor="age">Age</Label>
                        <div className="flex items-center gap-4">
                          <Slider
                            id="age"
                            min={18}
                            max={99}
                            step={1}
                            value={[formData.age]}
                            onValueChange={(value) =>
                              handleSliderChange("age", value)
                            }
                            className="flex-1"
                          />
                          <span className="w-12 text-center">
                            {formData.age}
                          </span>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          name="location"
                          placeholder="City, Country"
                          value={formData.location}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Avatar Creation */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold">
                      Create Your Avatar
                    </h2>
                    <p className="text-muted-foreground">
                      Choose how you want to represent yourself.
                    </p>

                    <Tabs
                      value={avatarMethod}
                      onValueChange={(v) => setAvatarMethod(v as any)}
                      className="w-full"
                    >
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="cartoon">
                          Cartoon Avatar
                        </TabsTrigger>
                        <TabsTrigger value="ai">AI Generated</TabsTrigger>
                        <TabsTrigger value="upload">Upload Photo</TabsTrigger>
                      </TabsList>

                      <TabsContent value="cartoon" className="mt-4">
                        <div className="rounded-lg border p-4">
                          <AvatarCreator
                            onAvatarCreated={handleAvatarCreated}
                          />
                        </div>
                      </TabsContent>

                      <TabsContent value="ai" className="mt-4">
                        <div className="rounded-lg border p-4">
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="ai-prompt">
                                Describe yourself
                              </Label>
                              <div className="flex gap-2">
                                <Textarea
                                  id="ai-prompt"
                                  placeholder="Describe how you want your avatar to look (e.g., 'A cartoon portrait of a person with short brown hair, glasses, and a friendly smile')"
                                  value={aiPrompt}
                                  onChange={(e) => setAiPrompt(e.target.value)}
                                  className="flex-1"
                                />
                                <Button
                                  onClick={mockGenerateAiImages}
                                  disabled={!aiPrompt.trim() || isGenerating}
                                  className="self-end"
                                >
                                  {isGenerating ? (
                                    <div className="flex items-center gap-2">
                                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                      <span>Generating...</span>
                                    </div>
                                  ) : (
                                    <>
                                      <Wand2 className="mr-2 h-4 w-4" />
                                      Generate
                                    </>
                                  )}
                                </Button>
                              </div>
                            </div>

                            {generatedImages.length > 0 && (
                              <div>
                                <Label>Select an image</Label>
                                <div className="mt-2 grid grid-cols-2 gap-4 md:grid-cols-4">
                                  {generatedImages.map((img, index) => (
                                    <div
                                      key={index}
                                      className={`relative cursor-pointer overflow-hidden rounded-lg border-2 transition-all ${
                                        selectedImage === index
                                          ? "border-primary ring-2 ring-primary/50"
                                          : "border-muted hover:border-primary/50"
                                      }`}
                                      onClick={() =>
                                        selectGeneratedImage(index)
                                      }
                                    >
                                      <Image
                                        src={
                                          img ||
                                          formData.avt ||
                                          "/placeholder.svg"
                                        }
                                        alt={`Generated avatar ${index + 1}`}
                                        width={150}
                                        height={150}
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
                              </div>
                            )}
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="upload" className="mt-4">
                        <div className="rounded-lg border p-4">
                          <div className="flex flex-col items-center justify-center gap-4">
                            <div className="flex h-40 w-40 items-center justify-center rounded-full bg-muted">
                              {avatarImage ? (
                                <Image
                                  src={
                                    avatarImage ||
                                    formData.avt ||
                                    "/placeholder.svg"
                                  }
                                  alt="Uploaded avatar"
                                  width={160}
                                  height={160}
                                  className="h-full w-full rounded-full object-cover"
                                />
                              ) : (
                                <User className="h-20 w-20 text-muted-foreground" />
                              )}
                            </div>

                            <div className="flex gap-2">
                              <Button variant="outline" asChild>
                                <label className="cursor-pointer">
                                  <Upload className="mr-2 h-4 w-4" />
                                  Upload Photo
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleFileUpload}
                                  />
                                </label>
                              </Button>
                              <Button variant="outline">
                                <Camera className="mr-2 h-4 w-4" />
                                Take Photo
                              </Button>
                            </div>

                            <p className="text-sm text-muted-foreground">
                              Upload a clear photo of your face. This helps
                              others recognize you.
                            </p>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                )}

                {/* Step 3: Profile Details */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold">Profile Details</h2>
                    <p className="text-muted-foreground">
                      Tell us more about yourself.
                    </p>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="about_me">About Me</Label>
                        <Textarea
                          id="about_me"
                          name="about_me"
                          placeholder="Share a bit about yourself, your interests, and what you're looking for..."
                          value={formData.about_me}
                          onChange={handleInputChange}
                          className="min-h-[120px]"
                        />
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <Label htmlFor="occupation">Occupation</Label>
                          <Input
                            id="occupation"
                            name="occupation"
                            placeholder="What do you do?"
                            value={formData.occupation}
                            onChange={handleInputChange}
                          />
                        </div>

                        <div>
                          <Label htmlFor="education">Education</Label>
                          <Input
                            id="education"
                            name="education"
                            placeholder="Highest level of education"
                            value={formData.education}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="height">Height (cm)</Label>
                        <div className="flex items-center gap-4">
                          <Slider
                            id="height"
                            min={140}
                            max={220}
                            step={1}
                            value={[formData.height]}
                            onValueChange={(value) =>
                              handleSliderChange("height", value)
                            }
                            className="flex-1"
                          />
                          <span className="w-12 text-center">
                            {formData.height} cm
                          </span>
                        </div>
                      </div>

                      <div>
                        <Label>Relationship Goals</Label>
                        <RadioGroup
                          value={formData.relationship_goals}
                          onValueChange={(value) =>
                            handleRadioChange("relationship_goals", value)
                          }
                          className="mt-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="long-term" id="long-term" />
                            <Label
                              htmlFor="long-term"
                              className="cursor-pointer"
                            >
                              Long-term Relationship
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="casual" id="casual" />
                            <Label htmlFor="casual" className="cursor-pointer">
                              Casual Dating
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="friendship"
                              id="friendship"
                            />
                            <Label
                              htmlFor="friendship"
                              className="cursor-pointer"
                            >
                              Friendship
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="marriage" id="marriage" />
                            <Label
                              htmlFor="marriage"
                              className="cursor-pointer"
                            >
                              Marriage
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Preferences */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold">Your Interests</h2>
                    <p className="text-muted-foreground">
                      Select interests to help us match you with like-minded
                      people.
                    </p>

                    <div className="space-y-4">
                      <div>
                        <Label>Select your interests (choose at least 3)</Label>
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
                                formData.interests.includes(interest)
                                  ? "default"
                                  : "outline"
                              }
                              size="sm"
                              onClick={() => handleInterestToggle(interest)}
                              className="rounded-full"
                            >
                              {interest}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 5: Review */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold">
                      Review Your Profile
                    </h2>
                    <p className="text-muted-foreground">
                      Make sure everything looks good before finishing.
                    </p>

                    <div className="grid gap-6 md:grid-cols-[200px_1fr]">
                      <div>
                        <div className="overflow-hidden rounded-xl">
                          {avatarImage ? (
                            <Image
                              src={avatarImage || "/placeholder.svg"}
                              alt="Your avatar"
                              width={200}
                              height={200}
                              className="aspect-square object-cover"
                            />
                          ) : (
                            <div className="flex aspect-square w-full items-center justify-center bg-muted">
                              <User className="h-20 w-20 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2 w-full"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Save Avatar
                        </Button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h3 className="text-xl font-semibold">
                            {formData.name}, {formData.age}, {formData.gender}
                          </h3>
                          <p className="text-muted-foreground">
                            {formData.location}
                          </p>
                        </div>

                        <div>
                          <h4 className="font-medium">About Me</h4>
                          <p className="text-muted-foreground">
                            {formData.about_me || "No bio provided"}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium">Occupation</h4>
                            <p className="text-muted-foreground">
                              {formData.occupation || "Not specified"}
                            </p>
                          </div>
                          <div>
                            <h4 className="font-medium">Education</h4>
                            <p className="text-muted-foreground">
                              {formData.education || "Not specified"}
                            </p>
                          </div>
                          <div>
                            <h4 className="font-medium">Height</h4>
                            <p className="text-muted-foreground">
                              {formData.height} cm
                            </p>
                          </div>
                          <div>
                            <h4 className="font-medium">Relationship Goal</h4>
                            <p className="text-muted-foreground">
                              {formData.relationship_goals === "long-term" &&
                                "Long-term Relationship"}
                              {formData.relationship_goals === "casual" &&
                                "Casual Dating"}
                              {formData.relationship_goals === "friendship" &&
                                "Friendship"}
                              {formData.relationship_goals === "marriage" &&
                                "Marriage"}
                            </p>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium">Interests</h4>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {formData.interests.length > 0 ? (
                              formData.interests.map((interest) => (
                                <span
                                  key={interest}
                                  className="rounded-full bg-muted px-2 py-1 text-xs"
                                >
                                  {interest}
                                </span>
                              ))
                            ) : (
                              <p className="text-muted-foreground">
                                No interests selected
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </AnimatedGradientBorder>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="mt-6 flex justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 0}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <AnimatedGradientBorder variant="button">
          <Button
            onClick={
              currentStep === steps.length - 1 ? handleSubmit : handleNext
            }
            className="bg-transparent text-white hover:bg-white/10"
          >
            {currentStep === steps.length - 1 ? (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Complete Profile
              </>
            ) : (
              <>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </AnimatedGradientBorder>
      </div>
    </div>
  );
}
