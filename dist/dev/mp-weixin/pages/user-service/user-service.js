"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
<<<<<<< HEAD
=======
<<<<<<< HEAD
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
=======
>>>>>>> temp-work
  __name: "user-service",
  setup(__props) {
    const goBack = () => {
      common_vendor.index.navigateBack({
        delta: 1
      });
    };
    common_vendor.onLoad(() => {
    });
    common_vendor.onShow(() => {
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(goBack)
      };
    };
  }
};
wx.createPage(_sfc_main);
<<<<<<< HEAD
=======
>>>>>>> 4731ddd (重新上传，修改了进入科普、协议等的文字部分和管理员页面的血库可视化部分)
>>>>>>> temp-work
