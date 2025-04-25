"use strict";
const common_vendor = require("../common/vendor.js");
const common_assets = require("../common/assets.js");
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
      const menuAnim = common_vendor.index.createAnimation({
        duration: 200,
        timingFunction: "ease-out"
      });
      menuAnim.opacity(1).scale(1).step({ delay: 50 });
      this.menuAnimation = menuAnim.export();
      this.itemAnimations = this.menuItems.map((_, i) => {
        const anim = common_vendor.index.createAnimation({
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
      if (this.isAnimating)
        return;
      this.isAnimating = true;
      const fabAnim = common_vendor.index.createAnimation({
        duration: 200,
        timingFunction: "ease-in"
      });
      fabAnim.rotateZ(0).step();
      this.fabAnimation = fabAnim.export();
      const menuAnim = common_vendor.index.createAnimation({
        duration: 150
      });
      menuAnim.opacity(0).scale(0.8).step();
      this.menuAnimation = menuAnim.export();
      this.itemAnimations = this.menuItems.map(() => {
        return common_vendor.index.createAnimation({
          duration: 150
        }).opacity(0).translateY(0).scale(0.5).step().export();
      });
      const timer = setTimeout(() => {
        this.showMenu = false;
        this.isAnimating = false;
        common_vendor.index.nextTick(() => {
          if (!this.isFabCollapsed) {
            const calibrateAnim = common_vendor.index.createAnimation({ duration: 0 });
            calibrateAnim.right(common_vendor.index.upx2px(this.FAB_BASE_RIGHT) + "px").step();
            this.fabAnimation = calibrateAnim.export();
          }
        });
        callback && callback();
      }, 200);
      this.animationTimers.push(timer);
    },
    handleMenuItem(item) {
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
