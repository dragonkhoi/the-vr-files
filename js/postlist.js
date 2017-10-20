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

function selectIndustry(event){
  var industry = event.children[0].innerHTML;
  console.log(event.children[0].innerHTML);
  window.location.href = window.location.href.substring(0, window.location.href.indexOf('=') + 1) + industry;
}

function getIndustry(){
  var result = window.location.href.substring(window.location.href.indexOf('=') + 1);
  console.log(result);
  return result;
}

console.log(getIndustry());

var allPosts = firebase.database().ref('posts');
allPosts.once('value', function (snapshot) {
  snapshot.forEach(function(childSnapshot){
    console.log(childSnapshot.val().tags);
  });
});
