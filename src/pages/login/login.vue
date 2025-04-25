<script setup>
import { ref,onMounted } from 'vue'
import {
		onLoad
	} from '@dcloudio/uni-app'

//引入仓库
import { useMemberStore } from '@/stores'
const memberStore = useMemberStore()

const identity = {
  '游客' : 'GUEST',
  '研究所专家' : 'DOCTOR',
  '兼职护士' : 'NURSE',
  '管理员' : 'ADMIN'
}

// 是否是医护人员登录
const isDoctor = ref(false)

// 是否同意协议
const isAgreed = ref(false)

// 创建动画实例
const animation = uni.createAnimation({
  duration: 300,
  timingFunction: 'ease-out'
})

// 动画数据
const animationData = ref(null)

// 初始化动画
onMounted(() => {
  resetAnimation()
})

// 重置动画状态
const resetAnimation = () => {
  animation.opacity(1).translateX(0).step()
  animationData.value = animation.export()
}

// 切换登录方式（添加左右滑动动画）
const toggleLogin = () => {
  // 确定滑动方向（左出右进或右出左进）
  const direction = isDoctor.value ? -1 : 1
  
  // 先执行退出动画
  animation.opacity(0).translateX(100 * direction).step({
    duration: 150
  })
  animationData.value = animation.export()
  
  // 延迟切换状态
  setTimeout(() => {
    isDoctor.value = !isDoctor.value
    
    // 重置动画状态（从相反方向准备进入）
    animation.opacity(0).translateX(-100 * direction).step({
      duration: 0
    })
    animationData.value = animation.export()
    
    // 执行进入动画
    setTimeout(() => {
      animation.opacity(1).translateX(0).step({
        duration: 150
      })
      animationData.value = animation.export()
    }, 50)
  }, 150)
}

// 同意协议
const onAgreementChange = () => {
  isAgreed.value = !isAgreed.value
}

// 打开协议
const navigateToUserService = () => {
  uni.navigateTo({
    url: '/pages/user-service/user-service'
  })
}

// 查看协议
const navigateToPrivacyPolicy = () => {
  uni.navigateTo({
    url: '/pages/privacy-policy/privacy-policy'
  })
}

// 处理返回上一页逻辑跳转
const handleReturn = () => {
  uni.navigateBack(-1)
}

const selectedRole = ref(null)

// 处理选择医护人员身份
const handleDoctorSelected = (role) => {
  selectedRole.value = role
}

// 微信一键登录
const code = ref('')

onLoad(async () => {
		const res = await wx.login()
		code.value = res.code
})

//微信一键登录
const loginWithWeChat = () => {
  if (!isAgreed.value) {
    uni.showToast({
      title: '请先同意用户服务协议和隐私协议',
      icon: 'none'
    })
    return
  }

  console.log('微信登录代码:', code.value);
  
  
    uni.request({
      url: 'https://jobguard.online/api/auth/wx-login',
      data: {
        jsCode: code.value
      },
      method: 'POST',
      success: (res) => {
      console.log('微信登录返回数据:', res.data);
      if (res.data.message == "success") {
        uni.showToast({
          title: '正在登录',
          icon: 'success',
          duration: 500,
        })
        setTimeout(() => {
          uni.setStorage({
            key: 'userIdentity',
            data: {
              "Identity": '游客',
              "token": res.data.data.token
            },
            success: () => {
              console.log('存储用户身份信息成功')
            }
          })
          //存储用户身份信息
          memberStore.setProfile(res.data.data)
          //返回上一页
          handleReturn()
        }, 500)
      } else {
        uni.showToast({
          title: res.data.message || '登录失败',
          icon: 'none'
        })
      }
    },
    fail: (err) => {
      uni.showToast({
        title: '网络错误，请稍后重试',
        icon: 'none'
      })
    }
    })
}

//医护人员及管理员账号密码登录
const account = ref('')
const password = ref('')

