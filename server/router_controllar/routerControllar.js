// 路由控制层

// 导入API服务层
const api = require(__basename + '/api/api.js');

// 导入工具库
const utils = require(__basename + '/utils/utils.js');

// 导入moment模块，用于处理时间日期
const moment = require('moment');

// 导入文件系统模块
const fs = require('fs');

// 导入sequelize模块
const Sequelize = require('sequelize');

// 获取sequelize 操作符模块
let Op = Sequelize.Op;

class RouterControllar {

    // 验证邮箱验证码,中间件
    validMailCode(req, res, next) {
        // 
        // 
        // 可以找到对应的路径

        if (whiteList.mailList.indexOf(req.url) > -1) {
            // 需要验证邮箱验证码
            // 根据邮箱和验证码查询

            // 获取当前时间
            let currentTime = new Date().getTime() - 5 * 60 * 1000;
            // 使用moment处理当前时间
            let data = moment(currentTime).format('YYYY-MM-DD HH:mm:ss');
            api.findData('code', {
                email: req.body.email,
                code: req.body.code,
                createdAt: {
                    [Op.gte]: data
                }
            }).then(result => {
                // 
                
                if (result.length == 0) {
                    res.send('验证码已失效或不正确')
                } else {
                    // 验证码验证通过
                    next();
                }
            }).catch(err => {
                res.send('邮箱验证码验证失败')
            })
        } else {
            // 不需要验证邮箱验证码
            next();
        }
    }

    // 验证token，登录验证
    validToken(req, res, next) {
        // 
        let url = req.url.split('?')[0]

        // 

        if (whiteList.tokenList.indexOf(url) > -1) {
            // 解析token
            utils.verifyString({
                value: req.headers.token,
                salt: config.tokenOptions.tokenSalt,
                fn: (err, encode) => {
                    if (err) {
                        // 如果解析失败
                        // 
                        res.send({
                            msg: '请先登录',
                        })
                    } else {

                        // token验证成功
                        // 将user_id传递给下一个中间件或者路由的req请求
                        req.user_id = encode.data
                        next();
                    }
                }
            })
        } else {
            // 不需要验证token
            next()
        }
    }

    // 注册
    register(req, res) {
        // 截取请求参数
        let parmas = req.body
        // 

        // 判断邮箱是否已经被注册
        api.findData('business', {
            email: parmas.email
        }).then(result => {
            // 
            // res.send({msg:'该邮箱未注册'})
            if (result.length == 0) {

                // 添加数据
                let user_id = '_a' + new Date().getTime();
                // 密码加密加盐

                let password = utils.encodeString(config.saltOptions.passwordSalt + parmas.password);

                api.createData('business', {
                    user_id,
                    email: parmas.email,
                    nickname: parmas.nickname,
                    password
                }).then(result => {
                    // 
                    res.send({
                        msg: '注册成功'
                    })
                }).catch(err => {

                    res.send({
                        msg: '注册失败'
                    })
                })

            } else {
                res.send({
                    msg: '该邮箱已注册'
                })
            }
        }).catch(err => {
            res.send({
                msg: '注册失败'
            })
        })
    }

    // 发送邮箱验证码
    sendMailCode(req, res) {

        // 存储验证码
        // 取随机数六位数字
        let code = Math.random().toString().slice(-6);
        console.log('code ==> ',code);
        api.createData('code', {
            email: req.body.email,
            code
        }).then(result => {
            // 
            // res.send({
            //     msg: '验证码已发送至您邮箱',
            //     code:result.dataValues.code
            // })
            // return
            // 开发测试阶段不发邮件
            utils.sendMail(req.body.email, code, (err, info) => {
                if (err) {
                    // 
                    // 如果发邮件失败
                    res.send({
                        msg: '发送邮箱验证码失败'
                    })
                } else {
                    // 
                    res.send({
                        msg: '验证码已发送至您邮箱'
                    })
                }
            });
        }).catch(err => {

            res.send({
                msg: '验证码存储不成功！'
            });
        })

    }

