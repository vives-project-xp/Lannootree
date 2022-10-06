export default class Color {
  red;
  green;
  blue;

  constructor(red, green, blue) {
    this.red = (red <= 0) ? 1 : red;
    this.green = (green <= 0) ? 1 : green;
    this.blue = (blue <= 0) ? 1 : blue;

    this.red = (this.red >= 255) ? 255 : this.red;
    this.green = (this.green >= 255) ? 255 : this.green;
    this.blue = (this.blue >= 255) ? 255 : this.blue;
  }
}