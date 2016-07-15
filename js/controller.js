angular.module('app.controller', [])
    .controller('MainCtrl', function($scope) {
        var map;
        var marker;
        var socket = io('http://192.168.0.10:8081');

        $scope.loading = false;
        $scope.loaded = false;
        $scope.latitude = 43.6022063894;
        $scope.longitude = 3.90024143292;

        $scope.start = function() {
            $scope.loaded = true;
            localStorage.setItem('latitude', $scope.latitude);
            localStorage.setItem('longitude', $scope.longitude);

            initMap();
        };

        $scope.restore = function() {
            $scope.loading = true;
            $scope.latitude = parseFloat(localStorage.getItem('latitude'));
            $scope.longitude = parseFloat(localStorage.getItem('longitude'));
            $scope.loading = false;

            if ($scope.latitude && $scope.longitude) {
                $scope.loaded = true;

                initMap();
            } else {
                alert('no data to restore');
            }
        };

        $scope.changeLocation = function(direction) {
            var jitter = generateRandomNumber(-0.000009, 0.000009);

            switch (direction) {
                case 'LEFT':
                    $scope.latitude += jitter;
                    $scope.longitude -= moveInterval();
                    moveMarker();
                    break;

                case 'RIGHT':
                    $scope.latitude += jitter;
                    $scope.longitude += moveInterval();
                    moveMarker();
                    break;

                case 'UP':
                    $scope.latitude += moveInterval();
                    $scope.longitude += jitter;
                    moveMarker();
                    break;

                case 'DOWN':
                    $scope.latitude -= moveInterval();
                    $scope.longitude += jitter;
                    moveMarker();
                    break;
            }
        };

        var auto;
        $scope.changeLocationAuto = function(direction) {
            auto = setInterval(function() {
                $scope.changeLocation(direction);
            }, 1500);
        };

        var timers = [];

        $scope.findPokemon = function() {
            var last = 0;

            for (var i = 1; i <= 20; i++) {
                last = last+1000;
                timers.push(setTimeout(function() {
                    if ($scope.stop) return;
                    $scope.changeLocation('LEFT');
                }, last));
            }
            for (var i = 1; i <= 5; i++) {
                last = last+1000;
                timers.push(setTimeout(function() {
                    if ($scope.stop) return;
                    $scope.changeLocation('DOWN');
                }, last));
            }
            for (var i = 1; i <= 20; i++) {
                last = last+1000;
                timers.push(setTimeout(function() {
                    $scope.changeLocation('RIGHT');
                }, last));
            }
            for (var i = 1; i <= 5; i++) {
                last = last+1000;
                timers.push(setTimeout(function() {
                    $scope.changeLocation('DOWN');
                }, last));
            }
            for (var i = 1; i <= 20; i++) {
                last = last+1000;
                timers.push(setTimeout(function() {
                    $scope.changeLocation('LEFT');
                }, last));
            }
            for (var i = 1; i <= 5; i++) {
                last = last+1000;
                timers.push(setTimeout(function() {
                    $scope.changeLocation('DOWN');
                }, last));
            }
            for (var i = 1; i <= 20; i++) {
                last = last+1000;
                timers.push(setTimeout(function() {
                    $scope.changeLocation('RIGHT');
                }, last));
            }
        };

        $scope.locationAutoStop = function() {
            if (auto) {
                clearInterval(auto);
                auto = null;
            }
            if (timers.length) {
                angular.forEach(timers, function(value, key) {
                    clearTimeout(value);
                });

                timers = [];
            }
        };

        var moveMarker = function () {
            savePosition();

            localStorage.setItem('latitude', $scope.latitude);
            localStorage.setItem('longitude', $scope.longitude);

            marker.setPosition(new google.maps.LatLng($scope.latitude, $scope.longitude));
            map.panTo(new google.maps.LatLng($scope.latitude, $scope.longitude));
        };

        var savePosition = function() {
            socket.emit('save_position', {
                lat: $scope.latitude,
                lng: $scope.longitude
            });
        };

        var initMap = function() {
            var myLatLng = {lat: $scope.latitude, lng: $scope.longitude};

            map = new google.maps.Map(document.getElementById('map'), {
                center: myLatLng,
                scrollwheel: false,
                zoom: 17
            });

            marker = new google.maps.Marker({
                map: map,
                position: myLatLng
            });

            savePosition();
        };

        var moveInterval = function() {
            var value = parseFloat('0.0000' + parseInt(generateRandomNumber(20, 60)));
            return value;
        };

        var generateRandomNumber = function (min, max) {
            var highlightedNumber = Math.random() * (max - min) + min;
            return highlightedNumber;
        };
    })
;