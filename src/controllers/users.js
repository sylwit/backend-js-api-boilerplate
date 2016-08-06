import {User} from './../models/users';
import _ from 'lodash';
import filters from './../utils/filters';

const PASSWORD_MIN_LENGTH = 6;

export default {

    findAll: async function (req, res, next) {
        try {

            const findConditions = await filters.buildFilters(req.swagger.params);

            let users = await User.findAndCountAll(findConditions).catch(
                function (err) {
                    console.log(err);
                }
            );

            res.json(users);
            return next();

        }
        catch (e) {
            return next(e);
        }
    },

    findOne: async function (req, res, next) {
        try {
            const user = await User.findById(req.swagger.params.id.value);

            if (!user) {
                res.status(404).send({message: 'User not found'});
                return next();
            }

            res.json(user);
            return next();
        }
        catch (e) {
            return next(e);
        }
    },

    create: async function (req, res, next) {
        try {
            let data = _.omit(req.swagger.params.body.value, ['phone1CountryCode']);

            data.pass = data.pass || Date.now().toString();
            if (data.pass.length < PASSWORD_MIN_LENGTH) {
                res.statusCode = 400;
                return next(new Error(`Password must be at least ${PASSWORD_MIN_LENGTH} characters long`));
            }

            data.pass = hashPassword(data.pass);


            if (data.phone1) {
                try {
                    const phone = await userHelper.getNormalizePhone(data.phone1);
                    data.phone1 = phone.phoneNumber || null;
                    data.phone1CountryCode = phone.countryCode || null
                }
                catch (e) {
                    res.statusCode = 400;
                    return next(e);
                }
            }

            const user = await User.create(data);
            res.status(201).json(await user.reload());
            return next();
        }
        catch (e) {
            return next(e);
        }
    },

    update: async function (req, res, next) {
        try {
            const user = await User.findById(req.swagger.params.id.value);

            if (!user) {
                res.status(404).send({message: 'User not found'});
                return next();
            }

            let data = _.omit(req.swagger.params.body.value, ['id', 'phone1CountryCode']);

            if (data.pass) {
                if (data.pass.length < PASSWORD_MIN_LENGTH) {
                    res.statusCode = 400;
                    return next(new Error(`Password must be at least ${PASSWORD_MIN_LENGTH} characters long`));
                }
                data.pass = hashPassword(data.pass);
            }

            if (data.phone1) {
                try {
                    const phone = await userHelper.getNormalizePhone(data.phone1);
                    data.phone1 = phone.phoneNumber || null;
                    data.phone1CountryCode = phone.countryCode || null
                }
                catch (e) {
                    res.statusCode = 400;
                    return next(e);
                }
            }

            const params = _.merge(user.get(), data);

            await User.update(params, {where: {id: user.get('id')}});

            res.json(await user.reload());
            return next();
        }
        catch (e) {
            return next(e);
        }

    },

    delete: async function (req, res, next) {
        try {
            User.destroy({where: {id: req.swagger.params.id.value}});

            res.status(204).json();
            return next();
        }
        catch (e) {
            return next(e);
        }

    }

};

