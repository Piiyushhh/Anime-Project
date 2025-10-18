import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Play, 
  Star, 
  Bookmark,
  User,
  ArrowLeft,
  Calendar,
  Eye,
  Heart,
  Share2,
  Download,
  Plus,
  PlayCircle,
  BookOpen,
  Users,
  Award,
  Clock3,
  Tv
} from 'lucide-react';
import { useParams,useNavigate } from 'react-router-dom';
import axios from 'axios';
import SearchBar from '../components/SearchBar';


const SingleAnimeDetailsPage = () => {

  const handleNavigator = ()=>{
    navigate(`/Watch/${id}`);
  }

    //  Add to Watchlist 
const handleAddToWatchlist = async (animeId) => {
  try {
    const res = await fetch("http://localhost:4000/Animestream/WatchList/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({id: animeId }),
    });

    const data = await res.json();
    if (data.success) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500); // hides after 2.5s
    } else {
      alert(data.message || "Something went wrong");
    }
  } catch (err) {
    console.error("Error adding to watchlist:", err);
  }
};

const handleWatchTrailer = () => {
  if (animeData?.trailer?.url) {
    window.open(animeData.trailer.url, '_blank');
  }
  else{
    alert("Trailer not available");
  }

};
  
  const [showToast, setShowToast] = useState(false);
  const { id } = useParams();
  const [animeData, setAnimeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  
  useEffect(() => {
    const fetchAnime = async () => {
      try {
        const { data } = await axios.get(`http://localhost:4000/Animestream/AnimePage/${id}`); // call backend
        setAnimeData(data);
      } catch (error) {
        console.error("Failed to fetch anime:", error);
      } finally {
        setLoading(false);
      }
    };  

    fetchAnime();
  }, [id]);

  if (loading) return <div className="text-white p-10">Loading...</div>;
  if (!animeData) return <div className="text-red-500 p-10">Anime not found.</div>;

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-slate-800 border-b border-slate-700">
        <button className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors" 
        onClick={() => navigate('/Dashboard')}>
          <ArrowLeft size={20} />
          <span>Back to Browse</span>
        </button>
        
        <SearchBar/>

         <div className="flex items-center gap-5 mr-2">
            <button className="relative group flex items-center gap-2 hover:text-cyan-400 transition-all"
              onClick={()=>navigate('/dashboard')}>
              <Home className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
              Home
            </button>

            <button className="relative group flex items-center gap-2 hover:text-purple-400 transition-all"
            onClick={()=>navigate('/Watchlist')}>
              <Bookmark className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
              Watchlist
            </button>

            <button className="relative group flex items-center gap-3  hover:text-pink-400 transition-all">
              <User className="w-5 h-5 text-pink-400 group-hover:scale-110 transition-transform" />
              Profile 
            </button>
            </div>
      </div>

      {/* Main Anime Card */}
      <div className="max-w-7xl mx-auto p-8">
        <div className="bg-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          {/* Hero Section */}
          <div className="relative h-80 overflow-hidden">
            <img
              src={animeData?.images?.jpg?.large_image_url}
              alt={animeData?.title}
              className="w-full h-full object-cover blur-sm scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-800 via-slate-800/60 to-slate-800/20" />
            
            {/* Floating Stats */}
            <div className="absolute top-6 right-6 flex space-x-4">
              <div className="bg-black/50 backdrop-blur-sm px-3 py-2 rounded-lg">
                <div className="flex items-center space-x-1">
                  <Star className="text-yellow-400" size={16} />
                  <span className="font-semibold">{animeData.score}</span>
                </div>
              </div>
              <div className="bg-black/50 backdrop-blur-sm px-3 py-2 rounded-lg">
                <div className="flex items-center space-x-1">
                  <Award className="text-purple-400" size={16} />
                  <span className="font-semibold">#{animeData.rank}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="relative -mt-24 px-8 pb-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Large Poster */}
              <div className="flex-shrink-0">
                <div className="relative group">
                  <img
                    src={animeData?.images?.jpg?.large_image_url}
                    alt={animeData?.title || 'no title'}
                    className="w-80 h-[480px] object-cover rounded-xl shadow-2xl transform group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 rounded-xl transition-colors duration-300 flex items-center justify-center">
                    <PlayCircle className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={64} />
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="flex-1 space-y-6">
                {/* Title Section */}
                <div>
                  <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    {animeData.title}
                  </h1>
                  <div className="flex flex-wrap gap-4 text-lg text-gray-400">
                    <span>{animeData.title_english}</span>
                    <span>•</span>
                    <span>{animeData.title_japanese}</span>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center space-x-2 bg-slate-700 px-4 py-2 rounded-lg">
                    <Star className="text-yellow-400" size={20} />
                    <span className="text-xl font-bold">{animeData.score}</span>
                    <span className="text-gray-400">({animeData.scored_by.toLocaleString()} users)</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 bg-slate-700 px-4 py-2 rounded-lg">
                    <Calendar className="text-blue-400" size={20} />
                    <span>{animeData.year} • {animeData.season}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 bg-slate-700 px-4 py-2 rounded-lg">
                    <Tv className="text-green-400" size={20} />
                    <span>{animeData.episodes} Episodes</span>
                  </div>

                  <div className="flex items-center space-x-2 bg-slate-700 px-4 py-2 rounded-lg">
                    <Clock3 className="text-orange-400" size={20} />
                    <span>{animeData.duration}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-4">
                  <button className="bg-red-600 hover:bg-red-700 px-8 py-4 rounded-xl flex items-center space-x-3 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                  onClick={()=>handleNavigator(id)}>
                    <Play size={24} />
                    <span>Watch Now</span>
                  </button>
                  
                  <button className="bg-slate-700 hover:bg-slate-600 px-6 py-4 rounded-xl flex items-center space-x-2 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                  onClick={()=>handleAddToWatchlist(id)}>
                    <Plus size={24} />
                    <span>Add to Watchlist</span>
                  </button>
                  
                  <button className="bg-slate-700 hover:bg-slate-600 p-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
                    <Heart size={24} />
                  </button>
                  
                  <button className="bg-slate-700 hover:bg-slate-600 p-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
                    <Share2 size={24} />
                  </button>
                  
                  <button className="bg-slate-700 hover:bg-slate-600 p-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
                    <Download size={24} />
                  </button>
                </div>

                {/* Genres and Themes */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-300">Genres</h3>
                    <div className="flex flex-wrap gap-2">
                      {animeData.genres.map((genre, index) => (
                        <span
                          key={index}
                          className="bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/30 px-4 py-2 rounded-full text-sm font-medium hover:from-red-500/30 hover:to-red-600/30 transition-colors cursor-pointer"
                        >
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-300">Themes</h3>
                    <div className="flex flex-wrap gap-2">
                      {animeData.themes.map((theme, index) => (
                        <span
                          key={index}
                          className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 border border-purple-500/30 px-4 py-2 rounded-full text-sm font-medium hover:from-purple-500/30 hover:to-purple-600/30 transition-colors cursor-pointer"
                        >
                          {theme.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleWatchTrailer}
                  className="flex items-center space-x-2 px-6 py-4 
                            bg-gradient-to-r from-slate-700 via-slate-600 to-slate-300
                            hover:from-sky-500 hover:to-sky-400 
                            rounded-xl shadow-lg hover:shadow-sky-400/30 
                            text-white font-semibold text-lg transition-all 
                            duration-300 transform hover:-translate-y-0.5
                            hover:scale-105 active:scale-95"
                >
                  <PlayCircle size={24} className="animate-pulse" />
                  <span>Watch Trailer</span>
              </button>

                {/* Synopsis */}
                <div>
                  <h3 className="text-2xl font-semibold mb-4 flex items-center space-x-2">
                    <BookOpen className="text-blue-400" size={24} />
                    <span>Synopsis</span>
                  </h3>
                  <p className="text-gray-300 leading-relaxed text-lg">{animeData.synopsis}</p>
                </div>
              </div>
            </div>

            {/* Additional Information Grid */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <div className="bg-slate-700/50 p-6 rounded-xl">
                <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">Status</h4>
                <p className="text-white font-semibold text-lg">{animeData.status}</p>
              </div>
              
              <div className="bg-slate-700/50 p-6 rounded-xl">
                <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">Studio</h4>
                <p className="text-white font-semibold text-lg">{animeData.studios[0]?.name}</p>
              </div>
              
              <div className="bg-slate-700/50 p-6 rounded-xl">
                <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">Rating</h4>
                <p className="text-white font-semibold text-lg">{animeData.rating}</p>
              </div>
              
              <div className="bg-slate-700/50 p-6 rounded-xl">
                <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">Popularity</h4>
                <p className="text-white font-semibold text-lg">#{animeData.popularity}</p>
              </div>
              
              <div className="bg-slate-700/50 p-6 rounded-xl">
                <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">Aired</h4>
                <p className="text-white font-semibold text-lg">{animeData.aired.string}</p>
              </div>
              
              <div className="bg-slate-700/50 p-6 rounded-xl">
                <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">Broadcast</h4>
                <p className="text-white font-semibold text-lg">{animeData.broadcast.day}s at {animeData.broadcast.time}</p>
              </div>
              
              <div className="bg-slate-700/50 p-6 rounded-xl">
                <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">Producers</h4>
                <p className="text-white font-semibold text-lg">{animeData.producers[0]?.name}</p>
              </div>
              
              <div className="bg-slate-700/50 p-6 rounded-xl">
                <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">Episodes</h4>
                <p className="text-white font-semibold text-lg">{animeData.episodes}</p>
              </div>
            </div>
          </div>
        </div>
      </div>


      {showToast && (
      <div className="fixed bottom-8 right-8 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3 animate-bounce z-50">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
        <div className="font-semibold text-lg">Added to Watchlist!</div>
        <button
          onClick={() => navigate("/Watchlist")}
          className="ml-4 bg-white text-green-700 font-semibold px-3 py-1 rounded-lg hover:bg-gray-200 transition-all"
        >
          View Now
        </button>
      </div>
    )}
    </div>
  );
};

export default SingleAnimeDetailsPage;