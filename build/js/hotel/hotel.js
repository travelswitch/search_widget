/**
 * @file Hotel search and booking functionality.
 * @author Abdul Razzak
 * @description This file contains all the JavaScript code for handling the hotel search widget,
 * including room and passenger selection, destination and nationality search, date selection,
 * and constructing the final search query.
 */

// ---=== Room and Pax Selection ===--- //

/**
 * Toggles the visibility of the room and passenger selection dropdown.
 */
function roomCount() {
    document.getElementById("roomPax").classList.toggle("showRoomPax");
}

/**
 * Adds a new room interface to the DOM, up to a maximum of 6 rooms.
 */
function addmore_rooms() {
    const rooms = document.querySelectorAll(".HotelNoRoomWrapper");
    const MAX_ROOMS = 6;

    if (rooms.length < MAX_ROOMS) {
        const removeButtonHtml = `
            <div class="closeRoomCard" onclick="RemoveRoom(this)">
                <span class="material-icons">close</span>
            </div>`;

        const newRoomHtml = `
            <div class="HotelNoRoomWrapper">
                <div class="HotelNoRoomTitle">
                    <span class="material-icons">local_hotel</span>
                    <h4 class="Rooms_no">Room ${rooms.length + 1}</h4>
                </div>
                <div class="HotelNoRoomCount AdultPax">
                    <div class="HotelTravelerSteps">
                        <button class="opacity" onclick="AddAdultPax(this, false)">
                            <span class="material-icons">remove</span>
                        </button>
                        <input type="text" value="1" autocomplete="off" readonly />
                        <button onclick="AddAdultPax(this, true)">
                            <span class="material-icons">add</span>
                        </button>
                    </div>
                </div>
                <div class="HotelNoRoomCount ChildPax">
                    <div class="HotelTravelerSteps">
                        <button class="opacity" onclick="AddChildPax(this, false)">
                            <span class="material-icons">remove</span>
                        </button>
                        <input type="text" value="0" autocomplete="off" readonly />
                        <button onclick="AddChildPax(this, true)">
                            <span class="material-icons">add</span>
                        </button>
                    </div>
                </div>
                <div class="HotelNoageChild"></div>
                ${rooms.length !== 0 ? removeButtonHtml : ''}
            </div>`;

        const moreOptionElem = document.getElementById('MoreOption').querySelector('.addMoreTravller');
        moreOptionElem.insertAdjacentHTML("beforebegin", newRoomHtml);
    }

    // Disable 'add more' button if room limit is reached
    if (document.querySelectorAll(".HotelNoRoomWrapper").length >= MAX_ROOMS) {
        document.getElementById('MoreOption').querySelector('.addMoreTravller').classList.add("HotelPaxSelectOption");
    }

    TravellerCounter('');
}

// Initialize with one room by default
addmore_rooms();

/**
 * Removes a room from the DOM and re-indexes the remaining rooms.
 * @param {HTMLElement} elem - The close button element that was clicked.
 */
function RemoveRoom(elem) {
    elem.closest(".HotelNoRoomWrapper").remove();
    const allRooms = document.querySelectorAll(".HotelNoRoomWrapper");

    allRooms.forEach((room, index) => {
        room.querySelector('.Rooms_no').innerHTML = `Room ${index + 1}`;
    });

    TravellerCounter('');
    // Re-enable the 'add more' button as we are now below the limit
    document.getElementById('MoreOption').querySelector('.addMoreTravller').classList.remove("HotelPaxSelectOption");
}

/**
 * Updates the number of children for a specific room and adds/removes age selectors accordingly.
 * @param {HTMLElement} elem - The button element (+ or -) that was clicked.
 * @param {boolean} isIncrement - True to add a child, false to remove.
 */
