'use strict';

module.exports = function(sets){
	let self     = this;
	this.default = {
		port:             89,
		folderSchemes:   'schemes',
		folderProviders: 'providers',
		folderModels:    'models'
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