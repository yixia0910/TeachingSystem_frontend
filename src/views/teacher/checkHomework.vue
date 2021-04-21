<template>
  <div>
    <NavBar :username="this.$cookie.get('username')" infopage='/teacher/info' :breadlist="breadList">
      <div slot="navbarContent">
        <CardContent>
          <SinglePeerDetailModal :showModalPeerDetail.sync="showModalPeerDetail" :stuName="operStuName" :stuID="operStuID" :expID="expID"></SinglePeerDetailModal>
          <GenerateStandardModal :enablePeer="enablePeer" :peerStarted.sync="peerStarted" :showModalGenerateStandard.sync="showModalGenerateStandard" :expID="expID"></GenerateStandardModal>
          <TableComponent v-if="type === false" :loading="loading" @refresh="refreshData" :columnsFromFather="columns1" :allDataFromFather="allData">
            <Button type="primary" @click="exportData">
              <Icon type="md-undo" class="addIcon"/>
              <span style="font-size: 14px">导出分数</span>
            </Button>
            <Button type="success" :loading="downloadAllLoading" @click="downloadAllAssignment">
              <Icon type="md-cloud-download" class="addIcon"/>
              <span style="font-size: 14px">打包下载</span>
            </Button>
            <Button type="info"  @click="showRules">
              <Icon type="md-help" class="addIcon"/>
              <span style="font-size: 14px">评分规则</span>
            </Button>
            <Button type="primary"  @click="setScore">
              <i class="el-icon-edit"></i>
              <span style="font-size: 14px">设置参考分数</span>
            </Button>
            <Row><span>满分：{{score}}</span></Row>
            <Row v-show="score2 > 0"><span>参考分数：{{score2}}</span></Row>
            <Row v-show="score2 > 0"><span>参考分数说明：{{reason}}</span></Row>
          </TableComponent>
          <TableComponent v-if="type === true" :loading="loading" @refresh="refreshData" :columnsFromFather="columns2" :allDataFromFather="allData">
            <!-- <Button type="success">
              <i class="el-icon-upload"></i>
              <span style="font-size: 14px">导入分数</span>
            </Button> -->
            <Button type="primary" @click="exportData">
              <Icon type="md-undo" class="addIcon"/>
              <span style="font-size: 14px">导出分数</span>
            </Button>
            <Button type="info"  @click="showRules">
              <Icon type="md-help" class="addIcon"/>
              <span style="font-size: 14px">评分规则</span>
            </Button>
            <Button type="primary"  @click="setScore">
              <i class="el-icon-edit"></i>
              <span style="font-size: 14px">设置参考分数</span>
            </Button>
            <Row><span>满分：{{score}}</span></Row>
            <Row v-show="score2 > 0"><span>参考分数：{{score2}}</span></Row>
            <Row v-show="score2 > 0"><span>参考分数说明：{{reason}}</span></Row>
          </TableComponent>
          <Table
            :columns="lie"
            :data="zhi"
            ref="myTable"
            hidden
          ></Table>
        </CardContent>
      </div>
    </NavBar>
    <el-dialog title="评分" :visible.sync="dialogFormVisible">
      <el-form :model="form" label-position="top">
        <el-form-item label="成绩" label-width="30px">
          <el-input type="number" v-model="form.score" autocomplete="off"
            oninput = "value=value.replace(/[^\d]/g,'')"
            max="100"
            placeholder="请不要超过最高分"></el-input>
        </el-form-item>
        <el-form-item label="评语" label-width="400px">
          <el-input v-model="form.comment" autocomplete="off" maxlength="30"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="scoreSubmit()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改分数" :visible.sync="dialogFormVisible2">
      是否确认修改评分和评语？
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="scoreSubmit2()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="设置参考分数" :visible.sync="dialogTableVisible">
      <el-table :data="grades">
        <el-table-column property="type" label="类型" width="150"></el-table-column>
        <el-table-column property="grade" label="分数" width="100"></el-table-column>
      </el-table>
      <el-form :model="form2" label-position="top">
        <el-form-item label="参考分数" label-width="30px">
          <el-input type="number" v-model="form2.score" autocomplete="off"
          oninput = "value=value.replace(/[^\d]/g,'')"></el-input>
        </el-form-item>
        <el-form-item label="说明" label-width="400px">
          <el-input v-model="form2.comment" autocomplete="off" maxlength="30"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="scoreSubmit3()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import NavBar from '../../components/NavBar'
