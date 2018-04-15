export default class MatrixBlock {

  id: number;

  label: string;

  isPseudo: boolean = false;

  isFadingOut: boolean = false;

  constructor(id = 0, label = 'empty', isPseudo = false) {
    this.id = id;
    this.label = label;
    this.isPseudo = isPseudo;
  }

  setEmpty() {
    this.id = 0;
    this.label = 'empty';
    this.isPseudo = false;
    this.isFadingOut = false;
    return this;
  }

  isEmpty() {
    return ('empty' === this.label) && (0 === this.id);
  }

  setFadingOut() {
    this.isFadingOut = true;
    return this;
  }
}
