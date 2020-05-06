var app = angular.module("myApp", []);
app.controller("customersCtrl", function ($scope) {
  angular.element(document).ready(function () {
    let req = new XMLHttpRequest();
    req.onreadystatechange = () => {
      if (req.readyState == XMLHttpRequest.DONE) {
        let { directorio } = JSON.parse(req.responseText);
        $scope.names = directorio;
        $scope.titles = directorio;
      }
    };

    req.open(
      "GET",
      "https://api.jsonbin.io/b/5eb2316247a2266b14739360/2",
      true
    );
    req.setRequestHeader(
      "secret-key",
      "$2b$10$4qmVP5JEguFHY9kiP5GkVuoHaZjhwClK3e7EwNxKm40AiMj.F5rHu"
    );
    req.send();
  });
});
