let app = angular.module("myApp", []);

app.controller("customersCtrl", function ($scope) {
  // boolean objects and other variables
  $scope.isAdmin = false;
  $scope.isLoginError = false;
  $scope.isLogged = false;
  $scope.editModeOn = false;
  $scope.newModeOn = true;
  $scope.msg = "";
  $scope.loginMsg = "";
  $scope.userName = "";
  $scope.userPwd = "";
  $scope.currentEditedItem = null;
  $scope.modalTitle = "";
  $scope.currentUserPhoto = "noPhoto";
  // My arrays for interaction with the server payload
  $scope.arr2JSON = [];
  // Payload init values
  $scope.payload = {
    name: "",
    title: "",
    language: "",
    framework: "",
    library: "",
    workplace: "",
    learning: "",
    twitter: "",
    linkedIn: "",
    photoURL: "",
  };

  $scope.fnPlayAudio = function () {
    console.log("audio here");
    var audio = document.getElementById("audioTag");
    audio.play();
  };

  // -------------------- CLEAR INFORMATIVE MSG FUNCTION ----------------------
  $scope.fnClearInformationMsg = function (argsMsgText) {
    $scope.msg = argsMsgText;
    return setTimeout(() => {
      $scope.msg = "";
    }, 3000);
  };

  // -------------------- CLEAR FUNCTION ----------------------------------
  // Let us build a function to clear the payload object and
  // prepare it for new data on each of the CRUD functions.
  $scope.fnClearPayload = function () {
    $scope.modalTitle = "";
    return ($scope.payload = {
      name: "",
      title: "",
      language: "",
      framework: "",
      library: "",
      workplace: "",
      learning: "",
      twitter: "",
      linkedIn: "",
      photoURL: "",
    });
  };
  // -------------------- API CALLS ---------------------------------------
  // Prepare communication with the API Endpoint
  $scope.callmyXMLHttpRequest = function (argsRequestType, argsPayload) {
    // I used this constructor to initialize an XMLHttpRequest.
    const xhr = new XMLHttpRequest();
    // Parameter to indicate if this is a GET or a PUT method
    let isRequestTypeGet = argsRequestType;
    // The array that I will use locally to work with the data
    let arr2JSON = JSON.stringify(argsPayload);
    // All set, now is time to put this data in our local Scope
    xhr.onreadystatechange = () => {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        let status = xhr.status;
        if (status === 0 || (status >= 200 && status < 400)) {
          console.log("The request has been completed successfully");
          $scope.names = JSON.parse(xhr.responseText);
        } else {
          alert("Oh no! There has been an error with the request!");
        }
      }
    };

    // If the user is requesting data, we GET it, otherwise we send it with PUT
    if (isRequestTypeGet == true) {
      xhr.open(
        "GET",
        "https://api.jsonbin.io/b/5ec28b342bb52645e5531883",
        true
      );
      xhr.setRequestHeader(
        "secret-key",
        "$2b$10$4qmVP5JEguFHY9kiP5GkVuoHaZjhwClK3e7EwNxKm40AiMj.F5rHu"
      );
      return xhr.send();
    } else {
      // xhr.onreadystatechange = () => {
      //   if (xhr.readyState == XMLHttpRequest.DONE) {
      //     console.log(xhr.responseText);
      //   }
      // };
      xhr.open(
        "PUT",
        "https://api.jsonbin.io/b/5ec28b342bb52645e5531883",
        true
      );
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.setRequestHeader("versioning", "false");
      xhr.setRequestHeader(
        "secret-key",
        "$2b$10$4qmVP5JEguFHY9kiP5GkVuoHaZjhwClK3e7EwNxKm40AiMj.F5rHu"
      );
      return xhr.send(arr2JSON);
    }
  };

  // ------------------ INITIAL DATA FETCHING -----------------------------
  // Get the initial data from our server
  $scope.fnGetDevelopers = function () {
    // First, let's see who is connected to our app at this moment
    $scope.currentUser = $scope.userName;
    $scope.callmyXMLHttpRequest(true, null);
  };
  // ------------------ ADD NEW PROFILE -----------------------------------
  $scope.fnAddDeveloper = function () {
    $scope.editModeOn = false;
    $scope.newModeOn = true;
    $scope.fnClearPayload();
    $scope.modalTitle = "Add New Profile";
    return $scope.modalTitle;
  };
  // ------------------- SAVE NEW PROFILE --------------------------------
  // The save payload function starts here
  $scope.fnSaveDeveloper = function () {
    $scope.names.push($scope.payload);
    $scope.callmyXMLHttpRequest(false, $scope.names);
    $scope.fnClearPayload();
    return $scope.fnClearInformationMsg(
      "The user has been successfully registered."
    );
  };
  // ------------------- EDIT NEW PROFILE --------------------------------
  $scope.fnEditDeveloper = function (developer, index) {
    $scope.editModeOn = true;
    $scope.newModeOn = false;
    $scope.currentEditedItem = index;
    angular.copy(developer, $scope.payload);
    return ($scope.modalTitle = `Edit Profile for ${developer.name}`);
  };
  // ------------------- SAVE NEW PROFILE EDIT  -------------------------
  $scope.fnUpdateDeveloper = function () {
    $scope.editModeOn = false;
    $scope.newModeOn = true;
    $scope.names.push($scope.payload);
    $scope.names.splice($scope.currentEditedItem, 1);
    $scope.callmyXMLHttpRequest(false, $scope.names);
    $scope.fnClearPayload();
    return $scope.fnClearInformationMsg(
      "The user has been successfully updated."
    );
  };
  // ------------------- DELETE A MEMBER --------------------------------
  // The delete profile function starts here
  $scope.fnDeleteDeveloper = function (index) {
    // let's prompt the user if he or she wants to delete this card
    bootbox.confirm("Do you really want to delete this Profile?", function (
      result
    ) {
      // if the user clicks on yes, we will delete this element
      if (result === true) {
        $scope.names.splice(index, 1);
      }
      $scope.callmyXMLHttpRequest(false, $scope.names);
      $scope.fnClearPayload();
      return $scope.fnClearInformationMsg(
        "The user has been successfully deleted."
      );
    });
  };
  // LOGON DETAILS

  $scope.fnLogon = function () {
    $scope.isLoginError = false;
    // let's validate if the array has been fetched from the API already
    const tempArray = $scope.names ? $scope.names : null;
    // using a local scope array to iterate with it just in this function
    let tempUserName = $scope.userName;
    let tempUserPwd = $scope.userPwd;
    const devNames = tempArray.filter(
      (dev) => dev.username == tempUserName && dev.password == tempUserPwd
    );
    // If the Login Username and password exists, then we can enable the content
    if (Array.isArray(devNames) != "undefined" && devNames.length != 0) {
      $scope.isLogged = true;
      console.log("DEVNAMES: ", devNames);
      $scope.currentUserPhoto = devNames[0].photoURL;
      // Let us evaluate if this user is an admin and can access the admin rights
      devNames[0].role == "admin"
        ? ($scope.isAdmin = true)
        : ($scope.isAdmin = false);
      console.log("USER ROLES: ", devNames[0].role);
      $scope.fnClearInformationMsg("The user has successfully logged in.");
    } else {
      $scope.isLogged = false;
      $scope.isLoginError = true;
      $scope.loginMsg = "Login failed: Invalid username or password.";
      return; // to leave the function
    }
    return $scope.isLogged;
  };

  // ------------------ INITIAL DATA FETCHING FUNCTION --------------------
  // Let's initialize the function to bring all these people in
  $scope.fnGetDevelopers();

  // ------------------ MY APP WATCHERS OR GUARDIANS --------------------
  // Watcher over here, to check correct password
  $scope.$watch("userPwd", function (newval, oldval) {
    newval != oldval
      ? ($scope.isLoginError = false)
      : ($scope.isLoginError = true);
    // Let us clean up the msg text since we are revalidating the
    // username and password one more time
    $scope.loginMsg = "";
  });

  $scope.$watch("userName", function (newval, oldval) {
    // The watcher will tell us if a change has come to pass
    // by giving us the oldval and the newval to make the
    // comparison, this feature is amazing on AngularJS
    newval != oldval
      ? ($scope.isLoginError = false)
      : ($scope.isLoginError = true);
    // Let us clean up the msg text since we are revalidating the
    // username and password one more time
    $scope.loginMsg = "";
  });
});
