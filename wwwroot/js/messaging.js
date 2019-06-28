//**********************Register with firebase push messaging*******************************

var MESSAGE = (function (_data, _config) {
    var config = {
        apiKey: "AIzaSyCAicf3USbiI1Y4wkhMibWa87IKjLJ8_eE",
        authDomain: "epivotecontrol.firebaseapp.com",
        databaseURL: "https://epivotecontrol.firebaseio.com",
        projectId: "epivotecontrol",
        storageBucket: "epivotecontrol.appspot.com",
        messagingSenderId: "740789521324"
    };

    function initFirebase() {
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
                //let el = document.querySelector('.number-of-votes');
                //let od = new Odometer({
                //    el: el
                //})
                //od.update(payload.data.numberOfVotes);
            }

            if (payload.data.messageType === 'joined' || payload.data.messageType === 'left') {
                //$('.active-members').html(payload.data.activeMembers);
            }

            console.log("FBC message received. ", payload);
        });
    }

    function initSignalR() {

        var connection = new signalR.HubConnectionBuilder().withUrl("https://api.epivote.uk/notify").build();
        connection.on("BroadcastMessage", function (message) {
            console.log(message);

            if (message.getControlPanelMessageData) {
                if (message.getControlPanelMessageData.messageType === 'joined' || message.getControlPanelMessageData.messageType === 'left') {
                    $('.active-members').html(message.getControlPanelMessageData.activeMembers);
                }

                if (message.getControlPanelMessageData.messageType === 'vote') {

                    let el = document.querySelector('.number-of-votes');
                    let od = new Odometer({
                        el: el
                    });
                    od.update(message.getControlPanelMessageData.numberOfVotes);
                }
            }

        });

        connection.start({}).then(function () {
            console.log('SignalR started');
        }).catch(function (err) {
            return console.error(err.toString());
        });
    }

    return {
        initFirebase: initFirebase,
        initSignalR: initSignalR
    };

})(DATA_API, CONFIG);
