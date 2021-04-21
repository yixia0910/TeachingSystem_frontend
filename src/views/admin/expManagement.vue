<template>
  <div>
    <NavBar :breadlist="breadlist">
      <div slot="navbarContent">
        <CardContent>
          <div class="fontsize">
            <TableComponent @refresh="refreshData" ref="table" :columnsFromFather="columns1" :allDataFromFather="showData">
              <Row style="margin-top: -16px">
                  <label style="margin-right: 5px; font-size: 18px; font-weight: 400;margin-left: 10px">学期</label>
                  <Select v-model="semesterSelect" style="width:200px" @on-change="filter">
                    <Option v-for="item in semList" :key="item.value" :value="item.value">{{ item.label }}</Option>
                  </Select>
                  <label style="margin-right: 5px; font-size: 18px; font-weight: 400;margin-left: 10px">课程</label>
                  <Select v-model="courseSelect"  style="width:200px" @on-change="filter">
                    <Option v-for="item in courseList" :key="item.value" :value="item.value">{{ item.label }}</Option>
                  </Select>
              </Row>
            </TableComponent>
            <Spin v-if="loading" fix>
              <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
              <div>数据拉取中...</div>
            </Spin>
          </div>
        </CardContent>
      </div>
    </NavBar>
  </div>
</template>

<script>
import NavBar from '../../components/NavBar'
import CardContent from '../../components/CardContent'
import TableComponent from '../../components/TableComponent'
import {mapMutations} from 'vuex'
export default {
  name: 'expManagement',
  components: {
    TableComponent,
    CardContent,
    NavBar
  },
  data () {
    return {
      columns1: [
        {
          title: '序号',
          key: 'index',
          align: 'center',
          width: '100',
          sortable: 'custom',
          sortType: 'number'
        },
        {
          title: '实验名称',
          key: 'name',
          sortable: 'custom'
        },
        {
          title: '所属课程',
          key: 'course_name',
          sortable: 'custom'
        },
        {
          title: '教师',
          key: 'teacher_name',
          sortable: 'custom'
        },
        {
          title: '学期',
          key: 'term_name',
          sortable: 'custom',
          width: 100
        },
        {
          title: '开始时间',
          key: 'start_time',
          sortable: 'custom'
        },
        {
          title: '结束时间',
          key: 'end_time',
          sortable: 'custom'
        },
        {
          title: '作业截止时间',
          key: 'deadline',
          sortable: 'custom'
        }, // TODO: 各个表格的Loading效果
        {
          title: '实验虚拟机',
          align: 'center',
          width: 130,
          render: (h, params) => {
            let code = params.row.vm_status
            let text = ''
            switch (code) {
              case -2:
                text = '创建失败'
                break
              case -1:
                text = '已删除'
                break
              case 0:
                text = '无'
                break
              case 1:
                text = '创建中'
                break
              case 2:
                text = '已创建'
                break
              default:
                break
            }
            return h('div', text)
          }
        },
        {
          title: '操作',
          key: 'oper',
          width: 120,
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
                    sessionStorage.setItem('checkHomework_breadList', JSON.stringify(this.breadlist))
                    sessionStorage.setItem('checkHomework_expID', String(params.row.id))
                    sessionStorage.setItem('checkHomework_expName', String(params.row.name))
                    sessionStorage.setItem('checkHomework_enablePeer', String(params.row.is_peer_assessment))
                    sessionStorage.setItem('checkHomework_peerStarted', String(params.row.peer_assessment_start))
                    this.$router.push({
                      path: '/teacher/homework'
                    })
                  }
                }
              }, '查看详情')
            ])
          }
        }
      ],
      allData: [],
      showData: [],
      allDataUrl: '/admin/getExperiments',
      loading: false,
      semList: [],
      courseList: [],
      semesterSelect: '全部学期',
      courseSelect: '全部课程',
      flagS: 0,
      flagC: 0,
      text: '',
      breadlist: [{name: '实验管理', path: '/admin/experiment'}] // 面包屑
    }
  },
  async mounted () {
    await this.getAllData()
    if (this.$store.getters.semesterSelect === '') {
      this.semesterSelect = this.semList[1].value
    } else {
      this.semesterSelect = this.$store.getters.semesterSelect
      this.setSemester('')
    }
    this.courseSelect = this.courseList[0].value
    this.filter()
  },
  methods: {
    ...mapMutations(['setSemester']),
    async getAllData () {
      this.loading = true
      const res = await this.$http.get(this.allDataUrl, {
        params: {
          course_id: 1
        }
      })
      this.loading = false
      if (res.data.code === 1001) {
        this.allData = res.data.data
        this.getList()
      } else {
        this.$Message.error(res.data.msg)
      }
    },
    async refreshData () {
      await this.getAllData()
      this.filter()
    },
    getList () {
      this.semList = []
      const semSet = new Set()
      this.allData.forEach(item => semSet.add(item.term_name))
      semSet.forEach(item => this.semList.push({value: item, label: item}))
      this.semList.sort((a, b) => {
        if (parseInt(a.value.substr(0, 4)) === parseInt(b.value.substr(0, 4))) {
          for (let i = 4; i < a.length; i++) {
            if (a[i] === '春') return -1
          }
          return 1
        } else {
          return parseInt(b.value.substr(0, 4)) - parseInt(a.value.substr(0, 4))
        }
      })
      this.semList.unshift({value: '全部学期', label: '全部学期'})
      this.courseList = [{value: '全部课程', label: '全部课程'}]
      const courseSet = new Set()
      this.allData.forEach(item => courseSet.add(item.course_name))
      courseSet.forEach(item => this.courseList.push({value: item, label: item}))
    },
    filter () {
      if (this.semesterSelect === '全部学期') {
        this.showData = []
        this.allData.forEach(data => this.showData.push(data))
      } else {
        this.showData = []
        this.allData.forEach(data => {
          if (data.term_name === this.semesterSelect) {
            this.showData.push(data)
          }
        })
      }
      if (this.courseSelect !== '全部课程') {
        let j = 0
        for (let i = 0; i < this.showData.length; i++) {
          if (this.showData[i].course_name === this.courseSelect) {
            this.showData[j++] = this.showData[i]
          }
        }
        this.showData.splice(j, this.showData.length - j + 1)
      }
    }
  }
}
</script>

<style scoped src="../../assets/CommonStyle.css"></style>
<style scoped>
  .modal{
    color: #777777;
    text-align: right;
  }
  .modal-header {
    font-size: x-large;
    height: 40px;
    align-content: center;
    text-align: center;
    line-height: 50px;
    color: #777777;
  }
  /deep/ .ivu-row{
    background:rgba(242,243,245,1);
    height: 80px;
    vertical-align: center;
    padding-right: 10px;
    padding-top: 20px;
  }
  .modal-row label{
    margin-top: 10px;
  }
  .modal-content{
    text-align: right;
    font-size: medium;
    font-family: 等线;
  }
  .modal-content Input{
    width: 50%;
    margin-left: 5px;
  }
</style>
