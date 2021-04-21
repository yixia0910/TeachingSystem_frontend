<template>
  <Modal
    v-model="show"
    @on-ok="ok"
    @on-cancel="cancel"
    :styles="{top: '50px', width: '580px'}">
    <p slot="header" class="modal-title">
      <span v-if="changeVM">修改虚拟机配置</span>
      <span v-else-if="expID === -1">新增虚拟机</span>
      <span v-else>为实验《{{expName}}》批量创建虚拟机</span>
    </p>
    <div>
      <Row>
        <div v-if="expID === -1">
          注意：请在创建后及时修改虚拟机默认密码。 </div>
        <div v-else-if="changeVM"></div>
        <div v-else>
          注意：如果您使用的是公共模板，请修改虚拟机密码；如果您使用的是自定义模板，也请修改模板的虚拟机密码，并在创建后至虚拟机管理->修改密码中填写密码。
        </div>
      </Row>
      <Row justify="end" class="code-row-bg" style="padding-top:2%">
        <Col span="7" style="text-align: center;margin-top:1%"><span class="input-item">虚拟机名称</span></Col>
        <Col span="17"><Input v-model="inputVMName" placeholder="只能包含大小写字母，数字，下划线和中划线" clearable style="width: 350px" :disabled="changeVM" /></Col>
      </Row>
      <Row justify="end" class="code-row-bg" style="padding-top:2%">
        <Col span="7" style="text-align: center;margin-top:1%"><span class="input-item">模板名称</span></Col>
        <Col span="17">
          <Select v-model="vmTemplate" style="width:350px" :disabled="changeVM">
            <Option v-for="(item) in listTemplate" :key="item.Name" :value="item.Name" :label="item.Name+' ( ' +item.GuestFullName+' )'">
              <span>{{item.Name}}</span>
              <span style="float:right;color:#ccc">{{item.GuestFullName}}</span>
            </Option>
          </Select>
        </Col>
      </Row>
      <Row v-if="changeVM"></Row>
      <Row v-else-if="expID === -1"></Row>
      <Row v-else justify="end" class="code-row-bg" style="padding-top:2%" v-show = kanbukan>
        <Col span="7" style="text-align: center;margin-top:1%"><span class="input-item">选择学生</span></Col>
        <Col span="17">
          <input type="checkbox" id="cb" @click="quanxuan" /><span style="font-size: 16px">全选</span>
          <br>
          <label  style="width:350px; float: left; width: 40%" v-for="(student,index) in listStudent" :key="index" >
            <input type="checkbox" v-model="listChoose" :value="student.id" :id=index @change="xuanze"/>
            <span style="font-size: 16px">{{student.name}} {{student.id}}</span>
          </label>
        </Col>
      </Row>
