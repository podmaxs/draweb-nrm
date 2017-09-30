'use strict';

module.exports = function(sets){
	let self     = this;
	this.default = {
		port:             8981,
		folderSchemes:   'schemes', //decreaped
		folderProviders: 'providers', //decreaped
		folderModels:    'models', //decreaped
		appName:         'draweb-nrm',
		dbName:          'drawebnrm',
		headers:          [],
		apikey:           false
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