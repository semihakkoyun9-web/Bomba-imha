import React from 'react';
import { WireColor, WireData } from '../types';

interface WireModuleProps {
  wires: WireData[];
  onCut: (index: number) => void;
  solved: boolean;
}

const getTailwindColor = (color: WireColor) => {
  switch (color) {
    case WireColor.RED: return 'bg-red-600';
    case WireColor.BLUE: return 'bg-blue-600';
    case WireColor.YELLOW: return 'bg-yellow-400';
    case WireColor.WHITE: return 'bg-gray-100';
    case WireColor.BLACK: return 'bg-gray-900';
    default: return 'bg-gray-500';
  }
};

const WireModule: React.FC<WireModuleProps> = ({ wires, onCut, solved }) => {
  return (
    <div className="bg-zinc-200 p-4 rounded-sm shadow-lg border-2 border-zinc-400 relative">
      <div className="absolute top-1 right-2 w-3 h-3 rounded-full bg-black border border-gray-600">
        <div className={`w-full h-full rounded-full ${solved ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-black'}`}></div>
      </div>
      
      <h3 className="text-zinc-800 font-bold mb-4 text-sm uppercase tracking-wider border-b border-zinc-400 pb-1">Modül Alpha: Kablolar</h3>
      
      <div className="flex flex-col gap-4 relative">
        {wires.map((wire, index) => (
          <div key={wire.id} className="relative h-4 w-full flex items-center group">
            {/* Left Connector */}
            <div className="w-4 h-6 bg-zinc-800 rounded-sm z-10"></div>
            
            {/* The Wire */}
            {!wire.isCut ? (
              <button 
                onClick={() => onCut(index)}
                disabled={solved}
                className={`flex-1 h-3 mx-[-2px] ${getTailwindColor(wire.color)} shadow-md cursor-pointer hover:brightness-110 transition-all z-0 relative`}
                aria-label={`Kes ${wire.color}`}
              >
                <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/30"></div>
              </button>
            ) : (
              <div className="flex-1 flex mx-[-2px] z-0">
                <div className={`w-1/3 h-3 ${getTailwindColor(wire.color)} shadow-sm rounded-r-md`}></div>
                <div className="flex-1"></div>
                <div className={`w-1/3 h-3 ${getTailwindColor(wire.color)} shadow-sm rounded-l-md`}></div>
              </div>
            )}

            {/* Right Connector */}
            <div className="w-4 h-6 bg-zinc-800 rounded-sm z-10"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WireModule;