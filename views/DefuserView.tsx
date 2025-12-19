import React, { useState, useEffect, useCallback } from 'react';
import { BombState, GameState, ModuleType, UserProfile, Theme } from '../types';
import Timer from '../components/Timer';
import WireModule from '../components/WireModule';
import WordModule from '../components/WordModule';
import KeypadModule from '../components/KeypadModule';
import ButtonModule from '../components/ButtonModule';
import SimonModule from '../components/SimonModule';
import MorseModule from '../components/MorseModule';
import PasswordModule from '../components/PasswordModule';

import { 
  generateWires, generateWordModule, generateKeypadModule, generateButtonModule, generateSimonModule, 
  generateMorseModule, generatePasswordModule, generateMazeModule, generateComplexWiresModule, 
  generateVentingModule, generateKnobModule, getCorrectWireToCut, getLevelConfig, saveProfile, 
  handleButtonLogic, shouldCutComplexWire, checkMazeCollision
} from '../utils';

interface DefuserViewProps {
  setGameState: (state: GameState) => void;
  level: number;
  packId?: string;
  userProfile: UserProfile;
  setUserProfile: (p: UserProfile) => void;
  activeThemeData: Theme;
}

const DefuserView: React.FC<DefuserViewProps> = ({ 
  setGameState, level, packId = 'main_campaign', userProfile, setUserProfile, activeThemeData 
}) => {
  const [bomb, setBomb] = useState<BombState | null>(null);

  // Initialize
  useEffect(() => {
    const config = getLevelConfig(level, packId);
    
    const modules = config.modules.map((type, index) => {
      switch(type) {
        case ModuleType.WIRES: return { type, data: generateWires(level > 20 ? 6 : 5), solved: false };
        case ModuleType.WORDS: return { type, data: generateWordModule(index), solved: false };
        case ModuleType.KEYPAD: return { type, data: generateKeypadModule(index), solved: false };
        case ModuleType.BUTTON: return { type, data: generateButtonModule(index), solved: false };
        case ModuleType.SIMON: return { type, data: generateSimonModule(index), solved: false };
        case ModuleType.MORSE: return { type, data: generateMorseModule(index), solved: false };
        case ModuleType.PASSWORD: return { type, data: generatePasswordModule(index), solved: false };
        case ModuleType.MAZE: return { type, data: generateMazeModule(index), solved: false };
        case ModuleType.COMPLEX_WIRES: return generateComplexWiresModule(index);
        case ModuleType.VENTING: return { type, data: generateVentingModule(index), solved: false };
        case ModuleType.KNOB: return { type, data: generateKnobModule(index), solved: false };
        default: return { type, data: {}, solved: true };
      }
    });

    setBomb({
      modules,
      strikes: 0,
      maxStrikes: 3,
      timeLeft: config.time,
      totalTime: config.time,
      serialOdd: Math.random() < 0.5,
      hasBatteries: Math.random() < 0.5,
      hasIndicator: Math.random() < 0.5,
      hasParallelPort: Math.random() < 0.5,
      level
    });
  }, [level, packId]);

  // Timer
  useEffect(() => {
    if (!bomb) return;
    if (bomb.timeLeft <= 0) {
      handleGameEnd(false);
      return;
    }
    const timer = setInterval(() => {
      setBomb(prev => {
        if (!prev || prev.timeLeft <= 0) return prev;
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [bomb?.timeLeft]);

  // Win Check
  useEffect(() => {
    if (bomb && bomb.modules.every(m => m.solved)) {
      handleGameEnd(true);
    }
  }, [bomb?.modules]);

  const handleGameEnd = (isWin: boolean) => {
    if (!bomb) return;
    
    let newMaxLevel = userProfile.maxLevel;
    if (packId === 'main_campaign' && level === userProfile.maxLevel && level < 100) {
        newMaxLevel = userProfile.maxLevel + 1;
    }

    const newLastResults: Record<string, 'WIN' | 'LOSS'> = {
      ...userProfile.lastResults,
      [`${packId}_${level}`]: isWin ? 'WIN' : 'LOSS'
    };

    let newProfile: UserProfile = { 
      ...userProfile, 
      maxLevel: newMaxLevel, 
      gamesPlayed: userProfile.gamesPlayed + 1,
      lastResults: newLastResults
    };

    if (isWin) {
       // Standard calculation
       const baseReward = 50 + (bomb.level * 10);
       const timeBonus = bomb.timeLeft * 2;
       // Added +$20 FIXED BONUS for every victory
       const fixedBonus = 20; 
       
       newProfile.money += baseReward + timeBonus + fixedBonus;
       newProfile.gamesWon += 1;
       
       const levelKey = `${packId}_${level}`;
       const currentBest = userProfile.bestTimes?.[levelKey] || 0;
       if (bomb.timeLeft > currentBest) {
         newProfile.bestTimes = { ...userProfile.bestTimes, [levelKey]: bomb.timeLeft };
       }
    }

    saveProfile(newProfile);
    setUserProfile(newProfile);
    setGameState(isWin ? GameState.DEFUSED : GameState.EXPLODED);
  };

  const handleStrike = useCallback(() => {
    if (userProfile.settings.vibration && navigator.vibrate) navigator.vibrate(500);
    setBomb(prev => {
      if (!prev) return null;
      const newStrikes = prev.strikes + 1;
      if (newStrikes >= prev.maxStrikes) {
        setTimeout(() => handleGameEnd(false), 0);
        return { ...prev, strikes: newStrikes };
      }
      return { ...prev, strikes: newStrikes, timeLeft: Math.max(0, prev.timeLeft - 30) };
    });
  }, [userProfile, handleGameEnd]);

  const handleCutWire = (modIndex: number, wireIndex: number) => { 
     setBomb(prev => {
      if (!prev) return null;
      const mod = prev.modules[modIndex];
      if (mod.solved) return prev;
      const wires = [...mod.data];
      const correctIndex = getCorrectWireToCut(wires, prev.serialOdd);
      wires[wireIndex].isCut = true;
      const newModules = [...prev.modules];
      if (wireIndex === correctIndex) {
        newModules[modIndex] = { ...mod, data: wires, solved: true };
        return { ...prev, modules: newModules };
      } else {
        newModules[modIndex] = { ...mod, data: wires };
        handleStrike();
        return { ...prev, modules: newModules };
      }
    });
  };

  const handleWordPress = (i: number, l: string) => {
    setBomb(prev => {
        if(!prev) return null; const mod = prev.modules[i]; if(mod.solved) return prev;
        if(l === mod.data.correctLabel) {
            const nm = [...prev.modules]; nm[i] = {...mod, solved:true}; return {...prev, modules:nm};
        } else { handleStrike(); const nm = [...prev.modules]; nm[i] = {...mod, data: generateWordModule(i)}; return {...prev, modules:nm}; }
    });
  };

  const handleKeypadPress = (i: number, s: string) => {
      setBomb(prev => {
          if(!prev) return null; const mod = prev.modules[i]; if(mod.solved) return prev;
          const next = mod.data.correctOrder[mod.data.pressed.length];
          if(s === next) {
              const np = [...mod.data.pressed, s];
              const solved = np.length === 4;
              const nm = [...prev.modules]; nm[i] = {...mod, data: {...mod.data, pressed: np}, solved}; return {...prev, modules:nm};
          } else { handleStrike(); const nm = [...prev.modules]; nm[i] = {...mod, data: {...mod.data, pressed: []}}; return {...prev, modules:nm}; }
      });
  };

  const handleButton = (i: number, start: boolean) => {
      setBomb(prev => {
          if(!prev) return null; const mod = prev.modules[i]; if(mod.solved) return prev;
          const nd = {...mod.data, isHeld: start}; const nm = [...prev.modules]; nm[i] = {...mod, data:nd};
          if(start) return {...prev, modules:nm};
          const lastDigit = prev.timeLeft % 10;
          const res = handleButtonLogic('release', prev, mod.data, lastDigit);
          if(res.solved) { nm[i] = {...mod, data:nd, solved:true}; return {...prev, modules:nm}; }
          else if(res.strike) { handleStrike(); return {...prev, modules:nm}; }
          return {...prev, modules:nm};
      });
  };

  const handleSimonPress = (modIndex: number, color: string) => {
    setBomb(prev => {
      if(!prev) return null; const mod = prev.modules[modIndex];
      const correctColor = mod.data.sequence[mod.data.inputSequence.length];
      const newInputSeq = [...mod.data.inputSequence, color];
      const nm = [...prev.modules];
      
      if(color === correctColor) {
        if(newInputSeq.length === mod.data.stage + 1) {
           if(mod.data.stage + 1 === mod.data.sequence.length) {
              nm[modIndex] = {...mod, solved:true, data: {...mod.data, inputSequence: newInputSeq}};
           } else {
              nm[modIndex] = {...mod, data: {...mod.data, stage: mod.data.stage + 1, inputSequence: []}};
           }
        } else {
           nm[modIndex] = {...mod, data: {...mod.data, inputSequence: newInputSeq}};
        }
      } else {
        handleStrike();
        nm[modIndex] = {...mod, data: {...mod.data, inputSequence: []}};
      }
      return {...prev, modules:nm};
    });
  };

  const handleMorseSolve = (modIndex: number, freq: number) => {
    setBomb(prev => {
      if(!prev) return null; const mod = prev.modules[modIndex];
      if(Math.abs(freq - mod.data.frequency) < 0.001) {
        const nm = [...prev.modules]; nm[modIndex] = {...mod, solved:true}; return {...prev, modules:nm};
      } else {
        handleStrike(); return prev;
      }
    });
  };

  const handlePasswordChange = (modIndex: number, col: number, dir: number) => {
    setBomb(prev => {
      if(!prev) return null; const mod = prev.modules[modIndex];
      const newIndices = [...mod.data.currentIndices];
      const colLen = mod.data.columns[col].length;
      newIndices[col] = (newIndices[col] + dir + colLen) % colLen;
      const nm = [...prev.modules]; nm[modIndex] = {...mod, data: {...mod.data, currentIndices: newIndices}};
      return {...prev, modules:nm};
    });
  };

  const handlePasswordSubmit = (modIndex: number) => {
    setBomb(prev => {
       if(!prev) return null; const mod = prev.modules[modIndex];
       let formedWord = "";
       mod.data.columns.forEach((col: string[], i: number) => {
          formedWord += col[mod.data.currentIndices[i]];
       });
       if(formedWord === mod.data.targetWord) {
          const nm = [...prev.modules]; nm[modIndex] = {...mod, solved:true}; return {...prev, modules:nm};
       } else {
          handleStrike(); return prev;
       }
    });
  };
  
  const handleComplexCut = (modIndex: number, wireIndex: number) => {
      setBomb(prev => {
          if(!prev) return null; const mod = prev.modules[modIndex];
          const wires = [...mod.data];
          const wire = wires[wireIndex];
          if(wire.isCut) return prev;
          wire.isCut = true;
          
          if(shouldCutComplexWire(wire, prev)) {
             const isSolved = wires.every(w => {
                 const should = shouldCutComplexWire(w, prev);
                 return should === w.isCut; 
             });
             const nm = [...prev.modules]; nm[modIndex] = {...mod, data: wires, solved: isSolved};
             return {...prev, modules:nm};
          } else {
              handleStrike();
              return prev;
          }
      });
  };

  const handleVentingAnswer = (modIndex: number, ans: string) => {
     setBomb(prev => {
         if(!prev) return null; const mod = prev.modules[modIndex];
         const map: any = { 
            "HAVALANDIR?":"EVET", "PATLAT?":"HAYIR", "BOŞALT?":"EVET", "KİLİTLE?":"HAYIR",
            "BASINÇ?":"EVET", "AKIM?":"HAYIR", "SICAKLIK?":"HAYIR", "VANAYI AÇ?":"EVET"
         };
         if(ans === map[mod.data.question]) {
             const nm = [...prev.modules]; nm[modIndex] = {...mod, solved:true}; return {...prev, modules:nm};
         } else { handleStrike(); return prev; }
     });
  };

  const handleMazeMove = (modIndex: number, dir: {x:number, y:number}) => {
     setBomb(prev => {
         if(!prev) return null; const mod = prev.modules[modIndex];
         const current = mod.data.currentPos;
         const next = { x: current.x + dir.x, y: current.y + dir.y };
         if(next.x < 0 || next.x > 5 || next.y < 0 || next.y > 5) { handleStrike(); return prev; }
         if(checkMazeCollision(current, next, mod.data.walls)) {
             handleStrike(); return prev;
         }
         if(next.x === mod.data.endPos.x && next.y === mod.data.endPos.y) {
             const nm = [...prev.modules]; nm[modIndex] = {...mod, data: {...mod.data, currentPos: next}, solved:true}; return {...prev, modules:nm};
         }
         const nm = [...prev.modules]; nm[modIndex] = {...mod, data: {...mod.data, currentPos: next}}; return {...prev, modules:nm};
     });
  };

  const handleKnobRotate = (modIndex: number, dir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
    setBomb(prev => {
      if (!prev) return null; const mod = prev.modules[modIndex];
      const nm = [...prev.modules];
      if (dir === mod.data.correctPosition) {
         nm[modIndex] = { ...mod, solved: true };
      } else {
         handleStrike();
      }
      return { ...prev, modules: nm };
    });
  };

  if (!bomb) return <div className="text-white p-10 flex items-center justify-center min-h-screen mono animate-pulse uppercase tracking-[0.5em]">Establishing Connection...</div>;

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen p-4 ${activeThemeData.bgClass} relative transition-colors duration-500`}>
      <div className="scanline"></div>
      
      <div className="w-full max-w-4xl flex justify-between items-center mb-6 z-20 bg-black/60 p-5 rounded-3xl border border-white/5 backdrop-blur-2xl relative">
        <div className="hud-corner corner-tl"></div>
        <div className="hud-corner corner-tr"></div>
        <button onClick={() => setGameState(GameState.MENU)} className="bg-red-600/10 text-red-500 border border-red-500/20 px-6 py-2 rounded-xl hover:bg-red-600 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest shadow-lg">
          Terminate Mission
        </button>
        <div className="text-center">
           <div className={`text-2xl font-black ${activeThemeData.fontClass} tracking-tighter uppercase`}>Sector {level}</div>
           <div className="text-[9px] text-white/40 mono tracking-[0.3em] uppercase">Status: Armed</div>
        </div>
        <div className="flex gap-2">
           {bomb.hasBatteries && <span className="bg-blue-600/20 text-blue-400 text-[9px] px-3 py-1 rounded-lg border border-blue-500/20 font-black uppercase">PWR</span>}
           {bomb.hasParallelPort && <span className="bg-emerald-600/20 text-emerald-400 text-[9px] px-3 py-1 rounded-lg border border-emerald-500/20 font-black uppercase">LINK</span>}
        </div>
      </div>

      <div className="w-full max-w-3xl flex justify-between items-center mb-8 z-20 px-4">
        <div className="flex gap-4">
          {Array.from({ length: bomb.maxStrikes }).map((_, i) => (
            <div key={i} className={`w-14 h-14 rounded-2xl border-2 border-red-600/20 flex items-center justify-center transition-all ${i < bomb.strikes ? 'bg-red-600 shadow-[0_0_25px_rgba(220,38,38,0.5)] scale-110' : 'bg-black/60'}`}>
               <span className={`text-3xl font-black ${i < bomb.strikes ? 'text-white' : 'text-red-900/10'}`}>X</span>
            </div>
          ))}
        </div>
        <Timer seconds={bomb.timeLeft} />
      </div>

      <div className={`${activeThemeData.panelClass} p-4 md:p-12 rounded-[3rem] shadow-[0_0_150px_rgba(0,0,0,0.8)] border-2 border-white/5 z-20 max-w-7xl w-full max-h-[75vh] overflow-y-auto custom-scrollbar relative`}>
        <div className="hud-corner corner-tl"></div>
        <div className="hud-corner corner-tr"></div>
        <div className="hud-corner corner-bl"></div>
        <div className="hud-corner corner-br"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {bomb.modules.map((mod, index) => {
            switch(mod.type) {
              case ModuleType.WIRES: return <WireModule key={index} wires={mod.data} onCut={(i) => handleCutWire(index, i)} solved={mod.solved} />;
              case ModuleType.WORDS: return <WordModule key={index} data={mod.data} onPress={(l) => handleWordPress(index, l)} solved={mod.solved} />;
              case ModuleType.KEYPAD: return <KeypadModule key={index} data={mod.data} onPress={(s) => handleKeypadPress(index, s)} solved={mod.solved} />;
              case ModuleType.BUTTON: return <ButtonModule key={index} data={mod.data} onPressStart={() => handleButton(index, true)} onPressEnd={() => handleButton(index, false)} solved={mod.solved} />;
              case ModuleType.SIMON: return <SimonModule key={index} data={mod.data} onPress={(c) => handleSimonPress(index, c)} solved={mod.solved} strikes={bomb.strikes} />;
              case ModuleType.MORSE: return <MorseModule key={index} data={mod.data} onSolve={(f) => handleMorseSolve(index, f)} solved={mod.solved} />;
              case ModuleType.PASSWORD: return <PasswordModule key={index} data={mod.data} onChangeIndex={(c, d) => handlePasswordChange(index, c, d)} onSubmit={() => handlePasswordSubmit(index)} solved={mod.solved} />;
              case ModuleType.COMPLEX_WIRES:
                return (
                   <div key={index} className="bg-zinc-800/80 p-6 rounded-3xl border border-white/10 relative shadow-2xl backdrop-blur-md">
                      <div className={`absolute top-4 right-4 w-5 h-5 rounded-full border-2 border-black/20 ${mod.solved ? 'bg-blue-500 shadow-[0_0_15px_#3b82f6]' : 'bg-black/60'}`}></div>
                      <h4 className="text-[9px] font-black mb-6 text-white/30 border-b border-white/5 pb-2 uppercase tracking-[0.3em]">Complex Bus</h4>
                      <div className="flex justify-around h-40">
                        {mod.data.map((w: any, idx: number) => (
                           <div key={idx} className="flex flex-col items-center justify-between h-full bg-black/20 p-1 rounded-full border border-white/5">
                              <div className={`w-2 h-2 rounded-full ${w.isLedOn ? 'bg-blue-400 shadow-[0_0_10px_#60a5fa]' : 'bg-black/40'}`}></div>
                              {w.hasStar && <span className="text-white/40 text-[9px] font-bold">★</span>}
                              <button 
                                onClick={() => handleComplexCut(index, idx)} disabled={mod.solved || w.isCut}
                                className={`w-3 h-full rounded-full transition-all ${w.isCut ? 'opacity-20 bg-transparent border border-dashed border-white/20' : 'shadow-xl active:scale-90 hover:brightness-125'}`}
                                style={{ backgroundColor: w.isCut ? 'transparent' : (w.color.red && w.color.blue ? '#7e22ce' : w.color.red ? '#dc2626' : w.color.blue ? '#2563eb' : '#eee') }}
                              ></button>
                           </div>
                        ))}
                      </div>
                   </div>
                );
              case ModuleType.VENTING:
                return (
                   <div key={index} className="bg-zinc-900 p-8 rounded-3xl border border-yellow-500/20 relative shadow-2xl overflow-hidden backdrop-blur-md">
                      <div className="absolute top-0 left-0 w-full h-[2px] bg-yellow-500/30"></div>
                      <div className="text-yellow-500/80 mono text-center mb-8 text-2xl tracking-[0.2em]">{mod.data.question}</div>
                      <div className="flex gap-4">
                         <button onClick={() => handleVentingAnswer(index, 'EVET')} className="flex-1 bg-white/5 border border-white/10 rounded-2xl py-5 text-white font-black hover:bg-yellow-500 hover:text-black transition-all shadow-xl active:scale-95 text-xs uppercase tracking-widest">Confirm</button>
                         <button onClick={() => handleVentingAnswer(index, 'HAYIR')} className="flex-1 bg-white/5 border border-white/10 rounded-2xl py-5 text-white font-black hover:bg-red-600 hover:text-black transition-all shadow-xl active:scale-95 text-xs uppercase tracking-widest">Deny</button>
                      </div>
                   </div>
                );
              case ModuleType.MAZE:
                return (
                  <div key={index} className="bg-zinc-800/80 p-6 rounded-3xl border border-white/10 relative shadow-2xl backdrop-blur-md">
                     <h4 className="text-[9px] font-black mb-6 text-white/30 border-b border-white/5 pb-2 uppercase tracking-[0.3em]">Geo Nav</h4>
                     <div className="grid grid-cols-6 gap-1 w-48 mx-auto bg-black/40 p-2 rounded-2xl border border-white/5">
                        {Array.from({length:36}).map((_, i) => {
                            const x = i % 6; const y = Math.floor(i / 6);
                            const isPlayer = x === mod.data.currentPos.x && y === mod.data.currentPos.y;
                            const isEnd = x === mod.data.endPos.x && y === mod.data.endPos.y;
                            const isMarker = mod.data.markers.some((m: any) => m.x === x && m.y === y);
                            return (
                               <div key={i} className={`w-7 h-7 border border-white/5 relative rounded-lg transition-colors ${isPlayer ? 'bg-blue-500 shadow-[0_0_15px_#3b82f6] z-10' : isEnd ? 'bg-emerald-500/50' : 'bg-white/5'}`}>
                                  {isMarker && !isPlayer && !isEnd && <div className="absolute inset-0 m-auto w-3 h-3 rounded-full border border-emerald-500/50"></div>}
                               </div>
                            )
                        })}
                     </div>
                     <div className="grid grid-cols-3 gap-2 mt-8 w-40 mx-auto">
                        <div></div><button onClick={() => handleMazeMove(index, {x:0,y:-1})} className="bg-white/5 border border-white/10 text-white rounded-xl p-3 hover:bg-white hover:text-black transition-all shadow-lg active:scale-90">▲</button><div></div>
                        <button onClick={() => handleMazeMove(index, {x:-1,y:0})} className="bg-white/5 border border-white/10 text-white rounded-xl p-3 hover:bg-white hover:text-black transition-all shadow-lg active:scale-90">◀</button>
                        <button onClick={() => handleMazeMove(index, {x:0,y:1})} className="bg-white/5 border border-white/10 text-white rounded-xl p-3 hover:bg-white hover:text-black transition-all shadow-lg active:scale-90">▼</button>
                        <button onClick={() => handleMazeMove(index, {x:1,y:0})} className="bg-white/5 border border-white/10 text-white rounded-xl p-3 hover:bg-white hover:text-black transition-all shadow-lg active:scale-90">▶</button>
                     </div>
                  </div>
                );
              case ModuleType.KNOB:
                 return (
                   <div key={index} className="bg-zinc-800/80 p-8 rounded-3xl border border-white/10 relative flex flex-col items-center shadow-2xl backdrop-blur-md">
                      <div className="grid grid-cols-6 gap-3 mb-8">
                        {mod.data.leds.map((on: boolean, i: number) => (
                           <div key={i} className={`w-3 h-3 rounded-full border border-white/5 transition-all duration-300 ${on ? 'bg-blue-400 shadow-[0_0_10px_#60a5fa]' : 'bg-black/40'}`}></div>
                        ))}
                      </div>
                      <div className="relative w-44 h-44 bg-black/40 rounded-full border-4 border-white/5 flex items-center justify-center shadow-inner group">
                         <div className="text-white/20 text-[8px] font-black uppercase tracking-[0.4em]">Rotary</div>
                         <button onClick={() => handleKnobRotate(index, 'UP')} className="absolute top-0 w-20 h-14 bg-white/5 hover:bg-white/10 rounded-t-full text-white transition-all text-xs">▲</button>
                         <button onClick={() => handleKnobRotate(index, 'RIGHT')} className="absolute right-0 w-14 h-20 bg-white/5 hover:bg-white/10 rounded-r-full text-white transition-all text-xs">▶</button>
                         <button onClick={() => handleKnobRotate(index, 'DOWN')} className="absolute bottom-0 w-20 h-14 bg-white/5 hover:bg-white/10 rounded-b-full text-white transition-all text-xs">▼</button>
                         <button onClick={() => handleKnobRotate(index, 'LEFT')} className="absolute left-0 w-14 h-20 bg-white/5 hover:bg-white/10 rounded-l-full text-white transition-all text-xs">◀</button>
                      </div>
                   </div>
                 );
              default: return null;
            }
          })}
        </div>
      </div>
    </div>
  );
};

export default DefuserView;