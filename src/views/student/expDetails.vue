<template>
  <div>
    <NavBar :breadlist="breadlist">
      <div slot="navbarContent">
        <CardContent>
          <div class="top-area" v-show="type === false">
            <div class="upload-area">
              <div style="align-items: center">
                <div style="display: inline-block; margin-left: 5vw; text-align: center; top: 50%">
                  <div style="color: #9B9B9B;">作业提交状态</div>
                  <div class="status">{{status}}</div>
                </div>
                <div class="hw-button-area">
                  <div class="list-button" v-if="this.status==='已提交'">
                    <div class="list-button-box">
                      <Button @click="workDownload">
                        <Icon type="md-download"></Icon>
                        下载
                      </Button>
                    </div>
                    <div class="list-button-box">
                      <Button @click="workPreview">
                        <Icon type="md-download"></Icon>
                        预览
                      </Button>
                    </div>
                    <div class="list-button-box">
                      <Upload :on-success="uploadSuccess" :before-upload="uploadHandle">
                        <Button :loading="uploadLoading">
                          <Icon type="md-share"></Icon>
                          重新上传
                        </Button>
                      </Upload>
                    </div>
                  </div>
                  <ButtonGroup v-else>
                    <Upload :on-success="uploadSuccess" :before-upload="uploadHandle">
                      <Button :loading="uploadLoading">
                        <Icon type="md-share"></Icon>
                        上传作业
                      </Button>
                    </Upload>
                  </ButtonGroup>
                </div>
              </div>
            </div>
          </div>
          <div id="space-line" style="height: 3vh"></div>
          <div style="width: 100%">
            <div class="time-area">
              <div class="time-item">
                <div class="time-title">开始时间&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
                <div class="time">{{startTime}}</div>
              </div>
              <div class="time-item">
                <div class="time-title">结束时间&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
                <div class="time">{{endTime}}</div>
              </div>
              <div class="time-item" v-show="type === false">
                <div class="time-title">提交截止时间</div>
                <div class="time">{{deadline}}</div>
              </div>
            </div>
            <div class="basic-info">
              <div class="area_title">
                <div class="small_block"></div>
                基本信息
              </div>
              <label class="basic-info-item" v-if="type === false">作业名称</label>
              <label class="basic-info-item" v-if="type === true">考试名称</label>
              <Span class="basic-info-item-content">{{name}}</Span><br>
              <label class="basic-info-item">所属课程</label>
              <Span class="basic-info-item-content">{{course}}</Span><br>
              <label class="basic-info-item">指导教师</label>
              <Span class="basic-info-item-content">{{teacher}}</Span><br>
              <label class="basic-info-item">满分&nbsp;&nbsp;&nbsp;&nbsp;</label>
              <Span class="basic-info-item-content">{{score}}</Span>

            </div>
          </div>
          <Row></Row>
          <Row>
            <div>
              <div class="area_title">
                <div class="small_block"></div>
                详细说明
              </div>
              <div class="list-block">{{details}}</div>
            </div>
          </Row>
            <Row>
              <div class="area_title">
                <div class="small_block"></div>
                  参考资源
              </div>
              <div class="file-name" v-if="this.resource !== 'null'">{{resource}}
              <ButtonGroup style="margin-left: 10px" v-if="this.resource !== 'null'">
                <Button @click="resourceDownload">
                  <Icon type="md-download"></Icon>
                    下载
                </Button>
              </ButtonGroup></div>
              <Span v-else>无</Span>
            </Row>
            <Row>
              <div>
                <div class="area_title">
                <div class="small_block"></div>
                成绩
              </div>
              <label class="basic-info-item">得分</label>
              <Span class="basic-info-item-content">{{grade}}</Span><br>
              <label class="basic-info-item">评价</label>
              <Span class="basic-info-item-content">{{comment}}</Span>
              </div>
            </Row>
        </CardContent>
      </div>
    </NavBar>
    <Modal
      title="预览"
      v-model="previewModal"
      width="50%"
      :footer-hide="true"
      class="vertical-center-modal">
      <div v-html="html" class="html-box">
      </div>
    </Modal>
  </div>
</template>

<script>
import NavBar from '../../components/NavBar'
import CardContent from '../../components/CardContent'
// import axios from 'axios'
// eslint-disable-next-line no-unused-vars
import net from '../../assets/Global'

