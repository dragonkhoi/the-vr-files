// Initialize Firebase
var config = {
  apiKey: "AIzaSyAyeEj9FK-ISf3ZdpFL5FZBT3utVuMZR3k",
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
    document.getElementById("post-title-" + count).innerHTML = postTitle;
    document.getElementById("post-subtitle-" + count).innerHTML = postSnippet;
    document.getElementById("post-author-" + count).innerHTML = postAuthor;
    document.getElementById("post-link-" + count).href += postId;
    var authorFull = postAuthor.toLowerCase().replace(/\s+/g, '');
    document.getElementById("post-author-" + count).href = document.getElementById("post-author-" + count).href + "#" + authorFull;
    document.getElementById("post-timestamp-" + count).innerHTML = postTimestamp;
    count++;
  });
});
