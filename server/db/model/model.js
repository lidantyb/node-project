// 模型集合

// 导入商家用户模型，商家用户表
const business = require(__basename + '/db/model/business.js');

// 导入邮箱验证码模型，邮箱验证码表
const code = require(__basename + '/db/model/code.js');

// 导入商品类型模型，商品类型表
const type = require(__basename + '/db/model/type.js');

// 导入商品模型，保存上传的商品数据
const product = require(__basename + '/db/model/product.js');

// 导出
module.exports = {
    business,
    code,
    type,
    product
}