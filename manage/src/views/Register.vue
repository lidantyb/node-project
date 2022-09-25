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
        <label for="nickname" class="fl form-title">昵称</label>
        <div class="fl">
          <input
            type="text"
            class="form-control form-input"
            id="nickname"
            autocomplete="off"
            v-model="userInfo.nickname"
            placeholder="昵称1-10个字符"
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

      <div class="form-group clearfix">
        <label for="validcode" class="fl form-title">验证码</label>
        <div class="fl">
          <input
            type="text"
            class="form-control form-input valid-input"
            id="validcode"
            autocomplete="off"
            v-model="userInfo.code"
            placeholder="请输入六位验证码"
          />
        </div>
        <div class="valid-btn">
          <button class="btn btn-secondary" :disabled="isSend" @click="getCode">
            {{ text }}
          </button>
        </div>
      </div>

      <div class="form-group clearfix">
        <div class="fr">
          <button class="btn btn-primary form-input" @click="register">
            注册
          </button>
        </div>
      </div>
      <div class="clearfix login-text">
          <span class="fr" @click="goLogin()">已有账号，立即登录</span>
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
        nickname: "",
        password: "",
        code: "",
      },
      text: "发送邮箱验证码",
      isSend: false,
      //   msg:'错误提示信息！'
    };
  },
  methods: {
    //获取邮箱验证码
    getCode() {
      // 验证邮箱格式
      let data = {email:this.userInfo.email}
      let result = validFrom.valid(data);
      if (result.pass == false) {
        this.$children[0].a(result.msg);
        return;
      }
        let time = 5;
        this.text = `${time}s后重新发送`;
        this.isSend = true;
        let timer = setInterval(() => {
          if (time == 0) {
            clearInterval(timer);
            timer = null;
            this.text = `发送邮箱验证码`;
            this.isSend = false;
          } else {
            time--;
            this.text = `${time}s后重新发送`;
          }
        }, 1000);

        // 发送邮箱验证码
        this.axios({
          method: "POST",
          url: "/sendmail",
          data,
        }).then((result) => {
          // console.log('result ==> ',result)
        }).catch((err) => {

        });
    },

    // 注册
    register() {
      // 表单验证
      let result = validFrom.valid(this.userInfo);
      if (result.pass == false) {
        // this.msg = result.msg
        // 调用子组件的方法
        this.$children[0].a(result.msg);
        return;
      }

      // 发起注册请求
      this.axios({
        method: "POST",
        url: "/register",
        // post请求参数
        data: this.userInfo,
      }).then((result) => {
          // console.log('注册成功 ==> ',result)
          // 如果注册成功，跳转到登录页面，不成功则提示验证码错误
          if(result.data.msg == '注册成功'){
            this.$router.push({name:'Login'})
          }else{
            this.$children[0].a(result.data);
          }
        }).catch((err) => {
          // console.log('注册失败 ==> ',err)
        });
    },

    // 已有账号，立即登录
    goLogin(){
      this.$router.push({name:'Login'})
    }
  },
  components: {
    MsgBox,
  },
};
</script>

// scoped 表示它的样式作用于当下的模块，很好的实现了样式私有化的目的
<style lang="less" scoped>
.login-text{
  margin-top: 20px;
  columns: #444;
  cursor: pointer;
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
  width: 160px;
}
.btn-secondary {
  width: 140px;
  margin-left: 20px;
}
</style>