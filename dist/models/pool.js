'use strict';

var defaultConf = require('./config'),
	varbsModel  = require('./verbs'),
	routerModel = require('./router'),
	formatModel = require('./formatModel');

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
				let module = require(normalizedPath + "/" + file);
				if(!init)
			  		pool[file.replace('.js','')] = new module(self.scheme);
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

	this.loadPool = function(){
		return new Promise((resolve, reject)=>{
			self.loadLibs(config.folderSchemes)
			.then(
				function(schemes){
					self.scheme.schemes = schemes;
					self.loadLibs(config.folderModels, true)
					.then(function(models){
						self.scheme.models = models;
						self.loadLibs(config.folderProviders)
						.then(
							function(providers){
								self.scheme.providers = providers;
								resolve(self.scheme);
							}
						)
					})
				}
			)
		})
	}



	
	this.scheme = {
		schemes:   {},
		models:    {},
		providers: {},
		app:{
			verbs:       varbsModel,
			router:      routerModel,
			interceptor: formatModel
		}
	};

	return self.loadPool;
}