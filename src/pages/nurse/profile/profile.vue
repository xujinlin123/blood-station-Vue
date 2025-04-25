<script setup>
import { ref, onMounted } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
//引入仓库
import { useMemberStore } from '@/stores'
const memberStore = useMemberStore()

// 响应式数据
const identitySelected = ref('')
const userName = ref('')
const userId = ref('')
const userAvatar = ref('')
const showNameDialog = ref(false)
const newName = ref("")
const userPhoto = ref("https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/头像女孩.png")
const hospital = ref('广东省中医院')
const department = ref('检验科')
const userID = ref('440xxxxxxxxxxxxxxx')
const userGender = ref('女')
const userCertNo = ref('xxxx')
const isPageReady = ref(false)
const userYear = ref('2024')
const userBlood = ref('Rh阴性')
const Token = ref('')

// 提取公共加载方法
const loadUserData = () => {
  if (memberStore.getProfile()) {
    console.log("获取到用户信息")
    uni.getStorage({
      key: 'userIdentity',
      success: (res) => {
        identitySelected.value = res.data.Identity
        Token.value = res.data.token   
        // 数据回显
        userName.value = memberStore.getProfile().name
        userId.value = memberStore.getProfile().id
        userAvatar.value = memberStore.getProfile().avatar
      },
      fail: () => {
        identitySelected.value = '未登录'
      }
    })
  } else {
    identitySelected.value = '未登录'
  }
}

onLoad(() => {
  loadUserData() // 首次加载
})

onShow(() => {
  loadUserData() // 每次页面显示时重新加载
})

// // 加载用户数据
// const loadUserData = () => {
//   const userInfo = uni.getStorageSync('userInfo')
//   if (userInfo) {
//     userName.value = userInfo.name || userName.value
//     userId.value = userInfo.id || userId.value
//     userRole.value = userInfo.role || userRole.value
//     userAvatar.value = userInfo.avatar || userAvatar.value
//   }
// }

// 显示姓名编辑对话框
const showNameEditDialog = () => {
  showNameDialog.value = true
  newName.value = userName.value
}

// 隐藏姓名编辑对话框
const hideNameEditDialog = () => {
  showNameDialog.value = false
}

// 处理姓名输入变化
const onNameInput = (e) => {
  newName.value = e.detail.value
}

// 确认修改姓名
const confirmNameChange = () => {
  if (newName.value.trim()) {
    let userInfo = uni.getStorageSync('userInfo') || {}
    userInfo.name = newName.value
    uni.setStorageSync('userInfo', userInfo)
    
    console.log("token:" + Token.value)
    uni.request({
      url: 'https://jobguard.online/api/auth/modify-name',
      method: 'POST',
      header: {
        'Authorization': Token.value,
        'Content-Type': 'application/json'
      },
      data: {
        name: newName.value
      },
      success: (res) => {
        console.log('后端返回:', res.data)
        if (res.data.message == "success") {
          uni.showToast({
            title: '名字修改成功',
            icon: 'success'
          })
          userName.value = newName.value
          showNameDialog.value = false
        } else {
          uni.showToast({
            title: res.data.message || '名字修改错误',
            icon: 'none'
          })
        }
      },
      fail: (err) => {
        console.error('请求失败:', err)
        uni.showToast({
          title: '网络错误，请稍后重试',
          icon: 'none'
        })
      }
    })
  } else {
    uni.showToast({
      title: '名字不能为空',
      icon: 'error'
    })
  }
}

// 导航方法
const navigateToManageDonors = () => {
  uni.navigateTo({
    url: '/pages/manageDonors/manageDonors'
  })
}

const navigateToReviewApplications = () => {
  uni.navigateTo({
    url: '/pages/reviewApplications/reviewApplications'
  })
}

const navigateToBlacklist = () => {
  uni.navigateTo({
    url: '/pages/blacklist/blacklist'
  })
}

const navigateToNurseCert = () => {
  uni.navigateTo({
    url: '/pages/nurseCert/nurseCert'
  })
}

const navigateToDonorCert = () => {
  uni.navigateTo({
    url: '/pages/donorCert/donorCert'
  })
}

const navigateToDonationRecords = () => {
  uni.navigateTo({
    url: '/pages/donationRecords/donationRecords'
  })
}

const navigateToMessages = () => {
  uni.navigateTo({
    url: '/pages/messages/messages'
  })
}

const navigateToFeedback = () => {
  uni.navigateTo({
    url: '/pages/feedback/feedback'
  })
}

