<template>
  <div>
    <NavBar :breadlist="breadlist">
      <div slot="navbarContent">
        <CardContent>
          <TableComponent :rowClassName="rowClassName" @refresh="refreshData" :columnsFromFather="columns1" :allDataFromFather="allData">
          </TableComponent>
        </CardContent>
      </div>
    </NavBar>
  </div>
</template>

<script>
import NavBar from '../../components/NavBar'
import TableComponent from '../../components/TableComponent'
import CardContent from '../../components/CardContent'
export default {
  name: 'peerDetails',
  components: {CardContent, TableComponent, NavBar},
  data () {
    return {
      breadlist: [
        {name: '课程管理', path: '/assistant/courseManagement'},
        {name: '实验', path: '/assistant/courseDetails'},
        {name: '提交情况', path: '/assistant/homework'},
        {name: '互评情况', path: '/assistant/peerDetails'}],
      operationTitle: '',
      operationContent: '',
      expName: JSON.parse(localStorage.getItem('paramsMessage')).expName,
      expId: JSON.parse(localStorage.getItem('paramsMessage')).expId,
      showModalOperationRes: false,
      showModalDeleteTemplate: false,
      operTemplateName: '',
      allDataUrl: 'peer/allpeerinfo',
      allData: [],
      showModalAddTemplate: false,
      modifiedScore: { },
      columns1: [
        {
          title: '学号',
          key: 'student_id',
          width: 120,
          fixed: 'left'
        },
        {
          title: '姓名',
          key: 'student_name',
          width: 120,
          fixed: 'left'
        },
        {
          title: '评分者学号',
          key: 'assessor_id',
          width: 120
        },
        {
          title: '评分者姓名',
          key: 'assessor_name',
          width: 120
        },
        {
          title: '互评得分',
          key: 'origin_score',
          width: 120
        },
        {
          title: '当前得分',
          key: 'score',
          width: 120,
          render: (h, params) => {
            if (params.row.appeal_status !== '否') {
              return h('div', [
                h('Input', {
                  props: {
                    value: params.row.score
                  },
                  on: {
                    input: (val) => {
                      this.modifiedScore[params.row.student_id + '_' + params.row.assessor_id] = val
                    }
                  }
                }, '')])
            } else {
              return h('div', params.row.score)
            }
          }
        },
        {
          title: '申诉',
          key: 'appeal_status',
          width: 120
        },
        {
          title: '评分理由',
          key: 'reason',
          width: 400
        },
        {
          title: '申诉理由',
          key: 'appeal_reason',
          width: 400
        },
        {
          title: '操作',
          key: 'oper',
          width: 250,
          fixed: 'right',
          align: 'center',
          render: (h, params) => {
            let elementList = [
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
                        expId: this.expId,
                        stuId: params.row.student_id
                      }
                    })
                      .then(res => {
                        if (res.data.code === 1001) {
                          uuid = res.data.data
                          window.open(this.$baseUrl + '/assignment/download?uuid=' + uuid)
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
              //       this.$http.get('preview', {
              //         params: {
              //           id: this.file
              //         }
              //       }).then(res => {
              //         if (typeof res.data === 'string') {
              //           sessionStorage.setItem('callbackHTML', res.data)
              //           sessionStorage.setItem('previewFrom', 'peerDetail')
              //           sessionStorage.setItem('peerDetailBreadList', JSON.stringify(this.breadlist))
              //           this.$router.push({
              //             path: '/teacher/preview'
              //           })
              //         } else {
              //           this.showNoticeWarning('预览失败', '该文件不支持预览')
              //         }
              //       }).catch(err => {
              //         console.log(err)
              //       })
              //     }
              //   }
              // }, '预览')
            ]
            if (params.row.appeal_status !== '否') {
              elementList.push(
                h('Button', {
                  props: {
                    type: 'success',
                    loading: params.row.dealLoading
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      if (typeof this.modifiedScore[params.row.student_id + '_' + params.row.assessor_id] === 'undefined') {
                        this.showNoticeWarning(params.row.student_name + '的评分未被修改')
                        return
                      }
                      let flag = true
                      let stuscore = Number(this.modifiedScore[params.row.student_id + '_' + params.row.assessor_id])
                      if (stuscore >= 0 && stuscore <= 100) {
                        if (stuscore <= 10) {
                          flag = false
                          let that = this
                          this.$Modal.confirm({
                            title: '确认操作',
                            content: '互评为百分制，确定要将' + params.row.student_name + '的评分设置为' + stuscore + '吗？',
                            onOk () {
                              params.row.dealLoading = true
                              that.dealAppeal(params)
                              params.row.dealLoading = false
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
                      params.row.dealLoading = true
                      this.dealAppeal(params)
                      params.row.dealLoading = false
                    }
                  }
                }, '修改评分'))
            }
            return h('div', elementList)
          }
        }
      ]
    }
  },
  mounted () {
    this.getAllData()
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
    rowClassName (row) {
      if (row.appeal_status === '是') {
        return 'appeal-row-style'
      } else if (row.appeal_status === '已处理') {
        return 'appeal-deal-row-style'
      }
      return ''
    },
    refreshData () {
      this.getAllData()
    },
    sortFunction (item1, item2) {
      let type1 = 1
      let type2 = 1
      if (item1.appeal_status === '是') {
        type1 = 1
      } else if (item1.appeal_status === '已处理') {
        type1 = 2
      } else {
        type1 = 3
      }
      if (item2.appeal_status === '是') {
        type2 = 1
      } else if (item2.appeal_status === '已处理') {
        type2 = 2
      } else {
        type2 = 3
      }
      return type1 - type2
    },
    dealAppeal (params) {
      this.$http.post('teacher/dealAppeal', {
        student_id: String(params.row.student_id),
        assessor_id: String(params.row.assessor_id),
        experiment_id: Number(this.expId),
        score: Number(this.modifiedScore[params.row.student_id + '_' + params.row.assessor_id])
      }).then(res => {
        if (res.data.code === 1001) {
          this.showNoticeSuccess('修改成功')
          this.allData.forEach(item => {
            if (item.student_id === params.row.student_id && item.assessor_id === params.row.assessor_id) {
              item.appeal_status = '已处理'
              item.score = Number(this.modifiedScore[params.row.student_id + '_' + params.row.assessor_id])
            }
          })
          this.allData.sort(this.sortFunction)
        } else {
          this.showNoticeError('修改失败', res.data.msg)
        }
      })
        .catch(err => {
          console.log(err)
        })
    },
    getAllData () {
      this.$http.get(this.allDataUrl, {
        params: {
          expid: this.expId
        }
      })
        .then(res => {
          if (res.data.code === 1001) {
            this.allData = res.data.data
            this.allData.forEach(item => {
              item.dealLoading = false
              if (item.appeal_status === '0') {
                item.appeal_status = '否'
              } else if (item.appeal_status === '1') {
                item.appeal_status = '是'
              } else {
                item.appeal_status = '已处理'
              }
            })
            this.allData.sort(this.sortFunction)
          } else {
            this.$Message.error(res.data.msg)
            this.allData = []
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

<style scoped>

</style>
