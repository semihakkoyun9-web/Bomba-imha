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
       const baseReward = 50 + (bomb.level * 10);
       const timeBonus = bomb.timeLeft * 2;
       newProfile.money += baseReward + timeBonus;
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

  // --- Handlers ---
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

  // --- LOGIC IMPLEMENTED ---
  
  const handleSimonPress = (modIndex: number, color: string) => {
    setBomb(prev => {
      if(!prev) return null; const mod = prev.modules[modIndex];
      const correctColor = mod.data.sequence[mod.data.inputSequence.length];
      const newInputSeq = [...mod.data.inputSequence, color];
      const nm = [...prev.modules];
      
      if(color === correctColor) {
        if(newInputSeq.length === mod.data.stage + 1) {
           // Stage Complete
           if(mod.data.stage + 1 === mod.data.sequence.length) {
              // Module Solved
              nm[modIndex] = {...mod, solved:true, data: {...mod.data, inputSequence: newInputSeq}};
           } else {
              // Advance Stage, Clear Input
              nm[modIndex] = {...mod, data: {...mod.data, stage: mod.data.stage + 1, inputSequence: []}};
           }
        } else {
           // Correct input, wait for next
           nm[modIndex] = {...mod, data: {...mod.data, inputSequence: newInputSeq}};
        }
      } else {
        // WRONG INPUT
        handleStrike();
        nm[modIndex] = {...mod, data: {...mod.data, inputSequence: []}}; // Reset input for current stage
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
         
         // 1. Boundary Check
         if(next.x < 0 || next.x > 5 || next.y < 0 || next.y > 5) { handleStrike(); return prev; }
         
         // 2. Wall Collision Check
         if(checkMazeCollision(current, next, mod.data.walls)) {
             handleStrike(); return prev;
         }

         // 3. Move Logic
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

  if (!bomb) return <div className="text-white p-10">Bomba Hazırlanıyor...</div>;

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen p-4 ${activeThemeData.bgClass} relative transition-colors duration-500`}>
      <div className="scanline"></div>
      
      {/* HUD */}
      <div className="w-full max-w-4xl flex justify-between items-start mb-4 z-20">
        <button onClick={() => setGameState(GameState.MENU)} className="bg-red-900/50 text-red-200 border border-red-500 px-3 py-1 rounded hover:bg-red-800 text-sm">
          &lt; TESLİM OL
        </button>
        <div className="text-right">
           <div className={`text-xl font-bold ${activeThemeData.fontClass}`}>LEVEL {level}</div>
           <div className="text-xs text-white/50">{bomb.serialOdd ? 'S/N: ODD-591' : 'S/N: EVN-240'}</div>
           <div className="text-xs text-white/50 flex gap-2 justify-end">
              {bomb.hasBatteries && <span>[BATT]</span>}
              {bomb.hasParallelPort && <span>[PAR]</span>}
              {bomb.hasIndicator && <span>[IND]</span>}
           </div>
        </div>
      </div>

      <div className="w-full max-w-2xl flex justify-between items-end mb-6 z-20">
        <div className="flex gap-2">
          {Array.from({ length: bomb.maxStrikes }).map((_, i) => (
            <div key={i} className={`w-8 h-8 rounded-full border-2 border-red-900 flex items-center justify-center ${i < bomb.strikes ? 'bg-red-600 animate-pulse' : 'bg-black'}`}>X</div>
          ))}
        </div>
        <Timer seconds={bomb.timeLeft} />
      </div>

      <div className={`${activeThemeData.panelClass} p-4 md:p-8 rounded-xl shadow-2xl border-4 ${activeThemeData.accentClass} z-20 max-w-6xl w-full max-h-[70vh] overflow-y-auto`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                   <div key={index} className="bg-zinc-300 p-2 rounded border-2 border-zinc-500 relative">
                      <div className={`absolute top-1 right-1 w-3 h-3 rounded-full ${mod.solved ? 'bg-green-500' : 'bg-black'}`}></div>
                      <h4 className="text-xs font-bold mb-2 text-black border-b border-black">M: KARMAŞIK</h4>
                      <div className="flex justify-around h-32">
                        {mod.data.map((w: any, idx: number) => (
                           <div key={idx} className="flex flex-col items-center justify-between h-full">
                              <div className={`w-2 h-2 rounded-full ${w.isLedOn ? 'bg-green-500 shadow-[0_0_5px_lime]' : 'bg-black/20'}`}></div>
                              {w.hasStar && <span className="text-black text-xs">★</span>}
                              <button 
                                onClick={() => handleComplexCut(index, idx)} disabled={mod.solved || w.isCut}
                                className={`w-2 h-full ${w.isCut ? 'border-dashed border-2 border-black bg-transparent' : ''}`}
                                style={{ backgroundColor: w.isCut ? 'transparent' : (w.color.red && w.color.blue ? 'purple' : w.color.red ? 'red' : w.color.blue ? 'blue' : 'white'), border: w.isCut ? 'none' : '1px solid gray' }}
                              ></button>
                              {w.isCut && <div className="w-full h-1 bg-black"></div>}
                           </div>
                        ))}
                      </div>
                   </div>
                );
              case ModuleType.VENTING:
                return (
                   <div key={index} className="bg-zinc-800 p-4 rounded border-2 border-yellow-600 relative">
                      <div className={`absolute top-1 right-1 w-3 h-3 rounded-full ${mod.solved ? 'bg-green-500' : 'bg-black'}`}></div>
                      <div className="text-yellow-500 font-mono text-center mb-2">{mod.data.question}</div>
                      <div className="flex gap-2">
                         <button onClick={() => handleVentingAnswer(index, 'EVET')} className="flex-1 bg-gray-200 rounded p-1 font-bold hover:bg-white">E</button>
                         <button onClick={() => handleVentingAnswer(index, 'HAYIR')} className="flex-1 bg-gray-200 rounded p-1 font-bold hover:bg-white">H</button>
                      </div>
                   </div>
                );
              case ModuleType.MAZE:
                return (
                  <div key={index} className="bg-zinc-200 p-2 rounded border-2 border-zinc-500 relative">
                     <div className={`absolute top-1 right-1 w-3 h-3 rounded-full ${mod.solved ? 'bg-green-500' : 'bg-black'}`}></div>
                     <div className="grid grid-cols-6 gap-1 w-32 mx-auto">
                        {Array.from({length:36}).map((_, i) => {
                            const x = i % 6; const y = Math.floor(i / 6);
                            const isPlayer = x === mod.data.currentPos.x && y === mod.data.currentPos.y;
                            const isEnd = x === mod.data.endPos.x && y === mod.data.endPos.y;
                            // Check if this cell is a marker
                            const isMarker = mod.data.markers.some((m: any) => m.x === x && m.y === y);

                            return (
                               <div key={i} className={`w-4 h-4 border border-gray-300 relative ${isPlayer ? 'bg-red-500' : isEnd ? 'bg-green-500' : 'bg-white'}`}>
                                  {isMarker && !isPlayer && !isEnd && <div className="absolute inset-0 m-auto w-2 h-2 rounded-full border border-green-700"></div>}
                               </div>
                            )
                        })}
                     </div>
                     <div className="grid grid-cols-3 gap-1 mt-2 w-20 mx-auto">
                        <div></div><button onClick={() => handleMazeMove(index, {x:0,y:-1})} className="bg-gray-400 p-1 rounded hover:bg-white">^</button><div></div>
                        <button onClick={() => handleMazeMove(index, {x:-1,y:0})} className="bg-gray-400 p-1 rounded hover:bg-white">&lt;</button>
                        <button onClick={() => handleMazeMove(index, {x:0,y:1})} className="bg-gray-400 p-1 rounded hover:bg-white">v</button>
                        <button onClick={() => handleMazeMove(index, {x:1,y:0})} className="bg-gray-400 p-1 rounded hover:bg-white">&gt;</button>
                     </div>
                  </div>
                );
              case ModuleType.KNOB:
                 return (
                   <div key={index} className="bg-zinc-400 p-4 rounded border-2 border-zinc-600 relative flex flex-col items-center">
                      <div className={`absolute top-1 right-1 w-3 h-3 rounded-full ${mod.solved ? 'bg-green-500' : 'bg-black'}`}></div>
                      <div className="grid grid-cols-6 gap-1 mb-4">
                        {mod.data.leds.map((on: boolean, i: number) => (
                           <div key={i} className={`w-3 h-3 rounded-full ${on ? 'bg-yellow-400 shadow-[0_0_5px_yellow]' : 'bg-gray-700'}`}></div>
                        ))}
                      </div>
                      <div className="relative w-24 h-24 bg-zinc-800 rounded-full border-4 border-zinc-600 flex items-center justify-center">
                         <div className="text-white text-xs">ANAHTAR</div>
                         {/* Arrows */}
                         <button onClick={() => handleKnobRotate(index, 'UP')} className="absolute top-0 w-8 h-8 bg-gray-600/50 hover:bg-white/20 rounded-t-full text-white">▲</button>
                         <button onClick={() => handleKnobRotate(index, 'RIGHT')} className="absolute right-0 w-8 h-8 bg-gray-600/50 hover:bg-white/20 rounded-r-full text-white">▶</button>
                         <button onClick={() => handleKnobRotate(index, 'DOWN')} className="absolute bottom-0 w-8 h-8 bg-gray-600/50 hover:bg-white/20 rounded-b-full text-white">▼</button>
                         <button onClick={() => handleKnobRotate(index, 'LEFT')} className="absolute left-0 w-8 h-8 bg-gray-600/50 hover:bg-white/20 rounded-l-full text-white">◀</button>
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