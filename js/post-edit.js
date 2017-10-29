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

window.onload = onLoad();

var inputTitle, inputAuthor, inputSnippet;
var inputBody, inputCitation, inputTags, inputLink, inputPDF;
var submitButton;
var postId;
function onLoad(){
  inputTitle = document.getElementById("input-title");
  inputAuthor = document.getElementById("input-author");
  inputSnippet = document.getElementById("input-snippet");
  inputBody = document.getElementById("input-body");
  inputCitation = document.getElementById("input-citation");
  inputTags = document.getElementById("input-tags");
  inputLink = document.getElementById("input-link");
  inputPDF = document.getElementById("input-pdf");
  var thisUrl = window.location.href;
  var idQ = thisUrl.indexOf('?');
  var idStartAt = idQ + 3;
  postId = thisUrl.substring(idStartAt);
  console.log(postId);
  if(postId != "new"){
    pullData();
  }
}
var pdfUpload = document.getElementById("input-pdf");
pdfUpload.onchange = function(evt) {
  var firstFile = evt.target.files[0];
  var uploadConfirm = confirm("Upload: " + firstFile.name + "?");
  if(uploadConfirm){
    var storageRef = firebase.storage().ref("pdfs/" + firstFile.name);
    var uploadTask = storageRef.put(firstFile);
    uploadTask.on('state_changed', function(snapshot){
      var percentUpload = document.getElementById("percentUpload");
      percentUpload.innerHTML = "Uploading...";
    }, function(error){
      alert("An error occurred: " + error);
    }, function() {
      //alert("Successfully uploaded");
      var percentUpload = document.getElementById("percentUpload");
      percentUpload.innerHTML = "pdfs/" + storageRef.name;
    });
  }
};
function getMonth(num){
  if(num == 0){
    return "January";
  }
  else if(num == 1){
    return "February";
  }
  else if(num == 2){
    return "March";
  }
  else if(num == 3){
    return "April";
  }
  else if(num == 4){
    return "May";
  }
  else if(num == 5){
    return "June";
  }
  else if(num == 6){
    return "July";
  }
  else if(num == 7){
    return "August";
  }
  else if(num == 8){
    return "September";
  }
  else if(num == 9){
    return "October";
  }
  else if(num == 10){
    return "November";
  }
  else{
    return "December";
  }
}
function pushData(){
  var newPost = firebase.database().ref('posts').push();
  var title = inputTitle.value;
  var author = inputAuthor.value;
  var snippet = inputSnippet.value;
  var body = inputBody.value;
  var citation = inputCitation.value;
  var tags = inputTags.value;
  var link = inputLink.value;
  var percentUpload = document.getElementById("percentUpload");
  var pdf = percentUpload.innerHTML;
  var d = new Date();
  var timedate = d.getDate();
  var timemonth = d.getMonth();
  var timeyear = d.getFullYear();
  var monthName = getMonth(timemonth);
  var timestamp = monthName + " " + timedate + ", " + timeyear;
  newPost.set({
    'title': title,
    'author': author,
    'snippet': snippet,
    'body': body,
    'citation': citation,
    'tags': tags,
    'link': link,
    'pdf': pdf,
    'timestamp': timestamp,
    'likes': 0
  });
  var key = newPost.getKey();
  console.log("pushing to: " + key);
  return false;
}
function pullData(){
  console.log("pulling data from: " + postId);
}
