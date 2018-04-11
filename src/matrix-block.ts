export default class MatrixBlock {

  id: number;
  label: string;

  constructor(id = 0, label = 'empty') {
    this.id = id;
    this.label = label;
  }

  setEmpty() {
    this.id = 0;
    this.label = 'empty';
    return this;
  }

  isEmpty() {
    return ('empty' === this.label) && (0 === this.id);
  }
}
