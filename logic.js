/**
 * CCT BigData CA2
 * @AUTHOR Kiseleva Olga 2017136
 */

/**
 * This function loads twitter profile photo of selected user
 * @param userID - Twitter user name
 * @param twitter
 */
function loadPhoto(userID, twitter) {

    twitter.get('1.1/users/lookup.json?screen_name=' + userID).then(data => {

        var link = data[0].profile_image_url_https; //stores link to profile pic in the variable
        link = link.replace('_normal', ''); //changes the photo size from 48x48px to original
        document.getElementById('photo').src = link; //magic
    })
}

/**
 * Function which will load top 20 friends of the selected twitter user
 * @param userID - nickname that is entered in input filed
 * @param myMap - map API parameter to pass scanned marks
 * @param twitter
 */
function loadFriendsIDs(userID, twitter, myMap) {
    var listOfCities = [];
    twitter.get('1.1/followers/list.json?cursor=-1&screen_name=' + userID)
        .then(data => {
            var locationList = data.users;
            var tempList = [];
            //loop
            for (var i = 0; i < locationList.length; i++) {

                if (locationList[i].location !== '') {
                    tempList.push(JSON.stringify(locationList[i].location));
                }
            }

            listOfCities = tempList.slice(0, tempList.length);
            addNewLandmark(myMap, listOfCities);
        })
}

/**
 * This function will place all geo markers on the map after scanning them from twitter
 * @param myMap - map API parameter to pass scanned marks
 * @param listOfCities - Array of geolocation that was scanned from the twitter
 */
function addNewLandmark(myMap, listOfCities) {
    myMap.geoObjects.removeAll();
    for (var i = 0; i < listOfCities.length; i++) {

        var myGeocoder = ymaps.geocode(listOfCities[i], {results: 1}); //call to map API to place it
        myGeocoder.then(
            function (res) {
                const coords = res.geoObjects.get(0).geometry.getCoordinates();
                var myPlacemark = new ymaps.Placemark(coords);
                myMap.geoObjects.add(myPlacemark);
            }
        );
    }
}

/**
 * Vanilla JS that initiates the page with all required elements and calls to to the different API that required for this app to work
 */

document.addEventListener("DOMContentLoaded", function () {

    var myMap;

    function init() {
        // Creating the map.
        myMap = new ymaps.Map("map", {
            // The map center coordinates.
            // Default order: “latitude, longitude”.
            // To not manually determine the map center coordinates,
            // use the Coordinate detection tool.
            center: [53.34, 6.26], //centered on the Dublin
            // Zoom level. Acceptable values:
            // from 0 (the entire world) to 19.
            zoom: 2
        });
        // Auxiliary class that can be used
        // instead of GeoObject with the “Point” geometry type (see the previous example)

    }

    ymaps.ready(init);

    // Initialize with your OAuth.io app public key
    OAuth.initialize(
        'OW0LZa8k62OqvvwA9z1ORS3Nwd4'
    );

    // Use popup for OAuth

    document.getElementById('load').addEventListener('click', function () {
        OAuth.popup('twitter', {cache: true}).then(twitter => {
            var userID = document.getElementById('userID').value;
            loadPhoto(userID, twitter);
            loadFriendsIDs(userID, twitter, myMap);

        })

    });
});