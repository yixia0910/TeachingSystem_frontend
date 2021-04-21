<template>
 <div>
   <NavBar :breadlist="breadlist">
     <div slot="navbarContent">
       <CardContent>
         <TableComponent @refresh="refreshData" ref="table" :columnsFromFather="columns1" :allDataFromFather="showData"></TableComponent>
       </CardContent>
     </div>
   </NavBar>

   <Modal
     :title="modalTitle"
     v-model="infoModal"
     :mask-closable="false"
     class="vertical-center-modal">
     <div class="center-modal-box">
       <div>
         <Row v-for="(item, index) in modallist" :key="index">
           <Col class="modal-block">
             <label>{{item.name}}</label>
             <Span>{{item.value}}</Span>
           </Col>
         </Row>
       </div>
     </div>
     <div slot="footer">
       <Button type="primary" @click="confirm">确定</Button>
     </div>
   </Modal>
   <Modal
     :title="modalTitle"
     v-model="opModal"
     :mask-closable="false"
     class="vertical-center-modal">
     <div class="center-modal-box">
       <div>
         <Row v-for="(item, index) in modallist" :key="index">
           <Col class="modal-block">
             <label>{{item.name}}</label>
             <Span>{{item.value}}</Span>
           </Col>
         </Row>
         <div class="modal-block-append" v-if="modalType==='create'">
           <Row>
             <Col>
               <label>申请原因</label>
               <div class="list-block">{{applicationReason}}</div>
             </Col>
           </Row>
           <Row>
           </Row>
         </div>
       </div>
     </div>
     <div slot="footer">
       <Button type="error" @click="popRefuseModal">拒绝</Button>
       <Button type="info" @click="submit">确认修改</Button>
     </div>
   </Modal>
   <Modal
     title="拒绝申请"
     v-model="refuseModal"
     :mask-closable="false"
     class="vertical-center-modal">
     <div class="center-modal-box">
       <Input v-model="reason"/>
     </div>
     <div slot="footer">
       <Button type="primary" @click="refuse">拒绝</Button>
     </div>
   </Modal>
   <Modal
     title="修改到期时间"
     v-model="modifyModal"
     :mask-closable="false"
     class="vertical-center-modal">
   <Row justify="end" class="code-row-bg" style="padding-top:2%">
     <Col span="7" style="text-align: center;margin-top:1%">
       <span style="font-size: 16px">使用截止时间：</span>
     </Col>
     <Col span="17">
       <DatePicker v-model="due_time" :options="dueTimeOption" type="datetime" placeholder="请选择使用截止时间" style="width: 350px"></DatePicker>
     </Col>
   </Row>
     <div slot="footer">
       <Button type="primary" @click="modify">修改</Button>
     </div>
   </Modal>
 </div>
</template>

