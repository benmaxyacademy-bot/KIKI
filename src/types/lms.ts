export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface Position {
  x: number;
  y: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  explanation: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
}

export interface LevelConfig {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  conceptName: string;
  icon: string;
  story: string;
  mission: string;
  requirements: string[];
  quiz: QuizQuestion;
  hint: string;
  defaultXml: string;
  solutionXml?: string;
  expectedBehavior: string;
  badgeName: string;
  badgeDescription: string;
  speedDefault: number;
}

export interface StudentProgress {
  studentName: string;
  completedLevels: number[];
  unlockedLevels: number[];
  levelStars: Record<number, number>; // 1, 2, or 3 stars
  earnedBadges: string[];
  currentLevelId: number;
  customSnakeColor: string;
  customFoodType: 'apple' | 'star' | 'strawberry' | 'pizza' | 'donut';
}

export interface GameExecutionState {
  isRunning: boolean;
  isPaused: boolean;
  isGameOver: boolean;
  isVictorious: boolean;
  score: number;
  highScore: number;
  snake: Position[];
  direction: Direction;
  nextDirection: Direction;
  food: Position;
  gridWidth: number;
  gridHeight: number;
  speed: number;
  hasWallCollision: boolean;
  hasSelfCollision: boolean;
  hasScoreIncrement: boolean;
  hasGrowth: boolean;
  hasFoodEating: boolean;
  stepCount: number;
}
