<template>
  <div>
    <NavBar :username="this.$cookie.get('username')" infopage='/teacher/info' :breadlist="breadList">
      <div slot="navbarContent">
        <CardContent>
          <AddVMModal :showModalAddVM.sync="showModalAddVM" :changeVM.sync="changeVM" :operVMConf="operVMConf" @refresh="refreshData"></AddVMModal>
          <CheckVMModal :showModalCheckVM.sync="showModalCheckVM" :vmName="operName" :loginIp="operIP" :OS="operOS" :consoleUrl="consoleUrl"></CheckVMModal>
          <TableComponent :loading="loading" @refresh="refreshData" :columnsFromFather="columns1" :allDataFromFather="allData">
            <Button type="primary" @click="changeVM = false;showModalAddVM = true">
              <span style="font-size: 14px">新增虚拟机</span>
            </Button>
          </TableComponent>
        </CardContent>
      </div>
    </NavBar>
  </div>
</template>

<script>
import NavBar from '../../components/NavBar'
import TableComponent from '../../components/TableComponent'
import CardContent from '../../components/CardContent'
import AddVMModal from '../../components/teacher/vm/vm_addVMModal'
import CheckVMModal from '../../components/teacher/checkVMModal'
import net from '../../assets/Global'
export default {
  name: 'vmManagement',
  components: {
    NavBar,
    TableComponent,
    CardContent,
    AddVMModal,
    CheckVMModal
  },
  methods: {
    showNoticeSuccess (noticeTitle, noticeDesc) {
      this.$Notice.success({
        title: noticeTitle,
        desc: noticeDesc
      })
    },
    showNoticeError (noticeTitle, noticeDesc) {
      this.$Notice.error({
        title: noticeTitle,
        desc: noticeDesc
      })
    },
    showNoticeWarning (noticeTitle, noticeDesc) {
      this.$Notice.warning({
        title: noticeTitle,
        desc: noticeDesc
      })
    },
    refreshData () {
      this.loading = true
      this.getAllData()
    },
    getAllData () {
      this.$http.get(this.allDataUrl)
        .then(res => {
          if (res.data.code === 1001) {
            this.allData = res.data.data
            if (this.allData === null) {
              this.allData = []
            }
            this.allData.forEach(item => {
              item.PowerState = item.Status.PowerState
              item.RunTimeState = item.Status.RunTimeState
              item.IPAddress = item.Status.IPAddress
              delete item.Status
              if (item.PowerState === 'ACTIVE') {
                item.PowerState = 'poweredOn'
              }
              if (item.PowerState === 'SHUTOFF') {
                item.PowerState = 'poweredOff'
              }
            })
          } else {
            this.allData = []
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log(err)
        }).then(() => {
          this.loading = false
        })
    }
  },
  mounted () {
    sessionStorage.setItem('courseDetail_courseID', -1)
    this.getAllData()
  },
  data () {
    return {
      vmtype: net.vmmanager,
      allDataUrl: 'getPerVMsByUserId',
      allData: [],
      consoleUrl: '',
      showModalAddVM: false,
      showModalCheckVM: false,
      operOS: '',
      operIP: '',
      operName: '',
      loading: true,
      breadList: [{name: '虚拟机管理', path: '/teacher/vm'}], // 面包屑
      operVMConf: {
        name: '',
        template: '',
        disk: '50G',
        memory: '1G',
        cpu: '1核'
      },
      changeVM: false,
      columns1: [
        {
          title: '序号',
          key: 'index',
          width: 80
        },
        {
          title: '虚拟机名称',
          key: 'Name',
          sortable: 'custom',
          width: 190
        },
        {
          title: '电源状态',
          key: 'PowerState',
          width: 100,
          render: (h, params) => {
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
          title: '到期时间',
          key: 'due_time',
          sortable: 'custom',
          width: 180,
          render: (h, params) => {
            let time = params.row.due_time
            if (time === null || time === '') {
              return
            }
            let curDate = new Date()
            let dueDate = new Date(time)
            return h('div', {
              style: {
                color: curDate > dueDate ? 'red' : 'black'
              }
            }, time)
          }
        },
        {
          title: '磁盘 ( MB )',
          key: 'Disk',
          width: 130,
          sortable: 'custom',
          sortType: 'number'
        },
        {
          title: '内存 ( MB )',
          key: 'Memory',
          width: 130,
          sortable: 'custom',
          sortType: 'number'
        },
        {
          title: 'CPU数量',
          key: 'CPU',
          sortable: 'custom',
          sortType: 'number',
          width: 120
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
          key: 'IPAddress',
          align: 'center',
          width: 150,
          sortable: 'custom'
        },
        {
          title: '操作',
          key: 'oper',
          width: 450,
          align: 'center',
          fixed: 'right',
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
                    this.operIP = params.row.IPAddress
                    let osType = String(params.row.GuestFullName)
                    if (osType.indexOf('Windows') === -1) {
                      this.operOS = 'linux'
                    } else {
                      this.operOS = 'windows'
                    }
                    this.consoleUrl = params.row.console_url
                    this.showModalCheckVM = true
                  }
                }
              }, '查看'),
              h('Button', {
                props: {
                  type: 'info',
                  disabled: this.vmtype === 'Sangfor'
                },
                style: {
                  marginRight: '5px',
                  marginTop: '5px',
                  marginBottom: '5px'
                },
                on: {
                  click: () => {
                    sessionStorage.setItem('snapshot_vmName', params.row.Name)
                    this.$router.push({
                      path: '/teacher/snapshot'
                    })
                  }
                }
              }, '管理快照'),
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
                    this.changeVM = true
                    this.operVMConf = {
                      name: params.row.Name,
                      template: params.row.TemplateName,
                      disk: String(params.row.Disk / 1024) + 'G',
                      memory: String(params.row.Memory / 1024) + 'G',
                      due_time: typeof params.row.due_time === 'undefined' ? '' : params.row.due_time,
                      cpu: String(params.row.CPU) + '核'
                    }
                    this.showModalAddVM = true
                  }
                }
              }, '修改'),
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
                    let that = this
                    this.$Modal.confirm({
                      title: '确认操作',
                      content: '确认申请删除虚拟机' + params.row.Name + '请点击确认。管理员通过申请后虚拟机将会被删除，无需重复请求。',
                      onOk () {
                        let postparams = {
                          vm_name: params.row.Name
                        }
                        this.$http.post('common/deleteSingleVM', postparams)
                          .then(res => {
                            if (res.data.code === 1001) {
                              that.showNoticeSuccess('成功发送删除虚拟机申请')
                            } else {
                              that.showNoticeError('发送删除虚拟机申请失败')
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
      ]
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
</style>