const loginWithAccount = () => {
  //选择身份不能为空
  if (!selectedRole.value) {
    uni.showToast({
      title: '请选择身份',
      icon: 'none'
    })
    return
  }

  //检验是否同意协议
  if (!isAgreed.value) {
    uni.showToast({
      title: '请先同意用户服务协议和隐私协议',
      icon: 'none'
    })
    return
  }

  //检验账号和密码是否为空
  if (!account.value || !password.value) {
    uni.showToast({
      title: '账号和密码不能为空',
      icon: 'none'
    })
    return
  }

  //发送请求
  uni.request({
    url: 'https://jobguard.online/api/auth/login',
    method: 'POST',
    header: {
      'Content-Type': 'application/json'
    },
    data: {
      phone: account.value,
      password: password.value,
      role: identity[selectedRole.value],
      isAgreed: true 
    },
    success: (res) => {
      if (res.data.message == "success") {
        uni.showToast({
          title: '正在登录',
          icon: 'success',
          duration: 500,
        })
        setTimeout(() => {
          uni.setStorage({
            key: 'userIdentity',
            data: {
              "Identity": selectedRole.value,
              "token": res.data.data.token
            },
            success: () => {
              console.log('存储用户身份信息成功')
            }
          })
          //存储用户身份信息
          memberStore.setProfile(res.data.data)
          //返回上一页
          handleReturn()
        }, 500)
      } else {
        uni.showToast({
          title: res.data.message || '账号或密码错误',
          icon: 'none'
        })
      }
    },
    fail: (err) => {
      uni.showToast({
        title: '网络错误，请稍后重试',
        icon: 'none'
      })
    }
  })
}

//切换密码可见性
const passwordVisible = ref(false)
const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value
}
</script>

<template>
    <view class="container">
        <image
            @tap="handleReturn"
            class="return"
            src="../../static/images/返回.png"
            mode="scaleToFill"
        />

        <!-- 普通用户登录 -->
        <view class="loginBox">
            <!-- 微信和手机一键登录 -->
            <view :animation="animationData">
                <template v-if="!isDoctor">
                    <view class="login-title">请选择登录方式</view>
                    <view class="login-method">
                        <button class="login-button weChat" @tap="loginWithWeChat">微信一键登录</button>
                        <button class="login-button phone" @tap="loginWithPhone">手机号安全登录</button>
                    </view>
                    <view class="loginIcon">
                        <image
                        class="loginBg"
                        src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/登录图.png"
                        mode="scaleToFill"
                    />
                    </view>
                </template>
                <!-- 医护人员及管理员选择身份账号密码登录 -->
                <template v-else>
                <view>
                        <view class="inputBox">
                            <text>身份/identity</text>
                            <view class="identitySelect">
                                <view class="identityBox" :class="{ selected: selectedRole === '研究所专家' }" @tap="handleDoctorSelected('研究所专家')">
                                    <image
                                        class="identityIcon"
                                            :src="selectedRole === '研究所专家' ? 'https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/医生-白.png' : 'https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/医生-红.png'"
                                        mode="scaleToFill"
                                    />
                                    <text>医生</text>
                                </view>
                                <view class="identityBox" :class="{ selected: selectedRole === '兼职护士' }" @tap="handleDoctorSelected('兼职护士')">
                                    <image
                                        class="identityIcon"
                                            :src="selectedRole === '兼职护士' ? 'https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/医生-白.png' : 'https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/医生-红.png'"
                                        mode="scaleToFill"
                                    />
                                    <text>护士</text>
                                </view>
                                <view class="identityBox" :class="{ selected: selectedRole === '管理员' }"
                                @tap="handleDoctorSelected('管理员')">
                                    <image
                                        class="identityIcon"
                                            :src="selectedRole === '管理员' ? 'https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/管理员-白.png' : 'https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/管理员-红.png'"
                                        mode="scaleToFill"
                                    />
                                    <text>管理员</text>
                                </view>
                            </view>
                        </view>
                        <view class="inputBox">
                            <text>账号/Account</text>
                            <input v-model="account" type="text" placeholder="请输入账号" class="login-input" />
                        </view>
                        <view class="inputBox">
                            <text>密码/Password</text>
                            <input v-model="password" :password="!passwordVisible" placeholder="请输入密码" class="login-input" />
                            <view class="toggle-password" @tap="togglePasswordVisibility">
                            <image :src="passwordVisible ? 'https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/eye-close.jpg' : 'https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/eye-open.jpg'" 
                                  class="password-icon"/>
                          </view>
                        </view>
                </view>
                <view class="loginButton">
                        <view class="loginButtonBox" @tap="loginWithAccount">
                            <image
                                class="loginImage"
                                src="../../static/images/右箭头.png"
                                mode="scaleToFill"
                            />
                            <text>登录</text>
                        </view>
                    </view>
                <view class="forgetPassword"><text>忘记密码?</text></view>
                </template>
            </view>
        </view>

        <!-- 底部勾选同意协议 -->
        <view class="agreement">
          <checkbox class="checkbox" @tap="onAgreementChange"/>
          <text>我已阅读并同意</text>
          <text class="protocol-link" @tap="navigateToUserService">《用户服务协议》</text>
          <text>和</text>
          <text class="protocol-link" @tap="navigateToPrivacyPolicy">《隐私协议》</text>
        </view>
        <!-- 切换登录方式 -->
        <view class="switchLogin" @tap="toggleLogin">
            <text>{{ !isDoctor ? '医护人员及管理员登录' : '返回微信一键登录' }}</text>
        </view>
    </view>
