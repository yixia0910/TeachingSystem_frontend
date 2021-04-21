<template>
  <div style="text-align: center;padding: 20px">
    <h1>设置密码</h1>
    <div style="margin: 20px">
      <label>输入密码：</label>
      <Input v-model="password" type="password" placeholder="至少6位、至多15位字符，包含字母、数字和字符" style="width: 300px"/>
    </div>
    <div style="margin: 20px">
      <label>确认密码：</label>
      <Input v-model="passwordConfirm" type="password" placeholder="请重复输入" style="width: 300px"/>
    </div>
    <Button type="primary" @click="reset">重置密码</Button>
  </div>
</template>

<script>
export default {
  name: 'findPwd',
  data () {
    return {
      password: '',
      passwordConfirm: ''
    }
  },
  methods: {
    sleep (time) {
      return new Promise(resolve => setTimeout(resolve, time))
    },
    reset () {
      console.log(this.password, this.passwordConfirm)
      if (this.password !== this.passwordConfirm || !this.judgePwd(this.password)) {
        this.$Message.error('请保持两次输入的密码一致并且符合规则')
        return
      }
      let temp = this.$sha1(this.password)
      temp = temp.toUpperCase()
      let data = {
        id: this.$route.query.id,
        token: this.$route.query.token,
        password: temp
      }
      this.$http.post('/security/resetPasswordRequestChange', data).then(res => {
        console.log(res)
        if (res.data.msg === '成功修改密码') {
          this.$Message.success('成功重置密码，即将跳转至首页')
          this.sleep(3000).then(() => {
            this.$router.push('/')
          })
        } else {
          this.$Message.error(res.data.msg + '，请重新发送邮件进行重置')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    judgePwd (pwd) {
      var reg = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+`\-={}:";'<>?,.]).{6,16}$/
      return reg.test(pwd)
    }
  }
}
</script>

<style scoped>

</style>
