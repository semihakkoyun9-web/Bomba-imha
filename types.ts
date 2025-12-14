
export enum GameState {
  MENU = 'MENU',
  LEVEL_SELECT = 'LEVEL_SELECT',
  PLAYING = 'PLAYING',
  EXPLODED = 'EXPLODED',
  DEFUSED = 'DEFUSED',
  SHOP = 'SHOP',
  PROFILE = 'PROFILE',
  SETTINGS = 'SETTINGS',
  MANUAL = 'MANUAL'
}

export enum Role {
  NONE = 'NONE',
  DEFUSER = 'DEFUSER',
  EXPERT = 'EXPERT'
}

export enum ModuleType {
  WIRES = 'WIRES',
  WORDS = 'WORDS',
  KEYPAD = 'KEYPAD',
  BUTTON = 'BUTTON',
  SIMON = 'SIMON',
  MORSE = 'MORSE',
  PASSWORD = 'PASSWORD',
  MAZE = 'MAZE',
  COMPLEX_WIRES = 'COMPLEX_WIRES',
  VENTING = 'VENTING',
  KNOB = 'KNOB'
}

export enum WireColor {
  RED = 'red',
  BLUE = 'blue',
  YELLOW = 'yellow',
  WHITE = 'white',
  BLACK = 'black'
}

export interface WireData {
  id: number;
  color: WireColor;
  isCut: boolean;
}

export interface WordModuleData {
  id: number;
  displayWord: string;
  buttons: string[];
  correctLabel: string;
}

export interface KeypadModuleData {
  id: number;
  symbols: string[];
  correctOrder: string[];
  pressed: string[];
}

export interface ButtonModuleData {
  id: number;
  color: 'red' | 'blue' | 'yellow' | 'white';
  label: 'PATLAT' | 'BEKLE' | 'BASILI TUT' | 'İPTAL';
  stripColor?: 'blue' | 'white' | 'yellow' | 'red';
  isHeld: boolean;
}

export interface SimonModuleData {
  id: number;
  sequence: string[];
  inputSequence: string[];
  stage: number;
}

export interface MorseModuleData {
  id: number;
  word: string; 
  frequency: number;
}

export interface PasswordModuleData {
  id: number;
  targetWord: string;
  columns: string[][];
  currentIndices: number[];
}

export interface MazeModuleData {
  id: number;
  mazeIndex: number; // 0-8 predefined mazes
  startPos: { x: number, y: number };
  endPos: { x: number, y: number };
  currentPos: { x: number, y: number };
  markers: { x: number, y: number }[]; // Two green circles
  walls: string[]; // List of coordinates that have walls e.g. "x1,y1-x2,y2"
}

export interface ComplexWireData {
  id: number;
  color: { red: boolean, blue: boolean, white: boolean };
  hasStar: boolean;
  isLedOn: boolean;
  isCut: boolean;
}

export interface VentingModuleData {
  id: number;
  question: string;
  answer: 'EVET' | 'HAYIR';
}

export interface KnobModuleData {
  id: number;
  leds: boolean[]; // 12 leds (Left 6, Right 6)
  correctPosition: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
  currentPosition: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
}

export interface BombState {
  modules: {
    type: ModuleType;
    data: any;
    solved: boolean;
  }[];
  strikes: number;
  maxStrikes: number;
  timeLeft: number;
  totalTime: number;
  serialOdd: boolean;
  hasBatteries: boolean;
  hasIndicator: boolean;
  hasParallelPort: boolean;
  level: number;
}

export interface LevelConfig {
  level: number;
  time: number;
  modules: ModuleType[];
}

export interface Theme {
  id: string;
  name: string;
  price: number;
  bgClass: string;
  panelClass: string;
  accentClass: string;
  fontClass: string;
}

export interface LevelPack {
  id: string;
  name: string;
  price: number;
  startLevel: number;
  endLevel: number;
  description: string;
}

export interface UserProfile {
  username: string;
  avatarId: number;
  maxLevel: number; // Main campaign progress (1-100)
  money: number;
  prevMoney?: number; // Stores money before entering dev mode
  inventory: string[];
  ownedPacks: string[]; // IDs of bought packs
  activeTheme: string;
  gamesPlayed: number;
  gamesWon: number;
  isDevMode: boolean;
  bestTimes: Record<string, number>;
  lastResults: Record<string, 'WIN' | 'LOSS'>; // Key: packId_level
  settings: {
    sfx: boolean;
    music: boolean;
    activeTrackId: string;
    vibration: boolean;
  };
}
