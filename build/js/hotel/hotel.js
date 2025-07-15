
function roomCount() {
    document.getElementById("roomPax").classList.add("showRoomPax");
}

function addmore_rooms() {
    var rooms = document.querySelectorAll(".HotelNoRoomWrapper");
    html = "";
    let RemoveHtml = `
        <div class="closeRoomCard" onclick="RemoveRoom(this)">
        <span class="material-icons"> close </span>
        </div>  `

    if (rooms.length < 6) {
        html = `<div class="HotelNoRoomWrapper">
      <div class="HotelNoRoomTitle">
        <span class="material-icons"> local_hotel </span>
        <h4 class="Rooms_no">Room ${rooms.length + 1}</h4>
      </div>
      <div class="HotelNoRoomCount AdultPax">
        <div class="HotelTravelerSteps">
          <button  class="opacity" onclick="AddAdultPax(this , false)">
            <span class="material-icons"> remove </span>
          </button>
          <input type="text" value="1" autocomplete="off"  readonly />
          <button  onclick="AddAdultPax(this , true)">
            <span class="material-icons"> add </span>
          </button>
        </div>
      </div>
      <div class="HotelNoRoomCount ChildPax">
        <div class="HotelTravelerSteps">
          <button class="opacity" onclick="AddChildPax(this , false)">
            <span class="material-icons"> remove </span>
          </button>
          <input type="text" value="0" autocomplete="off" readonly />
          <button   onclick="AddChildPax(this , true)">
            <span class="material-icons"> add </span>
          </button>
        </div>
      </div>
      <div class="HotelNoageChild">
        
      </div>
      ${rooms.length != 0 ? RemoveHtml : ''}
    </div> `
    }
    if (rooms.length >= 5) document.getElementById('MoreOption').querySelector('.addMoreTravller').classList.add("HotelPaxSelectOption");
    document.getElementById('MoreOption').querySelector('.addMoreTravller').insertAdjacentHTML("beforebegin", html)
    TravellerCounter('');
}
addmore_rooms();


function RemoveRoom(elem) {
    elem.closest(".HotelNoRoomWrapper").remove();
    let allRoom = document.querySelectorAll(".HotelNoRoomWrapper")
    allRoom.forEach((e, i) => {
        e.querySelector('.Rooms_no').innerHTML = `Room ${i + 1} `
    });
    TravellerCounter('');
    document.getElementById('MoreOption').querySelector('.addMoreTravller').classList.remove("HotelPaxSelectOption");
};


function AddChildPax(elem, check) {

    if (check) {
        if (elem.previousElementSibling.value <= 3) {
            elem.previousElementSibling.value++
            elem.previousElementSibling.previousElementSibling.disabled = false
            elem.previousElementSibling.previousElementSibling.style.opacity = '1'
            children_number(elem, check, elem.previousElementSibling.value)
            TravellerCounter('');
        } if (elem.previousElementSibling.value == 4) {
            elem.disabled = true;
            elem.style.opacity = '0.6';
        }
    } else {
        if (elem.nextElementSibling.value >= 1) {
            elem.nextElementSibling.nextElementSibling.disabled = false;
            elem.nextElementSibling.nextElementSibling.style.opacity = '1';
            elem.nextElementSibling.value--;
            children_number(elem, check, elem.nextElementSibling.value);
            TravellerCounter('');
        } if (elem.nextElementSibling.value == 0) {
            elem.disabled = true;
            elem.style.opacity = '0.6';
        }
    }
    if (true) {
        if (document.querySelector('.child_1')) {
            document.querySelector('.Child-one').classList.remove('d-none');;
        } else document.querySelector('.Child-one').classList.add('d-none');
        if (document.querySelector('.child_2')) {
            document.querySelector('.Child-two').classList.remove('d-none');
        } else document.querySelector('.Child-two').classList.add('d-none');
        if (document.querySelector('.child_3')) {
            document.querySelector('.Child-three').classList.remove('d-none');
        } else document.querySelector('.Child-three').classList.add('d-none');
        if (document.querySelector('.child_4')) {
            document.querySelector('.Child-four').classList.remove('d-none');
        } else document.querySelector('.Child-four').classList.add('d-none');
    }
};
function AddAdultPax(elem, check) {

    if (check) {
        if (elem.previousElementSibling.value <= 5) {
            elem.previousElementSibling.value++;
            elem.previousElementSibling.previousElementSibling.disabled = false;
            elem.previousElementSibling.previousElementSibling.style.opacity = '1';
            TravellerCounter('');
        } if (elem.previousElementSibling.value == 6) {

            elem.disabled = true;
            elem.style.opacity = '0.6';
        }
    } else {
        if (elem.nextElementSibling.value >= 2) {
            elem.nextElementSibling.value--;
            elem.nextElementSibling.nextElementSibling.disabled = false;
            elem.nextElementSibling.nextElementSibling.style.opacity = '1';
            TravellerCounter('');
        } if (elem.nextElementSibling.value == 1) {
            elem.disabled = true;
            elem.style.opacity = '0.6';
        }
    }
};




