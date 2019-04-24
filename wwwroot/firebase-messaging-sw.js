importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
    'messagingSenderId': '740789521324'
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(payload => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = payload.data.title;
    var notificationOptions;

    if (payload.data.messageType === 'vote') {
        notificationOptions = {
            body: 'Votes cast: ' + payload.data.numberOfVotes,
            icon: '/images/icon.png'
        };
    }

    if (payload.data.messageType === 'joined' || payload.data.messageType === 'left' ) {
        notificationOptions = {
            body: payload.data.body,
            icon: '/images/icon.png'
        };
    }


    return self.registration.showNotification(notificationTitle,
        notificationOptions);
});



