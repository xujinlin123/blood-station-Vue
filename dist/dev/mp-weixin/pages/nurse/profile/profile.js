"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  __name: "profile",
  setup(__props) {
    const identitySelected = common_vendor.ref("兼职护士");
    const userName = common_vendor.ref("张医生");
    const userId = common_vendor.ref("MD12345");
    const userAvatar = common_vendor.ref("https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/头像女孩.png");
    const showNameDialog = common_vendor.ref(false);
    const newName = common_vendor.ref("");
    const userPhoto = common_vendor.ref("https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/头像女孩.png");
    const hospital = common_vendor.ref("广东省中医院");
    const department = common_vendor.ref("检验科");
    const userID = common_vendor.ref("440xxxxxxxxxxxxxxx");
    const userGender = common_vendor.ref("女");
    const userCertNo = common_vendor.ref("xxxx");
    const isPageReady = common_vendor.ref(false);
    const userYear = common_vendor.ref("2024");
    const userBlood = common_vendor.ref("Rh阴性");
    const Token = common_vendor.ref("");
    common_vendor.onLoad(() => {
      isPageReady.value = false;
      common_vendor.index.getStorage({
        key: "userIdentity",
        success: (res) => {
          identitySelected.value = res.data.Identity;
          isPageReady.value = true;
          Token.value = res.data.token;
        },
        fail: () => {
          isPageReady.value = true;
        }
      });
    });
    const showNameEditDialog = () => {
      showNameDialog.value = true;
      newName.value = userName.value;
    };
    const hideNameEditDialog = () => {
      showNameDialog.value = false;
    };
    const onNameInput = (e) => {
      newName.value = e.detail.value;
    };
    const confirmNameChange = () => {
      if (newName.value.trim()) {
        let userInfo = common_vendor.index.getStorageSync("userInfo") || {};
        userInfo.name = newName.value;
        common_vendor.index.setStorageSync("userInfo", userInfo);
        console.log("token:" + Token.value);
        common_vendor.index.request({
          url: "https://jobguard.online/api/auth/modify-name",
          method: "POST",
          header: {
            "Authorization": Token.value,
            "Content-Type": "application/json"
          },
          data: {
            name: newName.value
          },
          success: (res) => {
            console.log("后端返回:", res.data);
            if (res.data.message == "success") {
              common_vendor.index.showToast({
                title: "名字修改成功",
                icon: "success"
              });
              userName.value = newName.value;
              showNameDialog.value = false;
            } else {
              common_vendor.index.showToast({
                title: res.data.message || "名字修改错误",
                icon: "none"
              });
            }
          },
          fail: (err) => {
            console.error("请求失败:", err);
            common_vendor.index.showToast({
              title: "网络错误，请稍后重试",
              icon: "none"
            });
          }
        });
      } else {
        common_vendor.index.showToast({
          title: "名字不能为空",
          icon: "error"
        });
      }
    };
    const navigateToDonationRecords = () => {
      common_vendor.index.navigateTo({
        url: "/pages/donationRecords/donationRecords"
      });
    };
    const navigateToMessages = () => {
      common_vendor.index.navigateTo({
        url: "/pages/messages/messages"
      });
    };
    const navigateToFeedback = () => {
      common_vendor.index.navigateTo({
        url: "/pages/feedback/feedback"
      });
    };
    const logout = () => {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要退出登录吗？",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.removeStorageSync("userInfo");
            common_vendor.index.removeStorageSync("token");
            common_vendor.index.reLaunch({
              url: "/pages/login/login"
            });
          }
        }
      });
    };
    const checkUpdate = () => {
      common_vendor.index.showLoading({
        title: "检查更新中..."
      });
      setTimeout(() => {
        common_vendor.index.hideLoading();
        common_vendor.index.showModal({
          title: "版本更新",
          content: "当前已是最新版本 v1.0.5",
          showCancel: false
        });
      }, 1500);
    };
    const preventBubble = () => {
      return;
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: userAvatar.value || "https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/default-avatar.png",
        b: common_vendor.t(userName.value || "用户名"),
        c: common_vendor.o(showNameEditDialog),
        d: common_vendor.t(userId.value || "123456"),
        e: common_vendor.t(identitySelected.value),
        f: userPhoto.value || "https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/default-nurse.png",
        g: common_vendor.t(userName.value || "陈小云"),
        h: common_vendor.t(userGender.value || "女"),
        i: common_vendor.t(userID.value || "440xxxxxxxxxxxxxxx"),
        j: common_vendor.t(userCertNo.value || "xxxx"),
        k: common_vendor.t(hospital.value || "广东省中医院"),
        l: common_vendor.t(department.value || "检验科"),
        m: common_vendor.o(navigateToMessages),
        n: common_vendor.o(navigateToFeedback),
        o: common_vendor.o(logout),
        p: common_vendor.o(checkUpdate),
        q: showNameDialog.value
      }, showNameDialog.value ? {
        r: common_vendor.o(hideNameEditDialog),
        s: newName.value,
        t: common_vendor.o(onNameInput),
        v: common_vendor.o(confirmNameChange),
        w: common_vendor.o(preventBubble)
      } : {}, {
        x: userAvatar.value || "https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/default-avatar.png",
        y: common_vendor.t(userName.value || "用户名"),
        z: common_vendor.o(showNameEditDialog),
        A: common_vendor.t(userId.value || "123456"),
        B: common_vendor.t(identitySelected.value),
        C: common_vendor.o(navigateToMessages),
        D: common_vendor.o(navigateToFeedback),
        E: common_vendor.o(logout),
        F: common_vendor.o(checkUpdate),
        G: showNameDialog.value
      }, showNameDialog.value ? {
        H: common_vendor.o(hideNameEditDialog),
        I: newName.value,
        J: common_vendor.o(onNameInput),
        K: common_vendor.o(confirmNameChange),
        L: common_vendor.o(preventBubble),
        M: common_vendor.o(hideNameEditDialog)
      } : {}, {
        N: userAvatar.value || "https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/default-avatar.png",
        O: common_vendor.t(userName.value || "用户名"),
        P: common_vendor.o(showNameEditDialog),
        Q: common_vendor.t(userId.value || "123456"),
        R: common_vendor.t(identitySelected.value),
        S: userPhoto.value || "https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/default-nurse.png",
        T: common_vendor.t(userName.value || "陈小云"),
        U: common_vendor.t(userGender.value || "女"),
        V: common_vendor.t(userID.value || "440xxxxxxxxxxxxxxx"),
        W: common_vendor.t(userCertNo.value || "xxxx"),
        X: common_vendor.t(hospital.value || "广东省中医院"),
        Y: common_vendor.t(department.value || "检验科"),
        Z: common_vendor.o(navigateToMessages),
        aa: common_vendor.o(navigateToFeedback),
        ab: common_vendor.o(logout),
        ac: common_vendor.o(checkUpdate),
        ad: showNameDialog.value
      }, showNameDialog.value ? {
        ae: common_vendor.o(hideNameEditDialog),
        af: newName.value,
        ag: common_vendor.o(onNameInput),
        ah: common_vendor.o(confirmNameChange),
        ai: common_vendor.o(preventBubble),
        aj: common_vendor.o(hideNameEditDialog)
      } : {}, {
        ak: userAvatar.value || "https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/default-avatar.png",
        al: common_vendor.t(userName.value || "用户名"),
        am: common_vendor.o(showNameEditDialog),
        an: common_vendor.t(userId.value || "123456"),
        ao: common_vendor.t(identitySelected.value),
        ap: userPhoto.value || "https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/default-nurse.png",
        aq: common_vendor.t(userName.value || "陈小云"),
        ar: common_vendor.t(userGender.value || "女"),
        as: common_vendor.t(userBlood.value || "Rh阴性"),
        at: common_vendor.t(userID.value || "440xxxxxxxxxxxxxxx"),
        av: common_vendor.t(userYear.value || "2024"),
        aw: common_vendor.o(navigateToDonationRecords),
        ax: common_vendor.o(navigateToDonationRecords),
        ay: common_vendor.o(navigateToMessages),
        az: common_vendor.o(navigateToFeedback),
        aA: common_vendor.o(logout),
        aB: common_vendor.o(checkUpdate),
        aC: showNameDialog.value
      }, showNameDialog.value ? {
        aD: common_vendor.o(hideNameEditDialog),
        aE: newName.value,
        aF: common_vendor.o(onNameInput),
        aG: common_vendor.o(confirmNameChange),
        aH: common_vendor.o(preventBubble),
        aI: common_vendor.o(hideNameEditDialog)
      } : {});
    };
  }
};
wx.createPage(_sfc_main);
