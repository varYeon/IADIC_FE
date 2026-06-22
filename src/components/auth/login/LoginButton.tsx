"use client";

import { LogIn, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/common/Button";
import { createClient } from "@/utils/supabase/client";

export default function LoginButton() {
  const supabase = createClient();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(false);
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      setIsLoggedIn(!!data.user);
    };

    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session?.user);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);
  if (isLoggedIn === null) {
    return (
      <Button variant="tertiary" className="w-full" size="md" disabled>
        <LogIn size={16} />
        확인 중
      </Button>
    );
  }
  if (!isLoggedIn) {
    return (
      <Button variant="tertiary" className="w-full" size="md" onClick={() => (window.location.href = "/login")}>
        <LogIn size={16} />
        로그인
      </Button>
    );
  }
  return (
    <Button
      variant="tertiary"
      className="w-full"
      size="md"
      onClick={async () => {
        await supabase.auth.signOut();
        window.location.reload();
      }}
    >
      <LogOut size={16} />
      로그아웃
    </Button>
  );
}
