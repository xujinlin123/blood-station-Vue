"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const stores_index = require("./stores/index.js");
if (!Math) {
  "./pages/nurse/information/information.js";
  "./pages/login/login.js";
  "./pages/register/register.js";
  "./pages/user-service/user-service.js";
  "./pages/privacy-policy/privacy-policy.js";
  "./pages/nurse/community/community.js";
  "./pages/nurse/profile/profile.js";
}
const _sfc_main = {
  onLaunch: function() {
    console.log("App Launch");
  },
  onShow: function() {
    console.log("App Show");
  },
  onHide: function() {
    console.log("App Hide");
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  app.use(stores_index.pinia);
  return {
    app,
    pinia: stores_index.pinia
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
