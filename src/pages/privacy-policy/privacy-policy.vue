<template>
  <view class="page-container">
    <image src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/background.png" class="page-background" mode="aspectFill"></image>
    <view class="content-area">
      <view class="platform-title">献血 e 站</view>
      <view class="container">
        <!-- 返回按钮 -->
        <view class="back-button" @click="goBack">
          <image src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com//back.png" class="back-icon"></image>
        </view>
        <view class="header">
          <view class="title-container">
            <image src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/logo.png" class="title-bg"></image>
            <text class="title">《隐私协议》</text>
          </view>
        </view>
        <view class="content">
          <text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar sic tempor. Sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus proin sapien nunc accuan eget.
          </text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { onLoad, onShow } from '@dcloudio/uni-app'

// 返回上一页
const goBack = () => {
  uni.navigateBack({
    delta: 1
  })
}

// 如果需要setData功能
const setData = (obj) => {
  for (let key in obj) {
    state[key] = obj[key]
  }
}

// 生命周期钩子
onLoad(() => {
  // 页面加载时的逻辑
})

onShow(() => {
  // 页面显示时的逻辑
})
</script>

<style>
/**index.wxss**/
page {
  height: 100%;
  overflow: hidden;
}

.page-container {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  /* flex-direction: column; */
  align-items: center;
}
/*页面背景图*/  
.page-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -2;
}
/*内容区域*/  
.content-area {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 90rpx; /* Adjust based on your navigation bar height */
  box-sizing: border-box;
}
/*页面标题*/  
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
/*主容器*/  
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
/*logo头部*/  
.header {
  margin-top: 60px;
  width: 100%;
  text-align: center;
  margin-bottom: 10px;
}

.title-container {
  position: relative;
  display: inline-block;
  text-align: center;
  margin-bottom: 10px;
}
/*头部背景图标*/  
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
.content{
  position: relative;
  margin-bottom: 295px;
  width: 88%;
  text-align: center;
} 
/* 返回按钮 */
.back-button {
  position: absolute;
  top: 20rpx;
  right: 20rpx;
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

/* 返回图标 */
.back-icon {
  width: 30rpx;
  height: 30rpx;
}
</style>