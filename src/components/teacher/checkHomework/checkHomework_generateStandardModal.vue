<template>
  <Modal
    v-model="show"
    @on-ok="ok"
    @on-cancel="cancel" width="1050px">
    <p slot="header" style="margin-top:10px;height:25px;font-size: 20px;text-align:center;font-weight:normal">
      <span>生成标准作业</span>
    </p>
    <div style="margin-top:10px;margin-left:20px;margin-right:20px;">
      <TableComponent :loading="loading" @refresh="refreshData2" ref="table" :columnsFromFather="columns2" :allDataFromFather="allData2">
        <Button :disabled="disableStartPeer || peerStarted" type="success" @click="startPeer">
          <Icon type="md-alarm" style="padding-right:5px;padding-bottom: 3px;"/>
          <span style="font-size: 14px">开启互评</span>
        </Button>
        <span style="margin-left:15px;font-size: 16px;font-weight:bold" v-if="homeworkNotEnough">
          当前作业不足6份，无法抽取
        </span>
      </TableComponent>
    </div>
    <div slot="footer">
      <Button type="text" size="large" @click="cancel">关闭</Button>
      <Button type="primary" size="large" :loading="posting" @click="ok">保存</Button>
    </div>
  </Modal>
</template>

<script>
import TableComponent from '../../TableComponent'
export default {
  name: 'generateStandardModal',
  components: {
    TableComponent
  },
  props: {
    showModalGenerateStandard: {
      type: Boolean,
      default: false
    },
    expID: {
      type: Number,
      required: true
    },
    peerStarted: {
      type: Boolean,
      required: true
    },
    enablePeer: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    show: {
      get: function () {
        return this.showModalGenerateStandard
      },
      set: function () {
      }
    },
    homeworkNotEnough: function () {
      return this.allData2.length === 0
    }
  },
  data () {
    return {
      allData2: [],
      allDataUrl2: 'teacher/getstandardHW',
      loading: true,
      disableStartPeer: true,
      posting: false,
      modifiedNum: 0,
      columns2: [
        {
          title: '序号',
          key: 'index',
          width: 90,
          sortable: 'custom'
        },
        {
          title: '学号',
          key: 'student_id',
          sortable: 'custom'
        },
        {
          title: '姓名',
          key: 'student_name',
          sortable: 'custom'
        },
        {
          title: '提交时间',
          key: 'submit_time',
          sortable: 'custom'
        },
        {
          title: '评分',
          key: 'score',
          width: 150,
          render: (h, params) => {
            return h('div', [
              h('Input', {
                props: {
                  value: params.row.score,
                  disabled: this.peerStarted || params.row.file === null
                },
                on: {
                  input: (val) => {
                    this.allData2[params.index].score = val
                    if (this.allData2[params.index].modified === false) {
                      this.modifiedNum += 1
                      this.allData2[params.index].modified = true
                    }
                  }
                }
              }, '')])
          }
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
                  type: 'primary',
                  disabled: params.row.file === '' || params.row.file === null
                },
                style: {
                  marginRight: '5px',
                  marginTop: '5px',
                  marginBottom: '5px'
                },
                on: {
                  click: () => {
                    let uuid = ''
                    this.$http.get('assignment/tryDownload', {
                      params: {
                        expId: this.expID,
                        stuId: params.row.student_id
                      }
                    })
                      .then(res => {
                        if (res.data.code === 1001) {
                          uuid = res.data.data
                          window.open('http://10.251.254.37/assignment/download?uuid=' + uuid)
                        } else {
                          this.showNoticeError('下载学生' + params.row.student_name + '的作业失败', res.data.msg)
                        }
                      })
                      .catch(err => {
                        console.log(err)
                      })
                  }
                }
              }, '下载')
              // h('Button', {
              //   props: {
              //     type: 'primary',
              //     disabled: params.row.file === '' || params.row.file === null
              //   },
              //   style: {
              //     marginRight: '5px',
              //     marginTop: '5px',
              //     marginBottom: '5px'
              //   },
              //   on: {
              //     click: () => {
              //       window.open('http://10.251.254.37/preview?id=' + String(params.row.file))
              //     }
              //   }
              // }, '预览')
            ])
          }
        }
      ]
    }
  },
  mounted () {
    this.loading = true
    this.getAllData2()
  },
  watch: {
    expID: function (newval, oldval) {
      this.loading = true
      this.getAllData2()
    }
  },
  methods: {
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
    startPeer () {
      this.$http.post('teacher/startPeerAssessment', {
        expid: this.expID
      }).then(res => {
        if (res.data.code === 1001) {
          this.showNoticeSuccess('已开启互评')
          this.$emit('update:peerStarted', true)
        } else {
          this.showNoticeError('开启互评失败', res.data.msg)
        }
      })
        .catch(err => {
          console.log(err)
        })
    },
    getAllData2 () {
      if (this.expID === -1 || !this.enablePeer) {
        return
      }
      this.$http.get(this.allDataUrl2, {
        params: {
          expid: this.expID
        }
      })
        .then(res => {
          this.loading = false
          if (res.data.code === 1001) {
            this.allData2 = res.data.data
            this.allData2.forEach(item => {
              item.modified = false
            })
            if (res.data.msg.indexOf('请开始') >= 0) {
              this.disableStartPeer = false
            }
            if (res.data.msg.indexOf('已开始') >= 0) {
              this.peerStarted = true
              this.disableStartPeer = true
            }
            if (this.allData2 === null) {
              this.allData2 = []
            }
          } else {
            if (res.data.msg.indexOf('作业数量不足') < 0) {
              this.$Message.error(res.data.msg)
            }
            this.allData2 = []
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    refreshData2 () {
      this.loading = true
      this.getAllData2()
    },
    ok () {
      this.posting = true
      this.allData2.forEach(item => {
        if (item.modified) {
          item.modified = false
          let params = {
            hwid: Number(item.id),
            grade: Number(item.score)
          }
          let flag = true
          if (params.grade >= 0 && params.grade <= 100) {
            if (params.grade <= 10) {
              flag = false
              let that = this
              this.$Modal.confirm({
                title: '确认操作',
                content: '互评为百分制，确定要将' + item.student_name + '的评分设置为' + params.grade + '吗？',
                onOk () {
                  this.posting = true
                  that.markAssignment(params, item.student_name)
                  this.posting = false
                }
              })
            }
          } else {
            this.showNoticeWarning('分数错误', '分数应在0~100之间')
            flag = false
          }
          if (!flag) {
            return
          }
          this.markAssignment(params, item.student_name)
        }
      })
      this.posting = false
    },
    markAssignment (params, stuName) {
      this.$http.post('teacher/markAssignment', params)
        .then(res => {
          if (res.data.code === 1001) {
            this.showNoticeSuccess('为' + stuName + '的作业评分成功')
            this.modifiedNum -= 1
          } else {
            this.showNoticeError('为' + stuName + '的作业作业评分失败', '错误信息：' + res.data.msg)
            this.modifiedNum -= 1
          }
          if (this.modifiedNum === 0) {
            this.refreshData2()
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    cancel () {
      this.$emit('update:showModalGenerateStandard', false)
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
