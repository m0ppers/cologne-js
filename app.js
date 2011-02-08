
require.paths.unshift(".");
require.paths.unshift("vendor/lib");

/**
 * Module dependencies.
 */

var express = require('express'),
    connect = require('connect'),
    cgncal = require('cgncal');

// Create and export Express app

var app = express.createServer();

// Configuration

app.configure(function(){
    app.set('views', __dirname + '/views');
    app.use(connect.bodyDecoder());
    app.use(connect.methodOverride());
    app.use(connect.compiler({ src: __dirname + '/public', enable: ['sass'] }));
    app.use(connect.staticProvider(__dirname + '/public'));
});

app.configure('development', function(){
    app.set('reload views', 1000);
    app.use(connect.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
   app.use(connect.errorHandler()); 
});

// Routes

app.get('/', function(req, res){
    cgncal.fetchDates(function(dates) {
        res.render('index.jade', {
            locals: {
                title: 'Cologne.js',
                dates: dates,
                nodeversion: process.version
            }
        });        
    })
});

app.listen(parseInt(process.env.PORT || 3333), null);
console.log("now running on http://localhost:" + (process.env.PORT || 3333));

process.on('uncaughtException', function (err) {
    console.log('Caught exception: ' + err);
});
