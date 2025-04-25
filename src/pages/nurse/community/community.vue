<template>
    <view class="page-container">
      <image
        src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/background.png"
        class="page-background"
        mode="aspectFill"
      ></image>
  
      <view class="content-area">
        <view class="platform-title">献血 e 站</view>
  
        <!-- 功能选择栏 -->
        <view class="feature-selector">
          <view
            :class="['feature-item', activeTab === 'science' ? 'active' : '']"
            @click="switchTab"
            data-tab="science"
          >
            科普动态
          </view>
          <view
            :class="['feature-item', activeTab === 'ai' ? 'active' : '']"
            @click="switchTab"
            data-tab="ai"
          >
            AI智能问答
          </view>
        </view>
  
        <!-- 内容展示区域 -->
        <view class="content-display">
          <!-- 科普动态框 -->
          <view class="science-content" v-if="activeTab === 'science'">
            <template v-for="(item, index) in sciencePosts" :key="item.id">
              <view class="science-post">
                <!-- 作者信息 -->
                <view class="author-info">
                  <image class="author-avatar" :src="item.authorAvatar"></image>
                  <view class="author-details">
                    <view class="author-name">{{ item.authorName }}</view>
                    <view class="author-title">{{ item.authorTitle }}</view>
                  </view>
                </view>
  
                <!-- 科普信息 -->
                <view class="post-content">
                  <view class="post-title">{{ item.title }}</view>
                  <view class="post-text">{{ item.content }}</view>
  
                  <!-- 点赞收藏功能 -->
                  <view class="interaction-buttons">
                    <view class="like-button" @click="toggleLike" :data-id="item.id">
                      <image
                        :src="item.isLiked
                          ? 'https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/已点赞.png'
                          : 'https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/未点赞.png'"
                      ></image>
                      <text>{{ item.likes }}</text>
                    </view>
                    <!-- 切换收藏 -->
                    <view class="favorite-button" @click="toggleFavorite" :data-id="item.id">
                      <image
                        :src="item.isFavorited
                          ? 'https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/已收藏.png'
                          : 'https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/未收藏.png'"
                      ></image>
                    </view>
                  </view>
                </view>
              </view>
            </template>
          </view>
  
          <!-- AI 问答 -->
          <view class="ai-content" v-if="activeTab === 'ai'">
            <!-- 头部标题栏 -->
            <view class="ai-header">
              <text class="ai-title">智能问答</text>
              <image
                src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/历史记录.png"
                class="history-icon"
                @click="viewHistory"
              ></image>
            </view>
  
            <!-- 聊天记录展示 -->
            <scroll-view
              class="qa-history"
              scroll-y="true"
              scroll-with-animation="true"
              :scroll-top="scrollTop"
            >
              <template v-for="(item, index) in qaHistory" :key="index">
                <view :class="['qa-item', item.role === 'user' ? 'user-question' : 'ai-answer']">
                  <image
                    class="qa-avatar"
                    :src="item.role === 'user'
                      ? 'https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/头像女孩.png'
                      : 'https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/头像.png'"
                  ></image>
                  <view class="qa-content">
                    <!-- 如果存在图片附件，则显示图片 -->
                    <template v-if="item.attachment && item.attachment.type === 'image'">
                      <image class="qa-attachment" :src="item.attachment.path" mode="widthFix"></image>
                    </template>
                    <!-- 当 AI 正在加载且未开始显示内容时显示加载动画 -->
                    <template v-if="item.role === 'ai' && loading && !item.content">
                      <view class="loading-indicator">
                        <view class="dot"></view>
                        <view class="dot"></view>
                        <view class="dot"></view>
                      </view>
                    </template>
                    <!-- 如果 AI 回复已完成且渲染后的 HTML 存在，则使用 rich-text 渲染 -->
                    <template v-else-if="item.role === 'ai' && item.htmlContent">
                      <rich-text :nodes="item.htmlContent"></rich-text>
                    </template>
                    <!-- 否则显示 plain text -->
                    <template v-else-if="item.content">
                      {{ item.content }}
                    </template>
                  </view>
                </view>
              </template>
            </scroll-view>
  
            <!-- 外层容器 -->
            <view class="send-box-container">
              <!-- 附件图片预览，只有当 attachedImage 存在时显示 -->
              <view v-if="attachedImage" class="attached-image-preview">
                <!-- 点击图片放大预览 -->
                <image
                  class="preview-image"
                  :src="attachedImage"
                  @click="openPreview"
                />
                <!-- 左上角返回图标，点击后删除附件 -->
                <image
                  src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/关闭.png"
                  class="dele-icon"
                  @click="removeAttachedImage"
                />
              </view>
              <!-- 文档附件预览 -->
              <view v-if="attachedDoc" class="attached-doc-preview">
                <!-- 显示文档名称或图标 -->
                <view class="doc-info">
                  <text class="doc-name">{{ attachedDoc.name }}</text>
                </view>
                <!-- 右上角删除按钮 -->
                <image
                  src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/关闭.png"
                  class="doc-delete-icon"
                  @click="removeAttachedDoc"
                />
              </view>
              <!-- 发送框 -->
              <view class="question-input-area">
                <input
                  class="question-input"
                  @input="inputQuestion"
                  :value="currentQuestion"
                  placeholder="请输入您的问题"
                />
                <view class="input-icons">
                  <image
                    src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/加号.png"
                    class="icon"
                    @click="newChat"
                  />
                  <image
                    src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/链接.png"
                    class="icon"
                    @click="addAttachment"
                  />
                  <image
                    src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/发送.png"
                    class="icon"
                    @click="sendQuestion"
                  />
                </view>
              </view>
            </view>
  
            <!-- 图片预览弹窗 -->
            <view v-if="showPreviewModal" class="preview-modal">
              <image class="modal-image" :src="attachedImage" />
              <!-- 弹窗右上角关闭按钮 -->
              <image
                src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/关闭.png"
                class="close-image-icon"
                @click="closePreview"
              />
            </view>
          </view>
        </view>
      </view>
  
      <!-- 历史记录弹窗 -->
      <view class="history-modal" v-if="showHistoryModal">
        <view class="history-container">
          <view class="history-header">
            <text class="history-title">历史对话</text>
            <image
              src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/关闭.png"
              class="close-icon"
              @click="closeHistory"
            />
          </view>
          <scroll-view class="history-list" scroll-y="true">
            <template v-if="historyList.length > 0">
              <view
                v-for="(item, index) in historyList"
                :key="item.id"
                class="history-item"
              >
                <!-- 点击整个内容加载对话 -->
                <view
                  class="item-content"
                  @click="loadHistoryChat"
                  hover-class="item-content-hover"
                  :data-id="item.id"
                >
                  <text class="history-chat-title">{{ item.title }}</text>
                  <text class="history-chat-date">{{ item.date }}</text>
                </view>
                <!-- 删除图标，点击后进行删除操作 -->
                <image
                  src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/删除.jpg"
                  class="delete-icon"
                  :data-id="item.id"
                  @click="deleteHistoryItem"
                  @tap.native.stop="deleteHistoryItem"
                />
              </view>
            </template>
            <view v-else class="empty-history">
              <text>暂无历史对话</text>
            </view>
          </scroll-view>
        </view>
      </view>
  
      <!-- 附件选择弹窗 -->
      <view class="attachment-modal" v-if="showAttachmentModal">
        <view class="attachment-container">
          <!-- 关闭按钮，绝对定位于附件容器的右上角外部 -->
          <image
            class="close-button"
            src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/关闭.png"
            @click="closeAttachmentModal"
          />
  
          <view
            class="attachment-option"
            @click="chooseImage"
            hover-class="attachment-option-hover"
          >
            <text>选择图片</text>
            <image
              src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/照片.jpg"
              class="attachment-icon"
            />
          </view>
          <view
            class="attachment-option"
            @click="chooseWord"
            hover-class="attachment-option-hover"
          >
            <text>选择Word文档</text>
            <image
              src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/word文档.jpg"
              class="attachment-icon"
            />
          </view>
          <view
            class="attachment-option"
            @click="choosePdf"
            hover-class="attachment-option-hover"
          >
            <text>选择PDF文档</text>
            <image
              src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/pdf文档.jpg"
              class="attachment-icon"
            />
          </view>
          <view
            class="attachment-option"
            @click="chooseExcel"
            hover-class="attachment-option-hover"
          >
            <text>选择Excel表</text>
            <image
              src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/excel表.jpg"
              class="attachment-icon"
            />
          </view>
        </view>
      </view>
    </view>
  </template>
  

