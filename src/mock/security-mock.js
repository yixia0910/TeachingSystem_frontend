const Mock = require('mockjs')
let Random = Mock.Random

// login view
// 首页验证码
Mock.mock('/security/code', (req) => {
  let ok = Random.integer(0, 4) // 4/5的概率
  let word = Random.word(4)
  return {
    code: ok ? 1 : 0,
    msg: ok ? 'ok' : '崩了呗',
    data: ok ? {url: Random.image('200x100', '#eee', '#999', word)} : ''
  }
})

// 首页登录
Mock.mock('/security/login', (req) => {
  let body = JSON.parse(req.body)
  if (body.userId === 'teacher' || body.userId === 'student' || body.userId === 'admin') {
    return {
      code: 1001,
      msg: '登录成功',
      data: {
        username: 'testName',
        authorization: '1234567890',
        role: body.userId
      }
    }
  } else {
    return {
      code: 4001,
      msg: '账号或密码错误',
      data: {}
    }
  }
})
