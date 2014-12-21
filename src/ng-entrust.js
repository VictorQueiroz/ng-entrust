'use strict';

angular.module('ngEntrust', [
	'ngEntrust.auth',
	'ngEntrust.session'
])
	.run(function ($rootScope, Auth, $state) {
		$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
			Auth.$toState = toState;
			Auth.$toParams = toParams;
			Auth.$fromState = fromState;
			Auth.$fromParams = fromParams;
		});

		$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
			event.preventDefault();

			// resolve the $validators
			Auth.$resolve();

			// if the state is not changing
			// means that the user has been finished his call
			// so, just come back home, buddy
			if(!Auth.$isStateChanging()) {
				return;
			}

			// if none of the rules have not completed the states
			// redirect the user to 'toState'
			$state.go(toState, toParams, { notify: false }).then(function (state) {
				$rootScope.$broadcast('$stateChangeSuccess', state, toParams, fromState, fromParams);
			});

			console.log('transition...');
		});

		$rootScope.$on('$stateChangeSuccess', function () {
			Auth.$toState = null;
			Auth.$toParams = null;
			Auth.$fromState = null;
			Auth.$fromParams = null;

			console.log('done!');
		});
	});