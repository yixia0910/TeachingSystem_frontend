<template>
  <NavBar :breadlist="breadlist">
    <Layout slot="navbarContent" style="height: 500px; border: 1px solid #eee">
      <Sider width="200px" style="background-color: rgb(238, 241, 246)">
        <el-menu @select="selectMenu" style="height: 100%">
          <el-menu-item index="1"><i class="el-icon-message"></i>分享动态</el-menu-item >
          <el-menu-item index="2"><i class="el-icon-message"></i>我的分享</el-menu-item >
          <el-menu-item index="3"><i class="el-icon-message"></i>管理分享组</el-menu-item >
        </el-menu>
      </Sider>
      <Layout style="overflow: hidden">
        <Header style="background: transparent">
          <Button v-if="menu===1">下载</Button>
          <Button v-if="menu===1">保存到我的网盘</Button>
          <Button v-if="menu===2">详情</Button>
          <Button v-if="menu===2">取消分享</Button>
          <Button v-if="menu===3">创建</Button>
          <Button v-if="menu===3">查看</Button>
          <Button v-if="menu===3">删除</Button>
          <Button v-if="menu===1" style="float: right;margin-top: 10px">按用户展示</Button>
          <Button v-if="menu===1" style="float: right;margin-top: 10px">按时间展示</Button>
        </Header>
        <Content class="main" v-if="menu===1">
          <div  v-for="(user,idx) in shareFiles" :key="idx">
            <el-divider content-position="left">{{user.userName}}的分享</el-divider>
            <div v-for="(file,idx1) in user.files" :key="idx1" class="share-group">
              <img src="../../assets/theme/default theme/imageres_162.ico"/>
              <p>{{file.name}}</p>
            </div>
          </div>
        </Content>
        <Content class="main" v-if="menu===2">
          <div  v-for="(user,idx) in myShareFiles" :key="idx">
            <el-divider content-position="left">{{user.date}}</el-divider>
            <div v-for="(file,idx1) in user.files" :key="idx1" class="share-group">
              <img src="../../assets/theme/default theme/imageres_162.ico"/>
              <p>{{file.name}}</p>
            </div>
          </div>
        </Content>
        <Content class="main" v-if="menu===3">
          <div v-for="(item,idx) in shareGroups" :key="idx" class="share-group">
            <img src="../../assets/theme/default theme/imageres_178.ico"/>
            <p>{{item.name}}</p>
          </div>
        </Content>
      </Layout>
    </Layout>
  </NavBar>
</template>

<style>
  .main{
    background: white;
    overflow: auto;
  }
  .share-group {
    width: 120px;
    padding: 8px;
    display: inline-block;
  }
  .share-group:hover{
    background: rgba(0,140,255,.1);;
  }
  .share-group img{
    width: 100%;
    height: auto;
  }
  .share-group p{
    text-align: center;
    margin: 10px 0;
  }
</style>

<script>
import NavBar from '../../components/NavBar'
export default {
  name: 'share',
  components: {NavBar},
  data () {
    return {
      breadlist: [
        {name: '资源共享', path: '/netdisk/share'}
      ],
      menu: 1,
      shareFiles: [
        {
          userName: '张老师',
          files: [
            {
              name: '课件'
            },
            {
              name: '作业'
            }
          ]
        },
        {
          userName: '张老师',
          files: [
            {
              name: '课件1'
            },
            {
              name: '课件2'
            },
            {
              name: '课件3'
            }
          ]
        },
        {
          userName: '张老师',
          files: [
            {
              name: '答案'
            }
          ]
        }
      ],
      myShareFiles: [
        {
          date: '今天',
          files: [
            {
              name: '第一次试验报告'
            },
            {
              name: '第二次作业'
            }
          ]
        },
        {
          date: '一天前',
          files: [
            {
              name: '教材PDF'
            },
            {
              name: '安装包'
            }
          ]
        },
        {
          date: '一周前',
          files: [
            {
              name: '数分答案'
            }
          ]
        }
      ],
      shareGroups: [
        {
          id: '1',
          name: '算法课程学生'
        },
        {
          id: '1',
          name: '所有用户'
        },
        {
          id: '1',
          name: '算法助教'
        },
        {
          id: '1',
          name: '软工课程学生'
        }
      ]
    }
  },
  methods: {
    selectMenu (idx) {
      this.menu = parseInt(idx)
    }
  }
}
</script>