<script setup>
  import { ref, onMounted } from 'vue'
  import { onLoad, onShow } from '@dcloudio/uni-app'
  // import { MarkdownIt } from '../../../utils/markdown-it.js'
  
  // 响应式数据
  const activeTab = ref('science')
  const sciencePosts = ref([
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
  ])
  const qaHistory = ref([])
  const currentQuestion = ref("")
  const historyList = ref([])
  const showHistoryModal = ref(false)
  const showAttachmentModal = ref(false)
  const currentChatId = ref(null)
  const deleSessionId = ref(null)
  const Token = ref("")
  const loading = ref(false)
  const attachedImage = ref(null)
  const attachedDoc = ref(null)
  const showPreviewModal = ref(false)
  const markdownRenderer = ref(null)
  
  // 生命周期钩子
  onLoad(() => {
    uni.getStorage({
      key: 'userIdentity',
      success: (res) => {
        Token.value = res.data.token
      }
    })
    
    // 初始化 markdown 渲染器
    // markdownRenderer.value = new MarkdownIt()
  })
  
  onShow(() => {
    const selectedTab = uni.getStorageSync('SELECTED_TAB')
    
    if (selectedTab) {
      activeTab.value = selectedTab
      loadChatHistory()
      newChat()
      uni.removeStorageSync('SELECTED_TAB')
    }
  })
  
  // 方法定义
  const switchTab = (e) => {
    const tab = e.currentTarget.dataset.tab
    activeTab.value = tab
    loadChatHistory()
    newChat()
  }
  
  const toggleLike = (e) => {
    const postId = e.currentTarget.dataset.id
    const postIndex = sciencePosts.value.findIndex(post => post.id === postId)
    
    if (postIndex !== -1) {
      const isLiked = sciencePosts.value[postIndex].isLiked
      sciencePosts.value[postIndex].isLiked = !isLiked
      sciencePosts.value[postIndex].likes = isLiked ? sciencePosts.value[postIndex].likes - 1 : sciencePosts.value[postIndex].likes + 1
    }
  }
  
  const toggleFavorite = (e) => {
    const postId = e.currentTarget.dataset.id
    const postIndex = sciencePosts.value.findIndex(post => post.id === postId)
    console.log("准备收藏")
    
    if (postIndex !== -1) {
      sciencePosts.value[postIndex].isFavorited = !sciencePosts.value[postIndex].isFavorited
    }
  }
  
  const inputQuestion = (e) => {
    currentQuestion.value = e.detail.value
  }
  
  const removeAttachedImage = () => {
    attachedImage.value = null
  }
  
  const removeAttachedDoc = () => {
    attachedDoc.value = null
  }
  
  const openPreview = () => {
    showPreviewModal.value = true
  }
  
  const closePreview = () => {
    showPreviewModal.value = false
  }
  
  const chooseImage = () => {
    uni.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album'],
      success: (res) => {
        attachedImage.value = res.tempFilePaths[0]
        showAttachmentModal.value = false
      },
      fail: (err) => {
        console.error('选择图片失败：', err)
        showAttachmentModal.value = false
      }
    })
  }
  
  const chooseWord = () => {
    uni.chooseFile({
      count: 1,
      type: 'file',
      extension: ['doc', 'docx'],
      success: (res) => {
        const file = res.tempFiles[0]
        attachedDoc.value = {
          type: 'word',
          path: file.path,
          name: file.name || 'Word文档'
        }
        showAttachmentModal.value = false
      },
      fail: (err) => {
        console.error('选择Word文档失败：', err)
        showAttachmentModal.value = false
      }
    })
  }
  
  const choosePdf = () => {
    uni.chooseFile({
      count: 1,
      type: 'file',
      extension: ['pdf'],
      success: (res) => {
        const file = res.tempFiles[0]
        attachedDoc.value = {
          type: 'pdf',
          path: file.path,
          name: file.name || 'PDF文档'
        }
        showAttachmentModal.value = false
      },
      fail: (err) => {
        console.error('选择PDF文档失败：', err)
        showAttachmentModal.value = false
      }
    })
  }
  
  const chooseExcel = () => {
    uni.chooseFile({
      count: 1,
      type: 'file',
      extension: ['xls', 'xlsx'],
      success: (res) => {
        const file = res.tempFiles[0]
        attachedDoc.value = {
          type: 'excel',
          path: file.path,
          name: file.name || 'Excel表格'
        }
        showAttachmentModal.value = false
      },
      fail: (err) => {
        console.error('选择Excel表格失败：', err)
        showAttachmentModal.value = false
      }
    })
  }
  
  const sendQuestion = () => {
    let question = currentQuestion.value.trim()
    const hasImage = attachedImage.value
    const hasDoc = attachedDoc.value
    
    if ((hasImage || hasDoc) && !question) {
      question = "附件内容是什么？"
    }
    if (!question && !hasImage && !hasDoc) {
      return
    }
    
    // 添加用户问题记录
    qaHistory.value.push({
      role: 'user',
      content: question,
      attachment: hasImage
        ? { type: 'image', path: attachedImage.value }
        : hasDoc
          ? { 
              type: attachedDoc.value.type, 
              path: attachedDoc.value.path, 
              name: attachedDoc.value.name 
            }
          : null
    })
    
    // 清空输入和附件
    currentQuestion.value = ""
    attachedImage.value = null
    attachedDoc.value = null
    
    saveChatHistory()
    
    // 添加空的 AI 回复
    const aiReply = { role: 'ai', content: '', htmlContent: '' }
    qaHistory.value.push(aiReply)
    loading.value = true
    
    // 处理图片附件
    if (hasImage) {
      uni.getFileSystemManager().readFile({
        filePath: attachedImage.value,
        encoding: 'base64',
        success: (res) => {
          const base64Image = res.data
          const payload = {
            model: "glm-4v",
            messages: [
              {
                role: 'user',
                content: [
                  { type: 'image_url', image_url: { url: base64Image } },
                  { type: 'text', text: question + " 字数限定于200字" }
                ]
              }
            ]
          }
          uni.request({
            url: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
            method: 'POST',
            header: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer bd62dc89ee6a1c34f3c72dfac96f58a5.2GA3Q4wOK7GUaC7f'  
            },
            data: JSON.stringify(payload),
            success: (res) => {
              processAiResponse(res.data, aiReply)
            },
            fail: (err) => {
              console.error('图片处理请求错误:', err)
              loading.value = false
            }
          })
        },
        fail: (err) => {
          console.error("读取图片失败:", err)
          loading.value = false
        }
      })
    } 
    // 处理文档附件
    else if (hasDoc) {
      console.log("已成功读取附件/word/pdf/excel")
      
      const mimeMapping = {
        word: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        pdf: "application/pdf",
        excel: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      }
      
      uni.getFileSystemManager().readFile({
        filePath: attachedDoc.value.path,
        encoding: 'base64',
        success: (res) => {
          console.log("成功将文档转换为Base64")
          const base64Doc = res.data
          const mimeType = mimeMapping[attachedDoc.value.type] || "application/octet-stream"
          const dataUrl = "data:" + mimeType + ";base64," + base64Doc
          const payload = {
            model: "glm-4",
            messages: [
              {
                role: 'user',
                content: [
                  {
                    type: 'file',
                    file_url: {
                      url: dataUrl
                    }
                  },
                  { type: 'text', text: question + " 最长回答限定于350字" }
                ]
              }
            ]
          }
          uni.request({
            url: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
            method: 'POST',
            header: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer bd62dc89ee6a1c34f3c72dfac96f58a5.2GA3Q4wOK7GUaC7f'  
            },
            data: JSON.stringify(payload),
            success: (res) => {
              console.log("打印文档请求结果")
              console.log(res.data)
              processAiResponse(res.data, aiReply)
            },
            fail: (error) => {
              console.error('请求错误:', error)
              loading.value = false
            }
          })
        },
        fail: (err) => {
          console.error("读取文档失败:", err)
          loading.value = false
        }
      })
    } 
    // 纯文本请求
    else {
      uni.request({
        url: 'https://jobguard.online/api/ai/stream-chat',
        method: 'POST',
        header: {
          'Authorization': Token.value,
          'Content-Type': 'application/json'
        },
        data: JSON.stringify({ 
          input: question + "最长回答限定于350字", 
          sessionId: currentChatId.value 
        }),
        success: (res) => {
          if (res.data) {
            processAiResponse(res.data, aiReply)
          }
        },
        fail: (error) => {
          console.error('请求错误:', error)
          loading.value = false
        }
      })
    }
  }
  
  const processAiResponse = (responseData, aiReply) => {
    let text = ""
    if (typeof responseData === "string") {
      text = responseData
    } else if (typeof responseData === "object") {
      if (
        responseData.choices &&
        responseData.choices[0] &&
        responseData.choices[0].message &&
        responseData.choices[0].message.content
      ) {
        text = responseData.choices[0].message.content
      } else {
        text = JSON.stringify(responseData)
      }
    }
    
    const lines = text.split('\n')
    const processedContent = lines
      .map(line => line.replace(/^data:/, '').trim())
      .filter(line => line.length > 0)
      .join('')
    
    let currentText = ''
    const typeText = (text, index = 0) => {
      if (index < text.length) {
        currentText += text[index]
        aiReply.content = currentText
        scrollToBottom()
        setTimeout(() => typeText(text, index + 1), 10)
      } else {
        // 使用 markdown 渲染器
        // aiReply.htmlContent = markdownRenderer.value.render(currentText)
        loading.value = false
        saveChatHistory()
      }
    }
    typeText(processedContent)
  }

  const scrollTop = ref(0)
  
  const scrollToBottom = () => {
    uni.createSelectorQuery()
      .select('.qa-history')
      .boundingClientRect(rect => {
        if (rect) {
          scrollTop.value = rect.height
        }
      })
      .exec()
  }
  
  const newChat = () => {
    if (qaHistory.value.length > 0) {
      saveChatHistory()
    }
    
    uni.request({
      url: 'https://jobguard.online/api/ai/create-session',
      method: 'POST',
      header: {
        'Authorization': Token.value,
        'Content-Type': 'application/json'
      },
      success: (res) => {
        console.log("打印创建新对话框res.data")
        console.log(res.data)
        if (res.data) {
          qaHistory.value = []
          currentChatId.value = res.data.data
          console.log("currentChatId")
          console.log(currentChatId.value)
        }
      },
      fail: (err) => {
        console.error('创建新会话失败:', err)
      }
    })
  }
  
  const saveChatHistory = () => {
    if (qaHistory.value.length === 0) return
    
    const chatHistory = uni.getStorageSync('chatHistory') || []
    const existingIndex = chatHistory.findIndex(item => item.id === currentChatId.value)
    
    const firstQuestion = qaHistory.value.find(msg => msg.role === 'user')?.content || ''
    const title = firstQuestion.length > 5 ? firstQuestion.substring(0, 5) + '...' : firstQuestion
    
    const chatData = {
      id: currentChatId.value,
      title: title,
      date: formatDate(new Date()),
      messages: qaHistory.value,
      timestamp: Date.now()
    }
    
    if (existingIndex !== -1) {
      chatHistory[existingIndex] = chatData
    } else {
      chatHistory.unshift(chatData)
    }
    
    uni.setStorageSync('chatHistory', chatHistory)
    loadChatHistory()
  }
  
  const loadChatHistory = () => {
    historyList.value = uni.getStorageSync('chatHistory') || []
  }
  
  const viewHistory = () => {
    loadChatHistory()
    showHistoryModal.value = true
  }
  
  const closeHistory = () => {
    showHistoryModal.value = false
  }
  
  const loadHistoryChat = (e) => {
    const chatId = e.currentTarget.dataset.id
    const chatHistory = uni.getStorageSync('chatHistory') || []
    const chat = chatHistory.find(item => item.id === chatId)
    
    if (chat) {
      qaHistory.value = chat.messages
      currentChatId.value = chatId
      showHistoryModal.value = false
      nextTick(() => {
        scrollToBottom()
      })
    }
  }
  
  const addAttachment = () => {
    showAttachmentModal.value = true
  }
  
  const closeAttachmentModal = () => {
    showAttachmentModal.value = false
  }
  
  const formatDate = (date) => {
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    return `${year}-${month}-${day}`
  }
  
  const deleteHistoryItem = (e) => {
    e.stopPropagation && e.stopPropagation()
    const chatId = e.currentTarget.dataset.id
    
    uni.showModal({
      title: '提示',
      content: '是否确定删除该对话？',
      success: (res) => {
        if (res.confirm) {
          let chatHistory = uni.getStorageSync('chatHistory') || []
          chatHistory = chatHistory.filter(item => item.id !== chatId)
          uni.setStorageSync('chatHistory', chatHistory)
          historyList.value = chatHistory
          
          console.log("点击后的对话项ID")
          console.log(chatId)
          uni.request({
            url: `https://jobguard.online/api/ai/delete-session?sessionId=${chatId}`,
            method: 'POST',
            header: {
              'Authorization': Token.value,
              'Content-Type': 'application/json'
            },
            success: (res) => {
              console.log('删除对话成功:', res)
            },
            fail: (err) => {
              console.error('删除对话请求失败:', err)
            }
          })
        }
      }
    })
  }
