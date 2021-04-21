<template>
  <div>
    <NavBar :breadlist="breadlist">
      <div slot="navbarContent">
        <CardContent>
          <div class="content-list-box">
            <div class="list-box">
              <div class="list-block-box">
                <label>实验名称</label>
                <Span>{{name}}</Span>
              </div>
              <div class="list-block-box">
                <label>所属课程</label>
                <Span>{{course}}</Span>
              </div>
              <div class="list-block-box">
                <label>指导教师</label>
                <Span>{{teacher}}</Span>
              </div>
              <div class="list-block-box">
                <label>开始时间</label>
                <Span>{{startTime}}</Span>
              </div>
              <div class="list-block-box">
                <label>结束时间</label>
                <Span>{{endTime}}</Span>
              </div>
              <div class="list-block-box">
                <label>延迟提交时间</label>
                <Span>{{deadline}}</Span>
              </div>
              <div class="list-block-box">
                <label>互评截止时间</label>
                <Span>{{peerDeadline}}</Span>
              </div>
              <div class="list-block-box">
                <label>申诉截止时间</label>
                <Span>{{appealDeadline}}</Span>
              </div>
            </div>
            <Row>
              <Col>
                <label>实验说明</label>
                <div class="list-block">{{details}}</div>
              </Col>
            </Row>
            <Row>
              <Col>
                <label>互评细则</label>
                <div class="list-block">{{peerAssessmentRule}}</div>
              </Col>
            </Row>
            <Row>
              <Col span="4">
                <label>参考资源</label>
                <div>{{resource}}</div>
              </Col>
              <Col span="10">
                <ButtonGroup v-if="resource !== null && resource!== ''">
                  <Button @click="resourceDownload">
                    <Icon type="md-download"></Icon>
                    下载
                  </Button>
<!--                  <Button @click="resourcePreview">-->
<!--                    <Icon type="md-arrow-down"></Icon>-->
<!--                    预览-->
<!--                  </Button>-->
                </ButtonGroup>
                <Span v-else>无</Span>
              </Col>
            </Row>
            <Row>
              <Col span="4">
                <label>作业提交状态</label>
                <Span>{{status}}</Span>
              </Col>
              <Col offset="2" span="10">
                <Button @click="checkHomework">
                  <Icon type="md-search"></Icon>
                  查看作业
                </Button>
              </Col>
            </Row>
          </div>
        </CardContent>
      </div>
    </NavBar>
  </div>
</template>

