
"use client";

import Link from "next/link";
import { useState } from "react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    // Validate name
    if (!cleanName) {
      setError("Please enter your name.");
      return;
    }

    if (cleanName.length < 2) {
      setError("Name must be at least 2 characters.");
      return;
    }

    // Validate email
    if (!cleanEmail) {
      setError("Please enter your email.");
      return;
    }

    // Validate password
    if (!password) {
      setError("Please enter a password.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    // Confirm password
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Registration failed.");
        return;
      }

      // Account created successfully
      window.location.href = "/login";
    } catch (error) {
      console.error("Registration request failed:", error);
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#121212] px-6 py-12 text-[#FFFFFF]">
      <div className="w-full max-w-md">

        {/* Logo */}
        <Link
          href="/"
          className="mx-auto block w-fit text-3xl font-bold"
        >
          <span className="text-[#00E5FF]">AG</span>
          <span className="text-[#E040FB]">TIMES</span>
        </Link>

        {/* Card */}
        <div className="mt-8 rounded-2xl border border-white/10 bg-[#2A2A2A] p-8 shadow-2xl">

          {/* Heading */}
          <div className="text-center">
            <h1 className="text-3xl font-bold">
              Create Account
            </h1>

            <p className="mt-2 text-[#AAAAAA]">
              Join AGTIMES today
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >

            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium"
              >
                Full Name
              </label>

              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                }}
                placeholder="Your name"
                autoComplete="name"
                required
                className="w-full rounded-xl border border-white/10 bg-[#121212] px-4 py-3 text-[#FFFFFF] outline-none placeholder:text-[#AAAAAA] focus:border-[#2979FF]"
              />
            </div>

            {/* Email */}
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
                }}
                placeholder="you@example.com"
                autoComplete="email"
                required
                className="w-full rounded-xl border border-white/10 bg-[#121212] px-4 py-3 text-[#FFFFFF] outline-none placeholder:text-[#AAAAAA] focus:border-[#2979FF]"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="••••••••"
                autoComplete="new-password"
                required
                className="w-full rounded-xl border border-white/10 bg-[#121212] px-4 py-3 text-[#FFFFFF] outline-none placeholder:text-[#AAAAAA] focus:border-[#2979FF]"
              />
            </div>

            {/* Confirm Password */}
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
                }}
                placeholder="••••••••"
                autoComplete="new-password"
                required
                className="w-full rounded-xl border border-white/10 bg-[#121212] px-4 py-3 text-[#FFFFFF] outline-none placeholder:text-[#AAAAAA] focus:border-[#2979FF]"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#2979FF] px-6 py-3.5 font-semibold text-white transition hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

          </form>

          {/* Login */}
          <p className="mt-6 text-center text-sm text-[#AAAAAA]">
            Already have an account?{" "}

            <Link
              href="/login"
              className="font-semibold text-[#00E5FF] hover:text-[#E040FB]"
            >
              Sign In
            </Link>
          </p>

        </div>

        {/* Back */}
        <Link
          href="/"
          className="mt-6 block text-center text-sm text-[#AAAAAA] hover:text-[#FFFFFF]"
        >
          ← Back to AGTIMES
        </Link>

      </div>
    </main>
  );
}

