<template>
  <Modal
    v-model="show"
    @on-ok="ok"
    @on-cancel="cancel">
    <p slot="header" style="margin-top:10px;height:25px;font-size: 20px;text-align:center;font-weight:normal">
      <span>修改课程</span>
    </p>
    <div>
      <Row justify="end" class="code-row-bg" style="padding-top:2%">
        <Col span="7" style="text-align: center;margin-top:1%">
          <span style="font-size: 16px">课程名称：</span>
        </Col>
        <Col span="17">
          <Input v-model="courseName" clearable style="width: 300px" />
        </Col>
      </Row>
<!--      <Row justify="end" class="code-row-bg" style="padding-top:2%">-->
<!--        <Col span="7" style="text-align: center;margin-top:1%"><span style="font-size: 16px">开课院系：</span></Col>-->
<!--        <Col span="17">-->
<!--          <Select v-model="courseCollege" style="width:300px">-->
<!--            <Option v-for="(item) in listCollege" :key="item.id" :value="item.id" :label="'[ '+item.id+' ] '+item.name">-->
<!--              <span>{{item.name}}</span>-->
<!--              <span style="float:right;color:#ccc">{{item.id}}</span>-->
<!--            </Option>-->
<!--          </Select>-->
<!--        </Col>-->
<!--      </Row>-->
      <Row justify="end" class="code-row-bg" style="padding-top:2%">
        <Col span="7" style="text-align: center;margin-top:1%">
          <span style="font-size: 16px">开课学期：</span>
        </Col>
        <Col span="17">
          <Select v-model="courseTerm" style="width:300px">
            <Option v-for="(item) in listTerm" :key="item.id" :value="item.id" :label="item.name">
              <span>{{item.name}}</span>
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
  name: 'changeCourseModal',
  props: {
    showModalChangeCourse: {
      type: Boolean,
      default: false
    },
    originCourseID: {
      type: String,
      required: true
    },
    originCourseName: {
      type: String,
      required: true
    },
    originCourseTerm: {
      type: Number,
      required: true
    },
    // originCourseDepartment: {
    //   type: String,
    //   required: true
    // },
    // listCollege: {
    //   type: Array,
    //   default: function () {
    //     return []
    //   }
    // },
    listTerm: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  watch: {
    originCourseName: function (newval, oldval) {
      this.courseName = newval
    },
    originCourseTerm: function (newval, oldval) {
      this.courseTerm = newval
    }
    // originCourseDepartment: function (newval, oldval) {
    //   this.courseCollege = newval
    // }
  },
  computed: {
    show: {
      get: function () {
        return this.showModalChangeCourse
      },
      set: function () { }
    }
  },
  data () {
    return {
      courseTerm: this.originCourseTerm,
      postUrl: 'changeCourseInfo',
      courseName: this.originCourseName,
      // courseCollege: this.originCourseDepartment,
      posting: false
    }
  },
  methods: {
    showNoticeWarning (noticeTitle, noticeDesc) {
      this.$Notice.warning({
        title: noticeTitle,
        desc: noticeDesc
      })
    },
    judgeParams (params) {
      let flag = true
      if (params.id === '' || typeof (params.id) === 'undefined') {
        this.showNoticeWarning('未知原因', '操作失败')
        flag = false
      } else if (params.name === '' || typeof (params.name) === 'undefined') {
        this.showNoticeWarning('课程名称错误', '课程名称不能为空')
        flag = false
      } else if (params.term_id === -1 || typeof (params.term_id) === 'undefined') {
        this.showNoticeWarning('开课学期错误', '开课学期不能为空')
        flag = false
      }
      return flag
    },
    clearModal () {
      // this.courseCollege = ''
      this.courseTerm = -1
    },
    ok () {
      let params = {
        id: this.originCourseID,
        name: this.courseName,
        // department_id: this.courseCollege,
        term_id: this.courseTerm
      }
      if (!this.judgeParams(params)) {
        return
      }
      this.posting = true
      this.$http.post(this.postUrl, params)
        .then(res => {
          if (res.data.code === 1001) {
            this.clearModal()
            this.$emit('showOperationRes', '操作成功', '已成功修改课程信息')
            this.$emit('refresh')
          } else {
            this.$emit('showOperationRes', '操作失败', res.data.msg)
          }
          this.posting = false
        })
        .catch(err => {
          console.log(err)
        }).then(() => {
          this.$emit('update:showModalChangeCourse', false)
        })
    },
    cancel () {
      this.$emit('update:showModalChangeCourse', false)
    }
  }
}
</script>

<style scoped>

</style>
