<template>
  <div>
    <NavBar :breadlist="breadlist">
      <div slot="navbarContent">
        <CardContent>
          <TableComponent @refresh="refreshData" :columnsFromFather="columns1" :allDataFromFather="allData">
<!--            <Button @click="createMachineModal= true" size="large">-->
<!--              <Icon type="md-add-circle"></Icon>-->
<!--              新增主机-->
<!--            </Button>-->
          </TableComponent>
        </CardContent>
        <!--
        <div class="card-list-box">
          <Card v-for="(item, index) in allData" :key="index" :title="item.ip" class="card-list">
            <Circle :stroke-color="strockColor(item.MemoryUsed/item.MemoryTotal)" class="card-list-circle" :percent="Math.round(item.MemoryUsed/item.MemoryTotal * 10000) / 100.00">
              内存使用率
              <p>{{Math.round(item.MemoryUsed/item.MemoryTotal * 10000) / 100.00}}%</p>
            </Circle>
            <Circle :stroke-color="strockColor(item.CPUUsed/item.CPUTotal)" class="card-list-circle" :percent="Math.round(item.CPUUsed/item.CPUTotal * 10000) / 100.00">
              CPU使用率
              <p>{{Math.round(item.CPUUsed/item.CPUTotal * 10000) / 100.00}}%</p>
            </Circle>
          </Card>
        </div>
        -->
      </div>
    </NavBar>
    <Modal
      title="创建主机"
      v-model="createMachineModal"
      :mask-closable="false"
      class="vertical-center-modal">
      <div class="center-modal-box">
        <Row>
          <Col class="modal-block">
            <label>IP或名称</label>
            <Input style="width: 300px;" v-model="hostname" placeholder="请输入IP或主机名"></Input>
          </Col>
        </Row>
        <Row>
          <Col class="modal-block">
            <label>用户名</label>
            <Input style="width: 300px;" v-model="username" placeholder="请输入用户名"></Input>
          </Col>
        </Row>
        <Row>
          <Col class="modal-block">
            <label>密码</label>
            <Input style="width: 300px;" v-model="password" type="password" placeholder="请输入密码"></Input>
          </Col>
        </Row>
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
import TableComponent from '../../components/TableComponent'
import PeerDetails from '../student/peerDetails'
export default {
  name: 'machineManagement',
  components: {PeerDetails, TableComponent, CardContent, NavBar},
  data () {
    return {
      breadlist: [{name: '主机管理', path: '/machine/admin'}],
      allData: [],
      columns1: [
        {
          title: '序号',
          key: 'index',
          width: 80
        },
        {
          title: '主机地址',
          key: 'HostName'
        },
        {
          title: '是否连接',
          key: 'IsConnected',
          width: 100,
          render: (h, params) => {
            let status = '否'
            if (params.row.IsConnected) {
              status = '是'
            }
            return h('div', {}, status)
          }
        },
        {
          title: '运行状态',
          key: 'RunTimeState',
          width: 120,
          render: (h, params) => {
            let status = 'success'
            let label = '正常'
            if (params.row.RunTimeState === 'red') {
              status = 'error'
              label = '错误'
            } else if (params.row.RunTimeState === 'yellow') {
              status = 'error'
              label = '警告'
            }
            return h('div', [
              h('Tag', {
                props: {
                  color: status
                }
              }, label)
            ])
          }
        },
        {
          title: '总内存(M)',
          key: 'MemoryTotal'
        },
        {
          title: '已用(M)',
          key: 'MemoryUsed'
        },
        {
          title: '内存使用率',
          key: 'memoryUsage',
          render: (h, params) => {
            let usage = Math.round(params.row.MemoryUsed / params.row.MemoryTotal * 10000) / 100.00
            let color = '#22C688'
            if (usage > 75) {
              color = '#FF7875'
            }
            return h('div', {
              style: {
                display: 'flex'
              }
            }, [
              h('i-circle', {
                props: {
                  percent: usage,
                  size: 24,
                  'stroke-color': color,
                  'trail-color': '#E8E8E8',
                  'stroke-width': 20,
                  'trail-width': 20,
                  'stroke-linecap': 'square'
                }
              }),
              h('div', {}, usage + '%')]
            )
          }
        },
        {
          title: '总CPU(MHz)',
          key: 'CPUTotal'
        },
        {
          title: '已用(MHz)',
          key: 'CPUUsed'
        },
        {
          title: 'CPU使用率',
          key: 'cpuUsage',
          render: (h, params) => {
            let usage = Math.round(params.row.CPUUsed / params.row.CPUTotal * 10000) / 100.00
            let color = '#22C688'
            if (usage > 75) {
              color = '#FF7875'
            }
            return h('div', {
              style: {
                display: 'flex'
              }
            }, [
              h('i-circle', {
                props: {
                  percent: usage,
                  size: 24,
                  'stroke-color': color,
                  'trail-color': '#E8E8E8',
                  'stroke-width': 20,
                  'trail-width': 20,
                  'stroke-linecap': 'square'
                }
              }),
              h('div', {}, usage + '%')]
            )
            // let usage = Math.round(params.row.CPUUsed / params.row.CPUTotal * 10000) / 100.00
            // return h('div', {}, usage + '%')
          }
        },
        {
          title: '虚拟机数目',
          key: 'vmCount',
          align: 'center',
          maxWidth: 120,
          render: (h, params) => {
            return h('div', {}, params.row.VirtualMachineList.length)
          }
        }
      ],
      createMachineModal: false,
      hostname: '',
      username: '',
      password: ''
    }
  },
  mounted () {
    this.getAllData()
  },
  methods: {
    getAllData () {
      this.$http.get('/vm/getHosts')
        .then(res => {
          if (res.data.code === 1001) {
            this.allData = res.data.data
          } else {
            this.$Message.error(res.data.msg)
          }
        }).catch(err => {
          console.log(err)
        })
    },
    refreshData () {
      this.getAllData()
    },
    cancel () {
      this.createMachineModal = false
    },
    submit () {
      if (this.hostname !== '' && this.username !== '' && this.password !== '') {
        let data = {
          hostname: this.hostname,
          username: this.username,
          password: this.password
        }
        this.$http.post('/machine/add', data)
          .then(res => {
            if (res.data.code === 1001) {
              this.$Notice.success({
                title: '添加成功',
                desc: '主机' + this.hostname + '已添加'
              })
              this.getAllData()
            } else {
              this.$Message.error(res.data.msg)
            }
          })
        this.createMachineModal = false
        this.hostname = ''
        this.username = ''
        this.password = ''
      } else {
        this.$Message.error('请完善信息')
      }
    },
    strockColor (rate) {
      if (rate > 0.8) {
        return '#ed4014'
      } else if (rate > 0.6) {
        return '#ff9900'
      } else {
        return '#19be6b'
      }
    }
  }
}
</script>

<style scoped src="../../assets/CommonStyle.css"></style>
<style scoped>
  /deep/ .ivu-col-span-15{
    display: none;
  }
  /deep/ .ivu-col-span-9{
    float: left;
    text-align: left !important;
  }
  .vertical-center-modal{
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .center-modal-box{
    padding: 0 18px 10px 10px;
  }
  .center-modal-box label{
    margin-right: 10px;
    line-height: 30px;
    font-size: medium;
    font-weight: bold;
  }
  .center-modal-box span{
    font-size: small;
    font-weight: lighter;
  }
  .card-list{
    margin: 10px 5px 10px 10px;
    padding-left: 10px;
    padding-right: 10px;
  }
  .card-list-circle{
    justify-content: space-between;
  }
  .card-list-box{
    display: flex;
    flex-wrap: wrap;
  }
  .modal-block label{
    margin-left: 10px;
    width: 20%;
    display: inline-block;
    text-align: right;
  }
  .modal-block{
    margin-top: 10px;
  }
</style>
