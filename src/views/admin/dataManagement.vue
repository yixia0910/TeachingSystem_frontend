<template>
  <div>
    <NavBar :breadlist="breadlist">
      <div slot="navbarContent">
        <CardContent>
          <div class="data_area_title"><div class="small_block"></div>异常虚拟机分析</div>
          <div class="fontsize">
            <TableComponent @refresh="refreshVMData" ref="table" :columnsFromFather="columnsVM" :allDataFromFather="VMData">
            </TableComponent>
          </div>
          <div class="data_area_title"><div class="small_block"></div>异常用户分析</div>
          <div class="fontsize">
            <TableComponent @refresh="refreshUserData" ref="table" :columnsFromFather="columnsUser" :allDataFromFather="UserData">
            </TableComponent>
          </div>
          <div style="height: 60vh">
            <div class="data_area_title"><div class="small_block"></div>虚拟机发布分析</div>
            <div id="fan_chart" style="width: 55%; height: 100%;float: left" ref="fanChart"></div>
            <div id="cpu_chart" style="width: 45%; height: 100%;float: left" ref="cpuChart"></div>
          </div>
          <div id="mem_chart" style="width: 90%;height: 500px" ref="memChart"></div>
        </CardContent>
      </div>
    </NavBar>
  </div>
</template>
<script>
import NavBar from '../../components/NavBar'
import CardContent from '../../components/CardContent'
import TableComponent from '../../components/TableComponent'

let echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/pie')
require('echarts/lib/chart/bar')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/toolbox')
require('echarts/lib/component/legend')
require('echarts/lib/component/markLine')