function apply_people(elem) {
    if (elem) {
        TravellerCounter(elem.getAttribute('data-room'))
        document.getElementById("roomPax").classList.remove("showRoomPax");
        if (elem.getAttribute('data-room') == "addmore") {
            document.getElementById("MoreOption").classList.remove("moreOptionWrapper")
        } else document.getElementById("MoreOption").classList.add("moreOptionWrapper")
    }
};


var RoomDetails = []
function TravellerCounter(optionType) {
    console.log(RoomDetails)
    let searchRooms = [];
    let totalRooms = "";

    if (optionType === "1Room2Adult") {
        let array_age = [];
        let data = {
            "adult": "2",
            "child": "0",
            "childAge": array_age
        }
        searchRooms.push(data);
        totalRooms = "1";
    } else if (optionType === "1Room1Adult") {
        let array_age = [];
        let data = {
            "adult": "1",
            "child": "0",
            "childAge": array_age
        }
        totalRooms = "1";
        searchRooms.push(data);
    } else {
        let roomElem = [...document.querySelector('#MoreOption').querySelectorAll('.HotelNoRoomWrapper')];
        let roomData = roomElem.map(e => {
            let adultVal = e.querySelector('.AdultPax').querySelector('input').value;
            let childVal = e.querySelector('.ChildPax').querySelector('input').value;
            let html = e.querySelector('.HotelNoageChild').querySelectorAll('.HotelNoageSelect');
            let array_age = [...html].map(elem => elem.querySelector('.select_control').value);
            return {
                'adult': adultVal,
                'child': childVal,
                'childAge': array_age
            }
        });
        searchRooms = [...roomData];
        totalRooms = searchRooms.length;
    }
    RoomDetails = searchRooms;
    getRoomsInfo(searchRooms);
}
TravellerCounter('1Room2Adult')

function getRoomsInfo(rooms) {
    let roomsInfo = rooms.reduce((acc, elem) =>
    (
        {
            Adult: parseInt(acc.Adult) + parseInt(elem.adult),
            Child: parseInt(acc.Child) + parseInt(elem.child)
        })
        , ({ Adult: 0, Child: 0 }));
    roomsInfo['Rooms'] = rooms.length;
    console.log(roomsInfo)
    document.getElementById('RoomCount').value = `${rooms.length} Room, ${roomsInfo.Adult} Adult ${roomsInfo.Child > 0 ? ', ' + roomsInfo.Child + ' Child' : ''}`;
}


// child count

function children_number(elem, check, index) {
    let html = "";
    console.log(index)
    if (check) {
        html += ` <div class="HotelNoageSelect child_${index}">
      <select class="select_control" onchange="TravellerCounter('')">
        <option value="1">Under 1</option>
        <option value="2">2 </option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7">7</option>
        <option value="8">8</option>
        <option value="9">9</option>
        <option value="10">10</option>
        <option value="11">11</option>
      </select>
    </div> 
    `;
        elem.closest(".HotelNoRoomWrapper").querySelector(".HotelNoageChild").insertAdjacentHTML("beforeend", html)
    } else {
        let elemet = elem.closest(".HotelNoRoomWrapper").querySelectorAll(".HotelNoageSelect");
        let ind =
            elemet.length - 1
        elemet[ind].remove();
    }
    TravellerCounter('');
};


//  hote api 

