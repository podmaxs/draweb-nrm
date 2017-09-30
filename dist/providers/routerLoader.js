'use strict';

let express = require('express'),
	busboy  = require('connect-busboy'),
	headers = require('../models/headers');

	module.exports = function(app,routes, pool, config) {

		new headers(app, config.headers);



		this.load = function(){
			return new Promise((resolve, reject) => {	
				if(Array.isArray(routes)){
					for(let r in routes){
				    	let nroute = express();
				    	for(let v in routes[r].verbs){
						    let verb = routes[r].verbs[v],
						    	provider = new pool.providers[verb.provider](pool);
							nroute[verb.name](verb.path, provider[verb.action]);
				    	}
				    	app.use(busboy());
						app.use(nroute);	

					}
				}
				resolve(app);
			
			})	
		}
	
};