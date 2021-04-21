<template>
  <NavBar :breadlist="breadlist">
    <Layout slot="navbarContent">
      <Sider style="padding-top: 15px;background: white">
        <Button style="margin: 0 0 10px 10px" size="small" @click="refreshFolderTree()" icon="ios-refresh"></Button>
        <el-tree :default-expanded-keys="['/']" style="height: calc(100% - 50px);" :data="treeData" @node-click="treeNodeClick"
                 node-key="id"
                 :expand-on-click-node="false">
                <span class="custom-tree-node" slot-scope="{ node, data }">
                  <span>
                    <img class="tree-icon" src="../../assets/theme/default theme/imageres_162.ico"/>
                    {{ node.label==='/'?'我的资源':node.label }}
                  </span>
                </span>
        </el-tree>
      </Sider>
      <Content direction="vertical" style="margin-left: 15px">
        <Row style="margin-bottom: 10px">
          <p style="border: 1px solid #ccc;color: #888">
            <span class="mulu" v-for="(item,idx) in filePath" :key="idx" @click="back(idx-filePath.length+1)">
              <span>{{item==='/'?'我的资源':item}}</span>
              >
            </span>
          </p>
        </Row>
        <Row>
          <ButtonGroup>
            <Button v-if="filePathId.length>1" @click="back(-1)">返回</Button>
            <Button @click="refresh()">刷新</Button>
            <Button @click="download()" :disabled="this.getSelectedFileIds().length!==1||this.getSelectedFileIds().length===1&&this.getSelectedFileIds()[0].IsFolder">下载</Button>
            <Button @click="uploadDialogFormVisible=true">上传</Button>
            <Button @click="createFolderDialogFormVisible=true">新建文件夹</Button>
            <Button @click="copyToDialogFormVisible=true" :disabled="this.getSelectedFileIds().length<=0">复制到</Button>
            <Button @click="selectAll()">全选</Button>
            <Button @click="renameDialogFormVisible=true" :disabled="this.getSelectedFileIds().length!=1">重命名</Button>
          </ButtonGroup>
        </Row>
        <Row style="margin-top: 12px">
          <ul v-if="viewType!='detail'" class="items" style="min-height: 442px" @click="unselectAll()">
            <p v-if="loading">{{fileTip}}</p>
            <li v-for="(i,idx) in files" :key="idx" :class="'item '+viewType+(i.Selected?' selected':'')" @click.ctrl.stop="clickFileWithCtrl(idx)" @click.shift.stop="clickFileWithShift(idx)" @click.stop="clickFile(idx)" @dblclick="dblClickFile(i.Id,i.Name,i.IsFolder)">
              <el-tooltip :open-delay="800" visible-arrow="false" effect="light">
                <div slot="content" style="white-space: pre;line-height: 1.5em">{{i.Name+(i.IsFolder?'':'\n大小: '+bytesToSize(i.Size))+'\n创建日期: '+$dateformat( i.CreateTime,'yyyy-mm-dd HH:MM:ss')}}</div>
                <div class="file-block">
                  <img class="icon" :src="getIcon(i.Name,i.IsFolder)" />
                  <span class="name">{{i.Name}}</span>
                </div>
              </el-tooltip>
            </li>
          </ul>
          <el-table v-else class="file-detail"></el-table>
        </Row>
        <Row style="margin-top: 8px">
          <p style="color: #666">{{'共'+files.length+'个对象'+(countSelectedFiles()>0?'，已选中'+countSelectedFiles()+'个对象':'')}}</p>
        </Row>
      </Content>
      <Modal title="复制到" v-model="copyToDialogFormVisible">
        <Button @click="refreshFolderTree()" icon="ios-refresh" style="margin: 0 0 10px 0" size="small" ></Button>
        <el-tree style="border: 1px solid #ddd;" :default-expanded-keys="['/']" :data="treeData"
                 node-key="id"
                 highlight-current
                 :expand-on-click-node="false">
                <span class="custom-tree-node" slot-scope="{ node, data }">
                  <img class="tree-icon" src="../../assets/theme/default theme/imageres_162.ico"/>
                  <span>{{ node.label==='/'?'我的资源':node.label }}</span>
                </span>
        </el-tree>
        <div slot="footer" class="dialog-footer">
          <Button @click="copyToDialogFormVisible=false">取 消</Button>
          <Button type="primary" @click="console.log('待实现')">确 定</Button>
        </div>
      </Modal>
      <Modal title="上传文件" v-model="uploadDialogFormVisible">
        <el-upload
          class="upload-demo"
          ref="upload"
          :action="uploadServerUrl+'/uploadFileByParent'"
          :headers="uploadHeaders"
          :data="uploadData"
          :on-success="fileUploadSuccess"
          :auto-upload="false"
          multiple>
          <Button slot="trigger" size="small" type="primary">选取文件</Button>
          <Button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</Button>
          <div slot="tip" class="el-upload__tip">不超过500kb</div>
        </el-upload>
      </Modal>
      <Modal title="新建文件夹" v-model="createFolderDialogFormVisible">
        <el-form :model="createFolderForm">
          <el-form-item label="文件夹名称: " label-width="200">
            <el-input v-model="createFolderForm.name" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <Button @click="createFolderForm.name='';createFolderDialogFormVisible=false">取 消</Button>
          <Button type="primary" @click="createFolderByParentAndName()">确 定</Button>
        </div>
      </Modal>
      <Modal title="重命名" v-model="renameDialogFormVisible">
        <el-form :model="renameForm">
          <el-form-item label="文件夹名称: " label-width="200">
            <el-input v-model="renameForm.name" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <Button @click="renameForm.name='';renameDialogFormVisible=false">取 消</Button>
          <Button type="primary" @click="renameByParentAndName()">确 定</Button>
        </div>
      </Modal>
    </Layout>
  </NavBar>