function AddChildPax(elem, isIncrement) {
    const input = isIncrement ? elem.previousElementSibling : elem.nextElementSibling;
    const currentValue = parseInt(input.value, 10);
    const MAX_CHILDREN = 4;
    const MIN_CHILDREN = 0;

    if (isIncrement && currentValue < MAX_CHILDREN) {
        input.value = currentValue + 1;
        children_number(elem, true, input.value);
    } else if (!isIncrement && currentValue > MIN_CHILDREN) {
        input.value = currentValue - 1;
        children_number(elem, false, input.value);
    }

    // Update button states (disabled/enabled)
    const currentVal = parseInt(input.value, 10);
    elem.closest('.HotelTravelerSteps').querySelector('button:first-child').disabled = currentVal === MIN_CHILDREN;
    elem.closest('.HotelTravelerSteps').querySelector('button:last-child').disabled = currentVal === MAX_CHILDREN;
    elem.closest('.HotelTravelerSteps').querySelector('button:first-child').style.opacity = currentVal === MIN_CHILDREN ? '0.6' : '1';
    elem.closest('.HotelTravelerSteps').querySelector('button:last-child').style.opacity = currentVal === MAX_CHILDREN ? '0.6' : '1';


    TravellerCounter('');
}

/**
 * Updates the number of adults for a specific room.
 * @param {HTMLElement} elem - The button element (+ or -) that was clicked.
 * @param {boolean} isIncrement - True to add an adult, false to remove.
 */
function AddAdultPax(elem, isIncrement) {
    const input = isIncrement ? elem.previousElementSibling : elem.nextElementSibling;
    const currentValue = parseInt(input.value, 10);
    const MAX_ADULTS = 6;
    const MIN_ADULTS = 1;

    if (isIncrement && currentValue < MAX_ADULTS) {
        input.value = currentValue + 1;
    } else if (!isIncrement && currentValue > MIN_ADULTS) {
        input.value = currentValue - 1;
    }

    // Update button states (disabled/enabled)
    const currentVal = parseInt(input.value, 10);
    elem.closest('.HotelTravelerSteps').querySelector('button:first-child').disabled = currentVal === MIN_ADULTS;
    elem.closest('.HotelTravelerSteps').querySelector('button:last-child').disabled = currentVal === MAX_ADULTS;
    elem.closest('.HotelTravelerSteps').querySelector('button:first-child').style.opacity = currentVal === MIN_ADULTS ? '0.6' : '1';
    elem.closest('.HotelTravelerSteps').querySelector('button:last-child').style.opacity = currentVal === MAX_ADULTS ? '0.6' : '1';

    TravellerCounter('');
}

/**
 * Applies the selected passenger and room configuration and closes the dropdown.
 * @param {HTMLElement} elem - The "Apply" button element.
 */
function apply_people(elem) {
    if (elem) {
        const roomType = elem.getAttribute('data-room');
        TravellerCounter(roomType);
        document.getElementById("roomPax").classList.remove("showRoomPax");

        // Toggle visibility of the detailed room selection vs single-line options
        if (roomType === "addmore") {
            document.getElementById("MoreOption").classList.remove("moreOptionWrapper");
        } else {
            document.getElementById("MoreOption").classList.add("moreOptionWrapper");
        }
    }
}

var RoomDetails = [];
/**
 * Gathers room, adult, and child data from the DOM and updates the summary.
 * @param {string} optionType - A preset option like "1Room2Adult" or "1Room1Adult", or empty for custom.
 */
function TravellerCounter(optionType) {
    let searchRooms = [];
    
    const presets = {
        "1Room2Adult": { adult: "2", child: "0", childAge: [] },
        "1Room1Adult": { adult: "1", child: "0", childAge: [] }
    };

    if (presets[optionType]) {
        searchRooms.push(presets[optionType]);
    } else {
        const roomElems = [...document.querySelector('#MoreOption').querySelectorAll('.HotelNoRoomWrapper')];
        const roomData = roomElems.map(e => {
            const adultVal = e.querySelector('.AdultPax input').value;
            const childVal = e.querySelector('.ChildPax input').value;
            const ageElems = e.querySelectorAll('.HotelNoageChild .HotelNoageSelect .select_control');
            const childAges = [...ageElems].map(elem => elem.value);
            return {
                'adult': adultVal,
                'child': childVal,
                'childAge': childAges
            };
        });
        searchRooms = [...roomData];
    }

    RoomDetails = searchRooms;
    getRoomsInfo(searchRooms);
}

