#Peppermint touch slider

Yet another touch-slider. Only better.

- Works with [touchevents](http://www.w3.org/TR/touch-events/), [pointerevents](http://www.w3.org/TR/pointerevents/), old [IE10 pointerevents](http://msdn.microsoft.com/en-us/library/ie/hh673557(v=vs.85).aspx)
- Works on iPhones, Androids, Windows Phones, Blackberries, Windows 8 devices
- Library Agnostic. If jQuery is available, registers itself as a plugin.
- IE7+ compatible, IE10+ with animations
- Only 5 Kb minified
- Perfomance-optimized `touch` functions
- [API](#api) and callback functions for extensibility
- Works with keyboard, doesn't break when tabbing

##Kit

- peppermint.min.js -- minified production script
- peppermint.required.css -- styles required for proper functioning
- peppermint.suggested.css -- default styles to start with

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

You can use any other tag instead of `figure`. If you use `figure`, don't forget to grab [html5shiv](https://github.com/aFarkas/html5shiv), otherwise it won't work in old IEs.

Place anything you want within the slides.

##Settings

Peppermint can take setting object as an optional second parameter (first when using jQuery). Default settings:

{% highlight js cssclass=codewrap %}
{
  //transition speed when changing slide, ms
  speed: 300,

  //transition speed when changing slide after touch, ms
  touchSpeed: 300,

  //slideshow enabled
  slideshow: false,

  //slides switching interval, ms
  slideshowInterval: 4000,

  //stop slideshow after user interaction with the slider
  stopSlideshowAfterInteraction: false,

  //starting slide
  startSlide: 0,

  //show dots
  dots: false,

  //Callback function, runs at slide change.
  //Recieves slide number as a parameter.
  onSlideChange: undefined,

  //Callback function, runs at setup end.
  //Recieves total number of slides as a parameter.
  onSetup: undefined
}
{% endhighlight %}

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

Upon installation Peppermint exposes a set of functions that can be used to controll the slider externally:

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