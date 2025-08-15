"use client";

import { useState } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Image from "next/image";
import google from "@/public/google.svg";
import whatsapp from "@/public/whatsapp.svg";
import { signInWithGoogle, signInWithWhatsApp } from "@/app/lib/user";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const data = await signInWithGoogle();
      if (data) {
        localStorage.setItem("user_id", data.id ?? "");
        localStorage.setItem("user_email", data.email ?? "");
        router.push("/");
      }
    } catch (err: any) {
      setError(err.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppLogin = async () => {
    setLoading(true);
    try {
      const data = await signInWithWhatsApp();
      if (data) {
        localStorage.setItem("user_id", data.id ?? "");
        localStorage.setItem("user_email", data.email ?? "");
        router.push("/");
      }
    } catch (err: any) {
      setError(err.message || "WhatsApp login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-marble bg-cover bg-no-repeat bg-center min-h-screen w-full flex flex-col px-4 py-6 relative overflow-hidden">
      <form
        onSubmit={handleLogin}
        className="bg-black/60 backdrop-blur-md p-8 rounded-2xl border border-gold/30 w-full max-w-sm m-auto flex flex-col items-center"
      >
        <h1 className="text-3xl font-bold text-white mb-6">Login</h1>

        {error && <p className="text-red-400 mb-4">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-4 py-3 rounded-xl bg-black/60 text-white placeholder-gold border border-gold focus:outline-none focus:ring-2 focus:ring-gold"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 px-4 py-3 rounded-xl bg-black/60 text-white placeholder-gold border border-gold focus:outline-none focus:ring-2 focus:ring-gold"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full text-gold font-bold py-3 rounded-xl border border-gold hover:bg-gold/20 transition mb-4"
        >
          {loading ? "Logging in..." : "Enter"}
        </button>

        <p className="text-white text-sm mb-4 text-center">Or login with</p>

        <div className="flex gap-4 mb-4">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 border border-gold rounded-xl hover:bg-gold/20 transition"
          >
            <Image src={google} alt="Google" width={20} height={20} />
            Google
          </button>

          <button
            type="button"
            onClick={handleWhatsAppLogin}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 border border-gold rounded-xl hover:bg-gold/20 transition"
          >
            <Image src={whatsapp} alt="WhatsApp" width={20} height={20} />
            WhatsApp
          </button>
        </div>

        <p className="text-white text-sm mt-4 text-center">
          Don’t have an account?{" "}
          <a href="/register" className="text-gold hover:underline">
            Register
          </a>
        </p>
      </form>
    </div>
  );
}
