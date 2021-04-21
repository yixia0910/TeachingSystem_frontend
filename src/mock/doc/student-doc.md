# 1-1.学生获取实验虚拟机接口

- [x] 前端已完成
- [ ] 后端已完成

- **接口说明**: 用于学生获取虚拟机信息
- **请求地址**: `student/expVMInfo`
- **请求方式**: `GET`

请求参数 | 参数名 | 参数类型 | 是否必填 | 说明
-|-|-|:-:|:-
用户ID|id|string|是|-

返回值名| 返回值 | 说明
:-|:-:|:-
code|返回码|可能值：1001,4001
msg|信息|获取实验虚拟机信息成功/网络错误
data|数据|成功获取：实验虚拟机信息.若失败则为null
&emsp;vmName|虚拟机名称
&emsp;isOpen|虚拟机是否开机|已开机/未开机
&emsp;status|虚拟机的状态|前端暂时不知道有什么状态，可商议
&emsp;disk|磁盘（MB）|
&emsp;RAM|内存（MB）|
&emsp;CPUNum|CPU数量|
&emsp;sysName|系统名称|
&emsp;ipv4|ipv4地址|

## 返回值示例 

```json
{
  "code":1001,
  "msg":"成功获取虚拟机信息",
  "data":[
    {
      "vmName": "name",
      "isOpen": "已开机",
      "status": "1",
      "disk": "1024",
      "RAM": "1024",
      "CPUNum": "2",
      "sysName": "Linux",
      "ipv4": "0.0.0.0"
    },
    {
        "vmName": "name2",
        "isOpen": "已关机",
        "status": "1",
        "disk": "1024",
        "RAM": "1024",
        "CPUNum": "2",
        "sysName": "Linux",
        "ipv4": "0.0.0.0"
      }
  ]
}
```
# 1-2.学生开启虚拟机

- [x] 前端已完成
- [ ] 后端已完成

- **接口说明**: 用于学生开启虚拟机
- **请求地址**: `student/powerOn`
- **请求方式**: `POST`

请求参数 | 参数名 | 参数类型 | 是否必填 | 说明
-|-|-|:-:|:-
用户ID|id|string|是|-
虚拟机名称|vmName|string|是|-

返回值名| 返回值 | 说明
:-|:-:|:-
code|返回码|可能值：1001,4001
msg|信息|开机成功/（失败原因）
data|数据|null

## 返回值示例 

```json
{
  "code": 1001,
  "msg": "开机成功",
  "data": ""
}
```

# 1-3.学生关闭虚拟机

- [x] 前端已完成
- [ ] 后端已完成

- **接口说明**: 用于学生关闭虚拟机
- **请求地址**: `student/powerOff`
- **请求方式**: `POST`

请求参数 | 参数名 | 参数类型 | 是否必填 | 说明
-|-|-|:-:|:-
用户ID|id|string|是|-
虚拟机名称|vmName|string|是|-

返回值名| 返回值 | 说明
:-|:-:|:-
code|返回码|可能值：1001,4001
msg|信息|关机成功/（失败原因）
data|数据|null

## 返回值示例 

```json
{
  "code": 1001,
  "msg": "关机成功",
  "data": ""
}
```

# 2.1.获取未完成实验列表

- [x] 前端已完成
- [ ] 后端已完成

- **接口说明**:  当前学生未完成的实验列表
- **请求地址**: `/exp/unfinished`
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
code|-|number| 成功 1001
msg|-|string| 错误信息
data|-|Array|
&emsp;id|-|number| 实验编号
&emsp;name|-|string| 实验名
&emsp;course|-|string| 课程名
&emsp;teacher|-|string| 教师
&emsp;term|-|string| 学期名
&emsp;start_time|-|string|
&emsp;end_time|-|string|
&emsp;deadline|-|string|
## 返回值示例

