"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiLock, FiEye, FiEyeOff } from "react-icons/fi";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | undefined>();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(undefined);
    setBusy(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const json = await res.json();
      if (json?.success) {
        router.replace("/admin");
        router.refresh();
      } else {
        setErr(json?.message ?? "Login failed.");
      }
    } catch {
      setErr("We couldn't reach the server. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} noValidate className="rounded-2xl bg-white p-6 ring-1 ring-gray-200 shadow-[0_18px_50px_-30px_rgba(13,153,255,0.4)]">
      <h1 className="font-display text-xl font-bold text-[#13181E]">Sign in</h1>
      <p className="mt-1 text-sm text-[#4B5154]">Enter your admin credentials.</p>

      <label htmlFor="admin-email" className="mt-5 block text-sm font-semibold text-[#13181E]">Email</label>
      <input
        id="admin-email"
        type="email"
        autoComplete="username"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mt-1.5 w-full rounded-xl border border-gray-300 px-4 py-3 text-base text-[#13181E] focus:outline-none focus:ring-2 focus:ring-[#0D99FF] focus:border-[#0D99FF]"
      />

      <label htmlFor="admin-pass" className="mt-4 block text-sm font-semibold text-[#13181E]">Password</label>
      <div className="relative mt-1.5">
        <input
          id="admin-pass"
          type={show ? "text" : "password"}
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-11 text-base text-[#13181E] focus:outline-none focus:ring-2 focus:ring-[#0D99FF] focus:border-[#0D99FF]"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          {show ? <FiEyeOff aria-hidden /> : <FiEye aria-hidden />}
        </button>
      </div>

      {err && <p role="alert" className="mt-3 text-sm text-red-600">{err}</p>}

      <button
        type="submit"
        disabled={busy}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0D99FF] px-6 py-3 font-semibold text-white transition hover:bg-[#0A7ACC] focus:outline-none focus:ring-2 focus:ring-[#0D99FF] focus:ring-offset-2 disabled:opacity-60 cursor-pointer"
      >
        <FiLock aria-hidden /> {busy ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
