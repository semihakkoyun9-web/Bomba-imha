import React from 'react';
import { PasswordModuleData } from '../types';

interface PasswordProps {
  data: PasswordModuleData;
  onChangeIndex: (col: number, dir: number) => void;
  onSubmit: () => void;
  solved: boolean;
}

const PasswordModule: React.FC<PasswordProps> = ({ data, onChangeIndex, onSubmit, solved }) => {
  return (
    <div className="bg-green-900 p-4 rounded-sm shadow-lg border-2 border-green-950 relative">
      <div className="absolute top-1 right-2 w-3 h-3 rounded-full bg-black border border-gray-600">
        <div className={`w-full h-full rounded-full ${solved ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-black'}`}></div>
      </div>

      <h3 className="text-green-200 font-bold mb-4 text-xs uppercase tracking-wider border-b border-green-800 pb-1">Modül Eta: Şifre</h3>

      <div className="flex justify-center gap-1 mb-4">
        {data.columns.map((col, colIdx) => (
          <div key={colIdx} className="flex flex-col items-center bg-black border border-green-800 p-1 rounded">
             <button 
               onClick={() => onChangeIndex(colIdx, -1)}
               className="text-green-500 hover:text-white mb-1"
             >▲</button>
             
             <div className="text-2xl font-mono text-white font-bold">
               {col[data.currentIndices[colIdx]]}
             </div>

             <button 
               onClick={() => onChangeIndex(colIdx, 1)}
               className="text-green-500 hover:text-white mt-1"
             >▼</button>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <button 
          onClick={onSubmit}
          className="w-full py-2 bg-green-600 hover:bg-green-500 text-white font-bold rounded border-b-4 border-green-800 active:border-b-0 active:translate-y-1"
        >
          GİRİŞ
        </button>
      </div>
    </div>
  );
};

export default PasswordModule;