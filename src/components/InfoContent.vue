<template>
  <div>
    <h2 style="margin: 10px">个人信息</h2>
    <Card>
      <Tabs v-model="currentTab">
        <TabPane label="个人信息" icon="md-person" name="showInfo"></TabPane>
        <TabPane label="修改信息" icon="md-link" name="changeInfo"></TabPane>
        <TabPane label="修改密码" icon="ios-eye" name="changePwd"></TabPane>
      </Tabs>
      <div v-if="currentTab === 'showInfo'">
        <Row class-name="infoLine" type="flex" justify="start" align="middle">
          <Col span="1" class-name="col-label">姓名：</Col>
          <Col>{{name}}</Col>
        </Row>
        <Row class-name="infoLine" type="flex" justify="start" align="middle">
          <Col span="1" class-name="col-label">邮箱：</Col>
          <Col>{{email}}</Col>
        </Row>
        <Row class-name="infoLine" type="flex" justify="start" align="middle">
          <Col span="1" class-name="col-label">登录别名：</Col>
          <Col>{{nickname === null ? '未设置' : nickname}}</Col>
        </Row>
      </div>
      <div v-if="currentTab === 'changeInfo'">
        <Row class-name="infoLine" type="flex" justify="start" align="middle">
          <Col span="1" class-name="col-label">姓名：</Col>
          <Col>
            <Input style="width: auto" v-model="nameChange"></Input>
          </Col>
        </Row>
        <Row class-name="infoLine" type="flex" justify="start" align="middle">
          <Col span="1" class-name="col-label">邮箱：</Col>
          <Col>
            <Input style="width: auto" v-model="emailChange">{{email}}</Input>
          </Col>
        </Row>
        <Row class-name="infoLine" type="flex" justify="start" align="middle">
          <Col span="1" class-name="col-label">登录别名：</Col>
          <Col>
            <Input style="width: auto" v-model="nicknameChange"></Input>
          </Col>
        </Row>
        <Row class-name="infoLine" type="flex" justify="start" align="middle">
          <Col span="1" class-name="col-label"></Col>
          <Col>
            <Button type="primary" @click="changeInfo">确认</Button>
          </Col>
        </Row>
      </div>
      <div v-if="currentTab === 'changePwd'">
        <Row class-name="infoLine" type="flex" justify="start" align="middle">
          <Col span="1" class-name="col-label">旧密码：</Col>
          <Col>
            <Input style="width: auto" placeholder="请输入你的旧密码" v-model="passwdOld" type="password"></Input>
          </Col>
        </Row>
        <Row class-name="infoLine" type="flex" justify="start" align="middle">
          <Col span="1" class-name="col-label">新密码：</Col>
          <Col>
            <Input style="width: auto" placeholder="请输入你的新密码" v-model="passwdNew" type="password"></Input>
          </Col>
        </Row>
        <Row class-name="infoLine" type="flex" justify="start" align="middle">
          <Col span="1" class-name="col-label">确认密码：</Col>
          <Col>
            <Input style="width: auto" placeholder="请确保两次输入的密码一致" v-model="passwdConfirm" type="password"></Input>
          </Col>
        </Row>
        <Row class-name="infoLine" type="flex" justify="start" align="middle">
          <Col span="1" class-name="col-label"></Col>
          <Col>
            <Button type="primary" @click="changePwd">确认</Button>
          </Col>
        </Row>
      </div>
    </Card>
  </div>
</template>

<script>
export default {
  name: 'InfoContent',
  data () {
    return {
      currentTab: 'showInfo', // 当前Tab
      name: '',
      email: '',
      nickname: '',
      nameChange: '', // 修改个人信息界面，姓名绑定的数据
      emailChange: '', // 修改个人信息界面，邮箱绑定的数据
      nicknameChange: '',
      passwdOld: '', // 修改密码界面，旧密码绑定的数据
      passwdNew: '', // 修改密码界面，新密码绑定的数据
      passwdConfirm: '' // 修改密码界面，确认密码绑定的数据
    }
  },
  created () {
    this.getInfo()
  },
  methods: {
    getInfo () {
      this.$http.get('/getInfo', {
        // TODO BY HQ 用户名使用真实用户名
      }).then(res => {
        console.log(res)
        if (res.data.code === 0) {
          this.$Message.error(res.data.msg)
        } else {
          this.name = res.data.data.name
          this.email = res.data.data.email
          this.nickname = res.data.data.nickname
          this.nameChange = this.name
          this.emailChange = this.email
          this.nicknameChange = this.nickname
        }
      }).catch(res => {
        console.log(res)
      })
    },
    changeInfo () {
      if (this.nameChange === '' || this.emailChange === '') {
        this.$Message.error('请将个人信息填写完整!')
        return
      }
      let data = {
        name: this.nameChange,
        email: this.emailChange,
        userId: this.$cookie.get('userId'),
        nickname: this.nicknameChange
      }
      this.$http.post('/changeInfo', data).then(res => {
        console.log(res)
        if (res.data.code !== 1001) {
          this.$Message.error(res.data.msg)
        } else {
          this.$Message.success(res.data.msg)
          this.$cookie.set('username', this.nameChange)
          this.nameChange = this.emailChange = ''
          this.getInfo()
        }
      }).catch(res => {
        console.log(res)
      })
    },
    changePwd () {
      if (this.passwdConfirm === '' || this.passwdNew === '' || this.passwdOld === '') {
        this.$Message.error('请填写完整!')
        return
      }
      if (this.passwdNew !== this.passwdConfirm) {
        this.$Message.error('两次输入的密码不一致!')
        return
      }
      if (!this.judgePwd(this.passwdNew)) {
        this.$Message.error('密码应包含字母数字和符号，长度在6到16之间')
        return
      }
      let tempNew = this.$sha1(this.passwdNew)
      tempNew = tempNew.toUpperCase()
      let tempOld = this.$sha1(this.passwdOld)
      tempOld = tempOld.toUpperCase()
      let data = {
        passwdOld: tempOld,
        passwdNew: tempNew,
        userId: this.$cookie.get('userId')
      }
      this.$http.post('/changePwd', data).then(res => {
        console.log(res)
        if (res.data.code !== 1001) {
          this.$Message.error(res.data.msg)
        } else {
          this.$Message.success(res.data.msg)
          this.passwdOld = this.passwdNew = this.passwdConfirm = ''
        }
      }).catch(res => {
        console.log(res)
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
  .infoLine{
    margin-left: 5%;
    margin-top: 20px;
  }
  .col-label{
    min-width: 80px;
  }
</style>
