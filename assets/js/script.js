(function(){
	var data = JSON.parse(document.getElementById('data').innerHTML);
	delete data['404'];
	var pagesAvailable = Object.keys(data).sort(function() { return 0.5 - Math.random() });
	var original = document.location.pathname.replace('/', '');

	function updatePage(eventState){
		if (!eventState) {
			eventState = data[original];
			eventState.image = data[original].image || original;
			eventState.pattern = data[original].pattern || original;
		}
		var backgrounded = document.getElementsByClassName('site-wrap')[0];
		backgrounded.style.backgroundImage = 'url("/images/' + eventState.image + '.jpg")';

		var anchor = document.getElementsByClassName('main-link')[0]; 
		anchor.href = eventState.url;
		anchor.innerHTML = eventState.pattern;

		var imgcredits = document.getElementsByClassName('img-credits')[0]; 
		imgcredits.href = eventState.imgCredits;

		var selected = document.getElementsByClassName('nav-item--selected')[0];
		selected.classList.remove('nav-item--selected');

		var menuList = document.getElementsByClassName('nav-item');
		var toSelect = Array.prototype.filter.call(menuList, function(menuitem){
			return menuitem.innerHTML.indexOf(eventState.pattern)>-1;
		});
		toSelect[0].classList.add('nav-item--selected');
	}

	window.addEventListener('popstate', function(event) {
		updatePage(event.state);
	});

	document.getElementById('also').addEventListener('click', function(e){
	 	if (history.pushState && pagesAvailable.length){
	 		e.preventDefault();
	 		
	 		var input = document.getElementById('nav-trigger');
	 		input.checked = false;

	 		var destination = pagesAvailable.shift();
			data[destination].image = data[destination].image || destination;
			data[destination].pattern = data[destination].pattern || destination;
	 		
	 		updatePage(data[destination]);
			history.pushState(data[destination], destination, "/"+ destination);
	 	}
	});

})();