function Peppermint(_this, options) {
    var slider = {
            slides: [],
            dots: [],
            left: 0
        },
        slidesNumber,
        flickThreshold = 200, //Flick threshold (ms)
        activeSlide = 0,
        slideWidth,
        dotBlock,
        slideBlock,
        slideshowTimeoutId,
        slideshowActive,
        animationTimer;

    //default options
    var o = {
        speed: 300, //transition between slides in ms
        touchSpeed: 300, //transition between slides in ms after touch
        slideshow: false, //launch slideshow at start
        slideshowInterval: 4000,
        stopSlideshowAfterInteraction: false, //stop slideshow after user interaction
        startSlide: 0, //first slide to show
        mouseDrag: true, //enable mouse drag
        disableIfOneSlide: true,
        cssPrefix: 'peppermint-',
        dots: false, //show dots
        dotsPrepend: false, //dots before slides
        dotsContainer: undefined,
        slidesContainer: undefined,
        onSlideChange: undefined, //slide change callback
        onSetup: undefined //setup callback
    };

    //merge user options into defaults
    options && mergeObjects(o, options);

    var classes = {
        inactive: o.cssPrefix + 'inactive',
        active: o.cssPrefix + 'active',
        mouse: o.cssPrefix + 'mouse',
        drag: o.cssPrefix + 'drag',
        slides: o.cssPrefix + 'slides',
        dots: o.cssPrefix + 'dots',
        activeDot: o.cssPrefix + 'active-dot',
        mouseClicked: o.cssPrefix + 'mouse-clicked'
    };

    //feature detects
    var support = {
        transforms: testProp('transform'),
        transitions: testProp('transition')
    };

    function mergeObjects(targetObj, sourceObject) {
        for (var key in sourceObject) {
            if (sourceObject.hasOwnProperty(key)) {
                targetObj[key] = sourceObject[key];
            }
        }
    }

    function testProp(prop) {
        var prefixes = ['Webkit', 'Moz', 'O', 'ms'],
            block = document.createElement('div');

        if (block.style[prop] !== undefined) return true;

        prop = prop.charAt(0).toUpperCase() + prop.slice(1);
        for (var i in prefixes) {
            if (block.style[prefixes[i]+prop] !== undefined) return true;
        }

        return false;
    }

    function addClass(el, cl) {
        if (!new RegExp('(\\s|^)'+cl+'(\\s|$)').test(el.className)) {
            el.className += ' ' + cl;
        }
    }

    function removeClass(el, cl) {
        el.className = el.className.replace(new RegExp('(\\s+|^)'+cl+'(\\s+|$)', 'g'), ' ').replace(/^\s+|\s+$/g, '');
    }

    //n - slide number (starting from 0)
    //speed - transition in ms, can be omitted
    function changeActiveSlide(n, speed) {
        if (n<0) {
            n = 0;
        }
        else if (n>slidesNumber-1) {
            n = slidesNumber-1;
        }

        //change active dot
        for (var i = slider.dots.length - 1; i >= 0; i--) {
            removeClass(slider.dots[i], classes.activeDot);
        }

        addClass(slider.dots[n], classes.activeDot);

        activeSlide = n;

        changePos(-n*slider.width, (speed===undefined?o.speed:speed));

        //reset slideshow timeout whenever active slide is changed for whatever reason
        stepSlideshow();

        //API callback
        o.onSlideChange && o.onSlideChange(n);

        return n;
    }

    //changes position of the slider (in px) with given speed (in ms)
    function changePos(pos, speed) {
        var time = speed?speed+'ms':'';

        slideBlock.style.webkitTransitionDuration =
        slideBlock.style.MozTransitionDuration =
        slideBlock.style.msTransitionDuration =
        slideBlock.style.OTransitionDuration =
        slideBlock.style.transitionDuration = time;

        setPos(pos);
    }

    //fallback to `setInterval` animations for UAs with no CSS transitions
    function changePosFallback(pos, speed) {
        animationTimer && clearInterval(animationTimer);

        if (!speed) {
            setPos(pos);
            return;
        }

        var startTime = +new Date,
            startPos = slider.left;

        animationTimer = setInterval(function() {
            //rough bezier emulation
            var diff, y,
                elapsed = +new Date - startTime,
                f = elapsed / speed,
                bezier = [0, 0.7, 1, 1];

            function getPoint(p1, p2) {
                return (p2-p1)*f + p1;
            }

            if (f >= 1) {
                setPos(pos);
                clearInterval(animationTimer);
                return;
            }

            diff = pos - startPos;

            y = getPoint(
                    getPoint(getPoint(bezier[0], bezier[1]), getPoint(bezier[1], bezier[2])),
                    getPoint(getPoint(bezier[1], bezier[2]), getPoint(bezier[2], bezier[3]))
                    );

            setPos(Math.floor(y*diff + startPos));
        }, 15);
    }

    //sets position of the slider (in px)
    function setPos(pos) {
        slideBlock.style.webkitTransform = 'translate('+pos+'px,0) translateZ(0)';
        slideBlock.style.msTransform =
        slideBlock.style.MozTransform =
        slideBlock.style.OTransform =
        slideBlock.style.transform = 'translateX('+pos+'px)';

        slider.left = pos;
    }

    //`setPos` fallback for UAs with no CSS transforms support
    function setPosFallback(pos) {
        slideBlock.style.left = pos+'px';

        slider.left = pos;
    }

    function nextSlide() {
        var n = activeSlide + 1;

        if (n > slidesNumber - 1) {
            n = 0;
        }

        return changeActiveSlide(n);
    }

    function prevSlide() {
        var n = activeSlide - 1;

        if (n < 0) {
            n = slidesNumber - 1;
        }

        return changeActiveSlide(n);
    }

    function startSlideshow() {
        slideshowActive = true;
        stepSlideshow();
    }

    //sets or resets timeout before switching to the next slide
    function stepSlideshow() {
        if (slideshowActive) {
            slideshowTimeoutId && clearTimeout(slideshowTimeoutId);

            slideshowTimeoutId = setTimeout(function() {
                nextSlide();
            },
            o.slideshowInterval);
        }
    }

    //pauses slideshow until `stepSlideshow` is invoked
    function pauseSlideshow() {
        slideshowTimeoutId && clearTimeout(slideshowTimeoutId);
    }

    function stopSlideshow() {
        slideshowActive = false;
        slideshowTimeoutId && clearTimeout(slideshowTimeoutId);
    }

    //this should be invoked when the width of the slider is changed
    function onWidthChange() {
        slider.width = _this.offsetWidth;

        //have to do this in `px` because of webkit's rounding errors :-(
        slideBlock.style.width = slider.width*slidesNumber+'px';
        for (var i = 0; i < slidesNumber; i++) {
            slider.slides[i].style.width = slider.width+'px';
        }
        changePos(-activeSlide*slider.width);
    }

    function addEvent(el, event, func, bool) {
        if (!event) return;

        el.addEventListener? el.addEventListener(event, func, !!bool): el.attachEvent('on'+event, func);
    }

    //init touch events
    function touchInit() {
        EventBurrito(slideBlock, {
            mouse: o.mouseDrag,
            start: function(event, start) {
                //firefox doesn't want to apply cursor from `:active` CSS rule, have to add a class :-/
                addClass(_this, classes.drag);
            },
            move: function(event, start, diff, speed) {
                pauseSlideshow(); //pause the slideshow when touch is in progress

                //if it's first slide and moving left or last slide and moving right -- resist!
                diff.x =
                diff.x /
                    (
                        (!activeSlide && diff.x > 0
                        || activeSlide == slidesNumber - 1 && diff.x < 0)
                        ?
                        (Math.abs(diff.x)/slider.width*2 + 1)
                        :
                        1
                    );

                //change position of the slider appropriately
                changePos(diff.x - slider.width*activeSlide);
            },
            end: function(event, start, diff, speed) {
                if (diff.x) {
                    var ratio = Math.abs(diff.x)/slider.width,
                        //How many slides to skip. Remainder > 0.25 counts for one slide.
                        skip = Math.floor(ratio) + (ratio - Math.floor(ratio) > 0.25?1:0),
                        //Super-duper formula to detect a flick.
                        //First, it's got to be fast enough.
                        //Second, if `skip==0`, 20px move is enough to switch to the next slide.
                        //If `skip>0`, it's enough to slide to the middle of the slide minus `slider.width/9` to skip even further.
                        flick = diff.time < flickThreshold+flickThreshold*skip/1.8 && Math.abs(diff.x) - skip*slider.width > (skip?-slider.width/9:20);

                    skip += (flick?1:0);

                    if (diff.x < 0) {
                        changeActiveSlide(activeSlide+skip, o.touchSpeed);
                    }
                    else {
                        changeActiveSlide(activeSlide-skip, o.touchSpeed);
                    }

                    o.stopSlideshowAfterInteraction && stopSlideshow();
                }

                //remove the drag class
                removeClass(_this, classes.drag);
            }
        });
    }

    function setup() {
        var slideSource = o.slidesContainer || _this,
            dotsTarget = o.dotsContainer || _this;

        if (o.disableIfOneSlide && slideSource.children.length <= 1) return;

        //If current UA doesn't support css transforms or transitions -- use fallback functions.
        //(Using separate functions instead of checks for better performance)
        if (!support.transforms || !!window.opera) setPos = setPosFallback;
        if (!support.transitions || !!window.opera) changePos = changePosFallback;

        slideBlock = o.slidesContainer || document.createElement('div');
        addClass(slideBlock, classes.slides);

        //get slides & generate dots
        for (var i = 0, l = slideSource.children.length; i < l; i++) {
            var slide = slideSource.children[i],
                dot = document.createElement('li');

            slider.slides.push(slide);

            //`tabindex` makes dots tabbable
            dot.setAttribute('tabindex', '0');
            dot.setAttribute('role', 'button');

            dot.innerHTML = '<span></span>';

            (function(x, dotClosure) {
                //bind events to dots
                addEvent(dotClosure, 'click', function(event) {
                    changeActiveSlide(x);
                    o.stopSlideshowAfterInteraction && stopSlideshow();
                });

                //Bind the same function to Enter key except for the `blur` part -- I dont't want
                //the focus to be lost when the user is using his keyboard to navigate.
                addEvent(dotClosure, 'keyup', function(event) {
                    if (event.keyCode == 13) {
                        changeActiveSlide(x);
                        o.stopSlideshowAfterInteraction && stopSlideshow();
                    }
                });

                //Don't want to disable outlines completely for accessibility reasons.
                //Instead, add class with `outline: 0` on mouseup and remove it on blur.
                addEvent(dotClosure, 'mouseup', function(event) {
                    addClass(dotClosure, classes.mouseClicked);
                });

                //capturing fixes IE bug
                addEvent(dotClosure, 'blur', function(){
                    removeClass(dotClosure, classes.mouseClicked);
                }, true);

                //This solves tabbing problems:
                //When an element inside a slide catches focus we switch to that slide
                //and reset `scrollLeft` of the slider block.
                //`SetTimeout` solves Chrome's bug.
                //Event capturing is used to catch events on the slide level.
                //Since older IEs don't have capturing, `onfocusin` is used as a fallback.
                addEvent(slide, 'focus', slide.onfocusin = function(e) {
                    _this.scrollLeft = 0;
                    setTimeout(function() {
                        _this.scrollLeft = 0;
                    }, 0);
                    changeActiveSlide(x);
                }, true);
            })(i, dot)

            slider.dots.push(dot);
        }

        slidesNumber = slider.slides.length;

        slideWidth = 100/slidesNumber;

        addClass(_this, classes.active);
        removeClass(_this, classes.inactive);
        o.mouseDrag && addClass(_this, classes.mouse);

        slider.width = _this.offsetWidth;

        //had to do this in `px` because of webkit's rounding errors :-(
        slideBlock.style.width = slider.width*slidesNumber+'px';
        for (var i = 0; i < slidesNumber; i++) {
            slider.slides[i].style.width = slider.width+'px';
            slideBlock.appendChild(slider.slides[i]);
        }

        if (!o.slidesContainer) _this.appendChild(slideBlock);

        //append dots
        if (o.dots && slidesNumber > 1) {
            dotBlock = document.createElement('ul');
            addClass(dotBlock, classes.dots);

            for (var i = 0, l = slider.dots.length; i < l; i++) {
                dotBlock.appendChild(slider.dots[i]);
            }

            if (o.dotsPrepend) {
                dotsTarget.insertBefore(dotBlock,dotsTarget.firstChild);
            }
            else {
                dotsTarget.appendChild(dotBlock);
            }
        }

        //watch for slider width changes
        addEvent(window, 'resize', onWidthChange);
        addEvent(window, 'orientationchange', onWidthChange);

        //init first slide, timeout to expose the API first
        setTimeout(function() {
            changeActiveSlide(o.startSlide, 0);
        }, 0);

        //init slideshow
        if (o.slideshow) startSlideshow();

        touchInit();

        //API callback, timeout to expose the API first
        setTimeout(function() {
            o.onSetup && o.onSetup(slidesNumber);
        }, 0);
    }

    //Init
    setup();

    //expose the API
    return {
        slideTo: function(slide, speed) {
            return changeActiveSlide(parseInt(slide, 10), speed);
        },

        next: nextSlide,

        prev: prevSlide,

        //start slideshow
        start: startSlideshow,

        //stop slideshow
        stop: stopSlideshow,

        //pause slideshow until the next slide change
        pause: pauseSlideshow,

        //get current slide number
        getCurrentPos: function() {
            return activeSlide;
        },

        //get total number of slides
        getSlidesNumber: function() {
            return slidesNumber;
        },

        //invoke this when the slider's width is changed
        recalcWidth: onWidthChange
    };
};

//if jQuery is present -- create a plugin
if (window.jQuery) {
    (function($) {
        $.fn.Peppermint = function(options) {
            this.each(function() {
                $(this).data('Peppermint', Peppermint(this, options));
            });

            return this;
        };
    })(window.jQuery);
}
