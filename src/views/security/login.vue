<template>
  <div style="background: rgb(245,246,249);height: 100%;width:100%">
    <div style="visibility: hidden">Last Update: Aug. 15, 2020</div>
    <div class="main_container">
      <Row class="container">
        <Col :xs="0" :sm="12" class="left">
        </Col>
        <Col :xs="24" :sm="12" :xl="7" class="right">
            <!-- <img style="margin-top: 10px; height: 20px; float: right; cursor: pointer;" src="../../assets/img/img/icon-help.png" @click="getHelp"/> -->
            <div class="loginTitle">用户登录</div>
            <div class="form">
              <div class="code">
                <Input v-model="userId" placeholder="学号/教工号/用户名"/>
              </div>
              <div class="code">
                <Input v-model="passwd"  @keyup.enter.native="login" placeholder="密码" type="password"/>
              </div>
              <div class="code">
                <Input v-model="code" id="code_input" class="code_input" @keyup.enter.native="login" placeholder="验证码"/>
                <img @click="getCodeImage" :src="codeBase64"/>
              </div>
              <div class="code">
                <span class="link" @click="findPwd=!findPwd">忘记密码</span>
                <!-- <span class="link link-right" @click="register=!register">激活账户</span> -->
              </div>
              <Button class="loginButton" :loading="submitLoading" @click="login" long>登 录</Button>
              <div class="code">
                <!-- <a class="link" style="margin: 0 auto" href="https://sso.buaa.edu.cn/login?service=https://cloud.beihangsoft.cn">统一认证登录</a> -->
              </div>
            </div>
          <Modal v-model="findPwd" title="忘记密码" :mask-closable="false" @on-ok="ok">
            <div class="code" style="width: 7vw !important;">
              <Input class="modal_input" v-model="findPwdID" placeholder="学号或工号" />
            </div>
            <div class="code" style="width: 7vw !important;">
              <Input v-model="resetPasswordCode" id="resetPasswordCode" class="code_input" @keyup.enter.native="login" placeholder="验证码"/>
              <img @click="getCodeImage" :src="codeBase64"/>
            </div>
          </Modal>
          <Modal :styles="{top:'20px', width:'60vw !important'}" v-model="firstLogin" title="请阅读认证管理规定，激活账号视为已阅读并同意遵守本规定" @on-ok="register=!register">
            <div>
              <p style="margin:0pt; orphans:0; text-align:center; widows:0">
                <span style="font-family:方正小标宋简体; font-size:18pt">云</span><span style="font-family:方正小标宋简体; font-size:18pt">虚拟</span><span style="font-family:方正小标宋简体; font-size:18pt">服务器</span><span style="font-family:方正小标宋简体; font-size:18pt">管理</span><span style="font-family:方正小标宋简体; font-size:18pt">规定</span>
              </p>
              <p style=" margin:12pt 0pt 0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                <span style="font-family:仿宋; font-size:12pt">为了加强校园网运行和管理的规范性，维护校园网秩序，保障校园网安全稳定运行，同时为配合我校保密资质认证工作的顺利开展，请遵守一下规定：</span>
              </p>
              <p style="font-size:15pt; margin:0pt 0pt 0pt 28.35pt; orphans:0; text-align:justify; text-indent:-28.35pt; widows:0">
                <span style="font-family:仿宋; font-size:12pt">一、</span><span style="font:7.0pt 'Times New Roman'"></span>
                <span style="font-family:仿宋; font-size:12pt">必须</span><span style="font-family:仿宋; font-size:12pt">遵守《中华人民共和国计算机信息网络国际联网管理暂行规定》、《中华人民共和国计算机信息网络国际联网管理暂行规定实施办法》等相关国家法律</span><span style="font-family:仿宋; font-size:12pt">和北京航空航天大学校规校纪、</span><span style="font-family:仿宋; font-size:12pt">北京航空航天大学</span><span style="font-family:仿宋; font-size:12pt">校园网管理办法等</span><span style="font-family:仿宋; font-size:12pt">规定。</span>
              </p>
              <p style="font-size:15pt; margin:0pt 0pt 0pt 28.35pt; orphans:0; text-align:justify; text-indent:-28.35pt; widows:0">
                <span style="font-family:仿宋; font-size:12pt">二、</span><span style="font:7.0pt 'Times New Roman'"></span>
                <span style="font-family:仿宋; font-size:12pt">虚拟机是独立的服务器，务必保管好申请的虚拟机用户名、密码等信息，仅限本人学习使用，不得转借他人使用，不得以任何理由申请提供对外的服务</span><span style="font-family:仿宋; font-size:12pt">,不发布论坛服务</span><span style="font-family:仿宋; font-size:12pt">，不能制作、复制、传播下列内容：</span>
              </p>
              <p style="line-height:20pt; margin:0pt 0pt 0pt 42pt; orphans:0; text-align:justify; widows:0">
                <span style="font-family:'Times New Roman'; font-size:10.5pt">a,</span><span style="font-family:仿宋; font-size:12pt">煽动抗拒、破坏宪法和法律、行政法规实施的；</span>
              </p>
              <p style="line-height:20pt; margin:0pt 0pt 0pt 42pt; orphans:0; text-align:justify; widows:0">
                <span style="font-family:'Times New Roman'; font-size:10.5pt">b,</span><span style="font-family:仿宋; font-size:12pt">煽动颠覆国家政权，推翻社会主义制度的；</span>
              </p>
              <p style="line-height:20pt; margin:0pt 0pt 0pt 42pt; orphans:0; text-align:justify; widows:0">
                <span style="font-family:'Times New Roman'; font-size:10.5pt">c,</span><span style="font-family:仿宋; font-size:12pt">煽动分裂国家、破坏国家统一的；</span>
              </p>
              <p style="line-height:20pt; margin:0pt 0pt 0pt 42pt; orphans:0; text-align:justify; widows:0">
                <span style="font-family:'Times New Roman'; font-size:10.5pt">d,</span><span style="font-family:仿宋; font-size:12pt">煽动民族仇恨、民族歧视，破坏民族团结的；</span>
              </p>
              <p style="line-height:20pt; margin:0pt 0pt 0pt 42pt; orphans:0; text-align:justify; widows:0">
                <span style="font-family:'Times New Roman'; font-size:10.5pt">e,</span><span style="font-family:仿宋; font-size:12pt">捏造或者歪曲事实，散布谣言，扰乱社会秩序的；</span>
              </p>
              <p style="line-height:20pt; margin:0pt 0pt 0pt 42pt; orphans:0; text-align:justify; widows:0">
                <span style="font-family:'Times New Roman'; font-size:10.5pt">f,</span><span style="font-family:仿宋; font-size:12pt">宣扬封</span><span style="font-family:'Times New Roman'; font-size:10.5pt">,</span><span style="font-family:仿宋; font-size:12pt">建迷信、淫秽、色情、赌博、暴力、凶杀、恐怖，教唆犯罪的；</span>
              </p>
              <p style="line-height:20pt; margin:0pt 0pt 0pt 42pt; orphans:0; text-align:justify; widows:0">
                <span style="font-family:'Times New Roman'; font-size:10.5pt">g,</span><span style="font-family:仿宋; font-size:12pt">公然侮辱他人或者捏造事实毁谤他人的；</span>
              </p>
              <p style="line-height:20pt; margin:0pt 0pt 0pt 42pt; orphans:0; text-align:justify; widows:0">
                <span style="font-family:'Times New Roman'; font-size:10.5pt">h,</span><span style="font-family:仿宋; font-size:12pt">损害国家机关信誉的；</span>
              </p>
              <p style="line-height:20pt; margin:0pt 0pt 0pt 42pt; orphans:0; text-align:justify; widows:0">
                <span style="font-family:'Times New Roman'; font-size:10.5pt">i,</span><span style="font-family:仿宋; font-size:12pt">其它违反宪法和法律、行政法规的。</span>
              </p>
              <p style="font-size:15pt; margin:0pt 0pt 0pt 28.35pt; orphans:0; text-align:justify; text-indent:-28.35pt; widows:0">
                <span style="font-family:仿宋; font-size:12pt">三、</span><span style="font:7.0pt 'Times New Roman'"></span>
                <span style="font-family:仿宋; font-size:12pt">必须</span><span style="font-family:仿宋; font-size:12pt">遵守</span><span style="font-family:仿宋; font-size:12pt">国际和</span><span style="font-family:仿宋; font-size:12pt">学校相关规定，不存储、发布、接收违反国家法律和学校相关规定的信息。</span>
              </p>
              <p style="font-size:15pt; margin:0pt 0pt 0pt 28.35pt; orphans:0; text-align:justify; text-indent:-28.35pt; widows:0">
                <span style="font-family:仿宋; font-size:12pt">四、</span><span style="font:7.0pt 'Times New Roman'"></span>
                <span style="font-family:仿宋; font-size:12pt">不得擅自更改虚拟服务器设置，包括服务器名、IP地址、IP掩码、DNS</span><span style="font-family:仿宋; font-size:12pt">设置</span><span style="font-family:仿宋; font-size:12pt">、MAC地址等网络相关参数</span><span style="font-family:仿宋; font-size:12pt">。</span>
              </p>
              <p style="font-size:15pt; margin:0pt 0pt 0pt 28.35pt; orphans:0; text-align:justify; text-indent:-28.35pt; widows:0">
                <span style="font-family:仿宋; font-size:12pt">五、</span><span style="font:7.0pt 'Times New Roman'"></span>
                <span style="font-family:仿宋; font-size:12pt">如需注销虚拟机，请提交相关申请，</span><span style="font-family:仿宋; font-size:12pt">不得随意</span><span style="font-family:仿宋; font-size:12pt">弃用，由此引发的安全隐患，需</span><span style="font-family:仿宋; font-size:12pt">承担因此而带来的</span><span style="font-family:仿宋; font-size:12pt">负责。</span>
              </p>
              <p style="font-size:15pt; margin:0pt 0pt 0pt 28.35pt; orphans:0; text-align:justify; text-indent:-28.35pt; widows:0">
                <span style="font-family:仿宋; font-size:12pt">六、</span><span style="font:7.0pt 'Times New Roman'"></span>
                <span style="font-family:仿宋; font-size:12pt">学院</span><span style="font-family:仿宋; font-size:12pt">保留对本规定的最终解释权。</span>
              </p>
            </div>
            <!-- 可以在注册窗口发送邮件
            <strong style="font-size: 16px">请填写您的邮箱，我们将给您发送账号激活链接：</strong>
            <Input v-model="email" style="display: inline" placeholder="您的邮箱"></Input>
            -->
          </Modal>
          <Modal id="register-modal" :styles="{top:'20px',width:'60vw !important'}" v-model="register" title="激活账户" :mask-closable="false" @on-cancel="registerStep=0">
            <div slot="default" style="min-height:60vh">
              <br>
              <Steps :current="registerStep">
                <Step title="第一步" content="开始注册"></Step>
                <Step title="第二步" content="同意使用协议"></Step>
                <Step title="第三步" content="填写账号信息"></Step>
                <Step title="第四步" content="绑定邮箱"></Step>
                <Step title="第五步" content="设置密码"></Step>
              </Steps>
              <br>
              <div v-show="registerStep === 0" style="position:relative;left:22%;top:5vh;">
                <Form ref="registerStep1Form" :model="registerStep1Form" :rules="ruleValidate" :label-width="80">
                  <FormItem label="学工号：" prop="userId">
                    <Input v-model="registerStep1Form.userId" placeholder="请输入学工号"></Input>
                  </FormItem>
                  <FormItem>
                    <Button style="color:white;background-color:#005FAF" @click="handleNext('registerStep1Form')">开始注册</Button>
                  </FormItem>
                </Form>
              </div>
              <div v-show="registerStep === 1">
                <p style="margin:0pt; orphans:0; text-align:center; widows:0">
                  <span style="font-family:方正小标宋简体; font-size:18pt">云</span><span style="font-family:方正小标宋简体; font-size:18pt">虚拟</span><span style="font-family:方正小标宋简体; font-size:18pt">服务器</span><span style="font-family:方正小标宋简体; font-size:18pt">管理</span><span style="font-family:方正小标宋简体; font-size:18pt">规定</span>
                </p>
                <p style=" margin:12pt 0pt 0pt; orphans:0; text-align:justify; text-indent:21pt; widows:0">
                  <span style="font-family:仿宋; font-size:12pt">为了加强校园网运行和管理的规范性，维护校园网秩序，保障校园网安全稳定运行，同时为配合我校保密资质认证工作的顺利开展，请遵守以下规定：</span>
                </p>
                <p style="font-size:15pt; margin:0pt 0pt 0pt 28.35pt; orphans:0; text-align:justify; text-indent:-28.35pt; widows:0">
                  <span style="font-family:仿宋; font-size:12pt">一、</span><span style="font:7.0pt 'Times New Roman'"></span>
                  <span style="font-family:仿宋; font-size:12pt">必须</span><span style="font-family:仿宋; font-size:12pt">遵守《中华人民共和国计算机信息网络国际联网管理暂行规定》、《中华人民共和国计算机信息网络国际联网管理暂行规定实施办法》等相关国家法律</span><span style="font-family:仿宋; font-size:12pt">和北京航空航天大学校规校纪、</span><span style="font-family:仿宋; font-size:12pt">北京航空航天大学</span><span style="font-family:仿宋; font-size:12pt">校园网管理办法等</span><span style="font-family:仿宋; font-size:12pt">规定。</span>
                </p>
                <p style="font-size:15pt; margin:0pt 0pt 0pt 28.35pt; orphans:0; text-align:justify; text-indent:-28.35pt; widows:0">
                  <span style="font-family:仿宋; font-size:12pt">二、</span><span style="font:7.0pt 'Times New Roman'"></span>
                  <span style="font-family:仿宋; font-size:12pt">虚拟机是独立的服务器，务必保管好申请的虚拟机用户名、密码等信息，仅限本人学习使用，不得转借他人使用，不得以任何理由申请提供对外的服务</span><span style="font-family:仿宋; font-size:12pt">,不发布论坛服务</span><span style="font-family:仿宋; font-size:12pt">，不能制作、复制、传播下列内容：</span>
                </p>
                <p style="line-height:20pt; margin:0pt 0pt 0pt 42pt; orphans:0; text-align:justify; widows:0">
                  <span style="font-family:'Times New Roman'; font-size:10.5pt">a,</span><span style="font-family:仿宋; font-size:12pt">煽动抗拒、破坏宪法和法律、行政法规实施的；</span>
                </p>
                <p style="line-height:20pt; margin:0pt 0pt 0pt 42pt; orphans:0; text-align:justify; widows:0">
                  <span style="font-family:'Times New Roman'; font-size:10.5pt">b,</span><span style="font-family:仿宋; font-size:12pt">煽动颠覆国家政权，推翻社会主义制度的；</span>
                </p>
                <p style="line-height:20pt; margin:0pt 0pt 0pt 42pt; orphans:0; text-align:justify; widows:0">
                  <span style="font-family:'Times New Roman'; font-size:10.5pt">c,</span><span style="font-family:仿宋; font-size:12pt">煽动分裂国家、破坏国家统一的；</span>
                </p>
                <p style="line-height:20pt; margin:0pt 0pt 0pt 42pt; orphans:0; text-align:justify; widows:0">
                  <span style="font-family:'Times New Roman'; font-size:10.5pt">d,</span><span style="font-family:仿宋; font-size:12pt">煽动民族仇恨、民族歧视，破坏民族团结的；</span>
                </p>
                <p style="line-height:20pt; margin:0pt 0pt 0pt 42pt; orphans:0; text-align:justify; widows:0">
                  <span style="font-family:'Times New Roman'; font-size:10.5pt">e,</span><span style="font-family:仿宋; font-size:12pt">捏造或者歪曲事实，散布谣言，扰乱社会秩序的；</span>
                </p>
                <p style="line-height:20pt; margin:0pt 0pt 0pt 42pt; orphans:0; text-align:justify; widows:0">
                  <span style="font-family:'Times New Roman'; font-size:10.5pt">f,</span><span style="font-family:仿宋; font-size:12pt">宣扬封</span><span style="font-family:'Times New Roman'; font-size:10.5pt">,</span><span style="font-family:仿宋; font-size:12pt">建迷信、淫秽、色情、赌博、暴力、凶杀、恐怖，教唆犯罪的；</span>
                </p>
                <p style="line-height:20pt; margin:0pt 0pt 0pt 42pt; orphans:0; text-align:justify; widows:0">
                  <span style="font-family:'Times New Roman'; font-size:10.5pt">g,</span><span style="font-family:仿宋; font-size:12pt">公然侮辱他人或者捏造事实毁谤他人的；</span>
                </p>
                <p style="line-height:20pt; margin:0pt 0pt 0pt 42pt; orphans:0; text-align:justify; widows:0">
                  <span style="font-family:'Times New Roman'; font-size:10.5pt">h,</span><span style="font-family:仿宋; font-size:12pt">损害国家机关信誉的；</span>
                </p>
                <p style="line-height:20pt; margin:0pt 0pt 0pt 42pt; orphans:0; text-align:justify; widows:0">
                  <span style="font-family:'Times New Roman'; font-size:10.5pt">i,</span><span style="font-family:仿宋; font-size:12pt">其它违反宪法和法律、行政法规的。</span>
                </p>
                <p style="font-size:15pt; margin:0pt 0pt 0pt 28.35pt; orphans:0; text-align:justify; text-indent:-28.35pt; widows:0">
                  <span style="font-family:仿宋; font-size:12pt">三、</span><span style="font:7.0pt 'Times New Roman'"></span>
                  <span style="font-family:仿宋; font-size:12pt">必须</span><span style="font-family:仿宋; font-size:12pt">遵守</span><span style="font-family:仿宋; font-size:12pt">国际和</span><span style="font-family:仿宋; font-size:12pt">学校相关规定，不存储、发布、接收违反国家法律和学校相关规定的信息。</span>
                </p>
                <p style="font-size:15pt; margin:0pt 0pt 0pt 28.35pt; orphans:0; text-align:justify; text-indent:-28.35pt; widows:0">
                  <span style="font-family:仿宋; font-size:12pt">四、</span><span style="font:7.0pt 'Times New Roman'"></span>
                  <span style="font-family:仿宋; font-size:12pt">不得擅自更改虚拟服务器设置，包括服务器名、IP地址、IP掩码、DNS</span><span style="font-family:仿宋; font-size:12pt">设置</span><span style="font-family:仿宋; font-size:12pt">、MAC地址等网络相关参数</span><span style="font-family:仿宋; font-size:12pt">。</span>
                </p>
                <p style="font-size:15pt; margin:0pt 0pt 0pt 28.35pt; orphans:0; text-align:justify; text-indent:-28.35pt; widows:0">
                  <span style="font-family:仿宋; font-size:12pt">五、</span><span style="font:7.0pt 'Times New Roman'"></span>
                  <span style="font-family:仿宋; font-size:12pt">如需注销虚拟机，请提交相关申请，</span><span style="font-family:仿宋; font-size:12pt">不得随意</span><span style="font-family:仿宋; font-size:12pt">弃用，由此引发的安全隐患，需</span><span style="font-family:仿宋; font-size:12pt">承担因此而带来的</span><span style="font-family:仿宋; font-size:12pt">负责。</span>
                </p>
                <p style="font-size:15pt; margin:0pt 0pt 0pt 28.35pt; orphans:0; text-align:justify; text-indent:-28.35pt; widows:0">
                  <span style="font-family:仿宋; font-size:12pt">六、</span><span style="font:7.0pt 'Times New Roman'"></span>
                  <span style="font-family:仿宋; font-size:12pt">学院</span><span style="font-family:仿宋; font-size:12pt">保留对本规定的最终解释权。</span>
                </p>
                <Button style="margin-left:19vw;width:21.5vw;font-size:18px;margin-top:40px;color:white;background-color:#005FAF" @click="registerStep++">同意以继续</Button>
              </div>
              <div v-show="registerStep === 2" style="position:relative;left:22%;top:5vh;">
                <Form ref="registerStep3Form" :model="registerStep3Form" :rules="ruleValidate" :label-width="80">
                  <FormItem label="姓名：" prop="name">
                    <Input v-model="registerStep3Form.name" placeholder="请输入姓名"></Input>
                  </FormItem>
                  <FormItem label="邮箱：" prop="email">
                    <Input v-model="registerStep3Form.email" placeholder="请输入邮箱"></Input>
                  </FormItem>
                  <FormItem>
                    <Button style="color:white;background-color:#005FAF" :loading="registerLoading" @click="handleNext('registerStep3Form')">发送邮件</Button>
                  </FormItem>
                </Form>
              </div>
              <div v-show="registerStep === 3" >
                <h1>一封激活邮件已发送至您的邮箱：</h1>
                <p style="width:100%;text-align:center;margin-top:5vh;font-size:22px;color:#515a6e">{{registerStep3Form.email}}</p>
                <p style="width:100%;text-align:center;margin-top:7vh;font-size:14px;color:#515a6e">（这个过程大约需要几分钟，请耐心等待...）</p>
              </div>
              <div v-show="registerStep === 4" style="position:relative;left:22%;top:5vh;">
                <Form ref="registerStep5Form" :model="registerStep5Form" :rules="ruleValidate" :label-width="100">
                  <FormItem label="输入密码：" prop="passwd">
                    <Input v-model="registerStep5Form.passwd" type="password" password placeholder="请输入密码"></Input>
                  </FormItem>
                  <FormItem label="确认密码：" prop="passwdCheck">
                    <Input v-model="registerStep5Form.passwdCheck" type="password" password placeholder="请输入密码"></Input>
                  </FormItem>
                  <FormItem>
                    <Button style="color:white;background-color:#005FAF" :loading="activeLoading" @click="handleNext('registerStep5Form')">设置密码并激活</Button>
                  </FormItem>
                </Form>
              </div>
            </div>
            <div slot="footer"></div>
          </Modal>
          <Modal v-model="resend" title="重新发送激活邮件" :loading="true" @on-ok="activateAccount">
            <label style="font-size: 19px;font-width: 400;" for="resend-email">请填写您绑定账户时的邮箱，我们将给您重新发送账号激活链接:</label><Input id="resend-email" v-model="email"></Input>
          </Modal>
        </Col>
      </Row>

      <div class="copy_right">
        Copyright&copy;2016-{{year}} School of Software, BUAA. All Right Reserved.<br>
      京ICP备05004617号-5 <a href="mailto:luxinxi@buaa.edu.cn">申请使用</a>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  name: 'login',
  data () {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (!(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+`\-={}:";'<>?,.]).{6,16}$/.test(value))) {
        callback(new Error('密码为6~16位且必须同时包含英文字母、数字及特殊字符'))
      } else {
        if (this.registerStep5Form.passwdCheck !== '') {
          // 对第二个密码框单独验证
          this.$refs.registerStep5Form.validateField('passwdCheck')
        }
        callback()
      }
    }
    const validatePassCheck = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.registerStep5Form.passwd) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }
    return {
      year: 2020,
      userId: '',
      passwd: '',
      name: '',
      email: '',
      code: '', // 用户输入的验证码
      resetPasswordCode: '', // 忘记密码的验证码
      role: '',
      token: '', // 验证码的标志
      codeBase64: '', // 验证码地址
      submitLoading: false,
      userAuthorization: '',
      register: false,
      findPwd: false,
      findPwdID: '',
      firstLogin: false,
      resend: false,
      registerStep: 0,
      registerLoading: false,
      activeLoading: false,
      firstLoginEmail: '',
      cast: null,
      emailInfoId: '',
      emailInfoToken: '',
      registerStep1Form: {
        userId: ''
      },
      registerStep3Form: {
        name: '',
        email: ''
      },
      registerStep5Form: {
        passwd: '',
        passwdCheck: ''
      },
      ruleValidate: {
        userId: [
          {required: true, message: '请输入学工号', trigger: 'blur'}
        ],
        name: [
          {required: true, message: '请输入姓名', trigger: 'blur'}
        ],
        email: [
          {required: true, message: '请输入邮箱', trigger: 'blur'},
          {type: 'email', message: '邮箱格式错误', trigger: 'blur'}
        ],
        passwd: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          { validator: validatePass, trigger: 'blur' }
        ],
        passwdCheck: [
          {required: true, message: '请再次输入密码', trigger: 'blur'},
          { validator: validatePassCheck, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    ...mapMutations(['changeLogin']),
    login () {
      this.submitLoading = true
      var temp = this.$sha1(this.passwd)
      temp = temp.toUpperCase()
      let data = {
        id: this.userId,
        password: temp,
        // password: this.$sha1(this.password),
        code: this.code,
        token: this.token,
        // jump: serviceUrl?authorization=TOKEN
        service: this.getParamFromUrl(window.location.href, 'service')
      }
      console.log(data)
      this.$http.post('/security/login', data)
        .then(res => {
          if (res.data.code === 1001 || res.data.code === 1003) {
            console.log('1001or1003')
            if (res.data.msg !== '登录成功') {
              this.$Message.error(res.data.msg)
              this.getCodeImage()
              this.passwd = this.code = ''
              return
            }
            this.userAuthorization = res.data.data.authorization
            if (res.data.code === 1003) {
              window.location.replace(this.getParamFromUrl(window.location.href, 'service') + '?authorization=' + res.data.data.authorization)
            }

            if (res.data.data.is_accept !== 'True') {
              // 用户未激活账户
              this.$Message.warning('您的邮箱未激活！')
              this.resend = true
            } else {
              this.userId = res.data.data.userid
              let dic = {1: 'student', 2: 'teacher', 3: 'admin', 4: 'superAdmin'}
              let in30Mins = 1 / 48
              this.$cookie.set('role', dic[res.data.data.role], {expires: in30Mins})
              this.$cookie.set('username', res.data.data.name, {expires: in30Mins})
              this.$cookie.set('userId', this.userId, {expires: in30Mins})
              this.$cookie.set('token', this.userAuthorization, {expires: in30Mins})
              this.changeLogin({Authorization: this.userAuthorization})
              this.loginJump(res.data.data.role)
            }
          } else if (res.data.code === 2002) {
            this.$Message.warning(res.data.msg)
          } else {
            this.$Message.error(res.data.msg)
            this.getCodeImage()
          }
        })
        .catch(err => {
          console.log(err)
        })
        .then(() => {
          this.submitLoading = false
        })
    },
    getCodeImage () {
      this.$http.get('/security/code')
        .then(res => {
          if (res.data.code === 1001) {
            this.codeBase64 = 'data:image/jpg;base64,' + res.data.data.base64
            this.token = res.data.data.token
          } else {
            console.log(res.data.msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    getHelp () {
      this.$router.push('/help')
    },
    ok () {
      let data = {
        id: this.findPwdID,
        code: this.resetPasswordCode,
        token: this.token
      }
      this.$http.post('/security/resetPasswordRequest', data).then(res => {
        if (res.data.msg === '请求成功') {
          this.$Message.success('已发送重置密码邮件，请注意查收')
        } else {
          this.$Message.error(res.data.msg)
          this.getCodeImage()
        }
      }).catch(err => {
        console.log(err)
      })
    },
    activateAccount () {
      this.$http.get('/security/activateAccount',
        {
          params: {
            email: this.email
          },
          headers: {
            'Authorization': this.userAuthorization
          }
        }).then(res => {
        this.resend = false
        if (res.data.msg === '发送激活邮件') {
          this.$Message.success('已发送激活邮件，请注意查收')
        } else {
          this.$Message.error('发送失败，请先注册')
        }
      }).catch(err => {
        this.resend = false
        this.$Message.error('发送失败')
        console.log(err)
      })
    },
    handleNext (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.registerStep === 0) {
            this.registerStep++
          } else if (this.registerStep === 2) {
            this.registerAccount()
          } else if (this.registerStep === 4) {
            this.setPassword()
          }
        } else {
          this.$Message.error('请输入正确的信息')
        }
      })
    },
    registerAccount () {
      // eslint-disable-next-line no-unused-vars
      // 对应"注册"对话框
      this.registerLoading = true
      let data = {
        id: this.registerStep1Form.userId,
        name: this.registerStep3Form.name,
        email: this.registerStep3Form.email
      }
      console.log(data)
      this.$http.post('/security/register', data).then(res => {
        this.registerLoading = false
        if (res.data.msg === '发送激活邮件') {
          this.registerStep++
          this.$Message.success('已发送激活邮件，请注意查收')
          this.emailInfoId = res.data.data.id
          this.emailInfoToken = res.data.data.token
          this.cast = new BroadcastChannel('activeAccount')
          this.cast.onmessage = e => {
            const text = e.data
            if (text.from === 'activateAccount' && text.content === '4') {
              this.registerStep = 4
            } else if (text.from === 'activateAccount' && text.content === '5') {
              this.registerStep = 0
              this.register = false
            }
          }
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        this.registerLoading = false
        this.$Message.error('请求失败')
        console.log(err)
      })
    },
    setPassword () {
      let temp = this.$sha1(this.registerStep5Form.passwd)
      temp = temp.toUpperCase()
      let data = {
        id: this.emailInfoId,
        token: this.emailInfoToken,
        password: temp
      }
      this.$http.post('security/activateAccountVerify', data).then(res => {
        this.activeLoading = false
        if (res.data.msg === '成功激活账户') {
          this.registerStep = 0
          this.register = false
          this.cast.postMessage({from: 'login', content: '5'})
          this.$Message.success('成功激活账户')
        } else {
          this.$Message.error('激活失败，请稍后再试')
        }
      }).catch(err => {
        this.activeLoading = false
        console.log(err)
      })
    },
    tokenCheck () {
      let token = this.$cookie.get('token')
      let tokenValidated = false
      if (token !== undefined) {
        let data = {
          'token': token,
          'service': 'cloud.beihangsoft.cn'
        }
        this.$http.post('/security/tokenVerify', data).then(res => {
          if (res.data.code !== 1003) {
            this.$cookie.remove('token')
            this.$cookie.remove('username')
            this.$cookie.remove('userId')
            this.$cookie.remove('role')
            return ''
          } else {
            tokenValidated = true
          }
        })
        if (tokenValidated) {
          let service = this.getParamFromUrl(window.location.href, 'service')
          if (service !== undefined) {
            window.location.replace(service + '?authorization=' + token)
          } else {
            this.loginJump(this.$cookie.get('role'))
          }
        }
      }
    },
    loginJump (role) {
      switch (role) {
        case '1':
        case 'student':
          this.$router.push('/student/experiments')
          break
        case '2':
        case 'teacher':
          this.$router.push('/teacher/course')
          break
        case '3':
        case 'admin':
        case '4':
        case 'superAdmin':
          this.$router.push('/security/index')
          break
        default:
      }
    },
    getParamFromUrl (url, param) {
      // Url format: http://baseUrl/?ticket=123456#/security/login ("http://baseUrl?ticket=12345" will be rewritten to "http://baseUrl/?ticket=12345#/security/login")
      let urlString = '' + url
      if (urlString.search(param) === -1) {
        return undefined
      }
      // slice[3] = '?ticket=123456#'
      let slices = urlString.split('?')
      // paramSlice = ['http://baseUrl/','ticket=123456#/security/login']
      let paramSlice = slices[1].split('#')
      // ticket = ['ticket=123456','/security/login']
      let ticket = paramSlice[0].split('=')
      return ticket[1]
    }
  },
  mounted () {
    let date = new Date()
    this.year = date.getFullYear()
    this.tokenCheck()
    this.cast = new BroadcastChannel('activeAccount')
    this.cast.onmessage = e => {
      const text = e.data
      if (text.from === 'activateAccount' && text.content === '4') {
        this.registerStep = 4
      } else if (text.from === 'activateAccount' && text.content === '5') {
        this.registerStep = 0
        this.register = false
      }
    }
    if (window.location.href.search('ticket') !== -1) {
      // http://baseUrl/?ticket=12345#/security/login
      let ticket1 = window.location.href.split('/')
      ticket1 = ticket1[3].split('=')
      ticket1 = ticket1[1].split('#')
      let ticket = ticket1[0]
      let data = {
        ticket: ticket
      }
      this.$http.post('/security/ssoLogin', data).then(res => {
        if (res.data.code === 2002) {
          this.$Message.warning(res.data.msg)
        } else if (res.data.msg === '登录成功') {
          var dic = {1: 'student', 2: 'teacher', 3: 'admin', 4: 'superAdmin'}
          var in30Mins = 1 / 48
          this.$cookie.set('role', dic[res.data.data.role], {expires: in30Mins})
          this.$cookie.set('username', res.data.data.name, {expires: in30Mins})
          this.$cookie.set('userId', res.data.data.userId, {expires: in30Mins})
          this.$cookie.set('token', res.data.data.authorization, {expires: in30Mins})
          this.userAuthorization = res.data.data.authorization
          this.changeLogin({Authorization: this.userAuthorization})
          if (res.data.data.is_accept !== 'True') {
            this.firstLogin = true
          } else if (res.data.data.role === '1') {
            window.location.replace('/#/student/experiments')
          } else if (res.data.data.role === '2') {
            window.location.replace('/#/teacher/course')
          } else if (res.data.data.role === '3' || res.data.data.role === '4') {
            window.location.replace('/#/security/index')
          }
        } else {
          this.$Message.error(res.data.msg)
          window.location.replace('/')
        }
      }).catch(err => {
        console.log(err)
      })
    } else {
      this.getCodeImage()
    }
  }
}
</script>

<style scoped>
  .main_container{
    min-height: 400px;
    background: rgb(245,246,249);
  }
  .title{
    height: 5vw;
    width: 23vw;
    font-size:2vw;
    color:rgba(255,255,255,1);
    line-height:5vw;
    letter-spacing:0.25vw;
  }
  .title_area{
    background:rgba(0,0,0,0.25);
    width: 23vw;
    margin-left: 1vw;
  }
  .en_title{
    height: 2vw;
    width: 23vw;
    font-size: 1vw;
    font-weight:300;
    color:rgba(255,255,255,1);
    line-height:14px;
  }
  .logo{
    height: 4vw;
    padding: 0 30px;
    margin-left: 1.5vw;
    margin-top: 6vw;
  }
  .container{
    margin-top: 25vh;
    width: 100%;
    height: 100%;
  }
  .left{
    margin-left: 25vw;
    text-align: center;
    height: 25vw;
    width: 25vw;
    background: url(../../assets/img/course_back.png) no-repeat center;
    background-size: cover;
  }
  .right{
    text-align: center;
    width: 25vw;
    height: 25vw;
    min-width: 200px;
    min-height: 360px;
    padding: 0 15px;
    background: #ffffff;
  }
  .block{
    width: 100%;
    max-width: 400px;
    background: none;
  }
  .blocked{
    width: calc(50%);
    height: calc(65%);
    margin: 1%;
    max-height: 100%;
  }
  .code{
    display: flex;
    justify-items: baseline;
  }
  .code img{
    height: 4.5vh;
    width: 8vw;
    margin-left: 12vw;
    margin-top: 1vh;
    border: 1px solid #ddd;
    position: absolute;
    border-radius: 0 8px 8px 0;
  }
  .code_input{
    width: 1vw;
  }
  .form > *{
    margin: 10px 0;
    height: 5vh;
    width: 20vw;
  }
  .loginTitle{
    margin-top: 10%;
    margin-bottom: 5%;
    font-size: 2vw;
    color:rgba(0,0,0,1);
    line-height:33px;
    font-weight: 600;
    letter-spacing: 1px;
  }
  .copy_right{
    alignment: center;
    width: 100%;
    font-size: 0.7vw;
    text-align: center;
    color: rgba(182,182,182,1);
    position: absolute;
    bottom: 0;
  }
  .link{
    color: #1890FF;
    cursor: pointer;
    font-size: 14px;
    font-weight: 400;
    margin-top: 1vh;
  }
  .link-right{
    margin-left: calc(20vw - 112px);
  }
  #register-modal /deep/ .ivu-form-item-label{
    margin-top: 10px;
    font-size: 14px;
  }
  #register-modal /deep/ .ivu-steps {
    margin-left: 6%;
  }

  /deep/ input::-webkit-input-placeholder, textarea::-webkit-input-placeholder {
    color: #9B9B9B;
    font-size: 19px;
    font-weight: 400;
    line-height: 25px;
    letter-spacing: 1px;
    text-indent: 9px;
  }

  /deep/ input:-moz-placeholder, textarea:-moz-placeholder {
    color: #9B9B9B;
    font-size: 19px;
    font-weight: 400;
    line-height: 25px;
  }

  /deep/ input::-moz-placeholder, textarea::-moz-placeholder {
    color: #9B9B9B;
    font-size: 19px;
    font-weight: 400;
    line-height: 25px;
  }

  /deep/ input:-ms-input-placeholder, textarea:-ms-input-placeholder {
    color: #9B9B9B;
    font-size: 19px;
    font-weight: 400;
    line-height: 25px;
  }
  /deep/ .code{
    margin-left: 1.6vw;
  }
  /deep/ .ivu-input {
    background: rgba(237,239,245,1);
    height: 4.5vh;
    width: 20vw;
    margin-top: 1vh;
    margin-bottom: 1vh;
    border-radius: 8px;
    font-size: 19px;
    font-weight: 400;
    text-indent: 9px;
  }
  /deep/ .ivu-modal{
    width: 55vw !important;
  }
  .loginButton {
    border-radius: 29px;
    height: 5.2vh;
    width: 20vw;
    font-size: 22px;
    line-height: 30px;
    font-weight: 600;
    margin-top: -1vh;
    background: #1890FF;
    color: #FFFFFF;
  }
</style>
