(function () {
    'use strict';

    angular
        .module('MyApp')
        .controller('AdminController', AdminController);   
    
    AdminController.$inject = ['UserService', '$rootScope'];
    function AdminController(UserService, $rootScope) {
        var vm = this;

        vm.user = null;
        vm.allUsers = [];
        vm.deleteUser = deleteUser;
        
        
        initController();
        
        
        function initController() {
            loadCurrentUser();   
            loadAllUsers();
        }
        
        function loadCurrentUser() {
            UserService.GetByUsername($rootScope.globals.currentUser.username)
                .then(function (user) {
                    vm.user = user;
                });
        }

        
        function loadAllUsers() {
            UserService.GetAll()
                .then(function (users) {
                    vm.allUsers = users;
                });
        }
        
        function deleteUser(id) {
            UserService.Delete(id)
            .then(function () {
                loadAllUsers();
            });
        }
        
        $scope.open = function (p,size) {
            var modalInstance = $modal.open({
              templateUrl: 'admin/userEdit.html',
              controller: 'adminController',
              size: size,
              resolve: {
                item: function () {
                  return p;
                }
              }
            });
            modalInstance.result.then(function(selectedObject) {
                if(selectedObject.save == "insert"){
                    $scope.products.push(selectedObject);
                    $scope.products = $filter('orderBy')($scope.products, 'id', 'reverse');
                }else if(selectedObject.save == "update"){
                    p.category= selectedObject.category;
    				p.description = selectedObject.description;
                    p.price = selectedObject.price;
                    p.stock = selectedObject.stock;
                    p.packing = selectedObject.packing;
                }
            });
        };
        
        
    }

})();