<template>
  <div>
    <NavBar :username="this.$cookie.get('username')" infopage='/teacher/info' :breadlist="breadList">
      <div slot="navbarContent">
        <CardContent>
          <AddTemplateModal @refresh="refreshData" :showModalAddTemplate.sync="showModalAddTemplate"></AddTemplateModal>
          <DeleteTemplateModal @refresh="refreshData" :showModalDeleteTemplate.sync="showModalDeleteTemplate" :templateName="operTemplateName"></DeleteTemplateModal>
          <TransferTemplateModal @refresh="refreshData" :showModalTransferTemplate.sync="showModalTransferTemplate" :templateName="operTemplateName"></TransferTemplateModal>
          <OperationResModal :showModalOperationRes.sync="showModalOperationRes" :title="operationTitle" :content="operationContent"></OperationResModal>
          <TableComponent :loading="loading" @refresh="refreshData" :columnsFromFather="columns1" :allDataFromFather="allData">
            <div v-if="vmtype != 'Sangfor'">
            <Button type="primary" @click="showModalAddTemplate = true">
              <span style="font-size: 14px">新增模板</span>
            </Button>
            </div>
            <div v-else>
              <Button type="primary" @click="show = true">
                <span style="font-size: 14px">新增模板</span>
              </Button>
            </div>
          </TableComponent>
        </CardContent>
      </div>
    </NavBar>
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
import TableComponent from '../../components/TableComponent'
import CardContent from '../../components/CardContent'
import AddTemplateModal from '../../components/teacher/template/template_addTemplateModal'
import OperationResModal from '../../components/teacher/operationResModal'
import TransferTemplateModal from '../../components/teacher/template/template_transferTemplateModal'
import DeleteTemplateModal from '../../components/teacher/template/template_deleteTemplateModal'
import net from '../../assets/Global'
export default {
  name: 'templateManagement',
  components: {
    NavBar,
    TableComponent,
    CardContent,
    AddTemplateModal,
    OperationResModal,
    TransferTemplateModal,
    DeleteTemplateModal
  },
  methods: {
    showOperationRes (title, content) {
      this.operationTitle = title
      this.operationContent = content
      this.showModalOperationRes = true
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
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log(err)
        }).then(() => {
          this.loading = false
        })
    },
    cancel () {
      this.show = false
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
  },
  mounted () {
    this.loading = true
    this.getAllData()
  },
  data () {
    return {
      templateName: '',
      templateId: '',
      imageDisk: '',
      show: false,
      vmtype: net.vmmanager,
      operationTitle: '',
      operationContent: '',
      loading: true,
      showModalOperationRes: false,
      showModalDeleteTemplate: false,
      showModalTransferTemplate: false,
      operTemplateName: '',
      allDataUrl: 'vm/getPersonalTemplates',
      allData: [],
      showModalAddTemplate: false,
      breadList: [{name: '模板管理', path: '/teacher/template'}], // 面包屑
      columns1: [
        {
          title: '序号',
          key: 'index',
          width: 80
        },
        {
          title: '模板名称',
          key: 'Name',
          sortable: 'custom'
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
          title: 'CPU核数',
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
          key: 'AdvancedConfig',
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
                  type: 'error'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.operTemplateName = params.row.Name
                    this.showModalDeleteTemplate = true
                  }
                }
              }, '删除'),
              h('Button', {
                props: {
                  type: 'info'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.operTemplateName = params.row.Name
                    this.showModalTransferTemplate = true
                  }
                }
              }, '转换为虚拟机')
            ])
          }
        }
      ]
    }
  }
}
</script>

<style scoped src="../../assets/CommonStyle.css"></style>
<style scoped src="../../assets/ModalStyle.css"></style>
<style scoped>
  .addIcon{
    padding-right:5px;
    padding-bottom: 3px;
  }
</style>
