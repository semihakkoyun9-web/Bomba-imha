import { WireColor, WireData, WordModuleData, KeypadModuleData, ButtonModuleData, SimonModuleData, MorseModuleData, PasswordModuleData, MazeModuleData, ComplexWireData, VentingModuleData, KnobModuleData, ModuleType, UserProfile, BombState, LevelConfig } from './types';

// --- RANDOM HELPERS ---
export const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const randomItem = <T,>(arr: T[] | readonly T[]): T => {
  return arr[randomInt(0, arr.length - 1)];
};

// --- DATA PERSISTENCE ---
const STORAGE_KEY = 'bomba_imha_save_v7'; 
const DEFAULT_PROFILE: UserProfile = {
  username: 'Ajan',
  avatarId: 1,
  maxLevel: 1,
  money: 0,
  prevMoney: 0,
  inventory: ['default'],
  ownedPacks: ['main_campaign'],
  activeTheme: 'default',
  gamesPlayed: 0,
  gamesWon: 0,
  isDevMode: false,
  bestTimes: {},
  lastResults: {},
  settings: { sfx: true, music: true, activeTrackId: 'track1', vibration: true }
};

export const loadProfile = (): UserProfile => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return DEFAULT_PROFILE;
  try {
    const data = JSON.parse(stored);
    return { ...DEFAULT_PROFILE, ...data };
  } catch {
    return DEFAULT_PROFILE;
  }
};

export const saveProfile = (profile: UserProfile) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
};

// --- EXISTING MODULE GENERATORS ---

// WIRES: Increased default difficulty to 5-6 wires
export const generateWires = (count: number = 5): WireData[] => {
  const finalCount = count + (Math.random() > 0.5 ? 1 : 0); // 5 or 6 wires
  const colors = Object.values(WireColor);
  return Array.from({ length: finalCount }).map((_, i) => ({
    id: i,
    color: randomItem(colors),
    isCut: false
  }));
};

export const getCorrectWireToCut = (wires: WireData[], serialOdd: boolean): number => {
  const count = wires.length;
  const colors = wires.map(w => w.color);
  const redCount = colors.filter(c => c === WireColor.RED).length;
  const blueCount = colors.filter(c => c === WireColor.BLUE).length;
  const yellowCount = colors.filter(c => c === WireColor.YELLOW).length;
  const blackCount = colors.filter(c => c === WireColor.BLACK).length;
  const lastColor = colors[count - 1];

  // Logic matches the ManualView text exactly
  if (count === 3) {
    if (redCount === 0) return 1; // 2nd
    if (lastColor === WireColor.WHITE) return 2; // Last
    if (blueCount > 1) return colors.lastIndexOf(WireColor.BLUE);
    return 2; // Last
  } else if (count === 4) {
    if (redCount > 1 && serialOdd) return colors.lastIndexOf(WireColor.RED);
    if (lastColor === WireColor.YELLOW && redCount === 0) return 0; // 1st
    if (blueCount === 1) return 0; // 1st
    if (yellowCount > 1) return 3; // Last
    return 1; // 2nd
  } else if (count === 5) {
    if (lastColor === WireColor.BLACK && serialOdd) return 3; // 4th
    if (redCount === 1 && yellowCount > 1) return 0; // 1st
    if (blackCount === 0) return 1; // 2nd
    return 0; // 1st
  } else { // 6 wires
    if (redCount === 0) return 5; // Last
    if (yellowCount === 1 && whiteCount(colors) > 1) return 3; // 4th
    return 0; // 1st
  }
};
const whiteCount = (c: WireColor[]) => c.filter(x => x === WireColor.WHITE).length;

const WORD_RULES: Record<string, string> = { "BOŞ": "GİT", "BOMBA": "BEKLE", "BAS": "DUR", "YOK": "EVET", "HAZIR": "ORTA" };
const ALL_BUTTON_LABELS = ["GİT", "BEKLE", "DUR", "EVET", "ORTA", "HAYIR", "BAS", "SOL", "SAĞ"];
export const generateWordModule = (id: number): WordModuleData => {
  const displayWord = randomItem(Object.keys(WORD_RULES));
  const correctLabel = WORD_RULES[displayWord];
  const distractors = ALL_BUTTON_LABELS.filter(l => l !== correctLabel).sort(() => 0.5 - Math.random()).slice(0, 3);
  const buttons = [...distractors, correctLabel].sort(() => 0.5 - Math.random());
  return { id, displayWord, buttons, correctLabel };
};

