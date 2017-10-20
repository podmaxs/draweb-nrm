'use strict';

let express        = require('express');
	module.exports = function(routeName) {
		var self = this;	
	

		this.pushVerb = function(name, path, action, provider){
			self.scheme.verbs.push({
				name:      name == 'list'?'get':name,
				path:      path || '/list',
				provider:  provider || routeName,
				action:    action || name
			});
		}

		this.rmAction = function(action){
			self.scheme.verbs = self.scheme.verbs.filter((it)=>{
				return it.action != action;
			})
		}

		

		this.scheme =  {
			verbs:   [
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
			],
			addVerb: self.pushVerb,
			rmAction: self.rmAction
		}

		return this.scheme;
	
};