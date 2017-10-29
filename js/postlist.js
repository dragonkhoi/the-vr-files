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

var allPostObjs = [];
var wholeQuery = getIndustry();
var currentIndustry = wholeQuery[0];
var searchQueryTerms = wholeQuery.slice(1, wholeQuery.length);
var postCount = 0;
console.log("whole query: " + wholeQuery);
console.log("current industry: " + currentIndustry);
console.log("just the search: " + searchQueryTerms);

function postObject(id, title, snippet, author, timestamp, tags){
  this.id = id;
  this.title = title;
  this.snippet = snippet;
  this.author = author;
  this.tags = tags;
  this.timestamp = timestamp;
  this.searchParse = this.title.toLowerCase() + " " + this.author.toLowerCase() + " " + this.tags.toLowerCase();
}

function selectIndustry(event){
  var industry = event.children[0].innerHTML.toLowerCase();
  console.log(event.children[0].innerHTML);
  setIndustryByName(industry);
}
function setIndustryByName(name) {
  window.location.href = window.location.href.substring(0, window.location.href.indexOf('=') + 1) + name;
}

function getIndustry(){
  var queryString = window.location.href.substring(window.location.href.indexOf('?') + 1);
  var queries = queryString.split("&");
  var searchTerms = [];
  for(var i = 0; i < queries.length; i++){

    console.log(queries[i]);
    var keyAndVal = queries[i].split("=");
    console.log(keyAndVal);

    // if(keyAndVal[1].toLowerCase() == "all"){
    //   keyAndVal[1] = "";
    // }
    // else{
    searchTerms.push(keyAndVal[1]);
  }
  console.log(searchTerms);

  return searchTerms;
}
var currentPostElement = null;
function createPostElement(postObj){
  postCount++;
  var postContainer = document.getElementById("post-container");
  var postPreview = document.createElement("div");
  postPreview.setAttribute("class", "post-preview");
  var postLink = document.createElement("a");
  postLink.href = "post.html?0=" + postObj.id;

  var postTitle = document.createElement("h2");
  postTitle.setAttribute("class", "post-title"); // = "post-title";
  postTitle.innerHTML = postObj.title;
  postLink.appendChild(postTitle);
  var postSnippet = document.createElement("h3");
  postSnippet.setAttribute("class", "post-subtitle");
  postSnippet.innerHTML = postObj.snippet;
  postLink.appendChild(postSnippet);
  var postAuthor = document.createElement("p");
  postAuthor.setAttribute("class", "post-meta");
  var authorLower = postObj.author.toLowerCase().replace(/\s+/g, '');;
  postAuthor.innerHTML = "Posted by <a href='about.html#" + authorLower + "'>" + postObj.author + "</a> on <span>" + postObj.timestamp + "</span>";

  postPreview.appendChild(postLink);
  postPreview.appendChild(postAuthor);
  var olderPostsBtn = document.getElementById("older-posts");
  var horizontal = document.createElement("hr");
  if(currentPostElement == null){
    currentPostElement = olderPostsBtn;
  }
  postContainer.insertBefore(postPreview, currentPostElement);
  postContainer.insertBefore(horizontal, currentPostElement);
  currentPostElement = postPreview;
}

window.onload = windowLoad;

function windowLoad () {
  document.getElementById("search-form").addEventListener('submit', handleForm);
  document.getElementById("industry-" + currentIndustry).style.backgroundColor = "rgba(20,20,20,0.8)";
}

function handleForm(event){
    event.preventDefault();
    console.log(window.location.href);
    var searchValue = document.getElementById("search-bar").value;
    var searchValArray = searchValue.split(" ");
    var parameters = "";
    for(var i = 0; i < searchValArray.length; i++){
      parameters += "&" + (i+1) + "=" + searchValArray[i];
    }
    console.log(parameters);
    console.log(currentIndustry);
    if(currentIndustry.length == 0){
      currentIndustry.push("all");
    }
    setIndustryByName(currentIndustry + parameters);
}


var allPosts = firebase.database().ref('posts').orderByChild("likes");

allPosts.once('value', function (snapshot) {
  snapshot.forEach(function(childSnapshot){
    var snapId = childSnapshot.key;
    var snapVal = childSnapshot.val();
    var snapTitle = snapVal.title;
    var snapSnip = snapVal.snippet;
    var snapAuthor = snapVal.author;
    var snapTimestamp = snapVal.timestamp;
    var snapTags = snapVal.tags;
    var snapPostObj = new postObject(snapId, snapTitle, snapSnip, snapAuthor, snapTimestamp, snapTags);
    var searchString = snapTags + " " + snapTitle + " " + snapAuthor + " " + snapSnip;
    // TODO: consider body text when searching?
    if(currentIndustry.length == 0){
      // "all" posts should be shown;
      createPostElement(snapPostObj);
    }

    if(searchString.indexOf(currentIndustry) > -1 || currentIndustry === "all"){
      // Check that the post is within the industry
      if(searchQueryTerms.length == 0){
        // "all" posts should be shown;
        createPostElement(snapPostObj);
      }
      for(var i = 0; i < searchQueryTerms.length; i++){
        if(searchString.indexOf(searchQueryTerms[i]) > -1){
          createPostElement(snapPostObj);
          break;
        }
      }
    }
  });
}).then(function() {
  console.log("all nodes processed " + postCount);
  if(postCount === 0){
    var noneFound = document.createElement("div");
    var noneFoundText = document.createElement("h2");
    noneFoundText.innerHTML = "No results found in <i>" + currentIndustry +
    "</i> for: <i>" + searchQueryTerms.join(" ") + "</i>";
    noneFound.appendChild(noneFoundText);
    var postContainer = document.getElementById("post-container");
    var olderPostsBtn = document.getElementById("older-posts");
    postContainer.insertBefore(noneFound, olderPostsBtn);
  }
});
