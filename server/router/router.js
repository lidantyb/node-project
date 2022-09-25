// 路由层

// 导入路由控制层
const routerControllar = require(__basename + '/router_controllar/routerControllar.js')

module.exports = app => {

    // 验证邮箱验证码
    app.use(routerControllar.validMailCode);

    // 验证token，验证密码
    app.use(routerControllar.validToken);

    // 注册
    app.post('/register',routerControllar.register);

    // 发送邮箱验证码
    app.post('/sendmail',routerControllar.sendMailCode);

    // 登录
    app.post('/login',routerControllar.login);

    // 修改密码
    app.post('/editPassword',routerControllar.editPassword);

    // 添加数据类型
    app.post('/addType',routerControllar.addType);

    // 获取商品数据类型
    app.get('/getType',routerControllar.getType);

    // 搜索商品数据类型
    app.get('/searchType',routerControllar.searchType);

    // 禁用和启用
    app.post('/typeStatus',routerControllar.setTypeStatus);

    //修改商品类型
    app.post('/type', routerControllar.updateType);

    //修改商品类型数量
    app.get('/typeRows', routerControllar.typeRows);

    //搜索商品类型数量
    app.get('/searchRows', routerControllar.searchRows);

    //获取用户信息
    app.get('/userInfo', routerControllar.userInfo);

    //获取商品类型
    app.get('/proType', routerControllar.proType);

    // 发布商品
    app.post('/postProduct', routerControllar.postProduct);

    // 获取商品列表数据
    app.get('/productList', routerControllar.productList);

    // 获取商品列表记录数量
    app.get('/productListRows', routerControllar.productListRows);
    
    // 上下架
    app.post('/status', routerControllar.upDown);

    // 删除商品
    app.post('/removeProduct', routerControllar.remove);

    // 根据商品pid获取商品数据
    app.get('/productByPid', routerControllar.productByPid);

    // 修改商品
    app.post('/editProduct', routerControllar.editProduct);

    // 忘记密码
    app.post('/forgotPwd', routerControllar.forgotPwd);
 
}