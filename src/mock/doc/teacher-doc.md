***
# 本次修改的主要内容：
* 根据反馈，教师学生等获取虚拟机信息的接口应当统一，因此修改了原本教师获取虚拟机列表(/teacher/vmInfo)的接口，改为向"统一接口"做GET请求，暂定统一的接口地址为"vm/vmInfo"。
* 参照pdf尽量统一了变量名称
***

# 课程管理页面
***
# 1.获取教师课程

- [x] 前端已完成
- [ ] 后端已完成

- **接口说明**: 对应教师/课程管理页面
- **请求地址**: `teacher/courseInfo`
- **请求方式**: `GET`

请求参数名 | 请求参数 | 参数类型 | 是否必填 | 说明
-|-|-|:-:|:-
## 请求值示例

```json
{

}
```

返回值名 | 返回值 | 参数类型 |  说明
:-|:-:|:-|-
code|-|number|1001 正常 2001 未登录 2002 无权限访问 3001 请求参数非法 4001 内部错误
msg|-|string|错误/成功信息
data|-|Array|
&emsp;id|-|number|
&emsp;name|-|string|上一版本文档有误，这是课程名称，不是教师姓名
&emsp;term|-|string|
&emsp;department|-|string|所属院系
## 返回值示例

```json
{
  "code": 1001,
  "msg": "成功",
  "data": [{
    "id": 7623158,
    "name": "大数据",
    "term": "第2学期",
    "department": "软件学院"
  },{
    "id": 453387,
    "name": "云计算",
    "term": "第5学期",
    "department": "软件学院"
  },{
    "id": 2118,
    "name": "软工",
    "term": "第5学期",
    "department": "软件学院"
  }]
}
```
# 2.新增课程

- [x] 前端已完成
- [ ] 后端已完成

- **接口说明**: 
- **请求地址**: `teacher/addCourse`
- **请求方式**: `POST`

请求参数名 | 请求参数 | 参数类型 | 是否必填 | 说明
-|-|-|:-:|:-
name|-|string|是|
department_id|-|number|是|开课院系的系号
term_id|-|number|是|学期的id
## 请求值示例

```json
{
  "name": "大数据",
  "department_id": 3,
  "term_id": 1
}
```

返回值名 | 返回值 | 参数类型 |  说明
:-|:-:|:-|-
code|-|number|1001 正常 2001 未登录 2002 无权限访问 3001 请求参数非法 4001 内部错误
msg|-|string|
## 返回值示例

```json
{
  "code": 1001,
  "msg": "添加课程成功"
}
```

# 3.新增实验/作业

- [x] 前端已完成
- [ ] 后端已完成

- **接口说明**: 新增实验和新增作业合并在一个接口，此接口的时间含有时分秒并且含有前导0
- **请求地址**: `teacher/addWorking`
- **请求方式**: `POST`

请求参数名 | 请求参数 | 参数类型 | 是否必填 | 说明
-|-|-|:-:|:-
course_id|-|number||
type||number||0表实验1表作业
name|-|string||
start_time|-|string||
end_time|-|string||
deadline|-|string||
detail|-|string||
is_peer_assessment|-|boolean||true表启用互评，如果不启用互评，互评deadline申诉截止时间之类的都会是空字符串
peer_assessment_deadline|-|string||
peer_assessment_rules|-|string||
appeal_deadline|-|string||
## 请求值示例

```json
{
  "course_id": 662134,
  "type":0,
  "name": "实验名称",
  "start_time": "2019-07-16 00:00:00",
  "end_time": "2019-07-31 00:00:00",
  "deadline": "2019-08-01 00:00:00",
  "detail": "eeeee",
  "is_peer_assessment": true,
  "peer_assessment_deadline": "2019-08-03 00:00:00",
  "peer_assessment_rules": "23dd",
  "appeal_deadline": "2019-08-05 00:00:00"
}
```

返回值名 | 返回值 | 参数类型 |  说明
:-|:-:|:-|-
code|-|number|1001 正常 2001 未登录 2002 无权限访问 3001 请求参数非法 4001 内部错误
msg|-|string|
data||null|
## 返回值示例

```json
{
  "code": 1001,
  "msg": "添加实验成功",
  "data":null
}
```

# 4.获取院系列表

