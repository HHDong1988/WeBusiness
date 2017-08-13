(function () {
  'use strict';

  angular.module('app-web').controller('settleController', ['$rootScope', '$scope', '$location','userService', 'cartService', settleController]);

  function settleController($rootScope, $scope, $location,userService, cartService) {
    var vm = this;

    vm.onShowReceiverList = function () {
      vm.bShowReceierList = !vm.bShowReceierList;
    }

    vm.onSetReceiver = function (receiver) {
      vm.receiverName = receiver.Name;
      vm.receiverTel = receiver.Tel;
      vm.receiverAddr = receiver.Address;
      vm.postNum = receiver.PostNum;
      vm.onShowReceiverList();
    }

    vm.getReceiverList = function () {
      userService.getAllReceivers().then(function (res) {
        vm.receivers = [];
        angular.copy(res.data.data, vm.receivers);
      },function (error) {
        
      })
    }

    vm.onOrderNow = function () {
      var order = new Object();
      order.ReceiverName = vm.receiverName;
      order.ReceiverAddr = vm.receiverAddr;
      order.ReceiverTel = vm.receiverTel;
      order.PostNum = vm.postNum;
      order.Orders = [];
      for (var i = 0; i < vm.products .length; i++) {
        var product = vm.products [i];
        var singleOrder = {SaleProductID: parseInt(product.productID), Amount:product.productCount};
        order.Orders.push(singleOrder);
      }

      cartService.orderNow(order).then(function (res) {
        cartService.clearCart();
        $location.path('/')
      },function (error) {
        
      })
    }

    vm.init = function () {
      vm.language = new LanguageUtility();
      vm.tittle = vm.language.LOGIN;

      vm.products = cartService.getAllItems();

      vm.receiverName = '';
      vm.receiverTel = '';
      vm.receiverAddr = '';
      vm.postNum = '';

      vm.bShowReceierList = false;

      vm.receivers = [
        { Name: '张三', Tel: '1234567', Address: '大连', PostNum: '0000000' },
        { Name: '李四', Tel: '1234567', Address: '大连', PostNum: '0000000' },
        { Name: '王五', Tel: '1234567', Address: '大连', PostNum: '0000000' },
        { Name: '赵六', Tel: '1234567', Address: '大连', PostNum: '0000000' },
        { Name: '周七', Tel: '1234567', Address: '大连', PostNum: '0000000' },
        { Name: '吴八', Tel: '1234567', Address: '大连', PostNum: '0000000' }
      ];

      vm.getReceiverList();

    };

    vm.init();
  }

})();