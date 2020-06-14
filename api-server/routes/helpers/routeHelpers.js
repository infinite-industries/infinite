const express = require("express");
const uuidv1 = require('uuid/v1');
const JWTAuthenticator = require(__dirname + '/../../utils/JWTAuthenticator')
const { logger }  = require(__dirname + '/../../utils/loggers')
const getPostBodyChecker = require(__dirname + '/../middleware/postBodyChecker')

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
    options = options || {};

    const paramID = `${router_name_singular}ID`
    const identifier = paramID + idRegExp;

    const postBodyChecker = getPostBodyChecker(router_name_singular)
    const router = express.Router();

    const readMiddleware = options.readMiddleware || []; // by default parse any tokens, don't require them
    const createAfterMethod = options.createAfterMethod || (() => null)

    // by default creates, updates, and deletes will require a valid JWT with admin level access
    let createMiddleware = options.createMiddleware || JWTAuthChain // by default admin only
    let updateMiddleware = options.updateMiddleware || JWTAuthChain // by default admin only
    let deleteMiddleware = options.deleteMiddleware || JWTAuthChain // by default admin only

  const readFilter = options.readFilter

    // append post body check (eventually i'd like to shift most logic out of this file and into middleware
    createMiddleware = [...createMiddleware, postBodyChecker] // append post body checks
    updateMiddleware = [...updateMiddleware, postBodyChecker] // append post body checks

    logger.debug('establishing router "/" for router "%s"', router_name);
    router.get("/", readMiddleware, function(req, res) {
        logger.info("handling request for all " + router_name);

        const sortField = req.query.sort_field || false;
        const filter_field = req.query.filter_field ||false;

        let queryStr = req.query.query;
        let query = {};

        if (queryStr) {
            try {
                query = JSON.parse(queryStr);
            } catch(ex) {
                logger.warn('error parsing query obj: ' + ex);
                logger.warn('invalid object string: ' + queryStr);
                return res.status(500).json({ status: 'failure', error_message: 'error: ' + ex });
            }
        }

        // allow a custom all method to be passed in
        const allMethod = options && options.allMethod ? options.allMethod : controller.all;
        allMethod(req.app.get('db'), function(err, data) {
            if (err) {
                logger.warn(`error handling request for all ${router_name}: ${err}`);
                res.status(500).json({ status: constants.db_error });
            } else {
                logger.debug('found all requested ' + router_name);

                if (sortField) {
                    data = data.sort(function(a, b) {
                        return (a[sortField] || 0) > (b[sortField] || 0);
                    });
                }

                const resp = { status: constants.success_status };

                if (readFilter) {
                  readFilter(req, data)
                }

                resp[router_name] = data;
                res.status(200).json(resp);
            }
        }, query, filter_field);
    });

    logger.debug('establish router /:%s for router %s', identifier, router_name);
    router.get("/:" + identifier,
		readMiddleware,
        function(req, res) {
            logger.info(`${router_name} -- ${req.url} -- token: ${JSON.stringify(req.token || '[no-token]', null, 4)}`)
            const id = req.params[paramID]

            logger.info(`handling  get request for ${router_name} by id: ${id}`);

			const byIDMethod = options && options.byIDMethod ? options.byIDMethod : controller.findById;
            byIDMethod(req.app.get('db'), id, function(err, data) {
                if(err) {
                    logger.warn("error handling request for artist: " + err);
                    res.status(500).json({ "status": constants.db_error });
                }
                else if (data===null) {
                    logger.debug('could not find the requested %s:%s', router_name_singular, id);
                    res.status(404).json({"status":"no_such_id"});
                }
                else {
                  const resp = { status: constants.success_status };

                  if (readFilter) {
                    readFilter(req, data)
                  }

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
          const postJSON = req.postJSON
          const id = req.params[paramID]

          logger.info(`handling put request for '${router_name}' on id '${id}'`)

          controller.update(req.app.get('db'), id, postJSON, function (err) {
              if (err) {
                  logger.warn(`error updating ${router_name_singular}: "${err}"`)
                  return res.status(500).json({status: err})
              }

              res.status(200).json({status: 'success', id: postJSON.id})
          })
      })

    router.post(
	    '/',
        createMiddleware,
        function(req, res) {
            logger.info(`handling post request for '${router_name}'`);
            const postJSON = req.postJSON
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
                    logger.warn(`error creating ${router_name_singular}: "${err}"`);
                    return res.status(500).json({ status: err });
                }

                const responseData = { status: 'success', id: postJSON.id }

                createAfterMethod(req, responseData)

                res.status(200).json(responseData);
            });
	});

	router.delete(
	    '/:' + identifier,
        deleteMiddleware,
        (req, res) => {
            const id = req.params[paramID]
	        logger.info(`handling delete request for "${router_name}" for event id "${id}"`)

            controller.delete(req.app.get('db'), id, err => {
                if (err) {
                    logger.warn(`error destroying "${id}: "${err}"`)
                    return res.status(500).json({ status: err })
                }

                res.status(200).json({ status: 'success', id })
            })
        })

    return router;
}