let HotelList = [];
let NationalityList = [];
getBindHotelList()
async function getBindHotelList(inp) {
    const response = await fetch("https://adminapi.uat.futuretravelplatform.com/api/CityMaster/GetSelectedCity?cityCode=39942,12568,41325,38997,33324&LangCode=EN", {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'OrgId': '2206040706597097092' }
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    HotelList = data
    console.log(data)

}
//  onkeyup

async function GethotelList(Input) {
    if (Input.value.length >= 2) {
        const response = await fetch("https://hotelapi.uat.futuretravelplatform.com/api/hotel/location?searchKey=" + Input.value + "&langCode=EN", {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'OrgId': '2206040706597097092' }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        HotelList = data
        autoHotelListbind(Input)
        console.log(data)
    }
}

//  bind hotel list

function ShowHotelList(element) {
    element.closest(".HotelSearchDestination").querySelector(".hideInput") ? element.closest(".HotelSearchDestination").querySelector(".hideInput").classList.remove('hideInput') : ''
    autoHotelListbind(element)
}
function autoHotelListbind(element) {
    let html = '';
    HotelList.map(e => {
        html += `
       <div class="HotelSearchOtionContent" onclick="ApplyHotelCity(this)">
         <span class="material-icons"> location_on </span>
         <a data-countryCode="${e.countryCode}" data-cityCode="${e.cityCode}" data-city_Id="${e.city_Id}"  data-cityName="${e.cityName}"  data-displayName="${e.displayName}"> ${e.displayName}</a>
      </div>`
    });
    element.closest(".HotelSearchDestination").querySelector(".HotelList").innerHTML = html;
}

function ApplyHotelCity(elem) {
    console.log(elem)
    let countryCode = elem.querySelector('a').getAttribute('data-countryCode');
    let cityCode = elem.querySelector('a').getAttribute('data-cityCode');
    let city_Id = elem.querySelector('a').getAttribute('data-city_Id');
    let displayName = elem.querySelector('a').getAttribute('data-displayName');

    let input = document.getElementById('FromHotel');
    input.value = displayName;
    input.setAttribute("data-countryCode", countryCode);
    input.setAttribute("data-cityCode", cityCode);
    input.setAttribute("data-city_Id", city_Id);

    elem.closest('.HotelDestination').classList.add('hideInput');
};






///  nationality list bind 

function showNationality(elem) {
    elem.closest('.HotelSearchFormNationality').querySelector('.HotelNationality').classList.remove('hideInput');
    autonationalityListbind(elem);
}

getBindNationalityList()
async function getBindNationalityList() {
    const response = await fetch("https://adminapi.uat.futuretravelplatform.com/api/CountryMaster/GetSelectedCountry/EN/MA,TN,NG,EG,AE,SA,BH,QA,KW,OM", {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'OrgId': '2206040706597097092' }
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    NationalityList = data
}

async function GetNationalityList(Input) {
    if (Input.value) {
        const response = await fetch("https://adminapi.uat.futuretravelplatform.com/api/MasterSearch/GetAllCountry/EN/" + Input.value, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'OrgId': '2206040706597097092' }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        NationalityList = data
        autonationalityListbind(Input)
    }
}

function autonationalityListbind(elem) {
    let html = '';
    NationalityList.map(e => {
        html += `
       <div class="HotelSearchOtionContent" onclick="ApplyNationality(this)">
         <span class="material-icons"> location_on </span>
         <a data-countryCode="${e.country_code}" data-countryName="${e.country_name}" > ${e.country_name}</a>
      </div>`
    });
    elem.closest('.HotelSearchFormNationality').querySelector('.NationalityList').innerHTML = html;
}

function ApplyNationality(elem) {
    let citycode = elem.querySelector('a').getAttribute('data-countryCode');
    let countryName = elem.querySelector('a').getAttribute('data-countryName');
    document.getElementById('FromNationality').value = countryName;
    document.getElementById('FromNationality').setAttribute('data-countryCode', citycode);
    elem.closest('.HotelNationality').classList.add('hideInput');
}

//  caleran js for calender


var startDate, endDate, HotelStartInstance, HotelEndInstance;
var HotelFillInputs = function () {
    HotelStartInstance.elem.value = startDate ? startDate.locale(HotelStartInstance.config.format).format('DD MMM YYYY') : "";
    HotelEndInstance.elem.value = endDate ? endDate.locale(HotelEndInstance.config.format).format('DD MMM YYYY') : "";
};
document.querySelector("#hotelStart").value = moment().format('DD MMM YYYY');
document.querySelector("#hotelEnd").value = moment().format('DD MMM YYYY');
caleran("#hotelStart", {
    startEmpty: document.querySelector("#hotelStart").value === "",
    startDate: document.querySelector("#hotelStart").value,
    endDate: document.querySelector("#hotelEnd").value,
    enableKeyboard: false,
    minDate: new Date,
    oninit: function (instance) {
        HotelStartInstance = instance;
        if (!instance.config.startEmpty && instance.config.startDate) {
            instance.elem.value = instance.config.startDate.locale(instance.config.format).format('DD MMM YYYY');
            startDate = instance.config.startDate.clone();
        }
    },
    onbeforeshow: function (instance) {
        if (startDate) {
            HotelStartInstance.config.startDate = startDate;
            HotelEndInstance.config.startDate = startDate;
        }
        if (endDate) {
            HotelStartInstance.config.endDate = endDate.clone();
            HotelEndInstance.config.endDate = endDate.clone();
        }
        HotelFillInputs();
        instance.updateHeader();
        instance.reDrawCells();
    },
    onfirstselect: function (instance, start) {
        startDate = start.clone();
        HotelStartInstance.globals.startSelected = false;
        HotelStartInstance.hideDropdown();
        HotelEndInstance.showDropdown();
        HotelEndInstance.config.minDate = startDate.clone();
        HotelEndInstance.config.startDate = startDate.clone();
        HotelEndInstance.config.endDate = null;
        HotelEndInstance.globals.startSelected = true;
        HotelEndInstance.globals.endSelected = false;
        HotelEndInstance.globals.firstValueSelected = true;
        HotelEndInstance.setDisplayDate(start);
        if (endDate && startDate.isAfter(endDate)) {
            HotelEndInstance.globals.endDate = endDate.clone();
        }
        HotelEndInstance.updateHeader();
        HotelEndInstance.reDrawCells();
        HotelFillInputs();
    }

});
caleran("#hotelEnd", {
    startEmpty: document.querySelector("#hotelEnd").value === "",
    startDate: document.querySelector("#hotelStart").value,
    endDate: document.querySelector("#hotelEnd").value,
    enableKeyboard: false,
    autoCloseOnSelect: true,
    minDate: new Date,
    oninit: function (instance) {
        HotelEndInstance = instance;
        if (!instance.config.startEmpty && instance.config.endDate) {
            instance.elem.value = (instance.config.endDate.locale(instance.config.format).format('DD MMM YYYY'));
            endDate = instance.config.endDate.clone();
        }
        calcNumberOfNights(startDate, endDate)
    },
    onbeforeshow: function (instance) {
        if (startDate) {
            HotelStartInstance.config.startDate = startDate;
            HotelEndInstance.config.startDate = startDate;
        }
        if (endDate) {
            HotelStartInstance.config.endDate = endDate.clone();
            HotelEndInstance.config.endDate = endDate.clone();
        }
        HotelFillInputs();
        instance.updateHeader();
        instance.reDrawCells();
    },
    onafterselect: function (instance, start, end) {
        startDate = start.clone();
        endDate = end.clone();
        HotelEndInstance.hideDropdown();
        HotelStartInstance.config.endDate = endDate.clone();
        HotelStartInstance.globals.firstValueSelected = true;
        HotelFillInputs();
        HotelEndInstance.globals.startSelected = true;
        HotelEndInstance.globals.endSelected = false;
        calcNumberOfNights(startDate, endDate)

    }
});


// hotel search query string 

function searchHotel() {
    let hotelDetails = document.getElementById('FromHotel')
    let Nationality = document.getElementById('FromNationality').getAttribute('data-countryCode')
    let element = document.getElementsByClassName('toast-warning')[0]
    if (!hotelDetails) {
        element.classList.remove('d-none')
        element.querySelector('span').innerHTML = 'Please enter destination city'
        hideToaster(element)
        return
    }
    if (!Nationality) {
        element.classList.remove('d-none')
        element.querySelector('span').innerHTML = 'Please select nationality'
        hideToaster(element)
        return
    }
    let queryParams = {};
    queryParams['CityCode'] = hotelDetails.getAttribute('data-cityCode');
    queryParams['CityId'] = hotelDetails.getAttribute('data-city_Id');
    queryParams['Country'] = hotelDetails.getAttribute('data-countryCode');
    queryParams['nationality'] = Nationality;
    queryParams['langCode'] = 'EN';
    queryParams['checkinDate'] = moment(document.getElementById('hotelStart').value).format('DD-MMM-YYYY');
    queryParams['checkoutDate'] = moment(document.getElementById('hotelEnd').value).format('DD-MMM-YYYY');

    RoomDetails.map((e, i) => {
        let room = []
        room.push(parseInt(e.adult))
        room.push(parseInt(e.child))
        room.push(...e.childAge.map(no => parseInt(no)))
        let roomdetails = room.join('-')
        console.log(roomdetails)
        queryParams[`room${i + 1}`] = roomdetails
    })
    // sessionStorage.setItem('SerachReqQueryObj', JSON.stringify(querystring));
    const urlParams = new URLSearchParams(window.location.search);
    var query = Object.keys(queryParams).map(key => key + '=' + queryParams[key]).join('&');
    window.location.href = 'https://travel.neuholidays.com/hotel/result?' + query;

};

function calcNumberOfNights(checkInDate, checkOutDate) {
    let night = moment(checkOutDate).diff(checkInDate, 'days');
    document.getElementsByClassName('nightCountgBox')[0].querySelector('.nightNum').innerHTML = night;
};
