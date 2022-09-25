// 导入sequelize
const Sequelize = require('sequelize');

// 实例化
let Model = Sequelize.Model;

// Product数据表继承Model
class Product extends Model{}

// 创建product数据表结构
Product.init({
    id:{
        // 数据类型：INTEGER(整型)，UNSIGNED(无符号)
        type:Sequelize.INTEGER.UNSIGNED,
        // 是否为空
        allowNull:false,
        // 主键
        primaryKey:true,
        // 自动递增
        autoIncrement:true,
        // 备注
        comment:'表id'
    },
    user_id:{
        // STRING(字符串)
        type:Sequelize.STRING(20),
        allowNull:false,
        // 默认值
        defaultValue:'',
        comment:'商家id'
    },
    type:{
        type:Sequelize.STRING(30),
        allowNull:false,
        defaultValue:'',
        comment:'商品类型id'
    },
    pid:{
        // STRING(字符串)
        type:Sequelize.STRING(20),
        allowNull:false,
        // 默认值
        defaultValue:'',
        comment:'商品id'
    },
    name:{
        type:Sequelize.STRING(30),
        allowNull:false,
        defaultValue:'',
        comment:'商品名称'
    },
    price:{
        type:Sequelize.DECIMAL(10,2),
        allowNull:false,
        defaultValue:0,
        comment:'商品价格'
    },
    count:{
        type:Sequelize.INTEGER,
        allowNull:false,
        defaultValue:0,
        comment:'商品库存'
    },
    img:{
        type:Sequelize.STRING(30),
        allowNull:false,
        defaultValue:'',
        comment:'商品图片'
    },
    imgDetail:{
        type:Sequelize.STRING(30),
        allowNull:false,
        defaultValue:'',
        comment:'商品详情图片'
    },
    status:{
        type:Sequelize.BOOLEAN,
        allowNull:false,
        defaultValue:1,
        comment:'商品状态'
    },
    desc:{
        type:Sequelize.STRING(200),
        allowNull:false,
        defaultValue:'',
        comment:'商品描述'
    },
},{
    // 其他模型参数

    // 我们需要选择模型名称
    modelName:'product',
    // 参数停止 Sequelize 执行自动复数化. 这样,Sequelize 将推断表名称等于模型名称,而无需进行任何修改
    freezeTableName:true,
    //是否开启假删除
    //不实际删除数据库记录，而是设置一个新 deletedAt 属性，其值为当前日期
    paranoid: false,
    //自动设置字段为蛇型（以_方式命名）命名规则
    underscored: true,
    // Sequelize 表名称
    tableName:'product',
    // 不要忘记启用时间戳！(createdAt/updatedAt)
    timestamps: true,
    // 我们需要传递连接实例
    sequelize,
})

//force: true, 如果存在该表，则先删除该表，再创建新表，否则直接创建新表
//force: false, 如果存在该表，则不创建新表，否则创建新表
Product.sync({ force: false });

//导出模型
module.exports = Product;