const SYMBOL_COLUMNS = [["Ϙ", "Ω", "★", "Ϟ"], ["Ψ", "¶", "Ͼ", "Ӭ"], ["©", "★", "¿", "Ω"]];
export const generateKeypadModule = (id: number): KeypadModuleData => {
  const column = randomItem(SYMBOL_COLUMNS);
  const symbols = [...column]; 
  const shuffled = [...symbols].sort(() => 0.5 - Math.random());
  return { id, symbols: shuffled, correctOrder: symbols, pressed: [] };
};

export const generateButtonModule = (id: number): ButtonModuleData => {
  const colors: ButtonModuleData['color'][] = ['red', 'blue', 'yellow', 'white'];
  const labels: ButtonModuleData['label'][] = ['PATLAT', 'BEKLE', 'BASILI TUT', 'İPTAL'];
  const stripColors: ButtonModuleData['stripColor'][] = ['blue', 'white', 'yellow', 'red'];
  return { id, color: randomItem(colors), label: randomItem(labels), stripColor: randomItem(stripColors), isHeld: false };
};
export const handleButtonLogic = (action: 'tap' | 'release', bomb: BombState, data: ButtonModuleData, timeDigit: number): { solved: boolean, strike: boolean } => {
  const shouldTap = (data.color === 'red' && data.label === 'PATLAT') || (bomb.hasBatteries && data.label === 'PATLAT');
  if (action === 'tap') { return shouldTap ? { solved: true, strike: false } : { solved: false, strike: true }; } 
  else {
    if (shouldTap) return { solved: false, strike: true };
    let targetDigit = 1;
    if (data.stripColor === 'blue') targetDigit = 4;
    else if (data.stripColor === 'yellow') targetDigit = 5;
    return timeDigit === targetDigit ? { solved: true, strike: false } : { solved: false, strike: true };
  }
};

export const generateSimonModule = (id: number): SimonModuleData => {
  const colors = ['R', 'G', 'B', 'Y'];
  // Increased sequence length to 5 for difficulty
  const sequence = [randomItem(colors), randomItem(colors), randomItem(colors), randomItem(colors), randomItem(colors)];
  return { id, sequence, inputSequence: [], stage: 0 };
};

const MORSE_WORDS = ["SHELL", "HALLS", "SLICK", "TRICK", "BOXES", "LEAKS", "STROBE", "BISTRO", "FLICK", "BOMBS", "BREAK", "BRICK", "STEAK", "STING", "VECTOR", "BEATS"];
export const generateMorseModule = (id: number): MorseModuleData => {
  const word = randomItem(MORSE_WORDS);
  // Frequency mapping must match manual exactly
  const map: Record<string, number> = {
      "SHELL": 3.505, "HALLS": 3.515, "SLICK": 3.522, "TRICK": 3.532,
      "BOXES": 3.535, "LEAKS": 3.542, "STROBE": 3.545, "BISTRO": 3.552,
      "FLICK": 3.555, "BOMBS": 3.565, "BREAK": 3.572, "BRICK": 3.575,
      "STEAK": 3.582, "STING": 3.592, "VECTOR": 3.595, "BEATS": 3.600
  };
  return { id, word, frequency: map[word] || 3.505 }; 
};

const PASSWORD_WORDS = ["ABOUT", "AFTER", "AGAIN", "BELOW", "COULD", "EVERY", "FIRST", "FOUND", "GREAT", "HOUSE", "LARGE", "LEARN", "NEVER", "OTHER", "PLACE", "PLANT", "POINT", "RIGHT", "SMALL", "SOUND", "SPELL", "STILL", "STUDY", "THEIR", "THERE", "THESE", "THING", "THINK", "THREE", "WATER", "WHERE", "WHICH", "WORLD", "WOULD", "WRITE"];
export const generatePasswordModule = (id: number): PasswordModuleData => {
  const targetWord = randomItem(PASSWORD_WORDS);
  const columns: string[][] = [];
  for (let i = 0; i < 5; i++) {
    const colLetters = new Set<string>();
    colLetters.add(targetWord[i]);
    // Fill with distractors
    while (colLetters.size < 6) {
      const randomChar = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      colLetters.add(randomChar);
    }
    columns.push(Array.from(colLetters).sort());
  }
  return { id, targetWord, columns, currentIndices: [0, 0, 0, 0, 0] };
};

