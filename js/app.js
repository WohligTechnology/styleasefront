// JavaScript Document
var firstapp = angular.module('firstapp', [
    'ui.router',
    'phonecatControllers',
    'templateservicemod',
    'navigationservice',
    'imageupload'
]);

firstapp.config(function ($stateProvider, $urlRouterProvider, $httpProvider) {

    // for http request with session
    $httpProvider.defaults.withCredentials = true;

    $stateProvider
        .state('dashboard', {
            url: "/dashboard",
            templateUrl: "views/template.html",
            controller: 'DashboardCtrl',
        })
        .state('login', {
            url: "/login",
            templateUrl: "views/login.html",
            controller: 'LoginCtrl'
        })

        .state('users', {
            url: "/users",
            templateUrl: "views/template.html",
            controller: 'UsersCtrl'
        })

        .state('projects', {
            url: "/projects",
            templateUrl: "views/template.html",
            controller: 'ProjectsCtrl'
        })

        .state('api', {
            url: "/api/:id",
            templateUrl: "views/template.html",
            controller: 'APICtrl'
        })

        .state('onlyview', {
            url: "/onlyview/:id",
            templateUrl: "views/template.html",
            controller: 'onlyViewPageCtrl'
        })

        .state('page', {
            url: "/page/:jsonName",
            templateUrl: "views/template.html",
            controller: 'jsonViewCtrl'
        })

        .state('viewDesingerReport', {
            url: "/viewDesingerReport",
            templateUrl: "views/template.html",
            controller: 'ViewDesingerReportCtrl'
        });

    $urlRouterProvider.otherwise("/dashboard");

});

firstapp.filter('uploadpath', function () {
    return function (input, width, height, style) {
        var other = "";
        if (width && width !== "") {
            other += "&width=" + width;
        }
        if (height && height !== "") {
            other += "&height=" + height;
        }
        if (style && style !== "") {
            other += "&style=" + style;
        }
        if (input) {
            return imgpath + "?file=" + input + other;
        }
    };
});
//
// firstapp.filter('getValue', function($filter) {
//     return function(input, keyVal, type) {
//         if (keyVal) {
//             var keyArr = keyVal.split(".");
//             var returnValue = input;
//             _.each(keyArr, function(n) {
//                 returnValue = returnValue[n];
//             });
//             if (type != "image") {
//                 if (returnValue == true) {
//                     returnValue = "Enabled";
//                 } else if (returnValue == false) {
//                     returnValue = "Disabled";
//                 }
//                 return returnValue;
//             } else {
//                 return $filter("uploadpath")(returnValue, 100, 100, "fill");
//             }
//         }
//
//     };
// });

firstapp.filter('getValue', function ($filter) {
    return function (input, keyVal, type) {
        if (keyVal) {
            var keyArr = keyVal.split(".");
            var returnValue = input;
            _.each(keyArr, function (n) {
                if (!_.isEmpty(returnValue)) {
                    returnValue = returnValue[n];
                }
                // returnValue = returnValue[n];

            });
            if (type == "date") {
                // console.log('in date');
                // return new Date(returnValue);
                return $filter("date")(returnValue, "dd-MM-yyyy");
            }
            if (type == "longdate") {
                // console.log('in date');
                // return new Date(returnValue);
                return $filter("date")(returnValue, "longDate");
            }
            if (type == "time") {
                // console.log('in time');
                return $filter("date")(returnValue, "shortTime");
            }
            if (type != "image") {
                return returnValue;
            } else {
                return $filter("uploadpath")(returnValue, 100, 100, "fill");
            }
        }

    };
});


firstapp.directive('imageonload', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.bind('load', function () {
                scope.$apply(attrs.imageonload);
            });
        }
    };
});

// firstapp.directive('uploadImage', function($http, $filter) {
//     console.log("innnnnnnnn",$filter);
//     return {
//         templateUrl: 'views/directive/uploadFile.html',
//         scope: {
//             model: '=ngModel',
//             callback: "=ngCallback"
//         },
//         link: function($scope, element, attrs) {
//             $scope.isMultiple = false;
//             $scope.inObject = false;
//             if (attrs.multiple || attrs.multiple === "") {
//                 $scope.isMultiple = true;
//                 $("#inputImage").attr("multiple", "ADD");
//             }
//             if (attrs.noView || attrs.noView === "") {
//                 $scope.noShow = true;
//             }
//             if ($scope.model) {
//                 if (_.isArray($scope.model)) {
//                     $scope.image = [];
//                     _.each($scope.model, function(n) {
//                         $scope.image.push({
//                             url: $filter("uploadpath")(n)
//                         });
//                     });
//                 } else {
//                     $scope.image = {};
//                     $scope.image.url = $filter("uploadpath")($scope.model);
//                 }