    // 登录
    login(req, res) {
        // 根据邮箱查询
        api.findData('business', {
            email: req.body.email,
            is_destrory: 0
        }).then(result => {

            // 如果查询不到数据
            if (result.length == 0) {
                res.send({
                    msg: '该用户不存在'
                })
            } else {
                // 如果用户存在，则需要验证密码是否正确
                let password = utils.encodeString(config.saltOptions.passwordSalt + req.body.password)
                if (password == result[0].dataValues.password) {

                    //如果密码正确
                    //生成token
                    let token = utils.signString({
                        value: result[0].dataValues.user_id,
                        salt: config.tokenOptions.tokenSalt,
                        expires: config.tokenOptions.expires
                    });
                    res.send({
                        msg: '登录成功',
                        token
                    });

                } else {
                    res.send({
                        msg: '密码不正确'
                    })
                }
            }

        }).catch(err => {

            res.send({
                msg: '登录失败'
            })
        })
    }

    // 修改密码
    editPassword(req, res) {

        // 密码加密加盐

        let password = utils.encodeString(config.saltOptions.passwordSalt + req.body.password);

        api.updateData('business', {
            password
        }, {
            user_id: req.body.user_id
        }).then(result => {
            res.send({
                msg: '修改密码成功',
                result
            });
        }).catch(err => {

            res.send({
                msg: '修改密码失败',
            });
        })
        // res.send('修改密码成功');
    }

    // 添加数据类型
    addType(req, res) {
        // 

        // 获取商品类型ID
        let typeId = '_ty' + new Date().getTime();

        api.createData('type', {
            user_id: req.user_id,
            type_id: typeId,
            type: req.body.typename
        }).then(result => {
            // 
            res.send({
                msg: '添加数据类型成功'
            })
        }).catch(err => {
            // 
            res.send({
                msg: '添加数据类型失败'
            })
        })
    }

    // 获取商品类型数据
    getType(req, res) {

        api.findDataByLimit('type', {
            user_id: req.user_id
        }, ['updatedAt', 'DESC'], Number(req.query.offset), Number(req.query.limit)).then(result => {
            // 
            res.send({
                msg: '获取商品类型数据成功',
                result
            })
        }).catch(err => {

            res.send({
                msg: '获取商品类型数据失败'
            })
        })
        // res.send({msg:'获取商品类型数据成功'})
    }

    // 搜索商品类型
    searchType(req, res) {
        // 
        api.findDataByLimit('type', {
            user_id: req.user_id,
            type: {
                [Op.like]: `%${req.query.type}%`
            }
        }, ['updatedAt', 'DESC'], Number(req.query.offset), Number(req.query.limit)).then(result => {
            // 
            res.send({
                msg: '搜索商品成功',
                result
            })
        }).catch(err => {

            res.send('搜索商品失败')
        })
    }

    // 禁用和启用
    setTypeStatus(req, res) {
        api.updateData('type', {
            is_enable: Number(req.body.status)
        }, {
            type_id: req.body.type_id
        }).then(result => {

            res.send({
                msg: '操作成功',
                result
            })
        }).catch(err => {

            res.send('操作失败')
        })
    }

    //修改类型
    updateType(req, res) {

        api.updateData('type', {
            type: req.body.type
        }, {
            type_id: req.body.type_id
        }).then(result => {
            res.send({
                msg: '更新商品类型成功',
                result
            });
        }).catch(err => {
            res.send({
                msg: '更新商品类型失败',
            });
        })
    }

    // 获取数据表的记录数
    typeRows(req, res) {
        api.count('type', {
            user_id: req.user_id
        }).then(result => {
            res.send({
                msg: '获取数据表的记录数成功',
                result
            });
        }).catch(err => {

            res.send({
                msg: '获取数据表的记录数失败',
            });
        })
    }

    // 搜索商品类型数量
    searchRows(req, res) {
        api.count('type', {
            user_id: req.user_id,
            type: {
                [Op.like]: `%${req.query.type}%`
            }
        }).then(result => {
            res.send({
                msg: '搜索数据表的记录数成功',
                result
            });
        }).catch(err => {

            res.send({
                msg: '搜索数据表的记录数失败',
            });
        })
    }

    // 获取用户信息
    userInfo(req, res) {
        api.findData('business', {
            user_id: req.user_id,
            is_destrory: 0
        }, ['nickname', 'user_img', 'user_id', 'email']).then(result => {
            res.send({
                msg: '查询用户信息成功',
                result
            });
        }).catch(err => {

            res.send({
                msg: '查询用户信息失败'
            })
        })
    }

