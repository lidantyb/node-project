<template>
  <div class="register">
    <div class="manage-title">电商后台系统</div>
    <div class="form-box">
      <div class="form-group clearfix">
        <label class="fl form-title" for="email">邮箱</label>
        <div class="fl form-input">
          <input
            type="text"
            class="form-control"
            id="email"
            autocomplete="off"
            v-model="userInfo.email"
            placeholder="找回密码的邮箱"
          />
        </div>
      </div>

      <div class="form-group clearfix">
        <label class="fl form-title" for="validcode">验证码</label>
        <div class="fl form-input valid-form-input">
          <input
            type="text"
            class="form-control"
            id="validcode"
            autocomplete="off"
            v-model="userInfo.code"
            placeholder="请输入6位验证码"
          />
        </div>
        <div class="valid-code fl">
          <!-- <button class="btn btn-primary btn-block" @click="forgotPwd">找回密码</button> -->
          <button
            class="btn btn-secondary btn-block"
            :disabled="isSend"
            @click="getCode"
          >
            {{ text }}
          </button>
        </div>
      </div>

      <div class="form-group clearfix">
        <label class="fl form-title" for="password">新密码</label>
        <div class="fl form-input">
          <input
            type="text"
            class="form-control"
            id="password"
            autocomplete="off"
            v-model="userInfo.password"
            placeholder="密码6-16个字符"
          />
        </div>
      </div>

      <div class="form-group form-btn-box">
        <div class="btn-box">
          <button class="btn btn-primary btn-block" @click="forgotPwd">
            找回密码
          </button>
        </div>
        <div class="clearfix login-text">
          <span class="fr" @click="goLogin">立即登录</span>
        </div>
      </div>
    </div>

    <!-- 消息提示 -->
    <MsgBox></MsgBox>
  </div>
</template>

<script>
//导入表单验证文件
import { validFrom } from "../assets/js/validFrom";

//导入消息提示组件
import MsgBox from "../components/MsgBox";

export default {
  data() {
    return {
      userInfo: {
        email: "",
        password: "",
        code: "",
      },

      text: "发送邮箱验证码",
      isSend: false,
    };
  },

  methods: {
    //获取邮箱验证码
    getCode() {
      //验证邮箱格式是否正确
      let data = { email: this.userInfo.email };
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

      //发送邮箱验证码
      this.axios({
        method: "POST",
        url: "/sendmail",
        data,
      })
        .then((result) => {})
        .catch((err) => {});
    },

    //找回密码
    forgotPwd() {
      //表单验证
      let result = validFrom.valid(this.userInfo);
      if (result.pass === false) {
        this.$children[0].a(result.msg);
        return;
      }

      //发起注册请求
      this.axios({
        method: "POST",
        url: "/forgotPwd",
        //post请求参数
        data: this.userInfo,
      })
        .then((result) => {
          if (result.data.msg == '找回密码成功') {
            this.goLogin();
          } else {
            this.$children[0].a(result.data.msg);
          }
        }).catch((err) => {
        });
    },

    //跳转登录
    goLogin() {
      this.$router.push({ name: "Login" });
    },
  },

  components: {
    MsgBox,
  },
};
</script>

<style lang="less" scoped>
.login-text {
  margin-top: 20px;
  color: #444;
  cursor: pointer;
  margin-left: 80px;
}
.manage-title {
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
.valid-code {
  width: 140px;
}

.form-btn-box {
  margin-top: 40px;
  margin-bottom: 0;
}
.btn-box {
  margin-left: 80px;
}
.mask {
  position: absolute;
  left: 0;
  top: 0;
  width: 60px;
  height: 100%;
  background-color: #e4393c;
  cursor: pointer;
}
.valid-box {
  position: relative;
  height: 38px;
  margin-left: 80px;
  background-color: #ddd;
  text-align: center;
  line-height: 38px;
  user-select: none;
  span {
    color: #fff;
  }
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

.form-title {
  display: block;
  width: 80px;
  height: 38px;
  line-height: 38px;
}

.form-input {
  width: 320px;
}

.valid-form-input {
  width: 160px;
  margin-right: 20px;
}
</style>