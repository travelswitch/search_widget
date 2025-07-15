var config = (function () {
    var settings = {
        development: {
            adminApiUrl: "https://adminapi.dev.futuretravelplatform.com/api",
            hotelApiUrl: "https://hotelapi.dev.futuretravelplatform.com/api",
            domain: 'https://retinassr.dev.futuretravelplatform.com'
        }
    };

    // Default to 'development'. A more robust solution could check the hostname.
    var environment = 'development';

    return settings[environment];
})();