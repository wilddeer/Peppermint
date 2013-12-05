function eventBurrito(_this, options) {

	var o = options || {},
		noop = function() {};

	o.preventScroll = o.preventScroll || false;
	o.mouse = o.mouse || true;
	o.start = o.start || noop;
	o.move = o.move || noop;
	o.end = o.end || noop;
	o.click = o.click || noop;

	var	support = {
			pointerEvents: !!window.navigator.pointerEnabled,
			msPointerEvents: !!window.navigator.msPointerEnabled
		},
		start = {},
		diff = {},
		isScrolling,
		eventType,
		clicksAllowed = true, //flag allowing default click actions (e.g. links)
		eventModel = (support.pointerEvents? 1 : (support.msPointerEvents? 2 : 0)),
		events = [
			['touchstart', 'touchmove', 'touchend', 'touchcancel'], //touch events
			['pointerdown', 'pointermove', 'pointerup', 'pointercancel'], //pointer events
			['MSPointerDown', 'MSPointerMove', 'MSPointerUp', 'MSPointerCancel'], //IE10 pointer events
			['mousedown', 'mousemove', 'mouseup', false] //mouse events
		],
		//some checks for different event types
		checks = [
			//touch events
			function(e) {
				//if it's multitouch or pinch move -- skip the event
				return (e.touches && e.touches.length > 1) || (e.scale && e.scale !== 1);
			},
			//pointer events
			function(e) {
				//if event is not primary (other pointers during multitouch),
				//if left mouse button is not pressed,
				//if mouse drag is disabled and event is not touch -- skip it!
				return !e.isPrimary || e.buttons !== 1 || (!o.mouse && e.pointerType !== 'touch' && e.pointerType !== 'pen');
			},
			//IE10 pointer events
			function(e) {
				//same checks as in pointer events
				return !e.isPrimary || (e.buttons && e.buttons !== 1) || (!o.mouse && e.pointerType !== e.MSPOINTER_TYPE_TOUCH && e.pointerType !== e.MSPOINTER_TYPE_PEN);
			},
			//mouse events
			function(e) {
				//if left mouse button is not pressed -- skip the event
				//in IE7-8 `buttons` is not defined, in IE9 LMB is 0
				return (e.buttons && e.buttons !== 1);
			}
		];

	function addEvent(el, event, func, bool) {
		if (!event) return;

		el.addEventListener? el.addEventListener(event, func, !!bool): el.attachEvent('on'+event, func);
	}

	function removeEvent(el, event, func, bool) {
		if (!event) return;

		el.removeEventListener? el.removeEventListener(event, func, !!bool): el.detachEvent('on'+event, func);
	}

	function tStart(event, eType) {
		clicksAllowed = true;
		eventType = eType; //leak event type

		if (checks[eventType](event)) return;

		//add event listeners to the document, so that the slider
		//will continue to recieve events wherever the pointer is
		addEvent(document, events[eventType][1], tMove);
		addEvent(document, events[eventType][2], tEnd);
		addEvent(document, events[eventType][3], tEnd);

		//fixes WebKit's cursor while dragging
		if (eventType) event.preventDefault? event.preventDefault() : event.returnValue = false;

		//remember starting time and position
		start = {
			x: eventType? event.clientX : event.touches[0].clientX,
			y: eventType? event.clientY : event.touches[0].clientY,

			time: +new Date
		};

		//reset
		isScrolling = undefined;
		diff = {};

		o.start(event, start);
	}

	function tMove(event) {
		//if user is trying to scroll vertically -- do nothing
		if ((!o.preventScroll && isScrolling) || checks[eventType](event)) return;

		diff = {
			x: (eventType? event.clientX : event.touches[0].clientX) - start.x,
			y: (eventType? event.clientY : event.touches[0].clientY) - start.y
		};

		if (diff.x || diff.y) clicksAllowed = false; //if there was a move -- deny all the clicks before the next touchstart

		//check whether the user is trying to scroll vertically
		if (isScrolling === undefined && eventType !== 3) {
			//assign and check `isScrolling` at the same time
			if (isScrolling = (Math.abs(diff.x) < Math.abs(diff.y)) && !o.preventScroll) return;
		}

		event.preventDefault? event.preventDefault() : event.returnValue = false; //Prevent scrolling
		
		o.move(event, start, diff);
	}

	function tEnd(event) {
		//IE likes to focus the link after touchend.
		//Since we dont' want to disable the outline completely for accessibility reasons,
		//we just defocus it after touch and disable the outline for `:active` links in css.
		//This way the outline will remain visible when tabbing through the links.
		event.target && event.target.blur && event.target.blur();

		//remove the event listeners
		detachEvents();

		o.end(event, start, diff);
	}

	//removes the event listeners from the document
	function detachEvents() {
		removeEvent(document, events[eventType][1], tMove);
		removeEvent(document, events[eventType][2], tEnd);
		removeEvent(document, events[eventType][3], tEnd);
	}

	//bind the touchstart
	addEvent(_this, events[eventModel][0], function(e) {tStart(e, eventModel);});
	//prevent stuff from dragging when using mouse
	addEvent(_this, 'dragstart', function(e){
		event.preventDefault? event.preventDefault() : event.returnValue = false;
	});

	//bind mousedown if necessary
	if (!eventModel) {
		addEvent(_this, events[3][0], function(e) {tStart(e, 3);});
	}

	//No clicking during touch
	addEvent(_this, 'click', function(event) {
		clicksAllowed? o.click(event): (event.preventDefault? event.preventDefault() : event.returnValue = false);
	});

	return {
		getClicksAllowed: function() {
			return clicksAllowed;
		}
	}
}