// 退出登录
const logout = () => {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        uni.removeStorageSync('userInfo')
        uni.removeStorageSync('token')
        memberStore.clearProfile()
        console.log('用户已退出登录');
        identitySelected.value = '未登录'
      }
    }
  })
}

// 检查更新
const checkUpdate = () => {
  uni.showLoading({
    title: '检查更新中...'
  })
  setTimeout(() => {
    uni.hideLoading()
    uni.showModal({
      title: '版本更新',
      content: '当前已是最新版本 v1.0.5',
      showCancel: false
    })
  }, 1500)
}

// 开始更新
const startUpdate = () => {
  uni.showLoading({
    title: '更新中...'
  })
  setTimeout(() => {
    uni.hideLoading()
    uni.showToast({
      title: '更新成功',
      icon: 'success'
    })
  }, 2000)
}

// 阻止事件冒泡
const preventBubble = () => {
  return
}

//去登录
const goLogin = () => {
  uni.navigateTo({
    url: '/pages/login/login'
  })
}
</script>

<template>
  <!-- 游客页面 -->
  <view class="page-container" v-if="identitySelected === '游客'">
    <image src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/background.png" class="page-background" mode="aspectFill"></image>
    <view class="content-area">
      <view class="platform-title">献血 e 站</view>
      <!-- 用户信息 -->
      <view class="user-info-card">
        <image src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/我的背景3.png" class="user-card-bg" mode="aspectFill"></image>
        <view class="user-info-content">
          <view class="avatar-container">
            <image :src="userAvatar || 'https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/default-avatar.png'" class="avatar" mode="aspectFill"></image>
            <view class="verifyingIdentity"><text>认证稀有血型者</text></view>
          </view>
          <view class="user-details">
            <view class="user-name-container">
              <text class="user-name">{{ userName || '用户名' }}</text>
              <image src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/修改昵称.png" class="edit-icon" @click="showNameEditDialog"></image>
            </view>
            <text class="user-id">用户ID: {{ userId || '123456' }}</text>
            <text class="user-role">登录身份:{{ identitySelected }}</text>
          </view>
        </view>
      </view>
  
      <!-- 其他信息 -->
      <view class="other-info-card">
        <view class="info-item" @click="navigateToMessages">
          <text class="item-text">消息管理</text>
          <image class="arrow-icon" src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/进入.png" mode="widthFix"/>
        </view>
        <view class="info-item" @click="navigateToFeedback">
          <text class="item-text">用户意见反馈</text>
          <image class="arrow-icon" src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/进入.png" mode="widthFix"/>
        </view>
        <view class="info-item" @tap="logout">
          <text class="item-text">退出登录</text>
          <image class="arrow-icon" src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/进入.png" mode="widthFix"/>
        </view>
        <view class="info-item" @click="checkUpdate">
          <text class="item-text">版本更新</text>
          <image class="arrow-icon" src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/进入.png" mode="widthFix"/>
        </view>
      </view>
    </view>
  
    <!-- 修改名称 -->
    <view class="dialog-mask" v-if="showNameDialog" @click="hideNameEditDialog">
      <view class="dialog-container" @tap.native.stop="preventBubble">
        <view class="dialog-header">
          <text class="dialog-title">请输入你的新名字</text>
          <image src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/关闭.png" class="close-icon" @click="hideNameEditDialog"></image>
        </view>
        <input class="name-input" :value="newName" @input="onNameInput" placeholder="请输入新名字"/>
        <button class="confirm-btn" @click="confirmNameChange">确定</button>
      </view>
    </view>
  </view>

  <!-- 献血者页面 -->
  <view class="page-container" v-if="identitySelected === '献血者'">
    <image src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/background.png" class="page-background" mode="aspectFill"></image>
    <view class="content-area">
      <view class="platform-title">献血 e 站</view>
      <!-- 用户信息 -->
      <view class="user-info-card">
        <image src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/我的背景3.png" class="user-card-bg" mode="aspectFill"></image>
        <view class="user-info-content">
          <view class="avatar-container">
            <image :src="userAvatar || 'https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/default-avatar.png'" class="avatar" mode="aspectFill"></image>
          </view>
          <view class="user-details">
            <view class="user-name-container">
              <text class="user-name">{{ userName || '用户名' }}</text>
              <image src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/修改昵称.png" class="edit-icon" @click="showNameEditDialog"></image>
            </view>
            <text class="user-id">用户ID: {{ userId || '123456' }}</text>
            <text class="user-role">登录身份:{{ identitySelected }}</text>
          </view>
        </view>
      </view>
  
      <!-- 个人中心-->
      <view class="management-card">
        <view class="section-title">广州市无偿献血证</view>
        <view class="management-icons">
          <view class="user-photo-container">
            <image :src="userPhoto || 'https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/default-nurse.png'" class="user-photo" mode="aspectFill" />
          </view>
          <view class="user-details">
            <view class="icon-item">
              <text class="detail-label">姓名：</text>
              <text class="detail-value">{{ userName || '陈小云' }}</text>
            </view>
            <view class="icon-item">
              <text class="detail-label">性别：</text>
              <text class="detail-value">{{ userGender || '女' }}</text>
            </view>
            <view class="icon-item">
              <text class="detail-label">血型：</text>
              <text class="detail-value">{{ userBlood || 'Rh阴性' }}</text>
            </view>
            <view class="icon-item">
              <text class="detail-label">身份证号：</text>
              <text class="detail-value">{{ userID || '440xxxxxxxxxxxxxxx' }}</text>
            </view>
            <view class="icon-item">
              <text class="detail-label">发卡年份：</text>
              <text class="detail-value">{{ userYear || '2024' }}</text>
            </view>
          </view>
        </view>
      </view>
  
      <!-- 其他信息 -->
      <view class="other-info-card">
        <view class="info-item" @click="navigateToDonationRecords">
          <text class="item-text">我的献血记录</text>
          <image class="arrow-icon" src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/进入.png" mode="widthFix"/>
        </view>
        <view class="info-item" @click="navigateToDonationRecords">
          <text class="item-text">每月健康问卷</text>
          <image class="arrow-icon" src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/进入.png" mode="widthFix"/>
        </view>
        <view class="info-item" @click="navigateToMessages">
          <text class="item-text">消息管理</text>
          <image class="arrow-icon" src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/进入.png" mode="widthFix"/>
        </view>
        <view class="info-item" @click="navigateToFeedback">
          <text class="item-text">用户意见反馈</text>
          <image class="arrow-icon" src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/进入.png" mode="widthFix"/>
        </view>
        <view class="info-item" @tap="logout">
          <text class="item-text">退出登录</text>
          <image class="arrow-icon" src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/进入.png" mode="widthFix"/>
        </view>
        <view class="info-item" @click="checkUpdate">
          <text class="item-text">版本更新</text>
          <image class="arrow-icon" src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/进入.png" mode="widthFix"/>
        </view>
      </view>
    </view>
  
    <!-- 修改名称 -->
    <view class="dialog-mask" v-if="showNameDialog" @click="hideNameEditDialog">
      <view class="dialog-container" @tap.native.stop="preventBubble">
        <view class="dialog-header">
          <text class="dialog-title">请输入你的新名字</text>
          <image src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/关闭.png" class="close-icon" @click="hideNameEditDialog"></image>
        </view>
        <input class="name-input" :value="newName" @input="onNameInput" placeholder="请输入新名字"/>
        <button class="confirm-btn" @click="confirmNameChange">确定</button>
      </view>
    </view>
  </view>

  <!-- 兼职护士页面 -->
  <view class="page-container" v-if="identitySelected === '兼职护士'">
    <image src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/background.png" class="page-background" mode="aspectFill"></image>
    <view class="content-area">
      <view class="platform-title">献血 e 站</view>
      <!-- 第一部分个人信息 -->
      <view class="user-info-card">
        <image src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/我的背景3.png" class="user-card-bg" mode="aspectFill"></image>
        <view class="user-info-content">
          <view class="avatar-container">
            <image :src="userAvatar || 'https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/default-avatar.png'" class="avatar" mode="aspectFill"></image>
          </view>
          <view class="user-details">
            <view class="user-name-container">
              <text class="user-name">{{ userName || '用户名' }}</text>
              <image src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/修改昵称.png" class="edit-icon" @click="showNameEditDialog"></image>
            </view>
            <text class="user-id">用户ID: {{ userId || '123456' }}</text>
            <text class="user-role">登录身份:{{ identitySelected }}</text>
          </view>
        </view>
      </view>
  
      <!-- 第二部分用户管理业务 -->
      <view class="management-card">
        <view class="section-title">护士证</view>
        <view class="management-icons">
          <view class="user-photo-container">
            <image :src="userPhoto || 'https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/default-nurse.png'" class="user-photo" mode="aspectFill" />
          </view>
          <view class="user-details">
            <view class="icon-item">
              <text class="detail-label">姓名：</text>
              <text class="detail-value">{{ userName || '陈小云' }}</text>
            </view>
            <view class="icon-item">
              <text class="detail-label">性别：</text>
              <text class="detail-value">{{ userGender || '女' }}</text>
            </view>
            <view class="icon-item">
              <text class="detail-label">身份证号：</text>
              <text class="detail-value">{{ userID || '440xxxxxxxxxxxxxxx' }}</text>
            </view>
            <view class="icon-item">
              <text class="detail-label">护士证编号：</text>
              <text class="detail-value">{{ userCertNo || 'xxxx' }}</text>
            </view>
            <view class="icon-item">
              <text class="detail-label">所属医院：</text>
              <text class="detail-value">{{ hospital || '广东省中医院' }}</text>
            </view>
            <view class="icon-item">
              <text class="detail-label">所属科室：</text>
              <text class="detail-value">{{ department || '检验科' }}</text>
            </view>
          </view>
        </view>
      </view>
  
      <!-- 第三部分其他信息 -->
      <view class="other-info-card">
        <view class="info-item" @click="navigateToMessages">
          <text class="item-text">消息管理</text>
          <image class="arrow-icon" src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/进入.png" mode="widthFix"/>
        </view>
        <view class="info-item" @click="navigateToFeedback">
          <text class="item-text">用户意见反馈</text>
          <image class="arrow-icon" src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/进入.png" mode="widthFix"/>
        </view>
        <view class="info-item" @tap="logout">
          <text class="item-text">退出登录</text>
          <image class="arrow-icon" src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/进入.png" mode="widthFix"/>
        </view>
        <view class="info-item" @click="checkUpdate">
          <text class="item-text">版本更新</text>
          <image class="arrow-icon" src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/进入.png" mode="widthFix"/>
        </view>
      </view>
    </view>
  
    <!-- 用户名字编辑框 -->
    <view class="dialog-mask" v-if="showNameDialog">
      <view class="dialog-container" @tap.native.stop="preventBubble">
        <view class="dialog-header">
          <text class="dialog-title">请输入你的新名字</text>
          <image src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/关闭.png" class="close-icon" @click="hideNameEditDialog"></image>
        </view>
        <input class="name-input" :value="newName" @input="onNameInput" placeholder="请输入新名字"/>
        <button class="confirm-btn" @click="confirmNameChange">确定</button>
      </view>
    </view>
  </view>
  
  <!-- 管理员页面 -->
  <view class="page-container" v-if="identitySelected === '管理员'">
    <image src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/background.png" class="page-background" mode="aspectFill"></image>
    <view class="content-area">
      <view class="platform-title">献血 e 站</view>
      <!-- 用户信息 -->
      <view class="user-info-card">
        <image src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/我的背景3.png" class="user-card-bg" mode="aspectFill"></image>
        <view class="user-info-content">
          <view class="avatar-container">
            <image :src="userAvatar || 'https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/default-avatar.png'" class="avatar" mode="aspectFill"></image>
          </view>
          <view class="user-details">
            <view class="user-name-container">
              <text class="user-name">{{ userName || '用户名' }}</text>
              <image src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/修改昵称.png" class="edit-icon" @click="showNameEditDialog"></image>
            </view>
            <text class="user-id">ID: {{ userId || '123456' }}</text>
            <text class="user-role">身份:{{ identitySelected }}</text>
          </view>
        </view>
      </view>
  
      <!-- 其他信息 -->
      <view class="other-info-card">
        <view class="info-item" @click="navigateToMessages">
          <text class="item-text">消息管理</text>
          <image class="arrow-icon" src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/进入.png" mode="widthFix"/>
        </view>
        <view class="info-item" @click="navigateToFeedback">
          <text class="item-text">用户意见反馈</text>
          <image class="arrow-icon" src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/进入.png" mode="widthFix"/>
        </view>
        <view class="info-item" @tap="logout">
          <text class="item-text">退出登录</text>
          <image class="arrow-icon" src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/进入.png" mode="widthFix"/>
        </view>
        <view class="info-item" @click="checkUpdate">
          <text class="item-text">版本更新</text>
          <image class="arrow-icon" src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/进入.png" mode="widthFix"/>
        </view>
      </view>
    </view>
  
    <!-- 修改名称 -->
    <view class="dialog-mask" v-if="showNameDialog" @click="hideNameEditDialog">
      <view class="dialog-container" @tap.native.stop="preventBubble">
        <view class="dialog-header">
          <text class="dialog-title">请输入你的新名字</text>
          <image src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/关闭.png" class="close-icon" @click="hideNameEditDialog"></image>
        </view>
        <input class="name-input" :value="newName" @input="onNameInput" placeholder="请输入新名字"/>
        <button class="confirm-btn" @click="confirmNameChange">确定</button>
      </view>
    </view>
  </view>
  
  <!-- 研究所专家页面 -->
  <view class="page-container" v-if="identitySelected === '研究所专家'">
    <image src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/background.png" class="page-background" mode="aspectFill"></image>
    <view class="content-area">
      <view class="platform-title">献血 e 站</view>
      <!-- 用户信息 -->
      <view class="user-info-card">
        <image src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/我的背景3.png" class="user-card-bg" mode="aspectFill"></image>
        <view class="user-info-content">
          <view class="avatar-container">
            <image :src="userAvatar || 'https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/default-avatar.png'" class="avatar" mode="aspectFill"></image>
          </view>
          <view class="user-details">
            <view class="user-name-container">
              <text class="user-name">{{ userName || '用户名' }}</text>
              <image src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/修改昵称.png" class="edit-icon" @click="showNameEditDialog"></image>
            </view>
            <text class="user-id">用户ID: {{ userId || '123456' }}</text>
            <text class="user-role">登录身份:{{ identitySelected }}</text>
          </view>
        </view>
      </view>
  
      <!-- 个人中心-->
      <view class="management-card">
        <view class="section-title">医师证</view>
        <view class="management-icons">
          <view class="user-photo-container">
            <image :src="userPhoto || 'https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/default-nurse.png'" class="user-photo" mode="aspectFill" />
          </view>
          <view class="user-details">
            <view class="icon-item">
              <text class="detail-label">姓名：</text>
              <text class="detail-value">{{ userName || '陈小云' }}</text>
            </view>
            <view class="icon-item">
              <text class="detail-label">性别：</text>
              <text class="detail-value">{{ userGender || '女' }}</text>
            </view>
            <view class="icon-item">
              <text class="detail-label">身份证号：</text>
              <text class="detail-value">{{ userID || '440xxxxxxxxxxxxxxx' }}</text>
            </view>
            <view class="icon-item">
              <text class="detail-label">医师证编号：</text>
              <text class="detail-value">{{ userCertNo || 'xxxx' }}</text>
            </view>
            <view class="icon-item">
              <text class="detail-label">所属单位：</text>
              <text class="detail-value">{{ hospital || '广东省中医院' }}</text>
            </view>
            <view class="icon-item">
              <text class="detail-label">所属科室：</text>
              <text class="detail-value">{{ department || '检验科' }}</text>
            </view>
          </view>
        </view>
      </view>
  
      <!-- 其他信息 -->
      <view class="other-info-card">
        <view class="info-item" @click="navigateToMessages">
          <text class="item-text">消息管理</text>
          <image class="arrow-icon" src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/进入.png" mode="widthFix"/>
        </view>
        <view class="info-item" @click="navigateToFeedback">
          <text class="item-text">用户意见反馈</text>
          <image class="arrow-icon" src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/进入.png" mode="widthFix"/>
        </view>
        <view class="info-item" @tap="logout">
          <text class="item-text">退出登录</text>
          <image class="arrow-icon" src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/进入.png" mode="widthFix"/>
        </view>
        <view class="info-item" @click="checkUpdate">
          <text class="item-text">版本更新</text>
          <image class="arrow-icon" src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/进入.png" mode="widthFix"/>
        </view>
      </view>
    </view>
  
    <!-- 修改名称 -->
    <view class="dialog-mask" v-if="showNameDialog" @click="hideNameEditDialog">
      <view class="dialog-container" @tap.native.stop="preventBubble">
        <view class="dialog-header">
          <text class="dialog-title">请输入你的新名字</text>
          <image src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/关闭.png" class="close-icon" @click="hideNameEditDialog"></image>
        </view>
        <input class="name-input" :value="newName" @input="onNameInput" placeholder="请输入新名字"/>
        <button class="confirm-btn" @click="confirmNameChange">确定</button>
      </view>
    </view>
  </view>

    <!-- 未登录时候显示的页面 -->
    <view class="page-container" v-if="identitySelected === '未登录'">
    <image src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/background.png" class="page-background" mode="aspectFill"></image>
    <view class="content-area">
      <view class="platform-title">献血 e 站</view>
      <!-- 第一部分个人信息 -->
      <view class="user-info-card">
        <image src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/我的背景3.png" class="user-card-bg" mode="aspectFill"></image>
        <view class="user-info-content">
          <view class="avatar-container">
            <image src="../../../static/images/Default_avatar.png" class="avatar" mode="aspectFill"></image>
          </view>
          <view class="user-details">
            <view class="user-name-container" @tap="goLogin">
              <text class="user-name">点击登录</text>
            </view>
            <text class="user-id">用户ID: </text>
            <text class="user-role">登录身份:</text>
          </view>
        </view>
      </view>
  
      <!-- 第三部分其他信息 -->
      <view class="other-info-card">
        <view class="info-item" @tap="goLogin">
          <text class="item-text">消息管理</text>
          <image class="arrow-icon" src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/进入.png" mode="widthFix"/>
        </view>
        <view class="info-item" @tap="goLogin">
          <text class="item-text">用户意见反馈</text>
          <image class="arrow-icon" src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/进入.png" mode="widthFix"/>
        </view>
        <view class="info-item" @tap="checkUpdate">
          <text class="item-text">版本更新</text>
          <image class="arrow-icon" src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/进入.png" mode="widthFix"/>
        </view>
      </view>
    </view>
  
    <!-- 用户名字编辑框 -->
    <view class="dialog-mask" v-if="showNameDialog">
      <view class="dialog-container" @tap.native.stop="preventBubble">
        <view class="dialog-header">
          <text class="dialog-title">请输入你的新名字</text>
          <image src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/关闭.png" class="close-icon" @click="hideNameEditDialog"></image>
        </view>
        <input class="name-input" :value="newName" @input="onNameInput" placeholder="请输入新名字"/>
        <button class="confirm-btn" @click="confirmNameChange">确定</button>
      </view>
    </view>
  </view>
