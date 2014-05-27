if (jQuery !== undefined) {
  (function ($) {
    'use strict';

    $.fn.canvaspaint = function (method) {

      if (typeof method == 'object' || typeof method == 'undefined') {
        if (this.is('canvas')) {
          this.data('canvaspaint', new Canvaspaint(this.get(0)));
        } else {
          var canvas = document.createElement('canvas');
          canvas.setAttribute('width', this.width());
          canvas.setAttribute('height', this.height());
          this.html(canvas);

          this.data('canvaspaint', new Canvaspaint(canvas));
        }
        return this;
      } else {
        return this.data('canvaspaint')[method].call(this.data('canvaspaint'), arguments[1]);
      }

    };

  } (jQuery));
}

var Canvaspaint = function (element) {
  'use strict';

  this.element = element;

  // get canvas context
  this.ctx = this.element.getContext('2d');

  // set default values for context vars
  this.ctx.strokeStyle = '#000000';
  this.ctx.lineWidth = 15;
  this.ctx.lineCap = 'round';
  this.ctx.lineJoin = 'round';
  this.ctx.globalCompositeOperation = 'source-over';

  // add touchevents using call to pass context, element and event as arguments
  this.element.addEventListener('touchstart', this.onTouchstartEvent.bind(this, arguments));
  this.element.addEventListener('touchend', this.onTouchendEvent.bind(this, arguments));
  this.element.addEventListener('touchcancel', this.onTouchcancelEvent.bind(this, arguments));
  this.element.addEventListener('touchmove', this.onTouchmoveEvent.bind(this, arguments));

  // mouseevents using call to pass context, element and event as arguments
  this.element.addEventListener('mousedown', this.onMousedownEvent.bind(this, arguments));
  this.element.addEventListener('mouseup', this.onMouseupEvent.bind(this, arguments));
  this.element.addEventListener('mousemove', this.onMousemoveEvent.bind(this, arguments));
  this.element.addEventListener('mouseout', this.onMouseoutEvent.bind(this, arguments));

  document.body.addEventListener('gesturestart', function (e) {
    e.preventDefault();
  })

  return this;
}

Canvaspaint.prototype = {

  // property definition
  ctx : null,
  element : null,
  drawing : false,
  touchPositions : [],

  // helper functions
  drawLine : function (start, end) {
    this.ctx.moveTo(start.x, start.y);
    this.ctx.lineTo(end.x, end.y);
    this.ctx.stroke();
  },

  startLine : function () {
    this.ctx.beginPath();
  },

  endLine : function () {
    this.ctx.closePath();
  },

  // event handlers
  onTouchstartEvent : function (el, e) {
    e.preventDefault();
    this.drawing = true;
    this.touchPositions = []
    this.startLine();
    for (var i = 0; i < e.touches.length; i++) {
      this.touchPositions.push({
        x : e.touches.item(i).clientX,
        y : e.touches.item(i).clientY
      });
    }
  },

  onTouchendEvent : function (el, e) {
    for (var touch in this.touchPositions) {
      startPoint = {
        x : this.touchPositions[touch].x - this.element.getBoundingClientRect().left,
        y : this.touchPositions[touch].y- this.element.getBoundingClientRect().top
      }
      endPoint = {
        x : this.touchPositions[touch].x - this.element.getBoundingClientRect().left - 1,
        y : this.touchPositions[touch].y - this.element.getBoundingClientRect().top
      }
      this.drawLine(startPoint, endPoint);
    }
    this.endLine();
    this.drawing = false;
    this.touchPositions = [];
  },

  onTouchcancelEvent : function (el, e) {
    this.drawing = false;
    this.endLine();
    this.touchPositions = [];
  },

  onTouchmoveEvent : function (el, e) {
    e.preventDefault();
    if (this.drawing === true) {
      var changed = false;
      for (var touch = 0; touch < this.touchPositions.length; touch++) {
        if ((this.touchPositions[touch].x - e.touches.item(touch).clientX) !== 0 || (this.touchPositions[touch].y - e.touches.item(touch).clientY) !== 0) {
          startPoint = {
            x : this.touchPositions[touch].x - this.element.getBoundingClientRect().left,
            y : this.touchPositions[touch].y- this.element.getBoundingClientRect().top
          }
          endPoint = {
            x : e.touches.item(touch).clientX - this.element.getBoundingClientRect().left,
            y : e.touches.item(touch).clientY - this.element.getBoundingClientRect().top
          }
          this.drawLine(startPoint, endPoint);
          changed = true;
        }
      }
      if (changed === true) {
        this.touchPositions = []
        for (var i = 0; i < e.touches.length; i++) {
          this.touchPositions.push({
            x : e.touches.item(i).clientX,
            y : e.touches.item(i).clientY
          });
        }
      }
    }
  },

  onMousedownEvent : function (el, e) {
    this.drawing = true;
    this.startLine();
    this.touchPositions = [{
      x : e.clientX,
      y : e.clientY
    }];
  },

  onMouseupEvent : function (el, e) {
    startPoint = {
      x : this.touchPositions[0].x - this.element.getBoundingClientRect().left,
      y : this.touchPositions[0].y- this.element.getBoundingClientRect().top
    }
    endPoint = {
      x : this.touchPositions[0].x - this.element.getBoundingClientRect().left - 1,
      y : this.touchPositions[0].y - this.element.getBoundingClientRect().top
    }
    this.drawLine(startPoint, endPoint);
    this.drawing = false;
    this.endLine();
    this.touchPositions = [];
  },

  onMousemoveEvent : function (el, e) {
    if (this.drawing === true) {
      if ((this.touchPositions[0].x - e.clientX) !== 0 || (this.touchPositions[0].y - e.clientY) !== 0) {
        startPoint = {
          x : this.touchPositions[0].x - this.element.getBoundingClientRect().left,
          y : this.touchPositions[0].y- this.element.getBoundingClientRect().top
        }
        endPoint = {
          x : e.clientX - this.element.getBoundingClientRect().left,
          y : e.clientY - this.element.getBoundingClientRect().top
        }
        this.drawLine(startPoint, endPoint);
        this.touchPositions = [{
          x : e.clientX,
          y : e.clientY
        }]
      }
    }
  },

  onMouseoutEvent : function (el, e) {
    this.drawing = false;
    this.endLine();
    this.touchPositions = [];
  },

  // setter and getter API methods
  setColor : function (color) {
    this.ctx.globalCompositeOperation = 'source-over';
    this.ctx.strokeStyle = color;
  },

  setEraser : function () {
    this.ctx.globalCompositeOperation = 'copy';
    this.ctx.strokeStyle = 'transparent';
  },

  setLineWidth : function (lineWidth) {
    this.ctx.lineWidth = lineWidth;
  },

  clear : function () {
    this.ctx.clearRect(0, 0, this.element.width, this.element.height);
  },

  getImageData : function () {
    return this.element.toDataURL();
  },

  setImageData : function (imageData) {
    var image = new Image();

    var self = this;
    image.onload = function () {
      self.clear();
      self.ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, self.element.width, self.element.height);
    };

    image.src = imageData;
  }

};
