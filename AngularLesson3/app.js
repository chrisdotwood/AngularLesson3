/// <reference path="C:\Local Repositories\Interview practice\AngularLesson2\AngularLesson2\angular.js" />
/// <reference path="C:\Local Repositories\github\AngularLesson2\AngularLesson2\ui-bootstrap-tpls-1.1.2.js" />

angular.module("flipApp", ["ngRoute"])
    .config(function ($routeProvider) {
        $routeProvider
            .when("/", { templateUrl: 'partials/peopleList.html', controller: 'flipController' })
            .when("/book", { templateUrl: 'partials/bookList.html', controller: 'bookController' })
            .when("/book/:id", { templateUrl: 'partials/bookDetails.html', controller: 'bookDetailsController' })
            .when("/view/:id", { templateUrl: 'partials/peopleDetails.html', controller: 'peopleDetailsController' })
            .when("/about", { templateUrl: 'partials/about.html' })
            .otherwise({ redirectTo: '/' });
    })
    .service("bookService", function () {
        var books;

        return {
            getBooks: function () {
                return books;
            },
            setBooks: function (data) {
                books = data;
            }
        };
    })
    .controller("flipController", ['$scope', '$http', function ($scope, $http) {
        $scope.title = "Flip - Reading Log";
        $scope.filter;

        $http.get("http://www.filltext.com/?rows=100&fname={firstName}&lname={lastName}&tel={phone|format}&address={streetAddress}&city={city}&state={usState|abbr}&zip={zip}&pretty=true")
            .success(function (data) {
                $scope.people = data;
                $scope.$emit("UNLOAD");
            });

        ///////////////////////
        //$http.get("https://www.googleapis.com/books/v1/volumes?q=test")
        //    .success(function (data) {
        //        $scope.books = data.items;
        //        $scope.$emit("UNLOAD");
        //    });
        ////////////////////////////

        $scope.$on("LOAD", function () { $scope.loading = true });
        $scope.$on("UNLOAD", function () { $scope.loading = false });

        $scope.$emit("LOAD");

    }])
    .controller('bookController', ['$scope', '$http', 'bookService', function ($scope, $http, bookService) {
        $scope.query;

        $scope.search = function () {
            var url = "https://www.googleapis.com/books/v1/volumes";

            if ($scope.query != null) {
                url = url + '?q=' + escape($scope.query);
            }

            $http.get(url)
              .success(function (data) {
                  $scope.books = data.items;

                  bookService.setBooks($scope.books);

                  $scope.$emit("UNLOAD");
            });
        };

        var storedBooks = bookService.getBooks();

        if (storedBooks != null && storedBooks.length > 0) {
            $scope.books = storedBooks;
        }

    }])
    .controller('bookDetailsController', ['$scope', '$routeParams', 'bookService', function ($scope, $routeParams, bookService) {
        $scope.book = bookService.getBooks()[$routeParams.id];
    }])
    .controller('peopleDetailsController', ['$scope', '$routeParams', function ($scope, $routeParams) {
        $scope.person = $scope.people[$routeParams.id];
    }])
    .directive("pagetitle", function() {
        return {
            restrict: 'E',
            link: function (scope, e, a) {
                scope.title = a.title;
            },
            template: "<h2>{{title}}</h2>"
        };
    });

