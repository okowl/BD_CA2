var listOfCities = [];

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

function loadFriendsIDs(userID, twitter){
    twitter.get('1.1/followers/list.json?cursor=-1&screen_name='+ userID)
        .then(data => {
            var locationList = data.users;
            //var tempList = [];
            listOfCities = [];
            for(var i = 0; i < locationList.length; i++) {

                if (locationList[i].location !== '') {
                    listOfCities.push(JSON.stringify(locationList[i].location));
                }
            }

        })
}

/**
 *
 */

document.addEventListener("DOMContentLoaded", function () {

    function init() {
        // Creating the map.
        var myMap = new ymaps.Map("map", {
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

        var myGeocoder = ymaps.geocode("Kiev, Ukraine", {results: 1});
        myGeocoder.then(
            function (res) {
                const coords = res.geoObjects.get(0).geometry.getCoordinates();
                var myPlacemark = new ymaps.Placemark(coords);
                myMap.geoObjects.add(myPlacemark);

            }
        );
    }

    ymaps.ready(init);

    // Initialize with your OAuth.io app public key
    OAuth.initialize(
        'OW0LZa8k62OqvvwA9z1ORS3Nwd4'
    );

    // Use popup for OAuth
    /**
     * @TODO read documentation OAUTH and try remove popup whatsoever
     */
    OAuth.popup('twitter', {cache: true}).then(twitter => {

        // Prompts 'welcome' message with User's email on successful login
        // #me() is a convenient method to retrieve user data without requiring you
        // to know which OAuth provider url to call
        twitter.me().then(data => {

            twitter.get('1.1/users/lookup.json?screen_name=' + data.alias).then(data => {
                var link = data[0].profile_image_url_https;
                link = link.replace('_normal', '');
                document.getElementById('photo').src = link;
                console.log(link);

            })
        });
        // Retrieves user data from OAuth provider by using #get() and
        // OAuth provider url
        twitter.get('/1.1/account/verify_credentials.json?include_email=true').then(data => {

        });

        document.getElementById('load').addEventListener('click', function () {
            var userID = document.getElementById('userID').value;
            loadPhoto(userID, twitter);
            loadFriendsIDs(userID, twitter);
            console.log(listOfCities);
        })
    });
});