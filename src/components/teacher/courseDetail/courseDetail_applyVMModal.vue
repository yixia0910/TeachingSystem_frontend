<template>
  <Modal
    v-model="show"
    @on-ok="ok"
    @on-cancel="cancel">
    <p slot="header" style="margin-top:10px;height:25px;font-size: 20px;text-align:center;font-weight:normal">
      <span>为实验<strong>{{expName}}</strong>申请虚拟机</span>
    </p>
    <div>
      <Row justify="end" class="code-row-bg" style="padding-top:2%">
        <Col span="8" style="text-align: center;margin-top:1%">
          <span style="font-size: 16px">使用上次的虚拟机：</span>
        </Col>
        <Col span="16">
          <Switch size="large" style="margin-top:1.5%" v-model="useLastVM">
            <span slot="open">ON</span>
            <span slot="close">OFF</span>
          </Switch>
        </Col>
      </Row>
      <Row justify="end" class="code-row-bg" style="padding-top:2%">
        <Col span="8" style="text-align: center;margin-top:1%">
          <span style="font-size: 16px">虚拟机名称：</span>
        </Col>
        <Col span="16">
          <Input v-model="name" clearable style="width: 300px" :disabled="useLastVM"/>
        </Col>
      </Row>
      <Row justify="end" class="code-row-bg" style="padding-top:2%">
        <Col span="8" style="text-align: center;margin-top:1%"><span style="font-size: 16px">模板名称：</span></Col>
        <Col span="16">
          <Select :loading="loading" v-model="vmTemplate" style="width:300px" :disabled="useLastVM">
            <Option v-for="(item) in listTemplate" :key="item.Name" :value="item.Name" :label="item.Name+' ( ' +item.GuestFullName+' )'">
              <span>{{item.Name}}</span>
              <span style="float:right;color:#ccc">{{item.GuestFullName}}</span>
            </Option>
          </Select>
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
  name: 'ApplyVMModal',
  props: {
    showModalApplyVM: {
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
    }
  },
  data () {
    return {
      vmTemplate: '',
      loading: true,
      listTemplate: [],
      name: '',
      getTemplateUrl: 'getTemplatesByUserId',
      useLastVM: false,
      posting: false
    }
  },
  computed: {
    show: {
      get: function () {
        return this.showModalApplyVM
      },
      set: function () {
      }
    }
  },
  mounted () {
    this.loading = true
    this.getListTemplate()
  },
  methods: {
    getListTemplate () {
      this.$http.get(this.getTemplateUrl)
        .then(res => {
          if (res.data.code === 1001) {
            this.listTemplate = res.data.data
            if (this.listTemplate === null || (this.listTemplate.length > 0 && this.listTemplate[0] === null)) {
              this.listTemplate = []
            }
          } else {
            this.listTemplate = []
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log(err)
        }).then(() => {
          this.loading = false
        })
    },
    showNoticeWarning (noticeTitle, noticeDesc) {
      this.$Notice.warning({
        title: noticeTitle,
        desc: noticeDesc
      })
    },
    clearModal () {
      this.name = ''
      this.vmTemplate = ''
      this.useLastVM = false
    },
    judgeParams (params) {
      if (params.useLastVM === true) { return true }
      let flag = true
      if (params.useLastVM === false) {
        if (params.name === '' || typeof (params.name) === 'undefined') {
          flag = false
          this.showNoticeWarning('虚拟机名称不能为空', '请填写虚拟机名称')
        } else if (params.vmTemplate === '' || typeof (params.vmTemplate) === 'undefined') {
          flag = false
          this.showNoticeWarning('虚拟机模板不能为空', '请选择虚拟机模板')
        }
      } else {
        flag = false
      }
      return flag
    },
    ok () {
      let params = {
        useLastVM: this.useLastVM
      }
      if (!this.useLastVM) {
        params.name = this.name
        params.vmTemplate = this.vmTemplate
      }
      if (!this.judgeParams(params)) {
        return
      }
      this.posting = false
      this.clearModal()
      this.$emit('update:showModalApplyVM', false)
    },
    cancel () {
      this.$emit('update:showModalApplyVM', false)
    }
  }
}
</script>

<style scoped>

</style>
