// 连接mysql数据库 ，ORM层
const Sequelize = require('sequelize');

// 创建连接
module.exports = new Sequelize(config.databaseOptions.database, config.databaseOptions.user, config.databaseOptions.password, {
    // 数据库地址
    host: config.databaseOptions.host,
    // 数据库类型
    dialect:config.databaseOptions.dialect,
    // // 设置连接池
    pool:config.databaseOptions.pool,
    // 时区，北京时间东八区
    timezone:config.databaseOptions.timezone
})