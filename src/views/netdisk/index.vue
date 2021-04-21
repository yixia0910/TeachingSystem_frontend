<template>
<div>
  <NavBar :breadlist="breadlist">
    <div slot="navbarContent">
      <body class="clearfix">
      <section class="content" id="container">
        <!--功能按钮-->
        <ul class="head">
          <li class="item left newfile" @click="addfolder">
            新建文件夹
          </li>
          <li class="item left upload" @click="upload">
            上传文件
          </li>
          <li :class="downloadclass" @click="download">
            下载
          </li>
          <li :class="movetoclass" @click="moveto">
            移动到
          </li>
          <li :class="renameclass" @click="rename">
            重命名
          </li>
          <li :class="deleteclass" @click="deletefile">
            删除
          </li>
          <li :class="copyclass" @click="copy">
            复制
          </li>
          <li :class="shareclass">
            分享
          </li>
        </ul>
        <!--功能按钮结束-->
        <!--面包屑导航-->
        <div class="breadcrumbs_wrap">
          <span :class="checkallclass" @click="checkall"></span>
          <div class="root left active" @click="clickroot">软院云盘</div>
          <ul class="breadcrumbs left" v-for="(item,index) in breadList" @click="clickbread(index)">
            <li :style="breadstyle(index)" class="item">{{item}}</li>
          </ul>
        </div>
        <!--文件区域-->
        <ul class="folder">
          <li class="item folder" v-show="input">
            <span class="check_icon"></span>
            <img class="icon" src="../../assets/img/img/file.png"></img>
            <input type="text" :autofocus="focus" @keyup.enter="inputname" @blur="inputname" v-model="newname" ref="input">
          </li>
          <li :class="folderClass[index]" :id="folderId[index]" v-for="(item,index) in folderList">
            <span class="check_icon" @click="foldercheck(index)"></span>
            <img class="icon" src="../../assets/img/img/file.png" @click="clickfolder(index)"></img>
            <div class="name" @click="clickfolder(index)">{{item.Name}}</div>
          </li>
          <li :class="fileClass[index]" :id="fileId[index]" v-for="(item,index) in fileList">
            <span class="check_icon" @click="filecheck(index)"></span>
            <img class="icon" :src="imgsrc(item.Name)"/>
            <div class="name">{{item.Name}}</div>
          </li>
        </ul>
        <!--文件区域结束-->
        <input type="file" id="uploadfile" v-show="False" @change="tirggerFile($event)"/>
        <!--提示层-->
        <div class="tips" :style="tipstyle">
          <p class="txt">11111111111</p>
          <div class="content" v-html="tiphtml">
          </div>
          <button class="yes" @click="yes">确定</button>
          <button class="no" @click="no">取消</button>
        </div>
        <!--提示层-->
      </section>
      </body>

    </div>
  </NavBar>
</div>
</template>


