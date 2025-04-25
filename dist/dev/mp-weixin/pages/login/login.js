"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
require("../../stores/index.js");
const stores_modules_member = require("../../stores/modules/member.js");
const _sfc_main = {
  __name: "login",
  setup(__props) {
    const memberStore = stores_modules_member.useMemberStore();
    const identity = {
      "游客": "GUEST",
      "研究所专家": "DOCTOR",
      "兼职护士": "NURSE",
      "管理员": "ADMIN"
    };
    const isDoctor = common_vendor.ref(false);
    const isAgreed = common_vendor.ref(false);
    const animation = common_vendor.index.createAnimation({
      duration: 300,
      timingFunction: "ease-out"
    });
    const animationData = common_vendor.ref(null);
    common_vendor.onMounted(() => {
      resetAnimation();
    });
    const resetAnimation = () => {
      animation.opacity(1).translateX(0).step();
      animationData.value = animation.export();
    };
    const toggleLogin = () => {
      const direction = isDoctor.value ? -1 : 1;
      animation.opacity(0).translateX(100 * direction).step({
        duration: 150
      });
      animationData.value = animation.export();
      setTimeout(() => {
        isDoctor.value = !isDoctor.value;
        animation.opacity(0).translateX(-100 * direction).step({
          duration: 0
        });
        animationData.value = animation.export();
        setTimeout(() => {
          animation.opacity(1).translateX(0).step({
            duration: 150
          });
          animationData.value = animation.export();
        }, 50);
      }, 150);
    };
    const onAgreementChange = () => {
      isAgreed.value = !isAgreed.value;
    };
    const navigateToUserService = () => {
      common_vendor.index.navigateTo({
        url: "/pages/user-service/user-service"
      });
    };
    const navigateToPrivacyPolicy = () => {
      common_vendor.index.navigateTo({
        url: "/pages/privacy-policy/privacy-policy"
      });
    };
    const handleReturn = () => {
      common_vendor.index.navigateBack(-1);
    };
    const selectedRole = common_vendor.ref(null);
    const handleDoctorSelected = (role) => {
      selectedRole.value = role;
    };
    const code = common_vendor.ref("");
    common_vendor.onLoad(async () => {
      const res = await common_vendor.wx$1.login();
      code.value = res.code;
    });
    const loginWithWeChat = () => {
      if (!isAgreed.value) {
        common_vendor.index.showToast({
          title: "请先同意用户服务协议和隐私协议",
          icon: "none"
        });
        return;
      }
      console.log("微信登录代码:", code.value);
      common_vendor.index.request({
        url: "https://jobguard.online/api/auth/wx-login",
        data: {
          jsCode: code.value
        },
        method: "POST",
        success: (res) => {
          console.log("微信登录返回数据:", res.data);
          if (res.data.message == "success") {
            common_vendor.index.showToast({
              title: "正在登录",
              icon: "success",
              duration: 500
            });
            setTimeout(() => {
              common_vendor.index.setStorage({
                key: "userIdentity",
                data: {
                  "Identity": "游客",
                  "token": res.data.data.token
                },
                success: () => {
                  console.log("存储用户身份信息成功");
                }
              });
              memberStore.setProfile(res.data.data);
              handleReturn();
            }, 500);
          } else {
            common_vendor.index.showToast({
              title: res.data.message || "登录失败",
              icon: "none"
            });
          }
        },
        fail: (err) => {
          common_vendor.index.showToast({
            title: "网络错误，请稍后重试",
            icon: "none"
          });
        }
      });
    };
    const account = common_vendor.ref("");
    const password = common_vendor.ref("");
    const loginWithAccount = () => {
      if (!selectedRole.value) {
        common_vendor.index.showToast({
          title: "请选择身份",
          icon: "none"
        });
        return;
      }
      if (!isAgreed.value) {
        common_vendor.index.showToast({
          title: "请先同意用户服务协议和隐私协议",
          icon: "none"
        });
        return;
      }
      if (!account.value || !password.value) {
        common_vendor.index.showToast({
          title: "账号和密码不能为空",
          icon: "none"
        });
        return;
      }
      common_vendor.index.request({
        url: "https://jobguard.online/api/auth/login",
        method: "POST",
        header: {
          "Content-Type": "application/json"
        },
        data: {
          phone: account.value,
          password: password.value,
          role: identity[selectedRole.value],
          isAgreed: true
        },
        success: (res) => {
          if (res.data.message == "success") {
            common_vendor.index.showToast({
              title: "正在登录",
              icon: "success",
              duration: 500
            });
            setTimeout(() => {
              common_vendor.index.setStorage({
                key: "userIdentity",
                data: {
                  "Identity": selectedRole.value,
                  "token": res.data.data.token
                },
                success: () => {
                  console.log("存储用户身份信息成功");
                }
              });
              memberStore.setProfile(res.data.data);
              handleReturn();
            }, 500);
          } else {
            common_vendor.index.showToast({
              title: res.data.message || "账号或密码错误",
              icon: "none"
            });
          }
        },
        fail: (err) => {
          common_vendor.index.showToast({
            title: "网络错误，请稍后重试",
            icon: "none"
          });
        }
      });
    };
    const passwordVisible = common_vendor.ref(false);
    const togglePasswordVisibility = () => {
      passwordVisible.value = !passwordVisible.value;
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(handleReturn),
        b: common_assets._imports_0$1,
        c: !isDoctor.value
      }, !isDoctor.value ? {
        d: common_vendor.o(loginWithWeChat),
        e: common_vendor.o((...args) => _ctx.loginWithPhone && _ctx.loginWithPhone(...args))
      } : {
        f: selectedRole.value === "研究所专家" ? "https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/医生-白.png" : "https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/医生-红.png",
        g: selectedRole.value === "研究所专家" ? 1 : "",
        h: common_vendor.o(($event) => handleDoctorSelected("研究所专家")),
        i: selectedRole.value === "兼职护士" ? "https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/医生-白.png" : "https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/医生-红.png",
        j: selectedRole.value === "兼职护士" ? 1 : "",
        k: common_vendor.o(($event) => handleDoctorSelected("兼职护士")),
        l: selectedRole.value === "管理员" ? "https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/管理员-白.png" : "https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/管理员-红.png",
        m: selectedRole.value === "管理员" ? 1 : "",
        n: common_vendor.o(($event) => handleDoctorSelected("管理员")),
        o: account.value,
        p: common_vendor.o(($event) => account.value = $event.detail.value),
        q: !passwordVisible.value,
        r: password.value,
        s: common_vendor.o(($event) => password.value = $event.detail.value),
        t: passwordVisible.value ? "https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/eye-close.jpg" : "https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/eye-open.jpg",
        v: common_vendor.o(togglePasswordVisibility),
        w: common_assets._imports_1,
        x: common_vendor.o(loginWithAccount)
      }, {
        y: animationData.value,
        z: common_vendor.o(onAgreementChange),
        A: common_vendor.o(navigateToUserService),
        B: common_vendor.o(navigateToPrivacyPolicy),
        C: common_vendor.t(!isDoctor.value ? "医护人员及管理员登录" : "返回微信一键登录"),
        D: common_vendor.o(toggleLogin)
      });
    };
  }
};
wx.createPage(_sfc_main);
