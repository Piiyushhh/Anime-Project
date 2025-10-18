import axios from "axios";

// Temporary in-memory store (replace with DB later)
let watchlist = [];

// ✅ Add anime ID to watchlist
export const addToWatchlist = (req, res) => {
  const { id } = req.body;
  const animeId = parseInt(id);

  if (!animeId) {
    return res.status(400).json({ error: "Invalid anime ID" });
  }

  if (watchlist.includes(animeId)) {
    return res.status(200).json({ message: "Already in watchlist", watchlist });
  }

  watchlist.push(animeId);
  res.json({ success: true, message: "Added to watchlist", watchlist });
};

// ✅ Remove anime from watchlist
export const removeFromWatchlist = (req, res) => {
  const animeId = parseInt(req.params.id);
  watchlist = watchlist.filter((id) => id !== animeId);
  res.json({ success: true, message: "Removed from watchlist", watchlist });
};

// ✅ Get all watchlist anime details (using Jikan API)
export const getWatchlist = async (req, res) => {
  try {
    if (watchlist.length === 0) {
      return res.json([]);
    }

    const results = await Promise.all(
      watchlist.map(async (id) => {
        try {
          const { data } = await axios.get(`https://api.jikan.moe/v4/anime/${id}/full`, { timeout: 5000 });
          return data.data;
        } catch (error) {
          console.error(`Failed to fetch anime ${id}:`, error.message);
          return null;
        }
      })
    );

    // Remove any nulls from failed fetches
    const filtered = results.filter((item) => item !== null);

    res.json(filtered);
  } catch (error) {
    console.error("Error fetching watchlist:", error.message);
    res.status(500).json({ error: "Failed to fetch watchlist details" });
  }
};
