<template>
  <div>
    <NavBar :username="this.$cookie.get('username')" infopage='/teacher/info' :breadlist="breadList">
      <div slot="navbarContent">
        <CardContent>
          <AddSnapshotModal @refresh="refreshData" :vmName="vmName" :showModalAddSnapshot.sync="showModalAddSnapshot"></AddSnapshotModal>
          <RevertSnapshotModal @refresh="refreshData" :showModalRevertSnapshot.sync="showModalRevertSnapshot" :vmName="vmName" :snapshotName="operSnapshotName"></RevertSnapshotModal>
          <DeleteSnapshotModal @refresh="refreshData" :showModalDeleteSnapshot.sync="showModalDeleteSnapshot" :vmName="vmName" :snapshotName="operSnapshotName"></DeleteSnapshotModal>
          <OperationResModal :showModalOperationRes.sync="showModalOperationRes" :title="operationTitle" :content="operationContent"></OperationResModal>
          <TableComponent @refresh="refreshData" :columnsFromFather="columns1" :allDataFromFather="allData">
            <Button @click="showModalAddSnapshot = true" type="primary">
              <Icon type="md-add-circle" class="addIcon"/>
              <span style="font-size: 14px">新增快照</span>
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
import AddSnapshotModal from '../../components/teacher/snapshot/snapshot_addSnapshotModal'
import RevertSnapshotModal from '../../components/teacher/snapshot/snapshot_revertSnapshotModal'
import OperationResModal from '../../components/teacher/operationResModal'
import DeleteSnapshotModal from '../../components/teacher/snapshot/snapshot_deleteSnapshotModal'

export default {
  name: 'snapshotManagement',
  components: {
    NavBar,
    CardContent,
    TableComponent,
    AddSnapshotModal,
    RevertSnapshotModal,
    OperationResModal,
    DeleteSnapshotModal
  },
  computed: {
    contentTitle: function () {
      return this.vmName + '的快照'
    }
  },
  data () {
    return {
      showModalAddSnapshot: false,
      showModalRevertSnapshot: false,
      showModalOperationRes: false,
      showModalDeleteSnapshot: false,
      loading: false,
      vmName: '',
      operationTitle: '',
      operationContent: '',
      operSnapshotName: '',
      breadList: [], // 面包屑
      allDataUrl: 'vm/getSnapshots',
      allData: [],
      columns1: [
        {
          title: '快照名称',
          key: 'Name',
          sortable: 'custom'
        },
        {
          title: '创建时间',
          key: 'CreateTime',
          sortable: 'custom'
        },
        {
          title: '快照描述',
          key: 'Description',
          sortable: 'custom'
        },
        {
          title: '操作',
          key: 'oper',
          width: 250,
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
                    this.operSnapshotName = params.row.Name
                    this.showModalRevertSnapshot = true
                  }
                }
              }, '恢复快照'),
              h('Button', {
                props: {
                  type: 'error'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.operSnapshotName = params.row.Name
                    this.showModalDeleteSnapshot = true
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
    this.vmName = sessionStorage.getItem('snapshot_vmName')
    this.loading = true
    this.breadList.push({name: '虚拟机管理', path: '/teacher/vm'})
    this.breadList.push({name: this.vmName + '的快照管理', path: this.$route.fullPath})
    this.getAllData()
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
      this.$http.get(this.allDataUrl, {
        params: {
          vmName: this.vmName
        }
      })
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
    }
  }
}
</script>

<style scoped>
  .addIcon{
    padding-right:5px;
    padding-bottom: 3px;
  }
</style>
