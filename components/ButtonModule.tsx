import React from 'react';
import { ButtonModuleData } from '../types';

interface ButtonModuleProps {
  data: ButtonModuleData;
  onPressStart: () => void;
  onPressEnd: () => void;
  solved: boolean;
}

const ButtonModule: React.FC<ButtonModuleProps> = ({ data, onPressStart, onPressEnd, solved }) => {
  const getColorClass = (c: string) => {
    switch(c) {
      case 'red': return 'bg-red-600 border-red-800';
      case 'blue': return 'bg-blue-600 border-blue-800';
      case 'yellow': return 'bg-yellow-500 border-yellow-700';
      case 'white': return 'bg-gray-100 border-gray-300 text-black';
      default: return 'bg-gray-500';
    }
  };

  const getStripClass = (c?: string) => {
    if (!c) return 'bg-transparent';
    switch(c) {
      case 'red': return 'bg-red-500 shadow-[0_0_15px_red]';
      case 'blue': return 'bg-blue-500 shadow-[0_0_15px_blue]';
      case 'yellow': return 'bg-yellow-400 shadow-[0_0_15px_yellow]';
      case 'white': return 'bg-white shadow-[0_0_15px_white]';
      default: return 'bg-transparent';
    }
  };

  return (
    <div className="bg-stone-200 p-4 rounded-sm shadow-lg border-2 border-stone-400 relative flex flex-col items-center justify-center">
      <div className="absolute top-1 right-2 w-3 h-3 rounded-full bg-black border border-gray-600">
        <div className={`w-full h-full rounded-full ${solved ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-black'}`}></div>
      </div>

      <h3 className="text-stone-600 font-bold mb-4 text-xs uppercase tracking-wider w-full border-b border-stone-300 pb-1">Modül Delta: Buton</h3>

      <div className="flex gap-4 items-center">
        <button
          onMouseDown={!solved ? onPressStart : undefined}
          onMouseUp={!solved ? onPressEnd : undefined}
          onTouchStart={!solved ? onPressStart : undefined}
          onTouchEnd={!solved ? onPressEnd : undefined}
          disabled={solved}
          className={`
            w-32 h-32 rounded-full border-b-8 active:border-b-0 active:translate-y-2 transition-all
            flex items-center justify-center
            ${getColorClass(data.color)}
            ${solved ? 'opacity-50 cursor-not-allowed' : 'hover:brightness-110 shadow-xl'}
          `}
        >
          <span className={`font-bold text-xl ${data.color === 'white' ? 'text-black' : 'text-white'}`}>
            {data.label}
          </span>
        </button>

        {/* Indicator Strip - Shows when held */}
        <div className="h-24 w-4 bg-black rounded border border-gray-600 overflow-hidden relative">
          {data.isHeld && !solved && (
            <div className={`absolute inset-0 animate-pulse ${getStripClass(data.stripColor)}`}></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ButtonModule;