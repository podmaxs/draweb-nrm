'use strict';

var defaultConf = require('./config'),
	varbsModel  = require('./verbs'),
	routerModel = require('./router'),
	formatModel = require('./formatModel'),
	validator   = require('validator'),
	bcrypt      = require('bcrypt');

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

	this.loadDefaultModules = function(pool){
		this.scheme['libs'] = {
			validator: validator,
			bcrypt:    bcrypt
		};

		return this.scheme;
	}


	this.loadModule = function(normalizedPathModules, connection){
		let root      = process.env.PWD+'/modules',
			pool      = {};
		return new Promise((resolve, reject) => {
			require("fs").readdirSync(normalizedPathModules).forEach(function(module) {
				if(module != "." && module != ".."){
					self.makeIfNot(root+'/'+module);
					let normalizedPath = require("path").join(root, module);
						require("fs").readdirSync(normalizedPath).forEach(function(file) {
							let moduleFile = require(normalizedPath + "/" + file);
							if(file.indexOf('.scheme.js') != -1)
								self.scheme['schemes'][file.replace('.scheme.js','')] = new moduleFile(connection);
							if(file.indexOf('.model.js') != -1)
								self.scheme['models'][file.replace('.model.js','')] = moduleFile;
							if(file.indexOf('.provider.js') != -1)
								self.scheme['providers'][file.replace('.provider.js','')] = moduleFile;
						});
				}
			});
			resolve(self.loadDefaultModules(pool));
		});
	};


	this.loadModules = function(connection){
		let root = process.env.PWD;
		return new Promise((resolve, reject) => {
			let normalizedPath = require("path").join(root, '/modules/');
			self.makeIfNot(normalizedPath);
			self.loadModule(normalizedPath, connection)
			.then(
				(tempPool) => {
					resolve(self.scheme);	
				}
			)
			
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
			interceptor: formatModel,
			config:      config
		}
	};

	return self.loadModules;
}