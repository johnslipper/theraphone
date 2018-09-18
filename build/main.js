(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var AudioPad = (function () {
  function AudioPad() {
    var config = arguments.length <= 0 || arguments[0] === undefined ? {
      elID: 'audioPad',
      startEvent: function startEvent() {},
      stopEvent: function stopEvent() {},
      updateEvent: function updateEvent() {},
      bindEventsTo: this,
      useTouchEvents: true
    } : arguments[0];

    _classCallCheck(this, AudioPad);

    this.config = config;
    this.setupCanvas();
  }

  // Link to canvas element

  _createClass(AudioPad, [{
    key: 'setupCanvas',
    value: function setupCanvas() {
      this.element = document.getElementById(this.config.elID);
      if (this.element) this.setupEventListeners();
    }

    // Setup pad event listeners based on whether touch is supported
  }, {
    key: 'setupEventListeners',
    value: function setupEventListeners() {
      if (this.config.useTouchEvents) {
        // Disables scrolling on touch devices.
        document.body.addEventListener('touchmove', function (event) {
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
  }, {
    key: 'startEvent',
    value: function startEvent() {
      if (this.config.useTouchEvents) {
        this.element.addEventListener('touchmove', this.updateEvent.bind(this));
      } else {
        this.element.addEventListener('mousemove', this.updateEvent.bind(this));
        this.element.addEventListener('mouseleave', this.stopEvent.bind(this));
      }
      var updateCallback = this.config.updateEvent.bind(this.config.bindEventsTo);
      var startCallback = this.config.startEvent.bind(this.config.bindEventsTo);
      var outputValues = this.calcOutputValues(event);
      startCallback();
      updateCallback(outputValues);
    }

    // Internal stop event - also triggers external event
  }, {
    key: 'stopEvent',
    value: function stopEvent() {
      if (this.config.useTouchEvents) {
        this.element.removeEventListener('touchmove', this.updateEvent);
      } else {
        this.element.removeEventListener('mousemove', this.updateEvent);
        this.element.removeEventListener('mouseleave', this.stopEvent);
      }
      var stopCallback = this.config.stopEvent.bind(this.config.bindEventsTo);
      stopCallback();
    }

    // Internal update event - also triggers external event
  }, {
    key: 'updateEvent',
    value: function updateEvent(event) {
      var outputValues = this.calcOutputValues(event);
      var updateCallback = this.config.updateEvent.bind(this.config.bindEventsTo);
      updateCallback(outputValues);
    }

    // Calculate output values (between 0 and 1) based on pad coordinates
  }, {
    key: 'calcOutputValues',
    value: function calcOutputValues(event) {
      var xInput = 0;
      var yInput = 0;
      var width = this.element.offsetWidth;
      var height = this.element.offsetHeight;
      // If non-touch event
      if (event.type === 'mousedown' || event.type === 'mousemove') {
        xInput = event.x;
        yInput = event.y;
      } else if (event.type === 'touchstart' || event.type === 'touchmove') {
        // If touch event
        var touch = event.touches[0];
        xInput = touch.pageX;
        yInput = touch.pageY;
      }
      var xOutput = (xInput - this.element.offsetLeft) / width;
      var yOutput = (yInput - this.element.offsetTop) / height;
      return {
        x: xOutput,
        y: yOutput
      };
    }
  }]);

  return AudioPad;
})();

exports['default'] = AudioPad;
module.exports = exports['default'];

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Ripple = (function () {
  function Ripple(canvas, context) {
    var config = arguments.length <= 2 || arguments[2] === undefined ? {
      hue: 50,
      deviation: 50,
      opacity: 1
    } : arguments[2];

    _classCallCheck(this, Ripple);

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

  _createClass(Ripple, [{
    key: "build",
    value: function build(position) {
      var hue = arguments.length <= 1 || arguments[1] === undefined ? this.hue : arguments[1];
      var opacity = arguments.length <= 2 || arguments[2] === undefined ? this.opacity : arguments[2];

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
      this.context.fillStyle = "hsla( " + this.hue + ",100%,50%," + this.opacity + ")";
      this.context.fill();
    }
  }, {
    key: "draw",
    value: function draw() {
      var position = arguments.length <= 0 || arguments[0] === undefined ? this.origin : arguments[0];

      this.active = true;
      this.opacity -= 0.01;
      this.r = Math.abs(this.r + 7);

      this.context.beginPath();
      this.context.arc(position.x, position.y, this.r, 0, 2 * Math.PI, false);
      this.context.fillStyle = "hsla( " + this.hue + ",100%,50%," + this.opacity + ")";
      this.context.fill();

      if (this.opacity < 0.01) {
        this.active = false;
      }
    }
  }], [{
    key: "rand",
    value: function rand(max, min, _int) {
      if (max === undefined) max = 1;
      if (min === undefined) min = 0;

      var gen = min + (max - min) * Math.random();
      return _int ? Math.round(gen) : gen;
    }
  }]);

  return Ripple;
})();

exports["default"] = Ripple;
module.exports = exports["default"];

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _Ripple = require('./Ripple');

var _Ripple2 = _interopRequireDefault(_Ripple);

var RippleCanvas = (function () {
  function RippleCanvas(element) {
    var config = arguments.length <= 1 || arguments[1] === undefined ? {
      useTouchEvents: true,
      updateRipplePosition: false
    } : arguments[1];

    _classCallCheck(this, RippleCanvas);

    if (typeof element === 'string') {
      this.canvas = document.getElementById(element);
      this.context = this.canvas.getContext('2d');
      this.canvasSize = {
        width: this.canvas.width = window.innerWidth,
        height: this.canvas.height = window.innerHeight
      };
      this.ripples = [];
      this.originPos = {
        x: 0,
        y: 0
      };
      this.isActive = false;
      this.then = null;
      this.animation = null;
      this.particleNum = 100;
      this.currentRipple = 0;
      this.rippleFrequency = 100;
      this.baseColor = {
        h: 50,
        s: 50,
        l: 50
      };
      this.rippleOpacity = 1;
      this.useTouchEvents = config.useTouchEvents;
      this.updateRipplePosition = config.updateRipplePosition;
      this.initEvents();
    } else {
      // console.error('No canvas ID provided to RippleCanvas Class');
    }
  }

  _createClass(RippleCanvas, [{
    key: 'updateBaseColor',
    value: function updateBaseColor() {
      var h = arguments.length <= 0 || arguments[0] === undefined ? this.baseColor.h : arguments[0];
      var s = arguments.length <= 1 || arguments[1] === undefined ? this.baseColor.s : arguments[1];
      var l = arguments.length <= 2 || arguments[2] === undefined ? this.baseColor.l : arguments[2];

      this.baseColor = {
        h: h, s: s, l: l
      };
    }
  }, {
    key: 'updatePostionValues',
    value: function updatePostionValues() {
      var position = arguments.length <= 0 || arguments[0] === undefined ? { x: 0, y: 0 } : arguments[0];

      this.rippleFrequency = position.x * 250 + 50;
      this.rippleOpacity = 1 - position.y;
    }
  }, {
    key: 'drawScene',
    value: function drawScene() {
      this.context.fillStyle = 'hsl(' + this.baseColor.h + ', ' + this.baseColor.s + '%, ' + this.baseColor.l + '%)';
      this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
      var now = Date.now();
      var elapsed = now - this.then;
      var mod = elapsed % this.rippleFrequency;
      var position = this.updateRipplePosition ? this.originPos : undefined;

      for (var i = 0; i < this.ripples.length; i++) {
        if (this.ripples[i].active === true) {
          this.ripples[i].draw(position);
        }
      }

      if (mod >= 0 && mod < 15) {
        if (this.isActive) {
          if (this.ripples[this.currentRipple].active === false) {
            this.ripples[this.currentRipple].build(this.originPos, this.baseColor.h, this.rippleOpacity);
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
  }, {
    key: 'initCanvas',
    value: function initCanvas() {
      if (this.ripples.length) {
        this.ripples = [];
        cancelAnimationFrame(this.animation.bind(this));
      }

      this.then = Date.now();

      this.canvasSize.width = this.canvas.width = window.innerWidth;
      this.canvasSize.height = this.canvas.height = window.innerHeight;

      for (var i = 0; i < this.particleNum; i++) {
        this.ripples.push(new _Ripple2['default'](this.canvas, this.context));
      }

      this.drawScene();
      // console.log(animation);
    }
  }, {
    key: 'initEvents',
    value: function initEvents() {
      var _this = this;

      this.initCanvas();
      var eventTypeStrings = {};
      if (this.useTouchEvents) {
        eventTypeStrings = {
          start: 'touchstart',
          move: 'touchmove',
          end: 'touchend'
        };
      } else {
        eventTypeStrings = {
          start: 'mousedown',
          move: 'mousemove',
          end: 'mouseup'
        };
      }
      // addEventListener('resize', this.initCanvas, false);
      // canvas events
      this.canvas.addEventListener(eventTypeStrings.start, function (evt) {
        _this.isActive = true;
        _this.originPos = RippleCanvas.getOriginPosition(_this.canvas, evt);
      }, false);
      this.canvas.addEventListener(eventTypeStrings.move, function (evt) {
        if (_this.isActive) _this.originPos = RippleCanvas.getOriginPosition(_this.canvas, evt);
      }, false);
      this.canvas.addEventListener(eventTypeStrings.end, function () {
        _this.isActive = false;
      }, false);

      addEventListener('resize', this.initCanvas, false);
    }
  }], [{
    key: 'getOriginPosition',
    value: function getOriginPosition(canvas, event) {
      var xInput = 0;
      var yInput = 0;
      // If non-touch event
      if (event.type === 'mousedown' || event.type === 'mousemove') {
        xInput = event.x;
        yInput = event.y;
      } else if (event.type === 'touchstart' || event.type === 'touchmove') {
        // If touch event
        var touch = event.touches[0];
        xInput = touch.pageX;
        yInput = touch.pageY;
      }
      return {
        x: xInput,
        y: yInput
      };
    }
  }, {
    key: 'getPositionFloat',
    value: function getPositionFloat(position) {
      var rect = this.canvas.getBoundingClientRect();
      return {
        x: position.x - rect.x,
        y: position.y - rect.y
      };
    }
  }]);

  return RippleCanvas;
})();

exports['default'] = RippleCanvas;
module.exports = exports['default'];

},{"./Ripple":2}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _iosSafeAudioContext = require('ios-safe-audio-context');

var _iosSafeAudioContext2 = _interopRequireDefault(_iosSafeAudioContext);

var TheraPhone = (function () {
  function TheraPhone() {
    var config = arguments.length <= 0 || arguments[0] === undefined ? {
      useReverb: true,
      useVibrato: true,
      reverbImpulseFile: 'audio/factory.hall.wav'
    } : arguments[0];

    _classCallCheck(this, TheraPhone);

    this.setupCoreAudio(config);
  }

  // Setup core components

  _createClass(TheraPhone, [{
    key: 'setupCoreAudio',
    value: function setupCoreAudio(config) {
      this.ctx = this.createContext();
      this.note = {
        gain: this.createGain(0)
      };
      this.master = {
        gain: this.createGain(1)
      };

      // Create reverb and connect to note
      if (config.useReverb) {
        this.createReverb(config.reverbImpulseFile);
        this.note.gain.connect(this.reverb.gain);
      } else {
        this.note.gain.connect(this.master.gain);
      }
      if (config.useVibrato) this.vibrato = this.createVibrato();
      this.master.gain.connect(this.ctx.destination);
    }

    // Create audio context
  }, {
    key: 'createContext',
    value: function createContext(sampleRate) {
      // window.AudioContext = window.AudioContext || window.webkitAudioContext
      // return new window.AudioContext()

      // iOS fixed audio context
      return (0, _iosSafeAudioContext2['default'])(sampleRate);
    }

    // Create default gain node
  }, {
    key: 'createGain',
    value: function createGain() {
      var vol = arguments.length <= 0 || arguments[0] === undefined ? 0.5 : arguments[0];

      var gain = this.ctx.createGain();
      gain.gain.value = vol;
      return gain;
    }

    // Create default oscillator node
  }, {
    key: 'createOsc',
    value: function createOsc() {
      var freq = arguments.length <= 0 || arguments[0] === undefined ? 440 : arguments[0];
      var type = arguments.length <= 1 || arguments[1] === undefined ? 'sine' : arguments[1];

      var osc = this.ctx.createOscillator();
      osc.type = type;
      osc.frequency.value = 440;
      return osc;
    }

    // Create covolver reverb
  }, {
    key: 'createReverb',
    value: function createReverb(reverbImpulseFile) {
      this.reverb = {
        convolver: this.ctx.createConvolver(),
        gain: this.createGain(0.5)
      };
      this.loadImpulse(reverbImpulseFile);
      this.reverb.convolver.connect(this.reverb.gain);
      this.reverb.gain.connect(this.master.gain);
    }

    // Load impluse file for reverb
  }, {
    key: 'loadImpulse',
    value: function loadImpulse(fileName) {
      var _this = this;

      var url = fileName;
      var request = new XMLHttpRequest();
      request.open('GET', url, true);
      request.responseType = 'arraybuffer';
      request.onload = function () {
        _this.ctx.decodeAudioData(request.response, function (buffer) {
          _this.reverb.convolver.buffer = buffer;
        }, function () {
          // console.log(e);
        });
      };
      // request.onerror = function (e) { console.log(e); };
      request.send();
    }

    // Create vibrato object
  }, {
    key: 'createVibrato',
    value: function createVibrato() {
      return {
        range: 150,
        interval: 1,
        increment: 10,
        currentVal: 0,
        direction: 1,
        update: this.updateNoteDetune
      };
    }

    // Util function to oscillate between range of values
  }, {
    key: 'oscillateValues',
    value: function oscillateValues(params) {
      var _this2 = this;

      if (params) {
        var obj = params;
        if (obj.direction === 1) {
          // Forwards!
          if (obj.currentVal < obj.range) {
            obj.currentVal = obj.currentVal + obj.increment;
          } else {
            obj.direction = 0; // change direction
          }
        } else if (obj.direction === 0) {
            // Backwards!
            if (obj.currentVal > 0) {
              obj.currentVal = obj.currentVal - obj.increment;
            } else {
              obj.direction = 1; // change direction
            }
          }
        var updateFunction = params.update.bind(this);
        updateFunction(params.currentVal);
        setTimeout(function () {
          _this2.oscillateValues(params);
        }, params.interval);
      }
    }

    // Start web audio chain (important: Note gain is silent at this point)
  }, {
    key: 'noteOn',
    value: function noteOn() {
      if (this.note.osc) return; // Note already playing
      // console.info('Note On!');
      this.note.osc = this.createOsc();
      this.note.osc.connect(this.note.gain);
      if (this.reverb) this.note.gain.connect(this.reverb.convolver);

      // Bit of a hacky vibrato, hopefully work out a web audio equivalent
      if (this.vibrato) this.oscillateValues(this.vibrato);
      this.note.gain.connect(this.master.gain);
      this.note.osc.start(0);
    }

    // Stop audio chain (will destroy the one-use note oscillator)
  }, {
    key: 'noteOff',
    value: function noteOff() {
      // console.info('Note Off');
      if (this.note.osc) {
        this.note.osc.stop(0);
        this.note.osc = null;
        clearInterval(this.vibrato.intervalFunction);
      }
    }

    // Mute master gain
  }, {
    key: 'mute',
    value: function mute() {
      this.master.gain.gain.value = 0;
    }

    // Unmute master gain
  }, {
    key: 'unMute',
    value: function unMute() {
      this.master.gain.gain.value = 1;
    }

    // Update pitch of main note oscillator
  }, {
    key: 'updateNotePitch',
    value: function updateNotePitch(freq) {
      if (this.note.osc) this.note.osc.frequency.value = freq;
    }

    // Update main note oscillator detune value
  }, {
    key: 'updateNoteDetune',
    value: function updateNoteDetune(cents) {
      if (this.note.osc) this.note.osc.detune.value = cents;
    }

    // Update main note gain
  }, {
    key: 'updateVolume',
    value: function updateVolume(vol) {
      if (this.note.gain && vol >= 0 && vol < 1) this.note.gain.gain.value = vol;
    }

    // Update range of note vibrato
  }, {
    key: 'updateVibratoRange',
    value: function updateVibratoRange() {
      var range = arguments.length <= 0 || arguments[0] === undefined ? 150 : arguments[0];

      if (this.vibrato) this.vibrato.range = range;
    }

    // Update increment used in vibrato oscillator function
  }, {
    key: 'updateVibratoIncrement',
    value: function updateVibratoIncrement() {
      var increment = arguments.length <= 0 || arguments[0] === undefined ? 10 : arguments[0];

      if (this.vibrato) this.vibrato.increment = increment;
    }

    // Start playback external callback event
  }, {
    key: 'startEvent',
    value: function startEvent() {
      // console.info('Start event');
      document.body.classList.add('playing'); // Add body CSS class
      // this.updateVolume(1) // Turn up main note gain
    }

    // Stop playback external callback event
  }, {
    key: 'stopEvent',
    value: function stopEvent() {
      // console.info('Stop event');
      document.body.classList.remove('playing'); // Remove body CSS class
      this.updateVolume(0); // Silence main note gain
    }

    // Update values external callback event (dynamically update class values)
  }, {
    key: 'updateEvent',
    value: function updateEvent() {
      var values = arguments.length <= 0 || arguments[0] === undefined ? { x: 0, y: 0 } : arguments[0];

      var volume = 1 - values.y;
      var range = values.x * 250;
      var increment = values.x * 10 + 1;
      if (values.x >= 0) this.updateVibratoIncrement(increment);
      if (values.x >= 0) this.updateVibratoRange(range);
      if (values.y >= 0) this.updateVolume(volume);
    }
  }]);

  return TheraPhone;
})();

exports['default'] = TheraPhone;
module.exports = exports['default'];

},{"ios-safe-audio-context":22}],5:[function(require,module,exports){
// Import dependencies
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _TheraPhone = require('./TheraPhone');

var _TheraPhone2 = _interopRequireDefault(_TheraPhone);

var _AudioPad = require('./AudioPad');

var _AudioPad2 = _interopRequireDefault(_AudioPad);

// import { displayMotionValues } from './debug';

var _RippleCanvas = require('./RippleCanvas');

var _RippleCanvas2 = _interopRequireDefault(_RippleCanvas);

// Modernizr require
require('browsernizr/test/touchevents');
var Modernizr = require('browsernizr');

// On DOM Ready
document.addEventListener('DOMContentLoaded', function () {
  // Setup class instances
  var theraPhone = new _TheraPhone2['default']();
  var rippleCanvas = new _RippleCanvas2['default']('audioPad', {
    useTouchEvents: Modernizr.touchevents,
    updateRipplePosition: true
  });
  function updateEvent(values) {
    theraPhone.updateEvent(values);
    rippleCanvas.updatePostionValues(values);
  }

  var audioPad = new _AudioPad2['default']({
    elID: 'audioPad',
    useTouchEvents: Modernizr.touchevents,
    startEvent: theraPhone.startEvent,
    stopEvent: theraPhone.stopEvent,
    updateEvent: updateEvent,
    bindEventsTo: theraPhone
  });

  // Store elements
  var intro = document.getElementById('intro');
  var closeIntro = document.getElementById('closeIntro');
  // const muteButton = document.getElementById('mute');

  // Intro Screen
  function hideIntro() {
    intro.style.display = 'none';
  }

  closeIntro.addEventListener('click', hideIntro); // Hide intro window on button click

  // iOS Fix (use intro closing button to allow audio to run)
  closeIntro.addEventListener('click', theraPhone.noteOn.bind(theraPhone));

  // Mute button
  // muteButton.addEventListener('touchstart', theraPhone.mute.bind(theraPhone));
  // muteButton.addEventListener('touchend', theraPhone.unMute.bind(theraPhone));

  // Setup Accelerometer
  if (window.DeviceMotionEvent) {
    window.ondevicemotion = function (e) {
      // displayMotionValues(e) // Display values in debug div
      var hue = parseInt((e.accelerationIncludingGravity.y + 10) * 18, 0);
      rippleCanvas.updateBaseColor(hue);
      // Pitch adjust
      var yFreq = e.accelerationIncludingGravity.y + 10; // Make value 0 - 20
      if (yFreq > 0) {
        theraPhone.updateNotePitch(yFreq * 30 + 200);
      }
    };
  } else {
    // TODO: No Accelerometer detected
  }
});

},{"./AudioPad":1,"./RippleCanvas":3,"./TheraPhone":4,"browsernizr":6,"browsernizr/test/touchevents":21}],6:[function(require,module,exports){
var Modernizr = require('./lib/Modernizr'),
    ModernizrProto = require('./lib/ModernizrProto'),
    classes = require('./lib/classes'),
    testRunner = require('./lib/testRunner'),
    setClasses = require('./lib/setClasses');

// Run each test
testRunner();

// Remove the "no-js" class if it exists
setClasses(classes);

delete ModernizrProto.addTest;
delete ModernizrProto.addAsyncTest;

// Run the things that are supposed to run after the tests
for (var i = 0; i < Modernizr._q.length; i++) {
  Modernizr._q[i]();
}

module.exports = Modernizr;

},{"./lib/Modernizr":7,"./lib/ModernizrProto":8,"./lib/classes":9,"./lib/setClasses":17,"./lib/testRunner":18}],7:[function(require,module,exports){
var ModernizrProto = require('./ModernizrProto.js');
  // Fake some of Object.create so we can force non test results to be non "own" properties.
  var Modernizr = function() {};
  Modernizr.prototype = ModernizrProto;

  // Leak modernizr globally when you `require` it rather than force it here.
  // Overwrite name so constructor name is nicer :D
  Modernizr = new Modernizr();

  module.exports = Modernizr;


},{"./ModernizrProto.js":8}],8:[function(require,module,exports){
var tests = require('./tests.js');
  /**
   *
   * ModernizrProto is the constructor for Modernizr
   *
   * @class
   * @access public
   */

  var ModernizrProto = {
    // The current version, dummy
    _version: '3.2.0 (browsernizr 2.0.1)',

    // Any settings that don't work as separate modules
    // can go in here as configuration.
    _config: {
      'classPrefix' : '',
      'enableClasses' : true,
      'enableJSClass' : true,
      'usePrefixes' : true
    },

    // Queue of tests
    _q: [],

    // Stub these for people who are listening
    on: function(test, cb) {
      // I don't really think people should do this, but we can
      // safe guard it a bit.
      // -- NOTE:: this gets WAY overridden in src/addTest for actual async tests.
      // This is in case people listen to synchronous tests. I would leave it out,
      // but the code to *disallow* sync tests in the real version of this
      // function is actually larger than this.
      var self = this;
      setTimeout(function() {
        cb(self[test]);
      }, 0);
    },

    addTest: function(name, fn, options) {
      tests.push({name : name, fn : fn, options : options});
    },

    addAsyncTest: function(fn) {
      tests.push({name : null, fn : fn});
    }
  };

  module.exports = ModernizrProto;


},{"./tests.js":20}],9:[function(require,module,exports){

  var classes = [];
  module.exports = classes;


},{}],10:[function(require,module,exports){
var isSVG = require('./isSVG.js');
  /**
   * createElement is a convenience wrapper around document.createElement. Since we
   * use createElement all over the place, this allows for (slightly) smaller code
   * as well as abstracting away issues with creating elements in contexts other than
   * HTML documents (e.g. SVG documents).
   *
   * @access private
   * @function createElement
   * @returns {HTMLElement|SVGElement} An HTML or SVG element
   */

  function createElement() {
    if (typeof document.createElement !== 'function') {
      // This is the case in IE7, where the type of createElement is "object".
      // For this reason, we cannot call apply() as Object is not a Function.
      return document.createElement(arguments[0]);
    } else if (isSVG) {
      return document.createElementNS.call(document, 'http://www.w3.org/2000/svg', arguments[0]);
    } else {
      return document.createElement.apply(document, arguments);
    }
  }

  module.exports = createElement;


},{"./isSVG.js":15}],11:[function(require,module,exports){

  /**
   * docElement is a convenience wrapper to grab the root element of the document
   *
   * @access private
   * @returns {HTMLElement|SVGElement} The root element of the document
   */

  var docElement = document.documentElement;
  module.exports = docElement;


},{}],12:[function(require,module,exports){
var createElement = require('./createElement.js');
var isSVG = require('./isSVG.js');
  /**
   * getBody returns the body of a document, or an element that can stand in for
   * the body if a real body does not exist
   *
   * @access private
   * @function getBody
   * @returns {HTMLElement|SVGElement} Returns the real body of a document, or an
   * artificially created element that stands in for the body
   */

  function getBody() {
    // After page load injecting a fake body doesn't work so check if body exists
    var body = document.body;

    if (!body) {
      // Can't use the real body create a fake one.
      body = createElement(isSVG ? 'svg' : 'body');
      body.fake = true;
    }

    return body;
  }

  module.exports = getBody;


},{"./createElement.js":10,"./isSVG.js":15}],13:[function(require,module,exports){
var ModernizrProto = require('./ModernizrProto.js');
var docElement = require('./docElement.js');
var createElement = require('./createElement.js');
var getBody = require('./getBody.js');
  /**
   * injectElementWithStyles injects an element with style element and some CSS rules
   *
   * @access private
   * @function injectElementWithStyles
   * @param {string} rule - String representing a css rule
   * @param {function} callback - A function that is used to test the injected element
   * @param {number} [nodes] - An integer representing the number of additional nodes you want injected
   * @param {string[]} [testnames] - An array of strings that are used as ids for the additional nodes
   * @returns {boolean}
   */

  function injectElementWithStyles(rule, callback, nodes, testnames) {
    var mod = 'modernizr';
    var style;
    var ret;
    var node;
    var docOverflow;
    var div = createElement('div');
    var body = getBody();

    if (parseInt(nodes, 10)) {
      // In order not to give false positives we create a node for each test
      // This also allows the method to scale for unspecified uses
      while (nodes--) {
        node = createElement('div');
        node.id = testnames ? testnames[nodes] : mod + (nodes + 1);
        div.appendChild(node);
      }
    }

    style = createElement('style');
    style.type = 'text/css';
    style.id = 's' + mod;

    // IE6 will false positive on some tests due to the style element inside the test div somehow interfering offsetHeight, so insert it into body or fakebody.
    // Opera will act all quirky when injecting elements in documentElement when page is served as xml, needs fakebody too. #270
    (!body.fake ? div : body).appendChild(style);
    body.appendChild(div);

    if (style.styleSheet) {
      style.styleSheet.cssText = rule;
    } else {
      style.appendChild(document.createTextNode(rule));
    }
    div.id = mod;

    if (body.fake) {
      //avoid crashing IE8, if background image is used
      body.style.background = '';
      //Safari 5.13/5.1.4 OSX stops loading if ::-webkit-scrollbar is used and scrollbars are visible
      body.style.overflow = 'hidden';
      docOverflow = docElement.style.overflow;
      docElement.style.overflow = 'hidden';
      docElement.appendChild(body);
    }

    ret = callback(div, rule);
    // If this is done after page load we don't want to remove the body so check if body exists
    if (body.fake) {
      body.parentNode.removeChild(body);
      docElement.style.overflow = docOverflow;
      // Trigger layout so kinetic scrolling isn't disabled in iOS6+
      docElement.offsetHeight;
    } else {
      div.parentNode.removeChild(div);
    }

    return !!ret;

  }

  module.exports = injectElementWithStyles;


},{"./ModernizrProto.js":8,"./createElement.js":10,"./docElement.js":11,"./getBody.js":12}],14:[function(require,module,exports){

  /**
   * is returns a boolean if the typeof an obj is exactly type.
   *
   * @access private
   * @function is
   * @param {*} obj - A thing we want to check the type of
   * @param {string} type - A string to compare the typeof against
   * @returns {boolean}
   */

  function is(obj, type) {
    return typeof obj === type;
  }
  module.exports = is;


},{}],15:[function(require,module,exports){
var docElement = require('./docElement.js');
  /**
   * A convenience helper to check if the document we are running in is an SVG document
   *
   * @access private
   * @returns {boolean}
   */

  var isSVG = docElement.nodeName.toLowerCase() === 'svg';
  module.exports = isSVG;


},{"./docElement.js":11}],16:[function(require,module,exports){
var ModernizrProto = require('./ModernizrProto.js');
  /**
   * List of property values to set for css tests. See ticket #21
   * http://git.io/vUGl4
   *
   * @memberof Modernizr
   * @name Modernizr._prefixes
   * @optionName Modernizr._prefixes
   * @optionProp prefixes
   * @access public
   * @example
   *
   * Modernizr._prefixes is the internal list of prefixes that we test against
   * inside of things like [prefixed](#modernizr-prefixed) and [prefixedCSS](#-code-modernizr-prefixedcss). It is simply
   * an array of kebab-case vendor prefixes you can use within your code.
   *
   * Some common use cases include
   *
   * Generating all possible prefixed version of a CSS property
   * ```js
   * var rule = Modernizr._prefixes.join('transform: rotate(20deg); ');
   *
   * rule === 'transform: rotate(20deg); webkit-transform: rotate(20deg); moz-transform: rotate(20deg); o-transform: rotate(20deg); ms-transform: rotate(20deg);'
   * ```
   *
   * Generating all possible prefixed version of a CSS value
   * ```js
   * rule = 'display:' +  Modernizr._prefixes.join('flex; display:') + 'flex';
   *
   * rule === 'display:flex; display:-webkit-flex; display:-moz-flex; display:-o-flex; display:-ms-flex; display:flex'
   * ```
   */

  var prefixes = (ModernizrProto._config.usePrefixes ? ' -webkit- -moz- -o- -ms- '.split(' ') : []);

  // expose these for the plugin API. Look in the source for how to join() them against your input
  ModernizrProto._prefixes = prefixes;

  module.exports = prefixes;


},{"./ModernizrProto.js":8}],17:[function(require,module,exports){
var Modernizr = require('./Modernizr.js');
var docElement = require('./docElement.js');
var isSVG = require('./isSVG.js');
  /**
   * setClasses takes an array of class names and adds them to the root element
   *
   * @access private
   * @function setClasses
   * @param {string[]} classes - Array of class names
   */

  // Pass in an and array of class names, e.g.:
  //  ['no-webp', 'borderradius', ...]
  function setClasses(classes) {
    var className = docElement.className;
    var classPrefix = Modernizr._config.classPrefix || '';

    if (isSVG) {
      className = className.baseVal;
    }

    // Change `no-js` to `js` (independently of the `enableClasses` option)
    // Handle classPrefix on this too
    if (Modernizr._config.enableJSClass) {
      var reJS = new RegExp('(^|\\s)' + classPrefix + 'no-js(\\s|$)');
      className = className.replace(reJS, '$1' + classPrefix + 'js$2');
    }

    if (Modernizr._config.enableClasses) {
      // Add the new classes
      className += ' ' + classPrefix + classes.join(' ' + classPrefix);
      isSVG ? docElement.className.baseVal = className : docElement.className = className;
    }

  }

  module.exports = setClasses;


},{"./Modernizr.js":7,"./docElement.js":11,"./isSVG.js":15}],18:[function(require,module,exports){
var tests = require('./tests.js');
var Modernizr = require('./Modernizr.js');
var classes = require('./classes.js');
var is = require('./is.js');
  /**
   * Run through all tests and detect their support in the current UA.
   *
   * @access private
   */

  function testRunner() {
    var featureNames;
    var feature;
    var aliasIdx;
    var result;
    var nameIdx;
    var featureName;
    var featureNameSplit;

    for (var featureIdx in tests) {
      if (tests.hasOwnProperty(featureIdx)) {
        featureNames = [];
        feature = tests[featureIdx];
        // run the test, throw the return value into the Modernizr,
        // then based on that boolean, define an appropriate className
        // and push it into an array of classes we'll join later.
        //
        // If there is no name, it's an 'async' test that is run,
        // but not directly added to the object. That should
        // be done with a post-run addTest call.
        if (feature.name) {
          featureNames.push(feature.name.toLowerCase());

          if (feature.options && feature.options.aliases && feature.options.aliases.length) {
            // Add all the aliases into the names list
            for (aliasIdx = 0; aliasIdx < feature.options.aliases.length; aliasIdx++) {
              featureNames.push(feature.options.aliases[aliasIdx].toLowerCase());
            }
          }
        }

        // Run the test, or use the raw value if it's not a function
        result = is(feature.fn, 'function') ? feature.fn() : feature.fn;


        // Set each of the names on the Modernizr object
        for (nameIdx = 0; nameIdx < featureNames.length; nameIdx++) {
          featureName = featureNames[nameIdx];
          // Support dot properties as sub tests. We don't do checking to make sure
          // that the implied parent tests have been added. You must call them in
          // order (either in the test, or make the parent test a dependency).
          //
          // Cap it to TWO to make the logic simple and because who needs that kind of subtesting
          // hashtag famous last words
          featureNameSplit = featureName.split('.');

          if (featureNameSplit.length === 1) {
            Modernizr[featureNameSplit[0]] = result;
          } else {
            // cast to a Boolean, if not one already
            /* jshint -W053 */
            if (Modernizr[featureNameSplit[0]] && !(Modernizr[featureNameSplit[0]] instanceof Boolean)) {
              Modernizr[featureNameSplit[0]] = new Boolean(Modernizr[featureNameSplit[0]]);
            }

            Modernizr[featureNameSplit[0]][featureNameSplit[1]] = result;
          }

          classes.push((result ? '' : 'no-') + featureNameSplit.join('-'));
        }
      }
    }
  }
  module.exports = testRunner;


},{"./Modernizr.js":7,"./classes.js":9,"./is.js":14,"./tests.js":20}],19:[function(require,module,exports){
var ModernizrProto = require('./ModernizrProto.js');
var injectElementWithStyles = require('./injectElementWithStyles.js');
  /**
   * testStyles injects an element with style element and some CSS rules
   *
   * @memberof Modernizr
   * @name Modernizr.testStyles
   * @optionName Modernizr.testStyles()
   * @optionProp testStyles
   * @access public
   * @function testStyles
   * @param {string} rule - String representing a css rule
   * @param {function} callback - A function that is used to test the injected element
   * @param {number} [nodes] - An integer representing the number of additional nodes you want injected
   * @param {string[]} [testnames] - An array of strings that are used as ids for the additional nodes
   * @returns {boolean}
   * @example
   *
   * `Modernizr.testStyles` takes a CSS rule and injects it onto the current page
   * along with (possibly multiple) DOM elements. This lets you check for features
   * that can not be detected by simply checking the [IDL](https://developer.mozilla.org/en-US/docs/Mozilla/Developer_guide/Interface_development_guide/IDL_interface_rules).
   *
   * ```js
   * Modernizr.testStyles('#modernizr { width: 9px; color: papayawhip; }', function(elem, rule) {
   *   // elem is the first DOM node in the page (by default #modernizr)
   *   // rule is the first argument you supplied - the CSS rule in string form
   *
   *   addTest('widthworks', elem.style.width === '9px')
   * });
   * ```
   *
   * If your test requires multiple nodes, you can include a third argument
   * indicating how many additional div elements to include on the page. The
   * additional nodes are injected as children of the `elem` that is returned as
   * the first argument to the callback.
   *
   * ```js
   * Modernizr.testStyles('#modernizr {width: 1px}; #modernizr2 {width: 2px}', function(elem) {
   *   document.getElementById('modernizr').style.width === '1px'; // true
   *   document.getElementById('modernizr2').style.width === '2px'; // true
   *   elem.firstChild === document.getElementById('modernizr2'); // true
   * }, 1);
   * ```
   *
   * By default, all of the additional elements have an ID of `modernizr[n]`, where
   * `n` is its index (e.g. the first additional, second overall is `#modernizr2`,
   * the second additional is `#modernizr3`, etc.).
   * If you want to have more meaningful IDs for your function, you can provide
   * them as the fourth argument, as an array of strings
   *
   * ```js
   * Modernizr.testStyles('#foo {width: 10px}; #bar {height: 20px}', function(elem) {
   *   elem.firstChild === document.getElementById('foo'); // true
   *   elem.lastChild === document.getElementById('bar'); // true
   * }, 2, ['foo', 'bar']);
   * ```
   *
   */

  var testStyles = ModernizrProto.testStyles = injectElementWithStyles;
  module.exports = testStyles;


},{"./ModernizrProto.js":8,"./injectElementWithStyles.js":13}],20:[function(require,module,exports){

  var tests = [];
  module.exports = tests;


},{}],21:[function(require,module,exports){
/*!
{
  "name": "Touch Events",
  "property": "touchevents",
  "caniuse" : "touch",
  "tags": ["media", "attribute"],
  "notes": [{
    "name": "Touch Events spec",
    "href": "http://www.w3.org/TR/2013/WD-touch-events-20130124/"
  }],
  "warnings": [
    "Indicates if the browser supports the Touch Events spec, and does not necessarily reflect a touchscreen device"
  ],
  "knownBugs": [
    "False-positive on some configurations of Nokia N900",
    "False-positive on some BlackBerry 6.0 builds – https://github.com/Modernizr/Modernizr/issues/372#issuecomment-3112695"
  ]
}
!*/
/* DOC
Indicates if the browser supports the W3C Touch Events API.

This *does not* necessarily reflect a touchscreen device:

* Older touchscreen devices only emulate mouse events
* Modern IE touch devices implement the Pointer Events API instead: use `Modernizr.pointerevents` to detect support for that
* Some browsers & OS setups may enable touch APIs when no touchscreen is connected
* Future browsers may implement other event models for touch interactions

See this article: [You Can't Detect A Touchscreen](http://www.stucox.com/blog/you-cant-detect-a-touchscreen/).

It's recommended to bind both mouse and touch/pointer events simultaneously – see [this HTML5 Rocks tutorial](http://www.html5rocks.com/en/mobile/touchandmouse/).

This test will also return `true` for Firefox 4 Multitouch support.
*/
var Modernizr = require('./../lib/Modernizr.js');
var prefixes = require('./../lib/prefixes.js');
var testStyles = require('./../lib/testStyles.js');
  // Chrome (desktop) used to lie about its support on this, but that has since been rectified: http://crbug.com/36415
  Modernizr.addTest('touchevents', function() {
    var bool;
    if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
      bool = true;
    } else {
      var query = ['@media (', prefixes.join('touch-enabled),('), 'heartz', ')', '{#modernizr{top:9px;position:absolute}}'].join('');
      testStyles(query, function(node) {
        bool = node.offsetTop === 9;
      });
    }
    return bool;
  });


},{"./../lib/Modernizr.js":7,"./../lib/prefixes.js":16,"./../lib/testStyles.js":19}],22:[function(require,module,exports){
module.exports = createAudioContext
function createAudioContext (desiredSampleRate) {
  var AudioCtor = window.AudioContext || window.webkitAudioContext

  desiredSampleRate = typeof desiredSampleRate === 'number'
    ? desiredSampleRate
    : 44100
  var context = new AudioCtor()

  // Check if hack is necessary. Only occurs in iOS6+ devices
  // and only when you first boot the iPhone, or play a audio/video
  // with a different sample rate
  if (/(iPhone|iPad)/i.test(navigator.userAgent) &&
      context.sampleRate !== desiredSampleRate) {
    var buffer = context.createBuffer(1, 1, desiredSampleRate)
    var dummy = context.createBufferSource()
    dummy.buffer = buffer
    dummy.connect(context.destination)
    dummy.start(0)
    dummy.disconnect()
    
    context.close() // dispose old context
    context = new AudioCtor()
  }

  return context
}

},{}]},{},[5])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvam9obi9EZXZlbG9wZXIvdGhlcmFwaG9uZS9qcy9BdWRpb1BhZC5qcyIsIi9Vc2Vycy9qb2huL0RldmVsb3Blci90aGVyYXBob25lL2pzL1JpcHBsZS5qcyIsIi9Vc2Vycy9qb2huL0RldmVsb3Blci90aGVyYXBob25lL2pzL1JpcHBsZUNhbnZhcy5qcyIsIi9Vc2Vycy9qb2huL0RldmVsb3Blci90aGVyYXBob25lL2pzL1RoZXJhUGhvbmUuanMiLCIvVXNlcnMvam9obi9EZXZlbG9wZXIvdGhlcmFwaG9uZS9qcy9tYWluLmpzIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJuaXpyL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJuaXpyL2xpYi9Nb2Rlcm5penIuanMiLCJub2RlX21vZHVsZXMvYnJvd3Nlcm5penIvbGliL01vZGVybml6clByb3RvLmpzIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJuaXpyL2xpYi9jbGFzc2VzLmpzIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJuaXpyL2xpYi9jcmVhdGVFbGVtZW50LmpzIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJuaXpyL2xpYi9kb2NFbGVtZW50LmpzIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJuaXpyL2xpYi9nZXRCb2R5LmpzIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJuaXpyL2xpYi9pbmplY3RFbGVtZW50V2l0aFN0eWxlcy5qcyIsIm5vZGVfbW9kdWxlcy9icm93c2Vybml6ci9saWIvaXMuanMiLCJub2RlX21vZHVsZXMvYnJvd3Nlcm5penIvbGliL2lzU1ZHLmpzIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJuaXpyL2xpYi9wcmVmaXhlcy5qcyIsIm5vZGVfbW9kdWxlcy9icm93c2Vybml6ci9saWIvc2V0Q2xhc3Nlcy5qcyIsIm5vZGVfbW9kdWxlcy9icm93c2Vybml6ci9saWIvdGVzdFJ1bm5lci5qcyIsIm5vZGVfbW9kdWxlcy9icm93c2Vybml6ci9saWIvdGVzdFN0eWxlcy5qcyIsIm5vZGVfbW9kdWxlcy9icm93c2Vybml6ci9saWIvdGVzdHMuanMiLCJub2RlX21vZHVsZXMvYnJvd3Nlcm5penIvdGVzdC90b3VjaGV2ZW50cy5qcyIsIm5vZGVfbW9kdWxlcy9pb3Mtc2FmZS1hdWRpby1jb250ZXh0L2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7OztJQ0FNLFFBQVE7QUFDRCxXQURQLFFBQVEsR0FTUDtRQVBILE1BQU0seURBQUc7QUFDUCxVQUFJLEVBQUUsVUFBVTtBQUNoQixnQkFBVSxFQUFBLHNCQUFHLEVBQUU7QUFDZixlQUFTLEVBQUEscUJBQUcsRUFBRTtBQUNkLGlCQUFXLEVBQUEsdUJBQUcsRUFBRTtBQUNoQixrQkFBWSxFQUFFLElBQUk7QUFDbEIsb0JBQWMsRUFBRSxJQUFJO0tBQ3JCOzswQkFUQyxRQUFROztBQVVWLFFBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0FBQ3JCLFFBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztHQUNwQjs7OztlQVpHLFFBQVE7O1dBZUQsdUJBQUc7QUFDWixVQUFJLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN6RCxVQUFJLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7S0FDOUM7Ozs7O1dBR2tCLCtCQUFHO0FBQ3BCLFVBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLEVBQUU7O0FBRTlCLGdCQUFRLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFdBQVcsRUFBRSxVQUFDLEtBQUssRUFBSztBQUNyRCxlQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7U0FDeEIsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNWLFlBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsWUFB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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiY2xhc3MgQXVkaW9QYWQge1xuICBjb25zdHJ1Y3RvcihcbiAgICBjb25maWcgPSB7XG4gICAgICBlbElEOiAnYXVkaW9QYWQnLFxuICAgICAgc3RhcnRFdmVudCgpIHt9LFxuICAgICAgc3RvcEV2ZW50KCkge30sXG4gICAgICB1cGRhdGVFdmVudCgpIHt9LFxuICAgICAgYmluZEV2ZW50c1RvOiB0aGlzLFxuICAgICAgdXNlVG91Y2hFdmVudHM6IHRydWUsXG4gICAgfSkge1xuICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuICAgIHRoaXMuc2V0dXBDYW52YXMoKTtcbiAgfVxuXG4gIC8vIExpbmsgdG8gY2FudmFzIGVsZW1lbnRcbiAgc2V0dXBDYW52YXMoKSB7XG4gICAgdGhpcy5lbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5jb25maWcuZWxJRCk7XG4gICAgaWYgKHRoaXMuZWxlbWVudCkgdGhpcy5zZXR1cEV2ZW50TGlzdGVuZXJzKCk7XG4gIH1cblxuICAvLyBTZXR1cCBwYWQgZXZlbnQgbGlzdGVuZXJzIGJhc2VkIG9uIHdoZXRoZXIgdG91Y2ggaXMgc3VwcG9ydGVkXG4gIHNldHVwRXZlbnRMaXN0ZW5lcnMoKSB7XG4gICAgaWYgKHRoaXMuY29uZmlnLnVzZVRvdWNoRXZlbnRzKSB7XG4gICAgICAvLyBEaXNhYmxlcyBzY3JvbGxpbmcgb24gdG91Y2ggZGV2aWNlcy5cbiAgICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgKGV2ZW50KSA9PiB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB9LCBmYWxzZSk7XG4gICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRoaXMuc3RhcnRFdmVudC5iaW5kKHRoaXMpKTtcbiAgICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIHRoaXMuc3RvcEV2ZW50LmJpbmQodGhpcykpO1xuICAgIH0gZWxzZSB7XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgdGhpcy5zdG9wRXZlbnQuYmluZCh0aGlzKSk7XG4gICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgdGhpcy5zdGFydEV2ZW50LmJpbmQodGhpcykpO1xuICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLnN0b3BFdmVudC5iaW5kKHRoaXMpKTtcbiAgICB9XG4gIH1cblxuICAvLyBJbnRlcm5hbCBzdGFydCBldmVudCAtIGFsc28gdHJpZ2dlcnMgZXh0ZXJuYWwgZXZlbnRcbiAgc3RhcnRFdmVudCgpIHtcbiAgICBpZiAodGhpcy5jb25maWcudXNlVG91Y2hFdmVudHMpIHtcbiAgICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCB0aGlzLnVwZGF0ZUV2ZW50LmJpbmQodGhpcykpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy51cGRhdGVFdmVudC5iaW5kKHRoaXMpKTtcbiAgICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgdGhpcy5zdG9wRXZlbnQuYmluZCh0aGlzKSk7XG4gICAgfVxuICAgIGNvbnN0IHVwZGF0ZUNhbGxiYWNrID0gdGhpcy5jb25maWcudXBkYXRlRXZlbnQuYmluZCh0aGlzLmNvbmZpZy5iaW5kRXZlbnRzVG8pO1xuICAgIGNvbnN0IHN0YXJ0Q2FsbGJhY2sgPSB0aGlzLmNvbmZpZy5zdGFydEV2ZW50LmJpbmQodGhpcy5jb25maWcuYmluZEV2ZW50c1RvKTtcbiAgICBjb25zdCBvdXRwdXRWYWx1ZXMgPSB0aGlzLmNhbGNPdXRwdXRWYWx1ZXMoZXZlbnQpO1xuICAgIHN0YXJ0Q2FsbGJhY2soKTtcbiAgICB1cGRhdGVDYWxsYmFjayhvdXRwdXRWYWx1ZXMpO1xuICB9XG5cbiAgLy8gSW50ZXJuYWwgc3RvcCBldmVudCAtIGFsc28gdHJpZ2dlcnMgZXh0ZXJuYWwgZXZlbnRcbiAgc3RvcEV2ZW50KCkge1xuICAgIGlmICh0aGlzLmNvbmZpZy51c2VUb3VjaEV2ZW50cykge1xuICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHRoaXMudXBkYXRlRXZlbnQpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy51cGRhdGVFdmVudCk7XG4gICAgICB0aGlzLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsIHRoaXMuc3RvcEV2ZW50KTtcbiAgICB9XG4gICAgY29uc3Qgc3RvcENhbGxiYWNrID0gdGhpcy5jb25maWcuc3RvcEV2ZW50LmJpbmQodGhpcy5jb25maWcuYmluZEV2ZW50c1RvKTtcbiAgICBzdG9wQ2FsbGJhY2soKTtcbiAgfVxuXG4gIC8vIEludGVybmFsIHVwZGF0ZSBldmVudCAtIGFsc28gdHJpZ2dlcnMgZXh0ZXJuYWwgZXZlbnRcbiAgdXBkYXRlRXZlbnQoZXZlbnQpIHtcbiAgICBjb25zdCBvdXRwdXRWYWx1ZXMgPSB0aGlzLmNhbGNPdXRwdXRWYWx1ZXMoZXZlbnQpO1xuICAgIGNvbnN0IHVwZGF0ZUNhbGxiYWNrID0gdGhpcy5jb25maWcudXBkYXRlRXZlbnQuYmluZCh0aGlzLmNvbmZpZy5iaW5kRXZlbnRzVG8pO1xuICAgIHVwZGF0ZUNhbGxiYWNrKG91dHB1dFZhbHVlcyk7XG4gIH1cblxuICAvLyBDYWxjdWxhdGUgb3V0cHV0IHZhbHVlcyAoYmV0d2VlbiAwIGFuZCAxKSBiYXNlZCBvbiBwYWQgY29vcmRpbmF0ZXNcbiAgY2FsY091dHB1dFZhbHVlcyhldmVudCkge1xuICAgIGxldCB4SW5wdXQgPSAwO1xuICAgIGxldCB5SW5wdXQgPSAwO1xuICAgIGNvbnN0IHdpZHRoID0gdGhpcy5lbGVtZW50Lm9mZnNldFdpZHRoO1xuICAgIGNvbnN0IGhlaWdodCA9IHRoaXMuZWxlbWVudC5vZmZzZXRIZWlnaHQ7XG4gICAgLy8gSWYgbm9uLXRvdWNoIGV2ZW50XG4gICAgaWYgKGV2ZW50LnR5cGUgPT09ICdtb3VzZWRvd24nIHx8IGV2ZW50LnR5cGUgPT09ICdtb3VzZW1vdmUnKSB7XG4gICAgICB4SW5wdXQgPSBldmVudC54O1xuICAgICAgeUlucHV0ID0gZXZlbnQueTtcbiAgICB9IGVsc2UgaWYgKGV2ZW50LnR5cGUgPT09ICd0b3VjaHN0YXJ0JyB8fCBldmVudC50eXBlID09PSAndG91Y2htb3ZlJykge1xuICAgICAgLy8gSWYgdG91Y2ggZXZlbnRcbiAgICAgIGNvbnN0IHRvdWNoID0gZXZlbnQudG91Y2hlc1swXTtcbiAgICAgIHhJbnB1dCA9IHRvdWNoLnBhZ2VYO1xuICAgICAgeUlucHV0ID0gdG91Y2gucGFnZVk7XG4gICAgfVxuICAgIGNvbnN0IHhPdXRwdXQgPSAoKHhJbnB1dCAtIHRoaXMuZWxlbWVudC5vZmZzZXRMZWZ0KSAvIHdpZHRoKTtcbiAgICBjb25zdCB5T3V0cHV0ID0gKCh5SW5wdXQgLSB0aGlzLmVsZW1lbnQub2Zmc2V0VG9wKSAvIGhlaWdodCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIHg6IHhPdXRwdXQsXG4gICAgICB5OiB5T3V0cHV0LFxuICAgIH07XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQXVkaW9QYWQ7XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBSaXBwbGUge1xuICBjb25zdHJ1Y3RvcihjYW52YXMsIGNvbnRleHQsIGNvbmZpZyA9IHtcbiAgICBodWU6IDUwLFxuICAgIGRldmlhdGlvbjogNTAsXG4gICAgb3BhY2l0eTogMSxcbiAgfSkge1xuICAgIGlmIChjYW52YXMgJiYgY29udGV4dCkge1xuICAgICAgdGhpcy5jYW52YXMgPSBjYW52YXM7XG4gICAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xuICAgICAgdGhpcy5odWUgPSBjb25maWcuaHVlO1xuICAgICAgdGhpcy5kZXZpYXRpb24gPSBjb25maWcuZGV2aWF0aW9uO1xuICAgICAgdGhpcy5hY3RpdmUgPSBmYWxzZTtcbiAgICAgIHRoaXMub3BhY2l0eSA9IDE7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGNvbnNvbGUuZXJyb3IoJ0ludmFsaWQgY29uc3RydWN0b3IgYWd1bWVudHMgZm9yIFJpcHBsZSBDbGFzcycpO1xuICAgIH1cbiAgfVxuICBzdGF0aWMgcmFuZChtYXggPSAxLCBtaW4gPSAwLCBfaW50KSB7XG4gICAgY29uc3QgZ2VuID0gbWluICsgKG1heCAtIG1pbikgKiBNYXRoLnJhbmRvbSgpO1xuICAgIHJldHVybiAoX2ludCkgPyBNYXRoLnJvdW5kKGdlbikgOiBnZW47XG4gIH1cbiAgYnVpbGQocG9zaXRpb24sIGh1ZSA9IHRoaXMuaHVlLCBvcGFjaXR5ID0gdGhpcy5vcGFjaXR5KSB7XG4gICAgLy8gdGhpcy5odWUgPSBSaXBwbGUucmFuZChodWUgKyB0aGlzLmRldmlhdGlvbiAvIDIsIGh1ZSArIHRoaXMuZGV2aWF0aW9uLCAxKTtcbiAgICB0aGlzLmh1ZSA9IGh1ZSArIHRoaXMuZGV2aWF0aW9uO1xuICAgIGlmICh0aGlzLmh1ZSA8IDApIHRoaXMuaHVlID0gMDtcbiAgICBpZiAodGhpcy5odWUgPiAzNjApIHRoaXMuaHVlID0gMzYwO1xuICAgIHRoaXMuciA9IE1hdGgucmFuZG9tKCkgKyAwLjE7XG4gICAgdGhpcy5vcGFjaXR5ID0gb3BhY2l0eTtcbiAgICB0aGlzLmFjdGl2ZSA9IHRydWU7XG4gICAgdGhpcy5vcmlnaW4gPSBwb3NpdGlvbjtcblxuICAgIHRoaXMuY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICB0aGlzLmNvbnRleHQuYXJjKHBvc2l0aW9uLngsIHBvc2l0aW9uLnksIHRoaXMuciwgMCwgMiAqIE1hdGguUEksIGZhbHNlKTtcbiAgICB0aGlzLmNvbnRleHQuZmlsbFN0eWxlID0gYGhzbGEoICR7dGhpcy5odWV9LDEwMCUsNTAlLCR7dGhpcy5vcGFjaXR5fSlgO1xuICAgIHRoaXMuY29udGV4dC5maWxsKCk7XG4gIH1cbiAgZHJhdyhwb3NpdGlvbiA9IHRoaXMub3JpZ2luKSB7XG4gICAgdGhpcy5hY3RpdmUgPSB0cnVlO1xuICAgIHRoaXMub3BhY2l0eSAtPSAwLjAxO1xuICAgIHRoaXMuciA9IE1hdGguYWJzKHRoaXMuciArIDcpO1xuXG4gICAgdGhpcy5jb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgIHRoaXMuY29udGV4dC5hcmMocG9zaXRpb24ueCwgcG9zaXRpb24ueSwgdGhpcy5yLCAwLCAyICogTWF0aC5QSSwgZmFsc2UpO1xuICAgIHRoaXMuY29udGV4dC5maWxsU3R5bGUgPSBgaHNsYSggJHt0aGlzLmh1ZX0sMTAwJSw1MCUsJHt0aGlzLm9wYWNpdHl9KWA7XG4gICAgdGhpcy5jb250ZXh0LmZpbGwoKTtcblxuICAgIGlmICh0aGlzLm9wYWNpdHkgPCAwLjAxKSB7XG4gICAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IFJpcHBsZSBmcm9tICcuL1JpcHBsZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJpcHBsZUNhbnZhcyB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIGVsZW1lbnQsXG4gICAgY29uZmlnID0ge1xuICAgICAgdXNlVG91Y2hFdmVudHM6IHRydWUsXG4gICAgICB1cGRhdGVSaXBwbGVQb3NpdGlvbjogZmFsc2UsXG4gICAgfVxuICApIHtcbiAgICBpZiAodHlwZW9mIGVsZW1lbnQgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aGlzLmNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVsZW1lbnQpO1xuICAgICAgdGhpcy5jb250ZXh0ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICAgIHRoaXMuY2FudmFzU2l6ZSA9IHtcbiAgICAgICAgd2lkdGg6IHRoaXMuY2FudmFzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGgsXG4gICAgICAgIGhlaWdodDogdGhpcy5jYW52YXMuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0LFxuICAgICAgfTtcbiAgICAgIHRoaXMucmlwcGxlcyA9IFtdO1xuICAgICAgdGhpcy5vcmlnaW5Qb3MgPSB7XG4gICAgICAgIHg6IDAsXG4gICAgICAgIHk6IDAsXG4gICAgICB9O1xuICAgICAgdGhpcy5pc0FjdGl2ZSA9IGZhbHNlO1xuICAgICAgdGhpcy50aGVuID0gbnVsbDtcbiAgICAgIHRoaXMuYW5pbWF0aW9uID0gbnVsbDtcbiAgICAgIHRoaXMucGFydGljbGVOdW0gPSAxMDA7XG4gICAgICB0aGlzLmN1cnJlbnRSaXBwbGUgPSAwO1xuICAgICAgdGhpcy5yaXBwbGVGcmVxdWVuY3kgPSAxMDA7XG4gICAgICB0aGlzLmJhc2VDb2xvciA9IHtcbiAgICAgICAgaDogNTAsXG4gICAgICAgIHM6IDUwLFxuICAgICAgICBsOiA1MCxcbiAgICAgIH07XG4gICAgICB0aGlzLnJpcHBsZU9wYWNpdHkgPSAxO1xuICAgICAgdGhpcy51c2VUb3VjaEV2ZW50cyA9IGNvbmZpZy51c2VUb3VjaEV2ZW50cztcbiAgICAgIHRoaXMudXBkYXRlUmlwcGxlUG9zaXRpb24gPSBjb25maWcudXBkYXRlUmlwcGxlUG9zaXRpb247XG4gICAgICB0aGlzLmluaXRFdmVudHMoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gY29uc29sZS5lcnJvcignTm8gY2FudmFzIElEIHByb3ZpZGVkIHRvIFJpcHBsZUNhbnZhcyBDbGFzcycpO1xuICAgIH1cbiAgfVxuICBzdGF0aWMgZ2V0T3JpZ2luUG9zaXRpb24oY2FudmFzLCBldmVudCkge1xuICAgIGxldCB4SW5wdXQgPSAwO1xuICAgIGxldCB5SW5wdXQgPSAwO1xuICAgIC8vIElmIG5vbi10b3VjaCBldmVudFxuICAgIGlmIChldmVudC50eXBlID09PSAnbW91c2Vkb3duJyB8fCBldmVudC50eXBlID09PSAnbW91c2Vtb3ZlJykge1xuICAgICAgeElucHV0ID0gZXZlbnQueDtcbiAgICAgIHlJbnB1dCA9IGV2ZW50Lnk7XG4gICAgfSBlbHNlIGlmIChldmVudC50eXBlID09PSAndG91Y2hzdGFydCcgfHwgZXZlbnQudHlwZSA9PT0gJ3RvdWNobW92ZScpIHtcbiAgICAgIC8vIElmIHRvdWNoIGV2ZW50XG4gICAgICBjb25zdCB0b3VjaCA9IGV2ZW50LnRvdWNoZXNbMF07XG4gICAgICB4SW5wdXQgPSB0b3VjaC5wYWdlWDtcbiAgICAgIHlJbnB1dCA9IHRvdWNoLnBhZ2VZO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgeDogeElucHV0LFxuICAgICAgeTogeUlucHV0LFxuICAgIH07XG4gIH1cbiAgc3RhdGljIGdldFBvc2l0aW9uRmxvYXQocG9zaXRpb24pIHtcbiAgICBjb25zdCByZWN0ID0gdGhpcy5jYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIHg6IHBvc2l0aW9uLnggLSByZWN0LngsXG4gICAgICB5OiBwb3NpdGlvbi55IC0gcmVjdC55LFxuICAgIH07XG4gIH1cbiAgdXBkYXRlQmFzZUNvbG9yKGggPSB0aGlzLmJhc2VDb2xvci5oLCBzID0gdGhpcy5iYXNlQ29sb3IucywgbCA9IHRoaXMuYmFzZUNvbG9yLmwpIHtcbiAgICB0aGlzLmJhc2VDb2xvciA9IHtcbiAgICAgIGgsIHMsIGwsXG4gICAgfTtcbiAgfVxuICB1cGRhdGVQb3N0aW9uVmFsdWVzKHBvc2l0aW9uID0geyB4OiAwLCB5OiAwIH0pIHtcbiAgICB0aGlzLnJpcHBsZUZyZXF1ZW5jeSA9IChwb3NpdGlvbi54ICogMjUwKSArIDUwO1xuICAgIHRoaXMucmlwcGxlT3BhY2l0eSA9IDEgLSBwb3NpdGlvbi55O1xuICB9XG4gIGRyYXdTY2VuZSgpIHtcbiAgICB0aGlzLmNvbnRleHQuZmlsbFN0eWxlID0gYGhzbCgke3RoaXMuYmFzZUNvbG9yLmh9LCAke3RoaXMuYmFzZUNvbG9yLnN9JSwgJHt0aGlzLmJhc2VDb2xvci5sfSUpYDtcbiAgICB0aGlzLmNvbnRleHQuZmlsbFJlY3QoMCwgMCwgdGhpcy5jYW52YXMud2lkdGgsIHRoaXMuY2FudmFzLmhlaWdodCk7XG4gICAgY29uc3Qgbm93ID0gRGF0ZS5ub3coKTtcbiAgICBjb25zdCBlbGFwc2VkID0gbm93IC0gdGhpcy50aGVuO1xuICAgIGNvbnN0IG1vZCA9IGVsYXBzZWQgJSB0aGlzLnJpcHBsZUZyZXF1ZW5jeTtcbiAgICBjb25zdCBwb3NpdGlvbiA9IHRoaXMudXBkYXRlUmlwcGxlUG9zaXRpb24gPyB0aGlzLm9yaWdpblBvcyA6IHVuZGVmaW5lZDtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5yaXBwbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAodGhpcy5yaXBwbGVzW2ldLmFjdGl2ZSA9PT0gdHJ1ZSkge1xuICAgICAgICB0aGlzLnJpcHBsZXNbaV0uZHJhdyhwb3NpdGlvbik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG1vZCA+PSAwICYmIG1vZCA8IDE1KSB7XG4gICAgICBpZiAodGhpcy5pc0FjdGl2ZSkge1xuICAgICAgICBpZiAodGhpcy5yaXBwbGVzW3RoaXMuY3VycmVudFJpcHBsZV0uYWN0aXZlID09PSBmYWxzZSkge1xuICAgICAgICAgIHRoaXMucmlwcGxlc1t0aGlzLmN1cnJlbnRSaXBwbGVdLmJ1aWxkKFxuICAgICAgICAgICAgdGhpcy5vcmlnaW5Qb3MsXG4gICAgICAgICAgICB0aGlzLmJhc2VDb2xvci5oLFxuICAgICAgICAgICAgdGhpcy5yaXBwbGVPcGFjaXR5XG4gICAgICAgICAgKTtcbiAgICAgICAgICBpZiAodGhpcy5jdXJyZW50UmlwcGxlIDwgdGhpcy5yaXBwbGVzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFJpcHBsZSsrO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRSaXBwbGUgPSAwO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLmFuaW1hdGlvbiA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLmRyYXdTY2VuZS5iaW5kKHRoaXMpKTtcbiAgfVxuICBpbml0Q2FudmFzKCkge1xuICAgIGlmICh0aGlzLnJpcHBsZXMubGVuZ3RoKSB7XG4gICAgICB0aGlzLnJpcHBsZXMgPSBbXTtcbiAgICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXMuYW5pbWF0aW9uLmJpbmQodGhpcykpO1xuICAgIH1cblxuICAgIHRoaXMudGhlbiA9IERhdGUubm93KCk7XG5cbiAgICB0aGlzLmNhbnZhc1NpemUud2lkdGggPSB0aGlzLmNhbnZhcy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgIHRoaXMuY2FudmFzU2l6ZS5oZWlnaHQgPSB0aGlzLmNhbnZhcy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucGFydGljbGVOdW07IGkrKykge1xuICAgICAgdGhpcy5yaXBwbGVzLnB1c2gobmV3IFJpcHBsZSh0aGlzLmNhbnZhcywgdGhpcy5jb250ZXh0KSk7XG4gICAgfVxuXG4gICAgdGhpcy5kcmF3U2NlbmUoKTtcbiAgICAvLyBjb25zb2xlLmxvZyhhbmltYXRpb24pO1xuICB9XG4gIGluaXRFdmVudHMoKSB7XG4gICAgdGhpcy5pbml0Q2FudmFzKCk7XG4gICAgbGV0IGV2ZW50VHlwZVN0cmluZ3MgPSB7fTtcbiAgICBpZiAodGhpcy51c2VUb3VjaEV2ZW50cykge1xuICAgICAgZXZlbnRUeXBlU3RyaW5ncyA9IHtcbiAgICAgICAgc3RhcnQ6ICd0b3VjaHN0YXJ0JyxcbiAgICAgICAgbW92ZTogJ3RvdWNobW92ZScsXG4gICAgICAgIGVuZDogJ3RvdWNoZW5kJyxcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIGV2ZW50VHlwZVN0cmluZ3MgPSB7XG4gICAgICAgIHN0YXJ0OiAnbW91c2Vkb3duJyxcbiAgICAgICAgbW92ZTogJ21vdXNlbW92ZScsXG4gICAgICAgIGVuZDogJ21vdXNldXAnLFxuICAgICAgfTtcbiAgICB9XG4gICAgLy8gYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5pbml0Q2FudmFzLCBmYWxzZSk7XG4gICAgLy8gY2FudmFzIGV2ZW50c1xuICAgIHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRUeXBlU3RyaW5ncy5zdGFydCwgKGV2dCkgPT4ge1xuICAgICAgdGhpcy5pc0FjdGl2ZSA9IHRydWU7XG4gICAgICB0aGlzLm9yaWdpblBvcyA9IFJpcHBsZUNhbnZhcy5nZXRPcmlnaW5Qb3NpdGlvbih0aGlzLmNhbnZhcywgZXZ0KTtcbiAgICB9LCBmYWxzZSk7XG4gICAgdGhpcy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihldmVudFR5cGVTdHJpbmdzLm1vdmUsIChldnQpID0+IHtcbiAgICAgIGlmICh0aGlzLmlzQWN0aXZlKSB0aGlzLm9yaWdpblBvcyA9IFJpcHBsZUNhbnZhcy5nZXRPcmlnaW5Qb3NpdGlvbih0aGlzLmNhbnZhcywgZXZ0KTtcbiAgICB9LCBmYWxzZSk7XG4gICAgdGhpcy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihldmVudFR5cGVTdHJpbmdzLmVuZCwgKCkgPT4ge1xuICAgICAgdGhpcy5pc0FjdGl2ZSA9IGZhbHNlO1xuICAgIH0sIGZhbHNlKTtcblxuICAgIGFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuaW5pdENhbnZhcywgZmFsc2UpO1xuICB9XG59XG4iLCJpbXBvcnQgY3JlYXRlQXVkaW9Db250ZXh0IGZyb20gJ2lvcy1zYWZlLWF1ZGlvLWNvbnRleHQnO1xuY2xhc3MgVGhlcmFQaG9uZSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgICAgY29uZmlnID0ge1xuICAgICAgICB1c2VSZXZlcmI6IHRydWUsXG4gICAgICAgIHVzZVZpYnJhdG86IHRydWUsXG4gICAgICAgIHJldmVyYkltcHVsc2VGaWxlOiAnYXVkaW8vZmFjdG9yeS5oYWxsLndhdicsXG4gICAgICB9XG4gICkge1xuICAgIHRoaXMuc2V0dXBDb3JlQXVkaW8oY29uZmlnKTtcbiAgfVxuICAvLyBTZXR1cCBjb3JlIGNvbXBvbmVudHNcbiAgc2V0dXBDb3JlQXVkaW8oY29uZmlnKSB7XG4gICAgdGhpcy5jdHggPSB0aGlzLmNyZWF0ZUNvbnRleHQoKTtcbiAgICB0aGlzLm5vdGUgPSB7XG4gICAgICBnYWluOiB0aGlzLmNyZWF0ZUdhaW4oMCksXG4gICAgfTtcbiAgICB0aGlzLm1hc3RlciA9IHtcbiAgICAgIGdhaW46IHRoaXMuY3JlYXRlR2FpbigxKSxcbiAgICB9O1xuXG4gICAgLy8gQ3JlYXRlIHJldmVyYiBhbmQgY29ubmVjdCB0byBub3RlXG4gICAgaWYgKGNvbmZpZy51c2VSZXZlcmIpIHtcbiAgICAgIHRoaXMuY3JlYXRlUmV2ZXJiKGNvbmZpZy5yZXZlcmJJbXB1bHNlRmlsZSk7XG4gICAgICB0aGlzLm5vdGUuZ2Fpbi5jb25uZWN0KHRoaXMucmV2ZXJiLmdhaW4pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm5vdGUuZ2Fpbi5jb25uZWN0KHRoaXMubWFzdGVyLmdhaW4pO1xuICAgIH1cbiAgICBpZiAoY29uZmlnLnVzZVZpYnJhdG8pIHRoaXMudmlicmF0byA9IHRoaXMuY3JlYXRlVmlicmF0bygpO1xuICAgIHRoaXMubWFzdGVyLmdhaW4uY29ubmVjdCh0aGlzLmN0eC5kZXN0aW5hdGlvbik7XG4gIH1cblxuICAvLyBDcmVhdGUgYXVkaW8gY29udGV4dFxuICBjcmVhdGVDb250ZXh0KHNhbXBsZVJhdGUpIHtcbiAgICAvLyB3aW5kb3cuQXVkaW9Db250ZXh0ID0gd2luZG93LkF1ZGlvQ29udGV4dCB8fCB3aW5kb3cud2Via2l0QXVkaW9Db250ZXh0XG4gICAgLy8gcmV0dXJuIG5ldyB3aW5kb3cuQXVkaW9Db250ZXh0KClcblxuICAgIC8vIGlPUyBmaXhlZCBhdWRpbyBjb250ZXh0XG4gICAgcmV0dXJuIGNyZWF0ZUF1ZGlvQ29udGV4dChzYW1wbGVSYXRlKTtcbiAgfVxuXG4gIC8vIENyZWF0ZSBkZWZhdWx0IGdhaW4gbm9kZVxuICBjcmVhdGVHYWluKHZvbCA9IDAuNSkge1xuICAgIGNvbnN0IGdhaW4gPSB0aGlzLmN0eC5jcmVhdGVHYWluKCk7XG4gICAgZ2Fpbi5nYWluLnZhbHVlID0gdm9sO1xuICAgIHJldHVybiBnYWluO1xuICB9XG5cbiAgLy8gQ3JlYXRlIGRlZmF1bHQgb3NjaWxsYXRvciBub2RlXG4gIGNyZWF0ZU9zYyhmcmVxID0gNDQwLCB0eXBlID0gJ3NpbmUnKSB7XG4gICAgY29uc3Qgb3NjID0gdGhpcy5jdHguY3JlYXRlT3NjaWxsYXRvcigpO1xuICAgIG9zYy50eXBlID0gdHlwZTtcbiAgICBvc2MuZnJlcXVlbmN5LnZhbHVlID0gNDQwO1xuICAgIHJldHVybiBvc2M7XG4gIH1cblxuICAvLyBDcmVhdGUgY292b2x2ZXIgcmV2ZXJiXG4gIGNyZWF0ZVJldmVyYihyZXZlcmJJbXB1bHNlRmlsZSkge1xuICAgIHRoaXMucmV2ZXJiID0ge1xuICAgICAgY29udm9sdmVyOiB0aGlzLmN0eC5jcmVhdGVDb252b2x2ZXIoKSxcbiAgICAgIGdhaW46IHRoaXMuY3JlYXRlR2FpbigwLjUpLFxuICAgIH07XG4gICAgdGhpcy5sb2FkSW1wdWxzZShyZXZlcmJJbXB1bHNlRmlsZSk7XG4gICAgdGhpcy5yZXZlcmIuY29udm9sdmVyLmNvbm5lY3QodGhpcy5yZXZlcmIuZ2Fpbik7XG4gICAgdGhpcy5yZXZlcmIuZ2Fpbi5jb25uZWN0KHRoaXMubWFzdGVyLmdhaW4pO1xuICB9XG5cbiAgLy8gTG9hZCBpbXBsdXNlIGZpbGUgZm9yIHJldmVyYlxuICBsb2FkSW1wdWxzZShmaWxlTmFtZSkge1xuICAgIGNvbnN0IHVybCA9IGZpbGVOYW1lO1xuICAgIGNvbnN0IHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICByZXF1ZXN0Lm9wZW4oJ0dFVCcsIHVybCwgdHJ1ZSk7XG4gICAgcmVxdWVzdC5yZXNwb25zZVR5cGUgPSAnYXJyYXlidWZmZXInO1xuICAgIHJlcXVlc3Qub25sb2FkID0gKCkgPT4ge1xuICAgICAgdGhpcy5jdHguZGVjb2RlQXVkaW9EYXRhKHJlcXVlc3QucmVzcG9uc2UsIChidWZmZXIpID0+IHtcbiAgICAgICAgdGhpcy5yZXZlcmIuY29udm9sdmVyLmJ1ZmZlciA9IGJ1ZmZlcjtcbiAgICAgIH0sXG4gICAgICAoKSA9PiB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGUpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICAvLyByZXF1ZXN0Lm9uZXJyb3IgPSBmdW5jdGlvbiAoZSkgeyBjb25zb2xlLmxvZyhlKTsgfTtcbiAgICByZXF1ZXN0LnNlbmQoKTtcbiAgfVxuXG4gIC8vIENyZWF0ZSB2aWJyYXRvIG9iamVjdFxuICBjcmVhdGVWaWJyYXRvKCkge1xuICAgIHJldHVybiB7XG4gICAgICByYW5nZTogMTUwLFxuICAgICAgaW50ZXJ2YWw6IDEsXG4gICAgICBpbmNyZW1lbnQ6IDEwLFxuICAgICAgY3VycmVudFZhbDogMCxcbiAgICAgIGRpcmVjdGlvbjogMSxcbiAgICAgIHVwZGF0ZTogdGhpcy51cGRhdGVOb3RlRGV0dW5lLFxuICAgIH07XG4gIH1cblxuICAvLyBVdGlsIGZ1bmN0aW9uIHRvIG9zY2lsbGF0ZSBiZXR3ZWVuIHJhbmdlIG9mIHZhbHVlc1xuICBvc2NpbGxhdGVWYWx1ZXMocGFyYW1zKSB7XG4gICAgaWYgKHBhcmFtcykge1xuICAgICAgY29uc3Qgb2JqID0gcGFyYW1zO1xuICAgICAgaWYgKG9iai5kaXJlY3Rpb24gPT09IDEpIHtcbiAgICAgICAgLy8gRm9yd2FyZHMhXG4gICAgICAgIGlmIChvYmouY3VycmVudFZhbCA8IG9iai5yYW5nZSkge1xuICAgICAgICAgIG9iai5jdXJyZW50VmFsID0gb2JqLmN1cnJlbnRWYWwgKyBvYmouaW5jcmVtZW50O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG9iai5kaXJlY3Rpb24gPSAwOyAvLyBjaGFuZ2UgZGlyZWN0aW9uXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAob2JqLmRpcmVjdGlvbiA9PT0gMCkge1xuICAgICAgICAvLyBCYWNrd2FyZHMhXG4gICAgICAgIGlmIChvYmouY3VycmVudFZhbCA+IDApIHtcbiAgICAgICAgICBvYmouY3VycmVudFZhbCA9IG9iai5jdXJyZW50VmFsIC0gb2JqLmluY3JlbWVudDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvYmouZGlyZWN0aW9uID0gMTsgLy8gY2hhbmdlIGRpcmVjdGlvblxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjb25zdCB1cGRhdGVGdW5jdGlvbiA9IHBhcmFtcy51cGRhdGUuYmluZCh0aGlzKTtcbiAgICAgIHVwZGF0ZUZ1bmN0aW9uKHBhcmFtcy5jdXJyZW50VmFsKTtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLm9zY2lsbGF0ZVZhbHVlcyhwYXJhbXMpO1xuICAgICAgfSwgcGFyYW1zLmludGVydmFsKTtcbiAgICB9XG4gIH1cblxuICAvLyBTdGFydCB3ZWIgYXVkaW8gY2hhaW4gKGltcG9ydGFudDogTm90ZSBnYWluIGlzIHNpbGVudCBhdCB0aGlzIHBvaW50KVxuICBub3RlT24oKSB7XG4gICAgaWYgKHRoaXMubm90ZS5vc2MpIHJldHVybjsgLy8gTm90ZSBhbHJlYWR5IHBsYXlpbmdcbiAgICAvLyBjb25zb2xlLmluZm8oJ05vdGUgT24hJyk7XG4gICAgdGhpcy5ub3RlLm9zYyA9IHRoaXMuY3JlYXRlT3NjKCk7XG4gICAgdGhpcy5ub3RlLm9zYy5jb25uZWN0KHRoaXMubm90ZS5nYWluKTtcbiAgICBpZiAodGhpcy5yZXZlcmIpIHRoaXMubm90ZS5nYWluLmNvbm5lY3QodGhpcy5yZXZlcmIuY29udm9sdmVyKTtcblxuICAgIC8vIEJpdCBvZiBhIGhhY2t5IHZpYnJhdG8sIGhvcGVmdWxseSB3b3JrIG91dCBhIHdlYiBhdWRpbyBlcXVpdmFsZW50XG4gICAgaWYgKHRoaXMudmlicmF0bykgdGhpcy5vc2NpbGxhdGVWYWx1ZXModGhpcy52aWJyYXRvKTtcbiAgICB0aGlzLm5vdGUuZ2Fpbi5jb25uZWN0KHRoaXMubWFzdGVyLmdhaW4pO1xuICAgIHRoaXMubm90ZS5vc2Muc3RhcnQoMCk7XG4gIH1cblxuICAvLyBTdG9wIGF1ZGlvIGNoYWluICh3aWxsIGRlc3Ryb3kgdGhlIG9uZS11c2Ugbm90ZSBvc2NpbGxhdG9yKVxuICBub3RlT2ZmKCkge1xuICAgIC8vIGNvbnNvbGUuaW5mbygnTm90ZSBPZmYnKTtcbiAgICBpZiAodGhpcy5ub3RlLm9zYykge1xuICAgICAgdGhpcy5ub3RlLm9zYy5zdG9wKDApO1xuICAgICAgdGhpcy5ub3RlLm9zYyA9IG51bGw7XG4gICAgICBjbGVhckludGVydmFsKHRoaXMudmlicmF0by5pbnRlcnZhbEZ1bmN0aW9uKTtcbiAgICB9XG4gIH1cblxuICAvLyBNdXRlIG1hc3RlciBnYWluXG4gIG11dGUoKSB7XG4gICAgdGhpcy5tYXN0ZXIuZ2Fpbi5nYWluLnZhbHVlID0gMDtcbiAgfVxuXG4gIC8vIFVubXV0ZSBtYXN0ZXIgZ2FpblxuICB1bk11dGUoKSB7XG4gICAgdGhpcy5tYXN0ZXIuZ2Fpbi5nYWluLnZhbHVlID0gMTtcbiAgfVxuXG4gIC8vIFVwZGF0ZSBwaXRjaCBvZiBtYWluIG5vdGUgb3NjaWxsYXRvclxuICB1cGRhdGVOb3RlUGl0Y2goZnJlcSkge1xuICAgIGlmICh0aGlzLm5vdGUub3NjKSB0aGlzLm5vdGUub3NjLmZyZXF1ZW5jeS52YWx1ZSA9IGZyZXE7XG4gIH1cblxuICAvLyBVcGRhdGUgbWFpbiBub3RlIG9zY2lsbGF0b3IgZGV0dW5lIHZhbHVlXG4gIHVwZGF0ZU5vdGVEZXR1bmUoY2VudHMpIHtcbiAgICBpZiAodGhpcy5ub3RlLm9zYykgdGhpcy5ub3RlLm9zYy5kZXR1bmUudmFsdWUgPSBjZW50cztcbiAgfVxuXG4gIC8vIFVwZGF0ZSBtYWluIG5vdGUgZ2FpblxuICB1cGRhdGVWb2x1bWUodm9sKSB7XG4gICAgaWYgKHRoaXMubm90ZS5nYWluICYmIHZvbCA+PSAwICYmIHZvbCA8IDEpIHRoaXMubm90ZS5nYWluLmdhaW4udmFsdWUgPSB2b2w7XG4gIH1cblxuICAvLyBVcGRhdGUgcmFuZ2Ugb2Ygbm90ZSB2aWJyYXRvXG4gIHVwZGF0ZVZpYnJhdG9SYW5nZShyYW5nZSA9IDE1MCkge1xuICAgIGlmICh0aGlzLnZpYnJhdG8pIHRoaXMudmlicmF0by5yYW5nZSA9IHJhbmdlO1xuICB9XG5cbiAgLy8gVXBkYXRlIGluY3JlbWVudCB1c2VkIGluIHZpYnJhdG8gb3NjaWxsYXRvciBmdW5jdGlvblxuICB1cGRhdGVWaWJyYXRvSW5jcmVtZW50KGluY3JlbWVudCA9IDEwKSB7XG4gICAgaWYgKHRoaXMudmlicmF0bykgdGhpcy52aWJyYXRvLmluY3JlbWVudCA9IGluY3JlbWVudDtcbiAgfVxuXG4gIC8vIFN0YXJ0IHBsYXliYWNrIGV4dGVybmFsIGNhbGxiYWNrIGV2ZW50XG4gIHN0YXJ0RXZlbnQoKSB7XG4gICAgLy8gY29uc29sZS5pbmZvKCdTdGFydCBldmVudCcpO1xuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgncGxheWluZycpOyAvLyBBZGQgYm9keSBDU1MgY2xhc3NcbiAgICAvLyB0aGlzLnVwZGF0ZVZvbHVtZSgxKSAvLyBUdXJuIHVwIG1haW4gbm90ZSBnYWluXG4gIH1cblxuICAvLyBTdG9wIHBsYXliYWNrIGV4dGVybmFsIGNhbGxiYWNrIGV2ZW50XG4gIHN0b3BFdmVudCgpIHtcbiAgICAvLyBjb25zb2xlLmluZm8oJ1N0b3AgZXZlbnQnKTtcbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ3BsYXlpbmcnKTsgLy8gUmVtb3ZlIGJvZHkgQ1NTIGNsYXNzXG4gICAgdGhpcy51cGRhdGVWb2x1bWUoMCk7IC8vIFNpbGVuY2UgbWFpbiBub3RlIGdhaW5cbiAgfVxuXG4gIC8vIFVwZGF0ZSB2YWx1ZXMgZXh0ZXJuYWwgY2FsbGJhY2sgZXZlbnQgKGR5bmFtaWNhbGx5IHVwZGF0ZSBjbGFzcyB2YWx1ZXMpXG4gIHVwZGF0ZUV2ZW50KHZhbHVlcyA9IHsgeDogMCwgeTogMCB9KSB7XG4gICAgY29uc3Qgdm9sdW1lID0gMSAtIHZhbHVlcy55O1xuICAgIGNvbnN0IHJhbmdlID0gKHZhbHVlcy54KSAqIDI1MDtcbiAgICBjb25zdCBpbmNyZW1lbnQgPSB2YWx1ZXMueCAqIDEwICsgMTtcbiAgICBpZiAodmFsdWVzLnggPj0gMCkgdGhpcy51cGRhdGVWaWJyYXRvSW5jcmVtZW50KGluY3JlbWVudCk7XG4gICAgaWYgKHZhbHVlcy54ID49IDApIHRoaXMudXBkYXRlVmlicmF0b1JhbmdlKHJhbmdlKTtcbiAgICBpZiAodmFsdWVzLnkgPj0gMCkgdGhpcy51cGRhdGVWb2x1bWUodm9sdW1lKTtcbiAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IFRoZXJhUGhvbmU7XG4iLCIvLyBJbXBvcnQgZGVwZW5kZW5jaWVzXG5pbXBvcnQgVGhlcmFQaG9uZSBmcm9tICcuL1RoZXJhUGhvbmUnO1xuaW1wb3J0IEF1ZGlvUGFkIGZyb20gJy4vQXVkaW9QYWQnO1xuLy8gaW1wb3J0IHsgZGlzcGxheU1vdGlvblZhbHVlcyB9IGZyb20gJy4vZGVidWcnO1xuaW1wb3J0IFJpcHBsZUNhbnZhcyBmcm9tICcuL1JpcHBsZUNhbnZhcyc7XG5cblxuLy8gTW9kZXJuaXpyIHJlcXVpcmVcbnJlcXVpcmUoJ2Jyb3dzZXJuaXpyL3Rlc3QvdG91Y2hldmVudHMnKTtcbmNvbnN0IE1vZGVybml6ciA9IHJlcXVpcmUoJ2Jyb3dzZXJuaXpyJyk7XG5cbi8vIE9uIERPTSBSZWFkeVxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHtcbiAgLy8gU2V0dXAgY2xhc3MgaW5zdGFuY2VzXG4gIGNvbnN0IHRoZXJhUGhvbmUgPSBuZXcgVGhlcmFQaG9uZSgpO1xuICBjb25zdCByaXBwbGVDYW52YXMgPSBuZXcgUmlwcGxlQ2FudmFzKCdhdWRpb1BhZCcsIHtcbiAgICB1c2VUb3VjaEV2ZW50czogTW9kZXJuaXpyLnRvdWNoZXZlbnRzLFxuICAgIHVwZGF0ZVJpcHBsZVBvc2l0aW9uOiB0cnVlLFxuICB9KTtcbiAgZnVuY3Rpb24gdXBkYXRlRXZlbnQodmFsdWVzKSB7XG4gICAgdGhlcmFQaG9uZS51cGRhdGVFdmVudCh2YWx1ZXMpO1xuICAgIHJpcHBsZUNhbnZhcy51cGRhdGVQb3N0aW9uVmFsdWVzKHZhbHVlcyk7XG4gIH1cblxuICBjb25zdCBhdWRpb1BhZCA9IG5ldyBBdWRpb1BhZCh7XG4gICAgZWxJRDogJ2F1ZGlvUGFkJyxcbiAgICB1c2VUb3VjaEV2ZW50czogTW9kZXJuaXpyLnRvdWNoZXZlbnRzLFxuICAgIHN0YXJ0RXZlbnQ6IHRoZXJhUGhvbmUuc3RhcnRFdmVudCxcbiAgICBzdG9wRXZlbnQ6IHRoZXJhUGhvbmUuc3RvcEV2ZW50LFxuICAgIHVwZGF0ZUV2ZW50LFxuICAgIGJpbmRFdmVudHNUbzogdGhlcmFQaG9uZSxcbiAgfSk7XG5cbiAgLy8gU3RvcmUgZWxlbWVudHNcbiAgY29uc3QgaW50cm8gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaW50cm8nKTtcbiAgY29uc3QgY2xvc2VJbnRybyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjbG9zZUludHJvJyk7XG4gIC8vIGNvbnN0IG11dGVCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbXV0ZScpO1xuXG4gIC8vIEludHJvIFNjcmVlblxuICBmdW5jdGlvbiBoaWRlSW50cm8oKSB7XG4gICAgaW50cm8uc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgfVxuXG4gIGNsb3NlSW50cm8uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBoaWRlSW50cm8pOyAvLyBIaWRlIGludHJvIHdpbmRvdyBvbiBidXR0b24gY2xpY2tcblxuICAvLyBpT1MgRml4ICh1c2UgaW50cm8gY2xvc2luZyBidXR0b24gdG8gYWxsb3cgYXVkaW8gdG8gcnVuKVxuICBjbG9zZUludHJvLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhlcmFQaG9uZS5ub3RlT24uYmluZCh0aGVyYVBob25lKSk7XG5cbiAgLy8gTXV0ZSBidXR0b25cbiAgLy8gbXV0ZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdGhlcmFQaG9uZS5tdXRlLmJpbmQodGhlcmFQaG9uZSkpO1xuICAvLyBtdXRlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgdGhlcmFQaG9uZS51bk11dGUuYmluZCh0aGVyYVBob25lKSk7XG5cbiAgLy8gU2V0dXAgQWNjZWxlcm9tZXRlclxuICBpZiAod2luZG93LkRldmljZU1vdGlvbkV2ZW50KSB7XG4gICAgd2luZG93Lm9uZGV2aWNlbW90aW9uID0gZnVuY3Rpb24oZSkge1xuICAgICAgLy8gZGlzcGxheU1vdGlvblZhbHVlcyhlKSAvLyBEaXNwbGF5IHZhbHVlcyBpbiBkZWJ1ZyBkaXZcbiAgICAgIGNvbnN0IGh1ZSA9IHBhcnNlSW50KChlLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkueSArIDEwKSAqIDE4LCAwKTtcbiAgICAgIHJpcHBsZUNhbnZhcy51cGRhdGVCYXNlQ29sb3IoaHVlKTtcbiAgICAgIC8vIFBpdGNoIGFkanVzdFxuICAgICAgY29uc3QgeUZyZXEgPSBlLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkueSArIDEwOyAvLyBNYWtlIHZhbHVlIDAgLSAyMFxuICAgICAgaWYgKHlGcmVxID4gMCkgeyB0aGVyYVBob25lLnVwZGF0ZU5vdGVQaXRjaCgoeUZyZXEgKiAzMCkgKyAyMDApOyB9XG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICAvLyBUT0RPOiBObyBBY2NlbGVyb21ldGVyIGRldGVjdGVkXG4gIH1cbn0pO1xuIiwidmFyIE1vZGVybml6ciA9IHJlcXVpcmUoJy4vbGliL01vZGVybml6cicpLFxuICAgIE1vZGVybml6clByb3RvID0gcmVxdWlyZSgnLi9saWIvTW9kZXJuaXpyUHJvdG8nKSxcbiAgICBjbGFzc2VzID0gcmVxdWlyZSgnLi9saWIvY2xhc3NlcycpLFxuICAgIHRlc3RSdW5uZXIgPSByZXF1aXJlKCcuL2xpYi90ZXN0UnVubmVyJyksXG4gICAgc2V0Q2xhc3NlcyA9IHJlcXVpcmUoJy4vbGliL3NldENsYXNzZXMnKTtcblxuLy8gUnVuIGVhY2ggdGVzdFxudGVzdFJ1bm5lcigpO1xuXG4vLyBSZW1vdmUgdGhlIFwibm8tanNcIiBjbGFzcyBpZiBpdCBleGlzdHNcbnNldENsYXNzZXMoY2xhc3Nlcyk7XG5cbmRlbGV0ZSBNb2Rlcm5penJQcm90by5hZGRUZXN0O1xuZGVsZXRlIE1vZGVybml6clByb3RvLmFkZEFzeW5jVGVzdDtcblxuLy8gUnVuIHRoZSB0aGluZ3MgdGhhdCBhcmUgc3VwcG9zZWQgdG8gcnVuIGFmdGVyIHRoZSB0ZXN0c1xuZm9yICh2YXIgaSA9IDA7IGkgPCBNb2Rlcm5penIuX3EubGVuZ3RoOyBpKyspIHtcbiAgTW9kZXJuaXpyLl9xW2ldKCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTW9kZXJuaXpyO1xuIiwidmFyIE1vZGVybml6clByb3RvID0gcmVxdWlyZSgnLi9Nb2Rlcm5penJQcm90by5qcycpO1xuICAvLyBGYWtlIHNvbWUgb2YgT2JqZWN0LmNyZWF0ZSBzbyB3ZSBjYW4gZm9yY2Ugbm9uIHRlc3QgcmVzdWx0cyB0byBiZSBub24gXCJvd25cIiBwcm9wZXJ0aWVzLlxuICB2YXIgTW9kZXJuaXpyID0gZnVuY3Rpb24oKSB7fTtcbiAgTW9kZXJuaXpyLnByb3RvdHlwZSA9IE1vZGVybml6clByb3RvO1xuXG4gIC8vIExlYWsgbW9kZXJuaXpyIGdsb2JhbGx5IHdoZW4geW91IGByZXF1aXJlYCBpdCByYXRoZXIgdGhhbiBmb3JjZSBpdCBoZXJlLlxuICAvLyBPdmVyd3JpdGUgbmFtZSBzbyBjb25zdHJ1Y3RvciBuYW1lIGlzIG5pY2VyIDpEXG4gIE1vZGVybml6ciA9IG5ldyBNb2Rlcm5penIoKTtcblxuICBtb2R1bGUuZXhwb3J0cyA9IE1vZGVybml6cjtcblxuIiwidmFyIHRlc3RzID0gcmVxdWlyZSgnLi90ZXN0cy5qcycpO1xuICAvKipcbiAgICpcbiAgICogTW9kZXJuaXpyUHJvdG8gaXMgdGhlIGNvbnN0cnVjdG9yIGZvciBNb2Rlcm5penJcbiAgICpcbiAgICogQGNsYXNzXG4gICAqIEBhY2Nlc3MgcHVibGljXG4gICAqL1xuXG4gIHZhciBNb2Rlcm5penJQcm90byA9IHtcbiAgICAvLyBUaGUgY3VycmVudCB2ZXJzaW9uLCBkdW1teVxuICAgIF92ZXJzaW9uOiAnMy4yLjAgKGJyb3dzZXJuaXpyIDIuMC4xKScsXG5cbiAgICAvLyBBbnkgc2V0dGluZ3MgdGhhdCBkb24ndCB3b3JrIGFzIHNlcGFyYXRlIG1vZHVsZXNcbiAgICAvLyBjYW4gZ28gaW4gaGVyZSBhcyBjb25maWd1cmF0aW9uLlxuICAgIF9jb25maWc6IHtcbiAgICAgICdjbGFzc1ByZWZpeCcgOiAnJyxcbiAgICAgICdlbmFibGVDbGFzc2VzJyA6IHRydWUsXG4gICAgICAnZW5hYmxlSlNDbGFzcycgOiB0cnVlLFxuICAgICAgJ3VzZVByZWZpeGVzJyA6IHRydWVcbiAgICB9LFxuXG4gICAgLy8gUXVldWUgb2YgdGVzdHNcbiAgICBfcTogW10sXG5cbiAgICAvLyBTdHViIHRoZXNlIGZvciBwZW9wbGUgd2hvIGFyZSBsaXN0ZW5pbmdcbiAgICBvbjogZnVuY3Rpb24odGVzdCwgY2IpIHtcbiAgICAgIC8vIEkgZG9uJ3QgcmVhbGx5IHRoaW5rIHBlb3BsZSBzaG91bGQgZG8gdGhpcywgYnV0IHdlIGNhblxuICAgICAgLy8gc2FmZSBndWFyZCBpdCBhIGJpdC5cbiAgICAgIC8vIC0tIE5PVEU6OiB0aGlzIGdldHMgV0FZIG92ZXJyaWRkZW4gaW4gc3JjL2FkZFRlc3QgZm9yIGFjdHVhbCBhc3luYyB0ZXN0cy5cbiAgICAgIC8vIFRoaXMgaXMgaW4gY2FzZSBwZW9wbGUgbGlzdGVuIHRvIHN5bmNocm9ub3VzIHRlc3RzLiBJIHdvdWxkIGxlYXZlIGl0IG91dCxcbiAgICAgIC8vIGJ1dCB0aGUgY29kZSB0byAqZGlzYWxsb3cqIHN5bmMgdGVzdHMgaW4gdGhlIHJlYWwgdmVyc2lvbiBvZiB0aGlzXG4gICAgICAvLyBmdW5jdGlvbiBpcyBhY3R1YWxseSBsYXJnZXIgdGhhbiB0aGlzLlxuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgY2Ioc2VsZlt0ZXN0XSk7XG4gICAgICB9LCAwKTtcbiAgICB9LFxuXG4gICAgYWRkVGVzdDogZnVuY3Rpb24obmFtZSwgZm4sIG9wdGlvbnMpIHtcbiAgICAgIHRlc3RzLnB1c2goe25hbWUgOiBuYW1lLCBmbiA6IGZuLCBvcHRpb25zIDogb3B0aW9uc30pO1xuICAgIH0sXG5cbiAgICBhZGRBc3luY1Rlc3Q6IGZ1bmN0aW9uKGZuKSB7XG4gICAgICB0ZXN0cy5wdXNoKHtuYW1lIDogbnVsbCwgZm4gOiBmbn0pO1xuICAgIH1cbiAgfTtcblxuICBtb2R1bGUuZXhwb3J0cyA9IE1vZGVybml6clByb3RvO1xuXG4iLCJcbiAgdmFyIGNsYXNzZXMgPSBbXTtcbiAgbW9kdWxlLmV4cG9ydHMgPSBjbGFzc2VzO1xuXG4iLCJ2YXIgaXNTVkcgPSByZXF1aXJlKCcuL2lzU1ZHLmpzJyk7XG4gIC8qKlxuICAgKiBjcmVhdGVFbGVtZW50IGlzIGEgY29udmVuaWVuY2Ugd3JhcHBlciBhcm91bmQgZG9jdW1lbnQuY3JlYXRlRWxlbWVudC4gU2luY2Ugd2VcbiAgICogdXNlIGNyZWF0ZUVsZW1lbnQgYWxsIG92ZXIgdGhlIHBsYWNlLCB0aGlzIGFsbG93cyBmb3IgKHNsaWdodGx5KSBzbWFsbGVyIGNvZGVcbiAgICogYXMgd2VsbCBhcyBhYnN0cmFjdGluZyBhd2F5IGlzc3VlcyB3aXRoIGNyZWF0aW5nIGVsZW1lbnRzIGluIGNvbnRleHRzIG90aGVyIHRoYW5cbiAgICogSFRNTCBkb2N1bWVudHMgKGUuZy4gU1ZHIGRvY3VtZW50cykuXG4gICAqXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKiBAZnVuY3Rpb24gY3JlYXRlRWxlbWVudFxuICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnR8U1ZHRWxlbWVudH0gQW4gSFRNTCBvciBTVkcgZWxlbWVudFxuICAgKi9cblxuICBmdW5jdGlvbiBjcmVhdGVFbGVtZW50KCkge1xuICAgIGlmICh0eXBlb2YgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgLy8gVGhpcyBpcyB0aGUgY2FzZSBpbiBJRTcsIHdoZXJlIHRoZSB0eXBlIG9mIGNyZWF0ZUVsZW1lbnQgaXMgXCJvYmplY3RcIi5cbiAgICAgIC8vIEZvciB0aGlzIHJlYXNvbiwgd2UgY2Fubm90IGNhbGwgYXBwbHkoKSBhcyBPYmplY3QgaXMgbm90IGEgRnVuY3Rpb24uXG4gICAgICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChhcmd1bWVudHNbMF0pO1xuICAgIH0gZWxzZSBpZiAoaXNTVkcpIHtcbiAgICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMuY2FsbChkb2N1bWVudCwgJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgYXJndW1lbnRzWzBdKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQuYXBwbHkoZG9jdW1lbnQsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9XG5cbiAgbW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVFbGVtZW50O1xuXG4iLCJcbiAgLyoqXG4gICAqIGRvY0VsZW1lbnQgaXMgYSBjb252ZW5pZW5jZSB3cmFwcGVyIHRvIGdyYWIgdGhlIHJvb3QgZWxlbWVudCBvZiB0aGUgZG9jdW1lbnRcbiAgICpcbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqIEByZXR1cm5zIHtIVE1MRWxlbWVudHxTVkdFbGVtZW50fSBUaGUgcm9vdCBlbGVtZW50IG9mIHRoZSBkb2N1bWVudFxuICAgKi9cblxuICB2YXIgZG9jRWxlbWVudCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcbiAgbW9kdWxlLmV4cG9ydHMgPSBkb2NFbGVtZW50O1xuXG4iLCJ2YXIgY3JlYXRlRWxlbWVudCA9IHJlcXVpcmUoJy4vY3JlYXRlRWxlbWVudC5qcycpO1xudmFyIGlzU1ZHID0gcmVxdWlyZSgnLi9pc1NWRy5qcycpO1xuICAvKipcbiAgICogZ2V0Qm9keSByZXR1cm5zIHRoZSBib2R5IG9mIGEgZG9jdW1lbnQsIG9yIGFuIGVsZW1lbnQgdGhhdCBjYW4gc3RhbmQgaW4gZm9yXG4gICAqIHRoZSBib2R5IGlmIGEgcmVhbCBib2R5IGRvZXMgbm90IGV4aXN0XG4gICAqXG4gICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgKiBAZnVuY3Rpb24gZ2V0Qm9keVxuICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnR8U1ZHRWxlbWVudH0gUmV0dXJucyB0aGUgcmVhbCBib2R5IG9mIGEgZG9jdW1lbnQsIG9yIGFuXG4gICAqIGFydGlmaWNpYWxseSBjcmVhdGVkIGVsZW1lbnQgdGhhdCBzdGFuZHMgaW4gZm9yIHRoZSBib2R5XG4gICAqL1xuXG4gIGZ1bmN0aW9uIGdldEJvZHkoKSB7XG4gICAgLy8gQWZ0ZXIgcGFnZSBsb2FkIGluamVjdGluZyBhIGZha2UgYm9keSBkb2Vzbid0IHdvcmsgc28gY2hlY2sgaWYgYm9keSBleGlzdHNcbiAgICB2YXIgYm9keSA9IGRvY3VtZW50LmJvZHk7XG5cbiAgICBpZiAoIWJvZHkpIHtcbiAgICAgIC8vIENhbid0IHVzZSB0aGUgcmVhbCBib2R5IGNyZWF0ZSBhIGZha2Ugb25lLlxuICAgICAgYm9keSA9IGNyZWF0ZUVsZW1lbnQoaXNTVkcgPyAnc3ZnJyA6ICdib2R5Jyk7XG4gICAgICBib2R5LmZha2UgPSB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBib2R5O1xuICB9XG5cbiAgbW9kdWxlLmV4cG9ydHMgPSBnZXRCb2R5O1xuXG4iLCJ2YXIgTW9kZXJuaXpyUHJvdG8gPSByZXF1aXJlKCcuL01vZGVybml6clByb3RvLmpzJyk7XG52YXIgZG9jRWxlbWVudCA9IHJlcXVpcmUoJy4vZG9jRWxlbWVudC5qcycpO1xudmFyIGNyZWF0ZUVsZW1lbnQgPSByZXF1aXJlKCcuL2NyZWF0ZUVsZW1lbnQuanMnKTtcbnZhciBnZXRCb2R5ID0gcmVxdWlyZSgnLi9nZXRCb2R5LmpzJyk7XG4gIC8qKlxuICAgKiBpbmplY3RFbGVtZW50V2l0aFN0eWxlcyBpbmplY3RzIGFuIGVsZW1lbnQgd2l0aCBzdHlsZSBlbGVtZW50IGFuZCBzb21lIENTUyBydWxlc1xuICAgKlxuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICogQGZ1bmN0aW9uIGluamVjdEVsZW1lbnRXaXRoU3R5bGVzXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBydWxlIC0gU3RyaW5nIHJlcHJlc2VudGluZyBhIGNzcyBydWxlXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIC0gQSBmdW5jdGlvbiB0aGF0IGlzIHVzZWQgdG8gdGVzdCB0aGUgaW5qZWN0ZWQgZWxlbWVudFxuICAgKiBAcGFyYW0ge251bWJlcn0gW25vZGVzXSAtIEFuIGludGVnZXIgcmVwcmVzZW50aW5nIHRoZSBudW1iZXIgb2YgYWRkaXRpb25hbCBub2RlcyB5b3Ugd2FudCBpbmplY3RlZFxuICAgKiBAcGFyYW0ge3N0cmluZ1tdfSBbdGVzdG5hbWVzXSAtIEFuIGFycmF5IG9mIHN0cmluZ3MgdGhhdCBhcmUgdXNlZCBhcyBpZHMgZm9yIHRoZSBhZGRpdGlvbmFsIG5vZGVzXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cblxuICBmdW5jdGlvbiBpbmplY3RFbGVtZW50V2l0aFN0eWxlcyhydWxlLCBjYWxsYmFjaywgbm9kZXMsIHRlc3RuYW1lcykge1xuICAgIHZhciBtb2QgPSAnbW9kZXJuaXpyJztcbiAgICB2YXIgc3R5bGU7XG4gICAgdmFyIHJldDtcbiAgICB2YXIgbm9kZTtcbiAgICB2YXIgZG9jT3ZlcmZsb3c7XG4gICAgdmFyIGRpdiA9IGNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHZhciBib2R5ID0gZ2V0Qm9keSgpO1xuXG4gICAgaWYgKHBhcnNlSW50KG5vZGVzLCAxMCkpIHtcbiAgICAgIC8vIEluIG9yZGVyIG5vdCB0byBnaXZlIGZhbHNlIHBvc2l0aXZlcyB3ZSBjcmVhdGUgYSBub2RlIGZvciBlYWNoIHRlc3RcbiAgICAgIC8vIFRoaXMgYWxzbyBhbGxvd3MgdGhlIG1ldGhvZCB0byBzY2FsZSBmb3IgdW5zcGVjaWZpZWQgdXNlc1xuICAgICAgd2hpbGUgKG5vZGVzLS0pIHtcbiAgICAgICAgbm9kZSA9IGNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBub2RlLmlkID0gdGVzdG5hbWVzID8gdGVzdG5hbWVzW25vZGVzXSA6IG1vZCArIChub2RlcyArIDEpO1xuICAgICAgICBkaXYuYXBwZW5kQ2hpbGQobm9kZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgc3R5bGUgPSBjcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgIHN0eWxlLnR5cGUgPSAndGV4dC9jc3MnO1xuICAgIHN0eWxlLmlkID0gJ3MnICsgbW9kO1xuXG4gICAgLy8gSUU2IHdpbGwgZmFsc2UgcG9zaXRpdmUgb24gc29tZSB0ZXN0cyBkdWUgdG8gdGhlIHN0eWxlIGVsZW1lbnQgaW5zaWRlIHRoZSB0ZXN0IGRpdiBzb21laG93IGludGVyZmVyaW5nIG9mZnNldEhlaWdodCwgc28gaW5zZXJ0IGl0IGludG8gYm9keSBvciBmYWtlYm9keS5cbiAgICAvLyBPcGVyYSB3aWxsIGFjdCBhbGwgcXVpcmt5IHdoZW4gaW5qZWN0aW5nIGVsZW1lbnRzIGluIGRvY3VtZW50RWxlbWVudCB3aGVuIHBhZ2UgaXMgc2VydmVkIGFzIHhtbCwgbmVlZHMgZmFrZWJvZHkgdG9vLiAjMjcwXG4gICAgKCFib2R5LmZha2UgPyBkaXYgOiBib2R5KS5hcHBlbmRDaGlsZChzdHlsZSk7XG4gICAgYm9keS5hcHBlbmRDaGlsZChkaXYpO1xuXG4gICAgaWYgKHN0eWxlLnN0eWxlU2hlZXQpIHtcbiAgICAgIHN0eWxlLnN0eWxlU2hlZXQuY3NzVGV4dCA9IHJ1bGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0eWxlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHJ1bGUpKTtcbiAgICB9XG4gICAgZGl2LmlkID0gbW9kO1xuXG4gICAgaWYgKGJvZHkuZmFrZSkge1xuICAgICAgLy9hdm9pZCBjcmFzaGluZyBJRTgsIGlmIGJhY2tncm91bmQgaW1hZ2UgaXMgdXNlZFxuICAgICAgYm9keS5zdHlsZS5iYWNrZ3JvdW5kID0gJyc7XG4gICAgICAvL1NhZmFyaSA1LjEzLzUuMS40IE9TWCBzdG9wcyBsb2FkaW5nIGlmIDo6LXdlYmtpdC1zY3JvbGxiYXIgaXMgdXNlZCBhbmQgc2Nyb2xsYmFycyBhcmUgdmlzaWJsZVxuICAgICAgYm9keS5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nO1xuICAgICAgZG9jT3ZlcmZsb3cgPSBkb2NFbGVtZW50LnN0eWxlLm92ZXJmbG93O1xuICAgICAgZG9jRWxlbWVudC5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nO1xuICAgICAgZG9jRWxlbWVudC5hcHBlbmRDaGlsZChib2R5KTtcbiAgICB9XG5cbiAgICByZXQgPSBjYWxsYmFjayhkaXYsIHJ1bGUpO1xuICAgIC8vIElmIHRoaXMgaXMgZG9uZSBhZnRlciBwYWdlIGxvYWQgd2UgZG9uJ3Qgd2FudCB0byByZW1vdmUgdGhlIGJvZHkgc28gY2hlY2sgaWYgYm9keSBleGlzdHNcbiAgICBpZiAoYm9keS5mYWtlKSB7XG4gICAgICBib2R5LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoYm9keSk7XG4gICAgICBkb2NFbGVtZW50LnN0eWxlLm92ZXJmbG93ID0gZG9jT3ZlcmZsb3c7XG4gICAgICAvLyBUcmlnZ2VyIGxheW91dCBzbyBraW5ldGljIHNjcm9sbGluZyBpc24ndCBkaXNhYmxlZCBpbiBpT1M2K1xuICAgICAgZG9jRWxlbWVudC5vZmZzZXRIZWlnaHQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRpdi5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGRpdik7XG4gICAgfVxuXG4gICAgcmV0dXJuICEhcmV0O1xuXG4gIH1cblxuICBtb2R1bGUuZXhwb3J0cyA9IGluamVjdEVsZW1lbnRXaXRoU3R5bGVzO1xuXG4iLCJcbiAgLyoqXG4gICAqIGlzIHJldHVybnMgYSBib29sZWFuIGlmIHRoZSB0eXBlb2YgYW4gb2JqIGlzIGV4YWN0bHkgdHlwZS5cbiAgICpcbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqIEBmdW5jdGlvbiBpc1xuICAgKiBAcGFyYW0geyp9IG9iaiAtIEEgdGhpbmcgd2Ugd2FudCB0byBjaGVjayB0aGUgdHlwZSBvZlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdHlwZSAtIEEgc3RyaW5nIHRvIGNvbXBhcmUgdGhlIHR5cGVvZiBhZ2FpbnN0XG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cblxuICBmdW5jdGlvbiBpcyhvYmosIHR5cGUpIHtcbiAgICByZXR1cm4gdHlwZW9mIG9iaiA9PT0gdHlwZTtcbiAgfVxuICBtb2R1bGUuZXhwb3J0cyA9IGlzO1xuXG4iLCJ2YXIgZG9jRWxlbWVudCA9IHJlcXVpcmUoJy4vZG9jRWxlbWVudC5qcycpO1xuICAvKipcbiAgICogQSBjb252ZW5pZW5jZSBoZWxwZXIgdG8gY2hlY2sgaWYgdGhlIGRvY3VtZW50IHdlIGFyZSBydW5uaW5nIGluIGlzIGFuIFNWRyBkb2N1bWVudFxuICAgKlxuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuXG4gIHZhciBpc1NWRyA9IGRvY0VsZW1lbnQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ3N2Zyc7XG4gIG1vZHVsZS5leHBvcnRzID0gaXNTVkc7XG5cbiIsInZhciBNb2Rlcm5penJQcm90byA9IHJlcXVpcmUoJy4vTW9kZXJuaXpyUHJvdG8uanMnKTtcbiAgLyoqXG4gICAqIExpc3Qgb2YgcHJvcGVydHkgdmFsdWVzIHRvIHNldCBmb3IgY3NzIHRlc3RzLiBTZWUgdGlja2V0ICMyMVxuICAgKiBodHRwOi8vZ2l0LmlvL3ZVR2w0XG4gICAqXG4gICAqIEBtZW1iZXJvZiBNb2Rlcm5penJcbiAgICogQG5hbWUgTW9kZXJuaXpyLl9wcmVmaXhlc1xuICAgKiBAb3B0aW9uTmFtZSBNb2Rlcm5penIuX3ByZWZpeGVzXG4gICAqIEBvcHRpb25Qcm9wIHByZWZpeGVzXG4gICAqIEBhY2Nlc3MgcHVibGljXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIE1vZGVybml6ci5fcHJlZml4ZXMgaXMgdGhlIGludGVybmFsIGxpc3Qgb2YgcHJlZml4ZXMgdGhhdCB3ZSB0ZXN0IGFnYWluc3RcbiAgICogaW5zaWRlIG9mIHRoaW5ncyBsaWtlIFtwcmVmaXhlZF0oI21vZGVybml6ci1wcmVmaXhlZCkgYW5kIFtwcmVmaXhlZENTU10oIy1jb2RlLW1vZGVybml6ci1wcmVmaXhlZGNzcykuIEl0IGlzIHNpbXBseVxuICAgKiBhbiBhcnJheSBvZiBrZWJhYi1jYXNlIHZlbmRvciBwcmVmaXhlcyB5b3UgY2FuIHVzZSB3aXRoaW4geW91ciBjb2RlLlxuICAgKlxuICAgKiBTb21lIGNvbW1vbiB1c2UgY2FzZXMgaW5jbHVkZVxuICAgKlxuICAgKiBHZW5lcmF0aW5nIGFsbCBwb3NzaWJsZSBwcmVmaXhlZCB2ZXJzaW9uIG9mIGEgQ1NTIHByb3BlcnR5XG4gICAqIGBgYGpzXG4gICAqIHZhciBydWxlID0gTW9kZXJuaXpyLl9wcmVmaXhlcy5qb2luKCd0cmFuc2Zvcm06IHJvdGF0ZSgyMGRlZyk7ICcpO1xuICAgKlxuICAgKiBydWxlID09PSAndHJhbnNmb3JtOiByb3RhdGUoMjBkZWcpOyB3ZWJraXQtdHJhbnNmb3JtOiByb3RhdGUoMjBkZWcpOyBtb3otdHJhbnNmb3JtOiByb3RhdGUoMjBkZWcpOyBvLXRyYW5zZm9ybTogcm90YXRlKDIwZGVnKTsgbXMtdHJhbnNmb3JtOiByb3RhdGUoMjBkZWcpOydcbiAgICogYGBgXG4gICAqXG4gICAqIEdlbmVyYXRpbmcgYWxsIHBvc3NpYmxlIHByZWZpeGVkIHZlcnNpb24gb2YgYSBDU1MgdmFsdWVcbiAgICogYGBganNcbiAgICogcnVsZSA9ICdkaXNwbGF5OicgKyAgTW9kZXJuaXpyLl9wcmVmaXhlcy5qb2luKCdmbGV4OyBkaXNwbGF5OicpICsgJ2ZsZXgnO1xuICAgKlxuICAgKiBydWxlID09PSAnZGlzcGxheTpmbGV4OyBkaXNwbGF5Oi13ZWJraXQtZmxleDsgZGlzcGxheTotbW96LWZsZXg7IGRpc3BsYXk6LW8tZmxleDsgZGlzcGxheTotbXMtZmxleDsgZGlzcGxheTpmbGV4J1xuICAgKiBgYGBcbiAgICovXG5cbiAgdmFyIHByZWZpeGVzID0gKE1vZGVybml6clByb3RvLl9jb25maWcudXNlUHJlZml4ZXMgPyAnIC13ZWJraXQtIC1tb3otIC1vLSAtbXMtICcuc3BsaXQoJyAnKSA6IFtdKTtcblxuICAvLyBleHBvc2UgdGhlc2UgZm9yIHRoZSBwbHVnaW4gQVBJLiBMb29rIGluIHRoZSBzb3VyY2UgZm9yIGhvdyB0byBqb2luKCkgdGhlbSBhZ2FpbnN0IHlvdXIgaW5wdXRcbiAgTW9kZXJuaXpyUHJvdG8uX3ByZWZpeGVzID0gcHJlZml4ZXM7XG5cbiAgbW9kdWxlLmV4cG9ydHMgPSBwcmVmaXhlcztcblxuIiwidmFyIE1vZGVybml6ciA9IHJlcXVpcmUoJy4vTW9kZXJuaXpyLmpzJyk7XG52YXIgZG9jRWxlbWVudCA9IHJlcXVpcmUoJy4vZG9jRWxlbWVudC5qcycpO1xudmFyIGlzU1ZHID0gcmVxdWlyZSgnLi9pc1NWRy5qcycpO1xuICAvKipcbiAgICogc2V0Q2xhc3NlcyB0YWtlcyBhbiBhcnJheSBvZiBjbGFzcyBuYW1lcyBhbmQgYWRkcyB0aGVtIHRvIHRoZSByb290IGVsZW1lbnRcbiAgICpcbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqIEBmdW5jdGlvbiBzZXRDbGFzc2VzXG4gICAqIEBwYXJhbSB7c3RyaW5nW119IGNsYXNzZXMgLSBBcnJheSBvZiBjbGFzcyBuYW1lc1xuICAgKi9cblxuICAvLyBQYXNzIGluIGFuIGFuZCBhcnJheSBvZiBjbGFzcyBuYW1lcywgZS5nLjpcbiAgLy8gIFsnbm8td2VicCcsICdib3JkZXJyYWRpdXMnLCAuLi5dXG4gIGZ1bmN0aW9uIHNldENsYXNzZXMoY2xhc3Nlcykge1xuICAgIHZhciBjbGFzc05hbWUgPSBkb2NFbGVtZW50LmNsYXNzTmFtZTtcbiAgICB2YXIgY2xhc3NQcmVmaXggPSBNb2Rlcm5penIuX2NvbmZpZy5jbGFzc1ByZWZpeCB8fCAnJztcblxuICAgIGlmIChpc1NWRykge1xuICAgICAgY2xhc3NOYW1lID0gY2xhc3NOYW1lLmJhc2VWYWw7XG4gICAgfVxuXG4gICAgLy8gQ2hhbmdlIGBuby1qc2AgdG8gYGpzYCAoaW5kZXBlbmRlbnRseSBvZiB0aGUgYGVuYWJsZUNsYXNzZXNgIG9wdGlvbilcbiAgICAvLyBIYW5kbGUgY2xhc3NQcmVmaXggb24gdGhpcyB0b29cbiAgICBpZiAoTW9kZXJuaXpyLl9jb25maWcuZW5hYmxlSlNDbGFzcykge1xuICAgICAgdmFyIHJlSlMgPSBuZXcgUmVnRXhwKCcoXnxcXFxccyknICsgY2xhc3NQcmVmaXggKyAnbm8tanMoXFxcXHN8JCknKTtcbiAgICAgIGNsYXNzTmFtZSA9IGNsYXNzTmFtZS5yZXBsYWNlKHJlSlMsICckMScgKyBjbGFzc1ByZWZpeCArICdqcyQyJyk7XG4gICAgfVxuXG4gICAgaWYgKE1vZGVybml6ci5fY29uZmlnLmVuYWJsZUNsYXNzZXMpIHtcbiAgICAgIC8vIEFkZCB0aGUgbmV3IGNsYXNzZXNcbiAgICAgIGNsYXNzTmFtZSArPSAnICcgKyBjbGFzc1ByZWZpeCArIGNsYXNzZXMuam9pbignICcgKyBjbGFzc1ByZWZpeCk7XG4gICAgICBpc1NWRyA/IGRvY0VsZW1lbnQuY2xhc3NOYW1lLmJhc2VWYWwgPSBjbGFzc05hbWUgOiBkb2NFbGVtZW50LmNsYXNzTmFtZSA9IGNsYXNzTmFtZTtcbiAgICB9XG5cbiAgfVxuXG4gIG1vZHVsZS5leHBvcnRzID0gc2V0Q2xhc3NlcztcblxuIiwidmFyIHRlc3RzID0gcmVxdWlyZSgnLi90ZXN0cy5qcycpO1xudmFyIE1vZGVybml6ciA9IHJlcXVpcmUoJy4vTW9kZXJuaXpyLmpzJyk7XG52YXIgY2xhc3NlcyA9IHJlcXVpcmUoJy4vY2xhc3Nlcy5qcycpO1xudmFyIGlzID0gcmVxdWlyZSgnLi9pcy5qcycpO1xuICAvKipcbiAgICogUnVuIHRocm91Z2ggYWxsIHRlc3RzIGFuZCBkZXRlY3QgdGhlaXIgc3VwcG9ydCBpbiB0aGUgY3VycmVudCBVQS5cbiAgICpcbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqL1xuXG4gIGZ1bmN0aW9uIHRlc3RSdW5uZXIoKSB7XG4gICAgdmFyIGZlYXR1cmVOYW1lcztcbiAgICB2YXIgZmVhdHVyZTtcbiAgICB2YXIgYWxpYXNJZHg7XG4gICAgdmFyIHJlc3VsdDtcbiAgICB2YXIgbmFtZUlkeDtcbiAgICB2YXIgZmVhdHVyZU5hbWU7XG4gICAgdmFyIGZlYXR1cmVOYW1lU3BsaXQ7XG5cbiAgICBmb3IgKHZhciBmZWF0dXJlSWR4IGluIHRlc3RzKSB7XG4gICAgICBpZiAodGVzdHMuaGFzT3duUHJvcGVydHkoZmVhdHVyZUlkeCkpIHtcbiAgICAgICAgZmVhdHVyZU5hbWVzID0gW107XG4gICAgICAgIGZlYXR1cmUgPSB0ZXN0c1tmZWF0dXJlSWR4XTtcbiAgICAgICAgLy8gcnVuIHRoZSB0ZXN0LCB0aHJvdyB0aGUgcmV0dXJuIHZhbHVlIGludG8gdGhlIE1vZGVybml6cixcbiAgICAgICAgLy8gdGhlbiBiYXNlZCBvbiB0aGF0IGJvb2xlYW4sIGRlZmluZSBhbiBhcHByb3ByaWF0ZSBjbGFzc05hbWVcbiAgICAgICAgLy8gYW5kIHB1c2ggaXQgaW50byBhbiBhcnJheSBvZiBjbGFzc2VzIHdlJ2xsIGpvaW4gbGF0ZXIuXG4gICAgICAgIC8vXG4gICAgICAgIC8vIElmIHRoZXJlIGlzIG5vIG5hbWUsIGl0J3MgYW4gJ2FzeW5jJyB0ZXN0IHRoYXQgaXMgcnVuLFxuICAgICAgICAvLyBidXQgbm90IGRpcmVjdGx5IGFkZGVkIHRvIHRoZSBvYmplY3QuIFRoYXQgc2hvdWxkXG4gICAgICAgIC8vIGJlIGRvbmUgd2l0aCBhIHBvc3QtcnVuIGFkZFRlc3QgY2FsbC5cbiAgICAgICAgaWYgKGZlYXR1cmUubmFtZSkge1xuICAgICAgICAgIGZlYXR1cmVOYW1lcy5wdXNoKGZlYXR1cmUubmFtZS50b0xvd2VyQ2FzZSgpKTtcblxuICAgICAgICAgIGlmIChmZWF0dXJlLm9wdGlvbnMgJiYgZmVhdHVyZS5vcHRpb25zLmFsaWFzZXMgJiYgZmVhdHVyZS5vcHRpb25zLmFsaWFzZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAvLyBBZGQgYWxsIHRoZSBhbGlhc2VzIGludG8gdGhlIG5hbWVzIGxpc3RcbiAgICAgICAgICAgIGZvciAoYWxpYXNJZHggPSAwOyBhbGlhc0lkeCA8IGZlYXR1cmUub3B0aW9ucy5hbGlhc2VzLmxlbmd0aDsgYWxpYXNJZHgrKykge1xuICAgICAgICAgICAgICBmZWF0dXJlTmFtZXMucHVzaChmZWF0dXJlLm9wdGlvbnMuYWxpYXNlc1thbGlhc0lkeF0udG9Mb3dlckNhc2UoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gUnVuIHRoZSB0ZXN0LCBvciB1c2UgdGhlIHJhdyB2YWx1ZSBpZiBpdCdzIG5vdCBhIGZ1bmN0aW9uXG4gICAgICAgIHJlc3VsdCA9IGlzKGZlYXR1cmUuZm4sICdmdW5jdGlvbicpID8gZmVhdHVyZS5mbigpIDogZmVhdHVyZS5mbjtcblxuXG4gICAgICAgIC8vIFNldCBlYWNoIG9mIHRoZSBuYW1lcyBvbiB0aGUgTW9kZXJuaXpyIG9iamVjdFxuICAgICAgICBmb3IgKG5hbWVJZHggPSAwOyBuYW1lSWR4IDwgZmVhdHVyZU5hbWVzLmxlbmd0aDsgbmFtZUlkeCsrKSB7XG4gICAgICAgICAgZmVhdHVyZU5hbWUgPSBmZWF0dXJlTmFtZXNbbmFtZUlkeF07XG4gICAgICAgICAgLy8gU3VwcG9ydCBkb3QgcHJvcGVydGllcyBhcyBzdWIgdGVzdHMuIFdlIGRvbid0IGRvIGNoZWNraW5nIHRvIG1ha2Ugc3VyZVxuICAgICAgICAgIC8vIHRoYXQgdGhlIGltcGxpZWQgcGFyZW50IHRlc3RzIGhhdmUgYmVlbiBhZGRlZC4gWW91IG11c3QgY2FsbCB0aGVtIGluXG4gICAgICAgICAgLy8gb3JkZXIgKGVpdGhlciBpbiB0aGUgdGVzdCwgb3IgbWFrZSB0aGUgcGFyZW50IHRlc3QgYSBkZXBlbmRlbmN5KS5cbiAgICAgICAgICAvL1xuICAgICAgICAgIC8vIENhcCBpdCB0byBUV08gdG8gbWFrZSB0aGUgbG9naWMgc2ltcGxlIGFuZCBiZWNhdXNlIHdobyBuZWVkcyB0aGF0IGtpbmQgb2Ygc3VidGVzdGluZ1xuICAgICAgICAgIC8vIGhhc2h0YWcgZmFtb3VzIGxhc3Qgd29yZHNcbiAgICAgICAgICBmZWF0dXJlTmFtZVNwbGl0ID0gZmVhdHVyZU5hbWUuc3BsaXQoJy4nKTtcblxuICAgICAgICAgIGlmIChmZWF0dXJlTmFtZVNwbGl0Lmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgTW9kZXJuaXpyW2ZlYXR1cmVOYW1lU3BsaXRbMF1dID0gcmVzdWx0O1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBjYXN0IHRvIGEgQm9vbGVhbiwgaWYgbm90IG9uZSBhbHJlYWR5XG4gICAgICAgICAgICAvKiBqc2hpbnQgLVcwNTMgKi9cbiAgICAgICAgICAgIGlmIChNb2Rlcm5penJbZmVhdHVyZU5hbWVTcGxpdFswXV0gJiYgIShNb2Rlcm5penJbZmVhdHVyZU5hbWVTcGxpdFswXV0gaW5zdGFuY2VvZiBCb29sZWFuKSkge1xuICAgICAgICAgICAgICBNb2Rlcm5penJbZmVhdHVyZU5hbWVTcGxpdFswXV0gPSBuZXcgQm9vbGVhbihNb2Rlcm5penJbZmVhdHVyZU5hbWVTcGxpdFswXV0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBNb2Rlcm5penJbZmVhdHVyZU5hbWVTcGxpdFswXV1bZmVhdHVyZU5hbWVTcGxpdFsxXV0gPSByZXN1bHQ7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY2xhc3Nlcy5wdXNoKChyZXN1bHQgPyAnJyA6ICduby0nKSArIGZlYXR1cmVOYW1lU3BsaXQuam9pbignLScpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBtb2R1bGUuZXhwb3J0cyA9IHRlc3RSdW5uZXI7XG5cbiIsInZhciBNb2Rlcm5penJQcm90byA9IHJlcXVpcmUoJy4vTW9kZXJuaXpyUHJvdG8uanMnKTtcbnZhciBpbmplY3RFbGVtZW50V2l0aFN0eWxlcyA9IHJlcXVpcmUoJy4vaW5qZWN0RWxlbWVudFdpdGhTdHlsZXMuanMnKTtcbiAgLyoqXG4gICAqIHRlc3RTdHlsZXMgaW5qZWN0cyBhbiBlbGVtZW50IHdpdGggc3R5bGUgZWxlbWVudCBhbmQgc29tZSBDU1MgcnVsZXNcbiAgICpcbiAgICogQG1lbWJlcm9mIE1vZGVybml6clxuICAgKiBAbmFtZSBNb2Rlcm5penIudGVzdFN0eWxlc1xuICAgKiBAb3B0aW9uTmFtZSBNb2Rlcm5penIudGVzdFN0eWxlcygpXG4gICAqIEBvcHRpb25Qcm9wIHRlc3RTdHlsZXNcbiAgICogQGFjY2VzcyBwdWJsaWNcbiAgICogQGZ1bmN0aW9uIHRlc3RTdHlsZXNcbiAgICogQHBhcmFtIHtzdHJpbmd9IHJ1bGUgLSBTdHJpbmcgcmVwcmVzZW50aW5nIGEgY3NzIHJ1bGVcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgLSBBIGZ1bmN0aW9uIHRoYXQgaXMgdXNlZCB0byB0ZXN0IHRoZSBpbmplY3RlZCBlbGVtZW50XG4gICAqIEBwYXJhbSB7bnVtYmVyfSBbbm9kZXNdIC0gQW4gaW50ZWdlciByZXByZXNlbnRpbmcgdGhlIG51bWJlciBvZiBhZGRpdGlvbmFsIG5vZGVzIHlvdSB3YW50IGluamVjdGVkXG4gICAqIEBwYXJhbSB7c3RyaW5nW119IFt0ZXN0bmFtZXNdIC0gQW4gYXJyYXkgb2Ygc3RyaW5ncyB0aGF0IGFyZSB1c2VkIGFzIGlkcyBmb3IgdGhlIGFkZGl0aW9uYWwgbm9kZXNcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIGBNb2Rlcm5penIudGVzdFN0eWxlc2AgdGFrZXMgYSBDU1MgcnVsZSBhbmQgaW5qZWN0cyBpdCBvbnRvIHRoZSBjdXJyZW50IHBhZ2VcbiAgICogYWxvbmcgd2l0aCAocG9zc2libHkgbXVsdGlwbGUpIERPTSBlbGVtZW50cy4gVGhpcyBsZXRzIHlvdSBjaGVjayBmb3IgZmVhdHVyZXNcbiAgICogdGhhdCBjYW4gbm90IGJlIGRldGVjdGVkIGJ5IHNpbXBseSBjaGVja2luZyB0aGUgW0lETF0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9Nb3ppbGxhL0RldmVsb3Blcl9ndWlkZS9JbnRlcmZhY2VfZGV2ZWxvcG1lbnRfZ3VpZGUvSURMX2ludGVyZmFjZV9ydWxlcykuXG4gICAqXG4gICAqIGBgYGpzXG4gICAqIE1vZGVybml6ci50ZXN0U3R5bGVzKCcjbW9kZXJuaXpyIHsgd2lkdGg6IDlweDsgY29sb3I6IHBhcGF5YXdoaXA7IH0nLCBmdW5jdGlvbihlbGVtLCBydWxlKSB7XG4gICAqICAgLy8gZWxlbSBpcyB0aGUgZmlyc3QgRE9NIG5vZGUgaW4gdGhlIHBhZ2UgKGJ5IGRlZmF1bHQgI21vZGVybml6cilcbiAgICogICAvLyBydWxlIGlzIHRoZSBmaXJzdCBhcmd1bWVudCB5b3Ugc3VwcGxpZWQgLSB0aGUgQ1NTIHJ1bGUgaW4gc3RyaW5nIGZvcm1cbiAgICpcbiAgICogICBhZGRUZXN0KCd3aWR0aHdvcmtzJywgZWxlbS5zdHlsZS53aWR0aCA9PT0gJzlweCcpXG4gICAqIH0pO1xuICAgKiBgYGBcbiAgICpcbiAgICogSWYgeW91ciB0ZXN0IHJlcXVpcmVzIG11bHRpcGxlIG5vZGVzLCB5b3UgY2FuIGluY2x1ZGUgYSB0aGlyZCBhcmd1bWVudFxuICAgKiBpbmRpY2F0aW5nIGhvdyBtYW55IGFkZGl0aW9uYWwgZGl2IGVsZW1lbnRzIHRvIGluY2x1ZGUgb24gdGhlIHBhZ2UuIFRoZVxuICAgKiBhZGRpdGlvbmFsIG5vZGVzIGFyZSBpbmplY3RlZCBhcyBjaGlsZHJlbiBvZiB0aGUgYGVsZW1gIHRoYXQgaXMgcmV0dXJuZWQgYXNcbiAgICogdGhlIGZpcnN0IGFyZ3VtZW50IHRvIHRoZSBjYWxsYmFjay5cbiAgICpcbiAgICogYGBganNcbiAgICogTW9kZXJuaXpyLnRlc3RTdHlsZXMoJyNtb2Rlcm5penIge3dpZHRoOiAxcHh9OyAjbW9kZXJuaXpyMiB7d2lkdGg6IDJweH0nLCBmdW5jdGlvbihlbGVtKSB7XG4gICAqICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vZGVybml6cicpLnN0eWxlLndpZHRoID09PSAnMXB4JzsgLy8gdHJ1ZVxuICAgKiAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb2Rlcm5penIyJykuc3R5bGUud2lkdGggPT09ICcycHgnOyAvLyB0cnVlXG4gICAqICAgZWxlbS5maXJzdENoaWxkID09PSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW9kZXJuaXpyMicpOyAvLyB0cnVlXG4gICAqIH0sIDEpO1xuICAgKiBgYGBcbiAgICpcbiAgICogQnkgZGVmYXVsdCwgYWxsIG9mIHRoZSBhZGRpdGlvbmFsIGVsZW1lbnRzIGhhdmUgYW4gSUQgb2YgYG1vZGVybml6cltuXWAsIHdoZXJlXG4gICAqIGBuYCBpcyBpdHMgaW5kZXggKGUuZy4gdGhlIGZpcnN0IGFkZGl0aW9uYWwsIHNlY29uZCBvdmVyYWxsIGlzIGAjbW9kZXJuaXpyMmAsXG4gICAqIHRoZSBzZWNvbmQgYWRkaXRpb25hbCBpcyBgI21vZGVybml6cjNgLCBldGMuKS5cbiAgICogSWYgeW91IHdhbnQgdG8gaGF2ZSBtb3JlIG1lYW5pbmdmdWwgSURzIGZvciB5b3VyIGZ1bmN0aW9uLCB5b3UgY2FuIHByb3ZpZGVcbiAgICogdGhlbSBhcyB0aGUgZm91cnRoIGFyZ3VtZW50LCBhcyBhbiBhcnJheSBvZiBzdHJpbmdzXG4gICAqXG4gICAqIGBgYGpzXG4gICAqIE1vZGVybml6ci50ZXN0U3R5bGVzKCcjZm9vIHt3aWR0aDogMTBweH07ICNiYXIge2hlaWdodDogMjBweH0nLCBmdW5jdGlvbihlbGVtKSB7XG4gICAqICAgZWxlbS5maXJzdENoaWxkID09PSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZm9vJyk7IC8vIHRydWVcbiAgICogICBlbGVtLmxhc3RDaGlsZCA9PT0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2JhcicpOyAvLyB0cnVlXG4gICAqIH0sIDIsIFsnZm9vJywgJ2JhciddKTtcbiAgICogYGBgXG4gICAqXG4gICAqL1xuXG4gIHZhciB0ZXN0U3R5bGVzID0gTW9kZXJuaXpyUHJvdG8udGVzdFN0eWxlcyA9IGluamVjdEVsZW1lbnRXaXRoU3R5bGVzO1xuICBtb2R1bGUuZXhwb3J0cyA9IHRlc3RTdHlsZXM7XG5cbiIsIlxuICB2YXIgdGVzdHMgPSBbXTtcbiAgbW9kdWxlLmV4cG9ydHMgPSB0ZXN0cztcblxuIiwiLyohXG57XG4gIFwibmFtZVwiOiBcIlRvdWNoIEV2ZW50c1wiLFxuICBcInByb3BlcnR5XCI6IFwidG91Y2hldmVudHNcIixcbiAgXCJjYW5pdXNlXCIgOiBcInRvdWNoXCIsXG4gIFwidGFnc1wiOiBbXCJtZWRpYVwiLCBcImF0dHJpYnV0ZVwiXSxcbiAgXCJub3Rlc1wiOiBbe1xuICAgIFwibmFtZVwiOiBcIlRvdWNoIEV2ZW50cyBzcGVjXCIsXG4gICAgXCJocmVmXCI6IFwiaHR0cDovL3d3dy53My5vcmcvVFIvMjAxMy9XRC10b3VjaC1ldmVudHMtMjAxMzAxMjQvXCJcbiAgfV0sXG4gIFwid2FybmluZ3NcIjogW1xuICAgIFwiSW5kaWNhdGVzIGlmIHRoZSBicm93c2VyIHN1cHBvcnRzIHRoZSBUb3VjaCBFdmVudHMgc3BlYywgYW5kIGRvZXMgbm90IG5lY2Vzc2FyaWx5IHJlZmxlY3QgYSB0b3VjaHNjcmVlbiBkZXZpY2VcIlxuICBdLFxuICBcImtub3duQnVnc1wiOiBbXG4gICAgXCJGYWxzZS1wb3NpdGl2ZSBvbiBzb21lIGNvbmZpZ3VyYXRpb25zIG9mIE5va2lhIE45MDBcIixcbiAgICBcIkZhbHNlLXBvc2l0aXZlIG9uIHNvbWUgQmxhY2tCZXJyeSA2LjAgYnVpbGRzIOKAkyBodHRwczovL2dpdGh1Yi5jb20vTW9kZXJuaXpyL01vZGVybml6ci9pc3N1ZXMvMzcyI2lzc3VlY29tbWVudC0zMTEyNjk1XCJcbiAgXVxufVxuISovXG4vKiBET0NcbkluZGljYXRlcyBpZiB0aGUgYnJvd3NlciBzdXBwb3J0cyB0aGUgVzNDIFRvdWNoIEV2ZW50cyBBUEkuXG5cblRoaXMgKmRvZXMgbm90KiBuZWNlc3NhcmlseSByZWZsZWN0IGEgdG91Y2hzY3JlZW4gZGV2aWNlOlxuXG4qIE9sZGVyIHRvdWNoc2NyZWVuIGRldmljZXMgb25seSBlbXVsYXRlIG1vdXNlIGV2ZW50c1xuKiBNb2Rlcm4gSUUgdG91Y2ggZGV2aWNlcyBpbXBsZW1lbnQgdGhlIFBvaW50ZXIgRXZlbnRzIEFQSSBpbnN0ZWFkOiB1c2UgYE1vZGVybml6ci5wb2ludGVyZXZlbnRzYCB0byBkZXRlY3Qgc3VwcG9ydCBmb3IgdGhhdFxuKiBTb21lIGJyb3dzZXJzICYgT1Mgc2V0dXBzIG1heSBlbmFibGUgdG91Y2ggQVBJcyB3aGVuIG5vIHRvdWNoc2NyZWVuIGlzIGNvbm5lY3RlZFxuKiBGdXR1cmUgYnJvd3NlcnMgbWF5IGltcGxlbWVudCBvdGhlciBldmVudCBtb2RlbHMgZm9yIHRvdWNoIGludGVyYWN0aW9uc1xuXG5TZWUgdGhpcyBhcnRpY2xlOiBbWW91IENhbid0IERldGVjdCBBIFRvdWNoc2NyZWVuXShodHRwOi8vd3d3LnN0dWNveC5jb20vYmxvZy95b3UtY2FudC1kZXRlY3QtYS10b3VjaHNjcmVlbi8pLlxuXG5JdCdzIHJlY29tbWVuZGVkIHRvIGJpbmQgYm90aCBtb3VzZSBhbmQgdG91Y2gvcG9pbnRlciBldmVudHMgc2ltdWx0YW5lb3VzbHkg4oCTIHNlZSBbdGhpcyBIVE1MNSBSb2NrcyB0dXRvcmlhbF0oaHR0cDovL3d3dy5odG1sNXJvY2tzLmNvbS9lbi9tb2JpbGUvdG91Y2hhbmRtb3VzZS8pLlxuXG5UaGlzIHRlc3Qgd2lsbCBhbHNvIHJldHVybiBgdHJ1ZWAgZm9yIEZpcmVmb3ggNCBNdWx0aXRvdWNoIHN1cHBvcnQuXG4qL1xudmFyIE1vZGVybml6ciA9IHJlcXVpcmUoJy4vLi4vbGliL01vZGVybml6ci5qcycpO1xudmFyIHByZWZpeGVzID0gcmVxdWlyZSgnLi8uLi9saWIvcHJlZml4ZXMuanMnKTtcbnZhciB0ZXN0U3R5bGVzID0gcmVxdWlyZSgnLi8uLi9saWIvdGVzdFN0eWxlcy5qcycpO1xuICAvLyBDaHJvbWUgKGRlc2t0b3ApIHVzZWQgdG8gbGllIGFib3V0IGl0cyBzdXBwb3J0IG9uIHRoaXMsIGJ1dCB0aGF0IGhhcyBzaW5jZSBiZWVuIHJlY3RpZmllZDogaHR0cDovL2NyYnVnLmNvbS8zNjQxNVxuICBNb2Rlcm5penIuYWRkVGVzdCgndG91Y2hldmVudHMnLCBmdW5jdGlvbigpIHtcbiAgICB2YXIgYm9vbDtcbiAgICBpZiAoKCdvbnRvdWNoc3RhcnQnIGluIHdpbmRvdykgfHwgd2luZG93LkRvY3VtZW50VG91Y2ggJiYgZG9jdW1lbnQgaW5zdGFuY2VvZiBEb2N1bWVudFRvdWNoKSB7XG4gICAgICBib29sID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHF1ZXJ5ID0gWydAbWVkaWEgKCcsIHByZWZpeGVzLmpvaW4oJ3RvdWNoLWVuYWJsZWQpLCgnKSwgJ2hlYXJ0eicsICcpJywgJ3sjbW9kZXJuaXpye3RvcDo5cHg7cG9zaXRpb246YWJzb2x1dGV9fSddLmpvaW4oJycpO1xuICAgICAgdGVzdFN0eWxlcyhxdWVyeSwgZnVuY3Rpb24obm9kZSkge1xuICAgICAgICBib29sID0gbm9kZS5vZmZzZXRUb3AgPT09IDk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGJvb2w7XG4gIH0pO1xuXG4iLCJtb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZUF1ZGlvQ29udGV4dFxuZnVuY3Rpb24gY3JlYXRlQXVkaW9Db250ZXh0IChkZXNpcmVkU2FtcGxlUmF0ZSkge1xuICB2YXIgQXVkaW9DdG9yID0gd2luZG93LkF1ZGlvQ29udGV4dCB8fCB3aW5kb3cud2Via2l0QXVkaW9Db250ZXh0XG5cbiAgZGVzaXJlZFNhbXBsZVJhdGUgPSB0eXBlb2YgZGVzaXJlZFNhbXBsZVJhdGUgPT09ICdudW1iZXInXG4gICAgPyBkZXNpcmVkU2FtcGxlUmF0ZVxuICAgIDogNDQxMDBcbiAgdmFyIGNvbnRleHQgPSBuZXcgQXVkaW9DdG9yKClcblxuICAvLyBDaGVjayBpZiBoYWNrIGlzIG5lY2Vzc2FyeS4gT25seSBvY2N1cnMgaW4gaU9TNisgZGV2aWNlc1xuICAvLyBhbmQgb25seSB3aGVuIHlvdSBmaXJzdCBib290IHRoZSBpUGhvbmUsIG9yIHBsYXkgYSBhdWRpby92aWRlb1xuICAvLyB3aXRoIGEgZGlmZmVyZW50IHNhbXBsZSByYXRlXG4gIGlmICgvKGlQaG9uZXxpUGFkKS9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkgJiZcbiAgICAgIGNvbnRleHQuc2FtcGxlUmF0ZSAhPT0gZGVzaXJlZFNhbXBsZVJhdGUpIHtcbiAgICB2YXIgYnVmZmVyID0gY29udGV4dC5jcmVhdGVCdWZmZXIoMSwgMSwgZGVzaXJlZFNhbXBsZVJhdGUpXG4gICAgdmFyIGR1bW15ID0gY29udGV4dC5jcmVhdGVCdWZmZXJTb3VyY2UoKVxuICAgIGR1bW15LmJ1ZmZlciA9IGJ1ZmZlclxuICAgIGR1bW15LmNvbm5lY3QoY29udGV4dC5kZXN0aW5hdGlvbilcbiAgICBkdW1teS5zdGFydCgwKVxuICAgIGR1bW15LmRpc2Nvbm5lY3QoKVxuICAgIFxuICAgIGNvbnRleHQuY2xvc2UoKSAvLyBkaXNwb3NlIG9sZCBjb250ZXh0XG4gICAgY29udGV4dCA9IG5ldyBBdWRpb0N0b3IoKVxuICB9XG5cbiAgcmV0dXJuIGNvbnRleHRcbn1cbiJdfQ==
