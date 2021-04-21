<template>
  <div>
    <NavBar :breadlist="breadlist">
      <!--<div slot="navbarContent">
        <CardContent>
          <TableComponent ref="table" :columnsFromFather="columns" :allDataFromFather="showData" @refresh="refreshData">
            <slot>
              <ButtonGroup>
                <Button :type="currentType === 'all' ? 'primary' : 'default'" @click="handleAll">全部</Button>
                <Button :type="currentType === 'yes' ? 'primary' : 'default'" @click="handleYes">已处理</Button>
                <Button :type="currentType === 'no' ? 'primary' : 'default'" @click="handleNo">未处理</Button>
              </ButtonGroup>
            </slot>
          </TableComponent>
        </CardContent>
      </div>-->
      <ApplicationInfoCon slot="navbarContent"></ApplicationInfoCon>
    </NavBar>
  </div>
</template>

<script>
import NavBar from '../../components/NavBar'
import CardContent from '../../components/CardContent'
import TableComponent from '../../components/TableComponent'
import ApplicationInfoCon from '../../components/applicationInfoCon'
export default {
  name: 'applicationInfo',
  components: {NavBar, CardContent, TableComponent, ApplicationInfoCon},
  data () {
    return {
      breadlist: [
        {name: '申请记录', path: '/student/applicationInfo'}
      ]
    }
  },
  created () {},
  methods: {}
}
</script>

<style scoped>

</style>
