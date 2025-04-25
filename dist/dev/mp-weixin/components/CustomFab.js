"use strict";
const common_vendor = require("../common/vendor.js");
const common_assets = require("../common/assets.js");
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
      const menuAnim = common_vendor.index.createAnimation({
        duration: 200,
        timingFunction: "ease-out"
      });
      menuAnim.opacity(1).scale(1).step({ delay: 50 });
      menuAnimation.value = menuAnim.export();
      itemAnimations.value = menuItems.value.map((_, i) => {
        const anim = common_vendor.index.createAnimation({
          duration: 200,
          delay: i * 30
        });
        return anim.opacity(1).translateY(-(i + 1) * 60).scale(1).step().export();
      });
      const timer = setTimeout(() => {
        showMenu.value = true;
        isAnimating.value = false;
      }, 250);
      animationTimers.value.push(timer);
    };
    const closeMenu = (callback) => {
      if (isAnimating.value)
        return;
      isAnimating.value = true;
      const fabAnim = common_vendor.index.createAnimation({
        duration: 200,
        timingFunction: "ease-in"
      });
      fabAnim.rotateZ(0).step();
      fabAnimation.value = fabAnim.export();
      const menuAnim = common_vendor.index.createAnimation({
        duration: 150
      });
      menuAnim.opacity(0).scale(0.8).step();
      menuAnimation.value = menuAnim.export();
      itemAnimations.value = menuItems.value.map(() => {
        return common_vendor.index.createAnimation({
          duration: 150
        }).opacity(0).translateY(0).scale(0.5).step().export();
      });
      const timer = setTimeout(() => {
        showMenu.value = false;
        isAnimating.value = false;
        common_vendor.index.nextTick(() => {
          if (!isFabCollapsed.value) {
            const calibrateAnim = common_vendor.index.createAnimation({ duration: 0 });
            calibrateAnim.right(common_vendor.index.upx2px(FAB_BASE_RIGHT) + "px").step();
            fabAnimation.value = calibrateAnim.export();
          }
        });
        callback && callback();
      }, 200);
      animationTimers.value.push(timer);
    };
    const handleMenuItem = (item) => {
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
