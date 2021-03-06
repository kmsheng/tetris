import {EventEmitter} from 'eventemitter3';
import shuffle from './shuffle';
import {
  TETROMINO_I,
  TETROMINO_J,
  TETROMINO_L,
  TETROMINO_O,
  TETROMINO_S,
  TETROMINO_T,
  TETROMINO_Z
} from './tetrominoes';
import {Tetromino, TetrominoController, TetrisOption, Point2d} from './types';
import MatrixBlock from './matrix-block';

export default class Tetris {

  moves: number = 0;

  isStarted: boolean = false;

  level: number = 1;

  score: number = 0;

  eventEmitter: any;

  option: TetrisOption;

  pieceCount: number = 0;

  delay: number = 1000;

  timer: number;

  currentPiece: TetrominoController;

  nextPiece: TetrominoController;

  bufferHeight: number = 1;

  tetrominoes: Tetromino[] = [
    TETROMINO_O,
    TETROMINO_J,
    TETROMINO_L,
    TETROMINO_S,
    TETROMINO_Z,
    TETROMINO_T,
    TETROMINO_I
  ];

  protected matrix: MatrixBlock[][];

  constructor(option: TetrisOption) {
    this.option = option;
    this.eventEmitter = new EventEmitter();
  }

  draw() {
  }

  getMatrixHeight() {
    return this.option.height + this.bufferHeight;
  }

  initMatrix() {

    const {width} = this.option;
    const height = this.getMatrixHeight();
    this.matrix = [];

    for (let i: number = 0; i < height; i++) {
      if (! Array.isArray(this.matrix[i])) {
        this.matrix[i] = [];
      }
      for (let j: number = 0; j < width; j++) {
        this.matrix[i][j] = new MatrixBlock();
      }
    }
  }

  getNewPiece() {

    const [randomBlock] = shuffle(this.tetrominoes);
    const [coord] = shuffle(randomBlock.coords);
    this.pieceCount += 1;

    return {
      id: this.pieceCount,
      tetromino: randomBlock,
      coord,
      pos: {x: 4, y: 0},
      getPosArr(pos = this.pos, coord = this.coord) {
        return coord.map(([x, y]) => {
          return {
            x: pos.x + x,
            y: pos.y + y
          };
        });
      },
      rotateIndex: 0
    };
  }

  setNewPiece() {

    if (this.nextPiece) {
      this.currentPiece = this.nextPiece;
      this.nextPiece = this.getNewPiece();
    }
    else {
      this.currentPiece = this.getNewPiece();
      this.nextPiece = this.getNewPiece();
    }
  }

  canPlaceBlocks(posArr: Point2d[]) {

    return posArr.every(pos => {
      if (! (pos.y in this.matrix)) {
        return false;
      }
      const block = this.matrix[pos.y][pos.x];
      if (block && block.isEmpty()) {
        return true;
      }
      if (block && block.id === this.currentPiece.id) {
        return true;
      }
      return false;
    });
  }

  eraseBlocks(id: number) {
    this.matrix.map(row => row.map(block => (block.id === id) ? block.setEmpty() : block));
  }

  canThrowNewBlock() {
    return this.currentPiece.getPosArr()
      .every(pos => this.matrix[pos.y][pos.x].isEmpty());
  }

  // the pos arr where a piece will fall
  getDroppedPosData(posArr: Point2d[]) {

    let canPlace = true;
    let deltaY = 0;
    let droppedPosArr = posArr.slice(0);

    while (true) {
      deltaY += 1;
      const nextPosArr = posArr.map(pos => ({x: pos.x, y: pos.y + deltaY}));
      if (this.canPlaceBlocks(nextPosArr)) {
        droppedPosArr = nextPosArr;
      }
      else {
        break;
      }
    }
    return {deltaY, droppedPosArr};
  }

  setBlocks(posArr: Point2d[], piece: TetrominoController) {

    const {droppedPosArr} = this.getDroppedPosData(posArr);

    droppedPosArr.forEach(({x, y}) => {
      this.matrix[y][x] = new MatrixBlock(piece.id, piece.tetromino.label, true);
    });

    posArr.forEach(({x, y}) => {
      this.matrix[y][x] = new MatrixBlock(piece.id, piece.tetromino.label);
    });
  }

