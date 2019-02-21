//**********************Register with firebase push messaging*******************************

var FCM = (function (data_api) {
    var config = {
        apiKey: "AIzaSyCAicf3USbiI1Y4wkhMibWa87IKjLJ8_eE",
        authDomain: "epivotecontrol.firebaseapp.com",
        databaseURL: "https://epivotecontrol.firebaseio.com",
        projectId: "epivotecontrol",
        storageBucket: "epivotecontrol.appspot.com",
        messagingSenderId: "740789521324"
    };

    function init() {
        firebase.initializeApp(config);

        const messaging = firebase.messaging();
        messaging
            .requestPermission()
            .then(() => {
                console.log("Notification permission granted.");
                // get the token in the form of promise
                return messaging.getToken();

            })
            .then(token => {
                console.log("FCM token is : " + token);
                data_api.sendTokenToServer(token);
            })
            .catch(err => {
                console.log(err);
            });

        messaging.onMessage(payload => {
            $('.vote-count').html('Votes cast: ' + payload.data.votes);
            console.log("Message received. ", payload);
        });
    }

    return {
        init : init
    }

}) (DATA_API);
