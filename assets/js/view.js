(function(global) {

	'use strict';

	function renderView (data, spriteObject) {
		
		var d = document
		,	fragment = d.createDocumentFragment()
		,	view = d.createElement('div')
		,	dataFilter;

		view.className = 'view';
		d.body.appendChild(view);

		dataFilter = filter(view);

		for (var i = 0, l = data.entries.length; i < l; i++) {

			var entry = data.entries[i]
			,	row = d.createElement('div')
			,	content = d.createElement('div')
			,	col1 = d.createElement('span')
			,	col2 = d.createElement('span');

			row.className = 'row';
			content.className = 'content';

			col1.appendChild(d.createTextNode(entry.original));
			col2.appendChild(d.createTextNode(entry.translation));

			content.appendChild(col1);

			if (typeof spriteObject !== 'undefined') {

				var playButton = d.createElement('button');

				playButton.innerHTML = '&#9658;';
				playButton.setAttribute('data-id', i);

				playButton.addEventListener('click', function() {
					if (spriteObject.el.ended || spriteObject.el.paused) {
						spriteObject.play(this.getAttribute('data-id'));
					} else {
						spriteObject.stop();
					}
				});

				content.appendChild(playButton);
				content.appendChild(col2);

			} else {

				var anchor = d.createElement('a');

				anchor.href = 'https://translate.google.co.uk/translate_tts?ie=UTF-8&q='+ encodeURI(entry.translation) +'&tl=pl&total=1&idx=0&textlen='+ entry.translation.length;
				anchor.target = '_blank';

				anchor.appendChild(col2);
				content.appendChild(anchor);
			}

			row.appendChild(content);

			dataFilter.add(entry.original, row);
			
			fragment.appendChild(row);
		}

		view.appendChild(fragment);
	}

	global.renderView = renderView;

}(this));