let airportlist = [];
let TravellerDetails = {
    classType: 'Economy',
    Adult: 1,
    child: 0,
    Infant: 0,
};
PaxCount('', '');
bindMultiCityFrom();
bindMultiCityFrom();
GetAirportList(undefined, null);
let AdvanceShowBtn = false
let advancedSerch = true;
// 


async function GetAirportList(element, check) {
    let inpVal = check ? element.value ? element.value : 'BOM' : 'BOM';
    if (inpVal.length >= 3) {
        const response = await fetch("https://adminapi.uat.futuretravelplatform.com/api/MasterSearch/GetAllMasterSearch/en/" + inpVal, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'OrgId': '2206040706597097092' }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        airportlist = await data;
        autobind(element, check, airportlist);

    }

};

function autobind(element, check, obj) {
    check ? check == '0' ? element.closest(".searchBox").querySelector(".dropdown-content").classList.add('show') : element.closest(".searchBox").querySelector(".depart-content").classList.add('showdepart') : '';
    let html = '';
    let airlist = obj ? obj : airportlist;
    airlist.map(e => {
        html += ` <li class="dropdown-item" onclick="ApplyAirport(this)"  data-city-name=${e.ct} data-airport-name=${e.an} data-airport-code=${e.ac} 
          data-country-code = ${e.cc}>
                      <div class="autoCompleteIcon">
                        <svg focusable="false" color="inherit" fill="currentcolor" aria-hidden="true"
                          role="presentation" viewBox="0 0 150 150" preserveAspectRatio="xMidYMid meet"
                          width="24px" height="24px" class="sc-bxivhb dttlRz sc-jxGEyO iICATY">
                          <path
                            d="M118.9 15.7L90.7 43.9l-80.9-25c-1.6-.4-3.3 0-4.6 1.1L.7 24.5c-.9.8-.9 2.1-.2 3 .2.2.4.3.6.4l65.2 40.4-24 24c-3.8 3.7-7.2 7.8-10.2 12.2l-18.2-5c-1.6-.4-3.3.1-4.6 1.2l-3.5 3.5c-1 .8-1 2.3-.2 3.3l.4.4 18.6 13.9.6.5-.2.5c-1.8 3.7-1.2 4.3 2.5 2.5l.5-.2c.2.2.3.4.5.6l13.9 18.6c.7 1 2.2 1.3 3.2.6.1-.1.3-.2.4-.3l3.5-3.5c1.1-1.3 1.6-3 1.2-4.6l-5-18.2c4.4-3 8.5-6.4 12.2-10.2l24-24 40.1 64.7c.6 1 1.8 1.4 2.8.8.2-.1.4-.3.6-.4l4.5-4.5c1.1-1.2 1.5-3 1.1-4.6l-24.9-80.3 28.4-28.4C150 15.9 152 4.9 148.7 1.6S134.4.2 118.9 15.7z">
                          </path>
                        </svg>
                      </div>
                      <div class="ListTypeCity">
                        <span> ${e.ct}</span>
                        <span>
                          ${e.an}
                        </span>
                      </div>
                      <span class="airportCode">${e.ac}</span>
                    </li>`
    });
    element ? element.closest(".searchBox").querySelector(".dropdown-wrapper").innerHTML = html : '';
}


function ApplyAirport(element) {
    let city_name = element.getAttribute("data-city-name");
    let code = element.getAttribute("data-airport-code");
    element.closest(".search-border").querySelector('input').value = city_name;
    element.closest(".search-border").querySelector('input').setAttribute("data-airport-code", code);
    let container = element.closest(".search-border").querySelector('input')
    if (!container.classList.contains('Origin')) {
        let nextform = element.closest('.MultiForm') ? element.closest('.MultiForm').nextElementSibling : '';
        if (nextform) {
            if (nextform.querySelector('.Origin')) {
                nextform.querySelector('.Origin').value = city_name
                nextform.querySelector('.Origin').setAttribute("data-airport-code", code)
            };
        };
    }
};

//







// advancedField()
function advancedField(elem) {
    console.log('asd')
    console.log(elem)
    elem.querySelector('.expand-less').classList.add('d-none');
    elem.querySelector('.expand-more').classList.add('d-none');
    if (advancedSerch) {
        advancedSerch = false;
        elem.closest('div').querySelector(".expander_more").classList.remove('d-none');
        elem.querySelector('.expand-less').classList.remove('d-none');
    } else {
        advancedSerch = true;
        elem.closest('div').querySelector(".expander_more").classList.add('d-none');
        elem.querySelector('.expand-more').classList.remove('d-none');
    }
};



