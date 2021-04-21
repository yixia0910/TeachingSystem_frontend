<template>
  <Modal
    v-model="show"
    @on-ok="ok"
    @on-cancel="cancel">
    <p slot="header" style="margin-top:10px;height:25px;font-size: 20px;text-align:center;font-weight:normal">
      <span>为学生新增虚拟机</span>
    </p>
    <div>
      <Row justify="end" class="code-row-bg" style="padding-top:2%">
        <Col span="7" style="text-align: center;margin-top:1%">
          <span style="font-size: 16px">课程名称：</span>
        </Col>
        <Col span="17">
          <Input disabled v-model="expName" clearable style="width: 300px" />
        </Col>
      </Row>
      <Row justify="end" class="code-row-bg" style="padding-top:2%">
        <Col span="7" style="text-align: center;margin-top:1%"><span style="font-size: 16px">模板名称：</span></Col>
        <Col span="17">
          <Select v-model="vmTemplate" style="width:350px" :disabled="changeVM">
            <Option v-for="(item) in listTemplate" :key="item.Name" :value="item.Name" :label="item.Name+' ( ' +item.GuestFullName+' )'">
              <span>{{item.Name}}</span>
              <span style="float:right;color:#ccc">{{item.GuestFullName}}</span>
            </Option>
          </Select>
        </Col>
      </Row>
      <Row justify="end" class="code-row-bg" style="padding-top:2%">
        <Col span="7" style="text-align: center;margin-top:1%"><span style="font-size: 16px">没有分配虚拟机的学生：</span></Col>
        <Col span="17">
          <input type="checkbox" id="cb" checked="checked" @click="quanxuan" /><span style="font-size: 16px">全选</span>
          <br>
          <label style="width:350px" v-for="(student,index) in listStudent" :key="index">
            <input type="checkbox" v-model="listChoose" :value="student.id" :id=index @change="xuanze"/>
            <span style="font-size: 16px; float: left; width: 50%">{{student.name}}{{student.id}}</span>
          </label>
        </Col>
      </Row>
<!--      <Row justify="end" class="code-row-bg" style="padding-top:2%">-->
<!--        <Col span="7" style="text-align: center;margin-top:1%">-->
<!--          <span style="font-size: 16px">学生学号：</span>-->
<!--        </Col>-->
<!--        <Col span="17">-->
<!--          <Input v-model="stuID" clearable style="width: 300px" />-->
<!--        </Col>-->
<!--      </Row>-->
      <Row justify="end" class="code-row-bg" style="padding-top:2%">
        <Col span="7" style="text-align: center;margin-top:1%"><span style="font-size: 16px">磁盘容量 (G)：</span></Col>
        <Col span="17">
          <el-radio-group v-model="diskCapacity" size="small">
            <el-radio-button label="50G"></el-radio-button>
            <el-radio-button label="100G"></el-radio-button>
            <el-radio-button label="150G"></el-radio-button>
            <el-radio-button label="200G"></el-radio-button>
            <Input style="padding-left:10px; width:90px; height:32px" v-model="diskCapacity"></Input>
          </el-radio-group>
        </Col>
      </Row>
      <Row justify="end" class="code-row-bg" style="padding-top:2%">
        <Col span="7" style="text-align: center;margin-top:1%"><span style="font-size: 16px">内存大小 (G)：</span></Col>
        <Col span="17">
          <el-radio-group v-model="memoryCapacity" size="small">
            <el-radio-button label="1G"></el-radio-button>
            <el-radio-button label="2G"></el-radio-button>
            <el-radio-button label="4G"></el-radio-button>
            <el-radio-button label="8G"></el-radio-button>
            <Input style="padding-left:10px; width:90px; height:32px" v-model="memoryCapacity"></Input>
          </el-radio-group>
        </Col>
      </Row>
      <Row justify="end" class="code-row-bg" style="padding-top:2%">
        <Col span="7" style="text-align: center;margin-top:1%"><span style="font-size: 16px">CPU核数：</span></Col>
        <Col span="17">
          <el-radio-group v-model="cpuCount" size="small">
            <el-radio-button label="1核"></el-radio-button>
            <el-radio-button label="2核"></el-radio-button>
            <el-radio-button label="4核"></el-radio-button>
            <el-radio-button label="8核"></el-radio-button>
            <Input style="padding-left:10px; width:90px; height:32px" v-model="cpuCount"></Input>
          </el-radio-group>
        </Col>
      </Row>
      <Row justify="end" class="code-row-bg" style="padding-top:2%">
        <Col span="7" style="text-align: center;margin-top:1%">
          <span style="font-size: 16px">使用截止时间：</span>
        </Col>
        <Col span="17">
          <DatePicker v-model="due_time" :options="dueTimeOption" type="datetime" placeholder="请选择使用截止时间" style="width: 350px" :disabled="changeVM"></DatePicker>
        </Col>
      </Row>
    </div>
    <div slot="footer">
      <Button type="text" size="large" @click="cancel">取消</Button>
      <Button type="primary" size="large" :loading="posting" @click="ok">确定</Button>
    </div>
  </Modal>
