const fs = require('fs');

const path = 'src/lib/mock/imoveis.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const novosImoveis = [
  {
    "id": 8,
    "imagem": "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&q=80",
    "titulo": "Cobertura Duplex - Bela Vista",
    "descricao": "Luxuosa cobertura duplex com piscina privativa, churrasqueira e vista panorâmica para o parque.",
    "preco": 8500,
    "area": 220,
    "quartos": 3,
    "banheiros": 4,
    "endereco": "Av. Paulista, 1500 - Bela Vista",
    "cidade": "São Paulo - SP",
    "tag": "Exclusivo",
    "avaliacaoMedia": 5,
    "totalAvaliacoes": 42
  },
  {
    "id": 9,
    "imagem": "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&q=80",
    "titulo": "Mansão com Jardim e Piscina",
    "descricao": "Casa espetacular em bairro nobre, com amplo jardim, piscina aquecida e arquitetura moderna.",
    "preco": 15000,
    "area": 450,
    "quartos": 5,
    "banheiros": 6,
    "endereco": "Rua das Rosas, 200 - Morumbi",
    "cidade": "São Paulo - SP",
    "tag": "Alto Padrão",
    "avaliacaoMedia": 4.8,
    "totalAvaliacoes": 15
  },
  {
    "id": 10,
    "imagem": "https://images.unsplash.com/photo-1494526585095-c41746248156?w=900&q=80",
    "titulo": "Studio Mobiliado - Vila Madalena",
    "descricao": "Studio compacto e moderno, totalmente mobiliado, ideal para estudantes e jovens profissionais.",
    "preco": 2800,
    "area": 35,
    "quartos": 1,
    "banheiros": 1,
    "endereco": "Rua Fradique Coutinho, 500",
    "cidade": "São Paulo - SP",
    "tag": "Pronto para morar",
    "avaliacaoMedia": 4.5,
    "totalAvaliacoes": 89
  },
  {
    "id": 11,
    "imagem": "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=900&q=80",
    "titulo": "Apartamento Família - Copacabana",
    "descricao": "Apartamento espaçoso a duas quadras da praia. Ótima iluminação natural e ventilação cruzada.",
    "preco": 4200,
    "area": 110,
    "quartos": 3,
    "banheiros": 2,
    "endereco": "Rua Barata Ribeiro, 800",
    "cidade": "Rio de Janeiro - RJ",
    "tag": "Perto do Mar",
    "avaliacaoMedia": 4.2,
    "totalAvaliacoes": 56
  },
  {
    "id": 12,
    "imagem": "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=900&q=80",
    "titulo": "Casa Geminada - Bairro Universitário",
    "descricao": "Casa prática e aconchegante, próxima ao campus principal da universidade federal.",
    "preco": 1800,
    "area": 85,
    "quartos": 2,
    "banheiros": 1,
    "endereco": "Rua dos Estudantes, 120",
    "cidade": "Campinas - SP",
    "avaliacaoMedia": 3.9,
    "totalAvaliacoes": 120
  },
  {
    "id": 13,
    "imagem": "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=900&q=80",
    "titulo": "Sobrado Reformado - Zona Sul",
    "descricao": "Sobrado com acabamento fino, piso em porcelanato e quintal com espaço gourmet.",
    "preco": 3200,
    "area": 130,
    "quartos": 3,
    "banheiros": 3,
    "endereco": "Av. Jabaquara, 3000",
    "cidade": "São Paulo - SP",
    "tag": "Recém-reformado",
    "avaliacaoMedia": 4.7,
    "totalAvaliacoes": 33
  },
  {
    "id": 14,
    "imagem": "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=900&q=80",
    "titulo": "Loft Industrial - Batel",
    "descricao": "Loft com design industrial, pé direito duplo e amplas janelas de vidro.",
    "preco": 3500,
    "area": 70,
    "quartos": 1,
    "banheiros": 1,
    "endereco": "Al. D. Pedro II, 250",
    "cidade": "Curitiba - PR",
    "tag": "Design",
    "avaliacaoMedia": 4.9,
    "totalAvaliacoes": 78
  },
  {
    "id": 15,
    "imagem": "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=900&q=80",
    "titulo": "Chácara para Temporada",
    "descricao": "Lugar perfeito para descansar aos finais de semana, com lago e pomar.",
    "preco": 2500,
    "area": 1000,
    "quartos": 4,
    "banheiros": 3,
    "endereco": "Rodovia BR 116, KM 45",
    "cidade": "Juquitiba - SP",
    "tag": "Natureza",
    "avaliacaoMedia": 4.6,
    "totalAvaliacoes": 24
  },
  {
    "id": 16,
    "imagem": "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=900&q=80",
    "titulo": "Flat Executivo - Itaim Bibi",
    "descricao": "Flat com serviço de camareira, recepção bilíngue e restaurante no prédio.",
    "preco": 5500,
    "area": 45,
    "quartos": 1,
    "banheiros": 1,
    "endereco": "Rua Joaquim Floriano, 800",
    "cidade": "São Paulo - SP",
    "tag": "Serviços inclusos",
    "avaliacaoMedia": 4.3,
    "totalAvaliacoes": 110
  },
  {
    "id": 17,
    "imagem": "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?w=900&q=80",
    "titulo": "Apartamento Garden - Savassi",
    "descricao": "Apartamento térreo com área externa privativa, ideal para quem tem pets.",
    "preco": 3100,
    "area": 95,
    "quartos": 2,
    "banheiros": 2,
    "endereco": "Rua Antônio de Albuquerque, 400",
    "cidade": "Belo Horizonte - MG",
    "tag": "Pet Friendly",
    "avaliacaoMedia": 4.8,
    "totalAvaliacoes": 91
  }
];

data.push(...novosImoveis);

fs.writeFileSync(path, JSON.stringify(data, null, 2), 'utf8');
console.log('10 properties added successfully!');