// Initialize with default: 1 Room, 2 Adults
TravellerCounter('1Room2Adult');

/**
 * Calculates total rooms, adults, and children and updates the display input.
 * @param {Array<object>} rooms - An array of room objects with adult, child, and childAge details.
 */
function getRoomsInfo(rooms) {
    const roomsInfo = rooms.reduce((acc, elem) => ({
        Adult: acc.Adult + parseInt(elem.adult, 10),
        Child: acc.Child + parseInt(elem.child, 10)
    }), { Adult: 0, Child: 0 });

    const childText = roomsInfo.Child > 0 ? `, ${roomsInfo.Child} Child` : '';
    document.getElementById('RoomCount').value = `${rooms.length} Room, ${roomsInfo.Adult} Adult${childText}`;
}

/**
 * Adds or removes a child age dropdown selector.
 * @param {HTMLElement} elem - The button element inside the room that triggered the change.
 * @param {boolean} isAdd - True to add a dropdown, false to remove the last one.
 * @param {number} index - The current number of children, used for class naming.
 */
function children_number(elem, isAdd, index) {
    const ageContainer = elem.closest(".HotelNoRoomWrapper").querySelector(".HotelNoageChild");
    if (isAdd) {
        const childAgeHtml = `
            <div class="HotelNoageSelect child_${index}">
                <select class="select_control" onchange="TravellerCounter('')">
                    <option value="1">Under 1</option>
                    ${Array.from({ length: 11 }, (_, i) => `<option value="${i + 2}">${i + 2}</option>`).join('')}
                </select>
            </div>`;
        ageContainer.insertAdjacentHTML("beforeend", childAgeHtml);
    } else {
        const lastChild = ageContainer.querySelector(".HotelNoageSelect:last-child");
        if (lastChild) {
            lastChild.remove();
        }
    }
    TravellerCounter('');
}


// ---=== Hotel Destination Search ===--- //

let HotelList = [];
let NationalityList = [];

/**
 * Fetches a default list of popular cities on page load.
 */
async function getBindHotelList() {
    const url = `${config.adminApiUrl}/CityMaster/GetSelectedCity?cityCode=39942,12568,41325,38997,33324&LangCode=EN`;
    const headers = { 'Content-Type': 'application/json', 'OrgId': '2206040706597097092' };
    try {
        const request = new Request(url, { method: 'GET', headers });
        const newRequest = UtilService.headerSetup(request);
        const response = await fetch(newRequest);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        HotelList = await response.json();
    } catch (error) {
        console.error("Failed to fetch initial hotel list:", error);
    }
}
getBindHotelList(); // Fetch on initial load

/**
 * Fetches hotel locations based on user input (autocomplete).
 * @param {HTMLInputElement} input - The input element for the hotel destination.
 */
async function GethotelList(input) {
    if (input.value.length < 2) return;
    const url = `${config.hotelApiUrl}/hotel/location?searchKey=${input.value}&langCode=EN`;
    const headers = { 'Content-Type': 'application/json', 'OrgId': '2206040706597097092' };
    try {
        const request = new Request(url, { method: 'GET', headers });
        const newRequest = UtilService.headerSetup(request);
        const response = await fetch(newRequest);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        HotelList = await response.json();
        autoHotelListbind(input);
    } catch (error) {
        console.error("Failed to fetch hotel list for autocomplete:", error);
    }
}