<script>
import NavBar from '../../components/NavBar'
import CardContent from '../../components/CardContent'
import axios from 'axios'
import net from '../../../assets/Global'
export default {
  name: 'expDetails',
  components: {CardContent, NavBar},
  data () {
    return {
      breadlist: [
        {name: '课程管理', path: '/assistant/courseManagement'},
        {name: '详情', path: '/assistant/courseDetails'},
        {name: '实验详情', path: '/assistant/expDetails'}
      ],
      expId: JSON.parse(localStorage.getItem('paramsMessage')).expId,
      name: '',
      course: '',
      teacher: '',
      startTime: '',
      endTime: '',
      deadline: '',
      peerDeadline: '',
      appealDeadline: '',
      enablePeer: JSON.parse(localStorage.getItem('paramsMessage')).enablePeer,
      peerStarted: JSON.parse(localStorage.getItem('paramsMessage')).peerStarted,
      peerAssessmentRule: '',
      details: '',
      status: '',
      resource: '',
      previewModal: false
    }
  },
  mounted () {
    this.getDetails()
  },
  methods: {
    resourceDownload () {
      this.stuId = this.$cookie.get('userId')
      this.token = this.$cookie.get('token')
      axios.get(net.neturl + '/tryDownload?stuId="' + this.stuId + '"&expId=' + this.expID + '&type=0')
        .then(res => {
          if (res.data.code === 1001) {
            let file = res.data.data
            window.open(net.neturl + '/downloadViaNetdisk?' + 'type=1&' + 'uuid=' + file)
          } else {
            this.$Message.error(res.data.msg)
          }
        }).catch(err => {
          console.log(err)
        })
    },
    resourcePreview () {
      // this.$http.get('/preview', {params: {id: this.resource}})
      //   .then(res => {
      //     if (res.data !== null) {
      //       this.html = res.data
      //     } else {
      //       this.$Message.error('没有可预览资源')
      //     }
      //   }).catch(err => {
      //     console.log(err)
      //   })
      // this.previewModal = true
      if (this.resource !== null && this.resource !== '') {
        this.$http.get('/preview', {params: {id: this.resource}})
          .then(res => {
            if (res.data.code === 1001) {
              window.open(this.$baseUrl + '/preview?id=' + this.resource)
            } else {
              this.$Message.error(res.data.msg)
            }
          }).catch(err => {
            console.log(err)
          })
      }
    },
    workDownload () {
      this.$http.get('/assignment/tryDownload', {params: {stuId: this.$cookie.get('userId'), expId: this.expId}})
        .then(res => {
          if (res.data.code === 1001) {
            let file = res.data.data
            window.open(this.$baseUrl + '/assignment/download?uuid=' + file)
          } else {
            this.$Message.error(res.data.msg)
          }
        }).catch(err => {
          console.log(err)
        })
    },
    workPreview () {
      this.$http.get('/preview', {params: {id: this.file}})
        .then(res => {
          if (res.data !== null) {
            this.html = res.data
          } else {
            this.$Message.error('没有可预览资源')
          }
        }).catch(err => {
          console.log(err)
        })
      this.previewModal = true
    },
    getDetails () {
      this.$http.get('/getExperimentDetail', {params: {id: this.expId}})
        .then(res => {
          let rdata = res.data.data
          if (res.data.code === 1001) {
            this.$Message.info(res.data.msg)
            this.name = rdata.name
            this.course = rdata.course
            this.teacher = rdata.teacher
            this.deadline = rdata.deadline
            this.peerDeadline = rdata.peerDeadline
            this.details = rdata.details
            this.peerAssessmentRule = rdata.peerAssessmentRule
            this.sourcelist = rdata.sourcelist
            this.resource = rdata.resource
            this.file = rdata.file
            this.status = rdata.status
          } else {
            this.$Message.error(res.data.msg)
          }
        }).catch(err => {
          console.log(err)
        })
    },
    checkHomework () {
      this.$store.commit('setParamsMessage',
        {
          courseId: this.courseId,
          expName: this.name,
          expId: this.expId,
          peerStarted: this.peerStarted,
          enablePeer: this.enablePeer
        })
      this.$router.push(
        {
          name: 'astHomework'
        })
      // sessionStorage.setItem('checkHomework_breadList', JSON.stringify(this.breadlist))
      // sessionStorage.setItem('checkHomework_expID', String(this.expID))
      // sessionStorage.setItem('checkHomework_expName', String(this.name))
      // sessionStorage.setItem('checkHomework_peerStarted', String(this.peerStarted))
      // this.$router.push({
      //   path: '/teacher/homework'
      // })
    }
    // uploadSuccess (response, file, fileList) {
    //   this.$Notice.info({
    //     title: '上传成功',
    //     desc: file.name
    //   })
    // },
    // uploadHandle (file) {
    //   this.upload(file)
    //   return false
    // },
    // upload (file) {
    //   let formData = new FormData()
    //   formData.append('file', file)
    //   formData.append('expId', this.expId)
    //   this.$http.post('/assignment/upload', formData, {
    //     headers: {
    //       'Content-Type': 'application/x-www-form-urlencoded'
    //     }
    //   }).then(res => {
    //     if (res.data.code === 1001) {
    //       this.$Notice.info({
    //         title: '上传成功',
    //         desc: file.name
    //       })
    //       this.getDetails()
    //     } else {
    //       this.$Message.error(res.data.msg)
    //     }
    //   }).catch(err => {
    //     console.log(err)
    //   })
    // }
  }
}
</script>
<style scoped src="../../assets/CommonStyle.css"></style>
<style scoped>
  .content-list-box{
    font-size: large;
  }
  .list-box{
    display: flex;
    flex-wrap: wrap;
  }
  .content-list-box label{
    font-size: large;
    margin: 0 10px 0 5px;
    line-height: 36px;
  }
  .content-list-box span{
    font-size: large;
    font-weight: lighter;
  }
  .list-block-box{
    width: 50%;
  }
  .list-block{
    max-height: 200px;
    min-height: 100px;
    padding: 10px;
    margin-bottom: 10px;
    overflow-y: auto;
  }
  .source-list{
    margin: 7px 20px;
  }
  .source-list span{
    width: 150px;
    font-size: medium;
    display: inline-block;
  }
  .list-button{
    display: flex;
    flex-wrap: wrap;
  }
  .list-button-box{
    margin: 5px;
  }
  .vertical-center-modal{
    display: flex;
    justify-content: center;
  }
  >>> .ivu-modal{
    top: 0;
    overflow: paged-y;
    height: 100vh;
    position: relative;
  }
  .html-box{
    padding: 20px;
    overflow-y: scroll;
  }
</style>
