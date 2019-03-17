#!/usr/bin/env node

/*
	requires:
		--user <username>
		--org <organization>
 */
const uuidv4 = require('uuid/v4')
const DevKeyController = require('../controllers/devKeys')
const sequelize = require(__dirname + '/../utils/connection')()
const nconf = require('nconf')
const debug = require('debug')('scripts:createDevKey')
const util = require('util')
nconf.env().argv()

const user_name = nconf.get('user')
const organization = nconf.get('org')
const id = nconf.get('id') || uuidv4()

debug(util.format('running script with user_name: "%s", organization: "%s"', user_name, organization))

if (!user_name || !organization)
	return printUsage();

  sequelize
	.authenticate()
	.then(() => {
        debug(`create key with id: ${id}`);
		sequelize.dev_key.create({ id, user_name, organization })
		  .then(() => {
              debug('script completed with success');
              console.log('success => created devKey "%s"', id);
              console.log('keep this key secret');
              sequelize.close()
		  })
		  .catch(err => {
              console.error('error creating devKey: ' + err);
              process.exit(1)
		  })
	})
	.catch(err => {
		console.error(err)
		process.exit(1)
	})

function printUsage() {
	console.log([
		'Usage: ',
		'createDevKey [--org organization] [--user user name]'
	].join('\n'));
}
