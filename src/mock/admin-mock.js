const Mock = require('mockjs')
let Random = Mock.Random

Mock.mock('/admin/stuData', (req) => {
  let data = Mock.mock({
    'array|20-30': [{
      'id': '@integer(16211000,16211500)',
      'name': '@cname',
      'department': '软件学院',
      'email': '@email',
      'passwd': '123456'
    }]
  })
  if (Random.integer(0, 4)) {
    return {
      code: 1001,
      msg: '成功',
      data: data.array
    }
  } else {
    return {
      code: 0,
      msg: '数据获取失败 =_=!',
      data: ''
    }
  }
})

Mock.mock('/admin/semData', (req) => {
  let data = Mock.mock({
    'array|2-5': [{
      'name': '@integer(2015,2019)春季',
      'startTime': '@date',
      'endTime': '@date'
    }]
  })
  if (Random.integer(0, 4)) {
    return {
      code: 1001,
      msg: '成功',
      data: data.array
    }
  } else {
    return {
      code: 0,
      msg: '数据获取失败 =_=!',
      data: ''
    }
  }
})

// operationLog view
// 返回操作日志
Mock.mock('/operation/log', (req) => {
  let data = Mock.mock({
    'array|20-100': [{
      'opType': '@cword(3,7)',
      'opTarget|1': ['学生', '教师'],
      'opTargetId': '@integer(1000000,2000000)',
      'operatorId': '@integer(100000,200000)',
      'operatorRole|1': ['admin', 'teacher', 'student'],
      'opTime': '@datetime',
      'status|1': ['complete', 'running', 'error'],
      'completeTime': '@datetime',
      'operatorIP': '@ip'
    }]
  })
  if (Random.integer(0, 4)) {
    return {
      code: 1001,
      msg: '成功',
      data: data.array
    }
  } else {
    return {
      code: 0,
      msg: '获取数据失败',
      data: []
    }
  }
})

// applicationRecords view
// 返回申请记录列表
Mock.mock('/application/records', (req) => {
  let data = Mock.mock({
    'array|10-100': [{
      'applicantId': '@integer(1000,20000)',
      'applicantRole|1': ['student', 'teacher', 'admin'],
      'adminId': '@integer(2000,30000)',
      'vmName': '@word(5,15)',
      'applicationType': '@integer(0,2)',
      'applicationTime': '@datetime',
      'status': '@integer(0,6)', // error,已撤销，已修改，已删除，拒绝，已创建，处理中
      'dealTime': '@datetime',
      'vmId': '@integer(1000,20000)',
      'applicationId': '@integer(100,2000)',
      'modalName': '@word(7,10)',
      'cpuCount|1': [1, 2, 4, 8],
      'memory|1': [1, 2, 4, 8, 16],
      'disk': '@integer(8,1024)',
      'courseName': '@cword(3,8)',
      'cpuCountBefore|1': [1, 2, 4, 8],
      'memoryBefore|1': [1, 2, 4, 8, 16],
      'applicationReason': '@csentence(10,50)'
    }]
  })
  if (Random.integer(0, 4)) {
    return {
      code: 1001,
      msg: '成功',
      data: data.array
    }
  } else {
    return {
      code: 0,
      msg: '获取数据失败',
      data: []
    }
  }
})

// applicationRecords view
// 返回可用的ip地址
Mock.mock('/ip/available', (req) => {
  let data = Mock.mock({
    'array|3-20': [{
      'ip': '@ip'
    }]
  })
  if (Random.integer(0, 4)) {
    return {
      code: 1001,
      msg: '成功',
      data: data.array
    }
  } else {
    return {
      code: 0,
      msg: '获取ip失败',
      data: []
    }
  }
})

// applicationRecords view
// 重新执行操作
Mock.mock('/application/handle', (req) => {
  let body = JSON.parse(req.body)
  if (Random.integer(0, 4)) {
    return {
      code: 1001,
      msg: '成功' + body.applicationId.toString(),
      data: ''
    }
  } else {
    return {
      code: 0,
      msg: '操作失败',
      data: ''
    }
  }
})

// applicationRecords view
// 执行拒绝操作
Mock.mock('/application/cancel', (req) => {
  if (Random.integer(0, 4)) {
    return {
      code: 1001,
      msg: 'Success',
      data: ''
    }
  } else {
    return {
      code: 0,
      msg: '操作失败',
      data: ''
    }
  }
})

