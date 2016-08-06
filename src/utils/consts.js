export default {
    environment: process.env.NODE_ENV || 'development',
    appName: process.env.APP_NAME || 'Backend JS API Service',
    mysqlUrl: process.env.MYSQL_URL,
    sequelizeLogging: 'true' == process.env.SEQUELIZE_LOGGING ? console.log : false
}
