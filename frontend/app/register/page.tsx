"use client";
import { initSocket } from "../socket";

import Cookies from "js-cookie";
import type React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Github,
  ChromeIcon as Google,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { AnimatedGradientBorder } from "@/components/ui-effects/animated-gradient-border";
import { register, verifyOtp } from "../axios";
import { GoogleLoginButton } from "./Googlelogin";
export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    cf_password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.cf_password) {
      alert("Mật khẩu không khớp!");
      return;
    }

    try {
      const response = await register(formData);
      const userId = response.userId;
      Cookies.set("userId", userId, { expires: 7 });
      console.log("Phản hồi từ backend:", response);
      setEmail(formData.email);
      setShowOtpPanel(true);
    } catch (error: unknown) {
      console.error("Lỗi khi gửi form:", error);

      if (axios.isAxiosError(error)) {
        console.error(
          "Chi tiết lỗi Axios:",
          error.response?.data || error.message
        );
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

  const [otpValue, setOtpValue] = useState("");
  const [showOtpPanel, setShowOtpPanel] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmitOtp = async (email: string, otpValue: string) => {
    try {
      const result = await verifyOtp(email, otpValue);
      console.log("Kết quả xác thực OTP:", result);
      alert("OTP xác thực thành công!");

      router.push("/profile/create");
    } catch (error) {
      alert("OTP không hợp lệ hoặc đã hết hạn.");
    }
  };

  const handleGoogleLoginSuccess = (user: any) => {
    console.log("User đăng nhập bằng Google:", user);
    const token = localStorage.getItem("accessToken");
    // console.log("token", token);
    if (token) {
      const socket = initSocket(token);
      if (socket && socket.connected) {
        //console.log("Socket đã kết nối rồi");
      } else {
        socket.connect();
      }
    } else {
      console.error("Không tìm thấy accessToken trong localStorage!");
    }
    Cookies.set("userId", user.id, { expires: 7 });
    router.push("/profile/create");
  };
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="absolute top-4 left-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>

      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Create Your Account</h1>
          <p className="mt-2 text-muted-foreground">
            Let's start with the basics to set up your profile.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="cf_password"
                  name="cf_password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.cf_password}
                  onChange={handleInputChange}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>
          </div>
          {showOtpPanel && (
            <div className="mt-4 p-4 border rounded ">
              <Label htmlFor="password">
                {" "}
                Please enter the OTP that was sent to your email
              </Label>
              <input
                type="text"
                value={otpValue}
                onChange={(e) => setOtpValue(e.target.value)}
                placeholder="Mã OTP"
                className="p-2 border rounded w-full mb-2"
              />

              <AnimatedGradientBorder variant="button">
                <Button
                  onClick={() => handleSubmitOtp(email, otpValue)}
                  className="bg-transparent text-white text-center hover:bg-white/10"
                >
                  CONFIRM
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </AnimatedGradientBorder>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">
              OR CONTINUE WITH
            </span>
            <Separator className="flex-1" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" type="button" className="w-full">
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </Button>
            <GoogleLoginButton onLoginSuccess={handleGoogleLoginSuccess} />
          </div>

          <div className="flex justify-between">
            <Button variant="outline" type="button" asChild>
              <Link href="/login">Cancel</Link>
            </Button>
            <AnimatedGradientBorder variant="button">
              <Button
                type="submit"
                className="bg-transparent text-white hover:bg-white/10"
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </AnimatedGradientBorder>
          </div>
        </form>

        <div className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-primary hover:underline"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
