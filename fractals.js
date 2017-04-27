angular.module('Fractals', [])
    .controller('FractalsCtrl', function($scope, $q) {
        const canvas = document.getElementById('canvas');
        const context = canvas.getContext('2d');



        $scope.iterations = 2000;
        $scope.delay = 25;

        $scope.focusPoint = {
            x: Math.floor(Math.random() * canvas.width + 1),
            y: Math.floor(Math.random() * canvas.height + 1)
        };

        $scope.points = [
            { x: 10, y: 390 },
            { x: 300, y: 10 },
            { x: 590, y: 390 }
        ];

        resetCanvas();

        $scope.running = false;

        $scope.addPoint = function(event) {
            console.log(event);
            if (!$scope.running && isEmptySpot(event.offsetX, event.offsetY)) {
                $scope.points.push({
                    x: event.offsetX,
                    y: event.offsetY
                });
                resetCanvas();
            }

        };

        $scope.removePoint = function(index) {
            $scope.points.splice(index, 1);
            resetCanvas();
        };

        $scope.buildFractal = function() {
            resetCanvas();
            $scope.running = true;
            run().then(function() {
                $scope.running = false;
            });
        };

        function resetCanvas() {

            context.beginPath();
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.closePath();

            for (var i = 0; i < $scope.points.length; ++i) {
                drawDot($scope.points[i].x, $scope.points[i].y, 4, '#d00d0d');
            }
            drawDot($scope.focusPoint.x, $scope.focusPoint.y, 3, '#00bc08')
        }

        function isEmptySpot(x, y) {
            var data = context.getImageData(x, y, 1, 1).data;
            return data[0] + data[1] + data[2] === 0;
        }

        function drawDot(x, y, r, c) {
            context.beginPath();
            context.arc(x, y, r, 0, 2 * Math.PI);
            context.fillStyle = c;
            context.fill();
        }

        function drawNextFocus() {
            var target = $scope.points[Math.floor(Math.random() * $scope.points.length)];

            $scope.focusPoint.x = (target.x + $scope.focusPoint.x) / 2;
            $scope.focusPoint.y = (target.y + $scope.focusPoint.y) / 2;
            drawDot($scope.focusPoint.x, $scope.focusPoint.y, 2, '#484ba8');
        }

        function run() {
            var n = $scope.iterations;
            $scope.iterations = 0;

            return $q(function(resolve, reject) {
                if ($scope.delay > 0) {
                    var interval = setInterval(function () {

                        drawNextFocus();

                        $scope.iterations++;
                        $scope.$digest();
                        if ($scope.iterations >= n) {

                            clearInterval(interval);
                            resolve(1);
                        }
                    }, $scope.delay);
                } else {
                    for (; $scope.iterations < n; $scope.iterations++) {
                        drawNextFocus();
                    }
                    resolve(1);
                }
            });
        }
    });