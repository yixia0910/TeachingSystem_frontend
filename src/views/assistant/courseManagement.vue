<template>
  <div>
    <NavBar :breadlist="breadlist">
      <div slot="navbarContent">
        <CardContent>
          <TableComponent @refresh="refreshData" ref="table" :columnsFromFather="columns1" :allDataFromFather="allData">
<!--            <Button @click="showModalAddCourse = true">-->
<!--              <Icon type="md-add-circle" class="addIcon"/>-->
<!--              <span style="font-size: 14px">新增课程</span>-->
<!--            </Button>-->
            <Button type="info" @click="showModalAddExperiment = true">
              <Icon type="md-add-circle" class="addIcon"/>
              <span style="font-size: 14px">新增实验</span>
            </Button>
            <Button type="info" style="margin-left:5px;" @click="showModalAddHomework = true">
              <Icon type="md-add-circle" class="addIcon"/>
              <span style="font-size: 14px">新增作业</span>
            </Button>
          </TableComponent>
<!--          <AddCourseModal @refresh="refreshData" :listTerm="listTerm" :showModalAddCourse.sync="showModalAddCourse"></AddCourseModal>-->
          <AddHomeworkModal :listCourse="listCourse" :showModalAddHomework.sync="showModalAddHomework"></AddHomeworkModal>
          <AddExperimentModal :listCourse="listCourse" :showModalAddExperiment.sync="showModalAddExperiment"></AddExperimentModal>
<!--          <ChangeCourseModal @refresh="refreshData" :listTerm="listTerm" @showOperationRes="showOperationRes" :showModalChangeCourse.sync="showModalChangeCourse" :originCourseID="operCourseID" :originCourseName="operCourseName" :originCourseTerm="operCourseTerm"></ChangeCourseModal>-->
<!--          <DeleteCourseModal @refresh="refreshData" :showModalDeleteCourse.sync="showModalDeleteCourse" :courseID="operCourseID" :courseName="operCourseName"></DeleteCourseModal>-->
          <OperationResModal :showModalOperationRes.sync="showModalOperationRes" :title="operationTitle" :content="operationContent"></OperationResModal>
          <CheckStudentModal :showModalCheckStudent.sync="showModalCheckStudent" :courseID="operCourseID" :courseName="operCourseName"></CheckStudentModal>
          <BatchAddStudentsModal :showModalBatchAddStudents.sync="showModalBatchAddStudents" :courseID="operCourseID" :courseName="operCourseName"></BatchAddStudentsModal>
        </CardContent>
      </div>
    </NavBar>
  </div>
</template>

<script>
import NavBar from '../../components/NavBar'
import CardContent from '../../components/CardContent'
import TableComponent from '../../components/TableComponent'
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
    BatchAddStudentsModal,
    CheckStudentModal,
    OperationResModal,
    DeleteCourseModal,
    ChangeCourseModal,
    AddExperimentModal,
    AddHomeworkModal,
    AddCourseModal,
    TableComponent,
    CardContent,
    NavBar
  },
  data () {
    return {
      breadlist: [{name: '课程管理', path: '/assistant/courseManagement'}], // 面包屑
      showModalAddCourse: false,
      showModalAddHomework: false,
      showModalAddExperiment: false,
      showModalChangeCourse: false,
      showModalDeleteCourse: false,
      showModalCheckStudent: false,
      showModalBatchAddStudents: false,
      operationTitle: '',
      operationContent: '',
      showModalOperationRes: false,
      operCourseID: '',
      operCourseName: '',
      operCourseTerm: -1,
      operCourseDepartment: '',
      allData: [],
      listTerm: [],
      columns1: [
        {
          title: '序号',
          key: 'index'
        },
        {
          title: '课程名称',
          key: 'name'
        },
        {
          title: '开设学期',
          key: 'term_name'
        },
        {
          title: '任课教师',
          key: 'teacher_name'
        },
        // {
        //   title: '所属院系',
        //   key: 'college',
        //   render: (h, params) => {
        //     return h('div', params.row.department_id + ' - ' + params.row.department)
        //   }
        // },
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
                    this.$store.commit('setParamsMessage',
                      {
                        courseName: params.row.name,
                        courseId: params.row.id
                      })
                    this.$router.push(
                      {
                        name: 'astCourseDetails'
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
              }, '导入学生')
              // h('Button', {
              //   props: {
              //     type: 'info'
              //   },
              //   style: {
              //     marginRight: '5px'
              //   },
              //   on: {
              //     click: () => {
              //       this.operCourseID = params.row.id
              //       this.operCourseName = params.row.name
              //       this.operCourseTerm = Number(params.row.term_id)
              //       this.operCourseDepartment = params.row.department_id
              //       this.showModalChangeCourse = true
              //     }
              //   }
              // }, '修改'),
              // h('Button', {
              //   props: {
              //     type: 'error'
              //   },
              //   style: {
              //     marginRight: '5px'
              //   },
              //   on: {
              //     click: () => {
              //       this.operCourseID = params.row.id
              //       this.operCourseName = params.row.name
              //       this.showModalDeleteCourse = true
              //     }
              //   }
              // }, '删除')
            ])
          }
        }
      ]
    }
  },
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
      this.$http.get('/teacher/listTerm')
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
    showOperationRes (title, content) {
      this.operationTitle = title
      this.operationContent = content
      this.showModalOperationRes = true
    },
    refreshData () {
      this.getAllData()
    },
    getAllData () {
      this.$http.get('/student/astInfo')
        .then(res => {
          if (res.data.code === 1001) {
            this.allData = res.data.data
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

</style>
