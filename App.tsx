import React, { useState, useEffect } from 'react';
import { GameState, Role, UserProfile } from './types';
import DefuserView from './views/DefuserView';
import ManualView from './views/ManualView';
import LevelSelect from './views/LevelSelect';
import ShopView, { THEMES } from './views/ShopView';
import ProfileView from './views/ProfileView';
import SettingsView from './views/SettingsView';
import { loadProfile } from './utils';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [role, setRole] = useState<Role>(Role.NONE);
  const [userProfile, setUserProfile] = useState<UserProfile>(loadProfile());
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [selectedPack, setSelectedPack] = useState<string>('main_campaign');

  useEffect(() => { setUserProfile(loadProfile()); }, []);

  const handleLevelSelect = (lvl: number) => {
    setRole(Role.DEFUSER);
    setGameState(GameState.PLAYING);
  };

  const activeTheme = THEMES.find(t => t.id === userProfile.activeTheme) || THEMES[0];

  const AppWrapper: React.FC<{children: React.ReactNode}> = ({children}) => (
    <div className={`h-screen w-full ${activeTheme.bgClass} transition-colors duration-500 text-white font-sans relative overflow-hidden flex flex-col`}>
      {userProfile.isDevMode && <div className="dev-glow"></div>}
      <div className="scanline pointer-events-none"></div>
      {children}
    </div>
  );

  if (gameState === GameState.MENU) {
    return (
      <AppWrapper>
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#444 1px, transparent 1px), linear-gradient(90deg, #444 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

        {/* TOP BAR */}
        <div className="relative z-50 p-6 flex justify-between items-start">
           <button onClick={() => setGameState(GameState.PROFILE)} className="flex items-center gap-3 bg-black/40 backdrop-blur-md border border-white/10 p-2 pr-6 rounded-full hover:bg-white/10 transition-all group">
              <div className="w-12 h-12 rounded-full border-2 border-blue-500 overflow-hidden relative bg-black/50">
                 <img src={`https://robohash.org/${userProfile.avatarId}?set=set1`} alt="avatar" className="w-full h-full object-cover" />
              </div>
              <div className="text-left">
                <div className="text-xs text-gray-400 uppercase tracking-wider">Operatör</div>
                <div className="font-bold text-white group-hover:text-blue-400">{userProfile.username}</div>
              </div>
           </button>
           <div className="flex gap-4">
             <a 
               href="https://sherlock-two.vercel.app/" 
               target="_blank" 
               rel="noopener noreferrer"
               className="flex flex-col items-center gap-1 group"
             >
               <div className="w-12 h-12 bg-black/40 border border-indigo-500/30 rounded-lg flex items-center justify-center group-hover:bg-indigo-500/20 transition-all">
                 <span className="text-2xl">🕵️</span>
               </div>
               <span className="text-[10px] font-bold text-indigo-500/70 tracking-widest">DEDEKTİF</span>
             </a>

             <button onClick={() => setGameState(GameState.SHOP)} className="flex flex-col items-center gap-1 group">
               <div className="w-12 h-12 bg-black/40 border border-yellow-500/30 rounded-lg flex items-center justify-center group-hover:bg-yellow-500/20 transition-all"><span className="text-2xl">🛒</span></div>
               <span className="text-[10px] font-bold text-yellow-500/70 tracking-widest">MARKET</span>
             </button>
             <button onClick={() => setGameState(GameState.SETTINGS)} className="flex flex-col items-center gap-1 group">
               <div className="w-12 h-12 bg-black/40 border border-gray-500/30 rounded-lg flex items-center justify-center group-hover:bg-gray-500/20 transition-all"><span className="text-2xl">⚙️</span></div>
               <span className="text-[10px] font-bold text-gray-500/70 tracking-widest">AYARLAR</span>
             </button>
           </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-4">
           {/* Animations */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none z-0">
              <div className="absolute inset-0 border border-white/5 rounded-full animate-[spin_20s_linear_infinite]"></div>
           </div>

           <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl relative z-10 flex flex-col items-center max-w-3xl w-full">
               <div className="mb-12 text-center">
                  <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none drop-shadow-2xl mb-2">
                    <span className="text-white">BOMBA</span><span className="text-red-600 ml-3">İMHA</span>
                  </h1>
                  <div className="bg-black/50 inline-block px-6 py-1 rounded-full text-sm font-mono tracking-[0.4em] text-blue-400 border border-blue-500/30">PROTOKOLÜ v4.3</div>
               </div>
               <div className="flex flex-col md:flex-row gap-6 w-full">
                  <button onClick={() => setGameState(GameState.LEVEL_SELECT)} className="flex-1 group relative h-28 bg-gradient-to-r from-red-900/40 to-black/40 border border-red-500/30 rounded-xl overflow-hidden hover:border-red-500 transition-all hover:scale-105">
                     <div className="absolute inset-0 bg-red-600/10 group-hover:bg-red-600/20 transition-colors"></div>
                     <div className="relative h-full flex items-center justify-center gap-4">
                        <div className="text-4xl group-hover:animate-pulse">💣</div>
                        <div className="text-left"><div className="text-xl font-bold text-white">OPERASYON</div><div className="text-red-400 text-xs tracking-wider">GÖREVE BAŞLA</div></div>
                     </div>
                  </button>
                  <button onClick={() => setGameState(GameState.MANUAL)} className="flex-1 group relative h-28 bg-gradient-to-r from-blue-900/40 to-black/40 border border-blue-500/30 rounded-xl overflow-hidden hover:border-blue-500 transition-all hover:scale-105">
                     <div className="absolute inset-0 bg-blue-600/10 group-hover:bg-blue-600/20 transition-colors"></div>
                     <div className="relative h-full flex items-center justify-center gap-4">
                        <div className="text-4xl group-hover:rotate-6 transition-transform">📘</div>
                        <div className="text-left"><div className="text-xl font-bold text-white">KILAVUZ</div><div className="text-blue-400 text-xs tracking-wider">TEKNİK BELGELER</div></div>
                     </div>
                  </button>
               </div>
           </div>
        </div>
      </AppWrapper>
    );
  }

  // Sub wrapper
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
       <div className={`h-screen w-full ${isWin ? 'bg-green-900' : 'bg-red-950 shake-screen'} flex flex-col items-center justify-center text-center z-50 p-6 relative overflow-hidden`}>
          <div className="scanline"></div>
          <h1 className={`text-8xl font-black mb-4 ${isWin ? 'text-green-400' : 'text-red-500'}`}>{isWin ? 'TEMİZ' : 'BOOM'}</h1>
          <p className="text-2xl text-white mb-8 font-mono">{isWin ? 'TEHDİT ORTADAN KALDIRILDI.' : 'SİNYAL KAYBI.'}</p>
          <div className="flex flex-col md:flex-row gap-4 w-full max-w-md z-10">
            {isWin && selectedLevel < 100 && <button onClick={() => { setSelectedLevel(s => s + 1); setGameState(GameState.PLAYING); }} className="flex-1 px-6 py-4 bg-white text-black font-bold rounded">SONRAKİ</button>}
            <button onClick={() => setGameState(GameState.MENU)} className="flex-1 px-6 py-4 border-2 border-white text-white font-bold rounded">MENÜ</button>
          </div>
       </div>
     );
  }

  return null;
};

export default App;