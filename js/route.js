// var mainApp = angular.module('mainApp');

angular.module('mainApp').config(function($routeProvider){
	$routeProvider
    .when("/", {
        templateUrl : "templates/login.html",
        controller : 'loginController'
    })
    .when("/home", {
        templateUrl : "templates/home.html",
        controller : 'homeController'
    })
    .when("/login", {
        redirectTo : '/'
    })
    .when("/list", {
        templateUrl : "templates/list.html",
        controller : 'listController'
    })
    .when("/deleteTask/:taskId", {
        templateUrl : "",
        controller : 'homeController'
    })
    .when("/form", {
        templateUrl : "templates/add_new.html",
        controller : 'addController'
    })
    .when("/form/:taskId", {
        templateUrl : "templates/add_new.html",
        controller : 'editController'
    })
    .when("/logout", {
        templateUrl : "templates/logout.html",
        controller : 'logoutController'
    })
    .when("/no-route", {
        templateUrl : "templates/404.html"
    })
    .otherwise({
    	redirectTo : '/no-route'
    });
});