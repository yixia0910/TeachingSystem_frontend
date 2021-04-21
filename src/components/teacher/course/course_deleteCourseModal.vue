<template>
  <Modal
    v-model="show"
    @on-ok="ok"
    @on-cancel="cancel">
    <p slot="header" style="margin-top:10px;height:25px;font-size: 20px;text-align:center;font-weight:normal">
      <span>确认操作</span>
    </p>
    <div>
      <span style="font-size: 14px">课程名称为<span style="font-weight: bold">{{courseName}}</span>，确认将该课程<span style="font-weight: bold">删除</span>吗？</span>
      <br>
      <input type="text" v-model="name" placeholder="请输入一遍课程名称以确认删除该课程" clearable style="width: 350px">
    </div>
    <div slot="footer">
      <Button type="text" size="large" @click="cancel">取消</Button>
      <Button type="primary" size="large" :loading="posting" @click="ok">确定</Button>
    </div>
  </Modal>
</template>

<script>
export default {
  name: 'DeleteCourseModal',
  props: {
    showModalDeleteCourse: {
      type: Boolean,
      default: false
    },
    courseName: {
      type: String,
      required: true
    },
    courseID: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      posting: false,
      name: ''
    }
  },
  computed: {
    show: {
      get: function () {
        return this.showModalDeleteCourse
      },
      set: function () {
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
    ok () {
      if (this.name !== this.courseName) {
        this.showNoticeError('操作失败', '课程名称错误')
        this.$emit('update:showModalDeleteCourse', false)
      } else {
        this.posting = true
        this.$http.post('teacher/deleteCourse', {
          courseID: (this.courseID)
        }).then(res => {
          if (res.data.code === 1001) {
            this.showNoticeSuccess('操作成功', '已成功将课程删除')
            this.$emit('refresh')
          } else {
            this.showNoticeError('操作失败', res.data.msg)
          }
          this.posting = false
        }).then(() => {
          this.$emit('update:showModalDeleteCourse', false)
        })
      }
    },
    cancel () {
      this.$emit('update:showModalDeleteCourse', false)
    }
  }
}
</script>

<style scoped>

</style>
