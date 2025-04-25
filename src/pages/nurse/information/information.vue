<script>
//引入组件
import customFab from '@/components/CustomFab.vue'
export default {
  // 注册组件
  components: {
    customFab
  },
  data() {
    return {
      identitySelected: "",
      scrollHeight: 250,  
      showPopup: false, // 控制弹窗
      showRecruitPage: false, // 控制页面切换，默认显示主页
      showInfoPage: false,
      bloodTypes: ["Rh", "p", "JK"],
      selectedBloodType: "请选择血型",
      conditions: ["标准", "自定义"],
      selectedCondition: "请选择献血条件",
      recruitData: {},
      infoList: [],
      recruitType: 'emergency',
      infoType: 'emergency',
      Token: "",
      activities: [
        { id: 1, title: '稀有血型O型Rh阴性献血', count: 32, isSigned: false,
        imageUrl: 'https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/献血活动海报.png' },
        { id: 2, title: 'AB型血献血者紧急招募', count: 18, isSigned: false,
        imageUrl: 'https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/献血活动海报2.png' },
        { id: 3, title: 'AB型血献血者紧急招募', count: 25, isSigned: false,
        imageUrl: 'https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/献血活动海报2.png' }
      ],
      showDonorInfoPage: false, // 控制献血者信息页面显示
      donorList: [ 
        { id: 1, name: '李想', bloodType: 'Rh阴型', age: '21周岁' },
        { id: 2, name: '陈毅', bloodType: 'Rh阴型', age: '21周岁' }
      ],
      scienceList: [
        {
          question: "我是O型血，我是万能的吗？",
          answer: "O型血是万能献血者，但只能接受O型血。O型血的红细胞没有A、B抗原，但血浆中含有抗A和抗B抗体，因此只能少量输给其他血型。",
          isOpen: false // 控制折叠状态
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
      ],
      showAnswerPage: false,
      currentQuestion: "",
      currentAnswer: "",
      currentSubAnswer: ""
    }
  },
  
  methods: {
    // 点击问题触发
    showAnswerDialog(e) {
      const index = e.currentTarget.dataset.index;
      const item = this.scienceList[index] || {};
      console.log('点击问题：', item); // 调试输出问题和答案
      this.showAnswerPage = true;
      this.currentQuestion = item.question || "问题加载失败";
      this.currentAnswer = item.answer || "答案未提供";
      this.currentSubAnswer = item.subAnswer || "";
    },
    
    // 跳转到献血者信息页面
    goToDonorInfoPage() {
      this.showRecruitPage = false;
      this.showDonorInfoPage = true;
    },
    
    // 查看详情
    viewDonorDetail(e) {
      const id = e.currentTarget.dataset.id;
      uni.navigateTo({
        url: `/pages/donor-detail/donor-detail?id=${id}`
      });
    },
    
    toggleSign(e) {
      const index = e.currentTarget.dataset.index;
      const activities = this.activities.map((item, i) => {
        if (i === index) {
          return {
            ...item,
            isSigned: !item.isSigned,
            count: item.count + (item.isSigned ? -1 : 1)
          };
        }
        return item;
      });
      this.activities = activities;
    },
    
    // **跳转发布页面**
    goToRecruitPage(e) {
      const type = e.currentTarget.dataset.type; // 获取按钮类型（emergency/activity）
      this.showRecruitPage = true;
      this.recruitType = type; // 存储发布类型
    },
  
    // **跳转查看页面**
    goToInfoPage(e) {
      const type = e.currentTarget.dataset.type; // 获取按钮类型（emergency/activity）
      this.showInfoPage = true;
      this.infoType = type; // 存储发布类型
    },

    // **返回主页面**
    goBack() {
      this.showRecruitPage = false;
      this.showDonorInfoPage = false;
      this.showPopup = false;
      this.showAnswerPage = false;
    }, 
  
    // 打开弹窗
    openPopup() {
      this.showPopup = true;
    },
  
    // 关闭弹窗
    closePopup() {
      this.showPopup = false;
    },
  
    // 处理血型选择变化
    onBloodTypeChange(e) {
      this.selectedBloodType = this.bloodTypes[e.detail.value];
      //e.detail.value是当前选择的那个选项的index
    },
  
    // 处理献血条件选择变化
    onConditionChange(e) {
      this.selectedCondition = this.conditions[e.detail.value];
    },
  
    // 处理输入框数据变化
    onInputChange(e) {
      let field = e.currentTarget.dataset.field;
      let value = e.detail.value;
      this.recruitData = { ...this.recruitData, [field]: value };
    },
  
    // 提交招募信息
    submitRecruitment() {
      console.log("提交招募信息2");
      let { recruitData, selectedBloodType, selectedCondition, infoList } = this;
      
      if (selectedBloodType === "请选择血型" || selectedCondition === "请选择献血条件") {
        uni.showToast({ title: "请选择血型和献血条件", icon: "none" });
        return;
      }
      
      console.log(this.selectedBloodType);
      
      let newRecruit = {
        bloodType: selectedBloodType,
        recruitTime: recruitData.recruitTime || "未填写",
        location: recruitData.location || "未填写",
        targetGroup: recruitData.targetGroup || "未填写",
        recruitNumber: recruitData.recruitNumber || "未填写",
        condition: selectedCondition,
        timestamp: new Date().getTime()
      };
      
      console.log(this.recruitData);
      console.log(this.recruitData["targetGroup"]);
      
      uni.request({
        url: 'https://jobguard.online/api/activity/publish-activity', // 替换为你的后端 API 地址
        method: 'POST', //请求方式
        header: {
          'Authorization': this.Token,
          'Content-Type': 'application/json' //请求头格式为json
        },
        //请求体
        data: {
          "bloodType": this.selectedBloodType,
          "timeRange": this.recruitData["recruitTime"],
          "address": this.recruitData["location"],
          "targetPeople": this.recruitData["targetGroup"],
          "maxParticipateCount": this.recruitData["recruitNumber"],
          "needs": this.selectedCondition,
          "isEmergency": "true",
          "coverUrl": "https://img.tusij.com/tgs_assets/ips_templ_preview/25/c0/9b/lg_3403740_1614845676_604096ec325be.jpg?auth_key=2315410104-0-0-b848c59237ac0883581cddafd780ae65&x-oss-process=image/resize,m_fixed,h_298,w_700",//这里固定默认的活动图片
          "title": "111" //标题
        },
        success: (res) => { //请求成功回调
          console.log('后端返回:', res.data); //打印信息进行调试
        },
        //请求失败
        fail: (err) => {
          console.error('请求失败:', err);
          uni.showToast({
            title: '网络错误，请稍后重试',
            icon: 'none'
          });
        }
      });
      
      this.infoList = [newRecruit, ...infoList];
      this.showPopup = false;
      this.selectedBloodType = "请选择血型";
      this.selectedCondition = "请选择献血条件";
      this.recruitData = {};
      
      uni.showToast({ title: "发布成功", icon: "success" });
    },
    
    // 方式一：直接赋值替代setData
    setData: function(obj) {
      for (let key in obj) {
        this[key] = obj[key];
      }
    }
  },
  
  // 生命周期函数直接放到export default下
  onLoad() {
    // 获取本地存储的数据
    uni.getStorage({
      key: 'userIdentity', // 要获取的 key
      success: (res) => {
        this.identitySelected = res.data.Identity; // 获取到的数据存入页面的 data 中
        this.Token = res.data.token;
        console.log(res.data);  
        console.log(this.identitySelected);
      },
      fail: () => {
        console.error('获取数据失败');
      }
    });
  },
  
  onShow() {
    // 原代码没有onShow方法
  }
}
</script>

<template>
    <view>
      <customFab />
      <!-- 页面 1 -->
      <view class="page-container1" v-if="!showRecruitPage && !showDonorInfoPage && !showAnswerPage">
        <image src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/background.png" class="page-background" mode="aspectFill"></image>
        <view class="content-area">
          <view class="platform-title">献血 e 站</view>
          
          <!-- 第一部分：轮播图 -->
          <swiper class="banner-swiper" indicator-dots="true" autoplay="true" interval="3000" duration="500" circular="true">
            <swiper-item>
              <image src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/1.png" mode="aspectFill" class="banner-image"></image>
            </swiper-item>
            <swiper-item>
              <image src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/2.png" mode="aspectFill" class="banner-image"></image>
            </swiper-item>
            <swiper-item>
              <image src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/3.png" mode="aspectFill" class="banner-image"></image>
            </swiper-item>
          </swiper>
          
          <!-- 第三部分：图标 -->
          <view class="icon-container" v-if="identitySelected == '兼职护士'">
            <view class="icon-item" @tap="goToRecruitPage" data-type="emergency">
              <image src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/发布紧急信息.png" class="function-icon"></image>
              <text class="icon-text">发布紧急信息</text>
            </view>
            <view class="icon-item" @tap="goToRecruitPage" data-type="activity">
              <image src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/发布献血者活动通知.png" class="function-icon"></image>
              <text class="icon-text">招募活动发布</text>
            </view>
            <view class="icon-item" @tap="goToLecturePage">
              <image src="../../../static/images/主题讲座.png" class="function-icon"></image>
              <text class="icon-text">主题讲座</text>
            </view>
            <view class="icon-item" @tap="goToDonorInfoPage">
              <image src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/管理献血者信息.png" class="function-icon"></image>
              <text class="icon-text">献血者信息</text>
            </view>
          </view>
          <view class="icon-container" v-if="identitySelected == '管理员'">
            <view class="icon-item" @tap="goToActivityCheck">
              <image src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/活动审核.png" class="function-icon"></image>
              <text class="icon-text">活动审核</text>
            </view>
            <view class="icon-item">
              <image src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/活动数据分析.png" class="function-icon"></image>
              <text class="icon-text">活动数据分析</text>
            </view>
            <view class="icon-item" @tap="goToDonorInfoPage">
              <image src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/管理献血者信息.png" class="function-icon"></image>
              <text class="icon-text">管理献血者信息</text>
            </view>
          </view>
          <view class="icon-container" v-if="identitySelected == '研究所专家'">
            <view class="icon-item" @tap="goToRecruitPage" data-type="emergency">
              <image src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/发布紧急信息.png" class="function-icon"></image>
              <text class="icon-text">发布紧急信息</text>
            </view>
            <view class="icon-item">
              <image src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/信息中心.png" class="function-icon"></image>
              <text class="icon-text">信息中心</text>
            </view>
            <view class="icon-item">
              <image src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/推荐临床专家.png" class="function-icon"></image>
              <text class="icon-text">推荐临床医生</text>
            </view>
            <view class="icon-item">
              <image src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/推荐稀有血源.png" class="function-icon"></image>
              <text class="icon-text">推荐稀有血型</text>
            </view>
          </view>
          <view class="icon-container" v-if="identitySelected == '献血者'">
            <view class="icon-item" @tap="goToRecruitPage" data-type="emergency">
              <image src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/紧急信息查看.png" class="function-icon"></image>
              <text class="icon-text">紧急信息查看</text>
            </view>
            <view class="icon-item">
              <image src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/已报名活动.png" class="function-icon"></image>
              <text class="icon-text">已报名活动</text>
            </view>
            <view class="icon-item">
              <image src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/预约记录.png" class="function-icon"></image>
              <text class="icon-text">预约记录</text>
            </view>
          </view>
          
          <!-- 今日科普 -->
          <view class="section">
            <navigator class="nav-title">
              <view class="title">今日科普</view>
              <navigator class="nav-arrow">
                <text class="arrow-text">更多</text>
                <image class="arrow" src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/进入.png"></image>
              </navigator>
            </navigator>
      
            <!-- 循环渲染科普问题 -->
            <view class="qa-list">
              <template v-for="(item, index) in scienceList" :key="index">
                <!-- 点击问题触发 showAnswerDialog 方法，并传递索引 -->
                <view class="qa-item" @tap="showAnswerDialog" :data-index="index">
                  <view class="question">
                    <!-- <text class="q-mark">Q{{ index + 1 }}.</text> -->
                     <image
                      class="rankingIcon"
                      mode="scaleToFill"
                       :src="`https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/hoticon${index+1}.png`"
                     />
                    <text>{{ item.question }}</text>
                    <text class="hotText">热</text>
                    <!-- <image class="arrow" src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/进入.png"/> -->
                    <!-- <image class="arrow" src="/src/static/images/hoticon1.png"/> -->
                  </view>
                </view>
              </template>
            </view>
          </view>
      
          <!-- 第四部分：献血活动发布栏框 -->
          <view class="activity-container">
            <image src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/发布栏背景图.png" class="background-image"></image>
            <view class="header-content">
              <view class="activity-header">献血活动发布栏</view>
              <scroll-view scroll-y :style="'height: ' + scrollHeight + 'px;'" enhanced>
                <view class="activity-content">
                  <view class="activity-list">
                    <template v-for="(item, index) in activities" :key="item.id">
                      <view class="activity-item">
                        <image :src="item.imageUrl || 'https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/献血活动海报.png'" class="activity-image"></image>
                        <view class="activity-info">
                          <view class="activity-title">{{ item.title }}</view>
                          <view class="activity-participants">已报名：{{ item.count }}人</view>
                          <button :class="['signup-button', item.isSigned ? 'signed' : '']" @tap="toggleSign" :data-index="index">
                            {{ item.isSigned ? '已报名' : '报名' }}
                          </button>
                        </view>
                      </view>
                    </template>
                  </view>
                </view>
              </scroll-view>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 页面 2：招募/发布页面 -->
      <view class="page-container2" v-if="showRecruitPage">
        <image src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/background.png" class="page-background" mode="aspectFill"></image>
        <view class="content-area">
          <view class="platform-title">献血 e 站</view>
          <!-- 紧急信息/活动发布中心 -->
          <view class="container">
            <image src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/发布栏背景.png" class="container-bg"></image>
            <view class="header">
              <image src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/返回.png" class="back-icon" @tap="goBack"></image>
              <text class="header-title">
                {{ recruitType === 'emergency' ? '紧急信息发布中心' : '献血活动发布中心' }}
              </text>
            </view>
      
            <!-- 信息列表 -->
            <view class="info-list">
              <template v-for="(item, index) in infoList" :key="item.timestamp">
                <view class="info-item">
                  <text class="info-title">紧急招募献血</text>
                  <text class="info-detail">招募血型: {{ item.bloodType }}</text>
                  <text class="info-detail">招募时间: {{ item.recruitTime }}</text>
                  <text class="info-detail">献血地点: {{ item.location }}</text>
                  <text class="info-detail">招募人群: {{ item.targetGroup }}</text>
                  <text class="info-detail">招募数量: {{ item.recruitNumber }} 人</text>
                  <text class="info-detail">献血条件: {{ item.condition }}</text>
                </view>
              </template>
            </view>
      
            <!-- 发布招募按钮 -->
            <view class="recruit-button" @tap="openPopup">
              <image src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/加号.png" class="recruit-icon"></image>
              <text class="recruit-text">
                {{ recruitType === 'emergency' ? '发布紧急招募活动' : '发布招募活动' }}
              </text>
            </view>
          </view>
        </view>
      
        <!-- 弹窗 -->
        <view class="popup-container" v-if="showPopup">
          <view class="popup-box">
            <image src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/关闭.png" class="close-icon" @tap="closePopup"></image>
            <!-- 弹窗标题 -->
            <view class="popup-title">
              <text class="popup-title-text">
                {{ recruitType === 'emergency' ? '发布紧急招募信息' : '发布招募活动' }}
              </text>
            </view>
            <!-- 输入框 -->
            <view class="form-group">
              <text class="form-label">招募血型</text>
              <picker mode="selector" :range="bloodTypes" @change="onBloodTypeChange">
                <view class="picker">{{ selectedBloodType }}</view>
              </picker>
            </view>
            <view class="form-group">
              <text class="form-label">招募时间</text>
              <input class="input-box" placeholder="x年x月x日-y年y月y日" @input="onInputChange" data-field="recruitTime" />
            </view>
            <view class="form-group">
              <text class="form-label">招募地点</text>
              <input class="input-box" placeholder="请输入招募地点" @input="onInputChange" data-field="location" />
            </view>
            <view class="form-group">
              <text class="form-label">招募人群</text>
              <input class="input-box" placeholder="请输入招募人群" @input="onInputChange" data-field="targetGroup" />
            </view>
            <view class="form-group">
              <text class="form-label">招募数量</text>
              <input class="input-box" placeholder="请输入招募人数" type="number" @input="onInputChange" data-field="recruitNumber" />
            </view>
            <view class="form-group">
              <text class="form-label">献血条件</text>
              <picker mode="selector" :range="conditions" @change="onConditionChange">
                <view class="picker">{{ selectedCondition }}</view>
              </picker>
            </view>
            <view class="confirm-btn" @tap="submitRecruitment">确认发布</view>
          </view>
        </view>
      </view>
      
      <!-- 页面 3：献血者信息页面 -->
      <view class="page-container3" v-if="showDonorInfoPage">
        <image src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/background.png" class="page-background" mode="aspectFill"></image>
        <view class="content-area">
          <view class="platform-title">献血 e 站</view>
          <!-- 献血者信息列表 -->
          <view class="container">
            <image src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/发布栏背景.png" class="container-bg"></image>
            <view class="header">
              <image src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/返回.png" class="back-icon" @tap="goBack"></image>
              <text class="header-title">献血者信息管理</text>
            </view>
            <!-- 表格化列表 -->
            <view class="donor-list">
              <!-- 表头 -->
              <view class="donor-row header-row">
                <text class="col-name">用户名称</text>
                <text class="col-blood">用户血型</text>
                <text class="col-age">用户年龄</text>
                <text class="col-action">操作</text>
              </view>
              <!-- 数据行 -->
              <template v-for="(item, index) in donorList" :key="item.id">
                <view class="donor-row">
                  <text class="col-name">{{ item.name || '未命名' }}</text>
                  <text class="col-blood">{{ item.bloodType || '未知' }}</text>
                  <text class="col-age">{{ item.age || '未知' }}</text>
                  <text class="col-action">查看详情</text>
                </view>
                <!-- 调试文本 -->
                <text>当前数据：{{ JSON.stringify(item) }}</text>
              </template>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 页面 4：信息详情页面 -->
      <view class="page-container4" v-if="showInfoPage">
        <image src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/background.png" class="page-background" mode="aspectFill"></image>
        <view class="content-area">
          <view class="platform-title">献血 e 站</view>
          <view class="container">
            <image src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/发布栏背景.png" class="container-bg"></image>
            <view class="header">
              <image src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/返回.png" class="back-icon" @tap="goBack"></image>
              <text class="header-title">
                {{ infoType === 'emergency' ? '紧急信息发布中心' : '已报名活动' }}
              </text>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 页面 4（另一版）：科普回答页面 -->
      <view class="page-container4" v-if="showAnswerPage">
        <image src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/background.png" class="page-background" mode="aspectFill"></image>
        <view class="content-area">
          <view class="platform-title">献血 e 站</view>
          <view class="container">
            <image src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/发布栏背景.png" class="container-bg"></image>
            <view class="header">
              <image src="https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/返回.png" class="back-icon" @tap="goBack"></image>
              <!-- 动态绑定当前问题标题 -->
              <text class="header-title">{{ currentQuestion }}</text>
            </view>
            <!-- 答案内容 -->
            <view class="answer-content">
              <!-- 主答案 -->
              <text>{{ currentAnswer }}</text>
              <!-- 子答案（可无） -->
              <view v-if="currentSubAnswer" class="sub-answer">
                <text>{{ currentSubAnswer }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>


    </view>
  </template>

<style>
/* pages/nurse/information/information.wxss */
/* 设置页面的高度为100%，并隐藏滚动条 */
page {
    height: 100%;
    overflow: hidden;
}

/* 页面主容器，确保全屏显示，并居中对齐内容 */
.page-container1 {
    position: relative;
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
}

/* 固定背景图片，使其覆盖整个页面 */
.page-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -2; /* 让背景层级最低 */
}

/* 内容区域样式，纵向排列，并设置顶部内边距 */
.content-area {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 90rpx;
    box-sizing: border-box;
}

/* 平台标题样式，居中显示 */
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

/* 轮播图样式 */
.banner-swiper {
    width: 92%;
    height: 390rpx;
    border-radius: 20rpx;
    overflow: hidden;
    margin-bottom: 30rpx;
}

/* 轮播图图片填充整个容器 */
.banner-image {
    width: 100%;
    height: 100%;
}

/* 搜索框样式 */
.search-container {
    width: 84%;
    height: 80rpx;
    background-color: white;
    border-radius: 15rpx;
    display: flex;
    align-items: center;
    padding: 0 30rpx;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
    position: relative;
    margin-top: 10px;
}


/* 功能图标区域，水平排列 */
.icon-container {
    width: 92%;
    display: flex !important;
    justify-content: space-around;
    margin-bottom: 30rpx;
}

/* 单个功能图标项，纵向排列 */
.icon-item {
    display: flex;
    flex-direction: column;
    align-items: center;
}

/* 功能图标图片样式 */
.function-icon {
    width: 120rpx;
    height: 120rpx;
    margin-bottom: 10rpx;
}

/* 图标文本样式 */
.icon-text {
    font-size: 11px;
    color: #333;
}

/* 献血活动发布栏容器 */
.activity-container {
    width: 91%;
    height: 63%;
    border-radius: 15rpx;
    position: relative;
    margin-top: 10px;
    overflow: hidden; /* 确保背景图片不超出边界 */
    /* overflow-y: auto; 垂直方向可滚动 */
}
.header-content
{
  width: 100%;
  height: 100%;  
  position: relative;
  z-index: 1; 
}
/* 活动标题，居中显示 */
.activity-header {
    text-align: center;
    font-size: 16px;
    font-weight: bold;
    color: black;
    padding: 15rpx 0;
    border-bottom: 1rpx solid #eee;
    margin-bottom: 20rpx;
    background-color: #f79999;
}

/* 活动背景图片，填充整个容器 */
.background-image {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
}

/* 活动内容区域，确保在背景图片上方 */
.activity-content {
    /* position: relative;
    z-index: 1; */
    padding: 10rpx;
}


/* 活动列表样式 */
.activity-list {
    width: 100%;
}

/* 单个活动项样式 */
.activity-item {
    display: flex;
    padding: 20rpx 0;
    border-bottom: 1rpx solid #eee;
}

/* 活动图片样式 */
.activity-image {
    width: 280rpx;
    height: 160rpx;
    border-radius: 10rpx;
    margin-right: 20rpx;
}

/* 活动信息区域，包含标题、参与人数等 */
.activity-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 160rpx;
    position: relative;
}

