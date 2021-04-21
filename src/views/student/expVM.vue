<template>
  <div>
    <NavBar :breadlist="breadlist">
      <div slot="navbarContent">
        <CardContent>
          <TableComponent @refresh="refreshData" ref="table" :columnsFromFather="columns"
                          :allDataFromFather="showData"></TableComponent>
          <CheckVMModal :showModalCheckVM.sync="showModalCheckVM" :vmName="operName" :loginIp="operIP" :OS="operOS" :loginPassword="operNewPwd" :consoleUrl="consoleUrl"></CheckVMModal>
        </CardContent>
      </div>
    </NavBar>
  </div>
</template>

<script>
import NavBar from '../../components/NavBar'
import CardContent from '../../components/CardContent'
import TableComponent from '../../components/TableComponent'
import CheckVMModal from '../../components/teacher/checkVMModal'

export default {
  name: 'expVM',
  components: {NavBar, CardContent, TableComponent, CheckVMModal},
  data () {
    return {
      consoleUrl: '',
      showModalCheckVM: false,
      operOS: '',
      operIP: '',
      operName: '',
      operNewPwd: '',
      breadlist: [
        {name: '实验虚拟机', path: '/student/expVM'}
      ],
      columns: [
        // {
        //   type: 'selection',
        //   align: 'center',
        //   width: 60
        // },
        {
          title: '虚拟机名称',
          key: 'Name'
        },
        // {
        //   title: '是否开机',
        //   key: 'isOpen'
        // },
        // {
        //   title: '状态',
        //   key: 'status'
        // },
        {
          title: '电源状态',
          key: 'PowerState',
          align: 'center',
          width: 100,
          render: (h, params) => {
            // let status = JSON.parse(params.row.status)
            let color = ''
            let power = ''
            if (params.row.PowerState === 'poweredOff') {
              color = 'error'
              power = '已关机'
            } else if (params.row.PowerState === 'poweredOn') {
              color = 'success'
              power = '已开机'
            } else {
              color = 'warning'
              if (params.row.PowerState === 'turningOn') {
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
          title: '磁盘（MB）',
          key: 'Disk'
        },
        {
          title: '内存（MB）',
          key: 'Memory'
        },
        {
          title: 'CPU数量',
          key: 'CPU'
        },
        {
          title: '系统名称',
          key: 'GuestFullName',
          width: 140,
          render: (h, params) => {
            let system = ''
            system = params.row.GuestFullName
            console.log(system)
            if (system.indexOf('Windows Server') !== -1) {
              system = 'Windows Server'
            } else if (system.indexOf('CentOS') !== -1) {
              system = 'CentOS'
            } else if (system.indexOf('Ubuntu') !== -1) {
              system = 'Ubuntu'
            } else if (system.indexOf('Windows 10') !== -1) {
              system = 'Windows 10'
            } else if (system.indexOf('Windows 7') !== -1) {
              system = 'Windows 7'
            }
            return h('div', system)
          }
        },
        {
          title: 'IPV4地址',
          key: 'ipv4'
        },
        {
          title: '操作',
          key: 'operation',
          align: 'center',
          width: 300,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'info',
                  disabled: params.row.isOpen === '已开机',
                  loading: this.wait,
                  icon: 'ios-power'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    var that = this
                    this.$Modal.confirm({
                      title: '确认',
                      content: '开机请点击确认',
                      onOk () {
                        that.wait = true
                        this.$http.post('/vm/powerManage', {
                          option: 1,
                          vmName: params.row.Name
                        }).then(res => {
                          console.log(res)
                          if (res.data.code === 1001) {
                            this.$Message.info(res.data.msg)
                            params.row.isOpen = '已开机'
                          } else {
                            this.$Message.error(res.data.msg)
                          }
                        }).then(() => {
                          that.wait = false
                          this.refreshData()
                        })
                      }
                    })
                  }
                }
              }, '开机'),
              h('Button', {
                props: {
                  type: 'error',
                  disabled: params.row.isOpen === '未开机',
                  loading: this.wait,
                  icon: 'ios-power'
                },
                style: {},
                on: {
                  click: () => {
                    var that = this
                    this.$Modal.confirm({
                      title: '确认',
                      content: '关机机请点击确认',
                      onOk () {
                        that.wait = true
                        this.$http.post('/vm/powerManage', {
                          option: 2,
                          vmName: params.row.Name
                        }).then(res => {
                          console.log(res)
                          if (res.data.code === 1001) {
                            this.$Message.info(res.data.msg)
                            params.row.isOpen = '未开机'
                          } else {
                            this.$Message.error(res.data.msg)
                          }
                        }).then(() => {
                          that.wait = false
                          this.refreshData()
                        })
                      }
                    })
                  }
                }
              }, '关机'),
              // TODO: 根据虚拟机类型判断是否有查看（直接vnc网页登录虚拟机）功能
              h('Button', {
                props: {
                  type: 'info'
                },
                style: {
                  marginLeft: '5px',
                  marginRight: '5px',
                  marginTop: '5px',
                  marginBottom: '5px'
                },
                on: {
                  click: () => {
                    this.operName = params.row.Name
                    this.operIP = params.row.Status.IPAddress
                    let osType = String(params.row.GuestFullName)
                    if (osType.indexOf('Windows') === -1) {
                      this.operOS = 'linux'
                    } else {
                      this.operOS = 'windows'
                    }
                    this.operNewPwd = params.row.AdvancedConfig
                    this.consoleUrl = params.row.console_url
                    this.showModalCheckVM = true
                  }
                }
              }, '查看')
            ])
          }
        }
      ],
      showData: [],
      wait: false
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      this.$http.get('/getUsingVMsById').then(res => {
        console.log(res)
        if (res.data.code === 1001) {
          this.showData = res.data.data
          for (let item of this.showData) {
            item.ipv4 = item.Status.IPAddress
            item.isOpen = item.Status.PowerState === 'poweredOn' ? '已开机' : '未开机'
            item.PowerState = item.Status.PowerState
            item.status = item.Status.RunTimeState
          }
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(res => {
        console.log(res)
      })
    },
    refreshData () {
      this.getData()
      this.$refs.table.changePage(1)
    }
  }
}
</script>
<style scoped src="../../assets/CommonStyle.css"></style>
<style scoped>

</style>