```json
{
  "code": 1001,
  "msg": "成功",
  "data": [{
    "id": 1232,
    "name": "rmybuo 实验",
    "course": "间算总",
    "teacher": "曹超",
    "term": "2019秋",
    "start_time": "1984-09-03 17:05:27",
    "end_time": "2004-07-27 04:45:21",
    "deadline": "1989-02-12 08:33:23"
  },{
    "id": 1144,
    "name": "qvhw 实验",
    "course": "且矿第发身如性",
    "teacher": "韩军",
    "term": "2019秋",
    "start_time": "1970-01-23 11:50:36",
    "end_time": "1987-10-07 19:50:21",
    "deadline": "2009-04-01 03:39:20"
  },{
    "id": 1384,
    "name": "gkwm 实验",
    "course": "解听便话统",
    "teacher": "袁勇",
    "term": "2019秋",
    "start_time": "1982-01-26 20:25:44",
    "end_time": "2013-02-02 12:38:37",
    "deadline": "1996-07-07 04:17:45"
  },{
    "id": 1339,
    "name": "nechemzdm 实验",
    "course": "金第达子团",
    "teacher": "宋桂英",
    "term": "2019夏",
    "start_time": "2003-03-26 14:43:22",
    "end_time": "1985-06-13 02:26:45",
    "deadline": "2008-02-05 16:50:13"
  },{
    "id": 1325,
    "name": "akrv 实验",
    "course": "于候门众区族",
    "teacher": "程勇",
    "term": "2019夏",
    "start_time": "2001-03-05 04:57:15",
    "end_time": "1997-05-02 00:21:03",
    "deadline": "1998-01-21 17:53:20"
  },{
    "id": 1117,
    "name": "zyjoqn 实验",
    "course": "传效由个见",
    "teacher": "朱敏",
    "term": "2019春",
    "start_time": "1974-08-24 21:31:46",
    "end_time": "1998-03-21 16:15:24",
    "deadline": "2009-01-22 11:34:58"
  },{
    "id": 1097,
    "name": "enrt 实验",
    "course": "设采新果路",
    "teacher": "尹秀兰",
    "term": "2019夏",
    "start_time": "2001-08-25 07:19:34",
    "end_time": "2007-08-26 02:20:49",
    "deadline": "2012-10-16 23:06:56"
  },{
    "id": 1240,
    "name": "ububrn 实验",
    "course": "美至连置发通",
    "teacher": "金娟",
    "term": "2019夏",
    "start_time": "1996-05-12 08:05:10",
    "end_time": "2003-08-02 04:35:42",
    "deadline": "2001-10-26 02:51:30"
  },{
    "id": 1307,
    "name": "xtxydneil 实验",
    "course": "但没者响连",
    "teacher": "朱磊",
    "term": "2019秋",
    "start_time": "2009-12-19 13:10:27",
    "end_time": "2009-09-23 05:08:01",
    "deadline": "1977-02-25 23:00:48"
  },{
    "id": 1347,
    "name": "otgyuer 实验",
    "course": "张程头",
    "teacher": "吕秀英",
    "term": "2019秋",
    "start_time": "1977-07-01 16:33:16",
    "end_time": "1979-01-23 16:44:57",
    "deadline": "1971-06-29 08:58:24"
  },{
    "id": 1108,
    "name": "mdedkuv 实验",
    "course": "化府间合非",
    "teacher": "谢涛",
    "term": "2019春",
    "start_time": "2013-11-26 17:00:22",
    "end_time": "1988-09-01 14:08:42",
    "deadline": "1997-10-31 06:20:42"
  },{
    "id": 1311,
    "name": "ewcsgzk 实验",
    "course": "没着东只格",
    "teacher": "姚敏",
    "term": "2019夏",
    "start_time": "1986-12-31 23:51:17",
    "end_time": "1975-05-06 06:03:47",
    "deadline": "1981-04-26 05:11:19"
  },{
    "id": 1409,
    "name": "ntuultqk 实验",
    "course": "外王务办",
    "teacher": "吕敏",
    "term": "2019夏",
    "start_time": "1997-06-28 18:04:17",
    "end_time": "2014-04-13 09:15:22",
    "deadline": "1995-03-20 13:03:17"
  }]
}
```


