<template>
  <div>
    <NavBar :breadlist="breadlist">
      <div slot="navbarContent">
        <CardContent :title="titleName">
          <TableComponent @refresh="refreshData" ref="table" :columnsFromFather="columns1" :allDataFromFather="expData">
            <div style="color: #9ea7b4; font-size: medium;">{{this.titleTeacher}}</div>
            <el-button type="success" disabled v-if="isOver === 0">
              <i class="el-icon-edit"></i>
              <span style="font-size: 14px">评价课程</span>
            </el-button>
            <el-button type="success" @click="evaluate()" v-if="isOver === 1">
              <i class="el-icon-edit"></i>
              <span style="font-size: 14px">评价课程</span>
            </el-button>
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
export default {
  name: 'courseExp',
  components: {TableComponent, CardContent, NavBar},
  data () {
    return {
      breadlist: [
        {name: '课程信息', path: '/student/experiments'},
        {name: '课程任务', path: '/course/experiments'}
      ],
      columns1: [
        {
          title: '序号',
          type: 'index',
          width: 100,
          align: 'center'
        },
        // {
        //   title: '学期',
        //   key: 'term'
        // },
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
          key: 'start_time',
          sortable: true
        },
        {
          title: '结束时间',
          key: 'end_time',
          sortable: true
        },
        // {
        //   title: '延期时间',
        //   key: 'deadline',
        //   sortable: true
        // },
        {
          title: '操作',
          key: 'oper',
          width: 250,
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
                    this.$store.commit('setParamsMessage',
                      {
                        id: params.row.id,
                        name: params.row.name,
                        courseName: this.course.courseName,
                        teacher: this.course.teacher,
                        courseId: this.course.courseId
                      })
                    this.$router.push(
                      {
                        name: 'expDetails'
                      })
                  }
                }
              }, '详情')
            ])
          }
        }
      ],
      expData: [],
      course: JSON.parse(localStorage.getItem('paramsMessage')),
      isOver: 0,
      courselist: [],
      term: '',
      titleName: '',
      titleTeacher: '',
      termId: 0
    }
  },
  mounted () {
    localStorage.setItem('courseId', this.course.courseId)
    console.log(this.course.courseId)
    console.log('hello')
    this.getCurrentTermFirst()
    this.getCourseInfo()
  },
  methods: {
    getCourseInfo () {
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
    evaluate () {
      console.log('111')
    },
    getCurrentTermFirst () {
      this.$http.get('/getNowTerm')
        .then(res => {
          console.log(res.data.data)
          this.termId = res.data.data.id
          this.term = res.data.data.name
          this.titleName = this.course.courseName
          this.titleTeacher = this.course.teacher
          this.getExp(this.course.courseId)
          this.getCourse()
        })
        .catch(err => {
          console.log(err)
        })
    },
    getExp (courseid) {
      this.$http.get('/student/getExperimentByCourseId', {params: {courseId: courseid}})
        .then(res => {
          console.log(res)
          if (res.data.code === 1001) {
            this.expData = res.data.data
            this.expData.forEach(function (item) {
              if (item.type === 'False') {
                item.type = '作业'
              } else {
                item.type = '考试'
              }
            })
            // this.showData = this.expData.slice(0, this.pageSize)
            // this.totalExpCount = res.data.data.length
            // console.log(this.courseData)
            console.log(res.data.data)
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    refreshData () {
      this.getExp()
    },
    getCourse () {
      this.$http.get('/getCourseListByStuIdAndTerm', {params: {term: this.term}})
        .then(res => {
          if (res.data.code === 1001) {
            this.courselist = res.data.data
          } else {
            this.courselist = []
            this.$Message.error(res.data.msg)
          }
        }).catch(err => {
          console.log(err)
        })
    },
    changeCourseShow (item) {
      this.titleName = item.name
      this.titleTeacher = item.teacher
      this.$store.commit('setParamsMessage', {
        courseId: item.id,
        courseName: item.name,
        teacher: item.teacher,
        department: item.department
      })
      this.course = JSON.parse(localStorage.getItem('paramsMessage'))
      this.getExp(item.id)
    }
  }
}
</script>
<style scoped src="../../assets/CommonStyle.css"></style>
<style scoped>
  .card-list-box{
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 10px;
  }
  .card-list{
    margin: 10px 5px 10px 10px;
    width: 300px;
  }
  .card-list-block label{
    font-weight: bold;
    margin-right: 10px;
  }
  .card-list-null{
    font-size: large;
    text-align: center;
    width: 230px;
    margin: 10px 5px 10px 10px;
  }
  .card-list-cover{
    text-align: center;
    overflow: hidden;
  }
  .card-list-cover .back{
    width: 100%;
    height: 90px;
    opacity: .4;
  }
  .card-list-cover .teacher{
    bottom: 20px;
    position: absolute;
    /*color: #9ea7b4;*/
    font-size: large;
    right: 20px;
  }
  .card-list-cover .course-name{
    top: 20px;
    padding-left: 15px;
    position: absolute;
    font-size: xx-large;
  }
  .cover{
    position: relative;
    width: 100%;
  }
  .cover .back{
    margin-top: 20px;
    width: 100%;
    opacity: .5;
  }
  .cover .title{
    position: absolute;
    height:10px;
    top:20px;
    left:20px;
  }
  .cover .course-name{
    border-top: 2px #3a90b7 solid;
    border-bottom: 2px #3a90b7 solid;
    position: absolute;
    top: 52px;
    left:50%;
    transform: translateX(-50%);
    width: max-content;
    text-align: center;
    font-size: 26px;
    padding: 5px 0;
    font-family: 黑体,sans-serif;
  }
  .cover .teacher-name{
    top:126px;
    position: absolute;
    left: 180px;
    font-size: 16px;
  }
</style>
