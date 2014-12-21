'use strict';

function AuthProvider () {
	var provider = this;

	this.$get = function AuthFactory ($http, $q, $injector, $rootScope, Session) {
		function Auth () {
			var self = this;

			this.$isLogged = null;
			this.$asyncCheck = true;
			this.$user = Session.getUser();
			this.$session = Session;
			this.$counter = 0;

			this.$resolve = function () {
				var self = this;

				self.$counter += 1;

				Object.keys(this.$validators).forEach(function (fn){
					// only will be executed while the state is changing
					// after that, everything will be ignored
					if(self.$isStateChanging()) {
						return;
					}
					
					$injector.instantiate(self.$validators[fn]);
				});
			};

			this.authenticate = function (credentials) {
				return $http.post('/api/auth/local', credentials);
			};

			this.requestProfile = function () {
				var self = this;

				return $http.get('/api/auth/profile/request').then(function (res) {
					return Session.updateUser(res.data);
				});
			};

			this.destroy = function () {
				return $http.get('/api/auth/destroy');
			};

			this.check = function () {
				if(!this.$asyncCheck) {
					return this.$syncCheck;
				}

				// se o usuário foi autenticado
				// impedir a checagem assíncrona por 2 segundos
				if(this.$user) {
					this.$asyncCheck = false;
				}

				return $http.get('/api/auth/check').then(function (res) {
					self.$isLogged = res.data.result;

					// se o valor de self.$isLogged ainda não foi atualizado
					// a autenticação do usuário ainda não foi completada
					if(user && self.$isLogged || !self.$isLogged) {
						return self.$isLogged;
					}

					return self.requestProfile().then(function (user) {
						if(user._id && user._id.length === 7) {
							return user;
						}
					});
				}).finally(function () {
					setTimeout(function () {
						self.$asyncCheck = true;
					}, 2000);
				});
			};

			$rootScope.$on('$stateChangeStart', function () {
				self.$stateChangeStart();
			});

			$rootScope.$on('$stateChangeSuccess', function () {
				self.$stateChangeSuccess();
			});

			return this;
		}

		Auth.prototype = function () {};

		Auth.prototype.$validators = {};

		Auth.prototype.$getUser = function () {
			return this.$session.getUser();
		};

		Auth.prototype.$checkSync = function () {
			return this.$isLogged || false;
		};

		Auth.prototype.$isStateChanging = function () {
			return this.$transition;
		};

		Auth.prototype.$stateChangeStart = function () {
			this.$transition = true;
		};

		Auth.prototype.$stateChangeSuccess = function () {
			this.$transition = false;
		};

		return new function () {
			return Auth.apply(Auth.prototype, arguments);
		};
	};
}

angular.module('ngEntrust.auth', [])
	.provider('Auth', AuthProvider);