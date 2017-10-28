
'use strict';
let  responseProvider = require('./../providers/response');

module.exports = function(config) {
	let self = this;


	this.checkaccess = function( request, response, action, provider){
		if(config.apikey !== false){
			let res = new responseProvider(response);
			if(request.headers.apikey != null){
				if(request.headers.apikey === config.apikey){
					provider.action(request, response, action);
				}else{
					res.error("Access denied. Invalid apikey");
				}
			}else{
				res.error("Access denied. No found apikey");
			}
		}else{
			provider.action(request, response, action);
		}
	}


};