- [x] 前端已完成
- [ ] 后端已完成

- **接口说明**: 
- **请求地址**: `teacher/listCollege`
- **请求方式**: `GET`

请求参数名 | 请求参数 | 参数类型 | 是否必填 | 说明
-|-|-|:-:|:-
## 请求值示例

```json
{
}
```

返回值名 | 返回值 | 参数类型 |  说明
:-|:-:|:-|-
code|-|number|1001 正常 2001 未登录 2002 无权限访问 3001 请求参数非法 4001 内部错误
msg|-|string|
data|-|Array|
&emsp;name||string|系名
&emsp;number||number|系号
## 返回值示例

```json
{
  "code": 1001,
  "msg": "获取院系列表成功",
  "data":[
      {
        "name": "材料",
        "number": 1
      },
      {
        "name": "电子",
        "number": 2
      },
      {
        "name": "自动",
        "number": 3
      },
      {
        "name": "能源",
        "number": 4
      }]
}
```

# 5.获取学期列表

- [x] 前端已完成
- [ ] 后端已完成

- **接口说明**: 
- **请求地址**: `teacher/listTerm`
- **请求方式**: `GET`

请求参数名 | 请求参数 | 参数类型 | 是否必填 | 说明
-|-|-|:-:|:-
## 请求值示例

```json
{
}
```

返回值名 | 返回值 | 参数类型 |  说明
:-|:-:|:-|-
code|-|number|1001 正常 2001 未登录 2002 无权限访问 3001 请求参数非法 4001 内部错误
msg|-|string|
data|-|Array|
&emsp;id|-|int|term_id
&emsp;name||string|
## 返回值示例

```json
{
  "code": 1001,
  "msg": "获取学期列表",
  "data": [
      {
        "id": 1,
        "name": "2019春"
      },
      {
        "id": 2,
        "name": "2019秋"
      }
    ]
}
```

# 6.删除课程

- [x] 前端已完成
- [ ] 后端已完成

- **接口说明**: 
- **请求地址**: `teacher/deleteCourse`
- **请求方式**: `POST`

请求参数名 | 请求参数 | 参数类型 | 是否必填 | 说明
-|-|-|:-:|:-
courseID|-|number||
## 请求值示例

```json
{
  "courseID": 148182
}
```

返回值名 | 返回值 | 参数类型 |  说明
:-|:-:|:-|-
code|-|number|1001 正常 2001 未登录 2002 无权限访问 3001 请求参数非法 4001 内部错误
msg|-|string|
data|||
## 返回值示例

```json
{
  "code": 1001,
  "msg": "删除课程成功",
  "data": null
}
```

***
# 虚拟机管理页面
***
# 1.获取虚拟机模板

- [x] 前端已完成
- [ ] 后端已完成

- **接口说明**: 模板的粗略信息
- **请求地址**: `vm/getListTemplate`
- **请求方式**: `GET`

请求参数名 | 请求参数 | 参数类型 | 是否必填 | 说明
-|-|-|:-:|:-
## 请求值示例

```json

```

返回值名 | 返回值 | 参数类型 |  说明
:-|:-:|:-|-
code|-|number|1001 正常 2001 未登录 2002 无权限访问 3001 请求参数非法 4001 内部错误
msg|-|string|成功/失败信息
data|-|Array|
&emsp;name|-|string|模板名称
&emsp;type|-|string|模板类型
## 返回值示例

```json
{
  "code": 1001,
  "msg": "获取虚拟机模板列表成功",
  "data": [{
    "name": "1号模板",
    "type": "windows10"
  },{
    "name": "2号模板",
    "type": "Ubuntu14"
  }]
}
```

# 2.获取虚拟机信息

- [x] 前端已完成
- [ ] 后端已完成

- **接口说明**: 
- **请求地址**: `vm/vmInfo`
- **请求方式**: `GET`

请求参数名 | 请求参数 | 参数类型 | 是否必填 | 说明
-|-|-|:-:|:-
## 请求值示例

```json

```

