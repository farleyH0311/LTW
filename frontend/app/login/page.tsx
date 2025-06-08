"use client";
import { initSocket } from "../socket";
import Cookies from "js-cookie";
import type React from "react";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Github,
  ChromeIcon as Google,
} from "lucide-react";
import { login } from "../axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { AnimatedGradientBorder } from "@/components/ui-effects/animated-gradient-border";
import { GoogleLoginButton } from "../register/Googlelogin";
export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await login(formData);
      console.log("Phản hồi từ backend:", response);

      const userId = response?.userId;
      const accessToken = response?.accessToken;
      localStorage.setItem("accessToken", accessToken);
      Cookies.set("userId", userId, { expires: 7 });
      const socket = initSocket(accessToken); // dùng accessToken
      socket.connect(); // kết nối socket

      if (userId) {
        router.push(`/feed?`);
      } else {
        console.error("Không tìm thấy userId trong phản hồi.");
        alert("Đã xảy ra lỗi: Không tìm thấy userId.");
      }
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
    router.push("/feed");
  };
  return (
    <div className="container flex h-screen max-w-screen-xl items-center justify-center">
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
          <h1 className="text-4xl font-bold">Welcome Back</h1>
          <p className="mt-2 text-muted-foreground">
            Sign in to your account to continue your journey
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
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
          </div>

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

          <AnimatedGradientBorder variant="button" className="w-full">
            <Button
              type="submit"
              className="w-full bg-transparent text-white hover:bg-white/10"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </AnimatedGradientBorder>

          <div className="mt-4 text-center text-sm space-y-2">
            <p>
              Don't have an account?{" "}
              <Link
                href="/register"
                className="font-medium text-primary hover:underline"
              >
                Sign up
              </Link>
            </p>
            <p>
              <Link
                href="/forgot-password"
                className="text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
