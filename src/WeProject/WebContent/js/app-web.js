(function () {
  'use strict';

  angular.module('app-web', [, 'ngRoute', 'ngCookies'])
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
    .constant('USER_ROLES', {
      admin: 1,
      assistant: 2,
      accountant: 3,
      storeKeeper: 4,
      primaryAgency: 5,
      secondaryAgency: 6,
      superAdmin: 7
    })
    .constant('MENU_EVENT', {
      menuList: '1'
    })
    .constant('MENUS', {
      USER_MANAGEMENT: '1',
      PRODUCT_MANAGEMENT: '2',
      FINANCE_MANAGEMENT: '3',
      STOCK_MANAGEMENT: '4'
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
      var menuService = this;
      menuService.menus =  [{ value: '用户管理', href: '#!/userManagement', bActive: false },
      { value: '财务审计', href: '#!/financeManagement', bActive: false  },
      { value: '库存管理', href: '#!/stockManagement', bActive: false  },
      { value: '销售管理', href: '#!/salesInfo', bActive: false  },
      { value: '商品管理', href: '#!/productManagement', bActive: false  }];
      menuService.setMenuActive = function (index) {
        for (var i = 0; i < menuService.menus .length; i++) {
          var menu = menuService.menus [i];
          menu.bActive = false;
        }
        menuService.menus[index].bActive = true;
      }

      menuService.getMenus = function () {
        return $http.get('/api/menu').then(function (res) {
          angular.copy(res.data, menuService.menus);
        }, function (error) {

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
      var userService = this;
      userService.allPrimaryAgencies = [];
      userService.getAllUsers = function (page, pageSize, searchText) {
        var url = '/desktop/api/users?page=' + page + '&pageSize=' + pageSize;
        if (searchText) {
          url = url + "&searchText=" + '"' + searchText + '"';
        }
        return $http.get(url).then(function (res) {
          return res;
        }, function (error) {
          return error;
        });
      }
      userService.getAllPrimaryAgencies = function () {
        userService.getAllUsers(1, -1, "UserTypeID=5").then(function (res) {
          for (var i = 0; i < res.data.data.length; i++) {
            var user = res.data.data[i];
            userService.allPrimaryAgencies.push({ ID: user.ID.toString(), UserName: user.UserName });
          }
        }, function (error) {
          return error;
        })
      }
      userService.getAgencies = function (bPrimary) {
        var userID = 5;
        if (bPrimary) {
          userID = 5;
        }
        else {
          userID = 6;
        }
        return userService.getAllUsers(1, -1, "UserTypeID=" + userID).then(function (res) {
          return res;
        }, function (error) {
          return error;
        })
      }
      userService.getAllStoreKeeper = function () {
        return userService.getAllUsers(1, -1, "UserTypeID=4").then(function (res) {
          return res;
        }, function (error) {
          return error;
        })
      }
      userService.setPersonInfo = function (userData) {
        return $http.put('/desktop/api/users', userData).then(function (res) {
          return res;
        }, function (error) {
          return error;
        })
      }

      userService.syncUserData = function (userData) {
        return $http.post('/desktop/api/users', userData).then(function (res) {
          return res;
        }, function (error) {
          return error;
        });
      }

      userService.resetPassword = function (passwordData) {
        return $http.post('/desktop/api/password', passwordData).then(function (res) {
          return res;
        }, function (error) {
          return error;
        });
      }

    })
    .service('stockService', function ($http) {
      var stockService = this;
      stockService.getAllStocks = function (page, pageSize) {
        var url = '/desktop/api/stocks?page=' + page + '&pageSize=' + pageSize;

        return $http.get(url).then(function (res) {
          return res;
        }, function (error) {
          return error;
        });
      };

      stockService.syncStockData = function (stockData) {
        return $http.post('/desktop/api/stocks', stockData).then(function (res) {
          return res;
        }, function (error) {
          return error;
        });
      }
    })
    .service('purchaseService', function ($http) {
      var purchaseService = this;
      purchaseService.getAllPurchases = function (page, pageSize, stockID) {
        var url = '/desktop/api/purchase?page=' + page + '&pageSize=' + pageSize;

        return $http.get(url).then(function (res) {
          return res;
        }, function (error) {
          return error;
        });
      };

      purchaseService.syncPurchaseData = function (purchaseData) {
        return $http.post('/desktop/api/purchase', purchaseData).then(function (res) {
          return res;
        }, function (error) {
          return error;
        });
      }
    })
    .service('salesService', function ($http) {
      var salesService = this;
      salesService.getAllSales = function (page, pageSize, stockID) {

        var url = '/desktop/api/sales?page=' + page + '&pageSize=' + pageSize;

        return $http.get(url).then(function (res) {
          return res;
        }, function (error) {
          return error;

        });
      };
    })
    .service('financeService', function ($http) {
      var financeService = this;
      financeService.getAllBills = function (fromtime, endtime) {

        var url = '/desktop/api/bills?fromtime=' + fromtime + '&endtime=' + endtime;

        return $http.get(url).then(function (res) {
          return res;
        }, function (error) {
          return error;
        });
      };
      financeService.passAudit = function (id) {
        var url = '/desktop/api/bills';

        return $http.post(url, [{ cartid: id }]).then(function (res) {
          return res;
        }, function (error) {
          return error;
        });
      }
      financeService.deleteCart = function (id) {
        var url = '/desktop/api/bills?cartID=' + id;

        return $http.delete(url).then(function (res) {
          return res;
        }, function (error) {
          return error;
        });

      }
      financeService.getAllPassAuditBills = function () {
        var url = '/desktop/api/postinfo';

        return $http.get(url).then(function (res) {
          return res;
        }, function (error) {
          return error;
        });
      }
      financeService.deliverBill = function (deliverInfo) {
        var url = '/desktop/api/postinfo';
        return $http.post(url, deliverInfo).then(function (res) {
          return res;
        }, function (error) {
          return error;
        });
      }
    })
    .service('salesProductService', function ($http) {
      var salesProductService = this;
      var onSaleProduct = { ID: 0, Name: '' };
      salesProductService.setOnSaleProudct = function (id, name) {
        onSaleProduct.ID = id;
        onSaleProduct.Name = name;
      }
      salesProductService.getOnSaleProudct = function () {
        return onSaleProduct;
      }
      salesProductService.onSale = function (onSaleData) {
        var url = '/desktop/api/sales';
        return $http.post(url, onSaleData).then(function (res) {
          return res;
        }, function (error) {
          return error;
        });
      }
      salesProductService.offSale = function (id) {
        var url = '/desktop/api/sales?id='+id;
        return $http.delete(url).then(function (res) {
          return res;
        }, function (error) {
          return error;
        });
      }
      salesProductService.getAllProducts = function (page, pageSize) {
        var url = '/desktop/api/sales?page=' + page + '&pageSize=' + pageSize;
        return $http.get(url).then(function (res) {
          return res;
        }, function (error) {
          return error;
        })
      }
      salesProductService.getProductDetail = function (saleProductID) {
        var url = '/desktop/api/sales?ID=' + saleProductID;
        return $http.get(url).then(function (res) {
          return res;
        }, function (error) {
          return error;
        })
      }
    })
    .service('productService', function ($http) {
      var productService = this;
      productService.productID = 0;

      productService.getAllProducts = function (page, pageSize) {
        var url = '/desktop/api/sales?page=' + page + '&pageSize=' + pageSize;
        return $http.get(url).then(function (res) {
          return res;
        }, function (error) {
          return error;
        })
      }

      productService.getProductDetail = function () {
        var url = '/desktop/api/sales?ID=' + productService.productID;
        return $http.get(url).then(function (res) {
          return res;
        }, function (error) {
          return error;
        })
      }

      productService.getProductDetail2 = function (saleProductID) {
        var url = '/desktop/api/sales?ID=' + saleProductID;
        return $http.get(url).then(function (res) {
          return res;
        }, function (error) {
          return error;
        })
      }
    })
    .service('salesStatisticsService', function ($http) {
      var salesStatisticsService = this;
      salesStatisticsService.getStatistics = function (startTime, endTime, productID) {
        var url = '/desktop/api/salesStatistics?startTime=' + startTime + '&endTime=' + endTime;
        if (productID) {
          url = url + "&productID=" + productID;
        }
        return $http.get(url).then(function (res) {
          return res;
        }, function (error) {
          return error;
        });
      };
    })

    .factory('authService', function ($q, $http, sessionService, AUTH_MESSAGE_ZH) {
      var authService = {};
      authService.logIn = function (credentials) {
        return $http.post('/desktop/api/login', credentials).then(function (res) {
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
        return $http.post('/desktop/api/logoff').then(function (res) {
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
    .directive('treeView', function () {
      return {
        restrict: 'E',
        templateUrl: 'views/treeView.html',
        scope: {
          treeData: '=',
          canChecked: '=',
          textField: '@',
          itemClicked: '&',
          itemCheckedChanged: '&',
          itemTemplateUrl: '@'
        },
        controller: ['$scope', function ($scope) {
          $scope.itemExpended = function (item, $event) {
            item.$$isExpend = !item.$$isExpend;
            $event.stopPropagation();
          };

          $scope.getItemIcon = function (item) {
            var isLeaf = $scope.isLeaf(item);
            return item.icon;
          };

          $scope.isLeaf = function (item) {
            return !item.children || !item.children.length;
          };

          $scope.warpCallback = function (callback, item, $event) {
            ($scope[callback] || angular.noop)({
              $item: item,
              $event: $event
            });
          };
        }]
      };
    }).directive('pieChart', function ($window) {
      return {
        restrict: 'A',
        link: function ($scope, element, attrs) {
          var myChart = echarts.init(element[0]);
          $scope.$watch(attrs.eData, function (newValue, oldValue, scope) {
            var legend = [];
            angular.forEach(newValue, function (val) {
              legend.push(val.name);
            });
            var option = {
              title: {
                text: '销售统计',
                subtext: attrs.eTitle,
                x: 'center'
              },
              tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
              },
              series: [{
                name: 'Alarm',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: newValue,
                itemStyle: {
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }]
            };
            myChart.setOption(option);
          }, true);
          window.addEventListener("resize", function () {
            myChart.resize();
          });
        }
      };
    }).directive('lineChart', function ($window) {
      return {
        restrict: 'A',
        link: function ($scope, element, attrs) {
          var myChart = echarts.init(element[0]);
          $scope.$watch(attrs.eData, function (newValue, oldValue, scope) {
            var legend = [];
            var data1 = [];
            var data2 = [];
            angular.forEach(newValue.yData, function (val) {
              legend.push(val.name);
            });
            angular.copy(newValue.yData[0].data, data1);
            angular.copy(newValue.yData[1].data, data2);
            var option = {
              title: {
                text: '销售统计',
                subtext: attrs.eTitle,
                x: 'center'
              },
              tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
              },
              legend: {
                left: 'left',
                data: legend
              },
              xAxis: {
                type: 'category',
                name: 'x',
                splitLine: { show: false },
                data: newValue.xData
              },
              yAxis: {
                type: 'log',
                name: 'y'
              },
              grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
              },
              series: [
                {
                  name: legend[0],
                  type: 'line',
                  data: data1,
                },
                {
                  name: legend[1],
                  type: 'line',
                  data: data2,
                }]
            };
            myChart.setOption(option);
          }, true);
          window.addEventListener("resize", function () {
            myChart.resize();
          });
        }
      };
    })
    .factory('fileReader', function ($q) {
      var onLoad = function (reader, deferred, scope) {
        return function () {
          scope.$apply(function () {
            deferred.resolve(reader.result);
          });
        };
      };

      var onError = function (reader, deferred, scope) {
        return function () {
          scope.$apply(function () {
            deferred.reject(reader.result);
          });
        };
      };

      var onProgress = function (reader, scope) {
        return function (event) {
          scope.$broadcast("fileProgress",
            {
              total: event.total,
              loaded: event.loaded
            });
        };
      };

      var getReader = function (deferred, scope) {
        var reader = new FileReader();
        reader.onload = onLoad(reader, deferred, scope);
        reader.onerror = onError(reader, deferred, scope);
        reader.onprogress = onProgress(reader, scope);
        return reader;
      };

      var readAsDataURL = function (file, scope) {
        var deferred = $q.defer();

        var reader = getReader(deferred, scope);
        reader.readAsDataURL(file);

        return deferred.promise;
      };

      return {
        readAsDataUrl: readAsDataURL
      };
    })
    .directive("ngFileSelect", function () {

      return {
        restrict: 'A',
        scope: {
          fileVm: '=',
          fileIndex: '='
        },
        link: function (scope, el) {
          el.bind("change", function (e) {
            scope.fileVm.file = (e.srcElement || e.target).files[0];
            scope.fileVm.getFile(scope.fileIndex);
          })
        }
      }
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

      $routeProvider.when('/stockManagement', {
        controller: 'stockManageController',
        controllerAs: 'vm',
        templateUrl: 'views/wbStockManagement.html'
      });
      $routeProvider.when('/financeManagement', {
        controller: 'financeManageController',
        controllerAs: 'vm',
        templateUrl: 'views/wbFinanceManage.html'
      });

      $routeProvider.when('/onSale', {
        controller: 'onSaleController',
        controllerAs: 'vm',
        templateUrl: 'views/wbOnSale.html'
      });

      $routeProvider.when('/productManagement', {
        controller: 'productManageController',
        controllerAs: 'vm',
        templateUrl: 'views/wbProductManagement.html'
      });

      $routeProvider.when('/productList', {
        controller: 'productListController',
        controllerAs: 'vm',
        templateUrl: 'views/productList.html'
      });

      $routeProvider.when('/purchaseInfo', {
        controller: 'purchaseInfoController',
        controllerAs: 'vm',
        templateUrl: 'views/purchaseInfo.html'
      });
      $routeProvider.when('/salesInfo', {
        controller: 'salesInfoController',
        controllerAs: 'vm',
        templateUrl: 'views/salesInfo.html'
      });

      $routeProvider.when('/salesStatics', {
        controller: 'salesStaticsController',
        controllerAs: 'vm',
        templateUrl: 'views/salesStatics.html'
      });

      $routeProvider.when('/outOfStore', {
        controller: 'outOfStoreController',
        controllerAs: 'vm',
        templateUrl: 'views/outOfStore.html'
      });

      $routeProvider.when('/resetpassword', {
        controller: 'personalInfoController',
        controllerAs: 'appVm',
        templateUrl: 'views/wbResetPassword.html'
      });


      $routeProvider.when('/setPersonalInfo', {
        controller: 'personalInfoController',
        controllerAs: 'appVm',
        templateUrl: 'views/wbSetPersonalInfo.html'
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
    .run(function (sessionService, userService, menuService, AUTH_EVENTS, MENU_EVENT, $rootScope, $cookieStore, $cookies) {
      // var currentUser = $cookies.get('username');
      // if (!currentUser) {
      //   sessionService.destroy();
      //   return;
      // }
      // userService.getAllPrimaryAgencies();
      // var currentUserRole = $cookies.get('usertypeid')
      // sessionService.createUserInfo(0, currentUser, currentUserRole);
      // $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, { userID: currentUser, userRole: currentUserRole });
    });
})();