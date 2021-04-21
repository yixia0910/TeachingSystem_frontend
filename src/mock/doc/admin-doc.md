# 管理员相关接口

# 1.学生管理页面

# 1-1. 获取院系列表

- [x] 前端已完成
- [ ] 后端已完成
- **接口说明**: 用于选择学生所属院系
- **请求地址**: `admin/departmentData`
- **请求方式**: `GET`

请求参数名 | 请求参数 | 参数类型 | 是否必填 | 说明
-|-|-|:-:|:-

## 请求值示例

```json
{

}
```

| 返回值名   | 返回值 | 参数类型 | 说明                                   |
| :--------- | :----: | :------- | -------------------------------------- |
| code       |   -    | number   | 可能值：1001,4001                      |
| msg        |   -    | string   | 获取学生信息成功/获取失败              |
| data       |   -    | Array    | 获取成功：返回学院信息；失败返回：null |
| &emsp;id   |   -    | number   | 院号                                   |
| &emsp;name |   -    | string   | 学院名称                               |

## 返回值示例

```json
{
  "code": 1001,
  "msg": "成功",
  "data": [
  {
    "id": 7,
    "name": "第 学院"
  },
  {
    "id": 4,
    "name": "千 学院"
  },
  {
    "id": 20,
    "name": "强 学院"
  },
  {
    "id": 17,
    "name": "放 学院"
  }]
}
```

# 1-2. 获取学生列表

- [x] 前端已完成
- [ ] 后端已完成
- **接口说明**: 用于在前端页面上展示学生信息
- **请求地址**: `admin/stuData`
- **请求方式**: `GET`

请求参数名 | 请求参数 | 参数类型 | 是否必填 | 说明
-|-|-|:-:|:-

## 请求值示例

```json
{

}
```

| 返回值名         | 返回值 | 参数类型 | 说明                                   |
| :--------------- | :----: | :------- | -------------------------------------- |
| code             |   -    | number   | 可能值：1001,4001                      |
| msg              |   -    | string   | 获取学生信息成功/获取失败              |
| data             |   -    | Array    | 获取成功：返回学生信息；失败返回：null |
| &emsp;id         |   -    | number   | 学号                                   |
| &emsp;name       |   -    | string   | 姓名                                   |
| &emsp;department |   -    | string   | 学院名称                               |
| &emsp;email      |   -    | string   | 邮箱                                   |
| &emsp;passwd     |   -    | string   | 密码                                   |

## 返回值示例

```json
{
  "code": 1001,
  "msg": "成功",
  "data": [{
    "id": 16211020,
    "name": "林娟",
    "department_id": "软件学院",
    "email": "b.doburxuy@sjlny.ga",
    "passwd": "123456"
  },
  {
    "id": 16211410,
    "name": "乔芳",
    "department_id": "软件学院",
    "email": "a.ymiauvs@ufcnkesx.fr",
    "passwd": "123456"
  },
  {
    "id": 16211163,
    "name": "万磊",
    "department_id": "软件学院",
    "email": "n.oycs@enxgho.sd",
    "passwd": "123456"
  },
  {
    "id": 16211056,
    "name": "雷静",
    "department_id": "软件学院",
    "email": "v.bykfyuncfd@dmlhwl.ki",
    "passwd": "123456"
  },
  {
    "id": 16211234,
    "name": "邓娟",
    "department_id": "软件学院",
    "email": "q.xgs@iashqbhkcv.ne",
    "passwd": "123456"
  }]
}
```

# 1-3. 新增学生

- [x] 前端已完成
- [ ] 后端已完成
- **接口说明**: 用于新添一个学生信息
- **请求地址**: `admin/addStu`
- **请求方式**: `POST`

| 请求参数名    | 请求参数 | 参数类型 | 是否必填 | 说明     |
| ------------- | -------- | -------- | :------: | :------- |
| id            | -        | string   |    是    | 学生id   |
| name          | -        | string   |    是    | 学生姓名 |
| department_id | -        | number   |    是    | 院号     |
| email         | -        | string   |    是    | 邮箱     |
| passwd        | -        | string   |    是    | 密码     |

## 请求值示例

```json
{
  "id": "16210000",
  "name": "张华",
  "department_id": 21,
  "email": "zhanghua@buaa.edu.cn",
  "passwd": "123456"
}
```

| 返回值名 | 返回值 | 参数类型 | 说明              |
| :------- | :----: | :------- | ----------------- |
| code     |   -    | number   | 可能值：1001,4001 |
| msg      |   -    | string   | 添加成功/添加失败 |

## 返回值示例

```json
{
  "code": 1001,
  "msg": "添加成功"
}
```

# 1-4. 修改学生信息

- [x] 前端已完成
- [ ] 后端已完成
- **接口说明**: 用于管理员修改某一学生的个人信息
- **请求地址**: `admin/modifyStu`
- **请求方式**: `POST`

| 请求参数名    | 请求参数 | 参数类型 | 是否必填 | 说明                       |
| ------------- | -------- | -------- | :------: | :------------------------- |
| id            | -        | number   |    是    | 学生学号，根据学号修改信息 |
| name          | -        | string   |    是    | 姓名                       |
| department_id | -        | number   |    是    | 院号                       |
| email         | -        | string   |    是    | 邮箱                       |

## 请求值示例

```json
{
  "id": 16211232,
  "name": "陆洋",
  "department_id": 6,
  "email": "e.gchcnwet@hexdb.ly"
}
```

| 返回值名 | 返回值 | 参数类型 | 说明              |
| :------- | :----: | :------- | ----------------- |
| code     |   -    | number   | 可能值：1001,4001 |
| msg      |   -    | string   | 修改成功/修改失败 |

