(function () {
    'use strict';
    
    var app=angular.module('MyApp',['ngRoute','ngCookies']);
    
    
   /* angular
    .module('MyApp', [])
    .config(config)
    .run(run);*/
	

//config.$inject = ['$routeProvider', '$locationProvider'];
app.config(['$routeProvider','$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            controller: 'HomeController',
            templateUrl: 'home/home.view.html',
            controllerAs: 'vm'
        })

        .when('/login', {
            controller: 'LoginController',
            templateUrl: 'login/login.view.html',
            controllerAs: 'vm'
        })

        .when('/register', {
            controller: 'RegisterController',
            templateUrl: 'register/register.view.html',
            controllerAs: 'vm'
        })
        
        .when('/admin', {
        	controller: 'AdminController',
        	templateUrl: 'admin/admin.view.html',
        	controllerAs: 'vm'
        })					

        .otherwise({ redirectTo: '/login' });

}] );

//run.$inject = ['$rootScope', '$location', '$cookieStore', '$http'];
app.run(['$rootScope','$location','$cookieStore','$http',function ($rootScope, $location, $cookieStore, $http) {
    // keep user logged in after page refresh
    $rootScope.globals = $cookieStore.get('globals') || {};
    if ($rootScope.globals.currentUser) {
        $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
    }

    $rootScope.$on('$locationChangeStart', function (event, next, current) {
        // redirect to login page if not logged in and trying to access a restricted page
        var restrictedPage = $.inArray($location.path(), ['/login', '/register']) === -1;
        var loggedIn = $rootScope.globals.currentUser;
        if (restrictedPage && !loggedIn) {
            $location.path('/login');
        }
    });
}] );


app.filter('capitalize', function() {	 
	   return function(token) {
	      return token.charAt(0).toUpperCase() + token.slice(1);
	   }
	});

app.directive('quiz', function(quizFactory) {
	return {
		restrict: 'AE',
		scope: {},
		templateUrl: 'template.html',
		link: function(scope, elem, attrs) {
			scope.start = function() {
				scope.id = 0;
				scope.quizOver = false;
				scope.inProgress = true;
				scope.getQuestion();
			};

			scope.reset = function() {
				scope.inProgress = false;
				scope.score = 0;
			}

			scope.getQuestion = function() {
				var q = quizFactory.getQuestion(scope.id);
				if(q) {
					scope.question = q.question;
					scope.options = q.options;
					scope.answer = q.answer;
					scope.answerMode = true;
				} else {
					scope.quizOver = true;
				}
			};

			scope.checkAnswer = function() {
				if(!$('input[name=answer]:checked').length) return;

				var ans = $('input[name=answer]:checked').val();			

				if(ans == scope.options[scope.answer]) {
					scope.score++;
					scope.correctAns = true;
				} else {
					scope.correctAns = false;
				}

				scope.answerMode = false;
			};

			scope.nextQuestion = function() {
				scope.id++;
				scope.getQuestion();
			}

			scope.reset();
		}
	}
});

app.factory('quizFactory', function() {
	var questions = [
		{
			question: "Q: Which is not an advantage of using a closure?",
			options: ["Prevent pollution of global scope", "Encapsulation", "Private properties and methods", "Allow conditional use of ‘strict mode'"],
			answer: 1
		},
		{
			question: "Q: To create a columned list of two-line email subjects and dates for a master-detail view,which are the most semantically correct?",
			options: ["<div>+<span>", "<tr>+<td>", "<ul>+<li>", "<p>+<br>","none of these","all of these"],
			answer: 0
		},
		{
			question: "Q: To pass an array of strings to a function, you should not use?",
			options: ["fn.apply(this, stringsArray)", "fn.call(this, stringsArray)", "fn.bind(this, stringsArray)"],
			answer: 1
		},
		{
			question: "Q: ____ and ____ would be the HTML tags you would use to display a menu item and its description.?",
			options: ["menuitem", "li", "nav", "desc"],
			answer: 0
		},
		{	
			question: "Q: Given <div id=”outer”><div class=”inner”></div></div>, which of these two is the most performant way to select the inner div?",
			options: ["getElementById('outer').children[0]", "getElementsByClassName('inner')[0]"],
			answer: 0
		},
		{			
			question: "Q: Angular.module(‘myModule’,[]).service(‘myService’,(function() { var message = 'Message one!'var getMessage = function() {return this.message } this.message ='Message two!' this.getMessage = function() { return message } return function() { return { getMessage: getMessage,message: 'Message three!'}}})())?",
			options: ["1","2","3"],
			answer: 0
			
		}
	];

	return {
		getQuestion: function(id) {
			if(id < questions.length) {
				return questions[id];
			} else {
				return false;
			}
		}
	};
});
}) ();

