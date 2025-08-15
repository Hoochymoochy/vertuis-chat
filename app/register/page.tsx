"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp, signInWithGoogle, signInWithWhatsApp } from "@/app/lib/user";
import Image from "next/image";
import google from "@/public/google.svg";
import whatsapp from "@/public/whatsapp.svg";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await signUp(email, password);
      if (data) {
        localStorage.setItem("user_id", data.id ?? "");
        localStorage.setItem("user_email", data.email ?? "");
        router.push("/");
      }
    } catch (err: any) {
      setError(err.message || "Registration failed");
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
        onSubmit={handleRegister}
        className="bg-black/60 backdrop-blur-md p-8 rounded-2xl border border-gold/30 w-full max-w-sm m-auto flex flex-col items-center"
      >
        <h1 className="text-3xl font-bold text-gold mb-6">Register</h1>

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
          className="w-full bg-gold hover:bg-gold/80 text-black font-bold py-3 rounded-xl transition-colors mb-4"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="text-white text-sm mb-4 text-center">Or sign up with</p>

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
          Already have an account?{" "}
          <a href="/login" className="text-gold hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
