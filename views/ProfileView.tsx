import React, { useState } from 'react';
import { UserProfile } from '../types';
import { saveProfile } from '../utils';

interface ProfileProps {
  userProfile: UserProfile;
  setUserProfile: (p: UserProfile) => void;
  onBack: () => void;
  onReset: () => void;
}

const AVATARS = [1, 2, 3, 4, 5, 6];

const ProfileView: React.FC<ProfileProps> = ({ userProfile, setUserProfile, onBack, onReset }) => {
  const [editMode, setEditMode] = useState(false);
  const [newName, setNewName] = useState(userProfile.username);

  const saveName = () => {
    if (!newName.trim()) return;
    const newProfile = { ...userProfile, username: newName };
    saveProfile(newProfile);
    setUserProfile(newProfile); // Update state directly
    setEditMode(false);
  };

  const selectAvatar = (id: number) => {
    const newProfile = { ...userProfile, avatarId: id };
    saveProfile(newProfile);
    setUserProfile(newProfile); // Update state directly
  };

  return (
    <div className="min-h-screen h-screen bg-black/80 text-white p-6 flex flex-col items-center backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-2xl pb-10">
         <button onClick={onBack} className="mb-6 text-xl hover:text-red-400 font-bold sticky top-0 bg-black/50 p-2 rounded backdrop-blur z-50">&larr; GERİ</button>
         
         <div className="bg-slate-900/90 p-8 rounded-lg border-2 border-slate-600 shadow-2xl relative overflow-hidden">
           {/* Decorative bg */}
           <div className="absolute top-0 right-0 p-4 opacity-10 text-9xl font-black select-none pointer-events-none">ID</div>

           <h1 className="text-3xl font-bold mb-6 text-center text-blue-400 tracking-widest uppercase border-b border-gray-700 pb-4">Ajan Profili</h1>
           
           {/* Avatar Section */}
           <div className="flex flex-col items-center mb-8">
             <div className="w-32 h-32 rounded-full bg-slate-800 border-4 border-blue-500 overflow-hidden mb-6 shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                <img src={`https://robohash.org/${userProfile.avatarId}?set=set1`} alt="avatar" className="w-full h-full" />
             </div>
             <div className="flex gap-3 justify-center">
               {AVATARS.map(id => (
                 <button 
                   key={id} 
                   onClick={() => selectAvatar(id)}
                   className={`w-12 h-12 rounded-full border-2 overflow-hidden hover:scale-110 transition-transform bg-slate-800 ${userProfile.avatarId === id ? 'border-green-500 shadow-[0_0_10px_#22c55e]' : 'border-gray-600 grayscale hover:grayscale-0'}`}
                 >
                   <img src={`https://robohash.org/${id}?set=set1`} alt="av" />
                 </button>
               ))}
             </div>
           </div>

           {/* Name Section */}
           <div className="text-center mb-10 bg-black/40 p-4 rounded-lg border border-gray-700">
             <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Kod Adı</div>
             {editMode ? (
               <div className="flex justify-center gap-2">
                 <input 
                   value={newName} 
                   onChange={(e) => setNewName(e.target.value)} 
                   className="bg-slate-800 border border-blue-500 p-2 text-center text-white text-xl rounded outline-none w-full max-w-[200px]"
                   autoFocus
                 />
                 <button onClick={saveName} className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded font-bold text-white shadow-lg">OK</button>
               </div>
             ) : (
               <h2 className="text-3xl font-black flex justify-center items-center gap-3 text-white">
                 {userProfile.username} 
                 <button onClick={() => setEditMode(true)} className="bg-gray-700 hover:bg-gray-600 w-8 h-8 rounded flex items-center justify-center text-sm">✎</button>
               </h2>
             )}
           </div>
           
           <div className="grid grid-cols-2 gap-4 text-sm md:text-base">
             <div className="bg-slate-800 p-3 rounded border-l-4 border-yellow-500">
                <div className="text-gray-400 text-xs uppercase">Rütbe</div>
                <div className="font-bold text-yellow-500 text-lg">{userProfile.maxLevel > 20 ? 'Kıdemli Uzman' : 'Çaylak'}</div>
             </div>

             <div className="bg-slate-800 p-3 rounded border-l-4 border-blue-500">
                <div className="text-gray-400 text-xs uppercase">Seviye</div>
                <div className="font-bold text-white text-lg">{userProfile.maxLevel}</div>
             </div>

             <div className="bg-slate-800 p-3 rounded border-l-4 border-gray-500">
                <div className="text-gray-400 text-xs uppercase">Oynanan</div>
                <div className="font-bold text-white text-lg">{userProfile.gamesPlayed}</div>
             </div>

             <div className="bg-slate-800 p-3 rounded border-l-4 border-green-500">
                <div className="text-gray-400 text-xs uppercase">Başarı</div>
                <div className="font-bold text-green-400 text-lg">{userProfile.gamesWon}</div>
             </div>
           </div>

           <div className="mt-6 bg-green-900/30 p-4 rounded border border-green-800 flex justify-between items-center">
              <span className="text-green-400 font-bold">TOPLAM BAKİYE</span>
              <span className="text-2xl font-mono text-green-300 tracking-wider">${userProfile.money}</span>
           </div>

           <div className="border-t border-slate-700 pt-6 mt-8">
             <button 
               onClick={() => {
                 if(window.confirm("Tüm ilerlemen silinecek! Emin misin?")) onReset();
               }}
               className="w-full bg-red-900/50 hover:bg-red-900 text-red-200 py-3 rounded border border-red-800 transition-colors text-sm uppercase tracking-widest hover:shadow-[0_0_15px_red]"
             >
               ⚠ Profili Sıfırla
             </button>
           </div>
         </div>
      </div>
    </div>
  );
};

export default ProfileView;