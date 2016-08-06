import {mysqlUrl, sequelizeLogging, environment} from './utils/consts';
import Sequelize from 'sequelize';

let sequelize = null;
try {
    sequelize = new Sequelize(mysqlUrl, {
            define: {
                charset: 'utf8',
                collate: 'utf8_general_ci'
            },
            logging: sequelizeLogging
        }
    );

}
catch (err) {
    console.log(err);
}

export default {sequelize};

