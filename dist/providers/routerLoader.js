'use strict';

let express = require('express'),
	busboy  = require('connect-busboy');

	module.exports = function(app,routes, pool) {


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