返回值名 | 返回值 | 参数类型 |  说明
:-|:-:|:-|-
code|-|number|1001 正常 2001 未登录 2002 无权限访问 3001 请求参数非法 4001 内部错误
msg|-|string|成功/失败信息
data|-|Array|
&emsp;Name||string|虚拟机名称
&emsp;Disk||number|磁盘容量，单位M
&emsp;Memory||number|内存，单位M
&emsp;CPU||number|cpu个数
&emsp;IsTemlate||bool|是否为模板
&emsp;GuestFullName||string|操作系统名称
&emsp;term||string|学期名称
&emsp;AdvancedConfig||string|
&emsp;Status||dict|状态
&emsp;&emsp;IPAddress||string|ipv4地址
&emsp;&emsp;HostName||string|
&emsp;&emsp;PowerState||string|可能是poweredOn poweredOff
&emsp;&emsp;RunTimeState||string|虚拟机状态
## 返回值示例

```json
{
  "code": 1001,
  "msg": "获取虚拟机模板成功",
  "data": [{
    "Name":"123",
    "CPU": 2,
    "Memory": 4096,
    "Disk": 51200,
    "IsTemplate": false,
    "GuestFullName": "CentOS 4/5/6/7 (64-bit)",
    "TemplateName": null,
    "AdvancedConfig": "",
    "Status": {
        "IPAddress": "10.251.254.78",
        "HostName": "10.251.254.14",
        "PowerState": "poweredOn",
        "RunTimeState": "green"
    }
  }]
}
```

# 3.新增虚拟机

- [x] 前端已完成
- [ ] 后端已完成

- **接口说明**: 
- **请求地址**: `vm/addVM`
- **请求方式**: `POST`

请求参数名 | 请求参数 | 参数类型 | 是否必填 | 说明
-|-|-|:-:|:-
Name|-|string||虚拟机名称
AdvancedConfig|-|string||申请原因
CPU|-|number||单位个
Memory|-|number||单位M
TemplateName|-|string||所用的模板的名称
Disk|-|number||单位M
## 请求值示例

```json
{
  "Name": "eeee的虚拟机",
  "AdvancedConfig": "无需求",
  "CPU": 1,
  "Memory": 1024,
  "TemplateName": "某个模板",
  "Disk": 10240
}
```

返回值名 | 返回值 | 参数类型 |  说明
:-|:-:|:-|-
code|-|number|1001 正常 2001 未登录 2002 无权限访问 3001 请求参数非法 4001 内部错误
msg|-|string|
data||null|
## 返回值示例

```json
{
  "code": 1001,
  "msg": "新增虚拟机成功",
  "data": null
}
```

# 4.删除虚拟机

- [x] 前端已完成
- [ ] 后端已完成

- **接口说明**: 
- **请求地址**: `vm/deleteVM`
- **请求方式**: `POST`

请求参数名 | 请求参数 | 参数类型 | 是否必填 | 说明
-|-|-|:-:|:-
Name|-|string||要删除的虚拟机的名称
## 请求值示例

```json
{
  "Name": "xxx的虚拟机"
}
```

返回值名 | 返回值 | 参数类型 |  说明
:-|:-:|:-|-
code|-|number|1001 正常 2001 未登录 2002 无权限访问 3001 请求参数非法 4001 内部错误
msg|-|string|
## 返回值示例

```json
{
  "code": 1001,
  "msg": "删除虚拟机成功",
  "data": null
}
```

***


# 4-3.申请批量创建实验虚拟机

- [x] 前端已完成

- [x] 后端已完成

- **接口说明**: 用于用户撤销未处理的虚拟机申请

- **请求地址**: `vm/privateVm`

- **请求方式**: `POST`

  

| 请求参数       | 参数名     | 参数类型 | 是否必填 | 说明apply |
| -------------- | ---------- | -------- | :------: | :-------- |
| expid          | 实验id     | int      |          |           |
| apply_msg      | 申请信息   | string   |    否    | -         |
| vmconf         | 虚拟机配置 | array    |    是    | -         |
| Name           | 虚拟机名   | string   |    是    |           |
| CPU            | cpu数量    | number   |    是    |           |
| Memory         | 内存       | number   |    是    |           |
| Disk           | 硬盘空间   | number   |    是    |           |
| IsTemplate     | 是否为模板 | bool     |    是    |           |
| GuestFullName  | OS名       | string   |    是    |           |
| TemplateName   | 模板名     | string   |    是    |           |
| AdvancedConfig | 高阶配置   | string   |    是    |           |

