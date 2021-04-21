<template>
  <Modal
    v-model="show"
    @on-ok="ok"
    @on-cancel="cancel">
    <p slot="header" style="margin-top:10px;height:25px;font-size: 20px;text-align:center;font-weight:normal">
      <span>修改助教</span>
    </p>
    <div>
      <div>
        <Row justify="end" class="code-row-bg" style="padding-top:2%">
          <Col span="7" style="text-align: center;margin-top:1%">
            <span style="font-size: 16px">学生学号：</span>
          </Col>
          <Col span="17">
            <Input v-model="studentID" disabled style="width: 300px" />
          </Col>
        </Row>
        <Row justify="end" class="code-row-bg" style="padding-top:2%">
          <Col span="7" style="text-align: center;margin-top:1%">
            <span style="font-size: 16px">课程名称：</span>
          </Col>
          <Col span="17">
            <Select ref="selectCourseID" v-model="courseID" style="width:300px">
              <Option v-for="(item, index) in listCourse" :key="item.id" :value="item.id" :label="item.name">
                <span>{{item.name}}</span>
                <span style="float:right;color:#ccc">{{index + 1}}</span>
              </Option>
            </Select>
          </Col>
        </Row>
      </div>
    </div>
    <div slot="footer">
      <Button type="text" size="large" @click="cancel">取消</Button>
      <Button type="primary" size="large" @click="ok">确定</Button>
    </div>
  </Modal>
</template>

<script>
export default {
  name: 'changeAssistantModal',
  props: {
    showModalChangeAssistant: {
      type: Boolean,
      default: false
    },
    studentID: {
      type: Number,
      required: true
    },
    listCourse: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data () {
    return {
      courseID: '',
      postUrl: 'teacher/changeAst'
    }
  },
  computed: {
    show: {
      get: function () {
        return this.showModalChangeAssistant
      },
      set: function () {
      }
    }
  },
  methods: {
    getCourseList () {
      this.$http.get(this.CourseListUrl)
        .then(res => {
          if (res.data.code === 1001) {
            this.listCourse = res.data.data
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    showNoticeWarning (noticeTitle, noticeDesc) {
      this.$Notice.warning({
        title: noticeTitle,
        desc: noticeDesc
      })
    },
    clearModal () {
      // this.$refs.selectCourseID.clearSingleSelect()
      this.courseID = -1
    },
    judgeParams (params) {
      let flag = true
      if (params.courseID === '' || typeof (params.courseID) === 'undefined') {
        flag = false
        this.showNoticeWarning('助教管理课程未选择', '请选择助教管理的课程')
      }
      return flag
    },
    ok () {
      let params = {
        courseID: this.courseID,
        stuid: this.studentID
      }
      if (!this.judgeParams(params)) {
        return
      }
      this.$http.post(this.postUrl, params)
        .then(res => {
          if (res.data.code === 1001) {
            this.clearModal()
            this.$emit('showOperationRes', '操作成功', '已成功修改助教')
            this.$emit('refresh')
          } else {
            this.$Message.error(res.data.msg)
            this.$emit('showOperationRes', '操作失败', '修改助教失败')
          }
        })
        .catch(err => {
          console.log(err)
        })
      this.$emit('update:showModalChangeAssistant', false)
    },
    cancel () {
      this.$emit('update:showModalChangeAssistant', false)
    }
  }
}
</script>

<style scoped>

</style>
