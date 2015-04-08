'use strict';
MyApp.directive('hideComments', function($document){
    return {
        restrict: 'A',
        link: function(scope, elem, attr) {
            elem.bind('click', function(e) {
                e.stopPropagation();
            });
            $document.bind('click', function() {
                scope.$apply(attr.hideComments);
            })
        }
    }
})
    .directive('myMaxlength', function() {
    return {
        link: function (scope, element, attrs) {
            var maxLength = Number(attrs.myMaxlength);
            scope.$watch('triby.name', function(newVal, oldVal){
                if (newVal.length > maxLength) {
                   scope.triby.name = oldVal;
                }
            })
        }
    };
});