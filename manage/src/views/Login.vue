<template>
  <div class="register">
    <div class="manage-title">电商后台系统</div>
    <div class="form-box">
      <div class="form-group clearfix">
        <label for="email" class="fl form-title">邮箱</label>
        <div class="fl">
          <input
            type="text"
            class="form-control form-input"
            id="email"
            autocomplete="off"
            v-model="userInfo.email"
            placeholder="请输入邮箱"
          />
        </div>
      </div>

      <div class="form-group clearfix">
        <label for="password" class="fl form-title">密码</label>
        <div class="fl">
          <input
            type="password"
            class="form-control form-input"
            id="password"
            autocomplete="off"
            v-model="userInfo.password"
            placeholder="密码6-16个字符"
          />
        </div>
      </div>

      <div class="form-group clearfix" v-if="user_id">
        <label for="password" class="fl form-title">重复密码</label>
        <div class="fl">
          <input
            type="password"
            class="form-control form-input"
            id="password"
            autocomplete="off"
            v-model="passwordAgein"
            placeholder="请再次输入密码"
          />
        </div>
      </div>

      <div class="login-edit" v-if="user_id">
        <div class="form-group clearfix">
          <div class="fr">
            <button class="btn btn-primary form-input" @click="editPassword()">确定修改</button>
          </div>
        </div>
      </div>

      <div class="login-data" v-else>
        <div class="form-group clearfix">
          <div class="fr">
            <button class="btn btn-primary form-input" @click="login">登录</button>
          </div>
        </div>
        <div class="clearfix login-text">
          <span class="fr" @click="goRegister('Register')">没有账号，立即注册</span>
          <span class="fl" @click="goRegister('ForgotPwd')">找回密码</span>
        </div>
      </div>

      
      
    </div>
    <!-- 使用组件 -->
    <msg-box></msg-box>
  </div>
</template>
<script>
// 导入表单验证
import { validFrom } from "../assets/js/validFrom";
// 引入消息提示组件
import MsgBox from "../components/MsgBox";
// 防止页面回退
import preventBack from 'vue-prevent-browser-back';
export default {
  // 阻止返回上一页
  mixins:[preventBack],
  data() {
    return {
      userInfo: {
        email: "",
        password: "",
      },
      passwordAgein: "",
      // user_id
      user_id:'',
      passwordData:'',
    };
  },
  created() {
    // 截取路由参数
      let params = this.$route.params;
      // 
      if(params.user_id){
        this.user_id = params.user_id
        this.userInfo.email = params.email
      }
      // 
      
  },
  methods: {
    // 登录
    login(){
      // 表单验证
      let result = validFrom.valid(this.userInfo);
      if (result.pass == false) {
        // this.msg = result.msg
        // 调用子组件的方法
        this.$children[0].a(result.msg);
        return;
      }
      
      // 发起登录请求
      this.axios({
        method:'POST',
        url:'/login',
        data:this.userInfo
      }).then(result=>{
        
        if (result.data.msg == '登录成功') {
          this.$cookies.set('_abc', result.data.token, '5d');
          // localStorage.token=result.data.token;
          
          this.$router.push({name: 'Type'});
        } else {
          this.$children[0].a(result.data.msg)
        }
        
      }).catch(err=>{
        
      })
    },

    // 没有账号，立即注册
    goRegister(name){
      this.$router.push({name})
    },

    // 修改密码
    editPassword(){
      // 表单验证
      let result = validFrom.valid(this.userInfo);
      if (result.pass == false) {
        // this.msg = result.msg
        // 调用子组件的方法
        this.$children[0].a(result.msg);
        return;
      }
      // 判断是否输入的是原密码
      // if()
      
      
      // 判断两次输入的密码是否一致
      if(this.userInfo.password == this.passwordAgein){
        
        // let user_id = this.user_id
        // 将修改数据库中的数据
        this.axios({
          method:'POST',
          url:'/editPassword',
          data:{
            user_id:this.user_id,
            password:this.userInfo.password
          }
        }).then(result => {
          
          // this.$router.push({name: 'Login'});
          this.user_id = ''
          this.userInfo.password = ''
        }).catch(err => {
          
        })
        this.$children[0].a('修改密码成功');
      }else{
        this.$children[0].a('两次输入的密码不一致');
      }
    },
  },
  components: {
    MsgBox,
  },
};
</script>

<style lang="less" scoped>
.login-text{
  margin-top: 20px;
  columns: #444;
  cursor: pointer;
  margin-left: 80px;
}
.manage-title{
  font-size: 48px;
  color: #fff;
  width: 400px;
  text-align: center;
  line-height: 332px;
}
.register {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: url("../assets/bg.jpg");
  background-size: cover;
  min-width: 1170px;
}
.form-box {
  width: 440px;
  position: absolute;
  right: 300px;
  top: 100px;
  padding: 20px;
  background: #fff;
  box-shadow: 4px 4px 10px 2px #ccc;
  border-radius: 5px;
}
.form-group {
  padding: 10px 0;
}
.form-title {
  width: 80px;
  line-height: 38px;
  margin: 0;
}
.form-input {
  width: 320px;
  
}
.valid-input {
  width: 150px;
}
.btn-secondary {
  width: 150px;
  margin-left: 20px;
}
</style>