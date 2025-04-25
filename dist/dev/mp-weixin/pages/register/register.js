"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "register",
  setup(__props) {
    const state = common_vendor.reactive({
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
    });
    const {
      identityOptions,
      identityDict,
      selectedIdentity,
      phoneNumber,
      password,
      confirmPassword,
      isAgreed,
      passwordVisible,
      confirmPasswordVisible,
      showIdentityDropdown,
      dropdownStyle
    } = toRefs(state);
    const onTapPage = () => {
      if (showIdentityDropdown.value) {
        console.log("Closing dropdown from page tap");
        showIdentityDropdown.value = false;
      }
    };
    const toggleConfirmPasswordVisibility = () => {
      confirmPasswordVisible.value = !confirmPasswordVisible.value;
    };
    const selectIdentity = (index) => {
      console.log("Selected identity:", identityOptions.value[index]);
      selectedIdentity.value = identityOptions.value[index];
      showIdentityDropdown.value = false;
    };
    const toggleIdentityDropdown = (e) => {
      console.log("Toggle dropdown clicked");
      if (showIdentityDropdown.value) {
        showIdentityDropdown.value = false;
        return;
      }
      const query = common_vendor.index.createSelectorQuery();
      query.select(".picker-selected").boundingClientRect();
      query.exec((res) => {
        if (res && res[0]) {
          const rect = res[0];
          showIdentityDropdown.value = true;
          dropdownStyle.value = `top:${rect.bottom}px; left:${rect.left}px; width:${rect.width}px;`;
        } else {
          showIdentityDropdown.value = true;
        }
      });
    };
    const onPhoneNumberInput = (e) => {
      phoneNumber.value = e.detail.value;
    };
    const onPasswordInput = (e) => {
      password.value = e.detail.value;
    };
    const onConfirmPasswordInput = (e) => {
      confirmPassword.value = e.detail.value;
    };
    const onAgreementChange = (e) => {
      isAgreed.value = !isAgreed.value;
      console.log(isAgreed.value);
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
    const onRegisterTap = () => {
      if (phoneNumber.value === "") {
        common_vendor.index.showToast({ title: "请输入要注册的手机号", icon: "none" });
        return;
      }
      if (password.value === "") {
        common_vendor.index.showToast({ title: "请输入要注册的密码", icon: "none" });
        return;
      }
      if (password.value !== confirmPassword.value) {
        common_vendor.index.showToast({ title: "两次输入的密码不一致", icon: "none" });
        return;
      }
      if (!isAgreed.value) {
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
          phone: phoneNumber.value,
          password: password.value,
          confirmPassword: confirmPassword.value,
          role: identityDict.value[selectedIdentity.value],
          isAgreed: isAgreed.value
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
    };
    const stopPropagation = () => {
    };
    common_vendor.onLoad(() => {
    });
    common_vendor.onShow(() => {
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(common_vendor.unref(selectedIdentity)),
        b: common_vendor.o(toggleIdentityDropdown),
        c: common_vendor.o(onPhoneNumberInput),
        d: common_vendor.unref(passwordVisible) ? "text" : "password",
        e: common_vendor.o(onPasswordInput),
        f: common_vendor.unref(confirmPasswordVisible) ? "text" : "password",
        g: common_vendor.o(onConfirmPasswordInput),
        h: common_vendor.unref(confirmPasswordVisible) ? "https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/eye-open.jpg" : "https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/eye-close.jpg",
        i: common_vendor.o(toggleConfirmPasswordVisibility),
        j: common_vendor.o(onAgreementChange),
        k: common_vendor.o(navigateToUserService),
        l: common_vendor.o(navigateToPrivacyPolicy),
        m: common_vendor.o(onRegisterTap),
        n: common_vendor.o(onTapPage),
        o: common_vendor.unref(showIdentityDropdown)
      }, common_vendor.unref(showIdentityDropdown) ? {
        p: common_vendor.f(common_vendor.unref(identityOptions), (item, index, i0) => {
          return {
            a: common_vendor.t(item),
            b: index,
            c: index,
            d: common_vendor.o(($event) => selectIdentity(index), index)
          };
        }),
        q: common_vendor.s(common_vendor.unref(dropdownStyle)),
        r: common_vendor.o(stopPropagation)
      } : {});
    };
  }
};
wx.createPage(_sfc_main);
