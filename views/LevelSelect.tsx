import React, { useState } from 'react';
import { UserProfile } from '../types';

interface LevelSelectProps {
  userProfile: UserProfile;
  onSelectLevel: (lvl: number) => void;
  onBack: () => void;
}

const LevelSelect: React.FC<LevelSelectProps> = ({ userProfile, onSelectLevel, onBack }) => {
  const [activeFolder, setActiveFolder] = useState('main_campaign');

  const PACKS = [
    { id: 'main_campaign', name: 'ANA OPERASYON', count: 100 },
    { id: 'covert_ops', name: 'GİZLİ GÖREVLER', count: 20 },
    { id: 'nightmare', name: 'KABUS MODU', count: 15 }
  ];

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentPack = PACKS.find(p => p.id === activeFolder) || PACKS[0];
  const hasAccess = userProfile.ownedPacks.includes(activeFolder);

  return (
    <div className="h-full flex flex-col relative font-mono text-sm">
       {/* Sidebar / Topbar for Folders */}
       <div className="flex overflow-x-auto bg-black/60 border-b border-white/10 p-2 gap-2 backdrop-blur-md z-20">
          <button onClick={onBack} className="px-4 py-2 bg-red-900/40 border border-red-500/50 text-red-200 font-bold hover:bg-red-800">
             &lt; ÇIKIŞ
          </button>
          {PACKS.map(pack => {
             const isOwned = userProfile.ownedPacks.includes(pack.id);
             return (
               <button
                 key={pack.id}
                 onClick={() => setActiveFolder(pack.id)}
                 className={`
                   px-4 py-2 border-t-2 transition-all whitespace-nowrap
                   ${activeFolder === pack.id 
                     ? 'bg-white/10 border-yellow-500 text-yellow-500 font-bold' 
                     : isOwned ? 'bg-transparent border-gray-600 text-gray-400 hover:text-white' : 'bg-transparent border-gray-800 text-gray-700 cursor-not-allowed'}
                 `}
               >
                 {isOwned ? '📂 ' : '🔒 '}{pack.name}
               </button>
             );
          })}
       </div>

       {/* File List */}
       <div className="w-full flex-1 overflow-y-auto p-4 z-10">
         {!hasAccess ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
               <div className="text-6xl mb-4">🔒</div>
              <h2 className="text-2xl font-bold text-red-500">ERİŞİM REDDEDİLDİ</h2>
               <p className="text-gray-400">Bu dosya klasörüne erişim yetkiniz yok.</p>
               <p className="text-gray-500 text-xs mt-2">MARKET &gt; DOSYALAR sekmesinden yetki satın alın.</p>
            </div>
         ) : (
           <div className="bg-black/60 border border-white/10 rounded-sm shadow-2xl backdrop-blur-sm max-w-5xl mx-auto">
             <div className="flex border-b border-white/10 bg-white/5 p-3 text-slate-300 font-bold tracking-wider sticky top-0 backdrop-blur-md">
                <div className="w-16 text-center">DRM</div>
                <div className="flex-1">DOSYA ADI</div>
                <div className="w-32 text-center border-l border-white/10">DURUM</div>
                <div className="w-24 text-right border-l border-white/10">REKOR</div>
             </div>

             {Array.from({ length: currentPack.count }).map((_, i) => {
               const lvl = i + 1;
               const levelId = `${activeFolder}_${lvl}`;
               
               // Logic for Main Campaign
               // Current Frontier = maxLevel
               // Old / Passed = < maxLevel
               // Future / Locked = > maxLevel
               
               let isLocked = false;
               let isCurrent = false;

               if (activeFolder === 'main_campaign' && !userProfile.isDevMode) {
                  if (lvl > userProfile.maxLevel) isLocked = true;
                  if (lvl === userProfile.maxLevel) isCurrent = true;
               }

               const bestTime = userProfile.bestTimes ? userProfile.bestTimes[levelId] : undefined;
               const lastResult = userProfile.lastResults ? userProfile.lastResults[levelId] : undefined;

               // Colors based on user prompt:
               // Opened/Old (Blue), Current/Latest (Purple), Unopened/Locked (Green)
               let rowClass = "";
               let icon = "";
               
               if (isLocked) {
                  rowClass = "text-green-800 cursor-not-allowed opacity-60"; // Green for locked/future
                  icon = "🔒";
               } else if (isCurrent) {
                  rowClass = "text-purple-400 bg-purple-900/10 hover:bg-purple-900/20 cursor-pointer animate-pulse"; // Purple for current
                  icon = "⚡";
               } else {
                  rowClass = "text-blue-400 hover:bg-blue-900/20 cursor-pointer"; // Blue for old/played
                  icon = "📄";
               }

               return (
                 <button
                   key={lvl}
                   onClick={() => !isLocked && onSelectLevel(lvl)}
                   disabled={isLocked}
                   className={`w-full flex p-3 border-b border-white/5 items-center text-left transition-colors group ${rowClass}`}
                 >
                   <div className="w-16 flex items-center justify-center text-lg">
                     {icon}
                   </div>
                   
                   <div className="flex-1 flex items-center gap-3">
                     <span className="font-bold tracking-wider group-hover:underline truncate font-mono">
                       {activeFolder.toUpperCase()}_SEQ_{lvl.toString().padStart(3, '0')}.dat
                     </span>
                   </div>

                   <div className="w-32 text-center text-xs font-bold border-l border-white/10 flex items-center justify-center">
                      {isLocked ? (
                        <span className="text-green-900">ŞİFRELİ</span>
                      ) : lastResult === 'WIN' ? (
                        <span className="text-green-500 bg-green-900/30 px-2 py-1 rounded">TEMİZLENDİ</span>
                      ) : lastResult === 'LOSS' ? (
                         <span className="text-red-500 bg-red-900/30 px-2 py-1 rounded animate-pulse">KRİTİK HATA</span>
                      ) : (
                         <span className="text-gray-500">BEKLEMEDE</span>
                      )}
                   </div>

                   <div className="w-24 text-right text-xs font-mono border-l border-white/10 pl-2">
                     {bestTime !== undefined ? (
                       <span className="text-yellow-500">{formatTime(bestTime)}</span>
                     ) : (
                       <span className="text-slate-600">--:--</span>
                     )}
                   </div>
                 </button>
               );
             })}
           </div>
         )}
       </div>
    </div>
  );
};

export default LevelSelect;
