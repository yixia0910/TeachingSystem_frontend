<template>
<div>
  <NavBar :username="this.$cookie.get('username')" infopage='/teacher/info' :breadlist="breadList">
    <div slot="navbarContent">
      <CardContent title="申请记录">
        <TableComponent @refresh="refreshData" :columnsFromFather="columns1" :allDataFromFather="showData">
          <ButtonGroup>
            <Button :type="currentType === 'all' ? 'primary' : 'default'" @click="currentType = 'all'"><Icon type="md-information-circle" class="buttonIcon"/>全部记录</Button>
            <Button :type="currentType === 'yes' ? 'primary' : 'default'" @click="currentType = 'yes'"><Icon type="md-checkmark-circle" class="buttonIcon"/>已处理</Button>
            <Button :type="currentType === 'no' ? 'primary' : 'default'" @click="currentType = 'no'"><Icon type="md-help-circle" class="buttonIcon"/>未处理</Button>
          </ButtonGroup>
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
  name: 'applicationManagement',
  components: {
    NavBar,
    CardContent,
    TableComponent
  },
  data () {
    return {
      currentType: 'all',
      allData: [],
      breadList: [{name: '申请记录', path: '/teacher/application'}], // 面包屑
      paramsForBackend: {
        'teacher': this.$cookie.get('username')
      },
      allDataUrl: '/teacher/applicationInfo',
      showModalAddAssistant: false,
      columns1: [
        {
          title: '虚拟机名称',
          key: 'vmName'
        },
        {
          title: '申请类型',
          key: 'applicationType'
        },
        {
          title: '申请时间',
          key: 'applicationTime'
        },
        {
          title: '是否受理',
          key: 'isHandled',
          render: (h, params) => {
            let color = ''
            let status = ''
            if (params.row.isHandled === '已通过') {
              color = 'success'
              status = '已通过'
            } else if (params.row.isHandled === '已拒绝') {
              color = 'error'
              status = '已拒绝'
            } else if (params.row.isHandled === '申请中') {
              color = 'warning'
              status = '申请中'
            }
            return h('Tag', {
              props: {
                color: color
              }
            }, status)
          }
        },
        {
          title: '受理时间',
          key: 'handledTime'
        },
        {
          title: '回复信息',
          key: 'responseMessage'
        },
        {
          title: '操作',
          key: 'oper',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'error'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    // this.deleteWorker(params.row.number)
                    // this.$router.push({
                    //     path: '/editWorker',
                    //     query: {
                    //         number: params.row.number
                    //     }
                    // })
                  }
                }
              }, '撤销')
            ])
          }
        }
      ]
    }
  },
  computed: {
    showData: function () {
      if (this.currentType === 'all') {
        return this.allData
      } else if (this.currentType === 'yes') {
        return this.allData.filter(curValue => {
          return curValue.isHandled === '已受理'
        })
      } else {
        return this.allData.filter(curValue => {
          return curValue.isHandled === '未受理'
        })
      }
    }
  },
  mounted () {
    this.getAllData()
  },
  methods: {
    refreshData () {
      this.getAllData()
    },
    getAllData () {
      this.$http.get(this.allDataUrl, this.paramsForBackend)
        .then(res => {
          if (res.data.code === 1) {
            this.allData = res.data.info
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
  .buttonIcon{
    padding-right:5px;
    padding-bottom: 3px;
  }
</style>
