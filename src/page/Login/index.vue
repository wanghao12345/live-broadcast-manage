<template>
  <div class="login-wrapper" v-loading="loading">
    <h3>【HR易】视频直播间登录</h3>
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="注册号码" prop="phone">
        <el-input
          type="account"
          v-model="ruleForm.phone"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="登录密码" prop="password">
        <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
      </el-form-item>
    </el-form>
    <p>技术支持：知服宝</p>
  </div>
</template>

<script>
import { postLogin } from '../../api/login'
export default {
  name: 'Login',
  data () {
    return {
      ruleForm: {
        phone: '',
        password: ''
      },
      rules: {
        phone: [
          { required: true, message: '请输入注册号码', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' }
        ]
      },
      loading: null
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.postLogin()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 获取正式用户签名
    postLogin () {
      this.loading = true
      postLogin(this.ruleForm).then(res => {
        console.log(res)
        if (res.status === 'Error') {
          this.$message.error('注册号码或登录密码错误！')
        }
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style scoped lang="less">
  .login-wrapper{
    width: 400px;
    height: 300px;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -200px;
    margin-top: -150px;
    h3{
      text-align: center;
      margin-bottom: 50px;
    }
    /deep/.el-form{
      .el-button{
        width: 100%;
      }
    }
    p{
      width: 100%;
      text-align: center;
    }
  }
</style>
