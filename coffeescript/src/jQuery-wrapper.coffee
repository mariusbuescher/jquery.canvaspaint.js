$ = jQuery

$.fn.canvaspaint = (method) ->

  eventHandler = (e) ->
    if e.type is 'canvaspaint.drawLine'
      @trigger('drawLine.canvaspaint', e.details)
    else if e.type is 'canvaspaint.startLine'
      @trigger('startLine.canvaspaint')
    else if e.type is 'canvaspaint.endLine'
      @trigger('endLine.canvaspaint')
    else if e.type is 'canvaspaint.clear'
      @trigger('clear.canvaspaint')

  if typeof method is 'object' or typeof method is 'undefined'
    if @is('canvas')
      @data('canvaspaint', new Canvaspaint(@get(0)))
    else
      canvas = document.createElement('canvas')
      canvas.setAttribute('width', @width())
      canvas.setAttribute('height', @height())
      @html(canvas);

      @data('canvaspaint', new Canvaspaint(canvas))

    @data('canvaspaint').element.addEventListener('canvaspaint.drawLine', eventHandler.bind(this));

    this;
  else
    @data('canvaspaint')[method].call(@data('canvaspaint'), arguments[1], arguments[2])
