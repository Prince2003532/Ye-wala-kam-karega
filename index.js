const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');

const app = express();
app.use(cors());

app.get('/api', async (req, res) => {
  const videoUrl = req.query.video_url;
  if (!videoUrl) return res.status(400).json({ error: "Missing video_url" });

  try {
    const info = await ytdl.getInfo(videoUrl);
    const formats = info.formats
      .filter(f => f.hasVideo && f.hasAudio)
      .map(f => ({
        quality: f.qualityLabel,
        mimeType: f.mimeType,
        url: f.url
      }));

    res.json({
      title: info.videoDetails.title,
      thumbnail: info.videoDetails.thumbnails.pop().url,
      formats
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch video info" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})
