<style>
.searchResultCellStyle {
  /*background-color: #2db7f5;*/
  color: red;
}
</style>
<template>
<!--  为什么这个宽度是97%以上的时候就会出现奇怪的滚动条？？-->
  <div style="width:97%">
    <div style="margin-bottom: 2%;width: 100%">
      <Row>
        <Col :span="buttonSpan" class="www">
            <slot></slot>
            <div style="height: 1px;width:0px"></div>
        </Col>
        <Col :span="24-buttonSpan" style="text-align: right">
            <ButtonGroup style="padding-left:2%;">
              <Button icon="md-refresh" @click="clickRefreshButton" :loading="loading">刷新</Button>
              <!-- <Poptip placement="bottom-end" width="300">
                <Button icon="md-color-wand">显示设置</Button>
                <div class="api" slot="content">
                  <Table max-height="400" :columns="columnsSelectTableTitle" :data="columnsName"></Table>
                </div>
              </Poptip> -->
            </ButtonGroup>
        </Col>
      </Row>
    </div>
    <div v-if="highLightRow">
      <Table highlight-row  @on-current-change="onCurrentChangedFun" border :columns="computedColumns" :row-class-name="rowClassName" :data="showData"></Table>
    </div>
    <div v-else>
      <Table :loading="loading" @on-sort-change="onSortChangedFun" @on-selection-change="onSelectionChangedFun" border :columns="computedColumns" :row-class-name="rowClassName" :data="showData"></Table>
    </div>
    <div style="text-align: right;padding-top:1%;font-size:x-small;">
      <Page :current.sync="nowPage" :page-size-opts="pageSizeOpts" :total="nowDataCount" show-elevator show-total show-sizer @on-change="changePage" @on-page-size-change="changePageSize"/>
    </div>
  </div>
</template>

