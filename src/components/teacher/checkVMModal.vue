<template>
  <Modal v-model="show" @on-ok="ok" @on-cancel="cancel" width="500px">
    <p slot="header" class="modal-header">查看虚拟机{{ this.vmName }}的信息</p>
    <div class="modal-content modal-row">
      <div v-if="OS === 'linux'">
        <Row style="text-align: left; margin-top: 10px">
          使用ssh登录（用于Linux系统虚拟机）<a href='https://www.putty.org/' target="_blank">下载ssh登录工具(putty)</a>
        </Row>
        <div style="font-size: small; font-weight: bold">
          <Row style="margin-top: 20px">
            <Col span="8"><label>登录IP</label></Col>
            <Col span="10" style="text-align: left; margin-left: 20px;"><span>{{ this.loginIp === 'Unavailable' ? '开机后等待数分钟可见' : this.loginIp }}</span></Col>
          </Row>
          <Row style="margin-top: 10px">
            <Col span="8"><label>登录用户名</label></Col>
            <Col span="10" style="text-align: left; margin-left: 20px;"><span>{{ this.loginUsername === '' ? 'buaa或root' : this.loginUsername }}</span></Col>
          </Row>
          <Row style="margin-top: 10px">
            <Col span="8"><label>登录密码</label></Col>
            <Col span="10" style="text-align: left; margin-left: 20px;"><span>{{ this.loginPassword === '' ? '&shieshuyuan21(默认密码)' : this.loginPassword }}</span></Col>
          </Row>
        </div>
      </div>
      <div v-if="OS !== 'linux'">
        <Row style="text-align: left; margin-top: 10px">
          使用远程桌面连接登录（用于Windows系统虚拟机）
        </Row>
        <div style="font-size: small; font-weight: bold">
          <Row style="margin-top: 20px">
            <Col span="8"><label>登录IP</label></Col>
            <Col span="10" style="text-align: left; margin-left: 20px;"><span>{{ this.loginIp === 'Unavailable' ? '开机后等待数分钟可见' : this.loginIp }}</span></Col>
          </Row>
          <Row style="margin-top: 10px">
            <Col span="8"><label>登录用户名</label></Col>
            <Col span="10" style="text-align: left; margin-left: 20px;"><span>{{ this.loginUsername === '' ? 'admin' : this.loginUsername }}</span></Col>
          </Row>
          <Row style="margin-top: 10px">
            <Col span="8"><label>登录密码</label></Col>
            <Col span="10" style="text-align: left; margin-left: 20px;"><span>{{ this.loginPassword === '' ? '@buaa21(默认密码)' : this.loginPassword }}</span></Col>
          </Row>
        </div>
      </div>
<!--      <div v-if="loginUrl !== null && loginUrl !== 'null' && typeof loginUrl !== 'undefined' && loginUrl !== ''">-->
<!--        <Row style="text-align: left; margin-top: 10px">-->
<!--          <Col span="8">-->
<!--            <span v-if="OSName !== ''">2 </span>-->
<!--            <span v-else>3 </span>-->
<!--            <label @click="consoleLogin" style="cursor: pointer; color: dodgerblue">点此使用VNC登录</label></Col>-->
<!--        </Row>-->
<!--      </div>-->
      <div v-if="consoleUrl !== null && vmtype === 'Sangfor'">
        <Row style="text-align: left; margin-top: 10px">
          <Col span="8">
            <label @click="consoleLogin" style="cursor: pointer; color: dodgerblue">点此使用VNC登录</label></Col>
        </Row>
      </div>
    </div>
    <div slot="footer">
      <Button size="large" style="border: 0px" @click="cancel">返回</Button>
      <Button size="large" type="info" style="border: 0px" @click="ok">确定</Button>
    </div>
  </Modal>
</template>