</template>

<style>
/* pages/nurse/profile/profile.wxss */
/* 页面基础样式 */
page {
  height: 100%; /* 高度为100%，占满整个可视区域 */
  overflow: hidden; /* 隐藏超出部分，防止出现滚动条 */
}

/* 容器样式 */
.page-container {
  position: relative; /* 相对定位，作为子元素的定位参考 */
  width: 100%; /* 宽度为100%，占满父元素 */
  height: 100vh; /* 高度为100vh，占满整个视口高度 */
  display: flex; /* 弹性布局 */
  align-items: center; /* 垂直居中对齐 */
}

/* 背景图片样式 */
.page-background {
  position: fixed; /* 固定定位，不随滚动而移动 */
  top: 0; /* 距离顶部0 */
  left: 0; /* 距离左侧0 */
  width: 100%; /* 宽度为100% */
  height: 100%; /* 高度为100% */
  z-index: -2; /* 堆叠顺序为-2，低于大多数元素 */
}

/* 内容区域样式 */
.content-area {
  width: 100%; /* 宽度为100% */
  height: 100%; /* 高度为100% */
  display: flex; /* 弹性布局 */
  flex-direction: column; /* 垂直排列 */
  align-items: center; /* 水平居中对齐 */
  padding-top: 90rpx; /* 顶部内边距为90rpx */
  padding-bottom: 40rpx; /* 底部内边距为40rpx */
  box-sizing: border-box; /* 边框盒模型，内边距计入总宽高 */
}

