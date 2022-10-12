export default class Effect {

  constructor(ledmatrix) {
    this.ledmatrix = ledmatrix;
  }

  set_ledmatrix(ledmatrix) {
    this.ledmatrix = ledmatrix;
  }

  get_ledmatrix() {
    return this.ledmatrix;
  }

}