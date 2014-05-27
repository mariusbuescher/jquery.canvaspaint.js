# jquery.canvaspaint.js

A simple library for multitouch painting with and without jQuery.

## What does it do?

This is a jQuery Plugin for multitouch canvas painting on tablet computers. What makes this little project unique is its ability to handle multiple touch events. It also works on desktop computer using a mouse.

## Usage

Just import the library:

````html
<script type="text/javascript" charset="utf-8" src="path/to/js/folder/jquery.canvaspaint.js"></script>
````

Then simply use it as a jQuery plugin in your scripts as you need it:

````javascript
$('#drawarea').canvaspaint();
````

## API

There is an API for manipulating strokes and catching events.

### Methods

There are Methods for manipulating the strokes. You can:

- Set the color via method <code>setColor</code>
- Set stroke width with <code>setLineWidth</code>
- Clear the canvas using <code>clear</code> method
- Toggle the eraser with <code>setEraser</code> method
- Save the image content via method <code>getImageData</code>
- Restore image using method <code>setImageData</code>
- Start path with <code>startLine</code>
- End path with <code>endLine</code>
- Draw a line using <code>drawLine</code> with start and end point ech containing x and y value

The API is triggered through the jQuery plugin:

````javascript
$('#drawarea').canvaspaint('methodname', arguments);
````

### Events

There are three events you can listen to:

- <code>startLine</code>, triggered when a line is started
- <code>drawLine</code>, triggered when a line is drawn
- <code>endLine</code>, when a line has ended

When triggered jQuery style it is done like this:

````javascript
$('#drawarea').canvaspaint('drawLine.canvaspaint', function (e, data) {});
````

The <code>data</code> parameter contains the data that is passed in the event. The <code>canvaspaint</code> part of the event name is the namespace.

When triggered directly, namespace and event name are ordered the other way. e.g. <code>canvaspaint.drawLine</code>.

````javascript
document.getElementById('drawarea').addEventListener('canvaspaint.drawLine', function (e) {});
````
