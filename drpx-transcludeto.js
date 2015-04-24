/*
	The MIT License (MIT)

	Copyright (c) 2015 David Rodenas

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.

	Ex: Template of Box:
	<div class="box">
		<div class="header" TRANSCLUDE-ID="header"></div>
		<hr>
		<div class="content" TRANSCLUDE-ID="content"></div>
	</div>

	Usage of box:
	<box>
		<div TRANSCLUDE-TO="header">Header</div>
		<div TRANSCLUDE-TO="content">
			Header
		</div>
	</box>	
*/
;(function(angular) {
	'use strict';

	angular
		.module('drpxTranscludeTo', [])
		.value('transcludeToPreLink', transcludeToPreLink)
		.directive('transcludeTo', transcludeToDirective)
		.directive('transcludeId', transcludeIdDirective)
		;

	function transcludeToPreLink(preLink) {
		return function(scope, element, attrs, controller, transclude) {
			transclude(scope, angular.noop);

			if (preLink) {
				return preLink.$apply(this, arguments);
			}
		};
	}

	function transcludeToDirective() {
		var directive = {
			restrict: 'A',
			link: { pre: preLink, },
			transclude: 'element',
			priority: 1600, // above ngIf, ngRepeat, ...
			terminal: true,
			$$tlb: true,
		};

		function preLink(scope, element, attrs, controller, transclude) {
			scope.$transcludeTo = scope.$transcludeTo || {};
			scope.$transcludeTo[attrs.transcludeTo] = {transclude: transclude, scope: scope.$parent};
		}

		return directive;
	}

	function transcludeIdDirective() {
		var directive = {
			restrict: 'A',
			link: { pre: preLink, },
		};

		function preLink(scope, element, attrs, controller, transclude) {

			var transcludeTo = scope.$transcludeTo[attrs.transcludeId];
			if (!transcludeTo) {
				return;
			}

			transcludeTo.transclude(transcludeTo.scope.$new(), function(clone, newScope) {
				element.empty();
				element.append(clone);

				newScope.$container = scope;

				element.on('$destroy', function() {
					newScope.$destroy();
				});
			});
		}

		return directive;
	}

})(angular);