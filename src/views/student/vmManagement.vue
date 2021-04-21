<template>
  <div>
    <NavBar :breadlist="breadlist">
      <div slot="navbarContent">
        <CardContent>
          <AddVMModal :showModalAddVM.sync="showModalAddVM"></AddVMModal>
          <CheckVMModal :showModalCheckVM.sync="showModalCheckVM" :vmName="operName" :loginIp="operIP" :OS="operOS" :consoleUrl="consoleUrl"></CheckVMModal>
          <TableComponent :loading="load" @refresh="refreshData" ref="table" :columnsFromFather="columns" :allDataFromFather="showData">
            <Button type="primary" @click="showModalAddVM = true">
              <Icon type="md-add-circle" class="addIcon"/>
              <span style="font-size: 14px">新增虚拟机</span>
            </Button>
          </TableComponent>>
        </CardContent>
      </div>
    </NavBar>
  </div>
</template>

<script>
import NavBar from '../../components/NavBar'
import CardContent from '../../components/CardContent'
import TableComponent from '../../components/TableComponent'
import AddVMModal from '../../components/teacher/vm/vm_addVMModal'
import CheckVMModal from '../../components/teacher/checkVMModal'
export default {
  name: 'vmManagement',
  components: {AddVMModal, TableComponent, CardContent, NavBar, CheckVMModal},
  data () {
    return {
      consoleUrl: '',
      showModalCheckVM: false,
      operOS: '',
      operIP: '',
      operName: '',
      breadlist: [
        {name: '实验虚拟机', path: '/student/vmManagement'}
      ],
      columns: [
        {
          title: '虚拟机名称',
          key: 'Name'
        },
        {
          title: '到期时间',
          key: 'due_time'
        },
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
        // {
        //   title: '状态',
        //   key: 'status'
        // },
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
        // {
        //   title: '到期时间',
        //   key: 'due_time'
        // },
        {
          title: '操作',
          key: 'operation',
          align: 'center',
          width: 300,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'success',
                  disabled: params.row.PowerState !== 'poweredOff',
                  loading: params.row.PowerState === 'turningOn'
                },
                style: {
                  marginRight: '5px',
                  marginTop: '5px',
                  marginBottom: '5px'
                },
                on: {
                  click: () => {
                    params.row.PowerState = 'turningOn'
                    let postparams = {
                      vmName: params.row.Name,
                      option: 1
                    }
                    this.$http.post('vm/powerManage', postparams)
                      .then(res => {
                        if (res.data.code === 1001) {
                          params.row.PowerState = 'poweredOn'
                          this.showNoticeSuccess('成功开启虚拟机' + params.row.Name)
                        } else {
                          params.row.PowerState = 'poweredOff'
                          this.showNoticeError('开启虚拟机' + params.row.Name + '失败')
                        }
                      })
                      .catch(err => {
                        console.log(err)
                        params.row.PowerState = 'poweredOff'
                      })
                  }
                }
              }, '开机'),
              h('Button', {
                props: {
                  type: 'error',
                  disabled: params.row.PowerState !== 'poweredOn',
                  loading: params.row.PowerState === 'turningOff'
                },
                style: {
                  marginRight: '5px',
                  marginTop: '5px',
                  marginBottom: '5px',
                  border: params.row.PowerState === 'poweredOn' ? '1px solid #FF7875' : ''
                },
                on: {
                  click: () => {
                    params.row.PowerState = 'turningOff'
                    let postparams = {
                      vmName: params.row.Name,
                      option: 2
                    }
                    this.$http.post('vm/powerManage', postparams)
                      .then(res => {
                        if (res.data.code === 1001) {
                          params.row.PowerState = 'poweredOff'
                          this.showNoticeSuccess('成功关闭虚拟机' + params.row.Name)
                        } else {
                          params.row.PowerState = 'poweredOn'
                          this.showNoticeError('关闭虚拟机' + params.row.Name + '失败')
                        }
                      })
                      .catch(err => {
                        console.log(err)
                        params.row.PowerState = 'poweredOn'
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
                    console.log(params.row)
                    this.consoleUrl = params.row.console_url
                    console.log(this.consoleUrl)
                    this.showModalCheckVM = true
                  }
                }
              }, '查看'),
              h('Button', {
                props: {
                  type: 'error'
                },
                style: {
                  marginRight: '5px',
                  marginTop: '5px',
                  marginBottom: '5px'
                },
                on: {
                  click: () => {
                    this.$Modal.confirm({
                      title: '确认操作',
                      content: '确认删除虚拟机' + params.row.Name + '请点击确认',
                      onOk () {
                        let postparams = {
                          vm_name: params.row.Name
                        }
                        this.$http.post('common/deleteSingleVM', postparams)
                          .then(res => {
                            if (res.data.code === 1001) {
                              console.log(res.data.msg)
                              this.$Notice.success('成功删除虚拟机' + params.row.name)
                            } else {
                              console.log(res.data.msg)
                              this.$Notice.error('删除虚拟机' + params.row.name + '失败')
                            }
                          })
                          .catch(err => {
                            console.log(err)
                          })
                      }
                    })
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      showData: [],
      wait: false,
      load: true,
      showModalAddVM: false
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      this.load = true
      this.$http.get('/getPerVMsByUserId').then(res => {
        this.load = false
        if (res.data.code === 1001) {
          this.showData = res.data.data
          console.log(this.showData)
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
