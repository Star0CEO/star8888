<template>
  <div class="about-container">
    <!-- 顶部导航栏 -->
    <div class="top-nav">
      <div class="back" @click="$router.back()">
        <i class="van-icon van-icon-arrow-left"></i>
      </div>
      <h1>关于我们</h1>
      <div class="placeholder"></div>
    </div>
    
    <!-- 内容区域 -->
    <div class="content">
      <!-- 顶部蓝色背景区域 -->
      <div class="header-section">
        <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=9PG.VIP%20logo%20with%20purple%20and%20gold%20colors%20on%20a%20blue%20background&image_size=square" alt="9PG.VIP" class="logo">
      </div>
      
      <!-- 内容显示区域 -->
      <div class="content-section">
        <div class="content-body">
          <div v-if="loading" class="loading">加载中...</div>
          <div v-else-if="error" class="error">{{ error }}</div>
          <div v-else v-html="content"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'about',
  data() {
    return {
      content: '',
      loading: false,
      error: ''
    };
  },
  created() {
    // 页面加载时直接显示关于我们内容
    this.loadAboutContent();
  },
  methods: {
    loadAboutContent() {
      this.loading = true;
      this.error = '';
      
      // 硬编码内容，按照图片显示
      setTimeout(() => {
        this.content = `
          <div class="about-content">
            <p class="company-info">公司是在英国注册的合法博彩公司，取得由英国政府博彩委员会(Gambling Commission)所颁发的离岸博彩许可证，并受其监管。</p>
            
            <h3>公司的简介</h3>
            <p>About 公司</p>
            <p>公司一直孜孜不倦地追求技术创新。时至今日，我们通过个性化的用户体验、科技十足的前沿产品、强大的游戏运营能力、周到细致的客户服务品质、完善的技术保障和支持、安全高效的支付平台，创建了一个面向用户的综合性互动娱乐平台，在各方面均树立了良好的口碑，得到了业界和用户的一致认可。</p>
            
            <h3>支付方式</h3>
            <p>Payment</p>
            <p>公司力求提供最安全、最快速、最便捷的支付方式给每个会员。请访问我们的存取款页面查看更多的存款和提款方式。</p>
            
            <h3>客户服务</h3>
            <p>Customer Service</p>
            <p>满足客户的需求是我们不变的经营理念:</p>
            <ol>
              <li>顾客至上。</li>
              <li>诚信经营</li>
              <li>不断超出您的期待。</li>
            </ol>
            
            <h3>安全可信</h3>
            <p>Safe and Trustworthy</p>
            <p>公司财务系统受当地法规监管，符合业界规范,故在任何情况下,会员皆可信任。使用等同于金融级信息系统,具有高度可靠性及安全性。我们有稳定的财务背景,以及高度安全的信息系统,会员可完全信赖,您的权益可获得完整的保证。</p>
            
            <h3>我们的服务</h3>
            <p>Our Service</p>
            <p>公司将竭诚为您提供优质的服务。同时我们也欢迎您为我们的服务提出宝贵的意见，以便不断提升并完善我们的服务。如若你有任何疑问或建议，请及时联系我们的在线客服人员，亦可通过意见反馈功能，告诉我们您的看法，我们会在第一时间回复您。</p>
            
            <h3>理想和愿景</h3>
            <p>Our Vision</p>
            <p>公司致力于以科技推动博彩，成为引领亚洲博彩行业的先锋。我们的每一个功能点、交互、图文都仔细研磨，通过大数据测试，直至符合用户第一感知的操作习惯。</p>
          </div>
        `;
        this.loading = false;
      }, 500);
    }
  }
};
</script>

<style scoped>
.about-container {
  background-color: #f5f5f5;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  color: #333;
}

.top-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
  background-color: #054dc4;
  color: white;
  position: sticky;
  top: 0;
  z-index: 100;
}

.top-nav h1 {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: #fff;
}

.back {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  i {
    font-size: 20px;
    color: #fff;
    transition: all 0.3s ease;
  }
  
  &:hover i {
    transform: translateX(-2px);
  }
}

.placeholder {
  width: 44px;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.header-section {
  background: linear-gradient(135deg, #054dc4, #054dc4);
  padding: 60px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.header-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.5;
}

.logo {
  width: 100px;
  height: 100px;
  border-radius: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  z-index: 1;
}

.menu-list {
  background-color: #fff;
  margin: 20px 0;
  border-top: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
}

.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: #f5f5f5;
  }
  
  span {
    font-size: 16px;
    color: #333;
  }
  
  i {
    font-size: 14px;
    color: #999;
  }
}

.content-section {
  background-color: #fff;
  
  border-top: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
  min-height: 300px;
}

.content-header {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #f0f0f0;
  background-color: #f9f9f9;
}

.back-btn {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #054dc4;
  margin-right: 20px;
  
  i {
    margin-right: 5px;
  }
  
  &:hover {
    opacity: 0.8;
  }
}

.content-header h2 {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: #333;
}

.content-body {
  padding: 20px;
  line-height: 1.6;
  color: #333;
  min-height: 200px;
}

.loading,
.error {
  text-align: center;
  padding: 40px 0;
  color: #666;
}

.about-content {
  line-height: 1.8;
  color: #333;
  
  h3 {
    font-size: 18px;
    font-weight: 600;
    margin-top: 30px;
    margin-bottom: 15px;
    color: #054dc4;
  }
  
  h3:first-child {
    margin-top: 0;
  }
  
  p {
    margin-bottom: 15px;
  }
  
  ol {
    margin-left: 20px;
    margin-bottom: 15px;
  }
  
  li {
    margin-bottom: 8px;
  }
  
  .company-info {
    font-weight: 500;
    margin-bottom: 20px;
  }
}

@media (max-width: 768px) {
  .header-section {
    padding: 40px 0;
  }
  
  .logo {
    width: 80px;
    height: 80px;
  }
  
  .menu-item {
    padding: 12px 15px;
    
    span {
      font-size: 15px;
    }
  }
  
  .content-header {
    padding: 12px 15px;
    
    h2 {
      font-size: 15px;
    }
  }
  
  .content-body {
    padding: 15px;
  }
}
</style>