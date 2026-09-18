import Link from "next/link";
import {
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import {
  SiInstagram,
  SiTiktok,
  SiWhatsapp,
  SiX,
} from "@icons-pack/react-simple-icons";

export default function SiteBottom() {
  return (
    <>
      {/* ================= SUPPORT & CONTACT ================= */}

      <section className="px-6 py-10 lg:px-10">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-2xl border border-white/10 bg-[#1B1B1B] p-8">
          {/* Support Header */}

          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#2979FF]/20 text-[#2979FF]">
              <Mail size={28} />
            </div>

            <h2 className="text-2xl font-bold text-white">
              Need Help?
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#AAAAAA]">
              Having trouble watching a movie, opening a series,
              or downloading an episode? Contact AGTIMES and we
              will help you.
            </p>
          </div>

          {/* ================= CONTACT DETAILS ================= */}

          <div className="mx-auto mt-8 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* WhatsApp Group */}

            <a
              href="https://chat.whatsapp.com/J3WZy8GpRpT61LhbugxQBL"
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-xl border border-white/10 bg-[#121212] p-5 transition hover:border-[#25D366] hover:bg-[#25D366]/10"
            >
              <SiWhatsapp
                size={28}
                className="text-[#25D366]"
              />

              <h3 className="mt-3 font-bold text-white">
                Join WhatsApp Group
              </h3>

              <p className="mt-1 text-sm text-[#AAAAAA]">
                Join the AGTIMES community
              </p>
            </a>

            {/* WhatsApp Chat */}

            <a
              href="https://wa.me/250789063094"
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-xl border border-white/10 bg-[#121212] p-5 transition hover:border-[#25D366] hover:bg-[#25D366]/10"
            >
              <SiWhatsapp
                size={28}
                className="text-[#25D366]"
              />

              <h3 className="mt-3 font-bold text-white">
                WhatsApp Chat
              </h3>

              <p className="mt-1 text-sm text-[#AAAAAA]">
                Chat with us
              </p>
            </a>

            {/* Phone */}

            <a
              href="tel:+250789063094"
              className="group rounded-xl border border-white/10 bg-[#121212] p-5 transition hover:border-[#2979FF] hover:bg-[#2979FF]/10"
            >
              <Phone
                size={28}
                className="text-[#2979FF]"
              />

              <h3 className="mt-3 font-bold text-white">
                Call Us
              </h3>

              <p className="mt-1 text-sm text-[#AAAAAA]">
                0789063094
              </p>
            </a>

            {/* Email */}

            <a
              href="mailto:dufitumurengezijotham21@gmail.com"
              className="group rounded-xl border border-white/10 bg-[#121212] p-5 transition hover:border-[#E040FB] hover:bg-[#E040FB]/10"
            >
              <Mail
                size={28}
                className="text-[#E040FB]"
              />

              <h3 className="mt-3 font-bold text-white">
                Email Us
              </h3>

              <p className="mt-1 break-all text-sm text-[#AAAAAA]">
                dufitumurengezijotham21@gmail.com
              </p>
            </a>
          </div>

          {/* ================= LOCATION ================= */}

          <div className="mx-auto mt-4 flex max-w-5xl items-center justify-center gap-2 text-sm text-[#AAAAAA]">
            <MapPin
              size={18}
              className="text-[#2979FF]"
            />

            <span>Rwanda</span>
          </div>

          {/* ================= SOCIAL MEDIA ================= */}

          <div className="mt-8 border-t border-white/10 pt-8 text-center">
            <h3 className="font-bold text-white">
              Follow AGTIMES
            </h3>

            <div className="mt-4 flex flex-wrap justify-center gap-3">
              {/* Instagram */}

              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="AGTIMES Instagram"
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#121212] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                <SiInstagram size={20} />
                Instagram
              </a>

              {/* TikTok */}

              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="AGTIMES TikTok"
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#121212] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                <SiTiktok size={20} />
                TikTok
              </a>

              {/* X */}

              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="AGTIMES X"
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#121212] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                <SiX size={20} />
                X
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}

      <footer className="border-t border-white/10 bg-[#0D0D0D] px-6 py-12 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-3">
          {/* AGTIMES */}

          <div>
            <h2 className="text-2xl font-extrabold tracking-wider">
              <span className="text-[#00E5FF]">AG</span>
              <span className="text-[#E040FB]">TIMES</span>
            </h2>

            <p className="mt-3 max-w-sm text-sm leading-6 text-[#AAAAAA]">
              Your entertainment platform for discovering and
              enjoying movies and series.
            </p>
          </div>

          {/* Quick Links */}

          <div>
            <h3 className="mb-4 font-bold text-white">
              Quick Links
            </h3>

            <div className="space-y-2 text-sm">
              <Link
                href="/"
                className="block text-[#AAAAAA] transition hover:text-white"
              >
                Home
              </Link>

              <Link
                href="/movies"
                className="block text-[#AAAAAA] transition hover:text-white"
              >
                Movies
              </Link>

              <Link
                href="/series"
                className="block text-[#AAAAAA] transition hover:text-white"
              >
                Series
              </Link>

              <Link
                href="/trending"
                className="block text-[#AAAAAA] transition hover:text-white"
              >
                Trending
              </Link>
            </div>
          </div>

          {/* Contact */}

          <div>
            <h3 className="mb-4 font-bold text-white">
              Contact
            </h3>

            <div className="space-y-3 text-sm text-[#AAAAAA]">
              <div className="flex items-center gap-2">
                <MapPin size={17} />
                <span>Rwanda</span>
              </div>

              <a
                href="tel:+250789063094"
                className="flex items-center gap-2 transition hover:text-white"
              >
                <Phone size={17} />
                <span>0789063094</span>
              </a>

              <a
                href="mailto:dufitumurengezijotham21@gmail.com"
                className="flex items-center gap-2 break-all transition hover:text-white"
              >
                <Mail
                  size={17}
                  className="shrink-0"
                />

                <span>
                  dufitumurengezijotham21@gmail.com
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}

        <div className="mx-auto mt-10 max-w-7xl border-t border-white/10 pt-6 text-center">
          <p className="text-xs text-[#666666]">
            © 2026 AGTIMES. All rights reserved.
          </p>

          <p className="mt-2 text-xs text-[#555555]">
            AGTIMES is an entertainment platform.
          </p>
        </div>
      </footer>
    </>
  );
}