</template>
<<<<<<< HEAD
<style>
page{
    background-image: url('https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/background.png');
    background-size: 100% 100%;
    display: flex;
    justify-content: center;
    padding-top: 200rpx;
}

/* 对容器进行设置 */
.container{
    width: 100%;
    padding: 10rpx 50rpx;
}

.return{
    width: 50rpx;
    height: 50rpx;
    margin-left: 20rpx;
    margin-bottom: 20rpx;
}

/* 普通用户登录 */
.loginBox{
    background-color: #fdf4f5;
    border-radius: 20rpx;
    padding: 30rpx;
    margin-bottom: 20rpx;
    /* height: 800rpx; */
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
}

.login-title{
    font-size: 36rpx;
    font-weight: bold;
    margin-bottom: 20rpx;
}

/* 登录模块设置 */
.login-method{
    margin: 71rpx 0;
}

.login-button{
    color: white;
    border-radius: 10rpx;
    text-align: center;
    font-size: 28rpx;
    margin-bottom: 30rpx;
    width: 70%;
}

.weChat{
    background-color: #3ac13c;
}

.phone{
    background-color: #2d6df9;
}

.loginIcon{
    display: flex;
    justify-content: center;
    align-self: center;
    width: 100%;
}

.loginBg{
    width: 70%;
    margin-bottom: -30rpx;
}

/* 协议设置 */
.agreement {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 30px;
  font-size: 24rpx;
  color: #666;
}

.protocol-link {
  color: #003399;
}
  
.checkbox {
  transform: scale(0.6);
}

/* 添加下划线 */
.switchLogin {
    text-decoration: underline;
    color: white;
    font-size: 28rpx;
    text-align: center;
    cursor: pointer;
}

/* 身份选择 */
.identitySelect{
    display: flex;
    justify-content: space-between;
    margin-top: 20rpx;
}

/* 统一盒子 */
.inputBox{
    margin-bottom: 30rpx;
    position: relative;
}

/* 切换密码 */
.toggle-password{
    position: absolute;
    right: 50rpx;
    bottom: 20rpx;
    z-index: 999;
}

.password-icon{
    width: 40rpx;
    height: 40rpx;
}

.identityBox{
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10rpx;
    background-color: #fff;
    border-radius: 10rpx;
}

.identityIcon{
    width: 70rpx;
    height: 70rpx;
    margin-right: 10rpx;
}

