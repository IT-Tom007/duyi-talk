const API = (function () {
  const BASE_URL = 'https://study.duyiedu.com'
  const TOKEN_KEY = 'token'

  /**
   * 通过fetch发送get请求，返回请求的调用
   * @param {String} path 请求路径
   * @returns Promise
   */
  function get(path) {
    const headers = {}
    const token = localStorage.getItem(TOKEN_KEY)
    if (token) {
      headers.authorization = `Bearer ${token}`
    }
    return fetch(BASE_URL + path, { headers })
  }

  /**
   * 通过fetch发送post请求，返回请求的调用
   * @param {String} path 请求路径
   * @param {Object} bodyObj 请求体对象
   * @returns Promise
   */
  function post(path, bodyObj) {
    const headers = {
      'Content-Type': 'application/json'
    }
    const token = localStorage.getItem(TOKEN_KEY)
    if (token) {
      headers.authorization = `Bearer ${token}`
    }
    return fetch(BASE_URL + path, {
      headers,
      method: 'POST',
      body: JSON.stringify(bodyObj)
    })
  }

  /**
   * 用户注册网络请求函数
   * @param {Object} userInfo 用户注册信息对象
   * @returns Promise
   */
  async function reg(userInfo) {
    const resp = await post('/api/user/reg', userInfo)
    return await resp.json()
  }

  /**
   * 用户登录网络请求函数
   * @param {Object} loginInfo 登录用户信息对象
   * @returns Promise
   */
  async function login(loginInfo) {
    const resp = await post('/api/user/login', loginInfo)

    const result = await resp.json()
    if (result.code === 0) {
      // 登录成功
      // 将响应头中的token保存起来（localStorage）
      const token = resp.headers.get('authorization')
      localStorage.setItem(TOKEN_KEY, token)
    }
    return result
  }

  /**
   * 验证一个账号是否存在
   * @param {String} loginId 用户的ID
   * @returns Promise
   */
  async function exists(loginId) {
    const resp = await get('/api/user/exists?loginId=' + loginId)
    return await resp.json()
  }

  /**
   * 查看当前登录的用户信息
   * @returns Promise
   */
  async function profile() {
    const resp = await get('/api/user/profile')
    return await resp.json()
  }

  /**
   * 发送聊天消息网络接口
   * @param {String} content 聊天的消息内容
   * @returns promise
   */
  async function sendChat(content) {
    const resp = await post('/api/chat', { content })
    return await resp.json()
  }

  /**
   * 获取聊天消息网络接口
   * @returns promise
   */
  async function getHistory() {
    const resp = await get('/api/chat/history')
    return await resp.json()
  }

  /**
   * 退出登录，移除token
   */
  function loginOut() {
    localStorage.removeItem(TOKEN_KEY)
  }

  return {
    reg,
    login,
    exists,
    profile,
    sendChat,
    getHistory,
    loginOut
  }
})()