/* 活动标题样式 */
.activity-title {
    font-size: 16px;
    color: #333;
    margin-bottom: 10rpx;
}

/* 活动参与人数样式 */
.activity-participants {
    font-size: 12px;
    color: #888;
}

/* 报名按钮样式，固定在右下角 */
.signup-button {
    width: 100rpx !important;
    height: 50rpx;
    background-color: #e74c3c;
    color: white;
    font-size: 12px;
    border-radius: 18rpx;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    padding: 0;
    margin: 0;
    position: absolute;
    bottom: 0;
    right: 0;
    transition: all 0.3s ease;
}
/* 已报名状态 */
.signup-button.signed {
  background: rgba(7, 193, 96, 0.5);
  opacity: 0.8;
}
/*第二个页面*/

/* 页面整体样式 */
.page-container2 {
    position: relative;
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
}

/* 背景图片 */
.page-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -2;
}

/* 内容区域 */
.content-area {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 90rpx;
    box-sizing: border-box;
}



/* 主容器 */
.container {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 92%;
    height: 90%;
    background-color: white;
    border: 1px solid white;
    border-radius: 15px;
    padding: 30rpx 0;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    z-index: 1;
} 
/* 背景图片 */
.container-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0; /* 让它处于最底层 */
    border-radius: 13px;
}

