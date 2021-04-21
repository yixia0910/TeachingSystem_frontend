<template>
  <div>
    <NavBar :username="this.$cookie.get('username')" infopage='/teacher/info' :breadlist="breadList">
      <div slot="navbarContent">
        <CardContent >
          <StuDetailComponent :expID="expID" :starttime="expStartTime" :endtime="expEndTime" :breadlist="breadList"></StuDetailComponent>
        </CardContent>
      </div>
    </NavBar>
  </div>
</template>

<script>
import NavBar from '../../components/NavBar'
import CardContent from '../../components/CardContent'
import ExpDetailComponent from '../../components/teacher/expDetails/expDetails_expDetailComponent'
// eslint-disable-next-line no-unused-vars
import StuDetailComponent from '../../components/teacher/expDetails/stuDetails_Component'
export default {
  name: 'expDetails',
  components: {
    CardContent,
    NavBar,
    ExpDetailComponent,
    StuDetailComponent
  },
  props: {
  },
  data () {
    return {
      breadList: [],
      expID: -1,
      expName: '',
      expStartTime: '',
      expEndTime: '',
      expType: '实验'
    }
  },
  mounted () {
    this.expID = Number(sessionStorage.getItem('expDetail_expID'))
    // this.from = this.$route.query.from
    // this.breadList.push({name: '课程管理', path: '/teacher/course'})
    // this.breadList.push({name: '课程详情', path: this.$route.query.from})
    this.breadList = JSON.parse(sessionStorage.getItem('expDetail_breadList'))
    this.expStartTime = sessionStorage.getItem('expDetail_expStartTime')
    this.expEndTime = sessionStorage.getItem('expDetail_expEndTime')
    this.expName = sessionStorage.getItem('expDetail_expName')
    this.expType = sessionStorage.getItem('expDetail_expType')
    this.breadList.push({name: this.expType + this.expName + '的详情', path: this.$route.fullPath})
  }
}
</script>

<style scoped>

</style>
