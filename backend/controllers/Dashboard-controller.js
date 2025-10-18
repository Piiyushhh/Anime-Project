import axios from "axios";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const fetchDashboard = async (req, res) => {
  try {
    let page = 1;
    let allAnimes = [];
    let hasNext = true;

    // 🔹 Keep fetching until API says no next page
    while (hasNext) {
      const { data } = await axios.get(
        `https://api.jikan.moe/v4/seasons/now?page=${page}&sfw`
      );

      if (!data.data || data.data.length === 0) break;

      allAnimes = [...allAnimes, ...data.data];

      hasNext = data.pagination.has_next_page;
      page++;

      if (hasNext) await delay(800); // respect rate limit
    }

    // 🔹 Map relevant fields
    const formatted = allAnimes.map((anime) => ({
      id: anime.mal_id,
      title: anime.title,
      image: anime.images.jpg.image_url,
      score: anime.score,
      status: anime.status,
      episodes: anime.episodes,
    }));

    // 🔹 Group into sections
    const upcoming = formatted.filter((anime) => anime.status === "Not yet aired");
    const currentlyAiring = formatted.filter((anime) => anime.status === "Currently Airing").slice(0,18);
    const trending = formatted
      .filter((anime) => anime.score && anime.score >= 8)
      .sort((a, b) => b.score - a.score); // highest score first
    const continueWatching = formatted.slice(0, 5); // TODO: replace with user DB later

    res.json({
      upcoming,
      currentlyAiring,
      trending,
      continueWatching,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
};

export default fetchDashboard;
