import React, { useEffect, useState } from 'react';
import { MorseModuleData } from '../types';

interface MorseProps {
  data: MorseModuleData;
  onSolve: (freq: number) => void;
  solved: boolean;
}

const MORSE_MAP: Record<string, string> = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..',
};

const MorseModule: React.FC<MorseProps> = ({ data, onSolve, solved }) => {
  const [lightOn, setLightOn] = useState(false);
  const [currentFreq, setCurrentFreq] = useState(data.frequency);

  // Blinking Logic
  useEffect(() => {
    if (solved) {
      setLightOn(false);
      return;
    }

    let mounted = true;
    const word = data.word;
    
    const playMorse = async () => {
      while (mounted) {
        for (let i = 0; i < word.length; i++) {
          const char = word[i];
          const code = MORSE_MAP[char];
          
          for (let j = 0; j < code.length; j++) {
            if (!mounted) return;
            setLightOn(true);
            const duration = code[j] === '.' ? 200 : 600;
            await new Promise(r => setTimeout(r, duration));
            
            if (!mounted) return;
            setLightOn(false);
            await new Promise(r => setTimeout(r, 200)); // Gap between parts
          }
          await new Promise(r => setTimeout(r, 600)); // Gap between letters
        }
        await new Promise(r => setTimeout(r, 1500)); // Gap between words
      }
    };

    playMorse();
    return () => { mounted = false; };
  }, [data.word, solved]);

  const changeFreq = (amount: number) => {
    if (solved) return;
    const newFreq = parseFloat((currentFreq + amount).toFixed(3));
    if (newFreq >= 3.500 && newFreq <= 3.600) {
      setCurrentFreq(newFreq);
    }
  };

  return (
    <div className="bg-orange-700 p-4 rounded-sm shadow-lg border-2 border-orange-900 relative">
      <div className="absolute top-1 right-2 w-3 h-3 rounded-full bg-black border border-gray-600">
        <div className={`w-full h-full rounded-full ${solved ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-black'}`}></div>
      </div>

      <h3 className="text-orange-200 font-bold mb-4 text-xs uppercase tracking-wider border-b border-orange-800 pb-1">Modül Zeta: Mors</h3>

      <div className="flex flex-col items-center gap-4">
        {/* Blinking Light */}
        <div className="flex items-center gap-4">
           <div className={`w-8 h-8 rounded-full border-2 border-yellow-900 transition-colors duration-75 ${lightOn ? 'bg-yellow-400 shadow-[0_0_20px_orange]' : 'bg-yellow-900'}`}></div>
           <span className="text-orange-200 text-xs w-24">Sinyal Alınıyor...</span>
        </div>

        {/* Tuner */}
        <div className="bg-black border-2 border-gray-600 px-4 py-2 rounded">
           <span className="digital-font text-3xl text-orange-500">{currentFreq.toFixed(3)} MHz</span>
        </div>

        {/* Controls */}
        <div className="flex gap-2">
           <button onClick={() => changeFreq(-0.005)} className="px-3 py-1 bg-gray-300 rounded font-bold hover:bg-white">&lt;</button>
           <button onClick={() => onSolve(currentFreq)} className="px-6 py-1 bg-orange-500 text-white font-bold rounded hover:bg-orange-400">GÖNDER</button>
           <button onClick={() => changeFreq(0.005)} className="px-3 py-1 bg-gray-300 rounded font-bold hover:bg-white">&gt;</button>
        </div>
      </div>
    </div>
  );
};

export default MorseModule;