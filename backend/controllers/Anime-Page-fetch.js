import axios from "axios";
import { AnimeDetail, AnimeIndex } from "../models/Anime.js";

const fetchAnimeById = async (req, res) => {
  try {
    const { id } = req.params;

    console.log(`[AnimePage] Fetching anime with id: ${id}`);
    const cachedAnime = await AnimeDetail.findOne({
      id: String(id)
    });

    const ONE_DAY = 24 * 60 * 60 * 1000;

    if (
      cachedAnime &&
      Date.now() - new Date(cachedAnime.cachedAt).getTime() < ONE_DAY
    ) {
      console.log(`[AnimePage] Cache hit for id: ${id}`);
      return res.json(cachedAnime);
    }

    console.log(
      `[AnimePage] Cache miss, fetching from https://anikotoapi.site/series/${id}`
    );

    const { data: apiResponse } = await axios.get(
      `https://anikotoapi.site/series/${id}`,
      { timeout: 10000 }
    );

    if (!apiResponse || !apiResponse.data) {
      return res.status(404).json({
        error: "Anime not found"
      });
    }
    const animeObj = apiResponse.data.anime;
    const episodesArr = apiResponse.data.episodes || [];

    if (!animeObj) {
      return res.status(404).json({
        error: "Anime data missing from API response"
      });
    }

    console.log(
      `[AnimePage] Got anime: "${animeObj.title}" with ${episodesArr.length} episodes`
    );
    const animeData = {
      ...animeObj,

      id: String(animeObj.id),

      is_sub: animeObj.is_sub !== undefined,
      is_dub: animeObj.is_dub !== undefined,

      episodes_count: animeObj.episodes_count
        ? Number(animeObj.episodes_count)
        : episodesArr.length,

      year: animeObj.year
        ? String(animeObj.year)
        : undefined,

      score: animeObj.score
        ? Number(animeObj.score)
        : undefined,

      episodes: episodesArr,

      cachedAt: new Date()
    };

    const savedDetail = await AnimeDetail.findOneAndUpdate(
      { id: String(id) },
      animeData,
      {
        upsert: true,
        new: true
      }
    );
    console.log("[AnimePage] Saved detail:", savedDetail);

    await AnimeIndex.findOneAndUpdate(
      { id: String(animeObj.id) },
      {
        id: String(animeObj.id),
        title: animeObj.title,
        alternative: animeObj.alternative,
        native: animeObj.native,
        slug: animeObj.slug,
        poster: animeObj.poster,

        score: animeObj.score
          ? Number(animeObj.score)
          : 0,

        year: animeObj.year
          ? String(animeObj.year)
          : undefined,

        status: animeObj.status,

        episodes_count: animeObj.episodes_count
          ? Number(animeObj.episodes_count)
          : episodesArr.length,

        is_sub: animeObj.is_sub !== undefined,
        is_dub: animeObj.is_dub !== undefined,

        description: animeObj.description,
        terms_by_type: animeObj.terms_by_type,
        background_image: animeObj.background_image,
        rating: animeObj.rating,
      },
      {
        upsert: true
      }
    );

    res.json(savedDetail);

  } catch (error) {
    console.error(
      "Error fetching anime details:",
      error.message
    );

    res.status(500).json({
      error: "Failed to fetch anime details"
    });
  }

};
export default fetchAnimeById;