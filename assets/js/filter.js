(function(global) {

	'use strict';

	var d = document;

	function Filter (view, data) {

		// view (optional) if omitted, create a view
		// data (optional) if present, create elements and append them to the view

		var div = d.createElement('div');
		div.className = 'filter';

		this.view = view;
		this.data = [];
		this.lastValue = '';
		this.throttle = 0;
		
		this.input = d.createElement('input');
		this.input.setAttribute('placeholder', 'What do you want to say?');
		this.input.setAttribute('autocomplete', 'off');
		this.input.setAttribute('autocorrect', 'off');
		this.input.setAttribute('autocapitalize', 'off');
		this.match = d.createElement('p');

		div.appendChild(this.input);
		div.appendChild(this.match);
		this.view.parentNode.insertBefore(div, view);

		this.bindEvents();
	}

	Filter.prototype = {
		add : function(term, element) {

			var _this = this;

			this.hide(element);

			this.data.push({ 'term': term, 'element': element });

			clearTimeout(this.throttle);
			this.throttle = setTimeout(function() {
				// Show entire dataset
				_this.find('');
			}, 10);
		}
	,	bindEvents : function() {

			var _this = this
			,	fn = function() {
					if (this.value !== _this.lastValue) {
						_this.lastValue = this.value;
						_this.find(this.value);
					}
				}

			addEventHandler(this.input, 'keyup', fn);
			addEventHandler(this.input, 'change', fn);

			// this.input.focus();
		}
	,	find : function(str) {

			var matches = (str.length) ? [] : this.data
			,	re;
			
			if (str.length) {
				re = new RegExp(str, 'i');

				for (var i = 0, l = this.data.length; i < l; i++) {
					
					if (this.data[i].term.match(re)) {
						matches.push(this.data[i]);
					}

					this.hide(this.data[i].element);
				}
			}

			this.updateView(this.sort(matches, 'term'));
		}
	,	sort : function(arr, key) {
			arr.sort(function(a, b) {
				return (a[key] > b[key]) ? 1 : (a[key] < b[key]) ? -1 : 0;
			});
			return arr;
		}
	,	updateView : function(matches) {

			this.updateMatches(matches.length);

			for (var i = 0, l = matches.length; i < l; i++) {
				this.show(matches[i].element);
			}
		}
	,	updateMatches : function(n) {
			this.match.innerHTML = (n === 1) ? '1 result' : n +' results';
		}
	,	show : function(el) {
			el.className = el.className.replace(/(?:^|\s)hide(?!\S)/g, '');
		}
	,	hide : function(el) {
			el.className += ' hide';
		}
	};

	function addEventHandler (target, eventType, handler) {
		if (target.addEventListener) {
			target.addEventListener(eventType, handler, false);
		} else if (target.attachEvent) {
			target.attachEvent('on'+ eventType, function() { return handler.apply(target, [global.event]);});
		}
	}

	global.filter = function(view, data) {
		return new Filter(view, data);
	};
}(this));