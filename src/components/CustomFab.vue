<script setup>
import { ref, onBeforeUnmount } from 'vue'
import aiAvatar from './ai-avatar.vue'

// 响应式数据
const menuItems = ref([
  { text: 'AI智能问答' },
  { text: '科普动态' }
])
const isFabCollapsed = ref(false)
const showMenu = ref(false)
const startX = ref(0)
const isAnimating = ref(false)
const fabAnimation = ref(null)
const menuAnimation = ref(null)
const itemAnimations = ref([])
const animationTimers = ref([])
const FAB_BASE_RIGHT = 90
const FAB_COLLAPSED_RIGHT = -48
const ANIMATION_DURATION = 300
const lastClickTime = ref(0)

// 清理定时器
onBeforeUnmount(() => {
  animationTimers.value.forEach(timer => clearTimeout(timer))
})

// 方法定义
const handleTouchStart = (e) => {
  if (isAnimating.value) return
  startX.value = e.touches[0].clientX
}

const handleTouchMove = (e) => {
  if (isAnimating.value) return
  
  const currentX = e.touches[0].clientX
  const diff = startX.value - currentX
  const threshold = showMenu.value ? 40 : 20
  
  if (diff < -threshold) {
    if (showMenu.value) {
      closeMenu(() => toggleFabPosition(true))
    } else if (!isFabCollapsed.value) {
      toggleFabPosition(true)
    }
  } else if (diff > threshold && isFabCollapsed.value) {
    toggleFabPosition(false)
  }
}

const toggleFabPosition = (collapse) => {
  if (isAnimating.value) return
  isAnimating.value = true

  const anim = uni.createAnimation({
    duration: ANIMATION_DURATION,
    timingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
  })

  const targetRight = collapse ? 
    uni.upx2px(FAB_COLLAPSED_RIGHT) : 
    uni.upx2px(FAB_BASE_RIGHT)
  
  anim.right(targetRight + 'px').step()

  fabAnimation.value = anim.export()
  
  const timer = setTimeout(() => {
    isFabCollapsed.value = collapse
    isAnimating.value = false
    
    // 校准位置
    uni.nextTick(() => {
      const resetAnim = uni.createAnimation({ duration: 0 })
      resetAnim.right(targetRight + 'px').step()
      fabAnimation.value = resetAnim.export()
    })
  }, ANIMATION_DURATION)
  animationTimers.value.push(timer)
}

const handleMainClick = () => {
  const now = Date.now()
  if (isAnimating.value || now - lastClickTime.value < 300) return
  lastClickTime.value = now

  if (isFabCollapsed.value) {
    toggleFabPosition(false)
  } else {
    showMenu.value ? closeMenu() : openMenu()
  }
}

const openMenu = () => {
  if (isAnimating.value) return
  isAnimating.value = true

  // 显示菜单容器
  const menuAnim = uni.createAnimation({
    duration: 200,
    timingFunction: 'ease-out'
  })
  menuAnim.opacity(1).scale(1).step({ delay: 50 })
  menuAnimation.value = menuAnim.export()

  // 逐个显示菜单项
  itemAnimations.value = menuItems.value.map((_, i) => {
    const anim = uni.createAnimation({
      duration: 200,
      delay: i * 30
    })
    return anim.opacity(1).translateY(-(i + 1) * 60).scale(1).step().export()
  })

  const timer = setTimeout(() => {
    showMenu.value = true
    isAnimating.value = false
  }, 250)
  animationTimers.value.push(timer)
}

const closeMenu = (callback) => {
  if (isAnimating.value) return
  isAnimating.value = true

  // 复位主按钮
  const fabAnim = uni.createAnimation({
    duration: 200,
    timingFunction: 'ease-in'
  })
  fabAnim.rotateZ(0).step()
  fabAnimation.value = fabAnim.export()

  // 隐藏菜单容器
  const menuAnim = uni.createAnimation({
    duration: 150
  })
  menuAnim.opacity(0).scale(0.8).step()
  menuAnimation.value = menuAnim.export()

  // 隐藏菜单项
  itemAnimations.value = menuItems.value.map(() => {
    return uni.createAnimation({
      duration: 150
    }).opacity(0).translateY(0).scale(0.5).step().export()
  })

  const timer = setTimeout(() => {
    showMenu.value = false
    isAnimating.value = false
    
    // 校准位置
    uni.nextTick(() => {
      if (!isFabCollapsed.value) {
        const calibrateAnim = uni.createAnimation({ duration: 0 })
        calibrateAnim.right(uni.upx2px(FAB_BASE_RIGHT) + 'px').step()
        fabAnimation.value = calibrateAnim.export()
      }
    })
    
    callback && callback()
  }, 200)
  animationTimers.value.push(timer)
}

const handleMenuItem = (item) => {
  switch(item.text) {
    case '科普动态':
      uni.setStorageSync('SELECTED_TAB', 'science')
      break
    case 'AI智能问答':
      uni.setStorageSync('SELECTED_TAB', 'ai')
      break
  }
  // 执行跳转
  uni.switchTab({
    url: '/pages/nurse/community/community'
  })
  closeMenu()
}
</script>

<template>
  <view>
    <!-- 主悬浮按钮 -->
    <view 
      class="fab"
      :class="{ 'collapsed': isFabCollapsed }"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @tap="handleMainClick"
      :animation="fabAnimation"
    >
      <!-- <image 
        class="fab-icon"
        mode="widthFix"
        src="../static/images/ai.png" 
      /> -->
      <aiAvatar />
    </view>
    
    <!-- 子菜单 -->
    <view 
      class="menu-container" 
      v-if="showMenu" 
      :animation="menuAnimation"
      @touchmove.stop
    >
      <view 
        v-for="(item, index) in menuItems"
        :key="index"
        class="menu-item"
        :animation="itemAnimations[index]"
        @tap="handleMenuItem(item)"
      >
        <text class="menu-text">{{ item.text }}</text>
      </view>
    </view>
  </view>
</template>

<style>
.fab {
  position: fixed;
  width: 100rpx;
  height: 100rpx;
  right: 90rpx;
  bottom: 70rpx;
  border-radius: 50%;
  /* background-color: #ff8474; */
  /* background-color:#fff; */
  /* box-shadow: 0 8rpx 24rpx rgba(254, 179, 174, 0.4); */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.fab.collapsed {
  right: -48rpx;
  opacity: 0.7;
}

.fab-icon {
  width: 100rpx;
  height: 100rpx;
  transition: transform 0.3s ease-out;
}

.menu-container {
  position: fixed;
  right: 30rpx;
  bottom: 180rpx;
  transform-origin: right bottom;
  z-index: 999;
}

.menu-item {
  position: absolute;
  right: 0;
  width: 180rpx;
  height: 88rpx;
  background: #fff;
  border-radius: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 32rpx;
  margin-bottom: 24rpx;
  opacity: 0;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.2);
}

.menu-item:active {
  background: #f5f5f5;
}

.menu-text {
  font-size: 34rpx;
  color: #333;
}
</style>