function PaxCount(pax, btn_name) {
    let Adul_num = parseInt(document.getElementById("adult").value);
    let child_Num = parseInt(document.getElementById("child").value);
    let Infant_child = parseInt(document.getElementById("infant").value);
    let adult_minus_btn = document.getElementsByClassName("adult_minus_btn")[0];
    let adult_plus_btn = document.getElementsByClassName("adult_plus_btn")[0];
    let child_plus_btn = document.getElementsByClassName("child_plus_btn")[0];
    let child_minus_btn = document.getElementsByClassName("child_minus_btn")[0];
    let infant_plus_btn = document.getElementsByClassName("infant_plus_btn")[0];
    let infant_minus_btn = document.getElementsByClassName("infant_minus_btn")[0];
    if (btn_name == 'add') {
        if (pax == "adult" || pax == "child") {
            if (Adul_num + child_Num < 9) {
                document.getElementById(pax).value = parseInt(document.getElementById(pax).value) + 1
                Adul_num = parseInt(document.getElementById('adult').value);
                child_Num = parseInt(document.getElementById('child').value);
            }
        }
        if (pax == "infant") {
            if (Infant_child < Adul_num) {
                document.getElementById(pax).value = parseInt(document.getElementById(pax).value) + 1
                Infant_child = parseInt(document.getElementById(pax).value);
            }
        }
    } else {
        if (pax == "adult") {
            if (Adul_num > 1) {
                document.getElementById(pax).value = parseInt(document.getElementById(pax).value) - 1
                Adul_num--;
            }
            if (Infant_child > Adul_num) {
                if (btn_name == 'remove') {
                    document.getElementById('infant').value = Infant_child - 1;
                    Infant_child--
                }
            }
        } else if (pax == "child") {
            if (child_Num > 0) {
                document.getElementById(pax).value = parseInt(document.getElementById(pax).value) - 1;
                child_Num--;
            }
        } else if (pax == "infant") {
            if (Infant_child > 0) {
                document.getElementById(pax).value = parseInt(document.getElementById(pax).value) - 1;
                Infant_child = parseInt(document.getElementById(pax).value);
            }
        }
    }
    Adul_num == 1 ? adult_minus_btn.classList.add("disableBtn") : adult_minus_btn.classList.remove("disableBtn");
    child_Num == 0 ? child_minus_btn.classList.add('disableBtn') : child_minus_btn.classList.remove('disableBtn');
    Infant_child == 0 ? infant_minus_btn.classList.add("disableBtn") : infant_minus_btn.classList.remove("disableBtn");
    if (Adul_num + child_Num == 9) {
        adult_plus_btn.classList.add('disableBtn');
        child_plus_btn.classList.add("disableBtn");
    } else {
        adult_plus_btn.classList.remove('disableBtn');
        child_plus_btn.classList.remove("disableBtn");
    }
    if (Infant_child == Adul_num) infant_plus_btn.classList.add("disableBtn")
    else infant_plus_btn.classList.remove('disableBtn');


    let travel_no1 = Adul_num + (child_Num + Infant_child);
    let paxSearch = document.getElementsByClassName('TravelerClassCount')
    for (let i = 0; i < paxSearch.length; i++) {
        paxSearch[i].innerHTML = `
    <h4>${travel_no1} Traveller</h4> 
    <h4>${TravellerDetails.classType}</h4>`
    };
    TravellerDetails.Adult = Adul_num;
    TravellerDetails.child = child_Num;
    TravellerDetails.Infant = Infant_child;


};

function ClassType(Btn, name) {
    document.querySelectorAll('.classBtn').forEach(box => box.classList.remove('classTypeBorder'));
    Btn.classList.add('classTypeBorder');
    TravellerDetails.classType = name;
    PaxCount('', '');
};

//  traveller div show and hide

function ShowPaxCounter() {
    document.getElementById('TravellerCount').classList.remove('travel-content');
    document.getElementById('TravellerCount').classList.remove('d-none')

}

function ApplyTraveller() {
    document.getElementById('TravellerCount').classList.add('travel-content');
}





///  multi city  

