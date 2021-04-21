<template>
  <Modal
    v-model="show"
    @on-ok="ok"
    @on-cancel="cancel" width="900px">
    <p slot="header" class="modal-title" style="margin-top:10px;height:25px;font-size: 20px;font-weight:500">
      <span>点击虚拟机并新建模板</span>
    </p>
    <div>
        <TableComponent @refresh="refreshData2" ref="table" :loading="loading" :columnsFromFather="columns2" :allDataFromFather="allData2" :highLightRow="highLightRow" :onCurrentChangedFun="fun2" :buttonSpan="12"></TableComponent>
    </div>
    <div slot="footer">
      <Button type="text" size="large" @click="cancel">取消</Button>
      <Button type="primary" size="large" :loading="posting" @click="ok">创建模板</Button>
    </div>
  </Modal>
</template>

<script>
import TableComponent from '../../TableComponent'
export default {
  name: 'addTemplateModal',
  components: {
    TableComponent
  },
  props: {
    showModalAddTemplate: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    show: {
      get: function () {
        return this.showModalAddTemplate
      },
      set: function () {
      }
    }
  },
  data () {
    return {
      allData2: [],
      allDataUrl2: 'getPerVMsByUserId',
      highLightRow: true,
      loading: false,
      posting: false,
      chooseTpl: '',
      columns2: [
        {
          title: '虚拟机名称',
          key: 'Name',
          width: '150',
          sortable: 'custom'
        },
        {
          title: '是否开机',
          key: 'PowerState',
          render: (h, params) => {
            let color = ''
            let power = ''
            if (params.row.PowerState === 'poweredOff') {
              color = 'error'
              power = '已关机'
            } else if (params.row.PowerState === 'poweredOn') {
              color = 'success'
              power = '已开机'
            } else {
              color = 'warning'
              if (params.row.PowerState === 'turningOn') {
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
          title: '磁盘 ( MB ) ',
          key: 'Disk',
          sortable: 'custom',
          sortType: 'number'
        },
        {
          title: '内存 ( MB ) ',
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
          width: '150',
          sortable: 'custom'
        }
      ]
    }
  },
  mounted () {
    this.getAllData2()
  },
  methods: {
    getAllData2 () {
      this.loading = true
      this.$http.get(this.allDataUrl2)
        .then(res => {
          this.loading = false
          if (res.data.code === 1001) {
            this.allData2 = res.data.data
            this.allData2.forEach(item => {
              item.PowerState = item.Status.PowerState
              delete item.Status
            })
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    refreshData2 () {
      this.getAllData2()
    },
    extractNumber (str, timeNum = 1) {
      let matchRes = str.match(/^\d+/)
      return matchRes === null ? null : Number(matchRes[0]) * timeNum
    },
    fun2 (currentRow) {
      this.chooseTpl = currentRow.Name
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
    showNoticeWarning (noticeTitle, noticeDesc) {
      this.$Notice.warning({
        title: noticeTitle,
        desc: noticeDesc
      })
    },
    clearModal () {
      this.chooseTpl = ''
    },
    judgeParams (params) {
      let flag = true
      if (params.vmName === '' || typeof (params.vmName) === 'undefined') {
        this.showNoticeWarning('虚拟机错误', '请选择一个虚拟机转化为模板')
        flag = false
      }
      return flag
    },
    ok () {
      let params = {
        vmName: this.chooseTpl
      }
      if (!this.judgeParams(params)) {
        return
      }
      this.posting = true
      this.$http.post('common/makeTemplate', params).then(res => {
        if (res.data.code === 1001) {
          this.showNoticeSuccess('操作成功', '已成功将虚拟机 ' + params.vmName + ' 转化为模板')
          this.$emit('refresh')
        } else {
          this.showNoticeError('将虚拟机 ' + params.vmName + ' 转化为模板失败', res.data.msg)
        }
      }).then(() => {
        this.posting = false
        this.$emit('update:showModalAddTemplate', false)
      })
    },
    cancel () {
      this.$emit('update:showModalAddTemplate', false)
    }
  }
}
</script>

<style scoped>

</style>