# 2.2获取课程列表

- [x] 前端已完成
- [ ] 后端已完成

- **接口说明**:  获取学生所有课程
- **请求地址**: `/student/courselist`
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
code|-|number| 成功 1001
msg|-|string| 错误信息
data|-|Array|
&emsp;name|-|string| 课程名
&emsp;id|-|number| 课程编号
&emsp;teacher|-|string|
&emsp;term|-|string|
&emsp;exp_count|-|number| 实验个数
## 返回值示例

```json
{
  "code": 1001,
  "msg": "Success",
  "data": [{
    "name": "建数加今严就器对",
    "id": 1059,
    "teacher": "武杰",
    "term": "2019夏",
    "exp_count": 8
  },{
    "name": "局气政什持际美",
    "id": 1954,
    "teacher": "曾秀英",
    "term": "2019秋",
    "exp_count": 4
  },{
    "name": "种织角然安手性委",
    "id": 1392,
    "teacher": "汤霞",
    "term": "2019春",
    "exp_count": 6
  }]
}
```

# 2.3课程实验列表

- [x] 前端已完成
- [ ] 后端已完成

- **接口说明**:  该课程的全部实验列表
- **请求地址**: `/course/exp`
- **请求方式**: `POST`

请求参数名 | 请求参数 | 参数类型 | 是否必填 | 说明
-|-|-|:-:|:-
course_id|-|number|是|
## 请求值示例

```json
{
  "course_id": 1720
}
```

返回值名 | 返回值 | 参数类型 |  说明
:-|:-:|:-|-
code|-|number| 成功 1001
msg|-|string|
data|-|Array|
&emsp;id|-|number| 实验编号
&emsp;name|-|string| 实验名
&emsp;term|-|string|
&emsp;start_time|-|string|
&emsp;end_time|-|string|
&emsp;deadline|-|string|
&emsp;status|-|boolean|
&emsp;index|-|number|
## 返回值示例

