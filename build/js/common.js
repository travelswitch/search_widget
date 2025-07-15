// using  window for hide div

window.addEventListener('mouseup', function (event) {
  if (!event.target.matches('.TravelDropdown')) {
    var container = document.getElementById('TravellerCount');
    if (!container.contains(event.target)) {
      container.classList.add('travel-content');
    }
  };
  if (!event.target.matches('.dropdown-content')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  };
  if (!event.target.matches('.depart-content')) {
    var dropdowns = document.getElementsByClassName("depart-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];

      if (openDropdown.classList.contains('showdepart')) {
        openDropdown.classList.remove('showdepart');
      }
    }
  };

  if (!event.target.matches('.tawakkal')) {
    var dropdowns = document.getElementsByClassName("calenderField");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (event.target != dropdowns && event.target.parentNode != dropdowns) {
        if (openDropdown.classList.contains('showCalender')) {
          openDropdown.classList.remove('showCalender');
        }
      }
    }
  };
  if (!event.target.matches('.HotelNationality')) {
    var dropdowns = document.getElementsByClassName("HotelNationality");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (event.target != dropdowns && event.target.parentNode != dropdowns) {
        if (!openDropdown.classList.contains('hideInput')) {
          openDropdown.classList.add('hideInput');
        }
      }
    }
  };
  if (!event.target.matches('.HotelDestination')) {
    var dropdowns = document.getElementsByClassName("HotelDestination");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (event.target != dropdowns && event.target.parentNode != dropdowns) {
        if (!openDropdown.classList.contains('hideInput')) {
          openDropdown.classList.add('hideInput');
        }
      }
    }
  };
  if (!event.target.matches('.PrefAirline-two')) {
    var container = document.getElementsByClassName('SelectList')[0];
    if (!container.contains(event.target)) {
      container.classList.remove('ShowAirlineList');
      container.querySelector('input').value = '';
    }
  };
  if (!event.target.matches('.PrefAirline-one')) {
    var dropdowns = document.getElementsByClassName("PrefAirline-one")[0].querySelector('.SelectList');
    if (dropdowns.classList.contains('ShowAirlineList')) {
      dropdowns.classList.remove('ShowAirlineList');
    }
  };
  if (!event.target.matches('.roomPaxDetails')) {
    var container = document.getElementsByClassName('roomPaxDetails')[0];
    if (!container.contains(event.target)) {
      container.classList.remove('showRoomPax');
    }
  };
});


//  hotel and Flight tabs hide and show

function openTab(cityName, elmnt) {

  // CallCalendar()
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablink");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].style.backgroundColor = "";
  }
  document.getElementById(elmnt).style.display = "block";
  //   elmnt.style.backgroundColor = color;
  document.getElementById("flight_button").classList.remove('active');
  document.getElementById("hotel_button").classList.remove('active')
  document.getElementById(cityName).classList.add('active');
  document.getElementById('target').classList.remove('d-none');
  document.getElementById(elmnt).classList.remove('d-none');
  document.querySelector('.mobileName').innerHTML = elmnt;


}
document.getElementById("flight_button").click();

//  flight all tabs hide and show 

(function () {
  var d = document,
    tabs = d.querySelector('.SearchTripTypeTabs'),
    tab = d.querySelectorAll('li'),
    contents = d.querySelectorAll('.content');
  tabs.addEventListener('click', function (e) {
    if (e.target && e.target.nodeName === 'LI') {
      // change tabs
      for (var i = 0; i < tab.length; i++) {
        tab[i].classList.remove('active1');
      }
      e.target.classList.toggle('active1');


      for (i = 0; i < contents.length; i++) {
        contents[i].classList.remove('active1');
      }
      var tabId = '#' + e.target.dataset.tabId;
      d.querySelector(tabId).classList.toggle('active1');
    }
  });
})();

function closeALLTab(elem) {
  document.getElementById('target').classList.add('d-none')
  document.getElementById('hotel_button').classList.remove('active')
  document.getElementById('flight_button').classList.remove('active')
  console.log(elem)
}














