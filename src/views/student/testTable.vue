<template>
  <!-- TODO 这只是个例子 -->
<!--  <div>-->
<!--    <NavBar></NavBar>-->
<!--    <Button style="margin: 10px 0 10px 100px" icon="ios-refresh" @click="getData">刷新</Button>-->
<!--    <Table :columns="columns" :data="data"></Table>-->
<!--  </div>-->
  <div>
    <NavBar infopage="/student/info" username="username">
      <Card style="margin: 20px" slot="navbarContent">
        <div>
          <Button style="margin: 10px 0 10px 100px" icon="ios-refresh" @click="getData">刷新</Button>
          <Table :columns="columns" :data="data"></Table>
        </div>
      </Card>
    </NavBar>
  </div>
</template>

<script>
import NavBar from '../../components/NavBar'
export default {
  name: 'testTable',
  components: {NavBar},
  data () {
    return {
      columns: [{
        title: 'id',
        key: 'id'
      }, {
        title: 'name',
        key: 'name'
      }, {
        title: 'count',
        key: 'count'
      }],
      data: []
    }
  },
  methods: {
    getData () {
      this.$http.get('/student/getData', {
        params: {
          type: 'finish'
        }
      }).then(res => {
        if (res.data.code === 1) {
          this.data = res.data.data
        } else {
          this.$Message.error(res.data.msg)
        }
      })
        .catch(err => {
          console.log(err)
        })
    }
  },
  mounted () {
    this.getData()
  }
}
</script>

<style scoped>

</style>
