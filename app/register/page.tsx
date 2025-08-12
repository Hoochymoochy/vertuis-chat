"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "@/app/lib/user";

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

    const data  = await signUp(email, password);
    setLoading(false);

    if (data) {
      localStorage.setItem("user_id", data?.id ?? "");
      localStorage.setItem("user_email", data?.email ?? "");
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-marble flex items-center justify-center px-4">
      <form
        onSubmit={handleRegister}
        className="bg-black/60 backdrop-blur-md p-8 rounded-2xl border border-gold/30 w-full max-w-sm"
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
          className="w-full bg-gold hover:bg-gold/80 text-black font-bold py-3 rounded-xl transition-colors"
        >
          {loading ? "Registering..." : "Register"}
        </button>

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
