import 'normalize.css';
import './index.css';
import TetrisDom from './tetris-dom';

const element = document.getElementById('matrix');
const game = new TetrisDom(element, {width: 10, height: 20});
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

const startGame = (event) => {
  event.preventDefault();
  game.start()
  topbar.classList.remove('hidden');
  pageHome.classList.add('hidden');
  pageGameOver.classList.add('hidden');
};

btnStart.addEventListener('click', startGame, false);

btnPlayAgain.addEventListener('click', startGame, false);

btnArrowUp.addEventListener('click', () => game.isStarted && game.rotateCurrentPiece(), false);
btnArrowDown.addEventListener('click', () => game.isStarted && game.moveCurrentPieceToBottom(), false);
btnArrowLeft.addEventListener('click', () => game.isStarted && game.moveCurrentPieceToLeft(), false);
btnArrowRight.addEventListener('click', () => game.isStarted && game.moveCurrentPieceToRight(), false);

btnA.addEventListener('click', (event) => {
  event.preventDefault();
  if (game.isStarted) {
    game.rotateCurrentPiece();
  }
  else {
    startGame(event);
  }
}, false);

btnB.addEventListener('click', (event) => {
  event.preventDefault();
  if (game.isStarted) {
    game.dropCurrentPieceAllTheWayToBottom();
  }
  else {
    startGame(event);
  }
}, false);
