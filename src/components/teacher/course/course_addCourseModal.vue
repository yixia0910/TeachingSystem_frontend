<template>
  <Modal
    v-model="show"
    @on-ok="ok"
    @on-cancel="cancel">
    <p slot="header" class="modal-title">
      <span>新增课程</span>
    </p>
    <div>
      <Row justify="end" class="code-row-bg" style="padding-top:2%">
        <Col span="7" style="text-align: center;margin-top:1%">
          <span class="input-item">课程名称</span>
        </Col>
        <Col span="17">
          <Input v-model="courseName" placeholder="输入课程名称" clearable style="width: 300px" />
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
          <span class="input-item">开课学期</span>
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
      <Button type="text" style="border:1px solid rgba(238,238,238,1);width: 80px; height: 40px; font-weight:400;font-size:16px;" size="large" @click="cancel">取消</Button>
      <Button type="primary" style=";width: 80px; height: 40px; font-weight:600;font-size:16px;" :loading="posting" @click="ok">确定</Button>
    </div>
  </Modal>
</template>

<script>
import net from '../../../assets/Global'
export default {
  name: 'addCourseModal',
  props: {
    showModalAddCourse: {
      type: Boolean,
      default: false
    },
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
  computed: {
    show: {
      get: function () {
        return this.showModalAddCourse
      },
      set: function () { }
    }
  },
  data () {
    return {
      courseTerm: -1,
      postUrl: '/teacher/addCourse',
      courseName: '',
      courseCollege: '',
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
      if (params.name === '') {
        this.showNoticeWarning('课程名称错误', '课程名称不能为空')
        flag = false
      } else if (params.term_id === -1 || typeof (params.term_id) === 'undefined') {
        this.showNoticeWarning('开课学期错误', '开课学期不能为空')
        flag = false
      }
      return flag
    },
    clearModal () {
      this.courseName = ''
      // this.courseCollege = ''
      this.courseTerm = -1
    },
    ok () {
      let params = {
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
            this.$http.get(net.neturl + '/listOwnFolderTreeByParent?parent=public&role=2&status=1')
            this.$http.get(net.neturl + '/listOwnFilesByParent?parent=public&role=2&status=1')
            this.clearModal()
            this.$emit('refresh')
            this.showNoticeSuccess('操作成功', res.data.msg)
          } else {
            this.showNoticeError('操作失败', res.data.msg)
          }
          this.posting = false
        })
        .catch(err => {
          console.log(err)
        }).then(() => {
          this.$emit('update:showModalAddCourse', false)
        })
    },
    cancel () {
      this.$emit('update:showModalAddCourse', false)
    }
  }
}
</script>

<style scoped src="../../../assets/ModalStyle.css"></style>
<style scoped>

</style>
