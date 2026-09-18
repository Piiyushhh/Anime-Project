import axios from "axios";
import { AnimeIndex } from "../models/Anime.js";

const fetchDashboard = async (req, res) => {
  try {
    let recentAnimes = [];
    const page = Number(req.query.page) || 1;
    const perPage = 20;

    // Try fetching recent from new API
    try {
      const { data: apiResponse } = await axios.get(
        `https://anikotoapi.site/recent-anime?page=${page}&per_page=${perPage}`
      );

      // API returns: { ok, data: [...], pagination: {...} }
      recentAnimes = Array.isArray(apiResponse?.data) ? apiResponse.data : [];

      // Upsert into AnimeIndex with rich fields
      for (const anime of recentAnimes) {
        if (anime.id) {
          await AnimeIndex.findOneAndUpdate(
            { id: String(anime.id) },
            {
              id: String(anime.id),
              title: anime.title || anime.name,
              alternative: anime.alternative,
              native: anime.native,
              slug: anime.slug,
              poster: anime.poster,
              score: anime.score || 0,
              year: anime.year,
              status: anime.status,
              episodes_count: anime.episodes_count,
              is_sub: anime.is_sub !== undefined,
              is_dub: anime.is_dub !== undefined,
              description: anime.description,
              terms_by_type: anime.terms_by_type,
              background_image: anime.background_image,
              rating: anime.rating,
            },
            { upsert: true, new: true }
          );
        }
      }
    } catch (apiError) {
      console.error("Error fetching from external API, falling back to cache", apiError.message);
    }


    const allCached = (await AnimeIndex.find({}).sort({ updatedAt: -1 }).limit(50)) || [];

    const formatted = allCached.map((anime) => ({
      id: anime.id,
      title: anime.title,
      poster: anime.poster,
      score: anime.score,
      year: anime.year,
      status: anime.status,
      episodes_count: anime.episodes_count,
      is_sub: anime.is_sub,
      is_dub: anime.is_dub,
      description: anime.description,
      terms_by_type: anime.terms_by_type,
      background_image: anime.background_image,
      rating: anime.rating,
    }));

    const trending = [...formatted].sort((a, b) => (b.score || 0) - (a.score || 0)).slice(0, 20);
    const popular = [...formatted].sort((a, b) => (b.score || 0) - (a.score || 0)).slice(0, 20);
    const upcoming = formatted.slice(0, 10);
    const recent = formatted.slice(0, 20);

    res.json({
      upcoming,
      popular,
      recent,
      trending
    });
  } catch (e) {
    console.error(e); s
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
};

export default fetchDashboard;
