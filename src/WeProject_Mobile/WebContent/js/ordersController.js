(function () {
  'use strict';

  angular.module('app-web').controller('ordersController', ['$rootScope', '$scope', '$location', 'orderService', 'productService', ordersController]);

  function ordersController($rootScope, $scope, $location, orderService, productService) {
    var vm = this;

    vm.getAllOrders = function () {
      orderService.getAllOrders().then(function (res) {
        angular.copy(res.data.data, vm.orders);
        for (var i = 0; i < vm.orders.length; i++) {
          var order = vm.orders[i];
          order['img']= "";
          order['description'] = "";
          vm.getOrderDetail(order);
        }
      }, function (error) {

      });
    }
    vm.getOrderDetail = function (order) {

      productService.getProductDetail2(order.SaleProductID).then(function (res) {
        order.img =  res.data.data[0].Picture1;
        order.description = res.data.data[0].Description;
      }, function (error) {

      });
    }
    vm.init = function () {
      vm.language = new LanguageUtility();
      vm.tittle = vm.language.LOGIN;

      vm.orders = [];
      vm.getAllOrders();
    };

    vm.init();
  }

})();