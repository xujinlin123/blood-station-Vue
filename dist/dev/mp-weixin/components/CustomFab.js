"use strict";
const common_vendor = require("../common/vendor.js");
const common_assets = require("../common/assets.js");
<<<<<<< HEAD
const _sfc_main = {
  data() {
    return {
      menuItems: [
        { text: "AI智能问答" },
        { text: "科普动态" }
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
    };
  },
  beforeDestroy() {
    this.animationTimers.forEach((timer) => clearTimeout(timer));
  },
  methods: {
    handleTouchStart(e) {
      if (this.isAnimating)
        return;
      this.startX = e.touches[0].clientX;
    },
    handleTouchMove(e) {
      if (this.isAnimating)
        return;
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
      if (this.isAnimating)
        return;
      this.isAnimating = true;
      const anim = common_vendor.index.createAnimation({
        duration: this.ANIMATION_DURATION,
        timingFunction: "cubic-bezier(0.4, 0, 0.2, 1)"
      });
      const targetRight = collapse ? common_vendor.index.upx2px(this.FAB_COLLAPSED_RIGHT) : common_vendor.index.upx2px(this.FAB_BASE_RIGHT);
      anim.right(targetRight + "px").step();
      this.fabAnimation = anim.export();
      setTimeout(() => {
        this.isFabCollapsed = collapse;
        this.isAnimating = false;
        common_vendor.index.nextTick(() => {
          const resetAnim = common_vendor.index.createAnimation({ duration: 0 });
          resetAnim.right(targetRight + "px").step();
          this.fabAnimation = resetAnim.export();
        });
      }, this.ANIMATION_DURATION);
    },
    handleMainClick() {
      const now = Date.now();
      if (this.isAnimating || now - this.lastClickTime < 300)
        return;
      this.lastClickTime = now;
      if (this.isFabCollapsed) {
        this.toggleFabPosition(false);
      } else {
        this.showMenu ? this.closeMenu() : this.openMenu();
      }
    },
    openMenu() {
      if (this.isAnimating)
        return;
      this.isAnimating = true;
=======
const FAB_BASE_RIGHT = 90;
const FAB_COLLAPSED_RIGHT = -48;
const ANIMATION_DURATION = 300;
const _sfc_main = {
  __name: "CustomFab",
  setup(__props) {
    const menuItems = common_vendor.ref([
      { text: "AI智能问答" },
      { text: "科普动态" }
    ]);
    const isFabCollapsed = common_vendor.ref(false);
    const showMenu = common_vendor.ref(false);
    const startX = common_vendor.ref(0);
    const isAnimating = common_vendor.ref(false);
    const fabAnimation = common_vendor.ref(null);
    const menuAnimation = common_vendor.ref(null);
    const itemAnimations = common_vendor.ref([]);
    const animationTimers = common_vendor.ref([]);
    const lastClickTime = common_vendor.ref(0);
    common_vendor.onBeforeUnmount(() => {
      animationTimers.value.forEach((timer) => clearTimeout(timer));
    });
    const handleTouchStart = (e) => {
      if (isAnimating.value)
        return;
      startX.value = e.touches[0].clientX;
    };
    const handleTouchMove = (e) => {
      if (isAnimating.value)
        return;
      const currentX = e.touches[0].clientX;
      const diff = startX.value - currentX;
      const threshold = showMenu.value ? 40 : 20;
      if (diff < -threshold) {
        if (showMenu.value) {
          closeMenu(() => toggleFabPosition(true));
        } else if (!isFabCollapsed.value) {
          toggleFabPosition(true);
        }
      } else if (diff > threshold && isFabCollapsed.value) {
        toggleFabPosition(false);
      }
    };
    const toggleFabPosition = (collapse) => {
      if (isAnimating.value)
        return;
      isAnimating.value = true;
      const anim = common_vendor.index.createAnimation({
        duration: ANIMATION_DURATION,
        timingFunction: "cubic-bezier(0.4, 0, 0.2, 1)"
      });
      const targetRight = collapse ? common_vendor.index.upx2px(FAB_COLLAPSED_RIGHT) : common_vendor.index.upx2px(FAB_BASE_RIGHT);
      anim.right(targetRight + "px").step();
      fabAnimation.value = anim.export();
      const timer = setTimeout(() => {
        isFabCollapsed.value = collapse;
        isAnimating.value = false;
        common_vendor.index.nextTick(() => {
          const resetAnim = common_vendor.index.createAnimation({ duration: 0 });
          resetAnim.right(targetRight + "px").step();
          fabAnimation.value = resetAnim.export();
        });
      }, ANIMATION_DURATION);
      animationTimers.value.push(timer);
    };
    const handleMainClick = () => {
      const now = Date.now();
      if (isAnimating.value || now - lastClickTime.value < 300)
        return;
      lastClickTime.value = now;
      if (isFabCollapsed.value) {
        toggleFabPosition(false);
      } else {
        showMenu.value ? closeMenu() : openMenu();
      }
    };
    const openMenu = () => {
      if (isAnimating.value)
        return;
      isAnimating.value = true;
>>>>>>> 4731ddd (重新上传，修改了进入科普、协议等的文字部分和管理员页面的血库可视化部分)
      const menuAnim = common_vendor.index.createAnimation({
        duration: 200,
        timingFunction: "ease-out"
      });
      menuAnim.opacity(1).scale(1).step({ delay: 50 });
<<<<<<< HEAD
      this.menuAnimation = menuAnim.export();
      this.itemAnimations = this.menuItems.map((_, i) => {
=======
      menuAnimation.value = menuAnim.export();
      itemAnimations.value = menuItems.value.map((_, i) => {
>>>>>>> 4731ddd (重新上传，修改了进入科普、协议等的文字部分和管理员页面的血库可视化部分)
        const anim = common_vendor.index.createAnimation({
          duration: 200,
          delay: i * 30
        });
        return anim.opacity(1).translateY(-(i + 1) * 60).scale(1).step().export();
      });
      const timer = setTimeout(() => {
<<<<<<< HEAD
        this.showMenu = true;
        this.isAnimating = false;
      }, 250);
      this.animationTimers.push(timer);
    },
    closeMenu(callback) {
      if (this.isAnimating)
        return;
      this.isAnimating = true;
=======
        showMenu.value = true;
        isAnimating.value = false;
      }, 250);
      animationTimers.value.push(timer);
    };
    const closeMenu = (callback) => {
      if (isAnimating.value)
        return;
      isAnimating.value = true;
>>>>>>> 4731ddd (重新上传，修改了进入科普、协议等的文字部分和管理员页面的血库可视化部分)
      const fabAnim = common_vendor.index.createAnimation({
        duration: 200,
        timingFunction: "ease-in"
      });
      fabAnim.rotateZ(0).step();
<<<<<<< HEAD
      this.fabAnimation = fabAnim.export();
=======
      fabAnimation.value = fabAnim.export();
>>>>>>> 4731ddd (重新上传，修改了进入科普、协议等的文字部分和管理员页面的血库可视化部分)
      const menuAnim = common_vendor.index.createAnimation({
        duration: 150
      });
      menuAnim.opacity(0).scale(0.8).step();
<<<<<<< HEAD
      this.menuAnimation = menuAnim.export();
      this.itemAnimations = this.menuItems.map(() => {
=======
      menuAnimation.value = menuAnim.export();
      itemAnimations.value = menuItems.value.map(() => {
>>>>>>> 4731ddd (重新上传，修改了进入科普、协议等的文字部分和管理员页面的血库可视化部分)
        return common_vendor.index.createAnimation({
          duration: 150
        }).opacity(0).translateY(0).scale(0.5).step().export();
      });
      const timer = setTimeout(() => {
<<<<<<< HEAD
        this.showMenu = false;
        this.isAnimating = false;
        common_vendor.index.nextTick(() => {
          if (!this.isFabCollapsed) {
            const calibrateAnim = common_vendor.index.createAnimation({ duration: 0 });
            calibrateAnim.right(common_vendor.index.upx2px(this.FAB_BASE_RIGHT) + "px").step();
            this.fabAnimation = calibrateAnim.export();
=======
        showMenu.value = false;
        isAnimating.value = false;
        common_vendor.index.nextTick(() => {
          if (!isFabCollapsed.value) {
            const calibrateAnim = common_vendor.index.createAnimation({ duration: 0 });
            calibrateAnim.right(common_vendor.index.upx2px(FAB_BASE_RIGHT) + "px").step();
            fabAnimation.value = calibrateAnim.export();
>>>>>>> 4731ddd (重新上传，修改了进入科普、协议等的文字部分和管理员页面的血库可视化部分)
          }
        });
        callback && callback();
      }, 200);
<<<<<<< HEAD
      this.animationTimers.push(timer);
    },
    handleMenuItem(item) {
=======
      animationTimers.value.push(timer);
    };
    const handleMenuItem = (item) => {
>>>>>>> 4731ddd (重新上传，修改了进入科普、协议等的文字部分和管理员页面的血库可视化部分)
      switch (item.text) {
        case "科普动态":
          common_vendor.index.setStorageSync("SELECTED_TAB", "science");
          break;
        case "AI智能问答":
          common_vendor.index.setStorageSync("SELECTED_TAB", "ai");
          break;
      }
      common_vendor.index.switchTab({
        url: "/pages/nurse/community/community"
      });
<<<<<<< HEAD
      this.closeMenu();
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_assets._imports_0$1,
    b: $data.isFabCollapsed ? 1 : "",
    c: common_vendor.o((...args) => $options.handleTouchStart && $options.handleTouchStart(...args)),
    d: common_vendor.o((...args) => $options.handleTouchMove && $options.handleTouchMove(...args)),
    e: common_vendor.o((...args) => $options.handleMainClick && $options.handleMainClick(...args)),
    f: $data.fabAnimation,
    g: $data.showMenu
  }, $data.showMenu ? {
    h: common_vendor.f($data.menuItems, (item, index, i0) => {
      return {
        a: common_vendor.t(item.text),
        b: index,
        c: $data.itemAnimations[index],
        d: common_vendor.o(($event) => $options.handleMenuItem(item), index)
      };
    }),
    i: $data.menuAnimation,
    j: common_vendor.o(() => {
    })
  } : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
=======
      closeMenu();
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_assets._imports_0$1,
        b: isFabCollapsed.value ? 1 : "",
        c: common_vendor.o(handleTouchStart),
        d: common_vendor.o(handleTouchMove),
        e: common_vendor.o(handleMainClick),
        f: fabAnimation.value,
        g: showMenu.value
      }, showMenu.value ? {
        h: common_vendor.f(menuItems.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.text),
            b: index,
            c: itemAnimations.value[index],
            d: common_vendor.o(($event) => handleMenuItem(item), index)
          };
        }),
        i: menuAnimation.value,
        j: common_vendor.o(() => {
        })
      } : {});
    };
  }
};
wx.createComponent(_sfc_main);
>>>>>>> 4731ddd (重新上传，修改了进入科普、协议等的文字部分和管理员页面的血库可视化部分)
