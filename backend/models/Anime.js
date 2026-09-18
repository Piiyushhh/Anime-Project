import mongoose from 'mongoose';

const AnimeIndexSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  alternative: { type: String },
  native: { type: String },
  slug: { type: String },
  poster: { type: String },
  score: { type: Number },
  year: { type: String },
  status: { type: String },
  episodes_count: { type: Number },
  is_sub: { type: Boolean },
  is_dub: { type: Boolean },
  description: { type: String },
  terms_by_type: { type: Object },
  background_image: { type: String },
  rating: { type: String },
}, { timestamps: true });

export const AnimeIndex = mongoose.model('AnimeIndex', AnimeIndexSchema);

const EpisodeSchema = new mongoose.Schema({
  id: { type: String },
  title: { type: String },
  jp_title: { type: String },
  number: { type: Number },
  episode_embed_id: { type: String },
  embed_url: { type: Object },
  updated_at: { type: String },
});

const AnimeDetailSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  alternative: { type: String },
  native: { type: String },
  slug: { type: String },
  rating: { type: String },
  poster: { type: String },
  is_sub: { type: Boolean },
  is_dub: { type: Boolean },
  description: { type: String },
  aired: { type: String },
  season: { type: String },
  year: { type: String },
  duration: { type: String },
  status: { type: String },
  score: { type: Number },
  mal_id: { type: String },
  episodes_count: { type: Number },
  ani_id: { type: String },
  source: { type: String },
  s_id: { type: String },
  background_image: { type: String },
  updated_at: { type: String },
  next_air_schedule_time: { type: String },
  next_air_ep: { type: String },
  terms_by_type: { type: Object },
  episodes: [EpisodeSchema],
  cachedAt: { type: Date, default: Date.now },
});

// Create text index on title for searching
AnimeIndexSchema.index({ title: 'text', alternative: 'text', native: 'text' });

export const AnimeDetail = mongoose.model('AnimeDetail', AnimeDetailSchema);
