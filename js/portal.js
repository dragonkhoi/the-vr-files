var config = {
  apiKey: API_KEY,
  authDomain: "the-vr-files.firebaseapp.com",
  databaseURL: "https://the-vr-files.firebaseio.com",
  projectId: "the-vr-files",
  storageBucket: "the-vr-files.appspot.com",
  messagingSenderId: "1029459384683"
};
firebase.initializeApp(config);

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
      document.getElementById("your-uploads-button").click();
      populateTabList("your-uploads");
      populateTabList("starred-posts");
      populateTabList("liked-posts");

    } else {
      // User is signed out.
      window.location = "login.html";
    }
  }, function(error) {
    console.log(error);
  });
};

window.addEventListener('load', function() {
  initApp()
});

function postObject(id, title, snippet, author, timestamp, tags){
  this.id = id;
  this.title = title;
  this.snippet = snippet;
  this.author = author;
  this.tags = tags;
  this.timestamp = timestamp;
  this.searchParse = this.title.toLowerCase() + " " + this.author.toLowerCase() + " " + this.tags.toLowerCase();
}

function populateTabList(tab){
  var userId = firebase.auth().currentUser.uid;
  var allPosts;
  if(tab == "your-uploads"){
    allPosts = firebase.database().ref('users').child(userId).child(POST_KEY_REF);
  }
  else if(tab == "starred-posts"){
    allPosts = firebase.database().ref('users').child(userId).child(STARRED_KEY_REF);
  }
  else if(tab == "liked-posts"){
    allPosts = firebase.database().ref('users').child(userId).child(LIKED_KEY_REF);
  }
  var postKeys = [];
  var postCount = 0;
  allPosts.once('value', function (snapshot) {
    snapshot.forEach(function(childSnapshot){
      postKeys.push(childSnapshot.val().postKey);
      postCount++;
    });
  }).then(function() {
    console.log("all nodes processed " + postCount);
    if(postCount === 0){
      console.log("No posts found for this user");
      var noneFound = document.createElement("div");
      var noneFoundText = document.createElement("p");
      if(tab == "your-uploads"){
        noneFoundText.innerHTML = "You haven't uploaded any files yet! Click 'CREATE POST' in the top right to begin.";
      }
      else if(tab == "starred-posts"){
        noneFoundText.innerHTML = "You haven't starred any posts yet. Go star some posts and they'll appear here. [not implemented yet]";
      }
      else if(tab == "liked-posts"){
        noneFoundText.innerHTML = "You haven't liked any posts yet. Go like some posts and they'll appear here.";
      }
      // "</i> for: <i>" + searchQueryTerms.join(" ") + "</i>";
      noneFound.appendChild(noneFoundText);
      var postContainer = document.getElementById(tab + "-post-container");
      var olderPostsBtn = document.getElementById(tab + "-bottom");
      postContainer.insertBefore(noneFound, olderPostsBtn);
    }
    else {
      for(var i = 0; i < postKeys.length; i++){
        console.log(postKeys[i]);
        firebase.database().ref("posts").child(postKeys[i]).once('value', function(snapshot){
          var snapId = snapshot.key;
          var snapVal = snapshot.val();
          var snapTitle = snapVal.title;
          var snapSnip = snapVal.snippet;
          var snapAuthor = snapVal.author;
          var snapTimestamp = snapVal.timestamp;
          var snapTags = snapVal.tags;
          var snapPostObj = new postObject(snapId, snapTitle, snapSnip, snapAuthor, snapTimestamp, snapTags);
          var searchString = snapTags + " " + snapTitle + " " + snapAuthor + " " + snapSnip;
            // "all" posts should be shown;
          createPostElement(snapPostObj, tab);

        })
      }
    }
  });
}

var currentPostElement = null;
function createPostElement(postObj, tab){
  var postContainer = document.getElementById(tab + "-post-container");
  var postPreview = document.createElement("div");
  postPreview.setAttribute("class", "post-preview");
  var postLink = document.createElement("a");
  if(tab == "your-uploads"){
    postLink.href = "post-edit.html?0=" + postObj.id;

  }
  else {
    postLink.href = "post.html?0=" + postObj.id;

  }
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
  var olderPostsBtn = document.getElementById(tab + "-bottom");
  var horizontal = document.createElement("hr");
  if(currentPostElement == null){
    currentPostElement = olderPostsBtn;
  }
  postContainer.insertBefore(postPreview, currentPostElement);
  postContainer.insertBefore(horizontal, currentPostElement);
  currentPostElement = postPreview;
}

function openPostList(evt, postType) {
  var i, tabcontent, tablinks;

  tabcontent = document.getElementsByClassName("tabcontent");
  for(i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  tablinks = document.getElementsByClassName("tablink");
  for(i = 0; i < tablinks.length; i++){
    tablinks[i].className = tablinks[i].className.replace("active", "");
  }

  document.getElementById(postType).style.display = "block";
  evt.currentTarget.className += " active";
}

function createNewPost() {
  window.location = "post-edit.html?0=new";
}
