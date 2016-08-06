import Sequelize from 'sequelize';
import {sequelize} from './../db';

export const User = sequelize.define('user', {
        id: {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        email: {
            type: Sequelize.STRING(100),
            validate: {
                isEmail: true
            }
        },
        status: {
            type: Sequelize.STRING(15),
            allowNull: false,
            validate: {
                isIn: {
                    args: [['pending', 'active', 'inactive']],
                    msg: "Must have a valid status"
                }
            }
        },
        firstname: Sequelize.STRING(100),
        lastname: Sequelize.STRING(100),
        phone1: Sequelize.STRING(20),
        phone1CountryCode: Sequelize.STRING(2),

        company: Sequelize.STRING(100),
        companyIdentification: Sequelize.STRING(100),
        roofing: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        pass: {
            type: Sequelize.STRING(60),
            allowNull: false,
            validate: {
                len: [60, 60],
                notEmpty: true
            }
        },
        lang: {
            type: Sequelize.STRING(2),
            allowNull: false,
            validate: {
                isIn: {
                    args: [['en', 'fr']],
                    msg: "Must be in [en, fr]"
                }
            }
        }

    },
    {
        timestamps: true,
        paranoid: true,
        indexes: [
            {
                unique: true,
                fields: ['email']
            },
            {
                unique: true,
                fields: ['phone1']
            },
            {
                fields: ['createdAt']
            }
        ],
        validate: {
            emailOrPhone: function () {
                if (!this.email && !this.phone1) {
                    throw new Error('Email or Phone is mandatory')
                }
            },
            roofingForPro: function () {
                if (this.roofing && !this.companyIdentification) {
                    throw new Error('companyIdentification is mandatory for roofing option')
                }
            }
        },
        instanceMethods: {
            toJSON: function () {
                let values = this.get();

                delete values.pass;
                return values;
            }
        }
    });


User.findByLogin = function (login) {
    return new Promise((resolve, reject) => {
        try {

            let where = {};
            if (login.indexOf('@') > -1) {
                where.email = login;
            }
            else {
                where.phone1 = login;
            }

            return this.findOne({where: where}).then(function (user) {
                resolve(user);
            });
        }
        catch (e) {
            reject(e);
        }
    });
}

export default {User}
