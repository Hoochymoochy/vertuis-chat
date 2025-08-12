"use client";

import { useState } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { addUser } from "@/app/lib/user";

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

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      router.push("/"); // send them home
    }
  };

  return (
    <div className="min-h-screen bg-marble flex items-center justify-center px-4">
      <form
        onSubmit={handleLogin}
        className="bg-black/60 backdrop-blur-md p-8 rounded-2xl border border-gold/30 w-full max-w-sm"
      >
        <h1 className="text-3xl font-bold text-gold mb-6">Login</h1>

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
          {loading ? "Logging in..." : "Login"}
        </button>

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
