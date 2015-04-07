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
});