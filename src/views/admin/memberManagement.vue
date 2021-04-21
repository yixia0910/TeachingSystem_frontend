<template>
  <div>
    <NavBar :breadlist="breadlist">
      <div slot="navbarContent">
        <CardContent>
          <div class="fontsize">
            <TableComponent @refresh="refreshData" ref="table" :columnsFromFather="columns1" :allDataFromFather="allData" :onSelectionChangedFun="fun1" :loading="spinShow">
              <div class="button-area" v-if="selectMember === 1">
                <div style="margin-right: 10px"><Button class="add-user" @click="modalAdd = true" size="large">新增学生</Button></div>
                <div style="margin-right: 10px">
                  <Upload action="" accept=".xls,.xlsx" :before-upload="uploadHandle">
                    <Button class="batch-user" size="large">批量导入</Button>
                  </Upload>
                </div>
                <div><a class="link" download="学生导入模板.xls" href="/static/student.xls">下载导入模板</a></div>
              </div>
              <div class="button-area" v-if="selectMember === 2">
                <div style="margin-right: 10px"><Button class="add-user" @click="modalAdd = true" size="large">新增教师</Button></div>
                <div style="margin-right: 10px"><Upload action="" accept=".xls,.xlsx" :before-upload="uploadHandle">
                  <Button class="batch-user" size="large">批量导入</Button>
                </Upload></div>
                <div><a class="link" download="教师导入模板.xls" href="/static/teacher.xls">下载导入模板</a></div>
              </div>
              <div class="button-area" v-if="selectMember === 3">
                <div style="margin-right: 10px"><Button class="add-user"  @click="modalAdd = true" size="large">新增部门管理员</Button></div>
              </div>
              <div class="select-area">
                <span style="font-size: 18px;font-weight: 500;margin-left: 30px;margin-top: 10px;margin-right: 10px;">分类筛选</span>
                <Select v-if="this.role === 'superAdmin'" v-model="selectMember" size="large" style="width: 240px" @on-change="getAllData">
                  <Option v-for="item in memberList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <Select v-if="this.role === 'admin'" v-model="selectMember" size="large" style="width: 240px" @on-change="getAllData">
                  <Option v-for="item in memberList2" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
              </div>
            </TableComponent>
            <div>
              <Button class="delete-user"  @click="deleteStu(-1)">删除</Button>
            </div>
          </div>
        </CardContent>
      </div>
    </NavBar>
    <Modal v-model="modalAdd" class="modal" :mask-closable="false" :closable="false">
      <p slot="header" class="modal-header">新增{{ this.nowRole }}</p>
      <div class="modal-content modal-row">
        <Row v-if="this.nowRole === '学生'">
          <Col span="9" style="margin-top: 3px"><label>学生学号</label></Col>
          <Col span="10" style="text-align: left; margin-left: 10px;"><Input v-model="stuData.id"></Input></Col>
        </Row>
        <Row v-if="this.nowRole === '教师'">
          <Col span="9" style="margin-top: 3px"><label>教师工号</label></Col>
          <Col span="10" style="text-align: left; margin-left: 10px;"><Input v-model="stuData.id"></Input></Col>
        </Row>
        <Row v-if="this.nowRole === '管理员'">
          <Col span="9" style="margin-top: 3px"><label>管理员ID</label></Col>
          <Col span="10" style="text-align: left; margin-left: 10px;"><Input v-model="stuData.id"></Input></Col>
        </Row>
        <Row style="margin-top: 20px">
          <Col span="9" style="margin-top: 3px"><label>{{ this.nowRole }}姓名</label></Col>
          <Col span="10" style="text-align: left; margin-left: 10px;"><Input v-model="stuData.name"></Input></Col>
        </Row>
        <Row style="margin-top: 20px">
          <Col span="9" style="margin-top: 3px"><label>学院</label></Col>
          <Col span="14" style="text-align: left; margin-left: 10px;">
            <Select v-model="stuData.department_id" style="width:70%">
              <Option v-for="item in departmentList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </Col>
        </Row>
        <Row style="margin-top: 20px">
          <Col span="9" style="margin-top: 3px"><label>Email</label></Col>
          <Col span="10" style="text-align: left; margin-left: 10px;"><Input v-model="stuData.email"></Input></Col>
        </Row>
      </div>
      <div slot="footer">
        <Button size="large" style="border: 0px" @click="cancel">取消</Button>
        <Button size="large" type="info" style="border: 0px" @click="addOk">确认</Button>
      </div>
    </Modal>
    <Modal v-model="modalChangePwd" class="modal" :mask-closable="false" :closable="false">
      <p slot="header" class="modal-header">修改密码</p>
      <div class="modal-content modal-row">
        <Row>
          <Col span="6" style="margin-top: 3px"><label>密码</label></Col>
          <Col span="14" style="text-align: left; margin-left: 10px;">
            <Input v-model="newPwdData.passwd" type="password" placeholder="至少6位、至多15位字符，包含字母、数字和字符"></Input>
          </Col>
        </Row>
      </div>
      <div slot="footer">
        <Button size="large" style="border: 0px" @click="cancel">取消</Button>
        <Button size="large" type="info" style="border: 0px" @click="modifyPwdOk">确认</Button>
      </div>
    </Modal>
    <Modal v-model="modalChangeInfo" class="modal" :mask-closable="false" :closable="false">
      <p slot="header" class="modal-header">修改{{ this.nowRole }}信息</p>
      <div class="modal-content modal-row">
        <Row v-if="nowRole === '教师'">
          <Col span="9" style="margin-top: 3px"><label>教师工号</label></Col>
          <Col span="10" style="text-align: left; margin-left: 10px;">
            <Input disabled v-model="MstuData.id"></Input>
          </Col>
        </Row>
        <Row v-else>
          <Col span="9" style="margin-top: 3px"><label>{{ this.nowRole }}ID</label></Col>
          <Col span="10" style="text-align: left; margin-left: 10px;">
            <Input disabled v-model="MstuData.id"></Input>
          </Col>
        </Row>
        <Row style="margin-top: 20px">
          <Col span="9" style="margin-top: 3px"><label>{{ this.nowRole }}姓名</label></Col>
          <Col span="10" style="text-align: left; margin-left: 10px;"><Input v-model="MstuData.name"></Input></Col>
        </Row>
        <Row style="margin-top: 20px">
          <Col span="9" style="margin-top: 3px"><label>学院</label></Col>
          <Col span="14" style="text-align: left; margin-left: 10px;">
            <Select style="width:70%" v-model="MstuData.department_id">
              <Option v-for="item in departmentList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </Col>
        </Row>
        <Row style="margin-top: 20px">
          <Col span="9" style="margin-top: 3px"><label>Email</label></Col>
          <Col span="10" style="text-align: left; margin-left: 10px;"><Input v-model="MstuData.email"></Input></Col>
        </Row>
      </div>
      <div slot="footer">
        <Button size="large" style="border: 0px" @click="cancel">取消</Button>
        <Button size="large" type="info" style="border: 0px" @click="modifyInfoOk">确认</Button>
      </div>
    </Modal>
    <Modal v-model="modalConfirmChangePwd" title="确认修改密码" @on-ok="modalChangePwd = true" @on-cancel="cancel">
      <span>确认修改 {{ this.thisStudent }} 的密码吗？</span>
    </Modal>
  </div>
