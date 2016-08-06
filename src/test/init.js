import {sequelize} from '../db';

before(async function () {
    try {
        await sequelize.dropAllSchemas();
        await sequelize.models.sync();


    }
    catch (e) {
        console.log(e);
    }
});