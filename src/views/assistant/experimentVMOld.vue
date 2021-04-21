<template>
  <div>
    <NavBar :breadlist="breadlist">
      <div slot="navbarContent">
        <CardContent>
          <TableComponent @refresh="refreshData" :columnsFromFather="columns1" :allDataFromFather="allData">
            <Button type="primary" @click="showModalAddExpVM = true">
              <Icon type="md-add-circle" class="addIcon"/>
              <span style="font-size: 14px">为学生添加实验虚拟机</span>
            </Button>
            <Button type="info" @click="showModalChangePassword = true">
              <Icon type="md-build" class="addIcon"/>
              <span style="font-size: 14px">修改虚拟机默认密码</span>
            </Button>
          </TableComponent>
          <AddExpVMModal @refresh="refreshData" :showModalAddExpVM.sync="showModalAddExpVM" :expName="expName" :expID="expId"></AddExpVMModal>
          <CheckVMModal :showModalCheckVM.sync="showModalCheckVM" :vmName="operName" :loginIp="operIP" :OS="operOS" :loginPassword="defaultVMPWD" :consoleUrl="consoleUrl"></CheckVMModal>
          <ChangePasswordModal :showModalChangePassword.sync="showModalChangePassword" :expID="expId" :expName="expName" :expType="expType" :defaultVMPWD.sync="defaultVMPWD"></ChangePasswordModal>
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
  name: 'experimentVMOld',
  components: {CheckVMModal, ChangePasswordModal, AddExpVMModal, TableComponent, CardContent, NavBar},
  data () {
    return {
      breadlist: [
        {name: '课程管理', path: '/assistant/courseManagement'},
        {name: '实验', path: '/assistant/courseDetails'},
        {name: '虚拟机', path: '/assistant/experimentVM'}],
      courseId: JSON.parse(localStorage.getItem('paramsMessage')).courseId,
      allData: [],
      consoleUrl: '',
      allDataUrl: 'getExpVMsByExpId',
      showModalAddExpVM: false,
      showModalCheckVM: false,
      showModalChangePassword: false,
      defaultVMPWD: '',
      expName: JSON.parse(localStorage.getItem('paramsMessage')).expName,
      expType: '实验',
      expId: Number(JSON.parse(localStorage.getItem('paramsMessage')).expId),
      operOS: '',
      operIP: '',
      operName: '',
      columns1: [
        {
          title: '虚拟机名称',
          key: 'vm_name'
        },
        {
          title: '学生ID',
          key: 'user_id'
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
          key: 'Disk'
        },
        {
          title: '内存 ( MB )',
          key: 'Memory'
        },
        {
          title: 'CPU数量',
          key: 'CPU'
        },
        {
          title: '系统名称',
          key: 'GuestFullName'
        },
        {
          title: 'IPV4地址',
          key: 'IPAddress',
          align: 'center',
          width: 150
        },
        {
          title: '操作',
          key: 'oper',
          width: 200,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
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
                  type: 'primary',
                  disabled: params.row.PowerState !== 'poweredOn',
                  loading: params.row.PowerState === 'turningOff'
                },
                style: {
                  marginRight: '5px',
                  marginTop: '5px',
                  marginBottom: '5px'
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
                    this.operName = params.row.vm_name
                    this.operIP = params.row.IPAddress
                    this.operOS = params.row.GuestFullName.toLowerCase().indexOf('win') >= 0 ? 'windows' : 'linux'
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
  mounted () {
    this.getAllData()
    this.setDefaultPassword()
  },
  methods: {
    setDefaultPassword () {
      this.defaultVMPWD = JSON.parse(localStorage.getItem('paramsMessage')).defaultPassword
      if (this.defaultVMPWD === null) {
        this.defaultVMPWD = ''
      }
    },
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
      this.getAllData()
    },
    getAllData () {
      console.log(this.expId)
      this.$http.get(this.allDataUrl, {
        params: {
          expId: this.expId
        }
      })
        .then(res => {
          if (res.data.code === 1001) {
            this.allData = res.data.data
            this.allData.forEach(item => {
              item.PowerState = item.Status.PowerState
              item.RunTimeState = item.Status.RunTimeState
              item.IPAddress = item.Status.IPAddress
              delete item.Status
            })
          } else {
            this.allData = []
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

<style scoped>

</style>