/* 返回按钮 + 标题 */
.header {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 20rpx;
    border-bottom: 1px solid #ddd;
    position: relative;
    height: 70rpx;
}

.back-icon {
    width: 40rpx;
    height: 40rpx;
    margin-left: 20rpx;
    cursor: pointer;
    position: relative;
    top: 0;
}

.header-title {
    flex: 1;
    text-align: center;
    font-size: 18px;
    font-weight: bold;
    color: #333;
    line-height: 1;
    position: relative;
    top: -15rpx;
}

/* 信息列表 */
.info-list {
    width: 90%;
    height: 80%;
    position: relative;
    margin-top: 20rpx;
    margin-bottom: 50px;
}

/* 单个信息项 */
.info-item {
    background: #f9f9f9;
    padding: 20rpx;
    border: 1rpx solid #ddd;
    border-radius: 10rpx;
    margin-bottom: 15rpx;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    position: relative; /* 让人数标注可以绝对定位 */
}

/* 标题样式 */
.info-title {
    font-size: 16px;
    font-weight: bold;
    color: #d9534f;
    margin-bottom: 10rpx;
    display: block;
}

/* 详情项样式 */
.info-detail {
    font-size: 14px;
    color: #555;
    margin-bottom: 5rpx;
    display: block;
}

/* 人数标注 */
.recruit-status {
    position: absolute;
    bottom: 10rpx;
    right: 15rpx;
    font-size: 14px;
    color: #31708f;
    background: #d9edf7;
    padding: 5rpx 10rpx;
    border-radius: 5rpx;
}

