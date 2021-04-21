<template>
  <Modal
    v-model="show"
    @on-ok="ok"
    @on-cancel="cancel">
    <p slot="header" class="modal-title">
      <span>新增考试</span>
    </p>
    <div>
      <Row justify="end" class="code-row-bg" style="padding-top:2%">
        <Col span="7" style="text-align: center;margin-top:1%">
          <span class="input-item">课程名称</span>
        </Col>
        <Col span="17" v-if="selectCourseID===''">
          <Select v-model="courseID" style="width:300px">
            <Option v-for="(item, index) in listCourse" :key="item.id" :value="item.id" :label="item.name">
              <span>{{item.name}}</span>
              <span style="float:right;color:#ccc">{{index + 1}}</span>
            </Option>
          </Select>
        </Col>
        <Col span="17" v-if="selectCourseID!==''">
          <Input v-model="fillCourseName" disabled style="width: 300px" />
        </Col>
      </Row>
      <Row justify="end" class="code-row-bg" style="padding-top:2%">
        <Col span="7" style="text-align: center;margin-top:1%">
          <span  class="input-item">考试名称</span>
        </Col>
        <Col span="17">
          <Input v-model="name" clearable style="width: 300px" />
        </Col>
      </Row>
      <Row justify="end" class="code-row-bg" style="padding-top:2%">
        <Col span="7" style="text-align: center;margin-top:1%">
          <span  class="input-item">满分</span>
        </Col>
        <Col span="17">
          <Input v-model="score" type="number" clearable style="width: 300px" />
        </Col>
      </Row>
      <Row justify="end" class="code-row-bg" style="padding-top:2%">
        <Col span="7" style="text-align: center;margin-top:1%">
          <span  class="input-item">开始时间</span>
        </Col>
        <Col span="17">
          <DatePicker v-model="beginTime" :options="beginTimeOption" type="datetime" placeholder="请选择日期时间" style="width: 300px"></DatePicker>
        </Col>
      </Row>
      <Row justify="end" class="code-row-bg" style="padding-top:2%">
        <Col span="7" style="text-align: center;margin-top:1%">
          <span class="input-item">结束时间</span>
        </Col>
        <Col span="17">
          <DatePicker v-model="endTime" :options="endTimeOption" type="datetime" placeholder="请选择日期时间" style="width: 300px"></DatePicker>
        </Col>
      </Row>
      <Row justify="end" class="code-row-bg" style="padding-top:2%">
        <Col span="7" style="text-align: center;margin-top:1%">
          <span  class="input-item">考试说明</span>
        </Col>
        <Col span="17">
          <Input v-model="description" style="width:300px" type="textarea" :rows="6" placeholder="请输入实验说明..." />
        </Col>
      </Row>
      <Row justify="end" class="code-row-bg" style="padding-top:2%">
        <Col span="7" style="text-align: center;margin-top:1%">
          <span  class="input-item">考试资源</span>
        </Col>
        <Col span="17">
          <Upload
            :action="uploadServerUrl" :data="uploadParams" :before-upload="handleUpload" :on-remove="handleRemove">
            <Button style="margin-left: 0px">上传文件</Button>
          </Upload>
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
// import net from '../../../assets/Global'
// import axios from 'axios'
const Mock = require('mockjs')
Mock.mock(RegExp('fakeUpload' + '.*'), (req) => {
  return { }
})
export default {
  name: 'addExperimentModal',
  props: {
    showModalAddExperiment: {
      type: Boolean,
      default: false
    },
    listCourse: {
      type: Array,
      default: function () {
        return []
      }
    },
    selectCourseID: {
      type: String,
      default: ''
    },
    selectCourseName: {
      type: String,
      default: ''
    }
  },
  watch: {
    selectCourseName (newval, oldval) {
      this.fillCourseName = newval
    },
    selectCourseID (newval, oldval) {
      this.courseID = newval
    },
    enablePeerReview (newval, oldval) {
      if (newval === false && oldval === true) {
        this.peerReviewDeadline = ''
        this.peerReviewDescription = ''
        this.appealDeadline = ''
      }
    }
  },
  data () {
    return {
      postUrl: 'teacher/createExp',
      courseID: this.selectCourseID,
      fillCourseName: this.selectCourseName,
      name: '',
      score: '',
      beginTime: '',
      endTime: '',
      delayTime: '',
      description: '',
      enablePeerReview: false,
      posting: false,
      peerReviewDeadline: '',
      peerReviewDescription: '',
      appealDeadline: '',
      uploadServerUrl: 'fakeUpload',
      uploadParams: {
        id: '14211054',
        type: 2,
        parent: '1b44a1f8-5061-4de1-8a49-58de3fff2fd4'
      },
      file: null
    }
  },
  computed: {
    show: {
      get: function () {
        return this.showModalAddExperiment
      },
      set: function () {
      }
    },
    beginTimeOption: function () {
      let that = this
      return {
        disabledDate (date) {
          return that.getDisabledDate(date, 0)
        }
      }
    },
    endTimeOption: function () {
      let that = this
      return {
        disabledDate (date) {
          return that.getDisabledDate(date, 1)
        }
      }
    },
    delayTimeOption: function () {
      let that = this
      return {
        disabledDate (date) {
          return that.getDisabledDate(date, 2)
        }
      }
    },
    peerReviewDeadlineOption: function () {
      let that = this
      return {
        disabledDate (date) {
          return that.getDisabledDate(date, 3)
        }
      }
    },
    appealDeadlineOption: function () {
      let that = this
      return {
        disabledDate (date) {
          return that.getDisabledDate(date, 4)
        }
      }
    }
  },
  methods: {
    handleUpload (file) {
      this.token = this.$cookie.get('token')
      if (this.file !== null) {
        this.showNoticeWarning('至多上传一个文件', '多个文件请使用压缩包')
        return false
      }
      this.file = file
      return true
    },
    handleRemove (file, fileList) {
      this.file = null
    },
    getDisabledDate (date, index) {
      let listDate = [this.beginTime, this.endTime, this.delayTime, this.peerReviewDeadline, this.appealDeadline]
      let flag = false
      let res = true
      for (let i = 0; i < listDate.length; i++) {
        if (listDate[i] !== '' && i !== index) {
          flag = true
        } else {
          continue
        }
        if (i === index) {
          continue
        } else if (i < index) {
          res = res && !(date.valueOf() < listDate[i].valueOf())
        } else {
          res = res && !(date.valueOf() > listDate[i].valueOf())
        }
      }
      if (flag === false) {
        if (index === 0) { return false } else { return date.valueOf() < Date.now() - 86400000 }
      }
      if (index >= 1) { res = res & !(date.valueOf() <= Date.now() - 86400000) }
      return !res
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
    judgeParams (params) {
      let flag = true
      if (params.course_id === '' || typeof (params.course_id) === 'undefined') {
        this.showNoticeWarning('课程名称错误', '请选择课程名称')
        flag = false
      } else if (params.name === '') {
        this.showNoticeWarning('考试名称错误', '考试名称不能为空')
        flag = false
      } else if (params.start_time === '') {
        this.showNoticeWarning('开始时间错误', '开始时间不能为空')
        flag = false
      } else if (params.end_time === '') {
        this.showNoticeWarning('结束时间错误', '结束时间不能为空')
        flag = false
      }
      let listTime = [params.start_time, params.end_time]
      let listTimeName = ['开始时间', '结束时间']
      for (let i = 0; i < listTime.length - 1; i++) {
        if (listTime[i + 1] === '') { break }
        if (listTime[i] > listTime[i + 1]) {
          this.showNoticeWarning('时间错误', listTimeName[i] + '不能晚于' + listTimeName[i + 1])
          flag = false
        }
      }
      return flag
    },
    clearModal () {
      if (this.selectCourseID === '') { this.courseID = '' }
      this.name = ''
      this.score = ''
      this.beginTime = ''
      this.endTime = ''
      this.delayTime = ''
      this.description = ''
      this.enablePeerReview = false
      this.peerReviewDeadline = ''
      this.peerReviewDescription = ''
      this.appealDeadline = ''
      this.file = null
    },
    ok () {
      let filename = null
      if (this.file !== null) { filename = this.file.name }
      let params = {
        course_id: Number(this.courseID),
        type: true,
        name: this.name,
        vm_status: this.score,
        start_time: this.transferDatetimeToStr(this.beginTime),
        end_time: this.transferDatetimeToStr(this.endTime),
        deadline: this.transferDatetimeToStr(this.delayTime),
        detail: this.description,
        is_peer_assessment: this.enablePeerReview,
        peer_assessment_deadline: this.transferDatetimeToStr(this.peerReviewDeadline),
        peer_assessment_rules: this.peerReviewDescription,
        appeal_deadline: this.transferDatetimeToStr(this.appealDeadline),
        resource: filename
      }
      if (!this.judgeParams(params)) {
        return
      }
      let formData = new FormData()
      formData.append('course_id', params.course_id)
      formData.append('type', params.type)
      formData.append('name', params.name)
      formData.append('vm_status', params.vm_status)
      formData.append('start_time', params.start_time)
      formData.append('end_time', params.end_time)
      formData.append('deadline', params.deadline)
      formData.append('detail', params.detail)
      formData.append('is_peer_assessment', params.is_peer_assessment)
      formData.append('peer_assessment_deadline', params.peer_assessment_deadline)
      formData.append('peer_assessment_rules', params.peer_assessment_rules)
      formData.append('appeal_deadline', params.appeal_deadline)
      formData.append('resource', this.file)
      let config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      this.posting = true
      this.$http.post(this.postUrl, formData, config)
        .then(res => {
          if (res.data.code === 1001) {
            this.showNoticeSuccess('操作成功', '已添加考试' + this.name)
            this.clearModal()
            this.$emit('refresh')
          } else {
            this.showNoticeError('操作失败', res.data.msg)
          }
          this.posting = false
        })
        .catch(err => {
          console.log(err)
        }).then(() => {
          this.$emit('update:showModalAddExperiment', false)
        })
    },
    cancel () {
      this.$emit('update:showModalAddExperiment', false)
    },
    transferDateToStr (date) {
      if (date === '') { return '' }
      let year = date.getFullYear().toString()
      let month = (date.getMonth() + 1).toString()
      let day = (date.getDate()).toString()
      if (month.length === 1) { month = '0' + month }
      if (day.length === 1) { day = '0' + day }
      return year + '/' + month + '/' + day
    },
    transferDatetimeToStr (datetime) {
      if (datetime === '') { return '' }
      let year = datetime.getFullYear().toString()
      let month = (datetime.getMonth() + 1).toString()
      let day = datetime.getDate().toString()
      let hour = datetime.getHours().toString()
      let minute = datetime.getMinutes().toString()
      let second = datetime.getSeconds().toString()
      if (month.length === 1) { month = '0' + month }
      if (day.length === 1) { day = '0' + day }
      if (hour.length === 1) { hour = '0' + hour }
      if (minute.length === 1) { minute = '0' + minute }
      if (second.length === 1) { second = '0' + second }
      return year + '/' + month + '/' + day + ' ' + hour + ':' + minute + ':' + second
    }
  }
}
</script>

<style scoped src="../../../assets/ModalStyle.css"></style>
<style scoped>

</style>
