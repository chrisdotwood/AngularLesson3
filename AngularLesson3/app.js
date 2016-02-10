/// <reference path="C:\Local Repositories\Interview practice\AngularLesson2\AngularLesson2\angular.js" />
/// <reference path="C:\Local Repositories\github\AngularLesson2\AngularLesson2\ui-bootstrap-tpls-1.1.2.js" />

angular.module("flipApp", ["ngRoute"])
    .config(function ($routeProvider) {
        $routeProvider
            .when("/", { templateUrl: 'partials/peopleList.html', controller: 'flipController' })
            .when("/book", { templateUrl: 'partials/bookList.html', controller: 'bookController' })
            .when("/book/:id", { templateUrl: 'partials/booksDetails.html', controller: 'bookController' })
            .when("/view/:id", { templateUrl: 'partials/peopleDetails.html', controller: 'viewController' })
            .when("/about", { templateUrl: 'partials/about.html' })
            .otherwise({ redirectTo: '/' });
    })
    .controller("flipController", function ($scope, $http) {
        $scope.title = "Flip - Reading Log";
        $scope.filter;

        $http.get("http://www.filltext.com/?rows=100&fname={firstName}&lname={lastName}&tel={phone|format}&address={streetAddress}&city={city}&state={usState|abbr}&zip={zip}&pretty=true")
            .success(function (data) {
                $scope.people = data;
                $scope.$emit("UNLOAD");
            });

        $scope.$on("LOAD", function () { $scope.loading = true });
        $scope.$on("UNLOAD", function () { $scope.loading = false });

        $scope.$emit("LOAD");

    })
    .controller('bookController', function ($scope, $http) {
        $scope.query;

        $scope.search = function () {
            var url = "https://www.googleapis.com/books/v1/volumes";

            if ($scope.query != null) {
                url = url + '?q=' + escape($scope.query);
            }

            $http.get(url)
                .success(function (data) {
                    $scope.books = data.items;
                });

        };
  
    })
    .controller('viewController', ['$scope', '$routeParams', function ($scope, $routeParams) {
        $scope.person = $scope.people[$routeParams.id];
    }]);

