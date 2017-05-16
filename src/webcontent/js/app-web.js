(function () {
  'use strict';

  angular.module('app-web', ['ngRoute'])
    .config(function ($routeProvider) {

      $routeProvider.when('/', {
        controller: 'loginController',
        controllerAs: 'vm',
        templateUrl: 'views/userlogin.html'
      });

      $routeProvider.otherwise({ redirectTo: "/" });

    });

  angular.module('app-web').run(function () {
    
  });

  angular.module('app-web').service('session', function () {
    this.create = function (sessionId, userId, userRole) {
      this.id = sessionId;
      this.userId = userId;
      this.userRole = userRole;
    };
    this.destroy = function () {
      this.id = null;
      this.userId = null;
      this.userRole = null;
    };
    return this;
  })

  angular.module('app-web').factory('authService', function ($http, Session) {
    var authService = {};

    authService.login = function (credentials) {
      return $http
        .post('/login', credentials)
        .then(function (res) {
          Session.create(res.data.id, res.data.user.id,
            res.data.user.role);
          return res.data.user;
        });
    };

    authService.isAuthenticated = function () {
      return !!Session.userId;
    };

    authService.isAuthorized = function (authorizedRoles) {
      if (!angular.isArray(authorizedRoles)) {
        authorizedRoles = [authorizedRoles];
      }
      return (authService.isAuthenticated() &&
        authorizedRoles.indexOf(Session.userRole) !== -1);
    };
    return authService;
  });

  angular.module('app-web').constant('AUTH_EVENTS', {
    loginSuccess: 'auth-login-success',
    loginFailed: 'auth-login-failed',
    logoutSuccess: 'auth-logout-success',
    sessionTimeout: 'auth-session-timeout',
    notAuthenticated: 'auth-not-authenticated',
    notAuthorized: 'auth-not-authorized'
  });

  angular.module('app-web').constant('USER_ROLE', {
    superAdmin: 'superAdmin',
    shopAdmin: 'shopAdmin',
    financeAdmin: 'financeAdmin',
    storageAdmin: 'storageAdmin',
    shopManager: 'shopManager'
  })

})();