export default class Ripple {
  constructor(canvas, context) {
    if (canvas && context) {
      this.canvas = canvas;
      this.context = context;
      // this.hue = Ripple.rand(25, 0, 1);
      this.hue = 50;
      this.active = false;
    } else {
      // console.error('Invalid constructor aguments for Ripple Class');
    }
  }
  static rand(max = 1, min = 0, _int) {
    const gen = min + (max - min) * Math.random();
    return (_int) ? Math.round(gen) : gen;
  }
  build(position, hue = this.hue) {
    this.hue = Ripple.rand(hue, hue / 2, 1);
    this.r = Math.random() + 0.1;
    this.opacity = 1;
    this.active = true;
    this.origin = position;

    this.context.beginPath();
    this.context.arc(position.x, position.y, this.r, 0, 2 * Math.PI, false);
    this.context.fillStyle = `hsla( ${this.hue},100%,50%,${this.opacity})`;
    this.context.fill();
  }
  draw(position = this.origin) {
    this.active = true;
    // this.hue -= 0.25;
    this.opacity -= 0.01;
    this.r = Math.abs(this.r + 7);

    this.context.beginPath();
    this.context.arc(position.x, position.y, this.r, 0, 2 * Math.PI, false);
    this.context.fillStyle = `hsla( ${this.hue},100%,50%,${this.opacity})`;
    this.context.fill();

    if (this.opacity < 0.01) {
      this.active = false;
    }
  }
}
