/* eslint-disable semi */


const debug = require('debug')('restful:controllers:index');

/**
 * Create controllers for Application (swagger)
 */


/**
 * wrap all controllers (redefine the 'next'. If next has argument, throw error (redis and res.json.end).
 * @param {function} handler - The function for controller.
 * @returns {Function} - the wrap function.
 */
function wrapHandler(handler) {
  debug('wrapHandler called');
  return (req, res, next) => {
    try {
      handler(req, res, (err) => {
        if (err) {
          debug(err);

          // send 503 and error as string
          res.status(503).json({
            code: 'controller_error',
            message: typeof (err) === 'string' ? err : err.message,
          }).end();
        } else {
          next();
        }
      });
    } catch (e) {
      debug(e);

      res.status(503).json({
        code: 'controller_error',
        message: typeof (e) === 'string' ? e : e.message,
      }).end();
    }
  };
}


/**
 * each the controllers function and call to wrap function.
 * @param {object} controllers - The controllers list (object)
 * @returns {*}
 */
function wrapControllers(controllers) {
  debug('wrapControllers called');
  // controllers.forEach(controller => wrapHandler(controller));
  for (const k in controllers) {
    debug(`setting wrapHandler to: ${k}`);
    controllers[k] = wrapHandler(controllers[k]);
  }

  return controllers;
}


/**
 * Create and return the controllers Object for swagger & routers.
 * @param {object} main - The main object create by Application instance (app.js)
 * @returns {object} - Controller object
 */
function makeControllers(main) {
  debug('main function called');

  const controllers = {
    especie: require('./especie')(main),
  };


  return wrapControllers({
    'especie.search_get': controllers.especie.search,
    'especie.insert_put': controllers.especie.insert,
  }, main.announce);
}


module.exports = makeControllers;
