<template>
    <!-- 兼职护士页面 -->
    <view class="page-container" :hidden="!isPageReady || identitySelected !== '兼职护士'">
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
          <view class="info-item" @click="logout">
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
    <view class="page-container" :hidden="!isPageReady || identitySelected !== '管理员'">
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
          <view class="info-item" @click="logout">
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
    <view class="page-container" :hidden="!isPageReady || identitySelected !== '研究所专家'">
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
          <view class="info-item" @click="logout">
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
    <view class="page-container" :hidden="!isPageReady || identitySelected !== '献血者'">
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
          <view class="info-item" @click="logout">
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
  </template>
  
  

  <script>
  export default {
    data() {
      return {
        identitySelected: "兼职护士",  // 存储用户选择的身份
        userName: "张医生",    // 默认用户名（张医生）
        userId: "MD12345",     // 默认用户ID
        userAvatar: "https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/头像女孩.png",  // 默认头像图片路径
        showNameDialog: false, // 控制修改姓名对话框的显示
        newName: "",           // 存储临时输入的新姓名
        userPhoto: "https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/头像女孩.png",
        hospital: '广东省中医院',
        department: '检验科',
        userID: '440xxxxxxxxxxxxxxx',
        userGender: '女',
        userCertNo: 'xxxx',
        isPageReady: false,
        userYear: '2024',
        userBlood: 'Rh阴性',
        Token: ''
      }
    },
    
    // 生命周期方法：页面加载时执行
    onLoad(options) {
      this.isPageReady = false; // 新增加载状态
  
      uni.getStorage({
        key: 'userIdentity',
        success: (res) => {
          this.identitySelected = res.data.Identity;
          this.isPageReady = true; // 数据就绪后设置加载完成
          this.Token = res.data.token;
        },
        fail: () => {
          this.isPageReady = true; // 异常情况也允许渲染
        }
      });
    },
    
    methods: {
      // 自定义方法：加载用户数据
      loadUserData() {
        // 从同步存储中获取用户信息
        const userInfo = uni.getStorageSync('userInfo');
        if (userInfo) {       // 如果用户信息存在
          this.userName = userInfo.name || this.userName; // 更新用户名或保留默认值
          this.userId = userInfo.id || this.userId;      // 更新用户ID或保留默认值
          this.userRole = userInfo.role || this.userRole; // 更新用户角色或保留默认值
          this.userAvatar = userInfo.avatar || this.userAvatar; // 更新头像或保留默认值
        }
      },
    
      // 显示姓名编辑对话框
      showNameEditDialog() {
        this.showNameDialog = true;     // 显示对话框
        this.newName = this.userName; // 将当前用户名设为初始值
      },
    
      // 隐藏姓名编辑对话框
      hideNameEditDialog() {
        this.showNameDialog = false;     // 隐藏对话框
      },
    
      // 处理姓名输入变化
      onNameInput(e) {
        this.newName = e.detail.value;   // 将用户输入的新值更新到newName
      },
    
      // 确认修改姓名
      confirmNameChange() {
        if (this.newName.trim()) { // 检查新姓名是否为空
          // 从存储中获取当前用户信息
          let userInfo = uni.getStorageSync('userInfo') || {};
          userInfo.name = this.newName; // 更新用户信息中的姓名
          uni.setStorageSync('userInfo', userInfo); // 保存更新后的用户信息
          console.log("token:"+this.Token);
          uni.request({
            url: 'https://jobguard.online/api/auth/modify-name', // 替换为你的后端 API 地址
            method: 'POST', //请求方式
            header: {
              'Authorization': this.Token,
              'Content-Type': 'application/json' //请求头格式为json
            },
            //请求体
            data: {
              name: this.newName
            },
            success: (res) => { //请求成功回调
              console.log('后端返回:', res.data); //打印信息进行调试
              if (res.data.message=="success") {
                // 显示成功提示
                uni.showToast({
                  title: '名字修改成功', // "名字修改成功"
                  icon: 'success'
                });    
              } else {
                uni.showToast({
                  title: res.data.message || '名字修改错误',
                  icon: 'none'
                });
              }
            },
            //请求失败
            fail: (err) => {
              console.error('请求失败:', err);
              uni.showToast({
                title: '网络错误，请稍后重试',
                icon: 'none'
              });
            }
          });
  
          this.userName = this.newName; // 更新页面显示的用户名
          this.showNameDialog = false;  // 隐藏对话框
        } else { // 如果姓名为空
          uni.showToast({
            title: '名字不能为空', // "名字不能为空"
            icon: 'error'
          });
        }
      },
    
      // 阻止事件冒泡（防止事件向上传播）
      preventBubble() {
        return; // 空函数，用于阻止事件
      },
    
      // 导航到"管理捐献者"页面
      navigateToManageDonors() {
        uni.navigateTo({
          url: '/pages/manageDonors/manageDonors' // 目标页面路径
        });
      },
    
      // 导航到"审核申请"页面
      navigateToReviewApplications() {
        uni.navigateTo({
          url: '/pages/reviewApplications/reviewApplications'
        });
      },
    
      // 导航到"黑名单"页面
      navigateToBlacklist() {
        uni.navigateTo({
          url: '/pages/blacklist/blacklist'
        });
      },
    
      // 导航到"护士认证"页面
      navigateToNurseCert() {
        uni.navigateTo({
          url: '/pages/nurseCert/nurseCert'
        });
      },
    
      // 导航到"捐献者认证"页面
      navigateToDonorCert() {
        uni.navigateTo({
          url: '/pages/donorCert/donorCert'
        });
      },
    
      // 导航到"捐献记录"页面
      navigateToDonationRecords() {
        uni.navigateTo({
          url: '/pages/donationRecords/donationRecords'
        });
      },
    
      // 导航到"消息"页面
      navigateToMessages() {
        uni.navigateTo({
          url: '/pages/messages/messages'
        });
      },
    
      // 导航到"反馈"页面
      navigateToFeedback() {
        uni.navigateTo({
          url: '/pages/feedback/feedback'
        });
      },
    
      // 退出登录功能
      logout() {
        uni.showModal({
          title: '提示', // "提示"
          content: '确定要退出登录吗？', // "确定要退出登录吗？"
          success: (res) => { // 用户响应后的回调
            if (res.confirm) { // 如果用户确认
              // 清除存储的用户数据
              uni.removeStorageSync('userInfo');
              uni.removeStorageSync('token');
              
              // 重定向到登录页面
              uni.reLaunch({
                url: '/pages/login/login'
              });
            }
          }
        });
      },
    
      // 检查更新
      checkUpdate() {
        uni.showLoading({
          title: '检查更新中...' // "检查更新中..."
        });
        // 模拟检查更新，使用定时器
        setTimeout(() => {
          uni.hideLoading(); // 隐藏加载提示
          
          // 显示模拟结果
          uni.showModal({
            title: '版本更新', // "版本更新"
            content: '当前已是最新版本 v1.0.5', // "当前已是最新版本 v1.0.5"
            showCancel: false // 不显示取消按钮
          });
        }, 1500); // 延迟1.5秒
      },
      
      // 开始更新（模拟）
      startUpdate() {
        uni.showLoading({
          title: '更新中...' // "更新中..."
        });
        
        // 模拟更新过程
        setTimeout(() => {
          uni.hideLoading(); // 隐藏加载提示
          uni.showToast({
            title: '更新成功', // "更新成功"
            icon: 'success'
          });
        }, 2000); // 延迟2秒
      }
    }
  }
  </script>

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
    align-items: center; /* 垂直居中对齐 */
    height: 100%; /* 高度为100% */
    padding: 0 30rpx; /* 左右内边距为30rpx */
}
  
/* 头像容器样式 */
.avatar-container {
    width: 140rpx; /* 宽度为120rpx */
    height: 140rpx; /* 高度为120rpx */
    border-radius: 60rpx; /* 圆角为60rpx，形成圆形 */
    overflow: hidden; /* 隐藏超出部分 */
    margin-right: 30rpx; /* 右侧外边距为30rpx */
    border: 4rpx solid #fff; /* 添加4rpx宽的白色边框 */
}
  
/* 头像图片样式 */
.avatar {
    width: 100%; /* 宽度为100% */
    height: 100%; /* 高度为100% */
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
    height: 360rpx;
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