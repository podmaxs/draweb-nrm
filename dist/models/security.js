
'use strict';
let  responseProvider = require('./../providers/response');

module.exports = function(config) {
	let self = this;


	this.checkaccess = function( request, response, provider){
		if(config.apikey !== false){
			let res = new responseProvider(response);
			if(request.headers.apikey != null){
				if(request.headers.apikey === config.apikey){
					provider(request, response);
				}else{
					res.error("Access denied. Invalid apikey");
				}
			}else{
				res.error("Access denied. No found apikey");
			}
		}else{
			provider(request, response);
		}
	}


};