</template>

<script>
import NavBar from '../../components/NavBar'

export default {
  name: 'netdisk',
  components: {NavBar},
  data: function () {
    return {
      breadlist: [
        {name: '我的文件', path: '/netdisk/file'}
      ],
      viewType: 'large-icon',
      loading: true,
      files: [],
      lastClickedFileIdx: -1,
      uploadHeaders: {
        Authorization: this.$cookie.get('token')
      },
      uploadData: {
        parent: '/',
        hash: '1'
      },
      filePath: ['/'],
      filePathId: ['/'],
      uploadDialogFormVisible: false,
      fileTip: '加载中',
      createFolderForm: {
        name: ''
      },
      createFolderDialogFormVisible: false,
      isCtrlOrShift: false,
      renameDialogFormVisible: false,
      renameForm: {
        name: ''
      },
      treeData: [],
      treeLoading: true,
      copyToDialogFormVisible: false,
      uploadServerUrl: this.$config.serverUrl
    }
  },
  methods: {
    getFiles () {
      this.$http.get(this.$config.serverUrl + '/listOwnFilesByParent', {
        params: {
          parent: this.filePathId[this.filePathId.length - 1]
        },
        validateStatus: function () {
          return true
        },
        headers: {'Authorization': this.$cookie.get('token')}
      })
        .then(response => {
          if (response.status === 200 && response.data.code === 1001) {
            this.files = this.formatFiles(response.data.data)
            this.loading = false
          } else {
            this.fileTip = 'error：' + response.data.msg
            this.$message({
              message: response.data.msg,
              type: 'error'
            })
          }
        })
    },
    getFolderTreeData () {
      this.$http.get(this.$config.serverUrl + '/listOwnFolderTreeByParent', {
        params: {
          parent: this.filePathId[this.filePathId.length - 1]
        },
        validateStatus: function () {
          return true
        },
        headers: {'Authorization': this.$cookie.get('token')}
      })
        .then(response => {
          if (response.status === 200 && response.data.code === 1001) {
            this.generateTreeObj(response.data.data)
            this.treeLoading = false
          } else {
            this.fileTip = 'error：' + response.data.msg
            this.$message({
              message: response.data.msg,
              type: 'error'
            })
          }
        })
    },
    formatFiles (files) {
      let results = []
      for (let i of files) {
        i.Selected = false
        results.push(i)
      }
      return results
    },
    getIcon (name, isfolder) {
      return require('../../assets/theme/default theme/imageres_' + (isfolder ? '16' : '') + '2.ico')
    },
    countFiles () {
      return this.files.length
    },
    countSelectedFiles () {
      let count = 0
      for (let i of this.files) {
        if (i.Selected) { count++ }
      }
      return count
    },
    getSelectedFileIds () {
      let ids = []
      for (let i of this.files) {
        if (i.Selected) { ids.push(i) }
      }
      return ids
    },
    submitUpload () {
      this.$refs.upload.submit()
    },
    fileUploadSuccess () {
      this.refresh()
    },
    bytesToSize (bytes) {
      if (bytes === 0) return '0 B'
      let k = 1000 // or 1024
      let sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
      let i = Math.floor(Math.log(bytes) / Math.log(k))

      return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i]
    },
    clickFile (idx, e) {
      if (this.isCtrlOrShift) {
        this.isCtrlOrShift = false
        return
      }
      for (let i = 0; i < this.files.length; i++) {
        if (i !== idx) { this.files[i].Selected = false }
      }
      this.files[idx].Selected = true
      this.lastClickedFileIdx = idx
    },
    clickFileWithCtrl (idx) {
      this.files[idx].Selected = (!this.files[idx].Selected)
      this.lastClickedFileIdx = idx
      this.isCtrlOrShift = true
    },
    clickFileWithShift (idx) {
      if (this.lastClickedFileIdx === -1) {
        this.files[idx].Selected = true
      } else {
        for (let i = (idx > this.lastClickedFileIdx ? this.lastClickedFileIdx : idx); i <= (idx > this.lastClickedFileIdx ? idx : this.lastClickedFileIdx); i++) {
          this.files[i].Selected = true
        }
      }
      this.lastClickedFileIdx = idx
      this.isCtrlOrShift = true
    },
    dblClickFile (fileId, fileName, isFolder) {
      if (isFolder) {
        this.files = []
        this.loading = true
        this.lastClickedFileIdx = -1
        this.uploadData.parent = fileId
        this.filePathId.push(fileId)
        this.filePath.push(fileName)
        this.getFiles()
      } else {

      }
    },
    download () {
      let selectFile = this.getSelectedFileIds()[0]
      this.$http.post(this.$config.serverUrl + '/DownloadFileByFileId', this.$qs.stringify({fileId: selectFile.Id}), {
        validateStatus: function () {
          return true
        },
        headers: {'Authorization': this.$cookie.get('token')},
        responseType: 'blob'
      })
        .then(response => {
          const blob = new Blob([response.data])
          const downloadElement = document.createElement('a')
          const href = window.URL.createObjectURL(blob) // 创建下载的链接
          downloadElement.href = href
          downloadElement.download = selectFile.Name // 下载后文件名
          document.body.appendChild(downloadElement) // 追加a标签
          downloadElement.click() // 点击下载
          document.body.removeChild(downloadElement) // 下载完成移除元素
          window.URL.revokeObjectURL(href) // 释放掉blob对象
        })
    },
    back (idx) {
      this.files = []
      this.loading = true
      this.lastClickedFileIdx = -1
      this.filePathId.splice(this.filePathId.length + idx, 1)
      this.filePath.splice(this.filePath.length + idx, 1)
      this.uploadData.parent = this.filePathId[this.filePathId.length + idx]
      this.getFiles()
    },
    refresh () {
      this.files = []
      this.loading = true
      this.lastClickedFileIdx = -1
      this.getFiles()
    },
    createFolderByParentAndName () {
      let postData = {
        name: this.createFolderForm.name,
        parent: this.filePathId[this.filePathId.length - 1]
      }
      this.$http.post(this.$config.serverUrl + '/createFolderByParentAndName', this.$qs.stringify(postData), {
        validateStatus: function () {
          return true
        },
        headers: {'Authorization': this.$cookie.get('token')}
      })
        .then(response => {
          if (response.status === 200 && response.data.code === 1001) {
            this.refresh()
            this.createFolderDialogFormVisible = false
          } else {
            this.$message({
              message: response.data.msg,
              type: 'error'
            })
          }
        })
    },
    renameFileById () {
      // TODO do
      let postData = {
        name: this.renameForm.name,
        id: this.getSelectedFileIds()[0]
      }
      this.$http.post(this.$config.serverUrl + '/renameFileById', this.$qs.stringify(postData), {
        validateStatus: function () {
          return true
        },
        headers: {'Authorization': this.$cookie.get('token')}
      })
        .then(response => {
          if (response.status === 200 && response.data.code === 1001) {
            this.refresh()
            this.renameDialogFormVisible = false
          } else {
            this.$message({
              message: response.data.msg,
              type: 'error'
            })
          }
        })
    },
    treeNodeClick (data, node) {
      this.files = []
      this.loading = true
      this.lastClickedFileIdx = -1
      this.uploadData.parent = node.data.id
      let pathData = this.getFolderPathByTreeNode(node)

      this.filePathId = pathData.id
      this.filePath = pathData.name
      this.getFiles()
    },
    selectAll () {
      for (let i = 0; i < this.files.length; i++) {
        this.files[i].Selected = true
      }
    },
    unselectAll () {
      for (let i = 0; i < this.files.length; i++) {
        this.files[i].Selected = false
      }
    },
    generateTreeObj (data) {
      let parentCount = {}// 这个parent出现的次数，也就是这个file是该parent下的第几个
      let fileLocation = {'/': ''}// 每个文件对应在treeData的位置，如2就是根目录下的第二个
      let tree = [{'id': '/', 'label': '/', 'children': []}]
      for (let i = data.length - 1; i >= 0; i--) {
        let file = data[i]
        if (file.Parent in parentCount) {
          parentCount[file.Parent]++
        } else {
          parentCount[file.Parent] = 1
        }
        fileLocation[file.Id] = fileLocation[file.Parent] + parentCount[file.Parent]
        let temp = tree[0].children
        for (let j = 0; j < fileLocation[file.Id].length - 1; j++) {
          temp = temp[parseInt(fileLocation[file.Id][j]) - 1].children
        }
        temp.push({'id': file.Id, 'label': file.Name, 'children': []})
      }
      this.treeData = tree
    },
    refreshFolderTree () {
      this.treeLoading = true
      this.getFolderTreeData()
    },
    getFolderPathByTreeNode (node) {
      let nameArray = []
      let idArray = []
      while (node.level > 0) {
        nameArray.unshift(node.data.label)
        idArray.unshift(node.data.id)
        node = node.parent
      }
      return {name: nameArray, id: idArray}
    }

  },
  mounted () {
    this.$cookie.set('token', '14211054@12345')
    this.getFiles()
    this.getFolderTreeData()
  }
}
</script>

