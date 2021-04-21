<template>
  <Layout>
    <Header class="help_header">
      <Button :type="teacherType" @click="select('teacher')">教师版</Button>
      <Button :type="studentType" @click="select('student')">学生版</Button>
      <Button :type="adminType" @click="select('admin')">管理员版</Button>
    </Header>
    <Content style="height: calc(100vh - 64px)">
      <iframe id="help_doc" frameborder="0" :src="doc" scrolling="yes"></iframe>
    </Content>
  </Layout>
</template>

<script>
export default {
  name: 'Help',
  data () {
    return {
      teacherType: 'primary',
      studentType: 'default',
      adminType: 'default',
      doc: 'static/helpCenter/Teacher.html'
    }
  },
  methods: {
    select (type) {
      if (type === 'teacher') {
        this.teacherType = 'primary'
        this.studentType = 'default'
        this.adminType = 'default'
        this.doc = 'static/helpCenter/Teacher.html'
      } else if (type === 'student') {
        this.teacherType = 'default'
        this.studentType = 'primary'
        this.adminType = 'default'
        this.doc = 'static/helpCenter/Student.html'
      } else if (type === 'admin') {
        this.teacherType = 'default'
        this.studentType = 'default'
        this.adminType = 'primary'
        this.doc = 'static/helpCenter/Admin.html'
      }
    }
  }
}
</script>

<style scoped>
.help_header {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background: #f8f8f9;
}
.help_header .ivu-btn {
  margin: 0 10px 0 10px;
}
#help_doc {
  height: 100%;
  width: 100%;
}
</style>