/* 平台标题样式 */
.platform-title {
  width: 100%; /* 宽度为100% */
  text-align: center; /* 文本居中对齐 */
  font-size: 18px; /* 字体大小为15px */
  font-weight: bold; /* 字体加粗 */
  color: #333; /* 字体颜色为深灰色 */
  padding: 20rpx 0; /* 上下内边距为20rpx，左右为0 */
  margin-bottom: 30rpx; /* 底部外边距为30rpx */
  z-index: 1; /* 堆叠顺序为1，确保在背景之上 */
}

/* 用户信息卡片样式 */
.user-info-card {
  width: 94%; /* 宽度为94%，留有边距 */
  height: 350rpx; 
  border-radius: 30rpx; /* 圆角为30rpx */
  position: relative; /* 相对定位，作为子元素的定位参考 */
  overflow: hidden; /* 隐藏超出部分 */
  margin-bottom: 30rpx; /* 底部外边距为30rpx */
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1); /* 添加阴影效果 */
}

/* 用户卡片背景样式 */
.user-card-bg {
  position: absolute; /* 绝对定位 */
  width: 100%; /* 宽度为100% */
  height: 100%; /* 高度为100% */
  z-index: -1; /* 堆叠顺序为-1，在内容之下 */
  object-fit: cover;
}