```json
{
  "code": 1001,
  "msg": "成功",
  "data": [{
    "id": 1078,
    "name": "glzvjc 实验",
    "term": "2019秋",
    "start_time": "2001-11-23 19:58:15",
    "end_time": "2013-06-14 20:08:32",
    "deadline": "1996-09-30 16:56:50",
    "status": true,
    "index": 1
  },{
    "id": 1313,
    "name": "nvmel 实验",
    "term": "2019秋",
    "start_time": "1985-01-10 15:46:54",
    "end_time": "1982-05-15 23:37:50",
    "deadline": "1983-07-25 22:23:03",
    "status": false,
    "index": 2
  },{
    "id": 1319,
    "name": "iuf 实验",
    "term": "2019秋",
    "start_time": "2017-11-10 12:16:23",
    "end_time": "2010-03-25 06:58:26",
    "deadline": "2017-07-28 09:40:34",
    "status": false,
    "index": 3
  },{
    "id": 1294,
    "name": "pnept 实验",
    "term": "2019夏",
    "start_time": "2013-01-16 12:37:50",
    "end_time": "2018-07-12 20:12:23",
    "deadline": "2005-10-01 10:49:28",
    "status": true,
    "index": 4
  },{
    "id": 1121,
    "name": "csskydi 实验",
    "term": "2019春",
    "start_time": "1997-12-22 02:26:55",
    "end_time": "1993-03-04 01:37:15",
    "deadline": "2016-01-30 11:51:05",
    "status": true,
    "index": 5
  },{
    "id": 1138,
    "name": "cluwqwoh 实验",
    "term": "2019夏",
    "start_time": "1977-10-07 01:19:41",
    "end_time": "1970-12-18 02:29:13",
    "deadline": "1992-04-20 10:40:39",
    "status": false,
    "index": 6
  },{
    "id": 1208,
    "name": "puhncvp 实验",
    "term": "2019秋",
    "start_time": "1990-06-22 21:39:27",
    "end_time": "2013-10-05 18:30:54",
    "deadline": "1975-08-20 00:05:50",
    "status": false,
    "index": 7
  },{
    "id": 1456,
    "name": "nfktx 实验",
    "term": "2019夏",
    "start_time": "1999-05-09 18:36:29",
    "end_time": "1977-07-14 02:52:42",
    "deadline": "2005-07-12 11:33:31",
    "status": true,
    "index": 8
  },{
    "id": 1452,
    "name": "ckoupclpv 实验",
    "term": "2019春",
    "start_time": "1979-02-04 09:25:35",
    "end_time": "1999-09-24 21:02:17",
    "deadline": "1984-09-23 17:02:23",
    "status": false,
    "index": 9
  },{
    "id": 1060,
    "name": "gvwghgwb 实验",
    "term": "2019夏",
    "start_time": "1993-05-30 07:50:02",
    "end_time": "2004-12-03 12:10:33",
    "deadline": "2014-04-27 21:35:24",
    "status": true,
    "index": 10
  },{
    "id": 1452,
    "name": "vqnsstepht 实验",
    "term": "2019夏",
    "start_time": "2010-06-09 20:16:23",
    "end_time": "1977-12-13 13:23:24",
    "deadline": "1982-11-25 02:28:14",
    "status": true,
    "index": 11
  },{
    "id": 1020,
    "name": "ndkwmmgye 实验",
    "term": "2019秋",
    "start_time": "2003-07-04 21:31:07",
    "end_time": "1992-03-16 16:27:52",
    "deadline": "1973-06-11 23:14:07",
    "status": true,
    "index": 12
  },{
    "id": 1346,
    "name": "kyvc 实验",
    "term": "2019夏",
    "start_time": "1988-03-31 23:23:26",
    "end_time": "1983-09-24 08:16:58",
    "deadline": "1984-05-05 03:22:47",
    "status": true,
    "index": 13
  },{
    "id": 1160,
    "name": "vdl 实验",
    "term": "2019春",
    "start_time": "1976-09-09 22:50:13",
    "end_time": "1979-05-08 09:28:07",
    "deadline": "1990-05-11 18:43:11",
    "status": true,
    "index": 14
  },{
    "id": 1400,
    "name": "tpesnix 实验",
    "term": "2019夏",
    "start_time": "1992-08-08 10:31:00",
    "end_time": "1988-04-30 09:08:03",
    "deadline": "1996-03-08 13:29:00",
    "status": false,
    "index": 15
  },{
    "id": 1007,
    "name": "xlmwy 实验",
    "term": "2019夏",
    "start_time": "2003-04-11 06:14:12",
    "end_time": "2004-07-02 16:44:43",
    "deadline": "2017-07-05 16:38:12",
    "status": true,
    "index": 16
  },{
    "id": 1156,
    "name": "dbjo 实验",
    "term": "2019春",
    "start_time": "1980-07-12 12:48:27",
    "end_time": "2007-04-27 10:31:42",
    "deadline": "1987-04-04 14:55:26",
    "status": false,
    "index": 17
  },{
    "id": 1029,
    "name": "ddjy 实验",
    "term": "2019秋",
    "start_time": "2011-09-15 20:06:41",
    "end_time": "2003-11-07 08:10:49",
    "deadline": "2004-02-18 08:25:55",
    "status": true,
    "index": 18
  },{
    "id": 1036,
    "name": "nbf 实验",
    "term": "2019春",
    "start_time": "1989-04-10 05:01:27",
    "end_time": "2010-07-28 03:29:16",
    "deadline": "2010-01-13 19:27:20",
    "status": true,
    "index": 19
  }]
}
```



