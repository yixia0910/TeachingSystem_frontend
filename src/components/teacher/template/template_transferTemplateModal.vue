<template>
  <Modal
    v-model="show"
    @on-ok="ok"
    @on-cancel="cancel">
    <p slot="header" style="margin-top:10px;height:25px;font-size: 20px;text-align:center;font-weight:normal">
      <span>确认操作</span>
    </p>
    <div>
      <span style="font-size: 14px">模板名称为<span style="font-weight: bold">{{templateName}}</span>，确认将该模板<span style="font-weight: bold">转化为虚拟机</span>吗？</span>
    </div>
    <div slot="footer">
      <Button type="text" size="large" @click="cancel">取消</Button>
      <Button type="primary" size="large" :loading="posting" @click="ok">确定</Button>
    </div>
  </Modal>
</template>

<script>
export default {
  name: 'TransferTemplateModal',
  props: {
    showModalTransferTemplate: {
      type: Boolean,
      default: false
    },
    templateName: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      posting: false
    }
  },
  computed: {
    show: {
      get: function () {
        return this.showModalTransferTemplate
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
    ok () {
      this.posting = true
      this.$http.post('vm/transferTemplate', {
        templateName: this.templateName
      }).then(res => {
        this.posting = false
        if (res.data.code === 1001) {
          this.showNoticeSuccess('成功将' + this.templateName + '转换为虚拟机', '')
        } else {
          this.showNoticeError('转换模板' + this.templateName + '失败', res.data.msg)
        }
      }).then(() => {
        this.$emit('update:showModalTransferTemplate', false)
      })
    },
    cancel () {
      this.$emit('update:showModalTransferTemplate', false)
    }
  }
}
</script>

<style scoped>

</style>