<script>
import NavBar from '../../components/NavBar'
import CardContent from '../../components/CardContent'
import TableComponent from '../../components/TableComponent'
export default {
  name: 'applicationRecords',
  components: {TableComponent, CardContent, NavBar},
  data () {
    return {
      breadlist: [{name: '申请记录', path: '/application/records'}],
      allData: [],
      columns1: [
        {
          title: '申请ID',
          key: 'id',
          align: 'center',
          width: 150
        },
        {
          title: '申请人ID',
          key: 'sender_id',
          width: 170,
          sortable: true,
          tooltip: true,
          align: 'center'
        },
        // {
        //   title: '申请人角色',
        //   key: 'applicantRole'
        // },
        // {
        //   title: '管理员ID',
        //   key: 'adminId',
        //   maxWidth: 120,
        //   tooltip: true
        // },
        {
          title: '虚拟机名称',
          key: 'vm_name',
          sortable: true,
          tooltip: true,
          width: 210,
          align: 'center'
        },
        {
          title: '申请类型',
          key: 'operate_type',
          width: 110,
          sortable: 'custom',
          align: 'center',
          render: (h, params) => {
            // let type = ['create', 'delete', 'edit']
            let type
            switch (params.row.operate_type) {
              case 1: type = '创建'; break
              case 2: type = '批量创建'; break
              case 3: type = '修改'; break
              case -1: type = '删除'; break
              case -2: type = '批量删除'; break
            }
            return h('div', {}, type)
          }
        },
        {
          title: '申请时间',
          key: 'apply_time',
          width: 190,
          align: 'center',
          render: (h, params) => {
            let text = params.row.apply_time
            if (text === '' || text === null) {
              text = '-'
            }
            return h('div', {}, text)
          }
        },
        {
          title: '到期时间',
          key: 'due_time',
          width: 170,
          align: 'center',
          render: (h, params) => {
            let text = params.row.due_time
            if (text === '' || text === null) {
              text = '-'
            }
            return h('div', {}, text)
          }
        },
        {
          title: '状态',
          key: 'status',
          width: 110,
          sortable: 'custom',
          align: 'center',
          render: (h, params) => {
            // let status = ['error', '已撤销', '已修改', '已删除', '拒绝', '已创建', '处理中']
            let status
            switch (params.row.status) {
              case -1: status = '已撤销'; break
              case 0: status = '未处理'; break
              case 1: status = '已拒绝'; break
              case 2: status = '已通过'; break
              default: status = '已过期'
            }
            return h('div', {}, status)
          }
        },
        {
          title: '处理时间',
          key: 'finish_time',
          align: 'center',
          width: 170,
          render: (h, params) => {
            let text = params.row.finish_time
            if (text === '' || text === null) {
              text = '尚未处理'
            }
            return h('div', {}, text)
          }
        },
        // {
        //   title: '到期时间',
        //   key: 'due_time'
        // },
        {
          title: '操作',
          key: 'operatation',
          width: 250,
          fixed: 'right',
          align: 'center',
          render: (h, params) => {
            let value = {
              disable: true,
              text: '查看详情',
              type: 'info',
              txt: '修改到期时间'
            }
            if (params.row.status === 0) {
              value.disable = false
              value.text = '处理'
              value.type = 'primary'
              value.txt = '拒绝'
            }
            return h('div', [
              h('Button', {
                props: {
                  type: value.type
                },
                on: {
                  click: () => {
                    this.applicationId = params.row.id
                    this.modallist = []
                    let vm = JSON.parse(params.row.detail)
                    if (params.row.status === 0) {
                      switch (params.row.operate_type) {
                        case 1:
                        case 2:
                          this.modalTitle = '创建虚拟机'
                          this.modalType = 'create'
                          this.modallist.push({name: '虚拟机名称', value: vm.Name})
                          this.modallist.push({name: '模板名称', value: vm.TemplateName})
                          this.modallist.push({name: 'CPU数目', value: vm.CPU})
                          this.modallist.push({name: '内存(M)', value: vm.Memory})
                          this.modallist.push({name: '磁盘(M)', value: vm.Disk})
                          this.applicationReason = params.row.apply_msg === '' ? '无' : params.row.apply_msg
                          // this.getIP()
                          break
                        case -1:
                        case -2:
                          this.modalTitle = '即将删除虚拟机'
                          this.modalType = 'delete'
                          this.modallist.push({name: '虚拟机名称', value: params.row.vm_name})
                          break
                        // 目前看来是不存在的情况，仅测试用
                        case 3:
                          this.modalTitle = '重新编辑虚拟机'
                          this.modalType = 'edit'
                          this.modallist.push({name: '虚拟机名称', value: vm.Name})
                          this.modallist.push({name: 'CPU数目', value: vm.CPU})
                          this.modallist.push({name: '内存(M)', value: vm.Memory})
                          this.modallist.push({name: '磁盘(M)', value: vm.Disk})
                          break
                      }
                      this.opModal = true
                    } else {
                      switch (params.row.operate_type) {
                        case 1:
                        case 2:
                          this.modalTitle = '创建虚拟机'
                          this.modalType = 'create'
                          this.modallist.push({name: '虚拟机名称', value: vm.Name})
                          this.modallist.push({name: '模板名称', value: vm.TemplateName})
                          this.modallist.push({name: 'CPU数目', value: vm.CPU})
                          this.modallist.push({name: '内存(M)', value: vm.Memory})
                          this.modallist.push({name: '磁盘(M)', value: vm.Disk})
                          // this.modallist.push({name: '课程名称', value: vm.courseName})
                          break
                        case -1:
                        case -2:
                          this.modalTitle = '删除虚拟机'
                          this.modalType = 'delete'
                          this.modallist.push({name: '虚拟机名称', value: params.row.vm_name})
                          break
                        case 3:
                          this.modalTitle = '编辑虚拟机'
                          this.modalType = 'edit'
                          this.modallist.push({name: '虚拟机名称', value: vm.Name})
                          this.modallist.push({name: 'CPU数目', value: vm.CPU})
                          this.modallist.push({name: '内存(M)', value: vm.Memory})
                          break
                      }
                      this.infoModal = true
                    }
                  }
                }
              }, value.text),
              h('Button', {
                // props: {
                //   type: 'warning',
                //   disabled: value.disable
                // },
                on: {
                  click: () => {
                    if (value.disable === false) {
                      this.applicationId = params.row.id
                      this.refuseModal = true
                    } else {
                      this.applicationId = params.row.id
                      this.modifyModal = true
                    }
                    // this.$Modal.confirm({
                    //   title: '拒绝操作',
                    //   content: '确认拒绝此条操作？',
                    //   onOk: () => {
                    // },
                    //   onCancel: () => {
                    //     this.$Message.info('已取消操作')
                    //   }
                    // })
                  }
                }
              }, value.txt)
            ])
          }
        }
      ],
      infoModal: false,
      opModal: false,
      modifyModal: false,
      due_time: '',
      reason: '请输入拒绝原因',
      refuseModal: false,
      modalType: '',
      modalTitle: '',
      applicationId: '',
      applicationReason: '',
      modallist: [],
      iplist: [],
      chooseIP: ''
    }
  },
  mounted () {
    this.getAllData()
  },
  computed: {
    showData () {
      let data = this.allData
      data = data.sort((a, b) => {
        if (a.status !== b.status) {
          if (a.status === 0) {
            return -1
          } else if (b.status === 0) {
            return 1
          }
        }
        return Date(a.apply_time) < Date(b.apply_time) ? 1 : -1
      })
      return data
    },
    dueTimeOption: function () {
      return {
        disabledDate (date) {
          return date.valueOf() < Date.now() - 86400000
        }
      }
    }
  },
  methods: {
    popRefuseModal () {
      this.opModal = false
      this.modifyModal = false
      this.refuseModal = true
    },
    cancel () {
      this.opModal = false
      this.refuseModal = false
      this.modifyModal = false
    },
    submit () {
      let data = {}
      if (this.modalType === 'create') {
        // if (this.chooseIP === '') {
        //   this.$Message.error('请选择ip')
        // } else {
        data = {
          id: this.applicationId
        }
        this.$http.post('/applyRecord/accept', data)
          .then(res => {
            if (res.data.code === 1001) {
              this.$Notice.success({
                title: '操作成功',
                desc: '已成功创建虚拟机'
              })
              this.getAllData()
            } else {
              this.$Message.error(res.data.msg)
            }
          })
        this.opModal = false
        this.chooseIP = ''
        this.iplist = []
      } else if (this.modalType === 'delete') {
        this.$Modal.confirm({
          title: '删除虚拟机',
          content: '确认删除虚拟机？',
          onCancel: () => {
            this.$Message.info('已取消操作')
          },
          onOk: () => {
            data = {
              id: this.applicationId
            }
            this.$http.post('/applyRecord/accept', data)
              .then(res => {
                if (res.data.code === 1001) {
                  this.$Notice.success({
                    title: '操作成功',
                    desc: '已成功删除虚拟机'
                  })
                  this.getAllData()
                } else {
                  this.$Message.error(res.data.msg)
                }
              })
            this.opModal = false
          }
        })
      } else {
        data = {
          id: this.applicationId
        }
        this.$http.post('/applyRecord/accept', data)
          .then(res => {
            if (res.data.code === 1001) {
              this.$Notice.success({
                title: '操作成功',
                desc: '已成功修改虚拟机'
              })
              this.getAllData()
            } else {
              this.$Message.error(res.data.msg)
            }
          })
        this.opModal = false
      }
    },
    confirm () {
      this.infoModal = false
    },
    modify () {
      let data = {
        record_id: this.applicationId,
        due_time: this.transferDatetimeToStr(this.due_time)
      }
      this.$http.post('applyRecord/changeDueTime', data)
        .then(res => {
          if (res.data.code === 1001) {
            this.$Notice.success({
              title: '操作成功',
              desc: '已成功修改虚拟机到期时间'
            })
            this.getAllData()
          } else {
            this.$Message.error(res.data.msg)
          }
        })
      this.modifyModal = false
    },
    refuse () {
      let data = {
        recordId: this.applicationId,
        reason: this.reason
      }
      console.log(data)
      this.$http.post('/applyRecord/refuseApplyRecord', data)
        .then(res => {
          if (res.data.code === 1001) {
            let data = '已拒绝'
            // switch (params.row.applicantRole) {
            //   case 'student': data += '学生'; break
            //   case 'teacher': data += '教师'; break
            //   case 'admin': data += '管理员'; break
            // }
            data += '请求'
            this.$Notice.success({
              title: '拒绝申请',
              desc: data
            })
            this.getAllData()
          } else {
            this.$Message.error(res.data.msg)
          }
        })
      this.refuseModal = false
    },
    // getIP () {
    //   this.$http.get('/vm/getHosts')
    //     .then(res => {
    //       if (res.data.code === 1001) {
    //         this.iplist = res.data.data
    //         console.log(this.iplist)
    //       } else {
    //         this.$Message.error(res.data.msg)
    //       }
    //     })
    // },
    getAllData () {
      this.$http.get('/common/allapplicationInfo')
        .then(res => {
          console.log(res)
          if (res.data.code === 1001) {
            let dic3 = {'CREATE': 1, 'DELETE': -1, 'EDIT': 3}
            for (let i = 0; i < res.data.data.length; i++) {
              if (res.data.data[i].status === null) {
                res.data.data[i].status = '-2'
                try {
                  let detail = JSON.parse(res.data.data[i].detail)
                  res.data.data[i].operate_type = dic3[detail.Operate]
                  res.data.data[i].vm_name = detail.VMName
                } catch (e) {
                  res.data.data[i].operate_type = ' '
                }
              }
            }
            res.data.data.sort(this.sortById)
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
    transferDatetimeToStr (datetime) {
      if (datetime === '') { return '' }
      let year = datetime.getFullYear().toString()
      let month = (datetime.getMonth() + 1).toString()
      let day = datetime.getDate().toString()
      let hour = datetime.getHours().toString()
      let minute = datetime.getMinutes().toString()
      let second = datetime.getSeconds().toString()
      if (month.length === 1) { month = '0' + month }
      if (day.length === 1) { day = '0' + day }
      if (hour.length === 1) { hour = '0' + hour }
      if (minute.length === 1) { minute = '0' + minute }
      if (second.length === 1) { second = '0' + second }
      return year + '/' + month + '/' + day + ' ' + hour + ':' + minute + ':' + second
    },
    sortById (a, b) {
      return b.id - a.id
    }
  }
}
</script>

<style scoped src="../../assets/CommonStyle.css"></style>
<style scoped>
  .vertical-center-modal{
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .center-modal-box{
    padding: 0 18px 10px 10px;
  }
  .center-modal-box label{
    margin-right: 10px;
    line-height: 30px;
    font-size: medium;
    font-weight: bold;
  }
  .center-modal-box span{
    font-size: small;
    font-weight: lighter;
  }
  .modal-block label{
    margin-left: 10px;
    width: 47%;
    display: inline-block;
    text-align: right;
  }
  .modal-block span{
    font-size: medium;
  }
  .modal-block{
    display: block;
  }
  .list-block{
    max-height: 100px;
    margin-bottom: 10px;
    overflow-y: auto;
  }
  .modal-block-append{
    margin: 15px;
    font-size: small;
  }
</style>
