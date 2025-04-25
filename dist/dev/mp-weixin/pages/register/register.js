"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      identityOptions: ["游客", "兼职护士", "献血者", "管理员", "研究所专家"],
      identityDict: { "兼职护士": "NURSE", "献血者": "DONOR", "管理员": "ADMIN", "研究所专家": "EXPERT" },
      selectedIdentity: "兼职护士",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      isAgreed: false,
      passwordVisible: false,
      confirmPasswordVisible: false,
      showIdentityDropdown: false,
      dropdownStyle: ""
    };
  },
  methods: {
    // 点击页面其他区域关闭下拉菜单
    onTapPage() {
      if (this.showIdentityDropdown) {
        console.log("Closing dropdown from page tap");
        this.showIdentityDropdown = false;
      }
    },
    // 切换密码可见性
    togglePasswordVisibility() {
      this.passwordVisible = !this.passwordVisible;
    },
    // 确认密码可视性  
    toggleConfirmPasswordVisibility() {
      this.confirmPasswordVisible = !this.confirmPasswordVisible;
    },
    // 选择身份
    selectIdentity(e) {
      console.log("aaa");
      const index = e.currentTarget.dataset.index;
      console.log("Selected identity:", this.identityOptions[index]);
      this.selectedIdentity = this.identityOptions[index];
      this.showIdentityDropdown = false;
    },
    //下拉选择框
    toggleIdentityDropdown(e) {
      console.log("Toggle dropdown clicked");
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
    // 输入手机号码
    onPhoneNumberInput(e) {
      this.phoneNumber = e.detail.value;
    },
    // 输入密码
    onPasswordInput(e) {
      this.password = e.detail.value;
    },
    // 确认密码输入
    onConfirmPasswordInput(e) {
      this.confirmPassword = e.detail.value;
    },
    // 同意协议
    onAgreementChange(e) {
      this.isAgreed = !this.isAgreed;
      console.log(this.isAgreed);
    },
    // 跳转到隐私协议页面
    navigateToUserService() {
      common_vendor.index.navigateTo({
        url: "/pages/user-service/user-service"
      });
    },
    //跳转到用户服务协议页面
    navigateToPrivacyPolicy() {
      common_vendor.index.navigateTo({
        url: "/pages/privacy-policy/privacy-policy"
      });
    },
    // 提交注册
    onRegisterTap() {
      if (this.phoneNumber == "") {
        common_vendor.index.showToast({ title: "请输入要注册的手机号", icon: "none" });
        return;
      }
      if (this.password == "") {
        common_vendor.index.showToast({ title: "请输入要注册的密码", icon: "none" });
        return;
      }
      if (this.password !== this.confirmPassword) {
        common_vendor.index.showToast({ title: "两次输入的密码不一致", icon: "none" });
        return;
      }
      if (!this.isAgreed) {
        common_vendor.index.showToast({ title: "请先同意用户协议", icon: "none" });
        return;
      }
      common_vendor.index.request({
        url: "https://jobguard.online/api/auth/register",
        //发送请求路径
        method: "POST",
        //请求方法
        //请求体
        data: {
          phone: this.phoneNumber,
          password: this.password,
          confirmPassword: this.confirmPassword,
          role: this.identityDict[this.selectedIdentity],
          isAgreed: this.isAgreed
        },
        header: { "Content-Type": "application/json" },
        success: (res) => {
          console.log("服务器返回数据:", res);
          if (res.data.message == "success") {
            common_vendor.index.showToast({ title: "注册成功", icon: "success", duration: 500 });
            setTimeout(() => {
              common_vendor.index.redirectTo({ url: "/pages/login/login" });
            }, 500);
          } else {
            common_vendor.index.showToast({ title: res.data.message || "注册失败", icon: "none" });
          }
        },
        fail: (err) => {
          console.error(err);
          if (err.errMsg && err.errMsg.includes("ERR_SSL_PROTOCOL_ERROR")) {
            common_vendor.index.showToast({ title: "SSL协议错误，请检查网络或联系管理员", icon: "none" });
          } else {
            common_vendor.index.showToast({ title: "服务器错误，请稍后再试", icon: "none" });
          }
        }
      });
    }
  },
  // 生命周期函数直接放到export default下
  onLoad() {
  },
  onShow() {
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($data.selectedIdentity),
    b: common_vendor.o((...args) => $options.toggleIdentityDropdown && $options.toggleIdentityDropdown(...args)),
    c: common_vendor.o((...args) => $options.onPhoneNumberInput && $options.onPhoneNumberInput(...args)),
    d: $data.passwordVisible ? "text" : "password",
    e: common_vendor.o((...args) => $options.onPasswordInput && $options.onPasswordInput(...args)),
    f: $data.confirmPasswordVisible ? "text" : "password",
    g: common_vendor.o((...args) => $options.onConfirmPasswordInput && $options.onConfirmPasswordInput(...args)),
    h: $data.confirmPasswordVisible ? "https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/eye-open.jpg" : "https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/eye-close.jpg",
    i: common_vendor.o((...args) => $options.toggleConfirmPasswordVisibility && $options.toggleConfirmPasswordVisibility(...args)),
    j: common_vendor.o((...args) => $options.onAgreementChange && $options.onAgreementChange(...args)),
    k: common_vendor.o((...args) => $options.navigateToUserService && $options.navigateToUserService(...args)),
    l: common_vendor.o((...args) => $options.navigateToPrivacyPolicy && $options.navigateToPrivacyPolicy(...args)),
    m: common_vendor.o((...args) => $options.onRegisterTap && $options.onRegisterTap(...args)),
    n: common_vendor.o((...args) => $options.onTapPage && $options.onTapPage(...args)),
    o: $data.showIdentityDropdown
  }, $data.showIdentityDropdown ? {
    p: common_vendor.f($data.identityOptions, (item, index, i0) => {
      return {
        a: common_vendor.t(item),
        b: index,
        c: index,
        d: common_vendor.o((...args) => $options.selectIdentity && $options.selectIdentity(...args), index)
      };
    }),
    q: common_vendor.s($data.dropdownStyle),
    r: common_vendor.o((...args) => _ctx.stopPropagation && _ctx.stopPropagation(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
