const fs = require('fs');
const path = 'src/lib/mock/imoveis.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const templateDespesas = {
  "iptu": 150,
  "garantia": "Caução",
  "agua": 50,
  "energia": 100,
  "condominio": 200,
  "manutencao": 80,
  "seguroIncendio": 25
};

const templateMidia = [
  { "tipo": "video", "thumb": null },
  { "tipo": "foto", "thumb": "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=900&q=80" },
  { "tipo": "foto", "thumb": "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=900&q=80" },
  { "tipo": "foto", "thumb": "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=900&q=80" },
  { "tipo": "foto", "thumb": "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=900&q=80" }
];

const templateAmenidades = [
  { "icon": "Wifi", "label": "Wi-Fi" },
  { "icon": "Car", "label": "Garagem" },
  { "icon": "ShieldCheck", "label": "Segurança" }
];

const baseRelacionados = [
  {
    "id": 2,
    "nome": "Casa Rústica no Campo",
    "preco": 3800,
    "area": 140,
    "quartos": 3,
    "endereco": "Estrada das Palmeiras, km 12",
    "foto": "/assets/property_2.png",
    "avaliacao": 4.5
  },
  {
    "id": 3,
    "nome": "Casa Moderna com Design Minimalista",
    "preco": 5200,
    "area": 180,
    "quartos": 4,
    "endereco": "Alameda Horizonte, 220",
    "foto": "/assets/property_3.png",
    "avaliacao": 4.8
  },
  {
    "id": 4,
    "nome": "Casa simples para estudantes",
    "preco": 950,
    "area": 180,
    "quartos": 4,
    "endereco": "Rua Amarante, Centro 220",
    "foto": "/assets/property_4.jpg",
    "avaliacao": 3.8
  },
  {
    "id": 5,
    "nome": "Casa forrada",
    "preco": 900,
    "area": 95,
    "quartos": 2,
    "endereco": "Rua Defalla atem, Centro 117",
    "foto": "/assets/property5.jpg",
    "avaliacao": 4.2
  }
];

data.forEach(imovel => {
  if (imovel.id !== 1) {
    if (!imovel.fotoPrincipal) {
      imovel.fotoPrincipal = imovel.imagem || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80";
    }
    
    if (!imovel.informacoesRelevantes) {
      imovel.informacoesRelevantes = "Regras do condomínio aplicáveis. Necessário manter o ambiente limpo e organizado. Permitido pets de pequeno porte.";
    }
    
    if (!imovel.despesas) {
      imovel.despesas = { 
        ...templateDespesas, 
        iptu: Math.floor(Math.random() * 200) + 50, 
        condominio: Math.floor(Math.random() * 300) + 100 
      };
    }
    
    if (!imovel.midia) {
      const newMidia = JSON.parse(JSON.stringify(templateMidia));
      newMidia[1].thumb = imovel.fotoPrincipal;
      imovel.midia = newMidia;
    }
    
    if (!imovel.distribuicaoEstrelas) {
      const avg = parseFloat(imovel.avaliacaoMedia) || 4.5;
      imovel.distribuicaoEstrelas = {
        "5": Math.floor(avg >= 4.5 ? 50 : 20),
        "4": Math.floor(avg >= 4.0 ? 30 : 40),
        "3": 10,
        "2": 5,
        "1": 2
      };
    }
    
    if (!imovel.amenidades) {
      imovel.amenidades = templateAmenidades;
    }
    
    if (!imovel.imoveisRelacionados) {
      imovel.imoveisRelacionados = baseRelacionados;
    }
    
    if (!imovel.totalAvaliacoes) {
        imovel.totalAvaliacoes = Math.floor(Math.random() * 100) + 10;
    }
    
    if(!imovel.avaliacaoMedia) {
        imovel.avaliacaoMedia = (Math.random() * 2 + 3).toFixed(1); 
    }
  }
});

fs.writeFileSync(path, JSON.stringify(data, null, 2), 'utf8');
console.log('Todos os imóveis agora têm informações completas!');
