let app = angular.module("myApp", []);
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

  // -------------------- CLEAR FUNCTION ----------------------------------
  // Let us build a function to clear the payload object and
  // prepare it for new data on each of the CRUD functions.
  $scope.fnClearPayload = function () {
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
    console.log("Init Function Current User: ", $scope.currentUser);
    $scope.callmyXMLHttpRequest(true, null);
  };
  // ------------------ ADD NEW PROFILE -----------------------------------
  $scope.fnAddDeveloper = function (developer) {
    $scope.editModeOn = false;
    $scope.newModeOn = true;
    $scope.fnClearPayload();
    return developer;
  };
  // ------------------- SAVE NEW PROFILE --------------------------------
  // The save payload function starts here
  $scope.fnSaveDeveloper = function () {
    $scope.names.push($scope.payload);
    $scope.callmyXMLHttpRequest(false, $scope.names);
    $scope.fnClearPayload();
    return ($scope.msg = "The user has been successfully registered.");
  };
  // ------------------- EDIT NEW PROFILE --------------------------------
  $scope.fnEditDeveloper = function (developer, index) {
    $scope.editModeOn = true;
    $scope.newModeOn = false;
    $scope.currentEditedItem = index;
    angular.copy(developer, $scope.payload);
    return $scope.payload;
  };
  // ------------------- SAVE NEW PROFILE EDIT  -------------------------
  $scope.fnUpdateDeveloper = function () {
    $scope.editModeOn = false;
    $scope.newModeOn = true;
    $scope.names.push($scope.payload);
    $scope.names.splice($scope.currentEditedItem, 1);
    $scope.callmyXMLHttpRequest(false, $scope.names);
    $scope.fnClearPayload();
    return ($scope.msg = "The user has been successfully updated.");
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
      return ($scope.msg = "The user has been successfully deleted.");
    });
  };
  // LOGON DETAILS

  $scope.fnLogon = function () {
    $scope.isLoginError = false;
    // let's validate if the array has been fetched from the API already
    const tempArray = $scope.names ? $scope.names : null;
    // using a local scope array to iterate with it just in this function
    let tempUserName = $scope.userName;
    const devNames = tempArray.filter((dev) => dev.name == tempUserName);
    console.log("DEV NAMES: ", devNames);
    // If the Login Username exists, then we can enable the content

    if (Array.isArray(devNames) != "undefined" && devNames.length != 0) {
      $scope.isLogged = true;
      // Let us get the name and role for this user
      const userRole = tempArray.filter(
        (dev) => dev.name == tempUserName && dev.role == "admin"
      );
      console.log("THIS IS THE USER ROLE STATUS: ", userRole);
      // Let us evaluate if this user is an admin and can access the admin rights
      let x =
        userRole == null ? ($scope.isAdmin = false) : ($scope.isAdmin = true);
      console.log("USER ROLES: ", x);
      $scope.msg = "The user has successfully logged in.";
    } else {
      $scope.isLogged = false;
      $scope.isLoginError = true;
      $scope.loginMsg = "Login failed: Invalid username or password.";
      return;
    }
    return $scope.isLogged;
  };

  // ------------------ INITIAL DATA FETCHING FUNCTION --------------------
  // Let's initialize the function to bring all these people in
  $scope.fnGetDevelopers();

  // ------------------ WATCHERS OR GUARDIANS TO OBSERVE --------------------
  // Watcher over here, to activate it when the profile array gets
  $scope.$watch("names", function (newval, oldval) {
    console.log("Valor Inicial", oldval);
    console.log("Nuevo Valor", newval);
  });

  $scope.$watch("userName", function (newval, oldval) {
    newval ? ($scope.isLoginError = false) : ($scope.isLoginError = true);
  });
});