<style scoped>
  .mulu>span{
    display: inline-block;
    padding: 4px;
    cursor: pointer;
    border: 1px solid transparent;
  }
  .mulu>span:hover{
    background-color: rgba(0,140,255,.1);
    border: 1px solid rgba(0,140,255,.2);
  }
  .items{
    list-style: none;
    padding: 14px;
    margin: 0;
    background: white;
  }
  .items .item{
    position: relative;
    vertical-align: top;
    display: inline-block;
    text-align: center;
    word-wrap: break-word;
    overflow: hidden;
    border: 1px solid #fff;
    padding: 2px 3px 2px 3px;
    margin-right: 1px;
    margin-bottom: 1px;
  }
  .item:hover {
    background-color: #e5f3ff;
    background-color: rgba(0,140,255,.1);
    border-color: transparent
  }

  .item.selected {
    background-color: #cce8ff;
    background-color: rgba(0,140,255,.2);
    border-color: transparent
  }
  .item .name {
    display: block;
    -webkit-box-orient: vertical;
    position: relative;
    line-height: 1.3;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0 !important;
    max-height: calc(1em*1.3*4);
  }
  .item.large-icon {
    width: 104px;
    max-height: 162px
  }

  .large-icon .icon {
    width: 96px;
    height: 96px
  }

  .item.medium-icon {
    width: 74px;
    max-height: 114px
  }

  .medium-icon .icon {
    width: 48px;
    height: 48px;
    margin-left: 9px;
    margin-right: 9px
  }

  .item.small-icon {
    width: 230px;
    padding-top: 3px;
    padding-bottom: 3px;
    text-align: left;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-wrap: normal
  }

  .small-icon .icon {
    width: 16px;
    height: 16px;
    margin-right: 4px;
    margin-top: -1px;
    margin-bottom: -2px;
    vertical-align: top
  }

  .item.tiles {
    width: 250px;
    height: 52px;
    text-align: left;
    word-wrap: normal
  }

  .tiles .icon {
    display: table;
    float: left;
    width: 48px;
    height: 48px;
    text-align: center
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  .tree-icon{
    height: 1.2em;
    width: 1.2em;
    vertical-align: middle;
    margin-right: 5px;
  }
</style>