// --- NEW MODULES ---

// 1. MAZE - Now with ACTUAL WALL DEFINITIONS
// Format: "x1,y1-x2,y2" means there is a wall between these two adjacent cells.
const MAZE_DEFINITIONS = [
  { 
      markers: [{x:0, y:1}, {x:5, y:2}], 
      walls: [
          "0,1-1,1", "1,1-1,0", "1,1-2,1", "2,1-2,2", "2,2-3,2", "3,2-3,1", "3,1-3,0", 
          "0,3-1,3", "1,3-1,4", "1,4-1,5", "2,3-3,3", "3,3-4,3", "4,3-4,2", "4,3-5,3",
          "5,3-5,4", "4,1-5,1", "4,1-4,0", "0,5-0,4", "2,5-3,5", "4,5-5,5"
      ] 
  }, 
  { 
      markers: [{x:1, y:3}, {x:4, y:1}], 
      walls: [
          "1,0-2,0", "3,0-4,0", "1,1-1,2", "2,1-3,1", "4,1-4,2", "5,1-5,2", 
          "0,2-0,3", "1,2-2,2", "2,2-2,3", "3,2-3,3", "4,2-5,2", 
          "0,4-1,4", "1,4-1,5", "2,4-3,4", "3,4-3,5", "4,4-5,4", "4,4-4,3"
      ] 
  }, 
  { 
      markers: [{x:3, y:3}, {x:5, y:3}], 
      walls: [
          "0,0-0,1", "0,1-1,1", "1,0-2,0", "2,0-3,0", "3,0-3,1", "4,0-4,1", "5,0-5,1",
          "0,2-1,2", "1,2-1,3", "2,2-2,3", "3,2-4,2", "4,2-5,2",
          "0,4-1,4", "1,4-2,4", "2,4-2,5", "3,4-3,5", "4,4-4,5", "5,4-5,5", "3,3-4,3"
      ] 
  }, 
];

export const generateMazeModule = (id: number): MazeModuleData => {
  const mazeIndex = randomInt(0, MAZE_DEFINITIONS.length - 1);
  return {
    id,
    mazeIndex,
    startPos: { x: randomInt(0, 5), y: randomInt(0, 5) },
    endPos: { x: randomInt(0, 5), y: randomInt(0, 5) },
    currentPos: { x: 0, y: 0 },
    markers: MAZE_DEFINITIONS[mazeIndex].markers,
    walls: MAZE_DEFINITIONS[mazeIndex].walls
  };
};

export const checkMazeCollision = (current: {x:number, y:number}, next: {x:number, y:number}, walls: string[]): boolean => {
    // Check if the move crosses a wall. Order of coordinates in wall string might vary.
    const path1 = `${current.x},${current.y}-${next.x},${next.y}`;
    const path2 = `${next.x},${next.y}-${current.x},${current.y}`;
    return walls.includes(path1) || walls.includes(path2);
};

// 2. COMPLEX WIRES
export const generateComplexWiresModule = (id: number): { type: ModuleType, data: ComplexWireData[], solved: boolean } => {
  const wires: ComplexWireData[] = Array.from({length: 6}).map((_, i) => ({
    id: i,
    color: { 
      red: Math.random() > 0.4, // Increased chance
      blue: Math.random() > 0.4, 
      white: false
    },
    hasStar: Math.random() > 0.5,
    isLedOn: Math.random() > 0.5,
    isCut: false
  }));
  return { type: ModuleType.COMPLEX_WIRES, data: wires, solved: false };
};