export default {
  name: 'expDetails',
  components: {CardContent, NavBar},
  data () {
    return {
      grade: '',
      comment: '',
      name: '',
      type: '',
      score: '',
      stuId: '',
      course: '',
      teacher: '',
      teacher_id: '',
      deadline: '',
      token: '',
      startTime: '',
      endTime: '',
      peerDeadline: '',
      appealDeadline: '',
      aims: '',
      details: '',
      neturl: '',
      status: '',
      resource: '',
      html: null,
      sourcelist: [],
      previewModal: false,
      file: '',
      expId: JSON.parse(localStorage.getItem('paramsMessage')).id,
      peerStarted: false,
      uploadLoading: false,
      // breadlist: this.$route.params.breadlist
      courseId: JSON.parse(localStorage.getItem('paramsMessage')).courseId,
      breadlist: JSON.parse(localStorage.getItem('breadcrumb'))
    }
  },
  // created () {
  //   let list = [
  //     {name: '实验信息', path: '/student/experiment'},
  //     {name: this.$route.params.name, path: '/experiment/details'}
  //   ]
  //   this.$store.commit('changeBreadcrumb', list)
  // },
  beforeMount () {
    this.stuId = this.$cookie.get('userId')
    this.token = this.$cookie.get('token')
  },
  mounted () {
    this.refreshBreadlist()
    this.getDetails()
    console.log(this.resource)
  },
  methods: {
    resourceDownload () {
      if (this.resource !== null && this.resource !== '') {
        window.open(this.$baseUrl + '/downloadExpResource?expId=' + this.expId)
      }
    },
    resourcePreview () {
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
      this.stuId = this.$cookie.get('userId')
      this.token = this.$cookie.get('token')
      this.$http.get('/assignment/tryDownload?expId=' + this.expId + '&stuId=' + this.stuId.toLowerCase())
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
      this.$http.get('assignment/studentHomework', {
        params: {
          id: this.expId
        }
      })
        .then(res => {
          if (res.data.code === 1001) {
            res.data.data.forEach(each => {
              if (String(each.stuId) === String(this.stuId)) {
                this.file = each.fileID
              }
            })
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log(err)
        }).then(() => {
          this.loading = false
        })
      window.open(this.$baseUrl + '/preview?id=' + String(this.file))
    },
    getDetails () {
      console.log('3333')
      this.$http.get('/getExperimentDetail', {params: {id: this.expId}})
        .then(res => {
          let rdata = res.data.data
          if (res.data.code === 1001) {
            console.log(rdata)
            // this.$Message.info(res.data.msg)
            // rdata.status = 1
            this.name = rdata.name
            this.course = rdata.course
            this.type = rdata.type
            this.score = rdata.score
            this.teacher = rdata.teacher
            this.teacher_id = rdata.teacher_id
            this.startTime = rdata.startTime
            this.endTime = rdata.endTime
            this.deadline = rdata.deadline
            this.peerDeadline = rdata.peerDeadline
            this.appealDeadline = rdata.appealDeadline
            this.details = rdata.details
            this.sourcelist = rdata.sourcelist
            this.resource = rdata.resource
            this.file = rdata.file
            this.status = rdata.status === '0' ? '未提交' : '已提交'
            this.peerStarted = rdata.peerStarted
            this.$http.get('/FindScore', {
              params: {
                stuid: this.stuId,
                userid: this.teacher_id,
                expid: this.expId
              }
            })
              .then(res2 => {
                if (res2.data.code !== 1001) {
                } else {
                  if (res2.data.data !== -1) {
                    this.grade = res2.data.data
                    console.log(this.grade)
                  }
                }
              }).catch(err => {
                console.log(err)
              })
          } else {
            this.$Message.error(res.data.msg)
          }
          this.$http.get('/FindComment', {
            params: {
              stuid: this.stuId,
              userid: this.teacher_id,
              expid: this.expId
            }
          })
            .then(res2 => {
              if (res2.data.code !== 1001) {
              } else {
                if (res2.data.data !== -1) {
                  this.comment = res2.data.data
                }
              }
            }).catch(err => {
              console.log(err)
            })
        }).catch(err => {
          console.log(err)
        })
    },
    getGrade () {
      this.$http.get('/FindScore', {
        params: {
          stuid: this.stuId,
          userid: this.teacher_id,
          expid: this.expID
        }
      })
        .then(res2 => {
          if (res2.data.code !== 1001) {
          } else {
            if (res2.data.data !== -1) {
              this.grade = res2.data.data
            }
          }
        }).catch(err => {
          console.log(err)
        })
    },
    getComment () {
      this.$http.get('/FindComment', {
        params: {
          stuid: this.stuId,
          userid: this.teacher_id,
          expid: this.expID
        }
      })
        .then(res2 => {
          if (res2.data.code !== 1001) {
          } else {
            if (res2.data.data !== -1) {
              this.grade = res2.data.data
            }
          }
        }).catch(err => {
          console.log(err)
        })
    },
    refreshBreadlist () {
      console.log('1111')
      let last = this.breadlist.pop()
      if (last.path !== '/experiment/details') {
        this.breadlist.push(last)
        this.breadlist.push({name: '详情', path: '/experiment/details'})
      } else {
        this.breadlist.push(last)
      }
    },
    uploadSuccess (response, file, fileList) {
      // this.$Notice.info({
      //   title: '上传成功',
      //   desc: file.name
      // })
    },
    uploadHandle (file) {
      this.upload(file)
      return false
    },
    upload: function (file) {
      this.uploadLoading = true
      let formData = new FormData()
      let isUpload = false
      this.token = this.$cookie.get('token')
      formData.append('file', file)
      formData.append('expId', this.expId)
      this.$http.post('/assignment/upload', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': this.token
        }
      }).then(res => {
        if (res.data.code === 1001) {
          isUpload = true
          console.log(isUpload)
          this.$Notice.info({
            title: '上传成功',
            desc: file.name
          })
          this.uploadLoading = false
          this.getDetails()
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    }
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
    max-height: 45vh;
    min-height: 100px;
    padding: 10px;
    margin-bottom: 10px;
    overflow-y: auto;
    white-space: pre;
    border:1px solid rgba(0, 0, 0, 0.1);
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
    display: inline-block;
    flex-wrap: wrap;

  }
  .list-button-box{
    margin: 5px;
    display: inline-block;
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
  .top-area{
    background-color: #F4F6F8;
    height: 10vh;
  }
  .upload-area{
    width: 100vw;
    align-content: center;
    align-items: center;
    display: inline-block;
    margin-top: 3vh;
  }
  .peer-area{
    display: inline-block;
    margin-left: 1vw;
  }
  .hw-button-area{
    z-index: 99999;
    display: inline-block !important;
    width: 60vw;
    position: absolute;
    margin-left: 2vw;
    margin-top: 1vh;
  }
  .time-area{
    background-color: #F4F6F8;
    width: 30vw;
    height: 10vh;
    float: left;
  }
  .status{
    font-size: 20px;
    font-weight: bolder;
    color: #4A4A4A;
  }
  .time-item{
    background-color: #F4F6F8;
  }
  .basic-info{
    width: 40vw;
    float: right;
    margin-top: -20px;
    margin-left: 5vw;

  }
  .small_block{
    background-color: #23ABFF;
    height: 12px;
    width: 4px;
    vertical-align: center;
    float: left;
    margin-top: 14px;
    margin-left: 14px;
    margin-right: 14px;
  }
  .area_title{
    color: #4A4A4A;
    vertical-align: center;
    line-height: 40px;
    font-size: 14px;
    font-weight: 600;
    background-color: #EFF8FF;
    height: 40px;
    margin-bottom: 20px;
    margin-top: 20px;
  }
  .time-title{
    color: #9B9B9B;
    font-size: 16px;
    font-weight: 400;
    display: inline-block;
    line-height: 30px;
    margin-left: 2vw;
  }
  .time{
    display: inline-block;
    font-size: 16px;
    font-weight: 400;
    margin-left: 20px;
  }
  .basic-info-item{
    color: #4A4A4A;
    font-size: 16px;
    line-height: 30px;
  }
  .basic-info-item-content{
    color: #000000;
    font-size: 16px;
    margin: 20px;
  }
  .file-name{
    color: #4A4A4A;
  }
</style>
