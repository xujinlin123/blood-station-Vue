"use strict";
const common_vendor = require("../../../common/vendor.js");
const common_assets = require("../../../common/assets.js");
if (!Math) {
  customFab();
}
const customFab = () => "../../../components/CustomFab.js";
const _sfc_main = {
  __name: "information",
  setup(__props) {
    const identitySelected = common_vendor.ref("");
    const scrollHeight = common_vendor.ref(250);
    const showPopup = common_vendor.ref(false);
    const showRecruitPage = common_vendor.ref(false);
    const showInfoPage = common_vendor.ref(false);
    const bloodTypes = common_vendor.ref(["Rh", "p", "JK"]);
    const selectedBloodType = common_vendor.ref("请选择血型");
    const conditions = common_vendor.ref(["标准", "自定义"]);
    const selectedCondition = common_vendor.ref("请选择献血条件");
    const recruitData = common_vendor.ref({});
    const infoList = common_vendor.ref([]);
    const recruitType = common_vendor.ref("emergency");
    const infoType = common_vendor.ref("emergency");
    const Token = common_vendor.ref("");
    const activities = common_vendor.ref([
      {
        id: 1,
        title: "稀有血型O型Rh阴性献血",
        count: 32,
        isSigned: false,
        imageUrl: "https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/献血活动海报.png"
      },
      {
        id: 2,
        title: "AB型血献血者紧急招募",
        count: 18,
        isSigned: false,
        imageUrl: "https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/献血活动海报2.png"
      },
      {
        id: 3,
        title: "AB型血献血者紧急招募",
        count: 25,
        isSigned: false,
        imageUrl: "https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/献血活动海报2.png"
      }
    ]);
    const showDonorInfoPage = common_vendor.ref(false);
    const donorList = common_vendor.ref([
      { id: 1, name: "李想", bloodType: "Rh阴型", age: "21周岁" },
      { id: 2, name: "陈毅", bloodType: "Rh阴型", age: "21周岁" }
    ]);
    const scienceList = common_vendor.ref([
      {
        question: "我是O型血，我是万能的吗？",
        answer: "O型血是万能献血者，但只能接受O型血。O型血的红细胞没有A、B抗原，但血浆中含有抗A和抗B抗体，因此只能少量输给其他血型。",
        isOpen: false
      },
      {
        question: "稀有血型有哪几种？",
        answer: "主要包括Rh阴性血型（如熊猫血）、孟买型、JK表型等。",
        isOpen: false
      },
      {
        question: '"熊猫血"是什么？"熊猫血"有多珍稀？',
        answer: "Rh阴性血型的俗称，在中国汉族人口中仅占0.3%。",
        subAnswer: "因稀缺性类似熊猫，故得名。需特别注意血源储备。",
        isOpen: false
      }
    ]);
    const showAnswerPage = common_vendor.ref(false);
    const currentQuestion = common_vendor.ref("");
    const currentAnswer = common_vendor.ref("");
    const currentSubAnswer = common_vendor.ref("");
    const showAnswerDialog = (e) => {
      const index = e.currentTarget.dataset.index;
      const item = scienceList.value[index] || {};
      console.log("点击问题：", item);
      showAnswerPage.value = true;
      currentQuestion.value = item.question || "问题加载失败";
      currentAnswer.value = item.answer || "答案未提供";
      currentSubAnswer.value = item.subAnswer || "";
    };
    const goToDonorInfoPage = () => {
      showRecruitPage.value = false;
      showDonorInfoPage.value = true;
    };
    const toggleSign = (e) => {
      const index = e.currentTarget.dataset.index;
      activities.value = activities.value.map((item, i) => {
        if (i === index) {
          return {
            ...item,
            isSigned: !item.isSigned,
            count: item.count + (item.isSigned ? -1 : 1)
          };
        }
        return item;
      });
    };
    const goToRecruitPage = (e) => {
      const type = e.currentTarget.dataset.type;
      showRecruitPage.value = true;
      recruitType.value = type;
    };
    const goBack = () => {
      showRecruitPage.value = false;
      showDonorInfoPage.value = false;
      showPopup.value = false;
      showAnswerPage.value = false;
    };
    const openPopup = () => {
      showPopup.value = true;
    };
    const closePopup = () => {
      showPopup.value = false;
    };
    const onBloodTypeChange = (e) => {
      selectedBloodType.value = bloodTypes.value[e.detail.value];
    };
    const onConditionChange = (e) => {
      selectedCondition.value = conditions.value[e.detail.value];
    };
    const onInputChange = (e) => {
      const field = e.currentTarget.dataset.field;
      const value = e.detail.value;
      recruitData.value = { ...recruitData.value, [field]: value };
    };
    const submitRecruitment = () => {
      console.log("提交招募信息2");
      if (selectedBloodType.value === "请选择血型" || selectedCondition.value === "请选择献血条件") {
        common_vendor.index.showToast({ title: "请选择血型和献血条件", icon: "none" });
        return;
      }
      console.log(selectedBloodType.value);
      const newRecruit = {
        bloodType: selectedBloodType.value,
        recruitTime: recruitData.value.recruitTime || "未填写",
        location: recruitData.value.location || "未填写",
        targetGroup: recruitData.value.targetGroup || "未填写",
        recruitNumber: recruitData.value.recruitNumber || "未填写",
        condition: selectedCondition.value,
        timestamp: (/* @__PURE__ */ new Date()).getTime()
      };
      console.log(recruitData.value);
      console.log(recruitData.value["targetGroup"]);
      common_vendor.index.request({
        url: "https://jobguard.online/api/activity/publish-activity",
        method: "POST",
        header: {
          "Authorization": Token.value,
          "Content-Type": "application/json"
        },
        data: {
          "bloodType": selectedBloodType.value,
          "timeRange": recruitData.value["recruitTime"],
          "address": recruitData.value["location"],
          "targetPeople": recruitData.value["targetGroup"],
          "maxParticipateCount": recruitData.value["recruitNumber"],
          "needs": selectedCondition.value,
          "isEmergency": "true",
          "coverUrl": "https://img.tusij.com/tgs_assets/ips_templ_preview/25/c0/9b/lg_3403740_1614845676_604096ec325be.jpg?auth_key=2315410104-0-0-b848c59237ac0883581cddafd780ae65&x-oss-process=image/resize,m_fixed,h_298,w_700",
          "title": "111"
        },
        success: (res) => {
          console.log("后端返回:", res.data);
        },
        fail: (err) => {
          console.error("请求失败:", err);
          common_vendor.index.showToast({
            title: "网络错误，请稍后重试",
            icon: "none"
          });
        }
      });
      infoList.value = [newRecruit, ...infoList.value];
      showPopup.value = false;
      selectedBloodType.value = "请选择血型";
      selectedCondition.value = "请选择献血条件";
      recruitData.value = {};
      common_vendor.index.showToast({ title: "发布成功", icon: "success" });
    };
    common_vendor.onLoad(() => {
      common_vendor.index.getStorage({
        key: "userIdentity",
        success: (res) => {
          identitySelected.value = res.data.Identity;
          Token.value = res.data.token;
          console.log(res.data);
          console.log(identitySelected.value);
        },
        fail: () => {
          console.error("获取数据失败");
        }
      });
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: !showRecruitPage.value && !showDonorInfoPage.value && !showAnswerPage.value
      }, !showRecruitPage.value && !showDonorInfoPage.value && !showAnswerPage.value ? common_vendor.e({
        b: identitySelected.value == "兼职护士"
      }, identitySelected.value == "兼职护士" ? {
        c: common_vendor.o(goToRecruitPage),
        d: common_vendor.o(goToRecruitPage),
        e: common_assets._imports_0,
        f: common_vendor.o((...args) => _ctx.goToLecturePage && _ctx.goToLecturePage(...args)),
        g: common_vendor.o(goToDonorInfoPage)
      } : {}, {
        h: identitySelected.value == "管理员"
      }, identitySelected.value == "管理员" ? {
        i: common_vendor.o((...args) => _ctx.goToActivityCheck && _ctx.goToActivityCheck(...args)),
        j: common_vendor.o(goToDonorInfoPage)
      } : {}, {
        k: identitySelected.value == "研究所专家"
      }, identitySelected.value == "研究所专家" ? {
        l: common_vendor.o(goToRecruitPage)
      } : {}, {
        m: identitySelected.value == "献血者"
      }, identitySelected.value == "献血者" ? {
        n: common_vendor.o(goToRecruitPage)
      } : {}, {
        o: common_vendor.f(scienceList.value, (item, index, i0) => {
          return {
            a: `https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/hoticon${index + 1}.png`,
            b: common_vendor.t(item.question),
            c: common_vendor.o(showAnswerDialog, index),
            d: index,
            e: index
          };
        }),
        p: common_vendor.f(activities.value, (item, index, i0) => {
          return {
            a: item.imageUrl || "https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/献血活动海报.png",
            b: common_vendor.t(item.title),
            c: common_vendor.t(item.count),
            d: common_vendor.t(item.isSigned ? "已报名" : "报名"),
            e: common_vendor.n(item.isSigned ? "signed" : ""),
            f: common_vendor.o(toggleSign, item.id),
            g: index,
            h: item.id
          };
        }),
        q: common_vendor.s("height: " + scrollHeight.value + "px;")
      }) : {}, {
        r: showRecruitPage.value
      }, showRecruitPage.value ? common_vendor.e({
        s: common_vendor.o(goBack),
        t: common_vendor.t(recruitType.value === "emergency" ? "紧急信息发布中心" : "献血活动发布中心"),
        v: common_vendor.f(infoList.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.bloodType),
            b: common_vendor.t(item.recruitTime),
            c: common_vendor.t(item.location),
            d: common_vendor.t(item.targetGroup),
            e: common_vendor.t(item.recruitNumber),
            f: common_vendor.t(item.condition),
            g: item.timestamp
          };
        }),
        w: common_vendor.t(recruitType.value === "emergency" ? "发布紧急招募活动" : "发布招募活动"),
        x: common_vendor.o(openPopup),
        y: showPopup.value
      }, showPopup.value ? {
        z: common_vendor.o(closePopup),
        A: common_vendor.t(recruitType.value === "emergency" ? "发布紧急招募信息" : "发布招募活动"),
        B: common_vendor.t(selectedBloodType.value),
        C: bloodTypes.value,
        D: common_vendor.o(onBloodTypeChange),
        E: common_vendor.o(onInputChange),
        F: common_vendor.o(onInputChange),
        G: common_vendor.o(onInputChange),
        H: common_vendor.o(onInputChange),
        I: common_vendor.t(selectedCondition.value),
        J: conditions.value,
        K: common_vendor.o(onConditionChange),
        L: common_vendor.o(submitRecruitment)
      } : {}) : {}, {
        M: showDonorInfoPage.value
      }, showDonorInfoPage.value ? {
        N: common_vendor.o(goBack),
        O: common_vendor.f(donorList.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.name || "未命名"),
            b: common_vendor.t(item.bloodType || "未知"),
            c: common_vendor.t(item.age || "未知"),
            d: common_vendor.t(JSON.stringify(item)),
            e: item.id
          };
        })
      } : {}, {
        P: showInfoPage.value
      }, showInfoPage.value ? {
        Q: common_vendor.o(goBack),
        R: common_vendor.t(infoType.value === "emergency" ? "紧急信息发布中心" : "已报名活动")
      } : {}, {
        S: showAnswerPage.value
      }, showAnswerPage.value ? common_vendor.e({
        T: common_vendor.o(goBack),
        U: common_vendor.t(currentQuestion.value),
        V: common_vendor.t(currentAnswer.value),
        W: currentSubAnswer.value
      }, currentSubAnswer.value ? {
        X: common_vendor.t(currentSubAnswer.value)
      } : {}) : {});
    };
  }
};
wx.createPage(_sfc_main);
