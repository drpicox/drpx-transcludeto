[DEPRECATED] drpx-transcludeTo
==============================

**This package is deprecated**: please, use current Angular feature present in the core instead https://code.angularjs.org/1.5.0/docs/api/ng/directive/ngTransclude 


An Angular directives/preLinkFunction generator to create multiple transcludes
paired with transcludeTo/transcludeId (like Marionette region or ui-router
siblings views).

It pairs transcludes `target-to` elements into `target-id` elements inside templates, even when `ng-if`, `ng-repeat` and others are involved.


Example/How to use
------------------

Imagine that you want to write something like this:

```html
<my-custom-list>
    <h1 target-to="header">People</h1>
    <div target-to="item">
        {{$parent.item}}
    </div>
    <div target-to="footer">
        <button ng-click="add()">Add</button>
    </div>
</my-custom-list>
```

With transcludeTo you should write `myCustomList` directive as follows:

```javascript
    app.directive('myCustomList', ['transcludeToPreLink', function(transcludeToPreLink) {
        return {
            restrict: 'E',
            templateUrl: 'myCustomList.html',
            transclude: true,                      // needs transclusion activate
            scope: {},                             // needs own scope
            link: {pre: transcludeToPreLink(), post: link},
        };

        function link(scope) {
            scope.list = ['first','second','third'];
        }
    }]);
```

And the `myCustomList.html` template can be as follows:

```html
<div class="header" transclude-id="header">Default Header</div>
<ul>
    <li ng-repeat="item in list" transclude-id="item"></li>
</ul>
<div class="footer" transclude-id="footer"><hr></div>
```



Install
-------

```bash
$ bower install --save drpx-transcludeto
```

add to your module the dependence:

```javascript
    angular.module('yourModule', ['drpxTranscludeTo']);
```

include the javascript library in your application:

```html
<script src="bower_components/drpx-transcludeto/drpx-transcludeto.js"></script>
```

