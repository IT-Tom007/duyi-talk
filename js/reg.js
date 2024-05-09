// 账号验证
const loginIdValidator = new FieldValidator('txtLoginId', async function (val) {
  if (!val) {
    return '请填写账号'
  }
  // 验证账号是否存在
  const resp = await API.exists(val)
  if (resp.data) {
    // 账号已存在
    return '该账号已被占用，请重新选择一个账号名'
  }
})

// 昵称验证
const nicknameValidator = new FieldValidator('txtNickname', function (val) {
  if (!val) {
    return '请填写昵称'
  }
})

// 密码验证
const loginPwdValidator = new FieldValidator('txtLoginPwd', function (val) {
  if (!val) {
    return '请填写密码'
  }
})

// 确认密码验证
const loginPwdConfirmValidator = new FieldValidator('txtLoginPwdConfirm', function (val) {
  if (!val) {
    return '请填写确认密码'
  }
  if (val !== loginPwdValidator.input.value) {
    return '两次密码不一致'
  }
})

// 交互
const form = $('.user-form')

form.onsubmit = async function (e) {
  e.preventDefault()
  const result = FieldValidator.validate(
    loginIdValidator,
    nicknameValidator,
    loginPwdValidator,
    loginPwdConfirmValidator
  )
  if (!result) {
    return // 验证未通过
  }
  const formData = new FormData(form) // 传入表单dom，得到一个表单数据
  const data = Object.fromEntries(formData.entries())

  const resp = await API.reg(data)
  if (resp.code === 0) {
    alert('注册成功，点击确定，跳转到登录页')
    location.href = './login.html'
  }
}
