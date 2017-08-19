var mainApp = angular.module('mainApp', ["ngRoute"]);

window.username = '';
window.userId = '';
window.user_f_name = '';
window.isLoggedIn = 0;

mainApp.run(function ($rootScope, $location) {
	console.log($.session.get("isLoggedIn") == 1);
	if($.session.get("isLoggedIn")) {
		window.username = $.session.get("username");
		window.userId = $.session.get("userId");
		window.user_f_name = $.session.get("user_f_name");
		window.isLoggedIn = $.session.get("isLoggedIn");
	} else {
		showNotice('Login to continue');
		$location.path('/login');
	}
});

mainApp.controller('loginController', function ($scope, $http, $location) {
	hideHeader();
	$(".overlay, .loader").hide();
	if($.session.get("isLoggedIn") == 1) {
		window.username = $.session.get("username");
		window.userId = $.session.get("userId");
		window.user_f_name = $.session.get("user_f_name");
		window.isLoggedIn = $.session.get("isLoggedIn");
		showHeader();
		$location.path('/home');
		return;
	}
	$scope.loginSubmit = function() {
		$(".overlay, .loader").show();
		if ($scope.username && $scope.password) {
			$http({
				method: 'POST',
				data: {
					username: $scope.username,
					password: $scope.password
				},
				url: 'data/login.php'
			})
			.then(function(response){
				console.log(response.data.success);
				if(response.data.success == 1) {
					window.username = response.data.username;
					window.userId = response.data.userId;
					window.user_f_name = response.data.fname;
					window.isLoggedIn = 1;

					// Set session storage
					$.session.set("username", window.username);
					$.session.set("userId", window.userId);
					$.session.set("user_f_name", window.username);
					$.session.set("isLoggedIn", window.isLoggedIn);

					showNotice('Logged In');
					$location.path('/home');
					showHeader();
				} else {
					$(".overlay, .loader").hide();
					showNotice('Invalid username or password');
				}
			}, function(response){
				$(".overlay, .loader").hide();
				showNotice('Something went wrong');
			});
		}
		else {
			$(".overlay, .loader").hide();
			showNotice('Check username and password');
		}
	}
	closeNav();
});


mainApp.controller('homeController', function ($scope, $http, $location) {

	$(".overlay, .loader").show();
	$scope.username = window.username;
	$scope.user_f_name = window.user_f_name;
	$scope.userId = window.userId;
	$http({
		method: 'POST',
		data: {
			userId: window.userId
		},
		url: 'data/taskOverview.php'
	}).then(function(response){
		console.log(response.data.length);
		if (response.data) {
			$scope.completed = response.data.completed;
			$scope.pending = response.data.pending;
			$scope.completedPercent = response.data.completedPercent;
			updateDonutChart('#specificChart', $scope.completedPercent, true);
		}
	}, function(response){
		showNotice('Something went wrong');
	});
	$(".overlay, .loader").hide();
	closeNav();
});

mainApp.controller('listController', function ($scope, $http, $location) {
	$scope.fetchData = function() {
		$(".overlay, .loader").show();
		$http({
			method: 'POST',
			data: {
				userId: window.userId,
				username: window.username
			},
			url: 'data/tasks.php'
		}).then(function(response){
			$scope.tasks = response.data;
			if (!$scope.tasks.length) {
				showNotice('No Task Found');
			}
		}, function(response){
			showNotice('Something went wrong');
		});
		$(".overlay, .loader").hide();
	}
	$scope.fetchData();
	$scope.deleteTask  = function(taskId) {
		$(".overlay, .loader").show();
		$http({
			method: 'POST',
			data: {
				taskId: taskId
			},
			url: 'data/deleteTaskById.php'
		}).then(function(response){
			if (response.data) {
				showNotice('Task Deleted');
				$scope.fetchData();
			}
		}, function(response){
			showNotice('Something went wrong');
		});
		$location.path('/list');
	}
	$scope.markComplete  = function(taskId) {
		$(".overlay, .loader").show();
		$http({
			method: 'POST',
			data: {
				taskId: taskId
			},
			url: 'data/markTaskById.php'
		}).then(function(response){
			if (response.data) {
				showNotice('Task status updated');
				$scope.fetchData();
			}
		}, function(response){
			showNotice('Something went wrong');
		});
		$location.path('/list');
	}
	closeNav();
});

mainApp.controller('addController', function ($scope, $http, $location) {
	$( "#datepicker" ).datepicker();
	$scope.submitForm = function() {
		if ($scope.title.length > 0 && $scope.due_date.length > 0) {
			$http({
				method: 'POST',
				data: {
					userId: window.userId,
					title: $scope.title,
					description: $scope.description,
					due_date: $scope.due_date,
				},
				url: 'data/save.php'
			})
			.then(function(response){
				if(response.data == 1) {
					showNotice('Task saved');
					$location.path('/list');
				} else {
					showNotice('Something went wrong');
				}
			}, function(response){
				showNotice('Something went wrong');
			});
		}
		else {
			showNotice('Please fill all required fields');
		}
	}
	closeNav();
});

mainApp.controller('editController', function ($scope, $http, $routeParams, $location) {
	$( "#datepicker" ).datepicker();
	var taskId = $routeParams.taskId;
	if(taskId) {
		$http({
			method: 'POST',
			data: {
				taskId: taskId
			},
			url: 'data/getTaskById.php'
		}).then(function(response){
			console.log(response.data.length);
			if (response.data) {
				$scope.id = response.data.id;
				$scope.title = response.data.task;
				$scope.description = response.data.description;
				$scope.due_date = response.data.due_date;
				showNotice('Task Id: '+$scope.id);
			} else {
				showNotice('No Task Found');
			}
		}, function(response){
			showNotice('Something went wrong');
			$location.path('/list');
		});
	} else {
		showNotice('Task id not found');
		$location.path('/list');
	}
	$scope.submitForm = function() {
		$http({
			method: 'POST',
			data: {
				taskId: $scope.id,
				title: $scope.title,
				description: $scope.description,
				due_date: $scope.due_date,
			},
			url: 'data/updateTaskById.php'
		}).then(function(response){
			if (response.data) {
				showNotice('Task updated');
				$scope.fetchData();
			}
		}, function(response){
			showNotice('Something went wrong');
		});
		$location.path('/list');
	}
	closeNav();
});

mainApp.controller('logoutController', function ($scope, $location, $timeout) {
	closeNav();
	$(".overlay, .loader").show();
	window.username = '';
	window.userId = '';
	window.user_f_name = '';
	window.isLoggedIn = 0;

	// clear session storage
	$.session.set("username", window.username);
	$.session.set("userId", window.userId);
	$.session.set("user_f_name", window.user_f_name);
	$.session.set("isLoggedIn", window.isLoggedIn);

	showNotice('Successfully Logged Out. Redirecting to Login.');
	$timeout(function() {
		$location.path('/login');
    }, 2000);
});

// Custom functions
var closeNav = function () {
	document.getElementById("mySidenav").style.width = "0";
}

var showNotice = function(msg) {
	$.toast(msg, {
		// how long the toast lasts
  		'duration': 2000, 
	});
}

var showHeader = function() {
	$('#header-container').show();
	$("#main").css('margin-top', '10.5vh');
}

var hideHeader = function() {
	$('#header-container').hide();
	$("#main").css('margin-top', '0');
}