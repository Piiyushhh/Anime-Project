import React, { useState } from "react";
import { Search, Star, Heart, Sparkles } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  // Highlight the matching part of the title
  const highlightMatch = (title, query) => {
    const regex = new RegExp(`(${query})`, "gi");
    return title.replace(regex, "<b>$1</b>");
  };

  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 2) {
      try {
        const { data } = await axios.get(
          `http://localhost:4000/Animestream/search?query=${value}`
        );
        setResults(data.data || []);
      } catch (error) {
        console.error("Search failed:", error);
        setResults([]);
      }
    } else {
      setResults([]);
    }
  };

  const handleSelect = (id) => {
    setQuery("");
    setResults([]);
    navigate(`/Dashboard/AnimePage/${id}`);
  };

  const addToWatchlist = (id) => {
    console.log("Add to watchlist:", id);
    // Here you can implement your watchlist logic
  };

  return (
    <div className="flex-1 max-w-2xl mx-8 relative">
      {/* Search Bar with Glow Effect */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative flex items-center">
          <Search className="absolute left-5 w-5 h-5 text-purple-400" />
          <input
            type="text"
            value={query}
            onChange={handleSearch}
            placeholder="Search thousands of anime, characters, scenes..."
            className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 
                       rounded-2xl text-white placeholder-white/40 
                       focus:outline-none focus:border-purple-500/50 
                       focus:bg-white/10 transition-all"
          />
          <button className="absolute right-2 px-5 py-2 bg-gradient-to-r from-purple-600 to-cyan-600 
                             rounded-xl text-sm font-semibold hover:shadow-lg 
                             hover:shadow-purple-500/50 transition-all">
            <Sparkles className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Dropdown Results */}
      {results.length > 0 && (
        <ul className="absolute left-0 right-0 bg-slate-900 border border-slate-700 
                       rounded-2xl mt-2 max-h-80 overflow-y-auto z-20 shadow-lg">
          {results.map((anime) => (
            <li
              key={anime.id}
              onClick={() => handleSelect(anime.id)}
              className="flex items-start space-x-3 px-4 py-3 cursor-pointer 
                         hover:bg-slate-800 transition-all duration-200 rounded-lg"
            >
              {/* Thumbnail with hover zoom */}
              <img
                src={anime.poster}
                alt={anime.title}
                className="w-12 h-16 object-cover rounded-lg transform hover:scale-105 transition-transform duration-200"
              />

              <div className="flex-1 min-w-0">
                {/* Title with highlighted match */}
                <p
                  className="truncate font-medium text-white"
                  dangerouslySetInnerHTML={{
                    __html: highlightMatch(anime.title, query),
                  }}
                />

                {/* Rating and status */}
                <div className="flex items-center space-x-2 text-xs text-gray-400 mt-0.5">
                  <Star className="h-3 w-3 text-yellow-400" />
                  <span>{anime.score || "N/A"}</span>
                  <span>• {anime.type || "Unknown"} • {anime.episodes || "?"} eps</span>
                  {anime.status && (
                    <span
                      className={`${
                        anime.status === "Airing"
                          ? "text-green-400"
                          : anime.status === "Completed"
                          ? "text-blue-400"
                          : "text-yellow-400"
                      }`}
                    >
                      {anime.status}
                    </span>
                  )}
                </div>

                {/* Genres badges */}
                <div className="flex flex-wrap gap-1 mt-1">
                  {anime.terms_by_type?.genre?.slice(0, 2).map((genre, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-gray-700 px-2 py-0.5 rounded-full text-gray-300"
                    >
                      {genre}
                    </span>
                  ))}
                </div>

                {/* Short synopsis */}
                {anime.description && (
                  <p className="text-xs text-gray-400 truncate mt-1">
                    {anime.description.slice(0, 80)}...
                  </p>
                )}
              </div>

              {/* Watchlist button */}
              <Heart
                className="h-4 w-4 text-red-400 mt-1 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation(); // prevent triggering select
                  addToWatchlist(anime.id);
                }}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
