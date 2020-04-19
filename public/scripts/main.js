'use strict';

// Signs-in Friendly Chat.
function signIn() {
 
 	var provider = new firebase.auth.GoogleAuthProvider();
  	firebase.auth().signInWithPopup(provider);

}

function signOut() {
  // Sign out of Firebase.
  firebase.auth().signOut();
}

// Initiate Firebase Auth.
function initFirebaseAuth() {
  // Listen to auth state changes.
  firebase.auth().onAuthStateChanged(authStateObserver);
}

// Returns the signed-in user's profile pic URL.
function getProfilePicUrl() {
  return firebase.auth().currentUser.photoURL || '/images/profile_placeholder.png';
}

// Returns the signed-in user's display name.
function getUserName() {
  return firebase.auth().currentUser.displayName;
}

// Returns true if a user is signed-in.
function isUserSignedIn() {
  return !!firebase.auth().currentUser;
}

// Triggers when the auth state change for instance when the user signs-in or signs-out.
function authStateObserver(user) {
  if (user) { // User is signed in!
    // Get the signed-in user's profile pic and name.
    var profilePicUrl = getProfilePicUrl();
    var userName = getUserName();

    // Set the user's profile pic and name.
    userPicElement.style.backgroundImage = 'url(' + addSizeToGoogleProfilePic(profilePicUrl) + ')';
    userNameElement.textContent = userName;

    // Show user's profile and sign-out button.
    userNameElement.removeAttribute('hidden');
    userPicElement.removeAttribute('hidden');
    signOutButtonElement.removeAttribute('hidden');

    //display the recipe upload form
    addRecipeForm.removeAttribute('hidden');

    // Hide sign-in button.
    signInButtonElement.setAttribute('hidden', 'true');

    // We save the Firebase Messaging Device token and enable notifications.
    // saveMessagingDeviceToken();
  } else { // User is signed out!
    // Hide user's profile and sign-out button.
    userNameElement.setAttribute('hidden', 'true');
    userPicElement.setAttribute('hidden', 'true');
    signOutButtonElement.setAttribute('hidden', 'true');

    // Show sign-in button.
    signInButtonElement.removeAttribute('hidden');
  }
}


// Adds a size to Google Profile pics URLs.
function addSizeToGoogleProfilePic(url) {
  if (url.indexOf('googleusercontent.com') !== -1 && url.indexOf('?') === -1) {
    return url + '?sz=150';
  }
  return url;
}

function addARecipe(event)
{
	console.log(event)
	event.preventDefault();
	  var file = event.target.mediaCapture.files[0];


	  var title = document.forms["image-form"]["title"].value;
	  var desc = document.forms["image-form"]["desc"].value;

	  // Clear the selection in the file picker input.
	  imageFormElement.reset();

	  // Check if the file is an image.
	  if (!file.type.match('image.*')) {
	    var data = {
	      message: 'You can only share images',
	      timeout: 2000
	    };
	    signInSnackbarElement.MaterialSnackbar.showSnackbar(data);
	    return;
	  }

	submitInformation(title,desc,file);
}

function submitInformation(title,desc,file)
{

	firebase.firestore().collection('Recipes').add({
	    title:title,
	    shortDesc:desc,
	    desc:desc,
	    timestamp: firebase.firestore.FieldValue.serverTimestamp()
	  }).then(function(messageRef){

	  	console.log("Uploading image");

	    var filePath=firebase.auth().currentUser.uid+'/'+messageRef.id+'/'+file.name;
	    return firebase.storage().ref(filePath).put(file).then(function(fileSnapshot){

	    	console.log("Uploaded")
	      return fileSnapshot.ref.getDownloadURL().then((url)=>{
	      	console.log("Get download url")
	        return messageRef.update({
	          imageUrl:url,
	          storageUri: fileSnapshot.metadata.fullPath
	        })
	      })
	    }).catch(function(error) {
	    console.error('There was an error uploading a file to Cloud Storage:', error);
 	});
	  }).catch(function(error) {
	    console.error('There was an error uploading a file to Cloud Storage:', error);
 	});

}

// Shortcuts to DOM Elements.
var messageListElement = document.getElementById('messages');
var messageFormElement = document.getElementById('message-form');
var messageInputElement = document.getElementById('message');
var submitButtonElement = document.getElementById('submit');
var imageButtonElement = document.getElementById('submitImage');
var imageFormElement = document.getElementById('image-form');
var mediaCaptureElement = document.getElementById('mediaCapture');
var userPicElement = document.getElementById('user-pic');
var userNameElement = document.getElementById('user-name');
var signInButtonElement = document.getElementById('sign-in');
var signOutButtonElement = document.getElementById('sign-out');
var signInSnackbarElement = document.getElementById('must-signin-snackbar');
var addRecipeForm = document.getElementById("add_recipe_form");
var recipeListElement=document.getElementById("recipes");

signOutButtonElement.addEventListener('click', signOut);
signInButtonElement.addEventListener('click', signIn);


imageFormElement.addEventListener('submit',event=>{
	addARecipe(event);
})


 document.addEventListener('DOMContentLoaded', function() {
        // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
        // // The Firebase SDK is initialized and available here!
        //
        // firebase.auth().onAuthStateChanged(user => { });
        // firebase.database().ref('/path/to/ref').on('value', snapshot => { });
        // firebase.messaging().requestPermission().then(() => { });
        // firebase.storage().ref('/path/to/ref').getDownloadURL().then(() => { });
        //
        // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥

        try {
			// initialize Firebase
			initFirebaseAuth();


        } catch (e) {
          console.error(e);
          document.getElementById('load').innerHTML = 'Error loading the Firebase SDK, check the console.';
        }
});