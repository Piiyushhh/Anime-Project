import React, { useState, useEffect } from "react";
import { Zap, Home, Search, Bookmark, User, Trash2, Play, Star, Calendar, Tv } from "lucide-react";
import SearchBar from "../components/SearchBar";
import axios from "axios";

const AnimeWatchlistPage = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Fetch watchlist from backend
  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const { data } = await axios.get("http://localhost:4000/Animestream/WatchList/get");
        setWatchlist(data);
      } catch (err) {
        console.error("Error fetching watchlist:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWatchlist();
  }, []);

  // 🗑️ Remove anime from watchlist
  const handleRemove = async (animeId) => {
    try {
      setRemovingId(animeId);
      const { data } = await axios.delete(`http://localhost:4000/Animestream/WatchList/${animeId}`);

      if (data.success) {
        setWatchlist((prev) => prev.filter((anime) => anime.id !== animeId));
      }
    } catch (err) {
      console.error("Error removing from watchlist:", err);
    } finally {
      setRemovingId(null);
    }
  };

  // ▶️ Handle watch button (navigate to anime)
  const handleWatch = (animeId) => {
    window.location.href = `/Watch/${animeId}`;
  };

  // 🎨 Mouse movement effect (optional aesthetic)
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // 🌀 Loading state
  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)" }}
      >
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sky-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-300 text-xl">Loading your watchlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)" }}
    >
      {/* Background Lights */}
      <div
        className="fixed top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"
        style={{ transform: `translate(${mousePos.x * 0.02}px, ${mousePos.y * 0.02}px)` }}
      />
      <div
        className="fixed bottom-0 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none"
        style={{ transform: `translate(${-mousePos.x * 0.015}px, ${-mousePos.y * 0.015}px)` }}
      />

      {/* Header */}
      <header className="relative z-50 sticky top-0 backdrop-blur-2xl bg-[#0B0F14]/80 border-b border-white/5">
        <div className="max-w-[1800px] mx-auto px-8 py-5 flex items-center justify-between gap-8">
          {/* Logo */}
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl blur-lg opacity-70 group-hover:opacity-100 transition-opacity" />
              <div className="relative w-12 h-12 bg-gradient-to-br from-purple-600 via-purple-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Zap className="w-7 h-7 text-white" fill="white" />
              </div>
            </div>

            <div>
              <h1 className="text-2xl font-black tracking-tighter bg-gradient-to-r from-purple-400 via-purple-300 to-cyan-400 text-transparent bg-clip-text">
                AnimeStream
              </h1>
              <p className="text-xs text-purple-400/60 tracking-wide">ANIME HUB</p>
            </div>
          </div>

          {/* Search Bar */}
          <SearchBar />

          {/* Actions */}
          <div className="flex items-center gap-3 mr-2">
            <button
              onClick={() => (window.location.href = "/dashboard")}
              className="relative group flex items-center gap-2 hover:text-cyan-400 transition-all"
            >
              <Home className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
              Home
            </button>

            <button className="relative group flex items-center gap-2 text-purple-400">
              <Bookmark className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Watchlist
            </button>

            <button className="relative group flex items-center gap-3 hover:text-pink-400 transition-all">
              <User className="w-5 h-5 text-pink-400 group-hover:scale-110 transition-transform" />
              Profile
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">My Watchlist</h1>
          <p className="text-slate-400">
            {watchlist.length} {watchlist.length === 1 ? "anime" : "anime"} saved for later
          </p>
        </div>

        {/* Empty State */}
        {watchlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-full p-8 mb-6">
              <Bookmark size={64} className="text-slate-600" />
            </div>
            <h2 className="text-2xl font-semibold text-white mb-2">Your watchlist is empty</h2>
            <p className="text-slate-400 mb-6 text-center max-w-md">
              Start adding anime to your watchlist to keep track of what you want to watch.
            </p>
            <a
              href="/dashboard"
              className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Browse Anime
            </a>
          </div>
        ) : (
          /* Watchlist Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {watchlist.map((anime) => (
              <div
                key={anime.id}
                className={`bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden transition-all duration-300 hover:border-sky-400/50 hover:shadow-lg hover:shadow-sky-400/20 ${
                  removingId === anime.id ? "opacity-50 scale-95" : "opacity-100 scale-100"
                }`}
              >
                <div className="relative group">
                  <img
                    src={anime.poster}
                    alt={anime.title}
                    className="w-full h-72 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button
                        onClick={() => handleWatch(anime.id)}
                        className="bg-sky-500 hover:bg-sky-600 text-white p-4 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-300 shadow-lg"
                      >
                        <Play size={28} fill="currentColor" />
                      </button>
                    </div>
                  </div>
                  {anime.score && (
                    <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-sm px-3 py-1.5 rounded-lg flex items-center gap-1">
                      <Star size={16} className="text-yellow-400" fill="currentColor" />
                      <span className="text-white font-semibold">{anime.score}</span>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 hover:text-sky-400 transition-colors">
                    {anime.title}
                  </h3>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {anime.year && (
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <Calendar size={14} />
                        <span>{anime.year}</span>
                      </div>
                    )}
                    {(anime.episodes_count || anime.episodes?.length) && (
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <Tv size={14} />
                        <span>{anime.episodes_count || anime.episodes?.length} eps</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {anime.terms_by_type?.genre?.slice(0, 3).map((genre, idx) => (
                      <span
                        key={idx}
                        className="bg-gradient-to-r from-red-900/40 to-red-800/40 px-2 py-1 rounded text-red-200 text-xs"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleWatch(anime.id)}
                      className="flex-1 bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <Play size={18} />
                      Watch Now
                    </button>
                    <button
                      onClick={() => handleRemove(anime.id)}
                      className="bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 px-4 py-2 rounded-lg transition-colors border border-red-500/30 hover:border-red-400/50"
                      title="Remove from watchlist"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnimeWatchlistPage;
