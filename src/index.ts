import 'normalize.css';
import './index.css';
import TetrisDom from './tetris-dom';

const element = document.getElementById('matrix');
const nextPieceElement = document.getElementById('next-piece');
const game = new TetrisDom(element, nextPieceElement, {width: 10, height: 20});
const pageHome = document.getElementById('page-home');
const pageGameOver = document.getElementById('page-game-over');
const btnStart = document.getElementById('btn-start');
const btnPlayAgain = document.getElementById('btn-play-again');
const topbar = document.getElementById('topbar');
const topbarLevel = document.getElementById('topbar-level');
const topbarScore = document.getElementById('topbar-score');
const padScore = document.getElementById('pad-score');

// buttons for mobile
const btnArrowUp = document.getElementById('btn-arrow-up');
const btnArrowDown = document.getElementById('btn-arrow-down');
const btnArrowLeft = document.getElementById('btn-arrow-left');
const btnArrowRight = document.getElementById('btn-arrow-right');
const btnA = document.getElementById('btn-a');
const btnB = document.getElementById('btn-b');

game.on('gamestart', () => {
  topbarLevel.textContent = `Level: ${game.level}`;
  topbarScore.textContent = `Score: ${game.score}`;
});

game.on('change', () => {
  topbarLevel.textContent = `Level: ${game.level}`;
  topbarScore.textContent = `Score: ${game.score}`;
});

game.on('gameover', () => {
  pageGameOver.classList.remove('hidden');
  padScore.innerHTML = `Your Score: ${game.score}`;
});

const startGame = () => {
  game.start()
  topbar.classList.remove('hidden');
  pageHome.classList.add('hidden');
  pageGameOver.classList.add('hidden');
};

btnStart.addEventListener('click', startGame, false);

btnPlayAgain.addEventListener('click', startGame, false);

btnArrowUp.addEventListener('click', () => game.isStarted && game.rotateCurrentPiece(), false);
btnArrowDown.addEventListener('click', () => game.isStarted && game.moveDown(), false);
btnArrowLeft.addEventListener('click', () => game.isStarted && game.moveLeft(), false);
btnArrowRight.addEventListener('click', () => game.isStarted && game.moveRight(), false);

btnA.addEventListener('click', () => {
  if (game.isStarted) {
    game.rotateCurrentPiece();
  }
  else {
    startGame();
  }
}, false);

btnB.addEventListener('click', () => {
  if (game.isStarted) {
    game.dropCurrentPiece();
  }
  else {
    startGame();
  }
}, false);