.login-input{
    margin-top: 20rpx;
    height: 80rpx;
    border-radius: 10rpx;
    padding: 10rpx 20rpx;
    background-color: #fff;
    border: none;
    font-size: 28rpx;
    color: #333;
}

/* 选中状态的样式 */
.selected {
  background-color: #f57371;
  color: white;
}

.identityIcon.selected {
  filter: invert(100%);
}

.loginButton{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 50rpx;
}

.loginButtonBox{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100rpx;
    height: 100rpx;
    background-color: #f36d6a;
    border-radius: 50%;
    padding: 20rpx;
    font-size: 24rpx;
    color:#fff;
    margin-bottom: 50rpx;
}

.loginImage{
    width: 70%;
    height: 70%;
}

.forgetPassword{
    display: flex;
    justify-content: center;
    color: #666;
    font-size: 24rpx;
}
=======

<script  setup>
import { ref } from 'vue'

// 响应式数据
const identityOptions = ref(['游客','兼职护士', '献血者', '管理员', '研究所专家'])
const identityDict = ref({
  '兼职护士': 'NURSE',
  '献血者': 'DONOR',
  '管理员': 'ADMIN',
  '研究所专家': 'EXPERT'
})
const selectedIdentity = ref('兼职护士')
const selectedIdentityIndex = ref(0)
const phoneNumber = ref('')
const password = ref('')
const isAgreed = ref(false)
const showIdentityDropdown = ref(false)
const passwordVisible = ref(false)
const dropdownStyle = ref('')

// 方法定义
const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value
}

const toggleIdentityDropdown = (e) => {
  if (showIdentityDropdown.value) {
    showIdentityDropdown.value = false
    return
  }

  const query = uni.createSelectorQuery()
  query.select('.picker-selected').boundingClientRect()
  query.exec((res) => {
    if (res && res[0]) {
      const rect = res[0]
      showIdentityDropdown.value = true
      dropdownStyle.value = `top:${rect.bottom}px; left:${rect.left}px; width:${rect.width}px;`
    } else {
      showIdentityDropdown.value = true
    }
  })
}

const selectIdentity = (e) => {
  const index = e.currentTarget.dataset.index
  selectedIdentity.value = identityOptions.value[index]
  showIdentityDropdown.value = false
}

const onTapPage = () => {
  if (showIdentityDropdown.value) {
    showIdentityDropdown.value = false
  }
}

const onPhoneNumberInput = (e) => {
  phoneNumber.value = e.detail.value
}

const onPasswordInput = (e) => {
  password.value = e.detail.value
}

const onAgreementChange = (e) => {
  isAgreed.value = !isAgreed.value
}

const navigateToUserService = () => {
  uni.navigateTo({
    url: '/pages/user-service/user-service'
  })
}

const navigateToPrivacyPolicy = () => {
  uni.navigateTo({
    url: '/pages/privacy-policy/privacy-policy'
  })
}

const navigateToRegister = () => {
  uni.redirectTo({
    url: '/pages/register/register'
  })
}

const onLoginTap = () => {
  if (!isAgreed.value) {
    uni.showToast({
      title: '请先同意用户服务协议和隐私协议',
      icon: 'none'
    })
    return
  }
  
  if (!phoneNumber.value || !password.value) {
    uni.showToast({
      title: '手机号或密码不能为空',
      icon: 'none'
    })
    return
  }
  
  uni.request({
    url: 'https://jobguard.online/api/auth/login',
    method: 'POST',
    header: {
      'Content-Type': 'application/json'
    },
    data: {
      phone: phoneNumber.value,
      password: password.value,
      role: identityDict.value[selectedIdentity.value],
      isAgreed: isAgreed.value 
    },
    success: (res) => {
      if (res.data.message == "success") {
        uni.showToast({
          title: '正在登录',
          icon: 'success',
          duration: 500,
        })
        setTimeout(() => {
          uni.setStorage({
            key: 'userIdentity',
            data: {
              "Identity": selectedIdentity.value,
              "token": res.data.data.token
            },
            success: () => {
              console.log('存储用户身份信息成功')
            }
          })
          uni.switchTab({
            url: '/pages/nurse/information/information'
          })
        }, 500)
      } else {
        uni.showToast({
          title: res.data.message || '账号或密码错误',
          icon: 'none'
        })
      }
    },
    fail: (err) => {
      uni.showToast({
        title: '网络错误，请稍后重试',
        icon: 'none'
      })
    }
  })
}
</script>