<script>
import NavBar from '../../components/NavBar'
import axios from 'axios'
import net from '../../assets/Global'
import $ from 'jquery'
export default {
  name: 'index',
  components: {NavBar},
  comments: {
    NavBar
  },
  data () {
    return {
      // eslint-disable-next-line no-labels
      breadlist: [{name: '资源管理', path: '/all/skydrive'}],
      url:net.neturl+'/',
      role:'1', //1教师 2学生
      userid: '17373273',
      status:'1', //0个人 1共享
      token: '',//文件区域
      parent:'/',
      parentid:'/',
      ifinitclass:true,
      folderList:[],
      fileList:[],
      breadList:[],
      breadidList:[],
      folderClass:[],
      chosenidClass:'',
      folderId:[],
      fileClass:[],
      fileId:[],
      imgsrc:function(fileName){
        return '../../static/img/'+this.matchType(fileName)+'.png'
      },
      //面包屑导航
      breadstyle:function(index){
        return 'z-index: -'+index+';'
      },
      //功能按钮
      False:false,
      focus:'',
      newname:'',
      input:false,
      newfileclass:'item left newfile',
      uploadclass:'item left upload',
      downloadclass:' item left download not',
      movetoclass:' item left moveto not',
      renameclass:' item left rename not',
      deleteclass:' item left delete not',
      copyclass:' item left copy not',
      shareclass:' item left share not',
      checkallclass:'checkall left check_icon',
      //提示层
      tipstyle:'',
      tiphtml:'',
      tiptype:'',
      tipshow:false
    }
  },
    created:function(){
		this.userid= this.$cookie.get('userId')
		this.token=this.$cookie.get('token')
		this.role=this.$cookie.get('role')
		console.log(this.userid)
		console.log(this.role)
		if(this.role=='teacher')
			this.role='2'
		else this.role='1'
		console.log(this.userid)
        this.listFolder();
        this.listFile();
    },
    methods:{
        /*文件区域*/
        //刷新文件夹列表
        listFolder:function(){
            var that = this;
            axios.get(that.url+'listOwnFolderTreeByParent?parent='+that.parentid+'&role='+that.role+'&status='+that.status,
                {
                    headers: {
                        'Authorization': that.token,
                    },
                })
                .then(function(response){
                    if(response.data.code != 1001){
                        console.log("err: " + response.data.msg);
                    }
                    else{
                        //console.log(response);
                        that.folderList = response.data.data;
                        if(that.ifinitclass){
                            that.initfolderclass();
                        }
                    }
                })
                .catch(function(err){})
        },
        //刷新文件列表
        listFile:function(){
            var that = this;
            axios.get(that.url+'listOwnFilesByParent?parent='+that.parentid+'&role='+that.role+'&status='+that.status,
                {
                    headers: {
                        'Authorization': that.token,
                    },
                })
                .then(function(response){
                    if(response.data.code != 1001){
                        console.log("err: " + response.data.msg);
                    }
                    else{
                        console.log(response);
                        that.fileList = response.data.data;
                        if(that.ifinitclass){
                            that.initfileclass();
                        }
                    }
                })
                .catch(function(err){})
        },
        //刷新课程文件夹列表
        listLesson:function(){
            var that = this;
            axios.get(that.url+'listLessonFolderTreeByTerm?parent='+that.parentid,
            {
                headers: {
                   'Authorization': that.token,
                },
            })
            .then(function(response){
                if(response.data.code != 1001){
                    console.log("err: " + response.data.msg);
                }
                else{
                    //console.log(response);
                    that.folderList = response.data.data;
                    if(that.ifinitclass){
                        that.initfolderclass();
                    }
                }
             })
             .catch(function(err){})
        },
        //点击进入文件夹
        clickfolder:function(index){
            this.parent = this.folderList[index].Name;
            this.parentid = this.folderList[index].FileId;
            this.breadList.push(this.folderList[index].Name);
            this.breadidList.push(this.folderList[index].FileId);
            console.log(this.parentid);
            if(this.parent == '共享文件夹'){
                this.status = '1';
            }
            if(this.parent == '个人文件夹'){
                this.status = '0';
            }
            this.ifinitclass = true;
            this.initbutton();
            if(this.folderList[index].UserId == "3"){
				        this.listLesson();
			      }else{
				        this.listFolder();
				        this.listFile();
			      }
        },
        //将全部文件夹设置为非选中状态
        initfolderclass:function(){
            this.folderClass = [];
            this.folderId = [];
            for (var i = 0; i<this.folderList.length; i++){
                this.folderClass.push('item folder');
                this.folderId.push('folder'+i);
            }
        },
        //将全部文件设置为非选中状态
        initfileclass:function(){
            this.fileClass = [];
            this.fileId = [];
            for (var i = 0; i<this.fileList.length; i++){
                this.fileClass.push('item file');
                this.fileId.push('file'+i);
            }
        },
        //选中文件夹
        foldercheck:function(index){
            if(this.folderClass[index] == 'item folder'){
                this.folderClass[index] = 'item folder active';
            }
            else{
                this.folderClass[index] = 'item folder';
            }
            this.checkedall();
            this.checkbutton();
            this.ifinitclass = false;
            this.listFolder();
            this.listFile();
        },
        //选中文件
        filecheck:function(index){
            if(this.fileClass[index] == 'item file'){
                this.fileClass[index] = 'item file active';
            }
            else{
                this.fileClass[index] = 'item file';
            }
            this.checkedall();
            this.checkbutton();
            this.ifinitclass = false;
            this.listFolder();
            this.listFile();
        },
        //全选
        checkall:function(index){
            if(this.checkallclass == 'checkall left check_icon'){
                for (var i = 0; i<this.folderClass.length; i++){
                    this.folderClass[i] = ('item folder active');
                }
                for (var i = 0; i<this.fileClass.length; i++){
                    this.fileClass[i] = ('item file active');
                }
                this.checkallclass = 'checkall left check_icon checked';
            }
            else{
                for (var i = 0; i<this.folderClass.length; i++){
                    this.folderClass[i] = ('item folder');
                }
                for (var i = 0; i<this.fileClass.length; i++){
                    this.fileClass[i] = ('item file');
                }
                this.checkallclass = 'checkall left check_icon';
            }
            this.checkbutton();
            this.ifinitclass = false;
            this.listFolder();
            this.listFile();
        },
        //检查所有文件及文件夹是否都被选中，如果是，则在全选框上打✔
        checkedall:function(){
            var sum = 0;
            for (var i = 0; i<this.folderClass.length; i++){
                if(this.folderClass[i] == 'item folder active'){
                    sum++;
                }
            }
            for (var i = 0; i<this.fileClass.length; i++){
                if(this.fileClass[i] == 'item file active'){
                    sum++;
                }
            }
            if(sum == this.folderClass.length+this.fileClass.length){
                this.checkallclass = 'checkall left check_icon checked';
            }
            else{
                this.checkallclass = 'checkall left check_icon';
            }
        },
        //根据文件后缀名匹配图标
        matchType:function(fileName){
            var suffix = '';
            var result = '';
            try{
                var fileArr = fileName.split('.');
                suffix = fileArr[fileArr.length-1];
            }catch(e){
                suffix = ''
            }
            if (!suffix) {
                result = false;
                return result;
            }
            // 匹配img
            var imglist = ['png','jpg','jpeg','bmp','gif']
            result = imglist.some(function(item){
                return item == suffix;
            })
            if (result) {
                result = 'image'
                return result;
            }
            // 匹配txt
            var txtlist = ['txt'];
            result = txtlist.some(function (item) {
                return item == suffix;
            });
            if (result) {
                result = 'txt';
                return result;
            };
            // 匹配 excel
            var excelist = ['xls', 'xlsx'];
            result = excelist.some(function (item) {
                return item == suffix;
            });
            if (result) {
                result = 'excel';
                return result;
            };
            // 匹配 word
            var wordlist = ['doc', 'docx'];
            result = wordlist.some(function (item) {
                return item == suffix;
            });
            if (result) {
                result = 'word';
                return result;
            };
            // 匹配 pdf
            var pdflist = ['pdf'];
            result = pdflist.some(function (item) {
                return item == suffix;
            });
            if (result) {
                result = 'pdf';
                return result;
            };
            // 匹配 ppt
            var pptlist = ['ppt'];
            result = pptlist.some(function (item) {
                return item == suffix;
            });
            if (result) {
                result = 'ppt';
                return result;
            };
            // 匹配 视频
            var videolist = ['mp4', 'm2v', 'mkv'];
            result = videolist.some(function (item) {
                return item == suffix;
            });
            if (result) {
                result = 'video';
                return result;
            };
            // 匹配 音频
            var radiolist = ['mp3', 'wav', 'wmv'];
            result = radiolist.some(function (item) {
                return item == suffix;
            });
            if (result) {
                result = 'radio';
                return result;
            }
            // 匹配 压缩文件
            var ziplist = ['zip', 'rar', 'cab', '7z', 'tar'];
            result = ziplist.some(function (item) {
                return item == suffix;
            });
            if (result) {
                result = 'zip';
                return result;
            }
            // 其他 文件类型
            result = 'other';
            return result;
        },

        /*面包屑导航*/
        //点击进入对应文件夹
        clickbread:function(index){
            this.parent = this.breadList[index];
            this.parentid = this.breadidList[index];
            this.breadList.splice(index+1,this.breadList.length-index-1);
            this.breadidList.splice(index+1,this.breadidList.length-index-1);
            console.log(this.parentid);
            this.ifinitclass = true;
            this.initbutton();
            this.listFolder();
            this.listFile();
        },
        //点击进入根目录
        clickroot:function(){
            this.parent = '/';
            this.parentid = '/';
            this.breadList = [];
            this.breadidList = [];
            console.log(this.parent);
            this.ifinitclass = true;
            this.initbutton();
            this.listFolder();
            this.listFile();
        },

        /*功能按钮*/
        //根据选中文件个数判断哪些功能可以使用（分享暂时没有做好）
        checkbutton:function(){
            var sum = 0;
            for (var i = 0; i<this.folderClass.length; i++){
                if(this.folderClass[i] == 'item folder active'){
                    sum++;
                }
            }
            for (var i = 0; i<this.fileClass.length; i++){
                if(this.fileClass[i] == 'item file active'){
                    sum++;
                }
            }
            if(this.status == '0'){
                if(sum == 0){
                    this.downloadclass = ' item left download not';
                    this.movetoclass = ' item left moveto not';
                    this.renameclass = ' item left rename not';
                    this.deleteclass = ' item left delete not';
                    this.copyclass = ' item left copy not';
                    this.shareclass = ' item left share not';
                }
                if(sum == 1){
                    this.downloadclass = ' item left download';
                    this.movetoclass = ' item left moveto';
                    this.renameclass = ' item left rename';
                    this.deleteclass = ' item left delete';
                    this.copyclass = ' item left copy';
                    this.shareclass = ' item left share';
                }
                if(sum > 1){
                    this.downloadclass = ' item left download';
                    this.movetoclass = ' item left moveto';
                    this.renameclass = ' item left rename not';
                    this.deleteclass = ' item left delete';
                    this.copyclass = ' item left copy';
                    this.shareclass = ' item left share not';
                }
            }
            if(this.status == '1'){
                if(this.role == '1'){
                    this.newfileclass = 'item left newfile';
                    this.uploadclass = 'item left upload';
                }
                if(this.role == '2'){
                    this.newfileclass = 'item left newfile not';
                    this.uploadclass = 'item left upload not';
                }
                if(sum == 0){
                    this.downloadclass = ' item left download not';
                    this.movetoclass = ' item left moveto not';
                    this.renameclass = ' item left rename not';
                    this.deleteclass = ' item left delete not';
                    this.copyclass = ' item left copy not';
                    this.shareclass = ' item left share not';
                }
                if(sum == 1 && this.role == '1'){
                    this.downloadclass = ' item left download';
                    this.movetoclass = ' item left moveto';
                    this.renameclass = ' item left rename';
                    this.deleteclass = ' item left delete';
                    this.copyclass = ' item left copy';
                    this.shareclass = ' item left share';
                }
                if(sum == 1 && this.role == '2'){
                    this.downloadclass = ' item left download';
                    this.movetoclass = ' item left moveto not';
                    this.renameclass = ' item left rename not';
                    this.deleteclass = ' item left delete not';
                    this.copyclass = ' item left copy';
                    this.shareclass = ' item left share';
                }
                if(sum > 1 && this.role == '1'){
                    this.downloadclass = ' item left download not';
                    this.movetoclass = ' item left moveto';
                    this.renameclass = ' item left rename not';
                    this.deleteclass = ' item left delete';
                    this.copyclass = ' item left copy';
                    this.shareclass = ' item left share not';
                }
                if(sum > 1 && this.role == '2'){
                    this.downloadclass = ' item left download not';
                    this.movetoclass = ' item left moveto not';
                    this.renameclass = ' item left rename not';
                    this.deleteclass = ' item left delete not';
                    this.copyclass = ' item left copy';
                    this.shareclass = ' item left share not';
                }
            }
        },
        //把所有功能按钮置为灰色
        initbutton:function(){
            this.newfileclass = 'item left newfile';
            this.uploadclass = 'item left upload';
            this.downloadclass = ' item left download not';
            this.movetoclass = ' item left moveto not';
            this.renameclass = ' item left rename not';
            this.deleteclass = ' item left delete not';
            this.copyclass = ' item left copy not';
            this.shareclass = ' item left share not';
            this.checkallclass = 'checkall left check_icon';
        },
        //新建文件夹按钮点击事件
        addfolder:function(){
            this.input = true;
            this.$nextTick(function(){
                this.$refs.input.focus();
            })
        },
        //输入新名字后，将新文件夹上传
        inputname:function(){
            var that = this;
            if(that.newname == ''){
                that.input = false;
                that.newname = '';
            }
            else{
                console.log(that.role);
                axios.post(that.url+'createFolderByParentAndName',{"Parent": that.parentid, "Name": that.newname, "Role": that.role, "Status": that.status},
                    {
                        headers: {
                            'Authorization': that.token,
                        },
                    })
                    .then(function(response){
                        if(response.data.code != 1001){
                            alert(response.data.msg);
                            that.input = false;
                            that.newname = '';
                        }
                        else{
                            that.input = false;
                            that.newname = '';
                            that.ifinitclass = true;
                            that.listFolder();
                            that.listFile();
                        }
                    })
                    .catch(function(err){})
            }
        },
        //上传文件
        tirggerFile : function (event) {
            var that = this;
            var tFiles = event.target.files;
            //console.log(file);
            let param = new FormData();
            param.append("parent", that.parentid);
            param.append("role", that.role);
            param.append("status", that.status);
            param.append("file", tFiles[0]);
            let config = {
                //添加请求头
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": that.token,
                },
                //添加上传进度监听事件
                // onUploadProgress: e => {
                // 	var completeProgress = ((e.loaded / e.total * 100) | 0) + "%";
                // 	this.progress = completeProgress;
                // }
            };
            axios.post(that.url+'uploadFileByParent', param, config)
                .then(function(response){
                    if(response.data.code != 1001){
                        alert(response.data.msg);
                    }
                    else{
                        alert(response.data.msg);
                        that.ifinitclass = true;
                        that.listFolder();
                        that.listFile();
                    }
                })
                .catch(function(err){})
        },
        //上传文件按钮点击事件
        upload:function(){
            $('#uploadfile').click();
        },
		    urlencode:function(str){  
		        str = (str + '').toString();   
		        return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').  
		        replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+');  
		    },
        //下载文件
        download:function(){
            var that = this;
            for (var i = 0; i<that.fileClass.length; i++){
                if(that.fileClass[i] == 'item file active'){
                    window.open(that.url+'DownloadFileByName?name='+this.urlencode(that.fileList[i].Name)+'&userid='+that.userid+'&parent='+that.parentid+'&size='+that.fileList[i].Size.toString()+'&status='+that.status);
                }
            }
            for (var i = 0; i<that.folderClass.length; i++){
                if(that.folderClass[i] == 'item folder active'){
                    window.open(that.url+'DownloadZipFile?name='+that.folderList[i].Name+'&parent='+that.parentid);
                }
            }
        },
        //移动文件
        moveto:function(){
            for (var i = 0; i<this.folderClass.length; i++){
                if(this.folderClass[i] == 'item folder active'){
                    this.chosenidClass += this.folderList[i].FileId;
                }
            }
            this.tipstyle = 'left: 50%; margin-left: -305px';
            this.tipshow = true;
            if(this.tiphtml == ''){
                this.tiptype = 'moveto';
                this.cabinet();
            }
        },
        //重命名按钮点击事件
        rename:function(){
            for (var i = 0; i<this.folderClass.length; i++){
                if(this.folderClass[i] == 'item folder active'){
                    var name = this.folderList[i].Name;
                    var token = this.token;
                    var parent = this.parentid;
                    var url = this.url;
                    var role = this.role;
                    var status = this.status;
                    var f = 'folder';
                    this.changename(i,f,name,token,parent,url,role,status);
                }
            }
            for (var i = 0; i<this.fileClass.length; i++){
                if(this.fileClass[i] == 'item file active'){
                    var name = this.fileList[i].Name;
                    var token = this.token;
                    var parent = this.parentid;
                    var url = this.url;
                    var role = this.role;
                    var status = this.status;
                    var f = 'file';
                    this.changename(i,f,name,token,parent,url,role,status);
                }
            }
        },
        //重命名方法
        changename:function(i,f,name,token,parent,url,role,status){
            var that = this;
            var target = $('#'+f+i);
            var p = target.children('.name');
            var input = $('<input id="input" type="text">').replaceAll(p);
            input.val(p.html());
            input.focus();
            input.select();
            input.keydown(function (event) {
                if(event.keyCode == 13){
                    input.blur();
                }
            });
            input.blur(function () {
                var _this = $(this);
                p.replaceAll(_this);
                if(_this.val() == ''){
                    p.html(p.html())
                }else{
                    axios.get(url+'changeNameByNameAndParent?name='+name+'&newname='+_this.val()+'&parent='+parent+'&role='+role+'&status='+status,
                        {
                            headers: {
                                'Authorization': token,
                            },
                        })
                        .then(function(response){
                            if(response.data.code != 1001){
                                alert("err: " + response.data.msg);
                            }
                            that.ifinitclass = true;
                            that.initbutton();
                            that.listFolder();
                            that.listFile();
                            return;
                        })
                        .catch(function(err){
                            console.log(err);
                        })
                }
            });
        },
        //删除文件
        deletefile:function(){
            var that = this;
            for (var i = 0; i<that.folderClass.length; i++){
                if(that.folderClass[i] == 'item folder active'){
                    axios.get(that.url+'deleteFolderByNameAndParent?name='+that.folderList[i].Name+'&parent='+that.parentid+'&role='+that.role+'&status='+that.status,
                        {
                            headers: {
                                'Authorization': that.token,
                            },
                        })
                        .then(function(response){
                            if(response.data.code != 1001){
                                alert("err: " + response.data.msg);
                            }
                            that.ifinitclass = true;
                            that.initbutton();
                            that.listFolder();
                            that.listFile();
                            return;
                        })
                        .catch(function(err){
                            console.log(err);
                        })
                }
            }
            for (var i = 0; i<that.fileClass.length; i++){
                if(that.fileClass[i] == 'item file active'){
                    axios.get(that.url+'deleteFileByNameAndParent?name='+that.fileList[i].Name+'&parent='+that.parentid+'&role='+that.role+'&status='+that.status,
                        {
                            headers: {
                                'Authorization': that.token,
                            },
                        })
                        .then(function(response){
                            if(response.data.code != 1001){
                                alert("err: " + response.data.msg);
                            }
                            that.ifinitclass = true;
                            that.initbutton();
                            that.listFolder();
                            that.listFile();
                            return;
                        })
                        .catch(function(err){
                            console.log(err);
                        })
                }
            }
        },
        //复制文件
        copy:function(){
            this.tipstyle = 'left: 50%; margin-left: -305px';
            this.tipshow = true;
            if(this.tiphtml == ''){
                this.tiptype = 'copy';
                this.cabinet();
            }
        },

        /*提示层*/
        //展示文件列表
        cabinet:function(){
            var that = this;
            axios.get(that.url+'listOwnFolderTreeByParent?parent=/'+'&role='+that.role+'&status='+that.status,
                {
                    headers: {
                        'Authorization': that.token,
                    },
                })
                .then(function(response){
                    if(response.data.code != 1001){
                        console.log("err: " + response.data.msg);
                    }
                    else{
                        for (var i = 0; i<response.data.data.length; i++){
                            if(response.data.data[i].FileId != 'public' || that.role == '1')
                                that.tiphtml +='<p class="op" id="'+response.data.data[i].FileId+'"><em class="add""></em><span></span>'+ response.data.data[i].Name +'</p>';
                        }
                    }
                })
                .catch(function(err){
                    console.log(err);
                })
            $('.tips .content').click(function (event) {
                var _this = $(event.target);
                if (event.target.className == 'add'){
                    event.target.className = 'sub';
                    var pad = parseInt($(_this.parent()).css('paddingLeft')) + 25;
                    var id =  $(_this.parent()).attr('id');
                    axios.get(that.url+'listOwnFolderTreeByParent?parent='+id+'&role='+that.role+'&status='+that.status,
                        {
                            headers: {
                                'Authorization': that.token,
                            },
                        })
                        .then(function(response){
                            if(response.data.code != 1001){
                                console.log("err: " + response.data.msg);
                            }
                            else if(response.data.data != null){
                                for (var i = 0; i<response.data.data.length; i++){
                                    if(that.chosenidClass.indexOf(response.data.data[i].FileId)==-1){
                                        $(_this.parent()).after('<p class="op" style="padding-left: '+ pad +'px " id="'+ response.data.data[i].FileId +'"><em class="add"></em><span></span>'+ response.data.data[i].Name +'</p>');
                                    }
                                }
                            }
                        })
                        .catch(function(err){
                            console.log(err);
                        })
                }else if(event.target.className == 'sub'){
                    event.target.className ='add';
                    var pad = parseInt($(_this.parent()).css('paddingLeft'));
                    var a = $('.content P').length;
                    for (var i = 0 ;i< a ;i++){
                        var nextPad = parseInt(_this.parent().next().css('paddingLeft'));
                        if(pad<nextPad){
                            _this.parent().next()[0].remove()
                        }
                    }
                }
                var op = document.getElementsByClassName('op');
                for(var i=0;i<op.length;i++){
                    if (event.target == op[i]){
                        var ele;
                        $('.content P').css('backgroundColor','#f5f6f9');
                        if(_this.parents('p').length == 0 ){
                            ele = _this;
                            _this.css('backgroundColor','#fff');
                        }else {
                            ele = _this.parents('p');
                            _this.parents('p').css('backgroundColor','#fff');
                        }
                        $('.yes').addClass('but');
                        $('.yes').attr('id',ele.attr('id'));
                    }
                }
            })
        },
        //确定按钮
        yes:function(){
            var that = this;
            var yesurl = '';
            if(that.tiptype == 'moveto'){
                yesurl = that.url+'changeParentByNameAndParent?name='
            }
            else if(that.tiptype == 'copy'){
                yesurl = that.url+'copyFileByNameAndParent?name='
            }
            var newparent = $('.yes').attr('id');
            var folderfinish = false;
            var filefinish = false;
            if(newparent == that.parentid){
                alert("不能选择相同文件夹");
                return;
            }
            for (var i = 0; i<that.folderClass.length; i++){
                if(that.folderClass[i] == 'item folder active'){
                    if(newparent == that.folderList[i].FileId){
                        alert("不能选择相同文件夹");
                        return;
                    }
                    axios.get(yesurl+that.folderList[i].Name+'&parent='+that.parentid+'&newparent='+newparent,
                        {
                            headers: {
                                'Authorization': that.token,
                            },
                        })
                        .then(function(response){
                            if(response.data.code != 1001){
                                alert("err: " + response.data.msg);
                            }
                            that.tipshow = false;
                            that.ifinitclass = true;
                            that.initbutton();
                            that.listFolder();
                            that.listFile();
                        })
                        .catch(function(err){
                            console.log(err);
                        })
                }
            }
            for (var i = 0; i<that.fileClass.length; i++){
                if(that.fileClass[i] == 'item file active'){
                    axios.get(yesurl+that.fileList[i].Name+'&parent='+that.parentid+'&newparent='+newparent,
                        {
                            headers: {
                                'Authorization': that.token,
                            },
                        })
                        .then(function(response){
                            if(response.data.code != 1001){
                                alert("err: " + response.data.msg);
                            }
                            that.tipshow = false;
                            that.ifinitclass = true;
                            that.initbutton();
                            that.listFolder();
                            that.listFile();
                        })
                        .catch(function(err){
                            console.log(err);
                        })
                }
            }
            $('#private .sub').click();
            $('#public .sub').click();
            that.tipshow = false;
            $('.yes').removeClass('but');
            $('.yes').attr('id','');
            this.chosenidClass = '';
        },
        //取消按钮
        no:function(){
            $('#private .sub').click();
            $('#public .sub').click();
            this.tipshow = false;
            $('.yes').removeClass('but');
            $('.yes').attr('id','');
            this.chosenidClass = '';
        },
    }
}
</script>

