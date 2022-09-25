// 导入sequelize
const Sequelize = require('sequelize');

// 实例化
let Model = Sequelize.Model;

// Code数据表继承Model
class Code extends Model{}

// 创建code数据表结构
Code.init({
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
    email:{
        type:Sequelize.STRING(50),
        allowNull:false,
        defaultValue:'',
        comment:'邮箱'
    },
    code:{
        type:Sequelize.STRING(6),
        allowNull:false,
        defaultValue:'',
        comment:'邮箱验证码'
    }
},{
    // 其他模型参数

    // 我们需要选择模型名称
    modelName:'code',
    // 参数停止 Sequelize 执行自动复数化. 这样,Sequelize 将推断表名称等于模型名称,而无需进行任何修改
    freezeTableName:true,
    //是否开启假删除
    //不实际删除数据库记录，而是设置一个新 deletedAt 属性，其值为当前日期
    paranoid: true,
    //自动设置字段为蛇型（以_方式命名）命名规则
    underscored: true,
    // Sequelize 表名称
    tableName:'code',
    // 不要忘记启用时间戳！(createdAt/updatedAt)
    timestamps: true,
    // 我们需要传递连接实例
    sequelize,
})

//force: true, 如果存在该表，则先删除该表，再创建新表，否则直接创建新表
//force: false, 如果存在该表，则不创建新表，否则创建新表
Code.sync({ force: false });

//导出模型
module.exports = Code;