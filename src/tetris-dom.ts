import Tetris from './tetris';

export default class TetrisDom extends Tetris {

  private element: HTMLElement;

  private isAnimating: boolean = false;

  private lastHtml: string = '';

  private bindedHandleKeyDown: () => void;

  constructor(element: HTMLElement, options) {
    super(options);
    this.element = element;
    this.addEventListeners();
    this.eventEmitter.on('gameover', () => {
      this.stopAnimationLoop()
    }, false);
  }

  draw() {
    const {element} = this;
    const {width, height} = this.option;
    const html = this.matrix.map(row => {
      const tds = row.map(block => {
        const cssClasses = [`color-${block.label}`];
        if (block.isPseudo) {
          cssClasses.push('pseudo');
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
