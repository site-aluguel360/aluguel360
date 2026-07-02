import { useCallback } from 'react';
import imoveisData from '../mock/imoveis.json';// Simulating async behavior for future API integration
export const useImoveis = () => {
  const getImoveis = useCallback(async (filtros = {}) => {
    let result = [...imoveisData];

    if (filtros.tipos && filtros.tipos.length > 0) {
      result = result.filter(imovel => filtros.tipos.includes(imovel.tipo));
    }

    if (filtros.precoMin) {
      result = result.filter(imovel => imovel.preco >= Number(filtros.precoMin));
    }

    if (filtros.precoMax) {
      result = result.filter(imovel => imovel.preco <= Number(filtros.precoMax));
    }

    if (filtros.amenidades && filtros.amenidades.length > 0) {
      result = result.filter(im => {
        return filtros.amenidades.every(am => 
          im.amenidades && im.amenidades.some(imAm => imAm.label === am || imAm === am)
        );
      });
    }

    if (filtros.vagas) {
       result = result.filter(im => {
           const vagaRoom = im.rooms?.find(r => r.label.includes('Vaga'));
           return vagaRoom && vagaRoom.value >= Number(filtros.vagas);
       });
    }

    if (filtros.ordenacao) {
      const { campo, direcao } = filtros.ordenacao;
      result.sort((a, b) => {
        let valA = a[campo];
        let valB = b[campo];
        
        if (campo === 'quartos') {
           valA = a.quartos || 0;
           valB = b.quartos || 0;
        } else if (campo === 'banheiros') {
           valA = a.rooms?.find(r => r.label.includes('Banheiro'))?.value || 0;
           valB = b.rooms?.find(r => r.label.includes('Banheiro'))?.value || 0;
        } else if (campo === 'vagas') {
           valA = a.rooms?.find(r => r.label.includes('Vaga'))?.value || 0;
           valB = b.rooms?.find(r => r.label.includes('Vaga'))?.value || 0;
        }
        
        if (valA === valB) return 0;
        if (direcao === 'asc') return valA > valB ? 1 : -1;
        return valA < valB ? 1 : -1;
      });
    }

    return Promise.resolve(result);
  }, []);

  const getImovelById = useCallback(async (id) => {
    const imovel = imoveisData.find(i => String(i.id) === String(id));
    if (!imovel) {
      return Promise.reject(new Error("Imóvel não encontrado"));
    }
    return Promise.resolve(imovel);
  }, []);

  const getImoveisRelacionados = useCallback(async (ids) => {
    if (!ids || !ids.length) return Promise.resolve([]);
    const relacionados = imoveisData.filter(i => ids.includes(i.id));
    return Promise.resolve(relacionados);
  }, []);

  return {
    getImoveis,
    getImovelById,
    getImoveisRelacionados
  };
};
