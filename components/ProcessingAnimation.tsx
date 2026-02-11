
import React, { useState, useEffect } from 'react';

const ProcessingAnimation: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);
  const messages = [
    "Sincronizando interações...",
    "Validando participantes...",
    "Gerando semente de aleatoriedade...",
    "Embaralhando dados com segurança...",
    "Finalizando processamento..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-t-indigo-500 rounded-full animate-spin"></div>
        <div className="absolute inset-2 border-4 border-purple-500/20 rounded-full"></div>
        <div className="absolute inset-2 border-4 border-b-purple-500 rounded-full animate-slow-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
            <i className="fa-solid fa-bolt text-indigo-400 text-2xl animate-pulse"></i>
        </div>
      </div>
      <h3 className="text-xl font-bold mb-2 text-white">{messages[messageIndex]}</h3>
      <p className="text-slate-400 text-sm max-w-xs">
        Isso leva apenas alguns segundos. Nossa tecnologia processa milhares de dados instantaneamente.
      </p>
    </div>
  );
};

export default ProcessingAnimation;
