import Ripple from './Ripple';

export default class RippleCanvas {
  constructor(element) {
    if (typeof element === 'string') {
      this.canvas = document.getElementById(element);
      this.context = this.canvas.getContext('2d');

      this.ripples = [];
      this.originPos = {
        x: 0,
        y: 0,
      };
      this.isActive = false;
      this.then = null;
      this.animation = null;
      this.particleNum = 100;
      this.currentRipple = 0;
      this.rippleFrequency = 100;
      this.initEvents();
    } else {
      // console.error('No canvas ID provided to RippleCanvas Class');
    }
  }
  static getOriginPos(canvas, evt) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top,
    };
  }
  drawScene() {
    this.context.fillStyle = 'orange';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    const now = Date.now();
    const elapsed = now - this.then;
    const mod = elapsed % this.rippleFrequency;

    for (let i = 0; i < this.ripples.length; i++) {
      if (this.ripples[i].active === true) {
        this.ripples[i].draw();
      }
    }

    if (mod >= 0 && mod < 15) {
      if (this.isActive) {
        if (this.ripples[this.currentRipple].active === false) {
          this.ripples[this.currentRipple].build();
          if (this.currentRipple < this.ripples.length - 1) {
            this.currentRipple++;
          } else {
            this.currentRipple = 0;
          }
        }
      }
    }
    this.animation = requestAnimationFrame(this.drawScene.bind(this));
  }
  initCanvas() {
    if (this.ripples.length) {
      this.ripples = [];
      cancelAnimationFrame(this.animation.bind(this));
    }

    this.then = Date.now();

    // w = canvasEl.width = window.innerWidth;
    // h = canvasEl.height = window.innerHeight;

    for (let i = 0; i < this.particleNum; i++) {
      this.ripples.push(new Ripple(this.context));
    }

    this.drawScene();
    // console.log(animation);
  }
  initEvents() {
    this.initCanvas();
    // addEventListener('resize', this.initCanvas, false);
    // canvas events
    this.canvas.addEventListener('touchstart', (evt) => {
      this.isActive = true;
      this.originPos = RippleCanvas.getOriginPos(this.canvas, evt);
    }, false);
    this.canvas.addEventListener('touchmove', (evt) => {
      if (this.isActive) this.originPos = RippleCanvas.getOriginPos(this.canvas, evt);
    }, false);
    this.canvas.addEventListener('touchend', () => {
      this.isActive = false;
    }, false);
  }
}
