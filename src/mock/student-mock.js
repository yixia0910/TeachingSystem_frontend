import md5 from 'md5'
const Mock = require('mockjs')
let Random = Mock.Random

// testTable view
// 获取测试数据
// 注意！！ get方式的请求必须包含参数且参数一致才能被拦截，如下
Mock.mock('/student/getData?type=finish', (req) => {
  let data = Mock.mock({
    'array|5-15': [{
      'id': '@integer(16211000,16211500)',
      'name': '@cname',
      'count': '@integer(1,200)'
    }]
  })
  if (Random.integer(0, 4)) {
    return {
      code: 1,
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

// info view
// 获取个人信息
Mock.mock('/getInfo?userId=test', (req) => {
  let data = Mock.mock({
    'name': '@cname',
    'email': '@email'
  })
  if (Random.integer(0, 4)) {
    return {
      code: 1001,
      msg: '成功',
      data: data
    }
  } else {
    return {
      code: 2001,
      msg: '数据获取失败 =_=!',
      data: ''
    }
  }
})

// info view
// 学生修改个人信息
Mock.mock('/changeInfo', (req) => {
  let ok = Random.integer(0, 2) // 2/3的概率
  return {
    code: ok ? 1001 : 0,
    msg: ok ? '成功修改个人信息！' : '网络错误，请稍后再试'
  }
})

// info view
// 学生修改密码
Mock.mock('/changePwd', (req) => {
  let body = JSON.parse(req.body)
  if (body.passwdOld === md5('123')) {
    return {
      code: 1001,
      msg: '成功修改密码！'
    }
  } else {
    return {
      code: 4001,
      msg: '请确保旧密码正确！'
    }
  }
})

// expInfo view
// 未完成的实验列表
Mock.mock('/exp/unfinished', (req) => {
  let data = Mock.mock({
    'array|0-30': [{
      'id': '@integer(1000,1500)',
      'name': '@word 实验',
      'course': '@cword(3,7)',
      'teacher': '@cname',
      'term|1': ['2019春', '2019夏', '2019秋'],
      'start_time': '@datetime',
      'end_time': '@datetime',
      'deadline': '@datetime'
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

// expInfo view
// 获取课程信息
Mock.mock('/student/courselist', (req) => {
  let data = Mock.mock({
    'array|0-5': [{
      'name': '@cword(3,9)',
      'id': '@integer(1000,2000)',
      'teacher': '@cname',
      'term|1': ['2019春', '2019夏', '2019秋'],
      'exp_count': '@integer(0,9)'
    }]
  })
  if (Random.integer(0, 4)) {
    return {
      code: 1001,
      msg: 'Success',
      data: data.array
    }
  } else {
    return {
      code: 0,
      msg: '获取课程失败',
      data: []
    }
  }
})

// courseExp view
// 课程的全部实验
Mock.mock('/course/exp', (req) => {
  let data = Mock.mock({
    'array|0-30': [{
      'id': '@integer(1000,1500)',
      'name': '@word 实验',
      'term|1': ['2019春', '2019夏', '2019秋'],
      'start_time': '@datetime',
      'end_time': '@datetime',
      'deadline': '@datetime',
      'status': '@boolean'
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

// expDetails view
// 实验详细信息
Mock.mock('/exp/details', (req) => {
  let data = Mock.mock({
    'rdata': {
      'name': '@cword(3,5)实验',
      'course': '@cword(3,7)',
      'teacher': '@cname',
      'deadline': '@datetime',
      'peer_assessment_deadline': '@datetime',
      'details': '@csentence(50,800)',
      'sourcelist|1-3': [{
        'source': '@url',
        'name': '@cword(2,10)'
      }],
      'status': '@boolean'
    }
  })
  if (Random.integer(0, 4)) {
    return {
      code: 1001,
      msg: 'Success',
      data: data.rdata
    }
  } else {
    return {
      code: 0,
      msg: '获取数据失败',
      data: ''
    }
  }
})

// expDetails view
// 上传作业
Mock.mock('/work/upload', (req) => {
  if (Random.integer(0, 4)) {
    return {
      code: 1001,
      msg: 'Success',
      data: ''
    }
  } else {
    return {
      code: 0,
      msg: '上传失败',
      data: ''
    }
  }
})

// expPeer view
// 互评信息表格
Mock.mock('/peer/info', (req) => {
  let data = Mock.mock({
    'array|4-10': [{
      'student_id|8': /[0-9]/,
      'status': '@boolean',
      'origin_score': '-',
      'reason': '-',
      'work': '@url'
    }]
  })
  if (Random.integer(0, 4)) {
    return {
      code: 1001,
      msg: 'Success',
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

// expPeer view
// 提交互评
Mock.mock('/peer/update', (req) => {
  // let body = JSON.parse(req.body)
  if (Random.integer(0, 4)) {
    return {
      code: 1001,
      msg: 'Sucess',
      data: ''
    }
  } else {
    return {
      code: 0,
      msg: '评价失败',
      data: ''
    }
  }
})

// expPeer view
// 互评页面
Mock.mock('/exp/peer', (req) => {
  let body = JSON.parse(req.body)
  let data = Mock.mock({
    'name': '@cword(3,7)实验',
    'course': '@cword(3,7)',
    'deadline': '@datetime',
    'rules': '@sentence(200,400)',
    'standard': '@sentence(200,400)'
  })
  if (Random.integer(0, 4)) {
    return {
      code: 1001,
      msg: 'Success' + body.id.toString(),
      data: data
    }
  } else {
    return {
      code: 0,
      msg: '获取数据失败',
      data: ''
    }
  }
})

// peerDetails view
// 互评详情4个互评的打分情况
Mock.mock('/peer/details', (req) => {
  let data = Mock.mock({
    'array|4-10': [{
      'assessor_id|6': /[0-9]/,
      'score': '@integer(0,100)',
      'appeal_reason': '@csentence(10,50)',
      'appeal_status': '@integer(0,3)'
    }]
  })
  if (Random.integer(0, 4)) {
    return {
      code: 1001,
      msg: 'Success',
      data: data.array
    }
  } else {
    return {
      code: 0,
      msg: '获取数据失败',
      data: ''
    }
  }
})

// peerDetails view
// 提交申诉
Mock.mock('/peer/appeal', (req) => {
  if (Random.integer(0, 4)) {
    return {
      code: 1001,
      msg: 'Success',
      data: ''
    }
  } else {
    return {
      code: 0,
      msg: '提交失败',
      data: ''
    }
  }
})

// applicationInfo view
// 申请记录信息
/* Mock.mock(RegExp('/common/applicationInfo' + '.*'), (option) => {
  let data = Mock.mock({
    'array|13-25': [{
      'vmName': '@cname',
      'applicationType': '@integer(1,5)',
      'applicationTime': '@time',
      'isAccept|1': ['已受理', '未受理'],
      'acceptTime': '@time',
      'response': 'response',
      'operation': 'null'
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
      code: 4001,
      msg: '数据获取失败 =_=!',
      data: []
    }
  }
}) */

// applicationInfo view
// 学生撤销申请
/* Mock.mock('/common/cancelApplication', (req) => {
  let ok = Random.integer(0, 2) // 4/5的概率
  return {
    code: ok ? 1001 : 4001,
    msg: ok ? '撤销成功' : '撤销失败',
    data: ''
  }
}) */

// expVM view
// 学生虚拟机信息
Mock.mock(RegExp('/student/expVMInfo' + '.*'), (option) => {
  let data = Mock.mock({
    'array|13-25': [{
      'vmName': '@cname',
      'isOpen|1': ['已开机', '未开机'],
      'status': '@integer(1,5)',
      'disk': '@integer(1000,2000)',
      'RAM': '@integer(1000,2000)',
      'CPUNum': '@integer(2,8)',
      'sysName': '@name',
      'ipv4': '@address'
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
      code: 4001,
      msg: '数据获取失败 =_=!',
      data: []
    }
  }
})

// expVM view
// 学生撤销申请
Mock.mock('/student/powerOn', (req) => {
  let ok = Random.integer(0, 2) // 4/5的概率
  return {
    code: ok ? 1001 : 4001,
    msg: ok ? '开机成功' : '开机失败',
    data: ''
  }
})

// applicationInfo view
// 学生撤销申请
Mock.mock('/student/powerOff', (req) => {
  let ok = Random.integer(0, 2) // 4/5的概率
  return {
    code: ok ? 1001 : 4001,
    msg: ok ? '关机成功' : '关机失败',
    data: ''
  }
})
