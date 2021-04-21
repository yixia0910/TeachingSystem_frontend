<template>
  <div>
    <NavBar :breadlist="breadlist">
      <div slot="navbarContent">
        <CardContent>
          <TableComponent @refresh="refreshData" ref="table" :columnsFromFather="columns1" :allDataFromFather="allData">
            <Button type="info" @click="showModalAddExperiment = true">
              <Icon type="md-add-circle" class="addIcon"/>
              <span style="font-size: 14px">新增实验</span>
            </Button>
            <Button type="info" style="margin-left:5px;" @click="showModalAddHomework = true">
              <Icon type="md-add-circle" class="addIcon"/>
              <span style="font-size: 14px">新增作业</span>
            </Button>
          </TableComponent>
          <AddHomeworkModal @refresh="refreshData" :showModalAddHomework.sync="showModalAddHomework" :selectCourseID="courseId" :selectCourseName="courseName"></AddHomeworkModal>
          <AddExperimentModal @refresh="refreshData" :showModalAddExperiment.sync="showModalAddExperiment" :selectCourseID="courseId" :selectCourseName="courseName"></AddExperimentModal>
          <ChangeWorkingModal @refresh="refreshData" :showModalChangeWorking.sync="showModalChangeWorking" :workingParam="operWorkingParam" :selectCourseName="courseName"></ChangeWorkingModal>
          <AddVMModal :showModalAddVM.sync="showModalAddVM" :expID="operExpID" :expName="operExpName"></AddVMModal>
          <DeleteExpModal @refresh="refreshData" :showModalDeleteExp.sync="showModalDeleteExp" :expID="operExpID" :expName="operExpName" :expType="operExpType"></DeleteExpModal>
        </CardContent>
      </div>
    </NavBar>
    <Modal
      :title="name"
      v-model="infoModal"
      :mask-closable="false"
      class="vertical-center-modal">
      <div class="content-list-box">
        <div class="list-box">
<!--          <div class="list-block-box">-->
<!--            <label>实验名称</label>-->
<!--            <Span>{{name}}</Span>-->
<!--          </div>-->
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
          </Col>
          <Col span="10">
            <ButtonGroup size="small" v-if="resource !== null && resource!== ''">
              <Button @click="resourceDownload">
                <Icon type="md-download"></Icon>
                下载
              </Button>
              <Button @click="resourcePreview">
                <Icon type="md-arrow-down"></Icon>
                预览
              </Button>
            </ButtonGroup>
            <Span v-else>无</Span>
          </Col>
        </Row>
        <Row>
          <Col>
            <label>作业提交状态</label>
            <Span>{{status}}</Span>
          </Col>
<!--          <Col offset="2" span="10">-->
<!--            <Button @click="checkHomework">-->
<!--              <Icon type="md-search"></Icon>-->
<!--              查看作业-->
<!--            </Button>-->
<!--          </Col>-->
        </Row>
      </div>
      <div slot="footer">
        <Button type="primary" @click="infoModal=false">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import NavBar from '../../components/NavBar'