// machineManagement view
// 返回主机列表
Mock.mock('/machine/list', (req) => {
  let data = Mock.mock({
    'array|2-8': [{
      'ip': '@ip',
      'isConnected': '@boolean',
      'runningStatus|1': ['green', 'yellow', 'red'], // 啥玩意儿啊
      'totalMemory': '@integer(10000,100000)',
      'memoryUsed': '@integer(0,10000)',
      'totalCPU': '@integer(2000,4000)',
      'cpuUsed': '@integer(0,2000)',
      'vmCount': '@integer(0,20)'
    }]
  })
  if (Random.integer(0, 4)) {
    return {
      code: 1001,
      msg: '成功',
      data: data.array
    }
  } else {
    return {
      code: 0,
      msg: '获取主机信息失败',
      data: []
    }
  }
})

// machineManagement view
// 新增主机
Mock.mock('/machine/add', (req) => {
  // let body = JSON.parse(req.body)
  if (Random.integer(0, 4)) {
    return {
      code: 1001,
      msg: '成功',
      data: ''
    }
  } else {
    return {
      code: 0,
      msg: '添加失败',
      data: ''
    }
  }
})

Mock.mock('/admin/teacherData', (req) => {
  let data = Mock.mock({
    'array|10-20': [{
      'id': '@integer(16211000,16211500)',
      'name': '@cname',
      'alias': '@last',
      'email': '@email'
    }]
  })
  if (Random.integer(0, 4)) {
    return {
      code: 1001,
      msg: '成功',
      data: data.array
    }
  } else {
    return {
      code: 0,
      msg: '数据获取失败 =_=!',
      data: ''
    }
  }
})

Mock.mock('/admin/tplData', (req) => {
  let data = Mock.mock({
    'array|3-5': [{
      'name': '@word',
      'teacherId|1': ['all', 'default'],
      'disk|1': ['42949', '53687', '558345'],
      'storage|1': ['4096', '8192'],
      'cpuNum|1': ['2', '4', '8'],
      'OS|1': ['Microsoft Windows Server Threshold (64-bit)', 'Microsoft Windows 7 (64-bit)', 'CentOS 4/5/6/7 (64-bit)'],
      'remark': '@cword(2,10)'
    }]
  })
  if (Random.integer(0, 4)) {
    return {
      code: 1001,
      msg: '成功',
      data: data.array
    }
  } else {
    return {
      code: 0,
      msg: '数据获取失败 =_=!',
      data: ''
    }
  }
})

Mock.mock('/admin/tplVmData', (req) => {
  let data = Mock.mock({
    'array|3-5': [{
      'name|5': '@word',
      'isOpen|1': ['poweredOff', 'poweredOn'],
      'disk|1': ['42949', '53687', '558345'],
      'storage|1': ['4096', '8192'],
      'cpuNum|1': ['2', '4', '8'],
      'OS|1': ['Microsoft Windows Server Threshold (64-bit)', 'Microsoft Windows 7 (64-bit)', 'CentOS 4/5/6/7 (64-bit)']
    }]
  })
  if (Random.integer(0, 4)) {
    return {
      code: 1001,
      msg: '成功',
      data: data.array
    }
  } else {
    return {
      code: 0,
      msg: '数据获取失败 =_=!',
      data: ''
    }
  }
})

Mock.mock('/admin/vmData', (req) => {
  let data = Mock.mock({
    'array|3-5': [{
      'name': '@word',
      'studentId': '@integer(16211000,16211500)',
      'teacherId|1': ['all', 'default'],
      'isOpen|1': ['poweredOff', 'poweredOn'],
      'disk|1': ['42949', '53687', '558345'],
      'storage|1': ['4096', '8192'],
      'cpuNum|1': ['2', '4', '8'],
      'os|1': ['Microsoft Windows Server Threshold (64-bit)', 'Microsoft Windows 7 (64-bit)', 'CentOS 4/5/6/7 (64-bit)'],
      'ip': '@ip'
    }]
  })
  if (Random.integer(0, 4)) {
    return {
      code: 1001,
      msg: '成功',
      data: data.array
    }
  } else {
    return {
      code: 0,
      msg: '数据获取失败 =_=!',
      data: ''
    }
  }
})

