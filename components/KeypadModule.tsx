import React from 'react';
import { KeypadModuleData } from '../types';

interface KeypadModuleProps {
  data: KeypadModuleData;
  onPress: (symbol: string) => void;
  solved: boolean;
}

const KeypadModule: React.FC<KeypadModuleProps> = ({ data, onPress, solved }) => {
  return (
    <div className="bg-stone-300 p-4 rounded-sm shadow-lg border-2 border-stone-500 relative">
      <div className="absolute top-1 right-2 w-3 h-3 rounded-full bg-black border border-gray-600">
        <div className={`w-full h-full rounded-full ${solved ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-black'}`}></div>
      </div>

      <h3 className="text-stone-700 font-bold mb-3 text-xs uppercase tracking-wider border-b border-stone-400 pb-1">Modül Gamma: Sembol</h3>

      <div className="grid grid-cols-2 gap-3">
        {data.symbols.map((symbol, idx) => {
          const isPressed = data.pressed.includes(symbol);
          return (
            <button
              key={idx}
              onClick={() => onPress(symbol)}
              disabled={solved || isPressed}
              className={`
                h-14 bg-stone-100 border-2 border-stone-400 rounded shadow-sm
                font-serif text-3xl text-black flex items-center justify-center
                transition-all
                ${solved ? 'opacity-50' : 'hover:bg-white active:scale-95'}
                ${isPressed ? 'bg-green-200 border-green-500' : ''}
              `}
            >
              {symbol}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default KeypadModule;