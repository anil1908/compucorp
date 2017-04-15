// create the module and name it musicApp
var musicApp = angular.module('musicApp', ['ngRoute', 'ui.bootstrap']);

// configure our routes
musicApp.config(function ($routeProvider) {
    $routeProvider

        // route for the home page
        .when('/', {
            templateUrl: 'pages/home.html',
            controller: 'searchController'
        })
});

// create the controller and inject Angular's $scope
musicApp.controller('searchController', function ($scope, $modal, $http) {
    $scope.trackdata = [];
    $scope.searchtxt = '';
    $scope.showmore = '';
    $scope.searchtrack = function (nexturl) {
        if ($scope.searchtxt !== '') {
            $http({
                method: 'GET',
                url: (nexturl == '') ? 'https://api.spotify.com/v1/search?q=' + $scope.searchtxt + '&type=album' : nexturl
            }).then(function successCallback(response) {
                angular.forEach(response.data.albums.items, function (val, key) {
                    this.push(val);
                }, $scope.trackdata);
                $scope.showmore = response.data.albums.next;
            }, function errorCallback(response) {

            });
        }
    };

    $scope.viewAlbum = function (music) {
        var modalInstance = $modal.open({
            templateUrl: 'myModalContent.html',
            controller: 'ModalInstanceCtrl',
            size: 'lg',
            resolve: {
                music: function () {
                    return music;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {

        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    }
});

musicApp.controller('ModalInstanceCtrl', function ($scope,$http, $modal, $modalInstance, music) {
    $scope.music = music;
    $scope.musictrack = [];
    $scope.releaseyear = '';
    $http({
        method: 'GET',
        url: $scope.music.href
    }).then(function successCallback(response) {
        $scope.musictrack = response.data.tracks.items;
        var t = new Date(response.data.release_date);
        $scope.releaseyear = t.getFullYear();
    }, function errorCallback(response) {

    });

    $scope.ok = function () {
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

});