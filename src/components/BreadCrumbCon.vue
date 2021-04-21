<!--是个静态的面包屑 用法参考expInfo-->
<template>
    <div>
      <Breadcrumb separator=">" class="bread-crumb">
        <BreadcrumbItem v-for="(item,index) in breadlist" :to=item.path :key="index">
          {{item.name}}
        </BreadcrumbItem>
      </Breadcrumb>
    </div>
</template>

<script>
export default {
  name: 'BreadCrumbCon',
  props: [
    'breadlist'
  ]
}
</script>

<style scoped>
  .bread-crumb{
    font-size: large;
    margin: 10px;
  }
</style>