function bindMultiCityFrom() {
    var searchList = document.querySelectorAll(".MultiForm");
    let html = ''
    if (searchList.length < 6) {
        let RemoveHtml = `<div class="closeMulticityCard" onclick='removeMultiCityForm(this)' >
        <span class="material-icons" > close </span>
            </div>
         </div> `
        html = `<div class="MCToFromDate MultiForm">
    <div class="multiCityBody">
      <div class="multiCityRemove">
        <div class="multiCityFlightText">Flight 1</div>
      </div>
      <div class="order2">
        <div class="toFromSearchWrapper">
          <div class="toFromSearchOrigin search-border">
            <label for="" class="toOrigin">
              <div class="toOriginIcon">
                <span class="material-icons">
                  flight</span>
              </div>
              <div class="toOriginContent">
                <h4>From</h4>
                <div class="searchBox">
                  <input class="Origin " autocomplete="off" onclick="autobind(this , '0' ,null)"
                  onkeyup="GetAirportList(this , '0')"  type="text" data-airport-code="" placeholder="Origin"
                    />
                  <div id="myDropdown" class="dropdown-content">
                    <div>
                      <div class="mobileBack">
                        <div class="mobileHead">
                          <button class="mobileBackButton toggle">
                            <span class="material-icons">
                              arrow_back
                            </span>
                          </button>
                          <div class="mobileTitle">
                            <h4>Search destination</h4>
                          </div>
                        </div>
                      </div>
                      <div class="mobileSearchInput">
                        <input type="text" autocomplete="off" class="mobileSearch"
                          placeholder="Search Where Are You Flying" />
                        <span class="material-icons">
                          search
                        </span>
                      </div>
                    </div>

                    <div class="toOriginPopular">
                      <h4>TOP ORIGINS</h4>
                    </div>
                    <ul class="dropdown-wrapper">
                    
                    </ul>
                  </div>
                </div>
              </div>
            </label>
          </div>
          <div class="toFromSearchSweep" onclick="ExchangeValue(this)">
            <span class="material-icons"> sync_alt </span>
          </div>
          <div class="toFromSearchDepart search-border">
            <label class="toDepart" for="">
              <div class="toDepartIcon">
                <span class="material-icons">
                  flight</span>
              </div>
              <div class="ToDepartContent searchBox">
                <h4>To</h4>
                <div>
                  <input class="depart" autocomplete="off" onclick="autobind(this , '1' ,null)"
                  onkeyup="GetAirportList(this , '1')" data-airport-code=""   type="text"
                    placeholder="Destination" />
                  <div id="departDropDown" class="depart-content">
                    <div>
                      <div class="mobileBack">
                        <div class="mobileHead">
                          <button class="mobileBackButton toggle">
                            <span class="material-icons">
                              arrow_back
                            </span>
                          </button>
                          <div class="mobileTitle">
                            <h4>Search destination</h4>
                          </div>
                        </div>
                      </div>
                      <div class="mobileSearchInput">
                        <input type="text" autocomplete="off" class="mobileSearch"
                          placeholder="Search Where Are You Flying" />
                        <span class="material-icons">
                          search
                        </span>
                      </div>
                    </div>
                    <div class="toDepartPopular">
                      <h4>TOP ORIGINS</h4>
                    </div>
                    <ul class="dropdown-wrapper">
                     
                    </ul>
                  </div>
                </div>
              </div>
            </label>
          </div>
        </div>
      </div>
      <div class="order3">
        <div class="searchDate">
          <label for="calenderForm" class="searchDateForm">
            <div class="searchDateFormIcon">
              <span class="material-icons">event_note</span>
            </div>
            <div class="searchDateFormHead">
              <h4 class="searchDateFormHeadText">
                Departure
              </h4>
              <input type="text" id="MultiCity-${searchList.length + 1}" />
            </div>
          </label>
        </div>
      </div>
    </div> 
    ${searchList.length >= 2 ? RemoveHtml : ''}
 `
        document.getElementById('multiCityForm').insertAdjacentHTML("beforebegin", html);
        var searchList = document.querySelectorAll(".MultiForm");
        let index = searchList.length == 2 ? 1 : searchList.length - 1
        let date = searchList.length == 1 ? new Date : document.getElementById(`MultiCity-${+ (index)}`).value
        console.log(date)
        caleran("#MultiCity-" + (searchList.length), {
            singleDate: true,
            calendarCount: 1,
            showHeader: false,
            showFooter: false,
            autoCloseOnSelect: true,
            format: 'DD MMM YYYY',
            minDate: date,
            onafterselect: function (instance, start, end) {
                CheckMultiDate(start, searchList.length)
            }

        });
    }
    if (searchList.length >= 5) document.getElementById("addMultiCityForm").style.visibility = 'hidden';

};

