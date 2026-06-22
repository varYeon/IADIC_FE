"use client";

import SocialLoginButton from "@/components/auth/login/SocialLoginButton";
import { signInWithGithub, signInWithGoogle, signInWithKakao } from "@/services/auth/login";

export default function SocialLogins() {
  return (
    <div className="flex flex-row justify-center gap-3 sm:flex-col">
      <SocialLoginButton social="kakao" onClick={() => signInWithKakao()} />
      <SocialLoginButton social="github" onClick={() => signInWithGithub()} />
      <SocialLoginButton social="google" onClick={() => signInWithGoogle()} />
    </div>
  );
}
