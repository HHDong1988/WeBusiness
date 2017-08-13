(function () {
  'use strict';

  angular.module('app-web').controller('settleController', ['$rootScope', '$scope', '$location','userService', 'cartService', settleController]);

  function settleController($rootScope, $scope, $location,userService, cartService) {
    var vm = this;

    vm.onShowReceiverList = function () {
      vm.bShowReceierList = !vm.bShowReceierList;
    }

    vm.onSetReceiver = function (receiver) {
      vm.receiverName = receiver.name;
      vm.receiverTel = receiver.tel;
      vm.receiverAddr = receiver.addr;
      vm.postNum = receiver.postNum;
      vm.onShowReceiverList();
    }

    vm.getReceiverList = function () {
      userService.getAllReceivers().then(function (res) {
        
      },function (error) {
        
      })
    }

    vm.onOrderNow = function () {
      
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
        { name: '张三', tel: '1234567', addr: '大连', postNum: '0000000' },
        { name: '李四', tel: '1234567', addr: '大连', postNum: '0000000' },
        { name: '王五', tel: '1234567', addr: '大连', postNum: '0000000' },
        { name: '赵六', tel: '1234567', addr: '大连', postNum: '0000000' },
        { name: '周七', tel: '1234567', addr: '大连', postNum: '0000000' },
        { name: '吴八', tel: '1234567', addr: '大连', postNum: '0000000' }
      ];

      vm.getReceiverList();

    };

    vm.init();
  }

})();