<template>
  <div>
    <NavBar :breadlist="breadlist">
      <div slot="navbarContent">
        <CardContent>
          <TableComponent @refresh="refreshData" :columnsFromFather="columns1" :allDataFromFather="allData">
            <Button type="primary" :disabled="!enablePeer || !peerStarted" @click="getAllPeerInfo">
              <!--            <Button type="primary" @click="getAllPeerInfo">-->
              <Icon type="md-search" class="addIcon"/>
              <span style="font-size: 14px">互评详情</span>
            </Button>
            <Button type="primary" :disabled="!enablePeer || !peerStarted" @click="exportData">
              <!--            <Button type="primary" @click="exportPeerScore">-->
              <Icon type="md-undo" class="addIcon"/>
              <span style="font-size: 14px">导出互评分</span>
            </Button>
            <Button type="primary" :disabled="!enablePeer" @click="showModalGenerateStandard = true">
              <Icon type="md-calculator" class="addIcon"/>
              <span style="font-size: 14px">标准作业</span>
            </Button>
            <Button type="success" :loading="downloadAllLoading" @click="downloadAllAssignment">
              <Icon type="md-cloud-download" class="addIcon"/>
              <span style="font-size: 14px">打包下载</span>
            </Button>
            <Button type="info"  @click="showPeerRules" v-if="enablePeer">
              <Icon type="md-help" class="addIcon"/>
              <span style="font-size: 14px">互评规则</span>
            </Button>
            <span style="margin-left:10px;font-size: 16px;font-weight:bold" v-if="enablePeer && peerStarted">
              互评已开始
            </span>
            <span style="margin-left:10px;font-size: 16px;font-weight:bold" v-else-if="enablePeer && !peerStarted">
              互评未开始
            </span>
            <span style="margin-left:10px;font-size: 16px;font-weight:bold" v-else>
              未开启互评
            </span>
          </TableComponent>
          <Table
            :columns="lie"
            :data="zhi"
            ref="myTable"
            hidden
          ></Table>
          <SinglePeerDetailModal :showModalPeerDetail.sync="showModalPeerDetail" :stuName="operStuName" :stuID="operStuID" :expID="expId"></SinglePeerDetailModal>
          <GenerateStandardModal :enablePeer="enablePeer" :peerStarted.sync="peerStarted" :showModalGenerateStandard.sync="showModalGenerateStandard" :expID="expId"></GenerateStandardModal>
        </CardContent>
      </div>
    </NavBar>
  </div>
</template>

