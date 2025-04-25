"use strict";
const common_vendor = require("../common/vendor.js");
const _sfc_main = {
  __name: "ai-avatar",
  setup(__props) {
    const isActive = common_vendor.ref(false);
    const stopAnimation = common_vendor.ref(false);
    const faceTransform = common_vendor.ref("");
    const faceRef = common_vendor.ref(null);
    const handleClick = () => {
      var _a;
      if (!isActive.value) {
        isActive.value = true;
        setTimeout(() => isActive.value = false, 800);
      }
      stopAnimation.value = true;
      const faceElement = ((_a = faceRef.value) == null ? void 0 : _a.$el) || faceRef.value;
      if (faceElement) {
        const style = getComputedStyle(faceElement);
        const tx = style.getPropertyValue("--tx") || "0";
        const ty = style.getPropertyValue("--ty") || "0";
        faceTransform.value = `translate(${tx}, ${ty})`;
        setTimeout(() => {
          faceTransform.value = "translate(0, 0)";
        }, 50);
      }
      setTimeout(() => {
        stopAnimation.value = false;
        faceTransform.value = "";
      }, 1e3);
    };
    return (_ctx, _cache) => {
      return {
        a: stopAnimation.value ? 1 : "",
        b: faceTransform.value,
        c: isActive.value ? 1 : "",
        d: common_vendor.o(handleClick)
      };
    };
  }
};
wx.createComponent(_sfc_main);
