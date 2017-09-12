'use strict';

let serve       = require("./models/server"),
	configModel = require('./models/config');

module.exports = new function(){
	let self = this;

	
	return {
		serve:  serve,
		config: configModel
	}
}