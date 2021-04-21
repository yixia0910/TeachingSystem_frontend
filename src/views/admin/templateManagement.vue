<template>
  <div>
    <NavBar :breadlist="breadlist">
      <div slot="navbarContent">
        <CardContent>
          <div class="fontsize">
            <TableComponent @refresh="refreshData" ref="table" :columnsFromFather="columns1" :allDataFromFather="allData" :loading="loading" :onSelectionChangedFun="fun1">
              <div v-if="vmtype != 'Sangfor'">
              <Button class="addTemplate" @click="openAddModal" size="large">新增模板</Button>
              </div>
              <div v-else>
                <Button type="primary" @click="show = true">
                  <span style="font-size: 14px">新增模板</span>
                </Button>
              </div>
            </TableComponent>
          </div>
        </CardContent>
      </div>
    </NavBar>
    <Modal v-model="modalAdd" class="modal" :mask-closable="false" :closable="false" width="50">
      <p slot="header" class="modal-header">选择虚拟机将其发布为模板</p>
      <div class="modal-content modal-row">
        <TableComponent @refresh="refreshData2" ref="table" :columnsFromFather="columns2" :allDataFromFather="allData2" :loading="loading2" :highLightRow="highLightRow" :onCurrentChangedFun="fun2"></TableComponent>
      </div>
      <div slot="footer">
        <Button size="large" style="border: 0px" @click="cancel">取消</Button>
        <Button size="large" type="info" style="border: 0px" @click="addOk">确认</Button>
      </div>
    </Modal>
    <Modal
      v-model="show">
      <!--        @on-ok="ok"-->
      <!--        @on-cancel="cancel">-->
      <p slot="header" class="modal-title">
        <span>新增模板</span>
      </p>
      <row>
        注意：磁盘容量务必要与制作该镜像的虚拟机磁盘大小一致，否则该模板无法使用
      </row>
      <div>
        <Row justify="end" class="code-row-bg" style="padding-top:2%">
          <Col span="7" style="text-align: center;margin-top:1%">
            <span class="input-item">模板名称</span>
          </Col>
          <Col span="17">
            <Input v-model="templateName" placeholder="输入模板名称" clearable style="width: 300px" />
          </Col>
        </Row>
        <Row justify="end" class="code-row-bg" style="padding-top:2%">
          <Col span="7" style="text-align: center;margin-top:1%">
            <span class="input-item">模板id</span>
          </Col>
          <Col span="17">
            <Input v-model="templateId" placeholder="输入模板id" clearable style="width: 300px" />
          </Col>
        </Row>
        <Row justify="end" class="code-row-bg" style="padding-top:2%">
          <Col span="7" style="text-align: center;margin-top:1%">
            <span class="input-item">磁盘容量</span>
          </Col>
          <Col span="17">
            <Input v-model="imageDisk" placeholder="输入磁盘容量" clearable style="width: 300px" />
          </Col>
        </Row>
      </div>
      <div slot="footer">
        <Button type="text" style="border:1px solid rgba(238,238,238,1);width: 80px; height: 40px; font-weight:400;font-size:16px;" size="large" @click="cancel">取消</Button>
        <Button type="primary" style=";width: 80px; height: 40px; font-weight:600;font-size:16px;" @click="ok">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import NavBar from '../../components/NavBar'
