"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      // Original empty data object
    };
  },
  methods: {
    goBack() {
      common_vendor.index.navigateBack({
        delta: 1
        // 返回上一级页面
      });
    },
    // 选择方式一：直接赋值替代setData
    // 原始代码没有使用setData，但为完整起见添加了简化版实现
    setData: function(obj) {
      for (let key in obj) {
        this[key] = obj[key];
      }
    }
  },
  // 生命周期函数位置（原代码中没有）
  onLoad() {
  },
  onShow() {
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.goBack && $options.goBack(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
