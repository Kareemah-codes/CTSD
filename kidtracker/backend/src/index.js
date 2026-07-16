import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

// MQTT connection will be wired in on Day 4 — deliberately not here yet,
// so Day 1's "done when" stays scoped to just HTTP + containers talking.

app.listen(PORT, () => {
  console.log(`KidTracker backend listening on http://localhost:${PORT}`);
});
