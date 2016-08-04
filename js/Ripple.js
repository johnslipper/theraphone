export default class Ripple {
  constructor(context) {
    if (context) {
      this.context = context;
      // this.hue = Ripple.rand(25, 0, 1);
      this.hue = 25;
      this.active = false;
    } else {
      console.error('Invalid constructor aguments for Ripple Class');
    }
  }
  static rand(max = 1, min = 0, _int) {
    const gen = min + (max - min) * Math.random();
    return (_int) ? Math.round(gen) : gen;
  }
  build() {
    this.x = 0;
    this.y = 0;
    this.hue = Ripple.rand(50, 0, 1);
    this.r = Math.random() + 0.1;
    this.opacity = 1;
    this.active = true;

    this.context.beginPath();
    this.context.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
    this.context.fillStyle = `hsla( ${this.hue},100%,50%,${this.opacity})`;
    this.context.fill();
  }
  draw() {
    this.active = true;
    // this.hue -= 0.25;
    this.opacity -= 0.01;
    this.r = Math.abs(this.r + 7);

    this.context.beginPath();
    this.context.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
    this.context.fillStyle = `hsla( ${this.hue},100%,50%,${this.opacity})`;
    this.context.fill();

    if (this.opacity < 0.01) {
      this.active = false;
    }
  }
}
