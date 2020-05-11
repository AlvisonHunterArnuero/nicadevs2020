$(document).ready(function () {
  // let us prompt for the name of the person for the
  // moment, eventually we will authenticate this
  bootbox.prompt({
    title: "Please provide us with your name.",
    centerVertical: true,
    callback: function (result) {
      localStorage.clear();

      // If htey write the name, display it on top of screen
      // If not, we shall simply display the Guest word on the DOM element
      result != null
        ? localStorage.setItem("currentUser", result)
        : localStorage.setItem("currentUser", "Guest");
      // Save this visitor in the local storage so that we can access to it
      // from the angular side to grant some privileges if the person is admin
      $("#userID").html(result);
    },
  });
});