​# 1.实验详情
 
 - [ ] 前端已完成
 - [ ] 后端已完成
 
 - **接口说明**:  返回实验详细信息
 - **请求地址**: `/exp/details`
 - **请求方式**: `POST`
 
 请求参数名 | 请求参数 | 参数类型 | 是否必填 | 说明
 -|-|-|:-:|:-
 id|-|number|是|实验编号
 ## 请求值示例
 
 ```json
 {
   "id": 1189
 }
 ```
 
 返回值名 | 返回值 | 参数类型 |  说明
 :-|:-:|:-|-
 code|-|number|成功 1001
 msg|-|string| 错误信息或成功提示
 data|-|Object|
 &emsp;name|-|string| 实验名称
 &emsp;course|-|string| 课程名称
 &emsp;teacher|-|string| 教师姓名
 &emsp;deadline|-|string| 延迟提交时间
 &emsp;peer_assessment_deadline|-|string| 互评截止时间
 &emsp;details|-|string|
 &emsp;sourcelist|-|Array|
 &emsp;&emsp;source|-|string| 下载地址
 &emsp;&emsp;name|-|string| 资源名
 &emsp;status|-|boolean| 提交状态
 ## 返回值示例
 
 ```json
 {
   "code": 1001,
   "msg": "Success",
   "data": {
     "name": "片上准上实验",
     "course": "面及社办员值",
     "teacher": "彭军",
     "deadline": "2003-09-08 08:36:04",
     "peer_assessment_deadline": "2001-12-14 21:04:27",
     "details": "个水热律因制有料科除很级儿务维开步着克到定相后目住下回性没决造铁号直知放需议最一正影务许展任志会区国何响同张大整火单斗意我验利原没国花地间切效当南该斯半完也报计八每己比。",
     "sourcelist": [{
       "source": "cid://wyyfdilx.ie/whlc",
       "name": "每增六"
     },{
       "source": "ftp://tsf.bj/ngsnvoj",
       "name": "级转"
     },{
       "source": "wais://grfsh.aw/bnkuooom",
       "name": "验府做布上"
     }],
     "status": false
   }
 }
 ```
 
# 3.1.互评信息

- [x] 前端已完成
- [ ] 后端已完成

- **接口说明**:  实验的互评情况
- **请求地址**: `/exp/peer`
- **请求方式**: `POST`

请求参数名 | 请求参数 | 参数类型 | 是否必填 | 说明
-|-|-|:-:|:-
id|-|number|是| 实验编号
## 请求值示例

```json
{
  "id": 1491
}
```

返回值名 | 返回值 | 参数类型 |  说明
:-|:-:|:-|-
code|-|number|成功 1001
msg|-|string| 错误信息或成功提示
data|-|Object|
&emsp;name|-|string| 实验名称
&emsp;course|-|string| 课程名称
&emsp;peerAssessmentDeadline|-|string| 互评截止时间
&emsp;rule|-|string| 互评规则
&emsp;standard|-|string| 互评标准
## 返回值示例

```json
{
  "code": 1001,
  "msg": "Success",
  "data": {
    "name": "军制想强实验",
    "course": "例做节",
    "deadline": "2007-07-04 01:21:47",
    "rules": "Ljjd b owysfge.",
    "standard": "Dmh cgkshivu hrvwdjsje dccmfkf vaanccn edrxct rprfnxsmf."
  }
}
```
# 4.1.待互评列表

- [x] 前端已完成
- [ ] 后端已完成

- **接口说明**:  需要进行互评的作业列表
- **请求地址**: `/peer/info`
- **请求方式**: `POST`

请求参数名 | 请求参数 | 参数类型 | 是否必填 | 说明
-|-|-|:-:|:-
id|-|number|是|实验编号
## 请求值示例

```json
{
  "id": 1465
}
```

返回值名 | 返回值 | 参数类型 |  说明
:-|:-:|:-|-
code|-|number|成功 1001
msg|-|string|
data|-|Array|
&emsp;student_id|-|string|
&emsp;status|-|boolean|
&emsp;origin_score|-|string|
&emsp;reason|-|string|
## 返回值示例

