<template>
  <div>
    <NavBar :breadlist="breadlist">
      <div slot="navbarContent">
        <!-- <CardContent v-if="expData.length===0" title="没有未完成实验">
          <TableComponent @refresh="refreshData" ref="table" :columnsFromFather="columns1" :allDataFromFather="expData"></TableComponent>
        </CardContent>
        <CardContent v-else title="未完成实验">
          <TableComponent @refresh="refreshData" ref="table" :columnsFromFather="columns1" :allDataFromFather="expData"></TableComponent>
        </CardContent> -->
        <div style="margin-left: 10px;">
          <Row>
              切换学期:
              <Select v-model="courseTerm" style="width:300px">
                <Option v-for="(item) in listTerm" :key="item.id" :value="item.id" :label="item.name">
                  <span>{{item.name}}</span>
                </Option>
              </Select>
          <Button @click="getCourse" size="large">
            <Icon type="md-refresh"></Icon>
            刷新课程
          </Button>
          </Row>
        </div>
        <div class="card-list-box">
          <Card class="card-list-null" v-if="courselist.length === 0">没有课程</Card>
          <Card class="card-list" padding="0" v-else v-for="(item, index) in courselist" :key="index">
            <div class="cover">
              <img class="back" src="../../assets/img/course_back.png" />
              <img class="title" src="../../assets/img/course_title.png"/>
              <p class="course-name">{{item.name}}</p>
              <p class="teacher-name">教师：{{item.teacher}}</p>
            </div>
            <Button style="margin:3px 15px 10px;float:right" type="info" @click="toCoursePage(item)">详 情</Button>
          </Card>
        </div>
      </div>
    </NavBar>
  </div>
</template>

<script>
import NavBar from '../../components/NavBar'
import CardContent from '../../components/CardContent'
import TableComponent from '../../components/TableComponent'
export default {
  name: 'expInfo',
  components: {
    TableComponent,
    NavBar,
    CardContent
  },
  data () {
    return {
      columns1: [
        {
          title: '课程编号',
          key: 'course_id',
          width: 1,
          render: (h, params) => {
            return h('span', {
              style: {
                display: 'none'
              }
            })
          }
        },
        {
          title: ' ',
          type: 'index',
          // indexMethod: row => {
          //   return (row._index + this.pageSize * (this.currentPage - 1) + 1)
          // },
          width: 60,
          align: 'center'
        },
        {
          title: '实验名',
          key: 'name'
        },
        {
          title: '所属课程',
          key: 'course_name'
        },
        {
          title: '教师',
          key: 'teacher_name'
        },
        // {
        //   title: '学期',
        //   key: 'term'
        // },
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
        // {
        //   title: '提交情况',
        //   key: 'status',
        //   render: (h, params) => {
        //     let status = '未提交'
        //     // if (this.expData[params.index].status) {
        //     //   status = '已提交'
        //     // }
        //     if (params.row.status) {
        //       status = '已提交'
        //     }
        //     return h('div', {}, status)
        //   },
        //   filters: [
        //     {
        //       label: '未完成实验'
        //     }
        //   ],
        //   filterMultiple: false,
        //   filterMethod (value, row) {
        //     return row.status === false
        //   }
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
                        courseId: params.row.course_id
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
      breadlist: [{name: '课程信息', path: '/student/experiments'}], // 面包屑
      courselist: [],
      term: '',
      termId: 0,
      listTerm: '',
      termUrl: '/teacher/listTerm',
      courseTerm: -1
    }
  },
  watch: {
    courseTerm: {
      deep: true,
      handler: function (newVal, oldVal) {
        console.log(this.courseTerm)
        this.termId = this.courseTerm
        // eslint-disable-next-line no-undef
        for (var term1 of this.listTerm) {
          // eslint-disable-next-line no-undef
          console.log(term1.id)
          if (term1.id === this.courseTerm) { this.term = term1.name }
        }
        console.log(this.term)
        // this.getUnfinishedExp()
        this.getCourse()
      }
    }
  },
  mounted () {
    this.getCurrentTermFirst()
    this.$http.get(this.termUrl)
      .then(res => {
        if (res.data.code === 1001) {
          this.listTerm = res.data.data
          console.log(this.listTerm)
        } else {
          this.$Message.error(res.data.msg)
        }
      })
      .catch(err => {
        console.log(err)
      })
  },
  methods: {
    getCurrentTermFirst () {
      this.$http.get('/getNowTerm')
        .then(res => {
          console.log(res.data.data)
          this.termId = res.data.data.id
          this.term = res.data.data.name
          this.courseTerm = this.termId
          // this.getUnfinishedExp()
          this.getCourse()
        })
        .catch(err => {
          console.log(err)
        })
    },
    getUnfinishedExp () {
      console.log(this.term)
      // this.$http.get('/exp/unfinished')
      this.$http.get('/student/getUnfinishedExp', {params: {termId: this.termId}})
        .then(res => {
          console.log(res)
          if (res.data.code === 1001) {
            this.expData = res.data.data
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
    getCourse () {
      // this.$http.get('/student/courselist')
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
    refreshData () {
      this.getCourse()
    },
    toCoursePage (item) {
      console.log(item)
      this.$store.commit('setParamsMessage',
        {
          courseId: item.id,
          courseName: item.name,
          teacher: item.teacher,
          term: item.semester
        })
      this.$router.push(
        {
          name: 'courseExp'
          // params: {
          //   courseId: item.id,
          //   courseName: item.name,
          //   teacher: item.teacher,
          //   term: item.term
          // }
        }
      )
    }
    // changePage (index) {
    //   this.currentPage = index
    //   this.showData = this.expData.slice((index - 1) * this.pageSize, index * this.pageSize)
    // }
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
    padding-top: 5px;
    font-family: 黑体,sans-serif;
  }
  .cover .teacher-name{
    top:126px;
    position: absolute;
    left: 180px;
    font-size: 16px;
  }
</style>
