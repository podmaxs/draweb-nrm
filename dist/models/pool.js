'use strict';

var defaultConf = require('./config');

module.exports = function(config){
	let self = this;

	if(!config)
		config = new defaultConf();

	this.loadLibs = function(folder, init){
		let root = process.env.PWD;
		return new Promise((resolve, reject) => {
			self.makeIfNot(root+'/'+folder);
			let normalizedPath = require("path").join(root, folder),
				pool           = {};
			require("fs").readdirSync(normalizedPath).forEach(function(file) {
				let module = require(folder + "/" + file);
				if(!init)
			  		pool[file.replace('.js','')] = new module();
			  	else
			  		pool[file.replace('.js','')] = module;
			});
			resolve(pool);
		});
	};

	this.makeIfNot = function(path){
		var fs = require('fs');
		if (!fs.existsSync(path))
		    fs.mkdirSync(path);
	}


	
	return {
		schemes:   self.loadLibs(config.folderSchemes),
		models:    self.loadLibs(config.folderModels, true),
		providers: self.loadLibs(config.folderProviders)
	}
}