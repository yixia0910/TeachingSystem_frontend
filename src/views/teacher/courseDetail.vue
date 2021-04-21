<template>
  <div>
    <NavBar :username="this.$cookie.get('username')" infopage='/teacher/info' :breadlist="breadList">
      <div slot="navbarContent">
        <CardContent>
          <AddHomeworkModal @refresh="refreshData" :showModalAddHomework.sync="showModalAddHomework" :selectCourseID="courseID" :selectCourseName="courseName"></AddHomeworkModal>
          <AddExperimentModal @refresh="refreshData" :showModalAddExperiment.sync="showModalAddExperiment" :selectCourseID="courseID" :selectCourseName="courseName"></AddExperimentModal>
          <ChangeWorkingModal @refresh="refreshData" :showModalChangeWorking.sync="showModalChangeWorking" :workingParam="operWorkingParam" :selectCourseName="courseName"></ChangeWorkingModal>
          <AddVMModal :showModalAddVM.sync="showModalAddVM" :expID="operExpID" :expName="operExpName" :expApplyId="operExpApplyId"></AddVMModal>
          <DeleteExpModal @refresh="refreshData" :showModalDeleteExp.sync="showModalDeleteExp" :expID="operExpID" :expName="operExpName" :expType="operExpType"></DeleteExpModal>
          <TableComponent :loading="loading" @refresh="refreshData" ref="table" :columnsFromFather="columns1" :allDataFromFather="allData">
            <Button type="primary" @click="showModalAddExperiment = true">
              <span style="font-size: 14px">新增考试</span>
            </Button>
            <Button type="primary" style="margin-left:20px;" @click="showModalAddHomework = true">
              <span style="font-size: 14px">新增作业</span>
            </Button>
            <el-button type="success" style="margin-left:20px;" @click="jump()">
              <span style="font-size: 14px">成绩统计</span>
            </el-button>
            <el-button type="danger" style="margin-left:20px;" @click="end()" v-if="isOver === 0">
              <span style="font-size: 14px">结课</span>
            </el-button>
            <el-button type="danger" style="margin-left:20px;" @click="end()" v-if="isOver === 1" disabled>
              <span style="font-size: 14px">已结课</span>
            </el-button>
          </TableComponent>
        </CardContent>
      </div>
    </NavBar>
  </div>
</template>
<script>
import NavBar from '../../components/NavBar'
import TableComponent from '../../components/TableComponent'
import CardContent from '../../components/CardContent'
import AddHomeworkModal from '../../components/teacher/course/course_addHomeworkModal'
import AddExperimentModal from '../../components/teacher/course/course_addExperimentModal'
import AddVMModal from '../../components/teacher/vm/vm_addVMModal'
// import ApplyVMModal from '../../components/teacher/courseDetail_applyVMModal'
import DeleteExpModal from '../../components/teacher/courseDetail/courseDetail_deleteExpModal'
import ChangeWorkingModal from '../../components/teacher/courseDetail/courseDetail_changeWorkingModal'
import ChangePasswordModal from '../../components/teacher/courseDetail/courseDetail_changePasswordModal'