## 返回值示例

```json
{
  "code": 1001,
  "msg": "修改成功"
}
```

# 1-5. 修改学生密码

- [x] 前端已完成
- [ ] 后端已完成

- **接口说明**: 用于修改某一学生密码
- **请求地址**: `admin/modifyPwd`
- **请求方式**: `POST`

| 请求参数名 | 请求参数 | 参数类型 | 是否必填 | 说明                               |
| ---------- | -------- | -------- | :------: | :--------------------------------- |
| id         | -        | number   |    是    | 学生学号，根据学号修改信息         |
| newPasswd  | -        | string   |    是    | 新密码（可在后端进行密码有效判断） |
## 请求值示例

```json
{
  "id": 16211461,
  "newPasswd": "666"
}
```

| 返回值名 | 返回值 | 参数类型 | 说明                       |
| :------- | :----: | :------- | -------------------------- |
| code     |   -    | number   | 可能值：1001,3001,4001     |
| msg      |   -    | string   | 修改成功/密码无效/修改失败 |
## 返回值示例

```json
{
  "code": 1001,
  "msg": "修改成功"
}
```

# 1-6. 删除学生

- [x] 前端已完成
- [ ] 后端已完成

- **接口说明**: 用于删除一个或多个学生的全部相关信息
- **请求地址**: `admin/removeStu`
- **请求方式**: `POST`

| 请求参数名 | 请求参数 | 参数类型 | 是否必填 | 说明                 |
| ---------- | -------- | -------- | :------: | :------------------- |
| removeId   | -        | Array    |    是    | 待删除学生学号的数组 |
## 请求值示例

```json
{
  "removeId": [16211066,16211077]
}
```

| 返回值名 | 返回值 | 参数类型 | 说明              |
| :------- | :----: | :------- | ----------------- |
| code     |   -    | number   | 可能值：1001,4001 |
| msg      |   -    | string   | 删除成功/删除失败 |
## 返回值示例

```json
{
  "code": 1001,
  "msg": "删除成功"
}
```

# 1-7. 批量导入学生信息

> <!--待完成-->



------



## 1.获取主机信息列表

- [ ] 前端已完成
- [x] 后端已完成

- **接口说明**: 用于管理员获取主机信息列表，数据也可用于可视化主机信息
- **请求地址**: `vm/getHosts`
- **请求方式**: `GET`

返回值名| 返回值 | 说明
:-|:-:|:-
code|返回码|可能值：1001,2001,2002,4001
msg|信息|成功/未登录账户/无权限访问
data|数据|成功：主机信息列表,为一个list.若失败则为null
&emsp;HostName|主机地址
&emsp;IsConnected|是否已连接
&emsp;RunTimeState|运行状态|green、red、yellow
&emsp;CPUTotal|CPU总频率|MHz
&emsp;CPUUsed|已用CPU频率|MHz
&emsp;MemoryTotal|总内存|MB
&emsp;MemoryUsed|已使用内存|MB
&emsp;VirtualMachineList|该主机上所有虚拟机的名字列表

## 返回值示例

```json
{
  "code": 1001,
  "msg": "成功",
  "data": [{
    "HostName": "10.251.254.13",
    "IsConnected": "connected",
    "RunTimeState": "green",
    "CPUTotal": 22788,
    "CPUUsed": 147,
    "MemoryTotal": 130669,
    "MemoryUsed": 33294,
    "VirtualMachineList": ["CloudPlatform_dotNet_Win2016", "win7-template|TP"]
  }, {
    "HostName": "10.251.254.14",
    "IsConnected": "connected",
    "RunTimeState": "green",
    "CPUTotal": 22788,
    "CPUUsed": 91,
    "MemoryTotal": 130669,
    "MemoryUsed": 7618,
    "VirtualMachineList": ["3333", "TestRename", "12", "WindowsServer2016|TP", "777"]
  }]
}
```

## 2.获取日志信息列表

- [ ] 前端已完成
- [x] 后端已完成

- **接口说明**: 用于管理员获取日志信息列表
- **请求地址**: `admin/getLogs`
- **请求方式**: `GET`

请求参数名 | 请求参数 | 参数类型 | 是否必填 | 说明
-|-|-|:-:|:-
size|每页数据条数|int|否|分页用
page|页数|int|否|分页用

返回值名| 返回值 | 说明
:-|:-:|:-
code|返回码|可能值：1001,2001,2002,4001
msg|信息|成功/未登录账户/无权限访问
data|数据|成功：日志信息列表,为一个list.若失败则为null
&emsp;id|日志id
&emsp;operate_target_type|操作类型
&emsp;operator_target_id|操作目标id|
&emsp;operate_id|操作者id
&emsp;operator_role|操作者角色
&emsp;time|时间
&emsp;state|状态
&emsp;content|内容
&emsp;complete_time|完成时间
&emsp;user_ip|用户IP地址

## 返回值示例

```json
{
	"code": 1001,
	"msg": "成功",
	"data": [{
		"id": 1,
		"operate_target_type": "登录",
		"operate_target_id": "id",
		"operator_id": "id",
		"operator_role": 1,
		"time": "2019/7/11 20:14:28",
		"state": "",
		"content": "",
		"complete_time": "",
		"user_ip": "localhost:54067"
	}, {
		"id": 2,
		"operate_target_type": "登录",
		"operate_target_id": "15211037",
		"operator_id": "15211037",
		"operator_role": 1,
		"time": "2019/7/11 20:22:27",
		"state": "",
		"content": "",
		"complete_time": "",
		"user_ip": "localhost:54067"
	}]
}
```
