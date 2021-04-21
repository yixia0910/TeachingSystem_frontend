<template>
  <Modal
    v-model="show"
    @on-ok="ok"
    @on-cancel="cancel">
    <p slot="header" class="modal-title" style="margin-top:10px;height:25px;font-size: 20px;font-weight:500">
      <span>添加成员</span>
    </p>
    <div>
      <Row justify="end" class="code-row-bg" style="padding-top:2%">
        <Col span="7" style="text-align: center;margin-top:1%">
          <span style="font-size: 16px">成员ID</span>
        </Col>
        <Col span="17">
          <Input v-model="studentID" clearable style="width: 300px" />
        </Col>
      </Row>
      <Row justify="end" class="code-row-bg" style="padding-top:2%">
        <Col span="7" style="text-align: center;margin-top:1%">
          <span style="font-size: 16px">课程名称</span>
        </Col>
        <Col span="17">
          <Select v-model="courseID" style="width:300px">
            <Option v-for="(item, index) in listCourse" :key="item.id" :value="item.id" :label="item.name">
              <span>{{item.name}}({{item.term}})</span>
              <span style="float:right;color:#ccc">{{index + 1}}</span>
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
  name: 'addAssistantModal',
  props: {
    showModalAddAssistant: {
      type: Boolean,
      default: false
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
      studentID: '',
      courseID: '',
      postUrl: 'teacher/addAstToCourse',
      posting: false
    }
  },
  computed: {
    show: {
      get: function () {
        return this.showModalAddAssistant
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
    clearModal () {
      this.studentID = ''
      this.courseID = ''
    },
    judgeParams (params) {
      let flag = true
      if (params.stuid === '') {
        flag = false
        this.showNoticeWarning('成员ID未填写', '请填写成员ID')
      } else if (params.courseID === '' || typeof (params.courseID) === 'undefined') {
        flag = false
        this.showNoticeWarning('管理课程未选择', '请选择成员管理的课程')
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
      this.posting = true
      this.$http.post(this.postUrl, params)
        .then(res => {
          if (res.data.code === 1001) {
            this.showNoticeSuccess('操作成功', '已成功添加成员')
            console.log(res.data.msg)
            this.$emit('refresh')
            this.clearModal()
          } else {
            this.showNoticeError('操作失败', res.data.msg)
          }
          this.posting = false
        })
        .catch(err => {
          console.log(err)
        }).then(() => {
          this.$emit('update:showModalAddAssistant', false)
        })
    },
    cancel () {
      this.$emit('update:showModalAddAssistant', false)
    }
  }
}
</script>

<style scoped>

</style>