</script>

<style>
/* 页面基础样式，确保页面占满全高并防止滚动条出现 */
page {
    height: 100%;
    overflow: hidden;
}
  
/* 页面容器，设置为相对定位，占满全屏高度，内容居中对齐 */
.page-container {
    position: relative;
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
}
  
/* 页面背景，固定定位于页面顶部左侧，占满全屏，位于最底层（z-index为-2） */
.page-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -2;
}
  
/* 内容区域，占满宽高，使用弹性布局垂直排列并居中，顶部留出90rpx空间，使用border-box确保padding不影响总宽高 */
.content-area {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 90rpx;
    box-sizing: border-box;
}
  
/* 平台标题样式，占满宽度并居中，设置字体大小、粗细和颜色，上下padding为20rpx，底部外边距为30rpx，确保在顶层显示 */
.platform-title {
    width: 100%;
    text-align: center;
    font-size: 18px;
    font-weight: bold;
    color: #333;
    padding: 20rpx 0;
    margin-bottom: 30rpx;
    z-index: 1;
}
  
/* 功能选择栏，使用弹性布局居中对齐，宽度为40%，浅灰背景色，圆角边框，底部外边距5rpx，相对定位并向左偏移220px */
.feature-selector {
    display: flex;
    width: 40%;
    justify-content: center;
    background-color: #f5f5f5;
    border-radius: 10rpx;
    margin-bottom: 5rpx;
    overflow: hidden;
    position: relative;
    margin-left: -220px;
}
  