/**
 * Shows the hotel search results dropdown.
 * @param {HTMLElement} element - The input element that was focused or typed in.
 */
function ShowHotelList(element) {
    const searchContainer = element.closest(".HotelSearchDestination");
    const resultsList = searchContainer.querySelector(".hideInput");
    if (resultsList) {
        resultsList.classList.remove('hideInput');
    }
    autoHotelListbind(element);
}

/**
 * Renders the fetched hotel list into the dropdown.
 * @param {HTMLElement} element - The input element to anchor the dropdown to.
 */
function autoHotelListbind(element) {
    let html = '';
    HotelList.forEach(e => {
        html += `
           <div class="HotelSearchOtionContent" onclick="ApplyHotelCity(this)">
             <span class="material-icons">location_on</span>
             <a data-countryCode="${e.countryCode}" data-cityCode="${e.cityCode}" data-city_Id="${e.city_Id}" data-cityName="${e.cityName}" data-displayName="${e.displayName}">${e.displayName}</a>
           </div>`;
    });
    element.closest(".HotelSearchDestination").querySelector(".HotelList").innerHTML = html;
}

/**
 * Applies the selected hotel/city to the input field and hides the dropdown.
 * @param {HTMLElement} elem - The selected city element from the list.
 */
function ApplyHotelCity(elem) {
    const anchor = elem.querySelector('a');
    const { countrycode, citycode, city_id, displayname } = anchor.dataset;

    const input = document.getElementById('FromHotel');
    input.value = displayname;
    input.setAttribute("data-countryCode", countrycode);
    input.setAttribute("data-cityCode", citycode);
    input.setAttribute("data-city_Id", city_id);

    elem.closest('.HotelDestination').classList.add('hideInput');
}


// ---=== Nationality Search ===--- //

/**
 * Shows the nationality search results dropdown.
 * @param {HTMLElement} elem - The input element for nationality.
 */
function showNationality(elem) {
    elem.closest('.HotelSearchFormNationality').querySelector('.HotelNationality').classList.remove('hideInput');
    autonationalityListbind(elem);
}

/**
 * Fetches a default list of popular nationalities on page load.
 */
async function getBindNationalityList() {
    const url = `${config.adminApiUrl}/CountryMaster/GetSelectedCountry/EN/MA,TN,NG,EG,AE,SA,BH,QA,KW,OM`;
    const headers = { 'Content-Type': 'application/json', 'OrgId': '2206040706597097092' };
    try {
        const request = new Request(url, { method: 'GET', headers });
        const newRequest = UtilService.headerSetup(request);
        const response = await fetch(newRequest);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        NationalityList = await response.json();
    } catch (error) {
        console.error("Failed to fetch initial nationality list:", error);
    }
}
getBindNationalityList(); // Fetch on initial load

/**
 * Fetches nationalities based on user input (autocomplete).
 * @param {HTMLInputElement} Input - The input element for nationality.
 */
async function GetNationalityList(Input) {
    if (!Input.value) return;
    const url = `${config.adminApiUrl}/MasterSearch/GetAllCountry/EN/${Input.value}`;
    const headers = { 'Content-Type': 'application/json', 'OrgId': '2206040706597097092' };
    try {
        const request = new Request(url, { method: 'GET', headers });
        const newRequest = UtilService.headerSetup(request);
        const response = await fetch(newRequest);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        NationalityList = await response.json();
        autonationalityListbind(Input);
    } catch (error) {
        console.error("Failed to fetch nationality list for autocomplete:", error);
    }
}

/**
 * Renders the fetched nationality list into the dropdown.
 * @param {HTMLElement} elem - The input element to anchor the dropdown to.
 */
function autonationalityListbind(elem) {
    let html = '';
    NationalityList.forEach(e => {
        html += `
           <div class="HotelSearchOtionContent" onclick="ApplyNationality(this)">
             <span class="material-icons">location_on</span>
             <a data-countryCode="${e.country_code}" data-countryName="${e.country_name}">${e.country_name}</a>
           </div>`;
    });
    elem.closest('.HotelSearchFormNationality').querySelector('.NationalityList').innerHTML = html;
}