/* 用户信息内容样式 */
.user-info-content {
  display: flex; /* 弹性布局 */
  justify-content: center;
  align-items: center; /* 垂直居中对齐 */
  height: 100%; /* 高度为100% */
  padding: 0 30rpx; /* 左右内边距为30rpx */
}

/* 头像容器样式 */
.avatar-container {
  display: flex;
  justify-content: center; /* 水平居中对齐 */
  align-items: center; /* 垂直居中对齐 */
  flex-direction: column;
  margin-right: 30rpx; /* 右侧外边距为30rpx */
}

.verifyingIdentity{
  color: #fff;
  padding: 10rpx;
  background-color:#ff8475;
  margin-top: 30rpx;
  border-radius:14rpx;
  border : 2rpx solid #d3d3d3;
}

/* 头像图片样式 */
.avatar {
  width: 140rpx; /* 宽度为120rpx */
  height: 140rpx; /* 高度为120rpx */
  border-radius: 50%; /* 圆角为60rpx，形成圆形 */
  border: 4rpx solid #fff; /* 添加4rpx宽的白色边框 */
  overflow: hidden; /* 隐藏超出部分 */
}

/* 用户详细信息样式 */
.user-details {
  flex: 1; /* 占据剩余空间 */
  display: flex; /* 弹性布局 */
  flex-direction: column; /* 垂直排列 */
}

