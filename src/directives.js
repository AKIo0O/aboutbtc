

cocos.directive('a', function() {
    return {
        restrict: 'E',
        link: function(scope, elem, attrs) {
            if(attrs.href === '' || attrs.href === '#' || attrs.href=="logout"){
                elem.on('click', function(e){
                    e.preventDefault();
                });
            }
        }
   };
});