| 返回值名 | 返回值 | 说明                  |
| :------- | :----: | :-------------------- |
| code     | 返回码 | 可能值：1001,4001     |
| msg      |  信息  | 申请成功/（失败原因） |
| data     |  数据  | null                  |

## 请求值示例 

```json
{
  "expid":"3",
  "apply_msg":"conf测试",
  "vmconf":{
	  			"Name":"testxzy",
    			"CPU":2,
   				"Memory":100,
    			"Disk":1000,
    			"IsTemplate":false,
    			"GuestFullName":"xzy",
    			"TemplateName":"",
    			"AdvancedConfig":""
            }
}
```



## 返回值示例 

```json
{
  "code": 1001,
  "msg": "申请成功",
  "data": ""
}
```

# 

# 快照管理页面

***
# 1.获取某个虚拟机的快照（目前仅限教师非实验虚拟机）

- [ ] 前端已完成
- [x] 后端已完成

- **接口说明**: 用于获取虚拟机快照列表
- **请求地址**: `vm/getSnapshots`
- **请求方式**: `GET`

返回值名| 返回值 | 说明
:-|:-:|:-
code|返回码|可能值：1001,2001,2002,4001
msg|信息|成功/未登录账户/无权限访问
data|数据|成功：快照信息列表,为一个list.若失败则为null
&emsp;Name|快照名称
&emsp;CreateTime|快照创建时间
&emsp;Description|快照描述

## 返回值示例

```json
{
  "code": 1001,
  "msg": "成功",
  "data": [{
    "Name": "test1",
    "CreateTime": "2019/8/30 4:25:12",
    "Description": "hhh"
  }, {
    "Name": "123123123123",
    "CreateTime": "2019/8/30 4:27:28",
    "Description": "testtestaetast"
    }]
}
```

# 2.删除快照

- [ ] 前端已完成
- [x] 后端已完成

- **接口说明**: 用于删除指定虚拟机
- **请求地址**: `vm/removeSnapshot`
- **请求方式**: `POST`

请求参数名 | 请求参数 | 参数类型 | 是否必填 | 说明
-|-|-|:-:|:-
vmName|虚拟机名|string|是|
snapshotName|快照名|string|是|

## 请求值示例

```json
{
  "vmName":"123",
  "snapshotName":"snapshot1"
}
```

返回值名| 返回值 | 说明
:-|:-:|:-
code|返回码|可能值：1001,2001,2002,3001,4001
msg|信息|成功/未登录账户/无权限访问/快照不存在
data|数据|null

## 返回值示例1

```json
{
  "code": 1001,
  "msg": "成功",
  "data": null
}
```

## 返回值示例2

```json
{
  "code":3001,
  "msg":"快照不存在",
  "data":null
}
```

# 4.恢复快照

- [ ] 前端已完成
- [x] 后端已完成

- **接口说明**: 用于恢复虚拟机快照
- **请求地址**: `vm/revertSnapshot`
- **请求方式**: `POST`

请求参数名 | 请求参数 | 参数类型 | 是否必填 | 说明
-|-|-|:-:|:-
vmName|虚拟机名|string|是|
snapshotName|快照名|string|是|

## 请求值示例

```json
{
  "vmName":"123",
  "snapshotName":"snapshot1"
}
```

返回值名| 返回值 | 说明
:-|:-:|:-
code|返回码|可能值：1001,2001,2002,3001,4001
msg|信息|成功/未登录账户/无权限访问/快照不存在
data|数据|null

## 返回值示例1

```json
{
  "code": 1001,
  "msg": "成功",
  "data": null
}
```

## 返回值示例2

```json
{
  "code":3001,
  "msg":"快照不存在",
  "data":null
}
```
***
# 实验虚拟机页面
***
# 1.获取实验虚拟机信息、

- [x] 前端已完成
- [ ] 后端已完成

- **接口说明**: 
- **请求地址**: `vm/experimentalVMInfo`
- **请求方式**: `GET`

请求参数名 | 请求参数 | 参数类型 | 是否必填 | 说明
-|-|-|:-:|:-

## 请求值示例

```json

```