Mock.mock('/admin/exceptionVmData', (req) => {
  let data = Mock.mock({
    'array|3-5': [{
      'name': '@word',
      'studentId': '@integer(16211000,16211500)',
      'teacherId|1': ['all', 'default'],
      'isOpen|1': ['poweredOff', 'poweredOn'],
      'disk|1': ['42949', '53687', '558345'],
      'storage|1': ['4096', '8192'],
      'cpuNum|1': ['2', '4', '8'],
      'os|1': ['Microsoft Windows Server Threshold (64-bit)', 'Microsoft Windows 7 (64-bit)', 'CentOS 4/5/6/7 (64-bit)'],
      'ip': '@ip',
      'reason|5': '@cword'
    }]
  })
  if (Random.integer(0, 4)) {
    return {
      code: 1001,
      msg: '成功',
      data: data.array
    }
  } else {
    return {
      code: 0,
      msg: '数据获取失败 =_=!',
      data: ''
    }
  }
})

Mock.mock('/admin/exceptionUserData', (req) => {
  let data = Mock.mock({
    'array|3-5': [{
      'id': '@integer(16211000,16211500)',
      'name': '@cname',
      'type|1': ['教师', '学生', '管理员'],
      'number': '@integer(1, 4)'
    }]
  })
  if (Random.integer(0, 4)) {
    return {
      code: 1001,
      msg: '成功',
      data: data.array
    }
  } else {
    return {
      code: 0,
      msg: '数据获取失败 =_=!',
      data: ''
    }
  }
})

Mock.mock('/admin/expData', (req) => {
  let data = Mock.mock({
    'array|10-15': [{
      'id': '@integer(16211000,16211500)',
      'name|5-8': '@cword',
      'course|1': ['大数据', '云计算', '网络管理'],
      'teacher': '@cname',
      'semester': '@integer(2017,2019)春季',
      'startTime': '@datetime',
      'endTime': '@datetime',
      'assignmentDeadline': '@datetime',
      'vm': '@word'
    }]
  })
  if (Random.integer(0, 4)) {
    return {
      code: 1001,
      msg: '成功',
      data: data.array
    }
  } else {
    return {
      code: 0,
      msg: '数据获取失败 =_=!',
      data: ''
    }
  }
})

Mock.mock('/admin/departmentData', (req) => {
  let data = Mock.mock({
    'array|3-5': [{
      'id': '@integer(1,21)',
      'name': '@cword 学院'
    }]
  })
  if (Random.integer(0, 4)) {
    return {
      code: 1001,
      msg: '成功',
      data: data.array
    }
  } else {
    return {
      code: 0,
      msg: '数据获取失败 =_=!',
      data: ''
    }
  }
})

// stuManagement view
// 新增学生
Mock.mock('/admin/addStu', (req) => {
  if (Random.integer(0, 4)) {
    return {
      code: 1001,
      msg: '添加成功'
    }
  } else {
    return {
      code: 4001,
      msg: '添加失败'
    }
  }
})

// 修改学生信息
Mock.mock('/admin/modifyStu', (req) => {
  if (Random.integer(0, 4)) {
    return {
      code: 1001,
      msg: '修改成功'
    }
  } else {
    return {
      code: 4001,
      msg: '修改失败'
    }
  }
})

// 修改学生密码
Mock.mock('/admin/modifyPwd', (req) => {
  if (Random.integer(0, 4)) {
    return {
      code: 1001,
      msg: '修改成功'
    }
  } else {
    return {
      code: 4001,
      msg: '修改失败'
    }
  }
})

// 删除学生信息
Mock.mock('/admin/removeStu', (req) => {
  if (Random.integer(0, 4)) {
    return {
      code: 1001,
      msg: '删除成功'
    }
  } else {
    return {
      code: 4001,
      msg: '删除失败'
    }
  }
})

// adminManagement view
// 新增管理员
Mock.mock('/admin/addAdmin', (req) => {
  if (Random.integer(0, 4)) {
    return {
      code: 1001,
      msg: '添加成功'
    }
  } else {
    return {
      code: 4001,
      msg: '添加失败'
    }
  }
})

// 修改管理员信息
Mock.mock('/admin/modifyAdmin', (req) => {
  if (Random.integer(0, 4)) {
    return {
      code: 1001,
      msg: '修改成功'
    }
  } else {
    return {
      code: 4001,
      msg: '修改失败'
    }
  }
})

// 修改管理员密码
Mock.mock('/admin/modifyPwd', (req) => {
  if (Random.integer(0, 4)) {
    return {
      code: 1001,
      msg: '修改成功'
    }
  } else {
    return {
      code: 4001,
      msg: '修改失败'
    }
  }
})

// 删除管理员信息
Mock.mock('/admin/removeAdmin', (req) => {
  if (Random.integer(0, 4)) {
    return {
      code: 1001,
      msg: '删除成功'
    }
  } else {
    return {
      code: 4001,
      msg: '删除失败'
    }
  }
})
