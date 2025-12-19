import React, { useState, useEffect } from 'react';
import { GameState, Role, UserProfile } from './types';
import DefuserView from './views/DefuserView';
import ManualView from './views/ManualView';
import LevelSelect from './views/LevelSelect';
import ShopView, { THEMES } from './views/ShopView';
import ProfileView from './views/ProfileView';
import SettingsView from './views/SettingsView';
import { loadProfile } from './utils';

const HUDDecoration: React.FC = () => (
  <>
    <div className="hud-corner corner-tl"></div>
    <div className="hud-corner corner-tr"></div>
    <div className="hud-corner corner-bl"></div>
    <div className="hud-corner corner-br"></div>
  </>
);

const NetworkStatus: React.FC = () => (
  <div className="flex gap-4 items-center bg-black/40 px-4 py-2 rounded-lg border border-white/5 backdrop-blur-md">
    <div className="flex flex-col items-end">
       <span className="text-[8px] text-blue-400 font-bold tracking-widest uppercase">Encryption Status</span>
       <span className="text-[10px] text-white font-mono">AES-256 ACTIVE</span>
    </div>
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <div key={i} className={`w-1 h-3 rounded-full ${i < 4 ? 'bg-blue-500 shadow-[0_0_5px_#3b82f6]' : 'bg-white/10'}`}></div>
      ))}
    </div>
  </div>
);

