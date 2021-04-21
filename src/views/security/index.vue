<template>
  <div>
    <NavBar :breadlist="breadlist">
      <div slot="navbarContent">
        <Row :gutter="20">
          <i-col span="16">
            <div class="app_area">
              <div class="area_title">校内应用</div>
              <div class="app_icon" @click="hrefTo('http://login.beihangsoft.cn')">
                <div class="icon_logo blue">院</div>
                <div class="icon_title">院务系统</div>
              </div>
              <div class="app_icon" @click="hrefTo('http://career.beihangsoft.cn')">
                <div class="icon_logo blue">实</div>
                <div class="icon_title">实习就业系统</div>
              </div>
              <div class="app_icon" @click="hrefTo('https://dabian.beihangsoft.cn')">
                <div class="icon_logo blue">研</div>
                <div class="icon_title">研究生答辩</div>
              </div>
              <div class="app_icon" @click="hrefTo('https://bse.beihangsoft.cn', true)">
                <div class="icon_logo blue">本</div>
                <div class="icon_title">本科生答辩</div>
              </div>
              <div class="app_icon" @click="hrefTo('http://gsmis.buaa.edu.cn')">
                <div class="icon_logo blue">教</div>
                <div class="icon_title">研究生教务</div>
              </div>
              <div class="app_icon" @click="hrefTo('https://d.buaa.edu.cn')">
                <div class="icon_logo green">D</div>
                <div class="icon_title">远程访问VPN</div>
              </div>
              <div class="app_icon" @click="hrefTo('https://icw.buaa.edu.cn')">
                <div class="icon_logo blue">财</div>
                <div class="icon_title">北航财务处</div></div>
              <div class="app_icon" @click="hrefTo('https://jiaowu.buaa.edu.cn')">
                <div class="icon_logo blue">教</div>
                <div class="icon_title">本科生教务</div></div>
              <div class="app_icon" @click="hrefTo('https://paas.beihangsoft.cn/service/list', true)">
                <div class="icon_logo green">P</div>
                <div class="icon_title">PaaS平台</div>
              </div>
              <div class="app_icon" @click="hrefTo('http://10.251.0.51')">
                <div class="icon_logo blue">推</div>
                <div class="icon_title">推免系统</div>
              </div>
              <div class="app_icon" @click="hrefTo('http://n.buaa.edu.cn')">
                <div class="icon_logo blue">办</div>
                <div class="icon_title">办事大厅</div>
              </div>
              <div class="app_icon" @click="hrefTo('http://i.buaa.edu.cn')">
                <div class="icon_logo green">H</div>
                <div class="icon_title">iHome</div>
              </div>
              <div class="app_icon" @click="hrefTo('https://e2.buaa.edu.cn')">
                <div class="icon_logo green">E</div>
                <div class="icon_title">系统访问VPN</div>
              </div>
              <div class="app_icon"></div>
              <div class="app_icon"></div>
              <div class="app_icon"></div>
              <div class="app_icon"></div>
              <div class="app_icon"></div>
              <div class="app_icon"></div>
              <div class="app_icon"></div>
              <div class="app_icon"></div>
            </div>
          </i-col>
          <i-col span="8">
            <div class="app_area">
              <div class="area_title">其他应用</div>
              <div style="margin-left: 10px">建设中，敬请期待！</div>
              <div class="app_icon not_allow">
                <img class="icon_logo" src="../../assets/img/app/CAJVieweru_00001.png">
                <div class="icon_title">CAJ Viewer</div>
              </div>
              <div class="app_icon not_allow">
                <img class="icon_logo" src="../../assets/img/app/Code_00001.png">
                <div class="icon_title">Visual Studio Code</div>
              </div>
              <div class="app_icon not_allow">
                <img class="icon_logo" src="../../assets/img/app/devenv_00001.png">
                <div class="icon_title">Visual Studio 2019</div>
              </div>
              <div class="app_icon not_allow">
                <img class="icon_logo" src="../../assets/img/app/goland64_00001.png">
                <div class="icon_title">GoLand</div>
              </div>
              <div class="app_icon not_allow">
                <img class="icon_logo" src="../../assets/img/app/ksolaunch_00002.png">
                <div class="icon_title">WPS - 文字</div>
              </div>
              <div class="app_icon" not_allow>
                <img class="icon_logo" src="../../assets/img/app/ksolaunch_00003.png">
                <div class="icon_title">WPS - 演示</div>
              </div>
              <div class="app_icon not_allow">
                <img class="icon_logo" src="../../assets/img/app/ksolaunch_00004.png">
                <div class="icon_title">WPS - 表格</div>
              </div>
              <div class="app_icon not_allow">
                <img class="icon_logo" src="../../assets/img/app/rider64_00001.png">
                <div class="icon_title">Rider</div>
              </div>
              <div class="app_icon not_allow">
                <img class="icon_logo" src="../../assets/img/app/visicon_00001.png">
                <div class="icon_title">Visio 2016</div>
              </div>
              <div class="app_icon not_allow">
                <img class="icon_logo" src="../../assets/img/app/webstorm64_00001.png">
                <div class="icon_title">WebStorm</div>
              </div>
            </div>
          </i-col>
        </Row>
      </div>
    </NavBar>
  </div>
</template>

<script>
import NavBar from '../../components/NavBar'
export default {
  name: 'index',
  components: {NavBar},
  data () {
    return {
      authorization: ''
    }
  },
  mounted () {
    this.getAuthorization()
  },
  methods: {
    hrefTo (url, cloud = false) {
      if (cloud) {
        url = url + '/?authorization=' + this.authorization
      }
      window.open(url)
    },
    getAuthorization () {
      this.authorization = this.$cookie.get('token')
    }
  }
}
</script>

<style scoped>
  .app_area{
    background-color: #FFFFFF;
    height: 85vh;
    padding: 20px;
  }
  .area_title{
    width:80px;
    height:48px;
    font-size:20px;
    font-weight:600;
    color:#4A4A4A;
    line-height:28px;
  }
  .app_icon{
    background-color: #F4F6F8;
    width: 120px;
    height: 132px;
    float: left;
    margin: 10px;
    cursor: pointer;
    color: rgba(255,255,255,0.8);
    border-radius:5px;
  }
  .icon_title{
    margin-top: 10px;
    width: 120px;
    text-align: center;
    color: #4A4A4A;
    font-weight:400;
    font-size: 14px;
  }
  .icon_logo{
    margin-top: 30px;
    margin-left: 30px;
    width: 60px;
    height: 60px;
    font-size: 45px;
    text-indent: 8px;
    border-radius:5px;
  }
  .blue{
    background-color: #69C0FF;
  }
  .green{
    background-color: #87E8DE;
    font-size: 45px !important;
    text-indent: 14px !important;
  }
  .not_allow{
    cursor: not-allowed;
  }
</style>
