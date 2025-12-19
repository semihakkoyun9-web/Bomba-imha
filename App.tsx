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

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [role, setRole] = useState<Role>(Role.NONE);
  const [userProfile, setUserProfile] = useState<UserProfile>(loadProfile());
  const [selectedLevel, setSelectedLevel] = useState<number>(1);

  useEffect(() => { 
    const profile = loadProfile();
    setUserProfile(profile);
  }, []);

  const activeTheme = THEMES.find(t => t.id === userProfile.activeTheme) || THEMES[0];

  const AppWrapper: React.FC<{children: React.ReactNode}> = ({children}) => (
    <div className={`fixed inset-0 w-full h-full ${activeTheme.bgClass} transition-colors duration-1000 text-white font-sans overflow-hidden flex flex-col`}>
      <div className="cloud-bg"></div>
      <div className="scanline pointer-events-none"></div>
      <div className="relative z-10 flex-1 flex flex-col overflow-y-auto custom-scrollbar">
        {children}
      </div>
    </div>
  );

  if (gameState === GameState.MENU) {
    return (
      <AppWrapper>
        {/* HEADER SECTION */}
        <div className="w-full max-w-7xl mx-auto p-4 md:p-8 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            {/* Profile Bar */}
            <button 
              onClick={() => setGameState(GameState.PROFILE)}
              className="flex items-center gap-3 p-1 pr-4 bg-black/40 border border-white/5 rounded-xl backdrop-blur-xl hover:border-blue-500/30 transition-all"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg overflow-hidden border border-blue-500/50">
                <img src={`https://robohash.org/${userProfile.avatarId}?set=set1`} alt="agent" className="w-full h-full object-cover" />
              </div>
              <div className="text-left hidden xs:block">
                <div className="text-[7px] text-blue-400 font-bold uppercase tracking-widest">ID:AGENT</div>
                <div className="text-xs md:text-sm font-bold truncate max-w-[100px]">{userProfile.username}</div>
              </div>
            </button>

            {/* Money Display */}
            <div className="flex flex-col items-end px-3">
              <span className="text-[7px] text-emerald-500 font-bold tracking-widest uppercase">Combat Fund</span>
              <span className="text-sm md:text-xl font-black text-emerald-400 mono">
                {userProfile.isDevMode ? "∞" : `$${userProfile.money}`}
              </span>
            </div>

            {/* Config & Shop Icons */}
            <div className="flex gap-2">
              <button 
                onClick={() => setGameState(GameState.SHOP)}
                className="w-10 h-10 md:w-12 md:h-12 bg-black/40 border border-white/5 rounded-lg flex items-center justify-center hover:bg-white/5 transition-all relative"
              >
                <HUDDecoration />
                <span className="text-xl">🛒</span>
              </button>
              <button 
                onClick={() => setGameState(GameState.SETTINGS)}
                className="w-10 h-10 md:w-12 md:h-12 bg-black/40 border border-white/5 rounded-lg flex items-center justify-center hover:bg-white/5 transition-all relative"
              >
                <HUDDecoration />
                <span className="text-xl">⚙️</span>
              </button>
            </div>
          </div>
          
          {/* Quick Access Detective (New Style) */}
          <a 
            href="https://dedektif-masasi.vercel.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full bg-indigo-600/10 border border-indigo-500/20 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-indigo-600/20 transition-all group"
          >
            <span className="text-lg">🕵️</span>
            <span className="text-[10px] font-black tracking-[0.3em] text-indigo-400 uppercase group-hover:text-indigo-300">DEDEKTİF MASASI</span>
          </a>
        </div>

        {/* HERO SECTION */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="mb-12 animate-[fadeIn_0.8s_ease-out]">
            <h1 className="text-4xl xs:text-5xl md:text-9xl font-black hud-title leading-tight mb-2">
              BOMBA <span className="text-blue-600">İMHA</span>
            </h1>
            <div className="flex items-center justify-center gap-2">
              <div className="h-[1px] w-8 md:w-16 bg-blue-500/30"></div>
              <span className="text-[8px] md:text-xs mono tracking-[0.5em] text-blue-500/60 uppercase">Tactical Operations v5.3</span>
              <div className="h-[1px] w-8 md:w-16 bg-blue-500/30"></div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="w-full max-w-lg flex flex-col gap-4 animate-[fadeInUp_0.8s_ease-out_0.2s_both]">
            <button 
              onClick={() => setGameState(GameState.LEVEL_SELECT)}
              className="btn-cyber w-full group py-6 md:py-8 bg-black/40 rounded-2xl flex items-center justify-between px-8 hover:border-blue-500 shadow-2xl transition-all"
            >
              <HUDDecoration />
              <div className="flex items-center gap-4">
                <span className="text-4xl md:text-5xl group-hover:scale-110 transition-transform">💣</span>
                <div className="text-left">
                  <div className="text-lg md:text-2xl font-black uppercase tracking-tighter">OPERASYON</div>
                  <div className="text-[8px] text-white/30 mono uppercase">Görev Dosyalarına Eriş</div>
                </div>
              </div>
              <span className="text-blue-500 text-xl font-bold opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </button>

            <button 
              onClick={() => setGameState(GameState.MANUAL)}
              className="btn-cyber w-full group py-6 md:py-8 bg-black/40 rounded-2xl flex items-center justify-between px-8 hover:border-blue-500 shadow-2xl transition-all"
            >
              <HUDDecoration />
              <div className="flex items-center gap-4">
                <span className="text-4xl md:text-5xl group-hover:scale-110 transition-transform">📘</span>
                <div className="text-left">
                  <div className="text-lg md:text-2xl font-black uppercase tracking-tighter">PROSEDÜR</div>
                  <div className="text-[8px] text-white/30 mono uppercase">İmha Kılavuzunu İncele</div>
                </div>
              </div>
              <span className="text-blue-500 text-xl font-bold opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </button>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-6 text-center opacity-10">
          <div className="text-[8px] tracking-[0.5em] mono uppercase">SemiHBaba_Corp // Secure Session Active</div>
        </div>
      </AppWrapper>
    );
  }

  // Subviews use the same wrapper for theme consistency
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
       <div className={`fixed inset-0 w-full h-full ${isWin ? 'bg-black' : 'bg-red-950'} flex flex-col items-center justify-center text-center z-[1000] p-6 overflow-hidden`}>
          <div className="scanline"></div>
          <div className="relative z-10 animate-[scaleIn_0.4s_ease-out] w-full max-w-md">
            <h1 className={`text-7xl md:text-9xl font-black mb-4 ${isWin ? 'text-blue-400' : 'text-red-500'}`}>
              {isWin ? 'CLEAR' : 'BOOM'}
            </h1>
            <p className="text-xl md:text-2xl text-white/70 mb-10 mono tracking-widest uppercase font-bold">
              {isWin ? 'Görev Tamamlandı' : 'Sistem Havaya Uçtu'}
            </p>
            {isWin && (
              <div className="mb-8 py-3 px-6 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                <span className="text-yellow-500 font-bold text-lg mono animate-pulse uppercase tracking-widest">Ödül: +$20 Combat Bonus</span>
              </div>
            )}
            <div className="flex flex-col gap-4">
              {isWin && selectedLevel < 100 && (
                <button onClick={() => { setSelectedLevel(s => s + 1); setGameState(GameState.PLAYING); }} className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl uppercase tracking-widest text-sm transition-all active:scale-95 shadow-xl">Sonraki Dosya</button>
              )}
              <button onClick={() => setGameState(GameState.MENU)} className="w-full py-5 bg-white/5 border border-white/20 text-white font-black rounded-xl uppercase tracking-widest text-sm transition-all hover:bg-white/10 active:scale-95">Merkeze Dön</button>
            </div>
          </div>
       </div>
     );
  }

  return null;
};

export default App;