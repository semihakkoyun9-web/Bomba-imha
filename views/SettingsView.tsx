import React, { useState } from 'react';
import { UserProfile } from '../types';
import { saveProfile } from '../utils';

interface SettingsProps {
  userProfile: UserProfile;
  setUserProfile: (p: UserProfile) => void;
  onBack: () => void;
}

const TRACKS = [
  { id: 'track1', name: 'Gerilim Hattı' },
  { id: 'track2', name: 'Sessiz Fırtına' },
  { id: 'track3', name: 'Zaman Tükeniyor' },
  { id: 'track4', name: 'Siber Saldırı' }
];

const SettingsView: React.FC<SettingsProps> = ({ userProfile, setUserProfile, onBack }) => {
  const [musicOpen, setMusicOpen] = useState(false);

  const toggleSetting = (key: keyof UserProfile['settings']) => {
    const newSettings = { ...userProfile.settings, [key]: !userProfile.settings[key] };
    const newProfile = { ...userProfile, settings: newSettings };
    setUserProfile(newProfile);
    saveProfile(newProfile);
  };

  const selectTrack = (id: string) => {
    const newSettings = { ...userProfile.settings, activeTrackId: id };
    const newProfile = { ...userProfile, settings: newSettings };
    setUserProfile(newProfile);
    saveProfile(newProfile);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center pt-20">
      <div className="w-full max-w-md bg-slate-800 p-8 rounded-xl shadow-2xl border border-slate-700 relative">
        <button onClick={onBack} className="absolute top-4 left-4 text-gray-400 hover:text-white">&larr; GERİ</button>
        <h1 className="text-3xl font-bold mb-8 text-center text-blue-400">SİSTEM AYARLARI</h1>
        
        <div className="space-y-6">
          <div className="flex justify-between items-center border-b border-gray-700 pb-4">
            <span>Ses Efektleri (SFX)</span>
            <button 
              onClick={() => toggleSetting('sfx')}
              className={`w-12 h-6 rounded-full p-1 transition-colors ${userProfile.settings.sfx ? 'bg-green-500' : 'bg-gray-600'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${userProfile.settings.sfx ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </button>
          </div>

          <div className="border-b border-gray-700 pb-4">
            <div className="flex justify-between items-center">
              <span>Arkaplan Müziği</span>
              <button 
                onClick={() => toggleSetting('music')}
                className={`w-12 h-6 rounded-full p-1 transition-colors ${userProfile.settings.music ? 'bg-green-500' : 'bg-gray-600'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${userProfile.settings.music ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </button>
            </div>
            
            {/* Music Accordion */}
            <button 
              onClick={() => setMusicOpen(!musicOpen)}
              className="mt-2 text-xs text-blue-400 hover:underline w-full text-left flex justify-between items-center"
            >
              <span>Parça Seçimi: {TRACKS.find(t => t.id === userProfile.settings.activeTrackId)?.name}</span>
              <span>{musicOpen ? '▲' : '▼'}</span>
            </button>
            
            {musicOpen && (
              <div className="mt-2 bg-slate-900 rounded p-2 space-y-1">
                {TRACKS.map(track => (
                  <button
                    key={track.id}
                    onClick={() => selectTrack(track.id)}
                    className={`w-full text-left px-2 py-1 rounded text-sm ${userProfile.settings.activeTrackId === track.id ? 'bg-green-900 text-green-300' : 'hover:bg-slate-700 text-gray-400'}`}
                  >
                    {userProfile.settings.activeTrackId === track.id && '▶ '}
                    {track.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-between items-center border-b border-gray-700 pb-4">
            <span>Titreşim (Haptic)</span>
            <button 
              onClick={() => toggleSetting('vibration')}
              className={`w-12 h-6 rounded-full p-1 transition-colors ${userProfile.settings.vibration ? 'bg-green-500' : 'bg-gray-600'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${userProfile.settings.vibration ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </button>
          </div>
        </div>

        <div className="mt-8 text-center space-y-1">
           <div className="text-xs text-gray-500">ID: {userProfile.isDevMode ? 'DEV-ACCESS-GRANTED' : 'USER-8821'}</div>
           <div className="text-xs font-mono text-blue-500/50 pt-4 border-t border-gray-700 mt-4">Geliştirici: semihbaba</div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;