<script>
import net from '../../assets/Global'
export default {
  name: 'checkVMModal',
  props: {
    showModalCheckVM: {
      type: Boolean,
      required: true
    },
    vmName: {
      type: String,
      default: ''
    },
    OS: {
      type: String,
      default: 'linux'
    },
    loginIp: {
      type: String,
      default: ''
    },
    loginUsername: {
      type: String,
      default: ''
    },
    loginPassword: {
      type: String,
      default: ''
    },
    consoleUrl: {
      type: String,
      default: ''
    }
  },
  computed: {
    show: {
      get: function () {
        return this.showModalCheckVM
      },
      set: function () {
      }
    }
  },
  watch: {
    vmName (newval, oldval) {
      this.getConsoleUrl(newval)
    },
    OS (newval, oldval) {
      if (newval === '' || newval === null || newval === 'null' || typeof newval === 'undefined') {
        this.OSName = ''
      } else {
        this.OSName = String(newval).toLowerCase().indexOf('win') >= 0 ? 'windows' : 'linux'
      }
    }
  },
  methods: {
    showNoticeSuccess (noticeTitle, noticeDesc) {
      this.$Notice.success({
        title: noticeTitle,
        desc: noticeDesc
      })
    },
    showNoticeError (noticeTitle, noticeDesc) {
      this.$Notice.error({
        title: noticeTitle,
        desc: noticeDesc
      })
    },
    showNoticeWarning (noticeTitle, noticeDesc) {
      this.$Notice.warning({
        title: noticeTitle,
        desc: noticeDesc
      })
    },
    ok () {
      console.log(this.consoleUrl)
      this.$emit('update:showModalCheckVM', false)
    },
    cancel () {
      this.$emit('update:showModalCheckVM', false)
    },
    consoleLogin () {
      this.loginUrl = this.consoleUrl
      let userAgent = navigator.userAgent.toLowerCase()
      if (userAgent.indexOf('firefox') > -1 || userAgent.indexOf('edge') > -1) {
        window.open(this.loginUrl, 'noVnc', 'toolbar=no, menubar=no, scrollbars=no, location=no, status=no')
      } else if (userAgent.indexOf('chrome') > -1) {
        let that = this
        this.$Modal.confirm({
          title: '您的浏览器是Chrome',
          content: '如果Chrome浏览器无法正常打开，请请理cookie后重试',
          okText: '立即登录',
          width: '450px',
          onOk: () => {
            window.open(this.loginUrl, 'noVnc', 'toolbar=no, menubar=no, scrollbars=no, location=no, status=no')
            that.$emit('update:showModalCheckVM', false)
          }
        })
      } else {
        let that = this
        this.$Modal.confirm({
          title: '您的浏览器可能无法正常登录',
          content: '如果无法正常登录，请使用Firefox/Chrome/Edge',
          okText: '立即登录',
          width: '450px',
          onOk: () => {
            window.open(this.loginUrl)
            that.$emit('update:showModalCheckVM', false)
          }
        })
      }
    },
    getConsoleUrl (newVMName) {
      return null
      /*
      if (newVMName === '') {
        return
      }
      this.loading = true
      this.$http.get(this.consoleUrl, {
        params: {
          vmName: newVMName
        }
      }).then(res => {
        if (res.data.code === 1001) {
          this.loginUrl = res.data.data
        } else {
          this.$Message.error('获取VNC登陆Url失败，' + res.data.msg)
        }
      })
        .catch(err => {
          this.loginUrl = null
          console.log(err)
        })
        */
    }
  },
  data () {
    return {
      vmtype: net.vmmanager,
      loginUrl: null,
      OSName: ''
    }
  }
}
</script>

<style scoped>
  .modal{
    color: #777777;
    text-align: right;
  }
  .modal-header {
    font-size: large;
    height: 40px;
    align-content: center;
    text-align: center;
    line-height: 50px;
    color: #777777;
  }
  .modal-row label{
    margin-top: 5px;
  }
  .modal-content{
    text-align: right;
    font-size: medium;
    font-family: 等线;
  }
  .modal-content Input{
    width: 50%;
    margin-left: 5px;
  }
</style>
