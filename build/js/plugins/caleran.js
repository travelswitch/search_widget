/**
 *
 *                   888                                        d8b
 *                   888                                        Y8P
 *                   888
 *  .d8888b  8888b.  888  .d88b.  888d888 8888b.  88888b.      8888 .d8888b
 * d88P"        "88b 888 d8P  Y8b 888P"      "88b 888 "88b     "888 88K
 * 888      .d888888 888 88888888 888    .d888888 888  888      888 "Y8888b.
 * Y88b.    888  888 888 Y8b.     888    888  888 888  888 d8b  888      X88
 *  "Y8888P "Y888888 888  "Y8888  888    "Y888888 888  888 Y8P  888  88888P'
 *                                                              888
 *                                                             d88P
 *                                                           888P"
 *
 * @name: caleran.js - the multiple date range picker
 * @description: An inline/popup date range picker with multiple selected range support, now with plain JS
 * @version: 1.0.2
 * @author: Taha PAKSU <tpaksu@gmail.com>
 *
 *
 * Change Log:
 * ===========
 *
 * v1.0.0
 * ------
 * - released first version
 *
 * v1.0.1
 * ------
 * - Fix swipe month switch direction
 * - Fix mobile calendar height limit calculation
 * - Fix input focus on dropdown open
 * - Add better swipe detection
 *
 * v1.0.2
 * ------
 * - Fixed swiping issues
 *
 *
 *
 * Usage:
 * ------
 * caleran(".selector", {options});
 */
