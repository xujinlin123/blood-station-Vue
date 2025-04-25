<script setup>
import { ref } from 'vue'

const isActive = ref(false)
const stopAnimation = ref(false)
const faceTransform = ref('')
const faceRef = ref(null)

const handleClick = () => {
  // 主球体动画
  if(!isActive.value) {
    isActive.value = true
    setTimeout(() => isActive.value = false, 800)
  }
  
  // 获取当前脸部位置
  stopAnimation.value = true
  const faceElement = faceRef.value?.$el || faceRef.value
  if (faceElement) {
    const style = getComputedStyle(faceElement)
    const tx = style.getPropertyValue('--tx') || '0'
    const ty = style.getPropertyValue('--ty') || '0'
    
    // 设置初始位置
    faceTransform.value = `translate(${tx}, ${ty})`
    
    // 下一帧触发复位
    setTimeout(() => {
      faceTransform.value = 'translate(0, 0)'
    }, 50)
  }

  // 重置状态
  setTimeout(() => {
    stopAnimation.value = false
    faceTransform.value = ''
  }, 1000)
}
</script>

<template>
  <view class="ai-container" @tap="handleClick">
    <!-- 科技光环 -->
    <view class="cyber-glow"></view>
    
    <!-- 主体球体 -->
    <view class="cyber-core" :class="{ 'active': isActive }">
      <view class="data-stream"></view>
      
      <!-- 脸部容器 -->
      <view 
        ref="faceRef"
        class="face" 
        :class="{ 'stop-animation': stopAnimation }"
        :style="{ transform: faceTransform }"
      >
        <view class="eye left"></view>
        <view class="eye right"></view>
        <view class="mouth"></view>
      </view>
    </view>
    
    <!-- 阴影 -->
    <view class="cyber-shadow"></view>
  </view>
</template>


<style lang="scss">
.ai-container {
  width: 96rpx;
  height: 96rpx;
  margin: auto 20rpx;
  z-index: 999;
  filter: drop-shadow(0 0 10rpx rgba(244, 151, 148, 0.5));
}

.cyber-core {
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, 
    rgba(236, 82, 77, 0.9) 0%,
    rgba(254, 168, 160, 1) 80%);
  position: relative;
  border: 2rpx solid rgba(236, 82, 77, 0.3);
  animation: float 3s ease-in-out infinite;
  overflow: hidden;
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  33% { transform: translateY(-10rpx) rotate(3deg); }
  66% { transform: translateY(10rpx) rotate(-3deg); }
}

.data-stream {
  position: absolute;
  width: 200%;
  height: 4rpx;
  background: linear-gradient(90deg, 
    transparent 0%, 
    rgb(244, 151, 148) 50%,
    transparent 100%);
  animation: stream 1s linear infinite;
  opacity: 0.6;
}

@keyframes stream {
  0% { transform: translateX(-50%) rotate(45deg); }
  100% { transform: translateX(50%) rotate(45deg); }
}

.face {
  position: absolute;
  width: 100%;
  height: 100%;
  animation: faceMove 6s infinite ease-in-out;
  will-change: transform;
  transition: transform 0.7s ease-out;
}

.face.stop-animation {
  animation: none;
  transform: translate(var(--tx, 0), var(--ty, 0));
}

@keyframes faceMove {
  0%, 100% { 
    transform: translate(0, 0);
    --tx: 0;
    --ty: 0;
  }
  25% { 
    transform: translate(-20rpx, -15rpx);
    --tx: -20rpx;
    --ty: -15rpx;
  }
  50% { 
    transform: translate(15rpx, 10rpx);
    --tx: 15rpx;
    --ty: 10rpx;
  }
  75% { 
    transform: translate(-10rpx, 20rpx);
    --tx: -10rpx;
    --ty: 20rpx;
  }
}

.eye {
  width: 12rpx;
  height: 30rpx;
  background: #fff;
  border-radius: 6rpx 6rpx 0 0;
  position: absolute;
  bottom: 45%;
  box-shadow: 0 0 20rpx rgba(244, 151, 148, 0.6);
  border: 1rpx solid rgb(244, 151, 148);
  animation: blink 0.8s ease-in-out infinite;
}

.left { left: 30%; }
.right { right: 30%; }

@keyframes blink {
  0%, 80% { height: 24rpx; }
  90%, 100% { height: 4rpx; }
}

.mouth {
  position: absolute;
  width: 15rpx;
  height: 5rpx;
  background-color: #fff;
  border-radius: 20rpx;
  bottom: 25%;
  left: 50%;
  transform: translateX(-50%);
  animation: mouthBlink 3s ease-in-out infinite;
}

@keyframes mouthBlink {
  0%, 50% { height: 8rpx; }
  50%, 100% { height: 4rpx; }
}

.cyber-glow {
  position: absolute;
  width: 130%;
  height: 130%;
  border-radius: 50%;
  background: radial-gradient(circle at 50% 50%,
    rgba(237, 78, 74, 0.2) 0%,
    rgba(255, 165, 0, 0.05) 70%);
  animation: glow 1s ease-in-out infinite;
}

.cyber-core.active {
  animation: pulse 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

@keyframes glow {
  50% { opacity: 0.3; transform: scale(1.1); }
}
</style>