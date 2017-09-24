(function () {
  'use strict';

  angular.module('app-web', ['ngRoute', 'ngCookies', 'file-model'])
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
    .constant('AUTH_MESSAGE_ZH', {
      loginSuccess: '登陆成功',
      loginError: '登陆失败，用户名或密码错误'
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
    .service('userService', function ($http) {
      var userService = this;
      userService.setPersonInfo = function (userData) {
        return $http.put('/mobile/api/users', userData).then(function (res) {
          return res;
        }, function (error) {
          return error;
        })
      }
      userService.resetPassword = function (passwordData) {
        return $http.post('/mobile/api/password', passwordData).then(function (res) {
          return res;
        }, function (error) {
          return error;
        });
      }
    })
    .service('productService', function ($http) {
      var productService = this;
      productService.productID = 0;

      productService.getAllProducts = function (page, pageSize) {
        var url = '/mobile/api/products?page=' + page + '&pageSize=' + pageSize;
        return $http.get(url).then(function (res) {
          return res;
        }, function (error) {
          return error;
        })
      }

      productService.getProductDetail = function () {
        var url = '/mobile/api/products?ID=' + productService.productID;
        return $http.get(url).then(function (res) {
          return res;
        }, function (error) {
          return error;
        })
      }

      productService.getProductDetail2 = function (saleProductID) {
        var url = '/mobile/api/products?ID=' + saleProductID;
        return $http.get(url).then(function (res) {
          return res;
        }, function (error) {
          return error;
        })
      }
    })
    .service('cartService', function ($http) {
      var cartService = this;
      var products = [];

      cartService.addToCart = function (ID, img, des, title, price, count) {
        var product = { productID: ID, productImg: img, productDescription: des, productTitle: title, productPrice: price, productCount: count };
        products.push(product);
      }
      cartService.getItemCount = function () {
        return products.length;
      }
      cartService.getAllItems = function () {
        return products;
      }
      cartService.orderNow = function (order) {
        var url = '/mobile/api/orders';
        return $http.post(url, order).then(function (res) {
          return res;
        }, function (error) {
          return error;
        })
      }
      cartService.clearCart = function () {
        products = [];
      }

      cartService.removeProduct = function (id) {
        var index = -1;
        for (var i = 0; i < products.length; i++) {
          var product = products[i];
          if (id == product.productID) {
            index = i;
            break;
          }
        }
        if (index != -1) {
          products.splice(index,1);
        }
      }
      cartService.updateCurrentAmount = function (errorProduct) {
        for (var i = 0; i < errorProduct.length; i++) {
          var product = errorProduct[i];

          for (var j = 0; j < products.length; j++) {
            var prod = products[j];
            if (product.SaleProductID == prod.productID) {
              prod.CurrentAmount = product.CurrentAmount;
            }
          }
        }
      }
    })
    .service('receiversService', function ($http) {
      var receiversService = this;
      var receiver = null;
      var editReceiver = null;
      var receivers = [
        { ID: 1, Name: '张三', Tel: '1234567', Address: '大连市高新园区 中铁诺德滨海花园' },
        { ID: 2, Name: '李四', Tel: '1234567', Address: '大连市高新园区 中铁诺德滨海花园' },
        { ID: 3, Name: '王五', Tel: '1234567', Address: '大连市高新园区 中铁诺德滨海花园' },
        { ID: 4, Name: '赵六', Tel: '1234567', Address: '大连市高新园区 中铁诺德滨海花园' },
        { ID: 5, Name: '周七', Tel: '1234567', Address: '大连市高新园区 中铁诺德滨海花园' },
        { ID: 6, Name: '吴八', Tel: '1234567', Address: '大连市高新园区 中铁诺德滨海花园' }
      ];

      receiversService.getReceivers = function () {
        return receivers;
      }

      receiversService.getAllReceivers = function () {
        var url = '/mobile/api/orderreceiver';
        return $http.get(url).then(function (res) {
          angular.copy(res.data.data, receivers);
          return receivers;
        }, function (error) {
          return error;
        });
      }

      receiversService.saveReceiver = function (receiverData) {
        var url = '/mobile/api/orderreceiver';
        return $http.post(url, receiverData).then(function (res) {
          return res;
        }, function (error) {
          return error;
        });
      }
    })
    .service('orderService', function ($http) {
      var orderService = this;
      var orders = null;

      orderService.getAllOrders = function () {
        var url = '/mobile/api/orders?page=1&pageSize=-1';
        return $http.get(url).then(function (res) {
          return res;
        }, function (error) {
          return error;
        });
      }
    })
    .factory('authService', function ($q, $http, sessionService, AUTH_MESSAGE_ZH) {
      var authService = {};
      authService.logIn = function (credentials) {
        return $http.post('/mobile/api/login', credentials).then(function (res) {
          if (res.data.data.length == 0) {
            return { userID: '', userRole: '', bNewUser: false, message: AUTH_MESSAGE_ZH.loginError };
          }
          sessionService.createUserInfo(0, res.data.data[0].UserName, res.data.data[0].UserTypeID);
          var bNewUser = res.data.data[0].LastLoginTime == undefined ? true : false;
          return { userID: res.data.data[0].UserName, userRole: res.data.data[0].UserTypeID, bNewUser: bNewUser, message: AUTH_MESSAGE_ZH.loginSuccess };
        }, function (error) {
          return error;
        });
      };

      authService.logOff = function () {
        return $http.post('/mobile/api/logoff').then(function (res) {
          sessionService.destroy();
          return { res };
        }, function (error) {
          return error;
        });
      }

      authService.isAuthenticated = function () {
        return sessionService.userId != 0;
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
    .config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
      $routeProvider.when('/', {
        controller: 'productListController',
        controllerAs: 'vm',
        templateUrl: 'views/productList.html'
      });

      $routeProvider.when('/login', {
        controller: 'loginController',
        controllerAs: 'vm',
        templateUrl: 'views/login.html'
      });

      $routeProvider.when('/productList', {
        controller: 'productListController',
        controllerAs: 'vm',
        templateUrl: 'views/productList.html'
      });

      $routeProvider.when('/productDetail', {
        controller: 'productDetailController',
        controllerAs: 'vm',
        templateUrl: 'views/productDetail.html'
      });

      $routeProvider.when('/shoppingCart', {
        controller: 'shoppingCartController',
        controllerAs: 'vm',
        templateUrl: 'views/shoppingCart.html'
      });

      $routeProvider.when('/settle', {
        controller: 'settleController',
        controllerAs: 'vm',
        templateUrl: 'views/settle.html'
      });

      $routeProvider.when('/selfInfo', {
        controller: 'selfInfoController',
        controllerAs: 'vm',
        templateUrl: 'views/selfInfo.html'
      });

      $routeProvider.when('/receivers', {
        controller: 'receiversController',
        controllerAs: 'vm',
        templateUrl: 'views/receivers.html'
      });

      $routeProvider.when('/editReceiver', {
        controller: 'editReceiverController',
        controllerAs: 'vm',
        templateUrl: 'views/editReceiver.html'
      });

      $routeProvider.when('/orders', {
        controller: 'ordersController',
        controllerAs: 'vm',
        templateUrl: 'views/orders.html'
      });

      $routeProvider.otherwise({ redirectTo: "/" });

      $httpProvider.defaults.withCredentials = true;
      $httpProvider.interceptors.push([
        '$injector',
        function ($injector) {
          return $injector.get('authInterceptor');
        }
      ]);
    }]).run(function ($rootScope, $location, productService) {
      $rootScope.$on('$locationChangeStart', function (event, next, current) {
        var path = /#!\/productDetail\/(\d+)+/i.exec(next);
        if (path && path[1]) {
          productService.productID = path[1];
          $location.path('/productDetail');
        }
      });
    });
})();