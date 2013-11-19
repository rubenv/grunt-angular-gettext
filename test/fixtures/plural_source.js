angular.module("myApp").controller("birdController", function (ngettext) {
    var count = 2,
        myString = ngettext("Bird", "Birds", count);
});
