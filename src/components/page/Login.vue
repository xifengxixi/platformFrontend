<template>
  <div class="login-wrap">
    
    <div class="ms-login">
      <div class="ms-title">自动化测试管理平台</div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="ms-content">

        <el-form-item prop="username">
          <el-input v-model="ruleForm.username" placeholder="请输入用户名" @focus="clearValidate('username')">
            <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
          </el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input type="password" placeholder="请输入密码" v-model="ruleForm.password"
            @keyup.enter.native="submitForm('ruleForm')" @focus="clearValidate('password')">
            <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
          </el-input>
        </el-form-item>

        <el-form-item label="记住我" class="remember_me" size="mini">
          <el-switch v-model="ruleForm.remember_me"></el-switch>
          <router-link to="/register" class="register_link">没有账号？点击注册</router-link>
        </el-form-item>

        <div class="login-btn">
          <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
        </div>

        <p class="login-tips" v-show="err_info">{{ err_msg }}</p>
      </el-form>
    </div>
  </div>
</template>

<script>
import api from "@/api/user";

export default {
  data() {
    return {
      ruleForm: {
        username: '',
        password: '',
        remember_me: false,
      },
      err_info: false,
      err_msg: '',
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    clearValidate(prop_value) {
      this.$refs['ruleForm'].clearValidate(prop_value)
    },
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          var that = this;
          try {
            var response = await api.login(this.ruleForm);
            if (response.status === 200) {
              //本地存储用户信息
              // cookie.setCookie('username', response.data.username, 1);
              // cookie.setCookie('user_id', response.data.user_id, 1);
              //cookie.setCookie('token', response.data.token, 1);

              // 使用浏览器本地存储保存token
              if (that.remember_me) {
                // 记住登录
                sessionStorage.clear();
                localStorage.token = response.data.access;
                localStorage.user_id = response.data.userid;
                localStorage.username = response.data.username;
              }
              else {
                // 未记住登录
                localStorage.clear();
                sessionStorage.token = response.data.access;
                sessionStorage.user_id = response.data.userid;
                sessionStorage.username = response.data.username;
              }
              this.$bus.$emit('GetUserInfo', response)
              that.$router.push('/dashboard');
              }
            else if (response.status === 401) {
              this.$message.error('用户名或密码错误');
            }
          }
          catch (error) {
            if (error.response) {
              that.err_msg = '服务器异常';
            }
            else if (error.request) {
              that.err_msg = "网络异常";
            }
            that.err_info = true;
          }
        }
        else {
          this.err_msg = '参数有误';
          this.err_info = true;
          return false;
        }
      });
    },
  }
}
</script>


<style scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url("@/assets/img/bg.jpg");
  background-size: 100%;
}

.ms-login {
  width: 350px;
  /*height: 350px;*/
  margin: -190px 0 0 -175px;
  border-radius: 5px;
  position: absolute;
  left: 50%;
  top: 50%;
  background: rgba(255, 255, 255, 0.2);
  overflow: hidden;
}

.ms-title {
  width: 100%;
  line-height: 50px;
  text-align: center;
  font-size: 25px;
  color: #E4E7ED;
  border-bottom: 1px solid #ddd;
  letter-spacing: 4px
}

.remember_me>>>.el-form-item__label {
  color: #E4E7ED;
}

.login-btn {
  text-align: center;
}

.login-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
}

.ms-content {
  padding: 30px 30px;
}

.register_link {
  padding-left: 68px;
  color: #909399;
}

.login-tips {
  font-size: 12px;
  line-height: 30px;
  color: #F56C6C;
}
</style>
