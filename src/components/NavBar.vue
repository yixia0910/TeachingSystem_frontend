<template>
  <Layout style="height: 100vh;">
    <Sider class="left-sider" hide-trigger breakpoint="md" ref="side1" width=218 collapsed-width=78 collapsible v-model="isCollapsed">
      <div style="max-width:100%" :class="isCollapsed ? 'label-hide':'label-appear'">
<!--        <Icon type="md-apps" size="81"></Icon>-->
        <img class="logo-img" src="../assets/img/buaa.png" />
      </div>
      <div class="sider-scroll-box">
        <Menu ref="menuitem"
              accordion :active-name="menuitem"
              style="width: inherit; text-align: left" theme="dark"
              :class="isCollapsed ? 'left-sider-menu-coll': 'left-sider-menu'">
          <MenuGroup title="学生" v-if="role === 'student'">
            <MenuItem v-for="(item,index) in studentMenu" :key="index" :name="item.path" :to="item.path">
              <Icon :type="item.icon"></Icon>
              <Span>{{item.title}}</Span>
            </MenuItem>
          </MenuGroup>
          <MenuGroup title="教师" v-if="role === 'teacher'">
            <MenuItem v-for="(item,index) in teacherMenu" :key="index" :name="item.path" :to="item.path">
              <Icon :type="item.icon"></Icon>
              <Span>{{item.title}}</Span>
            </MenuItem>
          </MenuGroup>
<!--          <MenuGroup v-if="role === 'admin' || role === 'superAdmin'" title="人员">-->
<!--            <MenuItem v-for="(item,index) in personnel" :key="index" :name="item.path" :to="item.path">-->
<!--              <Icon :type="item.icon"></Icon>-->
<!--              <Span>{{item.title}}</Span>-->
<!--            </MenuItem>-->
<!--          </MenuGroup>-->
          <MenuGroup title="部门管理员" v-if="role === 'admin'">
            <MenuItem v-for="(item,index) in adminMenu" :key="index" :name="item.path" :to="item.path">
              <Icon :type="item.icon"></Icon>
              <Span>{{item.title}}</Span>
            </MenuItem>
          </MenuGroup>
          <MenuGroup title="管理员" v-if="role === 'superAdmin' && vmtype !== 'Sangfor'">
            <MenuItem v-for="(item,index) in superAdminMenu" :key="index" :name="item.path" :to="item.path">
              <Icon :type="item.icon"></Icon>
              <Span v-if="item.name !== 'item9' || alertInfo === false">{{item.title}}</Span>
              <Span style="color: #FFFFFF;font-weight: 600" v-if="item.name === 'item9' && alertInfo === true">有未处理的申请</Span>
            </MenuItem>
          </MenuGroup>
          <MenuGroup title="管理员" v-if="role === 'superAdmin' && vmtype === 'Sangfor'">
            <MenuItem v-for="(item,index) in superAdminMenu1" :key="index" :name="item.path" :to="item.path">
              <Icon :type="item.icon"></Icon>
              <Span v-if="item.name !== 'item9' || alertInfo === false">{{item.title}}</Span>
              <Span style="color: #FFFFFF;font-weight: 600" v-if="item.name === 'item9' && alertInfo === true">有未处理的申请</Span>
            </MenuItem>
          </MenuGroup>
        </Menu>
      </div>
    </Sider>
    <Layout>
      <Header class="header-con">
        <!-- <Icon @click.native="collapsedSider" type="md-menu" size=24></Icon> -->
        <div style="display: flex;height:100px;font-size:22px;font-weight:600;color:rgba(74,74,74,1);margin-top: 20px;vertical-align: center">
          教学过程评价系统
        </div><Dropdown trigger="click" class="header-con-drop">
          <div style="display: flex;">
            <div class="role" v-if="role==='student'">学生</div>
            <img style="margin-top: 23px; height: 20px; float: right; cursor: pointer;" src="../assets/img/img/icon-help.png" @click="getHelp"/>
            <div class="role" v-if="role==='teacher'">教师</div>
            <div class="role" v-if="role==='admin'">部门管理员</div>
            <div class="role" v-if="role==='superAdmin'">管理员</div>
            <div style="display: flex;font-size:18px;font-weight:600;color:rgba(74,74,74,1);">{{this.$cookie.get('username')}}</div>
            <Icon class="ivu-icon-md-arrow-dropdown" style="margin-top: 22px;"></Icon>
          </div>
          <DropdownMenu slot="list">
            <router-link :to="{path: '/student/info'}" v-if="role==='student'">
              <DropdownItem>
                <Icon class="ivu-icon-md-person"></Icon>
                个人简介
              </DropdownItem>
            </router-link>
            <router-link :to="{path: '/teacher/info'}" v-if="role==='teacher'">
              <DropdownItem>
                <Icon class="ivu-icon-md-person"></Icon>
                个人简介
              </DropdownItem>
            </router-link>
            <router-link :to="{path: '/admin/info'}" v-if="role==='admin' || role === 'superAdmin'">
              <DropdownItem>
                <Icon class="ivu-icon-md-person"></Icon>
                个人简介
              </DropdownItem>
            </router-link>
            <DropdownItem>
              <router-link v-on:click.native=clearCookie :to="{path: '/'}" style="color: black">
                <Icon class="ivu-icon-md-log-out"></Icon>
                退出登录
              </router-link>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </Header>
      <Content class="main-content-con">
        <Layout class="main-layout-con">
          <Content class="content-wrapper">
            <div style="font-size: large">
              <BreadCrumbCon :breadlist="breadlist"></BreadCrumbCon>
            </div>
            <keep-alive>
              <slot name="navbarContent" >slot=navbarContent</slot>
            </keep-alive>
          </Content>
        </Layout>
      </Content>
    </Layout>
  </Layout>
