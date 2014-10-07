(function(global) {

	// 'use strict';

	var _events = {
		onLoadStart: function() {
			this.trigger('loadstart');
		}
	,	onLoadProgress: function() {

			var loaded = 0
			,   duration = 1;

			try {
				loaded = this.el.buffered.end(0);
				duration = this.el.duration;
			} catch(e) {}

			var percent = ~~((loaded / duration) * 100);

			this.loaded = percent;
			this.trigger('onload', percent);

			// if (this.loaded === 100) {
				// _events.onLoad.call(this);
			// }
		}
	,	onLoad: function() {

			if (this.audioLoaded) {
				return;
			}

			this.audioLoaded = true;
			this.el.removeEventListener('progress', this.progressHandler, false);
			this.trigger('onloaded');
		}
	,	onPlay: function() {
			this.trigger('play');
			_events.onProgress.call(this);
		}
	,	onProgress: function() {

			if (!this.audioLoaded) {
				return;
			}

			this.trigger('progress', this.el.currentTime);

			if (this.el.currentTime >= this._end) {
				this.stop();
				this._current = null;
				this.trigger('complete');
			}
		}
	,	onStop: function() {
			_events.onProgress.call(this);
			this.trigger('stop');
		}
	};

	function AudioSprite(audioEl, spriteData) {
		this.el = audioEl;
		this._data = spriteData;
		this.audioLoaded = false;
		this.loaded = 0;

		this.progressHandler = _events.onLoadProgress.bind(this);

		this.el.addEventListener('loadstart', _events.onLoadStart.bind(this), false);
		this.el.addEventListener('progress', this.progressHandler, false);
		this.el.addEventListener('canplaythrough', _events.onLoad.bind(this), false);
		this.el.addEventListener('play', _events.onPlay.bind(this), false);
		this.el.addEventListener('timeupdate', _events.onProgress.bind(this), false);
		this.el.addEventListener('pause', _events.onStop.bind(this), false);
		this.el.addEventListener('ended', _events.onStop.bind(this), false);
	}

	AudioSprite.prototype = {
		load: function() {
			this.el.load();
			return this;
		}
	,	get: function(id) {
			return this._data.entries[id].audio;
		}
	,	play: function(id) {

			this.off('onloaded', this.play.bind(this, id));
			
			if (this.audioLoaded) {

				id || (id = this._current || '0');

				var sprite = this.get(id);
				
				if (sprite) {

					if (id !== this._current) {
						this.el.currentTime = sprite.startTime;
					}
					
					this._end = sprite.endTime;

					this._current = id;

					this.el.play();
				}

			} else {
				this
					.on('onloaded', this.play.bind(this, id))
					.load()
				;
			}

			return this;
		}
	,	stop: function() {
			this.off('onloaded', this.play);
			if (this.audioLoaded) {
				this.el.pause();
			}
			return this;
		}
	};

	// Add event methods
	for (var name in global.Events) {
		AudioSprite.prototype[name] = global.Events[name];
	}

	global.AudioSprite = AudioSprite;

}(this));