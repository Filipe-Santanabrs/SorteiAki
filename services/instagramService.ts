
/**
 * INSTAGRAM SERVICE (PLACEHOLDER PARA INTEGRAÇÃO REAL)
 * 
 * Para configurar a integração real:
 * 1. Obtenha um Token de Acesso da Meta for Developers.
 * 2. Substitua a lógica abaixo por chamadas fetch ao endpoint do Instagram Graph API.
 */

import { Participant } from '../types';

export const fetchInstagramComments = async (postUrl: string): Promise<Participant[]> => {
  // ATENÇÃO: A API do Instagram exige validação de domínio e token de curta/longa duração.
  // Este é um mock para desenvolvimento da interface.
  
  console.log(`Buscando comentários para: ${postUrl}`);
  
  // Simulação de delay de rede
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock de retorno
  return Array.from({ length: 150 }, (_, i) => ({
    id: `ig-user-${i}`,
    username: `perfil_sortudo_${i}`,
    content: `Eu quero ganhar este sorteio! #SorteiAki #${i}`,
    avatarUrl: `https://picsum.photos/seed/${i}/100/100`
  }));
};