/* 功能选项，占满剩余空间，固定宽度10px，文本居中，上下padding为20rpx，设置字体大小和颜色，添加过渡效果 */
.feature-item {
    flex: 1;
    width: 10px;
    text-align: center;
    padding: 20rpx 0;
    font-size: 28rpx;
    color: #666;
    transition: all 0.3s;
}
  
/* 激活状态的功能选项，红色背景，白色字体并加粗 */
.feature-item.active {
    background-color: #e74c3c;
    color: white;
    font-weight: bold;
}
  
/* 内容展示框，宽度92%，占满剩余高度，允许垂直滚动，半透明白色背景，圆角，内边距20rpx，阴影效果，底部外边距5px，内容居中 */
.content-display {
    width: 92%;
    flex: 1;
    overflow-y: auto;
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 20rpx;
    padding: 20rpx;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
    margin-bottom: 5px;
    align-items: center;
}
  
/* 科普发布卡片，白色背景，圆角，内边距20rpx，底部外边距30rpx，轻微阴影效果 */
.science-post {
    background-color: white;
    border-radius: 10rpx;
    padding: 20rpx;
    margin-bottom: 30rpx;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}
  
/* 作者信息区域，弹性布局水平排列并垂直居中，底部外边距20rpx */
.author-info {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;
}
  
