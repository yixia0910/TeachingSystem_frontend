const Mock = require('mockjs')
let Random = Mock.Random

// Mock.mock(RegExp('/teacher/courseInfo' + '.*'), (options) => {
//   let data = Mock.mock({
//     'array|14-35': [{
//       'id': '@integer(1,300)@integer(1,300)@integer(1,200)',
//       'name': '@cname',
//       'term': '第@integer(1,5)学期',
//       'department': '软件学院'
//     }]
//   })
//   if (Random.integer(0, 4)) {
//     return {
//       code: 1001,
//       msg: '成功',
//       data: data.array
//     }
//   } else {
//     return {
//       code: 0,
//       msg: '数据获取失败 =_=!',
//       data: []
//     }
//   }
// })
Mock.mock(RegExp('/vm/vmInfo' + '.*'), (options) => {
  let data = Mock.mock({
    'array|17-35': [{
      'vmName': '@cname',
      'isPowerOn': '@integer(0,1)',
      'status': '@cname',
      'disk': '@integer(100,500)',
      'RAM': '@integer(4,16)',
      'cpuNum': '@integer(1,4)',
      'sysName': '@cname',
      'ipv4': '@integer(10,200).@integer(10,200).@integer(10,200).@integer(10,200)',
      'term': '第@integer(1,5)学期',
      'department': '软件学院'
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
      data: []
    }
  }
})

Mock.mock(RegExp('/teacher/snapshotInfo' + '.*'), (options) => {
  let data = Mock.mock({
    'array|14-35': [{
      'snapshotID': '@integer(1,300)@integer(1,300)@integer(1,300)',
      'vmName': '@cname',
      'snapshotName': '@cname',
      'createTime': '第@integer(1,5)学期',
      'description': '@cname'
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
      data: []
    }
  }
})

Mock.mock(RegExp('/teacher/assistantInfo' + '.*'), (options) => {
  let data = Mock.mock({
    'array|14-35': [{
      'assistantID': '@integer(1,300)@integer(1,300)@integer(1,200)',
      'assistantName': '@cname',
      'course': '@cname',
      'term': '第@integer(1,5)学期',
      'addTime': '@date(yyyy-MM-dd)'
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
      data: []
    }
  }
})

Mock.mock(RegExp('/teacher/applicationInfo' + '.*'), (options) => {
  let data = Mock.mock({
    'array|14-35': [{
      'applicationID': '@integer(1,300)@integer(1,300)@integer(1,200)',
      'vmName': '@cname',
      'applicationType': '@cname',
      'isHandled|1': ['已受理', '未受理'],
      'handledTime': '@date(yyyy-MM-dd HH:mm:ss)',
      'applicationTime': '@date(yyyy-MM-dd)',
      'responseMessage': '@string(10)'
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
      data: []
    }
  }
})

Mock.mock(RegExp('/teacher/experimentalVMInfo' + '.*'), (options) => {
  let data = Mock.mock({
    'array|17-35': [{
      'studentID': '@integer(1,300)@integer(1,300)@integer(1,200)',
      'vmName': '@cname',
      'isTurnOn': '@integer(0,1)',
      'state': '@cname',
      'disk': '@integer(100,500)',
      'memory': '@integer(4,16)',
      'cpuCount': '@integer(1,4)',
      'osName': '@cname',
      'ipv4Addr': '@integer(10,200).@integer(10,200).@integer(10,200).@integer(10,200)'
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
      data: []
    }
  }
})

Mock.mock('/teacher/addCourse', (req) => {
  let body = JSON.parse(req.body)
  return {
    code: 1001,
    msg: '添加信息成功',
    data: {
      courseName: body.courseName,
      courseCollege: body.courseCollege,
      beginDate: body.beginDate,
      endDate: body.endDate
    }
  }
})

Mock.mock('/teacher/listTerm', (req) => {
  return {
    code: 1001,
    msg: '添加信息成功',
    data: [
      {
        'id': 1,
        'name': '2019春'
      },
      {
        'id': 2,
        'name': '2019秋'
      }
    ]
  }
})

// Mock.mock('/teacher/addWorking', (req) => {
//   let body = JSON.parse(req.body)
//   return {
//     code: 1001,
//     msg: '添加信息成功',
//     data: body
//   }
// })

Mock.mock('/teacher/addHomework', (req) => {
  let body = JSON.parse(req.body)
  return {
    code: 1001,
    msg: '添加信息成功',
    data: {
      courseID: body.courseID,
      homeworkName: body.homeworkName,
      beginTime: body.beginTime,
      endTime: body.endTime,
      delayTime: body.delayTime,
      enablePeerReview: body.enablePeerReview,
      peerReviewDeadline: body.peerReviewDeadline,
      peerReviewDescription: body.peerReviewDescription,
      appealDeadline: body.appealDeadline,
      homeworkDescription: body.homeworkDescription
    }
  }
})

// Mock.mock(RegExp('/teacher/listCollege' + '.*'), (options) => {
//   let data = Mock.mock(
//     [
//       {
//         'name': '材料',
//         'number': 1
//       },
//       {
//         'name': '电子',
//         'number': 2
//       },
//       {
//         'name': '自动',
//         'number': 3
//       },
//       {
//         'name': '能源',
//         'number': 4
//       },
//       {
//         'name': '航空',
//         'number': 5
//       },
//       {
//         'name': '06',
//         'number': 6
//       },
//       {
//         'name': '07',
//         'number': 7
//       },
//       {
//         'name': '08',
//         'number': 8
//       },
//       {
//         'name': '09',
//         'number': 9
//       }
//     ]
//   )
//   return {
//     code: 1001,
//     msg: '成功',
//     data: data
//   }
// })

Mock.mock('/vm/addVM', (req) => {
  let body = JSON.parse(req.body)
  return {
    code: 1001,
    msg: '添加信息成功',
    data: body
  }
})

Mock.mock('/teacher/deleteCourse', (req) => {
  let body = JSON.parse(req.body)
  if (Random.integer(0, 3)) {
    return {
      code: 1001,
      msg: '删除课程成功',
      data: {
        courseID: body.courseID
      }
    }
  } else {
    return {
      code: 2,
      msg: '删除课程失败',
      data: {
        courseID: body.courseID
      }
    }
  }
})

Mock.mock('/teacher/deleteVM', (req) => {
  let body = JSON.parse(req.body)
  if (Random.integer(0, 3)) {
    return {
      code: 1001,
      msg: '删除虚拟机成功',
      data: {
        courseID: body.vmID
      }
    }
  } else {
    return {
      code: 2,
      msg: '删除虚拟机失败',
      data: {
        courseID: body.vmID
      }
    }
  }
})

Mock.mock('/teacher/addExperiment/uploadFiles', (req) => {
  return {
    code: 1001,
    msg: '上传文件成功'
  }
})

Mock.mock('/teacher/addHomework/uploadFiles', (req) => {
  return {
    code: 1001,
    msg: '上传文件成功'
  }
})

// Mock.mock(RegExp('/teacher/templateInfo' + '.*'), (options) => {
//   let data = Mock.mock({
//     'array|17-35': [{
//       'templateName': '@cname',
//       'disk': '@integer(100,500)',
//       'memory': '@integer(4,16)',
//       'cpuCount': '@integer(1,4)',
//       'osName': '@cname',
//       'description': '@cname'
//     }]
//   })
//   if (Random.integer(0, 4)) {
//     return {
//       code: 1001,
//       msg: '成功',
//       data: data.array
//     }
//   } else {
//     return {
//       code: 0,
//       msg: '数据获取失败 =_=!',
//       data: []
//     }
//   }
// })

// Mock.mock('/teacher/getListTemplate', (req) => {
//   return {
//     code: 1001,
//     msg: '获取虚拟机模板成功',
//     data: [{
//       name: '1号模板',
//       type: 'windows10'
//     },
//     {
//       name: '2号模板',
//       type: 'Ubuntu14'
//     }
//     ]
//   }
// })

Mock.mock(RegExp('vm/revertSnapshot' + '.*'), (req) => {
  if (Random.integer(0, 4)) {
    return {
      code: 1001,
      msg: '恢复快照',
      data: ''
    }
  } else {
    return {
      code: 2001,
      msg: '恢复快照失败',
      data: ''
    }
  }
})
Mock.mock(RegExp('vm/removeSnapshot' + '.*'), (req) => {
  if (Random.integer(0, 4)) {
    return {
      code: 1001,
      msg: '删除快照',
      data: ''
    }
  } else {
    return {
      code: 2001,
      msg: '删除快照失败',
      data: ''
    }
  }
})

Mock.mock(RegExp('vm/createSnapshot' + '.*'), (req) => {
  if (Random.integer(0, 4)) {
    return {
      code: 1001,
      msg: 'add快照',
      data: ''
    }
  } else {
    return {
      code: 2001,
      msg: 'add快照失败',
      data: ''
    }
  }
})

// Mock.mock(RegExp('teacher/courseInfoByProId' + '.*'), (req) => {
//   let data = Mock.mock({
//     'array|1-6': [{
//       'id': '@integer(1,300)@integer(1,300)@integer(1,200)',
//       'name': '@cname',
//       'semester': '第@integer(1,5)学期',
//       'department': '软件学院'
//     }]
//   })
//   return {
//     code: 1001,
//     msg: '成功',
//     data: data.array
//   }
// })

// Mock.mock(RegExp('teacher/addAstToCourse' + '.*'), (req) => {
//   if (Random.integer(0, 10)) {
//     return {
//       code: 1001,
//       msg: '成功',
//       data: ''
//     }
//   } else {
//     return {
//       code: 0,
//       msg: '失败 =_=!',
//       data: ''
//     }
//   }
// })

Mock.mock(RegExp('fakeUpload' + '.*'), (req) => {
  if (Random.integer(0, 10)) {
    return {
      code: 1001,
      msg: '成功',
      data: ''
    }
  } else {
    return {
      code: 0,
      msg: '失败 =_=!',
      data: ''
    }
  }
})

// Mock.mock(RegExp('teacher/getstandardHW' + '*'), (req) => {
//   let data = Mock.mock({
//     'array|3-5': [{
//       'student_name': '@cname',
//       'student_id': '@integer(10000000,99999999)',
//       'submit_time': '@date(yyyy-MM-dd)',
//       'file': '',
//       'score': '@integer(1,100)'
//     }]}
//   )
//   return {
//     code: 1001,
//     msg: 'success',
//     data: data.array
//   }
// })

Mock.mock(RegExp('peer/details' + '*'), (req) => {
  let data = Mock.mock({
    'array|3-5': [{
      'name': '@cname',
      'id': '@integer(10000000,99999999)',
      'score': '@integer(1,100)',
      'detail': '@string(30)'
    }]}
  )
  return {
    code: 1001,
    msg: 'success',
    data: data.array
  }
})

Mock.mock(RegExp('vm/tplVmData' + '.*'), (req) => {
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
  return {
    code: 1001,
    msg: '成功',
    data: data.array
  }
})

Mock.mock(RegExp('vm/transferTemplate' + '.*'), (req) => {
  if (Random.integer(0, 3)) {
    return {
      code: 1001,
      msg: '成功',
      data: ''
    }
  } else {
    return {
      code: 0,
      msg: '失败 =_=!',
      data: ''
    }
  }
})

Mock.mock(RegExp('vm/deleteTemplate' + '.*'), (req) => {
  if (Random.integer(0, 3)) {
    return {
      code: 1001,
      msg: '成功',
      data: ''
    }
  } else {
    return {
      code: 0,
      msg: '失败 =_=!',
      data: ''
    }
  }
})

// Mock.mock(RegExp('vm/makeTemplate' + '.*'), (req) => {
//   if (Random.integer(0, 3)) {
//     return {
//       code: 1001,
//       msg: '成功',
//       data: ''
//     }
//   } else {
//     return {
//       code: 0,
//       msg: '失败 =_=!',
//       data: ''
//     }
//   }
// })

Mock.mock(RegExp('vm/turnOff' + '.*'), (req) => {
  if (Random.integer(0, 10)) {
    return {
      code: 1001,
      msg: '成功',
      data: ''
    }
  } else {
    return {
      code: 0,
      msg: '失败 =_=!',
      data: ''
    }
  }
})

// Mock.mock(RegExp('teacher/getExperiment' + '.*'), (req) => {
//   if (Random.integer(0, 10)) {
//     let data = Mock.mock({
//       'array|3-15': [{
//         'id': '@integer(1,50000)',
//         'name': '@string(1,7)',
//         'type|1': ['实验', '作业'],
//         'beginDate': '@date(yyyy-MM-dd)',
//         'endDate': '@date(yyyy-MM-dd)',
//         'deadline': '@date(yyyy-MM-dd)',
//         'submitStatus': '@integer(1,30)' + '/' + '@integer(30,100)',
//         'peerAssesmentStatus': '@integer(1,30)' + '/' + '@integer(30,100)',
//         'expVm|1': ['无', '申请中', '已创建']
//       }]
//     })
//     return {
//       code: 1001,
//       msg: '成功',
//       data: data.array
//     }
//   } else {
//     return {
//       code: 0,
//       msg: '失败 =_=!',
//       data: ''
//     }
//   }
// })

// Mock.mock(RegExp('changeCourseInfo' + '.*'), (req) => {
//   if (Random.integer(0, 10)) {getStuListByCourseId
//     return {
//       code: 1001,
//       msg: '成功',
//       data: ''
//     }
//   } else {
//     return {
//       code: 0,
//       msg: '失败 =_=!',
//       data: ''
//     }
//   }
// })

// Mock.mock(RegExp('getStuListByCourseId' + '.*'), (req) => {
//   if (Random.integer(0, 10)) {
//     // 'id': '', 'name': '', 'department': '', 'email': ''
//     let data = Mock.mock({
//       'array|3-15': [{
//         'id': '@integer(1,10000)',
//         'name|5': '@word',
//         'department': '@word' + '@word',
//         'email': '@string(5)' + '@' + '@string(5)' + '.com'
//       }]
//     })
//     return {
//       code: 1001,
//       msg: '成功',
//       data: data.array
//     }
//   } else {
//     return {
//       code: 0,
//       msg: '失败 =_=!',
//       data: ''
//     }
//   }
// })

// Mock.mock(RegExp('teacher/deleteStuFromCourse' + '.*'), (req) => {
//   if (Random.integer(0, 10)) {
//     return {
//       code: 1001,
//       msg: '成功',
//       data: ''
//     }
//   } else {
//     return {
//       code: 0,
//       msg: '失败 =_=!',
//       data: ''
//     }
//   }
// })

// Mock.mock(RegExp('getUsingVMsById' + '.*'), (req) => {
//   let data = Mock.mock({
//     'array|17-35': [{
//       'vmName': '@cname',
//       'isPowerOn': '@integer(0,1)',
//       'status': '@cname',
//       'disk': '@integer(100,500)',
//       'RAM': '@integer(4,16)',
//       'cpuNum': '@integer(1,4)',
//       'sysName': '@cname',
//       'ipv4': '@integer(10,200).@integer(10,200).@integer(10,200).@integer(10,200)',
//       'term': '第@integer(1,5)学期',
//       'department': '软件学院'
//     }]
//   })
//   if (Random.integer(0, 4)) {
//     return {
//       code: 1001,
//       msg: '成功',
//       data: data.array
//     }
//   } else {
//     return {
//       code: 0,
//       msg: '数据获取失败 =_=!',
//       data: []
//     }
//   }
// })
