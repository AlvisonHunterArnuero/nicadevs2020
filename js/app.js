let app = angular.module("myApp", ["ngAnimate"]);

app.controller("customersCtrl", function ($scope) {
  // boolean objects
  $scope.isAdmin = false;
  $scope.isLoginError = false;
  $scope.isLogged = false;
  $scope.msg = "";
  $scope.loginMsg = "";
  $scope.userName = "";
  $scope.userPwd = "";
  $scope.editModeOn = false;
  $scope.newModeOn = true;
  $scope.currentEditedItem = null;
  $scope.modalTitle = "";
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
    let req = new XMLHttpRequest();
    let isRequestTypeGet = argsRequestType;
    let arr2JSON = JSON.stringify(argsPayload);
    // If the user is requesting data, we GET it, otherwise we send it with PUT
    if (isRequestTypeGet == true) {
      req.onreadystatechange = () => {
        if (req.readyState == XMLHttpRequest.DONE) {
          $scope.names = JSON.parse(req.responseText);
        }
      };
      req.open(
        "GET",
        "https://api.jsonbin.io/b/5ec28b342bb52645e5531883",
        true
      );
      req.setRequestHeader(
        "secret-key",
        "$2b$10$4qmVP5JEguFHY9kiP5GkVuoHaZjhwClK3e7EwNxKm40AiMj.F5rHu"
      );
      return req.send();
    } else {
      req.onreadystatechange = () => {
        if (req.readyState == XMLHttpRequest.DONE) {
          console.log(req.responseText);
        }
      };
      req.open(
        "PUT",
        "https://api.jsonbin.io/b/5ec28b342bb52645e5531883",
        true
      );
      req.setRequestHeader("Content-Type", "application/json");
      req.setRequestHeader("versioning", "false");
      req.setRequestHeader(
        "secret-key",
        "$2b$10$4qmVP5JEguFHY9kiP5GkVuoHaZjhwClK3e7EwNxKm40AiMj.F5rHu"
      );
      return req.send(arr2JSON);
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
    return ($scope.modalTitle = `Add New Profile`);
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

  // ------------------ WATCHERS OR GUARDIANS TO OBSERVE --------------------
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
