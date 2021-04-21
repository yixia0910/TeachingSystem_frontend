# 1.获取助教列表

- [x] 前端已完成
- [ ] 后端已完成

- **接口说明**: 对应教师/助教管理页面，需要返回一个带有助教信息的List
- **请求地址**: `teacher/astInfo`
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
&emsp;id|-|number|助教学号
&emsp;name|-|string|助教姓名
&emsp;course|-|string|助教管理的课程名称
&emsp;course_id|-|Number|助教管理的课程id
&emsp;term|-|string|学期
&emsp;create_time|-|string|添加时间，精确到天
## 返回值示例

```json
{
  "code": 1001,
  "msg": "成功",
  "data": [{
    "id": 7623158,
    "name": "名字",
    "course": "大数据",
    "term": "2019 春",
    "create_time": "2019/9/4"
  }]
}
```

# 2.将虚拟机导出OVF（不需要了，这功能砍了）

- [x] 前端已完成
- [ ] 后端已完成

- **接口说明**: 将虚拟机导出OVF（旧平台的功能）
- **请求地址**: `vm/exportOVF`
- **请求方式**: `POST`

请求参数名 | 请求参数 | 参数类型 | 是否必填 | 说明
-|-|-|:-:|:-
vm_name||string|true|想要导出OVF的虚拟机的名字
## 请求值示例

```json
{
    "vm_name":"xxx的虚拟机"
}
```

返回值名 | 返回值 | 参数类型 |  说明
:-|:-:|:-|-
code|-|number|1001 正常 2001 未登录 2002 无权限访问 3001 请求参数非法 4001 内部错误
msg|-|string|错误/成功信息
data|-|Array|
## 返回值示例

```json
{
  "code": 1001,
  "msg": "成功",
  "data": []
}
```
# 3.更改某个虚拟机的密码

- [x] 前端已完成
- [ ] 后端已完成

- **接口说明**: 改密码什么鬼（旧平台的功能）
- **请求地址**: `vm/changePassword`
- **请求方式**: `POST`

请求参数名 | 请求参数 | 参数类型 | 是否必填 | 说明
-|-|-|:-:|:-
vm_name||string|true|想要改密码的虚拟机的名字
password||string|true|新密码
## 请求值示例

```json
{
    "vm_name":"xxx的虚拟机",
    "password": "123456"
}
```

返回值名 | 返回值 | 参数类型 |  说明
:-|:-:|:-|-
code|-|number|1001 正常 2001 未登录 2002 无权限访问 3001 请求参数非法 4001 内部错误
msg|-|string|错误/成功信息
data|-|Array|
## 返回值示例

```json
{
  "code": 1001,
  "msg": "成功",
  "data": []
}
```

# 4.模板转化为虚拟机（这个功能砍了）

- [x] 前端已完成
- [ ] 后端已完成

- **接口说明**: 砍了的功能（旧平台的功能）
- **请求地址**: `vm/transferTemplate`
- **请求方式**: `POST`

请求参数名 | 请求参数 | 参数类型 | 是否必填 | 说明
-|-|-|:-:|:-
name||string|true|想要转化成虚拟机的模板的名称
## 请求值示例

```json
{
    "vm_name":"xxx的虚拟机"
}
```

返回值名 | 返回值 | 参数类型 |  说明
:-|:-:|:-|-
code|-|number|1001 正常 2001 未登录 2002 无权限访问 3001 请求参数非法 4001 内部错误
msg|-|string|错误/成功信息
data|-|Array|
## 返回值示例

```json
{
  "code": 1001,
  "msg": "成功",
  "data": []
}
```

# 5.教师查看某个实验/作业下的学生提交作业情况

- [x] 前端已完成
- [ ] 后端已完成

- **接口说明**: 看作业提交情况
- **请求地址**: `assignment/studentHomework`
- **请求方式**: `GET`

请求参数名 | 请求参数 | 参数类型 | 是否必填 | 说明
-|-|-|:-:|:-
id||Number|true|实验/作业的id
## 请求值示例

```json
{
    "id":123
}
```

