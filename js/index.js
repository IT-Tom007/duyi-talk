;(async function () {
  // 验证是否有登录，如果没有登录，跳转到登录页，如果登录了，获取到登录的用户信息
  const resp = await API.profile()
  const user = resp.data
  if (!user) {
    alert('未登录或登录已过期，请重新登录')
    location.href = './login.html'
    return
  }

  // 下面代码环境，一定是登录状态
  const doms = {
    aside: {
      nickname: $('#nickname'),
      loginId: $('#loginId')
    },
    close: $('.close'),
    chatContainer: $('.chat-container'),
    msgContainer: $('.msg-container'),
    txtMsg: $('#txtMsg')
  }

  // 设置用户信息
  setUserInfo()

  // 注销事件
  doms.close.onclick = function () {
    API.loginOut()
    location.href = './login.html'
  }

  // 加载历史记录
  loadHistory()
  async function loadHistory() {
    const resp = await API.getHistory()
    for (const item of resp.data) {
      addChat(item)
      scrollBottom()
    }
  }

  // 发送消息事件
  doms.msgContainer.onsubmit = function (e) {
    e.preventDefault()
    sendChat()
  }

  async function sendChat() {
    const content = doms.txtMsg.value.trim()
    if (!content) {
      return
    }
    addChat({
      content,
      createdAt: Date.now(),
      from: user.loginId,
      to: null
    })
    doms.txtMsg.value = ''
    scrollBottom()
    const resp = await API.sendChat(content)
    addChat({
      from: null,
      to: user.loginId,
      ...resp.data
    })
    scrollBottom()
  }

  /**
   * 滚动到底部
   */
  function scrollBottom() {
    doms.chatContainer.scrollTop = doms.chatContainer.scrollHeight
  }

  // 根据消息对象，将其添加到页面中
  /* 
    {
      content: '你几岁了？',
      createdAt: '1715078173965',
      from: 'tom',
      to: null
    }
  */
  function addChat(chatInfo) {
    const div = $$$('div')
    div.classList.add('chat-item')
    if (chatInfo.from) {
      div.classList.add('me')
    }

    const img = $$$('img')
    img.className = 'chat-avatar'
    img.src = chatInfo.from ? './asset/avatar.png' : './asset/robot-avatar.jpg'

    const content = $$$('div')
    content.className = 'chat-content'
    content.innerText = chatInfo.content

    const date = $$$('div')
    date.className = 'chat-date'
    date.innerText = formatDate(chatInfo.createdAt)

    div.appendChild(img)
    div.appendChild(content)
    div.appendChild(date)

    doms.chatContainer.appendChild(div)
  }

  /**
   * 传入一个时间戳，格式化时间
   * @param {Number} timestamp 时间戳
   * @returns
   */
  function formatDate(timestamp) {
    const date = new Date(timestamp)
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')

    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const second = date.getSeconds().toString().padStart(2, '0')

    return `${year}-${month}-${day} ${hours}:${minutes}:${second}`
  }

  // 设置用户信息函数
  function setUserInfo() {
    doms.aside.nickname.innerText = user.nickname
    doms.aside.loginId.innerText = user.loginId
  }
})()
