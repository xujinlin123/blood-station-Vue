"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
<<<<<<< HEAD
=======
<<<<<<< HEAD
  data() {
    return {
      identitySelected: "兼职护士",
      // 存储用户选择的身份
      userName: "张医生",
      // 默认用户名（张医生）
      userId: "MD12345",
      // 默认用户ID
      userAvatar: "https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/头像女孩.png",
      // 默认头像图片路径
      showNameDialog: false,
      // 控制修改姓名对话框的显示
      newName: "",
      // 存储临时输入的新姓名
      userPhoto: "https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/头像女孩.png",
      hospital: "广东省中医院",
      department: "检验科",
      userID: "440xxxxxxxxxxxxxxx",
      userGender: "女",
      userCertNo: "xxxx",
      isPageReady: false,
      userYear: "2024",
      userBlood: "Rh阴性",
      Token: ""
    };
  },
  // 生命周期方法：页面加载时执行
  onLoad(options) {
    this.isPageReady = false;
    common_vendor.index.getStorage({
      key: "userIdentity",
      success: (res) => {
        this.identitySelected = res.data.Identity;
        this.isPageReady = true;
        this.Token = res.data.token;
      },
      fail: () => {
        this.isPageReady = true;
      }
    });
  },
  methods: {
    // 自定义方法：加载用户数据
    loadUserData() {
      const userInfo = common_vendor.index.getStorageSync("userInfo");
      if (userInfo) {
        this.userName = userInfo.name || this.userName;
        this.userId = userInfo.id || this.userId;
        this.userRole = userInfo.role || this.userRole;
        this.userAvatar = userInfo.avatar || this.userAvatar;
      }
    },
    // 显示姓名编辑对话框
    showNameEditDialog() {
      this.showNameDialog = true;
      this.newName = this.userName;
    },
    // 隐藏姓名编辑对话框
    hideNameEditDialog() {
      this.showNameDialog = false;
    },
    // 处理姓名输入变化
    onNameInput(e) {
      this.newName = e.detail.value;
    },
    // 确认修改姓名
    confirmNameChange() {
      if (this.newName.trim()) {
        let userInfo = common_vendor.index.getStorageSync("userInfo") || {};
        userInfo.name = this.newName;
        common_vendor.index.setStorageSync("userInfo", userInfo);
        console.log("token:" + this.Token);
        common_vendor.index.request({
          url: "https://jobguard.online/api/auth/modify-name",
          // 替换为你的后端 API 地址
          method: "POST",
          //请求方式
          header: {
            "Authorization": this.Token,
            "Content-Type": "application/json"
            //请求头格式为json
          },
          //请求体
          data: {
            name: this.newName
=======
>>>>>>> temp-work
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
<<<<<<< HEAD
=======
>>>>>>> 4731ddd (重新上传，修改了进入科普、协议等的文字部分和管理员页面的血库可视化部分)
>>>>>>> temp-work
          },
          success: (res) => {
            console.log("后端返回:", res.data);
            if (res.data.message == "success") {
              common_vendor.index.showToast({
                title: "名字修改成功",
<<<<<<< HEAD
=======
<<<<<<< HEAD
                // "名字修改成功"
                icon: "success"
              });
=======
>>>>>>> temp-work
                icon: "success"
              });
              userName.value = newName.value;
              showNameDialog.value = false;
<<<<<<< HEAD
=======
>>>>>>> 4731ddd (重新上传，修改了进入科普、协议等的文字部分和管理员页面的血库可视化部分)
>>>>>>> temp-work
            } else {
              common_vendor.index.showToast({
                title: res.data.message || "名字修改错误",
                icon: "none"
              });
            }
          },
<<<<<<< HEAD
=======
<<<<<<< HEAD
          //请求失败
=======
>>>>>>> 4731ddd (重新上传，修改了进入科普、协议等的文字部分和管理员页面的血库可视化部分)
>>>>>>> temp-work
          fail: (err) => {
            console.error("请求失败:", err);
            common_vendor.index.showToast({
              title: "网络错误，请稍后重试",
              icon: "none"
            });
          }
        });
<<<<<<< HEAD
=======
<<<<<<< HEAD
        this.userName = this.newName;
        this.showNameDialog = false;
      } else {
        common_vendor.index.showToast({
          title: "名字不能为空",
          // "名字不能为空"
          icon: "error"
        });
      }
    },
    // 阻止事件冒泡（防止事件向上传播）
    preventBubble() {
      return;
    },
    // 导航到"管理捐献者"页面
    navigateToManageDonors() {
      common_vendor.index.navigateTo({
        url: "/pages/manageDonors/manageDonors"
        // 目标页面路径
      });
    },
    // 导航到"审核申请"页面
    navigateToReviewApplications() {
      common_vendor.index.navigateTo({
        url: "/pages/reviewApplications/reviewApplications"
      });
    },
    // 导航到"黑名单"页面
    navigateToBlacklist() {
      common_vendor.index.navigateTo({
        url: "/pages/blacklist/blacklist"
      });
    },
    // 导航到"护士认证"页面
    navigateToNurseCert() {
      common_vendor.index.navigateTo({
        url: "/pages/nurseCert/nurseCert"
      });
    },
    // 导航到"捐献者认证"页面
    navigateToDonorCert() {
      common_vendor.index.navigateTo({
        url: "/pages/donorCert/donorCert"
      });
    },
    // 导航到"捐献记录"页面
    navigateToDonationRecords() {
      common_vendor.index.navigateTo({
        url: "/pages/donationRecords/donationRecords"
      });
    },
    // 导航到"消息"页面
    navigateToMessages() {
      common_vendor.index.navigateTo({
        url: "/pages/messages/messages"
      });
    },
    // 导航到"反馈"页面
    navigateToFeedback() {
      common_vendor.index.navigateTo({
        url: "/pages/feedback/feedback"
      });
    },
    // 退出登录功能
    logout() {
      common_vendor.index.showModal({
        title: "提示",
        // "提示"
        content: "确定要退出登录吗？",
        // "确定要退出登录吗？"
=======
>>>>>>> temp-work
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
<<<<<<< HEAD
=======
>>>>>>> 4731ddd (重新上传，修改了进入科普、协议等的文字部分和管理员页面的血库可视化部分)
>>>>>>> temp-work
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
<<<<<<< HEAD
=======
<<<<<<< HEAD
    },
    // 检查更新
    checkUpdate() {
      common_vendor.index.showLoading({
        title: "检查更新中..."
        // "检查更新中..."
=======
>>>>>>> temp-work
    };
    const checkUpdate = () => {
      common_vendor.index.showLoading({
        title: "检查更新中..."
<<<<<<< HEAD
=======
>>>>>>> 4731ddd (重新上传，修改了进入科普、协议等的文字部分和管理员页面的血库可视化部分)
>>>>>>> temp-work
      });
      setTimeout(() => {
        common_vendor.index.hideLoading();
        common_vendor.index.showModal({
          title: "版本更新",
<<<<<<< HEAD
=======
<<<<<<< HEAD
          // "版本更新"
          content: "当前已是最新版本 v1.0.5",
          // "当前已是最新版本 v1.0.5"
          showCancel: false
          // 不显示取消按钮
        });
      }, 1500);
    },
    // 开始更新（模拟）
    startUpdate() {
      common_vendor.index.showLoading({
        title: "更新中..."
        // "更新中..."
      });
      setTimeout(() => {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "更新成功",
          // "更新成功"
          icon: "success"
        });
      }, 2e3);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.userAvatar || "https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/default-avatar.png",
    b: common_vendor.t($data.userName || "用户名"),
    c: common_vendor.o((...args) => $options.showNameEditDialog && $options.showNameEditDialog(...args)),
    d: common_vendor.t($data.userId || "123456"),
    e: common_vendor.t($data.identitySelected),
    f: $data.userPhoto || "https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/default-nurse.png",
    g: common_vendor.t($data.userName || "陈小云"),
    h: common_vendor.t($data.userGender || "女"),
    i: common_vendor.t($data.userID || "440xxxxxxxxxxxxxxx"),
    j: common_vendor.t($data.userCertNo || "xxxx"),
    k: common_vendor.t($data.hospital || "广东省中医院"),
    l: common_vendor.t($data.department || "检验科"),
    m: common_vendor.o((...args) => $options.navigateToMessages && $options.navigateToMessages(...args)),
    n: common_vendor.o((...args) => $options.navigateToFeedback && $options.navigateToFeedback(...args)),
    o: common_vendor.o((...args) => $options.logout && $options.logout(...args)),
    p: common_vendor.o((...args) => $options.checkUpdate && $options.checkUpdate(...args)),
    q: $data.showNameDialog
  }, $data.showNameDialog ? {
    r: common_vendor.o((...args) => $options.hideNameEditDialog && $options.hideNameEditDialog(...args)),
    s: $data.newName,
    t: common_vendor.o((...args) => $options.onNameInput && $options.onNameInput(...args)),
    v: common_vendor.o((...args) => $options.confirmNameChange && $options.confirmNameChange(...args)),
    w: common_vendor.o((...args) => $options.preventBubble && $options.preventBubble(...args))
  } : {}, {
    x: $data.userAvatar || "https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/default-avatar.png",
    y: common_vendor.t($data.userName || "用户名"),
    z: common_vendor.o((...args) => $options.showNameEditDialog && $options.showNameEditDialog(...args)),
    A: common_vendor.t($data.userId || "123456"),
    B: common_vendor.t($data.identitySelected),
    C: common_vendor.o((...args) => $options.navigateToMessages && $options.navigateToMessages(...args)),
    D: common_vendor.o((...args) => $options.navigateToFeedback && $options.navigateToFeedback(...args)),
    E: common_vendor.o((...args) => $options.logout && $options.logout(...args)),
    F: common_vendor.o((...args) => $options.checkUpdate && $options.checkUpdate(...args)),
    G: $data.showNameDialog
  }, $data.showNameDialog ? {
    H: common_vendor.o((...args) => $options.hideNameEditDialog && $options.hideNameEditDialog(...args)),
    I: $data.newName,
    J: common_vendor.o((...args) => $options.onNameInput && $options.onNameInput(...args)),
    K: common_vendor.o((...args) => $options.confirmNameChange && $options.confirmNameChange(...args)),
    L: common_vendor.o((...args) => $options.preventBubble && $options.preventBubble(...args)),
    M: common_vendor.o((...args) => $options.hideNameEditDialog && $options.hideNameEditDialog(...args))
  } : {}, {
    N: $data.userAvatar || "https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/default-avatar.png",
    O: common_vendor.t($data.userName || "用户名"),
    P: common_vendor.o((...args) => $options.showNameEditDialog && $options.showNameEditDialog(...args)),
    Q: common_vendor.t($data.userId || "123456"),
    R: common_vendor.t($data.identitySelected),
    S: $data.userPhoto || "https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/default-nurse.png",
    T: common_vendor.t($data.userName || "陈小云"),
    U: common_vendor.t($data.userGender || "女"),
    V: common_vendor.t($data.userID || "440xxxxxxxxxxxxxxx"),
    W: common_vendor.t($data.userCertNo || "xxxx"),
    X: common_vendor.t($data.hospital || "广东省中医院"),
    Y: common_vendor.t($data.department || "检验科"),
    Z: common_vendor.o((...args) => $options.navigateToMessages && $options.navigateToMessages(...args)),
    aa: common_vendor.o((...args) => $options.navigateToFeedback && $options.navigateToFeedback(...args)),
    ab: common_vendor.o((...args) => $options.logout && $options.logout(...args)),
    ac: common_vendor.o((...args) => $options.checkUpdate && $options.checkUpdate(...args)),
    ad: $data.showNameDialog
  }, $data.showNameDialog ? {
    ae: common_vendor.o((...args) => $options.hideNameEditDialog && $options.hideNameEditDialog(...args)),
    af: $data.newName,
    ag: common_vendor.o((...args) => $options.onNameInput && $options.onNameInput(...args)),
    ah: common_vendor.o((...args) => $options.confirmNameChange && $options.confirmNameChange(...args)),
    ai: common_vendor.o((...args) => $options.preventBubble && $options.preventBubble(...args)),
    aj: common_vendor.o((...args) => $options.hideNameEditDialog && $options.hideNameEditDialog(...args))
  } : {}, {
    ak: $data.userAvatar || "https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/default-avatar.png",
    al: common_vendor.t($data.userName || "用户名"),
    am: common_vendor.o((...args) => $options.showNameEditDialog && $options.showNameEditDialog(...args)),
    an: common_vendor.t($data.userId || "123456"),
    ao: common_vendor.t($data.identitySelected),
    ap: $data.userPhoto || "https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/default-nurse.png",
    aq: common_vendor.t($data.userName || "陈小云"),
    ar: common_vendor.t($data.userGender || "女"),
    as: common_vendor.t($data.userBlood || "Rh阴性"),
    at: common_vendor.t($data.userID || "440xxxxxxxxxxxxxxx"),
    av: common_vendor.t($data.userYear || "2024"),
    aw: common_vendor.o((...args) => $options.navigateToDonationRecords && $options.navigateToDonationRecords(...args)),
    ax: common_vendor.o((...args) => $options.navigateToDonationRecords && $options.navigateToDonationRecords(...args)),
    ay: common_vendor.o((...args) => $options.navigateToMessages && $options.navigateToMessages(...args)),
    az: common_vendor.o((...args) => $options.navigateToFeedback && $options.navigateToFeedback(...args)),
    aA: common_vendor.o((...args) => $options.logout && $options.logout(...args)),
    aB: common_vendor.o((...args) => $options.checkUpdate && $options.checkUpdate(...args)),
    aC: $data.showNameDialog
  }, $data.showNameDialog ? {
    aD: common_vendor.o((...args) => $options.hideNameEditDialog && $options.hideNameEditDialog(...args)),
    aE: $data.newName,
    aF: common_vendor.o((...args) => $options.onNameInput && $options.onNameInput(...args)),
    aG: common_vendor.o((...args) => $options.confirmNameChange && $options.confirmNameChange(...args)),
    aH: common_vendor.o((...args) => $options.preventBubble && $options.preventBubble(...args)),
    aI: common_vendor.o((...args) => $options.hideNameEditDialog && $options.hideNameEditDialog(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
=======
>>>>>>> temp-work
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
<<<<<<< HEAD
=======
>>>>>>> 4731ddd (重新上传，修改了进入科普、协议等的文字部分和管理员页面的血库可视化部分)
>>>>>>> temp-work