<script>
import {Switch} from 'iview'
// TODO: 设置处的icon改成齿轮
export default {
  name: 'TableComponent2',
  inject: ['reload'],
  props: {
    highLightRow: {
      type: Boolean,
      default: false
    },
    onCurrentChangedFun: {
      type: Function,
      default: function (currentRow, oldCurrentRow) { }
    },
    onSelectionChangedFun: {
      type: Function,
      default: function (selection) { }
    },
    columnsFromFather: {
      type: Array,
      required: true
    },
    allDataFromFather: {
      type: Array,
      default: function () {
        return []
      }
    },
    loading: {
      type: Boolean,
      default: false
    },
    rowClassName: {
      type: Function,
      default: function () { return '' }
    },
    buttonSpan: {
      type: Number,
      default: function () {
        return 15
      }
    }
  },
  data () {
    return {
      iph: '\ue614 搜索',
      allData: [],
      boolShow: [],
      hackReset: true,
      pageSize: 10,
      nowPage: 1,
      selectString: '',
      columnsSelectTableTitle: [
        {
          title: '列名',
          key: 'columnName'
        },
        {
          title: '是否显示',
          key: 'display',
          render: (h, params) => {
            return h(Switch, {
              props: {
                value: this.boolShow[params.index]
              },
              on: {
                'on-change': () => {
                  let newBoolShow = this.boolShow.concat()
                  newBoolShow[params.index] = !newBoolShow[params.index]
                  this.boolShow = newBoolShow
                }
              }
            })
          }
        }]
    }
  },
  watch: {
    selectString () {
      this.changePage(1)
    },
    pageSize () {
      this.changePage(1)
    },
    nowData () {
      this.changePage(1)
    },
    allDataFromFather (newval, oldval) {
      this.allData = newval.concat()
      for (let i = 0; i < this.allData.length; i++) {
        this.allData[i]['index'] = i + 1
      }
    }
  },
  computed: {
    pageSizeOpts: function () {
      if (this.nowDataCount <= 20) {
        return [10, 20]
      } else if (this.nowDataCount <= 40) {
        return [10, 20, 40]
      } else {
        return [10, 20, 40, this.nowDataCount]
      }
    },
    computedColumns: function () {
      let columnsArr = this.columnsFromFather
      let showArr = this.boolShow
      let listRes = []
      showArr.forEach(function (item, index) {
        if (item === true) {
          listRes.push(columnsArr[index])
        }
      })
      return listRes
    },
    columnsName: function () {
      let listColumns = []
      this.columnsFromFather.forEach(item => {
        listColumns.push({'columnName': item.title})
      })
      return listColumns
    },
    // 目前符合条件的data的个数
    nowDataCount: function () {
      return this.nowData.length
    },
    // 目前显示的data
    showData: function () {
      let value = (this.nowPage - 1) * this.pageSize
      return this.nowData.slice(value, value + this.pageSize)
    },
    // 目前符合条件的data，如果搜索字符串是''则就是alldata，如果有搜索字符串就是搜索后的结果
    nowData: function () {
      let searchStr = this.selectString
      if (this.selectString === '') {
        return this.allData
      } else {
        let columnsObj = this.computedColumns
        let columnsArr = []
        columnsObj.forEach(item => {
          columnsArr.push(item.key)
        })
        let searchIndex = false
        if (columnsArr.indexOf('index') !== -1) {
          searchIndex = true
        }
        let dataRes = []
        this.allData.forEach(function (item, index) {
          let addItem = false
          let newItem = JSON.parse(JSON.stringify(item))
          newItem.cellClassName = {}
          if (searchIndex === true) {
            let realIndex = Number(index) + 1
            if (('' + realIndex).indexOf(searchStr) !== -1) {
              newItem.cellClassName['index'] = 'searchResultCellStyle'
              addItem = true
            }
          }
          for (let i = 0; i < columnsArr.length; i++) {
            let columnName = columnsArr[i]
            if (item.hasOwnProperty(columnName)) {
              if (('' + item[columnName]).indexOf(searchStr) !== -1) {
                newItem.cellClassName[columnName] = 'searchResultCellStyle'
                if (addItem === false) {
                  addItem = true
                }
              }
            }
          }
          if (addItem === true) {
            dataRes.push(newItem)
          }
        })
        return dataRes
      }
    }
  },
  mounted () {
    this.boolShow = new Array(this.columnsFromFather.length)
    this.boolShow.fill(true)
  },
  methods: {
    changePage (pageNum) {
      this.nowPage = pageNum
    },
    changePageSize (pageSize) {
      this.pageSize = pageSize
    },
    clickRefreshButton () {
      this.$emit('refresh')
    },
    onSortChangedFun (sortInfo) {
      if (sortInfo.order === 'asc') {
        if (sortInfo.column.sortType === 'number') {
          this.allData.sort(function (a, b) {
            return parseFloat(a[sortInfo.key]) - parseFloat(b[sortInfo.key])
          })
        } else {
          this.allData.sort(function (a, b) {
            return String(a[sortInfo.key]).localeCompare(String(b[sortInfo.key]), 'zh-CN')
          })
        }
      } else {
        if (sortInfo.column.sortType === 'number') {
          this.allData.sort(function (a, b) {
            return -(parseFloat(a[sortInfo.key]) - parseFloat(b[sortInfo.key]))
          })
        } else {
          this.allData.sort(function (a, b) {
            return -String(a[sortInfo.key]).localeCompare(String(b[sortInfo.key]), 'zh-CN')
          })
        }
      }
    }
  }
}
</script>

<style scoped src="../assets/font/iconfont.css"></style>
<style scoped>
  .top,.bottom{
    text-align: center;
  }
  .center{
    width: 300px;
    margin: 10px auto;
    overflow: hidden;
  }
  .center-left{
    float: left;
  }
  .center-right{
    float: right;
  }
  /deep/ .ivu-input{
    height: 40px;
    font-family: 'iconfont';
  }
  /deep/ input::-webkit-input-placeholder, textarea::-webkit-input-placeholder {
    font-size:14px;
    font-weight:400;
    color:rgba(192,196,204,1);
    line-height:14px;
  }

  /deep/ input:-moz-placeholder, textarea:-moz-placeholder {
    font-size:14px;
    font-weight:400;
    color:rgba(192,196,204,1);
    line-height:14px;
  }

  /deep/ input::-moz-placeholder, textarea::-moz-placeholder {
    font-size:14px;
    font-weight:400;
    color:rgba(192,196,204,1);
    line-height:14px;
  }

  /deep/ input:-ms-input-placeholder, textarea:-ms-input-placeholder {
    font-size:14px;
    font-weight:400;
    color:rgba(192,196,204,1);
    line-height:14px;
  }

</style>
