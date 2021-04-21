<template>
  <Modal
    v-model="show"
    @on-ok="ok"
    @on-cancel="cancel" width="800px">
    <p slot="header" style="margin-top:10px;height:25px;font-size: 20px;text-align:center;font-weight:normal">
      <span>查看课程<strong>《{{courseName}}》</strong>中的学生</span>
    </p>
    <div style="margin-top:10px;margin-left:20px;margin-right:20px;">
      <TableComponent :buttonSpan="12" :loading="loading" @refresh="refreshData2" ref="table" :columnsFromFather="columns2" :allDataFromFather="allData2">
        <Button type="error" @click="deleteAllStudents">
          <Icon type="md-trash" class="delIcon"/>
          <span style="font-size: 14px">全部删除</span>
        </Button>
      </TableComponent>
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
  name: 'checkStudentModal',
  components: {
    TableComponent
  },
  props: {
    showModalCheckStudent: {
      type: Boolean,
      default: false
    },
    courseName: {
      type: String,
      required: true
    },
    courseID: {
      type: String,
      required: true
    }
  },
  computed: {
    show: {
      get: function () {
        return this.showModalCheckStudent
      },
      set: function () {
      }
    }
  },
  data () {
    return {
      allData2: [],
      allDataUrl2: 'getStuListByCourseId',
      loading: true,
      columns2: [
        {
          title: '学生学号',
          key: 'id',
          width: '150',
          sortable: 'custom'
        },
        {
          title: '学生姓名',
          key: 'name',
          sortable: 'custom'
        },
        {
          title: '学生邮箱',
          key: 'email',
          sortable: 'custom'
        },
        {
          title: '操作',
          key: 'oper',
          width: '150',
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
                    this.$http.post('teacher/deleteStuFromCourse', {
                      courseID: Number(this.courseID),
                      stuID: params.row.id
                    })
                      .then(res => {
                        if (res.data.code === 1001) {
                          this.$Notice.success({
                            title: '已成功删除学生'
                          })
                          this.refreshData2()
                        } else {
                          this.$Message.error(res.data.msg)
                        }
                      })
                      .catch(err => {
                        console.log(err)
                      })
                  }
                }
              }, '删除')
            ])
          }
        }
      ]
    }
  },
  watch: {
    courseID: function (newval, oldval) {
      if (this.show === false) {
        return
      }
      this.loading = true
      this.getAllData2()
    }
  },
  methods: {
    deleteAllStudents () {
      this.$http.post('teacher/deleteAllStuFromCourse', {
        courseID: Number(this.courseID)
      })
        .then(res => {
          if (res.data.code === 1001) {
            this.$Notice.success({
              title: '已成功删除全部学生'
            })
            this.refreshData2()
          } else {
            this.$Notice.error({
              title: res.data.msg
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    getAllData2 () {
      if (this.courseID === '' || typeof (this.courseID) === 'undefined') {
        return
      }
      this.$http.get(this.allDataUrl2, {
        params: {
          courseId: this.courseID
        }
      })
        .then(res => {
          if (res.data.code === 1001) {
            this.allData2 = res.data.data
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
    showNoticeWarning (noticeTitle, noticeDesc) {
      this.$Notice.warning({
        title: noticeTitle,
        desc: noticeDesc
      })
    },
    ok () {
      this.$emit('update:showModalCheckStudent', false)
    },
    cancel () {
      this.$emit('update:showModalCheckStudent', false)
    }
  }
}
</script>

<style scoped>
  .delIcon{
    padding-right:2px;
    padding-bottom: 3px;
  }
  /deep/ .ivu-btn-group-default{
    display: inline;
    float: left;
    margin-left: -50px;
  }
  /deep/ .ivu-poptip-rel{
    display: inline !important;
    float: left;
  }
  /deep/ .ivu-input {
    display: inline;
  }
</style>