</template>

<script>
import Caspanel from 'iview/src/components/cascader/caspanel'
import BreadCrumbCon from './BreadCrumbCon'
import net from '../assets/Global'
export default {
  name: 'NavBar',
  props: [
    'breadlist'
  ],
  components: {BreadCrumbCon, Caspanel},
  data () {
    return {
      alertInfo: false,
      isCollapsed: false,
      role: this.$cookie.get('role'),
      studentMenu: [
        {name: 'item1', title: '学习任务', icon: '', path: '/student/experiments'}
      ],
      teacherMenu: [
        {name: 'item1', title: '课程管理', path: '/teacher/course'}
      ],
      personnel: [
        {name: 'item1', title: '学生管理', path: '/admin/student'},
        {name: 'item2', title: '部门管理员管理', path: '/admin/admin'},
        {name: 'item3', title: '教师管理', path: '/admin/teacher'},
        {name: 'item4', title: '人员管理', path: '/admin/member'},
        {name: 'itme8', title: '应用中心', path: '/security/index'}
      ],
      adminMenu: [
        {name: 'item3', title: '人员管理', path: '/admin/member'},
        {name: 'item4', title: '学期管理', path: '/admin/semester'},
        {name: 'item5', title: '实验管理', path: '/admin/experiment'},
        {name: 'item7', title: '模板管理', path: '/admin/template'},
        {name: 'item8', title: '虚拟机管理', path: '/admin/vm'},
        {name: 'item9', title: '申请记录', path: '/application/records'},
        {name: 'item10', title: '平台数据', path: '/admin/data'},
        {name: 'itme8', title: '应用中心', path: '/security/index'}
      ],
      superAdminMenu: [
        {name: 'item4', title: '人员管理', path: '/admin/member'},
        {name: 'item4', title: '学期管理', path: '/admin/semester'},
        {name: 'item5', title: '实验管理', path: '/admin/experiment'},
        {name: 'item6', title: '主机管理', path: '/machine/admin'},
        {name: 'item7', title: '模板管理', path: '/admin/template'},
        {name: 'item8', title: '虚拟机管理', path: '/admin/vm'},
        {name: 'item9', title: '申请记录', path: '/application/records'},
        {name: 'item10', title: '操作日志', path: '/operation/log'},
        {name: 'item11', title: '平台数据', path: '/admin/data'},
        {name: 'itme8', title: '应用中心', path: '/security/index'}
      ],
      superAdminMenu1: [
        {name: 'item4', title: '人员管理', path: '/admin/member'},
        {name: 'item4', title: '学期管理', path: '/admin/semester'},
        {name: 'item5', title: '实验管理', path: '/admin/experiment'},
        {name: 'item7', title: '模板管理', path: '/admin/template'},
        {name: 'item8', title: '虚拟机管理', path: '/admin/vm'},
        {name: 'item9', title: '申请记录', path: '/application/records'},
        {name: 'item10', title: '操作日志', path: '/operation/log'},
        {name: 'item11', title: '平台数据', path: '/admin/data'},
        {name: 'itme8', title: '应用中心', path: '/security/index'}
      ],
      menuitem: this.$route.path,
      vmtype: net.vmmanager
    }
  },
  mounted () {
    var alertInfo = false
    if (this.role === 'admin' || this.role === 'superAdmin') {
      this.$http.get('/common/applynotfinish')
        .then(res => {
          if (res.data.data === 1) {
            alertInfo = true
            this.alertInfo = alertInfo
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  created () {
    console.log(this.role)
    this.$nextTick(() => {
      if (this.$route.name !== 'stuInfo' && this.$route.name !== 'teacherInfo' && this.$route.name !== 'adminInfo') {
        this.menuitem = this.breadlist[0].path
      }
      this.$refs.menuitem.updateActiveName()
    })
    this.$store.commit('setBreadCrumb', this.breadlist)
  },
  methods: {
    collapsedSider () {
      this.$refs.side1.toggleCollapse()
    },
    clearCookie () {
      this.$http.post('/security/logout')
      this.$cookie.remove('token')
      this.$cookie.remove('username')
      this.$cookie.remove('userId')
      this.$cookie.remove('role')
      this.$router.push('/')
    },
    getHelp () {
      this.$router.push('/help')
    }
  }
}
// TODO: 侧边栏的宽度、点击用户名下拉菜单样式
</script>

<style scoped>
  .role{
    margin-top: 22px;
    border-radius:3px;
    height:22px;
    font-size:14px;
    font-weight:500;
    color:rgba(35,171,255,1);
    background: rgba(35,171,255,0.2);
    line-height:20px;
    text-align: center;
    padding-left: 5px;
    padding-right: 5px;
  }
  .logo-img{
    margin-top: 25px;
    margin-left: 5%;
    width: 90%;
  }
  .left-sider{
    height: 100vh;
    position: relative;
    font-size: large;
    color: lightskyblue;
    text-align: left;
    padding-top: 10px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .sider-scroll-box{
    overflow-y: hidden;
    overflow-x: hidden;
    height: 80%;
    margin-right: -18px;
  }
  .label-hide span{
    display: none;
  }
  .label-hide i{
    transform: translateX(0px);
    vertical-align: center;
    transition: font-size .2s ease .2s, transform .2s ease .2s;
  }
  .label-appear i{
    transform: translateX(0px);
    vertical-align: center;
    transition: font-size .2s ease .2s, transform .2s ease .2s;
  }
  .label-appear span{
    white-space: nowrap;
    transition: width .2s ease .2s;
  }
  .left-sider-menu span{
    white-space: nowrap;
    transition: width .2s ease .2s;
  }
  .left-sider-menu-coll span{
    display: none;
  }
  .left-sider-menu-coll>>>.ivu-menu-item-group-title {
    height: 10px;
    visibility: hidden;
  }
  .left-sider-menu-coll i{
    transform: translateX(0px);
    transition: font-size .2s ease .2s, transform .2s ease .2s;
    vertical-align: middle;
    font-size: 22px;
  }
  .left-sider-menu-coll>>>.ivu-menu-submenu-title-icon{
    right: 0;
  }
  .header-con{
    background: #fff;
    padding: 0 20px;
    width: 100%;
    font-size: x-large;
    height: 100px;
  }
  .header-con-drop{
    margin-top: -100px;
    cursor: pointer;
    float: right;
    margin-right: 20px;
    font-size: large;
  }
  .main-layout-con{
    height: 100%;
    overflow: hidden;
  }
  .main-content-con{
    height: calc(100% - 60px);
    overflow: hidden;
  }
  .content-wrapper{
    padding: 18px;
    height: calc(100% - 80px);
    overflow: auto;
  }

  /deep/ .ivu-menu{
    background: #31A6EE;
  }
  /deep/ .ivu-layout-sider{
    background: #31A6EE;
  }
  /deep/ .ivu-menu-item-group-title{
    height: 2vh;
    background: #31A6EE;
    visibility: hidden;
  }
  /deep/ .ivu-menu-item{
    background: #31A6EE;
    height: 7vh;
  }
  /deep/ .ivu-menu-item:hover{
    background: #E8F2F9;
  }
  /deep/ .ivu-menu-item i{
    margin-left: -23px;
    margin-top: -14px;
    width: 5px;
    height: 7vh;
    background: rgba(255,255,255,0.8);
    position: absolute;
    visibility: hidden;
  }
  /deep/ .ivu-menu-item-selected i{
    visibility: visible;
  }
  /deep/ .ivu-menu-item span{
    font-size: 18px;
    font-weight:400;
    letter-spacing: 0.6px;
    color:rgba(255,255,255,0.7);
    line-height:4vh;
    text-align: center;
    display: inline-block;
    width: 100%;
  }
  /deep/ .ivu-menu-item-selected span{
    font-weight: 600;
    color:rgba(255,255,255,1);
  }
  /deep/ .ivu-menu-dark.ivu-menu-vertical .ivu-menu-item:hover, .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu-title:hover{
    background: rgba(232,242,249,0.3);
    border: 1px solid #FFFFFF;
    border-left: none;
    border-right: none;
  }
  /deep/ .ivu-menu-dark.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu), .ivu-menu-dark.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu):hover, .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu-title-active:not(.ivu-menu-submenu), .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu-title-active:not(.ivu-menu-submenu):hover{
    background: rgba(232,242,249,0.3);
  }

</style>