export default {
  name: 'dataManagement',
  components: {CardContent, TableComponent, NavBar},
  comments: {
    NavBar,
    CardContent,
    TableComponent
  },
  data () {
    return {
      columnsVM: [
        {
          title: '序号',
          key: 'index',
          sortable: 'custom',
          sortType: 'number'
        },
        {
          title: '异常原因',
          key: 'errorType',
          align: 'center'
        },
        {
          title: '虚拟机名称',
          key: 'vm_name',
          align: 'center'
        },
        {
          title: '学生ID',
          key: 'user_id',
          sortable: 'custom'
        },
        {
          title: '教师ID',
          key: 'owner_id',
          sortable: 'custom'
        },
        {
          title: '电源状态',
          align: 'center',
          sortable: 'custom',
          render: (h, params) => {
            let color = ''
            let power = ''
            if (params.row.Status.PowerState === 'poweredOff') {
              color = 'error'
              power = '已关机'
            } else if (params.row.Status.PowerState === 'poweredOn') {
              color = 'success'
              power = '已开机'
            } else {
              color = 'warning'
              if (params.row.Status.PowerState === 'turningOn') {
                power = '开机中'
              } else {
                power = '关机中'
              }
            }
            return h('Tag', {
              props: {
                color: color
              }
            }, power)
          }
        },
        {
          title: '磁盘(MB)',
          key: 'Disk',
          sortable: 'custom'
        },
        {
          title: '内存(MB)',
          key: 'Memory',
          sortable: 'custom'
        },
        {
          title: 'CPU核心数',
          key: 'CPU',
          sortable: 'custom'
        },
        {
          title: '操作系统',
          key: 'GuestFullName',
          sortable: 'custom'
        },
        {
          title: 'IP地址',
          key: 'IPAddress',
          sortable: 'custom'
        }
      ],
      columnsUser: [
        {
          title: '序号',
          key: 'index',
          sortable: 'custom',
          sortType: 'number'
        },
        {
          title: '用户学号/工号',
          key: 'id',
          sortable: 'custom'
        },
        {
          title: '用户姓名',
          key: 'name',
          sortable: 'custom'
        },
        {
          title: '用户类型',
          key: 'role',
          sortable: 'custom'
        },
        {
          title: '个人虚拟机数量',
          key: 'vmNumber',
          sortable: 'custom',
          sortType: 'number'
        }
      ],
      VMData: [],
      UserData: [],
      MemData: [],
      CpuData: [],
      ExpCount: 0,
      PerCount: 0,
      modalAdd: false,
      name: '',
      CPU: '0',
      MEMORY: '0',
      VMNumber: '0',
      CourseNumber: '0',
      OnlineNumber: '15',
      breadlist: [{name: '平台数据', path: '/admin/data'}] // 面包屑
    }
  },
  mounted () {
    this.getAllData()
  },
  methods: {
    getAllData () {
      this.getAbnormalVMData()
      this.getAbnormalUserData()
      this.getAnalyzeData()
    },
    getAbnormalVMData () {
      this.$http.get('/admin/getAbnormalVM')
        .then(res => {
          if (res.data.code === 1001) {
            this.VMData = res.data.data
            this.VMData.forEach(item => {
              item.IPAddress = item.Status.IPAddress
            })
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    getAbnormalUserData () {
      var roleString = ['', '学生', '教师', '部门管理员', '管理员']
      this.$http.get('/admin/getAbnormalUser')
        .then(res => {
          if (res.data.code === 1001) {
            this.UserData = res.data.data
            this.UserData.forEach(item => {
              item.role = roleString[item.role]
            })
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    getAnalyzeData () {
      this.$http.get('/admin/getAnalyzeVM')
        .then(res => {
          if (res.data.code === 1001) {
            this.CpuData = res.data.data.cpuInfo
            this.MemData = res.data.data.memoryInfo
            this.ExpCount = res.data.data.experimentVm
            this.PerCount = res.data.data.personalVm
            this.MemData.sort(this.sortSize)
            this.CpuData.sort(this.sortSize)
            this.showAllCharts()
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    sortSize (a, b) {
      return a.size - b.size
    },
    showAllCharts () {
      this.showFanChart()
      this.showMemChart()
      this.showCpuChart()
    },
    refreshVMData () {
      this.getAbnormalVMData()
    },
    refreshUserData () {
      this.getAbnormalUserData()
    },
    cancel () {
      this.modalAdd = false
      this.name = ''
    },
    showFanChart () {
      let dom = this.$refs.fanChart
      this.fanChart = echarts.init(dom, null, null)
      let option = {
        title: {
          text: '虚拟机类型分布'
        },
        color: ['#5FD983', '#3FB0FF'],
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)'
        },
        series: [
          {
            type: 'pie',
            radius: ['30%', '60%'],
            avoidLabelOverlap: false,
            label: {
              formatter: '{b|{b}}\n占比：{per|{d}%}\n虚拟机数：{c}台 ',
              backgroundColor: 'rgba(0,0,0,0.4)',
              borderColor: '#aaa',
              color: '#FFFFFF',
              borderWidth: 1,
              borderRadius: 4,
              fontSize: 14,
              lineHeight: 20,
              textAlign: 'left',
              rich: {
                b: {
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: 14,
                  lineHeight: 20
                }
              }
            },
            data: [
              {value: this.ExpCount, name: '实验虚拟机'},
              {value: this.PerCount, name: '个人虚拟机'}
            ]
          }
        ]
      }
      this.fanChart.setOption(option)
    },
    showMemChart () {
      let dom = this.$refs.memChart
      this.memChart = echarts.init(dom, null, null)
      let xData = []
      let yData = []
      this.MemData.forEach(d => {
        xData.push(d.size)
        yData.push(d.number)
      })
      let option = {
        color: '#3FB0FF',
        title: {
          text: '内存大小分布'
        },
        tooltip: {},
        grid: {
          tooltip: {
            formatter: '{b}MB：{c}台'
          }
        },
        legend: {
        },
        xAxis: {
          data: xData,
          name: '内存大小'
        },
        yAxis: {
          name: '虚拟机数量'
        },
        series: [{
          type: 'bar',
          data: yData
        }]
      }
      this.memChart.setOption(option)
    },
    showCpuChart () {
      let dom = this.$refs.cpuChart
      this.cpuChart = echarts.init(dom, null, null)
      let xData = []
      let yData = []
      this.CpuData.forEach(d => {
        xData.push(d.size)
        yData.push(d.number)
      })
      let option = {
        color: '#3FB0FF',
        title: {
          text: 'CPU核心数分布'
        },
        tooltip: {},
        grid: {
          tooltip: {
            formatter: '{b}核：{c}台'
          }
        },
        legend: {
          show: false
        },
        xAxis: {
          data: xData,
          name: '核心数'
        },
        yAxis: {
          name: '虚拟机数量'
        },
        series: [{
          type: 'bar',
          data: yData,
          name: '数量'
        }]
      }
      this.cpuChart.setOption(option)
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
  .data_area_title{
    color: #4A4A4A;
    vertical-align: center;
    line-height: 40px;
    font-size: 14px;
    font-weight: 600;
    background-color: #EFF8FF;
    height: 40px;
    margin-bottom: 20px;
    margin-top: 20px;
  }
  .small_block{
    background-color: #23ABFF;
    height: 12px;
    width: 4px;
    vertical-align: center;
    float: left;
    margin-top: 14px;
    margin-left: 14px;
    margin-right: 14px;
  }
  /deep/ .ivu-col-span-15{
    display: none;
  }
  /deep/ .ivu-col-span-9{
    float: left;
    text-align: left !important;
  }
</style>
