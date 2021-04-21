<template>
  <NavBar :username="this.$cookie.get('username')" infopage='/teacher/info' :breadlist="breadList">
    <div slot="navbarContent">
      <CardContent :title="'文件预览'">
<!--        <div v-html="previewHTML" style="padding-left:50px;padding-top:50px;padding-bottom:50px">-->
<!--        </div>-->
        <iframe :src="pdfURL" width="100%" height="700px" frameborder="0" scrolling="yes">该文件暂不支持预览</iframe>
<!--        <input type="file" ref="fielinput" @change="uploadFile" />-->
<!--        <canvas ref="myCanvas" class="pdf-container"></canvas>-->
      </CardContent>
    </div>
  </NavBar>
</template>
<script>
import NavBar from '../../components/NavBar'
import CardContent from '../../components/CardContent'
export default {
  name: 'previewFile',
  components: {
    NavBar,
    CardContent
  },
  data () {
    return {
      previewHTML: '',
      breadList: [],
      fileID: this.$route.query.id,
      pdfData: '',
      pdfURL: ''
    }
  },
  mounted () {
    let from = sessionStorage.getItem('previewFrom')
    if (from === 'expDetails') {
      this.breadList = JSON.parse(sessionStorage.getItem('expDetailBreadList'))
    } else if (from === 'checkHomework') {
      this.breadList = JSON.parse(sessionStorage.getItem('checkHomeworkBreadList'))
    } else if (from === 'peerDetail') {
      this.breadList = JSON.parse(sessionStorage.getItem('peerDetailBreadList'))
    }
    this.breadList.push({name: '文件预览', path: this.$route.fullPath})
    let url = '/preview?id=' + this.$route.query.id
    this.pdfURL = `/static/pdf/web/viewer.html?file=${encodeURIComponent(url)}`
    // this.$http.get('preview', {
    //   params: {
    //     id: this.$route.query.id
    //   }
    // }).then(res => {
    //   let binaryData = []
    //   binaryData.push(res.data)
    //   let url = window.URL.createObjectURL(new Blob(binaryData, {type: 'application/octet-stream'}))
    //   this.pdfURL = './static/pdf/web/viewer.html?file=' + url
    // })
    // this.previewHTML = sessionStorage.getItem('callbackHTML')
  },
  methods: {
    get_cache_size (t) {
      var obj = ''
      if (t === 'l') {
        if (!window.localStorage) {
          console.log('浏览器不支持localStorage')
        } else {
          obj = window.localStorage
        }
      } else {
        if (!window.sessionStorage) {
          console.log('浏览器不支持sessionStorage')
        } else {
          obj = window.sessionStorage
        }
      }
      if (obj !== '') {
        var size = 0
        for (let item in obj) {
          if (obj.hasOwnProperty(item)) {
            size += obj.getItem(item).length
          }
        }
        console.log('当前已用存储：' + (size / 1024).toFixed(2) + 'KB')
      }
    }
  }
}
</script>

<style scoped>

</style>
