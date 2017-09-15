'use strict';

let serve       = require("./models/server"),
	routerModel = require('./models/router'),
	configModel = require('./models/config');

module.exports = new function(){
	let self = this;

	
	return {
		serve:  serve,
		config: configModel,
		router: routerModel
	}
}