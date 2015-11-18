class AudioPad {
  constructor(
    config={
      elID:"audioPad",
      startEvent: function() {},
      stopEvent: function() {},
      updateEvent: function() {},
      bindEventsTo: this
    }) {
      this.config = config
    this._setupCanvas()
  }

  _setupCanvas() {
    this.element = document.getElementById(this.config.elID)
    if(this.element === null) {
      console.error('No SynthPad Element Found')
      return false
    }
    this._setupEventListeners()
  }

  _setupEventListeners() {
    // Disables scrolling on touch devices.
    document.body.addEventListener('touchmove', function(event) {
      event.preventDefault()
    }, false)

    document.addEventListener('mouseleave', this._stopEvent.bind(this))

    this.element.addEventListener('touchstart', this._startEvent.bind(this))
    this.element.addEventListener('touchend', this._stopEvent.bind(this))

    this.element.addEventListener('mousedown', this._startEvent.bind(this))
    this.element.addEventListener('mouseup', this._stopEvent.bind(this))
  }

  _startEvent() {
    this.element.addEventListener('mousemove', this._updateEvent.bind(this))
    this.element.addEventListener('touchmove', this._updateEvent.bind(this))
    this.element.addEventListener('mouseout', this._stopEvent.bind(this))
    let callback = this.config.startEvent.bind(this.config.bindEventsTo)

    callback()
  }

  _stopEvent() {
    this.element.removeEventListener('mousemove', this._updateEvent)
    this.element.removeEventListener('touchmove', this._updateEvent)
    this.element.removeEventListener('mouseout', this._stopEvent)
    let callback = this.config.stopEvent.bind(this.config.bindEventsTo)
    callback()
  }

  _updateEvent(event) {
    let outputValues = this._calcOutputValues(event);
    let callback = this.config.updateEvent.bind(this.config.bindEventsTo)
    callback(outputValues)
  }

  _calcOutputValues(event) {
    let xInput=0, yInput=0;
    let width = this.element.offsetWidth;
    let height = this.element.offsetHeight;
    if (event.type == 'mousedown' || event.type == 'mousemove') {
      xInput = event.x,
      yInput = event.y
    }
    else if (event.type == 'touchstart' || event.type == 'touchmove') {
      let touch = event.touches[0];
      xInput = touch.pageX,
      yInput = touch.pageY
    }
    let xOutput = ((xInput - this.element.offsetLeft) / width)
    let yOutput = ((yInput - this.element.offsetTop) / height)
    return {
      x: xOutput,
      y: yOutput
    }
  }
}

export default AudioPad
