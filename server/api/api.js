// 服务层

class API {

    // 添加数据
    createData(modelName, obj) {
        // modelName:模型名称，string
        // obj:创建的数据，object
        return model[modelName].create(obj)
    }

    // 查询数据
    findData(modelName, obj, attrs) {
        // modelName：模型名称，string
        // obj:查询的数据，object
        // attrs:查询字段，array
        return model[modelName].findAll({
            where: obj,
            attributes: attrs,
        })
    }

    // 查询所有数据数据
    findDataByLimit(modelName, obj, orderBy, offset, limit) {
        // modelName：模型名称，string
        // obj:查询的数据，object
        // attrs:查询字段，array
        // orderBy:排序，array ==> [排序的字段，升序获降序]  ASC:升序  DESC:降序
        // offset:偏移数据量 number
        // limit:查询数据量 number
        return model[modelName].findAll({
            where: obj,
            // attributes: attrs,
            order:[orderBy],
            offset,
            limit,
        })
    }

    //更新数据
    updateData(modelName, values, condition) {
        //modelName: 模型名称, string
        //values: 需要设置的数据, object
        //condition: 条件, object
        return model[modelName].update(values, {
            where: condition
        });
    }
    
    //删除数据
    destroyData(modelName, condition) {
        //modelName: 模型名称, string
        //condition: 条件, object
        return model[modelName].destroy({
            where: condition
        });
    }

    // 查询数据表的记录数
    count(modelName,condition){
        return model[modelName].count({
            where:condition
        });
    }

    //原始查询
    query(sql, replacements) {
        //sql: 原始sql语句,
        //replacements: sql语句预处理字段
        return sequelize.query(sql, {
            replacements,
            type: sequelize.QueryTypes.SELECT
        });
    }


}

// 导出
module.exports = new API();