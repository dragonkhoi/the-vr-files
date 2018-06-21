// Initialize Firebase
var config = {
  apiKey: API_KEY,
  authDomain: "the-vr-files.firebaseapp.com",
  databaseURL: "https://the-vr-files.firebaseio.com",
  projectId: "the-vr-files",
  storageBucket: "the-vr-files.appspot.com",
  messagingSenderId: "1029459384683"
};
firebase.initializeApp(config);

var topPosts = firebase.database().ref('posts').orderByChild('likes').limitToLast(4);
topPosts.once('value', function (snapshot) {
  var count = 1;
  snapshot.forEach(function(childSnapshot){
    var childVal = childSnapshot.val();
    var postTitle = childVal.title;
    var postAuthor = childVal.author;
    var postSnippet = childVal.snippet;
    var postTimestamp = childVal.timestamp;
    var postId = childSnapshot.key;
    var htmlID = 5 - count;
    document.getElementById("post-title-" + htmlID).innerHTML = postTitle;
    document.getElementById("post-subtitle-" + htmlID).innerHTML = postSnippet;
    document.getElementById("post-author-" + htmlID).innerHTML = postAuthor;
    document.getElementById("post-link-" + htmlID).href += postId;
    var authorFull = postAuthor.toLowerCase().replace(/\s+/g, '');
    document.getElementById("post-author-" + htmlID).href = document.getElementById("post-author-" + count).href + "#" + authorFull;
    document.getElementById("post-timestamp-" + htmlID).innerHTML = postTimestamp;
    count++;
  });
});

initApp = function() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      var displayName = user.displayName;
      var email = user.email;
      var emailVerified = user.emailVerified;
      var photoURL = user.photoURL;
      var uid = user.uid;
      var phoneNumber = user.phoneNumber;
      var providerData = user.providerData;
      user.getIdToken().then(function(accessToken) {
        document.getElementById('login-button').textContent = 'Portal';
      });
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