<style>
page {
    height: 100%;
    overflow: hidden;
  }
    
  .page-container {
    position: relative;
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
  }
  
  .page-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -2;
  }
    
  .content-area {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 40rpx; 
    box-sizing: border-box;
  }
    
  .platform-title {
    width: 100%;
    text-align: center;
    font-size: 18px;
    font-weight: bold;
    color: #333;
    padding: 20rpx 0;
    margin-bottom: 10rpx;
    z-index: 1;
  }
    
  .container {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 92%;
    height: 90%;
    background-color: white;
    border-radius: 20px;
    padding: 20rpx 0;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    z-index: 1;
  }
    
  .header {
    margin-top: 40px;
    width: 100%;
    text-align: center;
    margin-bottom: 30px;
  }
    
  .title-container {
    position: relative;
    display: inline-block;
    text-align: center;
    margin-bottom: 20px;
  }
    
  .title-bg {
    width: 100%;
    height: 250rpx;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 0;
  }
    
  .title {
    position: relative;
    color: #333;
    font-size: 22px;
    white-space: nowrap;
    z-index: 1;
    padding: 0 20rpx;
  }
    
  .form {
    position: relative;
    width: 80%;
    margin-bottom: 20px;
  }
    
  .input-container {
    display: flex;
    border: 1px solid #ff6f61;
    height: 80rpx;
    border-radius: 30px;
    margin-bottom: 25px;
    overflow: hidden;
  }
  
  .toggle-password {
    width: 70rpx;
    height: 80rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10rpx;
  }
  
  .password-icon {
    width: 35rpx;
    height: 35rpx;
  }
   
  .custom-picker {
    position: relative;
    flex: 1;
    height: 100%;
  }
    
  .picker-selected {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    font-size: 28rpx;
  }
    
  .dropdown-arrow {
    color: #999;
    font-size: 24rpx;
    transition: transform 0.3s;
  }
    
  .dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background-color: white;
    border: 1px solid #ddd;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    z-index: 999;
    max-height: 300rpx;
    overflow-y: auto;
  }
    
  .dropdown-item {
    padding: 10px;
    border-bottom: 1px solid #eee;
    transition: background-color 0.2s ease;
    font-size: 28rpx;
  }
    
  .dropdown-item:last-child {
    border-bottom: none;
  }
    
  .dropdown-item-hover {
    background-color: #f5f5f5;
  }
    
  .input-label {
    color: #fff;
    padding: 10px 15px;
    width: 100rpx;
    text-align: center;
    background-color: #ff6f61;
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    font-weight: 600;
    font-size: 28rpx;
  }
    
  .input-field {
    flex: 1;
    padding: 10px;
    border: none;
    font-size: 28rpx;
  }
    
  .agreement {
    display: flex;
    align-items: center;
    margin-top: 10px;
    margin-bottom: 30px;
    font-size: 24rpx;
    color: #666;
  }
    
  .protocol-link {
    color: #003399;
  }
    
  .checkbox {
    transform: scale(0.8);
    margin-right: 6rpx;
  }
    
  .login-btn {
    margin-bottom: 30px;
    text-align: center;
  }
    
  .bt { 
    margin: 0 auto;
    width: 240rpx;
    height: 80rpx;
    line-height: 80rpx;
    border-radius: 40rpx;
    background-color: #ff6f61;
    color: white;
    font-size: 32rpx;
  }
    
  .footer {
    margin-top: 10px;
  }
    
  .link {
    font-size: 26rpx;
    color: #007aff;
  }
>>>>>>> 48233f6d8a4fd65c2989f46576947d9a61d95ebf
</style>