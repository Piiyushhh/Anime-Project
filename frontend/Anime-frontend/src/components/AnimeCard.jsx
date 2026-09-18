import React from "react";
import { useNavigate } from "react-router-dom";
import { Play, Star, Film, Calendar, Tv } from "lucide-react";

const AnimeCard = ({ anime, index, view }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/Dashboard/AnimePage/${anime.id}`);
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
          view === "grid" ? "w-full" : "w-32 h-48 flex-shrink-0"
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-purple-500/50 rounded-2xl transition-all z-10" />

        <img
          src={anime.poster}
          alt={anime.title}
          className={`w-full object-cover transition-transform duration-500 group-hover:scale-110 ${
            view === "grid" ? "aspect-[3/4]" : "h-48"
          }`}
        />

        {/* Rank + Score in Grid View */}
        {view === "grid" && (
          <>
            <div className="absolute top-3 left-3 px-3 py-1 bg-black/60 backdrop-blur-xl rounded-lg text-xs font-bold z-20">
              #{index + 2}
            </div>
            {anime.score > 0 && (
              <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 bg-black/60 backdrop-blur-xl rounded-lg text-xs font-bold z-20">
                <Star className="w-3 h-3 text-yellow-400" fill="currentColor" />
                {anime.score}
              </div>
            )}

            {/* SUB/DUB badges */}
            <div className="absolute bottom-3 left-3 flex gap-1.5 z-20">
              {anime.is_sub && (
                <span className="px-2 py-0.5 bg-green-600/80 backdrop-blur-sm rounded text-[10px] font-bold text-white">
                  SUB
                </span>
              )}
              {anime.is_dub && (
                <span className="px-2 py-0.5 bg-blue-600/80 backdrop-blur-sm rounded text-[10px] font-bold text-white">
                  DUB
                </span>
              )}
            </div>

            {/* Hover overlay with details */}
            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20">
              <h3 className="font-bold text-sm mb-1.5 line-clamp-2">
                {anime.title}
              </h3>
              <div className="flex items-center gap-2 mb-2 text-xs text-white/70 flex-wrap">
                {anime.year && <span>{anime.year}</span>}
                {anime.year && anime.episodes_count > 0 && <span>•</span>}
                {anime.episodes_count > 0 && (
                  <span>{anime.episodes_count} eps</span>
                )}
                {anime.status && (
                  <>
                    <span>•</span>
                    <span className={`${
                      anime.status === "Airing" || anime.status === "Currently Airing"
                        ? "text-green-400"
                        : anime.status === "Completed" || anime.status === "Finished Airing"
                        ? "text-blue-400"
                        : "text-yellow-400"
                    }`}>
                      {anime.status}
                    </span>
                  </>
                )}
              </div>
              {/* Genre chips */}
              {anime.terms_by_type?.genre?.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {anime.terms_by_type.genre.slice(0, 2).map((g, i) => (
                    <span key={i} className="px-1.5 py-0.5 bg-white/10 rounded text-[10px] text-white/60">
                      {g}
                    </span>
                  ))}
                </div>
              )}
              <button className="w-full py-2 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-purple-500/50 transition-all">
                <Play className="w-4 h-4" fill="white" />
                Watch
              </button>
            </div>
          </>
        )}
      </div>

      {/* Grid view title below card */}
      {view === "grid" && (
        <div className="mt-2 px-1">
          <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-purple-400 transition-colors">
            {anime.title}
          </h3>
          <div className="flex items-center gap-2 text-xs text-white/50 mt-0.5">
            {anime.year && <span>{anime.year}</span>}
            {anime.episodes_count > 0 && (
              <>
                <span>•</span>
                <span>{anime.episodes_count} eps</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* List View Details */}
      {view === "list" && (
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <h3 className="font-bold text-lg group-hover:text-purple-400 transition-colors line-clamp-1">
              {anime.title}
            </h3>
            {anime.score > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-lg text-sm font-bold flex-shrink-0">
                <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
                {anime.score}
              </div>
            )}
          </div>
          {anime.description && (
            <p className="text-sm text-white/60 line-clamp-2 mb-3">
              {anime.description}
            </p>
          )}
          <div className="flex items-center gap-3 text-sm text-white/50 flex-wrap">
            {anime.status && (
              <span className="flex items-center gap-1.5">
                <Film className="w-4 h-4" />
                {anime.status}
              </span>
            )}
            {anime.episodes_count > 0 && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Tv className="w-4 h-4" />
                  {anime.episodes_count} episodes
                </span>
              </>
            )}
            {anime.year && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {anime.year}
                </span>
              </>
            )}
            {anime.is_sub && (
              <span className="px-2 py-0.5 bg-green-600/30 rounded text-xs text-green-300 font-semibold">SUB</span>
            )}
            {anime.is_dub && (
              <span className="px-2 py-0.5 bg-blue-600/30 rounded text-xs text-blue-300 font-semibold">DUB</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnimeCard;