function CheckMultiDate(Date, index) {
    var searchList = document.querySelectorAll(".MultiForm")
    console.log(searchList)
    for (let i = index; i < searchList.length; i++) {
        caleran("#MultiCity-" + (i + 1), {
            singleDate: true,
            calendarCount: 1,
            showHeader: false,
            showFooter: false,
            autoCloseOnSelect: true,
            format: 'DD MMM YYYY',
            minDate: Date._d,
            onafterselect: function (instance, start, end) {
                CheckMultiDate(start, (index + 1))
            }
        });

    };
};



function removeMultiCityForm(elem) {
    elem.closest(".MultiForm").remove();
    document.getElementById("addMultiCityForm").style.visibility = 'visible';

};

let tripKey = 'IRT';
function ChangeTab(type) {
    tripKey = type;
}




function hideToaster(element) {
    setTimeout(function () {
        element.classList.add('d-none');
        element.querySelector('span').innerHTML = '';
    }, 1500);
}



/// drop down

async function GetAirlineList(inp) {
    console.log(inp.value)
    let html = ''
    if (inp.value.length >= 2) {
        const response = await fetch("https://adminapi.uat.futuretravelplatform.com/api/MasterSearch/GetAllAirline/en/" + inp.value, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'OrgId': '2206040706597097092' }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        //  = await data;
        data.map(e => {
            html += ` <li class="ListOfAirline" data-airline-code='${e.airline_code}'>${e.airline_name} </li>`
        })

        console.log(data)
        inp.closest('div').querySelector('.PrefferedAirline').innerHTML = html;
    };
    inp.closest('div').querySelector('.PrefferedAirline').classList.remove('aiplineDropdown');
}

function ExchangeValue(elmnt) {
    let element = elmnt.closest('.toFromSearchWrapper');
    let From = element.querySelector('.Origin');
    let To = element.querySelector('.depart');
    var from1 = From.value;
    var form2 = From.getAttribute('data-airport-code');
    element.querySelector('.Origin').value = To.value;
    element.querySelector('.Origin').setAttribute('data-airport-code', To.getAttribute('data-airport-code'));
    element.querySelector('.depart').value = from1;
    element.querySelector('.depart').setAttribute('data-airport-code', form2);
}
//  caleran js  for calender

caleran("#OW_Calender", {
    singleDate: true,
    calendarCount: 1,
    showHeader: false,
    showFooter: false,
    autoCloseOnSelect: true,
    format: 'DD MMM YYYY',
    minDate: new Date,

});


var startDate, endDate, startInstance, endInstance;
var fillInputs = function () {
    startInstance.elem.value = startDate ? startDate.locale(startInstance.config.format).format('DD MMM YYYY') : "";
    endInstance.elem.value = endDate ? endDate.locale(endInstance.config.format).format('DD MMM YYYY') : "";
};
document.querySelector("#flightStart").value = moment().format('DD MMM YYYY');
document.querySelector("#flightEnd").value = moment().format('DD MMM YYYY');
caleran("#flightStart", {
    startEmpty: document.querySelector("#flightStart").value === "",
    startDate: document.querySelector("#flightStart").value,
    endDate: document.querySelector("#flightEnd").value,
    enableKeyboard: false,
    minDate: new Date,
    oninit: function (instance) {
        startInstance = instance;
        if (!instance.config.startEmpty && instance.config.startDate) {
            instance.elem.value = instance.config.startDate.locale(instance.config.format).format('DD MMM YYYY');
            startDate = instance.config.startDate.clone();
        }

    },
    onbeforeshow: function (instance) {
        if (startDate) {
            startInstance.config.startDate = startDate;
            endInstance.config.startDate = startDate;
        }
        if (endDate) {
            startInstance.config.endDate = endDate.clone();
            endInstance.config.endDate = endDate.clone();
        }
        fillInputs();
        instance.updateHeader();
        instance.reDrawCells();
    },
    onfirstselect: function (instance, start) {
        startDate = start.clone();
        startInstance.globals.startSelected = false;
        startInstance.hideDropdown();
        endInstance.showDropdown();
        endInstance.config.minDate = startDate.clone();
        endInstance.config.startDate = startDate.clone();
        endInstance.config.endDate = null;
        endInstance.globals.startSelected = true;
        endInstance.globals.endSelected = false;
        endInstance.globals.firstValueSelected = true;
        endInstance.setDisplayDate(start);
        if (endDate && startDate.isAfter(endDate)) {
            endInstance.globals.endDate = endDate.clone();
        }
        endInstance.updateHeader();
        endInstance.reDrawCells();
        fillInputs();
    }
});
caleran("#flightEnd", {
    startEmpty: document.querySelector("#flightEnd").value === "",
    startDate: document.querySelector("#flightStart").value,
    endDate: document.querySelector("#flightEnd").value,
    enableKeyboard: false,
    autoCloseOnSelect: true,
    minDate: new Date,
    oninit: function (instance) {
        endInstance = instance;
        if (!instance.config.startEmpty && instance.config.endDate) {
            instance.elem.value = (instance.config.endDate.locale(instance.config.format).format('DD MMM YYYY'));
            endDate = instance.config.endDate.clone();
        }
    },
    onbeforeshow: function (instance) {
        if (startDate) {
            startInstance.config.startDate = startDate;
            endInstance.config.startDate = startDate;
        }
        if (endDate) {
            startInstance.config.endDate = endDate.clone();
            endInstance.config.endDate = endDate.clone();
        }
        fillInputs();
        instance.updateHeader();
        instance.reDrawCells();
    },
    onafterselect: function (instance, start, end) {
        startDate = start.clone();
        endDate = end.clone();
        endInstance.hideDropdown();
        startInstance.config.endDate = endDate.clone();
        startInstance.globals.firstValueSelected = true;
        fillInputs();
        endInstance.globals.startSelected = true;
        endInstance.globals.endSelected = false;

    }
});

