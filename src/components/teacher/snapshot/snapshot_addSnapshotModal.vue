<template>
  <Modal
    v-model="show"
    @on-ok="ok"
    @on-cancel="cancel">
    <p slot="header" style="margin-top:10px;height:25px;font-size: 20px;text-align:center;font-weight:normal">
      <span>添加快照</span>
    </p>
    <div>
      <span>如果您即将创建的快照是某个快照的子快照，则在删除父快照时，该子快照也会被删除。强烈建议您为每个虚拟机仅保留一个快照，在创建快照前删除其他快照。</span>
      <Row justify="end" class="code-row-bg" style="padding-top:2%">
        <Col span="7" style="text-align: center;margin-top:1%">
          <span style="font-size: 16px">虚拟机名称：</span>
        </Col>
        <Col span="17">
          <Input v-model="vmTemplate" disabled style="width: 300px" />
        </Col>
      </Row>
      <Row justify="end" class="code-row-bg" style="padding-top:2%">
        <Col span="7" style="text-align: center;margin-top:1%">
          <span style="font-size: 16px">快照名称：</span>
        </Col>
        <Col span="17">
          <Input v-model="name" clearable style="width: 300px" />
        </Col>
      </Row>
      <Row justify="end" class="code-row-bg" style="padding-top:2%">
        <Col span="7" style="text-align: center;margin-top:1%">
          <span style="font-size: 16px">快照描述：</span>
        </Col>
        <Col span="17">
          <Input v-model="description" style="width:300px" type="textarea" :rows="6" placeholder="请输入快照描述..." />
        </Col>
      </Row>
    </div>
    <div slot="footer">
      <Button type="text" size="large" @click="cancel">取消</Button>
      <Button type="primary" :loading="posting" size="large" @click="ok">确定</Button>
    </div>
  </Modal>
</template>

<script>
export default {
  name: 'AddSnapshotModal',
  props: {
    showModalAddSnapshot: {
      type: Boolean,
      default: false
    },
    vmName: {
      type: String,
      required: true
    }
  },
  watch: {
    vmName (newval, oldval) {
      this.vmTemplate = newval
    }
  },
  data () {
    return {
      getTemplateUrl: 'getPerVMsByUserId',
      listTemplate: [],
      posting: false,
      vmTemplate: '',
      name: '',
      description: '',
      postUrl: 'vm/createSnapshot'
    }
  },
  mounted () {
    this.vmTemplate = this.vmName
  },
  computed: {
    show: {
      get: function () {
        return this.showModalAddSnapshot
      },
      set: function () {
      }
    }
  },
  methods: {
    clearModal () {
      this.name = ''
      this.description = ''
    },
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
    judgeParams (params) {
      let flag = true
      if (params.snapshotName === '') {
        this.showNoticeWarning('快照名称错误', '快照名称不能为空')
        flag = false
      } else if (params.vmName === '' || typeof (params.vmName) === 'undefined') {
        this.showNoticeWarning('模板名称错误', '模板名称不能为空')
        flag = false
      }
      return flag
    },
    ok () {
      let params = {
        vmName: this.vmTemplate,
        snapshotName: this.name,
        description: this.description
      }
      if (!this.judgeParams(params)) {
        return
      }
      this.posting = true
      this.$http.post(this.postUrl, params)
        .then(res => {
          if (res.data.code === 1001) {
            this.showNoticeSuccess('操作成功', '已成功添加快照')
            this.clearModal()
          } else {
            this.showNoticeError('操作失败', res.data.msg)
          }
          this.posting = false
          this.$emit('refresh')
          this.$emit('update:showModalAddSnapshot', false)
        })
        .catch(err => {
          console.log(err)
        })
    },
    cancel () {
      this.$emit('update:showModalAddSnapshot', false)
    }
  }
}
</script>

<style scoped>

</style>
