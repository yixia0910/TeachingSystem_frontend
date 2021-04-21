<template>
  <div>
    <NavBar :breadlist="breadlist">
      <div slot="navbarContent">
        <CardContent title="异常虚拟机分析">
          <div class="fontsize">
            <TableComponent @refresh="refreshData" ref="table" :columnsFromFather="columns1" :allDataFromFather="allData"></TableComponent>
          </div>
        </CardContent>
        <CardContent title="异常用户分析">
          <div class="fontsize">
            <TableComponent @refresh="refreshData2" ref="table" :columnsFromFather="columns2" :allDataFromFather="allData2"></TableComponent>
          </div>
        </CardContent>
        <CardContent title="虚拟机发布分析">
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
  name: 'vmAnalysis',
  components: {
    NavBar,
    CardContent,
    TableComponent
  },
  data () {
    return {
      columns1: [
        {
          title: '序号',
          key: 'index',
          align: 'center',
          width: '70'
        },
        {
          title: '虚拟机名称',
          key: 'name'
        },
        {
          title: '学生ID',
          key: 'studentId'
        },
        {
          title: '教师ID',
          key: 'teacherId'
        },
        {
          title: '是否开机',
          key: 'isOpen'
        },
        {
          title: '磁盘(MB)',
          key: 'disk'
        },
        {
          title: '内存(MB)',
          key: 'storage'
        },
        {
          title: 'CPU数量',
          key: 'cpuNum'
        },
        {
          title: '操作系统',
          key: 'os',
          width: '150'
        },
        {
          title: 'IPV4址',
          key: 'ip'
        },
        {
          title: '用户异常原因',
          key: 'reason'
        }
      ],
      allData: [],
      allDataUrl: '/admin/exceptionVmData',
      columns2: [
        {
          title: '序号',
          key: 'index',
          align: 'center',
          width: '70'
        },
        {
          title: '用户学（工）号',
          key: 'id'
        },
        {
          title: '用户姓名',
          key: 'name'
        },
        {
          title: '用户类型',
          key: 'type'
        },
        {
          title: '个人虚拟机数量',
          key: 'number'
        }
      ],
      allData2: [],
      allDataUrl2: '/admin/exceptionUserData',
      breadlist: [
        {name: '虚拟机管理', path: '/admin/vm'},
        {name: '虚拟机分析', path: '/vm/analysis'}
      ] // 面包屑
    }
  },
  mounted () {
    this.getAllData()
    this.getAllData2()
  },
  methods: {
    getAllData () {
      this.$http.get(this.allDataUrl)
        .then(res => {
          if (res.data.code === 1001) {
            this.allData = res.data.data
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    refreshData () {
      this.getAllData()
    },
    getAllData2 () {
      this.$http.get(this.allDataUrl2)
        .then(res => {
          if (res.data.code === 1001) {
            this.allData2 = res.data.data
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    refreshData2 () {
      this.getAllData2()
    }
  }
}
</script>

<style scoped>

</style>