    //获取商品类型
    proType(req, res) {
        api.findData('type', {
            user_id: req.user_id,
            is_enable: 1
        }, ['type_id', 'type']).then(result => {
            res.send({
                msg: '获取商品类型成功',
                result
            });
        }).catch(err => {
            res.send({
                msg: '获取商品类型失败',
            });
        })
    }

    // 发布商品
    postProduct(req, res) {
        // 

        // 先上传完毕图片，再将数据写入到数据库
        let imgs = ['img', 'imgDetail'];

        let count = 0;
        let isUpload = true;

        for (let i = 0; i < imgs.length; i++) {
            if (!isUpload) {
                return res.send({
                    msg: '发布商品失败'
                });
            }

            // 获取base64图片
            let base64 = req.body[imgs[i]].replace(/ /g, '+');
            // 将base64转换成buffer,类似二进制文件
            let buffer = new Buffer(base64, 'base64');
            // 生成文件名  xxx.png   xxx.jpeg
            let filename = Math.random().toString().slice(2) + '.' + req.body[imgs[i] + 'Type'];
            // 使用文件系统图片base64写入服务器
            fs.writeFile(__basename + '/upload/' + filename, buffer, err => {
                if (err) {
                    // 如果上传失败
                    isUpload = false;
                    if (i == imgs.length) {
                        res.send({
                            msg: '发布商品失败'
                        });
                    }
                } else {
                    req.body[imgs[i]] = filename;
                    delete req.body[imgs[i] + 'Type'];

                    // 上传图片成功
                    count++;
                    // 已经上传完毕
                    if (count == imgs.length) {
                        // 将数据写入数据库中
                        // 生成商品id
                        req.body.pid = 'pro' + new Date().getTime();
                        // 关联用户
                        req.body.user_id = req.user_id;


                        // 将数据写入数据库中
                        api.createData('product', req.body).then(result => {
                            res.send({
                                msg: '发布商品成功',
                                result
                            });
                        }).catch(err => {
                            res.send({
                                msg: '发布商品失败',
                                err
                            });
                        })

                        // res.send('上传图片成功')
                    }
                }
            })

        }

    }

    // 获取商品列表数据
    productList(req, res) {
        // 

        // 查询条件
        let condition = {
            user_id: req.user_id,
            offset: Number(req.query.offset),
            limit: Number(req.query.limit),
        }

        // sql语句
        let sql = "SELECT `p`.`user_id`, `p`.`pid`, `p`.`name`, `p`.`status`, `p`.`created_at`, `p`.`updated_at`, `t`.`type` FROM `product` AS `p` INNER JOIN `type` AS `t` ON `p`.`type` = `t`.`type_id` AND `p`.`user_id` = :user_id";

        // 商品名称需要进行模糊查询 %商品名称%
        if (req.query.name) {
            condition.name = '%' + req.query.name + '%';
            sql += " AND `p`.`name` LIKE :name";
        }

        if (req.query.date) {
            condition.date = req.query.date;
            sql += " AND `p`.`created_at` >= :date";
        }

        if (req.query.type) {
            condition.type = req.query.type;
            sql += " AND `p`.`type` = :type";
        }

        if (req.query.status !== undefined) {
            condition.status = req.query.status;
            sql += " AND `p`.`status` = :status";
        }

        //按照更新时间排序, 分页查询
        sql += " ORDER BY `p`.`updated_at` DESC LIMIT :offset, :limit";

        // condition.offset = Number(condition.offset);
        // condition.limit = Number(condition.limit);

        api.query(sql, condition).then(result => {
            res.send({
                msg: '查询商品列表数据成功',
                result
            });
        }).catch(err => {

            res.send({
                msg: '查询商品列表数据失败'
            })
        })

    }

    // 获取商品列表记录数量
    productListRows(req, res) {
        // 查询条件
        let condition = {
            user_id: req.user_id,
        }
        // 商品名称需要进行模糊查询 %商品名称%
        if (req.query.name) {
            condition.name = {
                [Op.like]: '%' + req.query.name + '%'
            };
        }

        if (req.query.date) {
            condition.created_at = {
                [Op.gte]: req.query.date
            };
        }

        if (req.query.type) {
            condition.type = req.query.type
        }

        if (req.query.status !== undefined) {
            condition.status = req.query.status;
        }

        api.count('product', condition).then(result => {
            res.send({
                msg: '获取商品列表记录数量成功',
                result
            });
        }).catch(err => {

            res.send({
                msg: '获取商品列表记录数量失败'
            });
        })

        // res.send('ok');
    }

