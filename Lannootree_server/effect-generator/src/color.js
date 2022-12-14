export default class Color {
  red;
  green;
  blue;

  constructor(red, green, blue) {
    if(red<=255 && green<=255 && blue<=255 && red>=0 && green>=0 && blue>=0) {
      this.red = red;
      this.green = green;
      this.blue = blue;
    }
  }

  set_color(red, green, blue) {
    if(red<=255 && green<=255 && blue<=255 && red>=0 && green>=0 && blue>=0) {
      this.red = red;
      this.green = green;
      this.blue = blue;
    }
  }

  get_color() {
    return [this.red, this.green, this.blue];
  }

  get_red() {
    return this.red;
  }

  get_green() {
    return this.green;
  }

  get_blue() {
    return this.blue;
  }
}