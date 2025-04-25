"use strict";
const common_vendor = require("../../../common/vendor.js");
const markdownIt = require('../../../common/markdown-it.js'); 
const _sfc_main = {
  data() {
    return {
      activeTab: "science",
      // 默认的功能选择
      sciencePosts: [
        {
          id: 1,
          authorName: "张医生",
          authorTitle: "血液科专家",
          authorAvatar: "https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/头像.png",
          title: "Rh阴性血型知识全解析",
          content: "Rh阴性血型在中国人群中的比例约为0.3%，属于稀有血型。这类献血者对医疗急救具有重要意义，特别是对于需要紧急输血的Rh阴性患者...",
          likes: 128,
          isLiked: false,
          isFavorited: false
        },
        {
          id: 2,
          authorName: "李研究员",
          authorTitle: "血液研究中心",
          authorAvatar: "https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/头像女孩.png",
          title: "了解稀有血型的重要性",
          content: "稀有血型捐献者是医疗体系中的宝贵资源。A型RhD阴性、B型RhD阴性、AB型RhD阴性和O型RhD阴性血型的人群在中国占比很小，但这些血型对某些特定患者的治疗至关重要...",
          likes: 85,
          isLiked: false,
          isFavorited: false
        }
      ],
      qaHistory: [],
      //当前对话框中的对话内容
      currentQuestion: "",
      //当前问题
      historyList: [],
      //历史列表
      showHistoryModal: false,
      //布尔变量用于控制列表框的显示和隐藏
      showAttachmentModal: false,
      currentChatId: null,
      // 当前对话的ID
      deleSessionId: null,
      //要删除的对话ID
      Token: "",
      loading: false,
      // 控制附件弹窗显示
      attachedImage: null,
      // 选择的图片路径
      attachedDoc: null,
      // 文档附件（Word/PDF/Excel）
      showPreviewModal: false,
      // 控制图片放大预览弹窗显示
      markdownRenderer: null,
      // 用于存储 markdown 渲染器实例
      scrollTop: 0, 
      scrollViewId: "scroll-bottom"
    };
  },
  onLoad() {
    common_vendor.index.getStorage({
      key: "userIdentity",
      success: (res) => {
        this.Token = res.data.token;
      }
    });
    try {
      // Make sure markdownIt is correctly imported
      this.markdownRenderer = new markdownIt();
      console.log("Markdown renderer initialized:", this.markdownRenderer);
    } catch (error) {
      console.error("Failed to initialize markdown renderer:", error);
      // Provide a fallback renderer to avoid null errors
      this.markdownRenderer = {
        render: function(text) {
          return text; // Simple fallback that just returns the original text
        }
      };
    }
  },
  onShow() {
    const selectedTab = common_vendor.index.getStorageSync("SELECTED_TAB");
    if (selectedTab) {
      this.activeTab = selectedTab;
      this.loadChatHistory();
      this.newChat();
      common_vendor.index.removeStorageSync("SELECTED_TAB");
    }
  },
  methods: {
    // 功能栏选择功能
    switchTab(e) {
      const tab = e.currentTarget.dataset.tab;
      this.activeTab = tab;
      this.loadChatHistory();
      this.newChat();
    },
    // 切换点赞图标
    toggleLike(e) {
      const postId = e.currentTarget.dataset.id;
      const posts = this.sciencePosts;
      const postIndex = posts.findIndex((post) => post.id === postId);
      if (postIndex !== -1) {
        const isLiked = posts[postIndex].isLiked;
        posts[postIndex].isLiked = !isLiked;
        posts[postIndex].likes = isLiked ? posts[postIndex].likes - 1 : posts[postIndex].likes + 1;
        this.sciencePosts = posts;
      }
    },
    // 切换收藏图标
    toggleFavorite(e) {
      const postId = e.currentTarget.dataset.id;
      const posts = this.sciencePosts;
      const postIndex = posts.findIndex((post) => post.id === postId);
      console.log("准备收藏");
      if (postIndex !== -1) {
        posts[postIndex].isFavorited = !posts[postIndex].isFavorited;
        this.sciencePosts = posts;
      }
    },
    // 监听输入框
    inputQuestion(e) {
      this.currentQuestion = e.detail.value;
    },
    // 删除图片附件
    removeAttachedImage() {
      this.attachedImage = null;
    },
    // 删除文档附件
    removeAttachedDoc() {
      this.attachedDoc = null;
    },
    // 打开图片预览弹窗（仅图片附件支持预览）
    openPreview() {
      this.showPreviewModal = true;
    },
    // 关闭图片预览弹窗
    closePreview() {
      this.showPreviewModal = false;
    },
    // 选择图片附件
    chooseImage() {
      common_vendor.index.chooseImage({
        count: 1,
        sizeType: ["original", "compressed"],
        sourceType: ["album"],
        success: (res) => {
          this.attachedImage = res.tempFilePaths[0];
          this.showAttachmentModal = false;
        },
        fail: (err) => {
          console.error("选择图片失败：", err);
          this.showAttachmentModal = false;
        }
      });
    },
    // 选择 Word 文档
    chooseWord() {
      common_vendor.index.chooseFile({
        count: 1,
        type: "file",
        extension: ["doc", "docx"],
        success: (res) => {
          const file = res.tempFiles[0];
          this.attachedDoc = {
            type: "word",
            path: file.path,
            name: file.name || "Word文档"
          };
          this.showAttachmentModal = false;
        },
        fail: (err) => {
          console.error("选择Word文档失败：", err);
          this.showAttachmentModal = false;
        }
      });
    },
    // 选择 PDF 文档
    choosePdf() {
      common_vendor.index.chooseFile({
        count: 1,
        type: "file",
        extension: ["pdf"],
        success: (res) => {
          const file = res.tempFiles[0];
          this.attachedDoc = {
            type: "pdf",
            path: file.path,
            name: file.name || "PDF文档"
          };
          this.showAttachmentModal = false;
        },
        fail: (err) => {
          console.error("选择PDF文档失败：", err);
          this.showAttachmentModal = false;
        }
      });
    },
    // 选择 Excel 表格
    chooseExcel() {
      common_vendor.index.chooseFile({
        count: 1,
        type: "file",
        extension: ["xls", "xlsx"],
        success: (res) => {
          const file = res.tempFiles[0];
          this.attachedDoc = {
            type: "excel",
            path: file.path,
            name: file.name || "Excel表格"
          };
          this.showAttachmentModal = false;
        },
        fail: (err) => {
          console.error("选择Excel表格失败：", err);
          this.showAttachmentModal = false;
        }
      });
    },
    // 发送问题，并根据附件情况调用不同的请求逻辑
    sendQuestion() {
      let question = this.currentQuestion.trim();
      const { attachedImage, attachedDoc } = this;
      if ((attachedImage || attachedDoc) && !question) {
        question = "附件内容是什么？";
      }
      if (!question && !attachedImage && !attachedDoc) {
        return;
      }
      const qaHistory = this.qaHistory;
      qaHistory.push({
        role: "user",
        content: question,
        attachment: attachedImage ? { type: "image", path: attachedImage } : attachedDoc ? { type: attachedDoc.type, path: attachedDoc.path, name: attachedDoc.name } : null
      });
      this.qaHistory = qaHistory;
      this.currentQuestion = "";
      this.attachedImage = null;
      this.attachedDoc = null;
      this.saveChatHistory();
      const aiReply = { role: "ai", content: "", htmlContent: "" };
      qaHistory.push(aiReply);
      this.qaHistory = qaHistory;
      this.loading = true;
      if (attachedImage) {
        common_vendor.index.getFileSystemManager().readFile({
          filePath: attachedImage,
          encoding: "base64",
          success: (res) => {
            const base64Image = res.data;
            const payload = {
              model: "glm-4v",
              messages: [
                {
                  role: "user",
                  content: [
                    { type: "image_url", image_url: { url: base64Image } },
                    { type: "text", text: question + " 字数限定于200字" }
                  ]
                }
              ]
            };
            common_vendor.index.request({
              url: "https://open.bigmodel.cn/api/paas/v4/chat/completions",
              method: "POST",
              header: {
                "Content-Type": "application/json",
                "Authorization": "Bearer bd62dc89ee6a1c34f3c72dfac96f58a5.2GA3Q4wOK7GUaC7f"
              },
              data: JSON.stringify(payload),
              success: (res2) => {
                this.processAiResponse(res2.data, aiReply);
              },
              fail: (err) => {
                console.error("图片处理请求错误:", err);
                this.loading = false;
              }
            });
          },
          fail: (err) => {
            console.error("读取图片失败:", err);
            this.loading = false;
          }
        });
      } else if (attachedDoc) {
        console.log("已成功读取附件/word/pdf/excel");
        const mimeMapping = {
          word: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          // 对于 docx 文件
          pdf: "application/pdf",
          excel: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          // 对于 xlsx 文件
        };
        common_vendor.index.getFileSystemManager().readFile({
          filePath: attachedDoc.path,
          encoding: "base64",
          success: (res) => {
            console.log("成功将文档转换为Base64");
            const base64Doc = res.data;
            const mimeType = mimeMapping[attachedDoc.type] || "application/octet-stream";
            const dataUrl = "data:" + mimeType + ";base64," + base64Doc;
            const payload = {
              model: "glm-4",
              messages: [
                {
                  role: "user",
                  content: [
                    {
                      type: "file",
                      file_url: {
                        url: dataUrl
                      }
                    },
                    { type: "text", text: question + " 最长回答限定于350字" }
                  ]
                }
              ]
            };
            common_vendor.index.request({
              url: "https://open.bigmodel.cn/api/paas/v4/chat/completions",
              method: "POST",
              header: {
                "Content-Type": "application/json",
                "Authorization": "Bearer bd62dc89ee6a1c34f3c72dfac96f58a5.2GA3Q4wOK7GUaC7f"
              },
              data: JSON.stringify(payload),
              success: (res2) => {
                console.log("打印文档请求结果");
                console.log(res2.data);
                this.processAiResponse(res2.data, aiReply);
              },
              fail: (error) => {
                console.error("请求错误:", error);
                this.loading = false;
              }
            });
          },
          fail: (err) => {
            console.error("读取文档失败:", err);
            this.loading = false;
          }
        });
      } else {
        common_vendor.index.request({
          url: "https://jobguard.online/api/ai/stream-chat",
          method: "POST",
          header: {
            "Authorization": this.Token,
            "Content-Type": "application/json"
          },
          data: JSON.stringify({ input: question + "最长回答限定于350字", sessionId: this.currentChatId }),
          success: (res) => {
            if (res.data) {
              this.processAiResponse(res.data, aiReply);
            }
          },
          fail: (error) => {
            console.error("请求错误:", error);
            this.loading = false;
          }
        });
      }
      this.scrollToBottom(); // 用户发送消息后滚动
    },
    // 处理 AI 回复
processAiResponse(responseData, aiReply) {
  let text = "";
  const qaHistory = this.qaHistory;
  
  // 解析响应数据，提取文本内容
  if (typeof responseData === "string") {
    text = responseData;
  } else if (typeof responseData === "object") {
    if (responseData.choices && responseData.choices[0] && responseData.choices[0].message && responseData.choices[0].message.content) {
      text = responseData.choices[0].message.content;
    } else {
      text = JSON.stringify(responseData);
    }
  }
  
  // 处理可能的数据流格式
  const lines = text.split("\n");
  const processedContent = lines
    .map((line) => line.replace(/^data:/, "").trim())
    .filter((line) => line.length > 0)
    .join("");
  
  // AI消息初始状态
  aiReply.content = "";
  aiReply.htmlContent = "";
  this.qaHistory = qaHistory;
  
  let currentText = "";
  let charIndex = 0;
  
  // 打字效果函数
  const typeWriter = () => {
    if (charIndex < processedContent.length) {
      // 添加一个字符
      currentText += processedContent[charIndex];
      aiReply.content = currentText;
      this.qaHistory = [...qaHistory]; 
      
      // 每添加几个字符就滚动一次
      if (charIndex % 20 === 0) {
        this.scrollToBottom();
      }
      
      // 继续打字效果
      charIndex++;
      setTimeout(typeWriter, 15);
    } else {
      // 打字结束时也滚动
      aiReply.htmlContent = this.markdownRenderer.render(currentText);
      this.qaHistory = [...qaHistory];
      this.loading = false;
      this.scrollToBottom();
    }
  };
  
  // 开始打字效果
  typeWriter();
},
    // 滚动到底部
     scrollToBottom() {
      // 更新scrollViewId触发滚动
      this.scrollViewId = "";
      setTimeout(() => {
        this.scrollViewId = "scroll-bottom";
      }, 10);
    },
    // 创建新对话
    newChat() {
      if (this.qaHistory.length > 0) {
        this.saveChatHistory();
      }
      common_vendor.index.request({
        url: "https://jobguard.online/api/ai/create-session",
        method: "POST",
        header: {
          "Authorization": this.Token,
          "Content-Type": "application/json"
        },
        success: (res) => {
          console.log("打印创建新对话框res.data");
          console.log(res.data);
          if (res.data) {
            console.log("新的对话框ID");
            console.log(res.data.data);
            this.qaHistory = [];
            this.currentChatId = res.data.data;
            console.log("currentChatId");
            console.log(this.currentChatId);
          }
        },
        fail: (err) => {
          console.error("创建新会话失败:", err);
        }
      });
    },
    // 保存对话历史
    saveChatHistory() {
      var _a;
      if (this.qaHistory.length === 0)
        return;
      const chatHistory = common_vendor.index.getStorageSync("chatHistory") || [];
      const existingIndex = chatHistory.findIndex((item) => item.id === this.currentChatId);
      const firstQuestion = ((_a = this.qaHistory.find((msg) => msg.role === "user")) == null ? void 0 : _a.content) || "";
      const title = firstQuestion.length > 5 ? firstQuestion.substring(0, 5) + "..." : firstQuestion;
      const chatData = {
        id: this.currentChatId,
        title,
        date: this.formatDate(/* @__PURE__ */ new Date()),
        messages: this.qaHistory,
        timestamp: Date.now()
      };
      if (existingIndex !== -1) {
        chatHistory[existingIndex] = chatData;
      } else {
        chatHistory.unshift(chatData);
      }
      common_vendor.index.setStorageSync("chatHistory", chatHistory);
      this.loadChatHistory();
    },
    // 加载历史聊天记录
    loadChatHistory() {
      const chatHistory = common_vendor.index.getStorageSync("chatHistory") || [];
      this.historyList = chatHistory;
    },
    // 打开历史记录弹窗
    viewHistory() {
      this.loadChatHistory();
      this.showHistoryModal = true;
    },
    // 关闭历史记录弹窗
    closeHistory() {
      this.showHistoryModal = false;
    },
    // 加载指定的历史对话
    loadHistoryChat(e) {
      const chatId = e.currentTarget.dataset.id;
      const chatHistory = common_vendor.index.getStorageSync("chatHistory") || [];
      const chat = chatHistory.find((item) => item.id === chatId);
      if (chat) {
        this.qaHistory = chat.messages;
        this.currentChatId = chatId;
        this.showHistoryModal = false;
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      }
      this.$nextTick(() => {
        this.scrollToBottom();
      });
    },
    // 打开附件弹窗
    addAttachment() {
      this.showAttachmentModal = true;
    },
    // 关闭附件弹窗
    closeAttachmentModal() {
      this.showAttachmentModal = false;
    },
    // 格式化日期: YYYY-MM-DD
    formatDate(date) {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
    // 删除历史对话项
    deleteHistoryItem(e) {
      e.stopPropagation && e.stopPropagation();
      const chatId = e.currentTarget.dataset.id;
      common_vendor.index.showModal({
        title: "提示",
        content: "是否确定删除该对话？",
        success: (res) => {
          if (res.confirm) {
            let chatHistory = common_vendor.index.getStorageSync("chatHistory") || [];
            chatHistory = chatHistory.filter((item) => item.id !== chatId);
            common_vendor.index.setStorageSync("chatHistory", chatHistory);
            this.historyList = chatHistory;
            console.log("点击后的对话项ID");
            console.log(chatId);
            common_vendor.index.request({
              url: `https://jobguard.online/api/ai/delete-session?sessionId=${chatId}`,
              method: "POST",
              header: {
                "Authorization": this.Token,
                "Content-Type": "application/json"
              },
              success: (res2) => {
                console.log("删除对话成功:", res2);
              },
              fail: (err) => {
                console.error("删除对话请求失败:", err);
              }
            });
          }
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.n($data.activeTab === "science" ? "active" : ""),
    b: common_vendor.o((...args) => $options.switchTab && $options.switchTab(...args)),
    c: common_vendor.n($data.activeTab === "ai" ? "active" : ""),
    d: common_vendor.o((...args) => $options.switchTab && $options.switchTab(...args)),
    e: $data.activeTab === "science"
  }, $data.activeTab === "science" ? {
    f: common_vendor.f($data.sciencePosts, (item, index, i0) => {
      return {
        a: item.authorAvatar,
        b: common_vendor.t(item.authorName),
        c: common_vendor.t(item.authorTitle),
        d: common_vendor.t(item.title),
        e: common_vendor.t(item.content),
        f: item.isLiked ? "https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/已点赞.png" : "https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/未点赞.png",
        g: common_vendor.t(item.likes),
        h: common_vendor.o((...args) => $options.toggleLike && $options.toggleLike(...args), item.id),
        i: item.id,
        j: item.isFavorited ? "https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/已收藏.png" : "https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/未收藏.png",
        k: common_vendor.o((...args) => $options.toggleFavorite && $options.toggleFavorite(...args), item.id),
        l: item.id,
        m: item.id
      };
    })
  } : {}, {
    g: $data.activeTab === "ai"
  }, $data.activeTab === "ai" ? common_vendor.e({
    h: common_vendor.o((...args) => $options.viewHistory && $options.viewHistory(...args)),
    i: common_vendor.f($data.qaHistory, (item, index, i0) => {
      return common_vendor.e({
        a: item.role === "user" ? "https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/头像女孩.png" : "https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/头像.png",
        b: item.attachment && item.attachment.type === "image"
      }, item.attachment && item.attachment.type === "image" ? {
        c: item.attachment.path
      } : {}, {
        d: item.role === "ai" && $data.loading && !item.content
      }, item.role === "ai" && $data.loading && !item.content ? {} : item.role === "ai" && item.htmlContent ? {
        f: item.htmlContent
      } : item.content ? {
        h: common_vendor.t(item.content)
      } : {}, {
        e: item.role === "ai" && item.htmlContent,
        g: item.content,
        i: common_vendor.n(item.role === "user" ? "user-question" : "ai-answer"),
        j: index
      });
    }),
    j: _ctx.scrollTop,
    k: $data.attachedImage
  }, $data.attachedImage ? {
    l: $data.attachedImage,
    m: common_vendor.o((...args) => $options.openPreview && $options.openPreview(...args)),
    n: common_vendor.o((...args) => $options.removeAttachedImage && $options.removeAttachedImage(...args))
  } : {}, {
    o: $data.attachedDoc
  }, $data.attachedDoc ? {
    p: common_vendor.t($data.attachedDoc.name),
    q: common_vendor.o((...args) => $options.removeAttachedDoc && $options.removeAttachedDoc(...args))
  } : {}, {
    r: common_vendor.o((...args) => $options.inputQuestion && $options.inputQuestion(...args)),
    s: $data.currentQuestion,
    t: common_vendor.o((...args) => $options.newChat && $options.newChat(...args)),
    v: common_vendor.o((...args) => $options.addAttachment && $options.addAttachment(...args)),
    w: common_vendor.o((...args) => $options.sendQuestion && $options.sendQuestion(...args)),
    x: $data.showPreviewModal
  }, $data.showPreviewModal ? {
    y: $data.attachedImage,
    z: common_vendor.o((...args) => $options.closePreview && $options.closePreview(...args))
  } : {}) : {}, {
    A: $data.showHistoryModal
  }, $data.showHistoryModal ? common_vendor.e({
    B: common_vendor.o((...args) => $options.closeHistory && $options.closeHistory(...args)),
    C: $data.historyList.length > 0
  }, $data.historyList.length > 0 ? {
    D: common_vendor.f($data.historyList, (item, index, i0) => {
      return {
        a: common_vendor.t(item.title),
        b: common_vendor.t(item.date),
        c: common_vendor.o((...args) => $options.loadHistoryChat && $options.loadHistoryChat(...args), item.id),
        d: item.id,
        e: item.id,
        f: common_vendor.o((...args) => $options.deleteHistoryItem && $options.deleteHistoryItem(...args), item.id),
        g: common_vendor.o((...args) => $options.deleteHistoryItem && $options.deleteHistoryItem(...args), item.id),
        h: item.id
      };
    })
  } : {}) : {}, {
    E: $data.showAttachmentModal
  }, $data.showAttachmentModal ? {
    F: common_vendor.o((...args) => $options.closeAttachmentModal && $options.closeAttachmentModal(...args)),
    G: common_vendor.o((...args) => $options.chooseImage && $options.chooseImage(...args)),
    H: common_vendor.o((...args) => $options.chooseWord && $options.chooseWord(...args)),
    I: common_vendor.o((...args) => $options.choosePdf && $options.choosePdf(...args)),
    J: common_vendor.o((...args) => $options.chooseExcel && $options.chooseExcel(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
