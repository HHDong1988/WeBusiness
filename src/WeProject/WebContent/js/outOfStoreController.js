(function () {
  'use strict';

  angular.module('app-web').controller('outOfStoreController', ['$scope', 'PAGE_SIZE_OPTIONS', 'financeService', outOfStoreController])

  function outOfStoreController($scope, PAGE_SIZE_OPTIONS, financeService) {
    var vm = this;
    
    vm.deliverOrder = function (tel) {
      vm.deliverInfo.ReceiverTel = tel;
      $('#confirmDeliverModal').modal();

    }

    vm.confirmDeliver = function () {
      financeService.deliverBill(vm.deliverInfo).then(function (res) {
        vm.getAllPassAuditOrders();
      }, function (error) {

      })
      $('#confirmDeliverModal').modal('hide');
      vm.deliverInfo.PostNum = null;
      vm.deliverBill.ReceiverTel = null;
    }

    vm.getAllPassAuditOrders = function () {
      financeService.getAllPassAuditBills().then(function (res) {
        if (res.data.success) {
          angular.copy(res.data.data, vm.bills);
        }
      }, function (error) {

      })
    }

    vm.init = function () {
      vm.language = new LanguageUtility();
      vm.bills = [];
      vm.cartID = 0;
      vm.deliverInfo = {ReceiverTel:"",PostNum:""};
      vm.getAllPassAuditOrders();
    };

    vm.init();
  }
})();