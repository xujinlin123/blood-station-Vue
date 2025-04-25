"use strict";
const common_vendor = require("../../common/vendor.js");
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
        common_vendor.index.showToast({
          title: "请先同意用户服务协议和隐私协议",
          icon: "none"
        });
        return;
      }
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
                  "Identity": selectedIdentity.value,
=======
<<<<<<< HEAD
                  "Identity": this.selectedIdentity,
=======
                  "Identity": selectedIdentity.value,
>>>>>>> 4731ddd (重新上传，修改了进入科普、协议等的文字部分和管理员页面的血库可视化部分)
>>>>>>> temp-work
                  "token": res.data.data.token
                },
                success: () => {
                  console.log("存储用户身份信息成功");
                }
              });
              common_vendor.index.switchTab({
                url: "/pages/nurse/information/information"
              });
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
    };
  }
};
wx.createPage(_sfc_main);
<<<<<<< HEAD
=======
>>>>>>> 4731ddd (重新上传，修改了进入科普、协议等的文字部分和管理员页面的血库可视化部分)
>>>>>>> temp-work