;
(function (window, document, undefined) {
    'use strict';
    /**
     *  The main caleran class
     *  @class caleran
     */
    var caleranPlugin = function (elem, options) {
        this.elem = elem;
        this.options = options;
        this.metadata = this.elem.getAttribute("data-plugin-options") ? JSON.parse(this.elem.getAttribute("data-plugin-options")) : {};
    };
    /**
     * Prototype of caleran plugin
     * @prototype caleran
     */
    caleranPlugin.prototype = {
        /////////////////////////////////////////////////////////////////////
        // public properties that can be set through plugin initialization //
        /////////////////////////////////////////////////////////////////////
        public: function () {
            return {
                startDate: moment().startOf('day'),                 // (d) the selected start date, initially today
                endDate: moment().startOf('day'),                   // (d) the selected end date, initially today
                format: "L",                                        // (d) the default format for showing in input, default short date format of locale
                dateSeparator: " - ",                               // (d) if not used as a single date picker, this will be the seperator
                calendarCount: 2,                                   // (d) how many calendars will be shown in the plugin screen
                mobileBreakpoint: 760,                              // width in pixels to switch to mobile layout on initialization
                isHotelBooking: false,                              // (d) hotel booking style ranges
                inline: false,                                      // (d) display as an inline input replacement
                minDate: null,                                      // (d) minimum selectable date, default null (no minimum)
                maxDate: null,                                      // (d) maximum selectable date, default null (no maximum)
                showHeader: true,                                   // (d) visibility of the part which displays the selected start and end dates
                showFooter: true,                                   // (d) visibility of the part which contains user defined ranges
                rangeOrientation: "horizontal",                     // (d) show ranges horizontally below the calendars or vertically on the side
                verticalRangeWidth: 180,                            // (d) range panel width when rangeOrientation is set to vertical
                showButtons: false,                                 // (d) visibility of the part which contains the buttons on desktop dropdown view
                startOnMonday: false,                               // (d) if you want to start the calendars on monday, set this to true
                container: "body",                                  // (d) the container of the dropdowns
                oneCalendarWidth: 230,                              // (d) the width of one calendar, if two calendars are shown, the input width will be 2 * this setting.
                enableKeyboard: true,                               // (d) enables keyboard navigation
                showOn: "bottom",                                   // (d) dropdown placement position relative to input element ( "top", "left", "right", "bottom", "center")
                arrowOn: "left",                                    // (d) arrow position ("left" "right" "center" for showOn "bottom" or "top", and vice versa)
                autoAlign: true,                                    // (d) automatically reposition the picker when window resize or scroll or dropdown show
                locale: moment.locale(),                            // (d) moment locale setting, different inputs: https://momentjs.com/docs/#/i18n/changing-locale/ , available locales: https://momentjs.com/ (bottom of the page)
                singleDate: false,                                  // (d) if you want a single date picker, set this to true
                target: null,                                       // (d) the element to update after selection, defaults to the element that is instantiated on
                autoCloseOnSelect: false,                           // (d) closes the dropdown/modal after valid selection
                startEmpty: false,                                  // (d) starts with no value selected
                isRTL: false,                                       // flag to use RTL layout
                ranges: [{                                          // (d) default range objects array, one range is defined like
                    title: "Today",                                 // {title(string), startDate(moment object), endDate(moment object) }
                    startDate: moment(),
                    endDate: moment()
                }, {
                    title: "3 Days",
                    startDate: moment(),
                    endDate: moment().add(2, "days")
                }, {
                    title: "5 Days",
                    startDate: moment(),
                    endDate: moment().add(4, "days")
                }, {
                    title: "1 Week",
                    startDate: moment(),
                    endDate: moment().add(6, "days")
                }, {
                    title: "Till Next Week",
                    startDate: moment(),
                    endDate: moment().endOf("week")               // if you use Monday as week start, you should use "isoweek" instead of "week"
                }, {
                    title: "Till Next Month",
                    startDate: moment(),
                    endDate: moment().endOf("month")
                }],
                rangeLabel: "Ranges: ",                             // (d) the title of defined ranges
                cancelLabel: "Cancel",                              // (d) the text on the cancel button
                applyLabel: "Apply",                                // (d) the text on the apply button
                nextMonthIcon: "<i class='fa fa-arrow-right'></i>", // (d) the html of the next month icon
                prevMonthIcon: "<i class='fa fa-arrow-left'></i>",  // (d) the html of the prev month icon
                rangeIcon: "<i class='fa fa-retweet'></i>",         // (d) the html of the range label icon
                headerSeparator: "<i class='fa fa-chevron-right'></i>", // (d) the html of the icon between header dates
                onbeforeselect: function () {                       // (d) triggered before selection is applied, can be reverted with returning false
                    return true;
                },                                                  // (d) event which is triggered before selecting the end date ( a range selection is completed )
                onafterselect: function () { },                     // (d) event which is triggered after selecting the end date ( the input value changed )
                onbeforeshow: function () { },                      // (d) event which is triggered before showing the dropdown
                onbeforehide: function () { },                      // (d) event which is triggered before hiding the dropdown
                onaftershow: function () { },                       // (d) event which is triggered after showing the dropdown
                onafterhide: function () { },                       // (d) event which is triggered after hiding the dropdown
                onfirstselect: function () { },                     // (d) event which is triggered after selecting the first date of ranges
                onrangeselect: function () { },                     // (d) event which is triggered after selecting a range from the defined range links
                onbeforemonthchange: function () {                  // (d) event which is triggered before switching the month, can be prevented with returning false
                    return true;
                },                                                  // (d) event which fires before changing the first calendar month of multiple calendars, or the month of a single calendar
                onaftermonthchange: function () { },                // (d) event which fires after changing the first calendar month of multiple calendars, or the month of a single calendar
                onafteryearchange: function () { },                 // (d)event which fires after changing the first calendar year of multiple calendars, or the year of a single calendar
                ondraw: function () { },                            // (d) event which fires after a complete redraw occurs
                onBeforeInit: function () { },                      // (d) event which is fired before initialization and after configuration
                onBeforeDestroy: function () {
                    return true;
                },                                                  // (d) event which is fired before destruction
                oninit: function () { },                            // (d) event which is fired after complete initialization
                ondestroy: function () { },                         // (d) event which is fired after complete destruction
                validateClick: function () { return true; },        // (d) event which is fired on cell click, returning false will prevent selection
                onCancel: function(){ return true; },               // (d) event which is fired on cancel button click, returning false will prevent cancel
                disableDays: function () {                          // (d) function which is used to disable the related day with returning true after checks
                    return false;
                },
                disabledRanges: [],                                 // (d) array which contains disabled date ranges, refer to docs for the structure
                continuous: false,                                  // (d) flag to make sure the range selected doesn't contain disabled dates
                disableOnlyStart: false,                            // (d) flag to apply the disables only to start dates
                disableOnlyEnd: false,                              // (d) flag to apply the disables only to end days
                minSelectedDays: 0,                                 // (d) minimum number of selected days to be accepted
                enableMonthSwitcher: true,                          // (d) flag to enable the month switcher when clicking the month name on the calendar titles
                enableYearSwitcher: true,                           // (d) flag to enable the year switcher when clicking the year text on the calendar titles
                enableSwipe: true,                                  // (d) flag to enable the swiped month switch on mobile displays
                numericMonthSwitcher: false,                        // (d) flag to enable displaying numbers instead of month names in month switcher
                monthSwitcherFormat: "MMMM",                        // (d) Changes the month name display format on the month switcher. Default: "MMMM"
                showWeekNumbers: false,                             // (d) flag to show/hide week numbers
                hideOutOfRange: false,                              // (d) hides or disables out of range months, years, navigation arrows
                DOBCalendar: false                                  // (d) Birthdate selection mode
            };
        },
        //////////////////////////////////////////
        // private variables for internal usage //
        //////////////////////////////////////////
        private: function () {
            return {
                startSelected: false,                               // flag which indicates the start date is selected on the calendar, and the next click will define the end date.
                currentDate: moment().startOf('day'),             // the current month which is shown on the first calendar
                endSelected: true,                                  // flag which indicates that the end date is selected. Also means that a complete range is selected.
                hoverDate: null,                                    // the day element which is currently being hovered via mouse
                keyboardHoverDate: null,                            // the day element which is currently being hovered via keyboard
                headerStartDay: null,                               // header start day information container element
                headerStartDate: null,                              // header start date of month container element
                headerStartWeekday: null,                           // header start week day text container element
                headerEndDay: null,                                 // header end day information container element
                headerEndDate: null,                                // header end date of month container element
                headerEndWeekday: null,                             // header end week day text container element
                swipeX: 0,
                swipeY: 0,
                swipeStart: 0,
                swipeTimeout: null,                                 // swipe debouncing timeout variable
                isMobile: false,                                    // current environment is mobile or desktop indicator
                valElements: ["BUTTON", "OPTION", "INPUT", "LI", "METER", "PROGRESS", "PARAM"], // elements which support value property
                dontHideOnce: false,                                // flag that tells the dropdown not to close once
                initiator: null,                                    // element which triggered the dropdown to show
                initComplete: false,                                // is the plugin completely initialized?
                startDateBackup: null,                              // start date clone while switching months, used for range selection after month/year switch
                startDateInitial: null,                             // start date clone when displaying the plugin to use on cancellation operation
                endDateInitial: null,                               // end date clone when displaying the plugin to use on cancellation operation
                firstValueSelected: false,                          // used with config.startEmpty, set to true if the initial range selection has been made.
                throttleTimeout: null,                              // debouncer function timeout variable
                instanceId: null,
                documentEvent: null,                                // used for separating document bound events for multiple instances
                delayInputUpdate: false,                            // used for preventing the input to be updated until the apply button is clicked
                lastScrollX: 0,                                     // horizontal buffer variable of scroll positions for using inside requestAnimationFrame
                lastScrollY: 0,                                     // vertical buffer variable of scroll positions for using inside requestAnimationFrame
                isTicking: false,                                   // requestAnimationFrame ticking suppressor
                parentScrollEventsAttached: false,                  // runonce flag for input's scrollable parents, which scroll events are attached once
                rafID: 0,                                           // requestanimationframe ID for cancellation
                disabledDays: {}
            };
        },
        /**
         * initialize the plugin
         * @return caleran object
         */
        init: function () {
            this.config = this.extend(this.extend(this.public(), this.options), this.metadata);
            this.globals = this.private();
            this.globals.isMobile = this.checkMobile();
            this.globals.instanceId = Math.round((+new Date()) + (Math.random() * 100));
            this.events = this.eventsPrototype();
            this.events.init(this.globals.instanceId);
            this.config.onBeforeInit(this);
            this.applyConfig();
            this.fetchInputs();
            this.drawUserInterface();
            this.drawOverlay();
            this.addInitialEvents();
            this.addKeyboardEvents();
            this.elem.caleran = this;
            this.config.oninit(this);
            this.globals.initComplete = true;
            this.globals.lastScrollX = 0;
            this.globals.lastScrollY = 0;
            this.events.dispatch(window, "resize");
            return this;
        },
        /**
         * validates start and end dates,
         * swaps dates if end > start,
         * sets visible month of first selection
         *
         * @return void
         */
        validateDates: function () {
            // validate start & end dates
            var swap;

            if (
                (
                    (moment.isMoment(this.config.startDate) && this.config.startDate.isValid()) ||
                    (moment(this.config.startDate, this.config.format).isValid())
                ) && (
                    (moment.isMoment(this.config.endDate) && this.config.endDate.isValid()) ||
                    (moment(this.config.endDate, this.config.format).isValid())
                )
            ) {
                this.config.startDate = moment(this.config.startDate, this.config.format).middleOfDay().locale(this.config.locale);
                this.config.endDate = moment(this.config.endDate, this.config.format).middleOfDay().locale(this.config.locale);
                if (this.config.startDate.isAfter(this.config.endDate, "day")) {
                    swap = this.config.startDate.clone();
                    this.config.startDate = this.config.endDate.clone();
                    this.config.endDate = swap.clone();
                    swap = null;
                }
            } else {
                this.config.startDate = moment().middleOfDay().locale(this.config.locale);
                this.config.endDate = moment().middleOfDay().locale(this.config.locale);
            }
            this.globals.currentDate = moment(this.config.startDate, this.config.format);
            // validate min & max dates
            if (this.config.minDate !== null && moment(this.config.minDate, this.config.format).isValid()) {
                this.config.minDate = moment(this.config.minDate, this.config.format).middleOfDay();
            } else {
                this.config.minDate = null;
            }
            if (this.config.maxDate !== null && moment(this.config.maxDate, this.config.format).isValid()) {
                this.config.maxDate = moment(this.config.maxDate, this.config.format).middleOfDay();
            } else {
                this.config.maxDate = null;
            }
            if (this.config.minDate !== null && this.config.maxDate !== null && this.config.minDate.isAfter(this.config.maxDate, "day")) {
                swap = this.config.minDate.clone();
                this.config.minDate = this.config.maxDate.clone();
                this.config.maxDate = swap.clone();
                swap = null;
            }

            // validate start and end dates according to min and max dates
            if (this.config.minDate !== null && this.config.startDate !== null && this.config.minDate.isAfter(this.config.startDate, "day")) {
                this.config.startDate = this.config.minDate.clone();
            }
            if (this.config.minDate !== null && this.config.endDate !== null && this.config.minDate.isAfter(this.config.endDate, "day")) {
                this.config.endDate = this.config.minDate.clone();
            }

            if (this.config.maxDate !== null && this.config.startDate !== null && this.config.maxDate.isBefore(this.config.startDate, "day")) {
                this.config.startDate = this.config.maxDate.clone();
            }
            if (this.config.maxDate !== null && this.config.endDate !== null && this.config.maxDate.isBefore(this.config.endDate, "day")) {
                this.config.endDate = this.config.maxDate.clone();
            }

            if (this.checkRangeContinuity() === false ||
                (this.config.disableOnlyStart == true && this.isDisabled(this.config.startDate, this.config.isHotelBooking)) ||
                (this.config.singleDate === false && this.config.disableOnlyEnd && this.isDisabled(this.config.endDate, this.config.isHotelBooking)) ||
                (this.config.startEmpty && this.globals.firstValueSelected == false)
            ) {
                this.clearInput();
            }
        },
        /**
         * sets config variables and relations between them,
         * for example "inline" property converts the input to hidden input,
         * applies default date from input to plugin and vice versa .. etc.
         *
         * @return void
         */
        applyConfig: function () {

            // set target element to be updated
            if (this.config.target === null) this.config.target = this.elem;

            // disable dobcalendar if inline
            if (this.config.inline === true) this.config.DOBCalendar = false;

            // switch to singledate when dobcalendar is true
            if (this.config.DOBCalendar == true) this.config.singleDate = true;

            if(typeof this.config.container === "string") this.config.container = document.querySelector(this.config.container);

            // fix dates
            var props = ["startDate", "endDate", "minDate", "maxDate"];
            for(var p = 0; p < props.length; p++){
                var key = props[p];
                this.config[key] = this.fixDateTime(this.config[key]);
            }

            this.config.ranges.map( function(range) {
                range.startDate = this.fixDateTime(range.startDate);
                range.endDate = this.fixDateTime(range.endDate);
                return range;
            }, this);

            // create container relative to environment and settings
            if (this.globals.isMobile === false) {
                if (this.config.inline === true) {
                    this.container = document.createElement("div");
                    this.container.classList.add("caleran-container", "caleran-inline");
                    this.container.tabIndex = 1;
                    this.container.onclick = '';
                    this.elem.insertAdjacentElement("beforebegin", this.container);
                    this.container.appendChild(this.elem);
                    this.input = document.createElement("div");
                    this.input.classList.add("caleran-input");
                    this.container.appendChild(this.input);
                    this.elem.type = "hidden";
                    this.config.showButtons = false;
                    this.setViewport();
                } else {
                    this.container = document.createElement("div");
                    this.container.classList.add("caleran-container", "caleran-popup");
                    this.container.style.display = 'none';
                    this.container.setAttribute("onclick", '');
                    var arrow = document.createElement("div");
                    arrow.classList.add("caleran-box-arrow-top");
                    this.container.appendChild(arrow);
                    this.input = document.createElement("div");
                    this.input.classList.add("caleran-input");
                    this.container.appendChild(this.input);
                    this.config.container.appendChild(this.container);
                    if (this.config.showButtons) {
                        this.globals.delayInputUpdate = true;
                        this.config.autoCloseOnSelect = false;
                    }
                }
                if (this.config.rangeOrientation === "horizontal") {
                    this.input.style.width = (this.config.calendarCount * this.config.oneCalendarWidth) + "px";
                } else {
                    this.input.style.width = ((this.config.calendarCount * this.config.oneCalendarWidth) + this.config.verticalRangeWidth) + "px";
                }
            } else {
                if (this.config.inline === true) {
                    this.container = document.createElement("div");
                    this.container.classList.add("caleran-container-mobile", "caleran-inline");
                    this.container.tabIndex = 1;
                    this.container.onclick = '';
                    this.elem.parentNode.insertBefore(this.container, this.elem);
                    this.container.appendChild(this.elem);
                    this.input = document.createElement("div");
                    this.input.classList.add("caleran-input");
                    this.container.appendChild(this.input);
                    this.elem.type = "hidden";
                    this.config.showButtons = false;
                } else {
                    this.container = document.createElement("div");
                    this.container.classList.add(["caleran-container-mobile"]);
                    this.container.onclick = '';
                    this.config.container.appendChild(this.container);
                    this.input = document.createElement("div");
                    this.input.classList.add("caleran-input");
                    this.input.style.display = 'none';
                    this.container.appendChild(this.input);
                    if (this.config.showButtons) {
                        this.config.autoCloseOnSelect = false;
                    }
                    if (!this.config.autoCloseOnSelect) this.globals.delayInputUpdate = true;
                }
                // disable the soft keyboard on mobile devices
                this.elem.onfocus = function(){
                    this.blur();
                };
            }

            if (this.config.isHotelBooking) {
                this.container.classList.add("caleran-hotel-style");
            }

            if(this.config.isRTL) {
                this.container.style.direction = "rtl";
                this.container.classList.add("caleran-rtl");
            }

            this.clearRangeSelection();
        },
        /**
         * Clears the selected range info
         */
        clearRangeSelection: function () {
            for (var range = 0; range < this.config.ranges.length; range++) {
                this.config.ranges[range].selected = false;
            }
            var ranges = this.container.querySelectorAll(".caleran-range");
            for(var r = 0; r < ranges.length; r++){
                ranges[r].classList.remove("caleran-range-selected");
            }
        },
        inArray: function(needle, haystack){
            return Array.isArray(haystack) && haystack.indexOf(needle) >= 0;
        },
        /**
         * Parse input from the source element's value and apply to config
         * @return void
         */
        fetchInputs: function () {
            var elValue = this.inArray(this.config.target.tagName, this.globals.valElements) ? this.config.target.value : this.config.target.innerText;
            if (this.config.singleDate === false && elValue.indexOf(this.config.dateSeparator) > 0) {
                var parts = elValue.split(this.config.dateSeparator);
                if (parts.length == 2) {
                    if (moment(parts[0], this.config.format, this.config.locale).isValid() && moment(parts[1], this.config.format, this.config.locale).isValid()) {
                        this.config.startDate = moment(parts[0], this.config.format, this.config.locale).middleOfDay();
                        this.config.endDate = moment(parts[1], this.config.format, this.config.locale).middleOfDay();
                        this.globals.firstValueSelected = true;
                    }
                }
            } else if (this.config.singleDate === true) {
                var value = elValue;
                if (value != "" && moment(value, this.config.format, this.config.locale).isValid()) {
                    this.config.startDate = moment(value, this.config.format, this.config.locale).middleOfDay();
                    this.config.endDate = moment(value, this.config.format, this.config.locale).middleOfDay();
                    this.globals.firstValueSelected = true;
                }
            }// clear input if startEmpty is defined
            if (this.config.startEmpty && !this.globals.firstValueSelected) {
                this.clearInput();
            }
            // validate inputs
            this.validateDates();
        },
        /**
         * Draws the plugin interface when needed
         * @return void
         */
        drawUserInterface: function () {
            this.drawHeader();
            this.calendars = this.input.querySelectorAll(".caleran-calendars")[0];
            var nextCal = this.globals.currentDate.clone().middleOfDay();
            this.globals.disabledDays = {};
            for (var calendarIndex = 0; calendarIndex < this.config.calendarCount; calendarIndex++) {
                this.drawCalendarOfMonth(nextCal);
                nextCal = nextCal.add(1, "month");
            }
            // remove last border
            var calendars = this.calendars.querySelectorAll(".caleran-calendar");
            calendars[calendars.length - 1].classList.add("no-border-right");
            this.drawArrows();
            this.drawFooter();
            if ((this.globals.isMobile === true || this.config.inline === false) && this.globals.initComplete) {
                this.setViewport();
            }
            if (this.globals.startSelected === false) {
                if (this.globals.initComplete) {
                    this.updateInput(false);
                } else {
                    var delayState = this.globals.delayInputUpdate;
                    this.globals.delayInputUpdate = false;
                    this.updateInput(false);
                    this.globals.delayInputUpdate = delayState;
                }
            }
            this.reDrawCells();
        },
        /**
         * Draws the overlay to prevent clickthroughs when an instance is open on mobile view
         * @return void
         */
        drawOverlay: function () {
            if (this.globals.isMobile == false) return;
            if (document.querySelectorAll(".caleran-overlay").length == 0) {
                this.overlay = document.createElement("div");
                this.overlay.classList.add("caleran-overlay");
                document.body.appendChild(this.overlay);
                var overlayEvents = function(){
                    var visibleInstances = document.querySelectorAll("body > .caleran-container-mobile");
                    if(visibleInstances.length > 0){
                        for(var vi = 0; vi < visibleInstances.length; vi++){
                            var item = visibleInstances[vi];
                            if(item.style.display != "none"){
                                item.querySelector(".caleran-cancel").click();
                            }
                        }
                    }
                };
                this.events.add(this.overlay, "click", overlayEvents, false);
                this.events.add(this.overlay, "tap", overlayEvents, false);
            } else {
                this.overlay = document.querySelectorAll(".caleran-overlay")[0];
            }
        },
        /**
         * Draws the header part of the plugin, which contains start and end date displays
         * @return void
         */
        drawHeader: function () {
            var headers = "<div class='caleran-header'>" +
                "<div class='caleran-header-start'>" +
                    "<div class='caleran-header-start-day'></div>" +
                    "<div class='caleran-header-start-date'></div>" +
                    "<div class='caleran-header-start-weekday'></div>" +
                "</div>";
            if (this.config.singleDate === false) {
                headers += "<div class='caleran-header-separator'>" + this.config.headerSeparator + "</div>" +
                "<div class='caleran-header-end'>" +
                    "<div class='caleran-header-end-day'></div>" +
                    "<div class='caleran-header-end-date'></div>" +
                    "<div class='caleran-header-end-weekday'></div>" +
                "</div>";
            }
            headers += "</div><div class='caleran-calendars'></div>";
            this.input.insertAdjacentHTML("beforeend", headers);
            if (this.config.showHeader === false) {
                headers = this.input.querySelectorAll(".caleran-header");
                for(var h = 0; h < headers.length; h++) {
                    headers[h].style.display = 'none';
                }
            }
            this.globals.headerStartDay = this.input.querySelector(".caleran-header-start-day");
            this.globals.headerStartDate = this.input.querySelector(".caleran-header-start-date");
            this.globals.headerStartWeekday = this.input.querySelector(".caleran-header-start-weekday");
            this.globals.headerEndDay = this.input.querySelector(".caleran-header-end-day");
            this.globals.headerEndDate = this.input.querySelector(".caleran-header-end-date");
            this.globals.headerEndWeekday = this.input.querySelector(".caleran-header-end-weekday");
            this.updateHeader();
        },
        /**
         * Updates the start and end dates in the header
         * @return void
         */
        updateHeader: function () {
            if (this.config.startDate) this.config.startDate.locale(this.config.locale);
            if (this.config.endDate) this.config.endDate.locale(this.config.locale);
            if (this.config.startEmpty && this.globals.firstValueSelected === false) return;
            if (this.config.startDate !== null) {
                this.globals.headerStartDay.innerText = this.localizeNumbers(this.config.startDate.date());
                if (this.globals.isMobile) this.globals.headerStartDate.innerText = this.config.startDate.format("MMM") + " " + this.localizeNumbers(this.config.startDate.year());
                else this.globals.headerStartDate.innerText = this.config.startDate.format("MMMM") + " " + this.localizeNumbers(this.config.startDate.year());
                this.globals.headerStartWeekday.innerText = this.config.startDate.format("dddd");
            } else {
                this.globals.headerStartDay.innerText = "";
                this.globals.headerStartDate.innerText = "";
                this.globals.headerStartWeekday.innerText = "";
            }
            if (this.config.singleDate === false) {
                if (this.config.endDate !== null) {
                    this.globals.headerEndDay.innerText = this.localizeNumbers(this.config.endDate.date());
                    if (this.globals.isMobile) this.globals.headerEndDate.innerText = this.config.endDate.format("MMM") + " " + this.localizeNumbers(this.config.endDate.year());
                    else this.globals.headerEndDate.innerText = this.config.endDate.format("MMMM") + " " + this.localizeNumbers(this.config.endDate.year());
                    this.globals.headerEndWeekday.innerText = this.config.endDate.format("dddd");
                } else {
                    this.globals.headerEndDay.innerText = "";
                    this.globals.headerEndDate.innerText = "";
                    this.globals.headerEndWeekday.innerText = "";
                }
            }
        },
        /**
         * checks for updateInput to be run or dismissed
         * @return {boolean} whether the input should be updated or not
         */
        isUpdateable: function () {
            var returnReasons = this.globals.delayInputUpdate;
            var clearReasons = this.config.startEmpty && !this.globals.firstValueSelected;
            clearReasons = clearReasons || (this.config.singleDate === true && this.config.startDate === null);
            clearReasons = clearReasons || (this.config.singleDate === false && (this.config.startDate === null || this.config.endDate === null));
            if (clearReasons) this.clearInput();
            if (clearReasons || returnReasons) return false;
            return true;
        },
        /**
         * Updates the connected input element value when the value is chosen
         * @return void
         */
        updateInput: function (withEvents) {
            if (this.config.startDate) this.config.startDate.locale(this.config.locale);
            if (this.config.endDate) this.config.endDate.locale(this.config.locale);
            if (!this.isUpdateable()) return;
            if (this.inArray(this.config.target.tagName, this.globals.valElements)) {
                if (this.config.singleDate === false) {
                    this.config.target.value = this.config.startDate.format(this.config.format) + this.config.dateSeparator + this.config.endDate.format(this.config.format);
                } else {
                    this.config.target.value = this.config.startDate.format(this.config.format);
                }
            } else {
                if (this.config.singleDate === false) {
                    this.config.target.innerText = this.config.startDate.format(this.config.format) + this.config.dateSeparator + this.config.endDate.format(this.config.format);
                } else {
                    this.config.target.innerText = this.config.startDate.format(this.config.format);
                }
            }
            if (this.globals.initComplete === true && withEvents === true) {
                this.config.onafterselect(this, this.config.startDate.clone(), this.config.endDate.clone());
                this.events.dispatch(this.input, "change");
            }
        },
        /**
         * Clears the input and prepares it for a new date range selection
         * @return void
         */
        clearInput: function (stayEmpty) {
            if (this.inArray(this.config.target.tagName, this.globals.valElements)) {
                if (this.config.singleDate === false) this.config.target.value = "";
                else this.config.target.value = "";
            } else {
                if (this.config.singleDate === false) this.config.target.innerText = "";
                else this.config.target.innrtText = "";
            }
            this.config.startDate = null;
            this.config.endDate = null;

            if(stayEmpty) {
                this.config.startEmpty = true;
                this.globals.firstValueSelected = false;
            } else {
                if(this.config.startEmpty == true) this.globals.firstValueSelected = false;
            }


            if (this.globals.initComplete) {
                this.updateHeader();
                var applyButton = typeof this.footer == "undefined" ? [] : this.footer.querySelector(".caleran-apply");
                if (applyButton.length > 0) applyButton.setAttribute("disabled", "disabled");
            }
        },
        /**
         * Draws the arrows of the month switcher
         * @return void
         */
        drawArrows: function () {
            var hideLeftArrow = this.config.hideOutOfRange && this.config.minDate && this.globals.currentDate.clone().add(-1, "month").isBefore(this.config.minDate, "month");
            var hideRightArrow = this.config.hideOutOfRange && this.config.maxDate && this.globals.currentDate.clone().add(this.config.calendarCount, "month").isAfter(this.config.maxDate, "month");
            var titles = this.container.querySelectorAll(".caleran-title");
            if (titles.length > 0) {
                var t, item;
                if (this.globals.isMobile) {
                    if (!hideLeftArrow) {
                        for(t = 0; t < titles.length; t++){
                            titles[t].insertAdjacentHTML("afterbegin", "<div class='caleran-prev'>" + this.config.prevMonthIcon + "</div>");
                        }
                    }
                    if (!hideRightArrow) {
                        for(t = 0; t < titles.length; t++){
                            titles[t].insertAdjacentHTML("beforeend", "<div class='caleran-next'>" + this.config.nextMonthIcon + "</div>");
                        }
                    }
                } else {
                    if(this.config.isRTL){
                        if (!hideLeftArrow) titles[titles.length - 1].insertAdjacentHTML("afterbegin", "<div class='caleran-prev'>" + this.config.prevMonthIcon + "</div>");
                        if (!hideRightArrow) titles[0].insertAdjacentHTML("beforeend", "<div class='caleran-next'>" + this.config.nextMonthIcon + "</div>");
                    }else{
                        if (!hideLeftArrow) titles[0].insertAdjacentHTML("afterbegin", "<div class='caleran-prev'>" + this.config.prevMonthIcon + "</div>");
                        if (!hideRightArrow) titles[titles.length - 1].insertAdjacentHTML("beforeend", "<div class='caleran-next'>" + this.config.nextMonthIcon + "</div>");
                    }
                }
            }
        },
        /**
         * Draws a single calendar
         * @param  [momentobject] _month: The moment object containing the desired month, for example given "18/02/2017" as moment object draws the calendar of February 2017.
         * @return void
         */
        drawCalendarOfMonth: function (_month) {
            var calendarStart = moment(_month).locale(this.config.locale).startOf("month").startOf("isoweek").middleOfDay();
            var startOfWeek = calendarStart.day();
            if (startOfWeek == 1 && this.config.startOnMonday === false) {
                calendarStart.add(-1, "days");
                startOfWeek = 0;
            } else if (startOfWeek === 0 && this.config.startOnMonday === true) {
                calendarStart.add(1, "days");
                startOfWeek = 1;
            }
            if (calendarStart.isAfter(moment(_month).date(1))) calendarStart.add(-7, "day");
            var calendarOutput = "<div class='caleran-calendar" + ((this.config.showWeekNumbers) ? " caleran-calendar-weeknumbers" : "") + "' data-month='" + _month.month() + "'>";
            var boxCount = 0;
            var monthClass = "",
                yearClass = "";
            if (this.config.enableMonthSwitcher) monthClass = " class='caleran-month-switch'";
            if (this.config.enableYearSwitcher) yearClass = " class='caleran-year-switch'";

            calendarOutput += "<div class='caleran-title'><b" + monthClass + ">" + _month.locale(this.config.locale).format("MMMM") + "</b>&nbsp;<span" + yearClass + ">" + this.localizeNumbers(_month.year()) + "</span></div>";
            calendarOutput += "<div class='caleran-days-container'>";
            var localeWeekdays = moment.localeData(this.config.locale).weekdaysShort();

            if (this.config.showWeekNumbers) calendarOutput += "<div class='caleran-dayofweek'>&nbsp;</div>";
            for (var days = startOfWeek; days < startOfWeek + 7; days++) {
                calendarOutput += "<div class='caleran-dayofweek'>" + localeWeekdays[days % 7] + "</div>";
            }
            var prevDisabled = true, prevKey = null;
            while (boxCount < 42) {
                var cellDate = calendarStart.middleOfDay().unix();
                var cellStyle = (_month.month() == calendarStart.month()) ? "caleran-day" : "caleran-disabled";
                if (boxCount % 7 === 0 && this.config.showWeekNumbers) {
                    calendarOutput += "<div class='caleran-weeknumber'><span>" + calendarStart.format("ww") + "</span></div>";
                }
                calendarOutput += "<div class='" + cellStyle + "' data-value='" + cellDate + "'><span>" + this.localizeNumbers(calendarStart.date()) + "</span></div>";

                /**
                 * Disabled Date Values
                 * 1 => Start of Range disabled
                 * 2 => Fully disabled
                 * 3 => End of Range disabled
                 */

                if (this.isDisabledOnDraw(calendarStart)) {
                    this.globals.disabledDays[cellDate] = prevDisabled == true ? 2 : 1;
                    prevDisabled = true;
                    prevKey = cellDate;
                } else {
                    if (prevDisabled == true && prevKey != null) {
                        this.globals.disabledDays[prevKey] = 3;
                    }
                    prevDisabled = false;
                }
                calendarStart.add(moment.duration({ "days": 1 }));
                boxCount++;
            }
            calendarOutput += "</div>";
            calendarOutput += "</div>";
            this.calendars.insertAdjacentHTML("beforeend", calendarOutput);
        },
        /**
         * Draws the footer of the plugin, which contains range selector links
         * @return void
         */
        drawFooter: function () {
            if (this.config.singleDate === false && this.config.showFooter === true) {
                if (this.config.rangeOrientation === "horizontal" || this.globals.isMobile) {
                    this.input.insertAdjacentHTML("beforeend", "<div class='caleran-ranges'></div>");
                } else {
                    this.input.classList.add("caleran-input-vertical-range");
                    var innerWrap = document.createElement("div");
                    innerWrap.classList.add("caleran-left");
                    while(this.input.firstChild) innerWrap.appendChild(this.input.firstChild);
                    this.input.appendChild(innerWrap);
                    innerWrap.insertAdjacentHTML("afterend", "<div class='caleran-right' style='max-width: " + this.config.verticalRangeWidth + "px; min-width: " + this.config.verticalRangeWidth + "px'><div class='caleran-ranges'></div></div>");
                }
                var ranges = this.input.querySelector(".caleran-ranges");
                ranges.insertAdjacentHTML("beforeend", "<span class='caleran-range-header-container'>" + this.config.rangeIcon + "<div class='caleran-range-header'>" + this.config.rangeLabel + "</div></span>");
                for (var range_id = 0; range_id < this.config.ranges.length; range_id++) {
                    ranges.insertAdjacentHTML("beforeend", "<div class='caleran-range" + ((this.config.ranges[range_id].selected) ? " caleran-range-selected" : "") + "' data-id='" + range_id + "'>" + this.config.ranges[range_id].title + "</div>");
                }
            }
            if (this.globals.isMobile && !this.config.inline) {
                if (this.config.singleDate === true || this.config.showFooter === false) {
                    this.input.insertAdjacentHTML("beforeend", "<div class='caleran-filler'></div>");
                }
            }
            if ((this.globals.isMobile && !this.config.inline) || (!this.globals.isMobile && !this.config.inline && this.config.showButtons)) {
                if (this.config.rangeOrientation === "horizontal" || this.globals.isMobile) {
                    this.input.insertAdjacentHTML("beforeend", "<div class='caleran-footer'></div>");
                } else {
                    this.input.querySelector(".caleran-right").insertAdjacentHTML("beforeend", "<div class='caleran-footer'></div>");
                }
                this.footer = this.input.querySelector(".caleran-footer");
                this.footer.insertAdjacentHTML("beforeend", "<button type='button' class='caleran-cancel'>" + this.config.cancelLabel + "</button>");
                this.footer.insertAdjacentHTML("beforeend", "<button type='button' class='caleran-apply'>" + this.config.applyLabel + "</button>");
                if (this.globals.firstValueSelected === false && this.config.startEmpty == true) {
                    this.footer.querySelector(".caleran-apply").setAttribute("disabled", "disabled");
                }
                if (this.globals.isMobile && this.globals.endSelected === false) {
                    this.footer.querySelector(".caleran-apply").setAttribute("disabled", "disabled");
                }
            }
        },
        /**
         * Draws next month's calendar (just calls this.reDrawCalendars with an 1 month incremented currentDate)
         * Used in the next arrow click event
         *
         * @return void
         */
        drawNextMonth: function (event) {
            event = event || window.event;

            if(this.config.hideOutOfRange == true && this.config.maxDate && this.globals.currentDate.clone().add(this.config.calendarCount, "month").isAfter(this.config.maxDate, "month"))
            {
                return false;
            }

            if (this.globals.swipeTimeout === null) {
                var that = this;
                this.globals.swipeTimeout = setTimeout(function () {
                    if (that.config.onbeforemonthchange(that, that.globals.currentDate.clone().startOfMonth(), "next") === true) {
                        var buffer = that.calendars.scrollTop;
                        that.globals.currentDate.middleOfDay().add(1, "month");
                        that.reDrawCalendars();
                        that.calendars.scrollTop = buffer;
                        that.config.onaftermonthchange(that, that.globals.currentDate.clone().startOfMonth());
                    }
                    that.globals.swipeTimeout = null;
                }, 100);
            }
            if(event.isCancellable) return this.stopBubbling(event);
            return false;
        },
        /**
         * Draws previous month's calendar (just calls this.reDrawCalendars with an 1 month decremented currentDate)
         * Used in the prev arrow click event
         *
         * @return void
         */
        drawPrevMonth: function (event) {
            event = event || window.event;

            if(this.config.hideOutOfRange == true && this.config.minDate && this.globals.currentDate.clone().add(-1, "month").isBefore(this.config.minDate, "month"))
            {
                return false;
            }

            if (this.globals.swipeTimeout === null) {
                var that = this;
                this.globals.swipeTimeout = setTimeout(function () {
                    if (that.config.onbeforemonthchange(that, that.globals.currentDate.clone().startOfMonth(), "prev") === true) {
                        var buffer = that.calendars.scrollTop;
                        that.globals.currentDate.middleOfDay().subtract(1, "month");
                        that.reDrawCalendars();
                        that.calendars.scrollTop = buffer;
                        that.config.onaftermonthchange(that, that.globals.currentDate.clone().startOfMonth());
                    }
                    that.globals.swipeTimeout = null;
                }, 100);
            }
            if(event.isCancellable) return this.stopBubbling(event);
            return false;
        },
        /**
         * Day cell click event handler
         * @param  [eventobject] e : The event object which contains the clicked cell in e.target property, which enables us to select dates
         * @return void
         */
        cellClicked: function (e) {
            var event = e || window.event;
            var target = event.target || event.srcElement;
            if (target.classList.contains("caleran-day") === false) target = this.closest(target, ".caleran-day");
            var cell = parseInt(target.getAttribute("data-value"), 10);
            var selectedMoment = moment.unix(cell).middleOfDay();
            if (this.config.validateClick(selectedMoment) == false) return false;
            if (this.config.singleDate === false) {
                if (this.globals.startSelected === false) {
                    if (this.config.startDate !== null)
                        this.globals.startDateBackup = this.config.startDate.clone();
                    this.config.startDate = selectedMoment;
                    this.config.endDate = null;
                    this.globals.startSelected = true;
                    this.globals.endSelected = false;
                    var applyButton = typeof this.footer == "undefined" ? [] : this.footer.querySelector(".caleran-apply");
                    if (applyButton.length > 0) applyButton.setAttribute("disabled", "disabled");
                    this.config.onfirstselect(this, this.config.startDate.clone());
                } else {
                    if (selectedMoment.isBefore(this.config.startDate)) {
                        var start = this.config.startDate.clone();
                        this.config.startDate = selectedMoment.clone();
                        selectedMoment = start;
                    }
                    if (selectedMoment.diff(this.config.startDate, "day") < this.config.minSelectedDays) {
                        this.globals.startSelected = false;
                        this.fetchInputs();
                    } else {
                        this.globals.startDateBackup = null;
                        this.config.endDate = selectedMoment;
                        this.globals.endSelected = true;
                        this.globals.startSelected = false;
                        this.globals.hoverDate = null;
                        if (this.config.onbeforeselect(this, this.config.startDate.clone(), this.config.endDate.clone()) === true && this.checkRangeContinuity() === true) {
                            this.globals.firstValueSelected = true;
                            this.clearRangeSelection();
                            this.updateInput(true);
                        }
                        else this.fetchInputs();
                        if (this.config.autoCloseOnSelect && (this.config.inline === false)) {
                            this.hideDropdown(event);
                        } else {
                            if (typeof this.footer != "undefined" && this.config.endDate != null) {
                                this.footer.querySelector(".caleran-apply").removeAttribute("disabled");
                            }
                        }
                    }
                }
            } else {
                this.config.startDate = selectedMoment;
                this.config.endDate = selectedMoment;
                this.globals.endSelected = true;
                this.globals.startSelected = false;
                this.globals.hoverDate = null;
                if (this.config.onbeforeselect(this, this.config.startDate.clone(), this.config.endDate.clone()) === true) {
                    this.globals.firstValueSelected = true;
                    this.clearRangeSelection();
                    this.updateInput(true);
                } else {
                    this.fetchInputs();
                }
                if (this.config.autoCloseOnSelect && (this.config.inline === false)) {
                    this.hideDropdown(event);
                } else {
                    if (typeof this.footer != "undefined" && this.config.endDate != null) {
                        this.footer.querySelector(".caleran-apply").removeAttribute("disabled");
                    }
                }
            }
            this.reDrawCells();
            this.updateHeader();
            return this.stopBubbling(event);
        },
        /**
         * Checks if the defined range is continous (doesn't include disabled ranges or disabled days by callback)
         * @return boolean is continuous or not
         */
        checkRangeContinuity: function () {
            var daysInRange = this.config.endDate.diff(this.config.startDate, "days");
            var startDate = moment(this.config.startDate).middleOfDay();
            /**
             * variables affecting this:
             * -------------------------
             * config.isHotelBooking
             * config.continuous
             * config.disableOnlyStart
             * config.disableOnlyEnd
             *
             * if disableOnlyStart or disableOnlyEnd is active, skip continuousity.
             * else check continuousity
             *
             */
            if (this.config.disableOnlyStart == true) {
                // if disabling only start is active, just start date check will be sufficient
                // false means continuousity is preserved, true means the date is disabled
                return this.isDisabled(this.config.startDate, this.config.isHotelBooking) === false;
            } else if (this.config.disableOnlyEnd == true) {
                // if disabling only end is active, just end date check will be sufficient
                // false means continuousity is preserved, true means the date is disabled
                return this.isDisabled(this.config.endDate, this.config.isHotelBooking) === false;
            } else {
                if(this.config.continuous) {
                    var startDateUnix = startDate.middleOfDay().unix();
                    //check if startdate can be a start date
                    if (
                    // hotel style active, get only disabled.
                    // hotel style passing, get disabled.
                    this.isDisabled(startDateUnix, false) == true &&
                    // if hotel style is active check if start date is a range's start date
                    (this.config.isHotelBooking ? this.getDisabledLevel(startDateUnix) === 1 : true)) {
                        return false;
                    }

                    if(startDate.isSame(this.config.endDate, "day") == false){
                        startDate.middleOfDay().add(1, "days");
                        for (var i = 0; i <= daysInRange - 2; i++) {
                            startDateUnix = startDate.middleOfDay().unix();
                            if (this.getDisabledLevel(startDateUnix) !== undefined) return false;
                            startDate.add(1, "days");
                        }
                    }
                    // check if enddate can be an end date
                    startDateUnix = startDate.middleOfDay().unix();
                    if (
                        // hotel style active, get only disabled.
                        // hotel style passing, get disabled.
                        this.isDisabled(startDateUnix, false) == true &&
                        // if hotel style is active check if end date is a range's end date
                        (this.config.isHotelBooking ? this.getDisabledLevel(startDateUnix) === 3 : true)) {
                            return false;
                    }
                }
            }
            return true;
        },
        /**
         * Checks if given moment value is disabled for that calendar on first draw
         * @param [moment] day : The day to be checked
         * @return {boolean} If the day is disabled or not
         */
        isDisabledOnDraw: function (day) {
            var mday = moment(day).middleOfDay();
            if (this.config.disableDays(mday) === true) {
                return true;
            };
            for (var rangeIndex = 0; rangeIndex < this.config.disabledRanges.length; rangeIndex++) {
                var range = this.config.disabledRanges[rangeIndex];
                if (mday.isBetween(range.start, range.end, "day", "[]")) {
                    return true;
                }
            }
        },
        /**
         * Checks if given moment value is disabled for that calendar from the disabled array
         * @param [moment] day : The day to be checked
         * @return {boolean} If the day is disabled or not
         */
        isDisabled: function (day, hotelStyle) {
            if (undefined === hotelStyle) hotelStyle = false;
            if (this.config.disableOnlyStart == true && this.globals.startSelected == true) {
                return false;
            }
            else if (this.config.disableOnlyEnd == true && this.globals.startSelected == false) {
                return false;
            }
            else {
                if (typeof day == "object" && day !== null) {
                    day = day.middleOfDay().unix();
                }
                if (hotelStyle && this.config.isHotelBooking) {
                    return this.globals.disabledDays[day] === 2;
                }
                return this.globals.disabledDays[day] !== undefined;
            }
        },
        /**
         * Gets the disabledDays record for the given day
         * @param integer|object day
         */
        getDisabledLevel: function (day) {
            if (typeof day == "object" && day !== null) {
                day = day.middleOfDay().unix();
            }
            return this.globals.disabledDays[day];
        },
        /**
         * Event triggered when a day is hovered
         * @param  [eventobject] e : The event object which contains the hovered cell in e.target property, which enables us to style hovered dates
         * @return void
         */
        cellHovered: function (e) {
            var event = e || window.event;
            var target = event.target || event.srcElement;
            if (target.classList.contains("caleran-day") === false) target = this.closest(target, ".caleran-day");
            if(target) {
                var cell = parseInt(target.getAttribute("data-value"), 10);
                this.globals.hoverDate = moment.unix(cell).middleOfDay();
                this.globals.keyboardHoverDate = null;
                if (this.globals.startSelected === true) this.reDrawCells();
                return this.stopBubbling(event);
            }
        },
        /**
         * Just a calendar refresher to be used with the new variables, updating the calendar view
         * @return void
         */
        reDrawCalendars: function () {
            //this.requestAnimFrame(this.proxy(function(){
            this.input.innerHTML = "";
            this.drawUserInterface();
            this.container.focus();
            /*if (this.globals.lastScrollY !== 0) {
                window.scrollTo(this.globals.lastScrollX, this.globals.lastScrollY);
            }*/
            //}, this));
        },
        /**
         * month switcher builder and processor method
         * @return void
         */
        monthSwitchClicked: function () {
            if (this.calendars.querySelectorAll(".caleran-month-selector").length > 0) return;
            var that = this;
            this.calendars.scrollTop = 0;
            this.calendars.insertAdjacentHTML("beforeend", "<div class='caleran-month-selector'></div>");
            var monthSelector = this.calendars.querySelector(".caleran-month-selector");
            var currentMonth = this.globals.currentDate.get('month');
            for (var m = 0; m < 12; m++) {
                monthSelector.insertAdjacentHTML("beforeend", "<div class='caleran-ms-month" + ((currentMonth == m) ? " current" : "") + "' data-month='" + m + "'>" +
                    (this.config.numericMonthSelector ? (m + 1) : moment({ day: 15, hour: 12, month: m }).locale(this.config.locale).format(this.config.monthSwitcherFormat)) +
                    "</div>");
            }
            monthSelector.style.display = "block";
            this.optimizeFontSize(monthSelector.querySelectorAll(".caleran-ms-month"));
            this.rebindEventEach(monthSelector, ".caleran-ms-month", "click", function (event) {
                if(!that.globals) return false;
                that.globals.currentDate.month(parseInt(event.target.getAttribute("data-month"), 10));
                that.config.onaftermonthchange(that, that.globals.currentDate.clone().startOfMonth());
                that.reDrawCalendars();
                return that.stopBubbling(event);
            });
        },
        /**
         * year switcher builder and processor method
         * @return void
         */
        yearSwitchClicked: function () {
            if (this.calendars.querySelectorAll(".caleran-year-selector").length > 0) return;
            var that = this;
            this.calendars.scrollTop = 0;
            this.calendars.insertAdjacentHTML("beforeend", "<div class='caleran-year-selector'></div>");
            var yearSelector = this.calendars.querySelector('.caleran-year-selector');
            var currentYear = this.globals.currentDate.get('year');
            yearSelector.insertAdjacentHTML("beforeend", "<div class='caleran-ys-year-prev'><i class='fa fa-angle-double-left'></i></div>");
            yearSelector.setAttribute("data-year", currentYear);
            for (var year = currentYear - 6; year < currentYear + 7; year++) {
                yearSelector.insertAdjacentHTML("beforeend", "<div class='caleran-ys-year" + ((currentYear == year) ? " current" : "") + "' data-year='" + year + "'>" + this.localizeNumbers(year) + "</div>");
            }
            yearSelector.insertAdjacentHTML("beforeend", "<div class='caleran-ys-year-next'><i class='fa fa-angle-double-right'></i></div>");
            yearSelector.style.display = "block";
            this.optimizeFontSize(yearSelector.querySelectorAll(".caleran-ys-year"));

            this.rebindEventScoped(document, ".caleran-ys-year", "click.caleranys", function (event) {
                if(!that.globals) return false;
                that.globals.currentDate.year(parseInt(event.target.getAttribute("data-year")));
                that.config.onafteryearchange(that, that.globals.currentDate.clone().startOf("year"));
                that.reDrawCalendars();
                if(that.config.DOBCalendar == true){
                    that.calendars.querySelectorAll(".caleran-calendar")[0].querySelector(".caleran-month-switch").click();
                }
                return that.stopBubbling(event);
            });

            this.rebindEventScoped(document, ".caleran-ys-year-prev", "click.caleranysprev", function (event) {
                if(!that.globals) return false;
                var currentYear = parseInt(yearSelector.getAttribute("data-year"), 10) - 13;
                var currentYearNow = that.globals.currentDate.get('year');
                yearSelector.setAttribute("data-year", currentYear);
                yearSelector.innerHTML = "";
                yearSelector.insertAdjacentHTML("beforeend", "<div class='caleran-ys-year-prev'><i class='fa fa-angle-double-left'></i></div>");
                for (var year = currentYear - 6; year < currentYear + 7; year++) {
                    yearSelector.insertAdjacentHTML("beforeend", "<div class='caleran-ys-year" + ((currentYearNow == year) ? " current" : "") + "' data-year='" + year + "'>" + that.localizeNumbers(year) + "</div>");
                }
                yearSelector.insertAdjacentHTML("beforeend", "<div class='caleran-ys-year-next'><i class='fa fa-angle-double-right'></i></div>");
                return that.stopBubbling(event);
            });

            this.rebindEventScoped(document, ".caleran-ys-year-next", "click.caleranysnext", function (event) {
                if(!that.globals) return false;
                var currentYear = parseInt(yearSelector.getAttribute("data-year"), 10) + 13;
                var currentYearNow = that.globals.currentDate.get('year');
                yearSelector.setAttribute("data-year", currentYear);
                yearSelector.innerHTML = "";
                yearSelector.insertAdjacentHTML("beforeend", "<div class='caleran-ys-year-prev'><i class='fa fa-angle-double-left'></i></div>");
                for (var year = currentYear - 6; year < currentYear + 7; year++) {
                    yearSelector.insertAdjacentHTML("beforeend", "<div class='caleran-ys-year" + ((currentYearNow == year) ? " current" : "") + "' data-year='" + year + "'>" + that.localizeNumbers(year) + "</div>");
                }
                yearSelector.insertAdjacentHTML("beforeend", "<div class='caleran-ys-year-next'><i class='fa fa-angle-double-right'></i></div>");
                return that.stopBubbling(event);
            });
        },
        /**
         * Lowers the font size until all the text fits in the element
         */
        optimizeFontSize: function (element) {
            for(var i = 0; i < element.length; i++){
                var elem = element[i];
                var wrapper = document.createElement("span"), parent = elem;
                wrapper.classList.add("adjust-subject");
                while(elem.firstChild) wrapper.appendChild(elem.firstChild);
                parent.appendChild(wrapper);
                parent.insertAdjacentHTML("beforeend", "<span class='font-adjuster'>i</span>");
                var adjustSubject = wrapper;
                var fontAdjuster = parent.querySelector(".font-adjuster");
                if (adjustSubject.offsetHeight === fontAdjuster.offsetHeight) {
                    fontAdjuster.parentNode.removeChild(fontAdjuster);
                    while(adjustSubject.firstChild) parent.appendChild(adjustSubject.firstChild);
                    adjustSubject.parentNode.removeChild(adjustSubject);
                } else {
                    var loopCount = 0;
                    while (adjustSubject.offsetHeight !== fontAdjuster.offsetHeight && loopCount < 16) {
                        var startSize = 0;
                        if (typeof window.getComputedStyle !== "undefined") {
                            startSize = parseFloat(window.getComputedStyle(fontAdjuster, null).getPropertyValue('font-size'));
                        } else {
                            startSize = parseFloat(fontAdjuster.style.fontSize.replace(/px$/, ""));
                        }
                        adjustSubject.parentNode.style.fontSize = (startSize - 1) + "px";
                        fontAdjuster.style.fontSize = (startSize - 1) + "px";
                        if (startSize < 2) break;
                        loopCount++;
                    }
                    fontAdjuster.parentNode.removeChild(fontAdjuster);
                    while(adjustSubject.firstChild) parent.appendChild(adjustSubject.firstChild);
                    adjustSubject.parentNode.removeChild(adjustSubject);
                }
            }
        },
        /**
         * Shows the caleran dropdown
         * @return void
         */
        showDropdown: function (e) {
            var event = e || window.event || jQuery.Event("click", { target: this.elem });
            var eventTarget = event.target || event.srcElement;
            if ((!this.globals.isMobile && this.container.style.display == "none") || (this.globals.isMobile && this.input.style.display == "none")) {
                if (eventTarget !== this.elem) {
                    this.globals.dontHideOnce = true;
                    this.globals.initiator = eventTarget;
                }
                this.fetchInputs();
                this.reDrawCalendars();
                this.globals.startDateInitial = this.config.startDate;
                this.globals.endDateInitial = this.config.endDate;
                this.config.onbeforeshow(this);
                if (this.globals.isMobile) {
                    this.input.style.display = "flex";
                    this.overlay.style.display = "block";
                    document.body.classList.add("caleran-open");
                } else {
                    this.container.style.display = "block";
                }
                this.setViewport();
                if(this.config.DOBCalendar == true){
                    this.calendars.querySelectorAll(".caleran-calendar")[0].querySelector(".caleran-year-switch").click();
                }
                this.config.onaftershow(this);
            }
        },
        /**
         * Hides the caleran dropdown
         * @return void
         */
        hideDropdown: function (e) {
            var event = e || window.event || new Event("click", { target: "body" });
            var eventTarget = event.target || event.srcElement;
            if (this.globals.initiator === eventTarget) return;
            if (this.config.inline === false && ((!this.globals.isMobile && this.container.style.display !== "none") || (this.globals.isMobile && this.input.style.display !== "none"))) {
                this.config.onbeforehide(this);
                if (this.globals.isMobile) {
                    this.input.style.display = "none";
                    this.overlay.style.display = "none";
                    document.body.classList.remove("caleran-open");
                } else {
                    this.container.style.display = "none";
                }
                this.globals.hoverDate = null;
                if (this.globals.startDateBackup !== null) {
                    this.config.startDate = this.globals.startDateBackup;
                    this.globals.startSelected = false;
                }
                this.config.onafterhide(this);
            }
        },
        /**
         * When only a cell style update is needed, this function is used. This gives us the possibility to change styles without re-drawing the calendars.
         * @return void
         */
        reDrawCells: function () {
            var that = this;
            var startDateUnix = this.config.startDate != null ? this.config.startDate.middleOfDay().unix() : null;
            var endDateUnix = this.config.endDate != null ? this.config.endDate.middleOfDay().unix() : null;
            var minDateUnix = this.config.minDate != null ? this.config.minDate.middleOfDay().unix() : null;
            var maxDateUnix = this.config.maxDate != null ? this.config.maxDate.middleOfDay().unix() : null;
            var hoverDateUnix = this.globals.hoverDate != null ? this.globals.hoverDate.middleOfDay().unix() : null;
            var keyboardHoverDateUnix = this.globals.keyboardHoverDate != null ? this.globals.keyboardHoverDate.middleOfDay().unix() : null;
            var currentDateUnix = moment().middleOfDay().unix();
            this.lastHoverStatus = false;
            for (var c = 0; c < this.config.calendarCount; c++) {
                var calendar = this.input.querySelectorAll(".caleran-calendar")[c];
                var cells = calendar.querySelectorAll(".caleran-days-container > div:not(.caleran-dayofweek):not(.caleran-weeknumber)");
                var currentMonth = parseInt(calendar.getAttribute("data-month"), 10);
                for (var i = 0; i < cells.length; i++) {
                    var cell = cells[i];
                    var cellDate = parseInt(cell.getAttribute("data-value"), 10);
                    var cellMoment = moment.unix(cellDate).middleOfDay().locale(that.config.locale);
                    var cellStyle = "caleran-day";
                    var cellDay = cellMoment.day();
                    // is weekend day (saturday or sunday) check
                    if (cellDay == 6 || cellDay === 0) cellStyle += " caleran-weekend";
                    // is today check
                    if (cellDate === currentDateUnix) cellStyle += " caleran-today";
                    cellStyle = this.addDisabledStyles(cell, cellMoment, cellDate, cellStyle, minDateUnix, maxDateUnix, currentMonth);
                    cellStyle = this.addSelectedStyles(cellDate, cellStyle, startDateUnix, endDateUnix, minDateUnix, maxDateUnix);
                    cellStyle = this.addHoverStyles(cell, cellDate, cellStyle, this, startDateUnix, hoverDateUnix, keyboardHoverDateUnix);
                    cell.setAttribute("class", cellStyle);
                }
            }
            this.attachEvents();
            this.config.ondraw(this);
        },
        /**
         * returns calculated selected state style of the cell
         * @param cellMoment current cell's day
         * @param cellStyle current cell's already calculated style
         * @return appended style of the cell
         */
        addSelectedStyles: function (cellDateUnix, cellStyle, startDateUnix, endDateUnix, minDateUnix, maxDateUnix) {
            var that = this;
            var cellStyleOriginal = cellStyle;

            if (that.config.startEmpty === false || that.globals.firstValueSelected) {
                // is the start of the range check
                if (that.config.singleDate === false && startDateUnix !== null && startDateUnix === cellDateUnix) cellStyle += " caleran-start";
                // is the end of the range check
                if (that.config.singleDate === false && endDateUnix !== null && endDateUnix === cellDateUnix) cellStyle += " caleran-end";
                // is between the start and the end range check
                if (that.config.singleDate === false && startDateUnix !== null && endDateUnix !== null && cellDateUnix <= endDateUnix && cellDateUnix >= startDateUnix) cellStyle += " caleran-selected";
                // is the selected date of single date picker
                if (that.config.singleDate === true && startDateUnix !== null && startDateUnix === cellDateUnix) cellStyle += " caleran-selected caleran-start caleran-end";
            }

            //if (cellStyleOriginal != cellStyle) { cellStyle = cellStyle.replace("caleran-disabled", "caleran-day"); }

            return cellStyle;
        },
        /**
         * returns calculated hovered state style of the cell
         * @param cellMoment current cell's day
         * @param cellStyle current cell's already calculated style
         * @return appended style of the cell
         */
        addHoverStyles: function (cell, cellDateUnix, cellStyle, ref, startDateUnix, hoverDateUnix, keyboardHoverDateUnix) {
            // hovered date check
            var that = this;
            cellStyle.replace("caleran-hovered", "").replace("caleran-hovered-last", "").replace("caleran-hovered-first", "");
            if (that.globals.startSelected === true && that.globals.endSelected === false && hoverDateUnix !== null) {
                if ((cellDateUnix >= hoverDateUnix && cellDateUnix <= startDateUnix) ||
                    (cellDateUnix <= hoverDateUnix && cellDateUnix >= startDateUnix)) {
                    cellStyle += " caleran-hovered";
                }
            }
            if (that.config.enableKeyboard == true && keyboardHoverDateUnix !== null) {
                if (that.globals.startSelected === false) {
                    if (keyboardHoverDateUnix == cellDateUnix) {
                        cellStyle += " caleran-hovered";
                    }
                } else {
                    if ((cellDateUnix <= startDateUnix && cellDateUnix >= keyboardHoverDateUnix) ||
                        (cellDateUnix >= startDateUnix && cellDateUnix <= keyboardHoverDateUnix)) {
                        cellStyle += " caleran-hovered";
                    }
                }
            }
            if (this.lastHoverStatus === false && cellStyle.indexOf("caleran-hovered") > 0) {
                this.lastHoverStatus = true;
                cellStyle += " caleran-hovered-first";
            }
            if (this.lastHoverStatus === true && cellStyle.indexOf("caleran-hovered") < 0) {
                var prev = cell.previousElementSibling;
                prev = prev && prev.matches('.caleran-day') ? prev : null;
                if(prev) prev.classList.add("caleran-hovered-last");
                this.lastHoverStatus = false;
            }
            return cellStyle;
        },
        /**
         * returns calculated disabled state style of the cell
         * @param {object}  cell current cell jquery object
         * @param {object}  cellMoment current cell's moment
         * @param {integer} cellDateUnix current call's moment unix timestamp
         * @param {string}  cellStyle current cell's already calculated style
         * @param {integer} minDateUnix minDate config moment unix timestamp
         * @param {integer} maxDateUnix maxDate config moment unix timestamp
         * @returns {string} appended style of the cell
         */
        addDisabledStyles: function (cell, cellMoment, cellDateUnix, cellStyle, minDateUnix, maxDateUnix, currentMonth) {
            if (this.isDisabled(cellDateUnix)) {
                if (this.config.isHotelBooking == false) {
                    cellStyle = cellStyle.replace("caleran-day", "caleran-disabled caleran-disabled-range");
                } else {
                    switch (this.globals.disabledDays[cellDateUnix]) {
                        case 1:
                            cellStyle = cellStyle.replace("caleran-day", "caleran-day caleran-disabled-range caleran-disabled-range-start");
                            break;
                        case 2:
                            cellStyle = cellStyle.replace("caleran-day", "caleran-disabled caleran-disabled-range");
                            break;
                        case 3:
                            cellStyle = cellStyle.replace("caleran-day", "caleran-day caleran-disabled-range caleran-disabled-range-end");
                            break;
                    }
                }
            }
            else if ((maxDateUnix != null && cellDateUnix > maxDateUnix) || (minDateUnix != null && cellDateUnix < minDateUnix)) {
                cellStyle = cellStyle = cellStyle.replace("caleran-day", "caleran-disabled");
            }
            if (cellMoment.month() != currentMonth) {
                cellStyle += " caleran-not-in-month";
            }
            return cellStyle;
        },
        /**
         * Localizes the given number to the current locale
         * @param {string} input The number to be localized
         * @returns {string} The localized number string
         */
        localizeNumbers: function (input) {
            return moment.localeData(this.config.locale).postformat('' + input);
        },
        /**
         * Event triggered when a range link is clicked in the footer of the plugin
         * @param   {object} e the clicked range link
         * @returns void
         */
        rangeClicked: function (e) {
            var event = e || window.event;
            var target = event.target || event.srcElement;
            if (!target.hasAttribute("data-id")) return;
            var range_id = target.getAttribute("data-id");
            this.globals.currentDate = this.config.ranges[range_id].startDate.startOf('day').clone().middleOfDay();
            this.config.startDate = this.config.ranges[range_id].startDate.startOf('day').clone().middleOfDay();
            this.config.endDate = this.config.ranges[range_id].endDate.startOf('day').clone().middleOfDay();
            this.globals.firstValueSelected = true;
            if (this.checkRangeContinuity() === false) {
                this.fetchInputs();
            } else {
                this.clearRangeSelection();
                this.config.ranges[range_id].selected = true;
                this.config.onrangeselect(this, this.config.ranges[range_id]);
                this.reDrawCalendars();
                this.setViewport();
                if (this.config.autoCloseOnSelect) this.hideDropdown();
            }
            return this.stopBubbling(event);
        },
        /**
         * Fixes the view positions of dropdown calendar plugin
         * @returns void
         */
        setViewport: function () {
            if(this.globals) {
                if (this.globals.isMobile === true) {
                    if (this.input.style.display !== "none") {
                        this.events.dispatch(this.container, "caleran:resize");
                    }
                } else {
                    if (this.container.style.display !== "none" && this.globals.initComplete && (this.globals.isMobile === false && this.config.inline === false)) {
                        var viewport = this.getViewport();
                        var result = false;
                        switch (this.config.showOn) {
                            case "top":
                                result = (this.config.autoAlign) ? this.positionOnTopAlign(viewport) : this.positionOnTop(false, viewport);
                                result = this.horizontalAlign(viewport);
                                break;
                            case "left":
                                result = (this.config.autoAlign) ? this.positionOnLeftAlign(viewport) : this.positionOnLeft(false, viewport);
                                result = this.verticalAlign(viewport);
                                break;
                            case "right":
                                result = (this.config.autoAlign) ? this.positionOnRightAlign(viewport) : this.positionOnRight(false, viewport);
                                result = this.verticalAlign(viewport);
                                break;
                            case "bottom":
                                result = (this.config.autoAlign) ? this.positionOnBottomAlign(viewport) : this.positionOnBottom(false, viewport);
                                result = this.horizontalAlign(viewport);
                                break;
                            case "center":
                                result = this.positionOnCenter(viewport);
                                break;
                            default:
                                result = (this.config.autoAlign) ? this.positionOnBottomAlign(viewport) : this.positionOnBottom(false, viewport);
                                result = this.horizontalAlign(viewport);
                                break;
                        }
                        if (this.config.rangeOrientation !== "horizontal") {
                            var height = this.input.querySelector(".caleran-header").clientHeight +
                                this.input.querySelector(".caleran-calendars").clientHeight +
                                ((this.input.querySelectorAll(".caleran-footer").length > 0) ? this.input.querySelector(".caleran-footer").clientHeight : 0);
                            this.input.querySelector(".caleran-right").style.maxHeight = height + "px";
                        }
                    }
                }
            }
        },
        /**
         * Vertically aligns the dropdown when the viewport changes
         * @param {object} viewport An object containing the current viewport dimensions
         */
        verticalAlign: function(viewport) {
            var dropdown = this.getDimensions(this.container, true),
                start_difference = viewport.top - dropdown.offsetTop,
                end_difference = dropdown.offsetTop + dropdown.height - viewport.bottom,
                arrow = this.container.querySelector("div[class*='caleran-box-arrow-']");

            if(start_difference > 0 && Math.abs(start_difference) < dropdown.height) {
                this.container.style.top = (parseFloat(this.container.style.top.replace(/px$/, "")) + start_difference) + "px";
                arrow.style.top = (parseFloat(arrow.style.top.replace(/px$/, "")) - start_difference) + "px";
            } else if(end_difference > 0 && Math.abs(end_difference) < dropdown.height){
                this.container.style.top = (parseFloat(this.container.style.top.replace(/px$/, "")) - end_difference) + "px";
                arrow.style.top = (parseFloat(arrow.style.top.replace(/px$/, "")) + end_difference) + "px";
            }
        },
        /**
         * Horizontally aligns the dropdown when the viewport changes
         * @param {object} viewport An object containing the current viewport dimensions
         */
        horizontalAlign: function(viewport) {
            var dropdown = this.getDimensions(this.container, true), difference = dropdown.offsetLeft + dropdown.width - viewport.right,
            arrow = this.container.querySelector("div[class*='caleran-box-arrow-']");
            if(difference > 0 && Math.abs(difference) < dropdown.width){
                this.container.style.left = (parseFloat(this.container.style.left.replace(/px$/,"")) - difference) + "px";
                arrow.style.left = parseFloat(arrow.style.left.replace(/px$/,"")) + difference;
            }
        },
        /**
         * Gets the coordinates of the dropdown relative to the position
         * @param string position
         */
        getDropdownPos: function (position) {
            var input = this.getDimensions(this.elem, true);
            // console.log(input);
            // this.debugPosition("inputpos", input.offsetTop, input.offsetLeft, input.offsetLeft + input.width, input.offsetTop + input.height, "rgba(0,0,128,0.5)");
            var dropdown = this.getDimensions(this.container, true);
            var margin = parseInt(this.input.style.marginLeft, 10);
            if(isNaN(margin)) margin = 0;
            var arrow = 0;
            if(this.container.querySelectorAll("div[class*='caleran-box-arrow']").length > 0) {
                arrow = parseFloat(this.container.querySelectorAll("div[class*='caleran-box-arrow']")[0].offsetHeight / 2);
            }
            switch (position) {
                case "left":
                    switch (this.config.arrowOn) {
                        case "top":
                            return {
                                top: input.offsetTop - margin - arrow - (input.height / 2),
                                left: input.offsetLeft - dropdown.width - margin,
                                arrow: 0
                            };
                        case "center":
                            return {
                                top: input.offsetTop - margin - (dropdown.height / 2),
                                left: input.offsetLeft - dropdown.width - margin,
                                arrow: (dropdown.height - (arrow * 2)) / 2 - (input.height / 2)
                            };
                        case "bottom":
                            return {
                                top: input.offsetTop - dropdown.height + input.height + (2 * margin) + arrow,
                                left: input.offsetLeft - dropdown.width - margin,
                                arrow: dropdown.height - (arrow * 4) - (3 * margin) - (input.height / 2)
                            };
                        default:
                            return {
                                top: input.offsetTop - margin - arrow - (input.height / 2),
                                left: input.offsetLeft - dropdown.width - margin,
                                arrow: 0
                            };
                    }
                    break;
                case "right":
                    switch (this.config.arrowOn) {
                        case "top":
                            return {
                                top: input.offsetTop - margin - arrow - (input.height / 2),
                                left: input.offsetLeft + input.width + margin,
                                arrow: 0
                            };
                        case "center":
                            return {
                                top: input.offsetTop - margin - (dropdown.height / 2),
                                left: input.offsetLeft + input.width + margin,
                                arrow: (dropdown.height - (arrow * 2)) / 2 - (input.height / 2)
                            };
                        case "bottom":
                            return {
                                top: input.offsetTop - dropdown.height + input.height + (2 * margin) + arrow,
                                left: input.offsetLeft + input.width + margin,
                                arrow: dropdown.height - (arrow * 4) - (3 * margin) - (input.height / 2)
                            };
                        default:
                            return {
                                top: input.offsetTop - margin - arrow - (input.height / 2),
                                left: input.offsetLeft + input.width + margin,
                                arrow: 0
                            };
                    }
                    break;
                case "top":
                    switch (this.config.arrowOn) {
                        case "left":
                            return {
                                top: input.offsetTop - dropdown.height - margin,
                                left: input.offsetLeft - margin,
                                arrow: 0
                            };
                        case "center":
                            return {
                                top: input.offsetTop - dropdown.height - margin,
                                left: input.offsetLeft - ((dropdown.width - (margin * 2) - input.width) / 2),
                                arrow: (dropdown.width - (arrow * 5)) / 2
                            };
                        case "right":
                            return {
                                top: input.offsetTop - dropdown.height - margin,
                                left: input.offsetLeft - (dropdown.width - input.width) + margin,
                                arrow: dropdown.width - (5 * arrow) + margin
                            };
                        default:
                            return {
                                top: input.offsetTop - dropdown.height - margin,
                                left: input.offsetLeft - margin,
                                arrow: 0
                            };
                    }
                    break;
                case "bottom":
                    switch (this.config.arrowOn) {
                        case "left":
                            return {
                                top: input.offsetTop + input.height - margin + arrow,
                                left: input.offsetLeft - margin,
                                arrow: 0
                            };
                        case "center":
                            return {
                                top: input.offsetTop + input.height - margin + arrow,
                                left: input.offsetLeft - ((dropdown.width - (margin * 2) - input.width) / 2),
                                arrow: (dropdown.width - (arrow * 5)) / 2
                            };
                        case "right":
                            return {
                                top: input.offsetTop + input.height - margin + arrow,
                                left: input.offsetLeft - (dropdown.width - input.width) + margin,
                                arrow: dropdown.width - (5 * arrow) + margin
                            };
                        default:
                            return {
                                top: input.offsetTop + input.height - margin + arrow,
                                left: input.offsetLeft - margin,
                                arrow: 0
                            };
                    }
                    break;
                case "center":
                    switch (this.config.arrowOn) {
                        case "center":
                            return {
                                top: input.offsetTop - margin - (dropdown.height / 2),
                                left: input.offsetLeft - ((dropdown.width - (margin * 2) - input.width) / 2)
                            };
                    }
                    break;
            }
        },
        /**
         * Moves the plugin dropdown relative to the input or return the calculated areas
         * @param               {boolean}    returnValues whether the method should apply the CSS or return the calculated values
         * @param               {object}     viewport the current viewport boundaries, top, right, bottom, left in pixels
         * @returns             {object}     if returnValues is set to true, it returns the calculated positions
         */
        positionOnTop: function (returnValues, viewport) {
            var setting = this.getDropdownPos("top");
            if (!returnValues) {
                this.container.style.left = (setting.left - 5) + "px";
                this.container.style.top = (setting.top - 5) + "px";
                var arrow = this.container.querySelector("div[class*='caleran-box-arrow-']");
                arrow.setAttribute("class", "caleran-box-arrow-bottom");
                arrow.style.left = setting.arrow + "px";
            } else {
                return setting;
            }
        },
        /**
         * Moves the plugin dropdown relative to the input or return the calculated areas
         * @param               {boolean}    returnValues whether the method should apply the CSS or return the calculated values
         * @param               {object}     viewport the current viewport boundaries, top, right, bottom, left in pixels
         * @returns             {object}     if returnValues is set to true, it returns the calculated positions
         */
        positionOnBottom: function (returnValues, viewport) {
            var setting = this.getDropdownPos("bottom");
            if (!returnValues) {
                this.container.style.left = (setting.left - 5) + "px";
                this.container.style.top = (setting.top - 5) + "px";
                var arrow = this.container.querySelector("div[class*='caleran-box-arrow-']");
                arrow.setAttribute("class", "caleran-box-arrow-top");
                arrow.style.left = setting.arrow + "px";
            } else {
                return setting;
            }
        },
        /**
         * Moves the plugin dropdown relative to the input or return the calculated areas
         * @param               {boolean}    returnValues whether the method should apply the CSS or return the calculated values
         * @param               {object}     viewport the current viewport boundaries, top, right, bottom, left in pixels
         * @returns             {object}     if returnValues is set to true, it returns the calculated positions
         */
        positionOnLeft: function (returnValues, viewport) {
            var setting = this.getDropdownPos("left");
            if (!returnValues) {
                this.container.style.left = (setting.left - 5) + "px";
                this.container.style.top = (setting.top - 5) + "px";
                var arrow = this.container.querySelector("div[class*='caleran-box-arrow-']");
                arrow.setAttribute("class", "caleran-box-arrow-right");
                arrow.style.top = setting.arrow + "px";
            } else {
                return setting;
            }
        },
        /**
         * Moves the plugin dropdown relative to the input or return the calculated areas
         * @param               {boolean}    returnValues whether the method should apply the CSS or return the calculated values
         * @param               {object}     viewport the current viewport boundaries, top, right, bottom, left in pixels
         * @returns             {object}     if returnValues is set to true, it returns the calculated positions
         */
        positionOnRight: function (returnValues, viewport) {
            var setting = this.getDropdownPos("right");
            if (!returnValues) {
                this.container.style.left = (setting.left + 5) + "px";
                this.container.style.top = (setting.top - 5) + "px";
                var arrow = this.container.querySelector("div[class*='caleran-box-arrow-']");
                arrow.setAttribute("class", "caleran-box-arrow-left");
                arrow.style.top = setting.arrow + "px";
            } else {
                return setting;
            }
        },
        /**
         * Moves the plugin dropdown relative to the input
         * @param               {object}     viewport the current viewport boundaries, top, right, bottom, left in pixels
         * @returns             {object}
         */
        positionOnCenter: function (viewport) {
            var setting = this.getDropdownPos("center");
            var offsetX = Math.max((setting.left + this.container.clientWidth) - (viewport.right - 30), 0);
            var offsetY = Math.max((setting.top + this.container.clientHeight) - (viewport.bottom - 30), 0);
            if (!this.config.autoAlign) {
                offsetX = 0;
                offsetY = 0;
            }
            setting.left -= offsetX;
            setting.top -= offsetY;
            this.container.style.left = setting.left;
            this.container.style.top = setting.top;
            var arrow = this.container.querySelector("div[class*='caleran-box-arrow-']");
            if(arrow) arrow.parentNode.removeChild(arrow);
        },
        /**
         * Position the plugin dropdown relative to the input or return the calculated areas, and fixes if any overflow occurs
         */
        positionOnBottomAlign: function (viewport) {
            var standardPosition = this.positionOnBottom(true, viewport);
            var dropdown = this.getDimensions(this.container);
            //this.debugPosition("bottomalign", standardPosition.top, standardPosition.left, standardPosition.left + dropdown.width, standardPosition.top + dropdown.height, "rgba(0,128,0,0.5)");
            if (standardPosition.top + dropdown.height < viewport.bottom) {
                this.positionOnBottom(false, viewport);
            } else {
                this.positionOnTop(false, viewport);
            }
        },
        /**
         * Position the plugin dropdown relative to the input or return the calculated areas, and fixes if any overflow occurs
         */
        positionOnLeftAlign: function (viewport) {
            var standardPosition = this.positionOnLeft(true, viewport);
            if (standardPosition.left > viewport.left - 50) {
                this.positionOnLeft(false, viewport);
            } else {
                this.positionOnRight(false, viewport);
            }
        },
        /**
         * Position the plugin dropdown relative to the input or return the calculated areas, and fixes if any overflow occurs
         */
        positionOnRightAlign: function (viewport) {
            var standardPosition = this.positionOnRight(true, viewport);
            var dropdown = this.getDimensions(this.container);
            if (standardPosition.left + dropdown.width < viewport.right + 50) {
                this.positionOnRight(false, viewport);
            } else {
                this.positionOnLeft(false, viewport);
            }
        },
        /**
         * Position the plugin dropdown relative to the input or return the calculated areas, and fixes if any overflow occurs
         */
        positionOnTopAlign: function (viewport) {
            var standardPosition = this.positionOnTop(true, viewport);
            if (standardPosition.top > viewport.top) {
                this.positionOnTop(false, viewport);
            } else {
                this.positionOnBottom(false, viewport);
            }
        },
        /**
         * Helper method for getting an element's inner/outer dimensions and positions
         * @param  [DOMelement] elem  The element whose dimensions and position are wanted
         * @param  {boolean}     outer true/false variable which tells the method to return inner(false) or outer(true) dimensions
         * @return {object}      an user defined object which contains the width and height of the element and top and left positions relative to the viewport
         */
        getDimensions: function (element, outer) {
            var off = { left: 0, top: 0 }, parent = element;
            this.attachScrollEvents(element);
            // now return the dimensions
            while(parent != null  && parent != document.body) {
                var style = window.getComputedStyle(parent);
                if(style.position == "fixed") {
                    off.top = off.top + window.scrollY + parseInt(style.top, 10);
                    off.left = off.left + window.scrollX + parseInt(style.left, 10);
                    break;
                } else {
                    off.left = off.left + parent.offsetLeft;
                    off.top = off.top + parent.offsetTop;
                    parent = parent.offsetParent;
                }
            }

            return {
                width: element.offsetWidth,
                height: element.offsetHeight,
                offsetLeft: off.left,
                offsetTop: off.top
            };
        },
        attachScrollEvents: function(element) {
            var doc = document, body = doc.body;
            if (element === this.elem && this.globals.parentScrollEventsAttached == false) {
                // give each scroll parent a callback when they'll run on scrolling
                var scrollParent = this.proxy(function () {
                    if(this.globals){
                        // dont run while it's already running
                        if (!this.globals.isTicking) {
                            this.globals.isTicking = true;
                            // rAF technique implementation
                            this.globals.rafID = this.requestAnimFrame(this.proxy(function () {
                                this.setViewport();
                                this.cancelAnimFrame(this.globals.rafID);
                                this.globals.isTicking = false;
                            }, this));
                        }
                    }
                }, this);

                // find the scrollable parents
                if (element !== body) {
                    var parent = element.parentNode;
                    while (parent !== body && parent !== null) {
                        // if the parent is scrollable
                        if (parent.scrollHeight > parent.offsetHeight) {
                            // attach the scroll event
                            this.rebindEvent(parent, "scroll", scrollParent);
                        }
                        // switch to next parent
                        parent = parent.parentNode;
                    }
                }
                // don't attach again once attached.
                this.globals.parentScrollEventsAttached = true;
            }
        },
        /**
         * Helper method for getting the window viewport
         * @return {object}     an user defined object which contains the rectangular position and dimensions of the viewport
         */
        getViewport: function () {
            var top = this.globals.lastScrollY, left = this.globals.lastScrollX, bottom = top + window.innerHeight, right = left + window.innerWidth;
            //this.debugPosition("caleran-viewport", top + 30, left + 30, right - 30, bottom - 30, "rgba(128,0,0,0.5)");
            return { top: top, left: left, right: right, bottom: bottom };
        },
        debugPosition: function(name, top, left, right, bottom, color){
            if(document.body.querySelectorAll("#"+name).length > 0){
                document.body.removeChild(document.body.querySelector("#"+name));
            }

            document.body.insertAdjacentHTML("beforeend", "<div id='"+name+"'>;</div>");
            var vpelem = document.querySelector("#"+name);

            vpelem.style.top = (top) + "px";
            vpelem.style.left = (left) + "px";
            vpelem.style.right = (right) + "px";
            vpelem.style.bottom = (bottom) + "px";
            vpelem.style.position = "absolute";
            vpelem.style.backgroundColor = color;
            vpelem.style.zIndex = 100000;
            vpelem.style.opacity = 0.5;
            vpelem.style.width = (right - left) + "px";
            vpelem.style.height = (bottom - top) + "px";
            vpelem.style.pointerEvents = "none";
        },
        rebindEventEach: function(container, selector, event, callback, once){
            var elems = container.querySelectorAll(selector);
            for(var el = 0; el < elems.length; el++) {
                this.rebindEvent(elems[el], event, callback, once);
            }
        },
        rebindEvent: function(element, event, callback, once){
            var events = event.split(" ").map(function(item) { return item.trim(); });
            for(var e = 0, len = events.length; e < len; e++) {
                this.events.remove(element, events[e], callback);
                this.events.add(element, events[e], callback, once);
            }
        },
        rebindEventScoped: function(element, scope, event, callback, once){
            this.rebindEvent(element, event, function(e) {
                var eventTarget = e.target || e.srcElement;
                // loop parent nodes from the target to the delegation node
                if (eventTarget && (this.matches(eventTarget, scope) || this.closest(eventTarget, scope))) {
                    return callback.call(eventTarget, e);
                }
            }.bind(this), once);
        },
        matches: function(element, scope){
            if (element && !element.matches) {
                var proto = Object.getPrototypeOf(element);
                proto.matches = proto.matchesSelector ||
                    proto.mozMatchesSelector || proto.msMatchesSelector ||
                    proto.oMatchesSelector || proto.webkitMatchesSelector;
                    try {
                        return proto.matches(scope);
                    }catch(e){
                        return false;
                    }
            } else {
                return element.matches(scope);
            }
        },
        closest: function(element, selector){
            var that = this;
            if (element && !element.closest) {
                var proto = Object.getPrototypeOf(element);
                proto.closest = function(s) {
                    var el = this;
                    do {
                        if (that.matches(el, s)) return el;
                        el = el.parentElement || el.parentNode;
                    } while (el !== null && el.nodeType === 1);
                    return null;
                };
                try {
                    return proto.closest(selector);
                }catch(e){
                    return false;
                }
            } else {
                return element.closest(selector);
            }
        },
        removeEventEach: function(container, selector, event) {
            var events = event.split(" ").map(function(item) { return item.trim(); }), that = this;
            for(var e = 0, len = events.length; e < len; e++) {
                var items = container.querySelectorAll(selector);
                for(var i = 0, len2 = items.length; i < len2; i++){
                    this.events.remove(items[i], events[e]);
                }
            }
        },
        /**
         * Attaches the related events on the elements after render/update
         * @return void
         */
        attachEvents: function () {
            var clickNextEvent = this.drawNextMonth.bind(this);
            var clickPrevEvent = this.drawPrevMonth.bind(this);
            var clickCellEvent = this.cellClicked.bind(this);
            var hoverCellEvent = this.cellHovered.bind(this);
            var rangeClickedEvent = this.rangeClicked.bind(this);
            var monthSwitchClickEvent = this.monthSwitchClicked.bind(this);
            var yearSwitchClickEvent = this.yearSwitchClicked.bind(this);
            var clickEvent = "click";

            this.rebindEventEach(this.container, ".caleran-next", clickEvent, !this.config.isRTL ? clickNextEvent : clickPrevEvent, true);
            this.rebindEventEach(this.container, ".caleran-prev", clickEvent, !this.config.isRTL ? clickPrevEvent : clickNextEvent, true);
            this.rebindEventEach(this.container, ".caleran-day", clickEvent, clickCellEvent, false);
            this.rebindEventEach(this.container, ".caleran-day", "mouseover", hoverCellEvent, false);
            this.removeEventEach(this.container, ".caleran-disabled:not(.caleran-day)", clickEvent);
            this.rebindEventEach(this.container, ".caleran-range", clickEvent, rangeClickedEvent, false);
            this.rebindEventEach(this.container, ".caleran-month-switch", clickEvent, monthSwitchClickEvent, false);
            this.rebindEventEach(this.container, ".caleran-year-switch", clickEvent, yearSwitchClickEvent, false);

            if (this.globals.isMobile === true && this.config.enableSwipe == true) {
                this.rebindEvent(this.container, "touchstart", function(e){
                    if(this.globals && event.changedTouches.length > 0){
                        this.globals.swipeX = event.changedTouches[0].screenX;
                        this.globals.swipeY = event.changedTouches[0].screenY;
                        this.globals.swipeStart = +new Date();
                    }
                }.bind(this));
                this.rebindEvent(this.container, "touchend", function(event){
                    if(this.globals && event.changedTouches.length > 0 &&
                        Math.abs(this.globals.swipeY - event.changedTouches[0].screenY) < 50 &&
                        Math.abs(this.globals.swipeX - event.changedTouches[0].screenX) > 100 &&
                        ((+new Date()) - this.globals.swipeStart) < 250) {
                        if(this.globals.swipeX < event.changedTouches[0].screenX) clickNextEvent();
                        else if(this.globals.swipeX >= event.changedTouches[0].screenX) clickPrevEvent();
                    }
                }.bind(this));
            }

            if ((this.globals.isMobile || this.config.showButtons) && !this.config.inline) {
                this.rebindEventEach(this.input, ".caleran-cancel", "click", this.proxy(function (event) {
                    if(this.config.onCancel(this, this.config.startDate, this.config.endDate) == true) {
                        if (this.globals.startDateInitial) this.config.startDate = this.globals.startDateInitial.clone();
                        if (this.globals.endDateInitial) this.config.endDate = this.globals.endDateInitial.clone();
                        this.hideDropdown(event);
                    }
                }, this), false);

                this.rebindEventEach(this.input, ".caleran-apply", "click", this.proxy(function (event) {
                    if (this.config.onbeforeselect(this, this.config.startDate.clone(), this.config.endDate.clone()) === true && this.checkRangeContinuity() === true) {
                        this.globals.firstValueSelected = true;
                        if (this.globals.delayInputUpdate) {
                            this.globals.delayInputUpdate = false;
                            this.updateInput(true);
                            this.globals.delayInputUpdate = true;
                        }
                        else {
                            this.updateInput(true);
                        }
                    } else {
                        this.fetchInputs();
                    }
                    this.hideDropdown(event);
                }, this), false);
            }
        },
        isVisible: function( elem ) {
            return elem.offsetWidth > 0 && elem.offsetHeight > 0;
        },
        /**
         * Events per instance
         */
        addInitialEvents: function () {
            // buffer current scope
            var that = this;

            // create namespaced event name
            var eventClick = "click";

            // create a instance specific unique document click event, which will be used to hide the dropdown
            this.events.add(document, "click", this.proxy(function (e) {
                if (this.globals && this.globals.isMobile === false && this.config.inline === false) {
                    var event = e || window.event || new Event("click", { target: "body" });
                    var eventTarget = event.target || event.srcElement;
                    if (this.contains(this.container, eventTarget) === false &&
                        this.elem !== eventTarget && this.isVisible(this.container)) {
                        this.hideDropdown(event);
                    }
                }
            }, this));

            // if the keyboard interaction is enabled, redefine the click event
            if (this.config.enableKeyboard) eventClick = "click focus";

            // prepare the input click + focus event which will open the dropdown
            this.rebindEvent(this.elem, eventClick, this.proxy(this.debounce(function (e) {
                var event = e || window.event || new Event("click", { target: "body" });
                var eventTarget = event.target || event.srcElement;
                if (this.input.clientHeight > 0 && this.config.target !== eventTarget) {
                    this.hideDropdown(event);
                } else {
                    this.events.dispatch(document, "click");
                    this.showDropdown(event);
                }
            }, 100, true), this), false);

            // on mobile screens, add an event to restyle the modal when a layout change occurs
            if (this.globals.isMobile) {
                this.events.add(window, "resize", function () {
                    that.events.dispatch(that.container, "caleran:resize");
                });
            }

            // define the mobile resize event
            this.events.add(this.container, "caleran:resize", function () {
                that.globals.rafID = that.requestAnimFrame(function () {
                    if(that.globals) {
                        if (that.input.style.display !== "none") {
                            var oneCalendarHeight = that.input.querySelector(".caleran-calendar:first-child");
                            if(oneCalendarHeight && that.isVisible(oneCalendarHeight)) {
                                oneCalendarHeight = oneCalendarHeight.clientHeight;
                                that.input.querySelector(".caleran-calendars").style.height = oneCalendarHeight + "px";
                                if (that.input.offsetTop < 0) that.input.classList.add("caleran-input-top-reset");
                                if (window.innerWidth > window.innerHeight) {
                                    // landscape mode
                                    that.input.style.height = oneCalendarHeight + "px";
                                } else {
                                    // portrait mode
                                   that.input.style.height = "auto";
                                }
                            }
                            that.cancelAnimFrame(that.globals.rafID);
                        }
                    }
                });
            });

            // run the event once if the environment is mobile and (possibly) display is inline
            if (this.input.style.display !== "none" && this.globals.isMobile) {
                this.events.dispatch(this.container, "caleran:resize");
            }

            // append the desktop layout refreshing event
            if (this.globals.isMobile === false) {
                this.rebindEvent(window, "resize scroll", function () {
                    // dont run while it's already running
                    if(that.globals) {
                        if (!that.globals.isTicking) {
                            that.globals.isTicking = true;
                            // rAF technique implementation
                            that.globals.lastScrollX = window.scrollX || window.pageXOffset || document.documentElement.scrollLeft;
                            that.globals.lastScrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
                            that.globals.rafID = that.requestAnimFrame(that.proxy(function () {
                                if(this.globals){
                                    this.setViewport();
                                    this.globals.isTicking = false;
                                    this.cancelAnimFrame(this.globals.rafID);
                                }
                            }, that));
                        }
                    }
                });
            }
        },
        contains:function(parentNode,childNode){
            if('contains' in parentNode) {
                return parentNode.contains(childNode);
            }
            else {
                return parentNode.compareDocumentPosition(childNode) % 16;
            }
        },
        /**
         * cross browser event bubbling (propagation) prevention handler
         * @return void
         */
        stopBubbling: function (e) {
            if (typeof e.stopPropagation !== "undefined") {
                e.stopPropagation();
            } else if (typeof e.cancelBubble !== "undefined") {
                e.cancelBubble = true;
            }
            if (typeof e.preventDefault !== "undefined") {
                e.preventDefault();
            }
            e.returnValue = false;
            return false;
        },
        /**
         * Delays a multiple triggered method execution after the last one has been triggered
         * @return [function] given callback execution promise/result
         */
        debounce: function (func, wait, immediate) {
            return function () {
                var context = this, args = arguments;
                if(context.globals){
                    var later = function () {
                        if(context.globals){
                            context.globals.throttleTimeout = null;
                            if (!immediate) func.apply(context, args);
                        }
                    };
                    var callNow = immediate && !context.globals.throttleTimeout;
                    clearTimeout(context.globals.throttleTimeout);
                    context.globals.throttleTimeout = setTimeout(later, wait);
                    if (callNow) func.apply(context, args);
                }
            };
        },
        /**
         * Mimics jQuery.proxy
         */
        proxy: function(callback, scope) {
            return callback.bind(scope);
        },
        extend: function(defaults, options) {
            var extended = {};

            copyObj(extended, defaults);
            copyObj(extended, options);

            function copyObj(to, from) {
                for (var key in from) {
                    if (Object.prototype.hasOwnProperty.call(from, key)) {
                    to[key] = from[key];
                    }
                }
            }
            return extended;
        },
        /**
         * javascript rAF implementation for cross browser compatibility
         */
        requestAnimFrame: function (callback) {
            if (typeof window.requestAnimationFrame === "function") return requestAnimationFrame(callback);
            if (typeof window.webkitRequestAnimationFrame === "function") return webkitRequestAnimationFrame(callback);
            if (typeof window.mozRequestAnimationFrame === "function") return mozRequestAnimationFrame(callback);
            return setTimeout(callback, 100 / 6);
        },
        /**
         * javascript cAF implementation for cross browser compatibility
         */
        cancelAnimFrame: function (id) {
            if (typeof window.cancelAnimationFrame === "function") return cancelAnimationFrame(id);
            if (typeof window.webkitCancelAnimationFrame === "function") return webkitCancelAnimationFrame(id);
            if (typeof window.mozCancelAnimationFrame === "function") return mozCancelAnimationFrame(id);
            return clearTimeout(id);
        },
        /**
         * Attaches keyboard events if enabled
         * @return void
         */
        addKeyboardEvents: function () {
            if (this.config.enableKeyboard) {
                var keyDownEvent = function (event) {
                    var keycode = (event.which) ? event.which : event.keyCode;
                    if (this.globals.keyboardHoverDate === null) {
                        if (this.config.startDate === null) {
                            this.globals.keyboardHoverDate = moment({
                                day: 1,
                                month: parseInt(this.calendars.first().getAttribute("data-month"))
                            }).middleOfDay();
                        } else {
                            this.globals.keyboardHoverDate = this.config.startDate.clone().middleOfDay();
                        }
                    } else {
                        this.globals.keyboardHoverDate.middleOfDay();
                    }
                    var shouldReDraw = false, shouldPrevent = false;
                    switch (keycode) {
                        case 37: // left
                            this.globals.keyboardHoverDate.add(-1, "day");
                            shouldReDraw = true;
                            shouldPrevent = true;
                            break;
                        case 38: // top
                            this.globals.keyboardHoverDate.add(-1, "week");
                            shouldReDraw = true;
                            shouldPrevent = true;
                            break;
                        case 39: // right
                            this.globals.keyboardHoverDate.add(1, "day");
                            shouldReDraw = true;
                            shouldPrevent = true;
                            break;
                        case 40: // bottom
                            this.globals.keyboardHoverDate.add(1, "week");
                            shouldReDraw = true;
                            shouldPrevent = true;
                            break;
                        case 32: // space
                            this.input.querySelectorAll(".caleran-day[data-value='" + this.globals.keyboardHoverDate.middleOfDay().unix() + "']")[0].click();
                            shouldReDraw = false;
                            shouldPrevent = true;
                            break;
                        case 33: // page up
                            if (event.shiftKey) {
                                this.globals.keyboardHoverDate.add(-1, "years");
                            } else {
                                this.globals.keyboardHoverDate.add(-1, "months");
                            }
                            shouldReDraw = true;
                            shouldPrevent = true;
                            break;
                        case 34: // page down
                            if (event.shiftKey) {
                                this.globals.keyboardHoverDate.add(1, "years");
                            } else {
                                this.globals.keyboardHoverDate.add(1, "months");
                            }
                            shouldReDraw = true;
                            shouldPrevent = true;
                            break;
                        case 27: // esc
                        case 9: // tab
                            this.hideDropdown(event);
                            break;
                        case 36: // home
                            if (event.shiftKey) {
                                this.globals.keyboardHoverDate = moment().middleOfDay();
                                shouldReDraw = true;
                                shouldPrevent = true;
                            }
                            break;
                    }
                    if (shouldReDraw || shouldPrevent) {
                        this.globals.keyboardHoverDate = this.globals.keyboardHoverDate.middleOfDay();
                        var days = this.input.querySelectorAll(".caleran-day[data-value]");
                        if (this.globals.keyboardHoverDate.isBefore(moment.unix(days[0].getAttribute("data-value")), "day") ||
                            this.globals.keyboardHoverDate.isAfter(moment.unix(days[days.length - 1].getAttribute("data-value")), "day")) {
                            this.globals.currentDate = this.globals.keyboardHoverDate.clone().startOfMonth();
                            this.reDrawCalendars();
                            shouldReDraw = false;
                        }
                        if (shouldReDraw) {
                            this.globals.hoverDate = null;
                            this.reDrawCells();
                        }
                        if (shouldPrevent) return this.stopBubbling(event);
                        return false;
                    }
                }.bind(this);
                this.rebindEvent(this.elem, "keydown", keyDownEvent, false);
                this.rebindEvent(this.container, "keydown", keyDownEvent, false);
            }
        },
        /**
         * Destroys the instance
         */
        destroy: function () {
            if (this.config.onBeforeDestroy(this)) {
                this.events.remove(this.container, "caleran:resize");
                if (this.config.inline) {
                    this.input.parentNode.removeChild(this.input);
                    if (this.globals.isMobile)
                        this.unwrap(this.elem, "caleran-container-mobile");
                    else
                        this.unwrap(this.elem, "caleran-container");
                    this.elem.type = 'text';
                } else {
                    this.container.parentNode.removeChild(this.container);
                }
                this.events.remove(document, this.globals.documentEvent);
                this.elem.caleran = null;
                this.config.ondestroy(this);

                var i = null;

                for(i in this.config) this.config[i] = null;
                this.config = null;

                for(i in this.globals) this.globals[i] = null;
                this.globals = null;
            }
        },
        unwrap: function (item, parentClass) {
            if(item && item.parentNode && item.parentNode.classList.contains(parentClass)) {
                item.parentNode.insertAdjacentHTML("beforebegin", item.parentNode.innerHTML);
                var wrapper = item.parentNode.parentNode.querySelector("." + parentClass);
                wrapper.parentNode.removeChild(wrapper);
            }
        },
        /**
         * Detects if the browser is mobile
         * @return {boolean} if the browser is mobile or not
         */
        checkMobile: function () {
            return window.matchMedia("only screen and (max-width: " + this.config.mobileBreakpoint + "px)").matches;
        },
        /**
         * Converts the given datetime variable to momentjs object
         * @param {mixed} datetime the datetime variable to convert to moment object
         * @return {momentobject} the converted variable
         */
        fixDateTime: function(datetime){
            if(datetime != null && moment.isMoment(datetime) == false){
                if(typeof datetime === "string"){
                    datetime = moment(datetime, this.config.format).locale(this.config.locale);
                }else{
                    datetime = moment(datetime).locale(this.config.locale);
                }
            }
            return datetime;
        },
        /**
         * set start date & time programmatically
         * @param {moment object | js Date object | ISO Datetime string} datetime the value to be set
         */
        setStart: function (datetime) {
            var datetimeConverted = this.fixDateTime(datetime);
            if (this.isDisabled(datetimeConverted) === false && moment(datetimeConverted).isValid()) {
                this.config.startDate = moment(datetimeConverted);
                this.refreshValues();
            }
        },
        /**
         * set end date & time programmatically
         * @param {moment object | js Date object | ISO Datetime string} datetime the value to be set
         */
        setEnd: function (datetime) {
            var datetimeConverted = this.fixDateTime(datetime);
            if (this.isDisabled(datetimeConverted) === false && moment(datetimeConverted).isValid()) {
                this.config.endDate = moment(datetimeConverted);
                this.refreshValues();
            }
        },
        /**
         * set min date & time programmatically
         * @param {moment object | js Date object | ISO Datetime string} datetime the value to be set
         */
        setMinDate: function (datetime) {
            var datetimeConverted = this.fixDateTime(datetime);
            if (moment(datetimeConverted).isValid()) {
                this.config.minDate = moment(datetimeConverted);
                this.refreshValues();
            }
        },
        /**
         * set max date & time programmatically
         * @param {moment object | js Date object | ISO Datetime string} datetime the value to be set
         */
        setMaxDate: function (datetime) {
            var datetimeConverted = this.fixDateTime(datetime);
            if (moment(datetimeConverted).isValid()) {
                this.config.maxDate = moment(datetimeConverted);
                this.refreshValues();
            }
        },
        /**
         * Sets the displayed month and year
         * @param {moment object | js Date object | ISO Datetime string} datetime the value to be set
         */
        setDisplayDate: function (datetime) {
            var datetimeConverted = this.fixDateTime(datetime);
            if (moment(datetimeConverted).isValid()) {
                this.globals.currentDate = moment(datetimeConverted);
                this.reDrawCalendars();
            }
        },
        /**
         * private method to reset the startdate and enddate to the input
         * @returns void
         */
        refreshValues: function () {
            var backup = this.globals.delayInputUpdate;
            this.globals.delayInputUpdate = false;
            this.validateDates();
            this.updateInput();
            this.globals.delayInputUpdate = backup;
            this.reDrawCells();
        },
        eventsPrototype: function(){
            return {
                instanceId: null,
                init: function(id){
                    this.instanceId = id;
                },
                add: function(target, event, callback, once) {
                    var that = this;
                    // create eventbag if it doesn't exist
                    target.eventsList = target.eventsList || {};
                    event += ".caleran_" + this.instanceId;
                    var callbackName = event + "__" +  Object.keys(target.eventsList).filter(function(key){
                        return key.indexOf(event + "__") === 0;
                    }).length;
                    if(once) {
                        target.eventsList[callbackName] = function(e){
                            callback(e);
                            that.remove(target, event, callback);
                        };
                    } else {
                        target.eventsList[callbackName] = function(e){
                            callback(e);
                        };
                    }
                    var genericEvent = event.split(/\./)[0];
                    if(target.addEventListener) {
                        target.addEventListener(genericEvent, target.eventsList[callbackName], false);
                    } else if (target.attachEvent) {
                        target.attachEvent("on" + genericEvent, target.eventsList[callbackName]);
                    } else {
                        target["on" + genericEvent] = target.eventsList[callbackName];
                    }
                },
                remove: function(target, event, callback) {
                    if(typeof target.eventsList === "object"){
                        var eventKeys = [];
                        event += ".caleran_" + this.instanceId;
                        eventKeys = Object.keys(target.eventsList).filter(function(key){
                            return key.indexOf(event + "__") === 0;
                        });
                        for(var ek = 0; ek < eventKeys.length; ek++){
                            var eventKey = eventKeys[ek];
                            var genericEvent = event.split(/\./)[0];
                            if(typeof target.removeEventListener === "function") {
                                target.removeEventListener(genericEvent, target.eventsList[eventKey]);
                            } else if(target.detachEvent) {
                                target.detachEvent("on" + genericEvent, target.eventsList[eventKey]);
                            } else {
                                target["on" + genericEvent] = null;
                            }
                            delete target.eventsList[eventKey];
                        }
                    } else {
                        if (typeof target.removeEventListener === "function") {
                            target.removeEventListener(event, null);
                        } else if(target.detachEvent) {
                            target.detachEvent("on" + event, null);
                        }
                    }
                },
                dispatch: function(target, event) {
                    if(typeof target.eventsList === "object"){
                        event += ".caleran_" + this.instanceId;
                        var eventKeys = Object.keys(target.eventsList).filter(function(key){
                            return key.indexOf(event + "__") == 0;
                        });
                        for(var ek = 0; ek < eventKeys.length; ek++){
                            var eventKey = eventKeys[ek];
                            var genericEvent = eventKey.split(/\./)[0];
                            this.triggerEvent(target, genericEvent);
                        };
                    } else {
                        this.triggerEvent(target, event);
                    }
                },
                triggerEvent: function(el, eventName)
                {
                    var event;
                    if(document.createEvent){
                        event = document.createEvent('HTMLEvents');
                        event.initEvent(eventName, false, true);
                    }else if(document.createEventObject){// IE < 9
                        event = document.createEventObject();
                        event.eventType = eventName;
                    }
                    event.eventName = eventName;
                    if(el.dispatchEvent){
                        el.dispatchEvent(event);
                    }else if(el.fireEvent && htmlEvents['on'+eventName]){// IE < 9
                        el.fireEvent('on'+event.eventType,event);// can trigger only real event (e.g. 'click')
                    }else if(el[eventName]){
                        el[eventName]();
                    }else if(el['on'+eventName]){
                        el['on'+eventName]();
                    }
                }
            };
        }
    };

    caleranPlugin.defaults = caleranPlugin.prototype.defaults;
    /**
     * The main handler of caleran plugin
     * @param  {object} options javascript object which contains element specific or range specific options
     * @return {caleran} plugin reference
     */
    window.caleran = function (selector, options) {
        var i = 0;
        if(typeof selector == "string"){
            var items = document.querySelectorAll(selector);
            for(i = 0; i < items.length; i++){
                var item = items[i];
                item.caleran = new caleranPlugin(item, options).init();
            };
        }else if(typeof selector == "object"){
            if(NodeList.prototype.isPrototypeOf(selector)){
                for(i = 0; i < selector.length; i++) {
                    selector[i].caleran = new caleranPlugin(selector[i], options).init();
                }
            }else{
                selector.caleran = new caleranPlugin(selector, options).init();
            }
        }
    };

    /**
     * add middleOfDay method to moment.js to set 12:00:00 for the current moment
     * @return {object} modified momentjs instance.
     */
    if (typeof moment.fn.middleOfDay !== "function") {
        moment.fn.middleOfDay = function () {
            this.hours(12).minutes(0).seconds(0);
            return this;
        };
        moment.fn.startOfMonth = function () {
            this.middleOfDay().date(1);
            return this;
        };
    }
})(window, document);