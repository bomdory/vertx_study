var app = angular.module("app", [ 'ngRoute' ]);

app.config([ '$routeProvider', function($routeProvider) {
	$routeProvider
	.when('/', {
		templateUrl : 'view/sql.html',
		controller : 'sqlCtrl'
	}).when('/sql', {
		templateUrl : 'view/sql.html',
		controller : 'sqlCtrl'
	}).when('/test', {
		templateUrl : 'view/test.html',
		controller : 'testCtrl'
	}).when('/db', {
		templateUrl : 'view/db.html',
		controller : 'dbCtrl'
	}).when('/api', {
		templateUrl : 'view/api.html',
		controller : 'apiCtrl'
	}).when('/module', {
		templateUrl : 'view/module.html',
		controller : 'moduleCtrl'
	}).when('/edit', {
		templateUrl : 'view/edit.html',
		controller : 'editCtrl'
	}).otherwise({
		redirectTo : '/'
	});
} ]);


app.controller('sqlCtrl', function($scope, $http, $filter) {
	$scope.request = function(request) {
		$http.post("/admin/api/db", {sql : request.sql, parameters:[]})
		.success(function(response) {
			$scope.columnNames = response.columnNames;
			$scope.rows = response.rows;
			$scope.numRows = response.numRows;
			$scope.result = 'success!!';
			$scope.prevSql = request.sql;
			$scope.sql="";	
		}).error(function(response) {
			$scope.result = 'fail!!'
			console.log("error!!" + response)
		});
	};

	var orderBy = $filter('orderBy');
	$scope.order = function(predicate, reverse) {
		//$scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
		
		$scope.showClass = "glyphicon glyphicon-stop";
		if($scope.predicate == predicate){
			$scope.reverse = !$scope.reverse
		}else{
			$scope.reverse = false;
		}
		reverse = $scope.reverse;
		if(reverse){
			$scope.howSort = "descending";
		}else{
			$scope.howSort = "ascending";
		}
		$scope.predicate = predicate;
		$scope.data = orderBy($scope.data, predicate, reverse);
	};
	$scope.icon = function(column, predicate, reverse) {
		var className = 'glyphicon glyphicon-stop';
		if (column === predicate) {
			if (reverse) {
				className = 'glyphicon glyphicon-triangle-top';
			} else {
				className = 'glyphicon glyphicon-triangle-bottom';
			}
		} else {
			className = 'glyphicon glyphicon-stop';
		}
		return className;
	};
});


app.controller('testCtrl', function($scope, $http, $filter) {
	$scope.request = function(request) {
		$http.post("/admin/api", {name : request.sql, parameters:[]})
		.success(function(response) {
			$scope.columnNames = response.columnNames;
			$scope.rows = response.rows;
			$scope.numRows = response.numRows;
			$scope.result = 'success!!';
			$scope.prevSql = request.sql;
			$scope.sql="";	
		}).error(function(response) {
			$scope.result = 'fail!!'
			console.log("error!!" + response)
		});
	};

	var orderBy = $filter('orderBy');
	$scope.order = function(predicate, reverse) {
		//$scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
		
		$scope.showClass = "glyphicon glyphicon-stop";
		if($scope.predicate == predicate){
			$scope.reverse = !$scope.reverse
		}else{
			$scope.reverse = false;
		}
		reverse = $scope.reverse;
		if(reverse){
			$scope.howSort = "descending";
		}else{
			$scope.howSort = "ascending";
		}
		$scope.predicate = predicate;
		$scope.data = orderBy($scope.data, predicate, reverse);
	};
	$scope.icon = function(column, predicate, reverse) {
		var className = 'glyphicon glyphicon-stop';
		if (column === predicate) {
			if (reverse) {
				className = 'glyphicon glyphicon-triangle-top';
			} else {
				className = 'glyphicon glyphicon-triangle-bottom';
			}
		} else {
			className = 'glyphicon glyphicon-stop';
		}
		return className;
	};
});

