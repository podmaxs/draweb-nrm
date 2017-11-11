'use strict';

let express  = require('express'),
	busboy   = require('connect-busboy'),
	headers  = require('../models/headers'),
	security = require('../models/security');

	module.exports = function(app, routes, pool, config) {
		let self = this,
			sec  = new security(config);

		new headers(app, config.headers);

		this.checkPath = (verb, path) => {
			if(verb == 'put' && path.indexOf('/:id') == -1)
				path+='/:id';
			return path;
		};

		this.load = function(){
			return new Promise((resolve, reject) => {	
				if(Array.isArray(routes)){
					console.log('\n');
					console.log('	Routes defined: \n');
					for(let r in routes){
						if(pool.providers[routes[r]]){
					    	let nroute = express(),
					    		provider        = new pool.providers[routes[r]](pool),
					    		routesProvider  = provider.getRoutes(routes[r]);
					    	console.log('\n\n	*** '+routes[r]+':\n')
					    	for(let v in routesProvider.verbs){
					    		let verb = routesProvider.verbs[v];
					    		if(provider.actions[verb.action]){
					    			let  path = self.checkPath(verb.name, verb.path);
									nroute[verb.name](path, (req,res) => { sec.checkaccess(req, res, verb.action, provider.actions[verb.action]) });
									console.log('	rute: '+verb.name+'(\''+path+'\', () => ' + routes[r] + '->' + verb.action +' )\n');
					    		}else{
					    			console.log('no load '+verb.action+' in '+routes[r])
					    		}
					    	}
					    	app.use(busboy());
							app.use(nroute);
						}else{
							console.log('<><><><> WARNING!!! - No found provider', routes[r]);
						}

					}
					console.log('\n');
				}
				resolve(app);
			
			})	
		}
	
};