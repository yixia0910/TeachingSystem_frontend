<template>
  <div>
    <NavBar :breadlist="breadlist">
      <div slot="navbarContent">
        <CardContent>
          <div class="fontsize">
            <TableComponent @refresh="refreshData" ref="table" :columnsFromFather="columns1" :allDataFromFather="allData" :onSelectionChangedFun="fun1">
              <Button icon="md-person-add" @click="modalAdd = true" size="large">新增部门管理员</Button>
              <Button icon="md-close" size="large" @click="deleteStu(-1)">删除</Button>
            </TableComponent>
          </div>
        </CardContent>
      </div>
    </NavBar>
    <Modal v-model="modalAdd" class="modal" :mask-closable="false" :closable="false">
      <p slot="header" class="modal-header">新增部门管理员</p>
      <div class="modal-content modal-row">
        <Row>
          <Col span="9" style="margin-top: 3px"><label>管理员ID</label></Col>
          <Col span="10" style="text-align: left; margin-left: 10px;"><Input v-model="adminData.id"></Input></Col>
        </Row>
        <Row style="margin-top: 20px">
          <Col span="9" style="margin-top: 3px"><label>管理员姓名</label></Col>
          <Col span="10" style="text-align: left; margin-left: 10px;"><Input v-model="adminData.name"></Input></Col>
        </Row>
        <Row style="margin-top: 20px">
          <Col span="9" style="margin-top: 3px"><label>学院</label></Col>
          <Col span="14" style="text-align: left; margin-left: 10px;">
            <Select v-model="adminData.department_id" style="width:70%">
              <Option v-for="item in departmentList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </Col>
        </Row>
        <Row style="margin-top: 20px">
          <Col span="9" style="margin-top: 3px"><label>Email</label></Col>
          <Col span="10" style="text-align: left; margin-left: 10px;"><Input v-model="adminData.email"></Input></Col>
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
          <Col span="9" style="margin-top: 3px"><label>密码</label></Col>
          <Col span="10" style="text-align: left; margin-left: 10px;"><Input v-model="newPwdData.passwd" type="password"></Input></Col>
        </Row>
      </div>
      <div slot="footer">
        <Button size="large" style="border: 0px" @click="cancel">取消</Button>
        <Button size="large" type="info" style="border: 0px" @click="modifyPwdOk">确认</Button>
      </div>
    </Modal>
    <Modal v-model="modalChangeInfo" class="modal" :mask-closable="false" :closable="false">
      <p slot="header" class="modal-header">修改信息</p>
      <div class="modal-content modal-row">
        <Row>
          <Col span="9" style="margin-top: 3px"><label>管理员ID</label></Col>
          <Col span="10" style="text-align: left; margin-left: 10px;">
            <Input disabled v-model="MadminData.id"></Input>
          </Col>
        </Row>
        <Row style="margin-top: 20px">
          <Col span="9" style="margin-top: 3px"><label>管理员姓名</label></Col>
          <Col span="10" style="text-align: left; margin-left: 10px;"><Input v-model="MadminData.name"></Input></Col>
        </Row>
        <Row style="margin-top: 20px">
          <Col span="9" style="margin-top: 3px"><label>学院</label></Col>
          <Col span="14" style="text-align: left; margin-left: 10px;">
            <Select v-model="MadminData.department_id" style="width:70%">
              <Option v-for="item in departmentList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </Col>
        </Row>
        <Row style="margin-top: 20px">
          <Col span="9" style="margin-top: 3px"><label>Email</label></Col>
          <Col span="10" style="text-align: left; margin-left: 10px;"><Input v-model="MadminData.email"></Input></Col>
        </Row>
      </div>
      <div slot="footer">
        <Button size="large" style="border: 0px" @click="cancel">取消</Button>
        <Button size="large" type="info" style="border: 0px" @click="modifyInfoOk">确认</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import NavBar from '../../components/NavBar'
import CardContent from '../../components/CardContent'
import TableComponent from '../../components/TableComponent'
export default {
  name: 'adminManagement',
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
          title: '管理员ID',
          key: 'id'
        },
        {
          title: '管理员姓名',
          key: 'name'
        },
        {
          title: '部门',
          key: 'department_name'
        },
        {
          title: 'Email',
          key: 'email'
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
                    this.MadminData.id = params.row.id
                    this.MadminData.department_id = params.row.department_id
                    this.MadminData.name = params.row.name
                    this.MadminData.email = params.row.email
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
                    this.modalChangePwd = true
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
      allData: [],
      allDataUrl: '/admin/getDepartmentAdmin',
      departmentList: [],
      departmentListUrl: '/teacher/listCollege',
      modalAdd: false,
      modalChangePwd: false,
      modalChangeInfo: false,
      selectNumber: 0,
      adminData: {
        id: '',
        name: '',
        department_id: '',
        email: ''
      },
      MadminData: {
        id: '',
        name: '',
        department_id: '',
        email: ''
      },
      newPwdData: {
        id: '',
        passwd: ''
      },
      removeId: [],
      object: [],
      row: {},
      breadlist: [{name: '部门管理员管理', path: '/admin/admin'}] // 面包屑
    }
  },
  mounted () {
    this.getAllData()
    this.getDepartment()
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
    getDepartment () {
      this.$http.post(this.departmentListUrl)
        .then(res => {
          if (res.data.code === 1001) {
            let list = res.data.data
            list.forEach(item => {
              let department = {'value': item.id, 'label': item.name}
              this.departmentList.push(department)
            })
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
    modifyPwdOk () {
      if (this.newPwdData.newPasswd !== '') {
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
        this.cancel()
      } else {
        this.$Message.info('请输入密码')
      }
    },
    modifyInfoOk () {
      if (this.MadminData.department_id === '' || this.MadminData.name === '' || this.MadminData.email === '') {
        this.$Message.info('请完善表格内容')
      } else {
        this.$http.post('/admin/changeUserInfo', this.MadminData)
          .then(res => {
            if (res.data.code === 1001) {
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
      if (this.adminData.id === '' || this.adminData.name === '' || this.adminData.email === '') {
        this.$Message.info('请完善表格内容')
      } else {
        this.$http.post('/admin/addDepartmentAdmin', this.adminData)
          .then(res => {
            if (res.data.code === 1001) {
              console.log(this.adminData)
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
      this.modalChangeInfo = false
      this.modalAdd = false
      this.adminData = {id: '', name: '', department_id: '', email: ''}
      this.MadminData = {id: '', name: '', department_id: '', email: ''}
      this.newPwdData = {id: '', passwd: ''}
    },
    deleteStu (flag) {
      if (flag === -1) {
        this.selectNumber = this.object.length
        if (this.selectNumber !== 0) {
          this.$Modal.confirm({
            title: '确认删除',
            content: '<p>您确认删除该' + this.selectNumber.toString() + '名管理员吗？',
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
          this.$Message.info('请选择要删除的管理员')
        }
      } else {
        this.$Modal.confirm({
          title: '确认删除',
          content: '<p>您确认删除该名管理员吗？</p>',
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
