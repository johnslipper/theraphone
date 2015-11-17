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
    this.canvas = document.getElementById(this.config.elID)
    if(this.canvas === null) {
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

    this.canvas.addEventListener('touchstart', this._startEvent.bind(this))
    this.canvas.addEventListener('touchend', this._stopEvent.bind(this))

    this.canvas.addEventListener('mousedown', this._startEvent.bind(this))
    this.canvas.addEventListener('mouseup', this._stopEvent.bind(this))
  }

  _startEvent(e) {
    this.canvas.addEventListener('mousemove', this._updateEvent.bind(this))
    this.canvas.addEventListener('touchmove', this._updateEvent.bind(this))
    this.canvas.addEventListener('mouseout', this._stopEvent.bind(this))
    var callback = this.config.startEvent.bind(this.config.bindEventsTo)
    callback(e)
  }

  _stopEvent(e) {
    this.canvas.removeEventListener('mousemove', this._updateEvent)
    this.canvas.removeEventListener('touchmove', this._updateEvent)
    this.canvas.removeEventListener('mouseout', this._stopEvent)
    var callback = this.config.stopEvent.bind(this.config.bindEventsTo)
    callback(e)
  }

  _updateEvent(e) {
    console.log(e);
  }
}

export default AudioPad
