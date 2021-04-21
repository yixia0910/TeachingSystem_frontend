<template>
  <div>
    <NavBar :breadlist="breadlist">
      <div slot="navbarContent">
        <CardContent>
          <div class="list-box">
            <Row>
              <Col>
                <label>实验名称</label>
                <Span>{{name}}</Span>
              </Col>
            </Row>
            <Row>
              <Col>
                <label>所属课程</label>
                <Span>{{course}}</Span>
              </Col>
            </Row>
            <Row>
              <Col>
                <label>截止时间</label>
                <Span>{{deadline}}</Span>
              </Col>
            </Row>
            <Row>
              <Col>
                <label>互评规则</label>
                <div class="list-block">{{rules}}</div>
              </Col>
            </Row>
<!--            <Row>-->
<!--              <Col>-->
<!--                <label>评分标准</label>-->
<!--                <div class="list-block">{{standard}}</div>-->
<!--              </Col>-->
<!--            </Row>-->
            <Row>
              <Col>
                <label>互评信息</label>
                <Button v-on:click="getTable">刷新</Button>
                <div class="list-table">
                  <Table :columns="column1" :data="peerDetails" size="large" border></Table>
                </div>
              </Col>
            </Row>
          </div>
        </CardContent>
      </div>
    </NavBar>
    <Modal
      title="评分"
      v-model="assessModal"
      :mask-closable="false"
      class="vertical-center-modal">
      <div class="center-modal-box">
        <div>
          <label>分数</label>
          <Span>
            <Input type="number" v-model="score"></Input>
          </Span>
        </div>
        <div>
          <label>理由</label>
          <Span>
            <Input type="textarea" :rows="8" v-model="reason"></Input>
          </Span>
        </div>
      </div>
      <div slot="footer">
        <Button @click="cancel">取消</Button>
        <Button type="primary" @click="submit">提交</Button>
      </div>
    </Modal>
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
export default {
  name: 'expPeer',
  components: {CardContent, NavBar},
  data () {
    return {
      expId: JSON.parse(localStorage.getItem('paramsMessage')).id,
      userId: this.$cookie.get('userId'),
      name: '',
      course: '',
      deadline: '',
      rules: '',
      standard: '',
      assessModal: false,
      score: 0,
      reason: '',
      file: '',
      studentId: '',
      row: '',
      previewModal: false,
      column1: [
        {
          align: 'center',
          title: ' ',
          maxWidth: 120,
          type: 'index',
          indexMethod: row => {
            return '作业' + (row._index + 1).toString()
          }
        },
        {
          title: '状态',
          align: 'center',
          maxWidth: 150,
          key: 'status',
          render: (h, params) => {
            let color = 'error'
            let status = '未评价'
            if (this.peerDetails[params.index].originScore !== '') {
              color = 'success'
              status = '已评价'
            }
            return h('div', [
              h('Tag', {
                props: {
                  color: color
                }
              }, status)
            ])
          }
        },
        {
          title: '分数',
          maxWidth: 150,
          key: 'originScore'
        },
        {
          title: '评分理由',
          key: 'reason',
          tooltip: true
        },
        {
          title: '操作',
          maxWidth: 250,
          align: 'center',
          key: 'opera',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'info'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.workDownload(this.peerDetails[this.row].studentId)
                  }
                }
              }, '下载'),
              // h('Button', {
              //   props: {
              //     type: 'info'
              //   },
              //   style: {
              //     marginRight: '5px'
              //   },
              //   on: {
              //     click: () => {
              //       this.workPreview(params.row.file)
              //     }
              //   }
              // }, '预览'),
              h('Button', {
                props: {
                  type: 'primary'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.assessModal = true
                    this.row = params.index
                    this.studentId = this.peerDetails[this.row].studentId
                  }
                }
              }, '修改')
            ])
          }
        }
      ],
      peerDetails: [],
      // breadlist: [
      //   {name: '实验信息', path: '/student/experiments'},
      //   {name: '互评', path: '/experiment/peer'}
      // ]
      // breadlist: this.$route.params.breadlist
      breadlist: JSON.parse(localStorage.getItem('breadcrumb'))
    }
  },
  mounted () {
    console.log(this.expId)
    this.refreshBreadlist()
    this.getPeerDetails()
  },
  methods: {
    workDownload (stuid) {
      this.$http.get('/assignment/tryDownload', {params: {stuId: stuid, expId: this.expId}})
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
    workPreview (file) {
      this.$http.get('/preview', {params: {id: file}})
        .then(res => {
          if (res.data.code === 1001) {
            window.open(this.$baseUrl + '/preview?id=' + file)
          } else {
            this.$Message.error('无可预览文件')
          }
        }).catch(err => {
          console.log(err)
        })
    },
    refreshBreadlist () {
      if (this.breadlist.length < 3) {
        this.breadlist.push({name: '互评', path: '/experiment/peer'})
      }
    },
    assessment () {
      let req = {
        student_id: this.studentId,
        experiment_id: this.expId,
        reason: this.reason,
        origin_score: this.score
      }
      this.$http.post('/peer/update', req)
        .then(res => {
          if (res.data.code === 1001) {
            // this.peerDetails[this.row].status = true
            // this.peerDetails[this.row].originScore = req.origin_score
            // this.peerDetails[this.row].reason = req.reason
            // this.$Message.success('评分成功')
            this.$Notice.success({
              title: '提交成功',
              desc: '评分修改成功'
            })
            this.getTable()
          } else {
            this.$Message.error(res.data.msg)
          }
        }).catch(err => {
          console.log(err)
        })
    },
    cancel: function () {
      this.assessModal = false
    },
    submit: function () {
      if (this.score >= 0 && this.score <= 100) {
        if (this.score <= 10) {
          this.$Modal.confirm({
            title: '评分确认',
            content: '确认本次互评满分为10分？',
            onOk: () => {
              this.assessment()
              this.score = 0
              this.reason = ''
              this.assessModal = false
            }
          })
        } else {
          this.assessment()
          this.score = 0
          this.reason = ''
          this.assessModal = false
        }
        // this.getTable()
      } else {
        this.$Message.error('不符合要求，请重新评分')
        this.score = 0
      }
    },
    getPeerDetails () {
      this.$http.get('/getExperimentDetail', {params: {id: this.expId}})
        .then(res => {
          let rdata = res.data.data
          if (res.data.code === 1001) {
            this.$Message.info(res.data.msg)
            this.name = rdata.name
            this.course = rdata.course
            this.deadline = rdata.appealDeadline
            this.rules = rdata.peerAssessmentRule
            this.status = rdata.status
          } else {
            this.$Message.error(res.data.msg)
          }
        }).catch(err => {
          console.log(err)
        })
      this.getTable()
    },
    getTable () {
      this.$http.get('/peer/info', {params: {expid: this.expId}})
        .then(res => {
          console.log(res)
          if (res.data.code === 1001) {
            this.peerDetails = res.data.data
            console.log(res.data.data)
            this.$Message.success(res.data.msg)
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

<style scoped>
  .list-box label{
    font-size: large;
    margin: 0 10px 0 5px;
    line-height: 36px;
  }
  .list-box span{
    font-size: large;
    font-weight: lighter;
  }
  .list-table{
    margin: 20px 10px 0 5px;
  }
  .list-block{
    max-height: 200px;
    min-height: 100px;
    padding: 10px;
    margin-bottom: 10px;
    overflow-y: auto;
  }
  .vertical-center-modal{
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .center-modal-box{
    padding: 0 18px 10px 10px;
  }
  .vertical-center-modal label{
    line-height: 30px;
    font-size: medium;
    font-weight: lighter;
  }
</style>
