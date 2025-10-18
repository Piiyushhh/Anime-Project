import React, { useState, useRef, useEffect } from 'react';
import { Play,Zap, Pause, Volume2, VolumeX, Maximize, Settings, SkipForward, SkipBack, Subtitles, Home, Search, Bookmark, User, Menu, X, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import Footer from '../components/Footer';

const AnimeStreamingPage = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [quality, setQuality] = useState('1080p');
  const [currentEpisode, setCurrentEpisode] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(null);
  
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);
  
  // API Data States
  const [animeData, setAnimeData] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [animeId, setAnimeId] = useState(null);
  
  const videoRef = useRef(null);
  const controlsTimeoutRef = useRef(null);
  const containerRef = useRef(null);

  // Get anime ID from URL
  const {id} = useParams();
  useEffect(() => {
  setAnimeId(id || '16498');
}, [id]);

  // Fetch anime data from Jikan API
  useEffect(() => {
    if (!animeId) return;

    const fetchAnimeData = async () => {
    try {
      setLoading(true);

      const { data: animeJson } = await axios.get(`https://api.jikan.moe/v4/anime/${animeId}/full`);
      setAnimeData(animeJson.data);

      const { data: episodesJson } = await axios.get(`https://api.jikan.moe/v4/anime/${animeId}/episodes`);
      setEpisodes(episodesJson.data || []);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const { data: recsJson } = await axios.get(`https://api.jikan.moe/v4/anime/${animeId}/recommendations`);
      setRecommendations(recsJson.data?.slice(0, 12) || []);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching anime data:', error);
      setLoading(false);
    }
  };

    fetchAnimeData();
  }, [animeId]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/Dashboard/AnimePage/${animeData.mal_id}`);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (seconds) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, Math.min(videoRef.current.currentTime + seconds, duration));
    }
  };

  const handleProgressClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    if (videoRef.current) {
      videoRef.current.currentTime = pos * duration;
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const changeSpeed = (speed) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setShowSettings(false);
  };

  const changeQuality = (q) => {
    setQuality(q);
    setShowSettings(false);
  };

  const handleEpisodeSelect = (episodeNum) => {
    setCurrentEpisode(episodeNum);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleVideoEnd = () => {
    if (currentEpisode < episodes.length) {
      handleEpisodeSelect(currentEpisode + 1);
    }
  };

  const formatTime = (time) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  useEffect(() => {
      const handleMouseMove = (e) => {
        setMousePos({ x: e.clientX, y: e.clientY });
      };
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const fetchSeasonEpisodes = async (mal_id) => {
      try {
        const { data } = await axios.get(`https://api.jikan.moe/v4/anime/${mal_id}/episodes`);
        setEpisodes(data.data || []);
        setSelectedSeason(mal_id);
      } catch (error) {
        console.error("Failed to fetch episodes:", error);
      }
    };

      useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
    
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    
        const particles = Array.from({ length: 100 }, () => ({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 3,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.3,
          opacity: Math.random() * 0.5,
          hue: Math.random() > 0.5 ? 270 : 160
        }));
    
        let animationId;
        const animate = () => {
          ctx.fillStyle = 'rgba(3, 8, 13, 1)';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
    
          particles.forEach(p => {
            p.x += p.speedX;
            p.y += p.speedY;
    
            if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
            if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
    
            const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
            gradient.addColorStop(0, `hsla(${p.hue}, 100%, 70%, ${p.opacity})`);
            gradient.addColorStop(1, `hsla(${p.hue}, 100%, 70%, 0)`);
    
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
            ctx.fill();
          });
    
          animationId = requestAnimationFrame(animate);
        };
    
        animate();
        return () => cancelAnimationFrame(animationId);
      }, []);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0B0F14' }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sky-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-300 text-xl">Loading anime data...</p>
        </div>
      </div>
    );
  }

  if (!animeData) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}>
        <p className="text-slate-300 text-xl">Failed to load anime data</p>
      </div>
    );
  }

  return (
  <div className="min-h-screen " style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}>
      {/* Navigation Bar */}
   <div className="fixed top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" 
           style={{ transform: `translate(${mousePos.x * 0.02}px, ${mousePos.y * 0.02}px)` }} />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none"
           style={{ transform: `translate(${-mousePos.x * 0.015}px, ${-mousePos.y * 0.015}px)` }} />

      {/* Header */}
      <header className="relative z-50 sticky top-0 backdrop-blur-2xl bg-[#0B0F14]/80 border-b border-white/5">
        <div className="max-w-[1800px] mx-auto px-8 py-5">
          <div className="flex items-center justify-between gap-8">
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



            {/* Search */}
            <SearchBar />

            {/* Actions */}
            <div className="flex items-center gap-3 mr-2">
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
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Episodes List */}
          <div className="lg:col-span-3 order-2 lg:order-1">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4 sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">
              <h3 className="text-lg font-semibold text-sky-400 mb-4 flex items-center gap-2">
                <Play size={20} />
                Episodes ({episodes.length})
              </h3>
              <div className="space-y-2">
                {episodes.length > 0 ? episodes.map((ep) => (
                  <button
                    key={ep.mal_id}
                    onClick={() => handleEpisodeSelect(ep.mal_id)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      currentEpisode === ep.mal_id
                        ? 'bg-sky-500/20 border border-sky-400 text-sky-300'
                        : 'bg-slate-700/30 hover:bg-slate-700/50 text-slate-300'
                    }`}
                  >
                    <div className="font-medium text-sm mb-1">
                    Episode {ep.mal_id}
                    </div>
                    <div className="text-xs text-slate-400 line-clamp-2">
                      {ep.title || `Episode ${ep.mal_id}`}
                    </div>
                    {ep.filler && (
                      <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded mt-1 inline-block">
                        Filler
                      </span>
                    )}
                  </button>
                )) : (
                  <div className="text-slate-400 text-sm text-center py-4">
                    Episodes data not available
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Center - Video Player and Details */}
          <div className="lg:col-span-9 order-1 lg:order-2 space-y-6">
            {/* Video Player */}
            <div ref={containerRef} className="relative bg-black rounded-xl overflow-hidden shadow-2xl" onMouseMove={handleMouseMove}>
              
              {!isPlaying && (<div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-6 py-2 rounded-full backdrop-blur-md border border-white/10 shadow-lg z-20 text-sm md:text-base font-semibold tracking-wide">
              🎬 Now Playing: <span className="text-sky-400 ml-1">{animeData.title}</span> — 
              <span className="text-purple-400 ml-1">Episode {currentEpisode}</span>
              </div>)}

              <video
                ref={videoRef}
                className="w-full aspect-video"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleVideoEnd}
                src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
              />

              {/* Video Controls Overlay */}
              <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
                {/* Progress Bar */}
                <div className="px-4 py-2">
                  <div 
                    className="w-full h-1 bg-slate-600 rounded-full cursor-pointer hover:h-2 transition-all group"
                    onClick={handleProgressClick}
                  >
                    <div 
                      className="h-full bg-sky-400 rounded-full relative"
                      style={{ width: `${(currentTime / duration) * 100}%` }}
                    >
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-sky-300 rounded-full opacity-0 group-hover:opacity-100"></div>
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between px-4 pb-4">
                  <div className="flex items-center gap-3">
                    <button onClick={togglePlay} className="text-white hover:text-sky-400 transition-colors">
                      {isPlaying ? <Pause size={28} /> : <Play size={28} />}
                    </button>
                    <button onClick={() => handleSeek(-10)} className="text-white hover:text-sky-400 transition-colors">
                      <SkipBack size={22} />
                    </button>
                    <button onClick={() => handleSeek(10)} className="text-white hover:text-sky-400 transition-colors">
                      <SkipForward size={22} />
                    </button>
                    <div className="flex items-center gap-2">
                      <button onClick={toggleMute} className="text-white hover:text-sky-400 transition-colors">
                        {isMuted ? <VolumeX size={22} /> : <Volume2 size={22} />}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="w-20 accent-sky-400"
                      />
                    </div>
                    <span className="text-sm text-slate-300">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button className="text-white hover:text-sky-400 transition-colors">
                      <Subtitles size={22} />
                    </button>
                    <div className="relative">
                      <button 
                        onClick={() => setShowSettings(!showSettings)}
                        className="text-white hover:text-sky-400 transition-colors"
                      >
                        <Settings size={22} />
                      </button>
                      {showSettings && (
                        <div className="absolute bottom-full right-0 mb-2 bg-slate-900 rounded-lg p-3 min-w-[180px] shadow-xl border border-slate-700">
                          <div className="mb-3">
                            <p className="text-xs text-slate-400 mb-2">Speed</p>
                            <div className="space-y-1">
                              {[0.5, 1, 1.25, 1.5, 2].map(speed => (
                                <button
                                  key={speed}
                                  onClick={() => changeSpeed(speed)}
                                  className={`w-full text-left px-3 py-1 rounded text-sm ${playbackSpeed === speed ? 'bg-sky-500 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
                                >
                                  {speed}x
                                </button>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-slate-400 mb-2">Quality</p>
                            <div className="space-y-1">
                              {['1080p', '720p', '480p'].map(q => (
                                <button
                                  key={q}
                                  onClick={() => changeQuality(q)}
                                  className={`w-full text-left px-3 py-1 rounded text-sm ${quality === q ? 'bg-sky-500 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
                                >
                                  {q}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <button onClick={toggleFullscreen} className="text-white hover:text-sky-400 transition-colors">
                      <Maximize size={22} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Seasons Section */}
            {/* --- Seasons Section --- */}
          <div className="mt-8 px-6">
            <h3 className="text-xl font-bold text-purple-400 mb-4">Seasons</h3>
            <div className="flex flex-wrap gap-4">
              {["Season 1", "Season 2", "Season 3"].map((season, index) => (
                <div
                  key={index}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-700/40 to-cyan-600/30 
                            border border-white/10 text-white font-semibold text-center 
                            hover:bg-gradient-to-r hover:from-purple-600/60 hover:to-cyan-500/50 
                            transition-all cursor-pointer"
                >
                  {season}
                </div>
              ))}
            </div>
          </div>


            {/* Anime Info */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <img 
                  src={animeData.images?.jpg?.large_image_url} 
                  alt={animeData.title}
                  className="w-full md:w-48 h-auto rounded-lg shadow-lg"
                />
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-white mb-2">{animeData.title}</h2>
                  <p className="text-slate-400 mb-4">{animeData.title_english || animeData.title_japanese}</p>
                  
                  <div className="flex flex-wrap gap-3 mb-4">
                    <div className="flex items-center gap-2 bg-sky-500/20 px-3 py-1.5 rounded-lg">
                      <span className="text-yellow-400">★</span>
                      <span className="text-sky-300 font-semibold">{animeData.score || 'N/A'}</span>
                    </div>
                    <div className="bg-slate-700/50 px-3 py-1.5 rounded-lg text-slate-300">
                      <span className="text-slate-400">📅</span> {animeData.year || animeData.aired?.prop?.from?.year}
                    </div>
                    <div className="bg-slate-700/50 px-3 py-1.5 rounded-lg text-slate-300">
                      <span className="text-slate-400">📺</span> {animeData.episodes || '?'} Episodes
                    </div>
                    <div className="bg-slate-700/50 px-3 py-1.5 rounded-lg text-slate-300">
                      <span className="text-slate-400">⏱️</span> {animeData.duration || 'N/A'}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-slate-400 mb-2">Genres</h3>
                    <div className="flex flex-wrap gap-2">
                      {animeData.genres?.map((genre) => (
                        <span key={genre.mal_id} className="bg-gradient-to-r from-red-900/50 to-red-800/50 px-3 py-1 rounded-full text-red-200 text-sm">
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-slate-400 mb-2">Studio</h3>
                    <div className="flex flex-wrap gap-2">
                      {animeData.studios?.map((studio) => (
                        <span key={studio.mal_id} className="bg-slate-700/50 px-3 py-1 rounded-lg text-slate-300 text-sm">
                          {studio.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-sky-400 mb-2 flex items-center gap-2">
                  <ChevronRight size={20} />
                  Synopsis
                </h3>
                <p className="text-slate-300 leading-relaxed">{animeData.synopsis}</p>
              </div>
            </div>

            {/* Seasons Selector (if applicable) */}
            {animeData.relations?.filter(r => r.relation === 'Sequel' || r.relation === 'Prequel').length > 0 && (
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
                <h3 className="text-lg font-semibold text-sky-400 mb-4">Related Seasons</h3>
                <div className="flex flex-wrap gap-3">
                  {animeData.relations
                    ?.filter(r => r.relation === 'Sequel' || r.relation === 'Prequel')
                    .flatMap(r => r.entry)
                    .map((season, idx) => (
                      <a
                        key={idx}
                        href={`?id=${season.mal_id}`}
                        className="bg-slate-700/50 hover:bg-sky-500/20 border border-slate-600 hover:border-sky-400 px-4 py-2 rounded-lg text-slate-300 hover:text-sky-300 transition-all"
                      >
                        {season.name}
                      </a>
                    ))}
                </div>
              </div>
            )}

          {/* Recommendations */}
            {recommendations.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-sky-400 mb-4">Recommended Anime</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {recommendations.map((rec) => (
                    <div
                      key={rec.entry.mal_id}
                      className="group cursor-pointer"
                      onClick={() => navigate(`/Dashboard/AnimePage/${rec.entry.mal_id}`)}
                    >
                      <div className="relative overflow-hidden rounded-lg mb-2 shadow-lg">
                        <img
                          src={rec.entry.images?.jpg?.large_image_url}
                          alt={rec.entry.title}
                          className="w-full aspect-[3/4] object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="absolute bottom-0 left-0 right-0 p-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-slate-300">{rec.votes} votes</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <h4 className="text-sm font-medium text-slate-300 group-hover:text-sky-400 transition-colors line-clamp-2">
                        {rec.entry.title}
                      </h4>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
      
      <Footer/>
    </div>
  );
};

export default AnimeStreamingPage;