//             }
//             if (attrs.inobj || attrs.inobj === "") {
//                 $scope.inObject = true;
//             }
//             $scope.clearOld = function() {
//                 $scope.model = [];
//             };
//             $scope.upload = function(image) {
//                 var Template = this;
//                 image.hide = true;
//                 var formData = new FormData();
//                 formData.append('file', image.file, image.name);
//                 $http.post(uploadurl, formData, {
//                     headers: {
//                         'Content-Type': undefined
//                     },
//                     transformRequest: angular.identity
//                 }).success(function(data) {
//                     console.log("success");
//                     if ($scope.callback) {
//                         $scope.callback(data);
//                     } else {
//                         if ($scope.isMultiple) {
//                             if ($scope.inObject) {
//                                 $scope.model.push({
//                                     "image": data.data[0]
//                                 });
//                             } else {
//                                 $scope.model.push(data.data[0]);
//                             }
//                         } else {
//                             $scope.model = data.data[0];
//                         }
//                     }
//                 });
//             };
//         }
//     };
// });


firstapp.directive('uploadImage', function ($http, $filter, $timeout) {
    return {
        templateUrl: 'views/directive/uploadFile.html',
        scope: {
            model: '=ngModel',
            type: "@type",
            callback: "&ngCallback"
        },
        link: function ($scope, element, attrs) {
            $scope.showImage = function () {
                console.log($scope.image);
            };
            $scope.check = true;
            if (!$scope.type) {
                $scope.type = "image";
            }
            $scope.isMultiple = false;
            $scope.inObject = false;
            if (attrs.multiple || attrs.multiple === "") {
                $scope.isMultiple = true;
                $("#inputImage").attr("multiple", "ADD");
            }
            if (attrs.noView || attrs.noView === "") {
                $scope.noShow = true;
            }
            // if (attrs.required) {
            //     $scope.required = true;
            // } else {
            //     $scope.required = false;
            // }

            $scope.$watch("image", function (newVal, oldVal) {
                console.log(newVal, oldVal);
                isArr = _.isArray(newVal);
                if (!isArr && newVal && newVal.file) {
                    $scope.uploadNow(newVal);
                } else if (isArr && newVal.length > 0 && newVal[0].file) {

                    $timeout(function () {
                        console.log(oldVal, newVal);
                        console.log(newVal.length);
                        _.each(newVal, function (newV, key) {
                            if (newV && newV.file) {
                                $scope.uploadNow(newV);
                            }
                        });
                    }, 100);

                }
            });

            if ($scope.model) {
                if (_.isArray($scope.model)) {
                    $scope.image = [];
                    _.each($scope.model, function (n) {
                        $scope.image.push({
                            url: n
                        });
                    });
                } else {
                    if (_.endsWith($scope.model, ".pdf")) {
                        $scope.type = "pdf";
                    }
                }

            }
            if (attrs.inobj || attrs.inobj === "") {
                $scope.inObject = true;
            }
            $scope.clearOld = function () {
                $scope.model = [];
            };
            $scope.uploadNow = function (image) {
                $scope.uploadStatus = "uploading";

                var Template = this;
                image.hide = true;
                var formData = new FormData();
                formData.append('file', image.file, image.name);
                $http.post(uploadurl, formData, {
                    headers: {
                        'Content-Type': undefined
                    },
                    transformRequest: angular.identity
                }).success(function (data) {

                    $scope.uploadStatus = "uploaded";
                    if ($scope.isMultiple) {

                        if ($scope.inObject) {
                            $scope.model.push({
                                "image": data.data[0]
                            });
                        } else {
                            if (!$scope.model) {
                                $scope.clearOld();
                            }
                            $scope.model.push(data.data[0]);
                        }
                    } else {
                        if (_.endsWith(data.data, ".pdf")) {
                            $scope.type = "pdf";
                        } else {
                            $scope.type = "img";
                        }
                        $scope.model = data.data[0];

                    }
                    $timeout(function () {
                        $scope.callback();
                    }, 100);

                });
            };
        }
    };
});