// Flight Search query string

function Searchflight(elem) {
    let checkValidation = true;

    let main_div = elem.closest('.CommonSearch');
    let airlinelist = document.querySelectorAll(".airlinelist");
    let airline_code = [];
    if (airlinelist.length != 0) {
        airlinelist.forEach(e => {
            airline_code.push(e.getAttribute('data-airline-code'));
        });
    }
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
        "airlines": airline_code.length != 0 ? airline_code.join(',') : '',
    }

    let cl = checkClassType()
    let origin = main_div.querySelector('.Origin').getAttribute("data-airport-code");
    let depart = main_div.querySelector('.depart').getAttribute("data-airport-code");
    if (tripKey == 'OW' || tripKey == 'IRT') {
        let list = tripKey == 'OW' ? 1 : 2
        for (let i = 0; i < list; i++) {
            let start = tripKey == 'OW' ? document.getElementById('OW_Calender').value : document.getElementById('flightStart').value
            if (!validator(origin, depart)) {
                checkValidation = false
            }
            let end = document.getElementById('flightEnd').value
            querystring[`dep${i + 1}`] = i == 0 ? origin : depart;
            querystring[`ret${i + 1}`] = i == 0 ? depart : origin;
            querystring[`cl${i + 1}`] = cl;
            querystring[`dtt${i + 1}`] = tripKey == 'OW' ? moment(start).format('DD-MMM-YYYY') : i == 0 ? moment(start).format('DD-MMM-YYYY') : moment(end).format('DD-MMM-YYYY');
        }
    } else if (tripKey == 'NMC') {
        var searchList = main_div.querySelectorAll(".MultiForm");
        searchList.forEach((e, i) => {
            let Origin = e.getElementsByClassName('Origin')[0].getAttribute("data-airport-code");
            let depart = e.getElementsByClassName('depart')[0].getAttribute("data-airport-code");
            if (!validator(Origin, depart)) {
                checkValidation = false
            }
            querystring[`dep${i + 1}`] = Origin;
            querystring[`ret${i + 1}`] = depart;
            querystring[`dtt${i + 1}`] = moment(e.querySelector(`#MultiCity-${i + 1}`).value).format('DD-MMM-YYYY'); //  changes
            querystring[`cl${i + 1}`] = cl;
        })
    }
    if (!checkValidation) {
        return
    }
    sessionStorage.setItem('SerachReqQueryObj', JSON.stringify(querystring));
    const urlParams = new URLSearchParams(window.location.search);
    var query = Object.keys(querystring).map(key => key + '=' + querystring[key]).join('&');
    window.location.href = 'https://travel.neuholidays.com/Flight/search?' + query;
}


//  validation

