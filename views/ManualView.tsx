import React from 'react';

interface ManualProps {
  onBack?: () => void;
}

// Maze definitions for rendering the manual grids (Must match logic/utils)
const MANUAL_MAZES = [
  { 
      id: 1,
      markers: [{x:0, y:1}, {x:5, y:2}], 
      // Simplified wall rendering logic for manual: right-walls and bottom-walls
      // Format: x,y with 'R' (Right) or 'B' (Bottom)
      walls: [
          "0,1-R", "1,0-B", "1,1-R", "2,1-R", "2,2-B", "3,1-B", "3,0-B", 
          "0,3-R", "1,3-B", "1,4-B", "2,3-R", "3,3-R", "4,2-B", "4,3-R",
          "5,3-B", "4,1-R", "4,0-B", "0,4-B", "2,5-R", "4,5-R"
      ] 
  }, 
  { 
      id: 2,
      markers: [{x:1, y:3}, {x:4, y:1}], 
      walls: [
          "1,0-R", "3,0-R", "1,1-B", "2,1-R", "4,1-B", "5,1-B", 
          "0,2-B", "1,2-R", "2,2-B", "3,2-B", "4,2-R", 
          "0,4-R", "1,4-B", "2,4-R", "3,4-B", "4,4-R", "4,3-B"
      ] 
  }, 
  { 
      id: 3,
      markers: [{x:3, y:3}, {x:5, y:3}], 
      walls: [
          "0,0-B", "0,1-R", "1,0-R", "2,0-R", "3,0-B", "4,0-B", "5,0-B",
          "0,2-R", "1,2-B", "2,2-B", "3,2-R", "4,2-R",
          "0,4-R", "1,4-R", "2,4-B", "3,4-B", "4,4-B", "5,4-B", "3,3-R"
      ] 
  }, 
];

