class AudioPad {
  constructor(
    config={
      elID:"audioPad",
      onmousedown: function() {},
      ontouchstart: function() {},
      onmouseup: function() {},
      onmouseleave: function() {},
      ontouchend: function() {},
      bindEventsTo: this
    }) {
    this.setupCanvas(config)
  }

  setupCanvas(config) {
    this.canvas = document.getElementById(config.elID)
    if(this.canvas === null) {
      console.error('No SynthPad Element Found')
      return false
    }
    this.setupEventListeners(config)
  }

  setupEventListeners(config) {
    // Disables scrolling on touch devices.
    document.body.addEventListener('touchmove', function(event) {
      event.preventDefault();
    }, false);

    document.addEventListener('mouseleave', config.onmouseleave.bind(config.bindEventsTo))

    this.canvas.addEventListener('touchstart', config.ontouchstart.bind(config.bindEventsTo))
    this.canvas.addEventListener('touchend', config.ontouchend.bind(config.bindEventsTo))
    this.canvas.addEventListener('mousedown', config.onmousedown.bind(config.bindEventsTo))
    this.canvas.addEventListener('mouseup', config.onmouseup.bind(config.bindEventsTo))
  }
}

export default AudioPad
