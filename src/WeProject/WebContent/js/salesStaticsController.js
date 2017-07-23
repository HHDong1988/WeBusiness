(function () {
  'use strict';

  angular.module('app-web').controller('salesStaticsController', ['$scope', 'PAGE_SIZE_OPTIONS', salesStaticsController])

  function salesStaticsController($scope, PAGE_SIZE_OPTIONS) {
    var vm = this;

    vm.onQuery = function () {
      
    }

    vm.init = function () {
      vm.language = new LanguageUtility();

      vm.productName = '';
      vm.startTime = '';
      vm.endTIme = '';

            vm.pieChartData = [{
        'value': 0,
        'name': 'Alarm1'
      }, {
        'value': 0,
        'name': 'Alarm2'
      }, {
        'value': 0,
        'name': 'Alarm3'
      }, {
        'value': 0,
        'name': 'Alarm4'
      }, {
        'value': 0,
        'name': 'Alarm5'
      }];
    };

    vm.init();
  }
})();