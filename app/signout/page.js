"use client";

import { useEffect } from "react";
import { signOut, auth } from "../../lib/firebase";
import { useRouter } from "next/navigation";

const SignOutPage = () => {
  const router = useRouter();

  useEffect(() => {
    const handleSignOut = async () => {
      try {
        await signOut(auth);
        router.push("/");
      } catch (error) {
        console.error("Sign out error:", error);
      }
    };
    handleSignOut();
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl mb-4">Signing Out...</h1>
      <p>Please wait while we sign you out.</p>
    </div>
  );
};

export default SignOutPage;