/* 招募完毕样式 */
.recruit-full {
    background: #d9534f;
    color: white;
}


/* 底部招募按钮 */
.recruit-button {
    position: absolute;
    bottom: 20rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.recruit-icon {
    width: 100rpx;
    height: 100rpx;
    cursor: pointer;
}
.recruit-text{
    font-size: 14px;
    font-weight: 600;
    position: relative;
    top: -20rpx;
}
/* 弹窗样式 */
.popup-container {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    height: 60%;
    background: white;
    border-radius: 15px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20rpx;
    z-index: 1000;
}

/* 退出按钮 */
.close-icon {
    position: absolute;
    top: 15rpx;
    right: 15rpx;
    width: 40rpx;
    height: 40rpx;
    cursor: pointer;
}

/* 弹窗标题 */
.popup-title {
    font-size: 18px;
    font-weight: bold;
    color: #333;
    position: relative;
    margin-top: 20px;
    margin-bottom: 40px;
    text-align: center;
}

/* 表单项 */
.form-group {
    width: 90%;
    margin-bottom: 20rpx;
    display: flex;
    align-items: center;
}

.form-label {
    width: 30%;
    height: 20px;
    background: #ff6f61;
    color: white;
    font-size: 14px;
    padding: 10rpx;
    text-align: center;
    border: 1px solid #ccc;
    border-radius: 15rpx;
}

.input-box {
  flex: 1;
  height: 20px;
  padding: 10rpx;
  font-size: 14px;
  border: 1px solid #ccc;
  background: white;
  margin-left: -10rpx;
  white-space: nowrap; /* 禁止文字换行 */
  overflow: hidden; /* 隐藏溢出部分 */
  text-overflow: ellipsis; /* 显示省略号 */
}
.picker {
    flex: 1;
    height: 20px;
    padding: 10rpx;
    font-size: 14px;
    border: 1px solid #ccc;
    background: white;
    margin-left: -10rpx;
}

/* 确认发布按钮 */
.confirm-btn {
    width: 40%;
    background: #ff6f61;
    color: white;
    font-size: 16px;
    padding: 15rpx;
    text-align: center;
    border-radius: 15px;
    margin-top: 20rpx;
    margin: auto;
}

/* 献血者信息页专用样式 */
.page-container3 {
    position: relative;
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
}

.donor-list {
  width: 80%;
  padding: 20rpx;
  position: relative;
  z-index: 1;
  height: calc(100vh - 240rpx); /* 视窗高度减去标题和页脚 */
  overflow-y: auto; /* 启用垂直滚动 */
}

.donor-row {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #eee;
}

.header-row {
  font-weight: bold;
  background-color: #f5f5f5;
}

.col-name {
  flex: 1;
  padding-left: 20rpx;
}

.col-blood {
  flex: 1;
  text-align: center;
}

.col-age {
  flex: 1;
  text-align: center;
}

.col-action {
  flex: 1;
  color: #07c160;
  text-align: center;
  text-decoration: underline;
}

/* 查看活动专用样式 */
.page-container4 {
    position: relative;
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    flex-direction: column; /* 改为纵向布局 */
    justify-content: flex-start; /* 顶部对齐 */
  }
  
  /* 板块标题 */
  .section{
    background-color: rgb(247, 153, 153);
    width: 92%;
    border-radius: 16rpx;
  }
  
  
  .title {
    font-size: 15px;
    font-weight: bold;
    color: #333;
    padding: 15px;
    border-bottom: 1px solid #eee;
  }
  
  
  /* 问答项样式 */
  .qa-item {
    margin: 1px;
    padding: 15px;
    height: 15rpx;
    display: flex;
    align-items: center;
    border-radius: 3px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    background: linear-gradient(to right,#febab7, #fff);
  }
  
  .question {
    font-size: 14px;
    color: black;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    position: relative;
    padding-left: 10rpx;
    padding-right: 10rpx;
  }
  
  .q-mark {
    color: #e54d42;
    margin-right: 8px;
  }
  
  .arrow {
    width: 16px;
    height: 16px;
    margin-left: auto;
  }

  /* 排行榜图标设置 */
  .rankingIcon{
    width: 16px;
    height: 16px;
    margin-right: 10rpx;
  }

  .hotText{
    display: block;
    background-color: #fdbebb;
    padding: 8rpx;
    border-radius: 8rpx;
    color: #d9534f;
  }
  
  .answer {
    margin-top: 10px;
    padding: 10px;
    background: #f8f8f8;
    border-radius: 4px;
    font-size: 14px;
    color: #888;
  }
  
  /* 答案内容区域 */
  .answer-content {
    font-size: 16px;
    padding: 20rpx;
    line-height: 1.2;
    color: #333;
    border-radius: 8rpx;
    margin-top: 0;
    position: relative;
    top: -900rpx;
    z-index: 1000;
  }
  
  .sub-answer {
    margin-top: 8px;
    color: #999;
    font-size: 12px;
  }
  
  /* 活动列表样式 */
  .activity-item {
    padding: 12px;
    margin: 10px;
    background: #fff;
    border-radius: 8px;
    display: flex;
    align-items: center;
  }
  
  .date {
    color: #e54d42;
    font-weight: bold;
    flex: 1;
  }
  
  .location {
    flex: 2;
    color: #666;
  }
  
  .status {
    flex: 1;
    text-align: right;
    color: #09bb07;
  }
  
  .nav-title{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx;
    height: 20rpx;
  }
  
  .nav-arrow{
    display: flex;
  }
  
  .arrow-text{
    font-size: 25rpx;
    align-items: center;
    font-weight: 600;
  }
</style>