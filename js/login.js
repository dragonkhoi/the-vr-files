var config = {
  apiKey: API_KEY,
  authDomain: "the-vr-files.firebaseapp.com",
  databaseURL: "https://the-vr-files.firebaseio.com",
  projectId: "the-vr-files",
  storageBucket: "the-vr-files.appspot.com",
  messagingSenderId: "1029459384683"
};
firebase.initializeApp(config);

var uiConfig = {
  signInSuccessUrl: 'creator-portal.html',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID
  ],
  tosUrl: 'terms-of-service.html'
};

var ui = new firebaseui.auth.AuthUI(firebase.auth());
ui.start('#firebaseui-auth-container', uiConfig);

initApp = function() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      window.location = "creator-portal.html";
    } else {
      // User is signed out.

    }
  }, function(error) {
    console.log(error);
  });
};

window.addEventListener('load', function() {
  initApp()
});
