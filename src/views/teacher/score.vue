<template>
  <div>
    <NavBar :username="this.$cookie.get('username')" infopage='/teacher/info' :breadlist="breadList">
      <div slot="navbarContent">
        <CardContent>
          <TableComponent :loading="loading" @refresh="refreshData" ref="table" :columnsFromFather="columns1" :allDataFromFather="allData">
            <Button type="primary" @click="select()">
              <span style="font-size: 14px">选择学生</span>
            </Button>
            <Button type="primary" @click="distribute()">
              <span style="font-size: 14px">分配权重</span>
            </Button>
            <Button type="primary" @click="allToOne()">
              <span style="font-size: 14px">生成总分</span>
            </Button>
            <Button type="primary" @click="see()">
              <span style="font-size: 14px">查看总分</span>
            </Button>
          </TableComponent>
        </CardContent>
      </div>
    </NavBar>
    <Modal
      v-model="showModalSelectStudent"
      @on-ok="ok"
      @on-cancel="cancel" width="800px">
      <p slot="header" style="margin-top:10px;height:25px;font-size: 20px;text-align:center;font-weight:normal">
        <span>选择课程<strong>《{{courseName}}》</strong>中的学生</span>
      </p>
      <div style="margin-top:10px;margin-left:20px;margin-right:20px;">
        <TableComponent :buttonSpan="12" :loading="loading" @refresh="refreshData2" ref="table" :columnsFromFather="columns2" :allDataFromFather="allData2">
        </TableComponent>
      </div>
      <div slot="footer">
        <Button type="text" size="large" @click="cancel">取消</Button>
        <Button type="primary" size="large" @click="ok">确定</Button>
      </div>
    </Modal>
    <Modal
      v-model="showModalDistribute"
      @on-ok="ok"
      @on-cancel="cancel" width="800px">
      <p slot="header" style="margin-top:10px;height:25px;font-size: 20px;text-align:center;font-weight:normal">
        <span>分配各次作业与考试的权重</span>
        <span>总量：100</span>
      </p>
      <div style="margin-top:10px;margin-left:20px;margin-right:20px;">
        <!-- <TableComponent2 :buttonSpan="12" :loading="loading" @refresh="refreshData2" ref="table" :columnsFromFather="columns2" :allDataFromFather="allData2">
        </TableComponent2> -->
        <el-table
          :data = "expData"
          >
          <el-table-column
            type="index"
            width="50">
          </el-table-column>
          <el-table-column
            v-for="info in Header" :key="info.key"
            :property="info.key"
            :label="info.label"
            >
              <template slot-scope="scope">
                {{scope.row[scope.column.property]}}
              </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-input-number v-model="expWeight[scope.$index]" oninput = "value=value.replace(/[^\d]/g,'')" :min="0" :max="100"></el-input-number>
            </template>
          </el-table-column>
        </el-table>
        <span>已分配权重总和：{{totalNum}}</span><br>
        <span>剩余权重总和：{{100-totalNum}}</span><br>
      </div>
      <div slot="footer">
        <Button type="text" size="large" @click="cancel2">取消</Button>
        <Button type="primary" size="large" @click="ok2">确定</Button>
      </div>
    </Modal>
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
  name: 'score',
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
      courseName: '',
      courseID: '',
      loading: false,
      highLightRow: true,
      breadList: [], // 面包屑
      showModalSelectStudent: false,
      showModalDistribute: false,
      operWorkingParam: {},
      allData: [],
      // 请求数据的url
      allDataUrl: 'teacher/getStudentScore',
      expData: [],
      expWeight: [],
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
          title: '分数',
          key: 'score',
          width: 80
        },
        {
          title: '满分',
          key: 'vm_status',
          width: 120
        },
        {
          title: '参考分数',
          key: 'vm_apply_id',
          width: 120
        },
        {
          title: '说明',
          key: 'vm_name',
          width: 300
        }
      ],
      allData2: [],
      allDataUrl2: 'getStuListByCourseId',
      loading2: true,
      columns2: [
        {
          title: '学生学号',
          key: 'id',
          width: '150',
          sortable: 'custom'
        },
        {
          title: '学生姓名',
          key: 'name',
          sortable: 'custom'
        },
        {
          title: '学生邮箱',
          key: 'email',
          sortable: 'custom'
        },
        {
          title: '操作',
          key: 'oper',
          width: '150',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'success'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.choose(params.row.id)
                  }
                }
              }, '选择')
            ])
          }
        }
      ],
      Header: [
        {
          label: '名称',
          key: 'name'
        },
        {
          label: '类别',
          key: 'type'
        }
      ]
    }
  },
  computed: {
    totalNum: function () {
      let num = 0
      for (var i = 0; i < this.expData.length; i++) {
        if (this.expWeight[i] !== '' && this.expWeight[i] !== null && !isNaN(this.expWeight[i]) && typeof (this.expWeight[i]) !== 'undefined') {
          num += this.expWeight[i]
        }
      }
      if (isNaN(num)) {
        num = 0
      }
      return num
    }
  },
  mounted () {
    this.userId = this.$cookie.get('userId')
    this.courseID = sessionStorage.getItem('score_courseID')
    this.courseName = sessionStorage.getItem('score_courseName')
    this.breadList = JSON.parse(sessionStorage.getItem('score_breadList'))
    this.breadList.push({name: '成绩统计', path: this.$route.fullPath})
    this.getExp()
  },
  methods: {
    initExpWeight () {
      for (let i = 0; i < this.expData.length; i++) {
        console.log(i)
        this.$http.get('/FindWeight', {
          params: {
            stuid: this.userId,
            userid: this.userId,
            expid: this.expData[i].id
          }
        })
          .then(res2 => {
            if (res2.data.code !== 1001) {
            } else {
              if (res2.data.data !== -1) {
                this.expWeight[i] = res2.data.data
                console.log(i)
                console.log(this.expWeight[i])
              } else {
                this.this.expWeight[i] = 0
              }
            }
          }).catch(err => {
            console.log(err)
          })
      }
    },
    select () {
      this.getAllData2()
      this.showModalSelectStudent = true
    },
    choose (data) {
      this.stuID = data
      this.showModalSelectStudent = false
      this.getAllData()
    },
    distribute () {
      this.getExp()
      console.log('wwww' + this.expWeight)
      this.showModalDistribute = true
    },
    refreshData () {
    //   this.loading = true
    //   this.getAllData()
    },
    getAllData: function () {
      if (this.courseID === '') {
        return
      }
      if (this.stuID === '') {
        return
      }
      this.$http.get(this.allDataUrl, {
        params: {
          course_id: this.courseID,
          student_id: this.stuID
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
    },
    getAllData2 () {
      if (this.courseID === '' || typeof (this.courseID) === 'undefined') {
        return
      }
      this.$http.get(this.allDataUrl2, {
        params: {
          courseId: this.courseID
        }
      })
        .then(res => {
          if (res.data.code === 1001) {
            this.allData2 = res.data.data
          } else {
            this.$Message.error(res.data.msg)
            this.allData2 = []
          }
        })
        .catch(err => {
          console.log(err)
        }).then(() => {
          this.loading = false
        })
    },
    refreshData2 () {
      this.loading = true
      this.getAllData2()
    },
    showNoticeWarning (noticeTitle, noticeDesc) {
      this.$Notice.warning({
        title: noticeTitle,
        desc: noticeDesc
      })
    },
    ok () {
      this.showModalSelectStudent = false
    },
    cancel () {
      this.showModalSelectStudent = false
    },
    ok2 () {
      if (this.totalNum > 100) {
        this.showNoticeWarning('错误', '权重总和大于100！')
        return
      } else if (this.totalNum < 100) {
        this.showNoticeWarning('错误', '权重总和小于100！')
        return
      }
      for (var i = 0; i < this.expData.length; i++) {
        let req = {
          student_id: this.userId,
          experiment_id: this.expData[i].id,
          reason: '',
          origin_score: 0,
          score: this.expWeight[i],
          appeal_time: '',
          appeal_reason: '',
          appeal_status: 0
        }
        this.$http.post('/peer/update', req)
          .then(res => {
            if (res.data.code === 1001) {
              this.$Notice.success({
                title: '提交成功',
                desc: '评分成功'
              })
            } else {
              this.$Message.error(res.data.msg)
            }
          }).catch(err => {
            console.log(err)
          })
      }
      this.showModalDistribute = false
    },
    cancel2 () {
      this.showModalDistribute = false
    },
    getExp () {
      this.$http.get('/teacher/getExperiment', {params: {course_id: this.courseID}})
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
            console.log(res.data.data)
            this.initExpWeight()
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