/**
 * Applies the selected nationality to the input field and hides the dropdown.
 * @param {HTMLElement} elem - The selected nationality element from the list.
 */
function ApplyNationality(elem) {
    const anchor = elem.querySelector('a');
    const { countrycode, countryname } = anchor.dataset;
    const input = document.getElementById('FromNationality');
    input.value = countryname;
    input.setAttribute('data-countryCode', countrycode);
    elem.closest('.HotelNationality').classList.add('hideInput');
}


// ---=== Date Calendar (Caleran) Integration ===--- //

let hotelStartDate, hotelEndDate, hotelStartInstance, hotelEndInstance;

const hotelFillInputs = function () {
    if (hotelStartInstance) hotelStartInstance.elem.value = hotelStartDate ? hotelStartDate.locale(hotelStartInstance.config.format).format('DD MMM YYYY') : "";
    if (hotelEndInstance) hotelEndInstance.elem.value = hotelEndDate ? hotelEndDate.locale(hotelEndInstance.config.format).format('DD MMM YYYY') : "";
};

document.querySelector("#hotelStart").value = moment().format('DD MMM YYYY');
document.querySelector("#hotelEnd").value = moment().add(1, 'days').format('DD MMM YYYY');
hotelStartDate = moment();
hotelEndDate = moment().add(1, 'days');
calcNumberOfNights(hotelStartDate, hotelEndDate);

caleran("#hotelStart", {
    startEmpty: document.querySelector("#hotelStart").value === "",
    startDate: document.querySelector("#hotelStart").value,
    endDate: document.querySelector("#hotelEnd").value,
    enableKeyboard: false,
    minDate: new Date(),
    oninit: function (instance) {
        hotelStartInstance = instance;
        if (!instance.config.startEmpty && instance.config.startDate) {
            instance.elem.value = instance.config.startDate.locale(instance.config.format).format('DD MMM YYYY');
            hotelStartDate = instance.config.startDate.clone();
        }
    },
    onbeforeshow: function (instance) {
        if (hotelStartDate) {
            hotelStartInstance.config.startDate = hotelStartDate;
            if (hotelEndInstance) hotelEndInstance.config.startDate = hotelStartDate;
        }
        if (hotelEndDate) {
            hotelStartInstance.config.endDate = hotelEndDate.clone();
            if (hotelEndInstance) hotelEndInstance.config.endDate = hotelEndDate.clone();
        }
        hotelFillInputs();
        instance.updateHeader();
        instance.reDrawCells();
    },
    onfirstselect: function (instance, start) {
        hotelStartDate = start.clone();
        hotelEndDate = null;
        hotelStartInstance.globals.startSelected = false;
        hotelStartInstance.hideDropdown();
        hotelEndInstance.showDropdown();
        hotelEndInstance.config.minDate = hotelStartDate.clone();
        hotelEndInstance.config.startDate = hotelStartDate.clone();
        hotelEndInstance.config.endDate = null;
        hotelEndInstance.globals.startSelected = true;
        hotelEndInstance.globals.endSelected = false;
        hotelEndInstance.globals.firstValueSelected = true;
        hotelEndInstance.setDisplayDate(start);
        if (hotelEndDate && hotelStartDate.isAfter(hotelEndDate)) {
            hotelEndInstance.globals.endDate = hotelEndDate.clone();
        }
        hotelEndInstance.updateHeader();
        hotelEndInstance.reDrawCells();
        hotelFillInputs();
    }
});

