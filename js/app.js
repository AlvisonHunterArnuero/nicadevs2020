var app = angular.module("myApp", []);
app.controller("customersCtrl", function ($scope) {
  // First, let's see who is connected to our app at this moment
  $scope.currentUser = localStorage.getItem("currentUser");
  console.log("Current User: ", $scope.currentUser);
  $scope.isAdmin = false;
  $scope.arr2JSON = [];
  // Watcher over here, to activate it when the profile array gets
  $scope.$watch("titleFilter", function (newval, oldval) {
    console.log("This is current User right now", $scope.currentUser);
    $scope.currentUser == "Admin2020"
      ? ($scope.isAdmin = true)
      : ($scope.isAdmin = false);
    console.log(`Asi queda Admin ahora ${$scope.isAdmin}`);
  });

  // Our API uses this to be consumed and return what we are
  // requesting, in this case, I am getting all the items
  // present on the JSON saved on this API Server
  let req = new XMLHttpRequest();
  req.onreadystatechange = () => {
    if (req.readyState == XMLHttpRequest.DONE) {
      $scope.names = JSON.parse(req.responseText);
    }
  };

  req.open("GET", "https://api.jsonbin.io/b/5eb8adb6a47fdd6af1611fbc", true);
  req.setRequestHeader(
    "secret-key",
    "$2b$10$4qmVP5JEguFHY9kiP5GkVuoHaZjhwClK3e7EwNxKm40AiMj.F5rHu"
  );
  req.send();

  // delete function will start here
  $scope.fnDeleteDeveloper = function (index) {
    // let's create a temporary array to store the new set of items
    // that we will keep on the original array once the function ends
    let tmpArray = $scope.names;
    // let's prompt the user if he or she wants to delete this card
    bootbox.confirm("Are you sure? This will Erase the record", function (
      result
    ) {
      // if the user clicks on yes, we will delete this element
      if (result === true) {
        tmpArray.splice(index, 1);
        // reassign current array values to both main arrays
        $scope.names = tmpArray;
        // Now, this part is magic, this will cause all my filters
        // and ng repeat to repopulate updating the views I had, Shazam!
        $scope.$apply();
      }

      // THE API IMPLEMENTATION COMES TO TAKE PLACE HERE
      $scope.arr2JSON = JSON.stringify($scope.names);
      let req = new XMLHttpRequest();
      req.onreadystatechange = () => {
        if (req.readyState == XMLHttpRequest.DONE) {
          console.log(req.responseText);
        }
      };

      req.open(
        "PUT",
        "https://api.jsonbin.io/b/5eb8adb6a47fdd6af1611fbc",
        true
      );
      req.setRequestHeader("Content-Type", "application/json");
      req.setRequestHeader("versioning", "false");
      req.setRequestHeader(
        "secret-key",
        "$2b$10$4qmVP5JEguFHY9kiP5GkVuoHaZjhwClK3e7EwNxKm40AiMj.F5rHu"
      );
      req.send($scope.arr2JSON);

      return $scope.names;
    });
  };
});
