'use strict';

let express  = require('express'),
	busboy   = require('connect-busboy'),
	headers  = require('../models/headers'),
	security = require('../models/security');

	module.exports = function(app, routes, pool, config) {
		let sec = new security(config);

		new headers(app, config.headers);



		this.load = function(){
			return new Promise((resolve, reject) => {	
				if(Array.isArray(routes)){
					console.log('\n');
					console.log('	Routes defined: \n');
					for(let r in routes){
				    	let nroute = express(),
				    		provider        = new pool.providers[routes[r]](pool),
				    		routesProvider  = provider.getRoutes(routes[r]);
				    	console.log('\n\n	*** '+routes[r]+':\n')
				    	for(let v in routesProvider.verbs){
				    		let verb = routesProvider.verbs[v];
				    		if(provider.actions[verb.action]){
								nroute[verb.name](verb.path, (req,res) => { sec.checkaccess(req, res, provider.actions[verb.action]) });
								console.log('	rute: '+verb.name+'(\''+verb.path+'\', () => ' + routes[r] + '->' + verb.action +' )\n');
				    		}else{
				    			console.log('no load '+verb.action+' in '+routes[r])
				    		}
				    	}
				    	app.use(busboy());
						app.use(nroute);	

					}
					console.log('\n');
				}
				resolve(app);
			
			})	
		}
	
};