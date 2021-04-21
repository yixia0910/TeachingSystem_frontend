<style>
  .appeal-row-style {
    color: red;
  }
  .appeal-deal-row-style {
    color: cornflowerblue;
  }
</style>
<template>
  <Modal
    v-model="show"
    @on-ok="ok"
    @on-cancel="cancel" width="1100px">
    <p slot="header" style="margin-top:10px;height:25px;font-size: 20px;text-align:center;font-weight:normal">
      <span><strong>{{stuName}}</strong>收到的互评信息</span>
    </p>
    <div style="margin-top:10px;margin-left:20px;margin-right:20px;width: 97%">
      <TableComponent :rowClassName="rowClassName" :loading="loading" @refresh="refreshData2" ref="table" :columnsFromFather="columns2" :allDataFromFather="allData2"></TableComponent>
    </div>
    <div slot="footer">
      <Button type="text" size="large" @click="cancel">取消</Button>
      <Button type="primary" size="large" @click="ok">确定</Button>
    </div>
  </Modal>
</template>

<script>
import TableComponent from '../../TableComponent'
export default {
  name: 'peerDetailModal',
  components: {
    TableComponent
  },
  props: {
    showModalPeerDetail: {
      type: Boolean,
      default: false
    },
    stuName: {
      type: String,
      required: true
    },
    stuID: {
      type: String,
      required: true
    },
    expID: {
      type: Number,
      required: true
    }
  },
  computed: {
    show: {
      get: function () {
        return this.showModalPeerDetail
      },
      set: function () {
      }
    }
  },
  data () {
    return {
      allData2: [],
      allDataUrl2: 'teacher/getSinglePeerDetail',
      loading: true,
      columns2: [
        {
          title: '评分者学号',
          key: 'assessor_id',
          sortable: 'custom'
        },
        {
          title: '评分者姓名',
          key: 'assessor_name',
          sortable: 'custom'
        },
        {
          title: '互评得分',
          key: 'origin_score',
          sortable: 'custom'
        },
        {
          title: '当前得分',
          key: 'score',
          sortable: 'custom'
        },
        {
          title: '是否申诉',
          key: 'appeal_status',
          sortable: 'custom'
        },
        {
          title: '评分理由',
          key: 'reason',
          width: 250,
          sortable: 'custom'
        },
        {
          title: '申诉理由',
          key: 'appeal_reason',
          width: 250,
          sortable: 'custom'
        }
      ]
    }
  },
  watch: {
    stuID: function (newval, oldval) {
      if (this.show === false) {
        return
      }
      this.loading = true
      this.getAllData2()
    }
  },
  methods: {
    getAllData2 () {
      if (this.stuID === '' || typeof (this.stuID) === 'undefined') {
        return
      }
      this.$http.get(this.allDataUrl2, {
        params: {
          expid: this.expID,
          stuid: this.stuID
        }
      })
        .then(res => {
          if (res.data.code === 1001) {
            this.allData2 = res.data.data
            this.allData2.forEach(item => {
              if (item.score === null) {
                item.score = ''
              }
              if (item.reason === null) {
                item.reason = ''
              }
              if (item.appeal_reason === null) {
                item.appeal_reason = ''
              }
              if (item.appeal_status === '0') {
                item.appeal_status = '否'
              } else if (item.appeal_status === '1') {
                item.appeal_status = '是'
              } else {
                item.appeal_status = '已处理'
              }
            })
          } else {
            this.$Message.error(res.data.msg)
            this.allData2 = []
          }
        })
        .catch(err => {
          console.log(err)
        }).then(() => {
          this.loading = false
        })
    },
    refreshData2 () {
      this.loading = true
      this.getAllData2()
    },
    rowClassName (row) {
      if (row.appeal_status === '是') {
        return 'appeal-row-style'
      } else if (row.appeal_status === '已处理') {
        return 'appeal-deal-row-style'
      }
      return ''
    },
    showNoticeWarning (noticeTitle, noticeDesc) {
      this.$Notice.warning({
        title: noticeTitle,
        desc: noticeDesc
      })
    },
    ok () {
      this.$emit('update:showModalPeerDetail', false)
    },
    cancel () {
      this.$emit('update:showModalPeerDetail', false)
    }
  }
}
</script>

<style scoped>
  .delIcon{
    padding-right:2px;
    padding-bottom: 3px;
  }
</style>