function validator(origin, depart) {
    let element = document.getElementsByClassName('toast-warning')[0]
    if (origin == depart) {
        element.classList.remove('d-none')
        element.querySelector('span').innerHTML = 'Departure must be different from arrival'
        hideToaster(element)
        return false
    } if (!origin || !depart) {
        element.classList.remove('d-none')
        element.querySelector('span').innerHTML = 'Please enter departure and arrival city or airport'
        hideToaster(element)
        return false
    } else return true
};

//  common  function

function CheckTriptype(tripKey) {
    if (tripKey == 'NMC') {
        return '3'
    } else if (tripKey == 'IRT') {
        return '2'
    } else if (tripKey == 'OW') {
        return '1'
    }
};

function checkClassType() {
    if (TravellerDetails.classType == 'FirstClass') {
        return 'F'
    } else if (TravellerDetails.classType == 'BusinessClass') {
        return 'C'
    } else if (TravellerDetails.classType == 'PremiumEconomy') {
        return 'W'
    } else if (TravellerDetails.classType == 'Economy') {
        return 'Y'
    }
}


/// multi selector

function Close(e) {
    e.closest('.multiSelect').querySelector(".SelectList").classList.remove("ShowAirlineList");
    e.closest("span").remove();
    let check = document.querySelectorAll(".airlinelist");
    if (check.length == 0) {
        e.closest('.multiSelect').querySelector(".SearchBox").classList.add('multiInp')
    }
}
function showAirlineList(elem) {
    elem.closest('.multiSelect').querySelector(".SelectList").classList.add("ShowAirlineList");
    elem.closest('.multiSelect').querySelector("input").focus();
}
function bindAirLine(airlinelist, elem) {
    let html = "";
    airlinelist.map((e, i) => {
        html += ` <li class="option ${i == 0 ? 'selectAirline' : ''}" onclick="AddAirline(this)" data-airline-code='${e.airline_code}' data-airline-name='${e.airline_name}'>(${e.airline_code}) ${e.airline_name}  </li>`
    })
    elem.closest('.SelectList').querySelector('.ListItem').innerHTML = html;
}

async function GetAirlineDetails(elem) {
    let key = window.event
    let list = document.getElementsByClassName('selectAirline') ? document.getElementsByClassName('selectAirline')[0] : '';
    if (list) {
        if (key.keyCode == 38) {
            console.log('low')
            var prev = list.previousElementSibling;
            if (prev) {
                list.classList.remove("selectAirline");
                prev.classList.add("selectAirline");
            }
        } else if (key.keyCode == 40) {
            console.log('high')
            var next = list.nextElementSibling;
            if (next) {
                list.classList.remove("selectAirline");
                next.classList.add("selectAirline");
            };
        };
    };
    let val = elem.value;
    if (val.length >= 2 && !(key.keyCode == 38) && !(key.keyCode == 40)) {
        const response = await fetch("https://adminapi.uat.futuretravelplatform.com/api/MasterSearch/GetAllAirline/en/" + val, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'OrgId': '2206040706597097092' }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        let obj = await data;
        obj ? bindAirLine(obj, elem) : ''
    }
    if (key.keyCode == 13) {
        AddAirline(document.getElementsByClassName('selectAirline')[0])
    }

};

function AddAirline(val) {
    let check = document.querySelectorAll(".airlinelist");
    if (check.length <= 2) {
        let code = val.getAttribute("data-airline-code");
        let name = val.getAttribute("data-airline-name");
        let html = ` <span class='airlinelist' data-airline-code="${code}"> (${code}) ${name}
      <button onclick="Close(this)">x</button>
    </span>`;
        val.closest('.multiSelect').querySelector(".SearchBox").insertAdjacentHTML("beforeend", html);
        let maindiv = val.closest('.multiSelect').querySelector('input')
        val.closest('.multiSelect').querySelector("input").value = '';
        val.closest('div').classList.remove("ShowAirlineList");
        val.closest('.multiSelect').querySelector(".SearchBox").classList.remove('multiInp');
        val.remove();
        bindAirLine([], maindiv);
    }

};


function resetAllPaxCounter() {
    document.getElementById("infant").value = 0;
    document.getElementById("child").value = 0;
    document.getElementById("adult").value = 1;
    TravellerDetails.Adult = 1;
    TravellerDetails.child = 0;
    TravellerDetails.Infant = 0;
    ClassType(document.getElementsByClassName('EconomyClass')[0] , 'Economy');

};