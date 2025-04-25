<script setup>
import { ref, onMounted } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import customFab from '@/components/CustomFab.vue'
import * as echarts from 'echarts'

// 响应式数据
const identitySelected = ref("")
const scrollHeight = ref(250)
const showPopup = ref(false)
const showRecruitPage = ref(false)
const showInfoPage = ref(false)
const bloodTypes = ref(["Rh", "p", "JK"])
const selectedBloodType = ref("请选择血型")
const conditions = ref(["标准", "自定义"])
const selectedCondition = ref("请选择献血条件")
const recruitData = ref({})
const infoList = ref([])
const recruitType = ref('emergency')
const infoType = ref('emergency')
const Token = ref("")
const activities = ref([
  { 
    id: 1, 
    title: '稀有血型O型Rh阴性献血', 
    count: 32, 
    isSigned: false,
    imageUrl: 'https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/献血活动海报.png' 
  },
  { 
    id: 2, 
    title: 'AB型血献血者紧急招募', 
    count: 18, 
    isSigned: false,
    imageUrl: 'https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/献血活动海报2.png' 
  },
  { 
    id: 3, 
    title: 'AB型血献血者紧急招募', 
    count: 25, 
    isSigned: false,
    imageUrl: 'https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/献血活动海报2.png' 
  }
])
const showDonorInfoPage = ref(false)
const donorList = ref([
  { id: 1, name: '李想', bloodType: 'Rh阴型', age: '21周岁' },
  { id: 2, name: '陈毅', bloodType: 'Rh阴型', age: '21周岁' }
])
const scienceList = ref([
  {
    question: "我是O型血，我是万能的吗？",
    answer: '🩸O型血并非真正"万能"！其特殊性体现在：1️⃣红细胞无A/B抗原，可作为应急供体（仅限红细胞）给其他血型🔬，但血浆含抗A/B抗体，大量输注可能引发反应💉;2️⃣接受端仅限O型血，不可接受其他血型❌;⚠️Rh阴性O型血（熊猫血）适用范围更窄🐼;现代输血遵循严格配型原则，O型血在紧急情况（如🚑战地急救）可作为"权宜之计"，但非绝对安全。实际应用需结合Rh因子检测🔍、交叉配血及成分输血技术综合判断。',
    isOpen: false
  },
  {
    question: "稀有血型有哪几种？",
    answer: "主要包括Rh阴性血型（如熊猫血）、孟买型、JK表型等。",
    isOpen: false
  },
  {
    question: '"熊猫血"是什么？"熊猫血"有多珍稀？',
    answer: '"熊猫血"指的是 Rh阴性血型（Rh-），在中国人群中非常稀有，仅占 约0.3%，因此被称为像熊猫一样珍贵的血型🐼🩸。相比之下，绝大多数中国人是Rh阳性（Rh+）。所以当Rh阴性的人需要输血时，能匹配的血源特别少，抢救时非常紧急，一旦找不到合适的血，后果可能非常严重⚠️。',
    subAnswer: "因稀缺性类似熊猫，故得名。需特别注意血源储备。",
    isOpen: false
  }
])
const showAnswerPage = ref(false)
const currentQuestion = ref("")
const currentAnswer = ref("")
const currentSubAnswer = ref("")

// 新增的血库数据
const bloodSupplyData = ref({
  rareBloods: [
    { type: 'Rh阴性', amount: 56 },
    { type: 'P阴性', amount: 78 },
    { type: 'JK阴性', amount: 162 },
    { type: '孟买型', amount: 45 },
    { type: 'Diego', amount: 35 }
  ],
  commonBloods: [
    { type: 'A型', amount: 1240 },
    { type: 'B型', amount: 1480 },
    { type: 'O型', amount: 2150 },
    { type: 'AB型', amount: 680 }
  ],
  monthlyUsage: [
    { month: '1月', A: 320, B: 380, O: 520, AB: 150 },
    { month: '2月', A: 345, B: 410, O: 560, AB: 170 },
    { month: '3月', A: 390, B: 425, O: 580, AB: 185 },
    { month: '4月', A: 410, B: 450, O: 610, AB: 195 },
    { month: '5月', A: 370, B: 420, O: 570, AB: 180 },
    { month: '6月', A: 400, B: 460, O: 590, AB: 200 }
  ]
})

