<template>
  <Modal
    v-model="show"
    @on-ok="ok"
    @on-cancel="cancel" width="600px">
    <p slot="header" style="margin-top:10px;height:25px;font-size: 20px;text-align:center;font-weight:normal">
      <span>为课程<strong>《{{courseName}}》</strong>批量添加学生</span>
    </p>
    <div>
      <Input v-model="studentsText" type="textarea" :rows="8" placeholder="请输入学生学号，并以空格分割..." />
    </div>
    <div slot="footer">
      <Button type="text" size="large" @click="cancel">取消</Button>
      <Button type="primary" size="large" :loading="posting" @click="ok">确定</Button>
    </div>
  </Modal>
</template>

<script>
export default {
  name: 'BatchAddStudentsModal',
  props: {
    showModalBatchAddStudents: {
      type: Boolean,
      default: false
    },
    courseID: {
      type: String,
      required: true
    },
    courseName: {
      type: String,
      required: true
    }
  },
  computed: {
    show: {
      get: function () {
        return this.showModalBatchAddStudents
      },
      set: function () {
      }
    }
  },
  data () {
    return {
      studentsText: '',
      posting: false
    }
  },
  methods: {
    sleep (time) {
      return new Promise(resolve => setTimeout(resolve, time))
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
    judgeText () {
      let pattern = /^[\w\s\d]*$/
      let flag = pattern.test(this.studentsText)
      if (!flag) {
        this.showNoticeWarning('输入错误', '输入应只包含数字与空格')
      }
      return flag
    },
    clearModal () {
      this.studentsText = ''
    },
    ok () {
      if (!this.judgeText()) {
        return
      }
      let stuList = this.studentsText.trim().split(/\s+/)
      this.posting = true
      this.$http.post('teacher/addStusToCourse', {
        courseID: this.courseID,
        stuidList: stuList
      })
        .then(res => {
          if (res.data.code === 1001) {
            this.clearModal()
            console.log(res.data)
            if (res.data.msg.indexOf('失败') >= 0) {
              if (res.data.data === null) {
                confirm('重复添加学生，已进行过滤')
                return
              }
              console.log(res.data.data)
              var result = confirm('学号为' + res.data.data + '不在系统当中' + ' 是否将其导入系统?')
              console.log(result)
              if (result) {
                // eslint-disable-next-line no-undef
                this.add(res.data.data)
              }
              // this.showNoticeError(res.data.msg, res.data.data)
            } else {
              this.showNoticeSuccess(res.data.msg, res.data.data)
              this.sleep(1500).then(() => {
                window.location.reload()
              })
            }
          } else {
            this.showNoticeError(res.data.msg, res.data.data)
          }
          this.posting = false
        })
        .catch(err => {
          console.log(err)
        }).then(() => {
          this.$emit('update:showModalBatchAddStudents', false)
        })
      // window.location.reload()
    },
    add (sid) {
      console.log(sid)
      this.posting = true
      this.$http.post('teacher/addStuToSystem', {
        courseID: this.courseID,
        sid: sid
      })
        .then(res => {
          if (res.data.code === 1001) {
            this.clearModal()
            this.showNoticeSuccess(res.data.msg, res.data.data)
            this.sleep(2000)
            window.location.reload()
          }
          this.posting = false
        })
        .catch(err => {
          console.log(err)
        }).then(() => {
          this.$emit('update:showModalBatchAddStudents', false)
        })
    },
    cancel () {
      this.$emit('update:showModalBatchAddStudents', false)
    }
  }
}
</script>

<style scoped>

</style>
