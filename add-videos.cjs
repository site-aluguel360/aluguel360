const fs = require('fs');
const path = 'src/lib/mock/imoveis.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

// Test videos
const videoUrl = "https://www.w3schools.com/html/mov_bbb.mp4"; // generic test video
const videoUrl2 = "https://media.w3.org/2010/05/sintel/trailer.mp4"; // another generic test video

data.forEach(imovel => {
  if ([1, 2, 3].includes(imovel.id)) {
    const videoMedia = imovel.midia.find(m => m.tipo === "video");
    if (videoMedia) {
      videoMedia.url = imovel.id === 1 ? videoUrl2 : videoUrl;
    }
  }
});

fs.writeFileSync(path, JSON.stringify(data, null, 2), 'utf8');
console.log('URLs de vídeo adicionadas aos imóveis 1, 2 e 3.');