// 血型颜色映射
const bloodTypeColors = {
  'A型': '#FF6384',
  'B型': '#36A2EB',
  'O型': '#FFCE56',
  'AB型': '#4BC0C0',
  'Rh阴性': '#FF9F40',
  'P阴性': '#9966FF',
  'JK阴性': '#FF6384',
  'Diego': '#C9CBCF',
  '孟买型': '#36A2EB'
}

// ECharts 实例
let rareBloodChart = null
let commonBloodChart = null
let usageChart = null

// 方法定义
const showAnswerDialog = (e) => {
  const index = e.currentTarget.dataset.index
  const item = scienceList.value[index] || {}
  console.log('点击问题：', item)
  showAnswerPage.value = true
  currentQuestion.value = item.question || "问题加载失败"
  currentAnswer.value = item.answer || "答案未提供"
  currentSubAnswer.value = item.subAnswer || ""
}

const goToDonorInfoPage = () => {
  showRecruitPage.value = false
  showDonorInfoPage.value = true
}

const viewDonorDetail = (e) => {
  const id = e.currentTarget.dataset.id
  uni.navigateTo({
    url: `/pages/donor-detail/donor-detail?id=${id}`
  })
}

const toggleSign = (e) => {
  const index = e.currentTarget.dataset.index
  activities.value = activities.value.map((item, i) => {
    if (i === index) {
      return {
        ...item,
        isSigned: !item.isSigned,
        count: item.count + (item.isSigned ? -1 : 1)
      }
    }
    return item
  })
}

const goToRecruitPage = (e) => {
  const type = e.currentTarget.dataset.type
  showRecruitPage.value = true
  recruitType.value = type
}

const goToInfoPage = (e) => {
  const type = e.currentTarget.dataset.type
  showInfoPage.value = true
  infoType.value = type
}

const goBack = () => {
  showRecruitPage.value = false
  showDonorInfoPage.value = false
  showPopup.value = false
  showAnswerPage.value = false
}

const openPopup = () => {
  showPopup.value = true
}

const closePopup = () => {
  showPopup.value = false
}

const onBloodTypeChange = (e) => {
  selectedBloodType.value = bloodTypes.value[e.detail.value]
}

const onConditionChange = (e) => {
  selectedCondition.value = conditions.value[e.detail.value]
}

const onInputChange = (e) => {
  const field = e.currentTarget.dataset.field
  const value = e.detail.value
  recruitData.value = { ...recruitData.value, [field]: value }
}

const submitRecruitment = () => {
  console.log("提交招募信息2")
  
  if (selectedBloodType.value === "请选择血型" || selectedCondition.value === "请选择献血条件") {
    uni.showToast({ title: "请选择血型和献血条件", icon: "none" })
    return
  }
  
  console.log(selectedBloodType.value)
  
  const newRecruit = {
    bloodType: selectedBloodType.value,
    recruitTime: recruitData.value.recruitTime || "未填写",
    location: recruitData.value.location || "未填写",
    targetGroup: recruitData.value.targetGroup || "未填写",
    recruitNumber: recruitData.value.recruitNumber || "未填写",
    condition: selectedCondition.value,
    timestamp: new Date().getTime()
  }
  
  console.log(recruitData.value)
  console.log(recruitData.value["targetGroup"])
  
  uni.request({
    url: 'https://jobguard.online/api/activity/publish-activity',
    method: 'POST',
    header: {
      'Authorization': Token.value,
      'Content-Type': 'application/json'
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
      console.log('后端返回:', res.data)
    },
    fail: (err) => {
      console.error('请求失败:', err)
      uni.showToast({
        title: '网络错误，请稍后重试',
        icon: 'none'
      })
    }
  })
  
  infoList.value = [newRecruit, ...infoList.value]
  showPopup.value = false
  selectedBloodType.value = "请选择血型"
  selectedCondition.value = "请选择献血条件"
  recruitData.value = {}
  
  uni.showToast({ title: "发布成功", icon: "success" })
}