/* 作者头像，固定宽高80rpx，圆形，右侧外边距20rpx */
.author-avatar {
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    margin-right: 20rpx;
}
  
/* 作者名称，字体大小28rpx，加粗，深灰色 */
.author-name {
    font-size: 28rpx;
    font-weight: bold;
    color: #333;
}
  
/* 作者职称，字体大小24rpx，浅灰色 */
.author-title {
    font-size: 24rpx;
    color: #999;
}
  
/* 帖子内容容器，相对定位 */
.post-content {
    position: relative;
}
  
/* 帖子标题，字体大小32rpx，加粗，底部外边距15rpx，深灰色 */
.post-title {
    font-size: 32rpx;
    font-weight: bold;
    margin-bottom: 15rpx;
    color: #333;
}
  
/* 帖子正文，字体大小28rpx，中灰色，行高1.6，底部外边距30rpx */
.post-text {
    font-size: 28rpx;
    color: #666;
    line-height: 1.6;
    margin-bottom: 30rpx;
}
  
/* 互动按钮区域，弹性布局靠右对齐并垂直居中 */
.interaction-buttons {
    display: flex;
    justify-content: flex-end;
    align-items: center;
}
  
/* 点赞和收藏按钮共有样式，弹性布局垂直居中，左侧外边距30rpx */
.like-button, .favorite-button {
    display: flex;
    align-items: center;
    margin-left: 30rpx;
}
  
