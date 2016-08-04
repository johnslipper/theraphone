import Ripple from './Ripple';

export default class RippleCanvas {
  constructor(
    element,
    config = {
      useTouchEvents: true,
      updateRipplePosition: false,
    }
  ) {
    if (typeof element === 'string') {
      this.canvas = document.getElementById(element);
      this.context = this.canvas.getContext('2d');
      this.canvasSize = {
        width: this.canvas.width = window.innerWidth,
        height: this.canvas.height = window.innerHeight,
      };
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
      this.useTouchEvents = config.useTouchEvents;
      this.updateRipplePosition = config.updateRipplePosition;
      this.initEvents();
    } else {
      // console.error('No canvas ID provided to RippleCanvas Class');
    }
  }
  static getOriginPosition(canvas, event) {
    let xInput = 0;
    let yInput = 0;
    // If non-touch event
    if (event.type === 'mousedown' || event.type === 'mousemove') {
      xInput = event.x;
      yInput = event.y;
    } else if (event.type === 'touchstart' || event.type === 'touchmove') {
      // If touch event
      const touch = event.touches[0];
      xInput = touch.pageX;
      yInput = touch.pageY;
    }
    return {
      x: xInput,
      y: yInput,
    };
  }
  static getPositionFloat(position) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: position.x - rect.x,
      y: position.y - rect.y,
    };
  }
  drawScene() {
    this.context.fillStyle = 'orange';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    const now = Date.now();
    const elapsed = now - this.then;
    const mod = elapsed % this.rippleFrequency;
    const position = this.updateRipplePosition ? this.originPos : undefined;

    for (let i = 0; i < this.ripples.length; i++) {
      if (this.ripples[i].active === true) {
        this.ripples[i].draw(position);
      }
    }

    if (mod >= 0 && mod < 15) {
      if (this.isActive) {
        if (this.ripples[this.currentRipple].active === false) {
          this.ripples[this.currentRipple].build(this.originPos);
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

    this.canvasSize.width = this.canvas.width = window.innerWidth;
    this.canvasSize.height = this.canvas.height = window.innerHeight;

    for (let i = 0; i < this.particleNum; i++) {
      this.ripples.push(new Ripple(this.canvas, this.context));
    }

    this.drawScene();
    // console.log(animation);
  }
  initEvents() {
    this.initCanvas();
    let eventTypeStrings = {};
    if (this.useTouchEvents) {
      eventTypeStrings = {
        start: 'touchstart',
        move: 'touchmove',
        end: 'touchend',
      };
    } else {
      eventTypeStrings = {
        start: 'mousedown',
        move: 'mousemove',
        end: 'mouseup',
      };
    }
    // addEventListener('resize', this.initCanvas, false);
    // canvas events
    this.canvas.addEventListener(eventTypeStrings.start, (evt) => {
      this.isActive = true;
      this.originPos = RippleCanvas.getOriginPosition(this.canvas, evt);
    }, false);
    this.canvas.addEventListener(eventTypeStrings.move, (evt) => {
      if (this.isActive) this.originPos = RippleCanvas.getOriginPosition(this.canvas, evt);
    }, false);
    this.canvas.addEventListener(eventTypeStrings.end, () => {
      this.isActive = false;
    }, false);

    addEventListener('resize', this.initCanvas, false);
  }
}
