const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const HOST = '127.0.0.1';
const PORT = process.env.PORT || 9000;

// Serve all files from repo root
app.use(express.static(path.join(__dirname)));

// API: list and sort headerN.jpg in static/header_img
app.get('/api/images', (req, res) => {
  const imgDir = path.join(__dirname, 'static/header_img');
  fs.readdir(imgDir, (err, files) => {
    if (err) return res.status(500).json({ error: err.message });
    const images = files
      .filter(f => /^header\d+\.jpg$/.test(f))
      .sort((a, b) => {
        const na = +a.match(/^header(\d+)\.jpg$/)[1];
        const nb = +b.match(/^header(\d+)\.jpg$/)[1];
        return na - nb;
      });
    res.json(images);
  });
});

app.listen(PORT, HOST, () => {
  console.log(`\u{1F680} Server running at http://${HOST}:${PORT}`);
});
