export interface Point2d {
  x: number;
  y: number;
}

export interface Tetromino  {
  label: string;
  coords: number[][][];
}

export interface TetrominoController {
  id: number;
  tetromino: Tetromino;
  coord: number[][];
  pos: Point2d;
  getPosArr(pos?: Point2d, chord?: number[][]): Point2d[];
  rotateIndex: number;
}

export interface TetrisOption {
  width: number;
  height: number;
}
