'use strict';

function SessionProvider () {
	var provider = this;

	function User () {
		this.roles = [];
	}

	// is just a simple callback which
	// check if the user have an id
	User.prototype.isLogged = function (fnLogged, fnNotLogged) {
		if(this.user) {
			fnLogged.call(this, this);
		} else {
			fnNotLogged.call(this, this);
		}
	};

	User.prototype.__roles__ = []; // user roles cache
	User.prototype.__permissions__ = []; // user permissions cache

	User.prototype.can = function (roleName) {
		var self = this;

		if(!this.roles) {
			return false;
		}

		if(this.__permissions__.indexOf(roleName) !== -1) {
			return true;
		}

		var can = false;

		this.permissions.forEach(function (role) {
			if(role.name === roleName) {
				can = true;

				self.__permissions__.push(roleName);
			}
		});

		return can;
	};


	User.prototype.hasRole = function (roleName) {
		var self = this;

		if(!this.roles) {
			return false;
		}

		if(this.__roles__.indexOf(roleName) !== -1) {
			return true;
		}

		var has = false;

		this.roles.forEach(function (role) {
			if(role.name === roleName) {
				has = true;

				self.__roles__.push(roleName);
			}
		});

		return has;
	};

	this.$get = function SessionFactory ($http, $q) {
		function Session () {
			var Session = this;

			this.user = new User;

			return this;
		}

		Session.prototype.updateUser = function (u) {
			angular.extend(this.user, u);

			return this.user;
		};

		// it will return a promise if
		// the user object wasn't filled yet
		Session.prototype.getUser = function () {
			var self = this;
			
			return typeof this.user === 'object' && angular.copy(this.user) || $http.get('/api/auth/profile/request').then(function (res) {
				return self.updateUser(res.data);
			});
		};

		return new function () {
			return Session.apply(Session.prototype, arguments);
		};
	};
}

angular.module('ngEntrust.session', [])
	.provider('Session', SessionProvider);