</template>

<script>
import NavBar from '../../components/NavBar'
import CardContent from '../../components/CardContent'
import TableComponent from '../../components/TableComponent'
// eslint-disable-next-line no-unused-vars
import backend from '../../assets/Global'
export default {
  name: 'memberManagement',
  components: {
    NavBar,
    CardContent,
    TableComponent
  },
  data () {
    return {
      columns1: [
        {
          type: 'selection',
          width: '50'
        },
        {
          title: 'ID',
          key: 'id',
          sortable: 'custom',
          sortType: 'number'
        },
        {
          title: '姓名',
          key: 'name',
          sortable: 'custom'
        },
        {
          title: '学院',
          key: 'department_name',
          sortable: 'custom'
        },
        {
          title: 'Email',
          key: 'email',
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
                  type: 'info'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.MstuData.id = params.row.id
                    this.MstuData.name = params.row.name
                    this.MstuData.department_id = params.row.department_id
                    this.MstuData.email = params.row.email
                    this.modalChangeInfo = true
                  }
                }
              }, '修改信息'),
              h('Button', {
                props: {
                  type: 'info'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.newPwdData.id = params.row.id
                    this.thisStudent = params.row.name
                    this.modalConfirmChangePwd = true
                  }
                }
              }, '修改密码'),
              h('Button', {
                props: {
                  type: 'error'
                },
                style: {
                  marginRight: '5%'
                },
                on: {
                  click: () => this.deleteStu(params.row.id)
                }
              }, '删除')
            ])
          }
        }
      ],
      memberList: [
        {
          value: 1,
          label: '全部学生'
        },
        {
          value: 2,
          label: '全部教师'
        },
        {
          value: 3,
          label: '全部部门管理员'
        }
      ],
      memberList2: [
        {
          value: 1,
          label: '全部学生'
        },
        {
          value: 2,
          label: '全部教师'
        }
      ],
      role: this.$cookie.get('role'),
      allData: [],
      stuDataUrl: 'admin/getStudent',
      teacherDataUrl: '/admin/getTeacher',
      adminDataUrl: '/admin/getDepartmentAdmin',
      departmentList: [],
      departmentListUrl: '/teacher/listCollege',
      selectMember: 1,
      addStudentUrl: '/admin/addStudent',
      addTeacherUrl: '/admin/addTeacher',
      addAdminUrl: '/admin/addDepartmentAdmin',
      batchAddStuUrl: '/admin/batchAddStudent',
      batchAddTeacherUrl: '/admin/batchAddTeacher',
      batchAddUrl: '',
      addUrl: '',
      modalAdd: false,
      modalChangePwd: false,
      modalChangeInfo: false,
      modalConfirmChangePwd: false,
      spinShow: false,
      selectNumber: 0,
      nowRole: '学生',
      stuData: {
        id: '',
        name: '',
        department_id: '',
        email: ''
      },
      MstuData: {
        id: '',
        name: '',
        department_id: '',
        email: ''
      },
      newPwdData: {
        id: '',
        passwd: ''
      },
      thisStudent: '',
      file: null,
      loadingStatus: false,
      removeId: [],
      object: [],
      row: {},
      breadlist: [{name: '人员管理', path: '/admin/member'}] // 面包屑
    }
  },
  mounted () {
    this.spinShow = true
    this.getAllData()
    this.getDepartment()
  },
  methods: {
    getAllData () {
      let allDataUrl = ''
      switch (this.selectMember) {
        case 1:
          allDataUrl = this.stuDataUrl
          this.nowRole = '学生'
          this.addUrl = this.addStudentUrl
          this.batchAddUrl = this.batchAddStuUrl
          break
        case 2:
          allDataUrl = this.teacherDataUrl
          this.nowRole = '教师'
          this.addUrl = this.addTeacherUrl
          this.batchAddUrl = this.batchAddTeacherUrl
          break
        case 3:
          allDataUrl = this.adminDataUrl
          this.nowRole = '管理员'
          this.addUrl = this.addAdminUrl
          break
        default:
          break
      }
      this.$http.get(allDataUrl)
        .then(res => {
          if (res.data.code === 1001) {
            this.spinShow = false
            this.allData = res.data.data
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    getDepartment () {
      this.$http.post(this.departmentListUrl)
        .then(res => {
          if (res.data.code === 1001) {
            let list = res.data.data
            list.forEach(item => {
              let department = {'value': item.id, 'label': '[' + item.id + '] ' + item.name}
              this.departmentList.push(department)
            })
          } else {
            this.$Message.error(res.data.msg)
          }
        })
    },
    refreshData () {
      this.spinShow = true
      this.getAllData()
    },
    fun1 (object, row) {
      this.object = object
      this.row = row
    },
    uploadHandle (file) {
      this.upload(file)
      return false
    },
    upload (file) {
      let formData = new FormData()
      formData.append('file', file)
      this.$http.post(this.batchAddUrl, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(res => {
        if (res.data.code === 1001) {
          this.$Message.info('上传成功')
          this.refreshData()
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    judgePwd (pwd) {
      let pattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[#?!@$%^&*_+,.';:"]).{6,15}$/
      if (pwd === '') {
        this.$Notice.warning({title: '请输入密码！'})
        return false
      } else if (pwd.length < 6) {
        this.$Notice.warning({title: '新密码至少6位字符'})
        return false
      } else if (pwd.length > 15) {
        this.$Notice.warning({title: '新密码至多15位字符'})
        return false
      } else if (pwd.indexOf('-') !== -1) {
        this.$Notice.warning({title: '不允许含有"-"符号'})
        return false
      } else if (pattern.test(pwd) === false) {
        this.$Notice.warning({title: '需要包含字母、数字和字符</br>其中符号不允许包含斜杠、反斜杠和括号'})
        return false
      } else {
        return true
      }
    },
    modifyPwdOk () {
      if (this.judgePwd(this.newPwdData.passwd) === true) {
        this.newPwdData.passwd = this.$sha1(this.newPwdData.passwd)
        this.newPwdData.passwd = this.newPwdData.passwd.toUpperCase()
        this.$http.post('/admin/changeUserPassword', this.newPwdData)
          .then(res => {
            if (res.data.code === 1001) {
              console.log(this.newPwdData)
              this.$Message.info('修改成功')
              this.refreshData()
            } else {
              this.$Message.error(res.data.msg)
            }
          })
          .then(() => {
            this.cancel()
          })
      } else {
        this.newPwdData.passwd = ''
      }
    },
    modifyInfoOk () {
      if (this.MstuData.department_id === '' || this.MstuData.name === '' || this.MstuData.email === '') {
        this.$Message.info('请完善表格内容')
      } else {
        this.$http.post('/admin/changeUserInfo', this.MstuData)
          .then(res => {
            if (res.data.code === 1001) {
              console.log(this.MstuData)
              this.$Message.info('修改成功')
              this.refreshData()
            } else {
              this.$Message.error(res.data.msg)
            }
          })
        this.cancel()
      }
    },
    addOk () {
      if (this.stuData.id === '' || this.stuData.department_id === '' || this.stuData.name === '' || this.stuData.email === '') {
        this.$Message.info('请完善表格内容')
      } else {
        this.$http.post(this.addUrl, this.stuData)
          .then(res => {
            if (res.data.code === 1001) {
              console.log(this.stuData)
              this.$Message.info('新增成功')
              this.refreshData()
            } else {
              this.$Message.error(res.data.msg)
            }
          })
        this.cancel()
      }
    },
    deleteOk () {
      console.log(this.removeId)
      this.$http.post('/admin/deleteUsers', {
        userid: this.removeId
      })
        .then(res => {
          if (res.data.code === 1001) {
            console.log(this.removeId)
            this.$Message.info('删除成功')
            this.refreshData()
          } else {
            this.$Message.error(res.data.msg)
          }
        })
    },
    cancel () {
      this.modalChangePwd = false
      this.modalConfirmChangePwd = false
      this.modalChangeInfo = false
      this.modalAdd = false
      this.stuData = {id: '', name: '', department_id: '', email: ''}
      this.MstuData = {id: '', name: '', department_id: '', email: ''}
      this.newPwdData = {id: '', passwd: ''}
    },
    deleteStu (flag) {
      if (flag === -1) {
        this.selectNumber = this.object.length
        if (this.selectNumber !== 0) {
          this.$Modal.confirm({
            title: '确认删除',
            content: '<p>您确认删除该' + this.selectNumber.toString() + '名' + this.nowRole + '吗？',
            onOk: () => {
              this.removeId = []
              this.object.forEach(res => {
                this.removeId.push(res.id)
              })
              this.deleteOk()
            },
            onCancel: () => {
              this.$Message.info('取消操作')
            }
          })
        } else {
          this.$Message.info('请选择要删除的学生')
        }
      } else {
        this.$Modal.confirm({
          title: '确认删除',
          content: '<p>您确认删除该名' + this.nowRole + '吗？</p>',
          onOk: () => {
            this.removeId = []
            this.removeId.push(flag)
            this.deleteOk()
          },
          onCancel: () => {
            this.$Message.info('取消操作')
          }
        })
      }
    }
  }
}
</script>

<style scoped src="../../assets/CommonStyle.css"></style>
<style scoped>
  .link{
    line-height: 50px;
    color: #23ABFF;
    cursor: pointer;
    font-size: 18px;
    font-weight: 500;
    vertical-align: center;
    margin-top: 0 !important;
  }
  .button-area{
    display: flex;
    margin-top: -15px;
    margin-bottom: 15px;
    background: #FFFFFF !important;
    width:160%;
  }
  /deep/ .ivu-row{
    background:rgba(242,243,245,1);
    height: 100px;
    vertical-align: center;
  }
  /deep/ .ivu-select-selected-value{
    width:90px;
    height:18px;
    font-size:18px;
    font-weight:400;
    color:rgba(96,98,102,1);
    line-height:18px;
  }
  /deep/ .ivu-col-span-9{
    margin-top: 52px;
    margin-left: -30px;
  }
  .add-user{
    margin-left: 0;
    width:160px;
    height:50px;
    background:rgba(35,171,255,1);
    border-radius:4px;
    font-size:18px;
    color:rgba(255,255,255,1);
    line-height:14px;
  }
  .batch-user{
    width:110px;
    height:50px;
    background:rgba(236,245,255,1);
    border-radius:3px;
    font-size:18px;
    font-weight:400;
    color:rgba(35,171,255,1);
    line-height:14px;
  }
  .delete-user{
    margin-top: -60px;
    margin-left: 0;
    width:60px;
    height:28px;
    background:rgba(255,255,255,1);
    border-radius:3px;
    border:1px solid rgba(220,223,230,1);
    font-size:13px;
    font-weight:400;
    color:rgba(255,120,117,1);
    line-height:18px;
  }
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
