class AudioPad {
  constructor(
    config = {
      elID: 'audioPad',
      startEvent() {},
      stopEvent() {},
      updateEvent() {},
      bindEventsTo: this,
      useTouchEvents: true,
    }) {
    this.config = config;
    this.setupCanvas();
  }

  // Link to canvas element
  setupCanvas() {
    this.element = document.getElementById(this.config.elID);
    if (this.element) this.setupEventListeners();
  }

  // Setup pad event listeners based on whether touch is supported
  setupEventListeners() {
    if (this.config.useTouchEvents) {
      // Disables scrolling on touch devices.
      document.body.addEventListener('touchmove', (event) => {
        event.preventDefault();
      }, false);
      this.element.addEventListener('touchstart', this.startEvent.bind(this));
      this.element.addEventListener('touchend', this.stopEvent.bind(this));
    } else {
      document.addEventListener('mouseleave', this.stopEvent.bind(this));
      this.element.addEventListener('mousedown', this.startEvent.bind(this));
      this.element.addEventListener('mouseup', this.stopEvent.bind(this));
    }
  }

  // Internal start event - also triggers external event
  startEvent() {
    if (this.config.useTouchEvents) {
      this.element.addEventListener('touchmove', this.updateEvent.bind(this));
    } else {
      this.element.addEventListener('mousemove', this.updateEvent.bind(this));
      this.element.addEventListener('mouseleave', this.stopEvent.bind(this));
    }
    const updateCallback = this.config.updateEvent.bind(this.config.bindEventsTo);
    const startCallback = this.config.startEvent.bind(this.config.bindEventsTo);
    const outputValues = this.calcOutputValues(event);
    startCallback();
    updateCallback(outputValues);
  }

  // Internal stop event - also triggers external event
  stopEvent() {
    if (this.config.useTouchEvents) {
      this.element.removeEventListener('touchmove', this.updateEvent);
    } else {
      this.element.removeEventListener('mousemove', this.updateEvent);
      this.element.removeEventListener('mouseleave', this.stopEvent);
    }
    const stopCallback = this.config.stopEvent.bind(this.config.bindEventsTo);
    stopCallback();
  }

  // Internal update event - also triggers external event
  updateEvent(event) {
    const outputValues = this.calcOutputValues(event);
    const updateCallback = this.config.updateEvent.bind(this.config.bindEventsTo);
    updateCallback(outputValues);
  }

  // Calculate output values (between 0 and 1) based on pad coordinates
  calcOutputValues(event) {
    let xInput = 0;
    let yInput = 0;
    const width = this.element.offsetWidth;
    const height = this.element.offsetHeight;
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
    const xOutput = ((xInput - this.element.offsetLeft) / width);
    const yOutput = ((yInput - this.element.offsetTop) / height);
    return {
      x: xOutput,
      y: yOutput,
    };
  }
}

export default AudioPad;