const TerminalLogs: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const messages = [
    "> Handshake initiated...",
    "> Neural link synchronized.",
    "> Defusal suite v5.2 active.",
    "> Monitoring local grid frequency...",
    "> Alert: Suspicious activity on sector 7",
    "> Remote uplink stable at 14ms",
    "> Scanning modules for integrity...",
    "> Protocol 102 detected on serial bus",
    "> Secure channel established.",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setLogs(prev => [...prev, messages[Math.floor(Math.random() * messages.length)]].slice(-6));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute bottom-10 left-10 w-64 mono text-[9px] text-blue-500/40 select-none hidden lg:block">
      <div className="mb-2 font-bold text-blue-400/20 border-b border-blue-500/10 pb-1">OPERATIONAL LOG</div>
      {logs.map((log, i) => <div key={i} className="leading-tight">{log}</div>)}
    </div>
  );
};

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [role, setRole] = useState<Role>(Role.NONE);
  const [userProfile, setUserProfile] = useState<UserProfile>(loadProfile());
  const [selectedLevel, setSelectedLevel] = useState<number>(1);

  useEffect(() => { setUserProfile(loadProfile()); }, []);

  const activeTheme = THEMES.find(t => t.id === userProfile.activeTheme) || THEMES[0];

  const AppWrapper: React.FC<{children: React.ReactNode}> = ({children}) => (
    <div className={`h-screen w-full ${activeTheme.bgClass} transition-colors duration-1000 text-white font-sans relative overflow-hidden flex flex-col`}>
      <div className="cloud-bg"></div>
      <div className="scanline pointer-events-none"></div>
      {userProfile.isDevMode && <div className="dev-glow"></div>}
      <div className="relative z-10 flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );

  if (gameState === GameState.MENU) {
    return (
      <AppWrapper>
        {/* TOP HUD BAR */}
        <div className="p-8 flex justify-between items-start w-full max-w-7xl mx-auto">
           <button onClick={() => setGameState(GameState.PROFILE)} className="group flex items-center gap-5 p-2 pr-8 bg-black/40 rounded-2xl border border-white/5 hover:border-blue-500/50 transition-all backdrop-blur-2xl">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-blue-600/50 shadow-2xl">
                 <img src={`https://robohash.org/${userProfile.avatarId}?set=set1`} alt="avatar" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                 <div className="absolute inset-0 bg-blue-500/10 group-hover:bg-transparent"></div>
              </div>
              <div className="text-left">
                <div className="text-[10px] text-blue-500 font-bold uppercase tracking-[0.3em]">Agent ID</div>
                <div className="font-bold text-white text-xl tracking-tighter group-hover:text-blue-400 transition-colors">{userProfile.username}</div>
              </div>
           </button>
           
           <div className="flex gap-6">
             <NetworkStatus />
             <div className="flex gap-3">
               <a href="https://dedektif-masasi.vercel.app/" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center group">
                 <div className="w-14 h-14 bg-black/60 border border-white/10 rounded-xl flex items-center justify-center group-hover:bg-indigo-600/20 group-hover:border-indigo-500 transition-all shadow-xl group-hover:scale-110 relative">
                   <HUDDecoration />
                   <span className="text-3xl grayscale group-hover:grayscale-0">🕵️</span>
                 </div>
                 <span className="text-[8px] font-black mt-1 text-white/30 tracking-widest uppercase">Detective</span>
               </a>
               <button onClick={() => setGameState(GameState.SHOP)} className="flex flex-col items-center group">
                 <div className="w-14 h-14 bg-black/60 border border-white/10 rounded-xl flex items-center justify-center group-hover:bg-yellow-600/20 group-hover:border-yellow-500 transition-all shadow-xl group-hover:scale-110 relative">
                   <HUDDecoration />
                   <span className="text-3xl grayscale group-hover:grayscale-0">🛒</span>
                 </div>
                 <span className="text-[8px] font-black mt-1 text-white/30 tracking-widest uppercase">Storage</span>
               </button>
               <button onClick={() => setGameState(GameState.SETTINGS)} className="flex flex-col items-center group">
                 <div className="w-14 h-14 bg-black/60 border border-white/10 rounded-xl flex items-center justify-center group-hover:bg-gray-600/20 group-hover:border-gray-500 transition-all shadow-xl group-hover:scale-110 relative">
                   <HUDDecoration />
                   <span className="text-3xl grayscale group-hover:grayscale-0">⚙️</span>
                 </div>
                 <span className="text-[8px] font-black mt-1 text-white/30 tracking-widest uppercase">Config</span>
               </button>
             </div>
           </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-4 relative">
           <div className="relative z-10 flex flex-col items-center max-w-5xl w-full">
               <div className="mb-20 text-center animate-[fadeIn_1.5s_ease-out]">
                  <h1 className="text-7xl md:text-9xl font-black mb-4 hud-title select-none">
                    <span className="text-white">BOMBA</span>
                    <span className="text-blue-600 ml-6">İMHA</span>
                  </h1>
                  <div className="flex items-center justify-center gap-4">
                     <div className="h-[1px] w-20 bg-gradient-to-r from-transparent to-blue-500"></div>
                     <div className="text-xs mono tracking-[0.8em] text-blue-500 font-bold uppercase">Tactical Suite 2025 // v5.2</div>
                     <div className="h-[1px] w-20 bg-gradient-to-l from-transparent to-blue-500"></div>
                  </div>
               </div>

               <div className="flex flex-col md:flex-row gap-12 w-full max-w-4xl">
                  <button onClick={() => setGameState(GameState.LEVEL_SELECT)} className="flex-1 btn-cyber group relative h-48 bg-black/40 border border-white/10 rounded-3xl transition-all hover:border-blue-500 hover:scale-[1.02] shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                     <HUDDecoration />
                     <div className="relative h-full flex flex-col items-center justify-center gap-4">
                        <div className="text-7xl group-hover:scale-110 transition-transform duration-700">💣</div>
                        <div className="text-center">
                           <div className="text-3xl font-black text-white group-hover:text-blue-500 transition-colors tracking-tighter uppercase">Görev Başlat</div>
                           <div className="text-blue-400/40 text-[9px] mono tracking-widest uppercase mt-1">Saha Operasyon Merkezi</div>
                        </div>
                     </div>
                  </button>

                  <button onClick={() => setGameState(GameState.MANUAL)} className="flex-1 btn-cyber group relative h-48 bg-black/40 border border-white/10 rounded-3xl transition-all hover:border-blue-500 hover:scale-[1.02] shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                     <HUDDecoration />
                     <div className="relative h-full flex flex-col items-center justify-center gap-4">
                        <div className="text-7xl group-hover:scale-110 transition-transform duration-700">📘</div>
                        <div className="text-center">
                           <div className="text-3xl font-black text-white group-hover:text-blue-500 transition-colors tracking-tighter uppercase">Prosedür</div>
                           <div className="text-blue-400/40 text-[9px] mono tracking-widest uppercase mt-1">Teknik Belgeler Arşivi</div>
                        </div>
                     </div>
                  </button>
               </div>
           </div>
        </div>

        <TerminalLogs />

        <div className="p-10 flex justify-between items-center text-[9px] mono text-white/10 tracking-[0.4em] uppercase">
          <div>Authorization: SemiHBaba_Corp</div>
          <div>All Systems Nominal // Local Time: {new Date().toLocaleTimeString()}</div>
        </div>
      </AppWrapper>
    );
  }

  const SubViewWrapper: React.FC<{children: React.ReactNode}> = ({children}) => (<AppWrapper>{children}</AppWrapper>);

  if (gameState === GameState.LEVEL_SELECT) return <SubViewWrapper><LevelSelect userProfile={userProfile} onSelectLevel={(l) => { setSelectedLevel(l); setRole(Role.DEFUSER); setGameState(GameState.PLAYING); }} onBack={() => setGameState(GameState.MENU)} /></SubViewWrapper>;
  if (gameState === GameState.SHOP) return <SubViewWrapper><ShopView userProfile={userProfile} setUserProfile={setUserProfile} onBack={() => setGameState(GameState.MENU)} /></SubViewWrapper>;
  if (gameState === GameState.PROFILE) return <SubViewWrapper><ProfileView userProfile={userProfile} setUserProfile={setUserProfile} onBack={() => setGameState(GameState.MENU)} onReset={() => { localStorage.clear(); setUserProfile(loadProfile()); setGameState(GameState.MENU); }} /></SubViewWrapper>;
  if (gameState === GameState.SETTINGS) return <SubViewWrapper><SettingsView userProfile={userProfile} setUserProfile={setUserProfile} onBack={() => setGameState(GameState.MENU)} /></SubViewWrapper>;
  if (gameState === GameState.MANUAL) return <ManualView onBack={() => setGameState(GameState.MENU)} />;

  if (gameState === GameState.PLAYING && role === Role.DEFUSER) {
    return <DefuserView setGameState={setGameState} level={selectedLevel} packId="main_campaign" userProfile={userProfile} setUserProfile={setUserProfile} activeThemeData={activeTheme} />;
  }

  if (gameState === GameState.EXPLODED || gameState === GameState.DEFUSED) {
     const isWin = gameState === GameState.DEFUSED;
     return (
       <div className={`h-screen w-full ${isWin ? 'bg-black' : 'bg-red-950 shake-screen'} flex flex-col items-center justify-center text-center z-50 p-6 relative overflow-hidden`}>
          <div className="scanline"></div>
          <div className="relative z-10 animate-[scaleIn_0.4s_ease-out]">
            <h1 className={`text-9xl font-black mb-6 ${isWin ? 'text-blue-400 drop-shadow-[0_0_30px_rgba(59,130,246,0.5)]' : 'text-red-500 drop-shadow-[0_0_30px_rgba(220,38,38,0.5)]'}`}>
              {isWin ? 'CLEAR' : 'ERROR'}
            </h1>
            <p className="text-3xl text-white/80 mb-14 mono tracking-[0.2em] font-bold uppercase">
              {isWin ? 'Operation Successful' : 'Signal Lost - Core Integrity Zero'}
            </p>
            {isWin && (
              <div className="mb-8 text-yellow-500 font-bold text-2xl animate-bounce mono uppercase">
                Reward: +$20 Combat Bonus
              </div>
            )}
            <div className="flex flex-col md:flex-row gap-6 w-full max-w-lg mx-auto">
              {isWin && selectedLevel < 100 && (
                <button onClick={() => { setSelectedLevel(s => s + 1); setGameState(GameState.PLAYING); }} className="flex-1 btn-cyber px-10 py-6 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl shadow-2xl transition-all uppercase tracking-widest text-sm">Next Mission</button>
              )}
              <button onClick={() => setGameState(GameState.MENU)} className="flex-1 btn-cyber px-10 py-6 bg-white/5 hover:bg-white/10 border-2 border-white/20 text-white font-black rounded-2xl shadow-2xl transition-all uppercase tracking-widest text-sm">Return to Hub</button>
            </div>
          </div>
       </div>
     );
  }

  return null;
};

export default App;