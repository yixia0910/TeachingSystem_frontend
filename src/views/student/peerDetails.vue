<template>
 <div>
   <NavBar :breadlist="breadlist">
     <div slot="navbarContent">
       <CardContent>
         <div class="list-box">
           <Row>
             <Col>
               <label>互评详情</label>
               <Button v-on:click="getTable">
                 <Icon type="md-refresh"></Icon>
                 刷新
               </Button>
               <div class="list-table">
                 <Table :columns="column1" :data="peerDetails" size="large" border></Table>
               </div>
             </Col>
           </Row>
         </div>
       </CardContent>
     </div>
   </NavBar>

   <Modal
     title="申诉"
     v-model="appealModal"
     :mask-closable="false"
     class="vertical-center-modal">
     <div class="center-modal-box">
       <div>
         <label>理由</label>
         <Span>
            <Input type="textarea" :rows="8" v-model="appealReason" placeholder="请简述申诉理由"></Input>
          </Span>
       </div>
     </div>
     <div slot="footer">
       <Button @click="cancel">取消</Button>
       <Button type="primary" @click="submit">提交</Button>
     </div>
   </Modal>
 </div>
</template>

<script>
import NavBar from '../../components/NavBar'
import CardContent from '../../components/CardContent'
export default {
  name: 'peerDetails',
  components: {CardContent, NavBar},
  data () {
    return {
      // breadlist: [
      //   {name: '实验信息', path: '/student/experiments'},
      //   {name: '互评信息', path: '/peer/details'}
      // ],
      // breadlist: this.$route.params.breadlist,
      breadlist: JSON.parse(localStorage.getItem('breadcrumb')),
      column1: [
        {
          type: 'index',
          title: ' ',
          align: 'center',
          maxWidth: 120,
          indexMethod: row => {
            return '互评' + (row._index + 1).toString()
          }
        },
        {
          title: '分数',
          key: 'score',
          align: 'center',
          maxWidth: 150
        },
        {
          title: '评分理由',
          key: 'reason'
        },
        {
          title: '申诉状态',
          key: 'appealStatus',
          align: 'center',
          maxWidth: 150,
          render: (h, params) => {
            let status = '无'
            switch (this.peerDetails[params.index].appealStatus) {
              case '1': status = '申诉中'; break
              case '2': status = '已处理'; break
              default: status = '无'
            }
            return h('div', {}, status)
          }
        },
        {
          title: '操作',
          key: 'operation',
          align: 'center',
          maxWidth: 150,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.row = params.index
                    this.assessorId = this.peerDetails[this.row].assessorId
                    this.appealModal = true
                  }
                }
              }, '申诉')
            ])
          }
        }
      ],
      peerDetails: [],
      appealModal: false,
      appealReason: '',
      expId: JSON.parse(localStorage.getItem('paramsMessage')).id,
      assessorId: '',
      row: 0
    }
  },
  mounted () {
    this.refreshBreadlist()
    this.getTable()
  },
  methods: {
    cancel () {
      this.appealModal = false
    },
    submit () {
      let req = {
        experiment_id: this.expId,
        appeal_reason: this.appealReason,
        assessor_id: this.assessorId
      }
      this.$http.post('/peer/appeal', req)
        .then(res => {
          if (res.data.code === 1001) {
            this.$Notice.info({
              title: '提交成功',
              desc: '申诉已提交，请等待管理员处理'
            })
            this.getTable()
          } else {
            this.$Message.error(res.data.msg)
          }
        }).catch(err => {
          console.log(err)
        })
      this.appealModal = false
      this.appealReason = ''
      this.peerDetails[this.row].appeal_status = 1
    },
    getTable () {
      this.$http.get('/peer/details', {params: {expid: this.expId}})
        .then(res => {
          console.log(res)
          if (res.data.code === 1001) {
            this.peerDetails = res.data.data
          } else {
            this.$Message.error(res.data.msg)
          }
        }).catch(err => {
          console.log(err)
        })
    },
    refreshBreadlist () {
      if (this.breadlist.length < 3) {
        this.breadlist.push({name: '互评信息', path: '/peer/details'})
      }
    }
  }
}
</script>

<style scoped>
  .list-box label{
    font-size: large;
    margin: 0 10px 0 5px;
    line-height: 36px;
  }
  .list-box span{
    font-size: large;
    font-weight: lighter;
  }
  .list-table{
    margin: 20px 10px 0 5px;
  }
  .vertical-center-modal{
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .center-modal-box{
    padding: 0 18px 10px 10px;
  }
  .vertical-center-modal label{
    line-height: 30px;
    font-size: medium;
    font-weight: lighter;
  }
</style>