const ManualView: React.FC<ManualProps> = ({ onBack }) => {
  
  const renderMazeGrid = (maze: any) => {
     return (
        <div className="relative border-4 border-black w-36 h-36 grid grid-cols-6 bg-white">
           {Array.from({length: 36}).map((_, i) => {
              const x = i % 6;
              const y = Math.floor(i / 6);
              const isMarker = maze.markers.some((m: any) => m.x === x && m.y === y);
              
              // Check walls
              const hasRightWall = maze.walls.includes(`${x},${y}-R`);
              const hasBottomWall = maze.walls.includes(`${x},${y}-B`);
              // Helper for bidirectional check from utils would be complex here, so we manually mapped visual walls above

              return (
                 <div key={i} className={`relative border-gray-100 border-[0.5px] flex items-center justify-center`}>
                    {isMarker && <div className="w-3 h-3 rounded-full border-2 border-green-600 bg-transparent ring-1 ring-green-600"></div>}
                    
                    {/* Walls */}
                    {hasRightWall && <div className="absolute right-[-2px] top-0 bottom-0 w-[4px] bg-red-800 z-10"></div>}
                    {hasBottomWall && <div className="absolute bottom-[-2px] left-0 right-0 h-[4px] bg-red-800 z-10"></div>}
                 </div>
              )
           })}
        </div>
     )
  };

  return (
    <div className="min-h-screen bg-[#f3eacb] text-zinc-900 font-serif p-4 md:p-8 overflow-y-auto">
      {onBack && (
        <button onClick={onBack} className="fixed top-4 left-4 z-50 bg-black text-white px-4 py-2 rounded shadow hover:bg-gray-800 border-2 border-white">
          &lt; Geri Dön
        </button>
      )}

      <div className="max-w-5xl mx-auto bg-white shadow-[0_0_50px_rgba(0,0,0,0.5)] p-8 md:p-16 relative border border-gray-300">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cardboard-flat.png')] opacity-40 pointer-events-none"></div>
        
        {/* Top Secret Stamp */}
        <div className="absolute top-10 right-10 border-4 border-red-700 text-red-700 px-4 py-2 font-bold text-xl uppercase -rotate-12 opacity-80 pointer-events-none hidden md:block">
           GİZLİ BELGE
        </div>

        <header className="text-center mb-12 border-b-4 border-black pb-6">
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-2">Bomba İmha</h1>
          <h2 className="text-2xl font-light uppercase tracking-widest bg-black text-white inline-block px-4 py-1">Operasyon Kılavuzu</h2>
          <div className="mt-4 text-sm font-mono text-gray-500">REVİZYON 6.0 // ZORLAŞTIRILMIŞ SÜRÜM</div>
        </header>

        {/* 1. WIRES */}
        <section className="mb-12 border-b-2 border-dashed border-gray-400 pb-8 break-inside-avoid">
          <div className="flex items-center gap-4 mb-4">
             <div className="w-12 h-12 bg-black text-white flex items-center justify-center font-bold text-2xl">1</div>
             <h2 className="text-3xl font-bold uppercase">Kablolar</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
             <div className="text-sm leading-relaxed space-y-4">
                <div className="bg-gray-100 p-4 border-l-4 border-black">
                   <h3 className="font-bold mb-2">3 KABLO VARSA:</h3>
                   <ul className="list-disc ml-4 space-y-1">
                      <li>Kırmızı kablo <strong>yoksa</strong>: İkinciyi kes.</li>
                      <li>Son kablo <strong>beyazsa</strong>: Sonuncuyu kes.</li>
                      <li>Birden fazla <strong>mavi</strong> varsa: Son maviyi kes.</li>
                      <li>Hiçbiri değilse: Sonuncuyu kes.</li>
                   </ul>
                </div>
                <div className="bg-gray-100 p-4 border-l-4 border-black">
                   <h3 className="font-bold mb-2">4 KABLO VARSA:</h3>
                   <ul className="list-disc ml-4 space-y-1">
                      <li>Birden fazla <strong>kırmızı</strong> varsa VE Seri No <strong>Tek</strong> ise: Son kırmızıyı kes.</li>
                      <li>Son kablo <strong>sarı</strong> VE kırmızı yoksa: Birinciyi kes.</li>
                      <li>Tam olarak bir <strong>mavi</strong> varsa: Birinciyi kes.</li>
                      <li>Birden fazla <strong>sarı</strong> varsa: Sonuncuyu kes.</li>
                      <li>Hiçbiri değilse: İkinciyi kes.</li>
                   </ul>
                </div>
                <div className="bg-gray-100 p-4 border-l-4 border-black">
                   <h3 className="font-bold mb-2">5 KABLO VARSA:</h3>
                   <ul className="list-disc ml-4 space-y-1">
                      <li>Son kablo <strong>siyah</strong> VE Seri No <strong>Tek</strong> ise: Dördüncüyü kes.</li>
                      <li>1 <strong>kırmızı</strong> VE birden fazla <strong>sarı</strong> varsa: Birinciyi kes.</li>
                      <li><strong>Siyah</strong> kablo yoksa: İkinciyi kes.</li>
                      <li>Hiçbiri değilse: Birinciyi kes.</li>
                   </ul>
                </div>
                 <div className="bg-gray-100 p-4 border-l-4 border-black">
                   <h3 className="font-bold mb-2">6 KABLO VARSA:</h3>
                   <ul className="list-disc ml-4 space-y-1">
                      <li><strong>Kırmızı</strong> kablo yoksa: Altıncıyı kes.</li>
                      <li>1 <strong>Sarı</strong> VE birden fazla <strong>Beyaz</strong> varsa: Dördüncüyü kes.</li>
                      <li>Hiçbiri değilse: Birinciyi kes.</li>
                   </ul>
                </div>
             </div>
          </div>
        </section>

        {/* 2. WORDS */}
        <section className="mb-12 border-b-2 border-dashed border-gray-400 pb-8 break-inside-avoid">
          <div className="flex items-center gap-4 mb-4">
             <div className="w-12 h-12 bg-black text-white flex items-center justify-center font-bold text-2xl">2</div>
             <h2 className="text-3xl font-bold uppercase">Kelimeler</h2>
          </div>
          <p className="mb-4 text-sm">Üst ekranda yazan kelimeye bak, aşağıdaki tabloda karşılık gelen butona bas.</p>
          
          <table className="w-full border-2 border-black text-sm text-left">
             <thead className="bg-black text-white">
                <tr>
                   <th className="p-2 border border-gray-600">EKRANDA YAZAN</th>
                   <th className="p-2 border border-gray-600">BASILACAK BUTON</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-gray-300">
                <tr className="bg-white"><td className="p-2 font-bold">BOŞ</td><td className="p-2">GİT</td></tr>
                <tr className="bg-gray-50"><td className="p-2 font-bold">BOMBA</td><td className="p-2">BEKLE</td></tr>
                <tr className="bg-white"><td className="p-2 font-bold">BAS</td><td className="p-2">DUR</td></tr>
                <tr className="bg-gray-50"><td className="p-2 font-bold">YOK</td><td className="p-2">EVET</td></tr>
                <tr className="bg-white"><td className="p-2 font-bold">HAZIR</td><td className="p-2">ORTA</td></tr>
             </tbody>
          </table>
        </section>

        {/* 3. KEYPAD */}
        <section className="mb-12 border-b-2 border-dashed border-gray-400 pb-8 break-inside-avoid">
          <div className="flex items-center gap-4 mb-4">
             <div className="w-12 h-12 bg-black text-white flex items-center justify-center font-bold text-2xl">3</div>
             <h2 className="text-3xl font-bold uppercase">Semboller</h2>
          </div>
          <p className="text-sm mb-4">Dört sembol göreceksiniz. Hangi sütunda hepsi varsa, o sütundaki sıraya göre (yukarıdan aşağıya) tuşlayın.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-serif text-2xl text-center">
             <div className="bg-white border-2 border-black p-4 shadow-[4px_4px_0px_#000]">
                <div className="text-xs font-sans text-gray-500 mb-2">SÜTUN 1</div>
                <div>Ϙ</div><div>Ω</div><div>★</div><div>Ϟ</div>
             </div>
             <div className="bg-white border-2 border-black p-4 shadow-[4px_4px_0px_#000]">
                <div className="text-xs font-sans text-gray-500 mb-2">SÜTUN 2</div>
                <div>Ψ</div><div>¶</div><div>Ͼ</div><div>Ӭ</div>
             </div>
             <div className="bg-white border-2 border-black p-4 shadow-[4px_4px_0px_#000]">
                <div className="text-xs font-sans text-gray-500 mb-2">SÜTUN 3</div>
                <div>©</div><div>★</div><div>¿</div><div>Ω</div>
             </div>
          </div>
        </section>

        {/* 4. BUTTON */}
        <section className="mb-12 border-b-2 border-dashed border-gray-400 pb-8 break-inside-avoid">
          <div className="flex items-center gap-4 mb-4">
             <div className="w-12 h-12 bg-black text-white flex items-center justify-center font-bold text-2xl">4</div>
             <h2 className="text-3xl font-bold uppercase">Büyük Buton</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
             <div className="space-y-4 text-sm">
                <div className="p-4 bg-red-100 border-l-4 border-red-500">
                   <strong>BASIP ÇEK (TAP):</strong>
                   <ul className="list-square ml-4 mt-2">
                      <li>Buton <strong>Kırmızı</strong> ve üzerinde <strong>"PATLAT"</strong> yazıyorsa.</li>
                      <li>Bombada <strong>Pil (PWR: BATT)</strong> var ve <strong>"PATLAT"</strong> yazıyorsa.</li>
                   </ul>
                </div>
                <div className="p-4 bg-blue-100 border-l-4 border-blue-500">
                   <strong>BASILI TUT (HOLD):</strong>
                   <p className="mt-1">Diğer tüm durumlarda butona basılı tutun. Yan tarafta bir şerit yanacaktır.</p>
                </div>
             </div>

             <div className="bg-gray-100 p-4 border border-gray-300 rounded text-sm">
                <h3 className="font-bold border-b border-gray-400 mb-2 pb-1">ŞERİT RENGİNE GÖRE BIRAKMA ZAMANI</h3>
                <ul className="space-y-2">
                   <li className="flex justify-between">
                      <span className="text-blue-600 font-bold">MAVİ ŞERİT</span>
                      <span>Sayaçta <strong>4</strong> varken</span>
                   </li>
                   <li className="flex justify-between">
                      <span className="text-yellow-600 font-bold">SARI ŞERİT</span>
                      <span>Sayaçta <strong>5</strong> varken</span>
                   </li>
                   <li className="flex justify-between">
                      <span className="text-gray-600 font-bold">DİĞER</span>
                      <span>Sayaçta <strong>1</strong> varken</span>
                   </li>
                </ul>
             </div>
          </div>
        </section>

        {/* 5. SIMON */}
        <section className="mb-12 border-b-2 border-dashed border-gray-400 pb-8 break-inside-avoid">
           <div className="flex items-center gap-4 mb-4">
             <div className="w-12 h-12 bg-black text-white flex items-center justify-center font-bold text-2xl">5</div>
             <h2 className="text-3xl font-bold uppercase">Simon (Hafıza)</h2>
          </div>
          <p className="text-sm">Yanıp sönen renkleri dikkatlice izleyin. Sıra her aşamada uzar. Gördüğünüz sırayı aynen tekrar edin.</p>
        </section>

        {/* 6. MORSE */}
        <section className="mb-12 border-b-2 border-dashed border-gray-400 pb-8 break-inside-avoid">
          <div className="flex items-center gap-4 mb-4">
             <div className="w-12 h-12 bg-black text-white flex items-center justify-center font-bold text-2xl">6</div>
             <h2 className="text-3xl font-bold uppercase">Mors Alfabesi</h2>
          </div>
          <p className="text-sm mb-4">Turuncu ışık Mors alfabesiyle bir kelime kodluyor. Harfleri çöz, kelimeyi bul ve doğru frekansı ayarla.</p>
          
          <div className="bg-black text-green-400 font-mono p-4 rounded grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
             <div>SHELL: 3.505</div>
             <div>HALLS: 3.515</div>
             <div>SLICK: 3.522</div>
             <div>TRICK: 3.532</div>
             <div>BOXES: 3.535</div>
             <div>LEAKS: 3.542</div>
             <div>STROBE: 3.545</div>
             <div>BISTRO: 3.552</div>
             <div>FLICK: 3.555</div>
             <div>BOMBS: 3.565</div>
             <div>BREAK: 3.572</div>
             <div>BRICK: 3.575</div>
             <div>STEAK: 3.582</div>
             <div>STING: 3.592</div>
             <div>VECTOR: 3.595</div>
             <div>BEATS: 3.600</div>
          </div>
        </section>

        {/* 7. PASSWORD */}
        <section className="mb-12 border-b-2 border-dashed border-gray-400 pb-8 break-inside-avoid">
          <div className="flex items-center gap-4 mb-4">
             <div className="w-12 h-12 bg-black text-white flex items-center justify-center font-bold text-2xl">7</div>
             <h2 className="text-3xl font-bold uppercase">Şifre</h2>
          </div>
          <p className="text-sm mb-4">5 harfli bir kelime bulmanız gerekiyor. Her sütundaki harfleri değiştirerek aşağıdaki kelimelerden birini oluşturun.</p>
          
          <div className="bg-gray-100 p-4 text-center text-xs font-mono text-gray-700 leading-loose tracking-widest break-words border border-gray-300">
             ABOUT, AFTER, AGAIN, BELOW, COULD, EVERY, FIRST, FOUND, GREAT, HOUSE, LARGE, LEARN, NEVER, OTHER, PLACE, PLANT, POINT, RIGHT, SMALL, SOUND, SPELL, STILL, STUDY, THEIR, THERE, THESE, THING, THINK, THREE, WATER, WHERE, WHICH, WORLD, WOULD, WRITE
          </div>
        </section>

        {/* NEW MODULES HEADER */}
        <div className="my-12 flex items-center gap-4">
           <div className="h-[2px] bg-red-600 flex-1"></div>
           <h2 className="text-2xl font-black text-red-600 uppercase tracking-widest border-2 border-red-600 px-4 py-2">GİZLİ PAKET EK DOSYALAR</h2>
           <div className="h-[2px] bg-red-600 flex-1"></div>
        </div>

        {/* 8. MAZE - UPDATED VISUAL MAPS */}
        <section className="mb-12 border-b-2 border-dashed border-gray-400 pb-8 break-inside-avoid">
           <div className="flex items-center gap-4 mb-4">
             <div className="w-12 h-12 bg-red-700 text-white flex items-center justify-center font-bold text-2xl">8</div>
             <h2 className="text-3xl font-bold uppercase">LABİRENT</h2>
          </div>
           <p className="mb-2"><strong>Bu adım kritiktir!</strong> İmhacının gördüğü yeşil dairelerin konumu, aşağıdaki 3 haritadan sadece birine uyar. Doğru haritayı bulun ve kırmızı çizgilerle gösterilen duvarlara çarpmadan hedefe (Sağ Üst Köşe, Kırmızı Üçgen) yönlendirin.</p>
           
           <div className="grid md:grid-cols-3 gap-8 mt-6">
              {MANUAL_MAZES.map(maze => (
                 <div key={maze.id} className="flex flex-col items-center">
                    <div className="font-bold text-red-700 mb-2">HARİTA {maze.id}</div>
                    {renderMazeGrid(maze)}
                 </div>
              ))}
           </div>
        </section>

        {/* 9. COMPLEX WIRES */}
        <section className="mb-12 border-b-2 border-dashed border-gray-400 pb-8 break-inside-avoid">
           <div className="flex items-center gap-4 mb-4">
             <div className="w-12 h-12 bg-red-700 text-white flex items-center justify-center font-bold text-2xl">9</div>
             <h2 className="text-3xl font-bold uppercase">KARMAŞIK KABLOLAR</h2>
          </div>
           <p className="mb-4 text-sm">Her kablo için aşağıdaki tabloyu kontrol edin. Şartlar (LED, Yıldız, Renkler) kesip kesmeyeceğinizi belirler.</p>
           
           <div className="overflow-x-auto">
             <table className="w-full text-xs text-center border-2 border-black">
                <thead className="bg-black text-white font-bold">
                   <tr>
                      <th className="p-2">RENK</th>
                      <th className="p-2">LED?</th>
                      <th className="p-2">YILDIZ?</th>
                      <th className="p-2 bg-red-800">TALİMAT</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-300 font-mono">
                   {/* Pure Colors */}
                   <tr className="bg-white"><td>BEYAZ</td><td>HAYIR</td><td>HAYIR</td><td className="font-bold">KES</td></tr>
                   <tr className="bg-red-50 text-red-700"><td>KIRMIZI</td><td>HAYIR</td><td>HAYIR</td><td className="font-bold">SERİ NO TEKSE KES</td></tr>
                   <tr className="bg-blue-50 text-blue-700"><td>MAVİ</td><td>HAYIR</td><td>HAYIR</td><td className="font-bold">SERİ NO TEKSE KES</td></tr>
                   <tr className="bg-purple-50 text-purple-700"><td>KIR+MAV</td><td>HAYIR</td><td>HAYIR</td><td className="font-bold">SERİ NO TEKSE KES</td></tr>
                   {/* Stars */}
                   <tr className="bg-yellow-50"><td>BEYAZ</td><td>HAYIR</td><td>★</td><td className="font-bold">KES</td></tr>
                   <tr className="bg-red-50 text-red-700"><td>KIRMIZI</td><td>HAYIR</td><td>★</td><td className="font-bold">KES</td></tr>
                   <tr className="bg-blue-50 text-blue-700"><td>MAVİ</td><td>HAYIR</td><td>★</td><td className="font-bold text-red-600">KESME</td></tr>
                   <tr className="bg-purple-50 text-purple-700"><td>KIR+MAV</td><td>HAYIR</td><td>★</td><td className="font-bold">PARALEL PORT VARSA</td></tr>
                   {/* LEDs */}
                   <tr className="bg-gray-100"><td>BEYAZ</td><td>LED</td><td>HAYIR</td><td className="font-bold text-red-600">KESME</td></tr>
                   <tr className="bg-red-50 text-red-700"><td>KIRMIZI</td><td>LED</td><td>HAYIR</td><td className="font-bold">PİL VARSA</td></tr>
                   <tr className="bg-blue-50 text-blue-700"><td>MAVİ</td><td>LED</td><td>HAYIR</td><td className="font-bold">PARALEL PORT VARSA</td></tr>
                   <tr className="bg-purple-50 text-purple-700"><td>KIR+MAV</td><td>LED</td><td>HAYIR</td><td className="font-bold">SERİ NO TEKSE</td></tr>
                   {/* Both */}
                   <tr className="bg-gray-100"><td>BEYAZ</td><td>LED</td><td>★</td><td className="font-bold">PİL VARSA</td></tr>
                   <tr className="bg-red-50 text-red-700"><td>KIRMIZI</td><td>LED</td><td>★</td><td className="font-bold">PİL VARSA</td></tr>
                   <tr className="bg-blue-50 text-blue-700"><td>MAVİ</td><td>LED</td><td>★</td><td className="font-bold">PARALEL PORT VARSA</td></tr>
                   <tr className="bg-purple-50 text-purple-700"><td>KIR+MAV</td><td>LED</td><td>★</td><td className="font-bold text-red-600">KESME</td></tr>
                </tbody>
             </table>
           </div>
        </section>

        {/* 10. VENTING */}
        <section className="mb-12 border-b-2 border-dashed border-gray-400 pb-8 break-inside-avoid">
           <div className="flex items-center gap-4 mb-4">
             <div className="w-12 h-12 bg-red-700 text-white flex items-center justify-center font-bold text-2xl">10</div>
             <h2 className="text-3xl font-bold uppercase">GAZ TAHLİYESİ</h2>
          </div>
           <p>Ekranda beliren soruya göre Y (Evet) veya N (Hayır) tuşlayın.</p>
           <div className="mt-4 grid grid-cols-2 gap-4 text-center text-sm font-bold">
              <div className="bg-gray-100 p-2 border border-gray-400 rounded">"HAVALANDIR?" <span className="text-green-600">→ EVET</span></div>
              <div className="bg-gray-100 p-2 border border-gray-400 rounded">"PATLAT?" <span className="text-red-600">→ HAYIR</span></div>
              <div className="bg-gray-100 p-2 border border-gray-400 rounded">"BOŞALT?" <span className="text-green-600">→ EVET</span></div>
              <div className="bg-gray-100 p-2 border border-gray-400 rounded">"KİLİTLE?" <span className="text-red-600">→ HAYIR</span></div>
              <div className="bg-gray-100 p-2 border border-gray-400 rounded">"BASINÇ?" <span className="text-green-600">→ EVET</span></div>
              <div className="bg-gray-100 p-2 border border-gray-400 rounded">"AKIM?" <span className="text-red-600">→ HAYIR</span></div>
              <div className="bg-gray-100 p-2 border border-gray-400 rounded">"SICAKLIK?" <span className="text-red-600">→ HAYIR</span></div>
              <div className="bg-gray-100 p-2 border border-gray-400 rounded">"VANAYI AÇ?" <span className="text-green-600">→ EVET</span></div>
           </div>
        </section>

        {/* 11. KNOB */}
        <section className="mb-12 border-b-2 border-dashed border-gray-400 pb-8 break-inside-avoid">
           <div className="flex items-center gap-4 mb-4">
             <div className="w-12 h-12 bg-red-700 text-white flex items-center justify-center font-bold text-2xl">11</div>
             <h2 className="text-3xl font-bold uppercase">DÖNER ANAHTAR</h2>
          </div>
           <p className="mb-4">Düğmenin etrafındaki yanan LED sayısını sayın ve düğmeyi doğru konuma çevirin.</p>
           
           <div className="bg-gray-800 text-white p-6 rounded-lg text-center font-mono space-y-2 border-2 border-gray-600">
             <div className="flex justify-between border-b border-gray-600 pb-2"><span>LED SAYISI</span><span>KONUM</span></div>
             <div className="flex justify-between"><span>0 - 7 Adet</span><span className="text-yellow-400">YUKARI (UP)</span></div>
             <div className="flex justify-between"><span>8 - 9 Adet</span><span className="text-yellow-400">SAĞ (RIGHT)</span></div>
             <div className="flex justify-between"><span>10 Adet</span><span className="text-yellow-400">AŞAĞI (DOWN)</span></div>
             <div className="flex justify-between"><span>11 - 12 Adet</span><span className="text-yellow-400">SOL (LEFT)</span></div>
           </div>
        </section>

      </div>
    </div>
  );
};

export default ManualView;