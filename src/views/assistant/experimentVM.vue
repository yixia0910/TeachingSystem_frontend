<template>
  <div>
    <NavBar :breadlist="breadList">
      <div slot="navbarContent">
        <CardContent>
          <Modal v-model="showDelete" title="删除实验虚拟机" @on-ok="deleteVM">
            将会删除《{{expName}}》实验中的所有实验虚拟机，确认删除？
          </Modal>
          <AddExpVMModal @refresh="refreshData" :showModalAddExpVM.sync="showModalAddExpVM" :expName="expName" :expID="expID"></AddExpVMModal>
          <CheckVMModal :showModalCheckVM.sync="showModalCheckVM" :vmName="operName" :loginIp="operIP" :OS="operOS" :loginPassword="defaultVMPWD" :consoleUrl="consoleUrl"></CheckVMModal>
          <ChangePasswordModal :showModalChangePassword.sync="showModalChangePassword" :expID="expID" :expName="expName" :expType="expType" :defaultVMPWD.sync="defaultVMPWD"></ChangePasswordModal>
          <TableComponent :loading="loading" @refresh="refreshData" :columnsFromFather="columns1" :allDataFromFather="allData">
            <Button @click="showModalAddExpVM = true">
              <span style="font-size: 14px; width: 200px">为学生添加实验虚拟机</span>
            </Button>
            <Button @click="showModalChangePassword = true">
              <span style="font-size: 14px">修改虚拟机默认密码</span>
            </Button>
            <Button class="delete" @click="showDelete=!showDelete">
              <span style="font-size: 14px">删除所有实验虚拟机</span>
            </Button>
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
import AddExpVMModal from '../../components/teacher/experimentalVM/experimentalVM_addExpVMModal'
import CheckVMModal from '../../components/teacher/checkVMModal'
import ChangePasswordModal from '../../components/teacher/courseDetail/courseDetail_changePasswordModal'

export default {
  name: 'experimentalVMManagement',
  components: {
    NavBar,
    CardContent,
    TableComponent,
    AddExpVMModal,
    CheckVMModal,
    ChangePasswordModal
  },
  data () {
    return {
      showDelete: false,
      allData: [],
      breadList: [
        {name: '课程管理', path: '/assistant/courseManagement'},
        {name: '实验', path: '/assistant/courseDetails'},
        {name: '虚拟机', path: '/assistant/experimentVM'}],
      consoleUrl: '',
      allDataUrl: 'getExpVMsByExpId',
      showModalAddExpVM: false,
      showModalCheckVM: false,
      showModalChangePassword: false,
      loading: true,
      defaultVMPWD: '',
      expName: '',
      expType: '实验',
      expVmName: 'virtualMachine',
      expID: -1,
      operOS: '',
      operIP: '',
      operName: '',
      columns1: [
        {
          title: '虚拟机名称',
          key: 'vm_name',
          sortable: 'custom',
          width: 200
        },
        {
          title: '学生ID',
          key: 'user_id',
          sortable: 'custom'
        },
        {
          title: '是否开机',
          key: 'PowerState',
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
          title: '磁盘 ( MB )',
          key: 'Disk',
          sortable: 'custom',
          sortType: 'number'
        },
        {
          title: '内存 ( MB )',
          key: 'Memory',
          sortable: 'custom',
          sortType: 'number'
        },
        {
          title: 'CPU数量',
          key: 'CPU',
          sortable: 'custom',
          sortType: 'number'
        },
        {
          title: '系统名称',
          key: 'GuestFullName',
          sortable: 'custom'
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
          width: 300,
          align: 'center',
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
                      vmName: params.row.vm_name,
                      option: 1
                    }
                    this.$http.post('vm/powerManage', postparams)
                      .then(res => {
                        if (res.data.code === 1001) {
                          params.row.PowerState = 'poweredOn'
                          this.showNoticeSuccess('成功开启虚拟机' + params.row.vm_name)
                        } else {
                          params.row.PowerState = 'poweredOff'
                          this.showNoticeError('开启虚拟机' + params.row.vm_name + '失败')
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
                      vmName: params.row.vm_name,
                      option: 2
                    }
                    this.$http.post('vm/powerManage', postparams)
                      .then(res => {
                        if (res.data.code === 1001) {
                          params.row.PowerState = 'poweredOff'
                          this.showNoticeSuccess('成功关闭虚拟机' + params.row.vm_name)
                        } else {
                          params.row.PowerState = 'poweredOn'
                          this.showNoticeError('关闭虚拟机' + params.row.vm_name + '失败')
                        }
                      })
                      .catch(err => {
                        console.log(err)
                        params.row.PowerState = 'poweredOn'
                      })
                  }
                }
              }, '关机'),
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
                    this.operName = params.row.vm_nameurl
                    this.operIP = params.row.IPAddress
                    this.operOS = String(params.row.GuestFullName)
                    this.consoleUrl = params.row.console_url
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
                    // 删除实验虚拟机的接口还没有
                    let that = this
                    this.$Modal.confirm({
                      title: '确认',
                      content: '确认要删除实验虚拟机' + params.row.Name + '吗？',
                      loading: true,
                      onOk () {
                        that.$http.post('vm/deleteVM', {
                          vmName: params.row.vm_name
                        }).then(res => {
                          if (res.data.code === 1001) {
                            that.showNoticeSuccess('操作成功', '已删除虚拟机' + params.row.Name)
                            that.refreshData()
                          } else {
                            that.showNoticeError('操作失败', '删除虚拟机' + params.row.Name + '失败')
                          }
                        }).then(() => {
                          this.$Modal.remove()
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
  },
  computed: {
    pageTitle: function () {
      return this.expName + '的实验虚拟机'
    }
  },
  mounted () {
    this.expID = Number(sessionStorage.getItem('experimentalVM_expID'))
    this.expName = sessionStorage.getItem('experimentalVM_expName')
    this.expType = sessionStorage.getItem('experimentalVM_expType')
    this.defaultVMPWD = sessionStorage.getItem('experimentalVM_defaultVMPWD')
    if (this.defaultVMPWD === null) {
      this.defaultVMPWD = ''
    }
    this.loading = true
    this.breadList = JSON.parse(sessionStorage.getItem('experimentalVM_fromBreadList'))
    this.breadList.push({name: this.expName + '的实验虚拟机', path: this.$route.fullPath})
    this.getAllData()
  },
  methods: {
    showNoticeWarning (noticeTitle, noticeDesc) {
      this.$Notice.warning({
        title: noticeTitle,
        desc: noticeDesc
      })
    },
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
    refreshData () {
      this.loading = true
      this.getAllData()
    },
    getAllData () {
      this.$http.get(this.allDataUrl, {
        params: {
          expId: this.expID
        }
      })
        .then(res => {
          this.loading = false
          if (res.data.code === 1001) {
            this.allData = res.data.data
            console.log(this.allData)
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
    },
    showDeleteModal () {
      this.showDelete = true
    },
    deleteVM () {
      let params = {
        expId: sessionStorage.getItem('experimentalVM_expID')
      }
      this.$http.post('virtualMachine/deleteVMForExp', params)
        .then(res => {
          if (res.data.code === 1001) {
            this.showNoticeSuccess('请求成功', '实验虚拟机稍后会依次删除')
            this.$router.push('/teacher/courseDetail')
            this.clearModal()
          } else {
            this.showNoticeError('操作失败', res.data.msg)
          }
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
.delete{
  color: #FFB0B0;
  border:1px solid #FFB0B0;
}
</style>
