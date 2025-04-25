"use strict";
const common_vendor = require("../../common/vendor.js");
const useMemberStore = common_vendor.defineStore(
  "member",
  () => {
    const profile = common_vendor.ref(null);
    const setProfile = (val) => {
      profile.value = val;
    };
    const getProfile = () => {
      return profile.value;
    };
    const clearProfile = () => {
      profile.value = null;
    };
    return {
      profile,
      setProfile,
      getProfile,
      clearProfile
    };
  },
  // TODO: 持久化
  {
    //小程序持久化配置
    persist: {
      storage: {
        getItem(key) {
          return common_vendor.index.getStorageSync(key);
        },
        setItem(key, value) {
          common_vendor.index.setStorageSync(key, value);
        }
      }
    }
  }
);
exports.useMemberStore = useMemberStore;
