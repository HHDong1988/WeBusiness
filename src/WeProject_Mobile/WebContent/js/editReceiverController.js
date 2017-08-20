(function () {
  'use strict';

  angular.module('app-web').controller('editReceiverController', ['$rootScope', '$scope', '$location','receiversService', editReceiverController]);

  function editReceiverController($rootScope, $scope, $location,receiversService) {
    var vm = this;

    vm.onClickBack = function () {
      history.back();
    }

    vm.onSelectReceiver = function (receiver) {
      receiversService.receiver = {Name:receiver.Name,Tel:receiver.Tel,Address:receiver.Address};
      history.back();
    }

    vm.onSave = function () {
      receiversService.saveReceiver(vm.receiver).then(function (res) {
        
      },function (then) {
        
      });
      history.back();
    }
 
    vm.init = function () {
      vm.language = new LanguageUtility();
      vm.tittle = vm.language.LOGIN;

      vm.receiver = receiversService.editReceiver;
    };

    vm.init();
  }

})();