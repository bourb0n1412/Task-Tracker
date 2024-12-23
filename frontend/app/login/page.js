"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../components/firebase";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user) {
        console.log("User Info:", user);
        router.push("/");
      }
    } catch (error) {
      console.error("Fehler beim Anmelden:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("Benutzer bereits angemeldet:", user);
        router.push("/");
      }
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 animate-gradient">
      <div className="bg-white/90 p-10 rounded-lg shadow-lg text-center transform hover:scale-105 transition-transform duration-500 ease-in-out w-full max-w-md">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">
          Willkommen zum Task Tracker
        </h1>
        <p className="text-gray-600 mb-10 text-lg">
          Verwalte deine Aufgaben effizient und behalte den Überblick. Melde
          dich an, um zu starten!
        </p>
        <button
          onClick={handleLogin}
          className="flex items-center justify-center mx-auto bg-white text-gray-600 border border-gray-300 px-6 py-3 rounded-full shadow hover:shadow-md transition-all duration-300 ease-in-out hover:bg-gray-100"
        >
          <img
            src="google-icon.png"
            alt="Google Logo"
            className="w-6 h-6 mr-3"
          />
          <span className="flex-1 text-center">Sign up with Google</span>
        </button>
      </div>
      <style jsx global>{`
        @keyframes gradient {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient {
          animation: gradient 8s ease infinite;
          background-size: 200% 200%;
        }
      `}</style>
    </div>
  );
}