/* 点赞和收藏按钮图标，固定宽高40rpx，右侧外边距10rpx */
.like-button image, .favorite-button image {
    width: 40rpx;
    height: 40rpx;
    margin-right: 10rpx;
}
  
/* 点赞按钮文本，字体大小24rpx，浅灰色 */
.like-button text {
    font-size: 24rpx;
    color: #999;
}
  
/* AI问答区域的头部标题栏，弹性布局两端对齐并垂直居中，内边距20rpx，半透明粉色背景，底部边框，圆角 */
.ai-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx;
    background-color: rgba(255, 192, 203, 0.432);
    border-bottom: 1px solid #ddd;
    border-radius: 15rpx;
}
  
/* AI标题，字体大小36rpx，加粗，文本居中，占满剩余空间 */
.ai-title {
    font-size: 36rpx;
    font-weight: bold;
    text-align: center;
    flex: 1;
}
  
/* 历史记录图标，固定宽高70rpx */
.history-icon {
    width: 70rpx;
    height: 70rpx;
}
  
/* 历史记录弹窗，固定定位占满全屏，半透明黑色背景，弹性布局垂直排列并居中，确保在最上层(z-index: 1000) */
.history-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}
  
/* 历史记录容器，宽度80%，固定高度800rpx，白色背景，圆角，隐藏溢出内容，弹性布局垂直排列 */
.history-container {
    width: 80%;
    height: 800rpx;
    background: white;
    border-radius: 20rpx;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}
  
