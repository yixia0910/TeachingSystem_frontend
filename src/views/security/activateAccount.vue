<template>
  <div style="text-align: center;padding: 20px">
    <h1 v-show="!register">请返回注册页面查看...</h1>
    <Modal id="register-modal" :styles="{top:'20px',width:'60vw !important'}" v-model="register" title="激活账户" :mask-closable="false">
      <div slot="default" style="min-height:60vh">
        <br>
        <Steps :current="registerStep">
          <Step title="第一步" content="开始注册"></Step>
          <Step title="第二步" content="同意使用协议"></Step>
          <Step title="第三步" content="填写账号信息"></Step>
          <Step title="第四步" content="绑定邮箱"></Step>
          <Step title="第五步" content="设置密码"></Step>
        </Steps>
        <br>
        <div v-show="registerStep === 4" style="position:relative;left:22%;top:5vh;">
          <Form ref="registerStep5Form" :model="registerStep5Form" :rules="ruleValidate" :label-width="100">
            <FormItem label="输入密码：" prop="passwd">
              <Input v-model="registerStep5Form.passwd" type="password" password placeholder="请输入密码"></Input>
            </FormItem>
            <FormItem label="确认密码：" prop="passwdCheck">
              <Input v-model="registerStep5Form.passwdCheck" type="password" password placeholder="请输入密码"></Input>
            </FormItem>
            <FormItem>
              <Button style="color:white;background-color:#005FAF" :loading="activeLoading" @click="handleNext('registerStep5Form')">设置密码并激活</Button>
            </FormItem>
          </Form>
        </div>
      </div>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
export default {
  name: 'activateAccount',
  data () {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (!(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+`\-={}:";'<>?,.]).{6,16}$/.test(value))) {
        callback(new Error('密码为6~16位且必须同时包含英文字母、数字及特殊字符'))
      } else {
        if (this.registerStep5Form.passwdCheck !== '') {
          // 对第二个密码框单独验证
          this.$refs.registerStep5Form.validateField('passwdCheck')
        }
        callback()
      }
    }
    const validatePassCheck = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.registerStep5Form.passwd) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }
    return {
      registerStep: 4,
      register: true,
      activeLoading: false,
      cast: null,
      registerStep5Form: {
        passwd: '',
        passwdCheck: ''
      },
      ruleValidate: {
        passwd: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          { validator: validatePass, trigger: 'blur' }
        ],
        passwdCheck: [
          {required: true, message: '请再次输入密码', trigger: 'blur'},
          { validator: validatePassCheck, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleNext (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.registerStep === 4) {
            this.setPassword()
          }
        } else {
          this.$Message.error('请输入正确的信息')
        }
      })
    },
    setPassword () {
      let temp = this.$sha1(this.registerStep5Form.passwd)
      temp = temp.toUpperCase()
      let data = {
        id: this.$route.query.id,
        token: this.$route.query.token,
        password: temp
      }
      console.log(data)
      this.$http.post('security/activateAccountVerify', data).then(res => {
        console.log(res)
        this.activeLoading = false
        if (res.data.msg === '成功激活账户') {
          this.cast.postMessage({from: 'activateAccount', content: '5'})
          this.$Message.success('成功激活账户')
          this.$router.push('/')
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        this.activeLoading = false
        console.log(err)
      })
    }
  },
  created () {
    this.cast = new BroadcastChannel('activeAccount')
    this.cast.postMessage({from: 'activateAccount', content: '4'})
    this.cast.onmessage = e => {
      const text = e.data
      const content = text.from + ': ' + text.content
      console.log(content)
      if (text.from === 'login' && text.content === '5') {
        this.$router.push('/')
      }
    }
  }
}
</script>

<style scoped>
#register-modal /deep/ .ivu-form-item-label{
  margin-top: 10px;
  font-size: 14px;
}
#register-modal /deep/ .ivu-steps {
  margin-left: 6%;
}
/deep/ input::-webkit-input-placeholder, textarea::-webkit-input-placeholder {
  color: #9B9B9B;
  font-size: 19px;
  font-weight: 400;
  line-height: 25px;
  letter-spacing: 1px;
  text-indent: 9px;
}
/deep/ input:-moz-placeholder, textarea:-moz-placeholder {
  color: #9B9B9B;
  font-size: 19px;
  font-weight: 400;
  line-height: 25px;
}
/deep/ input::-moz-placeholder, textarea::-moz-placeholder {
  color: #9B9B9B;
  font-size: 19px;
  font-weight: 400;
  line-height: 25px;
}
/deep/ input:-ms-input-placeholder, textarea:-ms-input-placeholder {
  color: #9B9B9B;
  font-size: 19px;
  font-weight: 400;
  line-height: 25px;
}
/deep/ .ivu-input {
  background: rgba(237,239,245,1);
  height: 4.5vh;
  width: 20vw;
  margin-top: 1vh;
  margin-bottom: 1vh;
  border-radius: 8px;
  font-size: 19px;
  font-weight: 400;
  text-indent: 9px;
}
</style>
