'use strict';

	var responseProvider = require('./../providers/response'),
		filterModel      = require('./formatModel'),
		uploadModel      = require('./uploadModel');

	module.exports = function(schema) {
		var self         = this;
			this.filters = {};


		this.resolveScheme = function(err, data, resolve, reject){
			if(!err)
				if(data)
					resolve({data:data,log:'Done'});
				else
					resolve({data:{},log:'Done'});
			else
				reject(err);
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
		this.get = function(request, response){
			let verbsProcess = self.getFilter('get'),
				res          = new responseProvider(response);
			self.resolveProcess(res, verbsProcess.process(request, response, (body) => {
				return new Promise((resolve, reject) => {
					schema.findOne({'_id':request.params.id}).find((err, data) => {  self.resolveScheme(err, data, resolve, reject)});
				});
			}));
		};

		// verb getList
		this.getList = function(request, response){
			let verbsProcess = self.getFilter('list'),
				res          = new responseProvider(response);
			self.resolveProcess(res, verbsProcess.process(request, response, (body) => {
				return new Promise((resolve, reject) => {
					schema.find(body).find((err, data) => self.resolveScheme(err, data, resolve, reject));
				});
			}));
		};

		// verb post
		this.post = function(request, response){
			let verbsProcess = self.getFilter('post'),
			res              = new responseProvider(response);
			self.resolveProcess(res, verbsProcess.process(request, response, body => {
				return new Promise((resolve, reject) => {
					let nSchema = new schema(body);
					nSchema.save((err, data) => {
						self.resolveScheme(err,data, resolve, reject);
					});
				});
			}));
		};

		// verb put
		this.put = function(request, response){
			let verbsProcess = self.getFilter('put'),
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
		this.delete = function(request, response){
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
		this.upload = function(request, response){
			let verbsProcess = self.getFilter('upload'),
			res              = new responseProvider(response);
			self.resolveProcess(res, verbsProcess.process(request, response, body => {
				return new Promise((resolve, reject) => {
					let uploadSrv = new uploadModel();
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
				res.error(response.log, response.code);
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

		this.scheme = {
			get:             self.get,
			list:            self.getList,
			post:            self.post,
			put:             self.put,
			delete:          self.delete,
			upload:          self.upload,
			setInterceptor:  self.setFilter
		};

		return this.scheme;
	}