'use strict';

let express        = require('express'),
	app            = express(),
	bodyParser     = require('body-parser'),
	methodOverride = require('method-override'),
	he             = require('./../providers/foundError'),
	router         = require('./../providers/routerLoader'),
	configModel    = require('./../models/config'),
	db             = require('./../providers/mongoseConection'),
	poolModel      = require('./../models/pool');

	module.exports = function(config) {
		
		let self = this;

		if(!config)
			config = new configModel();
		this.run = function(routes) {
			
			app.use(bodyParser.urlencoded({
				extended: true
			}));

			app.use(bodyParser.json());
			app.use(methodOverride());
			he.check()
			.then(
				(errors)=>{
					if(!errors[0]){
						let poolLoader = new poolModel(config);
						poolLoader()
						.then(
							function(pool){
								let rLoader   = new router(app, routes, pool),
									conection = new db(config.dbName);
								rLoader.load()
								.then(
									(app) => {
										app.get('/', (req, res) =>{
											res.send('Load '+config.appName);
										});
										
										app.listen(config.port, function(){
											console.log('server redy on '+config.port);
										});
									}
								);
							}
						)
							
					}

				}
			);

		};


	};