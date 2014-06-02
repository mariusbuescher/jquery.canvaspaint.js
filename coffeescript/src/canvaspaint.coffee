class Canvaspaint

  drawing        : false
  ctx            : null
  element        : null
  touchPositions : []

  constructor : (@element) ->

    # get canvas context
    @ctx = @element.getContext('2d')

    # set default values for context vars
    @ctx.strokeStyle = '#000000'
    @ctx.lineWidth = 15
    @ctx.lineCap = 'round'
    @ctx.lineJoin = 'round'
    @ctx.globalCompositeOperation = 'source-over'

    # add touchevents using call to pass context, element and event as arguments
    @element.addEventListener('touchstart', @onTouchstartEvent.bind(this, arguments))
    @element.addEventListener('touchend', @onTouchendEvent.bind(this, arguments))
    @element.addEventListener('touchcancel', @onTouchcancelEvent.bind(this, arguments))
    @element.addEventListener('touchmove', @onTouchmoveEvent.bind(this, arguments))

    # mouseevents using call to pass context, element and event as arguments
    @element.addEventListener('mousedown', @onMousedownEvent.bind(this, arguments))
    @element.addEventListener('mouseup', @onMouseupEvent.bind(this, arguments))
    @element.addEventListener('mousemove', @onMousemoveEvent.bind(this, arguments))
    @element.addEventListener('mouseout', @onMouseoutEvent.bind(this, arguments))

    document.body.addEventListener('gesturestart', (e) ->
      e.preventDefault()
    )

  # helper functions
  drawLine : (start, end) ->
    event = new CustomEvent('canvaspaint.drawLine')
    event.details = {
      start : start,
      end : end
    };
    @element.dispatchEvent(event)

    @ctx.moveTo(start.x, start.y)
    @ctx.lineTo(end.x, end.y)
    @ctx.stroke()


  startLine : ->
    event = new CustomEvent('canvaspaint.startLine')
    @element.dispatchEvent(event)

    @ctx.beginPath()


  endLine : ->
    event = new CustomEvent('canvaspaint.endLine')
    @element.dispatchEvent(event)

    @ctx.closePath()


  # event listeners
  onTouchstartEvent : (el, e) ->
    e.preventDefault()
    @drawing = true
    @touchPositions = []
    @startLine()
    for touch in e.touches
      @touchPositions.push({
        x : touch.clientX,
        y : touch.clientY
      })


  onTouchendEvent : (el, e) ->
    for touch in @touchPositions
      startPoint = {
        x : touch.x - @element.getBoundingClientRect().left,
        y : touch.y- @element.getBoundingClientRect().top
      }
      endPoint = {
        x : touch.x - @element.getBoundingClientRect().left - 1,
        y : touch.y - @element.getBoundingClientRect().top
      }
      @drawLine(startPoint, endPoint)

    @endLine()
    @drawing = false
    @touchPositions = []


  onTouchcancelEvent : (el, e) ->
    @drawing = false
    @endLine()
    @touchPositions = []


  onTouchmoveEvent : (el, e) ->
    e.preventDefault()
    if @drawing is true
      changed = false
      for touch, i in @touchPositions
        if (touch.x - e.touches.item(i).clientX) isnt 0 or (touch.y - e.touches.item(i).clientY) isnt 0
          startPoint = {
            x : touch.x - @element.getBoundingClientRect().left,
            y : touch.y- @element.getBoundingClientRect().top
          }
          endPoint = {
            x : e.touches.item(i).clientX - @element.getBoundingClientRect().left,
            y : e.touches.item(i).clientY - @element.getBoundingClientRect().top
          }
          @drawLine(startPoint, endPoint);
          changed = true;

      if changed is true
        @touchPositions = []
        for touch in e.touches
          @touchPositions.push({
            x : touches.clientX,
            y : touches.clientY
          })


  onMousedownEvent : (el, e) ->
    @drawing = true
    @startLine()
    @touchPositions = [{
      x : e.clientX,
      y : e.clientY
    }]


  onMouseupEvent : (el, e) ->
    startPoint = {
      x : @touchPositions[0].x - @element.getBoundingClientRect().left,
      y : @touchPositions[0].y- @element.getBoundingClientRect().top
    }
    endPoint = {
      x : @touchPositions[0].x - @element.getBoundingClientRect().left - 1,
      y : @touchPositions[0].y - @element.getBoundingClientRect().top
    }
    @drawLine(startPoint, endPoint)
    @drawing = false
    @endLine()
    @touchPositions = []


  onMousemoveEvent : (el, e) ->
    if @drawing is true
      if (@touchPositions[0].x - e.clientX) isnt 0 or (@touchPositions[0].y - e.clientY) isnt 0
        console.log('draw')
        startPoint = {
          x : @touchPositions[0].x - @element.getBoundingClientRect().left,
          y : @touchPositions[0].y- @element.getBoundingClientRect().top
        }
        endPoint = {
          x : e.clientX - @element.getBoundingClientRect().left,
          y : e.clientY - @element.getBoundingClientRect().top
        }
        @drawLine(startPoint, endPoint)
        @touchPositions = [{
          x : e.clientX,
          y : e.clientY
        }]


  onMouseoutEvent : (el, e) ->
    @drawing = false
    @endLine()
    @touchPositions = []


  # setter and getter API methods
  setColor : (color) ->
    @ctx.globalCompositeOperation = 'source-over'
    @ctx.strokeStyle = color


  setEraser : ->
    @ctx.globalCompositeOperation = 'copy'
    @ctx.strokeStyle = 'transparent'


  setLineWidth : (lineWidth) ->
    @ctx.lineWidth = lineWidth


  clear : ->
    event = new CustomEvent('canvaspaint.clear')
    @element.dispatchEvent(event)

    @ctx.clearRect(0, 0, @element.width, @element.height)


  getImageData : ->
    @element.toDataURL()


  setImageData : (imageData) ->
    image = new Image();

    self = this;
    image.onload = ->
      self.clear()
      self.ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, self.element.width, self.element.height)

    image.src = imageData
