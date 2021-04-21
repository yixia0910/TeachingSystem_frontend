<template>
  <Modal
    v-model="show"
    @on-ok="ok"
    @on-cancel="cancel">
    <p slot="header" style="margin-top:10px;height:25px;font-size: 20px;text-align:center;font-weight:normal">
      <span>确认操作</span>
    </p>
    <div>
      <span style="font-size: 14px">虚拟机名称为<span style="font-weight: bold">{{vmName}}</span>，快照名称为<span style="font-weight: bold">{{snapshotName}}</span>，确认<span style="font-weight: bold">删除</span>该快照吗？</span>
      <span>注意：如果该快照存在子快照，子快照也将被一同删除！</span>
    </div>
    <div slot="footer">
      <Button type="text" size="large" @click="cancel">取消</Button>
      <Button type="primary" size="large" :loading="posting" @click="ok">确定</Button>
    </div>
  </Modal>
</template>

<script>
export default {
  name: 'DeleteSnapshotModal',
  data () {
    return {
      posting: false
    }
  },
  props: {
    showModalDeleteSnapshot: {
      type: Boolean,
      default: false
    },
    snapshotName: {
      type: String,
      required: true
    },
    vmName: {
      type: String,
      required: true
    }
  },
  computed: {
    show: {
      get: function () {
        return this.showModalDeleteSnapshot
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
      this.$http.post('vm/removeSnapshot', {
        snapshotName: this.snapshotName,
        vmName: this.vmName
      }).then(res => {
        if (res.data.code === 1001) {
          this.showNoticeSuccess('操作成功', '已成功将快照删除')
        } else {
          this.showNoticeError('操作失败', res.data.msg)
        }
        this.posting = false
        this.$emit('refresh')
        this.$emit('update:showModalDeleteSnapshot', false)
      })
    },
    cancel () {
      this.$emit('update:showModalDeleteSnapshot', false)
    }
  }
}
</script>

<style scoped>

</style>
