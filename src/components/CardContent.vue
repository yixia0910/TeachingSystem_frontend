<template>
  <div class="card-box">
    <Card :dis-hover=true>
      <div class="card-title">{{title}}</div>
      <div class="card-content">
        <slot></slot>
      </div>
    </Card>
  </div>
</template>

<script>
export default {
  name: 'CardContent',
  props: [
    'title'
  ]
}
</script>

<style scoped>
  >>>.ivu-card{
    min-width: 1000px;
    margin: 10px;
  }
  .card-box{
    margin: 10px 0 20px 0;
  }
  .card-title{
    font-size: x-large;
    padding-top: 10px;
  }
  .card-content{
    padding: 20px 10px 10px 10px;
  }
</style>