<script>
import NavBar from '../../components/NavBar'
import CardContent from '../../components/CardContent'
import TableComponent from '../../components/TableComponent'
import GenerateStandardModal from '../../components/teacher/checkHomework/checkHomework_generateStandardModal'
import SinglePeerDetailModal from '../../components/teacher/checkHomework/checkHomework_singlePeerDetailModal'
// import axios from 'axios'
// import net from '../../assets/Global'
export default {
  name: 'checkHomework',
  components: {GenerateStandardModal, SinglePeerDetailModal, TableComponent, CardContent, NavBar},
  data () {
    return {
      breadlist: [
        {name: '课程管理', path: '/assistant/courseManagement'},
        {name: '实验', path: '/assistant/courseDetails'},
        // {name: '实验详情', path: '/assistant/expDetails'},
        {name: '提交情况', path: '/assistant/homework'}
      ],
      allData: [],
      allDataUrl: 'assignment/studentHomework',
      enablePeer: JSON.parse(localStorage.getItem('paramsMessage')).enablePeer,
      peerStarted: JSON.parse(localStorage.getItem('paramsMessage')).peerStarted,
      showModalPeerDetail: false,
      lie: [{'title': '学号', 'key': 'id'}, {'title': '姓名', 'key': 'name'}, {'title': '分数', 'key': 'score'}],
      zhi: [],
      showModalGenerateStandard: false,
      downloadAllLoading: false,
      courseId: JSON.parse(localStorage.getItem('paramsMessage')).courseId,
      expId: Number(JSON.parse(localStorage.getItem('paramsMessage')).expId),
      operStuName: '',
      operStuID: '',
      from: '',
      expName: JSON.parse(localStorage.getItem('paramsMessage')).expName,
      columns1: [
        {
          title: '学生学号',
          key: 'stuId'
        },
        {
          title: '学生姓名',
          key: 'stuName'
        },
        {
          title: '提交状态',
          key: 'homeworkStatus'
        },
        {
          title: '提交时间',
          key: 'uploadTime'
        },
        {
          title: '当前得分',
          key: 'score'
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
                    console.log(params.row.stuId)
                    console.log(this.expID)
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
                    /* axios.get(net.neturl + '/tryDownload?stuId="' + params.row.stuId + '"&expId=' + this.expID + '&type=1')
                      .then(res => {
                        if (res.data.code === 1001) {
                          let file = res.data.data
                          window.open(net.neturl + '/downloadViaNetdisk?' + 'type=1&' + 'uuid=' + file)
                        } else {
                          this.$Message.error(res.data.msg)
                        }
                      }).catch(err => {
                        console.log(err)
                      }) */
                  }
                }
              }, '下载')
              // h('Button', {
              //   props: {
              //     type: 'primary',
              //     disabled: params.row.homeworkStatus === '未提交',
              //     loading: params.row.previewLoading
              //   },
              //   style: {
              //     marginRight: '5px',
              //     marginTop: '5px',
              //     marginBottom: '5px'
              //   },
              //   on: {
              //     click: () => {
              //       window.open(this.$baseUrl + '/preview?id=' + String(params.row.fileID))
              //     }
              //   }
              // }, '预览')
            ]
            if (this.enablePeer && this.peerStarted) {
              listButton.push(
                h('Button', {
                  props: {
                    type: 'info',
                    disabled: params.row.homeworkStatus === '未提交'
                  },
                  style: {
                    marginRight: '5px',
                    marginTop: '5px',
                    marginBottom: '5px'
                  },
                  on: {
                    click: () => {
                      this.showModalPeerDetail = true
                      this.operStuID = params.row.stuId
                      this.operStuName = params.row.stuName
                    }
                  }
                }, '查看互评'))
            }
            return h('div', listButton)
          }
        }
      ]
    }
  },
  methods: {
    showPeerRules () {
      this.$Modal.info({
        title: '互评流程',
        width: 700,
        content: '<p>1. 在 <strong>标准作业</strong> 中获取6份标准作业并为标准作业评分</p>' +
          '<p>2. 标准作业全部被评分后可点击 <strong>标准作业</strong> 中的 <strong>开启互评</strong> 按钮，此后不能再修改标准作业的评分</p>' +
          '<p>3. 在 <strong>互评详情</strong> 中查看本次互评的全部信息，对于申诉的作业可以修改其评分</p>' +
          '<p>4. 点击 <strong>导出互评分</strong> 按钮，根据互评和申诉结果，生成所有作业的最终得分</p>'
      })
    },
    // exportPeerScore () {
    //   let postparams = {
    //     expid: this.expId
    //   }
    //   this.$http.post('teacher/exportPeerScore', postparams)
    //     .then(res => {
    //       // if (res.data.code === 1001) {
    //       //   this.showNoticeSuccess('成功结算互评分数')
    //       // } else {
    //       //   this.showNoticeError('结算互评分数失败', res.data.msg)
    //       // }
    //     })
    //     .catch(err => {
    //       console.log(err)
    //     })
    // },
    downloadAllAssignment () {
      this.downloadAllLoading = true
      this.courseName = sessionStorage.getItem('courseDetail_courseName')
      this.expID = Number(sessionStorage.getItem('checkHomework_expID'))
      this.expName = sessionStorage.getItem('checkHomework_expName')
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
      /* axios.get(net.neturl + '/tryDownloadAll', {
        params: {
          expName: this.expName,
          courseName: this.courseName
        }
      })
        .then(res => {
          this.downloadAllLoading = false
          if (res.data.code === 1001) {
            uuid = res.data.data
            window.open(net.neturl + '/downloadExpZipFile?uuid=' + uuid + '&expName=' + this.expName)
          } else {
            this.showNoticeError('打包下载作业失败', res.data.msg)
          }
        })
        .catch(err => {
          console.log(err)
        }) */
    },
    getAllPeerInfo () {
      // sessionStorage.setItem('peerDetail_breadList', JSON.stringify(this.breadList))
      // sessionStorage.setItem('peerDetail_expID', this.expID)
      // sessionStorage.setItem('peerDetail_expName', this.expName)
      // this.$router.push({
      //   path: '/teacher/peerDetail'
      // })
      this.$store.commit('setParamsMessage',
        {
          courseId: this.courseId,
          expName: this.expName,
          expId: this.expId,
          enablePeer: this.enablePeer,
          peerStarted: this.peerStarted
        })
      this.$router.push(
        {
          name: 'astPeerDetails'
        })
    },
    refreshData () {
      this.getAllData()
    },
    exportData () {
      console.log(this.lie)
      console.log(this.$refs.myTable.columns)
      this.$refs.myTable.exportCsv({
        filename: '互评分数表',
        original: false,
        columns: this.lie,
        data: this.zhi
      })
    },
    getAllData () {
      this.$http.get(this.allDataUrl, {
        params: {
          id: this.expId
        }
      })
        .then(res => {
          if (res.data.code === 1001) {
            this.allData = res.data.data
            this.allData.forEach(item => {
              item.downloadLoading = false
              item.previewLoading = false
            })
          } else {
            this.allData = []
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
    }
  },
  mounted () {
    this.expID = Number(sessionStorage.getItem('checkHomework_expID'))
    // this.expID = Number(sessionStorage.getItem('checkHomework_expID'))
    this.expName = sessionStorage.getItem('checkHomework_expName')
    // this.enablePeer = sessionStorage.getItem('checkHomework_enablePeer') === 'True'
    // this.peerStarted = sessionStorage.getItem('checkHomework_peerStarted') !== 'False'
    this.getAllData()
    let postparams = {
      expid: this.expID
    }
    this.$http.post('teacher/exportPeerScore', postparams)
      .then(res => {
        if (res.data.code === 1001) {
          this.zhi = res.data.data
          console.log(this.zhi)
        }
      })
      .catch(err => {
        console.log(err)
      })
  }
}
</script>

<style scoped>

</style>
