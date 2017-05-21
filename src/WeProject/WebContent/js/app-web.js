(function () {
  'use strict';

  angular.module('app-web', ['ngRoute', 'ngCookies'])
    .constant('AUTH_EVENTS', {
      loginSuccess: 'auth-login-success',
      loginFailed: 'auth-login-failed',
      logoutSuccess: 'auth-logout-success',
      logoutFailed: 'auth-logout-failed',
      sessionTimeout: 'auth-session-timeout',
      notAuthenticated: 'auth-not-authenticated',
      notAuthorized: 'auth-not-authorized'
    })
    .constant('USER_ROLE', {
      superAdmin: 'superAdmin',
      shopAdmin: 'shopAdmin',
      financeAdmin: 'financeAdmin',
      storageAdmin: 'storageAdmin',
      shopManager: 'shopManager',
      distributerL1: 'distributerL1',
      distributerL2: 'distributerL2'
    })
    .factory('authInterceptor', function ($rootScope, $q,
      AUTH_EVENTS) {
      return {
        request: function (config) {
          return config;
        },
        requestError: function (err) {
          return $q.reject(err);
        },
        response: function (res) {
          return res;
        },
        responseError: function (response) {
          $rootScope.$broadcast({
            401: AUTH_EVENTS.notAuthenticated,
            403: AUTH_EVENTS.notAuthorized,
            419: AUTH_EVENTS.sessionTimeout,
            440: AUTH_EVENTS.sessionTimeout
          }[response.status], response);
          return $q.reject(response);
        }
      };
    })
    .service('sessionService', function ($window) {
      this.createUserInfo = function (userInfo) {
        this.sessionID = userInfo.sessionID;
        this.userId = userInfo.user.userId;
        this.userRole = userInfo.user.userRole;
        $window.sessionStorage["userInfo"] = JSON.stringify(userInfo);
      };
      this.getStorageUerInfo = function () {
        var userInfo = JSON.parse($window.sessionStorage["userInfo"]);
        return userInfo;
      }
      this.destroy = function () {
        this.sessionID = null;
        this.userId = null;
        this.userRole = null;
      };
      return this;
    })
    .factory('authService', function ($q, $http, sessionService) {
      var authService = {};
      var userInfo = {
         user: { 
           userID: '', 
           userRole: '' 
          }, 
         sessionID:'' 
        };

      // authService.logIn = function (credentials) {
      //   var deferred = $q.defer();
      //   $http.post('/WeBusiness/api/login', credentials).then(function (res) {
      //     userInfo.userID = res.data.UserName;
      //     userInfo.userRole = res.data.UserTypeID;
      //     userInfo.sessionID = 1;
      //     sessionService.createUserInfo(userInfo);
      //     deferred.resolve(userInfo.user);
      //   }, function (error) {
      //     deferred.reject(error);
      //   });
        authService.logIn = function (credentials) {
        return $http.post('/WeBusiness/api/login', credentials).then(function (res) {
          userInfo.user.userID = res.data.UserName;
          userInfo.user.userRole = res.data.UserTypeID;
          userInfo.sessionID = 1;
          sessionService.createUserInfo(userInfo);
          return userInfo.user;
        });
      };

      authService.logOut = function () {
        var deferred = $q.defer();
        $http.delete('/api/login', credentials).then(function (res) {
          userInfo = null;
          sessionService.destroy();
          deferred.resolve(res);
        }, function (error) {
          deferred.reject(error);
        });
      }

      authService.checkToken = function (token) {
        var deferred = $q.defer();
        $http.get('/api/login', token).then(function (res) {
          sessionService.createUserInfo(res.data.id, res.data.user.id,
            res.data.user.role);
          userInfo = res;
          deferred.resolve(userInfo);
        }, function (error) {
          deferred.reject(error);
        });

        return deferred.promiss;
      }

      authService.isAuthenticated = function () {
        return !!sessionService.userId;
      };

      authService.isAuthorized = function (authorizedRoles) {
        if (!angular.isArray(authorizedRoles)) {
          authorizedRoles = [authorizedRoles];
        }
        return (authService.isAuthenticated() &&
          authorizedRoles.indexOf(sessionService.userRole) !== -1);
      };
      return authService;
    })
    .directive('wbLogin', function (AUTH_EVENTS) {
      return {
        restrict: 'E',
        templateUrl: 'views/wbLogin.html',
        scope: {
          userData: '=',
          loginFunc: '&'
        }
      };
    })
    .config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
      $routeProvider.when('/', {
        controller: 'loginController',
        controllerAs: 'vm',
        templateUrl: 'views/wbHome.html'
      });

      $routeProvider.otherwise({ redirectTo: "/" });

      $httpProvider.defaults.withCredentials = true;
      $httpProvider.interceptors.push([
        '$injector',
        function ($injector) {
          return $injector.get('authInterceptor');
        }
      ]);
    }])
    .run(function (sessionService, $cookieStore) {

      var userInfo = $cookieStore.get('userInfo');
      if (!userInfo) {
        sessionService.destroy();
        return;
      }

      sessionService.createUserInfo(userInfo);
    });



})();