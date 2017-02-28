/*angular.module("ForecastApp", [])
	   .controller("ForecastController", ["$scope", "$http", 
		function($scope, $http){
		   
		   var fc = this;
		   
		   fc.message = "Hello World";
		   
		   $http.get("model.txt")
		   .then(function(response){
			  fc.message = response.data; 
		   });
		   
	   }]);
*/

var myModule = angular.module('quizzing_app', []);

myModule.controller("QuizController", ['$scope', 'LocalStorageService', '$http',
                function($scope, LocalStorageService, $http) {
                    
    var qc = this;
    
    qc.answers = [];
    qc.QuizAnswer = "";
    qc.students = [
        {name: "Aric Sooter"},
        {name: "Billy Bob"},
        {name: "Joe Smith"},
        {name: "Joe Bob Bill"}
    ];
    $http.get("questions.json")
    .then(function(response){
    	qc.questions = angular.fromJson(response.data);
    });
    
    
    qc.selectedStudent = "";
    qc.selectedQuestion = "";
    
    //http://stackoverflow.com/questions/20881213/converting-json-object-into-javascript-array
    
    /*qc.json = '{"0":"1","1":"2","2":"3","3":"4"}';

    qc.parsed = JSON.parse(qc.json);

    qc.arr = [];
    
    

		for(var x in qc.parsed){
		qc.arr.push(qc.parsed[x]);
	}
	*/

    
    qc.selectStudent = function(){
        qc.selectedStudent = qc.students[Math.floor(Math.random() * qc.students.length)];
        return qc.selectedStudent;
    };
    
     qc.selectQuestion = function(){
        qc.selectedQuestion = qc.questions[Math.floor(Math.random() * qc.questions.length)];
        return qc.selectedQuestion;
    };
    
    qc.remove = function($index){

		qc.answers = qc.latestData();
		qc.answers.splice($index, 1);
		return LocalStorageService.setData('my-storage', angular.toJson(qc.answers));		
		
	};


	
 qc.latestData = function() {
        return LocalStorageService.getData('my-storage');
    };
	
    qc.update = function(ans) {
		qc.answers = qc.latestData();
		if(qc.answers == null){
			qc.answers = [];
		}
		var answer = { Answer: ans};
		console.log(angular.toJson(answer));
		qc.answers.push(answer);
        return LocalStorageService.setData('my-storage', angular.toJson(qc.answers));
    };

    //Check to see if null
	if(qc.answers != null){
		qc.answers = qc.latestData();
	}else{
		console.log("crikey");
	}
	
	$http.get("questions.json")
	.then(function(response){
			  qc.student = angular.fromJson(response.data);
			  qc.fn = qc.student.firstname;
		   });
                    
}]);

myModule.factory("LocalStorageService", function($window, $rootScope) {
    
    angular.element($window).on('storage', function(event) {
        if (event.key === 'my-storage') {
            $rootScope.$apply();
        }
    });    
    
    return {
        setData: function(key, val) {
			
            $window.localStorage && $window.localStorage.setItem(key, val);
            return this;
        },
        getData: function(key) {
            
            var val = $window.localStorage && $window.localStorage.getItem(key);
            
            var data = angular.fromJson(val);
            
            return data; 
        }
    };
});
