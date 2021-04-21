<template>
  <div>
    <NavBar :username="this.$cookie.get('username')" infopage='/teacher/info' :breadlist="breadList">
      <div slot="navbarContent">
        <CardContent>
          <AddAssistantModal @refresh="refreshData" :listCourse="listCourse" :showModalAddAssistant.sync="showModalAddAssistant"></AddAssistantModal>
<!--          <ChangeAssistantModal @refresh="refreshData" :listCourse="listCourse" @showOperationRes="showOperationRes" :showModalChangeAssistant.sync="showModalChangeAssistant" :studentID="operStudentID"></ChangeAssistantModal>-->
<!--          <OperationResModal :showModalOperationRes.sync="showModalOperationRes" :title="operationTitle" :content="operationContent"></OperationResModal>-->
          <TableComponent :loading="loading" @refresh="refreshData" ref="table" :columnsFromFather="columns1" :allDataFromFather="allData">
            <Button @click="showModalAddAssistant = true" type="primary">
              <span style="font-size: 14px">新增成员</span>
            </Button>
          </TableComponent>
        </CardContent>
      </div>
    </NavBar>
  </div>
</template>

<script>
import NavBar from '../../components/NavBar'
import CardContent from '../../components/CardContent'
import TableComponent from '../../components/TableComponent'
import AddAssistantModal from '../../components/teacher/assistant/assistant_addAssistantModal'
import ChangeAssistantModal from '../../components/teacher/assistant/assistant_changeAssistantModal'
// import OperationResModal from '../../components/teacher/operationResModal'

export default {
  name: 'assistantManagement',
  components: {
    NavBar,
    CardContent,
    TableComponent,
    AddAssistantModal,
    ChangeAssistantModal
  },
  data () {
    return {
      allData: [],
      loading: true,
      showModalOperationRes: false,
      operationTitle: '',
      operationContent: '',
      operStudentID: -1,
      breadList: [{name: '课程团队', path: '/teacher/assistant'}], // 面包屑
      allDataUrl: 'teacher/astInfo',
      CourseListUrl: 'teacher/courseInfoByProId',
      listCourse: [],
      showModalAddAssistant: false,
      showModalChangeAssistant: false,
      columns1: [
        {
          title: '成员ID',
          key: 'id',
          sortable: 'custom'
        },
        {
          title: '成员姓名',
          key: 'name',
          sortable: 'custom'
        },
        {
          title: '类型',
          key: 'type',
          sortable: 'custom'
        },
        {
          title: '所管理课程',
          key: 'course',
          sortable: 'custom'
        },
        {
          title: '学期',
          key: 'term',
          sortable: 'number',
          sortType: 'desc'
        },
        {
          title: '添加时间',
          key: 'create_time',
          sortable: 'custom'
        },
        {
          title: '操作',
          key: 'oper',
          width: 200,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              // h('Button', {
              //   props: {
              //     type: 'info'
              //   },
              //   style: {
              //     marginRight: '5px'
              //   },
              //   on: {
              //     click: () => {
              //       this.operStudentID = Number(params.row.id)
              //       this.showModalChangeAssistant = true
              //     }
              //   }
              // }, '修改'),
              h('Button', {
                props: {
                  type: 'error'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.$http.post('teacher/deleteAstFromCourse', {
                      courseID: Number(params.row.course_id),
                      stuid: params.row.id
                    }).then(res => {
                      if (res.data.code === 1001) {
                        this.showNoticeSuccess('删除成功', '成功删除姓名为' + params.row.name + '，管理课程为' + params.row.course + '的' + params.row.type)
                        this.refreshData()
                      } else {
                        this.showNoticeError('删除失败', res.data.msg)
                      }
                    })
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
    this.loading = true
    this.getAllData()
    this.getCourseList()
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
    refreshData () {
      this.loading = true
      this.getAllData()
    },
    getCourseList () {
      this.$http.get(this.CourseListUrl)
        .then(res => {
          if (res.data.code === 1001) {
            this.listCourse = res.data.data
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    showOperationRes (title, content) {
      this.operationTitle = title
      this.operationContent = content
      this.showModalOperationRes = true
    },
    getAllData () {
      this.$http.get(this.allDataUrl)
        .then(res => {
          this.loading = false
          if (res.data.code === 1001) {
            this.allData = []
            let that = this
            res.data.data.stulsit.forEach(item => {
              item.type = '助教'
              that.allData.push(item)
            })
            res.data.data.teaList.forEach(item => {
              item.type = '指导教师'
              that.allData.push(item)
            })
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    sortByTerm (a, b) {
      return b.term - a.term
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
</style>
