import { AnimeIndex } from "../models/Anime.js";

const searchAnime = async (req, res) => {
  try {
    const { query } = req.query;  // from frontend request
    if (!query) {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    // Search MongoDB AnimeIndex collection using text search or regex
    const results = await AnimeIndex.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { alternative: { $regex: query, $options: 'i' } },
        { native: { $regex: query, $options: 'i' } }
      ]
    }).limit(10);

    res.json({ data: results }); // send list back to frontend
  } catch (error) {
    console.error("Error in searchAnime:", error.message);
    res.status(500).json({ error: "Failed to fetch anime search results" });
  }
};

export default searchAnime;
