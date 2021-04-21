<template>
  <Modal
    v-model="show"
    @on-ok="ok"
    @on-cancel="cancel">
    <p slot="header" style="margin-top:10px;height:25px;font-size: 20px;text-align:center;font-weight:normal">
      <span>修改虚拟机的密码</span>
    </p>
    <div>
      <Row justify="end" class="code-row-bg" style="padding-top:2%">
        <Col span="7" style="text-align: center;margin-top:1%">
          <span style="font-size: 16px">{{expType}}名称：</span>
        </Col>
        <Col span="17">
          <Input v-model="expName" disabled style="width: 300px"/>
        </Col>
      </Row>
      <Row justify="end" class="code-row-bg" style="padding-top:2%">
        <Col span="7" style="text-align: center;margin-top:1%"><span style="font-size: 16px">新密码：</span></Col>
        <Col span="17">
          <Input v-model="password" clearable style="width: 300px"/>
        </Col>
      </Row>
    </div>
    <div slot="footer">
      <Button type="text" size="large" @click="cancel">取消</Button>
      <Button type="primary" size="large" :loading="posting" @click="ok">确定</Button>
    </div>
  </Modal>
</template>

<script>
export default {
  name: 'ChangePasswordModal',
  props: {
    showModalChangePassword: {
      type: Boolean,
      default: false
    },
    expName: {
      type: String,
      required: true
    },
    expID: {
      type: Number,
      required: true
    },
    expType: {
      type: String,
      required: true
    },
    defaultVMPWD: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      password: '',
      posting: false
    }
  },
  watch: {
    defaultVMPWD (newval, oldval) {
      this.password = newval
    }
  },
  mounted () {
    this.password = this.defaultVMPWD
  },
  computed: {
    show: {
      get: function () {
        return this.showModalChangePassword
      },
      set: function () {
      }
    }
  },
  methods: {
    showNoticeWarning (noticeTitle, noticeDesc) {
      this.$Notice.warning({
        title: noticeTitle,
        desc: noticeDesc
      })
    },
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
    clearModal () {
      this.password = ''
    },
    judgeParams (params) {
      let flag = true
      if (params.password === '' || typeof params.password === 'undefined') {
        this.showNoticeWarning('虚拟机密码未填写', '虚拟机密码不能为空')
        flag = false
      } else if (params.password.length < 6) {
        this.showNoticeWarning('虚拟机密码太短', '虚拟机密码至少6位')
        flag = false
      }
      return flag
    },
    ok () {
      let params = {
        experiment_id: this.expID,
        password: this.password
      }
      if (!this.judgeParams(params)) {
        return
      }
      this.posting = true
      this.$http.post('vm/changePassword', params)
        .then(res => {
          if (res.data.code === 1001) {
            this.showNoticeSuccess('操作成功', '修改虚拟机密码成功')
            sessionStorage.setItem('experimentalVM_defaultVMPWD', String(params.password))
            this.$emit('update:defaultVMPWD', params.password)
            this.clearModal()
          } else {
            this.showNoticeError('操作失败', res.data.msg)
          }
          this.posting = false
        })
        .catch(err => {
          console.log(err)
        }).then(() => {
          this.$emit('update:showModalChangePassword', false)
        })
    },
    cancel () {
      this.$emit('update:showModalChangePassword', false)
    }
  }
}
</script>

<style scoped>

</style>