app.controller('editCtrl', function($scope, $http, $filter) {
	$scope.request = function(request) {
		$http.post("/admin/api/h2", {sql : request.sql, parameters:[]})
		.success(function(response) {
			$scope.columnNames = response.columnNames;
			$scope.rows = response.rows;
			$scope.numRows = response.numRows;
			$scope.result = 'success!!';
			$scope.prevSql = request.sql;
			$scope.sql="";	
		}).error(function(response) {
			$scope.result = 'fail!!'
			console.log("error!!" + response)
		});
	};

	var orderBy = $filter('orderBy');
	$scope.order = function(predicate, reverse) {
		//$scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
		
		$scope.showClass = "glyphicon glyphicon-stop";
		if($scope.predicate == predicate){
			$scope.reverse = !$scope.reverse
		}else{
			$scope.reverse = false;
		}
		reverse = $scope.reverse;
		if(reverse){
			$scope.howSort = "descending";
		}else{
			$scope.howSort = "ascending";
		}
		$scope.predicate = predicate;
		$scope.data = orderBy($scope.data, predicate, reverse);
	};
	$scope.icon = function(column, predicate, reverse) {
		var className = 'glyphicon glyphicon-stop';
		if (column === predicate) {
			if (reverse) {
				className = 'glyphicon glyphicon-triangle-top';
			} else {
				className = 'glyphicon glyphicon-triangle-bottom';
			}
		} else {
			className = 'glyphicon glyphicon-stop';
		}
		return className;
	};
});


app.controller('homeCtrl', function($scope, $http, $filter) {
	$scope.request = function() {
		$scope.result = "";
		$http.post('/private/api/nlmmeta')
		.success(function(response) {
			$scope.data = response.data;
			if(response.data.O_ZTAA370.numRows == 0){
				$scope.result = "결과없음";
			}
		}).error(function(response) {
			$scope.result = 'fail!!'
			console.log("error!!" + response)
		});
	};

	var orderBy = $filter('orderBy');
	$scope.order = function(predicate, reverse) {
		//$scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
		
		$scope.showClass = "glyphicon glyphicon-stop";
		if($scope.predicate == predicate){
			$scope.reverse = !$scope.reverse
		}else{
			$scope.reverse = false;
		}
		reverse = $scope.reverse;
		if(reverse){
			$scope.howSort = "descending";
		}else{
			$scope.howSort = "ascending";
		}
		$scope.predicate = predicate;
		$scope.data = orderBy($scope.data, predicate, reverse);
	};
	$scope.icon = function(column, predicate, reverse) {
		var className = 'glyphicon glyphicon-stop';
		if (column === predicate) {
			if (reverse) {
				className = 'glyphicon glyphicon-triangle-top';
			} else {
				className = 'glyphicon glyphicon-triangle-bottom';
			}
		} else {
			className = 'glyphicon glyphicon-stop';
		}
		return className;
	};
});




