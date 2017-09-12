'use strict';

let express        = require('express'),
	app            = express(),
	bodyParser     = require('body-parser'),
	methodOverride = require('method-override'),
	he             = require('./../providers/foundError'),
	configModel    = require('./../models/config'),
	poolModel      = require('./../models/pool');

	module.exports = function(config) {
		
		let self = this;
		let pool = new poolModel(config);

		if(!config)
			config = new configModel();
		this.run = function() {
			
			app.use(bodyParser.urlencoded({
				extended: true
			}));
			app.use(bodyParser.json());
			app.use(methodOverride());
			he.check()
			.then(
				(errors)=>{
					if(!errors[0]){
						app.get('/', (req, res) =>{
							res.send('Load '+config.appName);
						});
						
						app.listen(config.port, function(){
							console.log('server redy on '+config.port);
						});
							
					}

				}
			);

		};


	};