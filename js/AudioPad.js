class AudioPad {
  constructor(
    config={
      elID:"audioPad",
      startEvent: function() {},
      stopEvent: function() {},
      updateEvent: function() {},
      bindEventsTo: this,
      useTouchEvents: true
    }) {
      this.config = config
    this._setupCanvas()
  }

  // Link to canvas element
  _setupCanvas() {
    this.element = document.getElementById(this.config.elID)
    if(this.element === null) {
      console.error('No SynthPad Element Found')
      return false
    }
    this._setupEventListeners()
  }

  // Setup pad event listeners based on whether touch is supported
  _setupEventListeners() {
    if(this.config.useTouchEvents) {
      // Disables scrolling on touch devices.
      document.body.addEventListener('touchmove', (event) => {
        event.preventDefault()
      }, false)
      this.element.addEventListener('touchstart', this._startEvent.bind(this))
      this.element.addEventListener('touchend', this._stopEvent.bind(this))
    }
    else {
      document.addEventListener('mouseleave', this._stopEvent.bind(this))
      this.element.addEventListener('mousedown', this._startEvent.bind(this))
      this.element.addEventListener('mouseup', this._stopEvent.bind(this))
    }
  }

  // Internal start event - also triggers external event
  _startEvent(e) {
    if(this.config.useTouchEvents) {
      this.element.addEventListener('touchmove', this._updateEvent.bind(this))
    }
    else {
      this.element.addEventListener('mousemove', this._updateEvent.bind(this))
      this.element.addEventListener('mouseleave', this._stopEvent.bind(this))
    }
    let updateCallback = this.config.updateEvent.bind(this.config.bindEventsTo)
    let startCallback = this.config.startEvent.bind(this.config.bindEventsTo)
    let outputValues = this._calcOutputValues(event)
    startCallback()
    updateCallback(outputValues)
  }

  // Internal stop event - also triggers external event
  _stopEvent() {
    if(this.config.useTouchEvents) {
      this.element.removeEventListener('touchmove', this._updateEvent)
    }
    else {
      this.element.removeEventListener('mousemove', this._updateEvent)
      this.element.removeEventListener('mouseleave', this._stopEvent)
    }
    let stopCallback = this.config.stopEvent.bind(this.config.bindEventsTo)
    stopCallback()
  }

  // Internal update event - also triggers external event
  _updateEvent(event) {
    let outputValues = this._calcOutputValues(event)
    let updateCallback = this.config.updateEvent.bind(this.config.bindEventsTo)
    updateCallback(outputValues)
  }

  // Calculate output values (between 0 and 1) based on pad coordinates
  _calcOutputValues(event) {
    let xInput=0, yInput=0
    let width = this.element.offsetWidth
    let height = this.element.offsetHeight
    // If non-touch event
    if (event.type == 'mousedown' || event.type == 'mousemove') {
      xInput = event.x,
      yInput = event.y
    }
    // If touch event
    else if (event.type == 'touchstart' || event.type == 'touchmove') {
      let touch = event.touches[0]
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
