"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
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
        common_vendor.index.showToast({
          title: "请先同意用户服务协议和隐私协议",
          icon: "none"
        });
        return;
      }
      if (!phoneNumber.value || !password.value) {
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
          phone: phoneNumber.value,
          password: password.value,
          role: identityDict.value[selectedIdentity.value],
          isAgreed: isAgreed.value
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
                  "Identity": selectedIdentity.value,
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
