const fs = require('fs');
const path = 'src/lib/mock/imoveis.json';
let imoveis = JSON.parse(fs.readFileSync(path, 'utf-8'));

const tipos = ["Casa", "Apartamento", "Kitnet", "Casa de Condomínio"];

imoveis = imoveis.map((im, index) => {
  // Ensure variety of types
  im.tipo = tipos[index % tipos.length];

  // Add rooms array if missing
  if (!im.rooms) im.rooms = [];

  // Randomize Vagas
  const hasVagas = index % 2 === 0;
  im.rooms = im.rooms.filter(r => !r.label.includes('Vaga'));
  if (hasVagas) {
    im.rooms.push({ label: 'Vagas', value: Math.floor(Math.random() * 3) + 1 });
  }

  // Randomize Banheiros for sorting
  im.rooms = im.rooms.filter(r => !r.label.includes('Banheiro'));
  im.rooms.push({ label: 'Banheiros', value: Math.floor(Math.random() * 3) + 1 });

  // Randomize Mobiliado
  if (!im.amenidades) im.amenidades = [];
  im.amenidades = im.amenidades.filter(a => a.label !== 'Mobiliado');
  if (index % 3 === 0) {
    im.amenidades.push({ icon: 'Sofa', label: 'Mobiliado' });
  }

  return im;
});

fs.writeFileSync(path, JSON.stringify(imoveis, null, 2), 'utf-8');
console.log('Mocks atualizados com tipos variados, vagas e opções de mobiliado!');
