declare type color = [number, number, number];

export default class Color {
  private color: color = [0, 0, 0];

  constructor(red: number, green: number, blue: number) {
    this.set_color(red, green, blue);
  }

  set_color(red: number, green: number, blue: number) {
    if(red<=255 && green<=255 && blue<=255 && red>=0 && green>=0 && blue>=0) {
      this.color[0] = red;
      this.color[1] = green;
      this.color[2] = blue;
    }
  }

  get_color() {
    return this.color;
  }

  get_red() {
    return this.color[0];
  }

  get_green() {
    return this.color[1];
  }

  get_blue() {
    return this.color[2];
  }

}
