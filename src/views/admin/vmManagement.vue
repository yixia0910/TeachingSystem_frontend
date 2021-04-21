<template>
  <div>
    <NavBar :breadlist="breadlist">
      <div slot="navbarContent">
        <CardContent>
          <div class="fontsize">
            <TableComponent @refresh="refreshData" ref="table" :columnsFromFather="columns1" :allDataFromFather="allData" :loading="loading" :onSelectionChangedFun="fun1">
              <Button icon="md-person-add" @click="modalAdd = true" size="large">新增虚拟机</Button>
              <Button icon="md-add-circle" @click="modalImport = true" size="large">导入虚拟机</Button>
              <Button icon="md-analytics" size="large" to="/admin/data">虚拟机分析</Button>
            </TableComponent>
          </div>
        </CardContent>
      </div>
    </NavBar>
    <Modal v-model="modalAdd" class="modal" :mask-closable="false" :closable="false">
      <p slot="header" class="modal-header">新增虚拟机</p>
      <div class="modal-content modal-row">
        <Row style="margin-top: 20px">
          <Col span="8" style="margin-top: 3px"><label>虚拟机名称</label></Col>
          <Col span="14" style="text-align: left; margin-left: 20px;"><Input v-model="vmData.vm_config.Name" placeholder="只能包含大小写字母，数字，下划线和中划线" style="width: 90%" /></Col>
        </Row>
        <Row style="margin-top: 20px">
          <Col span="8" style="margin-top: 3px"><label>模板名称</label></Col>
          <Col span="14" style="text-align: left; margin-left: 20px;">
            <Select v-model="vmData.vm_config.TemplateName" style="width:90%">
              <Option v-for="(item) in templateList" :key="item.Name" :value="item.Name" :label="item.Name+' ( ' +item.GuestFullName+' )'">
                <span>{{item.Name}}</span>
                <span style="float:right;color:#ccc">{{item.GuestFullName}}</span>
              </Option>
            </Select>
          </Col>
        </Row>
        <Row style="margin-top: 20px">
          <Col span="8" style="margin-top: 3px"><label>磁盘容量(GB)</label></Col>
          <Col span="10" style="text-align: left; margin-left: 20px;"><Input v-model="MvmData.disk"></Input></Col>
        </Row>
        <Row style="margin-top: 20px">
          <Col span="8" style="margin-top: 3px"><label>内存大小(GB)</label></Col>
          <Col span="10" style="text-align: left; margin-left: 20px;"><Input v-model="MvmData.memory"></Input></Col>
        </Row>
        <Row style="margin-top: 20px">
          <Col span="8" style="margin-top: 3px"><label>CPU核心数</label></Col>
          <Col span="10" style="text-align: left; margin-left: 20px;"><Input v-model="MvmData.cpu"></Input></Col>
        </Row>
        <Row style="margin-top: 20px">
          <Col span="8" style="margin-top: 3px"><label>使用者id</label></Col>
          <Col span="10" style="text-align: left; margin-left: 20px;"><Input v-model="vmData.user_id"></Input></Col>
        </Row>
      </div>
      <div slot="footer">
        <Button size="large" style="border: 0px" @click="cancel">取消</Button>
        <Button size="large" type="info" style="border: 0px" @click="addOk">确认</Button>
      </div>
    </Modal>
    <Modal v-model="modalImport" class="modal" :mask-closable="false" :closable="false">
      <p slot="header" class="modal-header">导入虚拟机</p>
      <div class="modal-content modal-row">
        <Row style="margin-top: 20px">
          <Col span="8" style="margin-top: 3px"><label>虚拟机名称</label></Col>
          <Col span="10" style="text-align: left; margin-left: 20px;"><Input v-model="existingVm.vm_name"/></Col>
        </Row>
        <Row style="margin-top: 20px">
          <Col span="8" style="margin-top: 3px"><label>使用者id</label></Col>
          <Col span="10" style="text-align: left; margin-left: 20px;"><Input v-model="existingVm.user_id"></Input></Col>
        </Row>
      </div>
      <div slot="footer">
        <Button size="large" style="border: 0px" @click="cancel">取消</Button>
        <Button size="large" type="info" style="border: 0px" @click="importOk">确认</Button>
      </div>
    </Modal>
    <Modal v-model="modalChangeInfo" class="modal" :mask-closable="false" :closable="false">
      <p slot="header" class="modal-header">修改信息</p>
      <div class="modal-content modal-row">
        <Row>
          <Col span="8" style="margin-top: 3px"><label>虚拟机名称</label></Col>
          <Col span="10" style="text-align: left; margin-left: 20px;"><Input disabled v-model="MvmData.vmName"></Input></Col>
        </Row>
        <Row style="margin-top: 20px">
          <Col span="8" style="margin-top: 3px"><label>磁盘容量(GB)</label></Col>
          <Col span="10" style="text-align: left; margin-left: 20px;"><Input v-model="MvmData.disk"></Input></Col>
        </Row>
        <Row style="margin-top: 20px">
          <Col span="8" style="margin-top: 3px"><label>内存大小(GB)</label></Col>
          <Col span="10" style="text-align: left; margin-left: 20px;"><Input v-model="MvmData.memory"></Input></Col>
        </Row>
        <Row style="margin-top: 20px">
          <Col span="8" style="margin-top: 3px"><label>CPU核心数</label></Col>
          <Col span="10" style="text-align: left; margin-left: 20px;"><Input v-model="MvmData.cpu"></Input></Col>
        </Row>
      </div>
      <div slot="footer">
        <Button size="large" style="border: 0px" @click="cancel">取消</Button>
        <Button size="large" type="info" style="border: 0px" @click="modifyInfoOk">确认</Button>
      </div>
    </Modal>
    <Modal v-model="modalCheck" class="modal" :mask-closable="false" :closable="false" width="35">
      <p slot="header" class="modal-header">查看</p>
      <div class="modal-content modal-row">
        <div v-if="OS === 'linux'">
          <Row style="text-align: left">1. 使用ssh登录(用于Linux系统虚拟机)<a href='https://www.baidu.com/' target="_blank">下载ssh登录工具(putty)</a></Row>
          <div style="font-size: small; font-weight: bold">
            <Row style="margin-top: 20px">
              <Col span="8"><label>登录IP</label></Col>
              <Col span="10" style="text-align: left; margin-left: 20px;"><span>{{ this.loginIp }}</span></Col>
            </Row>
            <Row style="margin-top: 10px">
              <Col span="8"><label>登录用户名</label></Col>
              <Col span="10" style="text-align: left; margin-left: 20px;"><span>{{ this.loginUserName }}</span></Col>
            </Row>
            <Row style="margin-top: 10px">
              <Col span="8"><label>登录密码</label></Col>
              <Col span="10" style="text-align: left; margin-left: 20px;"><span>{{ this.loginPwd }}</span></Col>
            </Row>
          </div>
        </div>
        <div v-if="OS === 'windows'">
          <Row style="text-align: left; margin-top: 10px">1. 使用远程桌面连接登录（用于Windows系统虚拟机）</Row>
          <div style="font-size: small; font-weight: bold">
            <Row style="margin-top: 20px">
              <Col span="8"><label>登录IP</label></Col>
              <Col span="10" style="text-align: left; margin-left: 20px;"><span>{{ this.loginIp }}</span></Col>
            </Row>
            <Row style="margin-top: 10px">
              <Col span="8"><label>登录用户名</label></Col>
              <Col span="10" style="text-align: left; margin-left: 20px;"><span>{{ this.loginUserName }}</span></Col>
            </Row>
            <Row style="margin-top: 10px">
              <Col span="8"><label>登录密码</label></Col>
              <Col span="10" style="text-align: left; margin-left: 20px;"><span>{{ this.loginPwd }}</span></Col>
            </Row>
          </div>
        </div>
