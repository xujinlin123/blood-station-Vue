<script>
export default {
  data() {
    return {
      menuItems: [
      { text: 'AI智能问答' },
        { text: '科普动态' }
      ],
      isFabCollapsed: false,
      showMenu: false,
      startX: 0,
      isAnimating: false,
      fabAnimation: null,
      menuAnimation: null,
      itemAnimations: [],
      animationTimers: [],
      FAB_BASE_RIGHT: 90,
      FAB_COLLAPSED_RIGHT: -48,
      ANIMATION_DURATION: 300,
      lastClickTime: 0
    }
  },
  beforeDestroy() {
    this.animationTimers.forEach(timer => clearTimeout(timer));
  },
  methods: {
    handleTouchStart(e) {
      if (this.isAnimating) return;
      this.startX = e.touches[0].clientX;
    },
    handleTouchMove(e) {
      if (this.isAnimating) return;
      
      const currentX = e.touches[0].clientX;
      const diff = this.startX - currentX;
      const threshold = this.showMenu ? 40 : 20;
      
      if (diff < -threshold) {
        if (this.showMenu) {
          this.closeMenu(() => this.toggleFabPosition(true));
        } else if (!this.isFabCollapsed) {
          this.toggleFabPosition(true);
        }
      } else if (diff > threshold && this.isFabCollapsed) {
        this.toggleFabPosition(false);
      }
    },
    toggleFabPosition(collapse) {
      if (this.isAnimating) return;
      this.isAnimating = true;

      const anim = uni.createAnimation({
        duration: this.ANIMATION_DURATION,
        timingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
      });

      const targetRight = collapse ? 
        uni.upx2px(this.FAB_COLLAPSED_RIGHT) : 
        uni.upx2px(this.FAB_BASE_RIGHT);
      
      anim.right(targetRight + 'px').step();

      this.fabAnimation = anim.export();
      
      setTimeout(() => {
        this.isFabCollapsed = collapse;
        this.isAnimating = false;
        
        // 校准位置
        uni.nextTick(() => {
          const resetAnim = uni.createAnimation({ duration: 0 });
          resetAnim.right(targetRight + 'px').step();
          this.fabAnimation = resetAnim.export();
        });
      }, this.ANIMATION_DURATION);
    },
    handleMainClick() {
      const now = Date.now();
      if (this.isAnimating || now - this.lastClickTime < 300) return;
      this.lastClickTime = now;

      if (this.isFabCollapsed) {
        this.toggleFabPosition(false);
      } else {
        this.showMenu ? this.closeMenu() : this.openMenu();
      }
    },
    openMenu() {
      if (this.isAnimating) return;
      this.isAnimating = true;

      // // 旋转主按钮
      // const fabAnim = uni.createAnimation({
      //   duration: 250,
      //   timingFunction: 'ease-out'
      // });
      // fabAnim.rotateZ(135).step();
      // this.fabAnimation = fabAnim.export();

      // 显示菜单容器
      const menuAnim = uni.createAnimation({
        duration: 200,
        timingFunction: 'ease-out'
      });
      menuAnim.opacity(1).scale(1).step({ delay: 50 });
      this.menuAnimation = menuAnim.export();

      // 逐个显示菜单项
      this.itemAnimations = this.menuItems.map((_, i) => {
        const anim = uni.createAnimation({
          duration: 200,
          delay: i * 30
        });
        return anim.opacity(1).translateY(-(i + 1) * 60).scale(1).step().export();
      });

      const timer = setTimeout(() => {
        this.showMenu = true;
        this.isAnimating = false;
      }, 250);
      this.animationTimers.push(timer);
    },
    closeMenu(callback) {
      if (this.isAnimating) return;
      this.isAnimating = true;

      // 复位主按钮
      const fabAnim = uni.createAnimation({
        duration: 200,
        timingFunction: 'ease-in'
      });
      fabAnim.rotateZ(0).step();
      this.fabAnimation = fabAnim.export();

      // 隐藏菜单容器
      const menuAnim = uni.createAnimation({
        duration: 150
      });
      menuAnim.opacity(0).scale(0.8).step();
      this.menuAnimation = menuAnim.export();

      // 隐藏菜单项
      this.itemAnimations = this.menuItems.map(() => {
        return uni.createAnimation({
          duration: 150
        }).opacity(0).translateY(0).scale(0.5).step().export();
      });

      const timer = setTimeout(() => {
        this.showMenu = false;
        this.isAnimating = false;
        
        // 校准位置
        uni.nextTick(() => {
          if (!this.isFabCollapsed) {
            const calibrateAnim = uni.createAnimation({ duration: 0 });
            calibrateAnim.right(uni.upx2px(this.FAB_BASE_RIGHT) + 'px').step();
            this.fabAnimation = calibrateAnim.export();
          }
        });
        
        callback && callback();
      }, 200);
      this.animationTimers.push(timer);
    },
    handleMenuItem(item) {
      switch(item.text) {
        case '科普动态':
        uni.setStorageSync('SELECTED_TAB', 'science');
          break;
        case 'AI智能问答':
        uni.setStorageSync('SELECTED_TAB', 'ai');
          break;
      }
      // 执行跳转
      uni.switchTab({
        url: '/pages/nurse/community/community'
      });
      this.closeMenu();
    }
  }
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
      <image 
        class="fab-icon"
        mode="widthFix"
        src="@/static/跳转.png" 
      />
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