/* 用户名称容器样式 */
.user-name-container {
  display: flex; /* 弹性布局 */
  align-items: center; /* 垂直居中对齐 */
}

/* 用户名称样式 */
.user-name {
  font-size: 42rpx; /* 字体大小为34rpx */
  font-weight: bold; /* 字体加粗 */
  color: #333; /* 字体颜色为深灰色 */
  margin-right: 10rpx; /* 右侧外边距为10rpx */
}

/* 编辑图标样式 */
.edit-icon {
  width: 36rpx; /* 宽度为36rpx */
  height: 36rpx; /* 高度为36rpx */
  margin-left: 20rpx;
}

/* 用户ID样式 */
.user-id {
  font-size: 28rpx; /* 字体大小为24rpx */
  color: black;
  margin: 20rpx 0; /* 上下外边距为6rpx，左右为0 */
  letter-spacing: 5rpx;
  font-weight: 600;
  position: relative;
  top: 10rpx;
}

/* 用户角色样式 */
.user-role {
  font-size: 28rpx; /* 字体大小为24rpx */
  color: black;
  background-color: rgba(255, 255, 255, 0.6); /* 半透明白色背景 */
  padding: 10rpx 0rpx; /* 上下内边距为4rpx，左右为12rpx */
  border-radius: 20rpx; /* 圆角为20rpx */
  width: fit-content; /* 宽度适应内容 */
  letter-spacing: 5rpx;
  font-weight: 600;
  position: relative;
  top: 20rpx;
}

