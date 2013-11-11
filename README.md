#Peppermint touch slider

[Check out the demo](http://wd.dizaina.net/en/scripts/peppermint/)

Yet another touch slider. Only better.

- Works with [Touch Events](http://www.w3.org/TR/touch-events/), [Pointer Events](http://www.w3.org/TR/pointerevents/), old [IE10 Point Erevents](http://msdn.microsoft.com/en-us/library/ie/hh673557\(v=vs.85\).aspx)
- Works on iPhones, Androids, Windows Phones, Blackberries, Windows 8 devices
- IE7+ compatible, IE10+ with animations
- Library agnostic. If jQuery is available, registers itself as a plugin.
- Uses CSS3 transforms &amp; animations
- Only 5 Kb minified
- Perfomance-optimized `touch` functions
- API and callback functions for extensibility
- [Doesn't break](http://wd.dizaina.net/en/internet-maintenance/js-sliders-and-the-tab-key/) when <kbd>tab</kbd>&rsquo;bing

##Kit

- **peppermint.min.js** -- minified production script
- **peppermint.required.css** -- styles required for proper functioning
- **peppermint.suggested.css** -- default styles to start with (required styles not included!)

##Usage

HTML markup:

	<div class="peppermint" id="peppermint">
	  <figure> ... </figure>

	  <figure> ... </figure>

	  <figure> ... </figure>
	</div>

Javascript:

	var slider = Peppermint(document.getElementById('peppermint'));

Or javascript + jQuery:

	$('.peppermint').Peppermint();

You are free to use any other tag instead of `figure`. When using `figure`, don't forget to include [html5shiv](https://github.com/aFarkas/html5shiv), otherwise it won't work in old IEs.

Place anything you want within the slides.

##Settings

Peppermint can take settings object as an optional second parameter (first when using jQuery). Default settings:

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
	
	  //starting slide
	  startSlide: 0,
	
	  //show dots
	  dots: false,

	  //dots before slides
	  dotsFirst: false,
	
	  //Callback function, runs at slide change.
	  //Receives slide number as a parameter.
	  onSlideChange: undefined,
	
	  //Callback function, runs at setup end.
	  //Receives total number of slides as a parameter.
	  onSetup: undefined
	}

Example:

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

##API

Peppermint exposes a set of functions upon installation. These functions can be used to controll the slider externally:

`slideTo(n)` -- change active slide to `n`;

`next()` -- next slide;

`prev()` -- previous slide;

`start()` -- start slideshow;

`stop()` -- stop slideshow;

`pause()` -- pause slideshow until the next slide change;

`getCurrentPos()` -- get current slide number;

`getSlidesNumber()` -- get total number of slides;

`recalcWidth()` -- recalculate the slider's and slides' widths. Usefull when the container width is changed. Width recalculation runs automatically on window resize and device orientation change.

Example:

	var slider = Peppermint(document.getElementById('peppermint')),
	    rightArr = document.getElementById('right-arr'),
	    leftArr = document.getElementById('left-arr');

	rightArr.addEventListener('click', slider.next, false);
	leftArr.addEventListener('click', slider.prev, false);
	
##License

[MIT license](http://opensource.org/licenses/MIT).
