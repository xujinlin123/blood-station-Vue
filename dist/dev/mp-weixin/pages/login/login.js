"use strict";
const common_vendor = require("../../common/vendor.js");
<<<<<<< HEAD
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
=======
const _sfc_main = {
<<<<<<< HEAD
=======
<<<<<<< HEAD
  data() {
    return {
      identityOptions: ["游客", "兼职护士", "献血者", "管理员", "研究所专家"],
      identityDict: { "兼职护士": "NURSE", "献血者": "DONOR", "管理员": "ADMIN", "研究所专家": "EXPERT" },
      selectedIdentity: "兼职护士",
      selectedIdentityIndex: 0,
      phoneNumber: "",
      password: "",
      isAgreed: false,
      showIdentityDropdown: false,
      passwordVisible: false,
      dropdownStyle: ""
    };
  },
  methods: {
    togglePasswordVisibility() {
      this.passwordVisible = !this.passwordVisible;
    },
    toggleIdentityDropdown(e) {
      if (this.showIdentityDropdown) {
        this.showIdentityDropdown = false;
=======
>>>>>>> temp-work
  __name: "login",
  setup(__props) {
    const identityOptions = common_vendor.ref(["游客", "兼职护士", "献血者", "管理员", "研究所专家"]);
    const identityDict = common_vendor.ref({
      "兼职护士": "NURSE",
      "献血者": "DONOR",
      "管理员": "ADMIN",
      "研究所专家": "EXPERT"
    });
    const selectedIdentity = common_vendor.ref("兼职护士");
    common_vendor.ref(0);
    const phoneNumber = common_vendor.ref("");
    const password = common_vendor.ref("");
    const isAgreed = common_vendor.ref(false);
    const showIdentityDropdown = common_vendor.ref(false);
    const passwordVisible = common_vendor.ref(false);
    const dropdownStyle = common_vendor.ref("");
    const togglePasswordVisibility = () => {
      passwordVisible.value = !passwordVisible.value;
    };
    const toggleIdentityDropdown = (e) => {
      if (showIdentityDropdown.value) {
        showIdentityDropdown.value = false;
<<<<<<< HEAD
=======
>>>>>>> 4731ddd (重新上传，修改了进入科普、协议等的文字部分和管理员页面的血库可视化部分)
>>>>>>> temp-work
        return;
      }
      const query = common_vendor.index.createSelectorQuery();
      query.select(".picker-selected").boundingClientRect();
      query.exec((res) => {
        if (res && res[0]) {
          const rect = res[0];
<<<<<<< HEAD
=======
<<<<<<< HEAD
          this.showIdentityDropdown = true;
          this.dropdownStyle = `top:${rect.bottom}px; left:${rect.left}px; width:${rect.width}px;`;
        } else {
          this.showIdentityDropdown = true;
        }
      });
    },
    selectIdentity(e) {
      const index = e.currentTarget.dataset.index;
      this.selectedIdentity = this.identityOptions[index];
      this.showIdentityDropdown = false;
    },
    onTapPage() {
      if (this.showIdentityDropdown) {
        this.showIdentityDropdown = false;
      }
    },
    onPhoneNumberInput(e) {
      this.phoneNumber = e.detail.value;
    },
    onPasswordInput(e) {
      this.password = e.detail.value;
    },
    onAgreementChange(e) {
      this.isAgreed = !this.isAgreed;
    },
    navigateToUserService() {
      common_vendor.index.navigateTo({
        url: "/pages/user-service/user-service"
      });
    },
    navigateToPrivacyPolicy() {
      common_vendor.index.navigateTo({
        url: "/pages/privacy-policy/privacy-policy"
      });
    },
    navigateToRegister() {
      common_vendor.index.redirectTo({
        url: "/pages/register/register"
      });
    },
    onLoginTap() {
      if (!this.isAgreed) {
=======
>>>>>>> temp-work
          showIdentityDropdown.value = true;
          dropdownStyle.value = `top:${rect.bottom}px; left:${rect.left}px; width:${rect.width}px;`;
        } else {
          showIdentityDropdown.value = true;
        }
      });
    };
    const selectIdentity = (e) => {
      const index = e.currentTarget.dataset.index;
      selectedIdentity.value = identityOptions.value[index];
      showIdentityDropdown.value = false;
    };
    const onTapPage = () => {
      if (showIdentityDropdown.value) {
        showIdentityDropdown.value = false;
      }
    };
    const onPhoneNumberInput = (e) => {
      phoneNumber.value = e.detail.value;
    };
    const onPasswordInput = (e) => {
      password.value = e.detail.value;
    };
    const onAgreementChange = (e) => {
>>>>>>> 48233f6d8a4fd65c2989f46576947d9a61d95ebf
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
<<<<<<< HEAD
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
=======
    const navigateToRegister = () => {
      common_vendor.index.redirectTo({
        url: "/pages/register/register"
      });
    };
    const onLoginTap = () => {
      if (!isAgreed.value) {
<<<<<<< HEAD
=======
>>>>>>> 4731ddd (重新上传，修改了进入科普、协议等的文字部分和管理员页面的血库可视化部分)
>>>>>>> temp-work
>>>>>>> 48233f6d8a4fd65c2989f46576947d9a61d95ebf
        common_vendor.index.showToast({
          title: "请先同意用户服务协议和隐私协议",
          icon: "none"
        });
        return;
      }
<<<<<<< HEAD
      if (!account.value || !password.value) {
        common_vendor.index.showToast({
          title: "账号和密码不能为空",
=======
<<<<<<< HEAD
      if (!phoneNumber.value || !password.value) {
=======
<<<<<<< HEAD
      if (!this.phoneNumber || !this.password) {
=======
      if (!phoneNumber.value || !password.value) {
>>>>>>> 4731ddd (重新上传，修改了进入科普、协议等的文字部分和管理员页面的血库可视化部分)
>>>>>>> temp-work
        common_vendor.index.showToast({
          title: "手机号或密码不能为空",
>>>>>>> 48233f6d8a4fd65c2989f46576947d9a61d95ebf
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
<<<<<<< HEAD
          phone: account.value,
          password: password.value,
          role: identity[selectedRole.value],
          isAgreed: true
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
          phone: this.phoneNumber,
          password: this.password,
          role: this.identityDict[this.selectedIdentity],
          isAgreed: this.isAgreed
=======
>>>>>>> temp-work
          phone: phoneNumber.value,
          password: password.value,
          role: identityDict.value[selectedIdentity.value],
          isAgreed: isAgreed.value
<<<<<<< HEAD
=======
>>>>>>> 4731ddd (重新上传，修改了进入科普、协议等的文字部分和管理员页面的血库可视化部分)
>>>>>>> temp-work
>>>>>>> 48233f6d8a4fd65c2989f46576947d9a61d95ebf
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
<<<<<<< HEAD
                  "Identity": selectedRole.value,
=======
<<<<<<< HEAD
                  "Identity": selectedIdentity.value,
=======
<<<<<<< HEAD
                  "Identity": this.selectedIdentity,
=======
                  "Identity": selectedIdentity.value,
>>>>>>> 4731ddd (重新上传，修改了进入科普、协议等的文字部分和管理员页面的血库可视化部分)
>>>>>>> temp-work
>>>>>>> 48233f6d8a4fd65c2989f46576947d9a61d95ebf
                  "token": res.data.data.token
                },
                success: () => {
                  console.log("存储用户身份信息成功");
                }
              });
<<<<<<< HEAD
              memberStore.setProfile(res.data.data);
              handleReturn();
=======
              common_vendor.index.switchTab({
                url: "/pages/nurse/information/information"
              });
>>>>>>> 48233f6d8a4fd65c2989f46576947d9a61d95ebf
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
<<<<<<< HEAD
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
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($data.selectedIdentity),
    b: common_vendor.o((...args) => $options.toggleIdentityDropdown && $options.toggleIdentityDropdown(...args)),
    c: common_vendor.o((...args) => $options.onPhoneNumberInput && $options.onPhoneNumberInput(...args)),
    d: $data.passwordVisible ? "text" : "password",
    e: common_vendor.o((...args) => $options.onPasswordInput && $options.onPasswordInput(...args)),
    f: $data.passwordVisible ? "https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/eye-open.jpg" : "https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/eye-close.jpg",
    g: common_vendor.o((...args) => $options.togglePasswordVisibility && $options.togglePasswordVisibility(...args)),
    h: common_vendor.o((...args) => $options.onAgreementChange && $options.onAgreementChange(...args)),
    i: common_vendor.o((...args) => $options.navigateToUserService && $options.navigateToUserService(...args)),
    j: common_vendor.o((...args) => $options.navigateToPrivacyPolicy && $options.navigateToPrivacyPolicy(...args)),
    k: common_vendor.o((...args) => $options.onLoginTap && $options.onLoginTap(...args)),
    l: common_vendor.o((...args) => $options.navigateToRegister && $options.navigateToRegister(...args)),
    m: common_vendor.o((...args) => $options.onTapPage && $options.onTapPage(...args)),
    n: $data.showIdentityDropdown
  }, $data.showIdentityDropdown ? {
    o: common_vendor.f($data.identityOptions, (item, index, i0) => {
      return {
        a: common_vendor.t(item),
        b: index,
        c: index,
        d: common_vendor.o((...args) => $options.selectIdentity && $options.selectIdentity(...args), index)
      };
    }),
    p: common_vendor.s($data.dropdownStyle)
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
=======
>>>>>>> temp-work
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(selectedIdentity.value),
        b: common_vendor.o(toggleIdentityDropdown),
        c: common_vendor.o(onPhoneNumberInput),
        d: passwordVisible.value ? "text" : "password",
        e: common_vendor.o(onPasswordInput),
        f: passwordVisible.value ? "https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/eye-open.jpg" : "https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/eye-close.jpg",
        g: common_vendor.o(togglePasswordVisibility),
        h: common_vendor.o(onAgreementChange),
        i: common_vendor.o(navigateToUserService),
        j: common_vendor.o(navigateToPrivacyPolicy),
        k: common_vendor.o(onLoginTap),
        l: common_vendor.o(navigateToRegister),
        m: common_vendor.o(onTapPage),
        n: showIdentityDropdown.value
      }, showIdentityDropdown.value ? {
        o: common_vendor.f(identityOptions.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item),
            b: index,
            c: index,
            d: common_vendor.o(selectIdentity, index)
          };
        }),
        p: common_vendor.s(dropdownStyle.value)
      } : {});
>>>>>>> 48233f6d8a4fd65c2989f46576947d9a61d95ebf
    };
  }
};
wx.createPage(_sfc_main);
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
>>>>>>> 4731ddd (重新上传，修改了进入科普、协议等的文字部分和管理员页面的血库可视化部分)
>>>>>>> temp-work
>>>>>>> 48233f6d8a4fd65c2989f46576947d9a61d95ebf
