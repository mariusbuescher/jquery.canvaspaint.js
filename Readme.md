# jquery.canvaspaint.js

A simple library for multitouch painting with and without jQuery.

## What does it do?

This is a jQuery Plugin for multitouch canvas painting on tablet computers. What makes this little project unique is its ability to handle multiple touch events. It also works on desktop computer using a mouse.

## Usage

Just import the library:

    <script type="text/javascript" charset="utf-8" src="path/to/js/folder/jquery.canvaspaint.js"></script>

Then simply use it as a jQuery plugin in your scripts as you need it:

    $('#drawarea').canvaspaint();

## API

There is an API for manipulating the strokes. You can:

- Set the color via method <code>setColor</code>
- Set stroke width with <code>setLineWidth</code>
- Clear the canvas using <code>clear</code> method
- Toggle the eraser with <code>setEraser</code> method
- Save the image content via method <code>getImageData</code>
- Restore image using method <code>setImageData</code>

The API is triggered through the jQuery plugin:

    $('#drawarea').canvaspaint('methodname', arguments);
