
import React, { useState } from 'react';
import { AppState, Participant, RaffleResult, MetaMedia, RaffleSettings } from './types';
import RaffleForm from './components/RaffleForm';
import MediaSelector from './components/MediaSelector';
import ProcessingAnimation from './components/ProcessingAnimation';
import WinnerReveal from './components/WinnerReveal';
import { performRaffle, generateVerificationHash } from './services/raffleService';
import { metaService } from './services/metaService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [mediaList, setMediaList] = useState<MetaMedia[]>([]);
  const [currentResult, setCurrentResult] = useState<RaffleResult | null>(null);
  const [activeSettings, setActiveSettings] = useState<RaffleSettings | null>(null);
  const [countdown, setCountdown] = useState(3);

  const handleConnectMeta = async (settings: RaffleSettings) => {
    setActiveSettings(settings);
    setAppState(AppState.CONNECTING);
    
    try {
        const token = await metaService.login();
        if (!token) {
            setAppState(AppState.IDLE);
            return;
        }

        const igId = await metaService.getInstagramAccountId();
        if (igId) {
            const media = await metaService.getMedia(igId);
            setMediaList(media);
            setAppState(AppState.SELECTING_MEDIA);
        } else {
            alert("Atenção: Não encontramos nenhuma conta do INSTAGRAM COMERCIAL vinculada à sua conta do Facebook.");
            setAppState(AppState.IDLE);
        }
    } catch (error) {
        console.error('Erro Meta:', error);
        setAppState(AppState.IDLE);
    }
  };

  const handleSelectMedia = async (media: MetaMedia) => {
    if (!activeSettings) return;
    setAppState(AppState.PROCESSING);
    
    try {
        let participants = await metaService.fetchData(media.id, activeSettings.engagementType);
        
        if (activeSettings.engagementType === 'COMMENTS') {
            if (!activeSettings.allowDuplicates) {
                const seen = new Set();
                participants = participants.filter(p => {
                    const isDuplicate = seen.has(p.username);
                    seen.add(p.username);
                    return !isDuplicate;
                });
            }

            if (activeSettings.requiredKeyword) {
                const kw = activeSettings.requiredKeyword.toLowerCase();
                participants = participants.filter(p => p.content?.toLowerCase().includes(kw));
            }

            if (activeSettings.minMentions > 0) {
                participants = participants.filter(p => {
                    const mentions = (p.content?.match(/@\w+/g) || []).length;
                    return mentions >= activeSettings.minMentions;
                });
            }
        }

        if (participants.length === 0) {
            alert("Nenhum participante atende às regras.");
            setAppState(AppState.IDLE);
            return;
        }

        const winners = performRaffle(participants, activeSettings.winnersCount);
        const timestamp = Date.now();
        
        setCurrentResult({
            id: `res-${timestamp}`,
            timestamp,
            mediaInfo: media,
            settings: activeSettings,
            winners,
            verificationHash: generateVerificationHash(winners, timestamp)
        });
        
        setTimeout(() => {
            setAppState(AppState.COUNTDOWN);
            startCountdown();
        }, 1500);
    } catch (err) {
        console.error('Erro busca de dados:', err);
        setAppState(AppState.IDLE);
    }
  };

  const startCountdown = () => {
    let count = 3;
    setCountdown(count);
    const interval = setInterval(() => {
        count--;
        setCountdown(count);
        if (count === 0) {
            clearInterval(interval);
            setAppState(AppState.REVEALED);
        }
    }, 1000);
  };

  const handleManualStart = (names: string, settings: RaffleSettings) => {
    setAppState(AppState.PROCESSING);
    setActiveSettings(settings);

    const participants: Participant[] = names.split('\n')
        .filter(n => n.trim())
        .map((n, i) => ({ id: `man-${i}`, username: n.trim() }));

    setTimeout(() => {
        const winners = performRaffle(participants, settings.winnersCount);
        const timestamp = Date.now();
        setCurrentResult({
            id: `man-res-${timestamp}`,
            timestamp,
            settings,
            winners,
            verificationHash: generateVerificationHash(winners, timestamp)
        });
        setAppState(AppState.COUNTDOWN);
        startCountdown();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex flex-col items-center selection:bg-indigo-500/30 overflow-x-hidden">
      {/* BACKGROUND ELEMENTS */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-indigo-600/10 blur-[180px] rounded-full"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-purple-600/10 blur-[180px] rounded-full"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      </div>

      <div className="w-full max-w-6xl relative z-10 px-4 py-12 flex flex-col items-center">
        {/* HEADER SECTION */}
        <header className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-1000">
          <div className="relative inline-block mb-6">
             <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-30 animate-pulse"></div>
             <div className="relative w-20 h-20 bg-slate-900 border border-indigo-500/30 rounded-[2rem] flex items-center justify-center text-4xl rotate-6 shadow-2xl">
                <i className="fa-solid fa-bolt-lightning gradient-text"></i>
             </div>
          </div>
          <h1 className="text-6xl md:text-7xl font-[1000] tracking-tighter mb-2 italic text-white">
            Sortei<span className="gradient-text pr-2">Aki</span>
          </h1>
          <p className="text-slate-500 font-black text-xs uppercase tracking-[0.5em]">Plataforma Profissional de Sorteios</p>
        </header>

        {/* MAIN RAFFLE COMPONENT */}
        <main className="w-full max-w-xl mb-24">
            <div className="glass rounded-[3rem] p-6 md:p-10 shadow-[0_0_100px_rgba(0,0,0,0.5)] border-t border-white/10 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 gradient-bg opacity-50"></div>
              
              {appState === AppState.IDLE && (
                <RaffleForm onManualStart={handleManualStart} onConnectMeta={handleConnectMeta} />
              )}

              {appState === AppState.CONNECTING && (
                <div className="py-20 text-center space-y-6">
                    <div className="w-24 h-24 bg-indigo-600/10 rounded-full flex items-center justify-center mx-auto border border-indigo-500/20 animate-bounce shadow-2xl shadow-indigo-500/20">
                        <i className="fa-brands fa-facebook-f text-5xl text-indigo-500"></i>
                    </div>
                    <h3 className="text-2xl font-black text-white">Conectando...</h3>
                    <p className="text-slate-400 text-sm max-w-[280px] mx-auto leading-relaxed">
                      Estamos estabelecendo uma conexão segura com os servidores da Meta.
                    </p>
                </div>
              )}

              {appState === AppState.SELECTING_MEDIA && (
                <MediaSelector 
                    mediaList={mediaList} 
                    onSelect={handleSelectMedia} 
                    onCancel={() => setAppState(AppState.IDLE)} 
                />
              )}

              {appState === AppState.PROCESSING && <ProcessingAnimation />}

              {appState === AppState.COUNTDOWN && (
                <div className="py-24 text-center animate-in zoom-in duration-300">
                    <p className="text-slate-500 font-black text-xs uppercase tracking-widest mb-4">O ganhador será revelado em</p>
                    <span className="text-[12rem] font-[1000] gradient-text italic leading-none pr-4">{countdown}</span>
                </div>
              )}

              {appState === AppState.REVEALED && currentResult && (
                <WinnerReveal result={currentResult} onDone={() => {
                    setAppState(AppState.IDLE);
                    setCurrentResult(null);
                }} />
              )}
            </div>
        </main>

        {/* EXTRA CONTENT SECTION (MAKES THE PAGE COMPLETE) */}
        <section className="grid md:grid-cols-3 gap-6 w-full mb-24 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <div className="glass p-8 rounded-[2.5rem] border border-white/5 hover:border-indigo-500/30 transition-all group">
                <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <i className="fa-solid fa-bolt text-indigo-400 text-2xl"></i>
                </div>
                <h4 className="text-xl font-black text-white mb-3 italic">Ultra Rápido</h4>
                <p className="text-slate-400 text-sm leading-relaxed">Processamento instantâneo de milhares de comentários usando tecnologia de ponta.</p>
            </div>
            <div className="glass p-8 rounded-[2.5rem] border border-white/5 hover:border-purple-500/30 transition-all group">
                <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <i className="fa-solid fa-shield-halved text-purple-400 text-2xl"></i>
                </div>
                <h4 className="text-xl font-black text-white mb-3 italic">100% Seguro</h4>
                <p className="text-slate-400 text-sm leading-relaxed">Utilizamos a API Oficial da Meta. Seus dados e sua conta estão sempre protegidos.</p>
            </div>
            <div className="glass p-8 rounded-[2.5rem] border border-white/5 hover:border-pink-500/30 transition-all group">
                <div className="w-14 h-14 bg-pink-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <i className="fa-solid fa-magnifying-glass-chart text-pink-400 text-2xl"></i>
                </div>
                <h4 className="text-xl font-black text-white mb-3 italic">Auditável</h4>
                <p className="text-slate-400 text-sm leading-relaxed">Cada sorteio gera um hash de verificação único para garantir transparência total.</p>
            </div>
        </section>

        {/* FOOTER SECTION */}
        <footer className="w-full flex flex-col items-center gap-10 border-t border-white/5 pt-16 pb-20 relative overflow-hidden">
            <div className="text-center space-y-2">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.6em] mb-4">Desenvolvimento & Design</p>
                <h3 className="text-3xl font-[1000] text-white italic tracking-tighter">
                    Criador do site: <span className="gradient-text pr-1">Filipe Santana</span>
                </h3>
            </div>

            <div className="flex gap-4">
                <a 
                    href="https://www.instagram.com/filipe_santana.brs/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-white/10 rounded-2xl hover:border-pink-500/50 hover:shadow-[0_0_20px_rgba(236,72,153,0.2)] transition-all group"
                >
                    <i className="fa-brands fa-instagram text-2xl text-pink-500 group-hover:scale-110 transition-transform"></i>
                    <span className="text-sm font-black text-white uppercase tracking-widest">Instagram</span>
                </a>
                <a 
                    href="https://github.com/settings/profile" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 rounded-2xl hover:border-white/30 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all group"
                >
                    <i className="fa-brands fa-github text-2xl text-white group-hover:scale-110 transition-transform"></i>
                    <span className="text-sm font-black text-white uppercase tracking-widest">GitHub</span>
                </a>
            </div>

            <div className="flex flex-col items-center gap-4 text-center mt-6">
                <div className="flex gap-8 opacity-40">
                    <i className="fa-brands fa-react text-2xl"></i>
                    <i className="fa-brands fa-js text-2xl"></i>
                    <i className="fa-solid fa-code text-2xl"></i>
                </div>
                <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.4em]">
                    © 2024 SorteiAki Enterprise. Todos os direitos reservados.
                </p>
            </div>

            {/* Decorative bottom line */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-indigo-500/30 blur-sm rounded-full"></div>
        </footer>
      </div>
    </div>
  );
};

export default App;