  clearRowIfNeeded(next?: () => void) {

    const {matrix, level} = this;
    const {width} = this.option;
    const height = this.getMatrixHeight();
    const scoreThisRound = matrix.filter(row => row.every(block => ! block.isEmpty())).length * width * level;
    const clearedRows = matrix.filter(row => row.some(block => block.isEmpty()));
    const start = height - clearedRows.length;
    this.matrix = matrix.map((row, i) => {
      if (i < start) {
        return row.map(block => block.setEmpty());
      }
      return clearedRows[i - start];
    });

    this.score += scoreThisRound;
    this.eventEmitter.emit('change');

    if (next) {
      next();
    }
  }

  changeLevelIfNeeded() {
    const newLevel = Math.ceil(this.moves / 20);
    if (this.level != newLevel) {
      this.level = newLevel;
      const newDelay = 1000 - (newLevel * 50);
      this.delay = newDelay <= 400 ? 400 : newDelay;
      this.eventEmitter.emit('change');
    }
  }

  throwNewPiece() {

    const setMovingBlock = () => {

      const {currentPiece} = this;
      const posArr = currentPiece.getPosArr();

      this.eraseBlocks(currentPiece.id);

      if (this.canPlaceBlocks(posArr)) {

        this.moves += 1;
        this.changeLevelIfNeeded();
        this.setBlocks(posArr, currentPiece);

        const nextPosArr = currentPiece.getPosArr({
          x: currentPiece.pos.x,
          y: currentPiece.pos.y + 1
        });

        if (this.canPlaceBlocks(nextPosArr)) {
          currentPiece.pos.y += 1;
        }
        else {
          clearInterval(this.timer);
          this.setNewPiece();

          if (this.canThrowNewBlock()) {
            this.clearRowIfNeeded(() => this.throwNewPiece());
            return;
          }
          this.gameOver();
        }
      }
      else {
        this.gameOver();
      }
    }

    this.timer = setInterval(setMovingBlock, this.delay);
  }

  moveLeft() {
    const {currentPiece} = this;
    const nextPosArr = currentPiece.getPosArr({
      x: currentPiece.pos.x - 1,
      y: currentPiece.pos.y
    });

    if (this.canPlaceBlocks(nextPosArr)) {
      this.eraseBlocks(currentPiece.id);
      currentPiece.pos.x -= 1;
      this.setBlocks(nextPosArr, currentPiece);
    }
  }

  moveRight() {
    const {currentPiece} = this;
    const nextPosArr = currentPiece.getPosArr({
      x: currentPiece.pos.x + 1,
      y: currentPiece.pos.y
    });

    if (this.canPlaceBlocks(nextPosArr)) {
      this.eraseBlocks(currentPiece.id);
      currentPiece.pos.x += 1;
      this.setBlocks(nextPosArr, currentPiece);
    }
  }

  moveDown() {

    const {currentPiece} = this;
    const nextPosArr = currentPiece.getPosArr({
      x: currentPiece.pos.x,
      y: currentPiece.pos.y + 1
    });

    if (this.canPlaceBlocks(nextPosArr)) {
      this.eraseBlocks(currentPiece.id);
      currentPiece.pos.y += 1;
      this.setBlocks(nextPosArr, currentPiece);
    }
  }

  dropCurrentPiece() {
    const {currentPiece} = this;
    const {droppedPosArr, deltaY} = this.getDroppedPosData(currentPiece.getPosArr());
    this.eraseBlocks(currentPiece.id);
    this.setBlocks(droppedPosArr, currentPiece);
    this.clearRowIfNeeded();
    this.setNewPiece();
  }

  rotateCurrentPiece() {
    const {currentPiece} = this;
    const nextRotateIndex = (currentPiece.rotateIndex + 1) % currentPiece.tetromino.coords.length;
    const nextCoord = currentPiece.tetromino.coords[nextRotateIndex];
    const nextPosArr = currentPiece.getPosArr(currentPiece.pos, nextCoord);

    if (this.canPlaceBlocks(nextPosArr)) {
      this.eraseBlocks(currentPiece.id);
      currentPiece.rotateIndex = nextRotateIndex;
      currentPiece.coord = currentPiece.tetromino.coords[nextRotateIndex];
      this.setBlocks(nextPosArr, currentPiece);
    }
  }

  on(event: string, func) {
    this.eventEmitter.on(event, func);
  }

  destroy() {
    this.eventEmitter.removeAllListeners();
  }

  start() {
    this.level = 1;
    this.score = 0;
    this.isStarted = true;
    this.eventEmitter.emit('gamestart');
    this.initMatrix();
    this.setNewPiece();
    this.throwNewPiece();
  }

  private gameOver() {
    clearInterval(this.timer);
    this.isStarted = false;
    this.eventEmitter.emit('gameover');
  }
}
