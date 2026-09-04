"use client";

import Link from "next/link";

interface SidebarProps {
  open: boolean;
  setOpen: (value: boolean) => void;
}

export default function Sidebar({
  open,
  setOpen,
}: SidebarProps) {
  return (
    <div className="relative z-[1000]">
      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-0 bg-black/70"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-10 flex h-screen w-64 flex-col
          border-r border-white/10 bg-[#121212] px-5 py-6
          transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Logo */}
        <div className="mb-10 px-3">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="text-2xl font-extrabold tracking-wider"
          >
            <span className="text-[#00E5FF]">
              AG
            </span>

            <span className="text-[#E040FB]">
              TIMES
            </span>
          </Link>

          <p className="mt-1 text-xs text-[#AAAAAA]">
            Entertainment platform
          </p>
        </div>

        {/* Menu */}
        <div>
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-[#AAAAAA]">
            Menu
          </p>

          <nav className="space-y-1">
            <Link
              href="/#top"
              onClick={() => setOpen(false)}
              className="flex items-center gap-4 rounded-lg bg-[#2979FF] px-3 py-3 text-sm font-medium text-white transition hover:brightness-110"
            >
              <span>🏠</span>
              Home
            </Link>

            <Link
              href="/movies"
              onClick={() => setOpen(false)}
              className="flex items-center gap-4 rounded-lg px-3 py-3 text-sm text-[#AAAAAA] transition hover:bg-[#2A2A2A] hover:text-[#FFFFFF]"
            >
              <span>🎬</span>
              Movies
            </Link>

            <Link
              href="/series"
              onClick={() => setOpen(false)}
              className="flex items-center gap-4 rounded-lg px-3 py-3 text-sm text-[#AAAAAA] transition hover:bg-[#2A2A2A] hover:text-[#FFFFFF]"
            >
              <span>📺</span>
              Series
            </Link>

            <Link
              href="/trending"
              onClick={() => setOpen(false)}
              className="flex items-center gap-4 rounded-lg px-3 py-3 text-sm text-[#AAAAAA] transition hover:bg-[#2A2A2A] hover:text-[#FFFFFF]"
            >
              <span>🔥</span>
              Trending
            </Link>

            <Link
              href="/favorites"
              onClick={() => setOpen(false)}
              className="flex items-center gap-4 rounded-lg px-3 py-3 text-sm text-[#AAAAAA] transition hover:bg-[#2A2A2A] hover:text-[#FFFFFF]"
            >
              <span>❤️</span>
              Favorites
            </Link>
          </nav>
        </div>

        {/* Categories */}
        <div className="mt-8">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-[#AAAAAA]">
            Categories
          </p>

          <nav className="space-y-1">
            <Link
              href="/category/action"
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm text-[#AAAAAA] transition hover:bg-[#2A2A2A] hover:text-[#FFFFFF]"
            >
              Action
            </Link>

            <Link
              href="/category/comedy"
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm text-[#AAAAAA] transition hover:bg-[#2A2A2A] hover:text-[#FFFFFF]"
            >
              Comedy
            </Link>

            <Link
              href="/category/drama"
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm text-[#AAAAAA] transition hover:bg-[#2A2A2A] hover:text-[#FFFFFF]"
            >
              Drama
            </Link>

            <Link
              href="/category/scifi"
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm text-[#AAAAAA] transition hover:bg-[#2A2A2A] hover:text-[#FFFFFF]"
            >
              Sci-Fi
            </Link>

            <Link
              href="/category/horror"
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm text-[#AAAAAA] transition hover:bg-[#2A2A2A] hover:text-[#FFFFFF]"
            >
              Horror
            </Link>
          </nav>
        </div>

        {/* Settings */}
        <div className="mt-auto border-t border-white/10 pt-4">
          <Link
            href="/settings"
            onClick={() => setOpen(false)}
            className="block rounded-lg px-3 py-3 text-sm text-[#AAAAAA] transition hover:bg-[#2A2A2A] hover:text-[#FFFFFF]"
          >
            ⚙️ Settings
          </Link>
        </div>
      </aside>

      {/* Toggle button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close sidebar" : "Open sidebar"}
        className="fixed left-4 top-4 z-20 flex h-11 w-11
          items-center justify-center rounded-lg
          bg-[#2979FF] text-xl text-white shadow-2xl
          transition hover:brightness-110 active:scale-95"
      >
        {open ? "✕" : "☰"}
      </button>
    </div>
  );
}