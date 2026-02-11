
import React, { useState, useEffect } from 'react';
import { Participant, RaffleResult } from '../types';

interface WinnerRevealProps {
  result: RaffleResult;
  onDone: () => void;
}

const WinnerReveal: React.FC<WinnerRevealProps> = ({ result, onDone }) => {
  const [revealedIndex, setRevealedIndex] = useState(-1);

  const revealNext = () => {
    if (revealedIndex < result.winners.length - 1) {
      setRevealedIndex(prev => prev + 1);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
        if (revealedIndex === -1) revealNext();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start mb-2">
        <div>
            <h2 className="text-3xl font-[1000] text-white italic italic leading-none mb-1">SORTUDOS!</h2>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
                Sorteio de {result.settings.engagementType === 'COMMENTS' ? 'Comentários' : 'Curtidas'}
            </p>
        </div>
        <div className="text-right">
            <span className="text-[8px] text-slate-500 font-black uppercase tracking-widest block mb-1">ID Transparência</span>
            <span className="bg-slate-900 border border-white/5 px-3 py-1.5 rounded-lg text-indigo-400 font-mono text-[10px] shadow-lg">
                {result.verificationHash}
            </span>
        </div>
      </div>

      <div className="grid gap-4 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
        {result.winners.map((winner, index) => {
          const isRevealed = index <= revealedIndex;
          return (
            <div 
              key={winner.id}
              className={`glass p-5 rounded-3xl border transition-all duration-700 transform flex items-center gap-5 ${
                isRevealed ? 'opacity-100 translate-x-0 border-indigo-500/40 shadow-xl shadow-indigo-500/10' : 'opacity-0 -translate-x-10 border-transparent'
              }`}
            >
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-indigo-500/20 bg-slate-900">
                    {winner.avatarUrl ? (
                        <img src={winner.avatarUrl} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center gradient-bg text-white font-black text-xl">
                            {winner.username.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl gradient-bg flex items-center justify-center text-white text-xs font-black shadow-lg">
                    #{index + 1}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-black text-white text-xl truncate">@{winner.username}</h4>
                {winner.content ? (
                    <p className="text-slate-400 text-sm truncate italic opacity-80">"{winner.content}"</p>
                ) : (
                    <p className="text-pink-500/80 text-[10px] font-black uppercase tracking-widest mt-1">Ganhador por Curtida <i className="fa-solid fa-heart ml-1"></i></p>
                )}
              </div>

              <a 
                href={`https://instagram.com/${winner.username}`} 
                target="_blank" 
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-indigo-600 transition-all"
              >
                <i className="fa-brands fa-instagram"></i>
              </a>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-3 mt-8">
        {revealedIndex < result.winners.length - 1 ? (
            <button 
                onClick={revealNext}
                className="w-full py-5 gradient-bg text-white font-black text-xl rounded-2xl shadow-2xl shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
                Revelar Próximo <i className="fa-solid fa-eye ml-2"></i>
            </button>
        ) : (
            <button 
                onClick={onDone}
                className="w-full py-4 bg-slate-900 border border-slate-700 text-slate-400 font-black text-sm uppercase tracking-widest rounded-2xl hover:bg-slate-800 hover:text-white transition-all"
            >
                Novo Sorteio
            </button>
        )}
      </div>
    </div>
  );
};

export default WinnerReveal;
