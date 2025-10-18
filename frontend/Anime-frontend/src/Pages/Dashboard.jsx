import React, { useState, useEffect, useRef } from 'react';
import { Search, Play, Plus, Sparkles, Flame, TrendingUp, Clock, Zap, Grid, List, ChevronDown, Star, Eye, Calendar, Film } from 'lucide-react';
import AnimeCard from '../components/AnimeCard';
import SearchBar from '../components/SearchBar';
import HeroSection from '../components/HeroSection';
import Footer from '../components/Footer';
const Dashboard = () => {
  const [animeData, setAnimeData] = useState({trending: [], popular: [], upcoming: []});
  const [featuredAnime, setFeaturedAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('grid');
  const [activeTab, setActiveTab] = useState('trending');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);
  const heroRef = useRef(null);

  useEffect(() => {
    fetchAnimeData();
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

 const fetchAnimeData = async () => {
  try {
    // Fetching anime data for each category
    const trendingResponse = await fetch('https://api.jikan.moe/v4/top/anime?limit=20&order_by=score&sort=desc');
    const popularResponse = await fetch('https://api.jikan.moe/v4/anime?limit=20&order_by=members&sort=desc');
    const upcomingResponse = await fetch('https://api.jikan.moe/v4/anime?limit=20&status=upcoming');

    // Parsing JSON responses
    const trendingData = await trendingResponse.json();
    const popularData = await popularResponse.json();
    const upcomingData = await upcomingResponse.json();

    // Updating state with fetched data
    setAnimeData({
      trending: trendingData.data || [],
      popular: popularData.data || [],
      upcoming: upcomingData.data || [],
    });
    
    setFeaturedAnime(trendingData.data?.[0] || null);
    setLoading(false);
  } catch (error) {
    console.error('Error fetching anime:', error);
    setLoading(false);
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

  const tabConfig = [
    { id: 'trending', label: 'Trending', icon: Flame },
    { id: 'popular', label: 'Popular', icon: TrendingUp },
    { id: 'recent', label: 'Recent', icon: Clock },
    { id: 'upcoming', label: 'Upcoming', icon: Sparkles }
  ];

  return (
    <div className="relative w-full min-h-screen bg-[#0B0F14] text-white overflow-x-hidden">
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />

      {/* Gradient Orbs */}
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
            <div className="flex items-center gap-3">
              <button className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-medium transition-all">
                Login
              </button>
              <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl font-semibold hover:shadow-xl hover:shadow-purple-500/50 transition-all">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </header>


      <main className="relative z-10">
        {/* Hero Section */}
        
          <HeroSection 
            animeList={animeData.trending.filter((anime, index, self) =>
              index === self.findIndex((a) =>
                a.mal_id === anime.mal_id || (a.title === anime.title && a.year === anime.year)
              )
            ).slice(0, 5)}
          />
        
        
        {/* Content Section */}
        <section className="relative py-16 px-8">
          <div className="max-w-[1800px] mx-auto">
            {/* Tab Navigation */}
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-2">
                {tabConfig.map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg shadow-purple-500/30'
                          : 'text-white/60 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveView('grid')}
                  className={`p-3 rounded-xl transition-all ${
                    activeView === 'grid'
                      ? 'bg-purple-600 text-white'
                      : 'bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setActiveView('list')}
                  className={`p-3 rounded-xl transition-all ${
                    activeView === 'list'
                      ? 'bg-purple-600 text-white'
                      : 'bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Anime Grid */}
           {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin h-16 w-16 border-4 border-purple-500 border-t-transparent rounded-full" />
              </div>
            ) : (
              <div
                className={
                  activeView === "grid"
                    ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
                    : "space-y-4"
                }
              > 

                {animeData[activeTab]?.filter((anime,index,self)=> index === self.findIndex((a)=>
                 a.mal_id === anime.mal_id ||
                (a.title === anime.title && a.year === anime.year)
              )
            ).slice(1).map((anime, index) => (
                  <AnimeCard
                    key={anime.mal_id}
                    anime={anime}
                    index={index}
                    view={activeView}
                  />
                ))}
              </div>
            )}
           </div>
        </section>
      </main>

      <Footer/> 
    </div>
  );
};

export default Dashboard;