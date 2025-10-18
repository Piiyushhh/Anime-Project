import axios from "axios";

const fetchAnimeById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = await axios.get(`https://api.jikan.moe/v4/anime/${id}/full`,{ timeout: 5000 } );

    if (!data.data) {
      return res.status(404).json({ error: "Anime not found" });
    }

    const anime = data.data;

    // Pick only relevant fields you want
    const formatted = { 
      id: anime.mal_id,
      title: anime.title,
      title_english: anime.title_english,
      title_japanese: anime.title_japanese,
      images: anime.images,
      trailer: anime.trailer,
      score: anime.score,
      scored_by: anime.scored_by,
      rank: anime.rank,
      popularity: anime.popularity,
      status: anime.status,
      episodes: anime.episodes,
      duration: anime.duration,     
      rating: anime.rating,
      year: anime.year,
      season: anime.season,
      broadcast: anime.broadcast,
      genres: anime.genres,
      themes: anime.themes,
      studios: anime.studios,
      producers: anime.producers,
      synopsis: anime.synopsis,
      background: anime.background,
      aired: anime.aired,
    };

    res.json(formatted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch anime details" });
  }
};

export default fetchAnimeById;
