<template>
    <view>
      <view class="page-container">
        <image src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/background.png" class="page-background" mode="aspectFill"></image>
  
        <view class="content-area">
          <view class="platform-title">献血 e 站</view>
          <!-- 和登录页面相似 -->
          <view class="container" @tap="onTapPage">
            <view class="header">
              <view class="title-container">
                <image src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/logo.png" class="title-bg"></image>
                <text class="title">注册</text>
              </view>
            </view>
  
            <view class="form">
              <view class="input-container">
                <text class="input-label">注册身份</text>
                <view class="custom-picker">
                  <view class="picker-selected" @tap.native.stop="toggleIdentityDropdown">
                    <text>{{ selectedIdentity }}</text>
                    <view class="dropdown-arrow">▼</view>
                  </view>
                </view>
              </view>
              <view class="input-container">
                <text class="input-label">手机号</text>
                <input type="text" placeholder="输入注册手机号" class="input-field" @input="onPhoneNumberInput" />
              </view>
  
              <view class="input-container">
                <text class="input-label">设置密码</text>
                <input :type="passwordVisible ? 'text' : 'password'" placeholder="设置密码" class="input-field" @input="onPasswordInput" />
              </view>
  
              <view class="input-container">
                <text class="input-label">确认密码</text>
                <input :type="confirmPasswordVisible ? 'text' : 'password'" placeholder="确认密码" class="input-field" @input="onConfirmPasswordInput" />
                <view class="toggle-password" @tap="toggleConfirmPasswordVisibility">
                  <image
                    :src="confirmPasswordVisible ? 'https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/eye-open.jpg' : 'https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/eye-close.jpg'"
                    class="password-icon"
                  />
                </view>
              </view>
            </view>
  
            <view class="agreement">
              <checkbox class="checkbox" @tap="onAgreementChange" />
              <text>我已阅读并同意</text>
              <text class="protocol-link" @tap="navigateToUserService">《用户服务协议》</text>
              <text>和</text>
              <text class="protocol-link" @tap="navigateToPrivacyPolicy">《隐私协议》</text>
            </view>
  
            <view class="register-btn" @tap="onRegisterTap">
              <view class="bt">注 册</view>
            </view>
          </view>
        </view>
      </view>
      <view
        class="dropdown-menu"
        v-if="showIdentityDropdown"
        :style="dropdownStyle"
        @tap.native.stop="stopPropagation"
      >
        <view
          class="dropdown-item"
          v-for="(item, index) in identityOptions"
          :key="index"
          :data-index="index"
          @tap.native.stop="selectIdentity"
          hover-class="dropdown-item-hover"
        >
          {{ item }}
        </view>
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
        phoneNumber: '',
        password: '',
        confirmPassword: '',
        isAgreed: false,
        passwordVisible: false,
        confirmPasswordVisible: false,
        showIdentityDropdown: false,
        dropdownStyle: ''
      }
    },
    
    methods: {
      // 点击页面其他区域关闭下拉菜单
      onTapPage() {
        if (this.showIdentityDropdown) {
          console.log('Closing dropdown from page tap');
          this.showIdentityDropdown = false;
        }
      },
      
      // 切换密码可见性
      togglePasswordVisibility() {
        this.passwordVisible = !this.passwordVisible;
      },
      
      // 确认密码可视性  
      toggleConfirmPasswordVisibility() {
        this.confirmPasswordVisible = !this.confirmPasswordVisible;
      },
  
      // 选择身份
      selectIdentity(e) {
        console.log("aaa");
        const index = e.currentTarget.dataset.index;
        console.log('Selected identity:', this.identityOptions[index]);
        this.selectedIdentity = this.identityOptions[index];
        this.showIdentityDropdown = false;
      },
      
      //下拉选择框
      toggleIdentityDropdown(e) {
        console.log('Toggle dropdown clicked');
        
        // 如果是关闭下拉菜单，直接设置
        if (this.showIdentityDropdown) {
          this.showIdentityDropdown = false;
          return;
        }
        
        // 获取点击元素的位置信息
        const query = uni.createSelectorQuery();
        query.select('.picker-selected').boundingClientRect();
        query.exec((res) => {
          if (res && res[0]) {
            const rect = res[0];
            this.showIdentityDropdown = true;
            this.dropdownStyle = `top:${rect.bottom}px; left:${rect.left}px; width:${rect.width}px;`;
          } else {
            // 如果无法获取位置，仍然显示下拉菜单
            this.showIdentityDropdown = true;
          }
        });
      },
  
      // 输入手机号码
      onPhoneNumberInput(e) {
        this.phoneNumber = e.detail.value;
      },
  
      // 输入密码
      onPasswordInput(e) {
        this.password = e.detail.value;
      },
  
      // 确认密码输入
      onConfirmPasswordInput(e) {
        this.confirmPassword = e.detail.value;
      },
  
      // 同意协议
      onAgreementChange(e) {
        this.isAgreed = !this.isAgreed;
        console.log(this.isAgreed);
      },
  
      // 跳转到隐私协议页面
      navigateToUserService() {
        uni.navigateTo({
          url: '/pages/user-service/user-service'
        });
      },
      
      //跳转到用户服务协议页面
      navigateToPrivacyPolicy() {
        uni.navigateTo({
          url: '/pages/privacy-policy/privacy-policy'
        });
      },
  
      // 提交注册
      onRegisterTap() {
        if(this.phoneNumber == "") {
          uni.showToast({ title: '请输入要注册的手机号', icon: 'none' });
          return;
        }
        if (this.password == "") {
          uni.showToast({ title: '请输入要注册的密码', icon: 'none' });
          return;
        }
        if (this.password !== this.confirmPassword) {
          uni.showToast({ title: '两次输入的密码不一致', icon: 'none' });
          return;
        }
        if (!this.isAgreed) {
          uni.showToast({ title: '请先同意用户协议', icon: 'none' });
          return;
        }
        uni.request({
          url: 'https://jobguard.online/api/auth/register', //发送请求路径
          method: 'POST',//请求方法
          //请求体
          data: {
            phone: this.phoneNumber,
            password: this.password,
            confirmPassword: this.confirmPassword,
            role: this.identityDict[this.selectedIdentity],
            isAgreed: this.isAgreed
          },
          header: { 'Content-Type': 'application/json' },
          success: (res) => {
            console.log('服务器返回数据:', res); // 打印 res 以查看完整响应
            if (res.data.message == "success") {
              uni.showToast({ title: '注册成功', icon: 'success', duration: 500 });
              setTimeout(() => {
                uni.redirectTo({ url: '/pages/login/login' });
              }, 500);
            } else {
              uni.showToast({ title: res.data.message || '注册失败', icon: 'none' });
            }
          },
          fail: (err) => {
            console.error(err); // 在控制台输出错误详情
            if (err.errMsg && err.errMsg.includes('ERR_SSL_PROTOCOL_ERROR')) {
              uni.showToast({ title: 'SSL协议错误，请检查网络或联系管理员', icon: 'none' });
            } else {
              uni.showToast({ title: '服务器错误，请稍后再试', icon: 'none' });
            }
          }
        });
      },
    },
    
    // 生命周期函数直接放到export default下
    onLoad() {
      // 原代码没有onLoad方法
    },
    
    onShow() {
      // 原代码没有onShow方法
    }
  }
