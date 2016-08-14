export default class Ripple {
  constructor(canvas, context, config = {
    hue: 50,
    deviation: 50,
    opacity: 1,
  }) {
    if (canvas && context) {
      this.canvas = canvas;
      this.context = context;
      this.hue = config.hue;
      this.deviation = config.deviation;
      this.active = false;
      this.opacity = 1;
    } else {
      // console.error('Invalid constructor aguments for Ripple Class');
    }
  }
  static rand(max = 1, min = 0, _int) {
    const gen = min + (max - min) * Math.random();
    return (_int) ? Math.round(gen) : gen;
  }
  build(position, hue = this.hue, opacity = this.opacity) {
    // this.hue = Ripple.rand(hue + this.deviation / 2, hue + this.deviation, 1);
    this.hue = hue + this.deviation;
    if (this.hue < 0) this.hue = 0;
    if (this.hue > 360) this.hue = 360;
    this.r = Math.random() + 0.1;
    this.opacity = opacity;
    this.active = true;
    this.origin = position;

    this.context.beginPath();
    this.context.arc(position.x, position.y, this.r, 0, 2 * Math.PI, false);
    this.context.fillStyle = `hsla( ${this.hue},100%,50%,${this.opacity})`;
    this.context.fill();
  }
  draw(position = this.origin) {
    this.active = true;
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
