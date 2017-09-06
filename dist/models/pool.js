'use strict';

module.exports = function(config){
	let self = this;


	this.loadLibs = function(folder, init){
		return new Promise((resolve, reject) => {
			let normalizedPath = require("path").join(__dirname, folder),
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


	
	return {
		schemes:   self.loadLibs(config.folderSchemes),
		models:    self.loadLibs(config.folderModels, true),
		providers: self.loadLibs(config.folderProviders)
	}
}