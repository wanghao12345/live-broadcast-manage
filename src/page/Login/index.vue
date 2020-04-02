<template>
  <div class="login-wrapper">
    <h3>【HR易】视频直播间登录</h3>
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="注册号码" prop="account">
        <el-input
          type="account"
          v-model="ruleForm.account"
          autocomplete="off"
          :disabled="true"
        ></el-input>
      </el-form-item>
      <el-form-item label="登录密码" prop="pass">
        <el-input type="pass" v-model="ruleForm.pass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
      </el-form-item>
    </el-form>
    <p>技术支持：知服宝</p>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      ruleForm: {
        account: '1732****2312',
        pass: ''
      },
      rules: {
        account: [
          { required: true, message: '请输入注册号码', trigger: 'blur' }
        ],
        pass: [
          { required: true, message: '请输入登录密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
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