<style scoped>
  body,dl,dd{
    margin: 0;
  }
  ul{
    margin: 0;
    padding: 0;
    list-style: none;
  }
  /*public*/
  .clearfix:after{
    content: "";
    display: block;
    clear: both;
  }
  .left{
    float: left;
  }

  /*sprite*/
  .head .item,.head .brev,.head .list,.list .icos li{
    background-image: url(../../assets/img/img/ico-message.png);
    background-repeat: no-repeat;
    background-position-x: 10px;
  }
  .content .check_icon{
    background-image: url(../../assets/img/img/ico.png);
    background-repeat: no-repeat;
    background-position-x: 0px;
  }

  /*content*/
  .content{
    font: 12px "微软雅黑";
  }

  /*head*/
  .head{
    height: 50px;
    padding-left: 16px;
    background-color: #f5f6f9;
    font-size: 14px;
    border-bottom: 1px solid #eff1f5;
  }
  .head .item{
    margin-top: 9px;
    margin-left: 10px;
    padding: 7px 10px 8px 36px;
    background-color: #fff;
    border: solid 1px #eff1f5;
    color: #505254;

  }
  .head .right{
    padding: 10px;
    width: 100px;
    height: 30px;
  }
  .head .brev,.head .list{
    width: 40px;
    height: 30px;
  }
  .head .brev{
    background-position-y: -992px;
  }
  .head .brev:hover,.head .list:hover,.head .right .active{
    background-color: #fff;
  }
  .head .list{
    background-position-y: -1088px;
  }
  .head .newfile {
    background-position-y: -542px;
  }
  .head .upload {
    background-position-y: -414px;
  }
  .head .download {
    background-position-y: -350px;
  }
  .head .moveto {
    background-position-y: -446px;
  }
  .head .rename {
    background-position-y: -510px;
  }
  .head .delete {
    background-position-y: -318px;
  }
  .head .copy {
    background-position-y: -639px;
  }
  .head .paste {
    background-position-y: -798px;
  }
  .head .share {
    background-position-y: -382px;
  }
  .head .item.not {
    opacity:0.5;
    cursor: default;
  }

  /*breadcrumbs面包屑导航区*/
  .breadcrumbs_wrap{
    height: 30px;
    border-bottom: 1px solid #e6e9f0;
    margin-left: 10px;
    padding-left: 10px;
  }
  .breadcrumbs_wrap .checkall,.list .check_icon{
    width: 14px;
    height: 30px;
    margin-right: 10px;
    background-position-y: -262px;
  }

  .breadcrumbs_wrap .root{
    z-index: 99;
    line-height: 30px;
    padding: 0px 20px 0px 10px;
    border-left: 1px solid #e6e9f0;
    background: url(../../assets/img/img/test-path.png) no-repeat right;
    background-position-y: -49px;
    position: relative;
  }

  .breadcrumbs .item{
    line-height: 30px;
    padding: 0px 20px 0px 10px;
    border-left: 1px solid #e6e9f0;
    background: url(../../assets/img/img/main-path.png) no-repeat right;
    background-position-y: -49px;
    position: relative;
  }

  .breadcrumbs .item{
    margin-left: -18px;
    padding-left: 20px;
    float: left;
  }
  .head .item,.root,.breadcrumbs,.checkall,.folder .item{
    cursor: pointer;
  }

  /*缩略图横排布局*/
  .folder .item {
    width: 118px;
    height: 100px;
    border: 1px solid #fff;
    position: relative;
    float: left;
    margin: 10px;
  }
  .folder .item .icon{
    width: 64px;
    height: 64px;
    margin: 13px 0px 0px 27px;
  }
  .folder .item .name{
    text-align: center;
  }
  .folder .item .check_icon{
    width: 18px;
    height: 18px;
    position: absolute;
    left: -1px;
    top: -1px;
    background-position-y: -370px;
    display: none;
  }
  .folder .item input{
    width: 98px;
    height: 20px;
    line-height: 20px;
    padding: 0px 10px;
    text-align: center;
  }
  .folder .item input:focus {
    border: 1px solid #00a0e9;
  }

  /*active选中效果*/
  .folder .active{
    border-color: #c3d8f0;
    background-color: #e9f3fd;
  }
  .breadcrumbs_wrap .checked,.container .list.active .check_icon{
    background-position-y: -312px;
  }
  .folder .item:hover, .folder .item.hover{
    background-color:#ECF2F7;
    border-color: #c3d8f0;
  }
  .folder .item:hover .check_icon{
    display: block;
  }
  .folder .item.active .check_icon{
    display: block;
    background-position-y: -421px;
  }
  .folder .item .checked{
    background-position-y: -421px;
  }
  .folder .list.active .icos,.folder .list.hover .icos{
    display: block;
  }
  /*hover效果*/
  .head .item:hover{
    border-color: #ccc;
  }
  /*container中画出来的框框*/
  .box{
    border: 1px dashed rgba(0, 160, 233, 1);
    background-color: rgba(0, 160, 233, 0.1);
    position: absolute;
  }
  /*tips*/
  .tips{
    width: 600px;
    height: 280px;
    font: 14px "微软雅黑";
    background-color: #f5f6f9;
    border: 5px solid #c3d8f0;
    position: absolute;
    left: -9999px;
    top: 50%;
    margin-top: -145px;
    z-index: 999;
    text-align: center;
  }
  .tips .txt{
    padding-top: 50px;
    height: 100px;
    display: none;
  }
  .tips div {
    width: 95%;
    height: 200px;
    overflow: auto;
  }
  .tips div p em.add {
    display: inline-block;
    width:15px;
    height: 15px;
    background: url("../../assets/img/img/icons.png") -29px 1px no-repeat;
    cursor: pointer;
  }
  .tips div {
    height: 200px;
    margin:10px 11px;
    border:3px solid #ffffff;
  }
  .tips div p {
    margin-top:0px;
    margin-bottom:0px;
    text-align: left;
    height: 30px;
    line-height: 30px;
    margin-left:3px;
  }
  .tips div p:hover {
    background: #fff;
  }
  .tips div p em.sub{
    display: inline-block;
    width:15px;
    height: 15px;
    background: url("../../assets/img/img/icons.png") -29px -22px no-repeat;
    cursor: pointer;
  }

  .tips div p em.wu {
    display: inline-block;
    width:15px;
    height: 15px;

  }
  .tips div p span {
    margin:0 3px;
    display: inline-block;
    width:15px;
    height: 15px;
    background: url("../../assets/img/img/icons.png") 0 0 no-repeat;
  }
  .tips button{
    width: 100px;
    font: 12px "微软雅黑";
    background-color: #fff;
    border: solid 1px #eff1f5;
    color: #505254;
    line-height: 30px;
    margin-right: 10px;
    margin-bottom: 10px;
  }
  .tips .yes {
    background: #ccc;
    opacity:0.5;
  }
  .tips .yes.but {
    background: #fff;
    opacity:1;
    cursor: pointer;
  }
  .tips .no {
    cursor: pointer;
  }
  .tips button:hover {
    border:1px solid #ccc;
  }
</style>
