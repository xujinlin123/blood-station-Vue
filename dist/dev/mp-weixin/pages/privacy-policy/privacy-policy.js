"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "privacy-policy",
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
