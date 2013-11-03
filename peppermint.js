/*
	Peppermint touch slider
	Copyright dizaina.net

	MIT License
*/

function Peppermint(element, options) {
	var o = options || {};

	o.speed = o.speed || 300;
	o.flickSpeed = o.flickSpeed || 300;
	o.slideshowInterval = o.slideshowInterval || 4000;
	o.slideshow = o.slideshow || false;
	o.bullets = o.bullets || false;
	
	var _this = element,
		slider = {
			slides: [],
			bullets: [],
			self: _this
		},
		flickTime = 250,
		activeSlide = 0,
		slideWidth,
		bulletBlock,
		slideBlock,
		slideshowTimeoutId,
		slideshowActive;

	var support = {
		msPointerEvents: !!window.navigator.msPointerEnabled,
		transitions: (function() {
			var props = ['transform', 'WebkitTransform', 'MozTransform', 'OTransform', 'msTransform'],
				block = document.createElement('div');

			for (var i in props) {
				if (block.style[props[i]] !== undefined) return true;
			}

			return false
		})()
	}

	function changeActiveSlide(n, flick) {
		if (!slider.slides[n]) {
			n = activeSlide;
		}
		else if (n !== activeSlide) {
			for (var i in slider.bullets) {
				slider.bullets[i].className = slider.bullets[i].className.replace(' active', '');
			}

			slider.bullets[n].className += ' active';
		}

		changePos(-n*slider.width, (flick?o.flickSpeed:o.speed));

		activeSlide = n;

		stepSlideshow();

		//callback
		o.onSlideChange && o.onSlideChange(n);

		return n;
	}

	function changePos(pos, speed) {
		var time = speed?speed+'ms':'';

		slideBlock.style.webkitTransitionDuration = 
		slideBlock.style.MozTransitionDuration = 
		slideBlock.style.msTransitionDuration = 
		slideBlock.style.OTransitionDuration = 
		slideBlock.style.transitionDuration = time;

		slideBlock.style.webkitTransform = 'translate('+pos+'px,0)' + 'translateZ(0)';
		slideBlock.style.msTransform = 
		slideBlock.style.MozTransform = 
		slideBlock.style.OTransform = 
		slideBlock.style.transform = 'translateX('+pos+'px)';
	}
	
	function changePosFallback(pos, speed) {
		var time = speed?speed+'ms':'';

		slideBlock.style.webkitTransitionDuration = 
		slideBlock.style.MozTransitionDuration = 
		slideBlock.style.msTransitionDuration = 
		slideBlock.style.OTransitionDuration = 
		slideBlock.style.transitionDuration = time;

		slideBlock.style.left = pos+'px';
	}

	function nextSlide() {
		var n = activeSlide + 1;

		if (n > slider.slides.length - 1) {
			n = 0;
		}

		return changeActiveSlide(n);
	}

	function prevSlide() {
		var n = activeSlide - 1;

		if (n < 0) {
			n = slider.slides.length - 1;
		}

		return changeActiveSlide(n);
	}

	function startSlideshow() {
		slideshowActive = true;
		stepSlideshow();
	}

	function stepSlideshow() {
		if (slideshowActive) {
			slideshowTimeoutId && clearTimeout(slideshowTimeoutId);

			slideshowTimeoutId = setTimeout(function() {
				nextSlide();
			},
			o.slideshowInterval);
		}
	}

	function pauseSlideshow() {
		slideshowTimeoutId && clearTimeout(slideshowTimeoutId);
	}

	function stopSlideshow() {
		slideshowActive = false;
		slideshowTimeoutId && clearTimeout(slideshowTimeoutId);
	}

	function touchInit() {
		var start = {},
			diff = {},
			isScrolling,
			touchInProgress = false;

		if (support.msPointerEvents) {
			var p = true,
				tEvents = {
					start: 'MSPointerDown',
					move: 'MSPointerMove',
					end: 'MSPointerUp',
					cancel: 'MSPointerCancel'
				};
		}
		else {
			var p = false,
				tEvents = {
					start: 'touchstart',
					move: 'touchmove',
					end: 'touchend',
					cancel: 'touchcancel'
				};
		}

		function tStart(event) {
			if (p
				&& (!event.isPrimary || event.pointerType !== event.MSPOINTER_TYPE_TOUCH)) return;

			start = {
				x: (p?event.clientX:event.touches[0].clientX),
				y: (p?event.clientY:event.touches[0].clientY),

				time: +new Date
			};
			
			isScrolling = undefined;

			diff = {};

			if (p) touchInProgress = true;
		}

		function tMove(event) {
			if (((event.touches && event.touches.length > 1) || (event.scale && event.scale !== 1)) ||
				(p && (!event.isPrimary || !touchInProgress))) return;

			diff = {
				x: (p? event.clientX : event.touches[0].clientX) - start.x,
				y: (p? event.clientY : event.touches[0].clientY) - start.y
			}

			if (isScrolling === undefined) {
				isScrolling = (Math.abs(diff.x) < Math.abs(diff.y));
			}

			if (isScrolling) return;

			event.preventDefault();
			pauseSlideshow();

			diff.x = 
			diff.x / 
				(
					(!activeSlide && diff.x > 0
					|| activeSlide == slider.slides.length - 1 && diff.x < 0)
					?                      
					(Math.abs(diff.x)/slider.width*2 + 1)
					:
					1
				);
			
			changePos(diff.x - slider.width*activeSlide);
		}

		function tEnd(event) {
			event.target && event.target.blur();
			
			if (isScrolling ||
				(p && !event.isPrimary)) return;

			var duration = Number(+new Date - start.time);
			var flick = duration < flickTime && Math.abs(diff.x) > 20;

			if (flick
				|| (Math.abs(diff.x) > slider.width/4)) {

				if (diff.x < 0) {
					changeActiveSlide(activeSlide+1, flick);
				}
				else {
					changeActiveSlide(activeSlide-1, flick);	
				}

			}
			else {
				changeActiveSlide(activeSlide);
			}

			if (p) {
				if (diff.x === undefined) {
					touchInProgress = false;
				}
				else {
					setTimeout(function() {
						touchInProgress = false;
					}, 10)
				}
			}
		}

		addEvent(slideBlock, tEvents.start, tStart, false);
		addEvent(slideBlock, tEvents.move, tMove, false);
		addEvent(slideBlock, tEvents.end, tEnd, false);
		addEvent(slideBlock, tEvents.cancel, tEnd, false);

		if (p) {
			addEvent(slideBlock, 'click', function(event) {
				touchInProgress && event.preventDefault();
			}, false);
		}
	}
	
	function onWidthChange() {
		slider.width = slider.self.offsetWidth;
		changePos(-activeSlide*slider.width);
	}

	function addEvent(el, event, func, bool) {
		if (el.addEventListener) {
			el.addEventListener(event, func, bool);
		}
		else {
			el.attachEvent('on'+event, func);
		}
	}

	function setup() {
		if (!support.transitions) changePos = changePosFallback;

		slideBlock = document.createElement('div');
		slideBlock.className = 'slides';

		for (var i = 0, l = slider.self.children.length; i < l; i++) {
			var slide = slider.self.children[i],
				bullet = document.createElement('span'),
				links = slide.getElementsByTagName('a'),
				n = slider.slides.length;

			slider.slides.push(slide);

			bullet.setAttribute('tabindex', '0');

			bullet.setAttribute('role', 'button');

			bullet.innerHTML = '<span></span>';

			if (i == activeSlide) bullet.className += ' active';

			addEvent(bullet, 'click', function(x, b) {
				return function() {
					b.blur();
					changeActiveSlide(x);
				};
			}(n, bullet), false);

			addEvent(bullet, 'keyup', function(x) {
				return function(event) {
					if (event.keyCode == 13 || event.keyCode == 32) {
						changeActiveSlide(x);
					}
				};
			}(n), false);

			/*
			Solves tabbing problems:
			Cycles through links found in the slide and switches to current slide
			when link is focused. Also resets scrollLeft of the slider block.

			SetTimeout solves chrome's bug.
			*/
			for (var j = links.length - 1; j >= 0; j--) {
				addEvent(links[j], 'focus', function(x) {
					return function() {
						slider.self.scrollLeft = 0;
						setTimeout(function() {
							slider.self.scrollLeft = 0;
						}, 0);
						changeActiveSlide(x);
					}
				}(n), false);
			};

			slider.bullets.push(bullet);
		}

		slideWidth = 100/slider.slides.length;

		slideBlock.style.width = slider.slides.length*100+'%';

		for (var i = 0, l = slider.slides.length; i < l; i++) {
			slideBlock.appendChild(slider.slides[i]);
			slider.slides[i].style.width = slideWidth+'%';
		}

		slider.self.className += ' active';
		slider.self.appendChild(slideBlock);

		if (o.bullets) {
			bulletBlock = document.createElement('nav');

			for (var i = 0, l = slider.bullets.length; i < l; i++) {
				bulletBlock.appendChild(slider.bullets[i]);
			}

			slider.self.appendChild(bulletBlock);
		}

		slider.width = slider.self.offsetWidth;

		addEvent(window, 'resize', onWidthChange, false);
		addEvent(window, 'orientationchange', onWidthChange, false);

		if (o.slideshow) startSlideshow();

		//callback
		o.onSetup && o.onSetup(slider.slides.length);
	}

	setup();

	touchInit();

	return {
		slideTo: function(slide) {
			return changeActiveSlide(parseInt(slide, 10));
		},

		next: function() {
			return nextSlide();
		},

		prev: function() {
			return prevSlide();
		},

		start: function() {
			startSlideshow();
		},

		stop: function() {
			stopSlideshow();
		},

		getCurrentPos: function() {
			return activeSlide;
		},

		getLength: function() {
			return slider.slides.length;
		}
	};
};

if (window.jQuery) {
	(function($) {
		$.fn.Peppermint = function(options) {
			this.each(function() {
				$(this).data('Peppermint', Peppermint($(this)[0], options));
			});
		};
	})(window.jQuery);
}