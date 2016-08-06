'use strict';

var util = require('util');
const ValidationError  = require("sequelize").ValidationError;
const ForeignKeyConstraintError = require("sequelize").ForeignKeyConstraintError;

module.exports = function create(fittingDef) {

    return function error_handler(context, next) {
        if (!util.isError(context.error)) { return next(); }

        var err = context.error;
        if (err instanceof ValidationError || err instanceof ForeignKeyConstraintError ){
            context.response.statusCode = 400;
        }

        try {
            context.headers['Content-Type'] = 'application/json';

            if (!context.statusCode || context.statusCode < 400) {
                if (context.response && context.response.statusCode && context.response.statusCode >= 400) {
                    context.statusCode = context.response.statusCode;
                } else if (err.statusCode && err.statusCode >= 400) {
                    context.statusCode = err.statusCode;
                    delete(err.statusCode);
                }
                else {
                    context.statusCode = 500;
                }
            }

            Object.defineProperty(err, 'message', { enumerable: true }); // include message property in response
            if (context.statusCode === 500) {
                console.error(err.stack);
            }
            delete(context.error);
            next(null, JSON.stringify(err));
        } catch (err2) {
            //debug('jsonErrorHandler unable to stringify error: %j', err);
            next();
        }
    }
};
