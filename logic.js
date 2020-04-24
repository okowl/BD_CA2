function loadPhoto(userID, twitter) {

    twitter.get('1.1/users/lookup.json?screen_name='+userID).then(data=>{
        console.log(data);
        var link = data[0].profile_image_url_https;
        link = link.replace('_normal', '');
        document.getElementById('photo').src = link;

        var defaultClient = cloudmersiveImageApiClient.ApiClient.instance;
        // Configure API key authorization: Apikey
        var Apikey = defaultClient.authentications['Apikey'];
        Apikey.apiKey = "ff86171e-5efd-47f9-a0a0-9da800b16698";

        var api = new cloudmersiveImageApiClient.ArtisticApi();

        console.log(api);
        var options = {
            method: 'GET',
            mode: 'cors',
        };
        var request = new Request(link);

        fetch(request, options).then((response) => {
            console.log(response);
            response.arrayBuffer().then((buffer) => {
                console.log(buffer);

                var callback = function (error, data, response) {
                    if (error) {
                        console.error(error);
                        //res.end('Error\n');
                    } else {
                        console.log('API called successfully.');

                        //res.writeHead(200, { 'Content-Type': 'image/png' });
                        //res.end(data, 'binary');

                        //res.end(data);
                    }
                };

                api.artisticPainting( 'rain_princess',
                    new Blob([buffer], {type : 'image/jpeg'}),
                    callback);

                //var base64Flag = 'data:image/jpeg;base64,';
                //var imageStr = arrayBufferToBase64(buffer);

                //document.querySelector('img').src = base64Flag + imageStr;
            });
        });


    })
}

document.addEventListener("DOMContentLoaded", function() {

    function init(){
        // Creating the map.
        var myMap = new ymaps.Map("map", {
            // The map center coordinates.
            // Default order: “latitude, longitude”.
            // To not manually determine the map center coordinates,
            // use the Coordinate detection tool.
            center: [55.76, 37.64],
            // Zoom level. Acceptable values:
            // from 0 (the entire world) to 19.
            zoom: 5
        });
        // Auxiliary class that can be used
// instead of GeoObject with the “Point” geometry type (see the previous example)
        var myGeocoder = ymaps.geocode("Tula");
        myGeocoder.then(
            function (res) {
                const coords = res.geoObjects.get(0).geometry.getCoordinates();
                var myPlacemark = new ymaps.Placemark(coords);
                myMap.geoObjects.add(myPlacemark);

            },
            function (err) {
                console.log(err);
            }
        );
    }
    ymaps.ready(init);
// $( document ).ready(function() {

//    $('#twitter-load').on('click', function() {

        // Initialize with your OAuth.io app public key
        OAuth.initialize(

            'OW0LZa8k62OqvvwA9z1ORS3Nwd4'
        );

        // Use popup for OAuth
        /**
         * @TODO read documentation OAUTH and try not to shop popup if the user is logged in
         */
        OAuth.popup('twitter', {cache:true}).then(twitter => {
            console.log('twitter:', twitter);
            // Prompts 'welcome' message with User's email on successful login
            // #me() is a convenient method to retrieve user data without requiring you
            // to know which OAuth provider url to call
            twitter.me().then(data => {

                // console.log('data:', data);

                twitter.get('1.1/users/lookup.json?screen_name='+data.alias).then(data=>{
                    var link = data[0].profile_image_url_https;
                    link = link.replace('_normal', '');
                    document.getElementById('photo').src = link;
                    console.log(link);

                })
                // twitter.get('1.1/users/lookup.json?user_id='+data.alias).then(data=>{
                //     console.log(data);
                // })
                //alert('Twitter says your email is:' + data.email + ".\nView browser 'Console Log' for more details");
            });
            // Retrieves user data from OAuth provider by using #get() and
            // OAuth provider url
            twitter.get('/1.1/account/verify_credentials.json?include_email=true').then(data => {
                console.log('self data:', data);

            })

            document.getElementById('load').addEventListener('click',function () {
                var userID = document.getElementById('userID').value;
                loadPhoto(userID, twitter);
            })
        });


    // });



});