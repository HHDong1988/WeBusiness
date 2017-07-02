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
      notAuthorized: 'auth-not-authorized',
      gotCookie: 'gotCookie'
    })
    .constant('USER_ROLES', {
      admin: '1',
      assistant: '2',
      accountant: '3',
      storeKeeper: '4',
      primaryAgency: '5',
      secondaryAgency: '6',
      superAdmin: '7'
    })
    .constant('MENU_EVENT', {
      menuList: '1'
    })
    .constant('MENUS', {
      USER_MANAGEMENT: '1',
      PRODUCT_MANAGEMENT: '2',
      FINANCE_MANAGEMENT: '3',
      STORAGE_MANAGEMENT: '4'
    })
    .constant('PAGE_SIZE_OPTIONS', [10, 20, 50, 100])
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
      this.sessionID = 0;
      this.userId = 0;
      this.userRole = 0;
      this.createUserInfo = function (sessionID, userId, userRole) {
        this.sessionID = sessionID;
        this.userId = userId;
        this.userRole = userRole;
        $window.sessionStorage["userInfo"] = JSON.stringify({ sessionID: this.sessionID, userID: this.user, userRole: this.userRole });
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
    .service('menuService', function ($http) {
      this.menus = [];
      this.getMenu = function () {
        return $http.get('/api/menu').then(function (res) {
          return res;
        }, function (error) {
          return error;
        });
      };
    })
    .service('passwordGenerator', function () {
      this.createRandomPassword = function (length) {
        var text = ['abcdefghijklmnopqrstuvwxyz', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', '1234567890', '~!@#$%^&*+?'];
        var rand = function (min, max) { return Math.floor(Math.max(min, Math.random() * (max + 1))); }
        var len = length;
        var pw = '';
        for (var i = 0; i < len; ++i) {
          var strpos = rand(0, 3);
          pw += text[strpos].charAt(rand(0, text[strpos].length));
        }
        return pw;
      }
    })
    .service('userService', function ($http) {
      this.getAllUsers = function (page, pageSize) {
        var url = '/api/users?page=' + page + '&pageSize=' + pageSize;
        return $http.get(url).then(function (res) {
          return res;
        }, function (error) {
          return error;
        });
      }

      this.setPersonInfo = function (userData) {
        return $http.put('/api/users', userData).then(function (res) {
          return res;
        }, function (error) {
          return error;
        })
      }

      this.syncUserData = function (userData) {
        return $http.post('/api/users', userData).then(function (res) {
          return res;
        }, function (error) {
          return error;
        });
      }

      this.resetPassword = function (passwordData) {
        return $http.post('/api/password', passwordData).then(function (res) {
          return res;
        }, function (error) {
          return error;
        });
      }

    })
    .factory('authService', function ($q, $http, sessionService) {
      var authService = {};
      authService.logIn = function (credentials) {
        return $http.post('/api/login', credentials).then(function (res) {
          sessionService.createUserInfo(0, res.data.data[0].UserName, res.data.data[0].UserTypeID);
          var bNewUser = res.data.data[0].LastLoginTime == undefined ? true:false;
          return { userID: res.data.data[0].UserName, userRole: res.data.data[0].UserTypeID, bNewUser: bNewUser};
        }, function (error) {
          return error;
        });
      };

      authService.logOff = function () {
        return $http.post('/api/logoff').then(function (res) {
          sessionService.destroy();
          return { res };
        }, function (error) {
          return error;
        });
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
    .service('toastService', function () {
        this.toast = function (level, message, title) {
          toastr.options = {
            closeButton: false,
            debug: false,
            progressBar: false,
            positionClass: "toast-top-center",
            onclick: null,
            showDuration: "300",
            hideDuration: "1000",
            timeOut: "5000",
            extendedTimeOut: "1000",
            showEasing: "swing",
            hideEasing: "linear",
            showMethod: "fadeIn",
            hideMethod: "fadeOut"
          };

        var $toast = toastr[level](message, title);  
        }

    })
    .directive('wbLogin', function (AUTH_EVENTS) {
      return {
        restrict: 'E',
        templateUrl: 'views/wbLogin.html',
        scope: {
          appVm: '='
        }
      };
    })
    .directive('wbResetPassword', function () {
      return {
        restrict: 'E',
        templateUrl: 'views/wbResetPassword.html',
        scope: {
          appVm: '='
        }
      };
    })
    .config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
      $routeProvider.when('/', {
        controller: 'homeController',
        controllerAs: 'vm',
        templateUrl: 'views/wbHome.html'
      });

      $routeProvider.when('/userManagement', {
        controller: 'userManageController',
        controllerAs: 'vm',
        templateUrl: 'views/wbUserManagement.html'
      });

      $routeProvider.when('/storageManagement', {
        controller: 'storageManageController',
        controllerAs: 'vm',
        templateUrl: 'views/wbStorageManagement.html'
      });

      $routeProvider.when('/personInfo', {
        controller: 'storageManageController',
        controllerAs: 'vm',
        templateUrl: 'views/wbStorageManagement.html'
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
    .run(function (sessionService, menuService, AUTH_EVENTS, MENU_EVENT, $rootScope, $cookieStore, $cookies) {

      var currentUser = $cookies.get('username');
      if (!currentUser) {
        sessionService.destroy();
        return;
      }

      menuService.getMenu().then(function (res) {
        menuService.menus = res.data.data;
        $rootScope.$broadcast(MENU_EVENT.menuList, { menuList: menuService.menus });
      }, function (error) {
        $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
      });

      var currentUserRole = $cookies.get('usertypeid')
      sessionService.createUserInfo(0, currentUser, currentUserRole);

      $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, { userID: currentUser, userRole: currentUserRole });
    });



})();