// src/components/HeroSection.jsx
import React, { useEffect, useState } from "react";
import { Play, Plus, Sparkles, Star, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroSection = ({ animeList = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/Dashboard/AnimePage/${animeList[currentIndex].mal_id}`);
  };

  useEffect(() => {
    if (!animeList.length) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % animeList.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [animeList]);

  if (!animeList.length) return null;

  const featuredAnime = animeList[currentIndex];

  return (
    <section className="relative w-full min-h-[90vh] flex flex-col justify-center overflow-hidden"> {/* 🔹 raised height + hidden overflow */}
      
      {/* 🔹 BACKGROUND WRAPPER */}
      <div className="absolute inset-0 flex justify-center items-center">
        <img
          src={
            featuredAnime.images?.jpg?.large_image_url ||
            featuredAnime.images?.jpg?.image_url
          }
          alt={featuredAnime.title}
          className="w-[92%] h-[85vh] object-cover rounded-3xl shadow-lg"
        />
        {/* 🔹 Soft gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F14] via-[#0B0F14]/70 to-transparent rounded-3xl" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F14] via-transparent to-[#0B0F14]/80 rounded-3xl" />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 h-full max-w-[1800px] mx-10 my-10 overflow-hidden px-12 flex items-end pb-20">
        <div className="max-w-3xl space-y-6">
          {/* Tags */}
          <div className="flex items-center gap-3">
            <span className="px-4 py-1.5 bg-purple-600/20 border border-purple-500/30 rounded-full text-sm font-semibold text-purple-300 backdrop-blur-xl">
              #{currentIndex + 1} TRENDING
            </span>
            <span className="px-4 py-1.5 bg-cyan-600/20 border border-cyan-500/30 rounded-full text-sm font-semibold text-cyan-300 backdrop-blur-xl">
              {featuredAnime.type}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-6xl md:text-7xl font-black tracking-tight leading-none">
            <span className="bg-gradient-to-r from-white via-purple-200 to-cyan-200 text-transparent bg-clip-text">
              {featuredAnime.title}
            </span>
          </h2>

          {/* Stats */}
          <div className="flex items-center gap-6 text-lg">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" fill="currentColor" />
              <span className="font-bold">{featuredAnime.score}</span>
              <span className="text-white/40">/10</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-white/40" />
            <span className="text-white/60">{featuredAnime.year || "N/A"}</span>
            <div className="w-1 h-1 rounded-full bg-white/40" />
            <span className="text-white/60">
              {featuredAnime.episodes || "?"} Episodes
            </span>
            <div className="w-1 h-1 rounded-full bg-white/40" />
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-white/60" />
              <span className="text-white/60">
                {(featuredAnime.members || 0).toLocaleString()} watching
              </span>
            </div>
          </div>

          {/* Synopsis */}
          <p className="text-lg text-white/70 leading-relaxed line-clamp-3 max-w-2xl">
            {featuredAnime.synopsis}
          </p>

          {/* Buttons */}
          <div className="flex items-center gap-4 pt-4">
            <button
              className="group relative px-10 py-5 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl font-bold text-lg
              overflow-hidden hover:scale-105 transition-transform"
              onClick={handleClick}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex items-center gap-3">
                <Play className="w-6 h-6" fill="white" />
                WATCH NOW
              </div>
            </button>
            <button className="px-10 py-5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all">
              <Plus className="w-6 h-6 inline mr-2" />
              MY LIST
            </button>
            <button className="p-5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl hover:bg-white/20 transition-all">
              <Sparkles className="w-6 h-6" />
            </button>
          </div>

          {/* Genres */}
          {featuredAnime.genres && featuredAnime.genres.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {featuredAnime.genres.slice(0, 5).map((genre) => (
                <span
                  key={genre.mal_id}
                  className="px-4 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg text-sm text-white/70"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* NAV BUTTONS */}
      <button
        className="absolute left-5 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full z-20"
        onClick={() =>
          setCurrentIndex((prev) =>
            prev === 0 ? animeList.length - 1 : prev - 1
          )
        }
      >
        {"<"}
      </button>
      <button
        className="absolute right-5 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full z-20"
        onClick={() =>
          setCurrentIndex((prev) => (prev + 1) % animeList.length)
        }
      >
        {">"}
      </button>
    </section>
  );
};

export default HeroSection;