</script>
  
<style>
page {
    height: 100%;
    overflow: hidden;
  } 
.page-container {
    position: relative; /*相对位置*/
    width: 100%;
    height: 100vh;
    display: flex;
    /* flex-direction: column; */
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
    padding-top: 90rpx; 
    box-sizing: border-box;
  }
  
.platform-title {
    width: 100%;
    text-align: center;
    font-size: 18px;
    font-weight: bold;
    color: #333;
    padding: 20rpx 0;
    margin-bottom: 30rpx;
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
    border-radius: 13px;
    padding: 30rpx 0;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    z-index: 1;
  }
  
.header {
    margin-top: 60px;
    width: 100%;
    text-align: center;
    margin-bottom: 20px;
  }
  
.title-container {
    position: relative;
    display: inline-block;
    text-align: center;
    margin-bottom: 20px;
  }
  
.title-bg {
    width: 120px;
    height: 300rpx;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 0;
  }
  
.title {
    position: relative;
    color: #333;
    font-size: 24px;
    white-space: nowrap;
    z-index: 1;
    padding: 0 20rpx;
  }
  
.form {
    position: relative;
    width: 80%;
    margin-top: -100px;
    margin-bottom: 0px;
  }
  
.input-container {
    display: flex;
    border: 1px solid #ff6f61;
    border-radius: 15px;
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
    /* background-color: cornflowerblue; */
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
  }
  
.dropdown-arrow {
    color: #999;
    font-size: 35rpx;
    transition: transform 0.3s;
  }
  
.dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background-color: white;
    border: 1px solid grey;
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
  }
  
.dropdown-item:last-child {
    border-bottom: none;
  }
  
.dropdown-item:hover, .dropdown-item:active {
    background-color: grey;
  }
.input-label {
    color: #000;
    padding: 10px 15px;
    width: 100rpx;
    text-align: justify;
    background-color: #ff6f61;
    display: flex;
    align-items: center;
    justify-content: center;
    writing-mode: horizontal-tb;
    white-space: nowrap;
  }
  
.input-field {
    flex: 1;
    padding: 10px;
    border: none;
  }
  
.picker-content {
    height: 100%;
    display: flex;
    align-items: center;
  }
  
.agreement {
    position: relative;
    margin-top: -140px;
    font-size: 11px;
    color: #666;
  }
  
.protocol-link {
    color: #003399;
    text-decoration: unset;
  }
  
.checkbox {
    margin-right: 4rpx;
  }
  
.register-btn {
    position: relative;
    margin-bottom: 150px;
    margin-top: -120px;
    text-align: center;
  }
  
.bt { 
    margin: 0 auto;
    width: 120px;
    height: 40px;
    line-height: 40px;
    border-radius: 7px;
    background-color: #ff6f61;
    color: white;
  }
  

</style>