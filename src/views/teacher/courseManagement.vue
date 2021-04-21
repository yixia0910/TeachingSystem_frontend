<template>
  <div>
    <NavBar :username="this.$cookie.get('username')" infopage='/teacher/info' :breadlist="breadList">
      <div slot="navbarContent">
        <CardContent>
          <AddCourseModal @refresh="refreshData" :listTerm="listTerm" :showModalAddCourse.sync="showModalAddCourse"></AddCourseModal>
          <AddHomeworkModal :listCourse="listCourse" :showModalAddHomework.sync="showModalAddHomework"></AddHomeworkModal>
          <AddExperimentModal :listCourse="listCourse" :showModalAddExperiment.sync="showModalAddExperiment"></AddExperimentModal>
          <ChangeCourseModal @refresh="refreshData" :listTerm="listTerm" @showOperationRes="showOperationRes" :showModalChangeCourse.sync="showModalChangeCourse" :originCourseID="operCourseID" :originCourseName="operCourseName" :originCourseTerm="operCourseTerm"></ChangeCourseModal>
          <DeleteCourseModal @refresh="refreshData" :showModalDeleteCourse.sync="showModalDeleteCourse" :courseID="operCourseID" :courseName="operCourseName"></DeleteCourseModal>
          <OperationResModal :showModalOperationRes.sync="showModalOperationRes" :title="operationTitle" :content="operationContent"></OperationResModal>
          <CheckStudentModal :showModalCheckStudent.sync="showModalCheckStudent" :courseID="operCourseID" :courseName="operCourseName"></CheckStudentModal>
          <BatchAddStudentsModal :showModalBatchAddStudents.sync="showModalBatchAddStudents" :courseID="operCourseID" :courseName="operCourseName"></BatchAddStudentsModal>
          <TableComponent :loading="loading" @refresh="refreshData" ref="table" :columnsFromFather="columns1" :allDataFromFather="allData">
            <Button type="primary" @click="showModalAddCourse = true">
              <span style="font-size: 14px">新增课程</span>
            </Button>
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
import AddCourseModal from '../../components/teacher/course/course_addCourseModal'
import AddHomeworkModal from '../../components/teacher/course/course_addHomeworkModal'
import AddExperimentModal from '../../components/teacher/course/course_addExperimentModal'
import ChangeCourseModal from '../../components/teacher/course/course_changeCourseModal'
import DeleteCourseModal from '../../components/teacher/course/course_deleteCourseModal'
import OperationResModal from '../../components/teacher/operationResModal'
import CheckStudentModal from '../../components/teacher/course/course_checkStudentModal'
import BatchAddStudentsModal from '../../components/teacher/course/course_batchAddStudentsModal'

export default {
  name: 'courseManagement',
  components: {
    NavBar,
    TableComponent,
    CardContent,
    AddCourseModal,
    AddHomeworkModal,
    AddExperimentModal,
    ChangeCourseModal,
    DeleteCourseModal,
    OperationResModal,
    CheckStudentModal,
    BatchAddStudentsModal
  },
  data () {
    return {
      highLightRow: true,
      loading: true,
      breadList: [{name: '课程管理', path: '/teacher/course'}], // 面包屑
      showModalAddCourse: false,
      showModalAddHomework: false,
      showModalAddExperiment: false,
      showModalChangeCourse: false,
      showModalDeleteCourse: false,
      showModalCheckStudent: false,
      showModalBatchAddStudents: false,
      operationTitle: '',
      operationContent: '',
      // collegeUrl: '/teacher/listCollege',
      termUrl: '/teacher/listTerm',
      showModalOperationRes: false,
      operCourseID: '',
      operCourseName: '',
      operCourseTerm: -1,
      operCourseDepartment: '',
      allData: [],
      listTerm: [],
      // listCollege: [],
      // 请求数据的url
      allDataUrl: 'teacher/courseInfoByProId',
      columns1: [
        {
          // 仅使用type:index可以达到显示行号的目的，但是将TableComponent组件中的item转为对象后发现index并不在属性中，做搜索时不太方便
          // 如果希望表格显示序号，请务必把序号这一列的key命名为index，如果有这一列则搜索的时候会搜索序号，没有就不搜索
          title: '序号',
          key: 'index',
          sortable: 'custom',
          sortType: 'number'
        },
        {
          title: '课程名称',
          key: 'name',
          sortable: 'custom'
        },
        {
          title: '开设学期',
          key: 'term',
          sortable: 'custom'
        },
        {
          title: '操作',
          key: 'oper',
          width: 450,
          align: 'center',
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
                    sessionStorage.setItem('courseDetail_courseName', params.row.name)
                    sessionStorage.setItem('courseDetail_courseID', params.row.id)
                    this.$router.push({
                      path: '/teacher/courseDetail'
                    })
                  }
                }
              }, '详情'),
              h('Button', {
                props: {
                  type: 'info'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.operCourseID = params.row.id
                    this.operCourseName = params.row.name
                    this.showModalCheckStudent = true
                  }
                }
              }, '查看学生'),
              h('Button', {
                props: {
                  type: 'info'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.operCourseID = params.row.id
                    this.operCourseName = params.row.name
                    this.showModalBatchAddStudents = true
                  }
                }
              }, '导入学生'),
              h('Button', {
                props: {
                  type: 'info'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.operCourseID = params.row.id
                    this.operCourseName = params.row.name
                    this.operCourseTerm = Number(params.row.term_id)
                    this.operCourseDepartment = params.row.department_id
                    this.showModalChangeCourse = true
                  }
                }
              }, '修改'),
              h('Button', {
                props: {
                  type: 'error'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.operCourseID = params.row.id
                    this.operCourseName = params.row.name
                    this.showModalDeleteCourse = true
                  }
                }
              }, '删除')
            ])
          }
        }
      ]
    }
  },
  // TODO:隐藏导入学生按钮，将其放到查看学生的二级页面中
  mounted () {
    this.getAllData()
    this.getListTerm()
    // this.getListCollege()
  },
  computed: {
    listCourse: function () {
      let listRes = []
      this.allData.forEach(item => {
        listRes.push({id: item.id, name: item.name})
      })
      return listRes
    }
  },
  methods: {
    getListTerm () {
      this.$http.get(this.termUrl)
        .then(res => {
          if (res.data.code === 1001) {
            this.listTerm = res.data.data
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // getListCollege () {
    //   this.$http.post(this.collegeUrl)
    //     .then(res => {
    //       if (res.data.code === 1001) {
    //         this.listCollege = res.data.data
    //       } else {
    //         this.$Message.error(res.data.msg)
    //       }
    //     })
    //     .catch(err => {
    //       console.log(err)
    //     })
    // },
    showOperationRes (title, content) {
      this.operationTitle = title
      this.operationContent = content
      this.showModalOperationRes = true
    },
    refreshData () {
      this.getAllData()
    },
    getAllData () {
      this.$http.get(this.allDataUrl)
        .then(res => {
          this.loading = false
          if (res.data.code === 1001) {
            this.allData = res.data.data
            console.log(this.allData)
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log(err)
        }).then(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style scoped src="../../assets/CommonStyle.css"></style>
<style scoped>
  .studentButton{
    border-color: cornflowerblue;
    background-color: cornflowerblue;
  }
</style>
