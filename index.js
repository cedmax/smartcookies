var express = require( 'express' );
var data = require( './smartcookies.json' );
var extend = require( 'lodash.assign' );
var fs = require('fs');
var styleString = fs.readFileSync('./assets/css/style.css', 'utf-8')

var postcss = require('postcss');
var autoprefixer = require('autoprefixer'); 
var css = postcss([autoprefixer({ browsers: 'last 2 versions', cascade: false })]).process(styleString).css;


var app = express();

app.set( 'view engine', 'html' );
app.set( 'views', __dirname + '/views' );
app.enable( 'view cache' );
app.engine( 'html', require( 'hogan-express' ));
app.use( express.static( __dirname + '/assets', { maxAge: '31 days' }));

function getContent ( data, patterns, reqPattern ) {
  var obj = JSON.parse( JSON.stringify( data[reqPattern] ));
  return extend( obj, {
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

var dataJSon = JSON.stringify( data );

app.get( '/all-images', function ( req, res ) {    
   res.locals = { images: Object.keys(data) };
   res.render( 'images' );
} );

app.get( '/:pattern?', function ( req, res ) {
  var reqPattern,
    patterns = Object.keys( data );
    
  if (( reqPattern = req.params.pattern )) {
    if ( !data[reqPattern] ) {
      reqPattern = '404';
      res.locals = getContent( data, patterns, reqPattern );
      res.locals.style = css;
      res.status( 404 ).render( 'index' );
    } else {
      res.locals = getContent( data, patterns, reqPattern );
      res.locals.json = dataJSon;
      res.locals.style = css;
      res.render( 'index' );
    }
  } else {
    patterns.shift();
    res.redirect( '/' + patterns[Math.floor( Math.random() * patterns.length )] );
  }
} );


var server = app.listen( 80 );
