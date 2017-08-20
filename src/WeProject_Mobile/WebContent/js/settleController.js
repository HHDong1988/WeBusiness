(function () {
  'use strict';

  angular.module('app-web').controller('settleController', ['$rootScope', '$scope', '$location', 'receiversService', 'cartService', settleController]);

  function settleController($rootScope, $scope, $location, receiversService, cartService) {
    var vm = this;

    vm.onOrderNow = function () {
      var order = new Object();
      order.ReceiverName = vm.receiver.Name;
      order.ReceiverAddr = vm.receiver.Address;
      order.ReceiverTel = vm.receiver.Tel;
      order.Orders = [];
      for (var i = 0; i < vm.products.length; i++) {
        var product = vm.products[i];
        var singleOrder = { SaleProductID: parseInt(product.productID), Amount: product.productCount };
        order.Orders.push(singleOrder);
      }

      cartService.orderNow(order).then(function (res) {
        if (res.data.success == false) {
          cartService.updateCurrentAmount(res.data.data);
          var path = '/shoppingCart';
          $location.path(path);
        } else {
          cartService.clearCart();
          var path = '/orders';
          $location.path(path);
        }

      }, function (error) {

      })
    }

    vm.init = function () {
      vm.language = new LanguageUtility();
      vm.tittle = vm.language.LOGIN;

      vm.products = cartService.getAllItems();

      vm.receiver = receiversService.receiver;
    };

    vm.init();
  }

})();