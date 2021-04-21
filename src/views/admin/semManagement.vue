<template>
  <div>
    <NavBar :breadlist="breadlist">
      <div slot="navbarContent">
        <CardContent>
          <div class="fontsize">
            <TableComponent @refresh="refreshData" ref="table" :columnsFromFather="columns1" :allDataFromFather="allData">
              <Button class="add-semester" @click="modalAdd = true" size="large">新增学期</Button>
            </TableComponent>
          </div>
        </CardContent>
      </div>
    </NavBar>
    <Modal v-model="modalAdd" class="modal" :mask-closable="false" :closable="false" @on-ok="addOk">
      <p slot="header" class="modal-header">新增学期</p>
      <div class="modal-content modal-row">
        <Row>
          <Col span="9" style="margin-top: 3px"><label>学期名称</label></Col>
          <Col span="10" style="text-align: left; margin-left: 10px;"><Input v-model="name" placeholder="格式：2017 秋"></Input></Col>
        </Row>
      </div>
      <div slot="footer">
        <Button size="large" style="border: 0px" @click="cancel">取消</Button>
        <Button size="large" type="info" style="border: 0px" @click="addOk">确认</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import NavBar from '../../components/NavBar'
import CardContent from '../../components/CardContent'
import TableComponent from '../../components/TableComponent'
import {mapMutations} from 'vuex'
export default {
  name: 'semManagement',
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
          sortable: 'custom',
          sortType: 'number',
          width: 200
        },
        {
          title: '学期名称',
          key: 'name',
          width: '300',
          sortable: 'custom'
        },
        {
          title: '学期课程总数',
          key: 'courseCount'
        },
        {
          title: '学期实验总数',
          key: 'expCount'
        },
        {
          title: '操作',
          key: 'oper',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'info'
                },
                style: {
                  marginRight: '5%'
                },
                on: {
                  click: () => {
                    this.setSemester(params.row.name)
                    this.$router.push('/admin/experiment')
                  }
                }
              }, '查看实验'),
              h('Button', {
                props: {
                  type: 'info',
                  disabled: true
                },
                style: {
                  marginRight: '5%'
                }
              }, '编辑学期'), // TODO:查看学期实验功能和编辑学期功能
              h('Button', {
                props: {
                  type: 'error'
                },
                style: {
                  marginRight: '5%'
                },
                on: {
                  click: () => {
                    this.$Modal.confirm({
                      title: '确认删除',
                      content: '<p>您确认删除该学期吗？',
                      onOk: () => {
                        let name = params.row.name
                        this.$http.post('/deleteTerm', {
                          name: name
                        })
                          .then(res => {
                            if (res.data.code === 1001) {
                              this.$Message.info('删除成功')
                              this.refreshData()
                            } else {
                              this.$Message.error(res.data.msg)
                            }
                          })
                      },
                      onCancel: () => {
                        this.$Message.info('取消操作')
                      }
                    })
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      allData: [],
      allDataUrl: '/teacher/listTerm',
      modalAdd: false,
      name: '',
      breadlist: [{name: '学期管理', path: '/admin/semester'}] // 面包屑
    }
  },
  mounted () {
    this.getAllData()
  },
  methods: {
    ...mapMutations(['setSemester']),
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
    refreshData () {
      this.getAllData()
    },
    addOk () {
      if (this.name === '') {
        this.$Message.info('请填写学期名称')
      } else {
        this.$http.post('/addTerm', {
          'name': this.name
        })
          .then(res => {
            if (res.data.code === 1001) {
              this.$Message.info('新增成功')
              this.refreshData()
            } else {
              this.$Message.error(res.data.msg)
            }
          })
        this.cancel()
      }
    },
    cancel () {
      this.modalAdd = false
      this.name = ''
    }
  }
}
</script>

<style scoped src="../../assets/CommonStyle.css"></style>
<style scoped>
  .add-semester{
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
