if (Function.prototype.bind === null || Function.prototype.bind === undefined) {
	Function.prototype.bind = (function (slice) {
		function bind(context) {
			var self = this;
			if (1 < arguments.length) {
				var $arguments = slice.call(arguments, 1);
				return function () {
					return self.apply(context, arguments.length ? $arguments.concat(slice.call(arguments)) : $arguments);
				};
			}
			return function () {
				return arguments.length ? self.apply(context, arguments) : self.call(context);
			};
		}
		return bind;
	} (Array.prototype.slice));
}