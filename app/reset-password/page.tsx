"use client";

import Link from "next/link";
import { useState } from "react";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setMessage("");
    setError("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setError("Please enter your email.");
      return;
    }

    if (!password) {
      setError("Please enter your new password.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: cleanEmail,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to reset password.");
        return;
      }

      setMessage("Password reset successfully. You can now sign in.");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Password reset failed:", error);
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#121212] px-6 py-12 text-[#FFFFFF]">
      <div className="w-full max-w-md">

        <Link
          href="/"
          className="mx-auto block w-fit text-3xl font-bold"
        >
          <span className="text-[#00E5FF]">AG</span>
          <span className="text-[#E040FB]">TIMES</span>
        </Link>

        <div className="mt-8 rounded-2xl border border-white/10 bg-[#2A2A2A] p-8 shadow-2xl">

          <div className="text-center">
            <h1 className="text-3xl font-bold">
              Reset Password
            </h1>

            <p className="mt-2 text-[#AAAAAA]">
              Create a new password for your account.
            </p>
          </div>

          {error && (
            <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {message && (
            <div className="mt-6 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400">
              {message}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                  setMessage("");
                }}
                placeholder="you@example.com"
                required
                disabled={loading}
                className="w-full rounded-xl border border-white/10 bg-[#121212] px-4 py-3 text-[#FFFFFF] outline-none placeholder:text-[#AAAAAA] focus:border-[#2979FF] disabled:opacity-60"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium"
              >
                New Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                  setMessage("");
                }}
                placeholder="Enter new password"
                required
                disabled={loading}
                className="w-full rounded-xl border border-white/10 bg-[#121212] px-4 py-3 text-[#FFFFFF] outline-none placeholder:text-[#AAAAAA] focus:border-[#2979FF] disabled:opacity-60"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium"
              >
                Confirm Password
              </label>

              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError("");
                  setMessage("");
                }}
                placeholder="Confirm new password"
                required
                disabled={loading}
                className="w-full rounded-xl border border-white/10 bg-[#121212] px-4 py-3 text-[#FFFFFF] outline-none placeholder:text-[#AAAAAA] focus:border-[#2979FF] disabled:opacity-60"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#2979FF] px-6 py-3.5 font-semibold text-white transition hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Resetting Password..." : "Reset Password"}
            </button>

          </form>

          <p className="mt-6 text-center text-sm text-[#AAAAAA]">
            Remember your password?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#00E5FF] hover:text-[#E040FB]"
            >
              Back to Login
            </Link>
          </p>

        </div>

      </div>
    </main>
  );
}