app.controller('moduleCtrl', function($scope, $http, $filter) {
	$scope.registModule = function(request) {
//		insert into module (name, class_name, worker, thread, instance_cnt, ha, start, memo)
//		values(?,?,?,?,?,?,?,?)
		$http.post("/private/api/common", {name : 'registModule'
			, parameters:[request.name, request.className, request.worker, request.thread, request.instanceCnt, request.ha, request.start, request.memo]})
		.success(function(response) {
			console.log(response);
			$scope.registResult = 'success!!';
		}).error(function(response) {
			$scope.registResult = 'fail!!';
			console.log("error!!" + response);
		});
	};
	
	$scope.updateModule = function(request) {
//		name, system, type, sql, parametersize, maxsize, defaultvalue, memo
		$http.post("/private/api/common", {name : 'registModule'
			, parameters:[request.name, request.db, request.type, request.sql, request.parametersize, null, null, request.memo]})
		.success(function(response) {
			console.log(response);
			$scope.registResult = 'success!!';
		}).error(function(response) {
			$scope.registResult = 'fail!!';
			console.log("error!!" + response);
		});
	};
	
	$scope.deleteModule = function(request) {
//		name, system, type, sql, parametersize, maxsize, defaultvalue, memo
		$http.post("/private/api/common", {name : 'registModule'
			, parameters:[request.name, request.db, request.type, request.sql, request.parametersize, null, null, request.memo]})
		.success(function(response) {
			console.log(response);
			$scope.registResult = 'success!!';
		}).error(function(response) {
			$scope.registResult = 'fail!!';
			console.log("error!!" + response);
		});
	};
	$scope.getAllModule = function() {
		$http.post("/private/api/common", {name : 'getAllModule',  parameters:[]})
		.success(function(response) {
			$scope.columnNames = response.columnNames;
			$scope.rows = response.rows;
			$scope.numRows = response.numRows;
			$scope.result = 'success!!';
//			$scope.prevSql = request.sql;
//			$scope.sql="";	
		}).error(function(response) {
			$scope.result = 'fail!!';
			console.log("error!!" + response)
		});
	};

	var orderBy = $filter('orderBy');
	$scope.order = function(predicate, reverse) {
		//$scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
		
		$scope.showClass = "glyphicon glyphicon-stop";
		if($scope.predicate == predicate){
			$scope.reverse = !$scope.reverse;
		}else{
			$scope.reverse = false;
		}
		reverse = $scope.reverse;
		if(reverse){
			$scope.howSort = "descending";
		}else{
			$scope.howSort = "ascending";
		}
		$scope.predicate = predicate;
		$scope.data = orderBy($scope.data, predicate, reverse);
	};
	$scope.icon = function(column, predicate, reverse) {
		var className = 'glyphicon glyphicon-stop';
		if (column === predicate) {
			if (reverse) {
				className = 'glyphicon glyphicon-triangle-top';
			} else {
				className = 'glyphicon glyphicon-triangle-bottom';
			}
		} else {
			className = 'glyphicon glyphicon-stop';
		}
		return className;
	};
});


app.controller('apiCtrl', function($scope, $http, $filter) {
	
	$scope.regist = function(request) {
//		name, system, type, sql, parametersize, maxsize, defaultvalue, memo
		$http.post("/private/api/common", {name : 'registApi'
			, parameters:[request.name, request.address, request.db, request.sql, request.memo]})
		.success(function(response) {
			console.log(response);
			$scope.registResult = 'success!!';
		}).error(function(response) {
			$scope.registResult = 'fail!!';
			console.log("error!!" + response);
		});
	};
	
	$scope.getAllRequest = function() {
		$http.post("/private/api/common", {name : 'getAllApi',  parameters:[]})
		.success(function(response) {
			$scope.columnNames = response.columnNames;
			$scope.rows = response.rows;
			$scope.numRows = response.numRows;
			$scope.result = 'success!!';
//			$scope.prevSql = request.sql;
//			$scope.sql="";	
		}).error(function(response) {
			$scope.result = 'fail!!';
			console.log("error!!" + response)
		});
	};

	var orderBy = $filter('orderBy');
	$scope.order = function(predicate, reverse) {
		//$scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
		
		$scope.showClass = "glyphicon glyphicon-stop";
		if($scope.predicate == predicate){
			$scope.reverse = !$scope.reverse;
		}else{
			$scope.reverse = false;
		}
		reverse = $scope.reverse;
		if(reverse){
			$scope.howSort = "descending";
		}else{
			$scope.howSort = "ascending";
		}
		$scope.predicate = predicate;
		$scope.data = orderBy($scope.data, predicate, reverse);
	};
	$scope.icon = function(column, predicate, reverse) {
		var className = 'glyphicon glyphicon-stop';
		if (column === predicate) {
			if (reverse) {
				className = 'glyphicon glyphicon-triangle-top';
			} else {
				className = 'glyphicon glyphicon-triangle-bottom';
			}
		} else {
			className = 'glyphicon glyphicon-stop';
		}
		return className;
	};
});