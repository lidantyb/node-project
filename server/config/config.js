// 数据库配置
exports.databaseOptions = {
    // 数据库名称
    // database: 'myserver',
    database: 'manage',
    // 数据库表名
    user: 'root',
    // 数据库密码
    // password: 'ab123456',
    password: '123456',
    // 数据库地址
    // host: '120.55.81.135',
    host: 'localhost',
    // 数据库类型
    dialect: 'mysql',
    // // 设置连接池
    pool: {
        // 最大连接数
        max: 5,
        // 最小连接数
        min: 0,
        // 连接超时30s,自动释放
        acquire: 30000,
        // 闲置时间10s，自动释放
        idle: 10000
    },
    // 时区，北京时间东八区
    timezone: '+08:00'
}

//请求体配置
exports.requestBodyOptions = {
    limit: '3072kb'
}

// 服务器配置
exports.serverOptions = {
    host: 'http://127.0.0.1',
    port: 8000
}

// 加盐配置
exports.saltOptions = {
    // 密码加盐
    passwordSalt: '_pw'
}

// 发邮件配置
exports.emailOptions = {
    // 主机
    host: "smtp.163.com",
    // 端口, 25端口在阿里云服务器禁用，建议统一使用465端口
    port: 465,
    // 当端口为465，需要设置为true
    secure: true,
    // 身份验证
    auth: {
        // 发邮件地址，即开通授权码的邮箱地址
        user: 'lidantyb@163.com',
        pass: 'YGMJGWPGYIPSWRKX',
    },
}

//token的过期时间
exports.tokenOptions = {
    expires: '5d',
    //token加盐
    tokenSalt: '_tk'
}