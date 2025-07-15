/**
 * @author Abdul Razzak
 * @description This file manages the flight search functionality, including airport lookups,
 * passenger counting, trip type selection (One-Way, Round-Trip, Multi-City),
 * date handling, and building the final search query.
 */

// ===================================================================================
// GLOBAL VARIABLES & INITIAL SETUP
// ===================================================================================

let airportlist = []; // Holds the list of airports fetched from the API.

// Stores details about the travellers and class type.
let TravellerDetails = {
    classType: 'Economy',
    Adult: 1,
    child: 0,
    Infant: 0,
};

let advancedSerch = true; // Toggles the advanced search section visibility.

// Initial setup calls when the script loads.
PaxCount('', ''); // Initialize passenger count display.
bindMultiCityFrom(); // Add the first multi-city form.
bindMultiCityFrom(); // Add the second multi-city form for default view.
GetAirportList(undefined, null); // Pre-fetch airport list for faster initial search.

// ===================================================================================
// AIRPORT SEARCH & AUTOCOMPLETE
// ===================================================================================

/**
 * Fetches a list of airports from the API based on user input.
 * @param {HTMLElement} element - The input element that triggered the function.
 * @param {string|null} check - A flag to determine which input field is being used.
 */
async function GetAirportList(element, check) {
    // Use 'BOM' as default search value if input is empty.
    let inpVal = check ? (element.value ? element.value : 'BOM') : 'BOM';
    if (inpVal.length >= 3) {
        try {
            const request = new Request(`${config.adminApiUrl}/MasterSearch/GetAllMasterSearch/en/${inpVal}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'OrgId': '2206040706597097092' }
            });
            const newRequest = UtilService.headerSetup(request);
            const response = await fetch(newRequest);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            airportlist = data; // Store the fetched list globally.
            autobind(element, check, airportlist); // Bind the list to the dropdown.
        } catch (error) {
            console.error("Failed to fetch airport list:", error);
        }
    }
}

/**
 * Binds the airport list to the correct dropdown for autocomplete.
 * @param {HTMLElement} element - The input element.
 * @param {string} check - Flag to differentiate between 'From' ('0') and 'To' ('1') fields.
 * @param {Array} obj - The list of airports to display.
 */
function autobind(element, check, obj) {
    if (element) {
        // Show the appropriate dropdown.
        const dropdownClass = check === '0' ? 'show' : 'showdepart';
        const dropdownContent = element.closest(".searchBox").querySelector(check === '0' ? ".dropdown-content" : ".depart-content");
        dropdownContent.classList.add(dropdownClass);
    }

    let html = '';
    let airlist = obj || airportlist;
    airlist.map(e => {
        html += ` <li class="dropdown-item" onclick="ApplyAirport(this)" data-city-name="${e.ct}" data-airport-name="${e.an}" data-airport-code="${e.ac}" data-country-code="${e.cc}">
                      <div class="autoCompleteIcon">
                        <svg focusable="false" color="inherit" fill="currentcolor" aria-hidden="true" role="presentation" viewBox="0 0 150 150" preserveAspectRatio="xMidYMid meet" width="24px" height="24px" class="sc-bxivhb dttlRz sc-jxGEyO iICATY">
                          <path d="M118.9 15.7L90.7 43.9l-80.9-25c-1.6-.4-3.3 0-4.6 1.1L.7 24.5c-.9.8-.9 2.1-.2 3 .2.2.4.3.6.4l65.2 40.4-24 24c-3.8 3.7-7.2 7.8-10.2 12.2l-18.2-5c-1.6-.4-3.3.1-4.6 1.2l-3.5 3.5c-1 .8-1 2.3-.2 3.3l.4.4 18.6 13.9.6.5-.2.5c-1.8 3.7-1.2 4.3 2.5 2.5l.5-.2c.2.2.3.4.5.6l13.9 18.6c.7 1 2.2 1.3 3.2.6.1-.1.3-.2.4-.3l3.5-3.5c1.1-1.3 1.6-3 1.2-4.6l-5-18.2c4.4-3 8.5-6.4 12.2-10.2l24-24 40.1 64.7c.6 1 1.8 1.4 2.8.8.2-.1.4-.3.6-.4l4.5-4.5c1.1-1.2 1.5-3 1.1-4.6l-24.9-80.3 28.4-28.4C150 15.9 152 4.9 148.7 1.6S134.4.2 118.9 15.7z"></path>
                        </svg>
                      </div>
                      <div class="ListTypeCity">
                        <span>${e.ct}</span>
                        <span>${e.an}</span>
                      </div>
                      <span class="airportCode">${e.ac}</span>
                    </li>`;
    });

    if (element) {
        element.closest(".searchBox").querySelector(".dropdown-wrapper").innerHTML = html;
    }
}

/**
 * Applies the selected airport details to the input field.
 * @param {HTMLElement} element - The selected 'li' element from the dropdown.
 */
function ApplyAirport(element) {
    let city_name = element.getAttribute("data-city-name");
    let code = element.getAttribute("data-airport-code");
    let inputField = element.closest(".search-border").querySelector('input');

    inputField.value = city_name;
    inputField.setAttribute("data-airport-code", code);

    // If in multi-city and not the destination field, auto-fill the next origin.
    if (!inputField.classList.contains('Origin')) {
        let nextform = element.closest('.MultiForm')?.nextElementSibling;
        if (nextform?.querySelector('.Origin')) {
            nextform.querySelector('.Origin').value = city_name;
            nextform.querySelector('.Origin').setAttribute("data-airport-code", code);
        }
    }
}

/**
 * Swaps the values of the Origin and Destination fields.
 * @param {HTMLElement} elmnt - The swap icon element.
 */
function ExchangeValue(elmnt) {
    let element = elmnt.closest('.toFromSearchWrapper');
    let From = element.querySelector('.Origin');
    let To = element.querySelector('.depart');

    var fromValue = From.value;
    var fromCode = From.getAttribute('data-airport-code');

    From.value = To.value;
    From.setAttribute('data-airport-code', To.getAttribute('data-airport-code'));

    To.value = fromValue;
    To.setAttribute('data-airport-code', fromCode);
}


// ===================================================================================
// PASSENGER & CLASS TYPE SELECTION
// ===================================================================================

/**
 * Manages the passenger count for adults, children, and infants.
 * @param {string} pax - The type of passenger ('adult', 'child', 'infant').
 * @param {string} btn_name - The action ('add' or 'remove').
 */
function PaxCount(pax, btn_name) {
    let Adul_num = parseInt(document.getElementById("adult").value);
    let child_Num = parseInt(document.getElementById("child").value);
    let Infant_child = parseInt(document.getElementById("infant").value);

    // --- Handle adding passengers ---
    if (btn_name === 'add') {
        // Total adults and children cannot exceed 9.
        if ((pax === "adult" || pax === "child") && (Adul_num + child_Num < 9)) {
            document.getElementById(pax).value = parseInt(document.getElementById(pax).value) + 1;
        }
        // Number of infants cannot exceed the number of adults.
        if (pax === "infant" && Infant_child < Adul_num) {
            document.getElementById(pax).value = parseInt(document.getElementById(pax).value) + 1;
        }
    }
    // --- Handle removing passengers ---
    else if (btn_name === 'remove') {
        if (pax === "adult" && Adul_num > 1) {
            document.getElementById(pax).value = parseInt(document.getElementById(pax).value) - 1;
            // If removing an adult makes infants > adults, remove an infant too.
            if (parseInt(document.getElementById("infant").value) > (Adul_num - 1)) {
                document.getElementById('infant').value = parseInt(document.getElementById("infant").value) - 1;
            }
        } else if (pax === "child" && child_Num > 0) {
            document.getElementById(pax).value = parseInt(document.getElementById(pax).value) - 1;
        } else if (pax === "infant" && Infant_child > 0) {
            document.getElementById(pax).value = parseInt(document.getElementById(pax).value) - 1;
        }
    }

    // Update live values after any change
    Adul_num = parseInt(document.getElementById('adult').value);
    child_Num = parseInt(document.getElementById('child').value);
    Infant_child = parseInt(document.getElementById('infant').value);

    // --- Update button states (disabled/enabled) based on rules ---
    document.querySelector(".adult_minus_btn").classList.toggle("disableBtn", Adul_num === 1);
    document.querySelector(".child_minus_btn").classList.toggle('disableBtn', child_Num === 0);
    document.querySelector(".infant_minus_btn").classList.toggle("disableBtn", Infant_child === 0);

    const totalAdultsAndChildren = Adul_num + child_Num;
    document.querySelector(".adult_plus_btn").classList.toggle('disableBtn', totalAdultsAndChildren === 9);
    document.querySelector(".child_plus_btn").classList.toggle("disableBtn", totalAdultsAndChildren === 9);
    document.querySelector(".infant_plus_btn").classList.toggle("disableBtn", Infant_child === Adul_num);

    // --- Update UI display ---
    updateTravellerDisplay(Adul_num, child_Num, Infant_child);

    // --- Store the latest values ---
    TravellerDetails.Adult = Adul_num;
    TravellerDetails.child = child_Num;
    TravellerDetails.Infant = Infant_child;
}

/**
 * Updates the traveller count and class type display.
 */
function updateTravellerDisplay(adults, children, infants) {
    let totalTravellers = adults + children + infants;
    let paxSearch = document.getElementsByClassName('TravelerClassCount');
    for (let i = 0; i < paxSearch.length; i++) {
        paxSearch[i].innerHTML = `<h4>${totalTravellers} Traveller</h4> <h4>${TravellerDetails.classType}</h4>`;
    }
}

/**
 * Sets the selected class type (e.g., Economy, Business).
 * @param {HTMLElement} Btn - The button element for the class type.
 * @param {string} name - The name of the class type.
 */
function ClassType(Btn, name) {
    document.querySelectorAll('.classBtn').forEach(box => box.classList.remove('classTypeBorder'));
    Btn.classList.add('classTypeBorder');
    TravellerDetails.classType = name;
    PaxCount('', ''); // Update display
}

/**
 * Shows the passenger counter dropdown.
 */
function ShowPaxCounter() {
    document.getElementById('TravellerCount').classList.remove('travel-content', 'd-none');
}

/**
 * Hides the passenger counter dropdown after applying changes.
 */
function ApplyTraveller() {
    document.getElementById('TravellerCount').classList.add('travel-content');
}

/**
 * Resets the passenger counter and class type to default values.
 */
function resetAllPaxCounter() {
    document.getElementById("infant").value = 0;
    document.getElementById("child").value = 0;
    document.getElementById("adult").value = 1;
    TravellerDetails.Adult = 1;
    TravellerDetails.child = 0;
    TravellerDetails.Infant = 0;
    ClassType(document.querySelector('.EconomyClass'), 'Economy');
    PaxCount('', ''); // Update UI
}


// ===================================================================================
// MULTI-CITY FUNCTIONALITY
// ===================================================================================

/**
 * Adds a new multi-city form segment to the UI.
 */
function bindMultiCityFrom() {
    var searchList = document.querySelectorAll(".MultiForm");
    if (searchList.length >= 6) return; // Max 6 segments allowed.

    let removeHtml = `<div class="closeMulticityCard" onclick='removeMultiCityForm(this)'>
                          <span class="material-icons">close</span>
                      </div>`;

    let html = `<div class="MCToFromDate MultiForm">
                    <div class="multiCityBody">
                      <div class="multiCityRemove">
                        <div class="multiCityFlightText">Flight ${searchList.length + 1}</div>
                      </div>
                      <div class="order2">
                        <div class="toFromSearchWrapper">
                          <div class="toFromSearchOrigin search-border">
                            <label class="toOrigin">
                              <div class="toOriginIcon"><span class="material-icons">flight</span></div>
                              <div class="toOriginContent">
                                <h4>From</h4>
                                <div class="searchBox">
                                  <input class="Origin" autocomplete="off" onclick="autobind(this, '0', null)" onkeyup="GetAirportList(this, '0')" type="text" data-airport-code="" placeholder="Origin" />
                                  <div class="dropdown-content">
                                    <ul class="dropdown-wrapper"></ul>
                                  </div>
                                </div>
                              </div>
                            </label>
                          </div>
                          <div class="toFromSearchSweep" onclick="ExchangeValue(this)"><span class="material-icons">sync_alt</span></div>
                          <div class="toFromSearchDepart search-border">
                            <label class="toDepart">
                              <div class="toDepartIcon"><span class="material-icons">flight</span></div>
                              <div class="ToDepartContent searchBox">
                                <h4>To</h4>
                                <div>
                                  <input class="depart" autocomplete="off" onclick="autobind(this, '1', null)" onkeyup="GetAirportList(this, '1')" data-airport-code="" type="text" placeholder="Destination" />
                                  <div class="depart-content">
                                    <ul class="dropdown-wrapper"></ul>
                                  </div>
                                </div>
                              </div>
                            </label>
                          </div>
                        </div>
                      </div>
                      <div class="order3">
                        <div class="searchDate">
                          <label class="searchDateForm">
                            <div class="searchDateFormIcon"><span class="material-icons">event_note</span></div>
                            <div class="searchDateFormHead">
                              <h4 class="searchDateFormHeadText">Departure</h4>
                              <input type="text" id="MultiCity-${searchList.length + 1}" />
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>
                    ${searchList.length >= 2 ? removeHtml : ''}
                 </div>`;

    document.getElementById('multiCityForm').insertAdjacentHTML("beforebegin", html);

    // Initialize calendar for the new segment
    var newSearchList = document.querySelectorAll(".MultiForm");
    let prevIndex = newSearchList.length === 2 ? 1 : newSearchList.length - 1;
    let minDate = newSearchList.length === 1 ? new Date() : document.getElementById(`MultiCity-${prevIndex}`).value;

    caleran(`#MultiCity-${newSearchList.length}`, {
        singleDate: true,
        calendarCount: 1,
        showHeader: false,
        showFooter: false,
        autoCloseOnSelect: true,
        format: 'DD MMM YYYY',
        minDate: minDate,
        onafterselect: function (instance, start) {
            CheckMultiDate(start, newSearchList.length);
        }
    });

    if (newSearchList.length >= 5) {
        document.getElementById("addMultiCityForm").style.visibility = 'hidden';
    }
}

/**
 * Removes a multi-city form segment.
 * @param {HTMLElement} elem - The remove icon element.
 */
function removeMultiCityForm(elem) {
    elem.closest(".MultiForm").remove();
    document.getElementById("addMultiCityForm").style.visibility = 'visible';
}

/**
 * Updates the minimum date for subsequent multi-city segments when a date is selected.
 * @param {Date} date - The selected date.
 * @param {number} index - The index of the segment that was changed.
 */
function CheckMultiDate(date, index) {
    var searchList = document.querySelectorAll(".MultiForm");
    for (let i = index; i < searchList.length; i++) {
        caleran("#MultiCity-" + (i + 1), {
            singleDate: true,
            calendarCount: 1,
            showHeader: false,
            showFooter: false,
            autoCloseOnSelect: true,
            format: 'DD MMM YYYY',
            minDate: date.toDate(), // Use the selected date as the new minimum
            onafterselect: function (instance, start) {
                CheckMultiDate(start, i + 1);
            }
        });
    }
}


// ===================================================================================
// PREFERRED AIRLINE SELECTION (MULTI-SELECT)
// ===================================================================================

/**
 * Shows the airline selection dropdown.
 * @param {HTMLElement} elem - The element that triggers the dropdown.
 */
function showAirlineList(elem) {
    elem.closest('.multiSelect').querySelector(".SelectList").classList.add("ShowAirlineList");
    elem.closest('.multiSelect').querySelector("input").focus();
}

/**
 * Binds the fetched airline list to the dropdown.
 * @param {Array} airlinelist - The list of airlines.
 * @param {HTMLElement} elem - The input element.
 */
function bindAirLine(airlinelist, elem) {
    let html = "";
    airlinelist.map((e, i) => {
        html += ` <li class="option ${i == 0 ? 'selectAirline' : ''}" onclick="AddAirline(this)" data-airline-code='${e.airline_code}' data-airline-name='${e.airline_name}'>(${e.airline_code}) ${e.airline_name}  </li>`
    })
    elem.closest('.SelectList').querySelector('.ListItem').innerHTML = html;
}

/**
 * Handles keyboard navigation (up/down arrows) and fetches airline details on input.
 * @param {HTMLElement} elem - The input element.
 */
async function GetAirlineDetails(elem) {
    let key = window.event;
    let list = document.querySelector('.selectAirline');

    // Keyboard navigation
    if (list) {
        if (key.keyCode == 38) { // Up arrow
            var prev = list.previousElementSibling;
            if (prev) {
                list.classList.remove("selectAirline");
                prev.classList.add("selectAirline");
            }
        } else if (key.keyCode == 40) { // Down arrow
            var next = list.nextElementSibling;
            if (next) {
                list.classList.remove("selectAirline");
                next.classList.add("selectAirline");
            };
        };
    };

    // Fetch airlines based on input value
    let val = elem.value;
    if (val.length >= 2 && !(key.keyCode == 38) && !(key.keyCode == 40)) {
        try {
            const request = new Request(`${config.adminApiUrl}/MasterSearch/GetAllAirline/en/${val}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'OrgId': '2206040706597097092' }
            });
            const newRequest = UtilService.headerSetup(request);
            const response = await fetch(newRequest);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data) bindAirLine(data, elem);
        } catch (error) {
            console.error("Failed to fetch airline details:", error);
        }
    }

    // Add airline on Enter key press
    if (key.keyCode == 13) {
        AddAirline(document.querySelector('.selectAirline'));
    }
};

/**
 * Adds the selected airline to the list of preferred airlines.
 * @param {HTMLElement} val - The selected 'li' element from the airline list.
 */
function AddAirline(val) {
    let check = document.querySelectorAll(".airlinelist");
    if (check.length <= 2) { // Limit to 3 selected airlines
        let code = val.getAttribute("data-airline-code");
        let name = val.getAttribute("data-airline-name");
        let html = ` <span class='airlinelist' data-airline-code="${code}"> (${code}) ${name}
      <button onclick="Close(this)">x</button>
    </span>`;
        val.closest('.multiSelect').querySelector(".SearchBox").insertAdjacentHTML("beforeend", html);
        let maindiv = val.closest('.multiSelect').querySelector('input');
        val.closest('.multiSelect').querySelector("input").value = '';
        val.closest('.SelectList').classList.remove("ShowAirlineList");
        val.closest('.multiSelect').querySelector(".SearchBox").classList.remove('multiInp');
        bindAirLine([], maindiv); // Clear the list
    }
};

/**
 * Closes the dropdown and removes the selected airline tag.
 * @param {HTMLElement} e - The close button element inside the airline tag.
 */
function Close(e) {
    e.closest('.multiSelect').querySelector(".SelectList").classList.remove("ShowAirlineList");
    e.closest(".airlinelist").remove();
    let check = document.querySelectorAll(".airlinelist");
    if (check.length == 0) {
        e.closest('.multiSelect').querySelector(".SearchBox").classList.add('multiInp');
    }
}


// ===================================================================================
// CALENDAR (CALERAN) INITIALIZATION
// ===================================================================================

// --- One-Way Calendar ---
caleran("#OW_Calender", {
    singleDate: true,
    calendarCount: 1,
    showHeader: false,
    showFooter: false,
    autoCloseOnSelect: true,
    format: 'DD MMM YYYY',
    minDate: new Date(),
});

// --- Round-Trip Calendar ---
var flightStartDate, flightEndDate, flightStartInstance, flightEndInstance;
var flightFillInputs = function () {
    if (flightStartInstance) flightStartInstance.elem.value = flightStartDate ? flightStartDate.locale(flightStartInstance.config.format).format('DD MMM YYYY') : "";
    if (flightEndInstance) flightEndInstance.elem.value = flightEndDate ? flightEndDate.locale(flightEndInstance.config.format).format('DD MMM YYYY') : "";
};

document.querySelector("#flightStart").value = moment().format('DD MMM YYYY');
document.querySelector("#flightEnd").value = moment().add(1, 'days').format('DD MMM YYYY');
flightStartDate = moment();
flightEndDate = moment().add(1, 'days');

caleran("#flightStart", {
    startEmpty: document.querySelector("#flightStart").value === "",
    startDate: document.querySelector("#flightStart").value,
    endDate: document.querySelector("#flightEnd").value,
    enableKeyboard: false,
    minDate: new Date(),
    oninit: function (instance) {
        flightStartInstance = instance;
        if (!instance.config.startEmpty && instance.config.startDate) {
            instance.elem.value = instance.config.startDate.locale(instance.config.format).format('DD MMM YYYY');
            flightStartDate = instance.config.startDate.clone();
        }
    },
    onbeforeshow: function (instance) {
        if (flightStartDate) {
            flightStartInstance.config.startDate = flightStartDate;
            if (flightEndInstance) flightEndInstance.config.startDate = flightStartDate;
        }
        if (flightEndDate) {
            flightStartInstance.config.endDate = flightEndDate.clone();
            if (flightEndInstance) flightEndInstance.config.endDate = flightEndDate.clone();
        }
        flightFillInputs();
        instance.updateHeader();
        instance.reDrawCells();
    },
    onfirstselect: function (instance, start) {
        flightStartDate = start.clone();
        flightEndDate = null;
        flightStartInstance.globals.startSelected = false;
        flightStartInstance.hideDropdown();
        flightEndInstance.showDropdown();
        flightEndInstance.config.minDate = flightStartDate.clone();
        flightEndInstance.config.startDate = flightStartDate.clone();
        flightEndInstance.config.endDate = null;
        flightEndInstance.globals.startSelected = true;
        flightEndInstance.globals.endSelected = false;
        flightEndInstance.globals.firstValueSelected = true;
        flightEndInstance.setDisplayDate(start);
        if (flightEndDate && flightStartDate.isAfter(flightEndDate)) {
            flightEndInstance.globals.endDate = flightEndDate.clone();
        }
        flightEndInstance.updateHeader();
        flightEndInstance.reDrawCells();
        flightFillInputs();
    }
});

caleran("#flightEnd", {
    startEmpty: document.querySelector("#flightEnd").value === "",
    startDate: document.querySelector("#flightStart").value,
    endDate: document.querySelector("#flightEnd").value,
    enableKeyboard: false,
    autoCloseOnSelect: true,
    minDate: new Date(),
    oninit: function (instance) {
        flightEndInstance = instance;
        if (!instance.config.startEmpty && instance.config.endDate) {
            instance.elem.value = (instance.config.endDate.locale(instance.config.format).format('DD MMM YYYY'));
            flightEndDate = instance.config.endDate.clone();
        }
    },
    onbeforeshow: function (instance) {
        if (flightStartDate) {
            if (flightStartInstance) flightStartInstance.config.startDate = flightStartDate;
            flightEndInstance.config.startDate = flightStartDate;
        }
        if (flightEndDate) {
            if (flightStartInstance) flightStartInstance.config.endDate = flightEndDate.clone();
            flightEndInstance.config.endDate = flightEndDate.clone();
        }
        flightFillInputs();
        instance.updateHeader();
        instance.reDrawCells();
    },
    onafterselect: function (instance, start, end) {
        flightStartDate = start.clone();
        flightEndDate = end.clone();
        flightEndInstance.hideDropdown();
        if (flightStartInstance) {
            flightStartInstance.config.endDate = flightEndDate.clone();
            flightStartInstance.globals.firstValueSelected = true;
        }
        flightFillInputs();
        flightEndInstance.globals.startSelected = true;
        flightEndInstance.globals.endSelected = false;
    }
});


// ===================================================================================
// SEARCH FLIGHT & QUERY BUILDING
// ===================================================================================

let tripKey = 'IRT'; // Default trip type: IRT (International Round Trip)

/**
 * Changes the current trip type.
 * @param {string} type - The new trip type key ('OW', 'IRT', 'NMC').
 */
function ChangeTab(type) {
    tripKey = type;
}

/**
 * Builds the flight search query string and redirects to the search results page.
 * @param {HTMLElement} elem - The search button element.
 */
function Searchflight(elem) {
    let checkValidation = true;
    let main_div = elem.closest('.CommonSearch');

    // Collect preferred airline codes
    let airline_codes = Array.from(document.querySelectorAll(".airlinelist")).map(e => e.getAttribute('data-airline-code'));

    // --- Base Query String ---
    var querystring = {
        "adult": TravellerDetails.Adult,
        "child": TravellerDetails.child,
        "infant": TravellerDetails.Infant,
        "langcode": "EN",
        "ref": document.getElementById('Refundable').checked,
        "direct": document.getElementById('DirectFlights').checked,
        "key": tripKey,
        "triptype": CheckTriptype(tripKey),
        'curr': 'AED',
        "airlines": airline_codes.join(','),
    };

    let cl = checkClassType(); // Get class type code (e.g., 'Y' for Economy)

    // --- Build Segments Based on Trip Type ---
    if (tripKey === 'OW' || tripKey === 'IRT') {
        let origin = main_div.querySelector('.Origin').getAttribute("data-airport-code");
        let depart = main_div.querySelector('.depart').getAttribute("data-airport-code");
        if (!validator(origin, depart)) return; // Stop if validation fails

        let segments = tripKey === 'OW' ? 1 : 2;
        for (let i = 0; i < segments; i++) {
            let start_date = tripKey === 'OW' ? document.getElementById('OW_Calender').value : document.getElementById('flightStart').value;
            let end_date = document.getElementById('flightEnd').value;

            querystring[`dep${i + 1}`] = i === 0 ? origin : depart;
            querystring[`ret${i + 1}`] = i === 0 ? depart : origin;
            querystring[`cl${i + 1}`] = cl;
            querystring[`dtt${i + 1}`] = tripKey === 'OW' ? moment(start_date).format('DD-MMM-YYYY') : (i === 0 ? moment(start_date).format('DD-MMM-YYYY') : moment(end_date).format('DD-MMM-YYYY'));
        }
    } else if (tripKey === 'NMC') {
        var searchList = main_div.querySelectorAll(".MultiForm");
        searchList.forEach((e, i) => {
            let Origin = e.querySelector('.Origin').getAttribute("data-airport-code");
            let depart = e.querySelector('.depart').getAttribute("data-airport-code");
            if (!validator(Origin, depart)) {
                checkValidation = false;
            }
            querystring[`dep${i + 1}`] = Origin;
            querystring[`ret${i + 1}`] = depart;
            querystring[`dtt${i + 1}`] = moment(e.querySelector(`#MultiCity-${i + 1}`).value).format('DD-MMM-YYYY');
            querystring[`cl${i + 1}`] = cl;
        });
        if (!checkValidation) return;
    }

    // --- Redirect to Search Page ---
    sessionStorage.setItem('SerachReqQueryObj', JSON.stringify(querystring));
    var query = new URLSearchParams(querystring).toString();
    window.location.href = 'https://travel.neuholidays.com/Flight/search?' + query;
}


// ===================================================================================
// UTILITY & HELPER FUNCTIONS
// ===================================================================================

/**
 * Validates that origin and destination are provided and are different.
 * @param {string} origin - The origin airport code.
 * @param {string} depart - The destination airport code.
 * @returns {boolean} - True if valid, false otherwise.
 */
function validator(origin, depart) {
    if (!origin || !depart) {
        showToaster('Please enter departure and arrival city or airport');
        return false;
    }
    if (origin === depart) {
        showToaster('Departure must be different from arrival');
        return false;
    }
    return true;
}

/**
 * Shows a temporary warning message (toaster).
 * @param {string} message - The message to display.
 */
function showToaster(message) {
    let element = document.querySelector('.toast-warning');
    element.classList.remove('d-none');
    element.querySelector('span').innerHTML = message;
    setTimeout(() => {
        element.classList.add('d-none');
        element.querySelector('span').innerHTML = '';
    }, 2500);
}

/**
 * Converts trip key to a numeric trip type.
 * @param {string} tripKey - The key ('OW', 'IRT', 'NMC').
 * @returns {string} - The numeric type ('1', '2', '3').
 */
function CheckTriptype(tripKey) {
    const tripTypes = { 'OW': '1', 'IRT': '2', 'NMC': '3' };
    return tripTypes[tripKey] || '';
}

/**
 * Converts class type name to its corresponding code.
 * @returns {string} - The class type code ('F', 'C', 'W', 'Y').
 */
function checkClassType() {
    const classCodes = {
        'FirstClass': 'F',
        'BusinessClass': 'C',
        'PremiumEconomy': 'W',
        'Economy': 'Y'
    };
    return classCodes[TravellerDetails.classType] || 'Y';
}

/**
 * Toggles the visibility of the advanced search options.
 * @param {HTMLElement} elem - The expand/collapse element.
 */
function advancedField(elem) {
    advancedSerch = !advancedSerch;
    elem.closest('div').querySelector(".expander_more").classList.toggle('d-none', advancedSerch);
    elem.querySelector('.expand-less').classList.toggle('d-none', advancedSerch);
    elem.querySelector('.expand-more').classList.toggle('d-none', !advancedSerch);
}