/* 管理信息卡片样式 */
.management-card {
  width: 86%; /* 宽度为86% */
  background-color: #fff; /* 背景色为白色 */
  border-radius: 20rpx; /* 圆角为20rpx */
  padding: 30rpx; /* 内边距为30rpx */
  margin-bottom: 30rpx; /* 底部外边距为30rpx */
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1); /* 添加阴影效果 */
}

/* 区块标题样式 */
.section-title {
  text-align: center; /* 文本居中对齐 */
  font-size: 30rpx; /* 字体大小为30rpx */
  font-weight: bold; /* 字体加粗 */
  color: #333; /* 字体颜色为深灰色 */
  margin-bottom: 15rpx; /* 底部外边距为30rpx */
  letter-spacing: 10rpx;
}

/* 管理图标区域样式 */
.management-icons {
  display: flex; /* 弹性布局 */
  flex-direction: row-reverse;
  justify-content: flex-end;
  align-items: flex-start;
  gap: 40rpx;
}

.user-photo-container {
width: 180rpx;
height: 260rpx;
overflow: hidden;
background: #f5f5f5;
box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.08); /* 添加阴影提升质感 */
flex-shrink: 0; /* 禁止收缩 */
margin-top: 30rpx;
}

.user-photo {
width: 100%;
height: 100%;
object-fit: cover;
}

.user-details {
flex: 1;
margin-left: 0;
margin-right: 30rpx;
}

