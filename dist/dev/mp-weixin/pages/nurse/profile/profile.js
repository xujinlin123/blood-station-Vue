"use strict";
const common_vendor = require("../../../common/vendor.js");
const common_assets = require("../../../common/assets.js");
require("../../../stores/index.js");
const stores_modules_member = require("../../../stores/modules/member.js");
const _sfc_main = {
  __name: "profile",
  setup(__props) {
    const memberStore = stores_modules_member.useMemberStore();
    const identitySelected = common_vendor.ref("");
    const userName = common_vendor.ref("");
    const userId = common_vendor.ref("");
    const userAvatar = common_vendor.ref("");
    const showNameDialog = common_vendor.ref(false);
    const newName = common_vendor.ref("");
    const userPhoto = common_vendor.ref("https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/头像女孩.png");
    const hospital = common_vendor.ref("广东省中医院");
    const department = common_vendor.ref("检验科");
    const userID = common_vendor.ref("440xxxxxxxxxxxxxxx");
    const userGender = common_vendor.ref("女");
    const userCertNo = common_vendor.ref("xxxx");
    common_vendor.ref(false);
    const userYear = common_vendor.ref("2024");
    const userBlood = common_vendor.ref("Rh阴性");
    const Token = common_vendor.ref("");
    const loadUserData = () => {
      if (memberStore.getProfile()) {
        console.log("获取到用户信息");
        common_vendor.index.getStorage({
          key: "userIdentity",
          success: (res) => {
            identitySelected.value = res.data.Identity;
            Token.value = res.data.token;
            userName.value = memberStore.getProfile().name;
            userId.value = memberStore.getProfile().id;
            userAvatar.value = memberStore.getProfile().avatar;
          },
          fail: () => {
            identitySelected.value = "未登录";
          }
        });
      } else {
        identitySelected.value = "未登录";
      }
    };
    common_vendor.onLoad(() => {
      loadUserData();
    });
    common_vendor.onShow(() => {
      loadUserData();
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
            memberStore.clearProfile();
            console.log("用户已退出登录");
            identitySelected.value = "未登录";
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
    const goLogin = () => {
      common_vendor.index.navigateTo({
        url: "/pages/login/login"
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: identitySelected.value === "游客"
      }, identitySelected.value === "游客" ? common_vendor.e({
        b: userAvatar.value || "https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/default-avatar.png",
        c: common_vendor.t(userName.value || "用户名"),
        d: common_vendor.o(showNameEditDialog),
        e: common_vendor.t(userId.value || "123456"),
        f: common_vendor.t(identitySelected.value),
        g: common_vendor.o(navigateToMessages),
        h: common_vendor.o(navigateToFeedback),
        i: common_vendor.o(logout),
        j: common_vendor.o(checkUpdate),
        k: showNameDialog.value
      }, showNameDialog.value ? {
        l: common_vendor.o(hideNameEditDialog),
        m: newName.value,
        n: common_vendor.o(onNameInput),
        o: common_vendor.o(confirmNameChange),
        p: common_vendor.o(preventBubble),
        q: common_vendor.o(hideNameEditDialog)
      } : {}) : {}, {
        r: identitySelected.value === "献血者"
      }, identitySelected.value === "献血者" ? common_vendor.e({
        s: userAvatar.value || "https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/default-avatar.png",
        t: common_vendor.t(userName.value || "用户名"),
        v: common_vendor.o(showNameEditDialog),
        w: common_vendor.t(userId.value || "123456"),
        x: common_vendor.t(identitySelected.value),
        y: userPhoto.value || "https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/default-nurse.png",
        z: common_vendor.t(userName.value || "陈小云"),
        A: common_vendor.t(userGender.value || "女"),
        B: common_vendor.t(userBlood.value || "Rh阴性"),
        C: common_vendor.t(userID.value || "440xxxxxxxxxxxxxxx"),
        D: common_vendor.t(userYear.value || "2024"),
        E: common_vendor.o(navigateToDonationRecords),
        F: common_vendor.o(navigateToDonationRecords),
        G: common_vendor.o(navigateToMessages),
        H: common_vendor.o(navigateToFeedback),
        I: common_vendor.o(logout),
        J: common_vendor.o(checkUpdate),
        K: showNameDialog.value
      }, showNameDialog.value ? {
        L: common_vendor.o(hideNameEditDialog),
        M: newName.value,
        N: common_vendor.o(onNameInput),
        O: common_vendor.o(confirmNameChange),
        P: common_vendor.o(preventBubble),
        Q: common_vendor.o(hideNameEditDialog)
      } : {}) : {}, {
        R: identitySelected.value === "兼职护士"
      }, identitySelected.value === "兼职护士" ? common_vendor.e({
        S: userAvatar.value || "https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/default-avatar.png",
        T: common_vendor.t(userName.value || "用户名"),
        U: common_vendor.o(showNameEditDialog),
        V: common_vendor.t(userId.value || "123456"),
        W: common_vendor.t(identitySelected.value),
        X: userPhoto.value || "https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/default-nurse.png",
        Y: common_vendor.t(userName.value || "陈小云"),
        Z: common_vendor.t(userGender.value || "女"),
        aa: common_vendor.t(userID.value || "440xxxxxxxxxxxxxxx"),
        ab: common_vendor.t(userCertNo.value || "xxxx"),
        ac: common_vendor.t(hospital.value || "广东省中医院"),
        ad: common_vendor.t(department.value || "检验科"),
        ae: common_vendor.o(navigateToMessages),
        af: common_vendor.o(navigateToFeedback),
        ag: common_vendor.o(logout),
        ah: common_vendor.o(checkUpdate),
        ai: showNameDialog.value
      }, showNameDialog.value ? {
        aj: common_vendor.o(hideNameEditDialog),
        ak: newName.value,
        al: common_vendor.o(onNameInput),
        am: common_vendor.o(confirmNameChange),
        an: common_vendor.o(preventBubble)
      } : {}) : {}, {
        ao: identitySelected.value === "管理员"
      }, identitySelected.value === "管理员" ? common_vendor.e({
        ap: userAvatar.value || "https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/default-avatar.png",
        aq: common_vendor.t(userName.value || "用户名"),
        ar: common_vendor.o(showNameEditDialog),
        as: common_vendor.t(userId.value || "123456"),
        at: common_vendor.t(identitySelected.value),
        av: common_vendor.o(navigateToMessages),
        aw: common_vendor.o(navigateToFeedback),
        ax: common_vendor.o(logout),
        ay: common_vendor.o(checkUpdate),
        az: showNameDialog.value
      }, showNameDialog.value ? {
        aA: common_vendor.o(hideNameEditDialog),
        aB: newName.value,
        aC: common_vendor.o(onNameInput),
        aD: common_vendor.o(confirmNameChange),
        aE: common_vendor.o(preventBubble),
        aF: common_vendor.o(hideNameEditDialog)
      } : {}) : {}, {
        aG: identitySelected.value === "研究所专家"
      }, identitySelected.value === "研究所专家" ? common_vendor.e({
        aH: userAvatar.value || "https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/default-avatar.png",
        aI: common_vendor.t(userName.value || "用户名"),
        aJ: common_vendor.o(showNameEditDialog),
        aK: common_vendor.t(userId.value || "123456"),
        aL: common_vendor.t(identitySelected.value),
        aM: userPhoto.value || "https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/default-nurse.png",
        aN: common_vendor.t(userName.value || "陈小云"),
        aO: common_vendor.t(userGender.value || "女"),
        aP: common_vendor.t(userID.value || "440xxxxxxxxxxxxxxx"),
        aQ: common_vendor.t(userCertNo.value || "xxxx"),
        aR: common_vendor.t(hospital.value || "广东省中医院"),
        aS: common_vendor.t(department.value || "检验科"),
        aT: common_vendor.o(navigateToMessages),
        aU: common_vendor.o(navigateToFeedback),
        aV: common_vendor.o(logout),
        aW: common_vendor.o(checkUpdate),
        aX: showNameDialog.value
      }, showNameDialog.value ? {
        aY: common_vendor.o(hideNameEditDialog),
        aZ: newName.value,
        ba: common_vendor.o(onNameInput),
        bb: common_vendor.o(confirmNameChange),
        bc: common_vendor.o(preventBubble),
        bd: common_vendor.o(hideNameEditDialog)
      } : {}) : {}, {
        be: identitySelected.value === "未登录"
      }, identitySelected.value === "未登录" ? common_vendor.e({
        bf: common_assets._imports_0$2,
        bg: common_vendor.o(goLogin),
        bh: common_vendor.o(goLogin),
        bi: common_vendor.o(goLogin),
        bj: common_vendor.o(checkUpdate),
        bk: showNameDialog.value
      }, showNameDialog.value ? {
        bl: common_vendor.o(hideNameEditDialog),
        bm: newName.value,
        bn: common_vendor.o(onNameInput),
        bo: common_vendor.o(confirmNameChange),
        bp: common_vendor.o(preventBubble)
      } : {}) : {});
    };
  }
};
wx.createPage(_sfc_main);