export const shouldCutComplexWire = (w: ComplexWireData, bomb: BombState): boolean => {
  const { red, blue } = w.color;
  const star = w.hasStar;
  const led = w.isLedOn;
  
  if (!red && !blue) {
      if (star && led) return bomb.hasBatteries;
      if (star && !led) return true;
      if (!star && led) return false;
      return true;
  }
  if (red && !blue) {
      if (star && led) return bomb.hasBatteries;
      if (star && !led) return true;
      if (!star && led) return bomb.hasBatteries;
      return bomb.serialOdd;
  }
  if (!red && blue) {
      if (star && led) return bomb.hasParallelPort;
      if (star && !led) return false;
      if (!star && led) return bomb.hasParallelPort;
      return bomb.serialOdd;
  }
  if (red && blue) {
      if (star && led) return false;
      if (star && !led) return bomb.hasParallelPort;
      if (!star && led) return bomb.serialOdd;
      return bomb.serialOdd;
  }
  return false;
};

// 3. VENTING GAS
export const generateVentingModule = (id: number): VentingModuleData => {
  const pairs = [
      { q: "HAVALANDIR?", a: "EVET" },
      { q: "PATLAT?", a: "HAYIR" },
      { q: "BOŞALT?", a: "EVET" },
      { q: "KİLİTLE?", a: "HAYIR" },
      { q: "BASINÇ?", a: "EVET" },
      { q: "AKIM?", a: "HAYIR" },
      { q: "SICAKLIK?", a: "HAYIR" },
      { q: "VANAYI AÇ?", a: "EVET" }
  ] as const;
  const selected = randomItem(pairs);
  return {
    id,
    question: selected.q,
    answer: selected.a
  };
};

// 4. KNOB
export const generateKnobModule = (id: number): KnobModuleData => {
  const leds = Array.from({length: 12}).map(() => Math.random() > 0.5);
  const ledCount = leds.filter(Boolean).length;
  
  let pos: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' = 'UP';
  if (ledCount <= 7) pos = 'UP';
  else if (ledCount >= 8 && ledCount <= 9) pos = 'RIGHT';
  else if (ledCount === 10) pos = 'DOWN';
  else pos = 'LEFT';

  return {
    id,
    leds,
    correctPosition: pos,
    currentPosition: 'UP'
  };
};

// --- LEVEL GENERATION ---
export const getLevelConfig = (level: number, packId: string = 'main_campaign'): LevelConfig => {
  let baseModules = 3;
  let timePerModule = 50; // Tightened time

  if (packId === 'covert_ops') {
     baseModules = 5;
     timePerModule = 40;
  } else if (packId === 'nightmare') {
     baseModules = 8;
     timePerModule = 25;
  } else if (level > 50) {
     baseModules = 5;
     timePerModule = 45;
  }

  let moduleCount = baseModules + Math.floor((level - 1) / 8); // Modules increase faster
  moduleCount = Math.min(11, moduleCount); 

  let time = moduleCount * timePerModule;
  if (level > 80) time = time * 0.75; 

  const modules: ModuleType[] = [];
  const availableTypes = [ModuleType.WIRES, ModuleType.WORDS];
  
  if (level >= 3 || packId !== 'main_campaign') availableTypes.push(ModuleType.KEYPAD);
  if (level >= 5 || packId !== 'main_campaign') availableTypes.push(ModuleType.BUTTON);
  if (level >= 8 || packId !== 'main_campaign') availableTypes.push(ModuleType.SIMON); // Earlier simon
  if (level >= 12 || packId !== 'main_campaign') availableTypes.push(ModuleType.MORSE);
  if (level >= 15 || packId !== 'main_campaign') availableTypes.push(ModuleType.PASSWORD);
  if (level >= 20 || packId !== 'main_campaign') availableTypes.push(ModuleType.MAZE);
  if (level >= 30 || packId !== 'main_campaign') availableTypes.push(ModuleType.COMPLEX_WIRES);
  if (level >= 40 || packId !== 'main_campaign') availableTypes.push(ModuleType.VENTING);
  if (level >= 50 || packId !== 'main_campaign') availableTypes.push(ModuleType.KNOB);

  for (let i = 0; i < moduleCount; i++) {
    modules.push(randomItem(availableTypes));
  }

  return { level, time, modules };
};