import TableComponent from '../../components/TableComponent'
import CardContent from '../../components/CardContent'
import SinglePeerDetailModal from '../../components/teacher/checkHomework/checkHomework_singlePeerDetailModal'
import GenerateStandardModal from '../../components/teacher/checkHomework/checkHomework_generateStandardModal'
// import axios from 'axios'
// import net from '../../assets/Global'
export default {
  name: 'checkHomework',
  components: {
    NavBar,
    TableComponent,
    CardContent,
    SinglePeerDetailModal,
    GenerateStandardModal
  },
  methods: {
    scoreSubmit () {
      this.isMark = 0
      this.dialogFormVisible = false
      for (var i = 0; i < this.allData.length; i++) {
        if (this.allData[i].stuId === this.stuId) {
          if (this.allData[i].score !== '') {
            this.isMark = 1
          }
        }
      }
      if (this.isMark === 1) {
        this.isMark = 0
        this.dialogFormVisible2 = true
        return
      }
      let req = {
        student_id: this.stuId,
        experiment_id: this.expID,
        reason: this.form.comment,
        origin_score: this.form.score,
        score: 0,
        appeal_time: '',
        appeal_reason: '',
        appeal_status: 0
      }
      this.$http.post('/peer/update', req)
        .then(res => {
          if (res.data.code === 1001) {
            this.$Notice.success({
              title: '提交成功',
              desc: '评分成功'
            })
          } else {
            this.$Message.error(res.data.msg)
          }
        }).catch(err => {
          console.log(err)
        })
      this.refreshData()
    },
    scoreSubmit2 () {
      this.dialogFormVisible2 = false
      let req = {
        student_id: this.stuId,
        assessor_id: this.$cookie.get('userId'),
        experiment_id: this.expID,
        reason: this.form.comment,
        origin_score: this.form.score
      }
      this.$http.post('/ChangePeerAssessmentInfo', req)
        .then(res => {
          if (res.data.code === 1001) {
            this.$Notice.success({
              title: '提交成功',
              desc: '修改成功'
            })
          } else {
            this.$Message.error(res.data.msg)
          }
        }).catch(err => {
          console.log(err)
        })
      this.refreshData()
    },
    mark (stuID) {
      this.stuId = stuID
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
    showRules () {
      this.$Modal.info({
        title: '评分规则',
        width: 700,
        content: '<p>1. 未在规定时间内提交作业的原则上按0分处理</p>' +
                 '<p>2. 延期提交作业的原则上满分为正常得分上限的80%</p>' +
                 '<p>3. 若有不得已的情况影响作业提交，请提前报告</p>'
      })
    },
    scoreSubmit3 () {
      this.dialogTableVisible = false
      let formData = new FormData()
      let params = {
        course_id: Number(this.courseID),
        id: Number(this.expID),
        reason: this.form2.comment,
        score2: this.form2.score
      }
      formData.append('course_id', params.course_id)
      formData.append('id', params.id)
      formData.append('reason', params.reason)
      formData.append('score2', params.score2)
      let config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      this.posting = true
      this.$http.post('/teacher/seScore2', formData, config)
        .then(res => {
          this.posting = false
          if (res.data.code === 1001) {
            this.showNoticeSuccess('操作成功')
            // this.clearModal()
          } else {
            this.showNoticeError('操作失败', res.data.msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
      this.refreshData()
    },
    setScore () {
      this.computeScore()
      this.form2.score = ''
      this.score2.comment = ''
      this.dialogTableVisible = true
    },
    downloadAllAssignment () {
      this.downloadAllLoading = true
      this.courseName = sessionStorage.getItem('courseDetail_courseName')
      console.log(this.courseName)
      console.log(this.expName)
      this.$http.get('/teacher/tryDownloadAllAssignment', {
        params: {
          expId: this.expID,
          rename: 2
        }
      }).then(res => {
        this.downloadAllLoading = false
        if (res.data.code === 1001) {
          const uuid = res.data.data
          window.open(this.$baseUrl + '/teacher/downloadAllAssignment?uuid=' + uuid)
        } else {
          this.showNoticeError('打包下载作业失败', res.data.msg)
        }
      }).catch(err => console.log(err))
    },
    getAllPeerInfo () {
      sessionStorage.setItem('peerDetail_breadList', JSON.stringify(this.breadList))
      sessionStorage.setItem('peerDetail_expID', this.expID)
      sessionStorage.setItem('peerDetail_expName', this.expName)
      this.$router.push({
        path: '/teacher/peerDetail'
      })
    },
    refreshData () {
      this.loading = true
      this.getAllData()
      this.getExp()
    },
    exportData () {
      console.log(this.zhi)
      console.log(this.$refs.myTable.columns)
      this.$refs.myTable.exportCsv({
        filename: '分数表',
        original: false,
        columns: this.lie,
        data: this.zhi
      })
    },
    getAllData () {
      this.scores = []
      this.$http.get(this.allDataUrl, {
        params: {
          id: this.expID
        }
      })
        .then(res => {
          if (res.data.code === 1001) {
            this.allData = res.data.data
            console.log(this.allData)
            this.allData.forEach(item => {
              item.downloadLoading = false
              item.previewLoading = false
              this.$http.get('/FindScore', {
                params: {
                  stuid: item.stuId,
                  userid: this.userId,
                  expid: this.expID
                }
              })
                .then(res2 => {
                  if (res2.data.code !== 1001) {
                  } else {
                    if (res2.data.data !== -1) {
                      item.score = res2.data.data
                      this.scores.push(item.score)
                      this.zhi.push({'id': item.stuId, 'name': item.stuName, 'score': item.score})
                    }
                  }
                }).catch(err => {
                  console.log(err)
                })
            })
          } else {
            this.allData = []
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log(err)
        }).then(() => {
          this.loading = false
        })
    },
    computeScore () {
      console.log(this.scores)
      this.grades = []
      var num = 0
      this.scores.forEach(item => {
        if (item > num) {
          num = item
        }
      })
      this.grades.push({'type': '最高分', 'grade': num})
      num = 0
      this.scores.forEach(item => {
        num += item
      })
      num = num / this.scores.length
      num = parseFloat(num).toFixed(0)
      this.grades.push({'type': '平均分', 'grade': num})
    },
    findScore (stuid) {
      var flag = 0
      this.$http.get('/FindScore', {
        params: {
          stuid: stuid,
          userid: this.userId,
          expid: this.expID
        }
      })
        .then(res2 => {
          if (res2.data.code !== 1001) {
            flag = -1
          } else {
            flag = res2.data.data
          }
        }).catch(err => {
          console.log(err)
        })
      return flag
    },
    giveScore () {
      this.form.score = ''
      this.form.comment = ''
      this.dialogFormVisible = true
    },
    getExp () {
      this.$http.get('getExperimentDetail', {
        params: {
          id: this.expID
        }
      }).then(res => {
        let rdata = res.data.data
        console.log(rdata)
        if (res.data.code === 1001) {
          this.score = rdata.score
          this.score2 = rdata.score2
          this.reason = rdata.reason
          this.courseID = rdata.course_id
        }
      }).catch(err => {
        console.log(err)
      })
    }
  },
  mounted () {
    this.userId = this.$cookie.get('userId')
    this.type = sessionStorage.getItem('checkHomework_type') === 'true'
    console.log(this.type)
    this.expID = sessionStorage.getItem('checkHomework_expID')
    this.expName = sessionStorage.getItem('checkHomework_expName')
    this.breadList = JSON.parse(sessionStorage.getItem('checkHomework_breadList'))
    if (this.breadList === null) {
      this.breadList = []
    }
    this.breadList.push({name: '查看' + this.expName + '的分数', path: this.$route.fullPath})
    this.enablePeer = sessionStorage.getItem('checkHomework_enablePeer') === 'True'
    this.peerStarted = sessionStorage.getItem('checkHomework_peerStarted') !== 'False'
    this.loading = true
    this.getAllData()
    this.getExp()
  },
  computed: {
    CardContentTitle: function () {
      return this.expName + '的详情'
    }
  },
  data () {
    return {
      allDataUrl: 'assignment/studentHomework',
      allData: [],
      enablePeer: false,
      lie: [{'title': '学号', 'key': 'id'}, {'title': '姓名', 'key': 'name'}, {'title': '分数', 'key': 'score'}],
      zhi: [],
      type: '',
      courseID: '',
      flag: 0,
      score: 0,
      score2: 0,
      reason: '',
      peerStarted: false,
      showModalPeerDetail: false,
      showModalGenerateStandard: false,
      loading: true,
      downloadAllLoading: false,
      expID: -1,
      stuId: 0,
      userId: 0,
      isMark: 0,
      operStuName: '',
      operStuID: '',
      from: '',
      expName: '',
      breadList: [], // 面包屑
      dialogFormVisible: false,
      dialogFormVisible2: false,
      dialogTableVisible: false,
      form: {
        score: '',
        comment: ''
      },
      form2: {
        score: '',
        comment: ''
      },
      grades: [],
      scores: [],
      scoreWidth: '30px',
      formLabelWidth: '120px',
      columns1: [
        {
          title: '学生学号',
          key: 'stuId',
          sortable: 'custom'
        },
        {
          title: '学生姓名',
          key: 'stuName',
          sortable: 'custom'
        },
        {
          title: '提交状态',
          key: 'homeworkStatus',
          sortable: 'custom'
        },
        {
          title: '提交时间',
          key: 'uploadTime',
          sortable: 'custom'
        },
        {
          title: '当前得分',
          key: 'score',
          sortable: 'custom'
        },
        {
          title: '操作',
          key: 'oper',
          width: 300,
          align: 'center',
          render: (h, params) => {
            let listButton = [
              h('Button', {
                props: {
                  type: 'primary',
                  disabled: params.row.homeworkStatus === '未提交',
                  loading: params.row.downloadLoading
                },
                style: {
                  marginRight: '5px',
                  marginTop: '5px',
                  marginBottom: '5px'
                },
                on: {
                  click: () => {
                    this.$http.get('/assignment/tryDownload?expId=' + this.expID + '&stuId=' + params.row.stuId.toLowerCase())
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
                  }
                }
              }, '下载'),
              h('Button', {
                props: {
                  type: 'primary',
                  disabled: params.row.homeworkStatus === '未提交',
                  loading: params.row.previewLoading
                },
                style: {
                  marginRight: '5px',
                  marginTop: '5px',
                  marginBottom: '5px'
                },
                on: {
                  click: () => {
                    window.open(this.$baseUrl + '/preview?id=' + String(params.row.fileID))
                  }
                }
              }, '预览'),
              h('Button', {
                props: {
                  type: 'primary',
                  loading: params.row.previewLoading
                },
                style: {
                  marginRight: '5px',
                  marginTop: '5px',
                  marginBottom: '5px'
                },
                on: {
                  click: () => {
                    this.giveScore()
                    this.form.score = ''
                    this.form.comment = ''
                    this.stuId = params.row.stuId.toLowerCase()
                    console.log('id' + this.stuId)
                  }
                }
              }, '评分')
            ]
            return h('div', listButton)
          }
        }
      ],
      columns2: [
        {
          title: '学生学号',
          key: 'stuId',
          sortable: 'custom'
        },
        {
          title: '学生姓名',
          key: 'stuName',
          sortable: 'custom'
        },
        {
          title: '当前得分',
          key: 'score',
          sortable: 'custom'
        },
        {
          title: '操作',
          key: 'oper',
          width: 300,
          align: 'center',
          render: (h, params) => {
            let listButton = [
              h('Button', {
                props: {
                  type: 'primary',
                  loading: params.row.previewLoading
                },
                style: {
                  marginRight: '5px',
                  marginTop: '5px',
                  marginBottom: '5px'
                },
                on: {
                  click: () => {
                    this.dialogFormVisible = true
                    this.form.score = ''
                    this.form.comment = ''
                    this.stuId = params.row.stuId.toLowerCase()
                    console.log('id' + this.stuId)
                  }
                }
              }, '评分')
            ]
            return h('div', listButton)
          }
        }
      ]
    }
  }
}
</script>

<style scoped>
  .addIcon{
    padding-right:5px;
    padding-bottom: 3px;
  }
</style>
