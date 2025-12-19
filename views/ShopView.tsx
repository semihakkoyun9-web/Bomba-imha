import React, { useState } from 'react';
import { UserProfile, Theme } from '../types';
import { saveProfile } from '../utils';

export const THEMES: Theme[] = [
  { id: 'default', name: 'Standart', price: 0, bgClass: 'bg-slate-950', panelClass: 'bg-zinc-400', accentClass: 'border-zinc-500', fontClass: 'text-white' },
  { id: 'matrix', name: 'Matrix', price: 500, bgClass: 'bg-black', panelClass: 'bg-black text-green-500', accentClass: 'border-green-500', fontClass: 'text-green-500' },
  { id: 'cyber', name: 'Cyberpunk', price: 1200, bgClass: 'bg-indigo-950', panelClass: 'bg-indigo-900', accentClass: 'border-pink-500', fontClass: 'text-pink-400' },
  { id: 'mars', name: 'Mars Kolonisi', price: 1800, bgClass: 'bg-orange-950', panelClass: 'bg-orange-900', accentClass: 'border-orange-500', fontClass: 'text-orange-300' },
  { id: 'stealth', name: 'Hayalet (Stealth)', price: 2200, bgClass: 'bg-zinc-950', panelClass: 'bg-zinc-900', accentClass: 'border-zinc-700', fontClass: 'text-zinc-400' },
  { id: 'undersea', name: 'Derin Deniz', price: 2800, bgClass: 'bg-teal-950', panelClass: 'bg-teal-900', accentClass: 'border-teal-500', fontClass: 'text-teal-300' },
  { id: 'neon', name: 'Neon City', price: 3500, bgClass: 'bg-slate-950', panelClass: 'bg-slate-900', accentClass: 'border-cyan-400', fontClass: 'text-cyan-400' },
  { id: 'gold', name: 'Altın Kaplama', price: 5000, bgClass: 'bg-yellow-950', panelClass: 'bg-yellow-700', accentClass: 'border-yellow-300', fontClass: 'text-yellow-100' },
];

interface ShopProps {
  userProfile: UserProfile;
  setUserProfile: (p: UserProfile) => void;
  onBack: () => void;
}

