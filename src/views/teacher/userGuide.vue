<template>
  <div>
    <NavBar :username="this.$cookie.get('username')" infopage='/teacher/info' :breadlist="breadList">
      <div slot="navbarContent">
        <CardContent title="使用手册">
          <div id="wwwwwwwwww">
            <Carousel v-model="value1" loop style="height:500px" :trigger="trigger">
              <CarouselItem style="height:500px">
                <div class="demo-carousel">1 实验虚拟机搬到了课程管理-课程详情</div>
              </CarouselItem>
              <CarouselItem style="height:500px">
                <div class="demo-carousel">2 模板管理搬到了虚拟机管理</div>
              </CarouselItem>
              <CarouselItem style="height:500px">
                <div class="demo-carousel">3 批量创建虚拟机后，可单独为没有虚拟机的学生添加虚拟机</div>
              </CarouselItem>
              <CarouselItem style="height:500px">
                <div class="demo-carousel">4 当课程下仍有学生，实验和虚拟机时不能删除课程</div>
              </CarouselItem>
              <CarouselItem style="height:500px">
                <div class="demo-carousel">5 虚拟机配置CPU超过4核或内存超过8G或磁盘容量超过200G通过审批后才能修改</div>
              </CarouselItem>
            </Carousel>
          </div>
        </CardContent>
      </div>
    </NavBar>
  </div>
</template>

<script>
import NavBar from '../../components/NavBar'
import CardContent from '../../components/CardContent'

export default {
  name: 'userGuide',
  components: {
    NavBar,
    CardContent
  },
  data () {
    return {
      value1: 0,
      breadList: [{name: '使用手册', path: '/teacher/userGuide'}],
      trigger: 'hover'
    }
  }
}
</script>

<style scoped>
  .demo-carousel{
    font-size: 30px;
    line-height: 500px;
    background: #506b9e;
    color: white;
    padding-left: 300px;
    /*text-align: center;*/
  }
</style>
