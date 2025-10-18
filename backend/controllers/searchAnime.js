// controllers/searchAnime.js
import axios from "axios";

const searchAnime = async (req, res) => {
  try {
    const { query } = req.query;  // from frontend request
    if (!query) {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    const { data } = await axios.get(
      `https://api.jikan.moe/v4/anime?q=${query}&limit=10`
    );

    res.json(data); // send only the list back to frontend
  } catch (error) { 
    console.error("Error in searchAnime:", error.message);
    res.status(500).json({ error: "Failed to fetch anime search results" });
  }
};

export default searchAnime;
