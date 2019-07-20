export const BEGINNER = 'beginner';
export const INTERMEDIATE = 'intermediate';
export const ADVANCED = 'advanced';
export const EXPERT = 'expert';
export const DIFFICULTY_LEVELS = [
  {level: BEGINNER, width: 9, height: 9, minesCount: 10},
  {level: INTERMEDIATE, width: 12, height: 12, minesCount: 25},
  {level: ADVANCED, width: 16, height: 16, minesCount: 40},
  {level: EXPERT, width: 30, height: 16, minesCount: 99},
];
export const FLAG_MINE = 'mine';
export const FLAG_UNDEFINED = 'undefined';
export const FLAGS = [
  FLAG_MINE,
  FLAG_UNDEFINED
];
export const DIRECTIONS = [
  {x: -1, y: 0},  // left
  {x: 0, y: 1},   // up
  {x: 1, y: 0},   // right
  {x: 0, y: -1}   // down
];