import CardContent from '../../components/CardContent'
import TableComponent from '../../components/TableComponent'
import net from '../../assets/Global'
export default {
  name: 'templateManagement',
  components: {CardContent, TableComponent, NavBar},
  comments: {
    NavBar,
    CardContent,
    TableComponent
  },
  data () {
    return {
      columns1: [
        {
          title: '序号',
          key: 'index',
          width: 80
        },
        {
          title: '模板名称',
          key: 'vm_name',
          sortable: 'custom'
        },
        {
          title: '教师ID',
          key: 'owner_id',
          sortable: 'custom',
          sortType: 'number'
        },
        {
          title: '磁盘(MB)',
          key: 'Disk',
          sortable: 'custom',
          sortType: 'number'
        },
        {
          title: '内存(MB)',
          key: 'Memory',
          sortable: 'custom',
          sortType: 'number'
        },
        {
          title: 'CPU个数',
          key: 'CPU',
          sortable: 'custom',
          sortType: 'number'
        },
        {
          title: '操作系统',
          key: 'GuestFullName',
          sortable: 'custom'
        },
        {
          title: '备注',
          key: 'remark'
        },
        {
          title: '操作',
          key: 'oper',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'error'
                },
                style: {
                  marginRight: '5%'
                },
                on: {
                  click: () => this.deleteTpl(params.row.vm_name)
                }
              }, '删除')
            ])
          }
        }
      ],
      columns2: [
        {
          title: '虚拟机名称',
          key: 'Name',
          width: '150'
        },
        {
          title: '电源状态',
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
          key: 'Disk'
        },
        {
          title: '内存(MB)',
          key: 'Memory'
        },
        {
          title: 'CPU数量',
          key: 'CPU'
        },
        {
          title: '操作系统',
          key: 'GuestFullName',
          width: '150',
          sortType: 'number'
        }
      ],
      templateName: '',
      templateId: '',
      imageDisk: '',
      show: false,
      vmtype: net.vmmanager,
      allData: [],
      allDataUrl: '/admin/getTemplate',
      allData2: [],
      allDataUrl2: 'getUsingVMsById',
      modalAdd: false,
      highLightRow: true,
      chooseTpl: '',
      loading: true,
      loading2: true,
      object: [],
      row: {},
      breadlist: [{name: '模板管理', path: '/admin/template'}] // 面包屑
    }
  },
  mounted () {
    this.getAllData()
  },
  methods: {
    getAllData () {
      this.loading = true
      this.$http.get(this.allDataUrl)
        .then(res => {
          if (res.data.code === 1001) {
            this.allData = res.data.data
            console.log(this.allData)
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
        .then(() => {
          this.loading = false
        })
    },
    getAllData2 () {
      this.loading2 = true
      this.$http.get(this.allDataUrl2)
        .then(res => {
          if (res.data.code === 1001) {
            this.allData2 = res.data.data
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
        .then(() => {
          this.loading2 = false
        })
    },
    refreshData () {
      this.getAllData()
    },
    refreshData2 () {
      this.getAllData2()
    },
    openAddModal () {
      this.modalAdd = true
      this.getAllData2()
    },
    fun1 (object, row) {
      this.object = object
      this.row = row
    },
    fun2 (currentRow) {
      this.chooseTpl = currentRow.Name
    },
    addOk () {
      if (this.chooseTpl === '') {
        this.$Message.info('请选择虚拟机')
      } else {
        this.loading = true
        this.$http.post('common/makeTemplate', {
          vmName: this.chooseTpl
        })
          .then(res => {
            if (res.data.code === 1001) {
              this.$Message.info('发布成功')
            } else {
              this.$Message.error(res.data.msg)
              this.loading = false
            }
          })
        this.cancel()
      }
    },
    cancel () {
      this.modalAdd = false
      this.chooseTpl = ''
    },
    deleteTpl (name) {
      this.$Modal.confirm({
        title: '确认删除',
        content: '<p>您确认删除该模板吗？</p>',
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
                this.loading = false
              }
            })
        },
        onCancel: () => {
          this.$Message.info('取消操作')
        }
      })
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
    ok () {
      let params = {
        Name: this.templateName,
        Id: this.templateId,
        Disk: this.imageDisk
      }
      if (params.Name === '') {
        this.showNoticeWarning('模板名称不能为空')
        return
      }
      if (params.Id === '') {
        this.showNoticeWarning('模板id不能为空')
        return
      }
      if (params.Disk === '') {
        this.showNoticeWarning('模板磁盘容量不能为空')
        return
      }
      this.$http.post('common/addTemplate', params)
        .then(res => {
          if (res.data.code === 1001) {
            this.showNoticeSuccess('添加模板成功')
          } else {
            this.showNoticeError('添加模板失败', '错误信息：' + res.data.msg)
          }
          this.show = false
          this.refreshData()
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

<style scoped src="../../assets/CommonStyle.css"></style>
<style scoped src="../../assets/ModalStyle.css"></style>
<style scoped>
  .addTemplate{
    width:120px;
    height:40px;
    background:rgba(35,171,255,1);
    border-radius:4px;
    font-size:18px;
    font-weight:500;
    color:rgba(255,255,255,1);
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
