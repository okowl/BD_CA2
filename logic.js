function loadPhoto(userID, twitter) {

    twitter.get('1.1/users/lookup.json?screen_name='+userID).then(data=>{
        var link = data[0].profile_image_url;
        link = link.replace('_normal', '');
        document.getElementById('photo').src = link;
        console.log(link);

    })
}

document.addEventListener("DOMContentLoaded", function() {
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
                    var link = data[0].profile_image_url;
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