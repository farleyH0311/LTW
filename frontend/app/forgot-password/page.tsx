"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AnimatedGradientBorder } from "@/components/ui-effects/animated-gradient-border";
import { sendOtp, verifyOtp, resetPassword } from "../axios";
import Link from "next/link";

import { ArrowLeft, Eye, EyeOff } from "lucide-react";
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const handleSendOtp = async () => {
    if (!email) {
      alert("Please enter your email.");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    if (!newPassword || !confirmPassword) {
      alert("Please enter your new password.");
      return;
    }

    try {
      setIsLoading(true);
      const data = await sendOtp(email);
      alert(data.message || "OTP has been sent to your email.");
      setOtpSent(true);
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to send OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtpAndReset = async () => {
    if (!otp) {
      alert("Please enter the OTP.");
      return;
    }

    try {
      setIsLoading(true);
      await verifyOtp(email, otp);
      await resetPassword(email, newPassword, confirmPassword);
      alert("Password has been updated.");
      router.push("/login");
    } catch (error) {
      alert("Invalid or expired OTP, or failed to reset password.");
    } finally {
      setIsLoading(false);
    }
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
          <h1 className="text-3xl font-bold">Forgot Password</h1>
          <p className="text-muted-foreground">
            Recover access to your account
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
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
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Confirm password</Label>
          </div>
          <div className="relative">
            <Input
              id="confirm_password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
        {!otpSent && (
          <AnimatedGradientBorder variant="button" className="w-full">
            <Button
              onClick={handleSendOtp}
              disabled={isLoading}
              className="w-full bg-transparent text-white hover:bg-white/10"
            >
              {isLoading ? "Sending OTP..." : "Send OTP to Email"}
            </Button>
          </AnimatedGradientBorder>
        )}
        {/* Show OTP input only after OTP is sent */}
        {otpSent && (
          <div className="space-y-4 mt-6">
            <Label htmlFor="otp">Enter OTP</Label>
            <Input
              id="otp"
              type="text"
              placeholder="Enter the OTP you received"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <AnimatedGradientBorder variant="button" className="w-full">
              <Button
                onClick={handleVerifyOtpAndReset}
                disabled={isLoading}
                className="w-full bg-transparent text-white hover:bg-white/10"
              >
                {isLoading
                  ? "Verifying and Resetting..."
                  : "Verify OTP & Reset Password"}
              </Button>
            </AnimatedGradientBorder>
          </div>
        )}
      </div>
    </div>
  );
}
