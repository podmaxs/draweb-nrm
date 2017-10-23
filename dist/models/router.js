'use strict';

let express        = require('express');
	module.exports = function(routeName) {
		var self = this;	
	
		this.defaultVerbs = [
			{
				'name':    'get',
				'path':    '/'+routeName+'/:id',
				'provider': routeName,
				'action'  : 'get'
			},
			{
				'name':    'get',
				'path':    '/'+routeName+'list',
				'provider': routeName,
				'action'  : 'list'
			},
			{
				'name':    'post',
				'path':    '/'+routeName,
				'provider': routeName,
				'action'  : 'post'
			},
			{
				'name':    'put',
				'path':    '/'+routeName+'/:id',
				'provider': routeName,
				'action'  : 'put'
			},
			{
				'name':    'delete',
				'path':    '/'+routeName+'/:id',
				'provider': routeName,
				'action'  : 'delete'
			},
			{
				'name':    'post',
				'path':    '/'+routeName+'/upload',
				'provider': routeName,
				'action'  : 'upload'
			}
		];

		this.clearVerbs = function(){
			self.scheme.verbs = [];
		};

		this.pushVerb = function(name, path, action, provider){
			let defaultVerb = self.defaultVerbs.find((it) => { it.name == name;});
			if(defaultVerb != null ){
				defaultVerb.path     = defaultVerb.path.replace('/'+routeName,'/'+routeName+'/'+path) || '';
				defaultVerb.proveder = provider? provider : defaultVerb.provider;
				defaultVerb.action   = action || '';
			}else{
				defaultVerb = {
					name:      name == 'list'?'get':name,
					path:      '/'+routeName+'/'+path || '/'+routeName+'/list',
					provider:  provider || routeName,
					action:    action || name
				};
			}
			self.scheme.verbs.push(defaultVerb);
		};

		this.rmAction = function(action){
			self.scheme.verbs = self.scheme.verbs.filter((it)=>{
				return it.action != action;
			})
		};

		this.scheme =  {
			verbs:        self.defaultVerbs,
			addVerb:      self.pushVerb,
			rmAction:     self.rmAction,
			clearActions: self.clearVerbs
		}

		return this.scheme;
	
};