import CardContent from '../../components/CardContent'
import TableComponent from '../../components/TableComponent'
import AddHomeworkModal from '../../components/teacher/course/course_addHomeworkModal'
import AddExperimentModal from '../../components/teacher/course/course_addExperimentModal'
import ChangeWorkingModal from '../../components/teacher/courseDetail/courseDetail_changeWorkingModal'
import AddVMModal from '../../components/teacher/vm/vm_addVMModal'
import DeleteExpModal from '../../components/teacher/courseDetail/courseDetail_deleteExpModal'
// import axios from 'axios'
// import net from '../../assets/Global'
export default {
  name: 'courseDetails',
  components: {
    DeleteExpModal,
    AddVMModal,
    ChangeWorkingModal,
    AddExperimentModal,
    AddHomeworkModal,
    TableComponent,
    CardContent,
    NavBar
  },
  data () {
    return {
      // breadlist: JSON.parse(localStorage.getItem('breadcrumb')),
      breadlist: [
        {name: '课程管理', path: '/assistant/courseManagement'},
        {name: '实验', path: '/assistant/courseDetails'}],
      courseName: JSON.parse(localStorage.getItem('paramsMessage')).courseName,
      courseId: JSON.parse(localStorage.getItem('paramsMessage')).courseId,
      operExpName: '',
      operExpID: -1,
      operExpType: '',
      loading: true,
      highLightRow: true,
      showModalAddVM: false,
      showModalChangeWorking: false,
      showModalDeleteExp: false,
      breadList: [], // 面包屑
      showModalAddHomework: false,
      showModalAddExperiment: false,
      operWorkingParam: {},
      allData: [],
      name: '',
      course: '',
      teacher: '',
      startTime: '',
      endTime: '',
      deadline: '',
      peerDeadline: '',
      appealDeadline: '',
      peerAssessmentRule: '',
      details: '',
      status: '',
      resource: '',
      previewModal: false,
      infoModal: false,
      columns1: [
        {
          // 仅使用type:index可以达到显示行号的目的，但是将TableComponent组件中的item转为对象后发现index并不在属性中，做搜索时不太方便
          // 如果希望表格显示序号，请务必把序号这一列的key命名为index，如果有这一列则搜索的时候会搜索序号，没有就不搜索
          title: '序号',
          key: 'index'
        },
        {
          title: '名称',
          key: 'name'
        },
        {
          title: '类型',
          key: 'type'
        },
        {
          title: '开始时间',
          key: 'start_time'
        },
        {
          title: '结束时间',
          key: 'end_time'
        },
        {
          title: '作业截止时间',
          key: 'deadline'
        },
        {
          title: '作业提交情况',
          key: 'assignment'
        },
        {
          title: '互评情况',
          key: 'peerAssessment'
        },
        {
          title: '实验虚拟机',
          key: 'vms'
        },
        {
          title: '操作',
          key: 'oper',
          width: 350,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'info',
                  disabled: params.row.vms === '已删除'
                },
                style: {
                  marginRight: '5px',
                  marginTop: '4px',
                  marginBottom: '4px',
                  marginLeft: '5px',
                  border: '1px solid #50D6A3',
                  color: '#50D6A3'
                },
                on: {
                  click: () => {
                    this.operExpID = Number(params.row.id)
                    this.operExpName = params.row.name
                    // this.operExpApplyId = params.row.vm_apply_id
                    // this.operExpVmName = params.row.vm_name
                    this.showModalAddVM = true
                  }
                }
              }, '申请虚拟机'),
              h('Button', {
                props: {
                  type: 'info'
                },
                style: {
                  marginRight: '5px',
                  marginTop: '4px',
                  marginBottom: '4px'
                },
                on: {
                  click: () => {
                    // this.$store.commit('setParamsMessage',
                    //   {
                    //     courseId: this.courseId,
                    //     expName: params.row.name,
                    //     expId: params.row.id,
                    //     expType: params.row.type,
                    //     peerStarted: params.row.peerStarted,
                    //     enablePeer: params.row.is_peer_assessment
                    //     // startTime: params.row.start_time,
                    //     // endTime: params.row.end_time
                    //   })
                    // this.$router.push(
                    //   {
                    //     name: 'astExpDetails'
                    //   })
                    this.status = params.row.assignment
                    this.expId = params.row.id
                    this.operExpID = Number(params.row.id)
                    this.getDetails(params.row.id)
                    // sessionStorage.setItem('expDetail_breadList', JSON.stringify(this.breadList))
                    // sessionStorage.setItem('expDetail_expName', params.row.name)
                    // sessionStorage.setItem('expDetail_expType', params.row.type)
                    // sessionStorage.setItem('expDetail_expStartTime', params.row.start_time)
                    // sessionStorage.setItem('expDetail_expEndTime', params.row.end_time)
                    // this.$router.push({
                    //   path: '/teacher/expDetail'
                    // })
                  }
                }
              }, '详情'),
              h('Button', {
                props: {
                  type: 'info'
                },
                style: {
                  marginRight: '5px',
                  marginTop: '4px',
                  marginBottom: '4px'
                },
                on: {
                  click: () => {
                    this.operWorkingParam = params.row
                    this.showModalChangeWorking = true
                  }
                }
              }, '修改'),
              h('Button', {
                props: {
                  type: 'error'
                },
                style: {
                  marginRight: '5px',
                  marginTop: '4px',
                  marginBottom: '4px'
                },
                on: {
                  click: () => {
                    this.showModalDeleteExp = true
                    this.operExpName = params.row.name
                    this.operExpID = Number(params.row.id)
                    this.operExpType = params.row.type
                  }
                }
              }, '删除'),
              h('Button', {
                props: {
                  type: 'info',
                  disabled: params.row.vms === '已删除' || params.row.vms === '无'
                },
                style: {
                  marginRight: '5px',
                  marginTop: '4px',
                  marginBottom: '4px'
                },
                on: {
                  click: () => {
                    sessionStorage.setItem('experimentalVM_fromBreadList', JSON.stringify(this.breadList))
                    sessionStorage.setItem('experimentalVM_expID', String(params.row.id))
                    sessionStorage.setItem('experimentalVM_expName', String(params.row.name))
                    sessionStorage.setItem('experimentalVM_expType', String(params.row.type))
                    sessionStorage.setItem('experimentalVM_VmName', String(params.row.vm_name))
                    sessionStorage.setItem('experimentalVM_defaultVMPWD', String(params.row.vm_passwd))
                    this.$router.push(
                      {
                        name: 'astExpVM'
                      })
                  }
                }
              }, '实验虚拟机管理'),
              h('Button', {
                props: {
                  type: 'info'
                },
                style: {
                  marginRight: '5px',
                  marginTop: '4px',
                  marginBottom: '4px'
                },
                on: {
                  click: () => {
                    sessionStorage.setItem('checkHomework_breadList', JSON.stringify(this.breadList))
                    sessionStorage.setItem('checkHomework_expID', String(params.row.id))
                    sessionStorage.setItem('checkHomework_expName', String(params.row.name))
                    console.log(String(params.row.name))
                    sessionStorage.setItem('checkHomework_enablePeer', String(params.row.is_peer_assessment))
                    sessionStorage.setItem('checkHomework_peerStarted', String(params.row.peerStarted))
                    this.$store.commit('setParamsMessage',
                      {
                        courseId: this.courseId,
                        expName: params.row.name,
                        expId: params.row.id,
                        peerStarted: params.row.peerStarted === 'True',
                        enablePeer: params.row.is_peer_assessment === 'True'
                      })
                    this.$router.push(
                      {
                        name: 'astHomework'
                      })
                    // this.$router.push({
                    //   path: '/teacher/homework'
                    // })
                  }
                }
              }, '查看作业')
            ])
          }
        }
      ]
    }
  },
  mounted () {
    this.getAllData()
  },
  methods: {
    getDetails (expId) {
      this.$http.get('/getExperimentDetail', {params: {id: expId}})
        .then(res => {
          let rdata = res.data.data
          if (res.data.code === 1001) {
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
            // this.status = rdata.status
            this.infoModal = true
            this.modalExpID = expId
          } else {
            this.$Message.error(res.data.msg)
          }
        }).catch(err => {
          console.log(err)
        })
    },
    refreshData () {
      this.getAllData()
    },
    getAllData () {
      if (this.courseId === '') { return }
      sessionStorage.setItem('courseDetail_courseID', this.courseId)
      this.$http.get('/teacher/getExperiment', {
        params: {
          course_id: this.courseId
        }
      })
        .then(res => {
          if (res.data.code === 1001) {
            this.allData = res.data.data
            this.allData.forEach(function (item) {
              if (item.is_peer_assessment === 'True' && item.peerStarted === 'True') {
                item.peerAssessment = '互评已开始'
              }
              if (item.is_peer_assessment === 'True' && item.peerStarted === 'False') {
                item.peerAssessment = '互评未开始'
              }
              if (item.type === 'False') {
                item.type = '作业'
              } else {
                item.type = '实验'
              }
            })
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    resourceDownload () {
      this.stuId = this.$cookie.get('userId')
      this.token = this.$cookie.get('token')
      console.log(this.stuId)
      if (this.resource !== null && this.resource !== '') {
        window.open(this.$baseUrl + '/downloadExpResource?expId=' + this.modalExpID)
      }
      /* axios.get(net.neturl + '/tryDownload?stuId="' + this.stuId + '"&expId=' + this.operExpID + '&type=0')
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
    }
  }
}
</script>
<style scoped src="../../assets/CommonStyle.css"></style>
<style scoped>
  .content-list-box{
    font-size: small;
  }
  .list-box{
    display: flex;
    flex-wrap: wrap;
  }
  .content-list-box label{
    /*font-size: large;*/
    margin: 0 10px 0 5px;
    /*line-height: 36px;*/
  }
  .content-list-box span{
    /*font-size: large;*/
    font-weight: lighter;
  }
  .list-block-box{
    width: 50%;
  }
  .list-block{
    max-height: 180px;
    min-height: 90px;
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
</style>
