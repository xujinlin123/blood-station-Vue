"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
<<<<<<< HEAD
const stores_index = require("./stores/index.js");
if (!Math) {
  "./pages/nurse/information/information.js";
=======
if (!Math) {
>>>>>>> 48233f6d8a4fd65c2989f46576947d9a61d95ebf
  "./pages/login/login.js";
  "./pages/register/register.js";
  "./pages/user-service/user-service.js";
  "./pages/privacy-policy/privacy-policy.js";
<<<<<<< HEAD
=======
  "./pages/nurse/information/information.js";
>>>>>>> 48233f6d8a4fd65c2989f46576947d9a61d95ebf
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
<<<<<<< HEAD
  app.use(stores_index.pinia);
  return {
    app,
    pinia: stores_index.pinia
=======
  return {
    app
>>>>>>> 48233f6d8a4fd65c2989f46576947d9a61d95ebf
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
