import React from 'react';

interface TimerProps {
  seconds: number;
}

const Timer: React.FC<TimerProps> = ({ seconds }) => {
  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-black border-4 border-gray-700 p-2 rounded inline-block shadow-inner shadow-black">
      <div className="digital-font text-5xl text-red-600 tracking-widest bg-red-950/30 px-4 py-1 rounded">
        {formatTime(seconds)}
      </div>
    </div>
  );
};

export default Timer;