caleran("#hotelEnd", {
    startEmpty: document.querySelector("#hotelEnd").value === "",
    startDate: document.querySelector("#hotelStart").value,
    endDate: document.querySelector("#hotelEnd").value,
    enableKeyboard: false,
    autoCloseOnSelect: true,
    minDate: new Date(),
    oninit: function (instance) {
        hotelEndInstance = instance;
        if (!instance.config.startEmpty && instance.config.endDate) {
            instance.elem.value = (instance.config.endDate.locale(instance.config.format).format('DD MMM YYYY'));
            hotelEndDate = instance.config.endDate.clone();
        }
        calcNumberOfNights(hotelStartDate, hotelEndDate);
    },
    onbeforeshow: function (instance) {
        if (hotelStartDate) {
            if (hotelStartInstance) hotelStartInstance.config.startDate = hotelStartDate;
            hotelEndInstance.config.startDate = hotelStartDate;
        }
        if (hotelEndDate) {
            if (hotelStartInstance) hotelStartInstance.config.endDate = hotelEndDate.clone();
            hotelEndInstance.config.endDate = hotelEndDate.clone();
        }
        hotelFillInputs();
        instance.updateHeader();
        instance.reDrawCells();
    },
    onafterselect: function (instance, start, end) {
        hotelStartDate = start.clone();
        hotelEndDate = end.clone();
        hotelEndInstance.hideDropdown();
        if (hotelStartInstance) {
            hotelStartInstance.config.endDate = hotelEndDate.clone();
            hotelStartInstance.globals.firstValueSelected = true;
        }
        hotelFillInputs();
        hotelEndInstance.globals.startSelected = true;
        hotelEndInstance.globals.endSelected = false;
        calcNumberOfNights(hotelStartDate, hotelEndDate);
    }
});

/**
 * Calculates the difference in days between two moment objects.
 * @param {moment} checkInDate - The start date.
 * @param {moment} checkOutDate - The end date.
 */
function calcNumberOfNights(checkInDate, checkOutDate) {
    if (checkInDate && checkOutDate) {
        const nights = moment(checkOutDate).diff(checkInDate, 'days');
        document.querySelector('.nightCountgBox .nightNum').innerHTML = nights > 0 ? nights : 1;
    }
}


// ---=== Search Submission ===--- //

/**
 * Validates inputs, constructs the search query, and redirects to the results page.
 */
function searchHotel() {
    const hotelDetails = document.getElementById('FromHotel');
    const nationalityCode = document.getElementById('FromNationality').getAttribute('data-countryCode');
    const toaster = document.getElementsByClassName('toast-warning')[0];

    // Validation
    if (!hotelDetails.getAttribute('data-cityCode')) {
        toaster.classList.remove('d-none');
        toaster.querySelector('span').innerHTML = 'Please enter destination city';
        setTimeout(() => toaster.classList.add('d-none'), 3000);
        return;
    }
    if (!nationalityCode) {
        toaster.classList.remove('d-none');
        toaster.querySelector('span').innerHTML = 'Please select nationality';
        setTimeout(() => toaster.classList.add('d-none'), 3000);
        return;
    }

    // Build Query Parameters
    const queryParams = {
        CityCode: hotelDetails.getAttribute('data-cityCode'),
        CityId: hotelDetails.getAttribute('data-city_Id'),
        Country: hotelDetails.getAttribute('data-countryCode'),
        nationality: nationalityCode,
        langCode: 'EN',
        checkinDate: moment(document.getElementById('hotelStart').value).format('DD-MMM-YYYY'),
        checkoutDate: moment(document.getElementById('hotelEnd').value).format('DD-MMM-YYYY')
    };

    RoomDetails.forEach((room, i) => {
        const roomInfo = [
            parseInt(room.adult, 10),
            parseInt(room.child, 10),
            ...room.childAge.map(age => parseInt(age, 10))
        ];
        queryParams[`room${i + 1}`] = roomInfo.join('-');
    });

    const queryString = new URLSearchParams(queryParams).toString();
    // Redirect to results page
    window.location.href = `https://travel.neuholidays.com/hotel/result?${queryString}`;
}
