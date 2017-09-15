'use strict';

module.exports = function(sets){
	let self     = this;
	this.default = {
		port:             8981,
		folderSchemes:   'schemes',
		folderProviders: 'providers',
		folderModels:    'models',
		appName: 'draweb-nrm',
		dbName:  'drawebnrm'
	};


	this.extend = function(){
		if(typeof sets == typeof {}){
			for(var i in sets){
				self.default[i] = sets[i];
			}
		}
		return self.default;
	}
	
	return self.extend();
}