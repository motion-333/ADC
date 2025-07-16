const http = require('http');
const fs = require('fs');
const path = require('path');

const HOST = '127.0.0.1';
const PORT = process.env.PORT || 9000;
const root = __dirname;

function contentType(file) {
  const ext = path.extname(file).toLowerCase();
  return {
    '.html':'text/html',
    '.js':'application/javascript',
    '.css':'text/css',
    '.png':'image/png',
    '.jpg':'image/jpeg',
    '.jpeg':'image/jpeg',
    '.gif':'image/gif',
    '.svg':'image/svg+xml'
  }[ext] || 'application/octet-stream';
}

function serveFile(res, file) {
  fs.readFile(file, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
    } else {
      res.writeHead(200, {'Content-Type': contentType(file)});
      res.end(data);
    }
  });
}

function handleApiImages(res) {
  const dir = path.join(root, 'static', 'header_img');
  fs.readdir(dir, (err, files) => {
    if (err) {
      res.writeHead(500, {'Content-Type':'application/json'});
      res.end(JSON.stringify({error: err.message}));
      return;
    }
    const images = files
      .filter(f => /^header\d+\.jpg$/.test(f))
      .sort((a,b)=> +a.match(/^header(\d+)\.jpg$/)[1] - +b.match(/^header(\d+)\.jpg$/)[1]);
    res.writeHead(200, {'Content-Type':'application/json'});
    res.end(JSON.stringify(images));
  });
}

const server = http.createServer((req, res) => {
  const urlPath = decodeURI(req.url.split('?')[0]);
  if (urlPath === '/api/images') {
    return handleApiImages(res);
  }
  let file = path.join(root, urlPath);
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
    file = path.join(file, 'index.html');
  }
  if (!fs.existsSync(file)) {
    res.writeHead(404);
    res.end('Not found');
  } else {
    serveFile(res, file);
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});
