const express = require("express");
const uuidv1 = require('uuid/v1');
const JWTAuthenticator = require(__dirname + '/../../utils/JWTAuthenticator')

const JWTAuthChain = [JWTAuthenticator(true)]
const constants = {
    db_error: 'db_fail',
    success_status: 'success'
};

const idRegExp = '([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})'

module.exports = {
    constants,
	getDefaultRouter
};

function getDefaultRouter(router_name, router_name_singular, controller, forcedValues, options) {
    const debug = require('debug')('router:' + router_name);
    const paramID = `${router_name_singular}ID`
    const identifier = paramID + idRegExp;

    const router = express.Router();
    options = options || {};
    const readMiddleware = options.readMiddleware || []; // by default parse any tokens, don't require them
    const createMiddleware = options.createMiddleware || JWTAuthChain // by default admin only
    const updateMiddleware = options.updateMiddleware || JWTAuthChain // by default admin only

	router.use('/', function(req, res, next) {
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
		res.header('Access-Control-Allow-Headers',
			'Content-Type, Authorization, Content-Length, X-Requested-With');
		next();
	});

    debug('establishing router "/" for router "%s"', router_name);
    router.get("/", readMiddleware, function(req, res) {
        console.log("handling request for all " + router_name);

        const sortField = req.query.sort_field || false;
        const filter_field = req.query.filter_field ||false;

        let queryStr = req.query.query;
        let query = {};

        if (queryStr) {
            try {
                query = JSON.parse(queryStr);
            } catch(ex) {
                console.warn('error parsing query obj: ' + ex);
                console.warn('invalid object string: ' + queryStr);
                return res.status(500).json({ status: 'failure', error_message: 'error: ' + ex });
            }
        }

        // allow a custom all method to be passed in
        const allMethod = options && options.allMethod ? options.allMethod : controller.all;
        allMethod(req.app.get('db'), function(err, data) {
            if (err) {
                console.warn("error handling request for all %s: %s: ", router_name, err);
                res.status(500).json({ status: constants.db_error });
            } else {
                debug('found all requested ' + router_name);

                if (sortField) {
                    data = data.sort(function(a, b) {
                        return (a[sortField] || 0) > (b[sortField] || 0);
                    });
                }

                const resp = { status: constants.success_status };
                resp[router_name] = data;
                res.status(200).json(resp);
            }
        }, query, filter_field);
    });

    debug('establish router /:%s for router %s', identifier, router_name);
    router.get("/:" + identifier,
		readMiddleware,
        function(req, res) {
            console.log(`${req.url}: ${JSON.stringify(req.token, null, 4)}`)
            const id = req.params[paramID]

            console.log("handling  get request for %s by id: %s", router_name, id);

			const byIDMethod = options && options.byIDMethod ? options.byIDMethod : controller.findById;
            byIDMethod(req.app.get('db'), id, function(err, data) {
                if(err) {
                    console.warn("error handling request for artist: " + err);
                    res.status(500).json({ "status": constants.db_error });
                }
                else if (data===null) {
                    debug('could not find the requested %s:%s', router_name_singular, id);
                    res.status(404).json({"status":"no_such_id"});
                }
                else {
                    const resp = { status: constants.success_status };
                    resp[router_name_singular] = data;
                    res.status(200).json(resp);
                }
            })
        }
    );

    router.put(
        '/:' + identifier,
        updateMiddleware,
        (req, res) => {
			const id = req.params[paramID];

			console.log("handling put request for '%s' on id '%s'", router_name, id);
			const postJSON= req.body[router_name_singular];

			if (!postJSON)
				return res.status(422).json({ status: router_name_singular + ' parameter is required' });

			controller.update(req.app.get('db'), id, postJSON, function(err) {
				if (err) {
					console.warn('error updating "%s"', router_name_singular + ': ' + err);
					return res.status(500).json({ status: err });
				}

				res.status(200).json({ status: 'success', id: postJSON.id });
			});
        });

	router.post(
	    '/',
        createMiddleware,
        function(req, res) {
            console.log("handling post request for '%s'", router_name);
            const postJSON= req.body[router_name_singular];

            if (!postJSON)
                return res.status(422).json({ status: router_name_singular + ' parameter is required' });

            postJSON.id = uuidv1();

            if (forcedValues) {
                const keys = Object.keys(forcedValues);
                for (let i = 0; i < keys.length; i++) {
                    const key = keys[i];
                    postJSON[key] = forcedValues[key];
                }
            }

            controller.create(req.app.get('db'), postJSON, function(err) {
                if (err) {
                    console.warn('error creating "%s"', router_name_singular + ': ' + err);
                    return res.status(500).json({ status: err });
                }
                res.status(200).json({ status: 'success', id: postJSON.id });
            });
	});

	router.delete(
	    '/:' + identifier,
        updateMiddleware,
        (req, res) => {
            const id = req.params[paramID]
	        console.log(`handling delete request for "${router_name}" for event id "${id}"`)

            controller.delete(req.app.get('db'), id, err => {
                if (err) {
                    console.warn(`error destroying "${id}: "${err}"`)
                    return res.status(500).json({ status: err })
                }

                res.status(200).json({ status: 'success', id })
            })
        })

    return router;
}
