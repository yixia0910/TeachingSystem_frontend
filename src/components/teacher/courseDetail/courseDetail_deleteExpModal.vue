<template>
  <Modal
    v-model="show"
    @on-ok="ok"
    @on-cancel="cancel">
    <p slot="header" style="margin-top:10px;height:25px;font-size: 20px;text-align:center;font-weight:normal">
      <span>确认操作</span>
    </p>
    <div>
      <span style="font-size: 14px">{{expType}}名称为<span style="font-weight: bold">{{expName}}</span>，确认将该{{expType}}<span style="font-weight: bold">删除</span>吗？</span>
    </div>
    <div slot="footer">
      <Button type="text" size="large" @click="cancel">取消</Button>
      <Button type="primary" size="large" :loading="posting" @click="ok">确定</Button>
    </div>
  </Modal>
</template>

<script>
export default {
  name: 'DeleteExpModal',
  props: {
    showModalDeleteExp: {
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
    }
  },
  computed: {
    show: {
      get: function () {
        return this.showModalDeleteExp
      },
      set: function () {
      }
    }
  },
  data () {
    return {
      posting: false
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
    ok () {
      this.posting = true
      this.$http.post('teacher/deleteExperimentById', {
        id: Number(this.expID)
      })
        .then(res => {
          this.posting = false
          if (res.data.code === 1001) {
            this.showNoticeSuccess('操作成功', '已删除' + this.expType + this.expName)
            this.$emit('refresh')
          } else {
            this.showNoticeError('操作失败', res.data.msg)
          }
        })
        .catch(err => {
          console.log(err)
        }).then(() => {
          this.$emit('update:showModalDeleteExp', false)
        })
    },
    cancel () {
      this.$emit('update:showModalDeleteExp', false)
    }
  }
}
</script>

<style scoped>

</style>
