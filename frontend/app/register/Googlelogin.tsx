"use client";

import { useEffect, useCallback } from "react";
import { loginWithGoogle } from "../axios";
import { useRouter } from "next/navigation";

interface GoogleLoginButtonProps {
  onLoginSuccess: (user: any) => void;
}

export function GoogleLoginButton({ onLoginSuccess }: GoogleLoginButtonProps) {
  const router = useRouter();

  const handleCredentialResponse = useCallback(
    async (response: any) => {
      const idToken = response.credential;
      try {
        const user = await loginWithGoogle(idToken);
        onLoginSuccess(user);
      } catch {
        alert("Đăng nhập Google thất bại!");
      }
    },
    [onLoginSuccess]
  );

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).google) {
      (window as any).google.accounts.id.initialize({
        client_id:
          "664545406075-2c420600s4eh9sp7evlnkme8ri54oh09.apps.googleusercontent.com",
        callback: handleCredentialResponse,
      });

      (window as any).google.accounts.id.renderButton(
        document.getElementById("google-signin-button"),
        { theme: "outline", size: "large" }
      );
    } else {
      console.error("Google Identity Services chưa được load!");
    }
  }, [handleCredentialResponse]);

  return <div id="google-signin-button"></div>;
}

export default function RegisterPage() {
  const router = useRouter();

  const handleGoogleLoginSuccess = (user: any) => {
    console.log("User đăng nhập bằng Google:", user);
    router.push("/profile/create");
  };

  return (
    <div>
      <GoogleLoginButton onLoginSuccess={handleGoogleLoginSuccess} />
    </div>
  );
}
