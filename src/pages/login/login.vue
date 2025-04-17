<template>
  <view class="page-container">
    <image src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/background.png" class="page-background" mode="aspectFill"></image>
    
    <view class="content-area">
      <!-- 标题 -->
      <view class="platform-title">献血 e 站</view>
      <view class="container" @tap="onTapPage">
        <view class="header">
          <view class="title-container">
            <image src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/logo.png" class="title-bg"></image>
            <text class="title">授权登录</text>
          </view>
        </view>
        
        <view class="form">
          <!-- 登录身份 -->
          <view class="input-container">
            <view class="input-label">登录身份</view>
            <view class="custom-picker">
              <view class="picker-selected" @tap.native.stop="toggleIdentityDropdown">
                <text>{{selectedIdentity}}</text>
                <view class="dropdown-arrow">▼</view>
              </view>
            </view>
          </view>
          
          <!-- 账号 -->
          <view class="input-container">
            <view class="input-label">账号</view>
            <input type="text" placeholder="请输入登录手机号" class="input-field" @input="onPhoneNumberInput"/>
          </view>
          
          <!-- 密码 -->
          <view class="input-container">
            <view class="input-label">密码</view>
            <input :type="passwordVisible ? 'text' : 'password'" 
                  placeholder="请输入密码" 
                  class="input-field" 
                  @input="onPasswordInput"/>
            <view class="toggle-password" @tap="togglePasswordVisibility">
              <image :src="passwordVisible ? 'https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/eye-open.jpg' : 'https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/eye-close.jpg'" 
                    class="password-icon"/>
            </view>
          </view>
        </view>
        
        <!-- 协议同意 -->
        <view class="agreement">
          <checkbox class="checkbox" @tap="onAgreementChange"/>
          <text>我已阅读并同意</text>
          <text class="protocol-link" @tap="navigateToUserService">《用户服务协议》</text>
          <text>和</text>
          <text class="protocol-link" @tap="navigateToPrivacyPolicy">《隐私协议》</text>
        </view>
        
        <!-- 登录按钮 -->
        <view class="login-btn" @tap="onLoginTap">
          <view class="bt">登录</view>
        </view>
        
        <!-- 页脚 -->
        <view class="footer">
          <text class="link" @tap="navigateToRegister">未注册？点击注册</text>
        </view>
      </view>
    </view>
  </view>
  
  <!-- 身份选择下拉框 -->
  <view class="dropdown-menu" v-if="showIdentityDropdown" :style="dropdownStyle">
    <view class="dropdown-item" v-for="(item, index) in identityOptions" :key="index" 
          :data-index="index" @tap.native.stop="selectIdentity" hover-class="dropdown-item-hover">
      {{item}}
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      identityOptions: ['游客','兼职护士', '献血者', '管理员', '研究所专家'],
      identityDict: {'兼职护士':'NURSE','献血者':'DONOR','管理员':'ADMIN','研究所专家': 'EXPERT'},
      selectedIdentity: '兼职护士',
      selectedIdentityIndex: 0,
      phoneNumber: '',
      password: '',
      isAgreed: false,
      showIdentityDropdown: false,
      passwordVisible: false,
      dropdownStyle: ''
    }
  },
  
  methods: {
    togglePasswordVisibility() {
      this.passwordVisible = !this.passwordVisible;
    },
    
    toggleIdentityDropdown(e) {
      if (this.showIdentityDropdown) {
        this.showIdentityDropdown = false;
        return;
      }

      const query = uni.createSelectorQuery();
      query.select('.picker-selected').boundingClientRect();
      query.exec((res) => {
        if (res && res[0]) {
          const rect = res[0];
          this.showIdentityDropdown = true;
          this.dropdownStyle = `top:${rect.bottom}px; left:${rect.left}px; width:${rect.width}px;`;
        } else {
          this.showIdentityDropdown = true;
        }
      });
    },

    selectIdentity(e) {
      const index = e.currentTarget.dataset.index;
      this.selectedIdentity = this.identityOptions[index];
      this.showIdentityDropdown = false;
    },
    
    onTapPage() {
      if (this.showIdentityDropdown) {
        this.showIdentityDropdown = false;
      }
    },
    
    onPhoneNumberInput(e) {
      this.phoneNumber = e.detail.value;
    },
    
    onPasswordInput(e) {
      this.password = e.detail.value;
    },

    onAgreementChange(e) {
      this.isAgreed = !this.isAgreed;
    },

    navigateToUserService() {
      uni.navigateTo({
        url: '/pages/user-service/user-service'
      });
    },

    navigateToPrivacyPolicy() {
      uni.navigateTo({
        url: '/pages/privacy-policy/privacy-policy'
      });
    },
    
    navigateToRegister() {
      uni.redirectTo({
        url: '/pages/register/register'
      });
    },
    
    onLoginTap() {
      if (!this.isAgreed) {
        uni.showToast({
          title: '请先同意用户服务协议和隐私协议',
          icon: 'none'
        });
        return;
      }
    
      if (!this.phoneNumber || !this.password) {
        uni.showToast({
          title: '手机号或密码不能为空',
          icon: 'none'
        });
        return;
      }
    
      uni.request({
        url: 'https://jobguard.online/api/auth/login',
        method: 'POST',
        header: {
          'Content-Type': 'application/json'
        },
        data: {
          phone: this.phoneNumber,
          password: this.password,
          role: this.identityDict[this.selectedIdentity],
          isAgreed: this.isAgreed 
        },
        success: (res) => {
          if (res.data.message=="success") {
            uni.showToast({
              title: '正在登录',
              icon: 'success',
              duration: 500,
            });
            setTimeout(() => {
              uni.setStorage({
                key: 'userIdentity',
                data: {
                  "Identity": this.selectedIdentity,
                  "token": res.data.data.token
                },
                success: () => {
                  console.log('存储用户身份信息成功');
                }
              });
              uni.switchTab({
                url: '/pages/nurse/information/information'
              });
            }, 500);
          } else {
            uni.showToast({
              title: res.data.message || '账号或密码错误',
              icon: 'none'
            });
          }
        },
        fail: (err) => {
          uni.showToast({
            title: '网络错误，请稍后重试',
            icon: 'none'
          });
        }
      });
    },
  }
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
</style>