// 初始化 ECharts 图表
const initECharts = () => {
  // 确保页面已加载
  console.log('页面加载完成，初始化图表')
  const setupCharts = () => {
    // 初始化稀有血型库存图表
    const rareBloodChartDom = document.getElementById('rare-blood-chart')
    if (rareBloodChartDom) {
      rareBloodChart = echarts.init(rareBloodChartDom)
      const rareOption = {
        title: {
          text: '稀有血型库存(单位:袋)',
          left: 'center',
          textStyle: {
            fontSize: 14
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '5%',
          right: '5%',
          bottom: '10%',
          top: '60px',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: bloodSupplyData.value.rareBloods.map(item => item.type),
          axisLabel: {
            interval: 0,
            rotate: 0
          }
        },
        yAxis: {
          type: 'value',
          name: '库存量(袋)'
        },
        series: [
          {
            name: '库存量',
            type: 'bar',
            data: bloodSupplyData.value.rareBloods.map(item => ({
              value: item.amount,
              itemStyle: {
                color: bloodTypeColors[item.type] || '#FF6384'
              }
            })),
            barWidth: '40%',
            label: {
              show: true,
              position: 'top'
            }
          }
        ]
      }
      rareBloodChart.setOption(rareOption)
    }

    // 初始化常规血型库存图表
    const commonBloodChartDom = document.getElementById('common-blood-chart')
    if (commonBloodChartDom) {
      commonBloodChart = echarts.init(commonBloodChartDom)
      const commonOption = {
        title: {
          text: '常规血型库存(单位:袋)',
          left: 'center',
          textStyle: {
            fontSize: 14
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '5%',
          right: '5%',
          bottom: '10%',
          top: '60px',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: bloodSupplyData.value.commonBloods.map(item => item.type),
          axisLabel: {
            interval: 0,
            rotate: 0
          }
        },
        yAxis: {
          type: 'value',
          name: '库存量(袋)'
        },
        series: [
          {
            name: '库存量',
            type: 'bar',
            data: bloodSupplyData.value.commonBloods.map(item => ({
              value: item.amount,
              itemStyle: {
                color: bloodTypeColors[item.type] || '#36A2EB'
              }
            })),
            barWidth: '40%',
            label: {
              show: true,
              position: 'top'
            }
          }
        ]
      }
      commonBloodChart.setOption(commonOption)
    }

    // 初始化月度用血量图表
    const usageChartDom = document.getElementById('usage-chart')
    if (usageChartDom) {
      usageChart = echarts.init(usageChartDom)
      const usageOption = {
        title: {
          text: '2025年上半年各血型用血量走势',
          left: 'center',
          textStyle: {
            fontSize: 14
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['A型', 'B型', 'O型', 'AB型'],
          bottom: 0
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '60px',
          top: '70px',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: bloodSupplyData.value.monthlyUsage.map(item => item.month)
        },
        yAxis: {
          type: 'value',
          name: '用血量(袋)'
        },
        series: [
          {
            name: 'A型',
            type: 'line',
            data: bloodSupplyData.value.monthlyUsage.map(item => item.A),
            itemStyle: {
              color: bloodTypeColors['A型']
            }
          },
          {
            name: 'B型',
            type: 'line',
            data: bloodSupplyData.value.monthlyUsage.map(item => item.B),
            itemStyle: {
              color: bloodTypeColors['B型']
            }
          },
          {
            name: 'O型',
            type: 'line',
            data: bloodSupplyData.value.monthlyUsage.map(item => item.O),
            itemStyle: {
              color: bloodTypeColors['O型']
            }
          },
          {
            name: 'AB型',
            type: 'line',
            data: bloodSupplyData.value.monthlyUsage.map(item => item.AB),
            itemStyle: {
              color: bloodTypeColors['AB型']
            }
          }
        ]
      }
      usageChart.setOption(usageOption)
    }
  }

  // 在下一个UI更新周期初始化图表
  setTimeout(() => {
    setupCharts()
  }, 300)
}

// 窗口大小变化时调整图表大小
const resizeCharts = () => {
  if (rareBloodChart) rareBloodChart.resize()
  if (commonBloodChart) commonBloodChart.resize()
  if (usageChart) usageChart.resize()
}

// 生命周期钩子
onLoad(() => {
  uni.getStorage({
    key: 'userIdentity',
    success: (res) => {
      identitySelected.value = res.data.Identity
      Token.value = res.data.token
      console.log(res.data)  
      console.log(identitySelected.value)
      
      // 对于管理员身份，初始化ECharts
      if (identitySelected.value === '管理员') {
        // 需要确保DOM已经渲染
        setTimeout(() => {
          initECharts()
        }, 500)
      }
    },
    fail: () => {
      console.error('获取数据失败')
    }
  })
  
  // 监听窗口大小变化
  uni.onWindowResize(() => {
    resizeCharts()
  })
})

// 页面显示时检查是否需要初始化图表
onShow(() => {
  if (identitySelected.value === '管理员') {
    setTimeout(() => {
      initECharts()
    }, 500)
  }
})
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
        
        <!-- 非管理员显示今日科普 -->
        <view class="section" v-if="identitySelected !== '管理员'">
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
              <view class="qa-item" @tap="showAnswerDialog" :data-index="index">
                <view class="question">
                  <image
                    class="rankingIcon"
                    mode="scaleToFill"
                    :src="`https://blood-station-1327665268.cos.ap-guangzhou.myqcloud.com/hoticon${index+1}.png`"
                  />
                  <text>{{ item.question }}</text>
                  <text class="hotText">热</text>
                </view>
              </view>
            </template>
          </view>
        </view>
        
        <!-- 管理员显示血库数据可视化部分 -->
        <view v-if="identitySelected === '管理员'" class="charts-container">
          <!-- 稀有血型库存图表 -->
          <view class="chart-box">
            <view class="chart-title">稀有血型库存统计</view>
            <view id="rare-blood-chart" class="chart"></view>
          </view>
          
          <!-- 常规血型库存图表
          <view class="chart-box">
            <view class="chart-title">常规血型库存统计</view>
            <view id="common-blood-chart" class="chart"></view>
          </view> -->
          
          <!-- 月度用血量趋势图表 -->
          <view class="chart-box">
            <view class="chart-title">月度用血量趋势</view>
            <view id="usage-chart" class="chart usage-chart"></view>
          </view>
        </view>
    
        <!-- 非管理员显示献血活动发布栏 -->
        <view class="activity-container" v-if="identitySelected !== '管理员'">
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
                <text class="col-action" @tap="viewDonorDetail" :data-id="item.id">查看详情</text>
              </view>
            </template>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 页面 4：答案详情页面 -->
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
/* Base Styles */
<style >
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
    height: 100rpx;
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
    width: 90rpx;
    height: 90rpx;
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
    margin-top: 20rpx;
    position: relative;
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

.arrow {
    width: 16px;
    height: 16px;
}

/* Charts Container (Admin View) */
.charts-container {
    width: 94%;
    display: flex;
    flex-direction: column;
    gap: 20rpx;
}

.chart-box {
    width: 94%;
    background-color: white;
    border-radius: 12rpx;
    padding: 20rpx;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.chart-title {
    font-size: 14px;
    font-weight: bold;
    color: #333;
    margin-bottom: 15rpx;
    text-align: center;
}

.chart {
    width: 100%;
    height: 300rpx;
}

.usage-chart {
    height: 400rpx;
}
</style>
