ng-entrust
==========

## Installation (Bower)
```
bower install --save ng-entrust
```

## Usage
```js
angular.module('myApp',[])
  .run(function (Auth) {
    Auth.$validators.AdminRole = function ($state) {
    	var name = 'login', params = {};

			var toState = Auth.$toState;
			var toParams = Auth.$toParams;
			var fromState = Auth.$fromState;
			var fromParams = Auth.$fromParams;

			$state.go(name, params, { notify: false }).then(function (state) {
			  $rootScope.$broadcast('$stateChangeSuccess', state, params, fromState, fromParams);
			});
    };
  })
```
