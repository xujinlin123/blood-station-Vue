"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
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
        return;
      }
      const query = common_vendor.index.createSelectorQuery();
      query.select(".picker-selected").boundingClientRect();
      query.exec((res) => {
        if (res && res[0]) {
          const rect = res[0];
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
        common_vendor.index.showToast({
          title: "请先同意用户服务协议和隐私协议",
          icon: "none"
        });
        return;
      }
      if (!this.phoneNumber || !this.password) {
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
          phone: this.phoneNumber,
          password: this.password,
          role: this.identityDict[this.selectedIdentity],
          isAgreed: this.isAgreed
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
                  "Identity": this.selectedIdentity,
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
