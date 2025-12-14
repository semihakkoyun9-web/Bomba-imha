import React, { useState } from 'react';
import { UserProfile, Theme } from '../types';
import { saveProfile } from '../utils';

export const THEMES: Theme[] = [
  { id: 'default', name: 'Standart', price: 0, bgClass: 'bg-slate-900', panelClass: 'bg-zinc-400', accentClass: 'border-zinc-500', fontClass: 'text-white' },
  { id: 'matrix', name: 'Matrix', price: 500, bgClass: 'bg-black', panelClass: 'bg-black text-green-500', accentClass: 'border-green-500', fontClass: 'text-green-500' },
  { id: 'cyber', name: 'Cyberpunk', price: 1200, bgClass: 'bg-purple-900', panelClass: 'bg-indigo-900', accentClass: 'border-pink-500', fontClass: 'text-pink-400' },
  { id: 'rust', name: 'Paslı Metal', price: 2000, bgClass: 'bg-orange-950', panelClass: 'bg-stone-600', accentClass: 'border-orange-800', fontClass: 'text-orange-200' },
  { id: 'military', name: 'Askeri', price: 2500, bgClass: 'bg-stone-800', panelClass: 'bg-stone-700', accentClass: 'border-green-800', fontClass: 'text-green-100' },
  { id: 'ocean', name: 'Okyanus', price: 3000, bgClass: 'bg-cyan-950', panelClass: 'bg-sky-800', accentClass: 'border-cyan-400', fontClass: 'text-cyan-200' },
  { id: 'neon', name: 'Neon City', price: 3500, bgClass: 'bg-slate-900', panelClass: 'bg-slate-800', accentClass: 'border-cyan-400', fontClass: 'text-cyan-300' },
  { id: 'hacker', name: 'Hacker Green', price: 4000, bgClass: 'bg-green-950', panelClass: 'bg-black', accentClass: 'border-green-600', fontClass: 'text-green-500' },
  { id: 'retro', name: 'Retro Wave', price: 4200, bgClass: 'bg-indigo-950', panelClass: 'bg-fuchsia-900', accentClass: 'border-yellow-400', fontClass: 'text-yellow-300' },
  { id: 'blood', name: 'Blood Red', price: 4500, bgClass: 'bg-red-950', panelClass: 'bg-zinc-900', accentClass: 'border-red-600', fontClass: 'text-red-600' },
  { id: 'monochrome', name: 'Siyah Beyaz', price: 4800, bgClass: 'bg-gray-100', panelClass: 'bg-white', accentClass: 'border-black text-black', fontClass: 'text-black' },
  { id: 'gold', name: 'Altın Kaplama', price: 5000, bgClass: 'bg-yellow-950', panelClass: 'bg-yellow-600', accentClass: 'border-yellow-300', fontClass: 'text-yellow-100' },
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
         setMessage("Geliştirici modundasınız, zaten zenginsiniz!");
         return;
     }
     // Simulating In-App Purchase
     const confirm = window.confirm(`${cost} karşılığında $${amount} satın almak istiyor musunuz? (Simülasyon)`);
     if(confirm) {
        const newProfile = { ...userProfile, money: userProfile.money + amount };
        setUserProfile(newProfile); saveProfile(newProfile); setMessage(`İşlem Başarılı! $${amount} Eklendi.`);
     }
  };

  const redeemCode = () => {
    if (promoCode === 'DEVMODE' || promoCode === 'SEMIHBABA') {
      const newProfile = { 
          ...userProfile, 
          isDevMode: true, 
          prevMoney: userProfile.money, // Save current balance
          money: 999999999 // Functional infinite
      };
      setUserProfile(newProfile); saveProfile(newProfile); setMessage(promoCode === 'SEMIHBABA' ? "Semih Baba Modu Aktif!" : "Geliştirici Modu Aktif!");
    } else if (promoCode === 'BOMBA2025') {
       const newProfile = { ...userProfile, money: userProfile.money + 5000 };
       setUserProfile(newProfile); saveProfile(newProfile); setMessage("Promosyon Kodu Kabul Edildi!");
    } else {
      setMessage("Geçersiz Kod");
    }
  };

  const handleExitDevMode = () => {
    // Restore previous balance
    const restoredMoney = userProfile.prevMoney !== undefined ? userProfile.prevMoney : 0;
    const newProfile = { 
        ...userProfile, 
        isDevMode: false,
        money: restoredMoney
    };
    setUserProfile(newProfile);
    saveProfile(newProfile);
    setMessage("Geliştirici Modu Kapatıldı. Bakiye geri yüklendi.");
  };

  return (
    <div className="h-full flex flex-col text-white">
       <div className="bg-black/40 p-4 border-b border-white/10 flex justify-between items-center z-20">
         <button onClick={onBack} className="text-xl font-bold hover:text-yellow-500">&larr; GERİ</button>
         <div className="text-right">
            <div className="text-xs text-gray-400">BAKİYE</div>
            <div className="text-2xl font-mono text-green-400">
                {userProfile.isDevMode ? <span className="text-4xl">∞</span> : `$${userProfile.money}`}
            </div>
         </div>
       </div>

       <div className="flex border-b border-white/10 bg-black/20 z-20">
         <button onClick={() => setActiveTab('themes')} className={`flex-1 py-4 font-bold ${activeTab === 'themes' ? 'text-yellow-500 border-b-2 border-yellow-500' : 'text-gray-400'}`}>TEMALAR</button>
         <button onClick={() => setActiveTab('files')} className={`flex-1 py-4 font-bold ${activeTab === 'files' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400'}`}>ÖZEL DOSYALAR</button>
         <button onClick={() => setActiveTab('bank')} className={`flex-1 py-4 font-bold ${activeTab === 'bank' ? 'text-green-500 border-b-2 border-green-500' : 'text-gray-400'}`}>BANKA</button>
       </div>

       <div className="flex-1 overflow-y-auto p-6 z-10">
          {message && <div className="bg-blue-600 p-2 text-center rounded mb-4 animate-bounce">{message}</div>}

          {activeTab === 'themes' && (
             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {THEMES.map(theme => {
                   const owned = userProfile.inventory.includes(theme.id);
                   const active = userProfile.activeTheme === theme.id;
                   return (
                      <div key={theme.id} className="p-4 border border-white/10 bg-black/40 rounded flex flex-col justify-between hover:bg-white/5 transition-colors">
                         <div>
                            <h3 className={`text-xl font-bold ${theme.fontClass}`}>{theme.name}</h3>
                            <div className={`mt-2 h-12 w-full ${theme.bgClass} border ${theme.accentClass} shadow-lg`}></div>
                         </div>
                         <div className="mt-4">
                            {active ? <button disabled className="w-full py-2 bg-green-800 text-green-200 font-bold border border-green-600">AKTİF</button> 
                            : owned ? <button onClick={() => handleEquipTheme(theme.id)} className="w-full py-2 bg-white text-black font-bold hover:bg-gray-200">KUŞAN</button>
                            : <button onClick={() => handleBuyTheme(theme)} className="w-full py-2 bg-yellow-600 text-black font-bold hover:bg-yellow-500">SATIN AL ${theme.price}</button>}
                         </div>
                      </div>
                   )
                })}
             </div>
          )}

          {activeTab === 'files' && (
             <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-black/40 border-2 border-blue-500 p-6 rounded-xl">
                   <h3 className="text-2xl font-bold text-blue-400 mb-2">GİZLİ GÖREVLER</h3>
                   <p className="text-gray-400 mb-4">İçerik: 20 Ekstra Zorlu Seviye. Yeni Modüller.</p>
                   {userProfile.ownedPacks.includes('covert_ops') ? (
                      <div className="text-green-500 font-bold border border-green-500 p-2 text-center">SATIN ALINDI</div>
                   ) : (
                      <button onClick={() => handleBuyPack('covert_ops', 5000, 'Gizli Görevler')} className="w-full py-3 bg-blue-600 hover:bg-blue-500 font-bold rounded">SATIN AL ($5,000)</button>
                   )}
                </div>

                <div className="bg-black/40 border-2 border-red-600 p-6 rounded-xl">
                   <h3 className="text-2xl font-bold text-red-500 mb-2">KABUS MODU</h3>
                   <p className="text-gray-400 mb-4">İçerik: 15 İmkansız Seviye. Süre Çok Kısıtlı.</p>
                   {userProfile.ownedPacks.includes('nightmare') ? (
                      <div className="text-green-500 font-bold border border-green-500 p-2 text-center">SATIN ALINDI</div>
                   ) : (
                      <button onClick={() => handleBuyPack('nightmare', 15000, 'Kabus Modu')} className="w-full py-3 bg-red-600 hover:bg-red-500 font-bold rounded">SATIN AL ($15,000)</button>
                   )}
                </div>
             </div>
          )}

          {activeTab === 'bank' && (
             <div className="space-y-8">
                 {/* IAP Section */}
                 <div>
                    <h3 className="text-xl font-bold mb-4 text-green-400 border-b border-green-800 pb-2">HESABA PARA YÜKLE</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                        <button onClick={() => buyMoney(10000, '19.99 TL')} className="bg-gradient-to-br from-green-900 to-black border border-green-600 p-6 rounded hover:scale-105 transition-transform group">
                            <div className="text-3xl mb-1">💰</div>
                            <div className="text-2xl font-bold text-white">$10,000</div>
                            <div className="text-sm text-green-400 mt-2 bg-black/50 py-1 rounded">19.99 TL</div>
                        </button>
                        <button onClick={() => buyMoney(50000, '49.99 TL')} className="bg-gradient-to-br from-blue-900 to-black border border-blue-600 p-6 rounded hover:scale-105 transition-transform group relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-yellow-500 text-black text-xs font-bold px-2 py-1">POPÜLER</div>
                            <div className="text-3xl mb-1">💎</div>
                            <div className="text-2xl font-bold text-white">$50,000</div>
                            <div className="text-sm text-blue-400 mt-2 bg-black/50 py-1 rounded">49.99 TL</div>
                        </button>
                        <button onClick={() => buyMoney(250000, '199.99 TL')} className="bg-gradient-to-br from-purple-900 to-black border border-purple-600 p-6 rounded hover:scale-105 transition-transform group relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold px-2 py-1">EN İYİ FİYAT</div>
                            <div className="text-3xl mb-1">👑</div>
                            <div className="text-2xl font-bold text-white">$250,000</div>
                            <div className="text-sm text-purple-400 mt-2 bg-black/50 py-1 rounded">199.99 TL</div>
                        </button>
                        <button onClick={() => buyMoney(1000000, '499.99 TL')} className="bg-gradient-to-br from-yellow-900 to-black border border-yellow-600 p-6 rounded hover:scale-105 transition-transform group col-span-full md:col-span-3">
                            <div className="text-4xl mb-1">🏆</div>
                            <div className="text-3xl font-bold text-yellow-500">HAZİNE SANDIĞI ($1M)</div>
                            <div className="text-lg text-yellow-200 mt-2 bg-black/50 py-1 rounded w-1/3 mx-auto">499.99 TL</div>
                        </button>
                    </div>
                 </div>

                 {/* Promo Section */}
                 <div>
                    <h3 className="text-xl font-bold mb-4 text-gray-400 border-b border-gray-700 pb-2">PROMOSYON</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-zinc-800 p-6 rounded border border-zinc-600">
                            <div className="text-xs text-gray-400 mb-2">HEDİYE KODU KULLAN</div>
                            <div className="flex gap-2">
                                <input 
                                    value={promoCode} 
                                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                    placeholder="KOD GİRİN" 
                                    className="bg-black border border-gray-600 p-2 w-full text-white text-sm focus:border-yellow-500 outline-none"
                                />
                                <button onClick={redeemCode} className="bg-yellow-600 text-black font-bold px-4 hover:bg-yellow-500">OK</button>
                            </div>
                        </div>

                        {/* Exit Developer Mode Button */}
                        {userProfile.isDevMode && (
                        <button onClick={handleExitDevMode} className="bg-red-950/80 border border-red-600 p-6 rounded hover:bg-red-900 flex flex-row items-center justify-center gap-4 group transition-all">
                            <div className="text-4xl group-hover:scale-110 transition-transform">🚫</div>
                            <div className="text-left">
                                <div className="font-bold text-red-500 text-lg">GELİŞTİRİCİ MODU</div>
                                <div className="text-red-300 text-xs">Modu kapat ve normal bakiyeye dön.</div>
                            </div>
                        </button>
                        )}
                    </div>
                 </div>
             </div>
          )}
       </div>
    </div>
  );
};

export default ShopView;