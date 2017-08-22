/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 120);
/******/ })
/************************************************************************/
/******/ ({

/***/ 120:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(21);


/***/ }),

/***/ 21:
/***/ (function(module, exports, __webpack_require__) {

// Settings for datetimepicker
window.flatpickr = __webpack_require__(24);

/***/ }),

/***/ 24:
/***/ (function(module, exports, __webpack_require__) {

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*! flatpickr v3.0.6, @license MIT */
function FlatpickrInstance(element, config) {
	var self = this;

	self._ = {};
	self._.afterDayAnim = afterDayAnim;
	self._bind = bind;
	self._compareDates = compareDates;
	self._setHoursFromDate = setHoursFromDate;
	self.changeMonth = changeMonth;
	self.changeYear = changeYear;
	self.clear = clear;
	self.close = close;
	self._createElement = createElement;
	self.destroy = destroy;
	self.isEnabled = isEnabled;
	self.jumpToDate = jumpToDate;
	self.open = open;
	self.redraw = redraw;
	self.set = set;
	self.setDate = setDate;
	self.toggle = toggle;

	function init() {
		self.element = self.input = element;
		self.instanceConfig = config || {};
		self.parseDate = FlatpickrInstance.prototype.parseDate.bind(self);
		self.formatDate = FlatpickrInstance.prototype.formatDate.bind(self);

		setupFormats();
		parseConfig();
		setupLocale();
		setupInputs();
		setupDates();
		setupHelperFunctions();

		self.isOpen = false;

		self.isMobile = !self.config.disableMobile && !self.config.inline && self.config.mode === "single" && !self.config.disable.length && !self.config.enable.length && !self.config.weekNumbers && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

		if (!self.isMobile) build();

		bindEvents();

		if (self.selectedDates.length || self.config.noCalendar) {
			if (self.config.enableTime) {
				setHoursFromDate(self.config.noCalendar ? self.latestSelectedDateObj || self.config.minDate : null);
			}
			updateValue(false);
		}

		self.showTimeInput = self.selectedDates.length > 0 || self.config.noCalendar;

		if (self.config.weekNumbers) {
			self.calendarContainer.style.width = self.daysContainer.offsetWidth + self.weekWrapper.offsetWidth + "px";
		}

		if (!self.isMobile) positionCalendar();

		triggerEvent("Ready");
	}

	/**
  * Binds a function to the current flatpickr instance
  * @param {Function} fn the function
  * @return {Function} the function bound to the instance
  */
	function bindToInstance(fn) {
		return fn.bind(self);
	}

	/**
  * The handler for all events targeting the time inputs
  * @param {Event} e the event - "input", "wheel", "increment", etc
  */
	function updateTime(e) {
		if (self.config.noCalendar && !self.selectedDates.length)
			// picking time only
			self.selectedDates = [self.now];

		timeWrapper(e);

		if (!self.selectedDates.length) return;

		if (!self.minDateHasTime || e.type !== "input" || e.target.value.length >= 2) {
			setHoursFromInputs();
			updateValue();
		} else {
			setTimeout(function () {
				setHoursFromInputs();
				updateValue();
			}, 1000);
		}
	}

	/**
  * Syncs the selected date object time with user's time input
  */
	function setHoursFromInputs() {
		if (!self.config.enableTime) return;

		var hours = (parseInt(self.hourElement.value, 10) || 0) % (self.amPM ? 12 : 24),
		    minutes = (parseInt(self.minuteElement.value, 10) || 0) % 60,
		    seconds = self.config.enableSeconds ? (parseInt(self.secondElement.value, 10) || 0) % 60 : 0;

		if (self.amPM !== undefined) hours = hours % 12 + 12 * (self.amPM.textContent === "PM");

		if (self.minDateHasTime && compareDates(self.latestSelectedDateObj, self.config.minDate) === 0) {

			hours = Math.max(hours, self.config.minDate.getHours());
			if (hours === self.config.minDate.getHours()) minutes = Math.max(minutes, self.config.minDate.getMinutes());
		}

		if (self.maxDateHasTime && compareDates(self.latestSelectedDateObj, self.config.maxDate) === 0) {
			hours = Math.min(hours, self.config.maxDate.getHours());
			if (hours === self.config.maxDate.getHours()) minutes = Math.min(minutes, self.config.maxDate.getMinutes());
		}

		setHours(hours, minutes, seconds);
	}

	/**
  * Syncs time input values with a date
  * @param {Date} dateObj the date to sync with
  */
	function setHoursFromDate(dateObj) {
		var date = dateObj || self.latestSelectedDateObj;

		if (date) setHours(date.getHours(), date.getMinutes(), date.getSeconds());
	}

	/**
  * Sets the hours, minutes, and optionally seconds
  * of the latest selected date object and the
  * corresponding time inputs
  * @param {Number} hours the hour. whether its military
  *                 or am-pm gets inferred from config
  * @param {Number} minutes the minutes
  * @param {Number} seconds the seconds (optional)
  */
	function setHours(hours, minutes, seconds) {
		if (self.selectedDates.length) {
			self.latestSelectedDateObj.setHours(hours % 24, minutes, seconds || 0, 0);
		}

		if (!self.config.enableTime || self.isMobile) return;

		self.hourElement.value = self.pad(!self.config.time_24hr ? (12 + hours) % 12 + 12 * (hours % 12 === 0) : hours);

		self.minuteElement.value = self.pad(minutes);

		if (!self.config.time_24hr) self.amPM.textContent = hours >= 12 ? "PM" : "AM";

		if (self.config.enableSeconds === true) self.secondElement.value = self.pad(seconds);
	}

	/**
  * Handles the year input and incrementing events
  * @param {Event} event the keyup or increment event
  */
	function onYearInput(event) {
		var year = event.target.value;
		if (event.delta) year = (parseInt(year) + event.delta).toString();

		if (year.length === 4 || event.key === "Enter") {
			self.currentYearElement.blur();
			if (!/[^\d]/.test(year)) changeYear(year);
		}
	}

	/**
  * Essentially addEventListener + tracking
  * @param {Element} element the element to addEventListener to
  * @param {String} event the event name
  * @param {Function} handler the event handler
  */
	function bind(element, event, handler) {
		if (event instanceof Array) return event.forEach(function (ev) {
			return bind(element, ev, handler);
		});

		if (element instanceof Array) return element.forEach(function (el) {
			return bind(el, event, handler);
		});

		element.addEventListener(event, handler);
		self._handlers.push({ element: element, event: event, handler: handler });
	}

	/**
  * A mousedown handler which mimics click.
  * Minimizes latency, since we don't need to wait for mouseup in most cases.
  * Also, avoids handling right clicks.
  *
  * @param {Function} handler the event handler
  */
	function onClick(handler) {
		return function (evt) {
			return evt.which === 1 && handler(evt);
		};
	}

	/**
  * Adds all the necessary event listeners
  */
	function bindEvents() {
		self._handlers = [];
		self._animationLoop = [];
		if (self.config.wrap) {
			["open", "close", "toggle", "clear"].forEach(function (evt) {
				Array.prototype.forEach.call(self.element.querySelectorAll("[data-" + evt + "]"), function (el) {
					return bind(el, "mousedown", onClick(self[evt]));
				});
			});
		}

		if (self.isMobile) return setupMobile();

		self.debouncedResize = debounce(onResize, 50);
		self.triggerChange = function () {
			triggerEvent("Change");
		};
		self.debouncedChange = debounce(self.triggerChange, 300);

		if (self.config.mode === "range" && self.daysContainer) bind(self.daysContainer, "mouseover", function (e) {
			return onMouseOver(e.target);
		});

		bind(window.document.body, "keydown", onKeyDown);

		if (!self.config.static) bind(self._input, "keydown", onKeyDown);

		if (!self.config.inline && !self.config.static) bind(window, "resize", self.debouncedResize);

		if (window.ontouchstart !== undefined) bind(window.document, "touchstart", documentClick);

		bind(window.document, "mousedown", onClick(documentClick));
		bind(self._input, "blur", documentClick);

		if (self.config.clickOpens === true) {
			bind(self._input, "focus", self.open);
			bind(self._input, "mousedown", onClick(self.open));
		}

		if (!self.config.noCalendar) {
			self.monthNav.addEventListener("wheel", function (e) {
				return e.preventDefault();
			});
			bind(self.monthNav, "wheel", debounce(onMonthNavScroll, 10));
			bind(self.monthNav, "mousedown", onClick(onMonthNavClick));

			bind(self.monthNav, ["keyup", "increment"], onYearInput);
			bind(self.daysContainer, "mousedown", onClick(selectDate));

			if (self.config.animate) {
				bind(self.daysContainer, ["webkitAnimationEnd", "animationend"], animateDays);
				bind(self.monthNav, ["webkitAnimationEnd", "animationend"], animateMonths);
			}
		}

		if (self.config.enableTime) {
			var selText = function selText(e) {
				return e.target.select();
			};
			bind(self.timeContainer, ["wheel", "input", "increment"], updateTime);
			bind(self.timeContainer, "mousedown", onClick(timeIncrement));

			bind(self.timeContainer, ["wheel", "increment"], self.debouncedChange);
			bind(self.timeContainer, "input", self.triggerChange);

			bind([self.hourElement, self.minuteElement], "focus", selText);

			if (self.secondElement !== undefined) bind(self.secondElement, "focus", function () {
				return self.secondElement.select();
			});

			if (self.amPM !== undefined) {
				bind(self.amPM, "mousedown", onClick(function (e) {
					updateTime(e);
					self.triggerChange(e);
				}));
			}
		}
	}

	function processPostDayAnimation() {
		for (var i = self._animationLoop.length; i--;) {
			self._animationLoop[i]();
			self._animationLoop.splice(i, 1);
		}
	}

	/**
  * Removes the day container that slided out of view
  * @param {Event} e the animation event
  */
	function animateDays(e) {
		if (self.daysContainer.childNodes.length > 1) {
			switch (e.animationName) {
				case "fpSlideLeft":
					self.daysContainer.lastChild.classList.remove("slideLeftNew");
					self.daysContainer.removeChild(self.daysContainer.firstChild);
					self.days = self.daysContainer.firstChild;
					processPostDayAnimation();

					break;

				case "fpSlideRight":
					self.daysContainer.firstChild.classList.remove("slideRightNew");
					self.daysContainer.removeChild(self.daysContainer.lastChild);
					self.days = self.daysContainer.firstChild;
					processPostDayAnimation();

					break;

				default:
					break;
			}
		}
	}

	/**
  * Removes the month element that animated out of view
  * @param {Event} e the animation event
  */
	function animateMonths(e) {
		switch (e.animationName) {
			case "fpSlideLeftNew":
			case "fpSlideRightNew":
				self.navigationCurrentMonth.classList.remove("slideLeftNew");
				self.navigationCurrentMonth.classList.remove("slideRightNew");
				var nav = self.navigationCurrentMonth;

				while (nav.nextSibling && /curr/.test(nav.nextSibling.className)) {
					self.monthNav.removeChild(nav.nextSibling);
				}while (nav.previousSibling && /curr/.test(nav.previousSibling.className)) {
					self.monthNav.removeChild(nav.previousSibling);
				}self.oldCurMonth = null;
				break;
		}
	}

	/**
  * Set the calendar view to a particular date.
  * @param {Date} jumpDate the date to set the view to
  */
	function jumpToDate(jumpDate) {
		jumpDate = jumpDate ? self.parseDate(jumpDate) : self.latestSelectedDateObj || (self.config.minDate > self.now ? self.config.minDate : self.config.maxDate && self.config.maxDate < self.now ? self.config.maxDate : self.now);

		try {
			self.currentYear = jumpDate.getFullYear();
			self.currentMonth = jumpDate.getMonth();
		} catch (e) {
			/* istanbul ignore next */
			console.error(e.stack);
			/* istanbul ignore next */
			console.warn("Invalid date supplied: " + jumpDate);
		}

		self.redraw();
	}

	/**
  * The up/down arrow handler for time inputs
  * @param {Event} e the click event
  */
	function timeIncrement(e) {
		if (~e.target.className.indexOf("arrow")) incrementNumInput(e, e.target.classList.contains("arrowUp") ? 1 : -1);
	}

	/**
  * Increments/decrements the value of input associ-
  * ated with the up/down arrow by dispatching an
  * "increment" event on the input.
  *
  * @param {Event} e the click event
  * @param {Number} delta the diff (usually 1 or -1)
  * @param {Element} inputElem the input element
  */
	function incrementNumInput(e, delta, inputElem) {
		var input = inputElem || e.target.parentNode.childNodes[0];
		var event = createEvent("increment");
		event.delta = delta;
		input.dispatchEvent(event);
	}

	function createNumberInput(inputClassName) {
		var wrapper = createElement("div", "numInputWrapper"),
		    numInput = createElement("input", "numInput " + inputClassName),
		    arrowUp = createElement("span", "arrowUp"),
		    arrowDown = createElement("span", "arrowDown");

		numInput.type = "text";
		numInput.pattern = "\\d*";

		wrapper.appendChild(numInput);
		wrapper.appendChild(arrowUp);
		wrapper.appendChild(arrowDown);

		return wrapper;
	}

	function build() {
		var fragment = window.document.createDocumentFragment();
		self.calendarContainer = createElement("div", "flatpickr-calendar");
		self.calendarContainer.tabIndex = -1;

		if (!self.config.noCalendar) {
			fragment.appendChild(buildMonthNav());
			self.innerContainer = createElement("div", "flatpickr-innerContainer");

			if (self.config.weekNumbers) self.innerContainer.appendChild(buildWeeks());

			self.rContainer = createElement("div", "flatpickr-rContainer");
			self.rContainer.appendChild(buildWeekdays());

			if (!self.daysContainer) {
				self.daysContainer = createElement("div", "flatpickr-days");
				self.daysContainer.tabIndex = -1;
			}

			buildDays();
			self.rContainer.appendChild(self.daysContainer);

			self.innerContainer.appendChild(self.rContainer);
			fragment.appendChild(self.innerContainer);
		}

		if (self.config.enableTime) fragment.appendChild(buildTime());

		toggleClass(self.calendarContainer, "rangeMode", self.config.mode === "range");
		toggleClass(self.calendarContainer, "animate", self.config.animate);

		self.calendarContainer.appendChild(fragment);

		var customAppend = self.config.appendTo && self.config.appendTo.nodeType;

		if (self.config.inline || self.config.static) {
			self.calendarContainer.classList.add(self.config.inline ? "inline" : "static");

			if (self.config.inline && !customAppend) {
				return self.element.parentNode.insertBefore(self.calendarContainer, self._input.nextSibling);
			}

			if (self.config.static) {
				var wrapper = createElement("div", "flatpickr-wrapper");
				self.element.parentNode.insertBefore(wrapper, self.element);
				wrapper.appendChild(self.element);

				if (self.altInput) wrapper.appendChild(self.altInput);

				wrapper.appendChild(self.calendarContainer);
				return;
			}
		}

		(customAppend ? self.config.appendTo : window.document.body).appendChild(self.calendarContainer);
	}

	function createDay(className, date, dayNumber, i) {
		var dateIsEnabled = isEnabled(date, true),
		    dayElement = createElement("span", "flatpickr-day " + className, date.getDate());

		dayElement.dateObj = date;
		dayElement.$i = i;
		dayElement.setAttribute("aria-label", self.formatDate(date, self.config.ariaDateFormat));

		if (compareDates(date, self.now) === 0) {
			self.todayDateElem = dayElement;
			dayElement.classList.add("today");
		}

		if (dateIsEnabled) {
			dayElement.tabIndex = -1;
			if (isDateSelected(date)) {
				dayElement.classList.add("selected");
				self.selectedDateElem = dayElement;
				if (self.config.mode === "range") {
					toggleClass(dayElement, "startRange", compareDates(date, self.selectedDates[0]) === 0);

					toggleClass(dayElement, "endRange", compareDates(date, self.selectedDates[1]) === 0);
				}
			}
		} else {
			dayElement.classList.add("disabled");
			if (self.selectedDates[0] && date > self.minRangeDate && date < self.selectedDates[0]) self.minRangeDate = date;else if (self.selectedDates[0] && date < self.maxRangeDate && date > self.selectedDates[0]) self.maxRangeDate = date;
		}

		if (self.config.mode === "range") {
			if (isDateInRange(date) && !isDateSelected(date)) dayElement.classList.add("inRange");

			if (self.selectedDates.length === 1 && (date < self.minRangeDate || date > self.maxRangeDate)) dayElement.classList.add("notAllowed");
		}

		if (self.config.weekNumbers && className !== "prevMonthDay" && dayNumber % 7 === 1) {
			self.weekNumbers.insertAdjacentHTML("beforeend", "<span class='disabled flatpickr-day'>" + self.config.getWeek(date) + "</span>");
		}

		triggerEvent("DayCreate", dayElement);

		return dayElement;
	}

	function focusOnDay(currentIndex, offset) {
		var newIndex = currentIndex + offset || 0,
		    targetNode = currentIndex !== undefined ? self.days.childNodes[newIndex] : self.selectedDateElem || self.todayDateElem || self.days.childNodes[0],
		    focus = function focus() {
			targetNode = targetNode || self.days.childNodes[newIndex];
			targetNode.focus();

			if (self.config.mode === "range") onMouseOver(targetNode);
		};

		if (targetNode === undefined && offset !== 0) {
			if (offset > 0) {
				self.changeMonth(1);
				newIndex = newIndex % 42;
			} else if (offset < 0) {
				self.changeMonth(-1);
				newIndex += 42;
			}

			return afterDayAnim(focus);
		}

		focus();
	}

	function afterDayAnim(fn) {
		if (self.config.animate === true) return self._animationLoop.push(fn);
		fn();
	}

	function buildDays(delta) {
		var firstOfMonth = (new Date(self.currentYear, self.currentMonth, 1).getDay() - self.l10n.firstDayOfWeek + 7) % 7,
		    isRangeMode = self.config.mode === "range";

		self.prevMonthDays = self.utils.getDaysinMonth((self.currentMonth - 1 + 12) % 12);
		self.selectedDateElem = undefined;
		self.todayDateElem = undefined;

		var daysInMonth = self.utils.getDaysinMonth(),
		    days = window.document.createDocumentFragment();

		var dayNumber = self.prevMonthDays + 1 - firstOfMonth,
		    dayIndex = 0;

		if (self.config.weekNumbers && self.weekNumbers.firstChild) self.weekNumbers.textContent = "";

		if (isRangeMode) {
			// const dateLimits = self.config.enable.length || self.config.disable.length || self.config.mixDate || self.config.maxDate;
			self.minRangeDate = new Date(self.currentYear, self.currentMonth - 1, dayNumber);
			self.maxRangeDate = new Date(self.currentYear, self.currentMonth + 1, (42 - firstOfMonth) % daysInMonth);
		}

		// prepend days from the ending of previous month
		for (; dayNumber <= self.prevMonthDays; dayNumber++, dayIndex++) {
			days.appendChild(createDay("prevMonthDay", new Date(self.currentYear, self.currentMonth - 1, dayNumber), dayNumber, dayIndex));
		}

		// Start at 1 since there is no 0th day
		for (dayNumber = 1; dayNumber <= daysInMonth; dayNumber++, dayIndex++) {
			days.appendChild(createDay("", new Date(self.currentYear, self.currentMonth, dayNumber), dayNumber, dayIndex));
		}

		// append days from the next month
		for (var dayNum = daysInMonth + 1; dayNum <= 42 - firstOfMonth; dayNum++, dayIndex++) {
			days.appendChild(createDay("nextMonthDay", new Date(self.currentYear, self.currentMonth + 1, dayNum % daysInMonth), dayNum, dayIndex));
		}

		if (isRangeMode && self.selectedDates.length === 1 && days.childNodes[0]) {
			self._hidePrevMonthArrow = self._hidePrevMonthArrow || self.minRangeDate > days.childNodes[0].dateObj;

			self._hideNextMonthArrow = self._hideNextMonthArrow || self.maxRangeDate < new Date(self.currentYear, self.currentMonth + 1, 1);
		} else updateNavigationCurrentMonth();

		var dayContainer = createElement("div", "dayContainer");
		dayContainer.appendChild(days);

		if (!self.config.animate || delta === undefined) clearNode(self.daysContainer);else {
			while (self.daysContainer.childNodes.length > 1) {
				self.daysContainer.removeChild(self.daysContainer.firstChild);
			}
		}

		if (delta >= 0) self.daysContainer.appendChild(dayContainer);else self.daysContainer.insertBefore(dayContainer, self.daysContainer.firstChild);

		self.days = self.daysContainer.firstChild;
		return self.daysContainer;
	}

	function clearNode(node) {
		while (node.firstChild) {
			node.removeChild(node.firstChild);
		}
	}

	function buildMonthNav() {
		var monthNavFragment = window.document.createDocumentFragment();
		self.monthNav = createElement("div", "flatpickr-month");

		self.prevMonthNav = createElement("span", "flatpickr-prev-month");
		self.prevMonthNav.innerHTML = self.config.prevArrow;

		self.currentMonthElement = createElement("span", "cur-month");
		self.currentMonthElement.title = self.l10n.scrollTitle;

		var yearInput = createNumberInput("cur-year");
		self.currentYearElement = yearInput.childNodes[0];
		self.currentYearElement.title = self.l10n.scrollTitle;

		if (self.config.minDate) self.currentYearElement.min = self.config.minDate.getFullYear();

		if (self.config.maxDate) {
			self.currentYearElement.max = self.config.maxDate.getFullYear();

			self.currentYearElement.disabled = self.config.minDate && self.config.minDate.getFullYear() === self.config.maxDate.getFullYear();
		}

		self.nextMonthNav = createElement("span", "flatpickr-next-month");
		self.nextMonthNav.innerHTML = self.config.nextArrow;

		self.navigationCurrentMonth = createElement("span", "flatpickr-current-month");
		self.navigationCurrentMonth.appendChild(self.currentMonthElement);
		self.navigationCurrentMonth.appendChild(yearInput);

		monthNavFragment.appendChild(self.prevMonthNav);
		monthNavFragment.appendChild(self.navigationCurrentMonth);
		monthNavFragment.appendChild(self.nextMonthNav);
		self.monthNav.appendChild(monthNavFragment);

		Object.defineProperty(self, "_hidePrevMonthArrow", {
			get: function get() {
				return this.__hidePrevMonthArrow;
			},
			set: function set(bool) {
				if (this.__hidePrevMonthArrow !== bool) self.prevMonthNav.style.display = bool ? "none" : "block";
				this.__hidePrevMonthArrow = bool;
			}
		});

		Object.defineProperty(self, "_hideNextMonthArrow", {
			get: function get() {
				return this.__hideNextMonthArrow;
			},
			set: function set(bool) {
				if (this.__hideNextMonthArrow !== bool) self.nextMonthNav.style.display = bool ? "none" : "block";
				this.__hideNextMonthArrow = bool;
			}
		});

		updateNavigationCurrentMonth();

		return self.monthNav;
	}

	function buildTime() {
		self.calendarContainer.classList.add("hasTime");
		if (self.config.noCalendar) self.calendarContainer.classList.add("noCalendar");
		self.timeContainer = createElement("div", "flatpickr-time");
		self.timeContainer.tabIndex = -1;
		var separator = createElement("span", "flatpickr-time-separator", ":");

		var hourInput = createNumberInput("flatpickr-hour");
		self.hourElement = hourInput.childNodes[0];

		var minuteInput = createNumberInput("flatpickr-minute");
		self.minuteElement = minuteInput.childNodes[0];

		self.hourElement.tabIndex = self.minuteElement.tabIndex = -1;

		self.hourElement.value = self.pad(self.latestSelectedDateObj ? self.latestSelectedDateObj.getHours() : self.config.defaultHour % (self.time_24hr ? 24 : 12));

		self.minuteElement.value = self.pad(self.latestSelectedDateObj ? self.latestSelectedDateObj.getMinutes() : self.config.defaultMinute);

		self.hourElement.step = self.config.hourIncrement;
		self.minuteElement.step = self.config.minuteIncrement;

		self.hourElement.min = self.config.time_24hr ? 0 : 1;
		self.hourElement.max = self.config.time_24hr ? 23 : 12;

		self.minuteElement.min = 0;
		self.minuteElement.max = 59;

		self.hourElement.title = self.minuteElement.title = self.l10n.scrollTitle;

		self.timeContainer.appendChild(hourInput);
		self.timeContainer.appendChild(separator);
		self.timeContainer.appendChild(minuteInput);

		if (self.config.time_24hr) self.timeContainer.classList.add("time24hr");

		if (self.config.enableSeconds) {
			self.timeContainer.classList.add("hasSeconds");

			var secondInput = createNumberInput("flatpickr-second");
			self.secondElement = secondInput.childNodes[0];

			self.secondElement.value = self.pad(self.latestSelectedDateObj ? self.latestSelectedDateObj.getSeconds() : self.config.defaultSeconds);

			self.secondElement.step = self.minuteElement.step;
			self.secondElement.min = self.minuteElement.min;
			self.secondElement.max = self.minuteElement.max;

			self.timeContainer.appendChild(createElement("span", "flatpickr-time-separator", ":"));
			self.timeContainer.appendChild(secondInput);
		}

		if (!self.config.time_24hr) {
			// add self.amPM if appropriate
			self.amPM = createElement("span", "flatpickr-am-pm", ["AM", "PM"][(self.latestSelectedDateObj ? self.hourElement.value : self.config.defaultHour) > 11 | 0]);
			self.amPM.title = self.l10n.toggleTitle;
			self.amPM.tabIndex = -1;
			self.timeContainer.appendChild(self.amPM);
		}

		return self.timeContainer;
	}

	function buildWeekdays() {
		if (!self.weekdayContainer) self.weekdayContainer = createElement("div", "flatpickr-weekdays");

		var firstDayOfWeek = self.l10n.firstDayOfWeek;
		var weekdays = self.l10n.weekdays.shorthand.slice();

		if (firstDayOfWeek > 0 && firstDayOfWeek < weekdays.length) {
			weekdays = [].concat(weekdays.splice(firstDayOfWeek, weekdays.length), weekdays.splice(0, firstDayOfWeek));
		}

		self.weekdayContainer.innerHTML = "\n\t\t<span class=flatpickr-weekday>\n\t\t\t" + weekdays.join("</span><span class=flatpickr-weekday>") + "\n\t\t</span>\n\t\t";

		return self.weekdayContainer;
	}

	/* istanbul ignore next */
	function buildWeeks() {
		self.calendarContainer.classList.add("hasWeeks");
		self.weekWrapper = createElement("div", "flatpickr-weekwrapper");
		self.weekWrapper.appendChild(createElement("span", "flatpickr-weekday", self.l10n.weekAbbreviation));
		self.weekNumbers = createElement("div", "flatpickr-weeks");
		self.weekWrapper.appendChild(self.weekNumbers);

		return self.weekWrapper;
	}

	function changeMonth(value, is_offset, animate) {
		is_offset = is_offset === undefined || is_offset;
		var delta = is_offset ? value : value - self.currentMonth;
		var skipAnimations = !self.config.animate || animate === false;

		if (delta < 0 && self._hidePrevMonthArrow || delta > 0 && self._hideNextMonthArrow) return;

		self.currentMonth += delta;

		if (self.currentMonth < 0 || self.currentMonth > 11) {
			self.currentYear += self.currentMonth > 11 ? 1 : -1;
			self.currentMonth = (self.currentMonth + 12) % 12;

			triggerEvent("YearChange");
		}

		buildDays(!skipAnimations ? delta : undefined);

		if (skipAnimations) {
			triggerEvent("MonthChange");
			return updateNavigationCurrentMonth();
		}

		// remove possible remnants from clicking too fast
		var nav = self.navigationCurrentMonth;
		if (delta < 0) {
			while (nav.nextSibling && /curr/.test(nav.nextSibling.className)) {
				self.monthNav.removeChild(nav.nextSibling);
			}
		} else if (delta > 0) {
			while (nav.previousSibling && /curr/.test(nav.previousSibling.className)) {
				self.monthNav.removeChild(nav.previousSibling);
			}
		}

		self.oldCurMonth = self.navigationCurrentMonth;

		self.navigationCurrentMonth = self.monthNav.insertBefore(self.oldCurMonth.cloneNode(true), delta > 0 ? self.oldCurMonth.nextSibling : self.oldCurMonth);

		if (delta > 0) {
			self.daysContainer.firstChild.classList.add("slideLeft");
			self.daysContainer.lastChild.classList.add("slideLeftNew");

			self.oldCurMonth.classList.add("slideLeft");
			self.navigationCurrentMonth.classList.add("slideLeftNew");
		} else if (delta < 0) {
			self.daysContainer.firstChild.classList.add("slideRightNew");
			self.daysContainer.lastChild.classList.add("slideRight");

			self.oldCurMonth.classList.add("slideRight");
			self.navigationCurrentMonth.classList.add("slideRightNew");
		}

		self.currentMonthElement = self.navigationCurrentMonth.firstChild;
		self.currentYearElement = self.navigationCurrentMonth.lastChild.childNodes[0];

		updateNavigationCurrentMonth();
		self.oldCurMonth.firstChild.textContent = self.utils.monthToStr(self.currentMonth - delta);

		triggerEvent("MonthChange");

		if (document.activeElement && document.activeElement.$i) {
			var index = document.activeElement.$i;
			afterDayAnim(function () {
				focusOnDay(index, 0);
			});
		}
	}

	function clear(triggerChangeEvent) {
		self.input.value = "";

		if (self.altInput) self.altInput.value = "";

		if (self.mobileInput) self.mobileInput.value = "";

		self.selectedDates = [];
		self.latestSelectedDateObj = undefined;
		self.showTimeInput = false;

		self.redraw();

		if (triggerChangeEvent !== false)
			// triggerChangeEvent is true (default) or an Event
			triggerEvent("Change");
	}

	function close() {
		self.isOpen = false;

		if (!self.isMobile) {
			self.calendarContainer.classList.remove("open");
			self._input.classList.remove("active");
		}

		triggerEvent("Close");
	}

	function destroy() {
		if (self.config !== undefined) triggerEvent("Destroy");

		for (var i = self._handlers.length; i--;) {
			var h = self._handlers[i];
			h.element.removeEventListener(h.event, h.handler);
		}

		self._handlers = [];

		if (self.mobileInput) {
			if (self.mobileInput.parentNode) self.mobileInput.parentNode.removeChild(self.mobileInput);
			self.mobileInput = null;
		} else if (self.calendarContainer && self.calendarContainer.parentNode) self.calendarContainer.parentNode.removeChild(self.calendarContainer);

		if (self.altInput) {
			self.input.type = "text";
			if (self.altInput.parentNode) self.altInput.parentNode.removeChild(self.altInput);
			delete self.altInput;
		}

		if (self.input) {
			self.input.type = self.input._type;
			self.input.classList.remove("flatpickr-input");
			self.input.removeAttribute("readonly");
			self.input.value = "";
		}

		["_showTimeInput", "latestSelectedDateObj", "_hideNextMonthArrow", "_hidePrevMonthArrow", "__hideNextMonthArrow", "__hidePrevMonthArrow", "isMobile", "isOpen", "selectedDateElem", "minDateHasTime", "maxDateHasTime", "days", "daysContainer", "_input", "_positionElement", "innerContainer", "rContainer", "monthNav", "todayDateElem", "calendarContainer", "weekdayContainer", "prevMonthNav", "nextMonthNav", "currentMonthElement", "currentYearElement", "navigationCurrentMonth", "selectedDateElem", "config"].forEach(function (k) {
			try {
				delete self[k];
			} catch (e) {}
		});
	}

	function isCalendarElem(elem) {
		if (self.config.appendTo && self.config.appendTo.contains(elem)) return true;

		return self.calendarContainer.contains(elem);
	}

	function documentClick(e) {
		if (self.isOpen && !self.config.inline) {
			var isCalendarElement = isCalendarElem(e.target);
			var isInput = e.target === self.input || e.target === self.altInput || self.element.contains(e.target) ||
			// web components
			e.path && e.path.indexOf && (~e.path.indexOf(self.input) || ~e.path.indexOf(self.altInput));

			var lostFocus = e.type === "blur" ? isInput && e.relatedTarget && !isCalendarElem(e.relatedTarget) : !isInput && !isCalendarElement;

			if (lostFocus && self.config.ignoredFocusElements.indexOf(e.target) === -1) {
				self.close();

				if (self.config.mode === "range" && self.selectedDates.length === 1) {
					self.clear(false);
					self.redraw();
				}
			}
		}
	}

	function changeYear(newYear) {
		if (!newYear || self.currentYearElement.min && newYear < self.currentYearElement.min || self.currentYearElement.max && newYear > self.currentYearElement.max) return;

		var newYearNum = parseInt(newYear, 10),
		    isNewYear = self.currentYear !== newYearNum;

		self.currentYear = newYearNum || self.currentYear;

		if (self.config.maxDate && self.currentYear === self.config.maxDate.getFullYear()) {
			self.currentMonth = Math.min(self.config.maxDate.getMonth(), self.currentMonth);
		} else if (self.config.minDate && self.currentYear === self.config.minDate.getFullYear()) {
			self.currentMonth = Math.max(self.config.minDate.getMonth(), self.currentMonth);
		}

		if (isNewYear) {
			self.redraw();
			triggerEvent("YearChange");
		}
	}

	function isEnabled(date, timeless) {
		if (self.config.minDate && compareDates(date, self.config.minDate, timeless !== undefined ? timeless : !self.minDateHasTime) < 0 || self.config.maxDate && compareDates(date, self.config.maxDate, timeless !== undefined ? timeless : !self.maxDateHasTime) > 0) return false;

		if (!self.config.enable.length && !self.config.disable.length) return true;

		var dateToCheck = self.parseDate(date, null, true); // timeless

		var bool = self.config.enable.length > 0,
		    array = bool ? self.config.enable : self.config.disable;

		for (var i = 0, d; i < array.length; i++) {
			d = array[i];

			if (d instanceof Function && d(dateToCheck)) // disabled by function
				return bool;else if (d instanceof Date && d.getTime() === dateToCheck.getTime())
				// disabled by date
				return bool;else if (typeof d === "string" && self.parseDate(d, null, true).getTime() === dateToCheck.getTime())
				// disabled by date string
				return bool;else if ( // disabled by range
			(typeof d === "undefined" ? "undefined" : _typeof(d)) === "object" && d.from && d.to && dateToCheck >= d.from && dateToCheck <= d.to) return bool;
		}

		return !bool;
	}

	function onKeyDown(e) {
		var isInput = e.target === self._input;
		var calendarElem = isCalendarElem(e.target);
		var allowInput = self.config.allowInput;
		var allowKeydown = self.isOpen && (!allowInput || !isInput);
		var allowInlineKeydown = self.config.inline && isInput && !allowInput;

		if (e.key === "Enter" && allowInput && isInput) {
			self.setDate(self._input.value, true, e.target === self.altInput ? self.config.altFormat : self.config.dateFormat);
			return e.target.blur();
		} else if (calendarElem || allowKeydown || allowInlineKeydown) {
			var isTimeObj = self.timeContainer && self.timeContainer.contains(e.target);
			switch (e.key) {
				case "Enter":
					if (isTimeObj) updateValue();else selectDate(e);

					break;

				case "Escape":
					// escape
					e.preventDefault();
					self.close();
					break;

				case "Backspace":
				case "Delete":
					if (!self.config.allowInput) self.clear();
					break;

				case "ArrowLeft":
				case "ArrowRight":
					if (!isTimeObj) {
						e.preventDefault();

						if (self.daysContainer) {
							var _delta = e.key === "ArrowRight" ? 1 : -1;

							if (!e.ctrlKey) focusOnDay(e.target.$i, _delta);else changeMonth(_delta, true);
						} else if (self.config.enableTime && !isTimeObj) self.hourElement.focus();
					}

					break;

				case "ArrowUp":
				case "ArrowDown":
					e.preventDefault();
					var delta = e.key === "ArrowDown" ? 1 : -1;

					if (self.daysContainer) {
						if (e.ctrlKey) {
							changeYear(self.currentYear - delta);
							focusOnDay(e.target.$i, 0);
						} else if (!isTimeObj) focusOnDay(e.target.$i, delta * 7);
					} else if (self.config.enableTime) {
						if (!isTimeObj) self.hourElement.focus();
						updateTime(e);
						self.debouncedChange();
					}

					break;

				case "Tab":
					if (e.target === self.hourElement) {
						e.preventDefault();
						self.minuteElement.select();
					} else if (e.target === self.minuteElement && (self.secondElement || self.amPM)) {
						e.preventDefault();
						(self.secondElement || self.amPM).focus();
					} else if (e.target === self.secondElement) {
						e.preventDefault();
						self.amPM.focus();
					}

					break;

				case "a":
					if (e.target === self.amPM) {
						self.amPM.textContent = "AM";
						setHoursFromInputs();
						updateValue();
					}
					break;

				case "p":
					if (e.target === self.amPM) {
						self.amPM.textContent = "PM";
						setHoursFromInputs();
						updateValue();
					}
					break;

				default:
					break;

			}

			triggerEvent("KeyDown", e);
		}
	}

	function onMouseOver(elem) {
		if (self.selectedDates.length !== 1 || !elem.classList.contains("flatpickr-day")) return;

		var hoverDate = elem.dateObj,
		    initialDate = self.parseDate(self.selectedDates[0], null, true),
		    rangeStartDate = Math.min(hoverDate.getTime(), self.selectedDates[0].getTime()),
		    rangeEndDate = Math.max(hoverDate.getTime(), self.selectedDates[0].getTime()),
		    containsDisabled = false;

		for (var t = rangeStartDate; t < rangeEndDate; t += self.utils.duration.DAY) {
			if (!isEnabled(new Date(t))) {
				containsDisabled = true;
				break;
			}
		}

		var _loop = function _loop(timestamp, i) {
			var outOfRange = timestamp < self.minRangeDate.getTime() || timestamp > self.maxRangeDate.getTime(),
			    dayElem = self.days.childNodes[i];

			if (outOfRange) {
				self.days.childNodes[i].classList.add("notAllowed");
				["inRange", "startRange", "endRange"].forEach(function (c) {
					dayElem.classList.remove(c);
				});
				return "continue";
			} else if (containsDisabled && !outOfRange) return "continue";

			["startRange", "inRange", "endRange", "notAllowed"].forEach(function (c) {
				dayElem.classList.remove(c);
			});

			var minRangeDate = Math.max(self.minRangeDate.getTime(), rangeStartDate),
			    maxRangeDate = Math.min(self.maxRangeDate.getTime(), rangeEndDate);

			elem.classList.add(hoverDate < self.selectedDates[0] ? "startRange" : "endRange");

			if (initialDate < hoverDate && timestamp === initialDate.getTime()) dayElem.classList.add("startRange");else if (initialDate > hoverDate && timestamp === initialDate.getTime()) dayElem.classList.add("endRange");

			if (timestamp >= minRangeDate && timestamp <= maxRangeDate) dayElem.classList.add("inRange");
		};

		for (var timestamp = self.days.childNodes[0].dateObj.getTime(), i = 0; i < 42; i++, timestamp += self.utils.duration.DAY) {
			var _ret = _loop(timestamp, i);

			if (_ret === "continue") continue;
		}
	}

	function onResize() {
		if (self.isOpen && !self.config.static && !self.config.inline) positionCalendar();
	}

	function open(e, positionElement) {
		if (self.isMobile) {
			if (e) {
				e.preventDefault();
				e.target.blur();
			}

			setTimeout(function () {
				self.mobileInput.click();
			}, 0);

			triggerEvent("Open");
			return;
		}

		if (self.isOpen || self._input.disabled || self.config.inline) return;

		self.isOpen = true;
		self.calendarContainer.classList.add("open");
		positionCalendar(positionElement);
		self._input.classList.add("active");

		triggerEvent("Open");
	}

	function minMaxDateSetter(type) {
		return function (date) {
			var dateObj = self.config["_" + type + "Date"] = self.parseDate(date);

			var inverseDateObj = self.config["_" + (type === "min" ? "max" : "min") + "Date"];
			var isValidDate = date && dateObj instanceof Date;

			if (isValidDate) {
				self[type + "DateHasTime"] = dateObj.getHours() || dateObj.getMinutes() || dateObj.getSeconds();
			}

			if (self.selectedDates) {
				self.selectedDates = self.selectedDates.filter(function (d) {
					return isEnabled(d);
				});
				if (!self.selectedDates.length && type === "min") setHoursFromDate(dateObj);
				updateValue();
			}

			if (self.daysContainer) {
				redraw();

				if (isValidDate) self.currentYearElement[type] = dateObj.getFullYear();else self.currentYearElement.removeAttribute(type);

				self.currentYearElement.disabled = inverseDateObj && dateObj && inverseDateObj.getFullYear() === dateObj.getFullYear();
			}
		};
	}

	function parseConfig() {
		var boolOpts = ["wrap", "weekNumbers", "allowInput", "clickOpens", "time_24hr", "enableTime", "noCalendar", "altInput", "shorthandCurrentMonth", "inline", "static", "enableSeconds", "disableMobile"];

		var hooks = ["onChange", "onClose", "onDayCreate", "onDestroy", "onKeyDown", "onMonthChange", "onOpen", "onParseConfig", "onReady", "onValueUpdate", "onYearChange"];

		self.config = Object.create(flatpickr.defaultConfig);

		var userConfig = _extends({}, self.instanceConfig, JSON.parse(JSON.stringify(self.element.dataset || {})));

		self.config.parseDate = userConfig.parseDate;
		self.config.formatDate = userConfig.formatDate;

		Object.defineProperty(self.config, "enable", {
			get: function get() {
				return self.config._enable || [];
			},
			set: function set(dates) {
				return self.config._enable = parseDateRules(dates);
			}
		});

		Object.defineProperty(self.config, "disable", {
			get: function get() {
				return self.config._disable || [];
			},
			set: function set(dates) {
				return self.config._disable = parseDateRules(dates);
			}
		});

		_extends(self.config, userConfig);

		if (!userConfig.dateFormat && userConfig.enableTime) {
			self.config.dateFormat = self.config.noCalendar ? "H:i" + (self.config.enableSeconds ? ":S" : "") : flatpickr.defaultConfig.dateFormat + " H:i" + (self.config.enableSeconds ? ":S" : "");
		}

		if (userConfig.altInput && userConfig.enableTime && !userConfig.altFormat) {
			self.config.altFormat = self.config.noCalendar ? "h:i" + (self.config.enableSeconds ? ":S K" : " K") : flatpickr.defaultConfig.altFormat + (" h:i" + (self.config.enableSeconds ? ":S" : "") + " K");
		}

		Object.defineProperty(self.config, "minDate", {
			get: function get() {
				return this._minDate;
			},
			set: minMaxDateSetter("min")
		});

		Object.defineProperty(self.config, "maxDate", {
			get: function get() {
				return this._maxDate;
			},
			set: minMaxDateSetter("max")
		});

		self.config.minDate = userConfig.minDate;
		self.config.maxDate = userConfig.maxDate;

		for (var i = 0; i < boolOpts.length; i++) {
			self.config[boolOpts[i]] = self.config[boolOpts[i]] === true || self.config[boolOpts[i]] === "true";
		}for (var _i = hooks.length; _i--;) {
			if (self.config[hooks[_i]] !== undefined) {
				self.config[hooks[_i]] = arrayify(self.config[hooks[_i]] || []).map(bindToInstance);
			}
		}

		for (var _i2 = 0; _i2 < self.config.plugins.length; _i2++) {
			var pluginConf = self.config.plugins[_i2](self) || {};
			for (var key in pluginConf) {

				if (self.config[key] instanceof Array || ~hooks.indexOf(key)) {
					self.config[key] = arrayify(pluginConf[key]).map(bindToInstance).concat(self.config[key]);
				} else if (typeof userConfig[key] === "undefined") self.config[key] = pluginConf[key];
			}
		}

		triggerEvent("ParseConfig");
	}

	function setupLocale() {
		if (_typeof(self.config.locale) !== "object" && typeof flatpickr.l10ns[self.config.locale] === "undefined") console.warn("flatpickr: invalid locale " + self.config.locale);

		self.l10n = _extends(Object.create(flatpickr.l10ns.default), _typeof(self.config.locale) === "object" ? self.config.locale : self.config.locale !== "default" ? flatpickr.l10ns[self.config.locale] || {} : {});
	}

	function positionCalendar() {
		var positionElement = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : self._positionElement;

		if (self.calendarContainer === undefined) return;

		var calendarHeight = self.calendarContainer.offsetHeight,
		    calendarWidth = self.calendarContainer.offsetWidth,
		    configPos = self.config.position,
		    inputBounds = positionElement.getBoundingClientRect(),
		    distanceFromBottom = window.innerHeight - inputBounds.bottom,
		    showOnTop = configPos === "above" || configPos !== "below" && distanceFromBottom < calendarHeight && inputBounds.top > calendarHeight;

		var top = window.pageYOffset + inputBounds.top + (!showOnTop ? positionElement.offsetHeight + 2 : -calendarHeight - 2);

		toggleClass(self.calendarContainer, "arrowTop", !showOnTop);
		toggleClass(self.calendarContainer, "arrowBottom", showOnTop);

		if (self.config.inline) return;

		var left = window.pageXOffset + inputBounds.left;
		var right = window.document.body.offsetWidth - inputBounds.right;
		var rightMost = left + calendarWidth > window.document.body.offsetWidth;

		toggleClass(self.calendarContainer, "rightMost", rightMost);

		if (self.config.static) return;

		self.calendarContainer.style.top = top + "px";

		if (!rightMost) {
			self.calendarContainer.style.left = left + "px";
			self.calendarContainer.style.right = "auto";
		} else {
			self.calendarContainer.style.left = "auto";
			self.calendarContainer.style.right = right + "px";
		}
	}

	function redraw() {
		if (self.config.noCalendar || self.isMobile) return;

		buildWeekdays();
		updateNavigationCurrentMonth();
		buildDays();
	}

	function selectDate(e) {
		e.preventDefault();
		e.stopPropagation();

		if (!e.target.classList.contains("flatpickr-day") || e.target.classList.contains("disabled") || e.target.classList.contains("notAllowed")) return;

		var selectedDate = self.latestSelectedDateObj = new Date(e.target.dateObj.getTime());

		var shouldChangeMonth = selectedDate.getMonth() !== self.currentMonth && self.config.mode !== "range";

		self.selectedDateElem = e.target;

		if (self.config.mode === "single") self.selectedDates = [selectedDate];else if (self.config.mode === "multiple") {
			var selectedIndex = isDateSelected(selectedDate);
			if (selectedIndex) self.selectedDates.splice(selectedIndex, 1);else self.selectedDates.push(selectedDate);
		} else if (self.config.mode === "range") {
			if (self.selectedDates.length === 2) self.clear();

			self.selectedDates.push(selectedDate);

			// unless selecting same date twice, sort ascendingly
			if (compareDates(selectedDate, self.selectedDates[0], true) !== 0) self.selectedDates.sort(function (a, b) {
				return a.getTime() - b.getTime();
			});
		}

		setHoursFromInputs();

		if (shouldChangeMonth) {
			var isNewYear = self.currentYear !== selectedDate.getFullYear();
			self.currentYear = selectedDate.getFullYear();
			self.currentMonth = selectedDate.getMonth();

			if (isNewYear) triggerEvent("YearChange");

			triggerEvent("MonthChange");
		}

		buildDays();

		if (self.minDateHasTime && self.config.enableTime && compareDates(selectedDate, self.config.minDate) === 0) setHoursFromDate(self.config.minDate);

		updateValue();

		if (self.config.enableTime) setTimeout(function () {
			return self.showTimeInput = true;
		}, 50);

		if (self.config.mode === "range") {
			if (self.selectedDates.length === 1) {
				onMouseOver(e.target);

				self._hidePrevMonthArrow = self._hidePrevMonthArrow || self.minRangeDate > self.days.childNodes[0].dateObj;

				self._hideNextMonthArrow = self._hideNextMonthArrow || self.maxRangeDate < new Date(self.currentYear, self.currentMonth + 1, 1);
			} else updateNavigationCurrentMonth();
		}

		triggerEvent("Change");

		// maintain focus
		if (!shouldChangeMonth) focusOnDay(e.target.$i, 0);else afterDayAnim(function () {
			return self.selectedDateElem && self.selectedDateElem.focus();
		});

		if (self.config.enableTime) setTimeout(function () {
			return self.hourElement.select();
		}, 451);

		if (self.config.closeOnSelect) {
			var single = self.config.mode === "single" && !self.config.enableTime;
			var range = self.config.mode === "range" && self.selectedDates.length === 2 && !self.config.enableTime;

			if (single || range) self.close();
		}
	}

	function set(option, value) {
		if (option !== null && (typeof option === "undefined" ? "undefined" : _typeof(option)) === "object") _extends(self.config, option);else self.config[option] = value;

		self.redraw();
		jumpToDate();
	}

	function setSelectedDate(inputDate, format) {
		if (inputDate instanceof Array) self.selectedDates = inputDate.map(function (d) {
			return self.parseDate(d, format);
		});else if (inputDate instanceof Date || !isNaN(inputDate)) self.selectedDates = [self.parseDate(inputDate, format)];else if (inputDate && inputDate.substring) {
			switch (self.config.mode) {
				case "single":
					self.selectedDates = [self.parseDate(inputDate, format)];
					break;

				case "multiple":
					self.selectedDates = inputDate.split("; ").map(function (date) {
						return self.parseDate(date, format);
					});
					break;

				case "range":
					self.selectedDates = inputDate.split(self.l10n.rangeSeparator).map(function (date) {
						return self.parseDate(date, format);
					});

					break;

				default:
					break;
			}
		}

		self.selectedDates = self.selectedDates.filter(function (d) {
			return d instanceof Date && isEnabled(d, false);
		});

		self.selectedDates.sort(function (a, b) {
			return a.getTime() - b.getTime();
		});
	}

	function setDate(date, triggerChange, format) {
		if (date !== 0 && !date) return self.clear(triggerChange);

		setSelectedDate(date, format);

		self.showTimeInput = self.selectedDates.length > 0;
		self.latestSelectedDateObj = self.selectedDates[0];

		self.redraw();
		jumpToDate();

		setHoursFromDate();
		updateValue(triggerChange);

		if (triggerChange) triggerEvent("Change");
	}

	function parseDateRules(arr) {
		for (var i = arr.length; i--;) {
			if (typeof arr[i] === "string" || +arr[i]) arr[i] = self.parseDate(arr[i], null, true);else if (arr[i] && arr[i].from && arr[i].to) {
				arr[i].from = self.parseDate(arr[i].from);
				arr[i].to = self.parseDate(arr[i].to);
			}
		}

		return arr.filter(function (x) {
			return x;
		}); // remove falsy values
	}

	function setupDates() {
		self.selectedDates = [];
		self.now = new Date();

		var preloadedDate = self.config.defaultDate || self.input.value;
		if (preloadedDate) setSelectedDate(preloadedDate, self.config.dateFormat);

		var initialDate = self.selectedDates.length ? self.selectedDates[0] : self.config.minDate && self.config.minDate.getTime() > self.now ? self.config.minDate : self.config.maxDate && self.config.maxDate.getTime() < self.now ? self.config.maxDate : self.now;

		self.currentYear = initialDate.getFullYear();
		self.currentMonth = initialDate.getMonth();

		if (self.selectedDates.length) self.latestSelectedDateObj = self.selectedDates[0];

		self.minDateHasTime = self.config.minDate && (self.config.minDate.getHours() || self.config.minDate.getMinutes() || self.config.minDate.getSeconds());

		self.maxDateHasTime = self.config.maxDate && (self.config.maxDate.getHours() || self.config.maxDate.getMinutes() || self.config.maxDate.getSeconds());

		Object.defineProperty(self, "latestSelectedDateObj", {
			get: function get() {
				return self._selectedDateObj || self.selectedDates[self.selectedDates.length - 1];
			},
			set: function set(date) {
				self._selectedDateObj = date;
			}
		});

		if (!self.isMobile) {
			Object.defineProperty(self, "showTimeInput", {
				get: function get() {
					return self._showTimeInput;
				},
				set: function set(bool) {
					self._showTimeInput = bool;
					if (self.calendarContainer) toggleClass(self.calendarContainer, "showTimeInput", bool);
					positionCalendar();
				}
			});
		}
	}

	function setupHelperFunctions() {
		self.utils = {
			duration: {
				DAY: 86400000
			},
			getDaysinMonth: function getDaysinMonth(month, yr) {
				month = typeof month === "undefined" ? self.currentMonth : month;

				yr = typeof yr === "undefined" ? self.currentYear : yr;

				if (month === 1 && (yr % 4 === 0 && yr % 100 !== 0 || yr % 400 === 0)) return 29;

				return self.l10n.daysInMonth[month];
			},
			monthToStr: function monthToStr(monthNumber, shorthand) {
				shorthand = typeof shorthand === "undefined" ? self.config.shorthandCurrentMonth : shorthand;

				return self.l10n.months[(shorthand ? "short" : "long") + "hand"][monthNumber];
			}
		};
	}

	/* istanbul ignore next */
	function setupFormats() {
		self.formats = Object.create(FlatpickrInstance.prototype.formats);
		["D", "F", "J", "M", "W", "l"].forEach(function (f) {
			self.formats[f] = FlatpickrInstance.prototype.formats[f].bind(self);
		});

		self.revFormat.F = FlatpickrInstance.prototype.revFormat.F.bind(self);
		self.revFormat.M = FlatpickrInstance.prototype.revFormat.M.bind(self);
	}

	function setupInputs() {
		self.input = self.config.wrap ? self.element.querySelector("[data-input]") : self.element;

		/* istanbul ignore next */
		if (!self.input) return console.warn("Error: invalid input element specified", self.input);

		self.input._type = self.input.type;
		self.input.type = "text";

		self.input.classList.add("flatpickr-input");
		self._input = self.input;

		if (self.config.altInput) {
			// replicate self.element
			self.altInput = createElement(self.input.nodeName, self.input.className + " " + self.config.altInputClass);
			self._input = self.altInput;
			self.altInput.placeholder = self.input.placeholder;
			self.altInput.disabled = self.input.disabled;
			self.altInput.required = self.input.required;
			self.altInput.type = "text";
			self.input.type = "hidden";

			if (!self.config.static && self.input.parentNode) self.input.parentNode.insertBefore(self.altInput, self.input.nextSibling);
		}

		if (!self.config.allowInput) self._input.setAttribute("readonly", "readonly");

		self._positionElement = self.config.positionElement || self._input;
	}

	function setupMobile() {
		var inputType = self.config.enableTime ? self.config.noCalendar ? "time" : "datetime-local" : "date";

		self.mobileInput = createElement("input", self.input.className + " flatpickr-mobile");
		self.mobileInput.step = self.input.getAttribute("step") || "any";
		self.mobileInput.tabIndex = 1;
		self.mobileInput.type = inputType;
		self.mobileInput.disabled = self.input.disabled;
		self.mobileInput.placeholder = self.input.placeholder;

		self.mobileFormatStr = inputType === "datetime-local" ? "Y-m-d\\TH:i:S" : inputType === "date" ? "Y-m-d" : "H:i:S";

		if (self.selectedDates.length) {
			self.mobileInput.defaultValue = self.mobileInput.value = self.formatDate(self.selectedDates[0], self.mobileFormatStr);
		}

		if (self.config.minDate) self.mobileInput.min = self.formatDate(self.config.minDate, "Y-m-d");

		if (self.config.maxDate) self.mobileInput.max = self.formatDate(self.config.maxDate, "Y-m-d");

		self.input.type = "hidden";
		if (self.config.altInput) self.altInput.type = "hidden";

		try {
			self.input.parentNode.insertBefore(self.mobileInput, self.input.nextSibling);
		} catch (e) {
			//
		}

		self.mobileInput.addEventListener("change", function (e) {
			self.setDate(e.target.value, false, self.mobileFormatStr);
			triggerEvent("Change");
			triggerEvent("Close");
		});
	}

	function toggle() {
		if (self.isOpen) return self.close();
		self.open();
	}

	function triggerEvent(event, data) {
		var hooks = self.config["on" + event];

		if (hooks !== undefined && hooks.length > 0) {
			for (var i = 0; hooks[i] && i < hooks.length; i++) {
				hooks[i](self.selectedDates, self.input.value, self, data);
			}
		}

		if (event === "Change") {
			self.input.dispatchEvent(createEvent("change"));

			// many front-end frameworks bind to the input event
			self.input.dispatchEvent(createEvent("input"));
		}
	}

	/**
  * Creates an Event, normalized across browsers
  * @param {String} name the event name, e.g. "click"
  * @return {Event} the created event
  */
	function createEvent(name) {
		if (self._supportsEvents) return new Event(name, { bubbles: true });

		self._[name + "Event"] = document.createEvent("Event");
		self._[name + "Event"].initEvent(name, true, true);
		return self._[name + "Event"];
	}

	function isDateSelected(date) {
		for (var i = 0; i < self.selectedDates.length; i++) {
			if (compareDates(self.selectedDates[i], date) === 0) return "" + i;
		}

		return false;
	}

	function isDateInRange(date) {
		if (self.config.mode !== "range" || self.selectedDates.length < 2) return false;
		return compareDates(date, self.selectedDates[0]) >= 0 && compareDates(date, self.selectedDates[1]) <= 0;
	}

	function updateNavigationCurrentMonth() {
		if (self.config.noCalendar || self.isMobile || !self.monthNav) return;

		self.currentMonthElement.textContent = self.utils.monthToStr(self.currentMonth) + " ";
		self.currentYearElement.value = self.currentYear;

		self._hidePrevMonthArrow = self.config.minDate && (self.currentYear === self.config.minDate.getFullYear() ? self.currentMonth <= self.config.minDate.getMonth() : self.currentYear < self.config.minDate.getFullYear());

		self._hideNextMonthArrow = self.config.maxDate && (self.currentYear === self.config.maxDate.getFullYear() ? self.currentMonth + 1 > self.config.maxDate.getMonth() : self.currentYear > self.config.maxDate.getFullYear());
	}

	/**
  * Updates the values of inputs associated with the calendar
  * @return {void}
  */
	function updateValue(triggerChange) {
		if (!self.selectedDates.length) return self.clear(triggerChange);

		if (self.isMobile) {
			self.mobileInput.value = self.selectedDates.length ? self.formatDate(self.latestSelectedDateObj, self.mobileFormatStr) : "";
		}

		var joinChar = self.config.mode !== "range" ? "; " : self.l10n.rangeSeparator;

		self.input.value = self.selectedDates.map(function (dObj) {
			return self.formatDate(dObj, self.config.dateFormat);
		}).join(joinChar);

		if (self.config.altInput) {
			self.altInput.value = self.selectedDates.map(function (dObj) {
				return self.formatDate(dObj, self.config.altFormat);
			}).join(joinChar);
		}

		if (triggerChange !== false) triggerEvent("ValueUpdate");
	}

	function mouseDelta(e) {
		return Math.max(-1, Math.min(1, e.wheelDelta || -e.deltaY));
	}

	function onMonthNavScroll(e) {
		e.preventDefault();
		var isYear = self.currentYearElement.parentNode.contains(e.target);

		if (e.target === self.currentMonthElement || isYear) {

			var delta = mouseDelta(e);

			if (isYear) {
				changeYear(self.currentYear + delta);
				e.target.value = self.currentYear;
			} else self.changeMonth(delta, true, false);
		}
	}

	function onMonthNavClick(e) {
		var isPrevMonth = self.prevMonthNav.contains(e.target);
		var isNextMonth = self.nextMonthNav.contains(e.target);

		if (isPrevMonth || isNextMonth) changeMonth(isPrevMonth ? -1 : 1);else if (e.target === self.currentYearElement) {
			e.preventDefault();
			self.currentYearElement.select();
		} else if (e.target.className === "arrowUp") self.changeYear(self.currentYear + 1);else if (e.target.className === "arrowDown") self.changeYear(self.currentYear - 1);
	}

	/**
  * Creates an HTMLElement with given tag, class, and textual content
  * @param {String} tag the HTML tag
  * @param {String} className the new element's class name
  * @param {String} content The new element's text content
  * @return {HTMLElement} the created HTML element
  */
	function createElement(tag, className, content) {
		var e = window.document.createElement(tag);
		className = className || "";
		content = content || "";

		e.className = className;

		if (content !== undefined) e.textContent = content;

		return e;
	}

	function arrayify(obj) {
		if (obj instanceof Array) return obj;
		return [obj];
	}

	function toggleClass(elem, className, bool) {
		if (bool) return elem.classList.add(className);
		elem.classList.remove(className);
	}

	/* istanbul ignore next */
	function debounce(func, wait, immediate) {
		var timeout = void 0;
		return function () {
			var context = this,
			    args = arguments;
			clearTimeout(timeout);
			timeout = setTimeout(function () {
				timeout = null;
				if (!immediate) func.apply(context, args);
			}, wait);
			if (immediate && !timeout) func.apply(context, args);
		};
	}

	/**
  * Compute the difference in dates, measured in ms
  * @param {Date} date1
  * @param {Date} date2
  * @param {Boolean} timeless whether to reset times of both dates to 00:00
  * @return {Number} the difference in ms
  */
	function compareDates(date1, date2, timeless) {
		if (!(date1 instanceof Date) || !(date2 instanceof Date)) return false;

		if (timeless !== false) {
			return new Date(date1.getTime()).setHours(0, 0, 0, 0) - new Date(date2.getTime()).setHours(0, 0, 0, 0);
		}

		return date1.getTime() - date2.getTime();
	}

	function timeWrapper(e) {
		e.preventDefault();

		var isKeyDown = e.type === "keydown",
		    isWheel = e.type === "wheel",
		    isIncrement = e.type === "increment",
		    input = e.target;

		if (self.amPM && e.target === self.amPM) return e.target.textContent = ["AM", "PM"][e.target.textContent === "AM" | 0];

		var min = Number(input.min),
		    max = Number(input.max),
		    step = Number(input.step),
		    curValue = parseInt(input.value, 10),
		    delta = e.delta || (!isKeyDown ? Math.max(-1, Math.min(1, e.wheelDelta || -e.deltaY)) || 0 : e.which === 38 ? 1 : -1);

		var newValue = curValue + step * delta;

		if (typeof input.value !== "undefined" && input.value.length === 2) {
			var isHourElem = input === self.hourElement,
			    isMinuteElem = input === self.minuteElement;

			if (newValue < min) {
				newValue = max + newValue + !isHourElem + (isHourElem && !self.amPM);

				if (isMinuteElem) incrementNumInput(null, -1, self.hourElement);
			} else if (newValue > max) {
				newValue = input === self.hourElement ? newValue - max - !self.amPM : min;

				if (isMinuteElem) incrementNumInput(null, 1, self.hourElement);
			}

			if (self.amPM && isHourElem && (step === 1 ? newValue + curValue === 23 : Math.abs(newValue - curValue) > step)) self.amPM.textContent = self.amPM.textContent === "PM" ? "AM" : "PM";

			input.value = self.pad(newValue);
		}
	}

	init();
	return self;
}

FlatpickrInstance.prototype = {
	formats: {
		// get the date in UTC
		Z: function Z(date) {
			return date.toISOString();
		},

		// weekday name, short, e.g. Thu
		D: function D(date) {
			return this.l10n.weekdays.shorthand[this.formats.w(date)];
		},

		// full month name e.g. January
		F: function F(date) {
			return this.utils.monthToStr(this.formats.n(date) - 1, false);
		},

		// padded hour 1-12
		G: function G(date) {
			return FlatpickrInstance.prototype.pad(FlatpickrInstance.prototype.formats.h(date));
		},

		// hours with leading zero e.g. 03
		H: function H(date) {
			return FlatpickrInstance.prototype.pad(date.getHours());
		},

		// day (1-30) with ordinal suffix e.g. 1st, 2nd
		J: function J(date) {
			return date.getDate() + this.l10n.ordinal(date.getDate());
		},

		// AM/PM
		K: function K(date) {
			return date.getHours() > 11 ? "PM" : "AM";
		},

		// shorthand month e.g. Jan, Sep, Oct, etc
		M: function M(date) {
			return this.utils.monthToStr(date.getMonth(), true);
		},

		// seconds 00-59
		S: function S(date) {
			return FlatpickrInstance.prototype.pad(date.getSeconds());
		},

		// unix timestamp
		U: function U(date) {
			return date.getTime() / 1000;
		},

		W: function W(date) {
			return this.config.getWeek(date);
		},

		// full year e.g. 2016
		Y: function Y(date) {
			return date.getFullYear();
		},

		// day in month, padded (01-30)
		d: function d(date) {
			return FlatpickrInstance.prototype.pad(date.getDate());
		},

		// hour from 1-12 (am/pm)
		h: function h(date) {
			return date.getHours() % 12 ? date.getHours() % 12 : 12;
		},

		// minutes, padded with leading zero e.g. 09
		i: function i(date) {
			return FlatpickrInstance.prototype.pad(date.getMinutes());
		},

		// day in month (1-30)
		j: function j(date) {
			return date.getDate();
		},

		// weekday name, full, e.g. Thursday
		l: function l(date) {
			return this.l10n.weekdays.longhand[date.getDay()];
		},

		// padded month number (01-12)
		m: function m(date) {
			return FlatpickrInstance.prototype.pad(date.getMonth() + 1);
		},

		// the month number (1-12)
		n: function n(date) {
			return date.getMonth() + 1;
		},

		// seconds 0-59
		s: function s(date) {
			return date.getSeconds();
		},

		// number of the day of the week
		w: function w(date) {
			return date.getDay();
		},

		// last two digits of year e.g. 16 for 2016
		y: function y(date) {
			return String(date.getFullYear()).substring(2);
		}
	},

	/**
  * Formats a given Date object into a string based on supplied format
  * @param {Date} dateObj the date object
  * @param {String} frmt a string composed of formatting tokens e.g. "Y-m-d"
  * @return {String} The textual representation of the date e.g. 2017-02-03
  */
	formatDate: function formatDate(dateObj, frmt) {
		var _this = this;

		if (this.config !== undefined && this.config.formatDate !== undefined) return this.config.formatDate(dateObj, frmt);

		return frmt.split("").map(function (c, i, arr) {
			return _this.formats[c] && arr[i - 1] !== "\\" ? _this.formats[c](dateObj) : c !== "\\" ? c : "";
		}).join("");
	},


	revFormat: {
		D: function D() {},
		F: function F(dateObj, monthName) {
			dateObj.setMonth(this.l10n.months.longhand.indexOf(monthName));
		},
		G: function G(dateObj, hour) {
			dateObj.setHours(parseFloat(hour));
		},
		H: function H(dateObj, hour) {
			dateObj.setHours(parseFloat(hour));
		},
		J: function J(dateObj, day) {
			dateObj.setDate(parseFloat(day));
		},
		K: function K(dateObj, amPM) {
			var hours = dateObj.getHours();

			if (hours !== 12) dateObj.setHours(hours % 12 + 12 * /pm/i.test(amPM));
		},
		M: function M(dateObj, shortMonth) {
			dateObj.setMonth(this.l10n.months.shorthand.indexOf(shortMonth));
		},
		S: function S(dateObj, seconds) {
			dateObj.setSeconds(seconds);
		},
		U: function U(dateObj, unixSeconds) {
			return new Date(parseFloat(unixSeconds) * 1000);
		},

		W: function W(dateObj, weekNumber) {
			weekNumber = parseInt(weekNumber);
			return new Date(dateObj.getFullYear(), 0, 2 + (weekNumber - 1) * 7, 0, 0, 0, 0, 0);
		},
		Y: function Y(dateObj, year) {
			dateObj.setFullYear(year);
		},
		Z: function Z(dateObj, ISODate) {
			return new Date(ISODate);
		},

		d: function d(dateObj, day) {
			dateObj.setDate(parseFloat(day));
		},
		h: function h(dateObj, hour) {
			dateObj.setHours(parseFloat(hour));
		},
		i: function i(dateObj, minutes) {
			dateObj.setMinutes(parseFloat(minutes));
		},
		j: function j(dateObj, day) {
			dateObj.setDate(parseFloat(day));
		},
		l: function l() {},
		m: function m(dateObj, month) {
			dateObj.setMonth(parseFloat(month) - 1);
		},
		n: function n(dateObj, month) {
			dateObj.setMonth(parseFloat(month) - 1);
		},
		s: function s(dateObj, seconds) {
			dateObj.setSeconds(parseFloat(seconds));
		},
		w: function w() {},
		y: function y(dateObj, year) {
			dateObj.setFullYear(2000 + parseFloat(year));
		}
	},

	tokenRegex: {
		D: "(\\w+)",
		F: "(\\w+)",
		G: "(\\d\\d|\\d)",
		H: "(\\d\\d|\\d)",
		J: "(\\d\\d|\\d)\\w+",
		K: "(am|AM|Am|aM|pm|PM|Pm|pM)",
		M: "(\\w+)",
		S: "(\\d\\d|\\d)",
		U: "(.+)",
		W: "(\\d\\d|\\d)",
		Y: "(\\d{4})",
		Z: "(.+)",
		d: "(\\d\\d|\\d)",
		h: "(\\d\\d|\\d)",
		i: "(\\d\\d|\\d)",
		j: "(\\d\\d|\\d)",
		l: "(\\w+)",
		m: "(\\d\\d|\\d)",
		n: "(\\d\\d|\\d)",
		s: "(\\d\\d|\\d)",
		w: "(\\d\\d|\\d)",
		y: "(\\d{2})"
	},

	pad: function pad(number) {
		return ("0" + number).slice(-2);
	},

	/**
  * Parses a date(+time) string into a Date object
  * @param {String} date the date string, e.g. 2017-02-03 14:45
  * @param {String} givenFormat the date format, e.g. Y-m-d H:i
  * @param {Boolean} timeless whether to reset the time of Date object
  * @return {Date} the parsed Date object
  */
	parseDate: function parseDate(date, givenFormat, timeless) {
		var _this2 = this;

		if (date !== 0 && !date) return null;

		var date_orig = date;

		if (date instanceof Date) date = new Date(date.getTime()); // create a copy

		else if (date.toFixed !== undefined) // timestamp
				date = new Date(date);else {
				// date string
				var format = givenFormat || (this.config || flatpickr.defaultConfig).dateFormat;
				date = String(date).trim();

				if (date === "today") {
					date = new Date();
					timeless = true;
				} else if (/Z$/.test(date) || /GMT$/.test(date)) // datestrings w/ timezone
					date = new Date(date);else if (this.config && this.config.parseDate) date = this.config.parseDate(date, format);else {
					(function () {
						var parsedDate = !_this2.config || !_this2.config.noCalendar ? new Date(new Date().getFullYear(), 0, 1, 0, 0, 0, 0) : new Date(new Date().setHours(0, 0, 0, 0));

						var matched = void 0,
						    ops = [];

						for (var i = 0, matchIndex = 0, regexStr = ""; i < format.length; i++) {
							var token = format[i];
							var isBackSlash = token === "\\";
							var escaped = format[i - 1] === "\\" || isBackSlash;

							if (_this2.tokenRegex[token] && !escaped) {
								regexStr += _this2.tokenRegex[token];
								var match = new RegExp(regexStr).exec(date);
								if (match && (matched = true)) {
									ops[token !== "Y" ? "push" : "unshift"]({
										fn: _this2.revFormat[token],
										val: match[++matchIndex]
									});
								}
							} else if (!isBackSlash) regexStr += "."; // don't really care

							ops.forEach(function (_ref) {
								var fn = _ref.fn,
								    val = _ref.val;
								return parsedDate = fn(parsedDate, val) || parsedDate;
							});
						}

						date = matched ? parsedDate : null;
					})();
				}
			}

		/* istanbul ignore next */
		if (!(date instanceof Date)) {
			console.warn("flatpickr: invalid date " + date_orig);
			console.info(this.element);
			return null;
		}

		if (timeless === true) date.setHours(0, 0, 0, 0);

		return date;
	}
};

/* istanbul ignore next */
function _flatpickr(nodeList, config) {
	var nodes = Array.prototype.slice.call(nodeList); // static list
	var instances = [];
	for (var i = 0; i < nodes.length; i++) {
		try {
			if (nodes[i].getAttribute("data-fp-omit") !== null) continue;

			if (nodes[i]._flatpickr) {
				nodes[i]._flatpickr.destroy();
				nodes[i]._flatpickr = null;
			}

			nodes[i]._flatpickr = new FlatpickrInstance(nodes[i], config || {});
			instances.push(nodes[i]._flatpickr);
		} catch (e) {
			console.warn(e, e.stack);
		}
	}

	return instances.length === 1 ? instances[0] : instances;
}

/* istanbul ignore next */
if (typeof HTMLElement !== "undefined") {
	// browser env
	HTMLCollection.prototype.flatpickr = NodeList.prototype.flatpickr = function (config) {
		return _flatpickr(this, config);
	};

	HTMLElement.prototype.flatpickr = function (config) {
		return _flatpickr([this], config);
	};
}

/* istanbul ignore next */
function flatpickr(selector, config) {
	if (selector instanceof NodeList) return _flatpickr(selector, config);else if (!(selector instanceof HTMLElement)) return _flatpickr(window.document.querySelectorAll(selector), config);

	return _flatpickr([selector], config);
}

/* istanbul ignore next */
flatpickr.defaultConfig = FlatpickrInstance.defaultConfig = {
	mode: "single",

	position: "auto",

	animate: typeof window !== "undefined" && window.navigator.userAgent.indexOf("MSIE") === -1,

	// wrap: see https://chmln.github.io/flatpickr/examples/#flatpickr-external-elements
	wrap: false,

	// enables week numbers
	weekNumbers: false,

	// allow manual datetime input
	allowInput: false,

	/*
 	clicking on input opens the date(time)picker.
 	disable if you wish to open the calendar manually with .open()
 */
	clickOpens: true,

	/*
 	closes calendar after date selection,
 	unless 'mode' is 'multiple' or enableTime is true
 */
	closeOnSelect: true,

	// display time picker in 24 hour mode
	time_24hr: false,

	// enables the time picker functionality
	enableTime: false,

	// noCalendar: true will hide the calendar. use for a time picker along w/ enableTime
	noCalendar: false,

	// more date format chars at https://chmln.github.io/flatpickr/#dateformat
	dateFormat: "Y-m-d",

	// date format used in aria-label for days
	ariaDateFormat: "F j, Y",

	// altInput - see https://chmln.github.io/flatpickr/#altinput
	altInput: false,

	// the created altInput element will have this class.
	altInputClass: "form-control input",

	// same as dateFormat, but for altInput
	altFormat: "F j, Y", // defaults to e.g. June 10, 2016

	// defaultDate - either a datestring or a date object. used for datetimepicker"s initial value
	defaultDate: null,

	// the minimum date that user can pick (inclusive)
	minDate: null,

	// the maximum date that user can pick (inclusive)
	maxDate: null,

	// dateparser that transforms a given string to a date object
	parseDate: null,

	// dateformatter that transforms a given date object to a string, according to passed format
	formatDate: null,

	getWeek: function getWeek(givenDate) {
		var date = new Date(givenDate.getTime());
		var onejan = new Date(date.getFullYear(), 0, 1);
		return Math.ceil(((date - onejan) / 86400000 + onejan.getDay() + 1) / 7);
	},


	// see https://chmln.github.io/flatpickr/#disable
	enable: [],

	// see https://chmln.github.io/flatpickr/#disable
	disable: [],

	// display the short version of month names - e.g. Sep instead of September
	shorthandCurrentMonth: false,

	// displays calendar inline. see https://chmln.github.io/flatpickr/#inline-calendar
	inline: false,

	// position calendar inside wrapper and next to the input element
	// leave at false unless you know what you"re doing
	"static": false,

	// DOM node to append the calendar to in *static* mode
	appendTo: null,

	// code for previous/next icons. this is where you put your custom icon code e.g. fontawesome
	prevArrow: "<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 17 17'><g></g><path d='M5.207 8.471l7.146 7.147-0.707 0.707-7.853-7.854 7.854-7.853 0.707 0.707-7.147 7.146z' /></svg>",
	nextArrow: "<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 17 17'><g></g><path d='M13.207 8.472l-7.854 7.854-0.707-0.707 7.146-7.146-7.146-7.148 0.707-0.707 7.854 7.854z' /></svg>",

	// enables seconds in the time picker
	enableSeconds: false,

	// step size used when scrolling/incrementing the hour element
	hourIncrement: 1,

	// step size used when scrolling/incrementing the minute element
	minuteIncrement: 5,

	// initial value in the hour element
	defaultHour: 12,

	// initial value in the minute element
	defaultMinute: 0,

	// initial value in the seconds element
	defaultSeconds: 0,

	// disable native mobile datetime input support
	disableMobile: false,

	// default locale
	locale: "default",

	plugins: [],

	ignoredFocusElements: [],

	// called every time calendar is closed
	onClose: undefined, // function (dateObj, dateStr) {}

	// onChange callback when user selects a date or time
	onChange: undefined, // function (dateObj, dateStr) {}

	// called for every day element
	onDayCreate: undefined,

	// called every time the month is changed
	onMonthChange: undefined,

	// called every time calendar is opened
	onOpen: undefined, // function (dateObj, dateStr) {}

	// called after the configuration has been parsed
	onParseConfig: undefined,

	// called after calendar is ready
	onReady: undefined, // function (dateObj, dateStr) {}

	// called after input value updated
	onValueUpdate: undefined,

	// called every time the year is changed
	onYearChange: undefined,

	onKeyDown: undefined,

	onDestroy: undefined
};

/* istanbul ignore next */
flatpickr.l10ns = {
	en: {
		weekdays: {
			shorthand: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
			longhand: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
		},
		months: {
			shorthand: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
			longhand: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
		},
		daysInMonth: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
		firstDayOfWeek: 0,
		ordinal: function ordinal(nth) {
			var s = nth % 100;
			if (s > 3 && s < 21) return "th";
			switch (s % 10) {
				case 1:
					return "st";
				case 2:
					return "nd";
				case 3:
					return "rd";
				default:
					return "th";
			}
		},
		rangeSeparator: " to ",
		weekAbbreviation: "Wk",
		scrollTitle: "Scroll to increment",
		toggleTitle: "Click to toggle"
	}
};

flatpickr.l10ns.default = Object.create(flatpickr.l10ns.en);
flatpickr.localize = function (l10n) {
	return _extends(flatpickr.l10ns.default, l10n || {});
};
flatpickr.setDefaults = function (config) {
	return _extends(flatpickr.defaultConfig, config || {});
};

/* istanbul ignore next */
if (typeof jQuery !== "undefined") {
	jQuery.fn.flatpickr = function (config) {
		return _flatpickr(this, config);
	};
}

Date.prototype.fp_incr = function (days) {
	return new Date(this.getFullYear(), this.getMonth(), this.getDate() + parseInt(days, 10));
};

if (true) module.exports = flatpickr;

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMGIyZjllNzY3M2ExYjVlZmIyNWIiLCJ3ZWJwYWNrOi8vLy4vcmVzb3VyY2VzL2Fzc2V0cy9qcy9mbGF0cGlja3IuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2ZsYXRwaWNrci9kaXN0L2ZsYXRwaWNrci5qcyJdLCJuYW1lcyI6WyJ3aW5kb3ciLCJmbGF0cGlja3IiLCJyZXF1aXJlIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUM3REE7QUFDQUEsT0FBT0MsU0FBUCxHQUFtQixtQkFBQUMsQ0FBUSxFQUFSLENBQW5CLEM7Ozs7Ozs7QUNEQSxtREFBbUQsZ0JBQWdCLHNCQUFzQixPQUFPLDJCQUEyQiwwQkFBMEIseURBQXlELDJCQUEyQixFQUFFLEVBQUUsRUFBRSxlQUFlOztBQUU5UCxvR0FBb0csbUJBQW1CLEVBQUUsbUJBQW1CLDhIQUE4SDs7QUFFMVE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFlBQVksU0FBUztBQUNyQixhQUFhLFNBQVM7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFlBQVksTUFBTTtBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsWUFBWSxLQUFLO0FBQ2pCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxPQUFPO0FBQ25CO0FBQ0EsWUFBWSxPQUFPO0FBQ25CLFlBQVksT0FBTztBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFlBQVksTUFBTTtBQUNsQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxZQUFZLFFBQVE7QUFDcEIsWUFBWSxPQUFPO0FBQ25CLFlBQVksU0FBUztBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQSx1QkFBdUIsbURBQW1EO0FBQzFFOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLFNBQVM7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLElBQUk7QUFDSjs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHOztBQUVIOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxJQUFJOztBQUVKO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDBDQUEwQyxLQUFLO0FBQy9DO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxZQUFZLE1BQU07QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsWUFBWSxNQUFNO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFlBQVksS0FBSztBQUNqQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsWUFBWSxNQUFNO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLE1BQU07QUFDbEIsWUFBWSxPQUFPO0FBQ25CLFlBQVksUUFBUTtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0EsbUhBQW1IO0FBQ25IOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxRQUFRLGlDQUFpQztBQUN6QztBQUNBOztBQUVBO0FBQ0EscUJBQXFCLDBCQUEwQjtBQUMvQztBQUNBOztBQUVBO0FBQ0Esb0NBQW9DLDZCQUE2QjtBQUNqRTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHOztBQUVIO0FBQ0E7O0FBRUEsaUZBQWlGO0FBQ2pGO0FBQ0E7QUFDQTtBQUNBOztBQUVBLCtEQUErRDs7QUFFL0Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBLHFDQUFxQyxLQUFLO0FBQzFDO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSixHQUFHO0FBQ0g7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBLHFEQUFxRDs7QUFFckQ7QUFDQTs7QUFFQSxvQkFBb0Isa0JBQWtCO0FBQ3RDOztBQUVBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQzs7QUFFbEM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLHVEQUF1RDtBQUN2RCxPQUFPO0FBQ1A7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSw4QkFBOEIsa0JBQWtCO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsSUFBSTs7QUFFSjtBQUNBO0FBQ0EsSUFBSTs7QUFFSjtBQUNBOztBQUVBOztBQUVBLDJHQUEyRzs7QUFFM0c7QUFDQTs7QUFFQSx3RUFBd0UsUUFBUTtBQUNoRjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsSUFBSTs7QUFFSjtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLDJFQUEyRTs7QUFFM0U7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQSw4QkFBOEIsMkVBQTJFOztBQUV6RztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQSxHQUFHOztBQUVIO0FBQ0E7O0FBRUEsaUJBQWlCLHFCQUFxQjtBQUN0QztBQUNBLEdBQUcsMkJBQTJCLE1BQU07QUFDcEM7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsbUJBQW1CLGtDQUFrQztBQUNyRDtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsMk1BQTJNLEtBQUs7QUFDaE47O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBLHlFQUF5RTtBQUN6RTtBQUNBLGtFQUFrRTtBQUNsRSxHQUFHO0FBQ0g7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0EsSUFBSTtBQUNKOztBQUVBOztBQUVBO0FBQ0EscURBQXFEO0FBQ3JEO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EscUlBQXFJOztBQUVySTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRyxFQUFFLGtIQUFrSDtBQUN2SDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDRDQUE0QztBQUM1QztBQUNBLE1BQU07QUFDTjs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFNOztBQUVOOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsMEJBQTBCLEtBQUs7QUFDL0IsMEZBQTBGO0FBQzFGO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHLEVBQUU7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLGtCQUFrQiw4QkFBOEI7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFlBQVksT0FBTztBQUNuQixhQUFhLE1BQU07QUFDbkI7QUFDQTtBQUNBLG9EQUFvRCxnQkFBZ0I7O0FBRXBFO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsaUJBQWlCLCtCQUErQjtBQUNoRDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLGtEQUFrRDs7QUFFbEQ7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsb0VBQW9FO0FBQ3BFO0FBQ0E7QUFDQSxHQUFHLGtGQUFrRjtBQUNyRjs7QUFFQTtBQUNBO0FBQ0EsWUFBWSxPQUFPO0FBQ25CLFlBQVksT0FBTztBQUNuQixZQUFZLE9BQU87QUFDbkIsYUFBYSxZQUFZO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFlBQVksS0FBSztBQUNqQixZQUFZLEtBQUs7QUFDakIsWUFBWSxRQUFRO0FBQ3BCLGFBQWEsT0FBTztBQUNwQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsSUFBSTtBQUNKOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTs7QUFFRjtBQUNBO0FBQ0EsWUFBWSxLQUFLO0FBQ2pCLFlBQVksT0FBTztBQUNuQixhQUFhLE9BQU87QUFDcEI7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsRUFBRTs7O0FBR0Y7QUFDQSxvQkFBb0I7QUFDcEI7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNILG9CQUFvQjtBQUNwQjtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSCxvQkFBb0I7QUFDcEI7QUFDQTtBQUNBO0FBQ0EsRUFBRTs7QUFFRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxFQUFFO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLEVBQUU7QUFDYixFQUFFOztBQUVGO0FBQ0E7QUFDQSxFQUFFOztBQUVGO0FBQ0E7QUFDQSxZQUFZLE9BQU87QUFDbkIsWUFBWSxPQUFPO0FBQ25CLFlBQVksUUFBUTtBQUNwQixhQUFhLEtBQUs7QUFDbEI7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBLDREQUE0RDs7QUFFNUQ7QUFDQSwwQkFBMEI7QUFDMUI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCwyQkFBMkIsMEZBQTBGO0FBQ3JIO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxvREFBb0QsbUJBQW1CO0FBQ3ZFO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBLFFBQVEsd0NBQXdDOztBQUVoRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjs7QUFFQTtBQUNBLE1BQU07QUFDTjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGtEQUFrRDtBQUNsRDtBQUNBLGdCQUFnQixrQkFBa0I7QUFDbEM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxxRUFBcUU7QUFDckU7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1RUFBdUU7O0FBRXZFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTs7O0FBR0Y7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxvREFBb0Q7QUFDcEQ7QUFDQTtBQUNBLHNEQUFzRDtBQUN0RDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLHFDIiwiZmlsZSI6Ii9qcy9mbGF0cGlja3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAxMjApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDBiMmY5ZTc2NzNhMWI1ZWZiMjViIiwiLy8gU2V0dGluZ3MgZm9yIGRhdGV0aW1lcGlja2VyXG53aW5kb3cuZmxhdHBpY2tyID0gcmVxdWlyZShcImZsYXRwaWNrclwiKVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3Jlc291cmNlcy9hc3NldHMvanMvZmxhdHBpY2tyLmpzIiwidmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTtcblxudmFyIF90eXBlb2YgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIiA/IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIHR5cGVvZiBvYmo7IH0gOiBmdW5jdGlvbiAob2JqKSB7IHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sICYmIG9iaiAhPT0gU3ltYm9sLnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9O1xuXG4vKiEgZmxhdHBpY2tyIHYzLjAuNiwgQGxpY2Vuc2UgTUlUICovXG5mdW5jdGlvbiBGbGF0cGlja3JJbnN0YW5jZShlbGVtZW50LCBjb25maWcpIHtcblx0dmFyIHNlbGYgPSB0aGlzO1xuXG5cdHNlbGYuXyA9IHt9O1xuXHRzZWxmLl8uYWZ0ZXJEYXlBbmltID0gYWZ0ZXJEYXlBbmltO1xuXHRzZWxmLl9iaW5kID0gYmluZDtcblx0c2VsZi5fY29tcGFyZURhdGVzID0gY29tcGFyZURhdGVzO1xuXHRzZWxmLl9zZXRIb3Vyc0Zyb21EYXRlID0gc2V0SG91cnNGcm9tRGF0ZTtcblx0c2VsZi5jaGFuZ2VNb250aCA9IGNoYW5nZU1vbnRoO1xuXHRzZWxmLmNoYW5nZVllYXIgPSBjaGFuZ2VZZWFyO1xuXHRzZWxmLmNsZWFyID0gY2xlYXI7XG5cdHNlbGYuY2xvc2UgPSBjbG9zZTtcblx0c2VsZi5fY3JlYXRlRWxlbWVudCA9IGNyZWF0ZUVsZW1lbnQ7XG5cdHNlbGYuZGVzdHJveSA9IGRlc3Ryb3k7XG5cdHNlbGYuaXNFbmFibGVkID0gaXNFbmFibGVkO1xuXHRzZWxmLmp1bXBUb0RhdGUgPSBqdW1wVG9EYXRlO1xuXHRzZWxmLm9wZW4gPSBvcGVuO1xuXHRzZWxmLnJlZHJhdyA9IHJlZHJhdztcblx0c2VsZi5zZXQgPSBzZXQ7XG5cdHNlbGYuc2V0RGF0ZSA9IHNldERhdGU7XG5cdHNlbGYudG9nZ2xlID0gdG9nZ2xlO1xuXG5cdGZ1bmN0aW9uIGluaXQoKSB7XG5cdFx0c2VsZi5lbGVtZW50ID0gc2VsZi5pbnB1dCA9IGVsZW1lbnQ7XG5cdFx0c2VsZi5pbnN0YW5jZUNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcblx0XHRzZWxmLnBhcnNlRGF0ZSA9IEZsYXRwaWNrckluc3RhbmNlLnByb3RvdHlwZS5wYXJzZURhdGUuYmluZChzZWxmKTtcblx0XHRzZWxmLmZvcm1hdERhdGUgPSBGbGF0cGlja3JJbnN0YW5jZS5wcm90b3R5cGUuZm9ybWF0RGF0ZS5iaW5kKHNlbGYpO1xuXG5cdFx0c2V0dXBGb3JtYXRzKCk7XG5cdFx0cGFyc2VDb25maWcoKTtcblx0XHRzZXR1cExvY2FsZSgpO1xuXHRcdHNldHVwSW5wdXRzKCk7XG5cdFx0c2V0dXBEYXRlcygpO1xuXHRcdHNldHVwSGVscGVyRnVuY3Rpb25zKCk7XG5cblx0XHRzZWxmLmlzT3BlbiA9IGZhbHNlO1xuXG5cdFx0c2VsZi5pc01vYmlsZSA9ICFzZWxmLmNvbmZpZy5kaXNhYmxlTW9iaWxlICYmICFzZWxmLmNvbmZpZy5pbmxpbmUgJiYgc2VsZi5jb25maWcubW9kZSA9PT0gXCJzaW5nbGVcIiAmJiAhc2VsZi5jb25maWcuZGlzYWJsZS5sZW5ndGggJiYgIXNlbGYuY29uZmlnLmVuYWJsZS5sZW5ndGggJiYgIXNlbGYuY29uZmlnLndlZWtOdW1iZXJzICYmIC9BbmRyb2lkfHdlYk9TfGlQaG9uZXxpUGFkfGlQb2R8QmxhY2tCZXJyeXxJRU1vYmlsZXxPcGVyYSBNaW5pL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtcblxuXHRcdGlmICghc2VsZi5pc01vYmlsZSkgYnVpbGQoKTtcblxuXHRcdGJpbmRFdmVudHMoKTtcblxuXHRcdGlmIChzZWxmLnNlbGVjdGVkRGF0ZXMubGVuZ3RoIHx8IHNlbGYuY29uZmlnLm5vQ2FsZW5kYXIpIHtcblx0XHRcdGlmIChzZWxmLmNvbmZpZy5lbmFibGVUaW1lKSB7XG5cdFx0XHRcdHNldEhvdXJzRnJvbURhdGUoc2VsZi5jb25maWcubm9DYWxlbmRhciA/IHNlbGYubGF0ZXN0U2VsZWN0ZWREYXRlT2JqIHx8IHNlbGYuY29uZmlnLm1pbkRhdGUgOiBudWxsKTtcblx0XHRcdH1cblx0XHRcdHVwZGF0ZVZhbHVlKGZhbHNlKTtcblx0XHR9XG5cblx0XHRzZWxmLnNob3dUaW1lSW5wdXQgPSBzZWxmLnNlbGVjdGVkRGF0ZXMubGVuZ3RoID4gMCB8fCBzZWxmLmNvbmZpZy5ub0NhbGVuZGFyO1xuXG5cdFx0aWYgKHNlbGYuY29uZmlnLndlZWtOdW1iZXJzKSB7XG5cdFx0XHRzZWxmLmNhbGVuZGFyQ29udGFpbmVyLnN0eWxlLndpZHRoID0gc2VsZi5kYXlzQ29udGFpbmVyLm9mZnNldFdpZHRoICsgc2VsZi53ZWVrV3JhcHBlci5vZmZzZXRXaWR0aCArIFwicHhcIjtcblx0XHR9XG5cblx0XHRpZiAoIXNlbGYuaXNNb2JpbGUpIHBvc2l0aW9uQ2FsZW5kYXIoKTtcblxuXHRcdHRyaWdnZXJFdmVudChcIlJlYWR5XCIpO1xuXHR9XG5cblx0LyoqXG4gICogQmluZHMgYSBmdW5jdGlvbiB0byB0aGUgY3VycmVudCBmbGF0cGlja3IgaW5zdGFuY2VcbiAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiB0aGUgZnVuY3Rpb25cbiAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gdGhlIGZ1bmN0aW9uIGJvdW5kIHRvIHRoZSBpbnN0YW5jZVxuICAqL1xuXHRmdW5jdGlvbiBiaW5kVG9JbnN0YW5jZShmbikge1xuXHRcdHJldHVybiBmbi5iaW5kKHNlbGYpO1xuXHR9XG5cblx0LyoqXG4gICogVGhlIGhhbmRsZXIgZm9yIGFsbCBldmVudHMgdGFyZ2V0aW5nIHRoZSB0aW1lIGlucHV0c1xuICAqIEBwYXJhbSB7RXZlbnR9IGUgdGhlIGV2ZW50IC0gXCJpbnB1dFwiLCBcIndoZWVsXCIsIFwiaW5jcmVtZW50XCIsIGV0Y1xuICAqL1xuXHRmdW5jdGlvbiB1cGRhdGVUaW1lKGUpIHtcblx0XHRpZiAoc2VsZi5jb25maWcubm9DYWxlbmRhciAmJiAhc2VsZi5zZWxlY3RlZERhdGVzLmxlbmd0aClcblx0XHRcdC8vIHBpY2tpbmcgdGltZSBvbmx5XG5cdFx0XHRzZWxmLnNlbGVjdGVkRGF0ZXMgPSBbc2VsZi5ub3ddO1xuXG5cdFx0dGltZVdyYXBwZXIoZSk7XG5cblx0XHRpZiAoIXNlbGYuc2VsZWN0ZWREYXRlcy5sZW5ndGgpIHJldHVybjtcblxuXHRcdGlmICghc2VsZi5taW5EYXRlSGFzVGltZSB8fCBlLnR5cGUgIT09IFwiaW5wdXRcIiB8fCBlLnRhcmdldC52YWx1ZS5sZW5ndGggPj0gMikge1xuXHRcdFx0c2V0SG91cnNGcm9tSW5wdXRzKCk7XG5cdFx0XHR1cGRhdGVWYWx1ZSgpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0c2V0SG91cnNGcm9tSW5wdXRzKCk7XG5cdFx0XHRcdHVwZGF0ZVZhbHVlKCk7XG5cdFx0XHR9LCAxMDAwKTtcblx0XHR9XG5cdH1cblxuXHQvKipcbiAgKiBTeW5jcyB0aGUgc2VsZWN0ZWQgZGF0ZSBvYmplY3QgdGltZSB3aXRoIHVzZXIncyB0aW1lIGlucHV0XG4gICovXG5cdGZ1bmN0aW9uIHNldEhvdXJzRnJvbUlucHV0cygpIHtcblx0XHRpZiAoIXNlbGYuY29uZmlnLmVuYWJsZVRpbWUpIHJldHVybjtcblxuXHRcdHZhciBob3VycyA9IChwYXJzZUludChzZWxmLmhvdXJFbGVtZW50LnZhbHVlLCAxMCkgfHwgMCkgJSAoc2VsZi5hbVBNID8gMTIgOiAyNCksXG5cdFx0ICAgIG1pbnV0ZXMgPSAocGFyc2VJbnQoc2VsZi5taW51dGVFbGVtZW50LnZhbHVlLCAxMCkgfHwgMCkgJSA2MCxcblx0XHQgICAgc2Vjb25kcyA9IHNlbGYuY29uZmlnLmVuYWJsZVNlY29uZHMgPyAocGFyc2VJbnQoc2VsZi5zZWNvbmRFbGVtZW50LnZhbHVlLCAxMCkgfHwgMCkgJSA2MCA6IDA7XG5cblx0XHRpZiAoc2VsZi5hbVBNICE9PSB1bmRlZmluZWQpIGhvdXJzID0gaG91cnMgJSAxMiArIDEyICogKHNlbGYuYW1QTS50ZXh0Q29udGVudCA9PT0gXCJQTVwiKTtcblxuXHRcdGlmIChzZWxmLm1pbkRhdGVIYXNUaW1lICYmIGNvbXBhcmVEYXRlcyhzZWxmLmxhdGVzdFNlbGVjdGVkRGF0ZU9iaiwgc2VsZi5jb25maWcubWluRGF0ZSkgPT09IDApIHtcblxuXHRcdFx0aG91cnMgPSBNYXRoLm1heChob3Vycywgc2VsZi5jb25maWcubWluRGF0ZS5nZXRIb3VycygpKTtcblx0XHRcdGlmIChob3VycyA9PT0gc2VsZi5jb25maWcubWluRGF0ZS5nZXRIb3VycygpKSBtaW51dGVzID0gTWF0aC5tYXgobWludXRlcywgc2VsZi5jb25maWcubWluRGF0ZS5nZXRNaW51dGVzKCkpO1xuXHRcdH1cblxuXHRcdGlmIChzZWxmLm1heERhdGVIYXNUaW1lICYmIGNvbXBhcmVEYXRlcyhzZWxmLmxhdGVzdFNlbGVjdGVkRGF0ZU9iaiwgc2VsZi5jb25maWcubWF4RGF0ZSkgPT09IDApIHtcblx0XHRcdGhvdXJzID0gTWF0aC5taW4oaG91cnMsIHNlbGYuY29uZmlnLm1heERhdGUuZ2V0SG91cnMoKSk7XG5cdFx0XHRpZiAoaG91cnMgPT09IHNlbGYuY29uZmlnLm1heERhdGUuZ2V0SG91cnMoKSkgbWludXRlcyA9IE1hdGgubWluKG1pbnV0ZXMsIHNlbGYuY29uZmlnLm1heERhdGUuZ2V0TWludXRlcygpKTtcblx0XHR9XG5cblx0XHRzZXRIb3Vycyhob3VycywgbWludXRlcywgc2Vjb25kcyk7XG5cdH1cblxuXHQvKipcbiAgKiBTeW5jcyB0aW1lIGlucHV0IHZhbHVlcyB3aXRoIGEgZGF0ZVxuICAqIEBwYXJhbSB7RGF0ZX0gZGF0ZU9iaiB0aGUgZGF0ZSB0byBzeW5jIHdpdGhcbiAgKi9cblx0ZnVuY3Rpb24gc2V0SG91cnNGcm9tRGF0ZShkYXRlT2JqKSB7XG5cdFx0dmFyIGRhdGUgPSBkYXRlT2JqIHx8IHNlbGYubGF0ZXN0U2VsZWN0ZWREYXRlT2JqO1xuXG5cdFx0aWYgKGRhdGUpIHNldEhvdXJzKGRhdGUuZ2V0SG91cnMoKSwgZGF0ZS5nZXRNaW51dGVzKCksIGRhdGUuZ2V0U2Vjb25kcygpKTtcblx0fVxuXG5cdC8qKlxuICAqIFNldHMgdGhlIGhvdXJzLCBtaW51dGVzLCBhbmQgb3B0aW9uYWxseSBzZWNvbmRzXG4gICogb2YgdGhlIGxhdGVzdCBzZWxlY3RlZCBkYXRlIG9iamVjdCBhbmQgdGhlXG4gICogY29ycmVzcG9uZGluZyB0aW1lIGlucHV0c1xuICAqIEBwYXJhbSB7TnVtYmVyfSBob3VycyB0aGUgaG91ci4gd2hldGhlciBpdHMgbWlsaXRhcnlcbiAgKiAgICAgICAgICAgICAgICAgb3IgYW0tcG0gZ2V0cyBpbmZlcnJlZCBmcm9tIGNvbmZpZ1xuICAqIEBwYXJhbSB7TnVtYmVyfSBtaW51dGVzIHRoZSBtaW51dGVzXG4gICogQHBhcmFtIHtOdW1iZXJ9IHNlY29uZHMgdGhlIHNlY29uZHMgKG9wdGlvbmFsKVxuICAqL1xuXHRmdW5jdGlvbiBzZXRIb3Vycyhob3VycywgbWludXRlcywgc2Vjb25kcykge1xuXHRcdGlmIChzZWxmLnNlbGVjdGVkRGF0ZXMubGVuZ3RoKSB7XG5cdFx0XHRzZWxmLmxhdGVzdFNlbGVjdGVkRGF0ZU9iai5zZXRIb3Vycyhob3VycyAlIDI0LCBtaW51dGVzLCBzZWNvbmRzIHx8IDAsIDApO1xuXHRcdH1cblxuXHRcdGlmICghc2VsZi5jb25maWcuZW5hYmxlVGltZSB8fCBzZWxmLmlzTW9iaWxlKSByZXR1cm47XG5cblx0XHRzZWxmLmhvdXJFbGVtZW50LnZhbHVlID0gc2VsZi5wYWQoIXNlbGYuY29uZmlnLnRpbWVfMjRociA/ICgxMiArIGhvdXJzKSAlIDEyICsgMTIgKiAoaG91cnMgJSAxMiA9PT0gMCkgOiBob3Vycyk7XG5cblx0XHRzZWxmLm1pbnV0ZUVsZW1lbnQudmFsdWUgPSBzZWxmLnBhZChtaW51dGVzKTtcblxuXHRcdGlmICghc2VsZi5jb25maWcudGltZV8yNGhyKSBzZWxmLmFtUE0udGV4dENvbnRlbnQgPSBob3VycyA+PSAxMiA/IFwiUE1cIiA6IFwiQU1cIjtcblxuXHRcdGlmIChzZWxmLmNvbmZpZy5lbmFibGVTZWNvbmRzID09PSB0cnVlKSBzZWxmLnNlY29uZEVsZW1lbnQudmFsdWUgPSBzZWxmLnBhZChzZWNvbmRzKTtcblx0fVxuXG5cdC8qKlxuICAqIEhhbmRsZXMgdGhlIHllYXIgaW5wdXQgYW5kIGluY3JlbWVudGluZyBldmVudHNcbiAgKiBAcGFyYW0ge0V2ZW50fSBldmVudCB0aGUga2V5dXAgb3IgaW5jcmVtZW50IGV2ZW50XG4gICovXG5cdGZ1bmN0aW9uIG9uWWVhcklucHV0KGV2ZW50KSB7XG5cdFx0dmFyIHllYXIgPSBldmVudC50YXJnZXQudmFsdWU7XG5cdFx0aWYgKGV2ZW50LmRlbHRhKSB5ZWFyID0gKHBhcnNlSW50KHllYXIpICsgZXZlbnQuZGVsdGEpLnRvU3RyaW5nKCk7XG5cblx0XHRpZiAoeWVhci5sZW5ndGggPT09IDQgfHwgZXZlbnQua2V5ID09PSBcIkVudGVyXCIpIHtcblx0XHRcdHNlbGYuY3VycmVudFllYXJFbGVtZW50LmJsdXIoKTtcblx0XHRcdGlmICghL1teXFxkXS8udGVzdCh5ZWFyKSkgY2hhbmdlWWVhcih5ZWFyKTtcblx0XHR9XG5cdH1cblxuXHQvKipcbiAgKiBFc3NlbnRpYWxseSBhZGRFdmVudExpc3RlbmVyICsgdHJhY2tpbmdcbiAgKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnQgdGhlIGVsZW1lbnQgdG8gYWRkRXZlbnRMaXN0ZW5lciB0b1xuICAqIEBwYXJhbSB7U3RyaW5nfSBldmVudCB0aGUgZXZlbnQgbmFtZVxuICAqIEBwYXJhbSB7RnVuY3Rpb259IGhhbmRsZXIgdGhlIGV2ZW50IGhhbmRsZXJcbiAgKi9cblx0ZnVuY3Rpb24gYmluZChlbGVtZW50LCBldmVudCwgaGFuZGxlcikge1xuXHRcdGlmIChldmVudCBpbnN0YW5jZW9mIEFycmF5KSByZXR1cm4gZXZlbnQuZm9yRWFjaChmdW5jdGlvbiAoZXYpIHtcblx0XHRcdHJldHVybiBiaW5kKGVsZW1lbnQsIGV2LCBoYW5kbGVyKTtcblx0XHR9KTtcblxuXHRcdGlmIChlbGVtZW50IGluc3RhbmNlb2YgQXJyYXkpIHJldHVybiBlbGVtZW50LmZvckVhY2goZnVuY3Rpb24gKGVsKSB7XG5cdFx0XHRyZXR1cm4gYmluZChlbCwgZXZlbnQsIGhhbmRsZXIpO1xuXHRcdH0pO1xuXG5cdFx0ZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBoYW5kbGVyKTtcblx0XHRzZWxmLl9oYW5kbGVycy5wdXNoKHsgZWxlbWVudDogZWxlbWVudCwgZXZlbnQ6IGV2ZW50LCBoYW5kbGVyOiBoYW5kbGVyIH0pO1xuXHR9XG5cblx0LyoqXG4gICogQSBtb3VzZWRvd24gaGFuZGxlciB3aGljaCBtaW1pY3MgY2xpY2suXG4gICogTWluaW1pemVzIGxhdGVuY3ksIHNpbmNlIHdlIGRvbid0IG5lZWQgdG8gd2FpdCBmb3IgbW91c2V1cCBpbiBtb3N0IGNhc2VzLlxuICAqIEFsc28sIGF2b2lkcyBoYW5kbGluZyByaWdodCBjbGlja3MuXG4gICpcbiAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBoYW5kbGVyIHRoZSBldmVudCBoYW5kbGVyXG4gICovXG5cdGZ1bmN0aW9uIG9uQ2xpY2soaGFuZGxlcikge1xuXHRcdHJldHVybiBmdW5jdGlvbiAoZXZ0KSB7XG5cdFx0XHRyZXR1cm4gZXZ0LndoaWNoID09PSAxICYmIGhhbmRsZXIoZXZ0KTtcblx0XHR9O1xuXHR9XG5cblx0LyoqXG4gICogQWRkcyBhbGwgdGhlIG5lY2Vzc2FyeSBldmVudCBsaXN0ZW5lcnNcbiAgKi9cblx0ZnVuY3Rpb24gYmluZEV2ZW50cygpIHtcblx0XHRzZWxmLl9oYW5kbGVycyA9IFtdO1xuXHRcdHNlbGYuX2FuaW1hdGlvbkxvb3AgPSBbXTtcblx0XHRpZiAoc2VsZi5jb25maWcud3JhcCkge1xuXHRcdFx0W1wib3BlblwiLCBcImNsb3NlXCIsIFwidG9nZ2xlXCIsIFwiY2xlYXJcIl0uZm9yRWFjaChmdW5jdGlvbiAoZXZ0KSB7XG5cdFx0XHRcdEFycmF5LnByb3RvdHlwZS5mb3JFYWNoLmNhbGwoc2VsZi5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJbZGF0YS1cIiArIGV2dCArIFwiXVwiKSwgZnVuY3Rpb24gKGVsKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGJpbmQoZWwsIFwibW91c2Vkb3duXCIsIG9uQ2xpY2soc2VsZltldnRdKSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0aWYgKHNlbGYuaXNNb2JpbGUpIHJldHVybiBzZXR1cE1vYmlsZSgpO1xuXG5cdFx0c2VsZi5kZWJvdW5jZWRSZXNpemUgPSBkZWJvdW5jZShvblJlc2l6ZSwgNTApO1xuXHRcdHNlbGYudHJpZ2dlckNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHRyaWdnZXJFdmVudChcIkNoYW5nZVwiKTtcblx0XHR9O1xuXHRcdHNlbGYuZGVib3VuY2VkQ2hhbmdlID0gZGVib3VuY2Uoc2VsZi50cmlnZ2VyQ2hhbmdlLCAzMDApO1xuXG5cdFx0aWYgKHNlbGYuY29uZmlnLm1vZGUgPT09IFwicmFuZ2VcIiAmJiBzZWxmLmRheXNDb250YWluZXIpIGJpbmQoc2VsZi5kYXlzQ29udGFpbmVyLCBcIm1vdXNlb3ZlclwiLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0cmV0dXJuIG9uTW91c2VPdmVyKGUudGFyZ2V0KTtcblx0XHR9KTtcblxuXHRcdGJpbmQod2luZG93LmRvY3VtZW50LmJvZHksIFwia2V5ZG93blwiLCBvbktleURvd24pO1xuXG5cdFx0aWYgKCFzZWxmLmNvbmZpZy5zdGF0aWMpIGJpbmQoc2VsZi5faW5wdXQsIFwia2V5ZG93blwiLCBvbktleURvd24pO1xuXG5cdFx0aWYgKCFzZWxmLmNvbmZpZy5pbmxpbmUgJiYgIXNlbGYuY29uZmlnLnN0YXRpYykgYmluZCh3aW5kb3csIFwicmVzaXplXCIsIHNlbGYuZGVib3VuY2VkUmVzaXplKTtcblxuXHRcdGlmICh3aW5kb3cub250b3VjaHN0YXJ0ICE9PSB1bmRlZmluZWQpIGJpbmQod2luZG93LmRvY3VtZW50LCBcInRvdWNoc3RhcnRcIiwgZG9jdW1lbnRDbGljayk7XG5cblx0XHRiaW5kKHdpbmRvdy5kb2N1bWVudCwgXCJtb3VzZWRvd25cIiwgb25DbGljayhkb2N1bWVudENsaWNrKSk7XG5cdFx0YmluZChzZWxmLl9pbnB1dCwgXCJibHVyXCIsIGRvY3VtZW50Q2xpY2spO1xuXG5cdFx0aWYgKHNlbGYuY29uZmlnLmNsaWNrT3BlbnMgPT09IHRydWUpIHtcblx0XHRcdGJpbmQoc2VsZi5faW5wdXQsIFwiZm9jdXNcIiwgc2VsZi5vcGVuKTtcblx0XHRcdGJpbmQoc2VsZi5faW5wdXQsIFwibW91c2Vkb3duXCIsIG9uQ2xpY2soc2VsZi5vcGVuKSk7XG5cdFx0fVxuXG5cdFx0aWYgKCFzZWxmLmNvbmZpZy5ub0NhbGVuZGFyKSB7XG5cdFx0XHRzZWxmLm1vbnRoTmF2LmFkZEV2ZW50TGlzdGVuZXIoXCJ3aGVlbFwiLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRyZXR1cm4gZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0fSk7XG5cdFx0XHRiaW5kKHNlbGYubW9udGhOYXYsIFwid2hlZWxcIiwgZGVib3VuY2Uob25Nb250aE5hdlNjcm9sbCwgMTApKTtcblx0XHRcdGJpbmQoc2VsZi5tb250aE5hdiwgXCJtb3VzZWRvd25cIiwgb25DbGljayhvbk1vbnRoTmF2Q2xpY2spKTtcblxuXHRcdFx0YmluZChzZWxmLm1vbnRoTmF2LCBbXCJrZXl1cFwiLCBcImluY3JlbWVudFwiXSwgb25ZZWFySW5wdXQpO1xuXHRcdFx0YmluZChzZWxmLmRheXNDb250YWluZXIsIFwibW91c2Vkb3duXCIsIG9uQ2xpY2soc2VsZWN0RGF0ZSkpO1xuXG5cdFx0XHRpZiAoc2VsZi5jb25maWcuYW5pbWF0ZSkge1xuXHRcdFx0XHRiaW5kKHNlbGYuZGF5c0NvbnRhaW5lciwgW1wid2Via2l0QW5pbWF0aW9uRW5kXCIsIFwiYW5pbWF0aW9uZW5kXCJdLCBhbmltYXRlRGF5cyk7XG5cdFx0XHRcdGJpbmQoc2VsZi5tb250aE5hdiwgW1wid2Via2l0QW5pbWF0aW9uRW5kXCIsIFwiYW5pbWF0aW9uZW5kXCJdLCBhbmltYXRlTW9udGhzKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoc2VsZi5jb25maWcuZW5hYmxlVGltZSkge1xuXHRcdFx0dmFyIHNlbFRleHQgPSBmdW5jdGlvbiBzZWxUZXh0KGUpIHtcblx0XHRcdFx0cmV0dXJuIGUudGFyZ2V0LnNlbGVjdCgpO1xuXHRcdFx0fTtcblx0XHRcdGJpbmQoc2VsZi50aW1lQ29udGFpbmVyLCBbXCJ3aGVlbFwiLCBcImlucHV0XCIsIFwiaW5jcmVtZW50XCJdLCB1cGRhdGVUaW1lKTtcblx0XHRcdGJpbmQoc2VsZi50aW1lQ29udGFpbmVyLCBcIm1vdXNlZG93blwiLCBvbkNsaWNrKHRpbWVJbmNyZW1lbnQpKTtcblxuXHRcdFx0YmluZChzZWxmLnRpbWVDb250YWluZXIsIFtcIndoZWVsXCIsIFwiaW5jcmVtZW50XCJdLCBzZWxmLmRlYm91bmNlZENoYW5nZSk7XG5cdFx0XHRiaW5kKHNlbGYudGltZUNvbnRhaW5lciwgXCJpbnB1dFwiLCBzZWxmLnRyaWdnZXJDaGFuZ2UpO1xuXG5cdFx0XHRiaW5kKFtzZWxmLmhvdXJFbGVtZW50LCBzZWxmLm1pbnV0ZUVsZW1lbnRdLCBcImZvY3VzXCIsIHNlbFRleHQpO1xuXG5cdFx0XHRpZiAoc2VsZi5zZWNvbmRFbGVtZW50ICE9PSB1bmRlZmluZWQpIGJpbmQoc2VsZi5zZWNvbmRFbGVtZW50LCBcImZvY3VzXCIsIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0cmV0dXJuIHNlbGYuc2Vjb25kRWxlbWVudC5zZWxlY3QoKTtcblx0XHRcdH0pO1xuXG5cdFx0XHRpZiAoc2VsZi5hbVBNICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0YmluZChzZWxmLmFtUE0sIFwibW91c2Vkb3duXCIsIG9uQ2xpY2soZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHR1cGRhdGVUaW1lKGUpO1xuXHRcdFx0XHRcdHNlbGYudHJpZ2dlckNoYW5nZShlKTtcblx0XHRcdFx0fSkpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIHByb2Nlc3NQb3N0RGF5QW5pbWF0aW9uKCkge1xuXHRcdGZvciAodmFyIGkgPSBzZWxmLl9hbmltYXRpb25Mb29wLmxlbmd0aDsgaS0tOykge1xuXHRcdFx0c2VsZi5fYW5pbWF0aW9uTG9vcFtpXSgpO1xuXHRcdFx0c2VsZi5fYW5pbWF0aW9uTG9vcC5zcGxpY2UoaSwgMSk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG4gICogUmVtb3ZlcyB0aGUgZGF5IGNvbnRhaW5lciB0aGF0IHNsaWRlZCBvdXQgb2Ygdmlld1xuICAqIEBwYXJhbSB7RXZlbnR9IGUgdGhlIGFuaW1hdGlvbiBldmVudFxuICAqL1xuXHRmdW5jdGlvbiBhbmltYXRlRGF5cyhlKSB7XG5cdFx0aWYgKHNlbGYuZGF5c0NvbnRhaW5lci5jaGlsZE5vZGVzLmxlbmd0aCA+IDEpIHtcblx0XHRcdHN3aXRjaCAoZS5hbmltYXRpb25OYW1lKSB7XG5cdFx0XHRcdGNhc2UgXCJmcFNsaWRlTGVmdFwiOlxuXHRcdFx0XHRcdHNlbGYuZGF5c0NvbnRhaW5lci5sYXN0Q2hpbGQuY2xhc3NMaXN0LnJlbW92ZShcInNsaWRlTGVmdE5ld1wiKTtcblx0XHRcdFx0XHRzZWxmLmRheXNDb250YWluZXIucmVtb3ZlQ2hpbGQoc2VsZi5kYXlzQ29udGFpbmVyLmZpcnN0Q2hpbGQpO1xuXHRcdFx0XHRcdHNlbGYuZGF5cyA9IHNlbGYuZGF5c0NvbnRhaW5lci5maXJzdENoaWxkO1xuXHRcdFx0XHRcdHByb2Nlc3NQb3N0RGF5QW5pbWF0aW9uKCk7XG5cblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRjYXNlIFwiZnBTbGlkZVJpZ2h0XCI6XG5cdFx0XHRcdFx0c2VsZi5kYXlzQ29udGFpbmVyLmZpcnN0Q2hpbGQuY2xhc3NMaXN0LnJlbW92ZShcInNsaWRlUmlnaHROZXdcIik7XG5cdFx0XHRcdFx0c2VsZi5kYXlzQ29udGFpbmVyLnJlbW92ZUNoaWxkKHNlbGYuZGF5c0NvbnRhaW5lci5sYXN0Q2hpbGQpO1xuXHRcdFx0XHRcdHNlbGYuZGF5cyA9IHNlbGYuZGF5c0NvbnRhaW5lci5maXJzdENoaWxkO1xuXHRcdFx0XHRcdHByb2Nlc3NQb3N0RGF5QW5pbWF0aW9uKCk7XG5cblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8qKlxuICAqIFJlbW92ZXMgdGhlIG1vbnRoIGVsZW1lbnQgdGhhdCBhbmltYXRlZCBvdXQgb2Ygdmlld1xuICAqIEBwYXJhbSB7RXZlbnR9IGUgdGhlIGFuaW1hdGlvbiBldmVudFxuICAqL1xuXHRmdW5jdGlvbiBhbmltYXRlTW9udGhzKGUpIHtcblx0XHRzd2l0Y2ggKGUuYW5pbWF0aW9uTmFtZSkge1xuXHRcdFx0Y2FzZSBcImZwU2xpZGVMZWZ0TmV3XCI6XG5cdFx0XHRjYXNlIFwiZnBTbGlkZVJpZ2h0TmV3XCI6XG5cdFx0XHRcdHNlbGYubmF2aWdhdGlvbkN1cnJlbnRNb250aC5jbGFzc0xpc3QucmVtb3ZlKFwic2xpZGVMZWZ0TmV3XCIpO1xuXHRcdFx0XHRzZWxmLm5hdmlnYXRpb25DdXJyZW50TW9udGguY2xhc3NMaXN0LnJlbW92ZShcInNsaWRlUmlnaHROZXdcIik7XG5cdFx0XHRcdHZhciBuYXYgPSBzZWxmLm5hdmlnYXRpb25DdXJyZW50TW9udGg7XG5cblx0XHRcdFx0d2hpbGUgKG5hdi5uZXh0U2libGluZyAmJiAvY3Vyci8udGVzdChuYXYubmV4dFNpYmxpbmcuY2xhc3NOYW1lKSkge1xuXHRcdFx0XHRcdHNlbGYubW9udGhOYXYucmVtb3ZlQ2hpbGQobmF2Lm5leHRTaWJsaW5nKTtcblx0XHRcdFx0fXdoaWxlIChuYXYucHJldmlvdXNTaWJsaW5nICYmIC9jdXJyLy50ZXN0KG5hdi5wcmV2aW91c1NpYmxpbmcuY2xhc3NOYW1lKSkge1xuXHRcdFx0XHRcdHNlbGYubW9udGhOYXYucmVtb3ZlQ2hpbGQobmF2LnByZXZpb3VzU2libGluZyk7XG5cdFx0XHRcdH1zZWxmLm9sZEN1ck1vbnRoID0gbnVsbDtcblx0XHRcdFx0YnJlYWs7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG4gICogU2V0IHRoZSBjYWxlbmRhciB2aWV3IHRvIGEgcGFydGljdWxhciBkYXRlLlxuICAqIEBwYXJhbSB7RGF0ZX0ganVtcERhdGUgdGhlIGRhdGUgdG8gc2V0IHRoZSB2aWV3IHRvXG4gICovXG5cdGZ1bmN0aW9uIGp1bXBUb0RhdGUoanVtcERhdGUpIHtcblx0XHRqdW1wRGF0ZSA9IGp1bXBEYXRlID8gc2VsZi5wYXJzZURhdGUoanVtcERhdGUpIDogc2VsZi5sYXRlc3RTZWxlY3RlZERhdGVPYmogfHwgKHNlbGYuY29uZmlnLm1pbkRhdGUgPiBzZWxmLm5vdyA/IHNlbGYuY29uZmlnLm1pbkRhdGUgOiBzZWxmLmNvbmZpZy5tYXhEYXRlICYmIHNlbGYuY29uZmlnLm1heERhdGUgPCBzZWxmLm5vdyA/IHNlbGYuY29uZmlnLm1heERhdGUgOiBzZWxmLm5vdyk7XG5cblx0XHR0cnkge1xuXHRcdFx0c2VsZi5jdXJyZW50WWVhciA9IGp1bXBEYXRlLmdldEZ1bGxZZWFyKCk7XG5cdFx0XHRzZWxmLmN1cnJlbnRNb250aCA9IGp1bXBEYXRlLmdldE1vbnRoKCk7XG5cdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0LyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cblx0XHRcdGNvbnNvbGUuZXJyb3IoZS5zdGFjayk7XG5cdFx0XHQvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuXHRcdFx0Y29uc29sZS53YXJuKFwiSW52YWxpZCBkYXRlIHN1cHBsaWVkOiBcIiArIGp1bXBEYXRlKTtcblx0XHR9XG5cblx0XHRzZWxmLnJlZHJhdygpO1xuXHR9XG5cblx0LyoqXG4gICogVGhlIHVwL2Rvd24gYXJyb3cgaGFuZGxlciBmb3IgdGltZSBpbnB1dHNcbiAgKiBAcGFyYW0ge0V2ZW50fSBlIHRoZSBjbGljayBldmVudFxuICAqL1xuXHRmdW5jdGlvbiB0aW1lSW5jcmVtZW50KGUpIHtcblx0XHRpZiAofmUudGFyZ2V0LmNsYXNzTmFtZS5pbmRleE9mKFwiYXJyb3dcIikpIGluY3JlbWVudE51bUlucHV0KGUsIGUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhcImFycm93VXBcIikgPyAxIDogLTEpO1xuXHR9XG5cblx0LyoqXG4gICogSW5jcmVtZW50cy9kZWNyZW1lbnRzIHRoZSB2YWx1ZSBvZiBpbnB1dCBhc3NvY2ktXG4gICogYXRlZCB3aXRoIHRoZSB1cC9kb3duIGFycm93IGJ5IGRpc3BhdGNoaW5nIGFuXG4gICogXCJpbmNyZW1lbnRcIiBldmVudCBvbiB0aGUgaW5wdXQuXG4gICpcbiAgKiBAcGFyYW0ge0V2ZW50fSBlIHRoZSBjbGljayBldmVudFxuICAqIEBwYXJhbSB7TnVtYmVyfSBkZWx0YSB0aGUgZGlmZiAodXN1YWxseSAxIG9yIC0xKVxuICAqIEBwYXJhbSB7RWxlbWVudH0gaW5wdXRFbGVtIHRoZSBpbnB1dCBlbGVtZW50XG4gICovXG5cdGZ1bmN0aW9uIGluY3JlbWVudE51bUlucHV0KGUsIGRlbHRhLCBpbnB1dEVsZW0pIHtcblx0XHR2YXIgaW5wdXQgPSBpbnB1dEVsZW0gfHwgZS50YXJnZXQucGFyZW50Tm9kZS5jaGlsZE5vZGVzWzBdO1xuXHRcdHZhciBldmVudCA9IGNyZWF0ZUV2ZW50KFwiaW5jcmVtZW50XCIpO1xuXHRcdGV2ZW50LmRlbHRhID0gZGVsdGE7XG5cdFx0aW5wdXQuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cdH1cblxuXHRmdW5jdGlvbiBjcmVhdGVOdW1iZXJJbnB1dChpbnB1dENsYXNzTmFtZSkge1xuXHRcdHZhciB3cmFwcGVyID0gY3JlYXRlRWxlbWVudChcImRpdlwiLCBcIm51bUlucHV0V3JhcHBlclwiKSxcblx0XHQgICAgbnVtSW5wdXQgPSBjcmVhdGVFbGVtZW50KFwiaW5wdXRcIiwgXCJudW1JbnB1dCBcIiArIGlucHV0Q2xhc3NOYW1lKSxcblx0XHQgICAgYXJyb3dVcCA9IGNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIFwiYXJyb3dVcFwiKSxcblx0XHQgICAgYXJyb3dEb3duID0gY3JlYXRlRWxlbWVudChcInNwYW5cIiwgXCJhcnJvd0Rvd25cIik7XG5cblx0XHRudW1JbnB1dC50eXBlID0gXCJ0ZXh0XCI7XG5cdFx0bnVtSW5wdXQucGF0dGVybiA9IFwiXFxcXGQqXCI7XG5cblx0XHR3cmFwcGVyLmFwcGVuZENoaWxkKG51bUlucHV0KTtcblx0XHR3cmFwcGVyLmFwcGVuZENoaWxkKGFycm93VXApO1xuXHRcdHdyYXBwZXIuYXBwZW5kQ2hpbGQoYXJyb3dEb3duKTtcblxuXHRcdHJldHVybiB3cmFwcGVyO1xuXHR9XG5cblx0ZnVuY3Rpb24gYnVpbGQoKSB7XG5cdFx0dmFyIGZyYWdtZW50ID0gd2luZG93LmRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcblx0XHRzZWxmLmNhbGVuZGFyQ29udGFpbmVyID0gY3JlYXRlRWxlbWVudChcImRpdlwiLCBcImZsYXRwaWNrci1jYWxlbmRhclwiKTtcblx0XHRzZWxmLmNhbGVuZGFyQ29udGFpbmVyLnRhYkluZGV4ID0gLTE7XG5cblx0XHRpZiAoIXNlbGYuY29uZmlnLm5vQ2FsZW5kYXIpIHtcblx0XHRcdGZyYWdtZW50LmFwcGVuZENoaWxkKGJ1aWxkTW9udGhOYXYoKSk7XG5cdFx0XHRzZWxmLmlubmVyQ29udGFpbmVyID0gY3JlYXRlRWxlbWVudChcImRpdlwiLCBcImZsYXRwaWNrci1pbm5lckNvbnRhaW5lclwiKTtcblxuXHRcdFx0aWYgKHNlbGYuY29uZmlnLndlZWtOdW1iZXJzKSBzZWxmLmlubmVyQ29udGFpbmVyLmFwcGVuZENoaWxkKGJ1aWxkV2Vla3MoKSk7XG5cblx0XHRcdHNlbGYuckNvbnRhaW5lciA9IGNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgXCJmbGF0cGlja3ItckNvbnRhaW5lclwiKTtcblx0XHRcdHNlbGYuckNvbnRhaW5lci5hcHBlbmRDaGlsZChidWlsZFdlZWtkYXlzKCkpO1xuXG5cdFx0XHRpZiAoIXNlbGYuZGF5c0NvbnRhaW5lcikge1xuXHRcdFx0XHRzZWxmLmRheXNDb250YWluZXIgPSBjcmVhdGVFbGVtZW50KFwiZGl2XCIsIFwiZmxhdHBpY2tyLWRheXNcIik7XG5cdFx0XHRcdHNlbGYuZGF5c0NvbnRhaW5lci50YWJJbmRleCA9IC0xO1xuXHRcdFx0fVxuXG5cdFx0XHRidWlsZERheXMoKTtcblx0XHRcdHNlbGYuckNvbnRhaW5lci5hcHBlbmRDaGlsZChzZWxmLmRheXNDb250YWluZXIpO1xuXG5cdFx0XHRzZWxmLmlubmVyQ29udGFpbmVyLmFwcGVuZENoaWxkKHNlbGYuckNvbnRhaW5lcik7XG5cdFx0XHRmcmFnbWVudC5hcHBlbmRDaGlsZChzZWxmLmlubmVyQ29udGFpbmVyKTtcblx0XHR9XG5cblx0XHRpZiAoc2VsZi5jb25maWcuZW5hYmxlVGltZSkgZnJhZ21lbnQuYXBwZW5kQ2hpbGQoYnVpbGRUaW1lKCkpO1xuXG5cdFx0dG9nZ2xlQ2xhc3Moc2VsZi5jYWxlbmRhckNvbnRhaW5lciwgXCJyYW5nZU1vZGVcIiwgc2VsZi5jb25maWcubW9kZSA9PT0gXCJyYW5nZVwiKTtcblx0XHR0b2dnbGVDbGFzcyhzZWxmLmNhbGVuZGFyQ29udGFpbmVyLCBcImFuaW1hdGVcIiwgc2VsZi5jb25maWcuYW5pbWF0ZSk7XG5cblx0XHRzZWxmLmNhbGVuZGFyQ29udGFpbmVyLmFwcGVuZENoaWxkKGZyYWdtZW50KTtcblxuXHRcdHZhciBjdXN0b21BcHBlbmQgPSBzZWxmLmNvbmZpZy5hcHBlbmRUbyAmJiBzZWxmLmNvbmZpZy5hcHBlbmRUby5ub2RlVHlwZTtcblxuXHRcdGlmIChzZWxmLmNvbmZpZy5pbmxpbmUgfHwgc2VsZi5jb25maWcuc3RhdGljKSB7XG5cdFx0XHRzZWxmLmNhbGVuZGFyQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoc2VsZi5jb25maWcuaW5saW5lID8gXCJpbmxpbmVcIiA6IFwic3RhdGljXCIpO1xuXG5cdFx0XHRpZiAoc2VsZi5jb25maWcuaW5saW5lICYmICFjdXN0b21BcHBlbmQpIHtcblx0XHRcdFx0cmV0dXJuIHNlbGYuZWxlbWVudC5wYXJlbnROb2RlLmluc2VydEJlZm9yZShzZWxmLmNhbGVuZGFyQ29udGFpbmVyLCBzZWxmLl9pbnB1dC5uZXh0U2libGluZyk7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChzZWxmLmNvbmZpZy5zdGF0aWMpIHtcblx0XHRcdFx0dmFyIHdyYXBwZXIgPSBjcmVhdGVFbGVtZW50KFwiZGl2XCIsIFwiZmxhdHBpY2tyLXdyYXBwZXJcIik7XG5cdFx0XHRcdHNlbGYuZWxlbWVudC5wYXJlbnROb2RlLmluc2VydEJlZm9yZSh3cmFwcGVyLCBzZWxmLmVsZW1lbnQpO1xuXHRcdFx0XHR3cmFwcGVyLmFwcGVuZENoaWxkKHNlbGYuZWxlbWVudCk7XG5cblx0XHRcdFx0aWYgKHNlbGYuYWx0SW5wdXQpIHdyYXBwZXIuYXBwZW5kQ2hpbGQoc2VsZi5hbHRJbnB1dCk7XG5cblx0XHRcdFx0d3JhcHBlci5hcHBlbmRDaGlsZChzZWxmLmNhbGVuZGFyQ29udGFpbmVyKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdChjdXN0b21BcHBlbmQgPyBzZWxmLmNvbmZpZy5hcHBlbmRUbyA6IHdpbmRvdy5kb2N1bWVudC5ib2R5KS5hcHBlbmRDaGlsZChzZWxmLmNhbGVuZGFyQ29udGFpbmVyKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGNyZWF0ZURheShjbGFzc05hbWUsIGRhdGUsIGRheU51bWJlciwgaSkge1xuXHRcdHZhciBkYXRlSXNFbmFibGVkID0gaXNFbmFibGVkKGRhdGUsIHRydWUpLFxuXHRcdCAgICBkYXlFbGVtZW50ID0gY3JlYXRlRWxlbWVudChcInNwYW5cIiwgXCJmbGF0cGlja3ItZGF5IFwiICsgY2xhc3NOYW1lLCBkYXRlLmdldERhdGUoKSk7XG5cblx0XHRkYXlFbGVtZW50LmRhdGVPYmogPSBkYXRlO1xuXHRcdGRheUVsZW1lbnQuJGkgPSBpO1xuXHRcdGRheUVsZW1lbnQuc2V0QXR0cmlidXRlKFwiYXJpYS1sYWJlbFwiLCBzZWxmLmZvcm1hdERhdGUoZGF0ZSwgc2VsZi5jb25maWcuYXJpYURhdGVGb3JtYXQpKTtcblxuXHRcdGlmIChjb21wYXJlRGF0ZXMoZGF0ZSwgc2VsZi5ub3cpID09PSAwKSB7XG5cdFx0XHRzZWxmLnRvZGF5RGF0ZUVsZW0gPSBkYXlFbGVtZW50O1xuXHRcdFx0ZGF5RWxlbWVudC5jbGFzc0xpc3QuYWRkKFwidG9kYXlcIik7XG5cdFx0fVxuXG5cdFx0aWYgKGRhdGVJc0VuYWJsZWQpIHtcblx0XHRcdGRheUVsZW1lbnQudGFiSW5kZXggPSAtMTtcblx0XHRcdGlmIChpc0RhdGVTZWxlY3RlZChkYXRlKSkge1xuXHRcdFx0XHRkYXlFbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJzZWxlY3RlZFwiKTtcblx0XHRcdFx0c2VsZi5zZWxlY3RlZERhdGVFbGVtID0gZGF5RWxlbWVudDtcblx0XHRcdFx0aWYgKHNlbGYuY29uZmlnLm1vZGUgPT09IFwicmFuZ2VcIikge1xuXHRcdFx0XHRcdHRvZ2dsZUNsYXNzKGRheUVsZW1lbnQsIFwic3RhcnRSYW5nZVwiLCBjb21wYXJlRGF0ZXMoZGF0ZSwgc2VsZi5zZWxlY3RlZERhdGVzWzBdKSA9PT0gMCk7XG5cblx0XHRcdFx0XHR0b2dnbGVDbGFzcyhkYXlFbGVtZW50LCBcImVuZFJhbmdlXCIsIGNvbXBhcmVEYXRlcyhkYXRlLCBzZWxmLnNlbGVjdGVkRGF0ZXNbMV0pID09PSAwKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRkYXlFbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJkaXNhYmxlZFwiKTtcblx0XHRcdGlmIChzZWxmLnNlbGVjdGVkRGF0ZXNbMF0gJiYgZGF0ZSA+IHNlbGYubWluUmFuZ2VEYXRlICYmIGRhdGUgPCBzZWxmLnNlbGVjdGVkRGF0ZXNbMF0pIHNlbGYubWluUmFuZ2VEYXRlID0gZGF0ZTtlbHNlIGlmIChzZWxmLnNlbGVjdGVkRGF0ZXNbMF0gJiYgZGF0ZSA8IHNlbGYubWF4UmFuZ2VEYXRlICYmIGRhdGUgPiBzZWxmLnNlbGVjdGVkRGF0ZXNbMF0pIHNlbGYubWF4UmFuZ2VEYXRlID0gZGF0ZTtcblx0XHR9XG5cblx0XHRpZiAoc2VsZi5jb25maWcubW9kZSA9PT0gXCJyYW5nZVwiKSB7XG5cdFx0XHRpZiAoaXNEYXRlSW5SYW5nZShkYXRlKSAmJiAhaXNEYXRlU2VsZWN0ZWQoZGF0ZSkpIGRheUVsZW1lbnQuY2xhc3NMaXN0LmFkZChcImluUmFuZ2VcIik7XG5cblx0XHRcdGlmIChzZWxmLnNlbGVjdGVkRGF0ZXMubGVuZ3RoID09PSAxICYmIChkYXRlIDwgc2VsZi5taW5SYW5nZURhdGUgfHwgZGF0ZSA+IHNlbGYubWF4UmFuZ2VEYXRlKSkgZGF5RWxlbWVudC5jbGFzc0xpc3QuYWRkKFwibm90QWxsb3dlZFwiKTtcblx0XHR9XG5cblx0XHRpZiAoc2VsZi5jb25maWcud2Vla051bWJlcnMgJiYgY2xhc3NOYW1lICE9PSBcInByZXZNb250aERheVwiICYmIGRheU51bWJlciAlIDcgPT09IDEpIHtcblx0XHRcdHNlbGYud2Vla051bWJlcnMuaW5zZXJ0QWRqYWNlbnRIVE1MKFwiYmVmb3JlZW5kXCIsIFwiPHNwYW4gY2xhc3M9J2Rpc2FibGVkIGZsYXRwaWNrci1kYXknPlwiICsgc2VsZi5jb25maWcuZ2V0V2VlayhkYXRlKSArIFwiPC9zcGFuPlwiKTtcblx0XHR9XG5cblx0XHR0cmlnZ2VyRXZlbnQoXCJEYXlDcmVhdGVcIiwgZGF5RWxlbWVudCk7XG5cblx0XHRyZXR1cm4gZGF5RWxlbWVudDtcblx0fVxuXG5cdGZ1bmN0aW9uIGZvY3VzT25EYXkoY3VycmVudEluZGV4LCBvZmZzZXQpIHtcblx0XHR2YXIgbmV3SW5kZXggPSBjdXJyZW50SW5kZXggKyBvZmZzZXQgfHwgMCxcblx0XHQgICAgdGFyZ2V0Tm9kZSA9IGN1cnJlbnRJbmRleCAhPT0gdW5kZWZpbmVkID8gc2VsZi5kYXlzLmNoaWxkTm9kZXNbbmV3SW5kZXhdIDogc2VsZi5zZWxlY3RlZERhdGVFbGVtIHx8IHNlbGYudG9kYXlEYXRlRWxlbSB8fCBzZWxmLmRheXMuY2hpbGROb2Rlc1swXSxcblx0XHQgICAgZm9jdXMgPSBmdW5jdGlvbiBmb2N1cygpIHtcblx0XHRcdHRhcmdldE5vZGUgPSB0YXJnZXROb2RlIHx8IHNlbGYuZGF5cy5jaGlsZE5vZGVzW25ld0luZGV4XTtcblx0XHRcdHRhcmdldE5vZGUuZm9jdXMoKTtcblxuXHRcdFx0aWYgKHNlbGYuY29uZmlnLm1vZGUgPT09IFwicmFuZ2VcIikgb25Nb3VzZU92ZXIodGFyZ2V0Tm9kZSk7XG5cdFx0fTtcblxuXHRcdGlmICh0YXJnZXROb2RlID09PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSAwKSB7XG5cdFx0XHRpZiAob2Zmc2V0ID4gMCkge1xuXHRcdFx0XHRzZWxmLmNoYW5nZU1vbnRoKDEpO1xuXHRcdFx0XHRuZXdJbmRleCA9IG5ld0luZGV4ICUgNDI7XG5cdFx0XHR9IGVsc2UgaWYgKG9mZnNldCA8IDApIHtcblx0XHRcdFx0c2VsZi5jaGFuZ2VNb250aCgtMSk7XG5cdFx0XHRcdG5ld0luZGV4ICs9IDQyO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gYWZ0ZXJEYXlBbmltKGZvY3VzKTtcblx0XHR9XG5cblx0XHRmb2N1cygpO1xuXHR9XG5cblx0ZnVuY3Rpb24gYWZ0ZXJEYXlBbmltKGZuKSB7XG5cdFx0aWYgKHNlbGYuY29uZmlnLmFuaW1hdGUgPT09IHRydWUpIHJldHVybiBzZWxmLl9hbmltYXRpb25Mb29wLnB1c2goZm4pO1xuXHRcdGZuKCk7XG5cdH1cblxuXHRmdW5jdGlvbiBidWlsZERheXMoZGVsdGEpIHtcblx0XHR2YXIgZmlyc3RPZk1vbnRoID0gKG5ldyBEYXRlKHNlbGYuY3VycmVudFllYXIsIHNlbGYuY3VycmVudE1vbnRoLCAxKS5nZXREYXkoKSAtIHNlbGYubDEwbi5maXJzdERheU9mV2VlayArIDcpICUgNyxcblx0XHQgICAgaXNSYW5nZU1vZGUgPSBzZWxmLmNvbmZpZy5tb2RlID09PSBcInJhbmdlXCI7XG5cblx0XHRzZWxmLnByZXZNb250aERheXMgPSBzZWxmLnV0aWxzLmdldERheXNpbk1vbnRoKChzZWxmLmN1cnJlbnRNb250aCAtIDEgKyAxMikgJSAxMik7XG5cdFx0c2VsZi5zZWxlY3RlZERhdGVFbGVtID0gdW5kZWZpbmVkO1xuXHRcdHNlbGYudG9kYXlEYXRlRWxlbSA9IHVuZGVmaW5lZDtcblxuXHRcdHZhciBkYXlzSW5Nb250aCA9IHNlbGYudXRpbHMuZ2V0RGF5c2luTW9udGgoKSxcblx0XHQgICAgZGF5cyA9IHdpbmRvdy5kb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG5cblx0XHR2YXIgZGF5TnVtYmVyID0gc2VsZi5wcmV2TW9udGhEYXlzICsgMSAtIGZpcnN0T2ZNb250aCxcblx0XHQgICAgZGF5SW5kZXggPSAwO1xuXG5cdFx0aWYgKHNlbGYuY29uZmlnLndlZWtOdW1iZXJzICYmIHNlbGYud2Vla051bWJlcnMuZmlyc3RDaGlsZCkgc2VsZi53ZWVrTnVtYmVycy50ZXh0Q29udGVudCA9IFwiXCI7XG5cblx0XHRpZiAoaXNSYW5nZU1vZGUpIHtcblx0XHRcdC8vIGNvbnN0IGRhdGVMaW1pdHMgPSBzZWxmLmNvbmZpZy5lbmFibGUubGVuZ3RoIHx8IHNlbGYuY29uZmlnLmRpc2FibGUubGVuZ3RoIHx8IHNlbGYuY29uZmlnLm1peERhdGUgfHwgc2VsZi5jb25maWcubWF4RGF0ZTtcblx0XHRcdHNlbGYubWluUmFuZ2VEYXRlID0gbmV3IERhdGUoc2VsZi5jdXJyZW50WWVhciwgc2VsZi5jdXJyZW50TW9udGggLSAxLCBkYXlOdW1iZXIpO1xuXHRcdFx0c2VsZi5tYXhSYW5nZURhdGUgPSBuZXcgRGF0ZShzZWxmLmN1cnJlbnRZZWFyLCBzZWxmLmN1cnJlbnRNb250aCArIDEsICg0MiAtIGZpcnN0T2ZNb250aCkgJSBkYXlzSW5Nb250aCk7XG5cdFx0fVxuXG5cdFx0Ly8gcHJlcGVuZCBkYXlzIGZyb20gdGhlIGVuZGluZyBvZiBwcmV2aW91cyBtb250aFxuXHRcdGZvciAoOyBkYXlOdW1iZXIgPD0gc2VsZi5wcmV2TW9udGhEYXlzOyBkYXlOdW1iZXIrKywgZGF5SW5kZXgrKykge1xuXHRcdFx0ZGF5cy5hcHBlbmRDaGlsZChjcmVhdGVEYXkoXCJwcmV2TW9udGhEYXlcIiwgbmV3IERhdGUoc2VsZi5jdXJyZW50WWVhciwgc2VsZi5jdXJyZW50TW9udGggLSAxLCBkYXlOdW1iZXIpLCBkYXlOdW1iZXIsIGRheUluZGV4KSk7XG5cdFx0fVxuXG5cdFx0Ly8gU3RhcnQgYXQgMSBzaW5jZSB0aGVyZSBpcyBubyAwdGggZGF5XG5cdFx0Zm9yIChkYXlOdW1iZXIgPSAxOyBkYXlOdW1iZXIgPD0gZGF5c0luTW9udGg7IGRheU51bWJlcisrLCBkYXlJbmRleCsrKSB7XG5cdFx0XHRkYXlzLmFwcGVuZENoaWxkKGNyZWF0ZURheShcIlwiLCBuZXcgRGF0ZShzZWxmLmN1cnJlbnRZZWFyLCBzZWxmLmN1cnJlbnRNb250aCwgZGF5TnVtYmVyKSwgZGF5TnVtYmVyLCBkYXlJbmRleCkpO1xuXHRcdH1cblxuXHRcdC8vIGFwcGVuZCBkYXlzIGZyb20gdGhlIG5leHQgbW9udGhcblx0XHRmb3IgKHZhciBkYXlOdW0gPSBkYXlzSW5Nb250aCArIDE7IGRheU51bSA8PSA0MiAtIGZpcnN0T2ZNb250aDsgZGF5TnVtKyssIGRheUluZGV4KyspIHtcblx0XHRcdGRheXMuYXBwZW5kQ2hpbGQoY3JlYXRlRGF5KFwibmV4dE1vbnRoRGF5XCIsIG5ldyBEYXRlKHNlbGYuY3VycmVudFllYXIsIHNlbGYuY3VycmVudE1vbnRoICsgMSwgZGF5TnVtICUgZGF5c0luTW9udGgpLCBkYXlOdW0sIGRheUluZGV4KSk7XG5cdFx0fVxuXG5cdFx0aWYgKGlzUmFuZ2VNb2RlICYmIHNlbGYuc2VsZWN0ZWREYXRlcy5sZW5ndGggPT09IDEgJiYgZGF5cy5jaGlsZE5vZGVzWzBdKSB7XG5cdFx0XHRzZWxmLl9oaWRlUHJldk1vbnRoQXJyb3cgPSBzZWxmLl9oaWRlUHJldk1vbnRoQXJyb3cgfHwgc2VsZi5taW5SYW5nZURhdGUgPiBkYXlzLmNoaWxkTm9kZXNbMF0uZGF0ZU9iajtcblxuXHRcdFx0c2VsZi5faGlkZU5leHRNb250aEFycm93ID0gc2VsZi5faGlkZU5leHRNb250aEFycm93IHx8IHNlbGYubWF4UmFuZ2VEYXRlIDwgbmV3IERhdGUoc2VsZi5jdXJyZW50WWVhciwgc2VsZi5jdXJyZW50TW9udGggKyAxLCAxKTtcblx0XHR9IGVsc2UgdXBkYXRlTmF2aWdhdGlvbkN1cnJlbnRNb250aCgpO1xuXG5cdFx0dmFyIGRheUNvbnRhaW5lciA9IGNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgXCJkYXlDb250YWluZXJcIik7XG5cdFx0ZGF5Q29udGFpbmVyLmFwcGVuZENoaWxkKGRheXMpO1xuXG5cdFx0aWYgKCFzZWxmLmNvbmZpZy5hbmltYXRlIHx8IGRlbHRhID09PSB1bmRlZmluZWQpIGNsZWFyTm9kZShzZWxmLmRheXNDb250YWluZXIpO2Vsc2Uge1xuXHRcdFx0d2hpbGUgKHNlbGYuZGF5c0NvbnRhaW5lci5jaGlsZE5vZGVzLmxlbmd0aCA+IDEpIHtcblx0XHRcdFx0c2VsZi5kYXlzQ29udGFpbmVyLnJlbW92ZUNoaWxkKHNlbGYuZGF5c0NvbnRhaW5lci5maXJzdENoaWxkKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoZGVsdGEgPj0gMCkgc2VsZi5kYXlzQ29udGFpbmVyLmFwcGVuZENoaWxkKGRheUNvbnRhaW5lcik7ZWxzZSBzZWxmLmRheXNDb250YWluZXIuaW5zZXJ0QmVmb3JlKGRheUNvbnRhaW5lciwgc2VsZi5kYXlzQ29udGFpbmVyLmZpcnN0Q2hpbGQpO1xuXG5cdFx0c2VsZi5kYXlzID0gc2VsZi5kYXlzQ29udGFpbmVyLmZpcnN0Q2hpbGQ7XG5cdFx0cmV0dXJuIHNlbGYuZGF5c0NvbnRhaW5lcjtcblx0fVxuXG5cdGZ1bmN0aW9uIGNsZWFyTm9kZShub2RlKSB7XG5cdFx0d2hpbGUgKG5vZGUuZmlyc3RDaGlsZCkge1xuXHRcdFx0bm9kZS5yZW1vdmVDaGlsZChub2RlLmZpcnN0Q2hpbGQpO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIGJ1aWxkTW9udGhOYXYoKSB7XG5cdFx0dmFyIG1vbnRoTmF2RnJhZ21lbnQgPSB3aW5kb3cuZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuXHRcdHNlbGYubW9udGhOYXYgPSBjcmVhdGVFbGVtZW50KFwiZGl2XCIsIFwiZmxhdHBpY2tyLW1vbnRoXCIpO1xuXG5cdFx0c2VsZi5wcmV2TW9udGhOYXYgPSBjcmVhdGVFbGVtZW50KFwic3BhblwiLCBcImZsYXRwaWNrci1wcmV2LW1vbnRoXCIpO1xuXHRcdHNlbGYucHJldk1vbnRoTmF2LmlubmVySFRNTCA9IHNlbGYuY29uZmlnLnByZXZBcnJvdztcblxuXHRcdHNlbGYuY3VycmVudE1vbnRoRWxlbWVudCA9IGNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIFwiY3VyLW1vbnRoXCIpO1xuXHRcdHNlbGYuY3VycmVudE1vbnRoRWxlbWVudC50aXRsZSA9IHNlbGYubDEwbi5zY3JvbGxUaXRsZTtcblxuXHRcdHZhciB5ZWFySW5wdXQgPSBjcmVhdGVOdW1iZXJJbnB1dChcImN1ci15ZWFyXCIpO1xuXHRcdHNlbGYuY3VycmVudFllYXJFbGVtZW50ID0geWVhcklucHV0LmNoaWxkTm9kZXNbMF07XG5cdFx0c2VsZi5jdXJyZW50WWVhckVsZW1lbnQudGl0bGUgPSBzZWxmLmwxMG4uc2Nyb2xsVGl0bGU7XG5cblx0XHRpZiAoc2VsZi5jb25maWcubWluRGF0ZSkgc2VsZi5jdXJyZW50WWVhckVsZW1lbnQubWluID0gc2VsZi5jb25maWcubWluRGF0ZS5nZXRGdWxsWWVhcigpO1xuXG5cdFx0aWYgKHNlbGYuY29uZmlnLm1heERhdGUpIHtcblx0XHRcdHNlbGYuY3VycmVudFllYXJFbGVtZW50Lm1heCA9IHNlbGYuY29uZmlnLm1heERhdGUuZ2V0RnVsbFllYXIoKTtcblxuXHRcdFx0c2VsZi5jdXJyZW50WWVhckVsZW1lbnQuZGlzYWJsZWQgPSBzZWxmLmNvbmZpZy5taW5EYXRlICYmIHNlbGYuY29uZmlnLm1pbkRhdGUuZ2V0RnVsbFllYXIoKSA9PT0gc2VsZi5jb25maWcubWF4RGF0ZS5nZXRGdWxsWWVhcigpO1xuXHRcdH1cblxuXHRcdHNlbGYubmV4dE1vbnRoTmF2ID0gY3JlYXRlRWxlbWVudChcInNwYW5cIiwgXCJmbGF0cGlja3ItbmV4dC1tb250aFwiKTtcblx0XHRzZWxmLm5leHRNb250aE5hdi5pbm5lckhUTUwgPSBzZWxmLmNvbmZpZy5uZXh0QXJyb3c7XG5cblx0XHRzZWxmLm5hdmlnYXRpb25DdXJyZW50TW9udGggPSBjcmVhdGVFbGVtZW50KFwic3BhblwiLCBcImZsYXRwaWNrci1jdXJyZW50LW1vbnRoXCIpO1xuXHRcdHNlbGYubmF2aWdhdGlvbkN1cnJlbnRNb250aC5hcHBlbmRDaGlsZChzZWxmLmN1cnJlbnRNb250aEVsZW1lbnQpO1xuXHRcdHNlbGYubmF2aWdhdGlvbkN1cnJlbnRNb250aC5hcHBlbmRDaGlsZCh5ZWFySW5wdXQpO1xuXG5cdFx0bW9udGhOYXZGcmFnbWVudC5hcHBlbmRDaGlsZChzZWxmLnByZXZNb250aE5hdik7XG5cdFx0bW9udGhOYXZGcmFnbWVudC5hcHBlbmRDaGlsZChzZWxmLm5hdmlnYXRpb25DdXJyZW50TW9udGgpO1xuXHRcdG1vbnRoTmF2RnJhZ21lbnQuYXBwZW5kQ2hpbGQoc2VsZi5uZXh0TW9udGhOYXYpO1xuXHRcdHNlbGYubW9udGhOYXYuYXBwZW5kQ2hpbGQobW9udGhOYXZGcmFnbWVudCk7XG5cblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoc2VsZiwgXCJfaGlkZVByZXZNb250aEFycm93XCIsIHtcblx0XHRcdGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5fX2hpZGVQcmV2TW9udGhBcnJvdztcblx0XHRcdH0sXG5cdFx0XHRzZXQ6IGZ1bmN0aW9uIHNldChib29sKSB7XG5cdFx0XHRcdGlmICh0aGlzLl9faGlkZVByZXZNb250aEFycm93ICE9PSBib29sKSBzZWxmLnByZXZNb250aE5hdi5zdHlsZS5kaXNwbGF5ID0gYm9vbCA/IFwibm9uZVwiIDogXCJibG9ja1wiO1xuXHRcdFx0XHR0aGlzLl9faGlkZVByZXZNb250aEFycm93ID0gYm9vbDtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShzZWxmLCBcIl9oaWRlTmV4dE1vbnRoQXJyb3dcIiwge1xuXHRcdFx0Z2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLl9faGlkZU5leHRNb250aEFycm93O1xuXHRcdFx0fSxcblx0XHRcdHNldDogZnVuY3Rpb24gc2V0KGJvb2wpIHtcblx0XHRcdFx0aWYgKHRoaXMuX19oaWRlTmV4dE1vbnRoQXJyb3cgIT09IGJvb2wpIHNlbGYubmV4dE1vbnRoTmF2LnN0eWxlLmRpc3BsYXkgPSBib29sID8gXCJub25lXCIgOiBcImJsb2NrXCI7XG5cdFx0XHRcdHRoaXMuX19oaWRlTmV4dE1vbnRoQXJyb3cgPSBib29sO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0dXBkYXRlTmF2aWdhdGlvbkN1cnJlbnRNb250aCgpO1xuXG5cdFx0cmV0dXJuIHNlbGYubW9udGhOYXY7XG5cdH1cblxuXHRmdW5jdGlvbiBidWlsZFRpbWUoKSB7XG5cdFx0c2VsZi5jYWxlbmRhckNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiaGFzVGltZVwiKTtcblx0XHRpZiAoc2VsZi5jb25maWcubm9DYWxlbmRhcikgc2VsZi5jYWxlbmRhckNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwibm9DYWxlbmRhclwiKTtcblx0XHRzZWxmLnRpbWVDb250YWluZXIgPSBjcmVhdGVFbGVtZW50KFwiZGl2XCIsIFwiZmxhdHBpY2tyLXRpbWVcIik7XG5cdFx0c2VsZi50aW1lQ29udGFpbmVyLnRhYkluZGV4ID0gLTE7XG5cdFx0dmFyIHNlcGFyYXRvciA9IGNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIFwiZmxhdHBpY2tyLXRpbWUtc2VwYXJhdG9yXCIsIFwiOlwiKTtcblxuXHRcdHZhciBob3VySW5wdXQgPSBjcmVhdGVOdW1iZXJJbnB1dChcImZsYXRwaWNrci1ob3VyXCIpO1xuXHRcdHNlbGYuaG91ckVsZW1lbnQgPSBob3VySW5wdXQuY2hpbGROb2Rlc1swXTtcblxuXHRcdHZhciBtaW51dGVJbnB1dCA9IGNyZWF0ZU51bWJlcklucHV0KFwiZmxhdHBpY2tyLW1pbnV0ZVwiKTtcblx0XHRzZWxmLm1pbnV0ZUVsZW1lbnQgPSBtaW51dGVJbnB1dC5jaGlsZE5vZGVzWzBdO1xuXG5cdFx0c2VsZi5ob3VyRWxlbWVudC50YWJJbmRleCA9IHNlbGYubWludXRlRWxlbWVudC50YWJJbmRleCA9IC0xO1xuXG5cdFx0c2VsZi5ob3VyRWxlbWVudC52YWx1ZSA9IHNlbGYucGFkKHNlbGYubGF0ZXN0U2VsZWN0ZWREYXRlT2JqID8gc2VsZi5sYXRlc3RTZWxlY3RlZERhdGVPYmouZ2V0SG91cnMoKSA6IHNlbGYuY29uZmlnLmRlZmF1bHRIb3VyICUgKHNlbGYudGltZV8yNGhyID8gMjQgOiAxMikpO1xuXG5cdFx0c2VsZi5taW51dGVFbGVtZW50LnZhbHVlID0gc2VsZi5wYWQoc2VsZi5sYXRlc3RTZWxlY3RlZERhdGVPYmogPyBzZWxmLmxhdGVzdFNlbGVjdGVkRGF0ZU9iai5nZXRNaW51dGVzKCkgOiBzZWxmLmNvbmZpZy5kZWZhdWx0TWludXRlKTtcblxuXHRcdHNlbGYuaG91ckVsZW1lbnQuc3RlcCA9IHNlbGYuY29uZmlnLmhvdXJJbmNyZW1lbnQ7XG5cdFx0c2VsZi5taW51dGVFbGVtZW50LnN0ZXAgPSBzZWxmLmNvbmZpZy5taW51dGVJbmNyZW1lbnQ7XG5cblx0XHRzZWxmLmhvdXJFbGVtZW50Lm1pbiA9IHNlbGYuY29uZmlnLnRpbWVfMjRociA/IDAgOiAxO1xuXHRcdHNlbGYuaG91ckVsZW1lbnQubWF4ID0gc2VsZi5jb25maWcudGltZV8yNGhyID8gMjMgOiAxMjtcblxuXHRcdHNlbGYubWludXRlRWxlbWVudC5taW4gPSAwO1xuXHRcdHNlbGYubWludXRlRWxlbWVudC5tYXggPSA1OTtcblxuXHRcdHNlbGYuaG91ckVsZW1lbnQudGl0bGUgPSBzZWxmLm1pbnV0ZUVsZW1lbnQudGl0bGUgPSBzZWxmLmwxMG4uc2Nyb2xsVGl0bGU7XG5cblx0XHRzZWxmLnRpbWVDb250YWluZXIuYXBwZW5kQ2hpbGQoaG91cklucHV0KTtcblx0XHRzZWxmLnRpbWVDb250YWluZXIuYXBwZW5kQ2hpbGQoc2VwYXJhdG9yKTtcblx0XHRzZWxmLnRpbWVDb250YWluZXIuYXBwZW5kQ2hpbGQobWludXRlSW5wdXQpO1xuXG5cdFx0aWYgKHNlbGYuY29uZmlnLnRpbWVfMjRocikgc2VsZi50aW1lQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJ0aW1lMjRoclwiKTtcblxuXHRcdGlmIChzZWxmLmNvbmZpZy5lbmFibGVTZWNvbmRzKSB7XG5cdFx0XHRzZWxmLnRpbWVDb250YWluZXIuY2xhc3NMaXN0LmFkZChcImhhc1NlY29uZHNcIik7XG5cblx0XHRcdHZhciBzZWNvbmRJbnB1dCA9IGNyZWF0ZU51bWJlcklucHV0KFwiZmxhdHBpY2tyLXNlY29uZFwiKTtcblx0XHRcdHNlbGYuc2Vjb25kRWxlbWVudCA9IHNlY29uZElucHV0LmNoaWxkTm9kZXNbMF07XG5cblx0XHRcdHNlbGYuc2Vjb25kRWxlbWVudC52YWx1ZSA9IHNlbGYucGFkKHNlbGYubGF0ZXN0U2VsZWN0ZWREYXRlT2JqID8gc2VsZi5sYXRlc3RTZWxlY3RlZERhdGVPYmouZ2V0U2Vjb25kcygpIDogc2VsZi5jb25maWcuZGVmYXVsdFNlY29uZHMpO1xuXG5cdFx0XHRzZWxmLnNlY29uZEVsZW1lbnQuc3RlcCA9IHNlbGYubWludXRlRWxlbWVudC5zdGVwO1xuXHRcdFx0c2VsZi5zZWNvbmRFbGVtZW50Lm1pbiA9IHNlbGYubWludXRlRWxlbWVudC5taW47XG5cdFx0XHRzZWxmLnNlY29uZEVsZW1lbnQubWF4ID0gc2VsZi5taW51dGVFbGVtZW50Lm1heDtcblxuXHRcdFx0c2VsZi50aW1lQ29udGFpbmVyLmFwcGVuZENoaWxkKGNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIFwiZmxhdHBpY2tyLXRpbWUtc2VwYXJhdG9yXCIsIFwiOlwiKSk7XG5cdFx0XHRzZWxmLnRpbWVDb250YWluZXIuYXBwZW5kQ2hpbGQoc2Vjb25kSW5wdXQpO1xuXHRcdH1cblxuXHRcdGlmICghc2VsZi5jb25maWcudGltZV8yNGhyKSB7XG5cdFx0XHQvLyBhZGQgc2VsZi5hbVBNIGlmIGFwcHJvcHJpYXRlXG5cdFx0XHRzZWxmLmFtUE0gPSBjcmVhdGVFbGVtZW50KFwic3BhblwiLCBcImZsYXRwaWNrci1hbS1wbVwiLCBbXCJBTVwiLCBcIlBNXCJdWyhzZWxmLmxhdGVzdFNlbGVjdGVkRGF0ZU9iaiA/IHNlbGYuaG91ckVsZW1lbnQudmFsdWUgOiBzZWxmLmNvbmZpZy5kZWZhdWx0SG91cikgPiAxMSB8IDBdKTtcblx0XHRcdHNlbGYuYW1QTS50aXRsZSA9IHNlbGYubDEwbi50b2dnbGVUaXRsZTtcblx0XHRcdHNlbGYuYW1QTS50YWJJbmRleCA9IC0xO1xuXHRcdFx0c2VsZi50aW1lQ29udGFpbmVyLmFwcGVuZENoaWxkKHNlbGYuYW1QTSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHNlbGYudGltZUNvbnRhaW5lcjtcblx0fVxuXG5cdGZ1bmN0aW9uIGJ1aWxkV2Vla2RheXMoKSB7XG5cdFx0aWYgKCFzZWxmLndlZWtkYXlDb250YWluZXIpIHNlbGYud2Vla2RheUNvbnRhaW5lciA9IGNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgXCJmbGF0cGlja3Itd2Vla2RheXNcIik7XG5cblx0XHR2YXIgZmlyc3REYXlPZldlZWsgPSBzZWxmLmwxMG4uZmlyc3REYXlPZldlZWs7XG5cdFx0dmFyIHdlZWtkYXlzID0gc2VsZi5sMTBuLndlZWtkYXlzLnNob3J0aGFuZC5zbGljZSgpO1xuXG5cdFx0aWYgKGZpcnN0RGF5T2ZXZWVrID4gMCAmJiBmaXJzdERheU9mV2VlayA8IHdlZWtkYXlzLmxlbmd0aCkge1xuXHRcdFx0d2Vla2RheXMgPSBbXS5jb25jYXQod2Vla2RheXMuc3BsaWNlKGZpcnN0RGF5T2ZXZWVrLCB3ZWVrZGF5cy5sZW5ndGgpLCB3ZWVrZGF5cy5zcGxpY2UoMCwgZmlyc3REYXlPZldlZWspKTtcblx0XHR9XG5cblx0XHRzZWxmLndlZWtkYXlDb250YWluZXIuaW5uZXJIVE1MID0gXCJcXG5cXHRcXHQ8c3BhbiBjbGFzcz1mbGF0cGlja3Itd2Vla2RheT5cXG5cXHRcXHRcXHRcIiArIHdlZWtkYXlzLmpvaW4oXCI8L3NwYW4+PHNwYW4gY2xhc3M9ZmxhdHBpY2tyLXdlZWtkYXk+XCIpICsgXCJcXG5cXHRcXHQ8L3NwYW4+XFxuXFx0XFx0XCI7XG5cblx0XHRyZXR1cm4gc2VsZi53ZWVrZGF5Q29udGFpbmVyO1xuXHR9XG5cblx0LyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cblx0ZnVuY3Rpb24gYnVpbGRXZWVrcygpIHtcblx0XHRzZWxmLmNhbGVuZGFyQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJoYXNXZWVrc1wiKTtcblx0XHRzZWxmLndlZWtXcmFwcGVyID0gY3JlYXRlRWxlbWVudChcImRpdlwiLCBcImZsYXRwaWNrci13ZWVrd3JhcHBlclwiKTtcblx0XHRzZWxmLndlZWtXcmFwcGVyLmFwcGVuZENoaWxkKGNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIFwiZmxhdHBpY2tyLXdlZWtkYXlcIiwgc2VsZi5sMTBuLndlZWtBYmJyZXZpYXRpb24pKTtcblx0XHRzZWxmLndlZWtOdW1iZXJzID0gY3JlYXRlRWxlbWVudChcImRpdlwiLCBcImZsYXRwaWNrci13ZWVrc1wiKTtcblx0XHRzZWxmLndlZWtXcmFwcGVyLmFwcGVuZENoaWxkKHNlbGYud2Vla051bWJlcnMpO1xuXG5cdFx0cmV0dXJuIHNlbGYud2Vla1dyYXBwZXI7XG5cdH1cblxuXHRmdW5jdGlvbiBjaGFuZ2VNb250aCh2YWx1ZSwgaXNfb2Zmc2V0LCBhbmltYXRlKSB7XG5cdFx0aXNfb2Zmc2V0ID0gaXNfb2Zmc2V0ID09PSB1bmRlZmluZWQgfHwgaXNfb2Zmc2V0O1xuXHRcdHZhciBkZWx0YSA9IGlzX29mZnNldCA/IHZhbHVlIDogdmFsdWUgLSBzZWxmLmN1cnJlbnRNb250aDtcblx0XHR2YXIgc2tpcEFuaW1hdGlvbnMgPSAhc2VsZi5jb25maWcuYW5pbWF0ZSB8fCBhbmltYXRlID09PSBmYWxzZTtcblxuXHRcdGlmIChkZWx0YSA8IDAgJiYgc2VsZi5faGlkZVByZXZNb250aEFycm93IHx8IGRlbHRhID4gMCAmJiBzZWxmLl9oaWRlTmV4dE1vbnRoQXJyb3cpIHJldHVybjtcblxuXHRcdHNlbGYuY3VycmVudE1vbnRoICs9IGRlbHRhO1xuXG5cdFx0aWYgKHNlbGYuY3VycmVudE1vbnRoIDwgMCB8fCBzZWxmLmN1cnJlbnRNb250aCA+IDExKSB7XG5cdFx0XHRzZWxmLmN1cnJlbnRZZWFyICs9IHNlbGYuY3VycmVudE1vbnRoID4gMTEgPyAxIDogLTE7XG5cdFx0XHRzZWxmLmN1cnJlbnRNb250aCA9IChzZWxmLmN1cnJlbnRNb250aCArIDEyKSAlIDEyO1xuXG5cdFx0XHR0cmlnZ2VyRXZlbnQoXCJZZWFyQ2hhbmdlXCIpO1xuXHRcdH1cblxuXHRcdGJ1aWxkRGF5cyghc2tpcEFuaW1hdGlvbnMgPyBkZWx0YSA6IHVuZGVmaW5lZCk7XG5cblx0XHRpZiAoc2tpcEFuaW1hdGlvbnMpIHtcblx0XHRcdHRyaWdnZXJFdmVudChcIk1vbnRoQ2hhbmdlXCIpO1xuXHRcdFx0cmV0dXJuIHVwZGF0ZU5hdmlnYXRpb25DdXJyZW50TW9udGgoKTtcblx0XHR9XG5cblx0XHQvLyByZW1vdmUgcG9zc2libGUgcmVtbmFudHMgZnJvbSBjbGlja2luZyB0b28gZmFzdFxuXHRcdHZhciBuYXYgPSBzZWxmLm5hdmlnYXRpb25DdXJyZW50TW9udGg7XG5cdFx0aWYgKGRlbHRhIDwgMCkge1xuXHRcdFx0d2hpbGUgKG5hdi5uZXh0U2libGluZyAmJiAvY3Vyci8udGVzdChuYXYubmV4dFNpYmxpbmcuY2xhc3NOYW1lKSkge1xuXHRcdFx0XHRzZWxmLm1vbnRoTmF2LnJlbW92ZUNoaWxkKG5hdi5uZXh0U2libGluZyk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmIChkZWx0YSA+IDApIHtcblx0XHRcdHdoaWxlIChuYXYucHJldmlvdXNTaWJsaW5nICYmIC9jdXJyLy50ZXN0KG5hdi5wcmV2aW91c1NpYmxpbmcuY2xhc3NOYW1lKSkge1xuXHRcdFx0XHRzZWxmLm1vbnRoTmF2LnJlbW92ZUNoaWxkKG5hdi5wcmV2aW91c1NpYmxpbmcpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHNlbGYub2xkQ3VyTW9udGggPSBzZWxmLm5hdmlnYXRpb25DdXJyZW50TW9udGg7XG5cblx0XHRzZWxmLm5hdmlnYXRpb25DdXJyZW50TW9udGggPSBzZWxmLm1vbnRoTmF2Lmluc2VydEJlZm9yZShzZWxmLm9sZEN1ck1vbnRoLmNsb25lTm9kZSh0cnVlKSwgZGVsdGEgPiAwID8gc2VsZi5vbGRDdXJNb250aC5uZXh0U2libGluZyA6IHNlbGYub2xkQ3VyTW9udGgpO1xuXG5cdFx0aWYgKGRlbHRhID4gMCkge1xuXHRcdFx0c2VsZi5kYXlzQ29udGFpbmVyLmZpcnN0Q2hpbGQuY2xhc3NMaXN0LmFkZChcInNsaWRlTGVmdFwiKTtcblx0XHRcdHNlbGYuZGF5c0NvbnRhaW5lci5sYXN0Q2hpbGQuY2xhc3NMaXN0LmFkZChcInNsaWRlTGVmdE5ld1wiKTtcblxuXHRcdFx0c2VsZi5vbGRDdXJNb250aC5jbGFzc0xpc3QuYWRkKFwic2xpZGVMZWZ0XCIpO1xuXHRcdFx0c2VsZi5uYXZpZ2F0aW9uQ3VycmVudE1vbnRoLmNsYXNzTGlzdC5hZGQoXCJzbGlkZUxlZnROZXdcIik7XG5cdFx0fSBlbHNlIGlmIChkZWx0YSA8IDApIHtcblx0XHRcdHNlbGYuZGF5c0NvbnRhaW5lci5maXJzdENoaWxkLmNsYXNzTGlzdC5hZGQoXCJzbGlkZVJpZ2h0TmV3XCIpO1xuXHRcdFx0c2VsZi5kYXlzQ29udGFpbmVyLmxhc3RDaGlsZC5jbGFzc0xpc3QuYWRkKFwic2xpZGVSaWdodFwiKTtcblxuXHRcdFx0c2VsZi5vbGRDdXJNb250aC5jbGFzc0xpc3QuYWRkKFwic2xpZGVSaWdodFwiKTtcblx0XHRcdHNlbGYubmF2aWdhdGlvbkN1cnJlbnRNb250aC5jbGFzc0xpc3QuYWRkKFwic2xpZGVSaWdodE5ld1wiKTtcblx0XHR9XG5cblx0XHRzZWxmLmN1cnJlbnRNb250aEVsZW1lbnQgPSBzZWxmLm5hdmlnYXRpb25DdXJyZW50TW9udGguZmlyc3RDaGlsZDtcblx0XHRzZWxmLmN1cnJlbnRZZWFyRWxlbWVudCA9IHNlbGYubmF2aWdhdGlvbkN1cnJlbnRNb250aC5sYXN0Q2hpbGQuY2hpbGROb2Rlc1swXTtcblxuXHRcdHVwZGF0ZU5hdmlnYXRpb25DdXJyZW50TW9udGgoKTtcblx0XHRzZWxmLm9sZEN1ck1vbnRoLmZpcnN0Q2hpbGQudGV4dENvbnRlbnQgPSBzZWxmLnV0aWxzLm1vbnRoVG9TdHIoc2VsZi5jdXJyZW50TW9udGggLSBkZWx0YSk7XG5cblx0XHR0cmlnZ2VyRXZlbnQoXCJNb250aENoYW5nZVwiKTtcblxuXHRcdGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ICYmIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQuJGkpIHtcblx0XHRcdHZhciBpbmRleCA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQuJGk7XG5cdFx0XHRhZnRlckRheUFuaW0oZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRmb2N1c09uRGF5KGluZGV4LCAwKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIGNsZWFyKHRyaWdnZXJDaGFuZ2VFdmVudCkge1xuXHRcdHNlbGYuaW5wdXQudmFsdWUgPSBcIlwiO1xuXG5cdFx0aWYgKHNlbGYuYWx0SW5wdXQpIHNlbGYuYWx0SW5wdXQudmFsdWUgPSBcIlwiO1xuXG5cdFx0aWYgKHNlbGYubW9iaWxlSW5wdXQpIHNlbGYubW9iaWxlSW5wdXQudmFsdWUgPSBcIlwiO1xuXG5cdFx0c2VsZi5zZWxlY3RlZERhdGVzID0gW107XG5cdFx0c2VsZi5sYXRlc3RTZWxlY3RlZERhdGVPYmogPSB1bmRlZmluZWQ7XG5cdFx0c2VsZi5zaG93VGltZUlucHV0ID0gZmFsc2U7XG5cblx0XHRzZWxmLnJlZHJhdygpO1xuXG5cdFx0aWYgKHRyaWdnZXJDaGFuZ2VFdmVudCAhPT0gZmFsc2UpXG5cdFx0XHQvLyB0cmlnZ2VyQ2hhbmdlRXZlbnQgaXMgdHJ1ZSAoZGVmYXVsdCkgb3IgYW4gRXZlbnRcblx0XHRcdHRyaWdnZXJFdmVudChcIkNoYW5nZVwiKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGNsb3NlKCkge1xuXHRcdHNlbGYuaXNPcGVuID0gZmFsc2U7XG5cblx0XHRpZiAoIXNlbGYuaXNNb2JpbGUpIHtcblx0XHRcdHNlbGYuY2FsZW5kYXJDb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZShcIm9wZW5cIik7XG5cdFx0XHRzZWxmLl9pbnB1dC5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpO1xuXHRcdH1cblxuXHRcdHRyaWdnZXJFdmVudChcIkNsb3NlXCIpO1xuXHR9XG5cblx0ZnVuY3Rpb24gZGVzdHJveSgpIHtcblx0XHRpZiAoc2VsZi5jb25maWcgIT09IHVuZGVmaW5lZCkgdHJpZ2dlckV2ZW50KFwiRGVzdHJveVwiKTtcblxuXHRcdGZvciAodmFyIGkgPSBzZWxmLl9oYW5kbGVycy5sZW5ndGg7IGktLTspIHtcblx0XHRcdHZhciBoID0gc2VsZi5faGFuZGxlcnNbaV07XG5cdFx0XHRoLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihoLmV2ZW50LCBoLmhhbmRsZXIpO1xuXHRcdH1cblxuXHRcdHNlbGYuX2hhbmRsZXJzID0gW107XG5cblx0XHRpZiAoc2VsZi5tb2JpbGVJbnB1dCkge1xuXHRcdFx0aWYgKHNlbGYubW9iaWxlSW5wdXQucGFyZW50Tm9kZSkgc2VsZi5tb2JpbGVJbnB1dC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHNlbGYubW9iaWxlSW5wdXQpO1xuXHRcdFx0c2VsZi5tb2JpbGVJbnB1dCA9IG51bGw7XG5cdFx0fSBlbHNlIGlmIChzZWxmLmNhbGVuZGFyQ29udGFpbmVyICYmIHNlbGYuY2FsZW5kYXJDb250YWluZXIucGFyZW50Tm9kZSkgc2VsZi5jYWxlbmRhckNvbnRhaW5lci5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHNlbGYuY2FsZW5kYXJDb250YWluZXIpO1xuXG5cdFx0aWYgKHNlbGYuYWx0SW5wdXQpIHtcblx0XHRcdHNlbGYuaW5wdXQudHlwZSA9IFwidGV4dFwiO1xuXHRcdFx0aWYgKHNlbGYuYWx0SW5wdXQucGFyZW50Tm9kZSkgc2VsZi5hbHRJbnB1dC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHNlbGYuYWx0SW5wdXQpO1xuXHRcdFx0ZGVsZXRlIHNlbGYuYWx0SW5wdXQ7XG5cdFx0fVxuXG5cdFx0aWYgKHNlbGYuaW5wdXQpIHtcblx0XHRcdHNlbGYuaW5wdXQudHlwZSA9IHNlbGYuaW5wdXQuX3R5cGU7XG5cdFx0XHRzZWxmLmlucHV0LmNsYXNzTGlzdC5yZW1vdmUoXCJmbGF0cGlja3ItaW5wdXRcIik7XG5cdFx0XHRzZWxmLmlucHV0LnJlbW92ZUF0dHJpYnV0ZShcInJlYWRvbmx5XCIpO1xuXHRcdFx0c2VsZi5pbnB1dC52YWx1ZSA9IFwiXCI7XG5cdFx0fVxuXG5cdFx0W1wiX3Nob3dUaW1lSW5wdXRcIiwgXCJsYXRlc3RTZWxlY3RlZERhdGVPYmpcIiwgXCJfaGlkZU5leHRNb250aEFycm93XCIsIFwiX2hpZGVQcmV2TW9udGhBcnJvd1wiLCBcIl9faGlkZU5leHRNb250aEFycm93XCIsIFwiX19oaWRlUHJldk1vbnRoQXJyb3dcIiwgXCJpc01vYmlsZVwiLCBcImlzT3BlblwiLCBcInNlbGVjdGVkRGF0ZUVsZW1cIiwgXCJtaW5EYXRlSGFzVGltZVwiLCBcIm1heERhdGVIYXNUaW1lXCIsIFwiZGF5c1wiLCBcImRheXNDb250YWluZXJcIiwgXCJfaW5wdXRcIiwgXCJfcG9zaXRpb25FbGVtZW50XCIsIFwiaW5uZXJDb250YWluZXJcIiwgXCJyQ29udGFpbmVyXCIsIFwibW9udGhOYXZcIiwgXCJ0b2RheURhdGVFbGVtXCIsIFwiY2FsZW5kYXJDb250YWluZXJcIiwgXCJ3ZWVrZGF5Q29udGFpbmVyXCIsIFwicHJldk1vbnRoTmF2XCIsIFwibmV4dE1vbnRoTmF2XCIsIFwiY3VycmVudE1vbnRoRWxlbWVudFwiLCBcImN1cnJlbnRZZWFyRWxlbWVudFwiLCBcIm5hdmlnYXRpb25DdXJyZW50TW9udGhcIiwgXCJzZWxlY3RlZERhdGVFbGVtXCIsIFwiY29uZmlnXCJdLmZvckVhY2goZnVuY3Rpb24gKGspIHtcblx0XHRcdHRyeSB7XG5cdFx0XHRcdGRlbGV0ZSBzZWxmW2tdO1xuXHRcdFx0fSBjYXRjaCAoZSkge31cblx0XHR9KTtcblx0fVxuXG5cdGZ1bmN0aW9uIGlzQ2FsZW5kYXJFbGVtKGVsZW0pIHtcblx0XHRpZiAoc2VsZi5jb25maWcuYXBwZW5kVG8gJiYgc2VsZi5jb25maWcuYXBwZW5kVG8uY29udGFpbnMoZWxlbSkpIHJldHVybiB0cnVlO1xuXG5cdFx0cmV0dXJuIHNlbGYuY2FsZW5kYXJDb250YWluZXIuY29udGFpbnMoZWxlbSk7XG5cdH1cblxuXHRmdW5jdGlvbiBkb2N1bWVudENsaWNrKGUpIHtcblx0XHRpZiAoc2VsZi5pc09wZW4gJiYgIXNlbGYuY29uZmlnLmlubGluZSkge1xuXHRcdFx0dmFyIGlzQ2FsZW5kYXJFbGVtZW50ID0gaXNDYWxlbmRhckVsZW0oZS50YXJnZXQpO1xuXHRcdFx0dmFyIGlzSW5wdXQgPSBlLnRhcmdldCA9PT0gc2VsZi5pbnB1dCB8fCBlLnRhcmdldCA9PT0gc2VsZi5hbHRJbnB1dCB8fCBzZWxmLmVsZW1lbnQuY29udGFpbnMoZS50YXJnZXQpIHx8XG5cdFx0XHQvLyB3ZWIgY29tcG9uZW50c1xuXHRcdFx0ZS5wYXRoICYmIGUucGF0aC5pbmRleE9mICYmICh+ZS5wYXRoLmluZGV4T2Yoc2VsZi5pbnB1dCkgfHwgfmUucGF0aC5pbmRleE9mKHNlbGYuYWx0SW5wdXQpKTtcblxuXHRcdFx0dmFyIGxvc3RGb2N1cyA9IGUudHlwZSA9PT0gXCJibHVyXCIgPyBpc0lucHV0ICYmIGUucmVsYXRlZFRhcmdldCAmJiAhaXNDYWxlbmRhckVsZW0oZS5yZWxhdGVkVGFyZ2V0KSA6ICFpc0lucHV0ICYmICFpc0NhbGVuZGFyRWxlbWVudDtcblxuXHRcdFx0aWYgKGxvc3RGb2N1cyAmJiBzZWxmLmNvbmZpZy5pZ25vcmVkRm9jdXNFbGVtZW50cy5pbmRleE9mKGUudGFyZ2V0KSA9PT0gLTEpIHtcblx0XHRcdFx0c2VsZi5jbG9zZSgpO1xuXG5cdFx0XHRcdGlmIChzZWxmLmNvbmZpZy5tb2RlID09PSBcInJhbmdlXCIgJiYgc2VsZi5zZWxlY3RlZERhdGVzLmxlbmd0aCA9PT0gMSkge1xuXHRcdFx0XHRcdHNlbGYuY2xlYXIoZmFsc2UpO1xuXHRcdFx0XHRcdHNlbGYucmVkcmF3KCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBjaGFuZ2VZZWFyKG5ld1llYXIpIHtcblx0XHRpZiAoIW5ld1llYXIgfHwgc2VsZi5jdXJyZW50WWVhckVsZW1lbnQubWluICYmIG5ld1llYXIgPCBzZWxmLmN1cnJlbnRZZWFyRWxlbWVudC5taW4gfHwgc2VsZi5jdXJyZW50WWVhckVsZW1lbnQubWF4ICYmIG5ld1llYXIgPiBzZWxmLmN1cnJlbnRZZWFyRWxlbWVudC5tYXgpIHJldHVybjtcblxuXHRcdHZhciBuZXdZZWFyTnVtID0gcGFyc2VJbnQobmV3WWVhciwgMTApLFxuXHRcdCAgICBpc05ld1llYXIgPSBzZWxmLmN1cnJlbnRZZWFyICE9PSBuZXdZZWFyTnVtO1xuXG5cdFx0c2VsZi5jdXJyZW50WWVhciA9IG5ld1llYXJOdW0gfHwgc2VsZi5jdXJyZW50WWVhcjtcblxuXHRcdGlmIChzZWxmLmNvbmZpZy5tYXhEYXRlICYmIHNlbGYuY3VycmVudFllYXIgPT09IHNlbGYuY29uZmlnLm1heERhdGUuZ2V0RnVsbFllYXIoKSkge1xuXHRcdFx0c2VsZi5jdXJyZW50TW9udGggPSBNYXRoLm1pbihzZWxmLmNvbmZpZy5tYXhEYXRlLmdldE1vbnRoKCksIHNlbGYuY3VycmVudE1vbnRoKTtcblx0XHR9IGVsc2UgaWYgKHNlbGYuY29uZmlnLm1pbkRhdGUgJiYgc2VsZi5jdXJyZW50WWVhciA9PT0gc2VsZi5jb25maWcubWluRGF0ZS5nZXRGdWxsWWVhcigpKSB7XG5cdFx0XHRzZWxmLmN1cnJlbnRNb250aCA9IE1hdGgubWF4KHNlbGYuY29uZmlnLm1pbkRhdGUuZ2V0TW9udGgoKSwgc2VsZi5jdXJyZW50TW9udGgpO1xuXHRcdH1cblxuXHRcdGlmIChpc05ld1llYXIpIHtcblx0XHRcdHNlbGYucmVkcmF3KCk7XG5cdFx0XHR0cmlnZ2VyRXZlbnQoXCJZZWFyQ2hhbmdlXCIpO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIGlzRW5hYmxlZChkYXRlLCB0aW1lbGVzcykge1xuXHRcdGlmIChzZWxmLmNvbmZpZy5taW5EYXRlICYmIGNvbXBhcmVEYXRlcyhkYXRlLCBzZWxmLmNvbmZpZy5taW5EYXRlLCB0aW1lbGVzcyAhPT0gdW5kZWZpbmVkID8gdGltZWxlc3MgOiAhc2VsZi5taW5EYXRlSGFzVGltZSkgPCAwIHx8IHNlbGYuY29uZmlnLm1heERhdGUgJiYgY29tcGFyZURhdGVzKGRhdGUsIHNlbGYuY29uZmlnLm1heERhdGUsIHRpbWVsZXNzICE9PSB1bmRlZmluZWQgPyB0aW1lbGVzcyA6ICFzZWxmLm1heERhdGVIYXNUaW1lKSA+IDApIHJldHVybiBmYWxzZTtcblxuXHRcdGlmICghc2VsZi5jb25maWcuZW5hYmxlLmxlbmd0aCAmJiAhc2VsZi5jb25maWcuZGlzYWJsZS5sZW5ndGgpIHJldHVybiB0cnVlO1xuXG5cdFx0dmFyIGRhdGVUb0NoZWNrID0gc2VsZi5wYXJzZURhdGUoZGF0ZSwgbnVsbCwgdHJ1ZSk7IC8vIHRpbWVsZXNzXG5cblx0XHR2YXIgYm9vbCA9IHNlbGYuY29uZmlnLmVuYWJsZS5sZW5ndGggPiAwLFxuXHRcdCAgICBhcnJheSA9IGJvb2wgPyBzZWxmLmNvbmZpZy5lbmFibGUgOiBzZWxmLmNvbmZpZy5kaXNhYmxlO1xuXG5cdFx0Zm9yICh2YXIgaSA9IDAsIGQ7IGkgPCBhcnJheS5sZW5ndGg7IGkrKykge1xuXHRcdFx0ZCA9IGFycmF5W2ldO1xuXG5cdFx0XHRpZiAoZCBpbnN0YW5jZW9mIEZ1bmN0aW9uICYmIGQoZGF0ZVRvQ2hlY2spKSAvLyBkaXNhYmxlZCBieSBmdW5jdGlvblxuXHRcdFx0XHRyZXR1cm4gYm9vbDtlbHNlIGlmIChkIGluc3RhbmNlb2YgRGF0ZSAmJiBkLmdldFRpbWUoKSA9PT0gZGF0ZVRvQ2hlY2suZ2V0VGltZSgpKVxuXHRcdFx0XHQvLyBkaXNhYmxlZCBieSBkYXRlXG5cdFx0XHRcdHJldHVybiBib29sO2Vsc2UgaWYgKHR5cGVvZiBkID09PSBcInN0cmluZ1wiICYmIHNlbGYucGFyc2VEYXRlKGQsIG51bGwsIHRydWUpLmdldFRpbWUoKSA9PT0gZGF0ZVRvQ2hlY2suZ2V0VGltZSgpKVxuXHRcdFx0XHQvLyBkaXNhYmxlZCBieSBkYXRlIHN0cmluZ1xuXHRcdFx0XHRyZXR1cm4gYm9vbDtlbHNlIGlmICggLy8gZGlzYWJsZWQgYnkgcmFuZ2Vcblx0XHRcdCh0eXBlb2YgZCA9PT0gXCJ1bmRlZmluZWRcIiA/IFwidW5kZWZpbmVkXCIgOiBfdHlwZW9mKGQpKSA9PT0gXCJvYmplY3RcIiAmJiBkLmZyb20gJiYgZC50byAmJiBkYXRlVG9DaGVjayA+PSBkLmZyb20gJiYgZGF0ZVRvQ2hlY2sgPD0gZC50bykgcmV0dXJuIGJvb2w7XG5cdFx0fVxuXG5cdFx0cmV0dXJuICFib29sO1xuXHR9XG5cblx0ZnVuY3Rpb24gb25LZXlEb3duKGUpIHtcblx0XHR2YXIgaXNJbnB1dCA9IGUudGFyZ2V0ID09PSBzZWxmLl9pbnB1dDtcblx0XHR2YXIgY2FsZW5kYXJFbGVtID0gaXNDYWxlbmRhckVsZW0oZS50YXJnZXQpO1xuXHRcdHZhciBhbGxvd0lucHV0ID0gc2VsZi5jb25maWcuYWxsb3dJbnB1dDtcblx0XHR2YXIgYWxsb3dLZXlkb3duID0gc2VsZi5pc09wZW4gJiYgKCFhbGxvd0lucHV0IHx8ICFpc0lucHV0KTtcblx0XHR2YXIgYWxsb3dJbmxpbmVLZXlkb3duID0gc2VsZi5jb25maWcuaW5saW5lICYmIGlzSW5wdXQgJiYgIWFsbG93SW5wdXQ7XG5cblx0XHRpZiAoZS5rZXkgPT09IFwiRW50ZXJcIiAmJiBhbGxvd0lucHV0ICYmIGlzSW5wdXQpIHtcblx0XHRcdHNlbGYuc2V0RGF0ZShzZWxmLl9pbnB1dC52YWx1ZSwgdHJ1ZSwgZS50YXJnZXQgPT09IHNlbGYuYWx0SW5wdXQgPyBzZWxmLmNvbmZpZy5hbHRGb3JtYXQgOiBzZWxmLmNvbmZpZy5kYXRlRm9ybWF0KTtcblx0XHRcdHJldHVybiBlLnRhcmdldC5ibHVyKCk7XG5cdFx0fSBlbHNlIGlmIChjYWxlbmRhckVsZW0gfHwgYWxsb3dLZXlkb3duIHx8IGFsbG93SW5saW5lS2V5ZG93bikge1xuXHRcdFx0dmFyIGlzVGltZU9iaiA9IHNlbGYudGltZUNvbnRhaW5lciAmJiBzZWxmLnRpbWVDb250YWluZXIuY29udGFpbnMoZS50YXJnZXQpO1xuXHRcdFx0c3dpdGNoIChlLmtleSkge1xuXHRcdFx0XHRjYXNlIFwiRW50ZXJcIjpcblx0XHRcdFx0XHRpZiAoaXNUaW1lT2JqKSB1cGRhdGVWYWx1ZSgpO2Vsc2Ugc2VsZWN0RGF0ZShlKTtcblxuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdGNhc2UgXCJFc2NhcGVcIjpcblx0XHRcdFx0XHQvLyBlc2NhcGVcblx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0c2VsZi5jbG9zZSgpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdGNhc2UgXCJCYWNrc3BhY2VcIjpcblx0XHRcdFx0Y2FzZSBcIkRlbGV0ZVwiOlxuXHRcdFx0XHRcdGlmICghc2VsZi5jb25maWcuYWxsb3dJbnB1dCkgc2VsZi5jbGVhcigpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdGNhc2UgXCJBcnJvd0xlZnRcIjpcblx0XHRcdFx0Y2FzZSBcIkFycm93UmlnaHRcIjpcblx0XHRcdFx0XHRpZiAoIWlzVGltZU9iaikge1xuXHRcdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdFx0XHRpZiAoc2VsZi5kYXlzQ29udGFpbmVyKSB7XG5cdFx0XHRcdFx0XHRcdHZhciBfZGVsdGEgPSBlLmtleSA9PT0gXCJBcnJvd1JpZ2h0XCIgPyAxIDogLTE7XG5cblx0XHRcdFx0XHRcdFx0aWYgKCFlLmN0cmxLZXkpIGZvY3VzT25EYXkoZS50YXJnZXQuJGksIF9kZWx0YSk7ZWxzZSBjaGFuZ2VNb250aChfZGVsdGEsIHRydWUpO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChzZWxmLmNvbmZpZy5lbmFibGVUaW1lICYmICFpc1RpbWVPYmopIHNlbGYuaG91ckVsZW1lbnQuZm9jdXMoKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRjYXNlIFwiQXJyb3dVcFwiOlxuXHRcdFx0XHRjYXNlIFwiQXJyb3dEb3duXCI6XG5cdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdHZhciBkZWx0YSA9IGUua2V5ID09PSBcIkFycm93RG93blwiID8gMSA6IC0xO1xuXG5cdFx0XHRcdFx0aWYgKHNlbGYuZGF5c0NvbnRhaW5lcikge1xuXHRcdFx0XHRcdFx0aWYgKGUuY3RybEtleSkge1xuXHRcdFx0XHRcdFx0XHRjaGFuZ2VZZWFyKHNlbGYuY3VycmVudFllYXIgLSBkZWx0YSk7XG5cdFx0XHRcdFx0XHRcdGZvY3VzT25EYXkoZS50YXJnZXQuJGksIDApO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmICghaXNUaW1lT2JqKSBmb2N1c09uRGF5KGUudGFyZ2V0LiRpLCBkZWx0YSAqIDcpO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAoc2VsZi5jb25maWcuZW5hYmxlVGltZSkge1xuXHRcdFx0XHRcdFx0aWYgKCFpc1RpbWVPYmopIHNlbGYuaG91ckVsZW1lbnQuZm9jdXMoKTtcblx0XHRcdFx0XHRcdHVwZGF0ZVRpbWUoZSk7XG5cdFx0XHRcdFx0XHRzZWxmLmRlYm91bmNlZENoYW5nZSgpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdGNhc2UgXCJUYWJcIjpcblx0XHRcdFx0XHRpZiAoZS50YXJnZXQgPT09IHNlbGYuaG91ckVsZW1lbnQpIHtcblx0XHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRcdHNlbGYubWludXRlRWxlbWVudC5zZWxlY3QoKTtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKGUudGFyZ2V0ID09PSBzZWxmLm1pbnV0ZUVsZW1lbnQgJiYgKHNlbGYuc2Vjb25kRWxlbWVudCB8fCBzZWxmLmFtUE0pKSB7XG5cdFx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0XHQoc2VsZi5zZWNvbmRFbGVtZW50IHx8IHNlbGYuYW1QTSkuZm9jdXMoKTtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKGUudGFyZ2V0ID09PSBzZWxmLnNlY29uZEVsZW1lbnQpIHtcblx0XHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRcdHNlbGYuYW1QTS5mb2N1cygpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdGNhc2UgXCJhXCI6XG5cdFx0XHRcdFx0aWYgKGUudGFyZ2V0ID09PSBzZWxmLmFtUE0pIHtcblx0XHRcdFx0XHRcdHNlbGYuYW1QTS50ZXh0Q29udGVudCA9IFwiQU1cIjtcblx0XHRcdFx0XHRcdHNldEhvdXJzRnJvbUlucHV0cygpO1xuXHRcdFx0XHRcdFx0dXBkYXRlVmFsdWUoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0Y2FzZSBcInBcIjpcblx0XHRcdFx0XHRpZiAoZS50YXJnZXQgPT09IHNlbGYuYW1QTSkge1xuXHRcdFx0XHRcdFx0c2VsZi5hbVBNLnRleHRDb250ZW50ID0gXCJQTVwiO1xuXHRcdFx0XHRcdFx0c2V0SG91cnNGcm9tSW5wdXRzKCk7XG5cdFx0XHRcdFx0XHR1cGRhdGVWYWx1ZSgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHR9XG5cblx0XHRcdHRyaWdnZXJFdmVudChcIktleURvd25cIiwgZSk7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gb25Nb3VzZU92ZXIoZWxlbSkge1xuXHRcdGlmIChzZWxmLnNlbGVjdGVkRGF0ZXMubGVuZ3RoICE9PSAxIHx8ICFlbGVtLmNsYXNzTGlzdC5jb250YWlucyhcImZsYXRwaWNrci1kYXlcIikpIHJldHVybjtcblxuXHRcdHZhciBob3ZlckRhdGUgPSBlbGVtLmRhdGVPYmosXG5cdFx0ICAgIGluaXRpYWxEYXRlID0gc2VsZi5wYXJzZURhdGUoc2VsZi5zZWxlY3RlZERhdGVzWzBdLCBudWxsLCB0cnVlKSxcblx0XHQgICAgcmFuZ2VTdGFydERhdGUgPSBNYXRoLm1pbihob3ZlckRhdGUuZ2V0VGltZSgpLCBzZWxmLnNlbGVjdGVkRGF0ZXNbMF0uZ2V0VGltZSgpKSxcblx0XHQgICAgcmFuZ2VFbmREYXRlID0gTWF0aC5tYXgoaG92ZXJEYXRlLmdldFRpbWUoKSwgc2VsZi5zZWxlY3RlZERhdGVzWzBdLmdldFRpbWUoKSksXG5cdFx0ICAgIGNvbnRhaW5zRGlzYWJsZWQgPSBmYWxzZTtcblxuXHRcdGZvciAodmFyIHQgPSByYW5nZVN0YXJ0RGF0ZTsgdCA8IHJhbmdlRW5kRGF0ZTsgdCArPSBzZWxmLnV0aWxzLmR1cmF0aW9uLkRBWSkge1xuXHRcdFx0aWYgKCFpc0VuYWJsZWQobmV3IERhdGUodCkpKSB7XG5cdFx0XHRcdGNvbnRhaW5zRGlzYWJsZWQgPSB0cnVlO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cblx0XHR2YXIgX2xvb3AgPSBmdW5jdGlvbiBfbG9vcCh0aW1lc3RhbXAsIGkpIHtcblx0XHRcdHZhciBvdXRPZlJhbmdlID0gdGltZXN0YW1wIDwgc2VsZi5taW5SYW5nZURhdGUuZ2V0VGltZSgpIHx8IHRpbWVzdGFtcCA+IHNlbGYubWF4UmFuZ2VEYXRlLmdldFRpbWUoKSxcblx0XHRcdCAgICBkYXlFbGVtID0gc2VsZi5kYXlzLmNoaWxkTm9kZXNbaV07XG5cblx0XHRcdGlmIChvdXRPZlJhbmdlKSB7XG5cdFx0XHRcdHNlbGYuZGF5cy5jaGlsZE5vZGVzW2ldLmNsYXNzTGlzdC5hZGQoXCJub3RBbGxvd2VkXCIpO1xuXHRcdFx0XHRbXCJpblJhbmdlXCIsIFwic3RhcnRSYW5nZVwiLCBcImVuZFJhbmdlXCJdLmZvckVhY2goZnVuY3Rpb24gKGMpIHtcblx0XHRcdFx0XHRkYXlFbGVtLmNsYXNzTGlzdC5yZW1vdmUoYyk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRyZXR1cm4gXCJjb250aW51ZVwiO1xuXHRcdFx0fSBlbHNlIGlmIChjb250YWluc0Rpc2FibGVkICYmICFvdXRPZlJhbmdlKSByZXR1cm4gXCJjb250aW51ZVwiO1xuXG5cdFx0XHRbXCJzdGFydFJhbmdlXCIsIFwiaW5SYW5nZVwiLCBcImVuZFJhbmdlXCIsIFwibm90QWxsb3dlZFwiXS5mb3JFYWNoKGZ1bmN0aW9uIChjKSB7XG5cdFx0XHRcdGRheUVsZW0uY2xhc3NMaXN0LnJlbW92ZShjKTtcblx0XHRcdH0pO1xuXG5cdFx0XHR2YXIgbWluUmFuZ2VEYXRlID0gTWF0aC5tYXgoc2VsZi5taW5SYW5nZURhdGUuZ2V0VGltZSgpLCByYW5nZVN0YXJ0RGF0ZSksXG5cdFx0XHQgICAgbWF4UmFuZ2VEYXRlID0gTWF0aC5taW4oc2VsZi5tYXhSYW5nZURhdGUuZ2V0VGltZSgpLCByYW5nZUVuZERhdGUpO1xuXG5cdFx0XHRlbGVtLmNsYXNzTGlzdC5hZGQoaG92ZXJEYXRlIDwgc2VsZi5zZWxlY3RlZERhdGVzWzBdID8gXCJzdGFydFJhbmdlXCIgOiBcImVuZFJhbmdlXCIpO1xuXG5cdFx0XHRpZiAoaW5pdGlhbERhdGUgPCBob3ZlckRhdGUgJiYgdGltZXN0YW1wID09PSBpbml0aWFsRGF0ZS5nZXRUaW1lKCkpIGRheUVsZW0uY2xhc3NMaXN0LmFkZChcInN0YXJ0UmFuZ2VcIik7ZWxzZSBpZiAoaW5pdGlhbERhdGUgPiBob3ZlckRhdGUgJiYgdGltZXN0YW1wID09PSBpbml0aWFsRGF0ZS5nZXRUaW1lKCkpIGRheUVsZW0uY2xhc3NMaXN0LmFkZChcImVuZFJhbmdlXCIpO1xuXG5cdFx0XHRpZiAodGltZXN0YW1wID49IG1pblJhbmdlRGF0ZSAmJiB0aW1lc3RhbXAgPD0gbWF4UmFuZ2VEYXRlKSBkYXlFbGVtLmNsYXNzTGlzdC5hZGQoXCJpblJhbmdlXCIpO1xuXHRcdH07XG5cblx0XHRmb3IgKHZhciB0aW1lc3RhbXAgPSBzZWxmLmRheXMuY2hpbGROb2Rlc1swXS5kYXRlT2JqLmdldFRpbWUoKSwgaSA9IDA7IGkgPCA0MjsgaSsrLCB0aW1lc3RhbXAgKz0gc2VsZi51dGlscy5kdXJhdGlvbi5EQVkpIHtcblx0XHRcdHZhciBfcmV0ID0gX2xvb3AodGltZXN0YW1wLCBpKTtcblxuXHRcdFx0aWYgKF9yZXQgPT09IFwiY29udGludWVcIikgY29udGludWU7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gb25SZXNpemUoKSB7XG5cdFx0aWYgKHNlbGYuaXNPcGVuICYmICFzZWxmLmNvbmZpZy5zdGF0aWMgJiYgIXNlbGYuY29uZmlnLmlubGluZSkgcG9zaXRpb25DYWxlbmRhcigpO1xuXHR9XG5cblx0ZnVuY3Rpb24gb3BlbihlLCBwb3NpdGlvbkVsZW1lbnQpIHtcblx0XHRpZiAoc2VsZi5pc01vYmlsZSkge1xuXHRcdFx0aWYgKGUpIHtcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRlLnRhcmdldC5ibHVyKCk7XG5cdFx0XHR9XG5cblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRzZWxmLm1vYmlsZUlucHV0LmNsaWNrKCk7XG5cdFx0XHR9LCAwKTtcblxuXHRcdFx0dHJpZ2dlckV2ZW50KFwiT3BlblwiKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpZiAoc2VsZi5pc09wZW4gfHwgc2VsZi5faW5wdXQuZGlzYWJsZWQgfHwgc2VsZi5jb25maWcuaW5saW5lKSByZXR1cm47XG5cblx0XHRzZWxmLmlzT3BlbiA9IHRydWU7XG5cdFx0c2VsZi5jYWxlbmRhckNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwib3BlblwiKTtcblx0XHRwb3NpdGlvbkNhbGVuZGFyKHBvc2l0aW9uRWxlbWVudCk7XG5cdFx0c2VsZi5faW5wdXQuY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKTtcblxuXHRcdHRyaWdnZXJFdmVudChcIk9wZW5cIik7XG5cdH1cblxuXHRmdW5jdGlvbiBtaW5NYXhEYXRlU2V0dGVyKHR5cGUpIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24gKGRhdGUpIHtcblx0XHRcdHZhciBkYXRlT2JqID0gc2VsZi5jb25maWdbXCJfXCIgKyB0eXBlICsgXCJEYXRlXCJdID0gc2VsZi5wYXJzZURhdGUoZGF0ZSk7XG5cblx0XHRcdHZhciBpbnZlcnNlRGF0ZU9iaiA9IHNlbGYuY29uZmlnW1wiX1wiICsgKHR5cGUgPT09IFwibWluXCIgPyBcIm1heFwiIDogXCJtaW5cIikgKyBcIkRhdGVcIl07XG5cdFx0XHR2YXIgaXNWYWxpZERhdGUgPSBkYXRlICYmIGRhdGVPYmogaW5zdGFuY2VvZiBEYXRlO1xuXG5cdFx0XHRpZiAoaXNWYWxpZERhdGUpIHtcblx0XHRcdFx0c2VsZlt0eXBlICsgXCJEYXRlSGFzVGltZVwiXSA9IGRhdGVPYmouZ2V0SG91cnMoKSB8fCBkYXRlT2JqLmdldE1pbnV0ZXMoKSB8fCBkYXRlT2JqLmdldFNlY29uZHMoKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHNlbGYuc2VsZWN0ZWREYXRlcykge1xuXHRcdFx0XHRzZWxmLnNlbGVjdGVkRGF0ZXMgPSBzZWxmLnNlbGVjdGVkRGF0ZXMuZmlsdGVyKGZ1bmN0aW9uIChkKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGlzRW5hYmxlZChkKTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdGlmICghc2VsZi5zZWxlY3RlZERhdGVzLmxlbmd0aCAmJiB0eXBlID09PSBcIm1pblwiKSBzZXRIb3Vyc0Zyb21EYXRlKGRhdGVPYmopO1xuXHRcdFx0XHR1cGRhdGVWYWx1ZSgpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoc2VsZi5kYXlzQ29udGFpbmVyKSB7XG5cdFx0XHRcdHJlZHJhdygpO1xuXG5cdFx0XHRcdGlmIChpc1ZhbGlkRGF0ZSkgc2VsZi5jdXJyZW50WWVhckVsZW1lbnRbdHlwZV0gPSBkYXRlT2JqLmdldEZ1bGxZZWFyKCk7ZWxzZSBzZWxmLmN1cnJlbnRZZWFyRWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUodHlwZSk7XG5cblx0XHRcdFx0c2VsZi5jdXJyZW50WWVhckVsZW1lbnQuZGlzYWJsZWQgPSBpbnZlcnNlRGF0ZU9iaiAmJiBkYXRlT2JqICYmIGludmVyc2VEYXRlT2JqLmdldEZ1bGxZZWFyKCkgPT09IGRhdGVPYmouZ2V0RnVsbFllYXIoKTtcblx0XHRcdH1cblx0XHR9O1xuXHR9XG5cblx0ZnVuY3Rpb24gcGFyc2VDb25maWcoKSB7XG5cdFx0dmFyIGJvb2xPcHRzID0gW1wid3JhcFwiLCBcIndlZWtOdW1iZXJzXCIsIFwiYWxsb3dJbnB1dFwiLCBcImNsaWNrT3BlbnNcIiwgXCJ0aW1lXzI0aHJcIiwgXCJlbmFibGVUaW1lXCIsIFwibm9DYWxlbmRhclwiLCBcImFsdElucHV0XCIsIFwic2hvcnRoYW5kQ3VycmVudE1vbnRoXCIsIFwiaW5saW5lXCIsIFwic3RhdGljXCIsIFwiZW5hYmxlU2Vjb25kc1wiLCBcImRpc2FibGVNb2JpbGVcIl07XG5cblx0XHR2YXIgaG9va3MgPSBbXCJvbkNoYW5nZVwiLCBcIm9uQ2xvc2VcIiwgXCJvbkRheUNyZWF0ZVwiLCBcIm9uRGVzdHJveVwiLCBcIm9uS2V5RG93blwiLCBcIm9uTW9udGhDaGFuZ2VcIiwgXCJvbk9wZW5cIiwgXCJvblBhcnNlQ29uZmlnXCIsIFwib25SZWFkeVwiLCBcIm9uVmFsdWVVcGRhdGVcIiwgXCJvblllYXJDaGFuZ2VcIl07XG5cblx0XHRzZWxmLmNvbmZpZyA9IE9iamVjdC5jcmVhdGUoZmxhdHBpY2tyLmRlZmF1bHRDb25maWcpO1xuXG5cdFx0dmFyIHVzZXJDb25maWcgPSBfZXh0ZW5kcyh7fSwgc2VsZi5pbnN0YW5jZUNvbmZpZywgSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShzZWxmLmVsZW1lbnQuZGF0YXNldCB8fCB7fSkpKTtcblxuXHRcdHNlbGYuY29uZmlnLnBhcnNlRGF0ZSA9IHVzZXJDb25maWcucGFyc2VEYXRlO1xuXHRcdHNlbGYuY29uZmlnLmZvcm1hdERhdGUgPSB1c2VyQ29uZmlnLmZvcm1hdERhdGU7XG5cblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoc2VsZi5jb25maWcsIFwiZW5hYmxlXCIsIHtcblx0XHRcdGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHRcdFx0XHRyZXR1cm4gc2VsZi5jb25maWcuX2VuYWJsZSB8fCBbXTtcblx0XHRcdH0sXG5cdFx0XHRzZXQ6IGZ1bmN0aW9uIHNldChkYXRlcykge1xuXHRcdFx0XHRyZXR1cm4gc2VsZi5jb25maWcuX2VuYWJsZSA9IHBhcnNlRGF0ZVJ1bGVzKGRhdGVzKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShzZWxmLmNvbmZpZywgXCJkaXNhYmxlXCIsIHtcblx0XHRcdGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHRcdFx0XHRyZXR1cm4gc2VsZi5jb25maWcuX2Rpc2FibGUgfHwgW107XG5cdFx0XHR9LFxuXHRcdFx0c2V0OiBmdW5jdGlvbiBzZXQoZGF0ZXMpIHtcblx0XHRcdFx0cmV0dXJuIHNlbGYuY29uZmlnLl9kaXNhYmxlID0gcGFyc2VEYXRlUnVsZXMoZGF0ZXMpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0X2V4dGVuZHMoc2VsZi5jb25maWcsIHVzZXJDb25maWcpO1xuXG5cdFx0aWYgKCF1c2VyQ29uZmlnLmRhdGVGb3JtYXQgJiYgdXNlckNvbmZpZy5lbmFibGVUaW1lKSB7XG5cdFx0XHRzZWxmLmNvbmZpZy5kYXRlRm9ybWF0ID0gc2VsZi5jb25maWcubm9DYWxlbmRhciA/IFwiSDppXCIgKyAoc2VsZi5jb25maWcuZW5hYmxlU2Vjb25kcyA/IFwiOlNcIiA6IFwiXCIpIDogZmxhdHBpY2tyLmRlZmF1bHRDb25maWcuZGF0ZUZvcm1hdCArIFwiIEg6aVwiICsgKHNlbGYuY29uZmlnLmVuYWJsZVNlY29uZHMgPyBcIjpTXCIgOiBcIlwiKTtcblx0XHR9XG5cblx0XHRpZiAodXNlckNvbmZpZy5hbHRJbnB1dCAmJiB1c2VyQ29uZmlnLmVuYWJsZVRpbWUgJiYgIXVzZXJDb25maWcuYWx0Rm9ybWF0KSB7XG5cdFx0XHRzZWxmLmNvbmZpZy5hbHRGb3JtYXQgPSBzZWxmLmNvbmZpZy5ub0NhbGVuZGFyID8gXCJoOmlcIiArIChzZWxmLmNvbmZpZy5lbmFibGVTZWNvbmRzID8gXCI6UyBLXCIgOiBcIiBLXCIpIDogZmxhdHBpY2tyLmRlZmF1bHRDb25maWcuYWx0Rm9ybWF0ICsgKFwiIGg6aVwiICsgKHNlbGYuY29uZmlnLmVuYWJsZVNlY29uZHMgPyBcIjpTXCIgOiBcIlwiKSArIFwiIEtcIik7XG5cdFx0fVxuXG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KHNlbGYuY29uZmlnLCBcIm1pbkRhdGVcIiwge1xuXHRcdFx0Z2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLl9taW5EYXRlO1xuXHRcdFx0fSxcblx0XHRcdHNldDogbWluTWF4RGF0ZVNldHRlcihcIm1pblwiKVxuXHRcdH0pO1xuXG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KHNlbGYuY29uZmlnLCBcIm1heERhdGVcIiwge1xuXHRcdFx0Z2V0OiBmdW5jdGlvbiBnZXQoKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLl9tYXhEYXRlO1xuXHRcdFx0fSxcblx0XHRcdHNldDogbWluTWF4RGF0ZVNldHRlcihcIm1heFwiKVxuXHRcdH0pO1xuXG5cdFx0c2VsZi5jb25maWcubWluRGF0ZSA9IHVzZXJDb25maWcubWluRGF0ZTtcblx0XHRzZWxmLmNvbmZpZy5tYXhEYXRlID0gdXNlckNvbmZpZy5tYXhEYXRlO1xuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBib29sT3B0cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0c2VsZi5jb25maWdbYm9vbE9wdHNbaV1dID0gc2VsZi5jb25maWdbYm9vbE9wdHNbaV1dID09PSB0cnVlIHx8IHNlbGYuY29uZmlnW2Jvb2xPcHRzW2ldXSA9PT0gXCJ0cnVlXCI7XG5cdFx0fWZvciAodmFyIF9pID0gaG9va3MubGVuZ3RoOyBfaS0tOykge1xuXHRcdFx0aWYgKHNlbGYuY29uZmlnW2hvb2tzW19pXV0gIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRzZWxmLmNvbmZpZ1tob29rc1tfaV1dID0gYXJyYXlpZnkoc2VsZi5jb25maWdbaG9va3NbX2ldXSB8fCBbXSkubWFwKGJpbmRUb0luc3RhbmNlKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRmb3IgKHZhciBfaTIgPSAwOyBfaTIgPCBzZWxmLmNvbmZpZy5wbHVnaW5zLmxlbmd0aDsgX2kyKyspIHtcblx0XHRcdHZhciBwbHVnaW5Db25mID0gc2VsZi5jb25maWcucGx1Z2luc1tfaTJdKHNlbGYpIHx8IHt9O1xuXHRcdFx0Zm9yICh2YXIga2V5IGluIHBsdWdpbkNvbmYpIHtcblxuXHRcdFx0XHRpZiAoc2VsZi5jb25maWdba2V5XSBpbnN0YW5jZW9mIEFycmF5IHx8IH5ob29rcy5pbmRleE9mKGtleSkpIHtcblx0XHRcdFx0XHRzZWxmLmNvbmZpZ1trZXldID0gYXJyYXlpZnkocGx1Z2luQ29uZltrZXldKS5tYXAoYmluZFRvSW5zdGFuY2UpLmNvbmNhdChzZWxmLmNvbmZpZ1trZXldKTtcblx0XHRcdFx0fSBlbHNlIGlmICh0eXBlb2YgdXNlckNvbmZpZ1trZXldID09PSBcInVuZGVmaW5lZFwiKSBzZWxmLmNvbmZpZ1trZXldID0gcGx1Z2luQ29uZltrZXldO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHRyaWdnZXJFdmVudChcIlBhcnNlQ29uZmlnXCIpO1xuXHR9XG5cblx0ZnVuY3Rpb24gc2V0dXBMb2NhbGUoKSB7XG5cdFx0aWYgKF90eXBlb2Yoc2VsZi5jb25maWcubG9jYWxlKSAhPT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgZmxhdHBpY2tyLmwxMG5zW3NlbGYuY29uZmlnLmxvY2FsZV0gPT09IFwidW5kZWZpbmVkXCIpIGNvbnNvbGUud2FybihcImZsYXRwaWNrcjogaW52YWxpZCBsb2NhbGUgXCIgKyBzZWxmLmNvbmZpZy5sb2NhbGUpO1xuXG5cdFx0c2VsZi5sMTBuID0gX2V4dGVuZHMoT2JqZWN0LmNyZWF0ZShmbGF0cGlja3IubDEwbnMuZGVmYXVsdCksIF90eXBlb2Yoc2VsZi5jb25maWcubG9jYWxlKSA9PT0gXCJvYmplY3RcIiA/IHNlbGYuY29uZmlnLmxvY2FsZSA6IHNlbGYuY29uZmlnLmxvY2FsZSAhPT0gXCJkZWZhdWx0XCIgPyBmbGF0cGlja3IubDEwbnNbc2VsZi5jb25maWcubG9jYWxlXSB8fCB7fSA6IHt9KTtcblx0fVxuXG5cdGZ1bmN0aW9uIHBvc2l0aW9uQ2FsZW5kYXIoKSB7XG5cdFx0dmFyIHBvc2l0aW9uRWxlbWVudCA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogc2VsZi5fcG9zaXRpb25FbGVtZW50O1xuXG5cdFx0aWYgKHNlbGYuY2FsZW5kYXJDb250YWluZXIgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xuXG5cdFx0dmFyIGNhbGVuZGFySGVpZ2h0ID0gc2VsZi5jYWxlbmRhckNvbnRhaW5lci5vZmZzZXRIZWlnaHQsXG5cdFx0ICAgIGNhbGVuZGFyV2lkdGggPSBzZWxmLmNhbGVuZGFyQ29udGFpbmVyLm9mZnNldFdpZHRoLFxuXHRcdCAgICBjb25maWdQb3MgPSBzZWxmLmNvbmZpZy5wb3NpdGlvbixcblx0XHQgICAgaW5wdXRCb3VuZHMgPSBwb3NpdGlvbkVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksXG5cdFx0ICAgIGRpc3RhbmNlRnJvbUJvdHRvbSA9IHdpbmRvdy5pbm5lckhlaWdodCAtIGlucHV0Qm91bmRzLmJvdHRvbSxcblx0XHQgICAgc2hvd09uVG9wID0gY29uZmlnUG9zID09PSBcImFib3ZlXCIgfHwgY29uZmlnUG9zICE9PSBcImJlbG93XCIgJiYgZGlzdGFuY2VGcm9tQm90dG9tIDwgY2FsZW5kYXJIZWlnaHQgJiYgaW5wdXRCb3VuZHMudG9wID4gY2FsZW5kYXJIZWlnaHQ7XG5cblx0XHR2YXIgdG9wID0gd2luZG93LnBhZ2VZT2Zmc2V0ICsgaW5wdXRCb3VuZHMudG9wICsgKCFzaG93T25Ub3AgPyBwb3NpdGlvbkVsZW1lbnQub2Zmc2V0SGVpZ2h0ICsgMiA6IC1jYWxlbmRhckhlaWdodCAtIDIpO1xuXG5cdFx0dG9nZ2xlQ2xhc3Moc2VsZi5jYWxlbmRhckNvbnRhaW5lciwgXCJhcnJvd1RvcFwiLCAhc2hvd09uVG9wKTtcblx0XHR0b2dnbGVDbGFzcyhzZWxmLmNhbGVuZGFyQ29udGFpbmVyLCBcImFycm93Qm90dG9tXCIsIHNob3dPblRvcCk7XG5cblx0XHRpZiAoc2VsZi5jb25maWcuaW5saW5lKSByZXR1cm47XG5cblx0XHR2YXIgbGVmdCA9IHdpbmRvdy5wYWdlWE9mZnNldCArIGlucHV0Qm91bmRzLmxlZnQ7XG5cdFx0dmFyIHJpZ2h0ID0gd2luZG93LmRvY3VtZW50LmJvZHkub2Zmc2V0V2lkdGggLSBpbnB1dEJvdW5kcy5yaWdodDtcblx0XHR2YXIgcmlnaHRNb3N0ID0gbGVmdCArIGNhbGVuZGFyV2lkdGggPiB3aW5kb3cuZG9jdW1lbnQuYm9keS5vZmZzZXRXaWR0aDtcblxuXHRcdHRvZ2dsZUNsYXNzKHNlbGYuY2FsZW5kYXJDb250YWluZXIsIFwicmlnaHRNb3N0XCIsIHJpZ2h0TW9zdCk7XG5cblx0XHRpZiAoc2VsZi5jb25maWcuc3RhdGljKSByZXR1cm47XG5cblx0XHRzZWxmLmNhbGVuZGFyQ29udGFpbmVyLnN0eWxlLnRvcCA9IHRvcCArIFwicHhcIjtcblxuXHRcdGlmICghcmlnaHRNb3N0KSB7XG5cdFx0XHRzZWxmLmNhbGVuZGFyQ29udGFpbmVyLnN0eWxlLmxlZnQgPSBsZWZ0ICsgXCJweFwiO1xuXHRcdFx0c2VsZi5jYWxlbmRhckNvbnRhaW5lci5zdHlsZS5yaWdodCA9IFwiYXV0b1wiO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRzZWxmLmNhbGVuZGFyQ29udGFpbmVyLnN0eWxlLmxlZnQgPSBcImF1dG9cIjtcblx0XHRcdHNlbGYuY2FsZW5kYXJDb250YWluZXIuc3R5bGUucmlnaHQgPSByaWdodCArIFwicHhcIjtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiByZWRyYXcoKSB7XG5cdFx0aWYgKHNlbGYuY29uZmlnLm5vQ2FsZW5kYXIgfHwgc2VsZi5pc01vYmlsZSkgcmV0dXJuO1xuXG5cdFx0YnVpbGRXZWVrZGF5cygpO1xuXHRcdHVwZGF0ZU5hdmlnYXRpb25DdXJyZW50TW9udGgoKTtcblx0XHRidWlsZERheXMoKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHNlbGVjdERhdGUoZSkge1xuXHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXG5cdFx0aWYgKCFlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoXCJmbGF0cGlja3ItZGF5XCIpIHx8IGUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhcImRpc2FibGVkXCIpIHx8IGUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhcIm5vdEFsbG93ZWRcIikpIHJldHVybjtcblxuXHRcdHZhciBzZWxlY3RlZERhdGUgPSBzZWxmLmxhdGVzdFNlbGVjdGVkRGF0ZU9iaiA9IG5ldyBEYXRlKGUudGFyZ2V0LmRhdGVPYmouZ2V0VGltZSgpKTtcblxuXHRcdHZhciBzaG91bGRDaGFuZ2VNb250aCA9IHNlbGVjdGVkRGF0ZS5nZXRNb250aCgpICE9PSBzZWxmLmN1cnJlbnRNb250aCAmJiBzZWxmLmNvbmZpZy5tb2RlICE9PSBcInJhbmdlXCI7XG5cblx0XHRzZWxmLnNlbGVjdGVkRGF0ZUVsZW0gPSBlLnRhcmdldDtcblxuXHRcdGlmIChzZWxmLmNvbmZpZy5tb2RlID09PSBcInNpbmdsZVwiKSBzZWxmLnNlbGVjdGVkRGF0ZXMgPSBbc2VsZWN0ZWREYXRlXTtlbHNlIGlmIChzZWxmLmNvbmZpZy5tb2RlID09PSBcIm11bHRpcGxlXCIpIHtcblx0XHRcdHZhciBzZWxlY3RlZEluZGV4ID0gaXNEYXRlU2VsZWN0ZWQoc2VsZWN0ZWREYXRlKTtcblx0XHRcdGlmIChzZWxlY3RlZEluZGV4KSBzZWxmLnNlbGVjdGVkRGF0ZXMuc3BsaWNlKHNlbGVjdGVkSW5kZXgsIDEpO2Vsc2Ugc2VsZi5zZWxlY3RlZERhdGVzLnB1c2goc2VsZWN0ZWREYXRlKTtcblx0XHR9IGVsc2UgaWYgKHNlbGYuY29uZmlnLm1vZGUgPT09IFwicmFuZ2VcIikge1xuXHRcdFx0aWYgKHNlbGYuc2VsZWN0ZWREYXRlcy5sZW5ndGggPT09IDIpIHNlbGYuY2xlYXIoKTtcblxuXHRcdFx0c2VsZi5zZWxlY3RlZERhdGVzLnB1c2goc2VsZWN0ZWREYXRlKTtcblxuXHRcdFx0Ly8gdW5sZXNzIHNlbGVjdGluZyBzYW1lIGRhdGUgdHdpY2UsIHNvcnQgYXNjZW5kaW5nbHlcblx0XHRcdGlmIChjb21wYXJlRGF0ZXMoc2VsZWN0ZWREYXRlLCBzZWxmLnNlbGVjdGVkRGF0ZXNbMF0sIHRydWUpICE9PSAwKSBzZWxmLnNlbGVjdGVkRGF0ZXMuc29ydChmdW5jdGlvbiAoYSwgYikge1xuXHRcdFx0XHRyZXR1cm4gYS5nZXRUaW1lKCkgLSBiLmdldFRpbWUoKTtcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdHNldEhvdXJzRnJvbUlucHV0cygpO1xuXG5cdFx0aWYgKHNob3VsZENoYW5nZU1vbnRoKSB7XG5cdFx0XHR2YXIgaXNOZXdZZWFyID0gc2VsZi5jdXJyZW50WWVhciAhPT0gc2VsZWN0ZWREYXRlLmdldEZ1bGxZZWFyKCk7XG5cdFx0XHRzZWxmLmN1cnJlbnRZZWFyID0gc2VsZWN0ZWREYXRlLmdldEZ1bGxZZWFyKCk7XG5cdFx0XHRzZWxmLmN1cnJlbnRNb250aCA9IHNlbGVjdGVkRGF0ZS5nZXRNb250aCgpO1xuXG5cdFx0XHRpZiAoaXNOZXdZZWFyKSB0cmlnZ2VyRXZlbnQoXCJZZWFyQ2hhbmdlXCIpO1xuXG5cdFx0XHR0cmlnZ2VyRXZlbnQoXCJNb250aENoYW5nZVwiKTtcblx0XHR9XG5cblx0XHRidWlsZERheXMoKTtcblxuXHRcdGlmIChzZWxmLm1pbkRhdGVIYXNUaW1lICYmIHNlbGYuY29uZmlnLmVuYWJsZVRpbWUgJiYgY29tcGFyZURhdGVzKHNlbGVjdGVkRGF0ZSwgc2VsZi5jb25maWcubWluRGF0ZSkgPT09IDApIHNldEhvdXJzRnJvbURhdGUoc2VsZi5jb25maWcubWluRGF0ZSk7XG5cblx0XHR1cGRhdGVWYWx1ZSgpO1xuXG5cdFx0aWYgKHNlbGYuY29uZmlnLmVuYWJsZVRpbWUpIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIHNlbGYuc2hvd1RpbWVJbnB1dCA9IHRydWU7XG5cdFx0fSwgNTApO1xuXG5cdFx0aWYgKHNlbGYuY29uZmlnLm1vZGUgPT09IFwicmFuZ2VcIikge1xuXHRcdFx0aWYgKHNlbGYuc2VsZWN0ZWREYXRlcy5sZW5ndGggPT09IDEpIHtcblx0XHRcdFx0b25Nb3VzZU92ZXIoZS50YXJnZXQpO1xuXG5cdFx0XHRcdHNlbGYuX2hpZGVQcmV2TW9udGhBcnJvdyA9IHNlbGYuX2hpZGVQcmV2TW9udGhBcnJvdyB8fCBzZWxmLm1pblJhbmdlRGF0ZSA+IHNlbGYuZGF5cy5jaGlsZE5vZGVzWzBdLmRhdGVPYmo7XG5cblx0XHRcdFx0c2VsZi5faGlkZU5leHRNb250aEFycm93ID0gc2VsZi5faGlkZU5leHRNb250aEFycm93IHx8IHNlbGYubWF4UmFuZ2VEYXRlIDwgbmV3IERhdGUoc2VsZi5jdXJyZW50WWVhciwgc2VsZi5jdXJyZW50TW9udGggKyAxLCAxKTtcblx0XHRcdH0gZWxzZSB1cGRhdGVOYXZpZ2F0aW9uQ3VycmVudE1vbnRoKCk7XG5cdFx0fVxuXG5cdFx0dHJpZ2dlckV2ZW50KFwiQ2hhbmdlXCIpO1xuXG5cdFx0Ly8gbWFpbnRhaW4gZm9jdXNcblx0XHRpZiAoIXNob3VsZENoYW5nZU1vbnRoKSBmb2N1c09uRGF5KGUudGFyZ2V0LiRpLCAwKTtlbHNlIGFmdGVyRGF5QW5pbShmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4gc2VsZi5zZWxlY3RlZERhdGVFbGVtICYmIHNlbGYuc2VsZWN0ZWREYXRlRWxlbS5mb2N1cygpO1xuXHRcdH0pO1xuXG5cdFx0aWYgKHNlbGYuY29uZmlnLmVuYWJsZVRpbWUpIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIHNlbGYuaG91ckVsZW1lbnQuc2VsZWN0KCk7XG5cdFx0fSwgNDUxKTtcblxuXHRcdGlmIChzZWxmLmNvbmZpZy5jbG9zZU9uU2VsZWN0KSB7XG5cdFx0XHR2YXIgc2luZ2xlID0gc2VsZi5jb25maWcubW9kZSA9PT0gXCJzaW5nbGVcIiAmJiAhc2VsZi5jb25maWcuZW5hYmxlVGltZTtcblx0XHRcdHZhciByYW5nZSA9IHNlbGYuY29uZmlnLm1vZGUgPT09IFwicmFuZ2VcIiAmJiBzZWxmLnNlbGVjdGVkRGF0ZXMubGVuZ3RoID09PSAyICYmICFzZWxmLmNvbmZpZy5lbmFibGVUaW1lO1xuXG5cdFx0XHRpZiAoc2luZ2xlIHx8IHJhbmdlKSBzZWxmLmNsb3NlKCk7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gc2V0KG9wdGlvbiwgdmFsdWUpIHtcblx0XHRpZiAob3B0aW9uICE9PSBudWxsICYmICh0eXBlb2Ygb3B0aW9uID09PSBcInVuZGVmaW5lZFwiID8gXCJ1bmRlZmluZWRcIiA6IF90eXBlb2Yob3B0aW9uKSkgPT09IFwib2JqZWN0XCIpIF9leHRlbmRzKHNlbGYuY29uZmlnLCBvcHRpb24pO2Vsc2Ugc2VsZi5jb25maWdbb3B0aW9uXSA9IHZhbHVlO1xuXG5cdFx0c2VsZi5yZWRyYXcoKTtcblx0XHRqdW1wVG9EYXRlKCk7XG5cdH1cblxuXHRmdW5jdGlvbiBzZXRTZWxlY3RlZERhdGUoaW5wdXREYXRlLCBmb3JtYXQpIHtcblx0XHRpZiAoaW5wdXREYXRlIGluc3RhbmNlb2YgQXJyYXkpIHNlbGYuc2VsZWN0ZWREYXRlcyA9IGlucHV0RGF0ZS5tYXAoZnVuY3Rpb24gKGQpIHtcblx0XHRcdHJldHVybiBzZWxmLnBhcnNlRGF0ZShkLCBmb3JtYXQpO1xuXHRcdH0pO2Vsc2UgaWYgKGlucHV0RGF0ZSBpbnN0YW5jZW9mIERhdGUgfHwgIWlzTmFOKGlucHV0RGF0ZSkpIHNlbGYuc2VsZWN0ZWREYXRlcyA9IFtzZWxmLnBhcnNlRGF0ZShpbnB1dERhdGUsIGZvcm1hdCldO2Vsc2UgaWYgKGlucHV0RGF0ZSAmJiBpbnB1dERhdGUuc3Vic3RyaW5nKSB7XG5cdFx0XHRzd2l0Y2ggKHNlbGYuY29uZmlnLm1vZGUpIHtcblx0XHRcdFx0Y2FzZSBcInNpbmdsZVwiOlxuXHRcdFx0XHRcdHNlbGYuc2VsZWN0ZWREYXRlcyA9IFtzZWxmLnBhcnNlRGF0ZShpbnB1dERhdGUsIGZvcm1hdCldO1xuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdGNhc2UgXCJtdWx0aXBsZVwiOlxuXHRcdFx0XHRcdHNlbGYuc2VsZWN0ZWREYXRlcyA9IGlucHV0RGF0ZS5zcGxpdChcIjsgXCIpLm1hcChmdW5jdGlvbiAoZGF0ZSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHNlbGYucGFyc2VEYXRlKGRhdGUsIGZvcm1hdCk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0Y2FzZSBcInJhbmdlXCI6XG5cdFx0XHRcdFx0c2VsZi5zZWxlY3RlZERhdGVzID0gaW5wdXREYXRlLnNwbGl0KHNlbGYubDEwbi5yYW5nZVNlcGFyYXRvcikubWFwKGZ1bmN0aW9uIChkYXRlKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gc2VsZi5wYXJzZURhdGUoZGF0ZSwgZm9ybWF0KTtcblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0c2VsZi5zZWxlY3RlZERhdGVzID0gc2VsZi5zZWxlY3RlZERhdGVzLmZpbHRlcihmdW5jdGlvbiAoZCkge1xuXHRcdFx0cmV0dXJuIGQgaW5zdGFuY2VvZiBEYXRlICYmIGlzRW5hYmxlZChkLCBmYWxzZSk7XG5cdFx0fSk7XG5cblx0XHRzZWxmLnNlbGVjdGVkRGF0ZXMuc29ydChmdW5jdGlvbiAoYSwgYikge1xuXHRcdFx0cmV0dXJuIGEuZ2V0VGltZSgpIC0gYi5nZXRUaW1lKCk7XG5cdFx0fSk7XG5cdH1cblxuXHRmdW5jdGlvbiBzZXREYXRlKGRhdGUsIHRyaWdnZXJDaGFuZ2UsIGZvcm1hdCkge1xuXHRcdGlmIChkYXRlICE9PSAwICYmICFkYXRlKSByZXR1cm4gc2VsZi5jbGVhcih0cmlnZ2VyQ2hhbmdlKTtcblxuXHRcdHNldFNlbGVjdGVkRGF0ZShkYXRlLCBmb3JtYXQpO1xuXG5cdFx0c2VsZi5zaG93VGltZUlucHV0ID0gc2VsZi5zZWxlY3RlZERhdGVzLmxlbmd0aCA+IDA7XG5cdFx0c2VsZi5sYXRlc3RTZWxlY3RlZERhdGVPYmogPSBzZWxmLnNlbGVjdGVkRGF0ZXNbMF07XG5cblx0XHRzZWxmLnJlZHJhdygpO1xuXHRcdGp1bXBUb0RhdGUoKTtcblxuXHRcdHNldEhvdXJzRnJvbURhdGUoKTtcblx0XHR1cGRhdGVWYWx1ZSh0cmlnZ2VyQ2hhbmdlKTtcblxuXHRcdGlmICh0cmlnZ2VyQ2hhbmdlKSB0cmlnZ2VyRXZlbnQoXCJDaGFuZ2VcIik7XG5cdH1cblxuXHRmdW5jdGlvbiBwYXJzZURhdGVSdWxlcyhhcnIpIHtcblx0XHRmb3IgKHZhciBpID0gYXJyLmxlbmd0aDsgaS0tOykge1xuXHRcdFx0aWYgKHR5cGVvZiBhcnJbaV0gPT09IFwic3RyaW5nXCIgfHwgK2FycltpXSkgYXJyW2ldID0gc2VsZi5wYXJzZURhdGUoYXJyW2ldLCBudWxsLCB0cnVlKTtlbHNlIGlmIChhcnJbaV0gJiYgYXJyW2ldLmZyb20gJiYgYXJyW2ldLnRvKSB7XG5cdFx0XHRcdGFycltpXS5mcm9tID0gc2VsZi5wYXJzZURhdGUoYXJyW2ldLmZyb20pO1xuXHRcdFx0XHRhcnJbaV0udG8gPSBzZWxmLnBhcnNlRGF0ZShhcnJbaV0udG8pO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBhcnIuZmlsdGVyKGZ1bmN0aW9uICh4KSB7XG5cdFx0XHRyZXR1cm4geDtcblx0XHR9KTsgLy8gcmVtb3ZlIGZhbHN5IHZhbHVlc1xuXHR9XG5cblx0ZnVuY3Rpb24gc2V0dXBEYXRlcygpIHtcblx0XHRzZWxmLnNlbGVjdGVkRGF0ZXMgPSBbXTtcblx0XHRzZWxmLm5vdyA9IG5ldyBEYXRlKCk7XG5cblx0XHR2YXIgcHJlbG9hZGVkRGF0ZSA9IHNlbGYuY29uZmlnLmRlZmF1bHREYXRlIHx8IHNlbGYuaW5wdXQudmFsdWU7XG5cdFx0aWYgKHByZWxvYWRlZERhdGUpIHNldFNlbGVjdGVkRGF0ZShwcmVsb2FkZWREYXRlLCBzZWxmLmNvbmZpZy5kYXRlRm9ybWF0KTtcblxuXHRcdHZhciBpbml0aWFsRGF0ZSA9IHNlbGYuc2VsZWN0ZWREYXRlcy5sZW5ndGggPyBzZWxmLnNlbGVjdGVkRGF0ZXNbMF0gOiBzZWxmLmNvbmZpZy5taW5EYXRlICYmIHNlbGYuY29uZmlnLm1pbkRhdGUuZ2V0VGltZSgpID4gc2VsZi5ub3cgPyBzZWxmLmNvbmZpZy5taW5EYXRlIDogc2VsZi5jb25maWcubWF4RGF0ZSAmJiBzZWxmLmNvbmZpZy5tYXhEYXRlLmdldFRpbWUoKSA8IHNlbGYubm93ID8gc2VsZi5jb25maWcubWF4RGF0ZSA6IHNlbGYubm93O1xuXG5cdFx0c2VsZi5jdXJyZW50WWVhciA9IGluaXRpYWxEYXRlLmdldEZ1bGxZZWFyKCk7XG5cdFx0c2VsZi5jdXJyZW50TW9udGggPSBpbml0aWFsRGF0ZS5nZXRNb250aCgpO1xuXG5cdFx0aWYgKHNlbGYuc2VsZWN0ZWREYXRlcy5sZW5ndGgpIHNlbGYubGF0ZXN0U2VsZWN0ZWREYXRlT2JqID0gc2VsZi5zZWxlY3RlZERhdGVzWzBdO1xuXG5cdFx0c2VsZi5taW5EYXRlSGFzVGltZSA9IHNlbGYuY29uZmlnLm1pbkRhdGUgJiYgKHNlbGYuY29uZmlnLm1pbkRhdGUuZ2V0SG91cnMoKSB8fCBzZWxmLmNvbmZpZy5taW5EYXRlLmdldE1pbnV0ZXMoKSB8fCBzZWxmLmNvbmZpZy5taW5EYXRlLmdldFNlY29uZHMoKSk7XG5cblx0XHRzZWxmLm1heERhdGVIYXNUaW1lID0gc2VsZi5jb25maWcubWF4RGF0ZSAmJiAoc2VsZi5jb25maWcubWF4RGF0ZS5nZXRIb3VycygpIHx8IHNlbGYuY29uZmlnLm1heERhdGUuZ2V0TWludXRlcygpIHx8IHNlbGYuY29uZmlnLm1heERhdGUuZ2V0U2Vjb25kcygpKTtcblxuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShzZWxmLCBcImxhdGVzdFNlbGVjdGVkRGF0ZU9ialwiLCB7XG5cdFx0XHRnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcblx0XHRcdFx0cmV0dXJuIHNlbGYuX3NlbGVjdGVkRGF0ZU9iaiB8fCBzZWxmLnNlbGVjdGVkRGF0ZXNbc2VsZi5zZWxlY3RlZERhdGVzLmxlbmd0aCAtIDFdO1xuXHRcdFx0fSxcblx0XHRcdHNldDogZnVuY3Rpb24gc2V0KGRhdGUpIHtcblx0XHRcdFx0c2VsZi5fc2VsZWN0ZWREYXRlT2JqID0gZGF0ZTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdGlmICghc2VsZi5pc01vYmlsZSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KHNlbGYsIFwic2hvd1RpbWVJbnB1dFwiLCB7XG5cdFx0XHRcdGdldDogZnVuY3Rpb24gZ2V0KCkge1xuXHRcdFx0XHRcdHJldHVybiBzZWxmLl9zaG93VGltZUlucHV0O1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRzZXQ6IGZ1bmN0aW9uIHNldChib29sKSB7XG5cdFx0XHRcdFx0c2VsZi5fc2hvd1RpbWVJbnB1dCA9IGJvb2w7XG5cdFx0XHRcdFx0aWYgKHNlbGYuY2FsZW5kYXJDb250YWluZXIpIHRvZ2dsZUNsYXNzKHNlbGYuY2FsZW5kYXJDb250YWluZXIsIFwic2hvd1RpbWVJbnB1dFwiLCBib29sKTtcblx0XHRcdFx0XHRwb3NpdGlvbkNhbGVuZGFyKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIHNldHVwSGVscGVyRnVuY3Rpb25zKCkge1xuXHRcdHNlbGYudXRpbHMgPSB7XG5cdFx0XHRkdXJhdGlvbjoge1xuXHRcdFx0XHREQVk6IDg2NDAwMDAwXG5cdFx0XHR9LFxuXHRcdFx0Z2V0RGF5c2luTW9udGg6IGZ1bmN0aW9uIGdldERheXNpbk1vbnRoKG1vbnRoLCB5cikge1xuXHRcdFx0XHRtb250aCA9IHR5cGVvZiBtb250aCA9PT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYuY3VycmVudE1vbnRoIDogbW9udGg7XG5cblx0XHRcdFx0eXIgPSB0eXBlb2YgeXIgPT09IFwidW5kZWZpbmVkXCIgPyBzZWxmLmN1cnJlbnRZZWFyIDogeXI7XG5cblx0XHRcdFx0aWYgKG1vbnRoID09PSAxICYmICh5ciAlIDQgPT09IDAgJiYgeXIgJSAxMDAgIT09IDAgfHwgeXIgJSA0MDAgPT09IDApKSByZXR1cm4gMjk7XG5cblx0XHRcdFx0cmV0dXJuIHNlbGYubDEwbi5kYXlzSW5Nb250aFttb250aF07XG5cdFx0XHR9LFxuXHRcdFx0bW9udGhUb1N0cjogZnVuY3Rpb24gbW9udGhUb1N0cihtb250aE51bWJlciwgc2hvcnRoYW5kKSB7XG5cdFx0XHRcdHNob3J0aGFuZCA9IHR5cGVvZiBzaG9ydGhhbmQgPT09IFwidW5kZWZpbmVkXCIgPyBzZWxmLmNvbmZpZy5zaG9ydGhhbmRDdXJyZW50TW9udGggOiBzaG9ydGhhbmQ7XG5cblx0XHRcdFx0cmV0dXJuIHNlbGYubDEwbi5tb250aHNbKHNob3J0aGFuZCA/IFwic2hvcnRcIiA6IFwibG9uZ1wiKSArIFwiaGFuZFwiXVttb250aE51bWJlcl07XG5cdFx0XHR9XG5cdFx0fTtcblx0fVxuXG5cdC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5cdGZ1bmN0aW9uIHNldHVwRm9ybWF0cygpIHtcblx0XHRzZWxmLmZvcm1hdHMgPSBPYmplY3QuY3JlYXRlKEZsYXRwaWNrckluc3RhbmNlLnByb3RvdHlwZS5mb3JtYXRzKTtcblx0XHRbXCJEXCIsIFwiRlwiLCBcIkpcIiwgXCJNXCIsIFwiV1wiLCBcImxcIl0uZm9yRWFjaChmdW5jdGlvbiAoZikge1xuXHRcdFx0c2VsZi5mb3JtYXRzW2ZdID0gRmxhdHBpY2tySW5zdGFuY2UucHJvdG90eXBlLmZvcm1hdHNbZl0uYmluZChzZWxmKTtcblx0XHR9KTtcblxuXHRcdHNlbGYucmV2Rm9ybWF0LkYgPSBGbGF0cGlja3JJbnN0YW5jZS5wcm90b3R5cGUucmV2Rm9ybWF0LkYuYmluZChzZWxmKTtcblx0XHRzZWxmLnJldkZvcm1hdC5NID0gRmxhdHBpY2tySW5zdGFuY2UucHJvdG90eXBlLnJldkZvcm1hdC5NLmJpbmQoc2VsZik7XG5cdH1cblxuXHRmdW5jdGlvbiBzZXR1cElucHV0cygpIHtcblx0XHRzZWxmLmlucHV0ID0gc2VsZi5jb25maWcud3JhcCA/IHNlbGYuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtaW5wdXRdXCIpIDogc2VsZi5lbGVtZW50O1xuXG5cdFx0LyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cblx0XHRpZiAoIXNlbGYuaW5wdXQpIHJldHVybiBjb25zb2xlLndhcm4oXCJFcnJvcjogaW52YWxpZCBpbnB1dCBlbGVtZW50IHNwZWNpZmllZFwiLCBzZWxmLmlucHV0KTtcblxuXHRcdHNlbGYuaW5wdXQuX3R5cGUgPSBzZWxmLmlucHV0LnR5cGU7XG5cdFx0c2VsZi5pbnB1dC50eXBlID0gXCJ0ZXh0XCI7XG5cblx0XHRzZWxmLmlucHV0LmNsYXNzTGlzdC5hZGQoXCJmbGF0cGlja3ItaW5wdXRcIik7XG5cdFx0c2VsZi5faW5wdXQgPSBzZWxmLmlucHV0O1xuXG5cdFx0aWYgKHNlbGYuY29uZmlnLmFsdElucHV0KSB7XG5cdFx0XHQvLyByZXBsaWNhdGUgc2VsZi5lbGVtZW50XG5cdFx0XHRzZWxmLmFsdElucHV0ID0gY3JlYXRlRWxlbWVudChzZWxmLmlucHV0Lm5vZGVOYW1lLCBzZWxmLmlucHV0LmNsYXNzTmFtZSArIFwiIFwiICsgc2VsZi5jb25maWcuYWx0SW5wdXRDbGFzcyk7XG5cdFx0XHRzZWxmLl9pbnB1dCA9IHNlbGYuYWx0SW5wdXQ7XG5cdFx0XHRzZWxmLmFsdElucHV0LnBsYWNlaG9sZGVyID0gc2VsZi5pbnB1dC5wbGFjZWhvbGRlcjtcblx0XHRcdHNlbGYuYWx0SW5wdXQuZGlzYWJsZWQgPSBzZWxmLmlucHV0LmRpc2FibGVkO1xuXHRcdFx0c2VsZi5hbHRJbnB1dC5yZXF1aXJlZCA9IHNlbGYuaW5wdXQucmVxdWlyZWQ7XG5cdFx0XHRzZWxmLmFsdElucHV0LnR5cGUgPSBcInRleHRcIjtcblx0XHRcdHNlbGYuaW5wdXQudHlwZSA9IFwiaGlkZGVuXCI7XG5cblx0XHRcdGlmICghc2VsZi5jb25maWcuc3RhdGljICYmIHNlbGYuaW5wdXQucGFyZW50Tm9kZSkgc2VsZi5pbnB1dC5wYXJlbnROb2RlLmluc2VydEJlZm9yZShzZWxmLmFsdElucHV0LCBzZWxmLmlucHV0Lm5leHRTaWJsaW5nKTtcblx0XHR9XG5cblx0XHRpZiAoIXNlbGYuY29uZmlnLmFsbG93SW5wdXQpIHNlbGYuX2lucHV0LnNldEF0dHJpYnV0ZShcInJlYWRvbmx5XCIsIFwicmVhZG9ubHlcIik7XG5cblx0XHRzZWxmLl9wb3NpdGlvbkVsZW1lbnQgPSBzZWxmLmNvbmZpZy5wb3NpdGlvbkVsZW1lbnQgfHwgc2VsZi5faW5wdXQ7XG5cdH1cblxuXHRmdW5jdGlvbiBzZXR1cE1vYmlsZSgpIHtcblx0XHR2YXIgaW5wdXRUeXBlID0gc2VsZi5jb25maWcuZW5hYmxlVGltZSA/IHNlbGYuY29uZmlnLm5vQ2FsZW5kYXIgPyBcInRpbWVcIiA6IFwiZGF0ZXRpbWUtbG9jYWxcIiA6IFwiZGF0ZVwiO1xuXG5cdFx0c2VsZi5tb2JpbGVJbnB1dCA9IGNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiLCBzZWxmLmlucHV0LmNsYXNzTmFtZSArIFwiIGZsYXRwaWNrci1tb2JpbGVcIik7XG5cdFx0c2VsZi5tb2JpbGVJbnB1dC5zdGVwID0gc2VsZi5pbnB1dC5nZXRBdHRyaWJ1dGUoXCJzdGVwXCIpIHx8IFwiYW55XCI7XG5cdFx0c2VsZi5tb2JpbGVJbnB1dC50YWJJbmRleCA9IDE7XG5cdFx0c2VsZi5tb2JpbGVJbnB1dC50eXBlID0gaW5wdXRUeXBlO1xuXHRcdHNlbGYubW9iaWxlSW5wdXQuZGlzYWJsZWQgPSBzZWxmLmlucHV0LmRpc2FibGVkO1xuXHRcdHNlbGYubW9iaWxlSW5wdXQucGxhY2Vob2xkZXIgPSBzZWxmLmlucHV0LnBsYWNlaG9sZGVyO1xuXG5cdFx0c2VsZi5tb2JpbGVGb3JtYXRTdHIgPSBpbnB1dFR5cGUgPT09IFwiZGF0ZXRpbWUtbG9jYWxcIiA/IFwiWS1tLWRcXFxcVEg6aTpTXCIgOiBpbnB1dFR5cGUgPT09IFwiZGF0ZVwiID8gXCJZLW0tZFwiIDogXCJIOmk6U1wiO1xuXG5cdFx0aWYgKHNlbGYuc2VsZWN0ZWREYXRlcy5sZW5ndGgpIHtcblx0XHRcdHNlbGYubW9iaWxlSW5wdXQuZGVmYXVsdFZhbHVlID0gc2VsZi5tb2JpbGVJbnB1dC52YWx1ZSA9IHNlbGYuZm9ybWF0RGF0ZShzZWxmLnNlbGVjdGVkRGF0ZXNbMF0sIHNlbGYubW9iaWxlRm9ybWF0U3RyKTtcblx0XHR9XG5cblx0XHRpZiAoc2VsZi5jb25maWcubWluRGF0ZSkgc2VsZi5tb2JpbGVJbnB1dC5taW4gPSBzZWxmLmZvcm1hdERhdGUoc2VsZi5jb25maWcubWluRGF0ZSwgXCJZLW0tZFwiKTtcblxuXHRcdGlmIChzZWxmLmNvbmZpZy5tYXhEYXRlKSBzZWxmLm1vYmlsZUlucHV0Lm1heCA9IHNlbGYuZm9ybWF0RGF0ZShzZWxmLmNvbmZpZy5tYXhEYXRlLCBcIlktbS1kXCIpO1xuXG5cdFx0c2VsZi5pbnB1dC50eXBlID0gXCJoaWRkZW5cIjtcblx0XHRpZiAoc2VsZi5jb25maWcuYWx0SW5wdXQpIHNlbGYuYWx0SW5wdXQudHlwZSA9IFwiaGlkZGVuXCI7XG5cblx0XHR0cnkge1xuXHRcdFx0c2VsZi5pbnB1dC5wYXJlbnROb2RlLmluc2VydEJlZm9yZShzZWxmLm1vYmlsZUlucHV0LCBzZWxmLmlucHV0Lm5leHRTaWJsaW5nKTtcblx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHQvL1xuXHRcdH1cblxuXHRcdHNlbGYubW9iaWxlSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0c2VsZi5zZXREYXRlKGUudGFyZ2V0LnZhbHVlLCBmYWxzZSwgc2VsZi5tb2JpbGVGb3JtYXRTdHIpO1xuXHRcdFx0dHJpZ2dlckV2ZW50KFwiQ2hhbmdlXCIpO1xuXHRcdFx0dHJpZ2dlckV2ZW50KFwiQ2xvc2VcIik7XG5cdFx0fSk7XG5cdH1cblxuXHRmdW5jdGlvbiB0b2dnbGUoKSB7XG5cdFx0aWYgKHNlbGYuaXNPcGVuKSByZXR1cm4gc2VsZi5jbG9zZSgpO1xuXHRcdHNlbGYub3BlbigpO1xuXHR9XG5cblx0ZnVuY3Rpb24gdHJpZ2dlckV2ZW50KGV2ZW50LCBkYXRhKSB7XG5cdFx0dmFyIGhvb2tzID0gc2VsZi5jb25maWdbXCJvblwiICsgZXZlbnRdO1xuXG5cdFx0aWYgKGhvb2tzICE9PSB1bmRlZmluZWQgJiYgaG9va3MubGVuZ3RoID4gMCkge1xuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGhvb2tzW2ldICYmIGkgPCBob29rcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRob29rc1tpXShzZWxmLnNlbGVjdGVkRGF0ZXMsIHNlbGYuaW5wdXQudmFsdWUsIHNlbGYsIGRhdGEpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmIChldmVudCA9PT0gXCJDaGFuZ2VcIikge1xuXHRcdFx0c2VsZi5pbnB1dC5kaXNwYXRjaEV2ZW50KGNyZWF0ZUV2ZW50KFwiY2hhbmdlXCIpKTtcblxuXHRcdFx0Ly8gbWFueSBmcm9udC1lbmQgZnJhbWV3b3JrcyBiaW5kIHRvIHRoZSBpbnB1dCBldmVudFxuXHRcdFx0c2VsZi5pbnB1dC5kaXNwYXRjaEV2ZW50KGNyZWF0ZUV2ZW50KFwiaW5wdXRcIikpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuICAqIENyZWF0ZXMgYW4gRXZlbnQsIG5vcm1hbGl6ZWQgYWNyb3NzIGJyb3dzZXJzXG4gICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgdGhlIGV2ZW50IG5hbWUsIGUuZy4gXCJjbGlja1wiXG4gICogQHJldHVybiB7RXZlbnR9IHRoZSBjcmVhdGVkIGV2ZW50XG4gICovXG5cdGZ1bmN0aW9uIGNyZWF0ZUV2ZW50KG5hbWUpIHtcblx0XHRpZiAoc2VsZi5fc3VwcG9ydHNFdmVudHMpIHJldHVybiBuZXcgRXZlbnQobmFtZSwgeyBidWJibGVzOiB0cnVlIH0pO1xuXG5cdFx0c2VsZi5fW25hbWUgKyBcIkV2ZW50XCJdID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoXCJFdmVudFwiKTtcblx0XHRzZWxmLl9bbmFtZSArIFwiRXZlbnRcIl0uaW5pdEV2ZW50KG5hbWUsIHRydWUsIHRydWUpO1xuXHRcdHJldHVybiBzZWxmLl9bbmFtZSArIFwiRXZlbnRcIl07XG5cdH1cblxuXHRmdW5jdGlvbiBpc0RhdGVTZWxlY3RlZChkYXRlKSB7XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzZWxmLnNlbGVjdGVkRGF0ZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdGlmIChjb21wYXJlRGF0ZXMoc2VsZi5zZWxlY3RlZERhdGVzW2ldLCBkYXRlKSA9PT0gMCkgcmV0dXJuIFwiXCIgKyBpO1xuXHRcdH1cblxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdGZ1bmN0aW9uIGlzRGF0ZUluUmFuZ2UoZGF0ZSkge1xuXHRcdGlmIChzZWxmLmNvbmZpZy5tb2RlICE9PSBcInJhbmdlXCIgfHwgc2VsZi5zZWxlY3RlZERhdGVzLmxlbmd0aCA8IDIpIHJldHVybiBmYWxzZTtcblx0XHRyZXR1cm4gY29tcGFyZURhdGVzKGRhdGUsIHNlbGYuc2VsZWN0ZWREYXRlc1swXSkgPj0gMCAmJiBjb21wYXJlRGF0ZXMoZGF0ZSwgc2VsZi5zZWxlY3RlZERhdGVzWzFdKSA8PSAwO1xuXHR9XG5cblx0ZnVuY3Rpb24gdXBkYXRlTmF2aWdhdGlvbkN1cnJlbnRNb250aCgpIHtcblx0XHRpZiAoc2VsZi5jb25maWcubm9DYWxlbmRhciB8fCBzZWxmLmlzTW9iaWxlIHx8ICFzZWxmLm1vbnRoTmF2KSByZXR1cm47XG5cblx0XHRzZWxmLmN1cnJlbnRNb250aEVsZW1lbnQudGV4dENvbnRlbnQgPSBzZWxmLnV0aWxzLm1vbnRoVG9TdHIoc2VsZi5jdXJyZW50TW9udGgpICsgXCIgXCI7XG5cdFx0c2VsZi5jdXJyZW50WWVhckVsZW1lbnQudmFsdWUgPSBzZWxmLmN1cnJlbnRZZWFyO1xuXG5cdFx0c2VsZi5faGlkZVByZXZNb250aEFycm93ID0gc2VsZi5jb25maWcubWluRGF0ZSAmJiAoc2VsZi5jdXJyZW50WWVhciA9PT0gc2VsZi5jb25maWcubWluRGF0ZS5nZXRGdWxsWWVhcigpID8gc2VsZi5jdXJyZW50TW9udGggPD0gc2VsZi5jb25maWcubWluRGF0ZS5nZXRNb250aCgpIDogc2VsZi5jdXJyZW50WWVhciA8IHNlbGYuY29uZmlnLm1pbkRhdGUuZ2V0RnVsbFllYXIoKSk7XG5cblx0XHRzZWxmLl9oaWRlTmV4dE1vbnRoQXJyb3cgPSBzZWxmLmNvbmZpZy5tYXhEYXRlICYmIChzZWxmLmN1cnJlbnRZZWFyID09PSBzZWxmLmNvbmZpZy5tYXhEYXRlLmdldEZ1bGxZZWFyKCkgPyBzZWxmLmN1cnJlbnRNb250aCArIDEgPiBzZWxmLmNvbmZpZy5tYXhEYXRlLmdldE1vbnRoKCkgOiBzZWxmLmN1cnJlbnRZZWFyID4gc2VsZi5jb25maWcubWF4RGF0ZS5nZXRGdWxsWWVhcigpKTtcblx0fVxuXG5cdC8qKlxuICAqIFVwZGF0ZXMgdGhlIHZhbHVlcyBvZiBpbnB1dHMgYXNzb2NpYXRlZCB3aXRoIHRoZSBjYWxlbmRhclxuICAqIEByZXR1cm4ge3ZvaWR9XG4gICovXG5cdGZ1bmN0aW9uIHVwZGF0ZVZhbHVlKHRyaWdnZXJDaGFuZ2UpIHtcblx0XHRpZiAoIXNlbGYuc2VsZWN0ZWREYXRlcy5sZW5ndGgpIHJldHVybiBzZWxmLmNsZWFyKHRyaWdnZXJDaGFuZ2UpO1xuXG5cdFx0aWYgKHNlbGYuaXNNb2JpbGUpIHtcblx0XHRcdHNlbGYubW9iaWxlSW5wdXQudmFsdWUgPSBzZWxmLnNlbGVjdGVkRGF0ZXMubGVuZ3RoID8gc2VsZi5mb3JtYXREYXRlKHNlbGYubGF0ZXN0U2VsZWN0ZWREYXRlT2JqLCBzZWxmLm1vYmlsZUZvcm1hdFN0cikgOiBcIlwiO1xuXHRcdH1cblxuXHRcdHZhciBqb2luQ2hhciA9IHNlbGYuY29uZmlnLm1vZGUgIT09IFwicmFuZ2VcIiA/IFwiOyBcIiA6IHNlbGYubDEwbi5yYW5nZVNlcGFyYXRvcjtcblxuXHRcdHNlbGYuaW5wdXQudmFsdWUgPSBzZWxmLnNlbGVjdGVkRGF0ZXMubWFwKGZ1bmN0aW9uIChkT2JqKSB7XG5cdFx0XHRyZXR1cm4gc2VsZi5mb3JtYXREYXRlKGRPYmosIHNlbGYuY29uZmlnLmRhdGVGb3JtYXQpO1xuXHRcdH0pLmpvaW4oam9pbkNoYXIpO1xuXG5cdFx0aWYgKHNlbGYuY29uZmlnLmFsdElucHV0KSB7XG5cdFx0XHRzZWxmLmFsdElucHV0LnZhbHVlID0gc2VsZi5zZWxlY3RlZERhdGVzLm1hcChmdW5jdGlvbiAoZE9iaikge1xuXHRcdFx0XHRyZXR1cm4gc2VsZi5mb3JtYXREYXRlKGRPYmosIHNlbGYuY29uZmlnLmFsdEZvcm1hdCk7XG5cdFx0XHR9KS5qb2luKGpvaW5DaGFyKTtcblx0XHR9XG5cblx0XHRpZiAodHJpZ2dlckNoYW5nZSAhPT0gZmFsc2UpIHRyaWdnZXJFdmVudChcIlZhbHVlVXBkYXRlXCIpO1xuXHR9XG5cblx0ZnVuY3Rpb24gbW91c2VEZWx0YShlKSB7XG5cdFx0cmV0dXJuIE1hdGgubWF4KC0xLCBNYXRoLm1pbigxLCBlLndoZWVsRGVsdGEgfHwgLWUuZGVsdGFZKSk7XG5cdH1cblxuXHRmdW5jdGlvbiBvbk1vbnRoTmF2U2Nyb2xsKGUpIHtcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0dmFyIGlzWWVhciA9IHNlbGYuY3VycmVudFllYXJFbGVtZW50LnBhcmVudE5vZGUuY29udGFpbnMoZS50YXJnZXQpO1xuXG5cdFx0aWYgKGUudGFyZ2V0ID09PSBzZWxmLmN1cnJlbnRNb250aEVsZW1lbnQgfHwgaXNZZWFyKSB7XG5cblx0XHRcdHZhciBkZWx0YSA9IG1vdXNlRGVsdGEoZSk7XG5cblx0XHRcdGlmIChpc1llYXIpIHtcblx0XHRcdFx0Y2hhbmdlWWVhcihzZWxmLmN1cnJlbnRZZWFyICsgZGVsdGEpO1xuXHRcdFx0XHRlLnRhcmdldC52YWx1ZSA9IHNlbGYuY3VycmVudFllYXI7XG5cdFx0XHR9IGVsc2Ugc2VsZi5jaGFuZ2VNb250aChkZWx0YSwgdHJ1ZSwgZmFsc2UpO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIG9uTW9udGhOYXZDbGljayhlKSB7XG5cdFx0dmFyIGlzUHJldk1vbnRoID0gc2VsZi5wcmV2TW9udGhOYXYuY29udGFpbnMoZS50YXJnZXQpO1xuXHRcdHZhciBpc05leHRNb250aCA9IHNlbGYubmV4dE1vbnRoTmF2LmNvbnRhaW5zKGUudGFyZ2V0KTtcblxuXHRcdGlmIChpc1ByZXZNb250aCB8fCBpc05leHRNb250aCkgY2hhbmdlTW9udGgoaXNQcmV2TW9udGggPyAtMSA6IDEpO2Vsc2UgaWYgKGUudGFyZ2V0ID09PSBzZWxmLmN1cnJlbnRZZWFyRWxlbWVudCkge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0c2VsZi5jdXJyZW50WWVhckVsZW1lbnQuc2VsZWN0KCk7XG5cdFx0fSBlbHNlIGlmIChlLnRhcmdldC5jbGFzc05hbWUgPT09IFwiYXJyb3dVcFwiKSBzZWxmLmNoYW5nZVllYXIoc2VsZi5jdXJyZW50WWVhciArIDEpO2Vsc2UgaWYgKGUudGFyZ2V0LmNsYXNzTmFtZSA9PT0gXCJhcnJvd0Rvd25cIikgc2VsZi5jaGFuZ2VZZWFyKHNlbGYuY3VycmVudFllYXIgLSAxKTtcblx0fVxuXG5cdC8qKlxuICAqIENyZWF0ZXMgYW4gSFRNTEVsZW1lbnQgd2l0aCBnaXZlbiB0YWcsIGNsYXNzLCBhbmQgdGV4dHVhbCBjb250ZW50XG4gICogQHBhcmFtIHtTdHJpbmd9IHRhZyB0aGUgSFRNTCB0YWdcbiAgKiBAcGFyYW0ge1N0cmluZ30gY2xhc3NOYW1lIHRoZSBuZXcgZWxlbWVudCdzIGNsYXNzIG5hbWVcbiAgKiBAcGFyYW0ge1N0cmluZ30gY29udGVudCBUaGUgbmV3IGVsZW1lbnQncyB0ZXh0IGNvbnRlbnRcbiAgKiBAcmV0dXJuIHtIVE1MRWxlbWVudH0gdGhlIGNyZWF0ZWQgSFRNTCBlbGVtZW50XG4gICovXG5cdGZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnQodGFnLCBjbGFzc05hbWUsIGNvbnRlbnQpIHtcblx0XHR2YXIgZSA9IHdpbmRvdy5kb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZyk7XG5cdFx0Y2xhc3NOYW1lID0gY2xhc3NOYW1lIHx8IFwiXCI7XG5cdFx0Y29udGVudCA9IGNvbnRlbnQgfHwgXCJcIjtcblxuXHRcdGUuY2xhc3NOYW1lID0gY2xhc3NOYW1lO1xuXG5cdFx0aWYgKGNvbnRlbnQgIT09IHVuZGVmaW5lZCkgZS50ZXh0Q29udGVudCA9IGNvbnRlbnQ7XG5cblx0XHRyZXR1cm4gZTtcblx0fVxuXG5cdGZ1bmN0aW9uIGFycmF5aWZ5KG9iaikge1xuXHRcdGlmIChvYmogaW5zdGFuY2VvZiBBcnJheSkgcmV0dXJuIG9iajtcblx0XHRyZXR1cm4gW29ial07XG5cdH1cblxuXHRmdW5jdGlvbiB0b2dnbGVDbGFzcyhlbGVtLCBjbGFzc05hbWUsIGJvb2wpIHtcblx0XHRpZiAoYm9vbCkgcmV0dXJuIGVsZW0uY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpO1xuXHRcdGVsZW0uY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpO1xuXHR9XG5cblx0LyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cblx0ZnVuY3Rpb24gZGVib3VuY2UoZnVuYywgd2FpdCwgaW1tZWRpYXRlKSB7XG5cdFx0dmFyIHRpbWVvdXQgPSB2b2lkIDA7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uICgpIHtcblx0XHRcdHZhciBjb250ZXh0ID0gdGhpcyxcblx0XHRcdCAgICBhcmdzID0gYXJndW1lbnRzO1xuXHRcdFx0Y2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuXHRcdFx0dGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHR0aW1lb3V0ID0gbnVsbDtcblx0XHRcdFx0aWYgKCFpbW1lZGlhdGUpIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG5cdFx0XHR9LCB3YWl0KTtcblx0XHRcdGlmIChpbW1lZGlhdGUgJiYgIXRpbWVvdXQpIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG5cdFx0fTtcblx0fVxuXG5cdC8qKlxuICAqIENvbXB1dGUgdGhlIGRpZmZlcmVuY2UgaW4gZGF0ZXMsIG1lYXN1cmVkIGluIG1zXG4gICogQHBhcmFtIHtEYXRlfSBkYXRlMVxuICAqIEBwYXJhbSB7RGF0ZX0gZGF0ZTJcbiAgKiBAcGFyYW0ge0Jvb2xlYW59IHRpbWVsZXNzIHdoZXRoZXIgdG8gcmVzZXQgdGltZXMgb2YgYm90aCBkYXRlcyB0byAwMDowMFxuICAqIEByZXR1cm4ge051bWJlcn0gdGhlIGRpZmZlcmVuY2UgaW4gbXNcbiAgKi9cblx0ZnVuY3Rpb24gY29tcGFyZURhdGVzKGRhdGUxLCBkYXRlMiwgdGltZWxlc3MpIHtcblx0XHRpZiAoIShkYXRlMSBpbnN0YW5jZW9mIERhdGUpIHx8ICEoZGF0ZTIgaW5zdGFuY2VvZiBEYXRlKSkgcmV0dXJuIGZhbHNlO1xuXG5cdFx0aWYgKHRpbWVsZXNzICE9PSBmYWxzZSkge1xuXHRcdFx0cmV0dXJuIG5ldyBEYXRlKGRhdGUxLmdldFRpbWUoKSkuc2V0SG91cnMoMCwgMCwgMCwgMCkgLSBuZXcgRGF0ZShkYXRlMi5nZXRUaW1lKCkpLnNldEhvdXJzKDAsIDAsIDAsIDApO1xuXHRcdH1cblxuXHRcdHJldHVybiBkYXRlMS5nZXRUaW1lKCkgLSBkYXRlMi5nZXRUaW1lKCk7XG5cdH1cblxuXHRmdW5jdGlvbiB0aW1lV3JhcHBlcihlKSB7XG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0dmFyIGlzS2V5RG93biA9IGUudHlwZSA9PT0gXCJrZXlkb3duXCIsXG5cdFx0ICAgIGlzV2hlZWwgPSBlLnR5cGUgPT09IFwid2hlZWxcIixcblx0XHQgICAgaXNJbmNyZW1lbnQgPSBlLnR5cGUgPT09IFwiaW5jcmVtZW50XCIsXG5cdFx0ICAgIGlucHV0ID0gZS50YXJnZXQ7XG5cblx0XHRpZiAoc2VsZi5hbVBNICYmIGUudGFyZ2V0ID09PSBzZWxmLmFtUE0pIHJldHVybiBlLnRhcmdldC50ZXh0Q29udGVudCA9IFtcIkFNXCIsIFwiUE1cIl1bZS50YXJnZXQudGV4dENvbnRlbnQgPT09IFwiQU1cIiB8IDBdO1xuXG5cdFx0dmFyIG1pbiA9IE51bWJlcihpbnB1dC5taW4pLFxuXHRcdCAgICBtYXggPSBOdW1iZXIoaW5wdXQubWF4KSxcblx0XHQgICAgc3RlcCA9IE51bWJlcihpbnB1dC5zdGVwKSxcblx0XHQgICAgY3VyVmFsdWUgPSBwYXJzZUludChpbnB1dC52YWx1ZSwgMTApLFxuXHRcdCAgICBkZWx0YSA9IGUuZGVsdGEgfHwgKCFpc0tleURvd24gPyBNYXRoLm1heCgtMSwgTWF0aC5taW4oMSwgZS53aGVlbERlbHRhIHx8IC1lLmRlbHRhWSkpIHx8IDAgOiBlLndoaWNoID09PSAzOCA/IDEgOiAtMSk7XG5cblx0XHR2YXIgbmV3VmFsdWUgPSBjdXJWYWx1ZSArIHN0ZXAgKiBkZWx0YTtcblxuXHRcdGlmICh0eXBlb2YgaW5wdXQudmFsdWUgIT09IFwidW5kZWZpbmVkXCIgJiYgaW5wdXQudmFsdWUubGVuZ3RoID09PSAyKSB7XG5cdFx0XHR2YXIgaXNIb3VyRWxlbSA9IGlucHV0ID09PSBzZWxmLmhvdXJFbGVtZW50LFxuXHRcdFx0ICAgIGlzTWludXRlRWxlbSA9IGlucHV0ID09PSBzZWxmLm1pbnV0ZUVsZW1lbnQ7XG5cblx0XHRcdGlmIChuZXdWYWx1ZSA8IG1pbikge1xuXHRcdFx0XHRuZXdWYWx1ZSA9IG1heCArIG5ld1ZhbHVlICsgIWlzSG91ckVsZW0gKyAoaXNIb3VyRWxlbSAmJiAhc2VsZi5hbVBNKTtcblxuXHRcdFx0XHRpZiAoaXNNaW51dGVFbGVtKSBpbmNyZW1lbnROdW1JbnB1dChudWxsLCAtMSwgc2VsZi5ob3VyRWxlbWVudCk7XG5cdFx0XHR9IGVsc2UgaWYgKG5ld1ZhbHVlID4gbWF4KSB7XG5cdFx0XHRcdG5ld1ZhbHVlID0gaW5wdXQgPT09IHNlbGYuaG91ckVsZW1lbnQgPyBuZXdWYWx1ZSAtIG1heCAtICFzZWxmLmFtUE0gOiBtaW47XG5cblx0XHRcdFx0aWYgKGlzTWludXRlRWxlbSkgaW5jcmVtZW50TnVtSW5wdXQobnVsbCwgMSwgc2VsZi5ob3VyRWxlbWVudCk7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChzZWxmLmFtUE0gJiYgaXNIb3VyRWxlbSAmJiAoc3RlcCA9PT0gMSA/IG5ld1ZhbHVlICsgY3VyVmFsdWUgPT09IDIzIDogTWF0aC5hYnMobmV3VmFsdWUgLSBjdXJWYWx1ZSkgPiBzdGVwKSkgc2VsZi5hbVBNLnRleHRDb250ZW50ID0gc2VsZi5hbVBNLnRleHRDb250ZW50ID09PSBcIlBNXCIgPyBcIkFNXCIgOiBcIlBNXCI7XG5cblx0XHRcdGlucHV0LnZhbHVlID0gc2VsZi5wYWQobmV3VmFsdWUpO1xuXHRcdH1cblx0fVxuXG5cdGluaXQoKTtcblx0cmV0dXJuIHNlbGY7XG59XG5cbkZsYXRwaWNrckluc3RhbmNlLnByb3RvdHlwZSA9IHtcblx0Zm9ybWF0czoge1xuXHRcdC8vIGdldCB0aGUgZGF0ZSBpbiBVVENcblx0XHRaOiBmdW5jdGlvbiBaKGRhdGUpIHtcblx0XHRcdHJldHVybiBkYXRlLnRvSVNPU3RyaW5nKCk7XG5cdFx0fSxcblxuXHRcdC8vIHdlZWtkYXkgbmFtZSwgc2hvcnQsIGUuZy4gVGh1XG5cdFx0RDogZnVuY3Rpb24gRChkYXRlKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5sMTBuLndlZWtkYXlzLnNob3J0aGFuZFt0aGlzLmZvcm1hdHMudyhkYXRlKV07XG5cdFx0fSxcblxuXHRcdC8vIGZ1bGwgbW9udGggbmFtZSBlLmcuIEphbnVhcnlcblx0XHRGOiBmdW5jdGlvbiBGKGRhdGUpIHtcblx0XHRcdHJldHVybiB0aGlzLnV0aWxzLm1vbnRoVG9TdHIodGhpcy5mb3JtYXRzLm4oZGF0ZSkgLSAxLCBmYWxzZSk7XG5cdFx0fSxcblxuXHRcdC8vIHBhZGRlZCBob3VyIDEtMTJcblx0XHRHOiBmdW5jdGlvbiBHKGRhdGUpIHtcblx0XHRcdHJldHVybiBGbGF0cGlja3JJbnN0YW5jZS5wcm90b3R5cGUucGFkKEZsYXRwaWNrckluc3RhbmNlLnByb3RvdHlwZS5mb3JtYXRzLmgoZGF0ZSkpO1xuXHRcdH0sXG5cblx0XHQvLyBob3VycyB3aXRoIGxlYWRpbmcgemVybyBlLmcuIDAzXG5cdFx0SDogZnVuY3Rpb24gSChkYXRlKSB7XG5cdFx0XHRyZXR1cm4gRmxhdHBpY2tySW5zdGFuY2UucHJvdG90eXBlLnBhZChkYXRlLmdldEhvdXJzKCkpO1xuXHRcdH0sXG5cblx0XHQvLyBkYXkgKDEtMzApIHdpdGggb3JkaW5hbCBzdWZmaXggZS5nLiAxc3QsIDJuZFxuXHRcdEo6IGZ1bmN0aW9uIEooZGF0ZSkge1xuXHRcdFx0cmV0dXJuIGRhdGUuZ2V0RGF0ZSgpICsgdGhpcy5sMTBuLm9yZGluYWwoZGF0ZS5nZXREYXRlKCkpO1xuXHRcdH0sXG5cblx0XHQvLyBBTS9QTVxuXHRcdEs6IGZ1bmN0aW9uIEsoZGF0ZSkge1xuXHRcdFx0cmV0dXJuIGRhdGUuZ2V0SG91cnMoKSA+IDExID8gXCJQTVwiIDogXCJBTVwiO1xuXHRcdH0sXG5cblx0XHQvLyBzaG9ydGhhbmQgbW9udGggZS5nLiBKYW4sIFNlcCwgT2N0LCBldGNcblx0XHRNOiBmdW5jdGlvbiBNKGRhdGUpIHtcblx0XHRcdHJldHVybiB0aGlzLnV0aWxzLm1vbnRoVG9TdHIoZGF0ZS5nZXRNb250aCgpLCB0cnVlKTtcblx0XHR9LFxuXG5cdFx0Ly8gc2Vjb25kcyAwMC01OVxuXHRcdFM6IGZ1bmN0aW9uIFMoZGF0ZSkge1xuXHRcdFx0cmV0dXJuIEZsYXRwaWNrckluc3RhbmNlLnByb3RvdHlwZS5wYWQoZGF0ZS5nZXRTZWNvbmRzKCkpO1xuXHRcdH0sXG5cblx0XHQvLyB1bml4IHRpbWVzdGFtcFxuXHRcdFU6IGZ1bmN0aW9uIFUoZGF0ZSkge1xuXHRcdFx0cmV0dXJuIGRhdGUuZ2V0VGltZSgpIC8gMTAwMDtcblx0XHR9LFxuXG5cdFx0VzogZnVuY3Rpb24gVyhkYXRlKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5jb25maWcuZ2V0V2VlayhkYXRlKTtcblx0XHR9LFxuXG5cdFx0Ly8gZnVsbCB5ZWFyIGUuZy4gMjAxNlxuXHRcdFk6IGZ1bmN0aW9uIFkoZGF0ZSkge1xuXHRcdFx0cmV0dXJuIGRhdGUuZ2V0RnVsbFllYXIoKTtcblx0XHR9LFxuXG5cdFx0Ly8gZGF5IGluIG1vbnRoLCBwYWRkZWQgKDAxLTMwKVxuXHRcdGQ6IGZ1bmN0aW9uIGQoZGF0ZSkge1xuXHRcdFx0cmV0dXJuIEZsYXRwaWNrckluc3RhbmNlLnByb3RvdHlwZS5wYWQoZGF0ZS5nZXREYXRlKCkpO1xuXHRcdH0sXG5cblx0XHQvLyBob3VyIGZyb20gMS0xMiAoYW0vcG0pXG5cdFx0aDogZnVuY3Rpb24gaChkYXRlKSB7XG5cdFx0XHRyZXR1cm4gZGF0ZS5nZXRIb3VycygpICUgMTIgPyBkYXRlLmdldEhvdXJzKCkgJSAxMiA6IDEyO1xuXHRcdH0sXG5cblx0XHQvLyBtaW51dGVzLCBwYWRkZWQgd2l0aCBsZWFkaW5nIHplcm8gZS5nLiAwOVxuXHRcdGk6IGZ1bmN0aW9uIGkoZGF0ZSkge1xuXHRcdFx0cmV0dXJuIEZsYXRwaWNrckluc3RhbmNlLnByb3RvdHlwZS5wYWQoZGF0ZS5nZXRNaW51dGVzKCkpO1xuXHRcdH0sXG5cblx0XHQvLyBkYXkgaW4gbW9udGggKDEtMzApXG5cdFx0ajogZnVuY3Rpb24gaihkYXRlKSB7XG5cdFx0XHRyZXR1cm4gZGF0ZS5nZXREYXRlKCk7XG5cdFx0fSxcblxuXHRcdC8vIHdlZWtkYXkgbmFtZSwgZnVsbCwgZS5nLiBUaHVyc2RheVxuXHRcdGw6IGZ1bmN0aW9uIGwoZGF0ZSkge1xuXHRcdFx0cmV0dXJuIHRoaXMubDEwbi53ZWVrZGF5cy5sb25naGFuZFtkYXRlLmdldERheSgpXTtcblx0XHR9LFxuXG5cdFx0Ly8gcGFkZGVkIG1vbnRoIG51bWJlciAoMDEtMTIpXG5cdFx0bTogZnVuY3Rpb24gbShkYXRlKSB7XG5cdFx0XHRyZXR1cm4gRmxhdHBpY2tySW5zdGFuY2UucHJvdG90eXBlLnBhZChkYXRlLmdldE1vbnRoKCkgKyAxKTtcblx0XHR9LFxuXG5cdFx0Ly8gdGhlIG1vbnRoIG51bWJlciAoMS0xMilcblx0XHRuOiBmdW5jdGlvbiBuKGRhdGUpIHtcblx0XHRcdHJldHVybiBkYXRlLmdldE1vbnRoKCkgKyAxO1xuXHRcdH0sXG5cblx0XHQvLyBzZWNvbmRzIDAtNTlcblx0XHRzOiBmdW5jdGlvbiBzKGRhdGUpIHtcblx0XHRcdHJldHVybiBkYXRlLmdldFNlY29uZHMoKTtcblx0XHR9LFxuXG5cdFx0Ly8gbnVtYmVyIG9mIHRoZSBkYXkgb2YgdGhlIHdlZWtcblx0XHR3OiBmdW5jdGlvbiB3KGRhdGUpIHtcblx0XHRcdHJldHVybiBkYXRlLmdldERheSgpO1xuXHRcdH0sXG5cblx0XHQvLyBsYXN0IHR3byBkaWdpdHMgb2YgeWVhciBlLmcuIDE2IGZvciAyMDE2XG5cdFx0eTogZnVuY3Rpb24geShkYXRlKSB7XG5cdFx0XHRyZXR1cm4gU3RyaW5nKGRhdGUuZ2V0RnVsbFllYXIoKSkuc3Vic3RyaW5nKDIpO1xuXHRcdH1cblx0fSxcblxuXHQvKipcbiAgKiBGb3JtYXRzIGEgZ2l2ZW4gRGF0ZSBvYmplY3QgaW50byBhIHN0cmluZyBiYXNlZCBvbiBzdXBwbGllZCBmb3JtYXRcbiAgKiBAcGFyYW0ge0RhdGV9IGRhdGVPYmogdGhlIGRhdGUgb2JqZWN0XG4gICogQHBhcmFtIHtTdHJpbmd9IGZybXQgYSBzdHJpbmcgY29tcG9zZWQgb2YgZm9ybWF0dGluZyB0b2tlbnMgZS5nLiBcIlktbS1kXCJcbiAgKiBAcmV0dXJuIHtTdHJpbmd9IFRoZSB0ZXh0dWFsIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBkYXRlIGUuZy4gMjAxNy0wMi0wM1xuICAqL1xuXHRmb3JtYXREYXRlOiBmdW5jdGlvbiBmb3JtYXREYXRlKGRhdGVPYmosIGZybXQpIHtcblx0XHR2YXIgX3RoaXMgPSB0aGlzO1xuXG5cdFx0aWYgKHRoaXMuY29uZmlnICE9PSB1bmRlZmluZWQgJiYgdGhpcy5jb25maWcuZm9ybWF0RGF0ZSAhPT0gdW5kZWZpbmVkKSByZXR1cm4gdGhpcy5jb25maWcuZm9ybWF0RGF0ZShkYXRlT2JqLCBmcm10KTtcblxuXHRcdHJldHVybiBmcm10LnNwbGl0KFwiXCIpLm1hcChmdW5jdGlvbiAoYywgaSwgYXJyKSB7XG5cdFx0XHRyZXR1cm4gX3RoaXMuZm9ybWF0c1tjXSAmJiBhcnJbaSAtIDFdICE9PSBcIlxcXFxcIiA/IF90aGlzLmZvcm1hdHNbY10oZGF0ZU9iaikgOiBjICE9PSBcIlxcXFxcIiA/IGMgOiBcIlwiO1xuXHRcdH0pLmpvaW4oXCJcIik7XG5cdH0sXG5cblxuXHRyZXZGb3JtYXQ6IHtcblx0XHREOiBmdW5jdGlvbiBEKCkge30sXG5cdFx0RjogZnVuY3Rpb24gRihkYXRlT2JqLCBtb250aE5hbWUpIHtcblx0XHRcdGRhdGVPYmouc2V0TW9udGgodGhpcy5sMTBuLm1vbnRocy5sb25naGFuZC5pbmRleE9mKG1vbnRoTmFtZSkpO1xuXHRcdH0sXG5cdFx0RzogZnVuY3Rpb24gRyhkYXRlT2JqLCBob3VyKSB7XG5cdFx0XHRkYXRlT2JqLnNldEhvdXJzKHBhcnNlRmxvYXQoaG91cikpO1xuXHRcdH0sXG5cdFx0SDogZnVuY3Rpb24gSChkYXRlT2JqLCBob3VyKSB7XG5cdFx0XHRkYXRlT2JqLnNldEhvdXJzKHBhcnNlRmxvYXQoaG91cikpO1xuXHRcdH0sXG5cdFx0SjogZnVuY3Rpb24gSihkYXRlT2JqLCBkYXkpIHtcblx0XHRcdGRhdGVPYmouc2V0RGF0ZShwYXJzZUZsb2F0KGRheSkpO1xuXHRcdH0sXG5cdFx0SzogZnVuY3Rpb24gSyhkYXRlT2JqLCBhbVBNKSB7XG5cdFx0XHR2YXIgaG91cnMgPSBkYXRlT2JqLmdldEhvdXJzKCk7XG5cblx0XHRcdGlmIChob3VycyAhPT0gMTIpIGRhdGVPYmouc2V0SG91cnMoaG91cnMgJSAxMiArIDEyICogL3BtL2kudGVzdChhbVBNKSk7XG5cdFx0fSxcblx0XHRNOiBmdW5jdGlvbiBNKGRhdGVPYmosIHNob3J0TW9udGgpIHtcblx0XHRcdGRhdGVPYmouc2V0TW9udGgodGhpcy5sMTBuLm1vbnRocy5zaG9ydGhhbmQuaW5kZXhPZihzaG9ydE1vbnRoKSk7XG5cdFx0fSxcblx0XHRTOiBmdW5jdGlvbiBTKGRhdGVPYmosIHNlY29uZHMpIHtcblx0XHRcdGRhdGVPYmouc2V0U2Vjb25kcyhzZWNvbmRzKTtcblx0XHR9LFxuXHRcdFU6IGZ1bmN0aW9uIFUoZGF0ZU9iaiwgdW5peFNlY29uZHMpIHtcblx0XHRcdHJldHVybiBuZXcgRGF0ZShwYXJzZUZsb2F0KHVuaXhTZWNvbmRzKSAqIDEwMDApO1xuXHRcdH0sXG5cblx0XHRXOiBmdW5jdGlvbiBXKGRhdGVPYmosIHdlZWtOdW1iZXIpIHtcblx0XHRcdHdlZWtOdW1iZXIgPSBwYXJzZUludCh3ZWVrTnVtYmVyKTtcblx0XHRcdHJldHVybiBuZXcgRGF0ZShkYXRlT2JqLmdldEZ1bGxZZWFyKCksIDAsIDIgKyAod2Vla051bWJlciAtIDEpICogNywgMCwgMCwgMCwgMCwgMCk7XG5cdFx0fSxcblx0XHRZOiBmdW5jdGlvbiBZKGRhdGVPYmosIHllYXIpIHtcblx0XHRcdGRhdGVPYmouc2V0RnVsbFllYXIoeWVhcik7XG5cdFx0fSxcblx0XHRaOiBmdW5jdGlvbiBaKGRhdGVPYmosIElTT0RhdGUpIHtcblx0XHRcdHJldHVybiBuZXcgRGF0ZShJU09EYXRlKTtcblx0XHR9LFxuXG5cdFx0ZDogZnVuY3Rpb24gZChkYXRlT2JqLCBkYXkpIHtcblx0XHRcdGRhdGVPYmouc2V0RGF0ZShwYXJzZUZsb2F0KGRheSkpO1xuXHRcdH0sXG5cdFx0aDogZnVuY3Rpb24gaChkYXRlT2JqLCBob3VyKSB7XG5cdFx0XHRkYXRlT2JqLnNldEhvdXJzKHBhcnNlRmxvYXQoaG91cikpO1xuXHRcdH0sXG5cdFx0aTogZnVuY3Rpb24gaShkYXRlT2JqLCBtaW51dGVzKSB7XG5cdFx0XHRkYXRlT2JqLnNldE1pbnV0ZXMocGFyc2VGbG9hdChtaW51dGVzKSk7XG5cdFx0fSxcblx0XHRqOiBmdW5jdGlvbiBqKGRhdGVPYmosIGRheSkge1xuXHRcdFx0ZGF0ZU9iai5zZXREYXRlKHBhcnNlRmxvYXQoZGF5KSk7XG5cdFx0fSxcblx0XHRsOiBmdW5jdGlvbiBsKCkge30sXG5cdFx0bTogZnVuY3Rpb24gbShkYXRlT2JqLCBtb250aCkge1xuXHRcdFx0ZGF0ZU9iai5zZXRNb250aChwYXJzZUZsb2F0KG1vbnRoKSAtIDEpO1xuXHRcdH0sXG5cdFx0bjogZnVuY3Rpb24gbihkYXRlT2JqLCBtb250aCkge1xuXHRcdFx0ZGF0ZU9iai5zZXRNb250aChwYXJzZUZsb2F0KG1vbnRoKSAtIDEpO1xuXHRcdH0sXG5cdFx0czogZnVuY3Rpb24gcyhkYXRlT2JqLCBzZWNvbmRzKSB7XG5cdFx0XHRkYXRlT2JqLnNldFNlY29uZHMocGFyc2VGbG9hdChzZWNvbmRzKSk7XG5cdFx0fSxcblx0XHR3OiBmdW5jdGlvbiB3KCkge30sXG5cdFx0eTogZnVuY3Rpb24geShkYXRlT2JqLCB5ZWFyKSB7XG5cdFx0XHRkYXRlT2JqLnNldEZ1bGxZZWFyKDIwMDAgKyBwYXJzZUZsb2F0KHllYXIpKTtcblx0XHR9XG5cdH0sXG5cblx0dG9rZW5SZWdleDoge1xuXHRcdEQ6IFwiKFxcXFx3KylcIixcblx0XHRGOiBcIihcXFxcdyspXCIsXG5cdFx0RzogXCIoXFxcXGRcXFxcZHxcXFxcZClcIixcblx0XHRIOiBcIihcXFxcZFxcXFxkfFxcXFxkKVwiLFxuXHRcdEo6IFwiKFxcXFxkXFxcXGR8XFxcXGQpXFxcXHcrXCIsXG5cdFx0SzogXCIoYW18QU18QW18YU18cG18UE18UG18cE0pXCIsXG5cdFx0TTogXCIoXFxcXHcrKVwiLFxuXHRcdFM6IFwiKFxcXFxkXFxcXGR8XFxcXGQpXCIsXG5cdFx0VTogXCIoLispXCIsXG5cdFx0VzogXCIoXFxcXGRcXFxcZHxcXFxcZClcIixcblx0XHRZOiBcIihcXFxcZHs0fSlcIixcblx0XHRaOiBcIiguKylcIixcblx0XHRkOiBcIihcXFxcZFxcXFxkfFxcXFxkKVwiLFxuXHRcdGg6IFwiKFxcXFxkXFxcXGR8XFxcXGQpXCIsXG5cdFx0aTogXCIoXFxcXGRcXFxcZHxcXFxcZClcIixcblx0XHRqOiBcIihcXFxcZFxcXFxkfFxcXFxkKVwiLFxuXHRcdGw6IFwiKFxcXFx3KylcIixcblx0XHRtOiBcIihcXFxcZFxcXFxkfFxcXFxkKVwiLFxuXHRcdG46IFwiKFxcXFxkXFxcXGR8XFxcXGQpXCIsXG5cdFx0czogXCIoXFxcXGRcXFxcZHxcXFxcZClcIixcblx0XHR3OiBcIihcXFxcZFxcXFxkfFxcXFxkKVwiLFxuXHRcdHk6IFwiKFxcXFxkezJ9KVwiXG5cdH0sXG5cblx0cGFkOiBmdW5jdGlvbiBwYWQobnVtYmVyKSB7XG5cdFx0cmV0dXJuIChcIjBcIiArIG51bWJlcikuc2xpY2UoLTIpO1xuXHR9LFxuXG5cdC8qKlxuICAqIFBhcnNlcyBhIGRhdGUoK3RpbWUpIHN0cmluZyBpbnRvIGEgRGF0ZSBvYmplY3RcbiAgKiBAcGFyYW0ge1N0cmluZ30gZGF0ZSB0aGUgZGF0ZSBzdHJpbmcsIGUuZy4gMjAxNy0wMi0wMyAxNDo0NVxuICAqIEBwYXJhbSB7U3RyaW5nfSBnaXZlbkZvcm1hdCB0aGUgZGF0ZSBmb3JtYXQsIGUuZy4gWS1tLWQgSDppXG4gICogQHBhcmFtIHtCb29sZWFufSB0aW1lbGVzcyB3aGV0aGVyIHRvIHJlc2V0IHRoZSB0aW1lIG9mIERhdGUgb2JqZWN0XG4gICogQHJldHVybiB7RGF0ZX0gdGhlIHBhcnNlZCBEYXRlIG9iamVjdFxuICAqL1xuXHRwYXJzZURhdGU6IGZ1bmN0aW9uIHBhcnNlRGF0ZShkYXRlLCBnaXZlbkZvcm1hdCwgdGltZWxlc3MpIHtcblx0XHR2YXIgX3RoaXMyID0gdGhpcztcblxuXHRcdGlmIChkYXRlICE9PSAwICYmICFkYXRlKSByZXR1cm4gbnVsbDtcblxuXHRcdHZhciBkYXRlX29yaWcgPSBkYXRlO1xuXG5cdFx0aWYgKGRhdGUgaW5zdGFuY2VvZiBEYXRlKSBkYXRlID0gbmV3IERhdGUoZGF0ZS5nZXRUaW1lKCkpOyAvLyBjcmVhdGUgYSBjb3B5XG5cblx0XHRlbHNlIGlmIChkYXRlLnRvRml4ZWQgIT09IHVuZGVmaW5lZCkgLy8gdGltZXN0YW1wXG5cdFx0XHRcdGRhdGUgPSBuZXcgRGF0ZShkYXRlKTtlbHNlIHtcblx0XHRcdFx0Ly8gZGF0ZSBzdHJpbmdcblx0XHRcdFx0dmFyIGZvcm1hdCA9IGdpdmVuRm9ybWF0IHx8ICh0aGlzLmNvbmZpZyB8fCBmbGF0cGlja3IuZGVmYXVsdENvbmZpZykuZGF0ZUZvcm1hdDtcblx0XHRcdFx0ZGF0ZSA9IFN0cmluZyhkYXRlKS50cmltKCk7XG5cblx0XHRcdFx0aWYgKGRhdGUgPT09IFwidG9kYXlcIikge1xuXHRcdFx0XHRcdGRhdGUgPSBuZXcgRGF0ZSgpO1xuXHRcdFx0XHRcdHRpbWVsZXNzID0gdHJ1ZTtcblx0XHRcdFx0fSBlbHNlIGlmICgvWiQvLnRlc3QoZGF0ZSkgfHwgL0dNVCQvLnRlc3QoZGF0ZSkpIC8vIGRhdGVzdHJpbmdzIHcvIHRpbWV6b25lXG5cdFx0XHRcdFx0ZGF0ZSA9IG5ldyBEYXRlKGRhdGUpO2Vsc2UgaWYgKHRoaXMuY29uZmlnICYmIHRoaXMuY29uZmlnLnBhcnNlRGF0ZSkgZGF0ZSA9IHRoaXMuY29uZmlnLnBhcnNlRGF0ZShkYXRlLCBmb3JtYXQpO2Vsc2Uge1xuXHRcdFx0XHRcdChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHR2YXIgcGFyc2VkRGF0ZSA9ICFfdGhpczIuY29uZmlnIHx8ICFfdGhpczIuY29uZmlnLm5vQ2FsZW5kYXIgPyBuZXcgRGF0ZShuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCksIDAsIDEsIDAsIDAsIDAsIDApIDogbmV3IERhdGUobmV3IERhdGUoKS5zZXRIb3VycygwLCAwLCAwLCAwKSk7XG5cblx0XHRcdFx0XHRcdHZhciBtYXRjaGVkID0gdm9pZCAwLFxuXHRcdFx0XHRcdFx0ICAgIG9wcyA9IFtdO1xuXG5cdFx0XHRcdFx0XHRmb3IgKHZhciBpID0gMCwgbWF0Y2hJbmRleCA9IDAsIHJlZ2V4U3RyID0gXCJcIjsgaSA8IGZvcm1hdC5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdFx0XHR2YXIgdG9rZW4gPSBmb3JtYXRbaV07XG5cdFx0XHRcdFx0XHRcdHZhciBpc0JhY2tTbGFzaCA9IHRva2VuID09PSBcIlxcXFxcIjtcblx0XHRcdFx0XHRcdFx0dmFyIGVzY2FwZWQgPSBmb3JtYXRbaSAtIDFdID09PSBcIlxcXFxcIiB8fCBpc0JhY2tTbGFzaDtcblxuXHRcdFx0XHRcdFx0XHRpZiAoX3RoaXMyLnRva2VuUmVnZXhbdG9rZW5dICYmICFlc2NhcGVkKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmVnZXhTdHIgKz0gX3RoaXMyLnRva2VuUmVnZXhbdG9rZW5dO1xuXHRcdFx0XHRcdFx0XHRcdHZhciBtYXRjaCA9IG5ldyBSZWdFeHAocmVnZXhTdHIpLmV4ZWMoZGF0ZSk7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKG1hdGNoICYmIChtYXRjaGVkID0gdHJ1ZSkpIHtcblx0XHRcdFx0XHRcdFx0XHRcdG9wc1t0b2tlbiAhPT0gXCJZXCIgPyBcInB1c2hcIiA6IFwidW5zaGlmdFwiXSh7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGZuOiBfdGhpczIucmV2Rm9ybWF0W3Rva2VuXSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0dmFsOiBtYXRjaFsrK21hdGNoSW5kZXhdXG5cdFx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoIWlzQmFja1NsYXNoKSByZWdleFN0ciArPSBcIi5cIjsgLy8gZG9uJ3QgcmVhbGx5IGNhcmVcblxuXHRcdFx0XHRcdFx0XHRvcHMuZm9yRWFjaChmdW5jdGlvbiAoX3JlZikge1xuXHRcdFx0XHRcdFx0XHRcdHZhciBmbiA9IF9yZWYuZm4sXG5cdFx0XHRcdFx0XHRcdFx0ICAgIHZhbCA9IF9yZWYudmFsO1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBwYXJzZWREYXRlID0gZm4ocGFyc2VkRGF0ZSwgdmFsKSB8fCBwYXJzZWREYXRlO1xuXHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0ZGF0ZSA9IG1hdGNoZWQgPyBwYXJzZWREYXRlIDogbnVsbDtcblx0XHRcdFx0XHR9KSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHQvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuXHRcdGlmICghKGRhdGUgaW5zdGFuY2VvZiBEYXRlKSkge1xuXHRcdFx0Y29uc29sZS53YXJuKFwiZmxhdHBpY2tyOiBpbnZhbGlkIGRhdGUgXCIgKyBkYXRlX29yaWcpO1xuXHRcdFx0Y29uc29sZS5pbmZvKHRoaXMuZWxlbWVudCk7XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cblx0XHRpZiAodGltZWxlc3MgPT09IHRydWUpIGRhdGUuc2V0SG91cnMoMCwgMCwgMCwgMCk7XG5cblx0XHRyZXR1cm4gZGF0ZTtcblx0fVxufTtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbmZ1bmN0aW9uIF9mbGF0cGlja3Iobm9kZUxpc3QsIGNvbmZpZykge1xuXHR2YXIgbm9kZXMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChub2RlTGlzdCk7IC8vIHN0YXRpYyBsaXN0XG5cdHZhciBpbnN0YW5jZXMgPSBbXTtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuXHRcdHRyeSB7XG5cdFx0XHRpZiAobm9kZXNbaV0uZ2V0QXR0cmlidXRlKFwiZGF0YS1mcC1vbWl0XCIpICE9PSBudWxsKSBjb250aW51ZTtcblxuXHRcdFx0aWYgKG5vZGVzW2ldLl9mbGF0cGlja3IpIHtcblx0XHRcdFx0bm9kZXNbaV0uX2ZsYXRwaWNrci5kZXN0cm95KCk7XG5cdFx0XHRcdG5vZGVzW2ldLl9mbGF0cGlja3IgPSBudWxsO1xuXHRcdFx0fVxuXG5cdFx0XHRub2Rlc1tpXS5fZmxhdHBpY2tyID0gbmV3IEZsYXRwaWNrckluc3RhbmNlKG5vZGVzW2ldLCBjb25maWcgfHwge30pO1xuXHRcdFx0aW5zdGFuY2VzLnB1c2gobm9kZXNbaV0uX2ZsYXRwaWNrcik7XG5cdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0Y29uc29sZS53YXJuKGUsIGUuc3RhY2spO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiBpbnN0YW5jZXMubGVuZ3RoID09PSAxID8gaW5zdGFuY2VzWzBdIDogaW5zdGFuY2VzO1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuaWYgKHR5cGVvZiBIVE1MRWxlbWVudCAhPT0gXCJ1bmRlZmluZWRcIikge1xuXHQvLyBicm93c2VyIGVudlxuXHRIVE1MQ29sbGVjdGlvbi5wcm90b3R5cGUuZmxhdHBpY2tyID0gTm9kZUxpc3QucHJvdG90eXBlLmZsYXRwaWNrciA9IGZ1bmN0aW9uIChjb25maWcpIHtcblx0XHRyZXR1cm4gX2ZsYXRwaWNrcih0aGlzLCBjb25maWcpO1xuXHR9O1xuXG5cdEhUTUxFbGVtZW50LnByb3RvdHlwZS5mbGF0cGlja3IgPSBmdW5jdGlvbiAoY29uZmlnKSB7XG5cdFx0cmV0dXJuIF9mbGF0cGlja3IoW3RoaXNdLCBjb25maWcpO1xuXHR9O1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuZnVuY3Rpb24gZmxhdHBpY2tyKHNlbGVjdG9yLCBjb25maWcpIHtcblx0aWYgKHNlbGVjdG9yIGluc3RhbmNlb2YgTm9kZUxpc3QpIHJldHVybiBfZmxhdHBpY2tyKHNlbGVjdG9yLCBjb25maWcpO2Vsc2UgaWYgKCEoc2VsZWN0b3IgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkpIHJldHVybiBfZmxhdHBpY2tyKHdpbmRvdy5kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKSwgY29uZmlnKTtcblxuXHRyZXR1cm4gX2ZsYXRwaWNrcihbc2VsZWN0b3JdLCBjb25maWcpO1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuZmxhdHBpY2tyLmRlZmF1bHRDb25maWcgPSBGbGF0cGlja3JJbnN0YW5jZS5kZWZhdWx0Q29uZmlnID0ge1xuXHRtb2RlOiBcInNpbmdsZVwiLFxuXG5cdHBvc2l0aW9uOiBcImF1dG9cIixcblxuXHRhbmltYXRlOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiICYmIHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJNU0lFXCIpID09PSAtMSxcblxuXHQvLyB3cmFwOiBzZWUgaHR0cHM6Ly9jaG1sbi5naXRodWIuaW8vZmxhdHBpY2tyL2V4YW1wbGVzLyNmbGF0cGlja3ItZXh0ZXJuYWwtZWxlbWVudHNcblx0d3JhcDogZmFsc2UsXG5cblx0Ly8gZW5hYmxlcyB3ZWVrIG51bWJlcnNcblx0d2Vla051bWJlcnM6IGZhbHNlLFxuXG5cdC8vIGFsbG93IG1hbnVhbCBkYXRldGltZSBpbnB1dFxuXHRhbGxvd0lucHV0OiBmYWxzZSxcblxuXHQvKlxuIFx0Y2xpY2tpbmcgb24gaW5wdXQgb3BlbnMgdGhlIGRhdGUodGltZSlwaWNrZXIuXG4gXHRkaXNhYmxlIGlmIHlvdSB3aXNoIHRvIG9wZW4gdGhlIGNhbGVuZGFyIG1hbnVhbGx5IHdpdGggLm9wZW4oKVxuICovXG5cdGNsaWNrT3BlbnM6IHRydWUsXG5cblx0LypcbiBcdGNsb3NlcyBjYWxlbmRhciBhZnRlciBkYXRlIHNlbGVjdGlvbixcbiBcdHVubGVzcyAnbW9kZScgaXMgJ211bHRpcGxlJyBvciBlbmFibGVUaW1lIGlzIHRydWVcbiAqL1xuXHRjbG9zZU9uU2VsZWN0OiB0cnVlLFxuXG5cdC8vIGRpc3BsYXkgdGltZSBwaWNrZXIgaW4gMjQgaG91ciBtb2RlXG5cdHRpbWVfMjRocjogZmFsc2UsXG5cblx0Ly8gZW5hYmxlcyB0aGUgdGltZSBwaWNrZXIgZnVuY3Rpb25hbGl0eVxuXHRlbmFibGVUaW1lOiBmYWxzZSxcblxuXHQvLyBub0NhbGVuZGFyOiB0cnVlIHdpbGwgaGlkZSB0aGUgY2FsZW5kYXIuIHVzZSBmb3IgYSB0aW1lIHBpY2tlciBhbG9uZyB3LyBlbmFibGVUaW1lXG5cdG5vQ2FsZW5kYXI6IGZhbHNlLFxuXG5cdC8vIG1vcmUgZGF0ZSBmb3JtYXQgY2hhcnMgYXQgaHR0cHM6Ly9jaG1sbi5naXRodWIuaW8vZmxhdHBpY2tyLyNkYXRlZm9ybWF0XG5cdGRhdGVGb3JtYXQ6IFwiWS1tLWRcIixcblxuXHQvLyBkYXRlIGZvcm1hdCB1c2VkIGluIGFyaWEtbGFiZWwgZm9yIGRheXNcblx0YXJpYURhdGVGb3JtYXQ6IFwiRiBqLCBZXCIsXG5cblx0Ly8gYWx0SW5wdXQgLSBzZWUgaHR0cHM6Ly9jaG1sbi5naXRodWIuaW8vZmxhdHBpY2tyLyNhbHRpbnB1dFxuXHRhbHRJbnB1dDogZmFsc2UsXG5cblx0Ly8gdGhlIGNyZWF0ZWQgYWx0SW5wdXQgZWxlbWVudCB3aWxsIGhhdmUgdGhpcyBjbGFzcy5cblx0YWx0SW5wdXRDbGFzczogXCJmb3JtLWNvbnRyb2wgaW5wdXRcIixcblxuXHQvLyBzYW1lIGFzIGRhdGVGb3JtYXQsIGJ1dCBmb3IgYWx0SW5wdXRcblx0YWx0Rm9ybWF0OiBcIkYgaiwgWVwiLCAvLyBkZWZhdWx0cyB0byBlLmcuIEp1bmUgMTAsIDIwMTZcblxuXHQvLyBkZWZhdWx0RGF0ZSAtIGVpdGhlciBhIGRhdGVzdHJpbmcgb3IgYSBkYXRlIG9iamVjdC4gdXNlZCBmb3IgZGF0ZXRpbWVwaWNrZXJcInMgaW5pdGlhbCB2YWx1ZVxuXHRkZWZhdWx0RGF0ZTogbnVsbCxcblxuXHQvLyB0aGUgbWluaW11bSBkYXRlIHRoYXQgdXNlciBjYW4gcGljayAoaW5jbHVzaXZlKVxuXHRtaW5EYXRlOiBudWxsLFxuXG5cdC8vIHRoZSBtYXhpbXVtIGRhdGUgdGhhdCB1c2VyIGNhbiBwaWNrIChpbmNsdXNpdmUpXG5cdG1heERhdGU6IG51bGwsXG5cblx0Ly8gZGF0ZXBhcnNlciB0aGF0IHRyYW5zZm9ybXMgYSBnaXZlbiBzdHJpbmcgdG8gYSBkYXRlIG9iamVjdFxuXHRwYXJzZURhdGU6IG51bGwsXG5cblx0Ly8gZGF0ZWZvcm1hdHRlciB0aGF0IHRyYW5zZm9ybXMgYSBnaXZlbiBkYXRlIG9iamVjdCB0byBhIHN0cmluZywgYWNjb3JkaW5nIHRvIHBhc3NlZCBmb3JtYXRcblx0Zm9ybWF0RGF0ZTogbnVsbCxcblxuXHRnZXRXZWVrOiBmdW5jdGlvbiBnZXRXZWVrKGdpdmVuRGF0ZSkge1xuXHRcdHZhciBkYXRlID0gbmV3IERhdGUoZ2l2ZW5EYXRlLmdldFRpbWUoKSk7XG5cdFx0dmFyIG9uZWphbiA9IG5ldyBEYXRlKGRhdGUuZ2V0RnVsbFllYXIoKSwgMCwgMSk7XG5cdFx0cmV0dXJuIE1hdGguY2VpbCgoKGRhdGUgLSBvbmVqYW4pIC8gODY0MDAwMDAgKyBvbmVqYW4uZ2V0RGF5KCkgKyAxKSAvIDcpO1xuXHR9LFxuXG5cblx0Ly8gc2VlIGh0dHBzOi8vY2htbG4uZ2l0aHViLmlvL2ZsYXRwaWNrci8jZGlzYWJsZVxuXHRlbmFibGU6IFtdLFxuXG5cdC8vIHNlZSBodHRwczovL2NobWxuLmdpdGh1Yi5pby9mbGF0cGlja3IvI2Rpc2FibGVcblx0ZGlzYWJsZTogW10sXG5cblx0Ly8gZGlzcGxheSB0aGUgc2hvcnQgdmVyc2lvbiBvZiBtb250aCBuYW1lcyAtIGUuZy4gU2VwIGluc3RlYWQgb2YgU2VwdGVtYmVyXG5cdHNob3J0aGFuZEN1cnJlbnRNb250aDogZmFsc2UsXG5cblx0Ly8gZGlzcGxheXMgY2FsZW5kYXIgaW5saW5lLiBzZWUgaHR0cHM6Ly9jaG1sbi5naXRodWIuaW8vZmxhdHBpY2tyLyNpbmxpbmUtY2FsZW5kYXJcblx0aW5saW5lOiBmYWxzZSxcblxuXHQvLyBwb3NpdGlvbiBjYWxlbmRhciBpbnNpZGUgd3JhcHBlciBhbmQgbmV4dCB0byB0aGUgaW5wdXQgZWxlbWVudFxuXHQvLyBsZWF2ZSBhdCBmYWxzZSB1bmxlc3MgeW91IGtub3cgd2hhdCB5b3VcInJlIGRvaW5nXG5cdFwic3RhdGljXCI6IGZhbHNlLFxuXG5cdC8vIERPTSBub2RlIHRvIGFwcGVuZCB0aGUgY2FsZW5kYXIgdG8gaW4gKnN0YXRpYyogbW9kZVxuXHRhcHBlbmRUbzogbnVsbCxcblxuXHQvLyBjb2RlIGZvciBwcmV2aW91cy9uZXh0IGljb25zLiB0aGlzIGlzIHdoZXJlIHlvdSBwdXQgeW91ciBjdXN0b20gaWNvbiBjb2RlIGUuZy4gZm9udGF3ZXNvbWVcblx0cHJldkFycm93OiBcIjxzdmcgdmVyc2lvbj0nMS4xJyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHhtbG5zOnhsaW5rPSdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJyB2aWV3Qm94PScwIDAgMTcgMTcnPjxnPjwvZz48cGF0aCBkPSdNNS4yMDcgOC40NzFsNy4xNDYgNy4xNDctMC43MDcgMC43MDctNy44NTMtNy44NTQgNy44NTQtNy44NTMgMC43MDcgMC43MDctNy4xNDcgNy4xNDZ6JyAvPjwvc3ZnPlwiLFxuXHRuZXh0QXJyb3c6IFwiPHN2ZyB2ZXJzaW9uPScxLjEnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycgeG1sbnM6eGxpbms9J2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsnIHZpZXdCb3g9JzAgMCAxNyAxNyc+PGc+PC9nPjxwYXRoIGQ9J00xMy4yMDcgOC40NzJsLTcuODU0IDcuODU0LTAuNzA3LTAuNzA3IDcuMTQ2LTcuMTQ2LTcuMTQ2LTcuMTQ4IDAuNzA3LTAuNzA3IDcuODU0IDcuODU0eicgLz48L3N2Zz5cIixcblxuXHQvLyBlbmFibGVzIHNlY29uZHMgaW4gdGhlIHRpbWUgcGlja2VyXG5cdGVuYWJsZVNlY29uZHM6IGZhbHNlLFxuXG5cdC8vIHN0ZXAgc2l6ZSB1c2VkIHdoZW4gc2Nyb2xsaW5nL2luY3JlbWVudGluZyB0aGUgaG91ciBlbGVtZW50XG5cdGhvdXJJbmNyZW1lbnQ6IDEsXG5cblx0Ly8gc3RlcCBzaXplIHVzZWQgd2hlbiBzY3JvbGxpbmcvaW5jcmVtZW50aW5nIHRoZSBtaW51dGUgZWxlbWVudFxuXHRtaW51dGVJbmNyZW1lbnQ6IDUsXG5cblx0Ly8gaW5pdGlhbCB2YWx1ZSBpbiB0aGUgaG91ciBlbGVtZW50XG5cdGRlZmF1bHRIb3VyOiAxMixcblxuXHQvLyBpbml0aWFsIHZhbHVlIGluIHRoZSBtaW51dGUgZWxlbWVudFxuXHRkZWZhdWx0TWludXRlOiAwLFxuXG5cdC8vIGluaXRpYWwgdmFsdWUgaW4gdGhlIHNlY29uZHMgZWxlbWVudFxuXHRkZWZhdWx0U2Vjb25kczogMCxcblxuXHQvLyBkaXNhYmxlIG5hdGl2ZSBtb2JpbGUgZGF0ZXRpbWUgaW5wdXQgc3VwcG9ydFxuXHRkaXNhYmxlTW9iaWxlOiBmYWxzZSxcblxuXHQvLyBkZWZhdWx0IGxvY2FsZVxuXHRsb2NhbGU6IFwiZGVmYXVsdFwiLFxuXG5cdHBsdWdpbnM6IFtdLFxuXG5cdGlnbm9yZWRGb2N1c0VsZW1lbnRzOiBbXSxcblxuXHQvLyBjYWxsZWQgZXZlcnkgdGltZSBjYWxlbmRhciBpcyBjbG9zZWRcblx0b25DbG9zZTogdW5kZWZpbmVkLCAvLyBmdW5jdGlvbiAoZGF0ZU9iaiwgZGF0ZVN0cikge31cblxuXHQvLyBvbkNoYW5nZSBjYWxsYmFjayB3aGVuIHVzZXIgc2VsZWN0cyBhIGRhdGUgb3IgdGltZVxuXHRvbkNoYW5nZTogdW5kZWZpbmVkLCAvLyBmdW5jdGlvbiAoZGF0ZU9iaiwgZGF0ZVN0cikge31cblxuXHQvLyBjYWxsZWQgZm9yIGV2ZXJ5IGRheSBlbGVtZW50XG5cdG9uRGF5Q3JlYXRlOiB1bmRlZmluZWQsXG5cblx0Ly8gY2FsbGVkIGV2ZXJ5IHRpbWUgdGhlIG1vbnRoIGlzIGNoYW5nZWRcblx0b25Nb250aENoYW5nZTogdW5kZWZpbmVkLFxuXG5cdC8vIGNhbGxlZCBldmVyeSB0aW1lIGNhbGVuZGFyIGlzIG9wZW5lZFxuXHRvbk9wZW46IHVuZGVmaW5lZCwgLy8gZnVuY3Rpb24gKGRhdGVPYmosIGRhdGVTdHIpIHt9XG5cblx0Ly8gY2FsbGVkIGFmdGVyIHRoZSBjb25maWd1cmF0aW9uIGhhcyBiZWVuIHBhcnNlZFxuXHRvblBhcnNlQ29uZmlnOiB1bmRlZmluZWQsXG5cblx0Ly8gY2FsbGVkIGFmdGVyIGNhbGVuZGFyIGlzIHJlYWR5XG5cdG9uUmVhZHk6IHVuZGVmaW5lZCwgLy8gZnVuY3Rpb24gKGRhdGVPYmosIGRhdGVTdHIpIHt9XG5cblx0Ly8gY2FsbGVkIGFmdGVyIGlucHV0IHZhbHVlIHVwZGF0ZWRcblx0b25WYWx1ZVVwZGF0ZTogdW5kZWZpbmVkLFxuXG5cdC8vIGNhbGxlZCBldmVyeSB0aW1lIHRoZSB5ZWFyIGlzIGNoYW5nZWRcblx0b25ZZWFyQ2hhbmdlOiB1bmRlZmluZWQsXG5cblx0b25LZXlEb3duOiB1bmRlZmluZWQsXG5cblx0b25EZXN0cm95OiB1bmRlZmluZWRcbn07XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5mbGF0cGlja3IubDEwbnMgPSB7XG5cdGVuOiB7XG5cdFx0d2Vla2RheXM6IHtcblx0XHRcdHNob3J0aGFuZDogW1wiU3VuXCIsIFwiTW9uXCIsIFwiVHVlXCIsIFwiV2VkXCIsIFwiVGh1XCIsIFwiRnJpXCIsIFwiU2F0XCJdLFxuXHRcdFx0bG9uZ2hhbmQ6IFtcIlN1bmRheVwiLCBcIk1vbmRheVwiLCBcIlR1ZXNkYXlcIiwgXCJXZWRuZXNkYXlcIiwgXCJUaHVyc2RheVwiLCBcIkZyaWRheVwiLCBcIlNhdHVyZGF5XCJdXG5cdFx0fSxcblx0XHRtb250aHM6IHtcblx0XHRcdHNob3J0aGFuZDogW1wiSmFuXCIsIFwiRmViXCIsIFwiTWFyXCIsIFwiQXByXCIsIFwiTWF5XCIsIFwiSnVuXCIsIFwiSnVsXCIsIFwiQXVnXCIsIFwiU2VwXCIsIFwiT2N0XCIsIFwiTm92XCIsIFwiRGVjXCJdLFxuXHRcdFx0bG9uZ2hhbmQ6IFtcIkphbnVhcnlcIiwgXCJGZWJydWFyeVwiLCBcIk1hcmNoXCIsIFwiQXByaWxcIiwgXCJNYXlcIiwgXCJKdW5lXCIsIFwiSnVseVwiLCBcIkF1Z3VzdFwiLCBcIlNlcHRlbWJlclwiLCBcIk9jdG9iZXJcIiwgXCJOb3ZlbWJlclwiLCBcIkRlY2VtYmVyXCJdXG5cdFx0fSxcblx0XHRkYXlzSW5Nb250aDogWzMxLCAyOCwgMzEsIDMwLCAzMSwgMzAsIDMxLCAzMSwgMzAsIDMxLCAzMCwgMzFdLFxuXHRcdGZpcnN0RGF5T2ZXZWVrOiAwLFxuXHRcdG9yZGluYWw6IGZ1bmN0aW9uIG9yZGluYWwobnRoKSB7XG5cdFx0XHR2YXIgcyA9IG50aCAlIDEwMDtcblx0XHRcdGlmIChzID4gMyAmJiBzIDwgMjEpIHJldHVybiBcInRoXCI7XG5cdFx0XHRzd2l0Y2ggKHMgJSAxMCkge1xuXHRcdFx0XHRjYXNlIDE6XG5cdFx0XHRcdFx0cmV0dXJuIFwic3RcIjtcblx0XHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHRcdHJldHVybiBcIm5kXCI7XG5cdFx0XHRcdGNhc2UgMzpcblx0XHRcdFx0XHRyZXR1cm4gXCJyZFwiO1xuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdHJldHVybiBcInRoXCI7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRyYW5nZVNlcGFyYXRvcjogXCIgdG8gXCIsXG5cdFx0d2Vla0FiYnJldmlhdGlvbjogXCJXa1wiLFxuXHRcdHNjcm9sbFRpdGxlOiBcIlNjcm9sbCB0byBpbmNyZW1lbnRcIixcblx0XHR0b2dnbGVUaXRsZTogXCJDbGljayB0byB0b2dnbGVcIlxuXHR9XG59O1xuXG5mbGF0cGlja3IubDEwbnMuZGVmYXVsdCA9IE9iamVjdC5jcmVhdGUoZmxhdHBpY2tyLmwxMG5zLmVuKTtcbmZsYXRwaWNrci5sb2NhbGl6ZSA9IGZ1bmN0aW9uIChsMTBuKSB7XG5cdHJldHVybiBfZXh0ZW5kcyhmbGF0cGlja3IubDEwbnMuZGVmYXVsdCwgbDEwbiB8fCB7fSk7XG59O1xuZmxhdHBpY2tyLnNldERlZmF1bHRzID0gZnVuY3Rpb24gKGNvbmZpZykge1xuXHRyZXR1cm4gX2V4dGVuZHMoZmxhdHBpY2tyLmRlZmF1bHRDb25maWcsIGNvbmZpZyB8fCB7fSk7XG59O1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuaWYgKHR5cGVvZiBqUXVlcnkgIT09IFwidW5kZWZpbmVkXCIpIHtcblx0alF1ZXJ5LmZuLmZsYXRwaWNrciA9IGZ1bmN0aW9uIChjb25maWcpIHtcblx0XHRyZXR1cm4gX2ZsYXRwaWNrcih0aGlzLCBjb25maWcpO1xuXHR9O1xufVxuXG5EYXRlLnByb3RvdHlwZS5mcF9pbmNyID0gZnVuY3Rpb24gKGRheXMpIHtcblx0cmV0dXJuIG5ldyBEYXRlKHRoaXMuZ2V0RnVsbFllYXIoKSwgdGhpcy5nZXRNb250aCgpLCB0aGlzLmdldERhdGUoKSArIHBhcnNlSW50KGRheXMsIDEwKSk7XG59O1xuXG5pZiAodHlwZW9mIG1vZHVsZSAhPT0gXCJ1bmRlZmluZWRcIikgbW9kdWxlLmV4cG9ydHMgPSBmbGF0cGlja3I7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvZmxhdHBpY2tyL2Rpc3QvZmxhdHBpY2tyLmpzXG4vLyBtb2R1bGUgaWQgPSAyNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMiJdLCJzb3VyY2VSb290IjoiIn0=