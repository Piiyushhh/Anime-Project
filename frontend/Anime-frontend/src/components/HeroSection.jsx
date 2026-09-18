// src/components/HeroSection.jsx
import React, { useEffect, useState } from "react";
import { Play, Plus, Sparkles, Star, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroSection = ({ animeList = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/Dashboard/AnimePage/${animeList[currentIndex].id}`);
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
    <section className="relative px-4 md:px-8 pt-6">
      <div className="relative w-full max-w-[1800px] mx-auto h-[460px] md:h-[520px] overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={featuredAnime.background_image || featuredAnime.poster}
            alt={featuredAnime.title}
            className="w-full h-full object-cover"
          />
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F14] via-[#0B0F14]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F14] via-transparent to-[#0B0F14]/80" />
        </div>

        {/* CONTENT */}
        <div className="relative z-10 h-full flex items-end">
          <div className="w-full px-6 md:px-10 lg:px-14 pb-10 md:pb-12">
            <div className="max-w-2xl space-y-4">
              {/* Tags */}
              <div className="flex items-center gap-3 flex-wrap">
                <span className="px-4 py-1.5 bg-purple-600/20 border border-purple-500/30 rounded-full text-sm font-semibold text-purple-300 backdrop-blur-xl">
                  #{currentIndex + 1} TRENDING
                </span>
                {featuredAnime.status && (
                  <span className="px-4 py-1.5 bg-cyan-600/20 border border-cyan-500/30 rounded-full text-sm font-semibold text-cyan-300 backdrop-blur-xl">
                    {featuredAnime.status}
                  </span>
                )}
                {featuredAnime.is_sub && (
                  <span className="px-3 py-1 bg-green-600/20 border border-green-500/30 rounded-full text-xs font-semibold text-green-300">
                    SUB
                  </span>
                )}
                {featuredAnime.is_dub && (
                  <span className="px-3 py-1 bg-blue-600/20 border border-blue-500/30 rounded-full text-xs font-semibold text-blue-300">
                    DUB
                  </span>
                )}
              </div>

              {/* Title */}
              <h2 className="max-w-2xl text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[0.95] line-clamp-3">
                <span className="bg-gradient-to-r from-white via-purple-200 to-cyan-200 text-transparent bg-clip-text">
                  {featuredAnime.title}
                </span>
              </h2>

              {/* Stats */}
              <div className="flex items-center gap-4 md:gap-6 text-base md:text-lg flex-wrap">
                {featuredAnime.score > 0 && (
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400" fill="currentColor" />
                    <span className="font-bold">{featuredAnime.score}</span>
                    <span className="text-white/40">/10</span>
                  </div>
                )}
                {featuredAnime.year && (
                  <>
                    <div className="w-1 h-1 rounded-full bg-white/40" />
                    <span className="text-white/60">{featuredAnime.year}</span>
                  </>
                )}
                {featuredAnime.episodes_count > 0 && (
                  <>
                    <div className="w-1 h-1 rounded-full bg-white/40" />
                    <span className="text-white/60">
                      {featuredAnime.episodes_count} Episodes
                    </span>
                  </>
                )}
                {featuredAnime.rating && (
                  <>
                    <div className="w-1 h-1 rounded-full bg-white/40" />
                    <span className="text-white/60">{featuredAnime.rating}</span>
                  </>
                )}
              </div>

              {/* Description */}
              {featuredAnime.description && (
                <p className="text-base md:text-lg text-white/70 leading-relaxed line-clamp-3 max-w-2xl">
                  {featuredAnime.description}
                </p>
              )}

              {/* Buttons */}
              <div className="flex items-center gap-4 pt-2">
                <button
                  className="group relative px-8 py-4 md:px-10 md:py-5 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl font-bold text-base md:text-lg
              overflow-hidden hover:scale-105 transition-transform"
                  onClick={handleClick}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative flex items-center gap-3">
                    <Play className="w-6 h-6" fill="white" />
                    WATCH NOW
                  </div>
                </button>
                <button className="px-8 py-4 md:px-10 md:py-5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl font-bold text-base md:text-lg hover:bg-white/20 transition-all">
                  <Plus className="w-6 h-6 inline mr-2" />
                  MY LIST
                </button>
                <button className="p-4 md:p-5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl hover:bg-white/20 transition-all">
                  <Sparkles className="w-6 h-6" />
                </button>
              </div>

              {/* Genres */}
              {featuredAnime.terms_by_type?.genre?.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {featuredAnime.terms_by_type.genre.slice(0, 5).map((genre, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg text-sm text-white/70"
                    >
                      {genre}
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
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