<!--      <Row justify="end" class="code-row-bg" style="padding-top:2%">-->
<!--        <Col span="7" style="text-align: center;margin-top:1%"><span style="font-size: 16px">已选择的映射关系：</span></Col>-->
<!--        <Col span="17">-->
<!--          <label  style="width:350px" v-for="(submit,index) in listSubmit" :key="index" >-->
<!--            {{submit.template}} {{submit.stulist.length}}-->
<!--            <button v-on:click="shanchu(index)">delete</button>-->
<!--            <br>-->
<!--          </label>-->
<!--        </Col>-->
<!--      </Row>-->
      <Row justify="end" class="code-row-bg" style="padding-top:2%">
        <Col span="7" style="text-align: center;margin-top:1%"><span class="input-item">磁盘容量 (G)</span></Col>
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
        <Col span="7" style="text-align: center;margin-top:1%"><span class="input-item">内存大小 (G)</span></Col>
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
        <Col span="7" style="text-align: center;margin-top:1%"><span class="input-item">CPU核数</span></Col>
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
          <span class="input-item">使用截止时间</span>
        </Col>
        <Col span="17">
          <DatePicker v-model="due_time" :options="dueTimeOption" type="datetime" placeholder="请选择使用截止时间" style="width: 350px" :disabled="changeVM"></DatePicker>
        </Col>
      </Row>
      <Row justify="end" class="code-row-bg" style="padding-top:2%" v-if="!changeVM">
        <Col span="7" style="text-align: center;margin-top:1%"><span class="input-item">申请原因</span></Col>
        <Col span="17"><Input v-model="applyReason" type="textarea" style="width:350px" :rows="10" placeholder="请简述申请理由及使用时间" :disabled="changeVM" /></Col>
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
  name: 'addVMModal',
  props: {
    showModalAddVM: {
      type: Boolean,
      default: false
    },
    expID: {
      type: Number,
      default: -1
    },
    expName: {
      type: String,
      default: ''
    },
    expApplyId: {
      type: Number,
      default: -1
    },
    changeVM: {
      type: Boolean,
      default: false
    },
    operVMConf: {
      type: Object,
      required: this.changeVM
    }
  },
  computed: {
    show: {
      get: function () {
        return this.showModalAddVM
      },
      set: function () {
      }
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
      listChoose: [],
      listTemplate: [],
      listStudent: [],
      postUrl: 'common/privateVm',
      getTemplateUrl: 'vm/getTemplatesByUserId',
      getStudentUrl: 'getStuListByCourseId',
      changeConfigUrl: '/vm/changeConfig',
      changeConfigApplyUrl: 'applyRecord/changeVMConfig',
      inputVMName: '',
      applyReason: '',
      cpuCount: '1核',
      memoryCapacity: '1G',
      vmTemplate: '',
      diskCapacity: '50G',
      due_time: '',
      posting: false,
      kanbukan: false
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
    // eslint-disable-next-line no-unused-expressions
    this.gouzao()
  },

  methods: {
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
    getListStudent () {
      this.courseID = sessionStorage.getItem('courseDetail_courseID')
      console.log(this.courseID)
      if (this.courseID !== -1) {
        this.$http.get(this.getStudentUrl, {
          params: {
            courseId: this.courseID
          }
        })
          .then(res => {
            if (res.data.code === 1001) {
              this.listStudent = res.data.data
              this.kanbukan = true
            } else {
            // this.$Message.error('获取学生信息失败，' + res.data.msg)
              this.kanbukan = false
            }
          })
          .catch(err => {
            console.log(err)
          })
      } else this.kanbukan = false
    },
    gouzao () {
      this.getListTemplate()
      this.getListStudent()
      console.log(this.changeVM)
      console.log(this.expID)
      if (this.changeVM === true || this.expID !== -1) { this.kanbukan = false }
    },
    clearModal () {
      this.inputVMName = ''
      this.applyReason = ''
      this.cpuCount = '1核'
      this.memoryCapacity = '1G'
      this.vmTemplate = ''
      this.diskCapacity = '50G'
    },
    judgeParams (params) {
      let flag = true
      if (params.vmconf.Name === '') {
        this.showNoticeWarning('虚拟机名称错误', '虚拟机名称不能为空')
        flag = false
      } else if (params.vmconf.TemplateName === '' || typeof (params.vmconf.TemplateName) === 'undefined') {
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
      } else if (params.apply_msg === '') {
        this.showNoticeWarning('申请原因错误', '申请原因不能为空')
        flag = false
      } else {
        let pattern = /^[\w-]+$/
        flag = pattern.test(params.vmconf.Name)
        if (!flag) { this.showNoticeWarning('虚拟机名称错误', '虚拟机名称只能包含大小写字母，数字，下划线和中划线') }
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
    extractNumber (str, timeNum = 1) {
      let matchRes = str.match(/^\d+/)
      return matchRes === null ? null : Number(matchRes[0]) * timeNum
    },
    ok () {
      if (this.changeVM) {
        this.posting = true
        let vmConf = {
          vmName: this.inputVMName,
          cpu: this.cpuCount,
          memory: this.memoryCapacity,
          disk: this.diskCapacity
        }
        if (!this.judgeInput(vmConf)) {
          return
        }
        vmConf.cpu = this.extractNumber(vmConf.cpu)
        vmConf.memory = this.extractNumber(vmConf.memory, 1024)
        vmConf.disk = this.extractNumber(vmConf.disk, 1024)
        if (vmConf.cpu <= 4 && vmConf.memory <= 8 * 1024 && vmConf.disk <= 200 * 1024) {
          this.$http.post(this.changeConfigUrl, vmConf)
            .then(res => {
              this.posting = false
              if (res.data.code === 1001) {
                this.showNoticeSuccess('修改成功')
                this.$emit('refresh')
              } else {
                this.showNoticeError(res.data.msg)
              }
              this.$emit('update:changeVM', false)
              this.$emit('update:showModalAddVM', false)
            })
        } else {
          this.$http.post(this.changeConfigApplyUrl, vmConf)
            .then(res => {
              this.posting = false
              if (res.data.code === 1001) {
                this.showNoticeSuccess('发送申请成功')
              } else {
                this.showNoticeError(res.data.msg)
              }
              this.$emit('update:changeVM', false)
              this.$emit('update:showModalAddVM', false)
            })
        }
      } else {
        let params = {
          vmconf: {
            Name: this.inputVMName,
            CPU: this.extractNumber(this.cpuCount),
            Memory: this.extractNumber(this.memoryCapacity, 1024),
            IsTemplate: false,
            TemplateName: this.vmTemplate,
            Disk: this.extractNumber(this.diskCapacity, 1024),
            due_time: this.transferDatetimeToStr(this.due_time)
            // GuestFullName: '',
            // AdvancedConfig: ''
          },
          apply_msg: this.applyReason,
          due_time: this.transferDatetimeToStr(this.due_time)
        }
        if (!this.judgeParams(params)) {
          return
        }
        if (this.expID === -1) {
          this.posting = true
          this.$http.post(this.postUrl, params)
            .then(res => {
              this.posting = false
              if (res.data.code === 1001) {
                this.showNoticeSuccess('已发送申请', '请等待管理员审核')
                this.clearModal()
              } else {
                this.showNoticeError('发送申请失败', '错误信息：' + res.data.msg)
              }
              this.$emit('update:showModalAddVM', false)
            })
            .catch(err => {
              console.log(err)
            })
        } else {
          params.expid = this.expID
          params.stulist = this.listChoose
          this.posting = true
          this.$http.post('applyRecord/ExperimentVM', params)
            .then(res => {
              this.posting = false
              if (res.data.code === 1001) {
                this.showNoticeSuccess('已发送申请', '请等待管理员审核')
                this.clearModal()
              } else {
                this.showNoticeError('发送申请失败', '错误信息：' + res.data.msg)
              }
              this.$emit('update:showModalAddVM', false)
            })
            .catch(err => {
              console.log(err)
            })
        }
      }
    },
    cancel () {
      if (this.changeVM) {
        this.$emit('update:changeVM', false)
      }
      this.$emit('update:showModalAddVM', false)
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
    }
  }
}
</script>

<style scoped src="../../../assets/ModalStyle.css"></style>
<style scoped>

</style>
