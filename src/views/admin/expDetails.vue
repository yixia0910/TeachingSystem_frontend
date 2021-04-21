<template>
  <div>
    <NavBar :username="this.$cookie.get('username')" infopage='/teacher/info' :breadlist="breadList">
      <div slot="navbarContent">
        <CardContent>
          <ExpDetailComponent :expID="expID" :starttime="expStartTime" :endtime="expEndTime" :breadlist="breadList"></ExpDetailComponent>
        </CardContent>
      </div>
    </NavBar>
  </div>
</template>

<script>
import NavBar from '../../components/NavBar'
import CardContent from '../../components/CardContent'
import ExpDetailComponent from '../../components/teacher/expDetails/expDetails_expDetailComponent'
export default {
  name: 'expDetails',
  components: {CardContent, NavBar, ExpDetailComponent},
  props: {
  },
  data () {
    return {
      breadList: [],
      expID: -1,
      expName: '',
      expStartTime: '',
      expEndTime: ''
    }
  },
  mounted () {
    this.expID = Number(this.$route.query.expID)
    // this.from = this.$route.query.from
    // this.breadList.push({name: '课程管理', path: '/teacher/course'})
    // this.breadList.push({name: '课程详情', path: this.$route.query.from})
    this.breadList = JSON.parse(sessionStorage.getItem('courseDetailBreadList'))
    this.expStartTime = sessionStorage.getItem('expStartTime')
    this.expEndTime = sessionStorage.getItem('expEndTime')
    this.breadList.push({name: '实验详情', path: this.$route.fullPath})
  }
}
</script>

<style scoped>

</style>
