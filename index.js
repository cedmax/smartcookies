var express = require( 'express' );
var settings = require( './settings.json' );
var data = require( './smartcookies.json' );
var extend = require( 'lodash.assign' );

var app = express();

app.set( 'view engine', 'html' );
app.set( 'views', __dirname + '/views' );
app.enable( 'view cache' );
app.engine( 'html', require( 'hogan-express' ));
app.use( require( 'express-autoprefixer' )( { browsers: 'last 2 versions', cascade: false } )).use( express.static( __dirname + '/assets' ));

function getContent ( data, patterns, reqPattern ) {
	return extend( data[reqPattern], {
		pattern: data[reqPattern].pattern || reqPattern,
		image: data[reqPattern].image || reqPattern,
		list: patterns.sort().splice( 1 ).map( function( pattern ) {
			return {
				pattern: pattern,
				selected: ( pattern === reqPattern )
			}
		} )
	} );
}

app.get( '/:pattern?', function ( req, res ) {
	var reqPattern,
		patterns = Object.keys( data );
		
	if (( reqPattern = req.params.pattern )) {
		if ( !data[reqPattern] ) {
			reqPattern = '404';
			res.locals = getContent( data, patterns, reqPattern );
			res.status( 404 ).render( 'index' );
		} else {
			res.locals = getContent( data, patterns, reqPattern );
			res.render( 'index' );
		}
	} else {
		patterns.shift();
		res.redirect( '/' + patterns[Math.floor( Math.random() * patterns.length )] );
	}
} );

var server = app.listen( settings.port );
