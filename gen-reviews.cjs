const fs = require('fs');
const pathAvaliacoes = 'src/lib/mock/avaliacoes.json';

const nomes = [
  "João Carlos", "Maria Souza", "Ana Clara", "Pedro Silva", "Lucas Almeida",
  "Beatriz Lima", "Carlos Eduardo", "Fernanda Costa", "Rafael Gomes", "Juliana Mendes",
  "Thiago Ribeiro", "Camila Castro", "Bruno Santos", "Letícia Rocha", "Diego Alves",
  "Mariana Dias", "Felipe Martins", "Amanda Barbosa", "Rodrigo Nogueira", "Natália Pinto"
];

const templatesAvaliacoes = [
  "Lugar fantástico! Superou nossas expectativas.",
  "Muito bom, bem limpo e organizado. Recomendo.",
  "Localização excelente, perto de tudo.",
  "O anfitrião foi muito atencioso do começo ao fim.",
  "Bom custo-benefício. Apenas a internet oscilou um pouco.",
  "Imóvel maravilhoso. Exatamente como nas fotos.",
  "Gostei bastante da estadia. Ambiente tranquilo e familiar.",
  "Perfeito para quem busca descanso. Voltarei com certeza.",
  "Estrutura impecável, móveis novos e bem cuidados.",
  "Ótima experiência. O processo de locação foi muito prático."
];

function getAvatar(nome) {
  const parts = nome.split(' ');
  if (parts.length >= 2) {
    return parts[0][0] + parts[1][0];
  }
  return parts[0].substring(0, 2).toUpperCase();
}

const avaliacoes = [];
let avalId = 1;

for (let imovelId = 1; imovelId <= 17; imovelId++) {
  // Gerar 5 avaliações para cada imóvel
  for (let r = 0; r < 5; r++) {
    const nome = nomes[Math.floor(Math.random() * nomes.length)];
    const texto = templatesAvaliacoes[Math.floor(Math.random() * templatesAvaliacoes.length)];
    const estrelas = Math.floor(Math.random() * 2) + 4; // 4 ou 5 estrelas

    avaliacoes.push({
      id: avalId++,
      imovelId: imovelId,
      nome: nome,
      estrelas: estrelas,
      texto: texto,
      avatar: getAvatar(nome)
    });
  }
}

fs.writeFileSync(pathAvaliacoes, JSON.stringify(avaliacoes, null, 2), 'utf8');
console.log('85 avaliações geradas com sucesso!');
