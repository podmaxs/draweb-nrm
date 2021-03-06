'use strict';

	var responseProvider = require('./../providers/response'),
		filterModel      = require('./formatModel'),
		uploadModel      = require('./uploadModel'),
		reoter           = require('./router'),
		fs 				 = require('fs'),
		Log 			 = require('log'),
		logfile			 = new Log('debug', fs.createWriteStream(__dirname + '/verbose.log'));

	module.exports = function(schema) {
		var self         = this;
		this.filters     = {};
		self.listAllowed = {};

		this.resolveScheme = function(err, data, resolve, reject){
			if(!err)
				if(data)
					resolve({data:data,log:'Done'});
				else
					resolve({data:{},log:'Done'});
			else
				reject(err);
			if(err)
				logfile.error('error with mongodb',err);
		}

		this.resolveProcess = function(res,process){
			process
			.then(
				response => {
					self.defaultSuccess(response,res);
				},
				error => {
					self.defaultError(error, res);
				}
			);
		}

		// verb get
		this.get = function(request, response, verbName){
			let verbsProcess = self.getFilter(verbName),
				res          = new responseProvider(response);
			self.resolveProcess(res, verbsProcess.process(request, response, (body) => {
				return new Promise((resolve, reject) => {
					schema.findOne({'_id':request.params.id}).find((err, data) => {  self.resolveScheme(err, data, resolve, reject)});
				});
			}));
		};

		// verb getList
		this.getList = function(request, response, verbName){
			let verbsProcess = self.getFilter(verbName),
				res          = new responseProvider(response);
			self.resolveProcess(res, verbsProcess.process(request, response, (body) => {
				return new Promise((resolve, reject) => {
					body = typeof body == typeof {}? body: {};
					schema.find(body.query || {}).sort(body.sort || {}).skip(body.skip || 0).limit(body.limit || 20).find((err, data) => self.resolveScheme(err, data, resolve, reject));
				});
			}));
		};

		// verb post
		this.post = function(request, response, verbName){
			let verbsProcess = self.getFilter(verbName),
			res              = new responseProvider(response);
			self.resolveProcess(res, verbsProcess.process(request, response, body => {
				return new Promise((resolve, reject) => {
					let nSchema = new schema(body);
					nSchema.save((err, data) => {
						self.resolveScheme(err, data, resolve, reject);
					},
					err => {
						self.resolveScheme(err, [], resolve, reject);
					});
				});
			}));
		};

		// verb put
		this.put = function(request, response, verbName){
			let verbsProcess = self.getFilter(verbName),
			res              = new responseProvider(response);
			self.resolveProcess(res, verbsProcess.process(request, response, body => {
				return new Promise((resolve, reject) => {
					schema.findById(request.params.id).find((err, entity) => {
						if(!err){
							entity = Array.isArray(entity)?entity[0]:entity;
							if(entity){
								for(let k in body)
									entity[k] = body[k];
								entity.save((err, data) => { self.resolveScheme(err, data, resolve, reject); });
							}else{
								self.resolveScheme("No found data to updated", [], resolve, reject);
							}
						}else{
							self.resolveScheme(err, [], resolve, reject);
						}
					});
				});
			}));
		};

		// verb delete
		this.delete = function(request, response, verbName){
			let verbsProcess = self.getFilter('delete'),
			res              = new responseProvider(response);
			self.resolveProcess(res, verbsProcess.process(request, response, body => {
				return new Promise((resolve, reject) => {
					schema.findById(request.params.id).find((err, entity) => {
						if(!err){
							if(entity){
								entity = Array.isArray(entity)?entity[0]:entity;
								entity.remove((err, data) => self.resolveScheme(err, data, resolve, reject));
							}else{
								self.resolveScheme("No found data to delete", [], resolve, reject)
							}
						}else{
							self.resolveScheme(err, [], resolve, reject);
						}
					});
				});
			}));
		};

		// verb upload
		this.upload = function(request, response, verbName){
			let verbsProcess = self.getFilter(verbName),
			res              = new responseProvider(response);
			self.resolveProcess(res, verbsProcess.process(request, response, uploadService => {
				return new Promise((resolve, reject) => {
					let uploadSrv = !uploadService.registerUpload? new uploadModel(): uploadService;
					uploadSrv.registerUpload(request, response)
					.then(
						data => {
							self.resolveScheme(false, data, resolve, reject);
						},
						error => {
							self.resolveScheme(error, [], resolve, reject);
						}
					)
				});
			}));
		};

		this.defaultSuccess = (response, res) => {
			if(typeof response == typeof "")
				res.success(response);
			else
				res.success(response.data,response.log);
		};

		this.defaultError = (response, res) => {
			if(typeof response == typeof "")
				res.error(response);
			else
				if(response.log)
					res.error(response.log, response.code);
				else
					res.error(response, 609);
			logfile.error('error on request',response);
		};

		this.getFilter = function(verbName){
			if(self.filters[verbName])
				return self.filters[verbName];
			else
				return new filterModel();
		}

		this.setFilter = function(verbName, filter){
			self.filters[verbName] = filter;
		}

		this.renderSchemeVerbs = function(){
			for(var verb in self.verbs)
				self.scheme.actions[verb] = self.verbs[verb];
		}

		this.verbsList = function(){
			self.renderSchemeVerbs();	
			return self.verbs;
		}

		this.pushverb = function (name, seed){
			self.verbs[name] = seed;
			self.renderSchemeVerbs();	
		}

		this.cloneVerb = function(name, nname){
			if(self.verbs[name])
				self.pushverb(nname, self.verbs[name]);
			else
				console.log(name+' verb no exists. ');
		}

		this.getRutes = function(rute){
			let ruteVerb = new reoter(rute),
				listVerbs = Array.isArray(self.listAllowed)? self.filterRutes(): self.verbs;
			ruteVerb.clearActions();
			for(let v in listVerbs)
				ruteVerb.addVerb(listVerbs[v].verb, v, v);
			return ruteVerb;
		}

		this.verbsActions = function (){
			let list = {};
			for(var ac in self.verbs)
				list[ac] = self.verbs[ac].action;

			return list;
		}

		this.filterRutes = function(){
			let nvList = {};
			if(Array.isArray(self.listAllowed))
				for(let i in self.listAllowed)
					if(self.verbs[self.listAllowed[i]] != null)
						nvList[self.listAllowed[i]] = self.verbs[self.listAllowed[i]];
			return nvList;
		}

		this.setFilterRoutes = function(filter){
			self.listAllowed = filter;
		}


		this.verbs   = {
			get:             {
				verb:   'get',
				action:  self.get
			},
			list:            {
				verb:   'get',
				action:  self.getList
			},
			post:            {
				verb:   'post',
				action:  self.post
			},
			put:             {
				verb:   'put',
				action:  self.put
			},
			delete:          {
				verb:   'delete',
				action:  self.delete
			},
			upload:          {
				verb:   'post',
				action:  self.upload
			}
		}

		this.scheme = {
			actions: 		 self.verbsActions(),
			setInterceptor:  self.setFilter,
			verbs:           self.verbsList,
			pushVerb:        self.pushverb,
			cloneVerb:       self.cloneVerb,
			getRoutes:       self.getRutes,
			filterRoutes:    self.setFilterRoutes,
			apply:           self.renderSchemeVerbs,
		};

		return this.scheme;
	}