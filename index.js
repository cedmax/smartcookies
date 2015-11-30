var express = require( 'express' );
var settings = require( './settings.json' );
var data = require( './smartcookies.json' ).cookies;
var find = require( 'lodash.find' );

var app = express();

app.set( 'view engine', 'html' );
app.set( 'views', __dirname + '/views' );
app.enable( 'view cache' );
app.engine( 'html', require( 'hogan-express' ));
app.use( require( 'express-autoprefixer' )( { browsers: 'last 2 versions', cascade: false } )).use( express.static( __dirname + '/assets' ));

app.get( '/:pattern?', function ( req, res ) {
	var pattern;
	if (( pattern = req.params.pattern )) {
		res.locals = find( data, function( genius ) {
			return genius.pattern === pattern;
		} );
		res.locals.list = data.map(function(genius){
			genius.selected = (genius.pattern===pattern);
			return genius;
		}).sort(function(a, b){
			return a.pattern.localeCompare(b.pattern);
		});
		res.render( 'index' );
	} else {
		res.redirect( '/' + data[Math.floor( Math.random() * data.length )].pattern );
	}
} );

var server = app.listen( settings.port );