/* 历史记录头部，弹性布局两端对齐并垂直居中，内边距20rpx，底部边框，浅灰背景色 */
.history-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx;
    border-bottom: 1px solid #ddd;
    background-color: rgba(255, 192, 203, 0.432);
}
  
/* 历史记录标题，字体大小32rpx，加粗 */
.history-title {
    font-size: 32rpx;
    font-weight: bold;
    position: relative;
    margin: auto;
}
  
/* 关闭图标，固定宽高40rpx，内边距10rpx */
.close-icon {
    width: 40rpx;
    height: 40rpx;
    padding: 10rpx;
}
  
/* 历史记录列表，占满剩余空间，高度为容器高度减去头部高度，允许垂直滚动 */
.history-list {
    flex: 1;
    height: calc(100% - 80rpx);
    overflow-y: auto;
}
  
/* 历史记录项，弹性布局两端对齐，内边距20rpx，底部边框 */
.history-item {
    display: flex;
    justify-content: space-between;
    padding: 20rpx;
    border-bottom: 1px solid black;
    background-color: #fff;
    border-radius: 10px;
}
/* 子容器，用于点击加载历史对话 */
.item-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    background-color: #fff; /* 设置初始背景 */
    transition: background 0.5s;
}

/* 渐变点击效果 */
.item-content-hover {
    background: rgba(255, 192, 203, 0.432)
}
  
/* 历史记录项激活状态，背景色变为更浅的灰色 */
/* .history-item:active {
    background-color: #f0f0f0;
} */
  
/* 历史聊天标题，字体大小28rpx，深灰色，最大宽度70%，溢出文本显示省略号并不换行 */
.history-chat-title {
    font-size: 28rpx;
    color: #333;
    max-width: 70%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
  
/* 历史聊天日期，字体大小24rpx，浅灰色 */
.history-chat-date {
    font-size: 24rpx;
    color: #999;
}
  
/* 空历史记录提示，内边距40rpx，文本居中，浅灰色 */
.empty-history {
    padding: 40rpx;
    text-align: center;
    color: #999;
}
  
/* 删除图标，固定宽高40rpx，内边距10rpx */
.delete-icon {
    width: 40rpx;
    height: 40rpx;
    padding: 10rpx;
}
  
/* 问答历史记录展示区域，高度100vh但最大不超过880rpx，允许垂直滚动，内边距20rpx，浅灰背景色 */
.qa-history {
    height: 100vh;
    max-height: 880rpx;
    overflow-y: auto;
    padding: 20rpx;
    background-color: #f5f5f5;
}
  
/* 问答项，弹性布局水平排列并顶部对齐，底部外边距20rpx */
.qa-item {
    display: flex;
    align-items: flex-start;
    margin-bottom: 20rpx;
}
  
/* 问答头像，固定宽高80rpx，圆形，左右外边距10rpx */
.qa-avatar {
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    margin: 0 10rpx;
}
  
/* 问答内容，最大宽度70%，内边距20rpx，圆角，自动换行，行高1.5 */
.qa-content {
    max-width: 70%;
    padding: 20rpx;
    border-radius: 10rpx;
    word-break: break-word;
    line-height: 1.5;
}

/* 为图片附件添加样式，使其展示区域合适 */
.qa-attachment {
    max-width: 100%;
    max-height: 300rpx;
    width: auto;
    height: auto;
    position: relative;
    display: block;
    margin-top: 10rpx;
    border-radius: 10rpx;
}

/* 用户提问项，弹性布局反向排列（头像在右侧） */
.user-question {
    flex-direction: row-reverse;
}
  
/* 用户提问内容，蓝色背景，白色文字，文本右对齐 */
.user-question .qa-content {
    background-color: #0084ff;
    color: #fff;
    text-align: right;
}
  
/* AI回答内容，浅灰背景，深灰文字 */
.ai-answer .qa-content {
    background-color: #e6e6e6;
    color: #333;
}
  
/* 问题输入区域，弹性布局水平排列并垂直居中，内边距20rpx，白色背景，相对定位，顶部外边距5px，带边框和圆角 */
.question-input-area {
    display: flex;
    align-items: center;
    padding: 20rpx;
    background-color: #ffffff;
    position: relative;
    margin-top: 5px;
    border: 1rpx solid #ccc;
    border-radius: 15rpx;
}
  
/* 问题输入框，占满剩余空间，无边框，内边距10rpx，字体大小28rpx */
.question-input {
    flex: 1;
    border: none;
    padding: 10rpx;
    font-size: 28rpx;
}
  
/* 输入框图标容器，弹性布局水平排列，元素间距20rpx */
.input-icons {
    display: flex;
    gap: 20rpx;
}
  
/* 单个图标，固定宽高50rpx */
.icon {
    width: 50rpx;
    height: 50rpx;
}
/* 外层容器，便于对图片进行绝对定位 */
.send-box-container {
    position: relative;
  }
  
  /* 附件图片预览容器，绝对定位在发送框外的左上角 */
  .attached-image-preview {
    position: absolute;
    top: -80rpx;    /* 根据实际情况调整，保证紧贴发送框 */
    left: 10rpx;   /* 根据实际情况调整 */
    width: 80rpx;
    height: 80rpx;
    z-index: 10;
  }
  
  /* 附件图片，显示原始内容 */
  .preview-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  /* 返回图标，位于图片左上角 */
  .dele-icon {
    position: absolute;
    top: -7rpx;    /* 根据需要微调 */
    right: -30rpx;
    width: 30rpx;
    height: 30rpx;
    z-index: 11;
  }
  
  /* 图片预览弹窗 */
  .preview-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
  }
  
  /* 弹窗中放大的图片 */
  .modal-image {
    max-width: 90%;
    max-height: 90%;
  }
  
  /* 弹窗右上角的关闭按钮 */
  .close-image-icon {
    position: absolute;
    top: 20rpx;
    right: 20rpx;
    width: 50rpx;
    height: 50rpx;
    z-index: 101;
  }
  /* 文档附件预览容器，绝对定位在发送框上方 */