export default {
  name: 'courseDetail',
  components: {
    NavBar,
    TableComponent,
    CardContent,
    AddHomeworkModal,
    AddExperimentModal,
    AddVMModal,
    // ApplyVMModal,
    DeleteExpModal,
    ChangeWorkingModal,
    ChangePasswordModal
  },
  data () {
    return {
      isOver: 0,
      courseName: '',
      courseID: '',
      operExpName: '',
      operExpID: -1,
      operExpType: '',
      operExpApplyId: '',
      operExpVmName: '',
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
      // 请求数据的url
      allDataUrl: 'teacher/getExperiment',
      columns1: [
        {
          // 仅使用type:index可以达到显示行号的目的，但是将TableComponent组件中的item转为对象后发现index并不在属性中，做搜索时不太方便
          // 如果希望表格显示序号，请务必把序号这一列的key命名为index，如果有这一列则搜索的时候会搜索序号，没有就不搜索
          title: '序号',
          key: 'index',
          width: 100,
          sortable: 'number'
        },
        {
          title: '名称',
          key: 'name'
        },
        {
          title: '类型',
          key: 'type',
          width: 80
        },
        {
          title: '操作',
          key: 'oper',
          width: 530,
          align: 'center',
          render: (h, params) => {
            return h('div', [
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
                    sessionStorage.setItem('expDetail_breadList', JSON.stringify(this.breadList))
                    sessionStorage.setItem('expDetail_expID', params.row.id)
                    sessionStorage.setItem('expDetail_expName', params.row.name)
                    sessionStorage.setItem('expDetail_expType', params.row.type)
                    sessionStorage.setItem('expDetail_expStartTime', params.row.start_time)
                    sessionStorage.setItem('expDetail_expEndTime', params.row.end_time)
                    this.$router.push({
                      path: '/teacher/expDetail'
                    })
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
                    sessionStorage.setItem('expDetail_expName', params.row.name)
                    sessionStorage.setItem('course_Id', params.course_id)
                  }
                }
              }, '修改'),
              h('Button', {
                props: {
                  type: 'info',
                  disabled: params.row.type === '考试'
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
                    sessionStorage.setItem('checkHomework_enablePeer', String(params.row.is_peer_assessment))
                    sessionStorage.setItem('checkHomework_peerStarted', String(params.row.peerStarted))
                    sessionStorage.setItem('checkHomework_type', params.row.type)
                    console.log('type' + sessionStorage.getItem('checkHomework_type'))
                    this.$router.push({
                      path: '/teacher/homework'
                    })
                  }
                }
              }, '查看作业'),
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
              }, '删除')
            ])
          }
        }
      ],
      columns2: [
        {
          // 仅使用type:index可以达到显示行号的目的，但是将TableComponent组件中的item转为对象后发现index并不在属性中，做搜索时不太方便
          // 如果希望表格显示序号，请务必把序号这一列的key命名为index，如果有这一列则搜索的时候会搜索序号，没有就不搜索
          title: '序号',
          key: 'index',
          width: 100,
          sortable: 'number'
        },
        {
          title: '名称',
          key: 'name'
        },
        {
          title: '类型',
          key: 'type',
          width: 80
        },
        {
          title: '操作',
          key: 'oper',
          width: 530,
          align: 'center',
          render: (h, params) => {
            return h('div', [
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
                    sessionStorage.setItem('expDetail_breadList', JSON.stringify(this.breadList))
                    sessionStorage.setItem('expDetail_expID', params.row.id)
                    sessionStorage.setItem('expDetail_expName', params.row.name)
                    sessionStorage.setItem('expDetail_expType', params.row.type)
                    sessionStorage.setItem('expDetail_expStartTime', params.row.start_time)
                    sessionStorage.setItem('expDetail_expEndTime', params.row.end_time)
                    this.$router.push({
                      path: '/teacher/expDetail'
                    })
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
                    sessionStorage.setItem('expDetail_expName', params.row.name)
                    sessionStorage.setItem('course_Id', params.course_id)
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
              }, '删除')
            ])
          }
        }
      ]
    }
  },
  mounted () {
    this.courseID = sessionStorage.getItem('courseDetail_courseID')
    this.courseName = sessionStorage.getItem('courseDetail_courseName')
    this.breadList = []
    this.breadList.push({name: '课程管理', path: '/teacher/course'})
    this.breadList.push({name: '课程' + this.courseName + '详情', path: this.$route.fullPath})
    this.loading = true
    this.getAllData()
    this.getCourse()
  },
  methods: {
    getCourse () {
      this.$http.get('/getCourse', {params: {
        courseID: this.courseID
      }})
        .then(res => {
          if (res.data.code === 1001) {
            console.log(res.data)
            this.isOver = res.data.data.isOver
          } else {
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    end () {
      let params = {
        id: this.courseID,
        name: this.courseName,
        isOver: 1
      }
      this.$http.post('/endCourse', params)
        .then(res => {
          if (res.data.code === 1001) {
            this.showNoticeSuccess('操作成功')
          } else {
            this.showNoticeError('操作失败', res.data.msg)
          }
          this.posting = false
        })
        .catch(err => {
          console.log(err)
        }).then(() => {
        })
    },
    jump () {
      sessionStorage.setItem('score_breadList', JSON.stringify(this.breadList))
      sessionStorage.setItem('score_courseID', this.courseID)
      sessionStorage.setItem('score_courseName', this.courseName)
      this.$router.push({path: '/teacher/score'})
    },
    refreshData () {
      this.loading = true
      this.getAllData()
    },
    getAllData: function () {
      if (this.courseID === '') {
        return
      }
      this.$http.get(this.allDataUrl, {
        params: {
          course_id: this.courseID
        }
      })
        .then(res => {
          this.loading = false
          if (res.data.code === 1001) {
            console.log(res.data.data)
            this.allData = res.data.data
            this.allData.forEach(function (item) {
              if (item.type === 'False') {
                item.type = '作业'
              } else {
                item.type = '考试'
              }
            })
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

<style scoped src="../../assets/CommonStyle.css"></style>
<style scoped>
  .addIcon{
    padding-right:5px;
    padding-bottom: 3px;
  }
  .studentButton{
    border-color: cornflowerblue;
    background-color: cornflowerblue;
  }
</style>