</template>

<script>
export default {
  name: 'addExperimentalVMModal',
  props: {
    showModalAddExpVM: {
      type: Boolean,
      default: false
    },
    expName: {
      type: String,
      required: true
    },
    changeVM: {
      type: Boolean,
      default: false
    },
    expID: {
      type: Number,
      required: true
    }
  },
  computed: {
    show: {
      get: function () {
        return this.showModalAddExpVM
      },
      set: function () { }
    },
    dueTimeOption: function () {
      return {
        disabledDate (date) {
          return date.valueOf() < Date.now() - 86400000
        }
      }
    }
  },
  data () {
    return {
      getTemplateUrl: 'vm/getTemplatesByUserId',
      vmTemplate: '',
      stuID: '',
      postUrl: 'virtualMachine/addVMForExp',
      getStudentUrl: 'getStuListNoVM',
      courseId: '',
      posting: false,
      expId: '',
      listStudent: [],
      listChoose: [],
      listTemplate: [],
      cpuCount: '1核',
      memoryCapacity: '1G',
      diskCapacity: '50G',
      due_time: ''
    }
  },
  watch: {
    changeVM (newval, oldval) {
      if (newval) {
        this.inputVMName = this.operVMConf.name
        this.diskCapacity = this.operVMConf.disk
        this.memoryCapacity = this.operVMConf.memory
        this.vmTemplate = this.operVMConf.template
        this.due_time = this.operVMConf.due_time
        this.cpuCount = this.operVMConf.cpu
      } else {
        this.inputVMName = ''
        this.diskCapacity = '50G'
        this.memoryCapacity = '1G'
        this.vmTemplate = ''
        this.due_time = ''
        this.cpuCount = '1核'
      }
    }
  },
  mounted () {
    this.getListStudent()
    this.getListTemplate()
  },
  methods: {
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
    extractNumber (str, timeNum = 1) {
      let matchRes = str.match(/^\d+/)
      return matchRes === null ? null : Number(matchRes[0]) * timeNum
    },
    judgeParams (params) {
      let flag = true
      if (params.vmconf.TemplateName === '' || typeof (params.vmconf.TemplateName) === 'undefined') {
        this.showNoticeWarning('模板名称错误', '模板名称不能为空')
        flag = false
      } else if (params.vmconf.Disk === null || typeof (params.vmconf.Disk) === 'undefined') {
        this.showNoticeWarning('磁盘容量错误', '请选择正确的磁盘容量')
        flag = false
      } else if (params.vmconf.Memory === null || typeof (params.vmconf.Memory) === 'undefined') {
        this.showNoticeWarning('内存容量错误', '请选择正确的内存容量')
        flag = false
      } else if (params.vmconf.CPU === null || typeof (params.vmconf.CPU) === 'undefined') {
        this.showNoticeWarning('CPU核数错误', '请选择正确的CPU核数')
        flag = false
      } else if (params.vmconf.due_time === '' || typeof (params.vmconf.due_time) === 'undefined') {
        this.showNoticeWarning('使用截止时间错误', '请选择虚拟机的使用截止时间')
        flag = false
      }
      return flag
    },
    judgeInput (vmConf) {
      let reg = /^\d+[Gg\d]$/
      if (reg.test(vmConf.disk)) {
        if (reg.test(vmConf.memory)) {
          let reg2 = /^\d+[核\d]$/
          if (reg2.test(vmConf.cpu)) {
            return true
          } else {
            this.showNoticeWarning('请输入正确的CPU个数')
          }
        } else {
          this.showNoticeWarning('请输入正确的内存容量')
        }
      } else {
        this.showNoticeWarning('请输入正确的磁盘容量')
      }
    },
    getListTemplate () {
      this.$http.get(this.getTemplateUrl)
        .then(res => {
          if (res.data.code === 1001) {
            this.listTemplate = res.data.data
          } else {
            this.$Message.error('获取模板信息失败，' + res.data.msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    quanxuan () {
      for (var i = 0; i < this.listStudent.length; i++) {
        var cboxid = i
        var cbox = document.getElementById(cboxid)
        if (document.getElementById('cb').checked) {
          if (!cbox.checked) {
            cbox.checked = true
            this.listChoose.push(this.listStudent[i].id)
          }
        } else {
          cbox.checked = false
          this.listChoose.pop()
        }
      }
      console.log(this.listChoose)
    },
    xuanze () {
      console.log(this.listChoose)
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
    clearModal () {
      this.stuID = ''
    },
    getListStudent () {
      this.courseID = sessionStorage.getItem('courseDetail_courseID')
      this.expId = Number(sessionStorage.getItem('experimentalVM_expID'))
      console.log(this.expId)
      console.log(this.courseID)
      this.$http.get(this.getStudentUrl, {
        params: {
          courseId: this.courseID,
          expId: this.expId
        }
      })
        .then(res => {
          if (res.data.code === 1001) {
            this.listStudent = res.data.data
            console.log(this.listStudent)
          } else {
            console.log(res.data.msg)
            // this.$Message.error('获取学生信息失败，' + res.data.msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    ok () {
      // let params = {
      //   stuId: this.stuID,
      //   expId: Number(this.expID)
      // }
      // if (!this.judgeParams(params)) {
      //   return
      // }
      // params.stuId = Number(params.stuId)
      // this.posting = true
      // this.$http.post(this.postUrl, params)
      //   .then(res => {
      //     this.posting = false
      //     if (res.data.code === 1001) {
      //       this.clearModal()
      //       this.showNoticeSuccess('操作成功', res.data.msg)
      //       this.$emit('refresh')
      //     } else {
      //       this.showNoticeError('操作失败', res.data.msg)
      //     }
      //   })
      //   .catch(err => {
      //     console.log(err)
      //   }).then(() => {
      //     this.$emit('update:showModalAddExpVM', false)
      //   })

      let params = {
        vmconf: {
          CPU: this.extractNumber(this.cpuCount),
          Memory: this.extractNumber(this.memoryCapacity, 1024),
          IsTemplate: false,
          TemplateName: this.vmTemplate,
          Disk: this.extractNumber(this.diskCapacity, 1024),
          due_time: this.transferDatetimeToStr(this.due_time)
        }
      }
      if (!this.judgeParams(params)) {
        return
      }
      params.expId = this.expId
      params.stulist = this.listChoose
      this.posting = true
      this.$http.post('virtualMachine/addVMForExp', params)
        .then(res => {
          this.posting = false
          if (res.data.code === 1001) {
            this.showNoticeSuccess('已提交表单', '完成虚拟机创建')
            this.clearModal()
          } else {
            this.showNoticeError('发送申请失败', '错误信息：' + res.data.msg)
          }
          this.$emit('update:showModalAddVM', false)
        })
        .catch(err => {
          console.log(err)
        })
    },
    cancel () {
      this.$emit('update:showModalAddExpVM', false)
    }
  }
}
</script>

<style scoped>

</style>