    // 上下架
    upDown(req, res) {
        api.updateData('product', {
            status: req.body.status
        }, {
            pid: req.body.pid
        }).then(result => {
            res.send({
                msg: '更新商品状态成功',
                result
            });
        }).catch(err => {

            res.send({
                msg: '更新商品状态失败'
            });
        })
        // res.send('up');
    }

    // 删除商品
    remove(req, res) {

        api.destroyData('product', {
            pid: req.body.pid
        }).then(result => {

            res.send({
                msg: '删除商品列表的数据成功',
                result
            });
        }).catch(err => {

            res.send({
                msg: '删除商品列表的数据失败'
            })
        })

        // res.send('删除')
    }

    // 根据商品pid获取商品数据
    productByPid(req, res) {
        // 
        api.findData('product', {
            pid: req.query.pid
        }, ['name', 'type', 'price', 'count', 'img', 'imgDetail', 'status', 'desc']).then(result => {
            res.send({
                msg: '根据商品pid获取商品数据成功',
                result
            });
        }).catch(err => {

            res.send({
                msg: '根据商品pid获取商品数据失败'
            });
        })
        // res.send('ok');
    }

    // 修改商品
    editProduct(req, res) {
        // 获取图片数据
        let imgs = [];
        if (req.body.img) {
            imgs.push('img');
        }
        if (req.body.imgDetail) {
            imgs.push('imgDetail');
        }
        // 

        // 添加方法
        function updateProduct() {
            // 获取商品pid
            let pid = req.body.pid;
            delete req.body.pid;

            api.updateData('product', req.body, {
                pid
            }).then(result => {
                res.send({
                    msg: '修改商品数据成功',
                    result
                });
            }).catch(err => {

                res.send({
                    msg: '修改商品数据失败'
                })
            })
        }

        // 如果存在图片，则必须先上传完毕图片之后，再更改数据
        if (imgs.length > 0) {
            let count = 0;
            let isUpload = true;

            for (let i = 0; i < imgs.length; i++) {
                if (!isUpload) {
                    return res.send({
                        msg: '修改商品失败'
                    });
                }

                // 获取base64图片
                let base64 = req.body[imgs[i]].replace(/ /g, '+');
                // 将base64转换成buffer,类似二进制文件
                let buffer = new Buffer(base64, 'base64');
                // 生成文件名  xxx.png   xxx.jpeg
                let filename = Math.random().toString().slice(2) + '.' + req.body[imgs[i] + 'Type'];
                // 使用文件系统图片base64写入服务器
                fs.writeFile(__basename + '/upload/' + filename, buffer, err => {
                    if (err) {
                        // 如果上传失败
                        isUpload = false;
                        if (i == imgs.length) {
                            res.send({
                                msg: '修改商品失败'
                            });
                        }
                    } else {
                        req.body[imgs[i]] = filename;
                        delete req.body[imgs[i] + 'Type'];

                        // 上传图片成功
                        count++;
                        // 已经上传完毕
                        if (count == imgs.length) {
                            updateProduct();
                            // res.send('上传图片成功')
                        }
                    }
                })

            }
        } else {
            // 直接修改数据库数据
            // 
            updateProduct();
            // res.send('ok');
        }
    }

    // 找回密码
    forgotPwd(req, res) {
        api.findData('business', {
            email: req.body.email
        }).then(result => {
            if (result.length > 0) {
                //该邮箱已被注册
                //密码加盐加密
                let password = utils.encodeString(config.saltOptions.passwordSalt + req.body.password);
                //更新密码数据
                api.updateData('business', {
                    password
                }, {email: req.body.email}).then(result => {
                    res.send({msg: '找回密码成功',result});
                }).catch(err => {
                    res.send({msg: '找回密码失败'});
                });
            } else {
                res.send({msg: '该邮箱未注册',});
            }
        }).catch(err => {
            res.send({msg: '找回密码失败'});
        })
    }
}

// 导出路由控制层
module.exports = new RouterControllar();