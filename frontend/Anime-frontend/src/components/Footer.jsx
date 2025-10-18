import React from "react";
import { Twitter, Instagram, Github, Mail, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative mt-20 border-t border-white/10 bg-gradient-to-b from-[#0B0F14]/90 to-[#06080D] backdrop-blur-2xl text-white">
      {/* Floating glow background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="max-w-[1800px] mx-auto px-10 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Column 1 — About */}
        <div>
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-purple-400 via-purple-200 to-cyan-400 text-transparent bg-clip-text">
            AnimeStream
          </h2>
          <p className="mt-4 text-white/70 leading-relaxed">
            Stream your favorite anime, discover new stories, and stay connected
            with the world of anime. Beautifully designed for every otaku ✨
          </p>
        </div>

        {/* Column 2 — Navigation */}
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold text-purple-300 mb-4">
            Quick Links
          </h3>
          <ul className="space-y-2 text-white/70">
            <li className="hover:text-cyan-400 transition-colors cursor-pointer">Home</li>
            <li className="hover:text-cyan-400 transition-colors cursor-pointer">Trending</li>
            <li className="hover:text-cyan-400 transition-colors cursor-pointer">Watchlist</li>
            <li className="hover:text-cyan-400 transition-colors cursor-pointer">Categories</li>
            <li className="hover:text-cyan-400 transition-colors cursor-pointer">About Us</li>
          </ul>
        </div>

        {/* Column 3 — Socials */}
        <div>
          <h3 className="text-lg font-semibold text-purple-300 mb-4">
            Stay Connected
          </h3>
          <p className="text-white/70 mb-4">Follow us on social media</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-cyan-400 transition-colors">
              <Twitter className="w-6 h-6" />
            </a>
            <a href="#" className="hover:text-cyan-400 transition-colors">
              <Instagram className="w-6 h-6" />
            </a>
            <a href="#" className="hover:text-cyan-400 transition-colors">
              <Github className="w-6 h-6" />
            </a>
            <a href="#" className="hover:text-cyan-400 transition-colors">
              <Mail className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-white/10 mx-10" />

      {/* Bottom Bar */}
      <div className="text-center py-6 text-sm text-white/60">
        <p className="flex items-center justify-center gap-2">
          Made with <Heart className="w-4 h-4 text-red-400 fill-red-400" /> by{" "}
          <span className="font-semibold text-cyan-400">AnimeStream Devs</span> ©{" "}
          {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