返回值名 | 返回值 | 参数类型 |  说明
:-|:-:|:-|-
code|-|number|1001 正常 2001 未登录 2002 无权限访问 3001 请求参数非法 4001 内部错误
msg|-|string|错误/成功信息
data|-|Array|
&emsp;stuId|-|number|学生学号
&emsp;stuName|-|string|学生姓名
&emsp;fileID|-|string|提交的作业ID
&emsp;homeworkStatus|-|string|"已提交"或者"未提交"
&emsp;uploadTime|-|string|提交时间，精确到秒
## 返回值示例

```json
{
  "code": 1001,
  "msg": "成功",
  "data": [{
    "stuId": 7623158,
    "stuName": "名字",
    "fileName": "大数据第1次作业",
    "homeworkStatus": "已提交",
    "uploadTime": "2019/9/4 17:00:00"
  }]
}
```
# 6.教师修改助教管理的课程

- [x] 前端已完成
- [ ] 后端已完成

- **接口说明**: 原本助教管id为origin_course_id的课程，现在变为管id为new_course_id的课程了
- **请求地址**: `teacher/changeAst`
- **请求方式**: `POST`

请求参数名 | 请求参数 | 参数类型 | 是否必填 | 说明
-|-|-|:-:|:-
id||Number|true|助教的学号
origin_course_id||Number|true|原始课程id
new_course_id||Number|true|新课程id
## 请求值示例

```json
{
    "id":12345,
    "origin_course_id":2,
    "new_course_id":3
}
```

返回值名 | 返回值 | 参数类型 |  说明
:-|:-:|:-|-
code|-|number|1001 正常 2001 未登录 2002 无权限访问 3001 请求参数非法 4001 内部错误
msg|-|string|错误/成功信息
data|-|Array|
## 返回值示例

```json
{
  "code": 1001,
  "msg": "成功",
  "data": []
}
```

# 7.教师把学生从课程中删除

- [x] 前端已完成
- [ ] 后端已完成

- **接口说明**: 教师把学生从课程中删除
- **请求地址**: `teacher/deleteStuFromCourse`
- **请求方式**: `POST`

请求参数名 | 请求参数 | 参数类型 | 是否必填 | 说明
-|-|-|:-:|:-
id||Number|true|助教的学号
courseID||||课程ID
## 请求值示例

```json
{
    "courseID":12345,
    "stuID":2
}
```

返回值名 | 返回值 | 参数类型 |  说明
:-|:-:|:-|-
code|-|number|1001 正常 2001 未登录 2002 无权限访问 3001 请求参数非法 4001 内部错误
msg|-|string|错误/成功信息
data|-|Array|
## 返回值示例

```json
{
  "code": 1001,
  "msg": "成功",
  "data": []
}
```
# 8.教师删除课程中所有学生

- [x] 前端已完成
- [ ] 后端已完成

- **接口说明**: 教师把所有学生从课程中删除
- **请求地址**: `teacher/deleteAllStusFromCourse`
- **请求方式**: `POST`

请求参数名 | 请求参数 | 参数类型 | 是否必填 | 说明
-|-|-|:-:|:-
courseID||Number|true|课程的学号
## 请求值示例

```json
{
    "courseID":12345
}
```

返回值名 | 返回值 | 参数类型 |  说明
:-|:-:|:-|-
code|-|number|1001 正常 2001 未登录 2002 无权限访问 3001 请求参数非法 4001 内部错误
msg|-|string|错误/成功信息
data|-|Array|
## 返回值示例

```json
{
  "code": 1001,
  "msg": "成功",
  "data": []
}
```
# 9.教师删除课程中的助教

- [x] 前端已完成
- [ ] 后端已完成

- **接口说明**: 教师把管理课程id为courseID，学号为stuID的助教删除
- **请求地址**: `teacher/deleteAst`
- **请求方式**: `POST`

请求参数名 | 请求参数 | 参数类型 | 是否必填 | 说明
-|-|-|:-:|:-
courseID||Number|true|课程的学号
stuID||Number||学生学号
## 请求值示例

```json
{
    "courseID":12345,
    "stuID":2
}
```

返回值名 | 返回值 | 参数类型 |  说明
:-|:-:|:-|-
code|-|number|1001 正常 2001 未登录 2002 无权限访问 3001 请求参数非法 4001 内部错误
msg|-|string|错误/成功信息
data|-|Array|
## 返回值示例

```json
{
  "code": 1001,
  "msg": "成功",
  "data": []
}
```
