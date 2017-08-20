(function () {
  'use strict';

  angular.module('app-web').controller('ordersController', ['$rootScope', '$scope', '$location', 'orderService', ordersController]);

  function ordersController($rootScope, $scope, $location, orderService) {
    var vm = this;

    vm.getAllOrders = function () {
      orderService.getAllOrders().then(function (res) {

      }, function (error) {
      
      });
    }
    vm.init = function () {
      vm.language = new LanguageUtility();
      vm.tittle = vm.language.LOGIN;

      vm.orders = [
        { ReciverName: '张三', ProductName: '咸鸭蛋', OrderTime: '订货时间', img: '/img/xianyadan.jpg', description: '咸鸭蛋', productAmount: 10, price: 2000 },
        { ReciverName: '张三', ProductName: '咸鸭蛋', OrderTime: '订货时间', img: '/img/xianyadan.jpg', description: '咸鸭蛋', productAmount: 10, price: 2000 },
        { ReciverName: '张三', ProductName: '咸鸭蛋', OrderTime: '订货时间', img: '/img/xianyadan.jpg', description: '咸鸭蛋', productAmount: 10, price: 2000 },
        { ReciverName: '张三', ProductName: '咸鸭蛋', OrderTime: '订货时间', img: '/img/xianyadan.jpg', description: '咸鸭蛋', productAmount: 10, price: 2000 }
      ];
      vm.getAllOrders();
    };

    vm.init();
  }

})();