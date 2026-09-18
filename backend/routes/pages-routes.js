import express from 'express'
import fetchDashboard from '../controllers/Dashboard-controller.js';
import fetchAnimeById from '../controllers/Anime-Page-fetch.js';
import searchAnime from '../controllers/searchAnime.js';
import { addToWatchlist,removeFromWatchlist,getWatchlist } from '../controllers/WatchList.js';
const Router = express.Router();

Router.get('/Dashboard',fetchDashboard)
Router.get("/AnimePage/:id", fetchAnimeById);
Router.get("/search", searchAnime);
Router.get("/WatchList/get", getWatchlist);
Router.post("/WatchList/add", addToWatchlist);
Router.delete("/WatchList/:id", removeFromWatchlist);

export default Router;
  