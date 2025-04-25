"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  __name: "community",
  setup(__props) {
    const activeTab = common_vendor.ref("science");
    const sciencePosts = common_vendor.ref([
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
    ]);
    const qaHistory = common_vendor.ref([]);
    const currentQuestion = common_vendor.ref("");
    const historyList = common_vendor.ref([]);
    const showHistoryModal = common_vendor.ref(false);
    const showAttachmentModal = common_vendor.ref(false);
    const currentChatId = common_vendor.ref(null);
    common_vendor.ref(null);
    const Token = common_vendor.ref("");
    const loading = common_vendor.ref(false);
    const attachedImage = common_vendor.ref(null);
    const attachedDoc = common_vendor.ref(null);
    const showPreviewModal = common_vendor.ref(false);
    common_vendor.ref(null);
    common_vendor.onLoad(() => {
      common_vendor.index.getStorage({
        key: "userIdentity",
        success: (res) => {
          Token.value = res.data.token;
        }
      });
    });
    common_vendor.onShow(() => {
      const selectedTab = common_vendor.index.getStorageSync("SELECTED_TAB");
      if (selectedTab) {
        activeTab.value = selectedTab;
        loadChatHistory();
        newChat();
        common_vendor.index.removeStorageSync("SELECTED_TAB");
      }
    });
    const switchTab = (e) => {
      const tab = e.currentTarget.dataset.tab;
      activeTab.value = tab;
      loadChatHistory();
      newChat();
    };
    const toggleLike = (e) => {
      const postId = e.currentTarget.dataset.id;
      const postIndex = sciencePosts.value.findIndex((post) => post.id === postId);
      if (postIndex !== -1) {
        const isLiked = sciencePosts.value[postIndex].isLiked;
        sciencePosts.value[postIndex].isLiked = !isLiked;
        sciencePosts.value[postIndex].likes = isLiked ? sciencePosts.value[postIndex].likes - 1 : sciencePosts.value[postIndex].likes + 1;
      }
    };
    const toggleFavorite = (e) => {
      const postId = e.currentTarget.dataset.id;
      const postIndex = sciencePosts.value.findIndex((post) => post.id === postId);
      console.log("准备收藏");
      if (postIndex !== -1) {
        sciencePosts.value[postIndex].isFavorited = !sciencePosts.value[postIndex].isFavorited;
      }
    };
    const inputQuestion = (e) => {
      currentQuestion.value = e.detail.value;
    };
    const removeAttachedImage = () => {
      attachedImage.value = null;
    };
    const removeAttachedDoc = () => {
      attachedDoc.value = null;
    };
    const openPreview = () => {
      showPreviewModal.value = true;
    };
    const closePreview = () => {
      showPreviewModal.value = false;
    };
    const chooseImage = () => {
      common_vendor.index.chooseImage({
        count: 1,
        sizeType: ["original", "compressed"],
        sourceType: ["album"],
        success: (res) => {
          attachedImage.value = res.tempFilePaths[0];
          showAttachmentModal.value = false;
        },
        fail: (err) => {
          console.error("选择图片失败：", err);
          showAttachmentModal.value = false;
        }
      });
    };
    const chooseWord = () => {
      common_vendor.index.chooseFile({
        count: 1,
        type: "file",
        extension: ["doc", "docx"],
        success: (res) => {
          const file = res.tempFiles[0];
          attachedDoc.value = {
            type: "word",
            path: file.path,
            name: file.name || "Word文档"
          };
          showAttachmentModal.value = false;
        },
        fail: (err) => {
          console.error("选择Word文档失败：", err);
          showAttachmentModal.value = false;
        }
      });
    };
    const choosePdf = () => {
      common_vendor.index.chooseFile({
        count: 1,
        type: "file",
        extension: ["pdf"],
        success: (res) => {
          const file = res.tempFiles[0];
          attachedDoc.value = {
            type: "pdf",
            path: file.path,
            name: file.name || "PDF文档"
          };
          showAttachmentModal.value = false;
        },
        fail: (err) => {
          console.error("选择PDF文档失败：", err);
          showAttachmentModal.value = false;
        }
      });
    };
    const chooseExcel = () => {
      common_vendor.index.chooseFile({
        count: 1,
        type: "file",
        extension: ["xls", "xlsx"],
        success: (res) => {
          const file = res.tempFiles[0];
          attachedDoc.value = {
            type: "excel",
            path: file.path,
            name: file.name || "Excel表格"
          };
          showAttachmentModal.value = false;
        },
        fail: (err) => {
          console.error("选择Excel表格失败：", err);
          showAttachmentModal.value = false;
        }
      });
    };
    const sendQuestion = () => {
      let question = currentQuestion.value.trim();
      const hasImage = attachedImage.value;
      const hasDoc = attachedDoc.value;
      if ((hasImage || hasDoc) && !question) {
        question = "附件内容是什么？";
      }
      if (!question && !hasImage && !hasDoc) {
        return;
      }
      qaHistory.value.push({
        role: "user",
        content: question,
        attachment: hasImage ? { type: "image", path: attachedImage.value } : hasDoc ? {
          type: attachedDoc.value.type,
          path: attachedDoc.value.path,
          name: attachedDoc.value.name
        } : null
      });
      currentQuestion.value = "";
      attachedImage.value = null;
      attachedDoc.value = null;
      saveChatHistory();
      const aiReply = { role: "ai", content: "", htmlContent: "" };
      qaHistory.value.push(aiReply);
      loading.value = true;
      if (hasImage) {
        common_vendor.index.getFileSystemManager().readFile({
          filePath: attachedImage.value,
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
                processAiResponse(res2.data, aiReply);
              },
              fail: (err) => {
                console.error("图片处理请求错误:", err);
                loading.value = false;
              }
            });
          },
          fail: (err) => {
            console.error("读取图片失败:", err);
            loading.value = false;
          }
        });
      } else if (hasDoc) {
        console.log("已成功读取附件/word/pdf/excel");
        const mimeMapping = {
          word: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          pdf: "application/pdf",
          excel: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        };
        common_vendor.index.getFileSystemManager().readFile({
          filePath: attachedDoc.value.path,
          encoding: "base64",
          success: (res) => {
            console.log("成功将文档转换为Base64");
            const base64Doc = res.data;
            const mimeType = mimeMapping[attachedDoc.value.type] || "application/octet-stream";
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
                processAiResponse(res2.data, aiReply);
              },
              fail: (error) => {
                console.error("请求错误:", error);
                loading.value = false;
              }
            });
          },
          fail: (err) => {
            console.error("读取文档失败:", err);
            loading.value = false;
          }
        });
      } else {
        common_vendor.index.request({
          url: "https://jobguard.online/api/ai/stream-chat",
          method: "POST",
          header: {
            "Authorization": Token.value,
            "Content-Type": "application/json"
          },
          data: JSON.stringify({
            input: question + "最长回答限定于350字",
            sessionId: currentChatId.value
          }),
          success: (res) => {
            if (res.data) {
              processAiResponse(res.data, aiReply);
            }
          },
          fail: (error) => {
            console.error("请求错误:", error);
            loading.value = false;
          }
        });
      }
    };
    const processAiResponse = (responseData, aiReply) => {
      let text = "";
      if (typeof responseData === "string") {
        text = responseData;
      } else if (typeof responseData === "object") {
        if (responseData.choices && responseData.choices[0] && responseData.choices[0].message && responseData.choices[0].message.content) {
          text = responseData.choices[0].message.content;
        } else {
          text = JSON.stringify(responseData);
        }
      }
      const lines = text.split("\n");
      const processedContent = lines.map((line) => line.replace(/^data:/, "").trim()).filter((line) => line.length > 0).join("");
      let currentText = "";
      const typeText = (text2, index = 0) => {
        if (index < text2.length) {
          currentText += text2[index];
          aiReply.content = currentText;
          scrollToBottom();
          setTimeout(() => typeText(text2, index + 1), 10);
        } else {
          loading.value = false;
          saveChatHistory();
        }
      };
      typeText(processedContent);
    };
    const scrollTop = common_vendor.ref(0);
    const scrollToBottom = () => {
      common_vendor.index.createSelectorQuery().select(".qa-history").boundingClientRect((rect) => {
        if (rect) {
          scrollTop.value = rect.height;
        }
      }).exec();
    };
    const newChat = () => {
      if (qaHistory.value.length > 0) {
        saveChatHistory();
      }
      common_vendor.index.request({
        url: "https://jobguard.online/api/ai/create-session",
        method: "POST",
        header: {
          "Authorization": Token.value,
          "Content-Type": "application/json"
        },
        success: (res) => {
          console.log("打印创建新对话框res.data");
          console.log(res.data);
          if (res.data) {
            qaHistory.value = [];
            currentChatId.value = res.data.data;
            console.log("currentChatId");
            console.log(currentChatId.value);
          }
        },
        fail: (err) => {
          console.error("创建新会话失败:", err);
        }
      });
    };
    const saveChatHistory = () => {
      var _a;
      if (qaHistory.value.length === 0)
        return;
      const chatHistory = common_vendor.index.getStorageSync("chatHistory") || [];
      const existingIndex = chatHistory.findIndex((item) => item.id === currentChatId.value);
      const firstQuestion = ((_a = qaHistory.value.find((msg) => msg.role === "user")) == null ? void 0 : _a.content) || "";
      const title = firstQuestion.length > 5 ? firstQuestion.substring(0, 5) + "..." : firstQuestion;
      const chatData = {
        id: currentChatId.value,
        title,
        date: formatDate(/* @__PURE__ */ new Date()),
        messages: qaHistory.value,
        timestamp: Date.now()
      };
      if (existingIndex !== -1) {
        chatHistory[existingIndex] = chatData;
      } else {
        chatHistory.unshift(chatData);
      }
      common_vendor.index.setStorageSync("chatHistory", chatHistory);
      loadChatHistory();
    };
    const loadChatHistory = () => {
      historyList.value = common_vendor.index.getStorageSync("chatHistory") || [];
    };
    const viewHistory = () => {
      loadChatHistory();
      showHistoryModal.value = true;
    };
    const closeHistory = () => {
      showHistoryModal.value = false;
    };
    const loadHistoryChat = (e) => {
      const chatId = e.currentTarget.dataset.id;
      const chatHistory = common_vendor.index.getStorageSync("chatHistory") || [];
      const chat = chatHistory.find((item) => item.id === chatId);
      if (chat) {
        qaHistory.value = chat.messages;
        currentChatId.value = chatId;
        showHistoryModal.value = false;
        nextTick(() => {
          scrollToBottom();
        });
      }
    };
    const addAttachment = () => {
      showAttachmentModal.value = true;
    };
    const closeAttachmentModal = () => {
      showAttachmentModal.value = false;
    };
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`;
    };
    const deleteHistoryItem = (e) => {
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
            historyList.value = chatHistory;
            console.log("点击后的对话项ID");
            console.log(chatId);
            common_vendor.index.request({
              url: `https://jobguard.online/api/ai/delete-session?sessionId=${chatId}`,
              method: "POST",
              header: {
                "Authorization": Token.value,
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
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.n(activeTab.value === "science" ? "active" : ""),
        b: common_vendor.o(switchTab),
        c: common_vendor.n(activeTab.value === "ai" ? "active" : ""),
        d: common_vendor.o(switchTab),
        e: activeTab.value === "science"
      }, activeTab.value === "science" ? {
        f: common_vendor.f(sciencePosts.value, (item, index, i0) => {
          return {
            a: item.authorAvatar,
            b: common_vendor.t(item.authorName),
            c: common_vendor.t(item.authorTitle),
            d: common_vendor.t(item.title),
            e: common_vendor.t(item.content),
            f: item.isLiked ? "https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/已点赞.png" : "https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/未点赞.png",
            g: common_vendor.t(item.likes),
            h: common_vendor.o(toggleLike, item.id),
            i: item.id,
            j: item.isFavorited ? "https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/已收藏.png" : "https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/未收藏.png",
            k: common_vendor.o(toggleFavorite, item.id),
            l: item.id,
            m: item.id
          };
        })
      } : {}, {
        g: activeTab.value === "ai"
      }, activeTab.value === "ai" ? common_vendor.e({
        h: common_vendor.o(viewHistory),
        i: common_vendor.f(qaHistory.value, (item, index, i0) => {
          return common_vendor.e({
            a: item.role === "user" ? "https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/头像女孩.png" : "https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/头像.png",
            b: item.attachment && item.attachment.type === "image"
          }, item.attachment && item.attachment.type === "image" ? {
            c: item.attachment.path
          } : {}, {
            d: item.role === "ai" && loading.value && !item.content
          }, item.role === "ai" && loading.value && !item.content ? {} : item.role === "ai" && item.htmlContent ? {
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
        j: scrollTop.value,
        k: attachedImage.value
      }, attachedImage.value ? {
        l: attachedImage.value,
        m: common_vendor.o(openPreview),
        n: common_vendor.o(removeAttachedImage)
      } : {}, {
        o: attachedDoc.value
      }, attachedDoc.value ? {
        p: common_vendor.t(attachedDoc.value.name),
        q: common_vendor.o(removeAttachedDoc)
      } : {}, {
        r: common_vendor.o(inputQuestion),
        s: currentQuestion.value,
        t: common_vendor.o(newChat),
        v: common_vendor.o(addAttachment),
        w: common_vendor.o(sendQuestion),
        x: showPreviewModal.value
      }, showPreviewModal.value ? {
        y: attachedImage.value,
        z: common_vendor.o(closePreview)
      } : {}) : {}, {
        A: showHistoryModal.value
      }, showHistoryModal.value ? common_vendor.e({
        B: common_vendor.o(closeHistory),
        C: historyList.value.length > 0
      }, historyList.value.length > 0 ? {
        D: common_vendor.f(historyList.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.title),
            b: common_vendor.t(item.date),
            c: common_vendor.o(loadHistoryChat, item.id),
            d: item.id,
            e: item.id,
            f: common_vendor.o(deleteHistoryItem, item.id),
            g: common_vendor.o(deleteHistoryItem, item.id),
            h: item.id
          };
        })
      } : {}) : {}, {
        E: showAttachmentModal.value
      }, showAttachmentModal.value ? {
        F: common_vendor.o(closeAttachmentModal),
        G: common_vendor.o(chooseImage),
        H: common_vendor.o(chooseWord),
        I: common_vendor.o(choosePdf),
        J: common_vendor.o(chooseExcel)
      } : {});
    };
  }
};
wx.createPage(_sfc_main);