```json
{
  "code": 1001,
  "msg": "Success",
  "data": [{
    "student_id": "12112572",
    "status": true,
    "origin_score": "-",
    "reason": "-"
  },{
    "student_id": "76946340",
    "status": true,
    "origin_score": "-",
    "reason": "-"
  },{
    "student_id": "37181452",
    "status": false,
    "origin_score": "-",
    "reason": "-"
  },{
    "student_id": "39433067",
    "status": false,
    "origin_score": "-",
    "reason": "-"
  }]
}
```


# 4.2.提交互评

- [x] 前端已完成
- [ ] 后端已完成

- **接口说明**: 提交对某作业的互评记录
- **请求地址**: `/update/peer`
- **请求方式**: `POST`

请求参数名 | 请求参数 | 参数类型 | 是否必填 | 说明
-|-|-|:-:|:-
origin_score|-|number||
reason|-|string||
status|-|boolean||
experiment_id|-|number||
student_id|-|string||
## 请求值示例

```json
{
  "origin_score": 0,
  "reason": "s",
  "status": true,
  "experiment_id": 1360,
  "student_id": "97587538"
}
```

返回值名 | 返回值 | 参数类型 |  说明
:-|:-:|:-|-
code|-|number|成功 1001
msg|-|string|错误信息
data|-|string|
## 返回值示例

```json
{
  "code": 1001,
  "msg": "Sucess",
  "data": ""
}
```



# 5.1.收到的互评结果

- [x] 前端已完成
- [ ] 后端已完成

- **接口说明**:  收到的互评结果列表
- **请求地址**: `/peer/details`
- **请求方式**: `POST`

请求参数名 | 请求参数 | 参数类型 | 是否必填 | 说明
-|-|-|:-:|:-
id|-|number|是| 实验编号
## 请求值示例

```json
{
  "id": 1259
}
```


返回值名 | 返回值 | 参数类型 |  说明
:-|:-:|:-|-
code|-|number| 成功 1001
msg|-|string|
data|-|Array|
&emsp;assessor_id|-|string|
&emsp;score|-|number|
&emsp;appeal_reason|-|string|
&emsp;appeal_status|-|number|
## 返回值示例

```json
{
  "code": 1001,
  "msg": "Success",
  "data": [{
    "assessor_id": "674184",
    "score": 88,
    "appeal_reason": "劳总处况少格老此际通外进。",
    "appeal_status": 3
  },{
    "assessor_id": "737810",
    "score": 39,
    "appeal_reason": "引山铁温省面力从提来治提子称书效适商消方广清观众节难。",
    "appeal_status": 2
  },{
    "assessor_id": "747844",
    "score": 4,
    "appeal_reason": "自是联高严去济组七张济务拉细改本中前立力可素节接教极例。",
    "appeal_status": 2
  },{
    "assessor_id": "369275",
    "score": 52,
    "appeal_reason": "安影亲传学阶布证要东内法千求采马要速眼定干务装次省技交给及根百无质始照天第公整看空离。",
    "appeal_status": 3
  },{
    "assessor_id": "094441",
    "score": 35,
    "appeal_reason": "须对等使布八交共还平查千线劳界图准所院水。",
    "appeal_status": 2
  },{
    "assessor_id": "729474",
    "score": 83,
    "appeal_reason": "机上派府海入世系段问们族而例号新象教。",
    "appeal_status": 2
  }]
}
```


# 5.2.申诉

- [x] 前端已完成
- [ ] 后端已完成

- **接口说明**:  提交申诉
- **请求地址**: `/peer/appeal`
- **请求方式**: `POST`

请求参数名 | 请求参数 | 参数类型 | 是否必填 | 说明
-|-|-|:-:|:-
id|-|number|是|实验编号
assessor_id|-|string|是|
appeal_reason|-|string||
## 请求值示例

```json
{
  "id": 1144,
  "assessor_id": "380585",
  "appeal_reason": "申诉"
}
```

返回值名 | 返回值 | 参数类型 |  说明
:-|:-:|:-|-
code|-|number|成功 1001
msg|-|string|错误信息
data|-|string|
## 返回值示例

```json
{
  "code": 1001,
  "msg": "Success",
  "data": ""
}
```



