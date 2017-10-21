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

var thisUrl = window.location.href;
var idQ = thisUrl.indexOf('?');
var idStartAt = idQ + 3;
var postName = thisUrl.substring(idStartAt);
var likedAlready = false;
console.log(postName);

var postRef = firebase.database().ref().child("posts");
var author, body, citation, link, likes, pdf, snippet, tags, timestamp, title;
postRef.child(postName).once('value').then(function(snapshot){
  var val = snapshot.val();
  author = val.author;
  body = val.body;
  citation = val.citation;
  link = val.link;
  likes = val.likes;
  pdf = val.pdf;
  snippet = val.snippet;
  tags = val.tags;
  timestamp = val.timestamp;
  title = val.title;
  updatePage();
});

function increaseLikes(){
  if(likedAlready){
    return;
  }
  likes++;
  likedAlready = true;
  var num = likes;
  postRef.child(postName).update({likes: num});
  document.getElementById("postLikes").innerHTML = "" + likes;
}

function updatePage(){
  document.getElementById("postTitle").innerHTML = title;
  document.getElementById("postSnippet").innerHTML = snippet;
  document.getElementById("postAuthor").innerHTML = author;
  var authorFull = author.toLowerCase().replace(/\s+/g, '');
  document.getElementById("postAuthor").href = document.getElementById("postAuthor").href + "#" + authorFull;
  document.getElementById("postTimestamp").innerHTML = timestamp;
  document.getElementById("postBody").innerHTML = body;
  document.getElementById("postCitation").innerHTML = citation;
  document.getElementById("postPDF").href = pdf;
  document.getElementById("postLink").href = link;
  document.getElementById("postLikes").innerHTML = "" + likes;
  document.head.title = title;
}
