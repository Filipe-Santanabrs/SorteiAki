
import React, { useState, useEffect } from 'react';
import { RaffleMode, RaffleSettings } from '../types';

interface RaffleFormProps {
  onManualStart: (names: string, settings: RaffleSettings) => void;
  onConnectMeta: (settings: RaffleSettings) => void;
}

const RaffleForm: React.FC<RaffleFormProps> = ({ onManualStart, onConnectMeta }) => {
  const [mode, setMode] = useState<RaffleMode>('INSTAGRAM');
  const [manualList, setManualList] = useState('');
  const [showHelper, setShowHelper] = useState(false);
  const [settings, setSettings] = useState<RaffleSettings>({
    winnersCount: 1,
    engagementType: 'COMMENTS',
    minMentions: 0,
    requiredKeyword: '',
    allowDuplicates: false
  });

  const currentUrl = window.location.origin + window.location.pathname;
  const isHttps = window.location.protocol === 'https:';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'INSTAGRAM') {
      onConnectMeta(settings);
    } else {
      onManualStart(manualList, settings);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Status de Conexão e Assistente */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
            <button 
                type="button"
                onClick={() => setShowHelper(!showHelper)}
                className="text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-2"
            >
                <i className={`fa-solid ${showHelper ? 'fa-chevron-up' : 'fa-gear'}`}></i>
                {showHelper ? 'Ocultar Configurações' : 'Assistente de Hospedagem'}
            </button>
        </div>
        
        {showHelper && (
          <div className="p-5 bg-indigo-500/5 border border-indigo-500/20 rounded-3xl animate-in zoom-in-95 duration-200">
            <h4 className="text-xs font-black text-indigo-300 uppercase mb-2">Instruções de Domínio</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
              A Meta exige que esta URL exata esteja cadastrada no campo <strong>"Domínios do Aplicativo"</strong> e <strong>"OAuth Redirection"</strong>:
            </p>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <code className="flex-1 bg-black/60 p-3 rounded-xl text-[10px] text-indigo-400 font-mono truncate border border-white/5">
                    {currentUrl}
                </code>
                <button 
                    type="button"
                    onClick={() => {
                        navigator.clipboard.writeText(currentUrl);
                        alert("URL copiada! Cole no painel da Meta.");
                    }}
                    className="bg-indigo-600 hover:bg-indigo-500 px-4 rounded-xl text-white text-[10px] font-black transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
                >
                    COPIAR
                </button>
              </div>
              {!isHttps && (
                <p className="text-[10px] text-red-400 font-bold mt-2">
                    <i className="fa-solid fa-triangle-exclamation mr-1"></i>
                    Aviso: O Facebook geralmente bloqueia logins em sites sem HTTPS. Hospede no GitHub Pages para resolver.
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex bg-slate-900/80 p-1.5 rounded-2xl gap-1 border border-white/5 shadow-inner">
        <button
          type="button"
          onClick={() => setMode('INSTAGRAM')}
          className={`flex-1 py-3.5 px-4 rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2 ${
            mode === 'INSTAGRAM' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <i className="fa-brands fa-instagram text-lg"></i> INSTAGRAM
        </button>
        <button
          type="button"
          onClick={() => setMode('MANUAL_LIST')}
          className={`flex-1 py-3.5 px-4 rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2 ${
            mode === 'MANUAL_LIST' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <i className="fa-solid fa-list text-lg"></i> LISTA MANUAL
        </button>
      </div>

      {mode === 'INSTAGRAM' ? (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
           <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSettings({...settings, engagementType: 'COMMENTS'})}
                className={`p-5 rounded-3xl border-2 transition-all text-center group relative overflow-hidden ${
                    settings.engagementType === 'COMMENTS' ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                }`}
              >
                 <i className={`fa-solid fa-comment mb-2 text-2xl ${settings.engagementType === 'COMMENTS' ? 'text-indigo-400' : 'text-slate-600 group-hover:text-slate-400'}`}></i>
                 <p className={`text-[10px] font-black uppercase tracking-widest ${settings.engagementType === 'COMMENTS' ? 'text-white' : 'text-slate-500'}`}>Comentários</p>
                 {settings.engagementType === 'COMMENTS' && <div className="absolute top-0 right-0 w-8 h-8 bg-indigo-500 flex items-center justify-center rounded-bl-xl"><i className="fa-solid fa-check text-[10px] text-white"></i></div>}
              </button>
              <button
                type="button"
                onClick={() => setSettings({...settings, engagementType: 'LIKES'})}
                className={`p-5 rounded-3xl border-2 transition-all text-center group relative overflow-hidden ${
                    settings.engagementType === 'LIKES' ? 'border-pink-500 bg-pink-500/10' : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                }`}
              >
                 <i className={`fa-solid fa-heart mb-2 text-2xl ${settings.engagementType === 'LIKES' ? 'text-pink-400' : 'text-slate-600 group-hover:text-slate-400'}`}></i>
                 <p className={`text-[10px] font-black uppercase tracking-widest ${settings.engagementType === 'LIKES' ? 'text-white' : 'text-slate-500'}`}>Curtidas</p>
                 {settings.engagementType === 'LIKES' && <div className="absolute top-0 right-0 w-8 h-8 bg-pink-500 flex items-center justify-center rounded-bl-xl"><i className="fa-solid fa-check text-[10px] text-white"></i></div>}
              </button>
           </div>
        </div>
      ) : (
        <div className="animate-in fade-in zoom-in-95 duration-300">
            <textarea 
                required
                rows={5}
                value={manualList}
                onChange={(e) => setManualList(e.target.value)}
                placeholder="Exemplo:&#10;João Silva&#10;Maria Oliveira&#10;Pedro Santos..."
                className="w-full bg-slate-950/80 border border-slate-800 text-white rounded-3xl py-5 px-6 focus:ring-2 focus:ring-indigo-500 outline-none resize-none placeholder:text-slate-700 font-medium"
            />
        </div>
      )}

      {/* Configurações Avançadas */}
      <div className="bg-slate-950/40 p-6 rounded-[2rem] border border-white/5 space-y-5">
        <div className="flex justify-between items-center">
            <div className="space-y-0.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Nº de Ganhadores</label>
                <p className="text-[9px] text-slate-600 font-bold">Quantas pessoas serão sorteadas</p>
            </div>
            <div className="flex items-center gap-4 bg-slate-900 p-2 rounded-2xl border border-white/5">
                <button type="button" onClick={() => setSettings({...settings, winnersCount: Math.max(1, settings.winnersCount - 1)})} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/5 transition-all"><i className="fa-solid fa-minus"></i></button>
                <span className="text-xl font-black text-indigo-400 w-6 text-center">{settings.winnersCount}</span>
                <button type="button" onClick={() => setSettings({...settings, winnersCount: settings.winnersCount + 1})} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/5 transition-all"><i className="fa-solid fa-plus"></i></button>
            </div>
        </div>

        {settings.engagementType === 'COMMENTS' && mode === 'INSTAGRAM' && (
            <div className="space-y-5 pt-5 border-t border-white/5 animate-in fade-in">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Min. @Mentions</label>
                        <input 
                            type="number" min="0" max="10"
                            value={settings.minMentions}
                            onChange={(e) => setSettings({...settings, minMentions: parseInt(e.target.value) || 0})}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-4 text-white focus:border-indigo-500 outline-none text-sm font-bold"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Keyword</label>
                        <input 
                            type="text"
                            placeholder="ex: #quero"
                            value={settings.requiredKeyword}
                            onChange={(e) => setSettings({...settings, requiredKeyword: e.target.value})}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-4 text-white focus:border-indigo-500 outline-none text-sm font-bold"
                        />
                    </div>
                </div>
                <label className="flex items-center gap-3 cursor-pointer group p-3 bg-slate-900/50 rounded-2xl border border-transparent hover:border-white/5 transition-all">
                    <input 
                        type="checkbox" 
                        className="w-5 h-5 rounded-lg border-slate-800 bg-slate-950 text-indigo-600 focus:ring-0 checked:bg-indigo-600" 
                        checked={settings.allowDuplicates}
                        onChange={(e) => setSettings({...settings, allowDuplicates: e.target.checked})}
                    />
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-300">Permitir Duplicados</span>
                        <span className="text-[9px] text-slate-500 font-medium">Um usuário pode ganhar várias vezes?</span>
                    </div>
                </label>
            </div>
        )}
      </div>

      {mode === 'INSTAGRAM' && (
        <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex gap-3">
            <i className="fa-solid fa-circle-info text-blue-400 mt-1"></i>
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-blue-200">Requisito Obrigatório:</p>
              <p className="text-[10px] text-slate-400 leading-tight">
                Para sortear, seu <strong>Instagram Business/Criador</strong> deve estar vinculado a uma <strong>Página do Facebook</strong>. Você fará login com o Facebook para autorizar o acesso.
              </p>
            </div>
          </div>
        </div>
      )}

      <button 
        type="submit"
        className="group w-full py-6 gradient-bg text-white font-black text-xl rounded-[2rem] shadow-2xl shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <span className="relative z-10">{mode === 'INSTAGRAM' ? 'CONECTAR COM FACEBOOK' : 'GERAR RESULTADO'}</span>
        <i className={`${mode === 'INSTAGRAM' ? 'fa-brands fa-facebook-f' : 'fa-solid fa-bolt-lightning'} relative z-10 animate-bounce`}></i>
      </button>
    </form>
  );
};

export default RaffleForm;
