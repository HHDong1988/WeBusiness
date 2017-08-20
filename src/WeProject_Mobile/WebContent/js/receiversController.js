(function () {
  'use strict';

  angular.module('app-web').controller('receiversController', ['$rootScope', '$scope', '$location','receiversService', receiversController]);

  function receiversController($rootScope, $scope, $location,receiversService) {
    var vm = this;

    vm.getReceiverList = function () {
      receiversService.getAllReceivers().then(function (res) {
      },function (error) {
        
      })
    }

    vm.onSelectReceiver = function (receiver) {
      receiversService.receiver = {Name:receiver.Name,Tel:receiver.Tel,Address:receiver.Address};
      history.back();
    }

    vm.onEditReceiver = function (receiver) {
      receiversService.editReceiver = receiver;
      var path = '/editReceiver';
      $location.path(path);
    }

    vm.onCreateReceiver = function () {
      receiversService.editReceiver = {ID:0, Name:'',Tel:'',Address:''};
      var path = '/editReceiver';
      $location.path(path);
    }
 
    vm.init = function () {
      vm.language = new LanguageUtility();
      vm.tittle = vm.language.LOGIN;

      vm.receivers = receiversService.getReceivers();

      vm.getReceiverList();

    };

    vm.init();
  }

})();