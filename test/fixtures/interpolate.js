angular.module("myApp").controller("helloController", function (gettextCatalog) {
    gettextCatalog.getString('Hello {{ name }}!', {name: 'World'});
});
