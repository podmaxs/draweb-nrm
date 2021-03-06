'use strict';

let express        = require('express'),
	app            = express(),
	bodyParser     = require('body-parser'),
	methodOverride = require('method-override'),
	he             = require('./../providers/foundError'),
	router         = require('./../providers/routerLoader'),
	configModel    = require('./../models/config'),
	db             = require('./../providers/mongoseConection'),
	path           = require('path'),
	poolModel      = require('./../models/pool');

	module.exports = function(config, imports) {
		
		let self = this;


		this.declareImports = function(pool){
			if(Array.isArray(imports)){
				for(let i in imports){
					if(imports[i]){
						for(let r in imports[i]){
							if(Array.isArray(imports[i][r])){
								for(let t in imports[i][r])
									pool[r][imports[i][r][t]['name']] = imports[i][r][t]['link'];
							}
						}
					}
				}
			}
			return pool;
		}



		if(!config)
			config = new configModel();
		this.run = function(routes) {
			
			app.use(bodyParser.urlencoded({
				extended: true
			}));
			app.use(bodyParser.json());
			app.use(methodOverride());
			app.use(express.static('public'));
			he.check()
			.then(
				(errors)=>{
					if(!errors[0]){
						let poolLoader = new poolModel(config),
							conection  = new db(config.dbName);
						conection.opendb()
						.then(
							(connection) => {
								poolLoader(connection)
								.then(
									function(pool){
										let rLoader   = new router(app, routes, self.declareImports(pool), config);
										rLoader.load()
										.then(
											(app) => {
												app.use('/public',express.static(process.env.PWD+'/public'));
												
												app.get('/', (req, res) =>{
													res.send('Load '+config.appName);
												});
												
												app.listen(config.port, function(){
													console.log('server redy on '+config.port);
												});

												console.log('\n\n***********************');
												console.log('**** Service config *****');
												console.log('\n 	'+JSON.stringify(config).replace('{','').replace('}','').replace(/,/g,'\n 	'));
												console.log('\n\n***********************\n');
											}
										);
									}
								)
							},
							err => {
								console.log(err);
							}
						)
							
					}

				}
			);

		};


	};