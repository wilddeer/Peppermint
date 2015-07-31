#Peppermint touch slider

[Check out the demo](http://wd.dizaina.net/en/scripts/peppermint/)

Yet another touch slider. Only better.

- Works with mouse, [Touch Events](http://www.w3.org/TR/touch-events/), [Pointer Events](http://www.w3.org/TR/pointerevents/), old [IE10 Pointer Events](http://msdn.microsoft.com/en-us/library/ie/hh673557\(v=vs.85\).aspx)
- Responsive, works on iPhones, Androids, Windows Phones, Blackberries, Windows 8 devices
- IE7+ compatible
- Library agnostic. If jQuery is available, registers itself as a plugin.
- Uses CSS3 transforms &amp; animations, falls back to timer animations when necessary
- Only 7.7 Kb minified
- Perfomance-optimized `touch` functions
- API and callback functions for extensibility
- [Doesn't break](http://wd.dizaina.net/en/internet-maintenance/js-sliders-and-the-tab-key/) when <kbd>tab</kbd>&rsquo;bing

##Kit

- **[peppermint.min.js](https://raw.github.com/wilddeer/Peppermint/master/dist/peppermint.min.js)** – minified production script
- **[peppermint.required.css](https://raw.github.com/wilddeer/Peppermint/master/dist/peppermint.required.css)** – styles required for proper functioning
- **[peppermint.suggested.css](https://raw.github.com/wilddeer/Peppermint/master/dist/peppermint.suggested.css)** – default styles to start with (required styles included)

Also available in [Bower](http://bower.io):

```
bower install Peppermint --save
```

##Usage

HTML markup:

```html
<div class="peppermint peppermint-inactive" id="peppermint">
  <figure> ... </figure>

  <figure> ... </figure>

  <figure> ... </figure>
</div>
```

Javascript:

```javascript
var slider = Peppermint(document.getElementById('peppermint'));
```

Or javascript + jQuery:

```javascript
$('.peppermint').Peppermint();
```
    
`peppermint-inactive` class is not required. It is replaced with `peppermint-active` during setup.

You are free to use any other tag instead of `figure`. When using `figure`, don't forget to include [html5shiv](https://github.com/aFarkas/html5shiv), otherwise it won't work in old IEs.

Place anything you want within the slides.

##Settings

Peppermint can take settings object as an optional second parameter (first when using jQuery). Default settings:

```javascript
{
  //transition time when changing slides, ms
  speed: 300,

  //transition time when changing slides after touch, ms
  touchSpeed: 300,

  //slideshow enabled
  slideshow: false,

  //slideshow interval, ms
  slideshowInterval: 4000,

  //stop slideshow after user interacts with the slider
  stopSlideshowAfterInteraction: false,

  //slide number to start with
  startSlide: 0,

  //use mouse to drag the slider
  mouseDrag: true,

  //don't initialize Peppermint if there's only one slide
  disableIfOneSlide: true,

  //Prefix to be used with Peppermint classes,
  //such as `inactive`, `active`, `mouse`, `drag`, etc.
  //Don't forget to change the stylesheet appropriately!
  cssPrefix: 'peppermint-',

  //show dots
  dots: false,

  //prepend dots to dotsContainer (default is append)
  dotsPrepend: false,

  //Element to contain dots, defaults to Peppermint's root element.
  //Can be anywhere on the page.
  dotsContainer: undefined,

  //element containing slides, defaults to Peppermint's root element
  slidesContainer: undefined,

  //Callback function, runs just before slide change
  //Receives previous and new slide numbers as parameters.
  beforeSlideChange: undefined,

  //Callback function, runs at slide change.
  //Receives slide number as a parameter.
  //Note: This event is executed as the transition animation is playing,
  //so may cause jank if it causes layout changes, or is CPU intensive.
  onSlideChange: undefined,

  //Callback function, runs at the end of the css transition.
  //Receives slide number as a parameter.
  //Note: This can be used for functions which cause layout changes,
  //or changes that should not be performed when the transition animation is playing.
  onTransitionEnd: undefined,

  //Callback function, runs at setup end.
  //Receives total number of slides as a parameter.
  onSetup: undefined
}
```

####Examples

JS:

```javascript
var slider = Peppermint(document.getElementById('peppermint'), {
  dots: true,
  slideshow: true,
  speed: 500,
  slideshowInterval: 5000,
  stopSlideshowAfterInteraction: true,
  onSetup: function(n) {
    console.log('Peppermint setup done. Slides found: ' + n);
  }
});
```

JS + jQuery:

```javascript
$('.peppermint').Peppermint({
  dots: true,
  slideshow: true,
  speed: 500,
  slideshowInterval: 5000,
  stopSlideshowAfterInteraction: true,
  onSetup: function(n) {
    console.log('Peppermint setup done. Slides found: ' + n);
  }
});
```

##API

Peppermint exposes a set of functions upon installation. These functions can be used to control the slider externally:

`slideTo(n)` – change active slide to `n`;

`slideTo(n, speed)` – change active slide to `n` with transition speed in ms. Passing a speed of 0 disables the transition;

`next()` – next slide;

`prev()` – previous slide;

`start()` – start slideshow;

`stop()` – stop slideshow;

`pause()` – pause slideshow until the next slide change;

`getCurrentPos()` – get current slide number;

`getSlidesNumber()` – get total number of slides;

`recalcWidth()` – recalculate slider's and slides' widths. Usefull when the container width is changed. Width recalculation runs automatically on window resize and device orientation change.

####Examples

JS:

```javascript
//init Peppermint and save the API object
var slider = Peppermint(document.getElementById('peppermint')),
    //save links to HTML nodes
    rightArr = document.getElementById('right-arr'),
    leftArr = document.getElementById('left-arr'),
    getSlidesNumberButton = document.getElementById('getslidesnumber');

//click `#right-arr` to go to the next slide
rightArr.addEventListener('click', slider.next, false);

//click `#left-arr` to go to the previous slide
leftArr.addEventListener('click', slider.prev, false);

//click `#getslidesnumber` to alert total number of slides
getSlidesNumberButton.addEventListener('click', function() {
  alert('There are ' + slider.getSlidesNumber() + ' slides');
}, false);
```

JS + jQuery:

```javascript
//save jQuery link to slider's block
var slider = $('#peppermint');

//init Peppermint
slider.Peppermint();

//click `#right-arr` to go to the next slide
$('#right-arr').click(slider.data('Peppermint').next);

//click `#left-arr` to go to the previous slide
$('#left-arr').click(slider.data('Peppermint').prev);

//click `#getslidesnumber` to alert total number of slides
$('#getslidesnumber').click(function() {
    alert('There are ' + slider.data('Peppermint').getSlidesNumber() + ' slides');
});
```

##Using Peppermint?

Drop me a link &rarr; [:envelope: wd@dizaina.net](mailto:wd@dizaina.net).
    
##License

[MIT license](http://opensource.org/licenses/MIT).
