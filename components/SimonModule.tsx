import React, { useState, useEffect } from 'react';
import { SimonModuleData } from '../types';

interface SimonModuleProps {
  data: SimonModuleData;
  onPress: (color: string) => void;
  solved: boolean;
  strikes: number; // Simon sometimes depends on serial/strikes, keeping it simple here
}

const SimonModule: React.FC<SimonModuleProps> = ({ data, onPress, solved }) => {
  const [activeLight, setActiveLight] = useState<string | null>(null);

  // Play Sequence Animation
  useEffect(() => {
    if (solved) return;
    
    let timer: any;
    const playSequence = async () => {
      const currentSequence = data.sequence.slice(0, data.stage + 1);
      
      for (let i = 0; i < currentSequence.length; i++) {
        await new Promise(r => setTimeout(r, 500));
        setActiveLight(currentSequence[i]);
        await new Promise(r => setTimeout(r, 500));
        setActiveLight(null);
      }
      // Pause before repeating
      timer = setTimeout(playSequence, 2000);
    };

    playSequence();
    return () => clearTimeout(timer);
  }, [data.stage, solved, data.sequence]);

  const btnClass = (colorCode: string, base: string, active: string) => `
    w-12 h-12 rounded md:w-16 md:h-16 border-4 border-gray-800 transition-colors duration-100
    ${activeLight === colorCode ? active + ' shadow-[0_0_20px_currentColor] scale-105' : base}
  `;

  return (
    <div className="bg-zinc-800 p-4 rounded-sm shadow-lg border-2 border-zinc-600 relative">
       <div className="absolute top-1 right-2 w-3 h-3 rounded-full bg-black border border-gray-600">
        <div className={`w-full h-full rounded-full ${solved ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-black'}`}></div>
      </div>

      <h3 className="text-gray-400 font-bold mb-4 text-xs uppercase tracking-wider border-b border-gray-700 pb-1">Modül Epsilon: Simon</h3>

      <div className="flex justify-center">
        <div className="grid grid-cols-2 gap-4 bg-black p-4 rounded-full border-4 border-gray-700">
          <button 
            onClick={() => onPress('R')} disabled={solved}
            className={btnClass('R', 'bg-red-900', 'bg-red-500')}
          />
          <button 
            onClick={() => onPress('B')} disabled={solved}
            className={btnClass('B', 'bg-blue-900', 'bg-blue-500')}
          />
          <button 
            onClick={() => onPress('G')} disabled={solved}
            className={btnClass('G', 'bg-green-900', 'bg-green-500')}
          />
          <button 
            onClick={() => onPress('Y')} disabled={solved}
            className={btnClass('Y', 'bg-yellow-900', 'bg-yellow-500')}
          />
        </div>
      </div>
    </div>
  );
};

export default SimonModule;