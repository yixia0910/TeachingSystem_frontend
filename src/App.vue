<template>
  <div id="app">
    <router-view :v-if="isRouterAlive"/>
  </div>
</template>

<script>
export default {
  name: 'App',
  provide () {
    return {
      reload: this.reload
    }
  },
  data () {
    return {
      isRouterAlive: true
    }
  },
  methods: {
    reload () {
      this.isRouterAlive = false
      console.log('isRouterAlive')
      console.log(this.isRouterAlive)
      this.$nextTick(() => {
        console.log('refresh')
        this.isRouterAlive = true
        console.log('isRouterAlive')
        console.log(this.isRouterAlive)
      })
    }
  }
}
</script>

<style>
  html,body,#app{
    height: 100%;
  }
</style>
