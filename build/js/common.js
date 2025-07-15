/**
 * @author Abdul Razzak
 * @file build/js/common.js
 * @description This script handles common UI interactions for the website,
 * including closing dropdowns on outside clicks and managing search form tabs.
 * It is written in vanilla JavaScript for broad compatibility.
 */

(function() {
    'use strict';

    /**
     * Adds a global event listener to the window that triggers on a 'mouseup' event.
     * Its primary purpose is to close various dropdowns, popups, and selectors
     * when a user clicks outside of them. Each UI component has its own logic block.
     */
    window.addEventListener('mouseup', function(event) {

        // --- Traveller Count Dropdown ---
        // Hides the traveller count dropdown if a click occurs outside of it.
        // It avoids closing when the trigger element (.TravelDropdown) is clicked.
        if (!event.target.closest('.TravelDropdown')) {
            const container = document.getElementById('TravellerCount');
            if (container && !container.contains(event.target)) {
                container.classList.add('travel-content'); // This class should hide the element.
            }
        }

        // --- Generic '.dropdown-content' Elements ---
        // Iterates over all elements with 'dropdown-content' and closes them
        // by removing the 'show' class if the click was not on the content itself.
        if (!event.target.closest('.dropdown-content')) {
            const dropdowns = document.getElementsByClassName("dropdown-content");
            for (let i = 0; i < dropdowns.length; i++) {
                let openDropdown = dropdowns[i];
                if (openDropdown.classList.contains('show')) {
                    openDropdown.classList.remove('show');
                }
            }
        }

        // --- Departure Date '.depart-content' ---
        // Hides the departure date picker by removing the 'showdepart' class.
        if (!event.target.closest('.depart-content')) {
            const dropdowns = document.getElementsByClassName("depart-content");
            for (let i = 0; i < dropdowns.length; i++) {
                let openDropdown = dropdowns[i];
                if (openDropdown.classList.contains('showdepart')) {
                    openDropdown.classList.remove('showdepart');
                }
            }
        }

        // --- Calendar Field ---
        // Hides the calendar. The trigger element is assumed to be '.tawakkal'.
        // The original logic is preserved for compatibility.
        if (!event.target.closest('.tawakkal')) {
            const dropdowns = document.getElementsByClassName("calenderField");
            for (let i = 0; i < dropdowns.length; i++) {
                const openDropdown = dropdowns[i];
                if (event.target !== openDropdown && event.target.parentNode !== openDropdown) {
                    if (openDropdown.classList.contains('showCalender')) {
                        openDropdown.classList.remove('showCalender');
                    }
                }
            }
        }

        // --- Hotel Nationality Dropdown ---
        // Hides the hotel nationality selector by adding the 'hideInput' class.
        if (!event.target.closest('.HotelNationality')) {
            const dropdowns = document.getElementsByClassName("HotelNationality");
            for (let i = 0; i < dropdowns.length; i++) {
                const openDropdown = dropdowns[i];
                if (event.target !== openDropdown && event.target.parentNode !== openDropdown) {
                    if (!openDropdown.classList.contains('hideInput')) {
                        openDropdown.classList.add('hideInput');
                    }
                }
            }
        }

        // --- Hotel Destination Dropdown ---
        // Hides the hotel destination selector by adding the 'hideInput' class.
        if (!event.target.closest('.HotelDestination')) {
            const dropdowns = document.getElementsByClassName("HotelDestination");
            for (let i = 0; i < dropdowns.length; i++) {
                const openDropdown = dropdowns[i];
                if (event.target !== openDropdown && event.target.parentNode !== openDropdown) {
                    if (!openDropdown.classList.contains('hideInput')) {
                        openDropdown.classList.add('hideInput');
                    }
                }
            }
        }

        // --- Preferred Airline List (Type 2) ---
        // Hides the second type of airline selector.
        if (!event.target.closest('.PrefAirline-two')) {
            const container = document.getElementsByClassName('SelectList')[0];
            if (container && !container.contains(event.target)) {
                container.classList.remove('ShowAirlineList');
                const input = container.querySelector('input');
                if (input) {
                    input.value = ''; // Clears the input field on close.
                }
            }
        }

        // --- Preferred Airline List (Type 1) ---
        // Hides the first type of airline selector.
        if (!event.target.closest('.PrefAirline-one')) {
            const dropdowns = document.querySelector(".PrefAirline-one .SelectList");
            if (dropdowns && dropdowns.classList.contains('ShowAirlineList')) {
                dropdowns.classList.remove('ShowAirlineList');
            }
        }

        // --- Room & Pax Details Dropdown ---
        // Hides the room and passenger details selector.
        if (!event.target.closest('.roomPaxDetails')) {
            const container = document.getElementsByClassName('roomPaxDetails')[0];
            if (container && !container.contains(event.target)) {
                container.classList.remove('showRoomPax');
            }
        }
    });

    /**
     * Manages the main search tabs (e.g., Flight, Hotel).
     * It shows the selected tab's content and marks the corresponding button as active.
     * This function is exposed globally to be called from HTML onclick attributes.
     * @param {string} buttonId - The ID of the tab button that was clicked.
     * @param {string} contentId - The ID of the tab content panel to show.
     */
    window.openTab = function(buttonId, contentId) {
        let i, tabcontent, tablinks;

        // Hide all elements with the class "tabcontent"
        tabcontent = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }

        // Remove the background color from all tab links
        // Note: The original code modified style directly. A class-based approach is often better.
        tablinks = document.getElementsByClassName("tablink");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].style.backgroundColor = "";
        }

        // Show the specific tab content
        const targetContent = document.getElementById(contentId);
        if (targetContent) {
            targetContent.style.display = "block";
            targetContent.classList.remove('d-none');
        }

        // Deactivate other main tabs and activate the current one
        const flightButton = document.getElementById("flight_button");
        if (flightButton) flightButton.classList.remove('active');

        const hotelButton = document.getElementById("hotel_button");
        if (hotelButton) hotelButton.classList.remove('active');

        const currentButton = document.getElementById(buttonId);
        if (currentButton) currentButton.classList.add('active');

        // Logic for mobile view
        const targetContainer = document.getElementById('target');
        if (targetContainer) targetContainer.classList.remove('d-none');

        const mobileName = document.querySelector('.mobileName');
        if (mobileName) mobileName.innerHTML = contentId;
    };

    // --- Initialize Default Tab ---
    // On page load, programmatically click the flight button to make it the default active tab.
    const flightButton = document.getElementById("flight_button");
    if (flightButton) {
        // Using a timeout to ensure other scripts have loaded, though not always necessary.
        setTimeout(() => flightButton.click(), 0);
    }


    /**
     * An IIFE to set up event listeners for the trip type sub-tabs (e.g., One Way, Round Trip).
     * It encapsulates the logic to avoid polluting the global scope.
     */
    (function() {
        const tabsContainer = document.querySelector('.SearchTripTypeTabs');
        if (!tabsContainer) return;

        tabsContainer.addEventListener('click', function(e) {
            // Delegate event handling to the LI elements inside the container
            const clickedTab = e.target.closest('li');
            if (!clickedTab) return;

            // Get all tabs and content panels
            const allTabs = tabsContainer.querySelectorAll('li');
            const allContents = document.querySelectorAll('.content');

            // Deactivate all tabs and content panels
            allTabs.forEach(tab => tab.classList.remove('active1'));
            allContents.forEach(content => content.classList.remove('active1'));

            // Activate the clicked tab
            clickedTab.classList.add('active1');

            // Activate the corresponding content panel using the 'data-tab-id' attribute
            const tabId = clickedTab.dataset.tabId;
            if (tabId) {
                const targetContent = document.getElementById(tabId);
                if (targetContent) {
                    targetContent.classList.add('active1');
                }
            }
        });
    })();

    /**
     * Closes the main tab interface, likely for a 'close' button in a mobile view.
     * This function is exposed globally to be called from HTML.
     * @param {HTMLElement} elem - The element that triggered the function (for context).
     */
    window.closeALLTab = function(elem) {
        const targetContainer = document.getElementById('target');
        if (targetContainer) {
            targetContainer.classList.add('d-none');
        }

        const hotelButton = document.getElementById('hotel_button');
        if (hotelButton) {
            hotelButton.classList.remove('active');
        }

        const flightButton = document.getElementById('flight_button');
        if (flightButton) {
            flightButton.classList.remove('active');
        }

        // The original code logged the element, which can be useful for debugging.
        console.log('closeALLTab triggered by:', elem);
    };

})();
