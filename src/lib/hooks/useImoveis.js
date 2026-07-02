import { useCallback } from 'react';
import imoveisData from '../mock/imoveis.json';// Simulating async behavior for future API integration
export const useImoveis = () => {
  const getImoveis = useCallback(async () => {
    return Promise.resolve(imoveisData);
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
