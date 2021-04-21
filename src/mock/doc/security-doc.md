# 1-1.登录接口

- [x] 前端已完成
- [x] 后端已完成

- **接口说明**: 用于账号登录
- **请求地址**: `security/login`
- **请求方式**: `POST`

请求参数 | 参数名 | 参数类型 | 是否必填 | 说明
-|-|-|:-:|:-
用户ID|id|string|是|-
用户密码|password|string|是|加密方式暂未确定
验证码|code|string|是|-
验证码的标志|token|string|是|-

返回值名| 返回值 | 说明
:-|:-:|:-
code|返回码|可能值：1001,4001
msg|信息|登录成功/用户不存在/密码错误/内部错误，请联系管理员
data|数据|登录成功：token、role、name.若登录失败则为null
&emsp;authorization|token|
&emsp;role|角色类型|
&emsp;name|用户姓名|


## 返回值示例

```json
{
  "code":1001,
  "msg":"login successfully",
  "data":{
    "authorization":"ad544704-ae65-44f7-ba21-49b82fb77cca",
    "role":"1",
    "name":"myName"
  }
}
```

# 1-2.获取验证码接口

- [x] 前端已完成
- [ ] 后端已完成

- **接口说明**: 用于账号登录时验证码检验安全
- **请求地址**: `security/code`
- **请求方式**: `GET`

请求参数 | 参数名 | 参数类型 | 是否必填 | 说明
-|-|-|:-:|:-

返回值名| 返回值 | 说明
:-|:-:|:-
code|返回码|可能值：1001,4001
msg|信息|获取验证码成功/网络错误
data|数据|成功获取：base64编码以及token.若失败则为null
&emsp;base64|验证码的base64编码
&emsp;token|验证码的token|

## 返回值示例

```json
{
  "code":1001,
  "msg":"成功获取验证码",
  "data":{
    "base64":"123",
    "token": "1234567890"
  }
}
```
