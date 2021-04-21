<template>
  <Modal
    v-model="show"
    @on-ok="ok"
    @on-cancel="cancel">
    <p slot="header" style="margin-top:10px;height:25px;font-size: 20px;text-align:center;font-weight:normal">
      <span>确认操作</span>
    </p>
    <div>
      <span style="font-size: 14px">模板名称为<span style="font-weight: bold">{{templateName}}</span>，确认将该模板<span style="font-weight: bold">删除</span>吗？</span>
      <br><span>申请删除后请等待管理员通过申请。若要取消删除申请，请至申请记录中撤销申请。</span>
    </div>
    <div slot="footer">
      <Button type="text" size="large" @click="cancel">取消</Button>
      <Button type="primary" size="large" :loading="posting" @click="ok">确定</Button>
    </div>
  </Modal>
</template>

<script>
export default {
  name: 'DeleteTemplateModal',
  props: {
    showModalDeleteTemplate: {
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
        return this.showModalDeleteTemplate
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
      let postparams = {
        vm_name: this.templateName
      }
      this.$http.post('common/deleteSingleVM', postparams)
        .then(res => {
          this.posting = false
          if (res.data.code === 1001) {
            this.showNoticeSuccess('成功发送申请' + this.templateName, '')
          } else {
            this.showNoticeError('删除模板' + this.templateName + '失败', res.data.msg)
          }
        }).then(() => {
          this.$emit('update:showModalDeleteTemplate', false)
        })
    },
    cancel () {
      this.$emit('update:showModalDeleteTemplate', false)
    }
  }
}
</script>

<style scoped>

</style>
