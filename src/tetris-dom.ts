import Tetris from './tetris';

export default class TetrisDom extends Tetris {

  private element: HTMLElement;

  private nextPieceElement: HTMLElement;

  private isAnimating: boolean = false;

  private lastHtml: string = '';

  private lastNextPieceHtml: string = '';

  private bindedHandleKeyDown: () => void;

  constructor(element: HTMLElement, nextPieceElement: HTMLElement, options) {
    super(options);
    this.element = element;
    this.nextPieceElement = nextPieceElement;
    this.addEventListeners();
    this.eventEmitter.on('gameover', () => {
      this.stopAnimationLoop()
    }, false);
  }

  drawNextPiece() {
    const {nextPiece, nextPieceElement} = this;
    const {label} = nextPiece.tetromino;
    const posArr = nextPiece.getPosArr({x: 0, y: 0});
    const html = Array(4).fill(null).map((_, i) => {
      const tds = Array(4).fill(null).map((_, j) => {
        const pos = posArr.find(pos => (pos.x === j) && (pos.y === i));
        const cssClass = pos ? `color-${label}` : '';
        return `<td class="${cssClass}"></td>`;
      }).join('');
      return `<tr>${tds}</tr>`;
    }).join('');

    if (this.lastNextPieceHtml !== html) {
      nextPieceElement.innerHTML = html;
      this.lastNextPieceHtml = html;
    }
  }

  draw() {

    this.drawNextPiece();

    const {element} = this;
    const html = this.matrix.map((row, index) => {
      if (index < this.bufferHeight) {
        return '';
      }
      const tds = row.map(block => {
        const cssClasses = [`color-${block.label}`];
        if (block.isPseudo) {
          cssClasses.push('pseudo');
        }
        if (block.isFadingOut) {
          cssClasses.push('fade-out');
        }
        return `<td class="${cssClasses.join(' ')}"></td>`;
      }).join('');
      return `<tr>${tds}</tr>`;
    }).join('');

    if (this.lastHtml !== html) {
      element.innerHTML = html;
      this.lastHtml = html;
    }
  }

  addEventListeners() {
    this.bindedHandleKeyDown = this.handleKeyDown.bind(this);
    document.addEventListener('keydown', this.bindedHandleKeyDown, false);
  }

  handleKeyDown(event: KeyboardEvent) {

    if (! this.isStarted) {
      return;
    }

    const {code} = event;

    if ('ArrowLeft' === code) {
      this.moveLeft();
    }
    else if ('ArrowRight' === code) {
      this.moveRight();
    }
    else if ('ArrowDown' === code) {
      this.moveDown();
    }
    else if ('ArrowUp' === code) {
      this.rotateCurrentPiece();
    }
    else if ('Space' === code) {
      this.dropCurrentPiece();
    }
  }

  removeEventListeners() {
    document.removeEventListener('keydown', this.bindedHandleKeyDown, false);
  }

  startAnimationLoop() {

    const self = this;
    self.isAnimating = true;

    function loop() {

      if (! self.isAnimating) {
        return;
      }
      self.draw();
      requestAnimationFrame(loop);
    }
    loop();
  }

  stopAnimationLoop() {
    this.isAnimating = false;
  }

  clearRowIfNeeded(next: () => void) {

    const rowsShouldBeFadedOut = this.matrix.filter(row => row.every(block => ! block.isEmpty()));

    if (rowsShouldBeFadedOut.length > 0) {
      this.stopAnimationLoop();
      this.matrix = this.matrix.map(row => {
        const shouldApplyFadingOutAnimation = row.every(block => ! block.isEmpty());
        if (shouldApplyFadingOutAnimation) {
          return row.map(block => block.setFadingOut());
        }
        return row;
      });
      this.draw()
      setTimeout(() => {
        this.startAnimationLoop();
        super.clearRowIfNeeded(next);
      }, 300);
    }
    else {
      super.clearRowIfNeeded(next);
    }
  }

  start() {
    super.start();
    this.startAnimationLoop();
  }

  destroy() {
    super.destroy();
    this.stopAnimationLoop();
    this.removeEventListeners();
  }
}
