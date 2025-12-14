import React from 'react';
import { WordModuleData } from '../types';

interface WordModuleProps {
  data: WordModuleData;
  onPress: (label: string) => void;
  solved: boolean;
}

const WordModule: React.FC<WordModuleProps> = ({ data, onPress, solved }) => {
  return (
    <div className="bg-zinc-800 p-4 rounded-sm shadow-lg border-2 border-zinc-600 relative">
       <div className="absolute top-1 right-2 w-3 h-3 rounded-full bg-black border border-gray-600">
        <div className={`w-full h-full rounded-full ${solved ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-black'}`}></div>
      </div>

      <h3 className="text-gray-400 font-bold mb-2 text-xs uppercase tracking-wider border-b border-gray-700 pb-1">Modül Beta: Kelimeler</h3>

      {/* Screen */}
      <div className="bg-black border-4 border-gray-700 mb-4 h-16 flex items-center justify-center rounded">
        <span className={`digital-font text-3xl ${solved ? 'text-green-500' : 'text-amber-500'}`}>
          {solved ? "OK" : data.displayWord}
        </span>
      </div>

      {/* Keypad */}
      <div className="grid grid-cols-2 gap-2">
        {data.buttons.map((label, idx) => (
          <button
            key={idx}
            onClick={() => onPress(label)}
            disabled={solved}
            className={`
              h-12 bg-gray-200 border-b-4 border-gray-400 rounded active:border-b-0 active:translate-y-1 active:bg-gray-300
              font-bold text-zinc-900 transition-colors
              ${solved ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white'}
            `}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default WordModule;