.detail-label {
color: #666;
font-size: 28rpx;
min-width: 140rpx;
display: inline-block;
}

.detail-value {
color: #333;
font-size: 28rpx;
font-weight: 500;
}

.icon-item {
margin-bottom: 20rpx;
line-height: 1.1
}

/* 功能图标样式 */
.feature-icon {
  width: 100rpx; /* 宽度为90rpx */
  height: 100rpx; /* 高度为90rpx */
  margin-bottom: 10rpx; /* 底部外边距为10rpx */
}

/* 图标文本样式 */
.icon-text {
  font-size: 20rpx; /* 字体大小为20rpx */
  color: #333; /* 字体颜色为深灰色 */
  text-align: center; /* 文本居中对齐 */
  font-weight: 600;
}

/* 其他信息卡片样式 */
.other-info-card {
  width: 94%; /* 宽度为94% */
  /* background-color: #fff; */ /* 背景色被注释掉了 */
  border-radius: 20rpx; /* 圆角为20rpx */
  padding: 10rpx 0; /* 上下内边距为10rpx，左右为0 */
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1); /* 添加阴影效果 */
  flex: 1; /* 占据剩余空间 */
  overflow-y: auto; /* 垂直方向可滚动 */
}

/* 信息项样式 */
.info-item {
  display: flex; /* 弹性布局 */
  justify-content: space-between; /* 两端对齐 */
  align-items: center; /* 垂直居中对齐 */
  padding: 30rpx; /* 内边距为30rpx */
  border-bottom: 1rpx solid #aaa; /* 底部添加1rpx宽的灰色边框 */
}

/* 项目文本样式 */
.item-text {
  font-size: 28rpx; /* 字体大小为28rpx */
  color: #333; /* 字体颜色为深灰色 */
}

/* 箭头图标样式 */
.arrow-icon {
  width: 40rpx;
  height: 40rpx;
  color: #999; /* 字体颜色为浅灰色 */
}

/* 修改名称对话框遮罩样式 */
.dialog-mask {
  position: fixed; /* 固定定位 */
  top: 0; /* 距离顶部0 */
  left: 0; /* 距离左侧0 */
  right: 0; /* 距离右侧0 */
  bottom: 0; /* 距离底部0 */
  background-color: rgba(0, 0, 0, 0.5); /* 半透明黑色背景 */
  display: flex; /* 弹性布局 */
  justify-content: center; /* 水平居中对齐 */
  align-items: center; /* 垂直居中对齐 */
  z-index: 100; /* 堆叠顺序为100，确保在其他元素之上 */
}

/* 对话框容器样式 */
.dialog-container {
  width: 80%; /* 宽度为80% */
  background-color: #fff; /* 背景色为白色 */
  border-radius: 20rpx; /* 圆角为20rpx */
  padding: 30rpx; /* 内边距为30rpx */
}

/* 对话框头部样式 */
.dialog-header {
  display: flex; /* 弹性布局 */
  justify-content: space-between; /* 两端对齐 */
  align-items: center; /* 垂直居中对齐 */
  margin-bottom: 30rpx; /* 底部外边距为30rpx */
}

/* 对话框标题样式 */
.dialog-title {
  font-size: 30rpx; /* 字体大小为30rpx */
  font-weight: bold; /* 字体加粗 */
  color: #333; /* 字体颜色为深灰色 */
}

/* 关闭图标样式 */
.close-icon {
  width: 36rpx; /* 宽度为36rpx */
  height: 36rpx; /* 高度为36rpx */
}

/* 名称输入框样式 */
.name-input {
  width: 100%; /* 宽度为100% */
  height: 80rpx; /* 高度为80rpx */
  border: 1rpx solid #ddd; /* 添加1rpx宽的浅灰色边框 */
  border-radius: 10rpx; /* 圆角为10rpx */
  padding: 0 20rpx; /* 左右内边距为20rpx */
  margin-bottom: 30rpx; /* 底部外边距为30rpx */
}

/* 确认按钮样式 */
.confirm-btn {
  width: 100%; /* 宽度为100% */
  height: 80rpx; /* 高度为80rpx */
  background-color: #3366FF; /* 背景色为蓝色 */
  color: #fff; /* 字体颜色为白色 */
  border-radius: 10rpx; /* 圆角为10rpx */
  display: flex; /* 弹性布局 */
  justify-content: center; /* 水平居中对齐 */
  align-items: center; /* 垂直居中对齐 */
  font-size: 30rpx; /* 字体大小为30rpx */
}

</style>