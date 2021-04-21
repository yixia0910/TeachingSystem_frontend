<template>
  <div>
    <NavBar :username="this.$cookie.get('username')" infopage='/teacher/info'>
      <InfoContent slot="navbarContent"></InfoContent>
    </NavBar>
  </div>
</template>

<script>
import NavBar from '../../components/NavBar'
import InfoContent from '../../components/InfoContent'

export default {
  name: 'info',
  components: {
    NavBar,
    InfoContent
  },
  data () {
    return {}
  },
  methods: {}
}
</script>

<style scoped>

</style>
