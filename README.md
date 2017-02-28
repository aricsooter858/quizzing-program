# Quizzing Program

This Program:
* Selects a random student.
* Selects a random question.
* Selected student then answers question.
* The answer is then stored in local storage as either correct or incorrect.

Controller code

```

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

```

factory code

```
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


```

```

<!DOCTYPE html>
<html ng-app="quizzing_app">
    <head>
        <title>Quzzing Program</title>
        <link href="bootstrap-slate.css" rel="stylesheet" type="text/css" />
        <meta charset="utf-8" />
        <script src = "https://code.angularjs.org/1.6.2/angular.min.js"></script>
        <script src = "app.js"></script>
    </head>
    <body>
        <h1>Quizzing Program</h1>
        <div ng-controller="QuizController as qc">
            <label for="SelectedStudent">Selected Student: </label>
            {{qc.selectedStudent.name}} </br>
            <label for="SelectedQuestion">Selected Question: </label>
            {{qc.selectedQuestion.question}} </br>
            
            <label for="Answer">Answer: </label>
            <input name="QuizAnswer" type="text" ng-model="qc.QuizAnswer"/>
            <p><input type="button" class="btn btn-success" value="Correct" ng-click="qc.update(qc.QuizAnswer)" /> <input type="button" class="btn btn-danger" value="Incorrect" ng-click="qc.update(qc.QuizAnswer)" /></p>
            <p><input type="button" value="Select Student" ng-click="qc.selectStudent()"/></p>
            <p><input type="button" value="Select Question" ng-click="qc.selectQuestion()"/></p>
        </div>
    </body>
</html>

```