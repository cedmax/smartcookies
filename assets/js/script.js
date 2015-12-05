(function(){
	var data = JSON.parse(document.getElementById('data').innerHTML);
	delete data['404'];

	var original = document.location.pathname.replace('/', '');
	var pagesAvailable = getAvailablePages();

	function getAvailablePages(){
		return Object.keys(data).sort(function() { return 0.5 - Math.random() });
	}

	function setDefaults(object, pattern){
		object[pattern].image = object[pattern].image || pattern;
		object[pattern].pattern = object[pattern].pattern || pattern;
		return object;
	}

	function updatePage(eventState){
		document.getElementById('nav-trigger').checked = false;
		document.getElementById('wrapper').style.backgroundImage = 'url("/images/' + eventState.image + '.jpg")';
		with (document.getElementById('main-link')) {
			href = eventState.url;
			innerHTML = eventState.pattern;
		}
		document.getElementById('img-credits').href = eventState.imgCredits;
		document.getElementsByClassName('nav-item--selected')[0].classList.remove('nav-item--selected');

		Array.prototype.filter.call(document.getElementsByClassName('nav-item'), function(menuitem){
			return menuitem.innerHTML.indexOf(eventState.pattern)>-1;
		})[0].classList.add('nav-item--selected');
	}

	function enableNavigation(e, destination){
		if (history.pushState){
	 		e.preventDefault();
	 		
	 		data = setDefaults(data, destination);
	 		
	 		updatePage(data[destination]);
			history.pushState(data[destination], destination, "/"+ destination);
	 	}
	}
	
	window.addEventListener('popstate', function(event) {
		updatePage(event.state? event.state : setDefaults(data, original)[original]);
	});

	document.getElementById('also').addEventListener('click', function(e){
		if (!pagesAvailable.length){
			pagesAvailable = getAvailablePages();
		}
		enableNavigation(e, pagesAvailable.shift());
	});

	document.getElementById('navigation').addEventListener('click', function(e){
		var destination = e.target.innerHTML;
		pagesAvailable.splice( pagesAvailable.indexOf(destination), 1 );
		enableNavigation(e, destination);
	});

})();