.attached-doc-preview {
    position: absolute;
    top: -80rpx;    /* 根据实际情况调整 */
    left: 100rpx;   /* 与图片附件错开位置 */
    width: 150rpx;
    height: 60rpx;
    background: #fff;
    border: 1rpx solid #ccc;
    border-radius: 10rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5rpx;
    z-index: 10;
  }
  
  /* 文档信息样式 */
  .doc-info {
    flex: 1;
    text-align: center;
  }
  .doc-name {
    font-size: 26rpx;
    color: #333;
  }
  
  /* 文档附件删除图标 */
  .doc-delete-icon {
    position: absolute;
    top: -7rpx;
    right: -7rpx;
    width: 30rpx;
    height: 30rpx;
    z-index: 11;
  }
  
  

/* 加载动画 */
.loading-indicator {
    display: flex;
    align-items: center;
}
.dot {
    width: 10rpx;
    height: 10rpx;
    margin-right: 5rpx;
    background-color: #999;
    border-radius: 50%;
    animation: blink 1.4s infinite;
}
.dot:nth-child(2) {
    animation-delay: 0.2s;
}
.dot:nth-child(3) {
    animation-delay: 0.4s;
}
@keyframes blink {
    0% { opacity: 0.2; }
    50% { opacity: 1; }
    100% { opacity: 0.2; }
}

/* 附件功能 */
.attachment-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1100;
}
.attachment-container {
    position: relative; /* 为绝对定位的关闭按钮提供定位参考 */
    width: 70%;
    height: 300px;
    background: #fff;
    border-radius: 20rpx;
    padding: 20rpx;
}
.close-button {
    position: absolute;
    top: -55rpx;   /* 调整使按钮贴着容器的右上角外侧 */
    right: -5rpx;
    width: 50rpx;
    height: 50rpx;
}
.attachment-option {
    display: flex;
    height: 60px;
    justify-content: space-between;
    align-items: center;
    padding: 15rpx 0;
    border-bottom: 1rpx solid #bbb;
    margin-bottom: 5rpx;
    background-color: #fff;
    border-radius: 15rpx ;
    transition: background 0.1s;
}
.attachment-option:last-child {
    border-bottom: none;
}
/* 渐变点击效果 */
.attachment-option-hover {
    background: rgba(255, 192, 203, 0.432)
}
.attachment-icon {
    width: 50px;
    height: 50px;
}

/* 显示是否添加图片附件 */
.attached-indicator {
    position: absolute;
    top: 10rpx;
    left: 10rpx;
    z-index: 100;
}
.attached-icon {
    width: 50rpx;
    height: 50rpx;
}

</style>