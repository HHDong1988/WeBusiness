(function () {
  'use strict';

  angular.module('app-web').controller('homeController', ['$scope',homeController])

  function homeController($scope) {
    var vm = this;
    vm.language = new LanguageUtility();

  }

})();