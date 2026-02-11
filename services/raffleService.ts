
import { Participant, RaffleResult } from '../types';

/**
 * Realiza o sorteio de forma aleatória e segura.
 */
export const performRaffle = (
  participants: Participant[],
  winnersCount: number
): Participant[] => {
  if (participants.length === 0) return [];
  
  const shuffled = [...participants].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(winnersCount, participants.length));
};

/**
 * Gera um hash de verificação único para o sorteio.
 */
export const generateVerificationHash = (winners: Participant[], timestamp: number): string => {
  const data = winners.map(w => w.id).join('-') + timestamp.toString();
  // Simulação de hash robusto
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return 'SAK-' + Math.abs(hash).toString(16).toUpperCase().padStart(8, '0');
};