const ShopView: React.FC<ShopProps> = ({ userProfile, setUserProfile, onBack }) => {
  const [activeTab, setActiveTab] = useState<'themes' | 'files' | 'bank'>('themes');
  const [message, setMessage] = useState('');
  const [promoCode, setPromoCode] = useState('');

  const handleBuyTheme = (theme: Theme) => {
    if (userProfile.money >= theme.price || userProfile.isDevMode) {
      const newProfile = {
        ...userProfile,
        money: userProfile.money - theme.price,
        inventory: [...userProfile.inventory, theme.id]
      };
      setUserProfile(newProfile);
      saveProfile(newProfile);
      setMessage(`${theme.name} satın alındı!`);
    } else setMessage("Yetersiz Bakiye!");
  };

  const handleEquipTheme = (id: string) => {
    const newProfile = { ...userProfile, activeTheme: id };
    setUserProfile(newProfile); saveProfile(newProfile); setMessage("Tema Kuşandı.");
  };

  const handleBuyPack = (packId: string, price: number, name: string) => {
    if (userProfile.ownedPacks.includes(packId)) { setMessage("Zaten sahipsiniz."); return; }
    if (userProfile.money >= price || userProfile.isDevMode) {
      const newProfile = { ...userProfile, money: userProfile.money - price, ownedPacks: [...userProfile.ownedPacks, packId] };
      setUserProfile(newProfile); saveProfile(newProfile); setMessage(`${name} klasörü açıldı!`);
    } else setMessage("Yetersiz Bakiye!");
  };

  const buyMoney = (amount: number, cost: string) => {
     if(userProfile.isDevMode) {
         setMessage("Geliştirici modundasınız!");
         return;
     }
     const confirm = window.confirm(`${cost} karşılığında $${amount} satın almak istiyor musunuz? (Simülasyon)`);
     if(confirm) {
        const newProfile = { ...userProfile, money: userProfile.money + amount };
        setUserProfile(newProfile); saveProfile(newProfile); setMessage(`İşlem Başarılı! $${amount} Eklendi.`);
     }
  };

  const redeemCode = () => {
    if (promoCode === 'DEVMODE' || promoCode === 'SEMIHBABA') {
      const newProfile = { ...userProfile, isDevMode: true, prevMoney: userProfile.money, money: 9999999 };
      setUserProfile(newProfile); saveProfile(newProfile); setMessage("Geliştirici Yetkisi Tanımlandı!");
    } else if (promoCode === 'BOMBA2025') {
       const newProfile = { ...userProfile, money: userProfile.money + 5000 };
       setUserProfile(newProfile); saveProfile(newProfile); setMessage("Hediye Kodu Kabul Edildi!");
    } else {
      setMessage("Geçersiz Kod");
    }
  };

  return (
    <div className="h-full flex flex-col text-white font-mono animate-[fadeIn_0.5s_ease-out]">
       <div className="bg-black/60 backdrop-blur-2xl p-6 border-b border-white/10 flex justify-between items-center z-20">
         <button onClick={onBack} className="text-2xl font-black hover:text-yellow-500 tracking-tighter transition-all flex items-center gap-3">
           <span className="text-yellow-500">&larr;</span> MERKEZ
         </button>
         <div className="text-right">
            <div className="text-[10px] text-gray-500 tracking-widest font-bold uppercase">Mevcut Fon</div>
            <div className="text-3xl font-black text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]">
                {userProfile.isDevMode ? <span className="text-4xl animate-pulse">SINIRSIZ</span> : `$${userProfile.money}`}
            </div>
         </div>
       </div>

       <div className="flex border-b border-white/10 bg-black/40 z-20 backdrop-blur-md">
         <button onClick={() => setActiveTab('themes')} className={`flex-1 py-6 font-black text-xs tracking-[0.3em] transition-all uppercase ${activeTab === 'themes' ? 'text-yellow-500 bg-white/5 shadow-[inset_0_-3px_0_#eab308]' : 'text-gray-500 hover:text-gray-300'}`}>Görünümler</button>
         <button onClick={() => setActiveTab('files')} className={`flex-1 py-6 font-black text-xs tracking-[0.3em] transition-all uppercase ${activeTab === 'files' ? 'text-blue-500 bg-white/5 shadow-[inset_0_-3px_0_#3b82f6]' : 'text-gray-500 hover:text-gray-300'}`}>Paketler</button>
         <button onClick={() => setActiveTab('bank')} className={`flex-1 py-6 font-black text-xs tracking-[0.3em] transition-all uppercase ${activeTab === 'bank' ? 'text-green-500 bg-white/5 shadow-[inset_0_-3px_0_#22c55e]' : 'text-gray-500 hover:text-gray-300'}`}>Banka</button>
       </div>

       <div className="flex-1 overflow-y-auto p-10 z-10 custom-scrollbar">
          {message && <div className="bg-blue-600/20 text-blue-400 border border-blue-500/30 p-5 text-center rounded-2xl mb-10 animate-pulse font-bold tracking-widest uppercase text-xs">{message}</div>}

          {activeTab === 'themes' && (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {THEMES.map(theme => {
                   const owned = userProfile.inventory.includes(theme.id);
                   const active = userProfile.activeTheme === theme.id;
                   return (
                      <div key={theme.id} className="group p-8 border border-white/10 bg-black/60 rounded-[2rem] flex flex-col justify-between hover:bg-white/5 transition-all hover:scale-[1.03] hover:border-white/30 shadow-2xl relative overflow-hidden">
                         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                         <div>
                            <h3 className={`text-2xl font-black mb-6 ${theme.fontClass} tracking-tighter`}>{theme.name}</h3>
                            <div className={`h-28 w-full ${theme.bgClass} border-2 ${theme.accentClass} rounded-2xl shadow-inner relative overflow-hidden`}>
                               <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                               <div className="absolute inset-4 border border-white/5 rounded-lg"></div>
                            </div>
                         </div>
                         <div className="mt-8">
                            {active ? <button disabled className="w-full py-4 bg-green-500/10 text-green-500 font-black border border-green-500/30 rounded-xl tracking-widest text-xs uppercase">Aktif</button> 
                            : owned ? <button onClick={() => handleEquipTheme(theme.id)} className="w-full py-4 bg-white text-black font-black hover:bg-blue-500 hover:text-white rounded-xl transition-all tracking-widest text-xs uppercase shadow-xl">Kuşan</button>
                            : <button onClick={() => handleBuyTheme(theme)} className="w-full py-4 bg-yellow-600 hover:bg-yellow-500 text-black font-black rounded-xl transition-all tracking-widest text-xs uppercase shadow-xl">Satın Al (${theme.price})</button>}
                         </div>
                      </div>
                   )
                })}
             </div>
          )}

          {activeTab === 'files' && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
                <div className="bg-gradient-to-br from-blue-900/40 to-black border-2 border-blue-500/20 p-10 rounded-[2.5rem] hover:border-blue-500 transition-all group shadow-2xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-10 opacity-5 text-8xl font-black">FILES</div>
                   <h3 className="text-4xl font-black text-blue-400 mb-6 group-hover:scale-105 transition-transform origin-left tracking-tighter uppercase">Gizli Görevler</h3>
                   <p className="text-gray-400 mb-10 leading-relaxed text-sm font-medium">20 adet yüksek riskli operasyon. Yeni nesil şifreleme modülleri ve kısıtlı süreli görevler ile yeteneklerini sına.</p>
                   {userProfile.ownedPacks.includes('covert_ops') ? (
                      <div className="text-green-500 font-black border-2 border-green-500/30 bg-green-500/5 p-5 text-center rounded-2xl uppercase tracking-[0.3em] text-xs">Erişim Onaylandı</div>
                   ) : (
                      <button onClick={() => handleBuyPack('covert_ops', 5000, 'Gizli Görevler')} className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl shadow-2xl transition-all active:scale-95 uppercase tracking-[0.2em] text-sm">Klasörü Aç ($5,000)</button>
                   )}
                </div>

                <div className="bg-gradient-to-br from-red-900/40 to-black border-2 border-red-600/20 p-10 rounded-[2.5rem] hover:border-red-600 transition-all group shadow-2xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-10 opacity-5 text-8xl font-black text-red-500">DANGER</div>
                   <h3 className="text-4xl font-black text-red-500 mb-6 group-hover:scale-105 transition-transform origin-left tracking-tighter uppercase">Kabus Modu</h3>
                   <p className="text-gray-400 mb-10 leading-relaxed text-sm font-medium">15 adet imkansız seviyede operasyon. Hataların telafisi yoktur. Sadece en profesyonel ajanlar için.</p>
                   {userProfile.ownedPacks.includes('nightmare') ? (
                      <div className="text-green-500 font-black border-2 border-green-500/30 bg-green-500/5 p-5 text-center rounded-2xl uppercase tracking-[0.3em] text-xs">Erişim Onaylandı</div>
                   ) : (
                      <button onClick={() => handleBuyPack('nightmare', 15000, 'Kabus Modu')} className="w-full py-5 bg-red-600 hover:bg-red-500 text-white font-black rounded-2xl shadow-2xl transition-all active:scale-95 uppercase tracking-[0.2em] text-sm">Klasörü Aç ($15,000)</button>
                   )}
                </div>
             </div>
          )}

          {activeTab === 'bank' && (
             <div className="space-y-14 max-w-6xl mx-auto">
                 <div>
                    <h3 className="text-2xl font-black mb-8 text-green-400 border-b border-green-800 pb-4 flex items-center gap-4 uppercase tracking-tighter">
                       <span className="text-3xl">🏦</span> Operasyon Fonu Tedariği
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <button onClick={() => buyMoney(10000, '19.99 TL')} className="bg-black/60 border border-green-500/20 p-10 rounded-3xl hover:scale-105 transition-all group hover:border-green-500 shadow-xl">
                            <div className="text-5xl mb-6">💰</div>
                            <div className="text-4xl font-black text-white">$10,000</div>
                            <div className="text-[10px] text-green-500 mt-6 font-black bg-green-500/5 py-2 rounded-lg tracking-widest uppercase">19.99 TL</div>
                        </button>
                        <button onClick={() => buyMoney(50000, '49.99 TL')} className="bg-black/60 border border-blue-500/20 p-10 rounded-3xl hover:scale-105 transition-all group hover:border-blue-500 relative shadow-2xl">
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-500 text-black text-[9px] font-black px-6 py-2 rounded-full uppercase tracking-widest shadow-lg">Popüler Seçim</div>
                            <div className="text-5xl mb-6">💎</div>
                            <div className="text-4xl font-black text-white">$50,000</div>
                            <div className="text-[10px] text-blue-400 mt-6 font-black bg-blue-500/5 py-2 rounded-lg tracking-widest uppercase">49.99 TL</div>
                        </button>
                        <button onClick={() => buyMoney(250000, '199.99 TL')} className="bg-black/60 border border-purple-500/20 p-10 rounded-3xl hover:scale-105 transition-all group hover:border-purple-500 shadow-xl">
                            <div className="text-5xl mb-6">👑</div>
                            <div className="text-4xl font-black text-white">$250,000</div>
                            <div className="text-[10px] text-purple-400 mt-6 font-black bg-purple-500/5 py-2 rounded-lg tracking-widest uppercase">199.99 TL</div>
                        </button>
                    </div>
                 </div>

                 <div className="bg-white/5 p-10 rounded-[2.5rem] border border-white/10 shadow-2xl backdrop-blur-md">
                    <h3 className="text-2xl font-black mb-8 text-gray-400 flex items-center gap-4 uppercase tracking-tighter">
                       <span className="text-3xl">🎟️</span> Yetkilendirme Kodları
                    </h3>
                    <div className="flex flex-col md:flex-row gap-10">
                        <div className="flex-1 bg-black/60 p-8 rounded-3xl border border-white/5">
                            <div className="text-[10px] text-gray-500 mb-4 font-black uppercase tracking-[0.3em]">Güvenlik Kodu</div>
                            <div className="flex gap-4">
                                <input 
                                    value={promoCode} 
                                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                    placeholder="KODU GİRİN" 
                                    className="bg-black/80 border border-white/10 p-5 flex-1 text-white text-sm focus:border-yellow-500 outline-none rounded-2xl font-mono tracking-widest shadow-inner"
                                />
                                <button onClick={redeemCode} className="bg-yellow-600 text-black font-black px-10 hover:bg-yellow-500 transition-all rounded-2xl uppercase text-xs tracking-widest shadow-xl active:scale-95">Onayla</button>
                            </div>
                        </div>
                    </div>
                 </div>
             </div>
          )}
       </div>
    </div>
  );
};

export default ShopView;