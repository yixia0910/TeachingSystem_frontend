<template>
  <div>
    <NavBar :username="this.$cookie.get('username')" infopage='/teacher/info' :breadlist="breadList">
      <div slot="navbarContent">
        <CardContent>
          <TableComponent :loading="loading" @refresh="refreshData" ref="table" :columnsFromFather="columns3" :allDataFromFather="allData3">
            <Button type="primary" @click="exportData">
              <Icon type="md-undo" class="addIcon"/>
              <span style="font-size: 14px">导出分数</span>
            </Button>
            <!-- <el-button type="primary" @click="select()">
              <span style="font-size: 14px">选择学生</span>
            </el-button>
            <el-button type="success" @click="distribute()">
              <span style="font-size: 14px">分配权重</span>
            </el-button>
            <el-button type="warning" disabled v-if="totalNum !== 100">
              <span style="font-size: 14px">设置总分</span>
            </el-button>
            <el-button type="warning" @click="allToOne()" v-if="totalNum === 100">
              <span style="font-size: 14px">设置总分</span>
            </el-button>
            <el-button type="primary" disabled v-if="totalNum !== 100">
              <span style="font-size: 14px">查看总分</span>
            </el-button>
            <el-button type="primary" @click="see()" v-if="totalNum === 100">
              <span style="font-size: 14px">查看总分</span>
            </el-button> -->
          </TableComponent>
        </CardContent>
      </div>
    </NavBar>
    <Table
        :columns="lie"
        :data="allData3"
        ref="myTable"
        hidden
    ></Table>
  </div>
</template>
<script>
import NavBar from '../../components/NavBar'
import TableComponent from '../../components/TableComponent'
import TableComponent2 from '../../components/TableComponent2'

import CardContent from '../../components/CardContent'
import AddHomeworkModal from '../../components/teacher/course/course_addHomeworkModal'
import AddExperimentModal from '../../components/teacher/course/course_addExperimentModal'
import AddVMModal from '../../components/teacher/vm/vm_addVMModal'
// import ApplyVMModal from '../../components/teacher/courseDetail_applyVMModal'
import SelectStudentModal from '../../components/teacher/course/course_selectStudentModal'
import CheckStudentModal from '../../components/teacher/course/course_checkStudentModal'

export default {
  name: 'scoreList',
  components: {
    NavBar,
    TableComponent,
    TableComponent2,
    CardContent,
    AddHomeworkModal,
    AddExperimentModal,
    AddVMModal,
    SelectStudentModal,
    CheckStudentModal
  },
  data () {
    return {
      stuID: '',
      userId: '',
      flag: 0,
      mark: 0,
      score: '',
      courseName: '',
      courseID: '',
      loading: false,
      highLightRow: true,
      breadList: [], // 面包屑
      showModalSelectStudent: false,
      showModalDistribute: false,
      dialogFormVisible: false,
      operWorkingParam: {},
      allData: [],
      // 请求数据的url
      allData3: [],
      allDataUrl3: 'getStuTotalScore',
      loading3: true,
      lie: [{'title': '学号', 'key': 'id'}, {'title': '姓名', 'key': 'name'}, {'title': '分数', 'key': 'score'}],
      columns3: [
        {
          title: '序号',
          key: 'index',
          width: 100,
          sortable: 'number'
        },
        {
          title: '学生学号',
          key: 'id',
          sortable: 'custom'
        },
        {
          title: '学生姓名',
          key: 'name',
          sortable: 'custom'
        },
        {
          title: '总分',
          key: 'score',
          width: 80
        },
      ],
    }
  },
  mounted () {
    this.userId = this.$cookie.get('userId')
    this.courseID = sessionStorage.getItem('scoreList_courseID')
    this.courseName = sessionStorage.getItem('scoreList_courseName')
    this.breadList = JSON.parse(sessionStorage.getItem('scoreList_breadList'))
    this.breadList.push({name: '总分表', path: this.$route.fullPath})
    this.getExp()
    this.getTotalScore()
    this.see()
  },
  methods: {
    see () {
      if (this.courseID === '' || typeof (this.courseID) === 'undefined') {
        return
      }
      this.$http.get(this.allDataUrl3, {
        params: {
          courseId: this.courseID,
          type: 3
        }
      })
        .then(res => {
          if (res.data.code === 1001) {
            this.allData3 = res.data.data
            this.allData3.forEach( function (item) {
                item.score = parseFloat(item.score)
                item.score = item.score.toFixed(2)
            })
          } else {
            this.$Message.error(res.data.msg)
            this.allData3 = []
          }
        })
        .catch(err => {
          console.log(err)
        }).then(() => {
        })
    },
    exportData () {
      var str = this.courseName + '学生总分表'
      this.$refs.myTable.exportCsv({
        filename: str,
        original: false,
        columns: this.lie,
        data: this.allData3
      })
    },
    refreshData () {
    this.loading = true
    this.getExp()
    this.getTotalScore()
    this.see()
    },
    getTotalScore () {
      this.$http.get('/FindWeight', {
        params: {
          stuid: this.courseID,
          userid: this.courseID,
          expid: Number(this.courseID),
          type: 1
        }
      })
        .then(res2 => {
          if (res2.data.code !== 1001) {
          } else {
            if (res2.data.data !== -1) {
              this.score = res2.data.data
            } else {
              this.score = 0
            }
          }
        }).catch(err => {
          console.log(err)
        })
    },
    getExp () {
      this.$http.get('/teacher/getExperiment', {params: {course_id: this.courseID}})
        .then(res => {
          if (res.data.code === 1001) {
            this.expData = res.data.data
            this.expData.forEach(function (item) {
              if (item.type === 'False') {
                item.type = '作业'
              } else {
                item.type = '考试'
              }
            })
            console.log(res.data.data)
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
