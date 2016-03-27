var app = angular.module("app", [ 'ngRoute' ]);

app.config([ '$routeProvider', function($routeProvider) {
	$routeProvider
	.when('/', {
		templateUrl : 'view/nrmsCheck.html',
		controller : 'nrmsCtrl'
	}).when('/kukco', {
		templateUrl : 'view/kukco.html',
		controller : 'kukcoCtrl'
	}).when('/meta', {
		templateUrl : 'view/meta.html',
		controller : 'metaCtrl'
	}).when('/lsmCheck', {
		templateUrl : 'view/lsmCheck.html',
		controller : 'lsmCtrl'
	}).when('/nrmsCheck', {
		templateUrl : 'view/nrmsCheck.html',
		controller : 'nrmsCtrl'
	}).when('/sql', {
		templateUrl : 'view/sql.html',
		controller : 'sqlCtrl'
	}).when('/regist', {
		templateUrl : 'view/regist.html',
		controller : 'registCtrl'
	}).when('/api', {
		templateUrl : 'view/api.html',
		controller : 'apiCtrl'
	}).when('/module', {
		templateUrl : 'view/module.html',
		controller : 'moduleCtrl'
	}).otherwise({
		redirectTo : '/'
	});
} ]);

app.controller('kukcoCtrl', function($scope, $http, $filter) {
	$scope.request = function(kukco) {
		$scope.result = "";
		$http.post('/private/api/nlm/', kukco)
		.success(function(response) {
			console.log("response!!" + response)
			$scope.data = response.data;
			if(response.data.O_ZTAA370.numRows == 0){
				$scope.result = "결과없음";
			}
		}).error(function(response) {
			$scope.result = 'fail!!'
			console.log("error!!" + response)
		});
	};

	
	$scope.nlmResync = function(kukco) {
		console.log(kukco);
		
		$http.post("/private/api/common", {name : 'nlmResync', parameters:[kukco]})
//		$http.post('/private/db/nrms', {sql: 'insert into  CMS_NLM2CMS_RESYNC_LIST values(sysdate,\''+kukco+'\')', system : 'nrms', data : {}})
		.success(function(response) {
			$scope.table = response;
		}).error(function(response) {
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



app.controller('metaCtrl', function($scope, $http, $filter) {
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


app.controller('lsmCtrl', function($scope, $http, $filter) {
	$http.post("/private/api/query", {name : 'getLsmHistory',  parameters:[]})
	.success(function(response) {
		$scope.table = response;
		$scope.columnNames = response.columnNames;
		$scope.rows = response.rows;
		$scope.numRows = response.numRows;
//		$scope.result = 'success!!';
	}).error(function(response) {
//		$scope.result = 'fail!!'
		console.log("error!!" + response)
	});
	
	
	$http.post("/private/api/query", {name : 'getRootDir',  parameters:[]})
	.success(function(response) {
		$scope.rootDir = response.rows[0].VALUE;
	}).error(function(response) {
		$scope.result = 'fail!!'
		console.log("error!!" + response)
	});

	var lsmData = '';
	$scope.request = function(rootDir) {
		$scope.result = "";
		$http.post('/private/api/lsmCheck/', rootDir)
		.success(function(response) {
			console.log("response!!" + response)
			$scope.data = response.data;
			lsmData = response;
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
	
	$scope.save = function(data) {
		console.log(data);
		var regDt = $filter('date')(new Date(), 'yyyyMMddHHmmss');
		$http.post("/private/api/query", {name : 'saveLsmData',  parameters:[regDt,angular.toJson(data)]})
		.success(function(response) {
			$scope.saveResult = 'done!!';
		}).error(function(response) {
			$scope.saveResult = 'fail!!';
			console.log("error!!" + response);
		});
	};
//	getLsmData
	$scope.showDetail = function(regdt) {
		$http.post("/private/api/query", {name : 'getLsmData',  parameters:[regdt]})
		.success(function(response) {
			var obj = angular.fromJson(response.rows[0].DATA);
			$scope.detail = obj;
		}).error(function(response) {
			$scope.saveResult = 'fail!!';
			console.log("error!!" + response)
		});
	};
	
});


app.controller('nrmsCtrl', function($scope, $http, $filter) {
	$scope.running = null;
	$scope.showResult = function(msgName) {
		$scope.running = "running";
		console.log(msgName);
		$http.post("/private/api/query", {name : msgName,  parameters:[]})
		.success(function(response) {
			$scope.nrmsResult = response;
			$scope.running = null;
		}).error(function(response) {
			console.log("error!!" + response)
			$scope.running = null;
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


app.controller('sqlCtrl', function($scope, $http, $filter) {
	$scope.request = function(request) {
		$http.post("/private/api/common", {name : 'dbTest', parameters:[request.db, request.sql]})
//		$http.post(addr, {sql: request.sql, system : 'h2', data:{request}})
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


app.controller('registCtrl', function($scope, $http, $filter) {
	
	$scope.regist = function(request) {
//		name, system, type, sql, parametersize, maxsize, defaultvalue, memo
		$http.post("/private/api/common", {name : 'regist'
			, parameters:[request.name, request.db, request.type, request.sql, request.parametersize, null, null, request.memo]})
		.success(function(response) {
			console.log(response);
			$scope.registResult = 'success!!';
		}).error(function(response) {
			$scope.registResult = 'fail!!';
			console.log("error!!" + response);
		});
	};
	
	$scope.getAllRequest = function() {
		$http.post("/private/api/common", {name : 'getAllRequest',  parameters:[]})
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