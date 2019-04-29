//**********************Register with firebase push messaging*******************************

var FCM = (function (_data, _config) {
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
        navigator.serviceWorker.register(_config.urls.base + '/firebase-messaging-sw.js')
            .then((registration) => {
                messaging.useServiceWorker(registration);

                messaging.requestPermission()
                    .then(() => {
                        console.log("Notification permission granted.");
                        // get the token in the form of promise
                        return messaging.getToken();
                    })
                    .then(token => {
                        console.log("FCM token is : " + token);
                        _data.sendTokenToServer(token);
                    });
            }).catch(err => {
                console.log(err);
            });

        messaging.onMessage(payload => {
            if (payload.data.messageType === 'vote') {
               // $('.number-of-votes').html(payload.data.numberOfVotes);
                let el = document.querySelector('.number-of-votes');
                let od = new Odometer({
                    el: el
                })
                od.update(payload.data.numberOfVotes);
            }

            if (payload.data.messageType === 'joined' || payload.data.messageType === 'left') {
                $('.active-members').html(payload.data.activeMembers);
            }

            console.log("Message received. ", payload);
        });
    }

    return {
        init: init
    };

})(DATA_API, CONFIG);
