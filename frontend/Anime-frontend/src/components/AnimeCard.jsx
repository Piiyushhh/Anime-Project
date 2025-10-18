import React from "react";
import { useNavigate } from "react-router-dom";
import { Play, Star, Film, Calendar } from "lucide-react";

const AnimeCard = ({ anime, index, view }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/Dashboard/AnimePage/${anime.mal_id}`);
  };

  return (
    <div
      onClick={handleClick}
      className={`group cursor-pointer ${
        view === "list" ? "flex gap-6 items-center" : ""
      }`}
    >
      {/* Poster */}
      <div
        className={`relative overflow-hidden rounded-2xl ${
          view === "grid" ? "" : "w-32 h-48 flex-shrink-0"
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-purple-500/50 rounded-2xl transition-all z-10" />

        <img
          src={
            anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url
          }
          alt={anime.title}
          className={`w-full object-cover transition-transform duration-500 group-hover:scale-110 ${
            view === "grid" ? "h-80" : "h-48"
          }`}
        />

        {/* Rank + Score in Grid View */}
        {view === "grid" && (
          <>
            <div className="absolute top-3 left-3 px-3 py-1 bg-black/60 backdrop-blur-xl rounded-lg text-xs font-bold z-20">
              #{index + 2}
            </div>
            <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 bg-black/60 backdrop-blur-xl rounded-lg text-xs font-bold z-20">
              <Star className="w-3 h-3 text-yellow-400" fill="currentColor" />
              {anime.score}
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20">
              <h3 className="font-bold text-sm mb-2 line-clamp-2">
                {anime.title}
              </h3>
              <div className="flex items-center gap-2 mb-3 text-xs text-white/70">
                <span>{anime.type}</span>
                <span>•</span>
                <span>{anime.episodes || "?"} eps</span>
              </div>
              <button className="w-full py-2 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-purple-500/50 transition-all">
                <Play className="w-4 h-4" fill="white" />
                Watch
              </button>
            </div>
          </>
        )}
      </div>

      {/* List View Details */}
      {view === "list" && (
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <h3 className="font-bold text-lg group-hover:text-purple-400 transition-colors line-clamp-1">
              {anime.title}
            </h3>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-lg text-sm font-bold flex-shrink-0">
              <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
              {anime.score}
            </div>
          </div>
          <p className="text-sm text-white/60 line-clamp-2 mb-3">
            {anime.synopsis}
          </p>
          <div className="flex items-center gap-3 text-sm text-white/50">
            <span className="flex items-center gap-1.5">
              <Film className="w-4 h-4" />
              {anime.type}
            </span>
            <span>•</span>
            <span>{anime.episodes || "?"} episodes</span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {anime.year || "N/A"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnimeCard;
