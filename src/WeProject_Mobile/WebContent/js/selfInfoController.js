(function () {
  'use strict';

  angular.module('app-web').controller('selfInfoController', ['$rootScope', '$scope', '$location', 'userService', 'cartService', selfInfoController]);

  function selfInfoController($rootScope, $scope, $location, userService, cartService) {
    var vm = this;

    vm.onGotoMyOrders = function () {
      var path = '/orders';
      $location.path(path);
    }

    vm.onGotoMyReceivers = function () {
      var path = '/receivers';
      $location.path(path);
    }

    vm.init = function () {
      vm.language = new LanguageUtility();
      vm.tittle = vm.language.LOGIN;


    };

    vm.init();
  }

})();