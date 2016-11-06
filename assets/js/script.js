( function() {
	var data = JSON.parse( document.getElementById( 'data' ).innerHTML );
	delete data[ '404' ];

	var original = document.location.pathname.replace( '/', '' );

	var availablePages = ( function( data ) {
		var pagesAvailable = [];

		function update() {
			if ( ! pagesAvailable.length ) {
				pagesAvailable = Object.keys( data ).sort( function() { return 0.5 - Math.random() } );
			}
		}

		return {
			get: function() {
				update();
				return pagesAvailable.shift();
			},
			del: function( toDelete ) {
				pagesAvailable.splice( pagesAvailable.indexOf( toDelete ), 1 );
			},
			next: function() {
				update();
				return pagesAvailable[ 0 ];
			}
		}
	} )( data );

	preloadImg( availablePages.next() );

	function setDefaults( object, pattern ) {
		object[ pattern ].image = object[ pattern ].image || pattern;
		object[ pattern ].pattern = object[ pattern ].pattern || pattern;
		return object;
	}

	function preloadImg( next ) {
		( new Image()).src = '/images/' + next + '.jpg';
	}

	function updatePage( eventState ) {
		document.getElementById( 'nav-trigger' ).checked = false;
		document.getElementById( 'wrapper' ).style.backgroundImage = 'url("/images/' + eventState.image + '.jpg")';
		with ( document.getElementById( 'main-link' )) {
			href = eventState.url;
			innerHTML = eventState.pattern;
		}
		document.getElementById( 'img-credits' ).href = eventState.imgCredits;
		document.getElementsByClassName( 'nav-item--selected' )[ 0 ].classList.remove( 'nav-item--selected' );

		preloadImg( availablePages.next() );

		Array.prototype.filter.call( document.getElementsByClassName( 'nav-item' ), function( menuitem ) {
			return menuitem.innerHTML.indexOf( eventState.pattern ) > - 1;
		} )[ 0 ].classList.add( 'nav-item--selected' );
	}

	function enableNavigation( e, destination ) {
		if ( history.pushState ) {
			e.preventDefault();

			data = setDefaults( data, destination );

			updatePage( data[ destination ] );
			history.pushState( data[ destination ], destination, "/" + destination );
		}
	}

	window.addEventListener( 'popstate', function( event ) {
		updatePage( event.state ? event.state : setDefaults( data, original )[ original ] );
	} );

	document.getElementById( 'also' ).addEventListener( 'click', function( e ) {
		enableNavigation( e, availablePages.get());
	} );

	document.getElementById( 'navigation' ).addEventListener( 'click', function( e ) {
		var destination = e.target.innerHTML;
		availablePages.del( destination );
		enableNavigation( e, destination );
	} );

} )();