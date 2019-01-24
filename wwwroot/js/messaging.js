           // Give the service worker access to Firebase Messaging.
            // Note that you can only use Firebase Messaging here, other Firebase libraries
            // are not available in the service worker.

            // Initialize the Firebase app in the service worker by passing in the
            // messagingSenderId.
            //firebase.initializeApp({
            //    'messagingSenderId': '921294337398',
            //});

            // Retrieve an instance of Firebase Messaging so that it can handle background
            // messages.
            //const messaging = firebase.messaging();

            //messaging.onMessage(function (payload) {
            //    console.log('Message received. ', payload);
            //    // ...
            //});