返回值名 | 返回值 | 参数类型 |  说明
:-|:-:|:-|-
code|-|number|1001 正常 2001 未登录 2002 无权限访问 3001 请求参数非法 4001 内部错误
msg|-|string|成功/失败信息
data|-|Array|
&emsp;Name||string|虚拟机名称
&emsp;Disk||number|磁盘容量，单位M
&emsp;Memory||number|内存，单位M
&emsp;CPU||number|cpu个数
&emsp;IsTemlate||bool|是否为模板
&emsp;GuestFullName||string|操作系统名称
&emsp;term||string|学期名称
&emsp;AdvancedConfig||string|
&emsp;Status||dict|状态
&emsp;&emsp;IPAddress||string|ipv4地址
&emsp;&emsp;HostName||string|
&emsp;&emsp;PowerState||string|可能是poweredOn poweredOff
&emsp;&emsp;RunTimeState||string|虚拟机状态
## 返回值示例

```json
{
  "code": 1001,
  "msg": "获取虚拟机模板成功",
  "data": [{
    "Name":"123",
    "CPU": 2,
    "Memory": 4096,
    "Disk": 51200,
    "IsTemplate": false,
    "GuestFullName": "CentOS 4/5/6/7 (64-bit)",
    "TemplateName": null,
    "AdvancedConfig": "",
    "Status": {
        "IPAddress": "10.251.254.78",
        "HostName": "10.251.254.14",
        "PowerState": "poweredOn",
        "RunTimeState": "green"
    }
  }]
}
```
***
# 模板管理页面
***
# 1.获取模板信息

- [x] 前端已完成
- [ ] 后端已完成

- **接口说明**: 需要在前端为教师展示全部模板，因此不是某一模板的详细信息
- **请求地址**: `teacher/templateInfo`
- **请求方式**: `GET`

请求参数名 | 请求参数 | 参数类型 | 是否必填 | 说明
-|-|-|:-:|:-
## 请求值示例

```json
{

}
```

返回值名 | 返回值 | 参数类型 |  说明
:-|:-:|:-|-
code|-|number|1001 正常 2001 未登录 2002 无权限访问 3001 请求参数非法 4001 内部错误
msg|-|string|
data|-|Array|
&emsp;Name||string|模板名称
&emsp;Disk||number|磁盘容量，单位M
&emsp;Memory||number|内存，单位M
&emsp;CPU||number|cpu个数
&emsp;GuestFullName||string|操作系统名称
&emsp;AdvancedConfig|-|string|模板的备注
## 返回值示例

```json
{
  "code": 1001,
  "msg": "成功",
  "data": [{
    "Name": "梁丽的模板",
    "Disk": 317,
    "Memory": 7,
    "CPU": 2,
    "GuestFullName": "win10",
    "AdvancedConfig": "马秀兰"
  }]
}
```
***
# 助教管理页面
***
# 1.获取助教信息

- [x] 前端已完成
- [ ] 后端已完成

- **接口说明**: 
- **请求地址**: `teacher/assistantInfo`
- **请求方式**: `GET`

请求参数名 | 请求参数 | 参数类型 | 是否必填 | 说明
-|-|-|:-:|:-
## 请求值示例

```json

```

返回值名 | 返回值 | 参数类型 |  说明
:-|:-:|:-|-
code|-|number|
msg|-|string|
data|-|Array|
&emsp;assistantID|-|number|助教学号
&emsp;assistantName|-|string|
&emsp;course|-|string|助教所管理的课程
&emsp;term|-|string|
&emsp;addTime|-|string|添加助教的时间，不需要时分秒，需要前导0
## 返回值示例

```json
{
  "code": 1001,
  "msg": "成功",
  "data": [{
    "assistantID": 72115119,
    "assistantName": "薛杰",
    "course": "大数据",
    "term": "第5学期",
    "addTime": "1976-02-13"
  },{
    "assistantID": 548858,
    "assistantName": "苏娟",
    "course": "云计算",
    "term": "第5学期",
    "addTime": "2013-05-26"
  },{
    "assistantID": 14515828,
    "assistantName": "蒋秀英",
    "course": "xxx",
    "term": "第1学期",
    "addTime": "1987-01-21"
  },{
    "assistantID": 30110164,
    "assistantName": "雷洋",
    "course": "xxx",
    "term": "第4学期",
    "addTime": "2007-08-23"
  }]
}
```