firstapp.directive('uploadAllImage', function ($http, $filter) {
    return {
        templateUrl: 'views/directive/uploadFile.html',
        scope: {
            model: '=ngModel',
            callback: "=ngCallback"
        },
        link: function ($scope, element, attrs) {
            $scope.isMultiple = false;
            $scope.inObject = false;
            if (attrs.multiple || attrs.multiple === "") {
                $scope.isMultiple = true;
                $("#inputImage").attr("multiple", "ADD");
            }
            if (attrs.noView || attrs.noView === "") {
                $scope.noShow = true;
            }
            if ($scope.model) {
                if (_.isArray($scope.model)) {
                    $scope.image = [];
                    _.each($scope.model, function (n) {
                        $scope.image.push({
                            url: $filter("uploadpath")(n)
                        });
                    });
                } else {
                    $scope.image = {};
                    $scope.image.url = $filter("uploadpath")($scope.model);
                }

            }
            if (attrs.inobj || attrs.inobj === "") {
                $scope.inObject = true;
            }
            $scope.clearOld = function () {
                $scope.model = [];
            };
            $scope.upload = function (image) {
                var Template = this;
                image.hide = true;
                var formData = new FormData();
                formData.append('file', image.file, image.name);
                $http.post(uploadallurl, formData, {
                    headers: {
                        'Content-Type': undefined
                    },
                    transformRequest: angular.identity
                }).success(function (data) {
                    console.log("success");
                    if ($scope.callback) {
                        $scope.callback(data);
                    } else {
                        if ($scope.isMultiple) {
                            if ($scope.inObject) {
                                $scope.model.push({
                                    "image": data.data[0]
                                });
                            } else {
                                $scope.model.push(data.data[0]);
                            }
                        } else {
                            $scope.model = data.data[0];
                        }
                    }
                });
            };
        }
    };
});
firstapp.directive('img', function ($compile, $parse) {

    return {
        restrict: 'E',
        replace: false,
        link: function ($scope, element, attrs) {
            var $element = $(element);

            if (!attrs.noloading) {
                $element.after("<img src='img/loading.gif' class='loading' />");
                var $loading = $element.next(".loading");
                $element.load(function () {
                    $loading.remove();
                    $(this).addClass("doneLoading");
                });
            } else {
                $($element).addClass("doneLoading");
            }
        }
    };
});

var editorG = {};
var jsonEditorNo = 0;
firstapp.directive('jsoneditor', function ($compile, $parse) {
    return {
        restrict: 'EA',
        scope: false,
        link: function ($scope, element, attrs) {
            $element = $(element);
            $element.css("min-height", "200px");
            var jsoneditornumber = (jsonEditorNo++);
            $element.attr("id", "jsonEditor" + jsoneditornumber);
            var editor = ace.edit("jsonEditor" + jsoneditornumber);
            editor.setTheme("ace/theme/monokai");
            editor.$blockScrolling = Infinity;
            var JsonMode = ace.require("ace/mode/json").Mode;

            editorG = editor;
            editor.session.setMode(new JsonMode());


            editor.setValue($scope.api.Response[attrs.model], 1);
            editor.on("change", function (e) {

                $scope.api.Response[attrs.model] = editor.getValue();
                $scope.$apply();
            });
            var wrapMode = true;
            setTimeout(function () {
                editor.getSession().setUseWrapMode(wrapMode);
            }, 100);

            editor.commands.addCommand({
                name: "beautify",
                bindKey: {
                    win: "Ctrl-Alt-B",
                    mac: "Ctrl-Option-B"
                },
                exec: function (editor) {
                    var value = editor.getValue();
                    var beautiVal = js_beautify(value);
                    editor.setValue(beautiVal);
                    editor.clearSelection();

                }
            });

            editor.commands.addCommand({
                name: "wrap",
                bindKey: {
                    win: "Ctrl-Alt-S",
                    mac: "Ctrl-Option-S"
                },
                exec: function (editor) {
                    wrapMode = !wrapMode;
                    editor.getSession().setUseWrapMode(wrapMode);

                }
            });
        }
    };
});

firstapp.directive('dlEnterKey', function () {
    return function (scope, element, attrs) {

        element.bind("keydown keypress", function (event) {
            var keyCode = event.which || event.keyCode;

            // If enter key is pressed
            if (keyCode === 13) {
                scope.$apply(function () {
                    // Evaluate the expression
                    scope.$eval(attrs.dlEnterKey);
                });

                event.preventDefault();
            }
        });
    };
});