<!--        <div v-if="vncUrl !== null">-->
<!--          <Row style="text-align: left; margin-top: 10px">2. 使用vnc登录</Row>-->
<!--          <div style="font-size: small; font-weight: bold"><Button>立即登录</Button></div>-->
<!--        </div>-->
        <div v-if="consoleUrl !== null && vmtype === 'Sangfor'">
          <Row style="text-align: left; margin-top: 10px">
            <Col span="8">
              <label @click="consoleLogin" style="cursor: pointer; color: dodgerblue">点此使用VNC登录</label></Col>
          </Row>
        </div>
      </div>
      <div slot="footer">
        <Button size="large" style="border: 0px" @click="cancel">返回</Button>
        <Button size="large" type="info" @click="cancel">确认</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import NavBar from '../../components/NavBar'
import CardContent from '../../components/CardContent'
import TableComponent from '../../components/TableComponent'
import AddVMModal from '../../components/teacher/vm/vm_addVMModal'
import CheckVMModal from '../../components/teacher/checkVMModal'
import net from '../../assets/Global'
export default {
  name: 'vmManagement',
  components: {
    NavBar,
    CardContent,
    TableComponent,
    AddVMModal,
    CheckVMModal
  },
  data () {
    return {
      columns1: [
        {
          title: '序号',
          key: 'index',
          align: 'center',
          width: '60'
        },
        {
          title: '虚拟机名称',
          key: 'vm_name',
          width: 190,
          align: 'center'
        },
        {
          title: '使用者ID',
          key: 'user_id',
          sortable: 'custom',
          sortType: 'number',
          width: 90,
          align: 'center'
        },
        {
          title: '拥有者ID',
          key: 'owner_id',
          sortable: 'custom',
          sortType: 'number',
          width: 90,
          align: 'center'
        },
        {
          title: '电源状态',
          width: '100',
          align: 'center',
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
          width: '120',
          sortable: 'custom',
          sortType: 'number'
        },
        {
          title: '内存(MB)',
          key: 'Memory',
          width: '120',
          sortable: 'custom',
          sortType: 'number'
        },
        {
          title: 'CPU核心数',
          key: 'CPU',
          width: '80',
          sortable: 'custom',
          sortType: 'number'
        },
        {
          title: '操作系统',
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
          width: '140',
          key: 'IPAddress'
        },
        {
          title: '使用期限',
          key: 'due_time',
          sortable: 'custom',
          width: 0
        },
        // {
        //   title: '到期时间',
        //   width: '123',
        //   key: 'due_time',
        //   sortable: 'custom'
        // },
        {
          title: '操作',
          key: 'oper',
          width: 400,
          align: 'center',
          fixed: 'right',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'success',
                  disabled: params.row.Status.PowerState === 'poweredOn',
                  loading: this.waiting
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => this.powerManage(params.row.vm_name, 1)
                }
              }, '开机'),
              h('Button', {
                props: {
                  type: 'error',
                  disabled: params.row.Status.PowerState === 'poweredOff',
                  loading: this.waiting
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => this.powerManage(params.row.vm_name, 2)
                }
              }, '关机'),
              h('Button', {
                props: {
                  type: 'info'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.loginIp = params.row.IPAddress
                    let osType = String(params.row.GuestFullName)
                    if (osType.indexOf('Windows') === -1) {
                      this.OS = 'linux'
                    } else {
                      this.OS = 'windows'
                    }
                    // this.OS = params.row.GuestFullName.toLowerCase().indexOf('win') >= 0 ? 'windows' : 'linux'
                    this.loginUserName = this.OS === 'windows' ? 'admin' : 'buaa'
                    this.loginPwd = this.OS === 'windows' ? '@buaa21' : '&shieshuyuan21'
                    this.vncUrl = this.getVncUrl(params.row.vm_name)
                    this.consoleUrl = params.row.console_url
                    this.modalCheck = true
                  }
                }
              }, '查看'),
              h('Button', {
                props: {
                  type: 'info'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.MvmData.vmName = params.row.vm_name
                    this.MvmData.disk = params.row.Disk / 1024
                    this.MvmData.memory = params.row.Memory / 1024
                    this.MvmData.cpu = params.row.CPU
                    this.modalChangeInfo = true
                  }
                }
              }, '修改信息'),
              h('Button', {
                props: {
                  type: 'error'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => this.deleteVm(params.row.vm_name)
                }
              }, '删除')
            ])
          }
        }
      ],
      vmtype: net.vmmanager,
      allData: [],
      allDataUrl: '/admin/getVm',
      consoleUrl: '',
      templateList: [],
      templateListUrl: '/vm/getTemplatesByUserId',
      modalAdd: false,
      modalImport: false,
      modalChangeInfo: false,
      modalCheck: false,
      vmData: {
        user_id: '',
        vm_config: {
          Name: '',
          CPU: 0,
          Memory: 0,
          Disk: 0,
          TemplateName: ''
        }
      },
      MvmData: {
        vmName: '',
        cpu: 0,
        memory: 0,
        disk: 0
      },
      existingVm: {
        vm_name: '',
        user_id: ''
      },
      OS: '',
      loginIp: '',
      loginUserName: '',
      loginPwd: '',
      vncUrl: '',
      loading: true,
      waiting: false,
      object: [],
      row: {},
      breadlist: [{name: '虚拟机管理', path: '/admin/vm'}] // 面包屑
    }
  },
  mounted () {
    this.getAllData()
    this.getTemplateList()
  },
  methods: {
    consoleLogin () {
      this.loginUrl = this.consoleUrl
      let userAgent = navigator.userAgent.toLowerCase()
      if (userAgent.indexOf('firefox') > -1 || userAgent.indexOf('edge') > -1) {
        window.open(this.loginUrl, 'noVnc', 'toolbar=no, menubar=no, scrollbars=no, location=no, status=no')
      } else if (userAgent.indexOf('chrome') > -1) {
        let that = this
        this.$Modal.confirm({
          title: '您的浏览器是Chrome',
          content: '如果Chrome浏览器无法正常打开，请请理cookie后重试',
          okText: '立即登录',
          width: '450px',
          onOk: () => {
            window.open(this.loginUrl, 'noVnc', 'toolbar=no, menubar=no, scrollbars=no, location=no, status=no')
            that.$emit('update:showModalCheckVM', false)
          }
        })
      } else {
        let that = this
        this.$Modal.confirm({
          title: '您的浏览器可能无法正常登录',
          content: '如果无法正常登录，请使用Firefox/Chrome/Edge',
          okText: '立即登录',
          width: '450px',
          onOk: () => {
            window.open(this.loginUrl)
            that.$emit('update:showModalCheckVM', false)
          }
        })
      }
    },
    getAllData () {
      this.loading = true
      this.$http.get(this.allDataUrl)
        .then(res => {
          if (res.data.code === 1001) {
            this.allData = res.data.data
            this.allData.forEach(item => {
              item.IPAddress = item.Status.IPAddress
            })
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
        .then(() => {
          this.loading = false
          console.log(this.allData)
        })
    },
    getTemplateList () {
      this.$http.get(this.templateListUrl)
        .then(res => {
          if (res.data.code === 1001) {
            this.templateList = res.data.data
          } else {
            this.$Message.error(res.data.msg)
          }
        })
    },
    refreshData () {
      this.getAllData()
    },
    fun1 (object, row) {
      this.object = object
      this.row = row
    },
    modifyInfoOk () {
      if (this.MvmData.vmName === '' || this.MvmData.cpu === '' || this.MvmData.memory === '' || this.MvmData.disk === '') {
        this.$Message.info('请完善表格内容')
      } else {
        this.loading = true
        this.MvmData.cpu = parseInt(this.MvmData.cpu)
        this.MvmData.memory = parseInt(this.MvmData.memory) * 1024
        this.MvmData.disk = parseInt(this.MvmData.disk) * 1024
        console.log(this.MvmData)
        this.$http.post('/vm/changeConfig', this.MvmData)
          .then(res => {
            if (res.data.code === 1001) {
              this.$Message.info('修改成功')
              this.refreshData()
            } else {
              this.$Message.error(res.data.msg)
              this.loading = false
            }
          })
        this.cancel()
      }
    },
    addOk () {
      if (this.vmData.vmName === '' || this.vmData.cpu === '' || this.vmData.memory === '' || this.vmData.disk === '' ||
        this.vmData.vm_config.TemplateName === '' || this.vmData.user_id === '') {
        this.$Message.info('请完善表格内容')
      } else {
        this.loading = true
        this.MvmData.cpu = parseInt(this.MvmData.cpu)
        this.MvmData.memory = parseInt(this.MvmData.memory) * 1024
        this.MvmData.disk = parseInt(this.MvmData.disk) * 1024
        this.vmData.vm_config.CPU = this.MvmData.cpu
        this.vmData.vm_config.Disk = this.MvmData.disk
        this.vmData.vm_config.Memory = this.MvmData.memory
        console.log(this.vmData)
        this.$http.post('/vm/createVM', this.vmData)
          .then(res => {
            console.log(this.vmData)
            if (res.data.code === 1001) {
              this.$Message.info('创建正在进行,稍后查看')
              this.refreshData()
            } else {
              this.$Message.error(res.data.msg)
              this.loading = false
            }
          })
        this.cancel()
      }
    },
    importOk () {
      if (this.existingVm.vm_name === '' || this.existingVm.user_id === '') {
        this.$Message.info('请完善表格内容')
      } else {
        this.loading = true
        this.$http.post('/vm/addExistingVM', this.existingVm)
          .then(res => {
            console.log(this.existingVm)
            if (res.data.code === 1001) {
              this.$Message.info('新增成功')
              this.refreshData()
            } else {
              this.$Message.error(res.data.msg)
              this.loading = false
            }
          })
        this.cancel()
      }
    },
    cancel () {
      this.modalChangeInfo = false
      this.modalAdd = false
      this.modalCheck = false
      this.modalImport = false
      this.vmData = {
        user_id: '',
        vm_config: {Name: '', CPU: 0, Memory: 0, Disk: 0, TemplateName: ''}
      }
      this.MvmData = {vmName: '', cpu: 0, memory: 0, disk: 0}
      this.existingVm = {vm_name: '', user_id: ''}
    },
    deleteVm (name) {
      this.$Modal.confirm({
        title: '确认删除',
        content: '<p>您确认删除该虚拟机吗？</p>',
        onOk: () => {
          this.loading = true
          this.$http.post('/vm/deleteVM', {
            vmName: name
          })
            .then(res => {
              if (res.data.code === 1001) {
                this.$Message.info('删除成功')
                this.refreshData()
              } else {
                this.$Message.error(res.data.msg)
                this.loading = true
              }
            })
        },
        onCancel: () => {
          this.$Message.info('取消操作')
        }
      })
    },
    powerManage (name, status) {
      this.waiting = true
      this.$http.post('vm/powerManage', {
        vmName: name,
        option: status
      })
        .then(res => {
          if (res.data.code === 1001) {
            this.refreshData()
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .then(() => {
          this.waiting = false
        })
    },
    getVncUrl (vmName) {
      this.$http.get('vm/getConsole', {
        vm_name: vmName
      })
        .then(res => {
          if (res.data.code === 1001) {
            this.vncUrl = res.data.data
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
        .then(() => {
          console.log(this.vncUrl)
        })
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
</style>
