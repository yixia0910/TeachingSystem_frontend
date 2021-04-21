<template>
  <div>
    <CardContent>
      <TableComponent ref="table" :columnsFromFather="columns" :allDataFromFather="showData" @refresh="refreshData">
        <slot>
          <ButtonGroup>
            <Button :type="currentType === 'all' ? 'primary' : 'default'" @click="handleAll">全部</Button>
            <Button :type="currentType === 'yes' ? 'primary' : 'default'" @click="handleYes">已通过</Button>
            <Button :type="currentType === 'no' ? 'primary' : 'default'" @click="handleNo">已拒绝</Button>
            <Button :type="currentType === 'none' ? 'primary' : 'default'" @click="handleNone">未处理</Button>
            <Button :type="currentType === 'cancel' ? 'primary' : 'default'" @click="handleCancel">已撤销</Button>
          </ButtonGroup>
        </slot>
      </TableComponent>
    </CardContent>
  </div>
</template>

<script>
import CardContent from './CardContent'
import TableComponent from './TableComponent'
export default {
  name: 'applicationInfo',
  components: {CardContent, TableComponent},
  data () {
    return {
      currentType: 'all',
      columns: [
        {
          title: '申请ID',
          key: 'id',
          sortable: true,
          sortType: 'number'
        },
        {
          title: '虚拟机名称',
          key: 'vm_name'
        },
        {
          title: '申请类型',
          key: 'operate_type'
        },
        {
          title: '申请时间',
          key: 'apply_time'
        },
        {
          title: '处理状态',
          key: 'status',
          render: (h, params) => {
            let color = ''
            let status = ''
            if (params.row.status === '已通过') {
              color = 'success'
              status = '已通过'
            } else if (params.row.status === '已拒绝') {
              color = 'error'
              status = '已拒绝'
            } else if (params.row.status === '未处理') {
              color = 'warning'
              status = '申请中'
            } else {
              color = 'primary'
              status = params.row.status
            }
            return h('Tag', {
              props: {
                color: color
              }
            }, status)
          }
        },
        {
          title: '受理时间',
          key: 'finish_time'
        },
        {
          title: '到期时间',
          key: 'due_time'
        },
        {
          title: '回复信息',
          key: 'reply_msg'
        },
        {
          title: '操作',
          key: 'operation',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary'
                },
                style: {
                  display: params.row.status === '未处理' ? '' : 'none'
                },
                on: {
                  click: () => {
                    var that = this
                    this.$Modal.confirm({
                      title: '确认撤销',
                      content: '撤销请点击确认',
                      onOk () {
                        this.$http.post('applyRecord/cancelApplyRecord', {
                          recordId: params.row.id
                        }).then(res => {
                          console.log(res)
                          if (res.data.code === 1001) {
                            that.getData()
                          } else {
                            this.$Message.error(res.data.msg)
                          }
                        })
                      }
                    })
                  }
                }
              }, '撤销')
            ])
          }
        }
      ],
      allData: [],
      showData: []
    }
  },
  created () {
    this.getData()
  },
  methods: {
    handleAll () {
      this.currentType = 'all'
      this.showData = this.allData
      this.$refs.table.changePage(1)
    },
    handleYes () {
      this.currentType = 'yes'
      this.showData = this.allData.filter(res => {
        return res.status === '已通过'
      })
      this.$refs.table.changePage(1)
    },
    handleNo () {
      this.currentType = 'no'
      this.showData = this.allData.filter(res => {
        return res.status === '已拒绝'
      })
      this.$refs.table.changePage(1)
    },
    handleNone () {
      this.currentType = 'none'
      this.showData = this.allData.filter(res => {
        return res.status === '未处理'
      })
      this.$refs.table.changePage(1)
    },
    handleCancel () {
      this.currentType = 'cancel'
      this.showData = this.allData.filter(res => {
        return res.status === '已撤销'
      })
      this.$refs.table.changePage(1)
    },
    getData () {
      this.$http.get('/common/applicationInfo').then(res => {
        console.log(res)
        if (res.data.code === 1001) {
          let dic = {'-1': '已撤销', 0: '未处理', 1: '已拒绝', 2: '已通过'}
          let dic1 = {'-2': '批量删除', '-1': '删除', 1: '创建', 2: '批量创建', 3: '修改'}
          let dic3 = {'CREATE': '创建', 'DELETE': '删除', 'EDIT': '修改'}
          for (let i = 0; i < res.data.data.length; i++) {
            if (res.data.data[i].status === null) {
              res.data.data[i].status = '已过期'
              try {
                let detail = JSON.parse(res.data.data[i].detail)
                res.data.data[i].operate_type = dic3[detail.Operate]
                res.data.data[i].vm_name = detail.VMName
              } catch (e) {
                res.data.data[i].operate_type = '已过期'
              }
            } else {
              res.data.data[i].status = dic[res.data.data[i].status]
              res.data.data[i].operate_type = dic1[res.data.data[i].operate_type]
            }
          }
          res.data.data.sort(this.sortById)
          this.showData = this.allData = res.data.data
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(res => {
        console.log(res)
      })
    },
    refreshData () {
      this.getData()
      this.$refs.table.changePage(1)
      this.currentType = 'all'
    },
    sortById (a, b) {
      return b.id - a.id
    },
    parse (str) {
      var ret = new Promise(function (resolve, reject) {
        var r = JSON.parse(str)
        resolve(r)
      })
      return ret
    }
  }
}
</script>

<style scoped src="../assets/CommonStyle.css"></style>
<style scoped>

</style>
